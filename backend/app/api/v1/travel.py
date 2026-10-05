from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.db.session import get_db
from app.schemas.travel import (
    PlaceSummary, PlaceDetail, RouteRequest, RouteDetail,
    NearbyResponse, GeocodeResult, CityAdaptationResponse,
    EnrichItineraryRequest, EnrichItineraryResponse
)
from app.services.travel.travel_service import travel_data_service

router = APIRouter(prefix="/travel", tags=["Travel Data & Maps Layer"])

@router.get("/places/search", response_model=List[PlaceSummary])
async def search_places(
    q: Optional[str] = Query(None, description="Search term in name or description"),
    category: Optional[str] = Query(None, description="attraction, museum, restaurant, cafe, shopping, entertainment, pharmacy, hospital, atm, transport, tourist_info"),
    city: Optional[str] = Query(None, description="City filter (e.g. Samarkand, Paris, Tokyo)"),
    lat: Optional[float] = Query(None, ge=-90.0, le=90.0, description="Center latitude"),
    lng: Optional[float] = Query(None, ge=-180.0, le=180.0, description="Center longitude"),
    radius: int = Query(15000, ge=100, le=50000, description="Search radius in meters"),
    limit: int = Query(20, ge=1, le=50),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """
    Search verified places across real categories.
    Avoids loading huge datasets via bounds, radius, and pagination.
    """
    try:
        return await travel_data_service.search_places(
            query=q,
            category=category,
            city=city,
            lat=lat,
            lng=lng,
            radius_meters=radius,
            limit=limit,
            offset=offset,
            db=db
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to search places: {str(e)}"
        )

@router.get("/places/nearby", response_model=NearbyResponse)
async def get_nearby_places(
    lat: float = Query(..., ge=-90.0, le=90.0, description="Traveler latitude"),
    lng: float = Query(..., ge=-180.0, le=180.0, description="Traveler longitude"),
    radius: int = Query(1500, ge=100, le=20000, description="Radius in meters"),
    categories: Optional[List[str]] = Query(None, description="Filters (e.g. metro, cafe, pharmacy, museum, atm, restaurant)"),
    limit: int = Query(20, ge=1, le=50)
):
    """
    'You are here' Near Me endpoint.
    Retrieves nearest transit, cafes, pharmacies, museums, ATMs, and emergency services.
    PRIVACY: Coordinates are ephemeral and NEVER stored.
    """
    try:
        return await travel_data_service.get_nearby_places(
            latitude=lat,
            longitude=lng,
            radius_meters=radius,
            categories=categories,
            limit=limit
        )
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch nearby places: {str(e)}"
        )

@router.get("/places/{place_id}", response_model=PlaceDetail)
async def get_place_detail(
    place_id: str,
    user_lat: Optional[float] = Query(None, ge=-90.0, le=90.0),
    user_lng: Optional[float] = Query(None, ge=-180.0, le=180.0),
    db: AsyncSession = Depends(get_db)
):
    """
    Retrieves full place detail with verified coordinates, opening status, phone, website,
    and distance from traveler. Does not fabricate missing fields.
    """
    detail = await travel_data_service.get_place_detail(
        place_id=place_id,
        user_lat=user_lat,
        user_lng=user_lng,
        db=db
    )
    if not detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Place '{place_id}' not found."
        )
    return detail

@router.post("/routes", response_model=RouteDetail)
async def calculate_travel_route(req: RouteRequest):
    """
    Point A -> Point B route calculation.
    Supports walking, transit, driving/taxi with distance, duration, polyline,
    and realistic cost estimation. Does NOT invent fictional transit lines.
    """
    try:
        return await travel_data_service.calculate_route(
            origin_lat=req.origin_lat,
            origin_lng=req.origin_lng,
            dest_lat=req.dest_lat,
            dest_lng=req.dest_lng,
            mode=req.mode,
            city=req.city
        )
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Route calculation failed: {str(e)}"
        )

@router.get("/geocode", response_model=GeocodeResult)
async def geocode_address(
    address: str = Query(..., min_length=2, description="Address or city name to geocode")
):
    """
    Resolves address or destination to verified latitude, longitude, and IANA timezone.
    """
    res = await travel_data_service.geocode(address)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Could not geocode address: '{address}'"
        )
    return res

@router.get("/city-categories", response_model=CityAdaptationResponse)
async def get_city_categories(
    city: Optional[str] = Query(None, description="City name (e.g. Paris, Samarkand, Tokyo)"),
    lat: Optional[float] = Query(None, ge=-90.0, le=90.0),
    lng: Optional[float] = Query(None, ge=-180.0, le=180.0)
):
    """
    City Adaptation endpoint.
    Adapts universal category taxonomy to local city context (e.g. Metro/RER in Paris vs Yandex Taxi/Tram in Samarkand).
    """
    return travel_data_service.get_city_adaptation(city_or_location=city, lat=lat, lng=lng)

@router.post("/enrich-itinerary", response_model=EnrichItineraryResponse)
async def enrich_ai_itinerary(
    req: EnrichItineraryRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    AI Integration Interface.
    Grounds AI-generated trip plans in verified factual travel data.
    Enforces that travel services provide factual coordinates, real point-to-point distances,
    travel times, and local-timezone opening hours without letting the LLM invent facts.
    """
    try:
        return await travel_data_service.enrich_itinerary_with_travel_data(
            itinerary_data=req.itinerary,
            destination_hint=req.destination,
            db=db
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to enrich itinerary with travel data: {str(e)}"
        )
