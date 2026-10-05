from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.db.session import get_db
from app.api.deps import get_current_user_optional
from app.models.user import User
from app.schemas.ai import (
    TripClarifyRequest, TripClarifyResponse,
    TripStrategiesRequest, TripStrategiesResponse,
    TripPlanRequest, StructuredItinerary,
    TripAdaptationRequest, TripAdaptationResponse,
    LocationAwareQueryRequest, LocationAwareQueryResponse
)
from app.services.ai.travel_planner import TravelPlannerService

router = APIRouter(prefix="/ai", tags=["TripMind AI Travel Engine"])
travel_planner = TravelPlannerService()

@router.post("/clarify", response_model=TripClarifyResponse)
async def clarify_trip_preferences(req: TripClarifyRequest):
    """
    Step 1: Smart Clarification Questions.
    Synthesizes 1 to 3 short, destination-tailored multiple choice tradeoff questions.
    """
    try:
        return await travel_planner.clarify_trip_preferences(req)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"AI clarification failed: {str(e)}")

@router.post("/strategies", response_model=TripStrategiesResponse)
async def generate_trip_strategies(req: TripStrategiesRequest):
    """
    Step 2: Tri-Tier Strategy Generation.
    Outputs 2 to 3 distinct trip approaches (Local Explorer, Balanced, Relaxed Premium)
    with explicit tradeoffs and budget ranges.
    """
    try:
        return await travel_planner.generate_strategies(req)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"AI strategies generation failed: {str(e)}")

@router.post("/plan", response_model=StructuredItinerary)
async def generate_structured_itinerary(
    req: TripPlanRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Step 3: Structured Itinerary Synthesis.
    Generates a full day-by-day plan with verified database grounding,
    opening hours validation, and deterministic geo-routing.
    """
    try:
        return await travel_planner.generate_itinerary(req, db=db)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"AI itinerary generation failed: {str(e)}")

@router.post("/adapt", response_model=TripAdaptationResponse)
async def adapt_itinerary(
    req: TripAdaptationRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    In-Trip Real-Time Schedule Adaptation.
    Handles on-the-ground pivots ('I'm tired', 'It's raining', '$40 left today', 'Move closer')
    mutating active day slots without wiping future bookings.
    """
    try:
        return await travel_planner.adapt_itinerary(req, db=db)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"AI adaptation failed: {str(e)}")

@router.post("/location-query", response_model=LocationAwareQueryResponse)
async def location_aware_query(
    req: LocationAwareQueryRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Location-Aware AI Copilot.
    Answers real-time questions ('Cheap food near me', 'How do I use the metro', 'Is this open today')
    stating limitations clearly if live data or GPS is missing.
    """
    try:
        return await travel_planner.location_aware_query(req, db=db)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Location query failed: {str(e)}")
