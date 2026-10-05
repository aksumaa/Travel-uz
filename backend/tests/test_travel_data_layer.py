import pytest
from datetime import datetime, timezone
from zoneinfo import ZoneInfo
from httpx import AsyncClient, ASGITransport

from app.main import app
from app.services.travel.opening_hours import evaluate_opening_hours, resolve_timezone
from app.services.travel.routing import calculate_route, haversine_distance
from app.services.travel.city_adaptation import get_city_adaptation
from app.services.travel.google_maps_provider import travel_cache, GoogleMapsProvider
from app.services.travel.ai_grounding import enrich_itinerary_with_travel_data

@pytest.mark.asyncio
async def test_timezone_resolution():
    """Verify timezones resolve accurately from city or coordinates, not server UTC."""
    tz_samarkand = resolve_timezone(city="Samarkand")
    assert str(tz_samarkand) == "Asia/Samarkand"

    tz_paris = resolve_timezone(city="Paris")
    assert str(tz_paris) == "Europe/Paris"

    tz_coords = resolve_timezone(lat=48.8584, lng=2.2945)
    assert str(tz_coords) == "Europe/Paris"

@pytest.mark.asyncio
async def test_opening_hours_evaluation_local_time():
    """Verify opening hours are evaluated against local destination time, not UTC."""
    # Test during daytime: 12:00 in Paris
    dt_paris_noon = datetime(2026, 10, 5, 12, 0, tzinfo=ZoneInfo("Europe/Paris"))
    res_open = evaluate_opening_hours("09:00 - 18:00", timezone_name="Europe/Paris", reference_dt=dt_paris_noon)
    assert res_open.has_reliable_hours is True
    assert res_open.is_open_now is True
    assert res_open.status == "open"
    assert res_open.status_label == "Open now"
    assert res_open.local_time == "12:00"

    # Test during evening: 21:00 in Paris
    dt_paris_night = datetime(2026, 10, 5, 21, 0, tzinfo=ZoneInfo("Europe/Paris"))
    res_closed = evaluate_opening_hours("09:00 - 18:00", timezone_name="Europe/Paris", reference_dt=dt_paris_night)
    assert res_closed.has_reliable_hours is True
    assert res_closed.is_open_now is False
    assert res_closed.status == "closed"
    assert res_closed.status_label == "Closed"

    # Test 24/7
    res_247 = evaluate_opening_hours("24/7", timezone_name="Asia/Samarkand")
    assert res_247.is_open_now is True
    assert "24/7" in res_247.status_label

    # Test missing / unverified hours (MUST NOT FABRICATE)
    res_unknown = evaluate_opening_hours(None)
    assert res_unknown.has_reliable_hours is False
    assert res_unknown.is_open_now is None
    assert res_unknown.status == "unknown"
    assert res_unknown.status_label == "Hours not verified"

@pytest.mark.asyncio
async def test_routing_walking_and_driving():
    """Verify Point A -> Point B routing metrics (distance, duration, cost)."""
    # Registan (39.6548, 66.9757) to Gur-e-Amir (39.6486, 66.9689)
    route_walk = await calculate_route(
        origin_lat=39.6548, origin_lng=66.9757,
        dest_lat=39.6486, dest_lng=66.9689,
        mode="walking", city="Samarkand"
    )
    assert route_walk.transport_mode == "walking"
    assert route_walk.distance_meters > 500
    assert route_walk.duration_seconds > 0
    assert len(route_walk.polyline_points) >= 2
    assert route_walk.estimated_cost == 0.0

    route_drive = await calculate_route(
        origin_lat=39.6548, origin_lng=66.9757,
        dest_lat=39.6486, dest_lng=66.9689,
        mode="driving", city="Samarkand"
    )
    assert route_drive.transport_mode == "driving"
    assert route_drive.estimated_cost is not None
    assert route_drive.estimated_cost > 0

@pytest.mark.asyncio
async def test_transit_routing_preserves_real_lines_or_flags_unverified():
    """If transit routing is requested without verified transit lines, do NOT invent transit lines."""
    # Test unverified global coordinate
    route_unknown_transit = await calculate_route(
        origin_lat=10.0, origin_lng=20.0,
        dest_lat=10.05, dest_lng=20.05,
        mode="transit", city="RemoteDesert"
    )
    assert route_unknown_transit.transit_available is False
    assert route_unknown_transit.notes is not None

    # Test verified transit city (Paris)
    route_paris_transit = await calculate_route(
        origin_lat=48.8606, origin_lng=2.3376,
        dest_lat=48.8584, dest_lng=2.2945,
        mode="transit", city="Paris"
    )
    assert route_paris_transit.transit_available is True
    assert any("Metro" in s.instruction or "RATP" in s.instruction for s in route_paris_transit.steps)

@pytest.mark.asyncio
async def test_invalid_coordinates_raise_error():
    """Validation must reject out-of-bound latitude/longitude."""
    with pytest.raises(ValueError):
        await calculate_route(origin_lat=95.0, origin_lng=66.0, dest_lat=39.0, dest_lng=66.0)

    with pytest.raises(ValueError):
        await calculate_route(origin_lat=39.0, origin_lng=200.0, dest_lat=39.0, dest_lng=66.0)

@pytest.mark.asyncio
async def test_city_adaptation():
    """City adaptation provides localized transit and categories."""
    sam_adapt = get_city_adaptation(city_or_location="Samarkand")
    assert sam_adapt.city_name == "Samarkand"
    assert sam_adapt.currency == "UZS"
    assert any(m["id"] == "tram" for m in sam_adapt.transit_modes)
    assert any("Madrasah" in c["localized_title"] for c in sam_adapt.categories if c["category"] == "attraction")

    paris_adapt = get_city_adaptation(city_or_location="Paris")
    assert paris_adapt.city_name == "Paris"
    assert paris_adapt.currency == "EUR"
    assert any(m["id"] == "metro_rer" for m in paris_adapt.transit_modes)
    assert any("Bistro" in c["localized_title"] for c in paris_adapt.categories if c["category"] == "restaurant")

@pytest.mark.asyncio
async def test_travel_caching():
    """In-memory cache accelerates repeated place queries."""
    provider = GoogleMapsProvider()
    travel_cache.clear()

    # Query 1 (cache miss -> set)
    res1 = await provider.search_places(city="Samarkand", category="attraction", limit=5)
    assert len(res1) > 0

    # Query 2 (cache hit)
    res2 = await provider.search_places(city="Samarkand", category="attraction", limit=5)
    assert len(res2) == len(res1)
    assert res2[0].place_id == res1[0].place_id

@pytest.mark.asyncio
async def test_ai_factual_travel_enrichment():
    """
    Exposes structured factual travel data to AI layer.
    LLM must not invent coordinates, distance, route, or opening hours.
    """
    raw_ai_itinerary = {
        "title": "3 Days in Samarkand",
        "destination": "Samarkand",
        "days": [
            {
                "day_number": 1,
                "activities": [
                    {
                        "place_name": "Registan Square",
                        "time_slot": "morning",
                        "latitude": None,
                        "longitude": None
                    },
                    {
                        "place_name": "Gur-e-Amir Mausoleum",
                        "time_slot": "afternoon",
                        "latitude": None,
                        "longitude": None
                    }
                ]
            }
        ]
    }

    enriched = await enrich_itinerary_with_travel_data(raw_ai_itinerary, destination_hint="Samarkand")
    assert enriched.is_valid is True
    day1_acts = enriched.enriched_itinerary["days"][0]["activities"]

    # Factual coordinates injected
    assert day1_acts[0]["latitude"] == 39.6548
    assert day1_acts[0]["longitude"] == 66.9757
    assert day1_acts[0]["is_verified"] is True
    assert day1_acts[0]["opening_hours_verified"] is True

    # Real point-to-point route computed between stops
    assert "next_leg" in day1_acts[0]
    next_leg = day1_acts[0]["next_leg"]
    assert next_leg["destination_name"] == "Gur-e-Amir Mausoleum"
    assert next_leg["distance_meters"] > 0
    assert next_leg["duration_seconds"] > 0

@pytest.mark.asyncio
async def test_api_endpoints():
    """Verify HTTP API endpoints for search, nearby, place detail, routes, and geocode."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Search
        s_resp = await client.get("/api/v1/travel/places/search?city=Samarkand&category=attraction")
        assert s_resp.status_code == 200
        places = s_resp.json()
        assert len(places) > 0
        first_id = places[0]["place_id"]

        # 2. Detail
        d_resp = await client.get(f"/api/v1/travel/places/{first_id}")
        assert d_resp.status_code == 200
        detail = d_resp.json()
        assert detail["place_id"] == first_id
        assert "opening_status" in detail

        # 3. Missing place
        m_resp = await client.get("/api/v1/travel/places/nonexistent_place_xyz")
        assert m_resp.status_code == 404

        # 4. Nearby ('Near Me')
        n_resp = await client.get("/api/v1/travel/places/nearby?lat=39.6548&lng=66.9757&radius=3000")
        assert n_resp.status_code == 200
        nearby_data = n_resp.json()
        assert "places" in nearby_data
        assert "disclaimer" in nearby_data

        # 5. Routes
        r_resp = await client.post("/api/v1/travel/routes", json={
            "origin_lat": 39.6548, "origin_lng": 66.9757,
            "dest_lat": 39.6486, "dest_lng": 66.9689,
            "mode": "walking", "city": "Samarkand"
        })
        assert r_resp.status_code == 200
        route_data = r_resp.json()
        assert route_data["transport_mode"] == "walking"
        assert route_data["distance_meters"] > 0

        # 6. City adaptation
        c_resp = await client.get("/api/v1/travel/city-categories?city=Paris")
        assert c_resp.status_code == 200
        assert c_resp.json()["currency"] == "EUR"
