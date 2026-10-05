import logging
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.destination import Destination, Place
from app.schemas.travel import EnrichItineraryResponse
from app.services.travel.google_maps_provider import google_maps_provider, VERIFIED_GLOBAL_PLACES
from app.services.travel.routing import calculate_route, haversine_distance
from app.services.travel.opening_hours import evaluate_opening_hours, resolve_timezone

logger = logging.getLogger(__name__)

async def enrich_itinerary_with_travel_data(
    itinerary_data: Dict[str, Any],
    destination_hint: Optional[str] = None,
    db: Optional[AsyncSession] = None
) -> EnrichItineraryResponse:
    """
    Enforces the core rule:
    AI should recommend. Travel services should provide factual data.
    Do not let the LLM invent coordinates, distance, route, opening hours, or ratings.

    Validates and overrides/enriches AI output with verified ground truth:
    1. Replaces synthetic or missing coordinates with verified database/catalog POIs.
    2. Calculates real, factual point-to-point routes, distances, and travel times.
    3. Evaluates real opening hours and timezone-aware open/closed status.
    4. Detects scheduling collisions (e.g. visiting a museum after closing).
    """
    warnings: List[str] = []
    stats = {
        "total_activities": 0,
        "geocoded_verified": 0,
        "routes_computed": 0,
        "opening_hours_verified": 0
    }

    dest_name = (destination_hint or itinerary_data.get("destination") or itinerary_data.get("title", "")).strip()

    # 1. Fetch DB verified places if db session provided
    db_places: List[Place] = []
    if db and dest_name:
        try:
            q = select(Place).join(Destination).where(
                Destination.name.ilike(f"%{dest_name}%") | Destination.slug.ilike(f"%{dest_name.lower()}%")
            )
            res = await db.execute(q)
            db_places = res.scalars().all()
        except Exception as e:
            logger.warning(f"Error fetching DB places for grounding: {e}")

    # Build lookup map: name lower -> place data
    name_lookup: Dict[str, Dict[str, Any]] = {}
    for p in VERIFIED_GLOBAL_PLACES:
        name_lookup[p["name"].lower()] = p

    for db_p in db_places:
        name_lookup[db_p.name.lower()] = {
            "place_id": f"db_{db_p.id}",
            "name": db_p.name,
            "category": "attraction",
            "latitude": db_p.latitude,
            "longitude": db_p.longitude,
            "opening_hours": db_p.opening_hours,
            "estimated_cost": db_p.entry_fee,
            "currency": db_p.currency,
            "description": db_p.description,
            "is_verified": True
        }

    # Clone itinerary structure to enrich
    enriched_itinerary = dict(itinerary_data)
    days = enriched_itinerary.get("days", [])

    for day in days:
        activities = day.get("activities", [])
        if not activities:
            # Handle legacy format where day had morning, afternoon, evening dicts
            legacy_slots = []
            for slot_key in ["morning", "afternoon", "evening"]:
                slot = day.get(slot_key)
                if isinstance(slot, dict) and (slot.get("activity") or slot.get("restaurant")):
                    title = slot.get("activity") or slot.get("restaurant")
                    legacy_slots.append({
                        "place_name": title,
                        "time_slot": slot_key,
                        "estimated_cost": slot.get("cost", 0.0),
                        "category": "restaurant" if slot_key == "evening" else "attraction",
                        "location": slot.get("location") or slot.get("address")
                    })
            if legacy_slots:
                activities = legacy_slots
                day["activities"] = activities

        prev_activity: Optional[Dict[str, Any]] = None

        for act in activities:
            stats["total_activities"] += 1
            raw_title = (act.get("place_name") or act.get("title") or act.get("activity") or "").strip()
            loc_str = act.get("location") or act.get("address")

            matched_data = None
            for key, val in name_lookup.items():
                if key in raw_title.lower() or raw_title.lower() in key:
                    matched_data = val
                    break

            # If not in catalog, try geocoding if query looks like a specific venue
            if not matched_data and loc_str:
                geo_res = await google_maps_provider.geocode(f"{raw_title}, {loc_str}")
                if geo_res:
                    matched_data = {
                        "place_id": f"geo_{geo_res.latitude}_{geo_res.longitude}",
                        "name": raw_title,
                        "latitude": geo_res.latitude,
                        "longitude": geo_res.longitude,
                        "address": geo_res.formatted_address,
                        "is_verified": True
                    }

            if matched_data:
                # Factual override
                act["latitude"] = matched_data["latitude"]
                act["longitude"] = matched_data["longitude"]
                act["is_verified"] = True
                stats["geocoded_verified"] += 1

                if matched_data.get("opening_hours"):
                    act["opening_hours"] = matched_data["opening_hours"]
                    op_eval = evaluate_opening_hours(
                        matched_data["opening_hours"],
                        lat=matched_data["latitude"],
                        lng=matched_data["longitude"]
                    )
                    act["opening_status"] = op_eval.model_dump()
                    act["opening_hours_verified"] = True
                    stats["opening_hours_verified"] += 1

                    # Check collision with evening
                    slot = act.get("time_slot", "").lower()
                    if slot in ("evening", "night") and "18:00" in matched_data["opening_hours"]:
                        warn_msg = f"Schedule Alert: '{raw_title}' typically closes at 18:00, but is scheduled for {slot}."
                        warnings.append(warn_msg)
                        act["schedule_warning"] = warn_msg

                if matched_data.get("estimated_cost") is not None:
                    act["estimated_cost"] = matched_data["estimated_cost"]
                if matched_data.get("address"):
                    act["address"] = matched_data["address"]
            else:
                act["is_verified"] = False
                act["opening_hours_verified"] = False
                warnings.append(f"Unverified POI: Coordinates and operating hours for '{raw_title}' could not be verified by travel services.")

            # Route calculation from previous activity in the same day
            if prev_activity and prev_activity.get("latitude") and prev_activity.get("longitude") and act.get("latitude") and act.get("longitude"):
                mode = act.get("transport_method", "walking")
                route = await calculate_route(
                    origin_lat=prev_activity["latitude"],
                    origin_lng=prev_activity["longitude"],
                    dest_lat=act["latitude"],
                    dest_lng=act["longitude"],
                    mode=mode,
                    city=dest_name
                )
                prev_activity["next_leg"] = {
                    "destination_name": raw_title,
                    "transport_mode": route.transport_mode,
                    "distance_meters": route.distance_meters,
                    "distance_formatted": route.distance_formatted,
                    "duration_seconds": route.duration_seconds,
                    "duration_formatted": route.duration_formatted,
                    "estimated_cost": route.estimated_cost,
                    "cost_formatted": route.cost_formatted,
                    "transit_available": route.transit_available,
                    "notes": route.notes,
                    "polyline_points": route.polyline_points[:10]  # compact sample
                }
                prev_activity["travel_time_minutes"] = max(1, round(route.duration_seconds / 60))
                prev_activity["transport_details"] = f"{route.duration_formatted} ({route.distance_formatted})"
                stats["routes_computed"] += 1

            prev_activity = act

    return EnrichItineraryResponse(
        is_valid=True,
        enriched_itinerary=enriched_itinerary,
        warnings=warnings,
        geocoding_stats=stats
    )
