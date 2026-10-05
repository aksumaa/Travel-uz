import logging
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.destination import Destination, Place
from app.schemas.travel import (
    PlaceSummary, PlaceDetail, RouteDetail, NearbyResponse,
    GeocodeResult, CityAdaptationResponse, EnrichItineraryResponse
)
from app.services.travel.google_maps_provider import google_maps_provider, travel_cache
from app.services.travel.routing import calculate_route as do_calculate_route
from app.services.travel.city_adaptation import get_city_adaptation as do_get_city_adaptation
from app.services.travel.opening_hours import evaluate_opening_hours
from app.services.travel.ai_grounding import enrich_itinerary_with_travel_data as do_enrich_itinerary

logger = logging.getLogger(__name__)

class TravelDataService:
    """
    TripMind Master Travel Data & Maps Service.
    Serves as the factual authority for coordinates, distances, opening hours,
    point-to-point routes, city adaptation, and Nearby discovery.
    """

    async def search_places(
        self,
        query: Optional[str] = None,
        category: Optional[str] = None,
        city: Optional[str] = None,
        lat: Optional[float] = None,
        lng: Optional[float] = None,
        radius_meters: int = 15000,
        limit: int = 20,
        offset: int = 0,
        db: Optional[AsyncSession] = None
    ) -> List[PlaceSummary]:
        # First check google_maps_provider / curated catalog
        results = await google_maps_provider.search_places(
            query=query, category=category, city=city,
            lat=lat, lng=lng, radius_meters=radius_meters,
            limit=limit, offset=offset
        )

        # Supplement with DB places if available and results are sparse
        if len(results) < limit and db:
            try:
                q = select(Place)
                if query:
                    q = q.where(Place.name.ilike(f"%{query.strip()}%") | Place.description.ilike(f"%{query.strip()}%"))
                res = await db.execute(q.limit(limit))
                db_places = res.scalars().all()
                existing_ids = {r.place_id for r in results}
                for db_p in db_places:
                    p_id = f"db_{db_p.id}"
                    if p_id not in existing_ids:
                        op_status = evaluate_opening_hours(
                            db_p.opening_hours, lat=db_p.latitude, lng=db_p.longitude
                        )
                        results.append(PlaceSummary(
                            place_id=p_id,
                            name=db_p.name,
                            category="attraction",
                            localized_category="Attraction",
                            latitude=db_p.latitude,
                            longitude=db_p.longitude,
                            image_url=db_p.image_url,
                            is_verified=True,
                            opening_status=op_status
                        ))
            except Exception as e:
                logger.warning(f"Error querying DB places: {e}")

        return results[:limit]

    async def get_nearby_places(
        self,
        latitude: float,
        longitude: float,
        radius_meters: int = 1500,
        categories: Optional[List[str]] = None,
        limit: int = 20
    ) -> NearbyResponse:
        """
        'You are here' Near Me search.
        Privacy Guarantee: Coordinates are processed in-memory and NEVER persisted to disk/db.
        """
        if not (-90.0 <= latitude <= 90.0):
            raise ValueError(f"Invalid latitude: {latitude}")
        if not (-180.0 <= longitude <= 180.0):
            raise ValueError(f"Invalid longitude: {longitude}")

        all_nearby: List[PlaceSummary] = []
        filter_cats = set(categories) if categories else None

        # Search across categories or specified ones
        cats_to_query = categories if categories else [
            "metro", "cafe", "pharmacy", "museum", "atm", "restaurant", "hospital", "transport"
        ]

        # Use 1500m default or provided radius (capped at 20km)
        clamped_radius = min(max(radius_meters, 100), 20000)

        for cat in cats_to_query:
            # Map 'metro' to transport category if needed
            mapped_cat = "transport" if cat in ("metro", "subway") else cat
            found = await google_maps_provider.search_places(
                category=mapped_cat,
                lat=latitude,
                lng=longitude,
                radius_meters=clamped_radius,
                limit=limit
            )
            for p in found:
                if filter_cats and p.category not in filter_cats and cat not in filter_cats:
                    continue
                all_nearby.append(p)

        # De-duplicate by place_id
        seen_ids = set()
        deduped = []
        for p in all_nearby:
            if p.place_id not in seen_ids:
                seen_ids.add(p.place_id)
                deduped.append(p)

        # Sort by distance
        deduped.sort(key=lambda x: (x.distance_meters if x.distance_meters is not None else float("inf")))

        return NearbyResponse(
            center={"lat": latitude, "lng": longitude},
            radius_meters=clamped_radius,
            total_found=len(deduped[:limit]),
            places=deduped[:limit],
            disclaimer="Traveler GPS coordinates are processed ephemerally in-memory and never stored on servers."
        )

    async def get_place_detail(
        self,
        place_id: str,
        user_lat: Optional[float] = None,
        user_lng: Optional[float] = None,
        db: Optional[AsyncSession] = None
    ) -> Optional[PlaceDetail]:
        # Check provider / catalog
        detail = await google_maps_provider.get_place_detail(place_id, user_lat, user_lng)
        if detail:
            return detail

        # Check DB by ID if place_id is db_{id} or numeric
        if db:
            raw_id = place_id.replace("db_", "")
            if raw_id.isdigit():
                try:
                    res = await db.execute(select(Place).where(Place.id == int(raw_id)))
                    p = res.scalars().first()
                    if p:
                        op_status = evaluate_opening_hours(p.opening_hours, lat=p.latitude, lng=p.longitude)
                        return PlaceDetail(
                            place_id=f"db_{p.id}",
                            name=p.name,
                            category="attraction",
                            localized_category="Attraction",
                            description=p.description,
                            latitude=p.latitude,
                            longitude=p.longitude,
                            image_url=p.image_url,
                            photos=[p.image_url] if p.image_url else [],
                            opening_hours=p.opening_hours,
                            estimated_cost=p.entry_fee,
                            currency=p.currency,
                            is_verified=True,
                            opening_status=op_status
                        )
                except Exception as e:
                    logger.warning(f"Error querying DB place by ID: {e}")

        return None

    async def calculate_route(
        self,
        origin_lat: float,
        origin_lng: float,
        dest_lat: float,
        dest_lng: float,
        mode: str = "walking",
        city: Optional[str] = None
    ) -> RouteDetail:
        return await do_calculate_route(
            origin_lat=origin_lat,
            origin_lng=origin_lng,
            dest_lat=dest_lat,
            dest_lng=dest_lng,
            mode=mode,
            city=city
        )

    async def geocode(self, address: str) -> Optional[GeocodeResult]:
        return await google_maps_provider.geocode(address)

    def get_city_adaptation(
        self,
        city_or_location: Optional[str] = None,
        lat: Optional[float] = None,
        lng: Optional[float] = None
    ) -> CityAdaptationResponse:
        return do_get_city_adaptation(city_or_location=city_or_location, lat=lat, lng=lng)

    async def enrich_itinerary_with_travel_data(
        self,
        itinerary_data: Dict[str, Any],
        destination_hint: Optional[str] = None,
        db: Optional[AsyncSession] = None
    ) -> EnrichItineraryResponse:
        return await do_enrich_itinerary(
            itinerary_data=itinerary_data,
            destination_hint=destination_hint,
            db=db
        )

travel_data_service = TravelDataService()
