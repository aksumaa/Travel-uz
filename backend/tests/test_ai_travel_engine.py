import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.services.ai.geo_optimizer import (
    haversine_distance, estimate_travel_metrics, check_opening_hours_validity,
    optimize_activity_sequence
)
from app.services.ai.travel_planner import TravelPlannerService
from app.schemas.ai import (
    TripClarifyRequest, TripStrategiesRequest, TripPlanRequest,
    TripAdaptationRequest, LocationAwareQueryRequest
)

planner_service = TravelPlannerService()

# =========================================================================
# 1. VALID ITINERARY GENERATION TEST
# =========================================================================
@pytest.mark.asyncio
async def test_valid_itinerary():
    """Verify that a valid itinerary is structured, complete, with truthful pricing and pacing."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {
            "destination": "Istanbul",
            "duration_days": 3,
            "travelers": 2,
            "budget": 1200.0,
            "currency": "USD",
            "pace": "balanced",
            "comfort": "boutique",
            "interests": ["Culture", "Gastronomy", "Architecture"],
            "food_preferences": ["Street Food", "Traditional Lokantas"],
            "transport_preference": "walking_transit",
            "selected_strategy_id": "balanced"
        }
        res = await ac.post("/api/v1/ai/plan", json=payload)
        assert res.status_code == 200, f"Error: {res.text}"
        data = res.json()

        assert data["destination"] == "Istanbul"
        assert data["duration_days"] == 3
        assert len(data["days"]) == 3
        assert data["total_budget"] > 0
        assert data["budget_status"] in ("within_budget", "tight")

        # Verify daily structure
        day1 = data["days"][0]
        assert day1["day_number"] == 1
        assert len(day1["activities"]) >= 3

        # Verify required activity fields
        act = day1["activities"][0]
        assert "time_slot" in act
        assert "item_type" in act
        assert "place_name" in act
        assert "duration_hours" in act
        assert "estimated_cost" in act
        assert "travel_time_minutes" in act
        assert "transport_method" in act
        assert "reasoning" in act
        assert isinstance(act["is_verified"], bool)

        # Verify budget breakdown
        budget_summary = data["budget_summary"]
        for key in ["accommodation", "food", "transport", "attractions", "miscellaneous", "total"]:
            assert key in budget_summary
            assert budget_summary[key] >= 0

# =========================================================================
# 2. BUDGET CONSTRAINTS & INSUFFICIENT BUDGET TEST
# =========================================================================
@pytest.mark.asyncio
async def test_insufficient_budget():
    """Verify that the engine detects an unrealistically low budget and flags advice."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {
            "destination": "Paris",
            "duration_days": 5,
            "travelers": 3,
            "budget": 100.0,  # $20/day total for 3 people in Paris is insufficient
            "currency": "USD",
            "pace": "balanced",
            "selected_strategy_id": "local_explorer"
        }
        res = await ac.post("/api/v1/ai/plan", json=payload)
        assert res.status_code == 200
        data = res.json()

        assert data["budget_status"] == "exceeds_budget"
        assert data["budget_advice"] is not None
        assert "exceeds" in data["budget_advice"].lower() or "tight" in data["budget_advice"].lower()

@pytest.mark.asyncio
async def test_budget_constraints_validation():
    """Verify validation rejects budget <= 0."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {
            "destination": "Samarkand",
            "duration_days": 3,
            "travelers": 2,
            "budget": -50.0  # Invalid negative budget
        }
        res = await ac.post("/api/v1/ai/plan", json=payload)
        assert res.status_code == 422 or res.status_code == 400

# =========================================================================
# 3. PREFERENCE CHANGES TEST
# =========================================================================
@pytest.mark.asyncio
async def test_preference_changes():
    """Verify that different pace and dining preferences alter the resulting strategies."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Fast-paced street food query
        p1 = {
            "destination": "Samarkand",
            "duration_days": 2,
            "travelers": 1,
            "budget": 300.0,
            "pace": "fast-paced",
            "comfort": "backpacker",
            "interests": ["Bazaars", "Street Food"],
            "clarification_answers": {"q_pacing": "see_maximum", "q_dining": "street_food_cafes"}
        }
        res1 = await ac.post("/api/v1/ai/strategies", json=p1)
        assert res1.status_code == 200
        data1 = res1.json()
        strat_ids1 = [s["strategy_id"] for s in data1["strategies"]]
        assert "local_explorer" in strat_ids1
        local_strat = next(s for s in data1["strategies"] if s["strategy_id"] == "local_explorer")
        assert local_strat["estimated_budget"] <= p1["budget"]

        # Relaxed premium query
        p2 = {
            "destination": "Samarkand",
            "duration_days": 2,
            "travelers": 2,
            "budget": 2000.0,
            "pace": "leisurely",
            "comfort": "luxury",
            "interests": ["Fine Dining", "Wellness"],
            "clarification_answers": {"q_pacing": "slow_immersive", "q_dining": "premium_dining"}
        }
        res2 = await ac.post("/api/v1/ai/strategies", json=p2)
        assert res2.status_code == 200
        data2 = res2.json()
        prem_strat = next(s for s in data2["strategies"] if s["strategy_id"] == "relaxed_premium")
        assert "Private" in prem_strat["transit_style"] or "taxis" in prem_strat["transit_style"].lower()

# =========================================================================
# 4. ITINERARY MODIFICATION (REAL-TIME ADAPTATION) TEST
# =========================================================================
@pytest.mark.asyncio
async def test_itinerary_modification_fatigue():
    """Verify 'I'm tired' prompt removes walking exertion and adds low-stress relaxation."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {
            "current_day": 2,
            "current_slot": "afternoon",
            "prompt": "I'm exhausted and my legs hurt, reduce walking",
            "existing_itinerary": {"destination": "Istanbul"}
        }
        res = await ac.post("/api/v1/ai/adapt", json=payload)
        assert res.status_code == 200
        data = res.json()

        assert "fatigue" in data["diagnosis"].lower() or "tired" in data["diagnosis"].lower()
        mutation = data["mutation"]
        assert len(mutation["removed_activities"]) > 0
        assert len(mutation["added_activities"]) > 0
        assert mutation["walking_distance_saved_km"] > 0
        # Check added activities are relaxation or cafe or low exertion
        types = [a["item_type"] for a in mutation["added_activities"]]
        assert any(t in ("relaxation", "cafe") for t in types)

@pytest.mark.asyncio
async def test_itinerary_modification_rain():
    """Verify 'It's raining' prompt swaps outdoor walking for covered indoor venues."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {
            "current_day": 1,
            "current_slot": "afternoon",
            "prompt": "It's raining heavily outside",
            "existing_itinerary": {"destination": "Istanbul"}
        }
        res = await ac.post("/api/v1/ai/adapt", json=payload)
        assert res.status_code == 200
        data = res.json()

        assert "rain" in data["diagnosis"].lower() or "weather" in data["diagnosis"].lower()
        mutation = data["mutation"]
        assert len(mutation["added_activities"]) > 0
        names = [a["place_name"].lower() for a in mutation["added_activities"]]
        assert any("covered" in n or "museum" in n or "bazaar" in n for n in names)

@pytest.mark.asyncio
async def test_itinerary_modification_budget_limit():
    """Verify '$40 left today' prompt adjusts remaining dining to street food and free monuments."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {
            "current_day": 1,
            "current_slot": "afternoon",
            "prompt": "I only have $40 left today",
            "remaining_budget_today": 40.0,
            "existing_itinerary": {"destination": "Istanbul"}
        }
        res = await ac.post("/api/v1/ai/adapt", json=payload)
        assert res.status_code == 200
        data = res.json()

        mutation = data["mutation"]
        assert mutation["budget_delta"] < 0  # Cost decreased
        added_cost = sum(a["estimated_cost"] for a in mutation["added_activities"])
        assert added_cost <= 40.0

# =========================================================================
# 5. INVALID DESTINATION TEST
# =========================================================================
@pytest.mark.asyncio
async def test_invalid_destination():
    """Verify that an empty or single character destination is rejected."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        res = await ac.post("/api/v1/ai/clarify", json={"destination": ""})
        assert res.status_code == 400 or res.status_code == 422

        res2 = await ac.post("/api/v1/ai/plan", json={"destination": " ", "budget": 500.0})
        assert res2.status_code == 400 or res2.status_code == 422

# =========================================================================
# 6. MISSING TRAVEL DATA / UNCATALOGUED DESTINATION TEST
# =========================================================================
@pytest.mark.asyncio
async def test_missing_travel_data_handling():
    """Verify that uncatalogued destinations do not crash and clearly flag unverified data."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {
            "destination": "Bora Bora Lagoon Village",
            "duration_days": 2,
            "travelers": 2,
            "budget": 800.0,
            "currency": "USD"
        }
        res = await ac.post("/api/v1/ai/plan", json=payload)
        assert res.status_code == 200
        data = res.json()

        assert data["destination"] == "Bora Bora Lagoon Village"
        # Must flag unverified warnings rather than inventing verified facts
        assert len(data["unverified_data_warnings"]) > 0
        warning_text = " ".join(data["unverified_data_warnings"]).lower()
        assert "unverified" in warning_text or "estimated" in warning_text

# =========================================================================
# 7. OPENING HOURS VERIFICATION TEST
# =========================================================================
def test_opening_hours_validation():
    """Verify deterministic opening hours checker catches after-hours activities."""
    # Place closes at 17:00, user visiting in evening -> warning triggered
    is_valid, warn = check_opening_hours_validity("09:00 - 17:00", "evening")
    assert is_valid is False
    assert warn is not None
    assert "closes at 17:00" in warn

    # Place open 24/7 in evening -> completely valid
    is_valid_24, warn_24 = check_opening_hours_validity("24/7", "evening")
    assert is_valid_24 is True
    assert warn_24 is None

    # Place open 09:00 - 18:00 in morning -> completely valid
    is_valid_morn, warn_morn = check_opening_hours_validity("09:00 - 18:00", "morning")
    assert is_valid_morn is True
    assert warn_morn is None

# =========================================================================
# 8. DETERMINISTIC GEO-OPTIMIZER ROUTING TEST
# =========================================================================
def test_geo_optimizer_no_backtracking():
    """Verify nearest-neighbor sequencing reduces backtracking."""
    activities = [
        {"place_name": "Site A", "latitude": 39.6547, "longitude": 66.9758, "transport_method": "walking"},
        {"place_name": "Site C (Far)", "latitude": 39.7500, "longitude": 67.0500, "transport_method": "walking"},
        {"place_name": "Site B (Near A)", "latitude": 39.6582, "longitude": 66.9794, "transport_method": "walking"},
    ]
    optimized = optimize_activity_sequence(activities)
    names = [a["place_name"] for a in optimized]
    # Site B is within 500m of Site A; Site C is 12km away. Nearest neighbor MUST put B before C!
    assert names == ["Site A", "Site B (Near A)", "Site C (Far)"]
    assert optimized[0]["travel_time_minutes"] > 0
    assert "walk" in optimized[0]["transport_details"].lower()

# =========================================================================
# 9. LOCATION-AWARE ASSISTANT COPILOT TEST
# =========================================================================
@pytest.mark.asyncio
async def test_location_aware_copilot():
    """Verify on-the-ground questions receive practical, intent-aware guidance."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Transit query
        q1 = {"query": "How do I use the metro in Istanbul?"}
        res1 = await ac.post("/api/v1/ai/location-query", json=q1)
        assert res1.status_code == 200
        d1 = res1.json()
        assert d1["detected_intent"] == "transit_guidance"
        assert "istanbulkart" in d1["answer"].lower()

        # Cheap food query
        q2 = {"query": "Cheap Turkish food near me?", "destination": "Istanbul"}
        res2 = await ac.post("/api/v1/ai/location-query", json=q2)
        assert res2.status_code == 200
        d2 = res2.json()
        assert d2["detected_intent"] == "nearby_food"
        assert len(d2["recommendations"]) > 0

# =========================================================================
# 10. CLARIFICATION & STRATEGY ENDPOINTS TEST
# =========================================================================
@pytest.mark.asyncio
async def test_clarification_tradeoffs():
    """Verify clarification endpoint returns 1 to 3 distinct tradeoff questions with options."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        payload = {
            "destination": "Istanbul",
            "duration_days": 5,
            "travelers": 2,
            "budget": 400.0,
            "interests": ["Culture", "Food"]
        }
        res = await ac.post("/api/v1/ai/clarify", json=payload)
        assert res.status_code == 200
        data = res.json()

        assert data["destination"] == "Istanbul"
        assert 1 <= len(data["questions"]) <= 3
        q1 = data["questions"][0]
        assert len(q1["options"]) >= 2
        assert q1["default_option_id"] is not None

        # Verify cross-mounted /trips/clarify route also works
        res_trip = await ac.post("/api/v1/trips/clarify", json=payload)
        assert res_trip.status_code == 200
        assert res_trip.json()["destination"] == "Istanbul"
