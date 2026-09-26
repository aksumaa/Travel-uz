from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
import io

from app.db.session import get_db
from app.models.user import User
from app.models.agency import Agency
from app.models.itinerary import Itinerary
from app.schemas.itinerary import (
    TripGenerateRequest, ItineraryCreate, ItineraryUpdate, ItineraryOut, PublicItineraryOut
)
from app.api.deps import get_current_user, get_current_agency
from app.services.anthropic_service import generate_trip_itinerary
from app.services.pdf_service import generate_itinerary_pdf

router = APIRouter(prefix="/trips", tags=["Trips & Itineraries"])

@router.post("/generate", response_model=dict)
async def generate_trip(
    req: TripGenerateRequest,
    current_user: Optional[User] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Proxy to Anthropic server-side
    days = req.days or 3
    if req.start_date and req.end_date:
        try:
            from datetime import datetime
            d1 = datetime.strptime(req.start_date, "%Y-%m-%d")
            d2 = datetime.strptime(req.end_date, "%Y-%m-%d")
            diff = (d2 - d1).days + 1
            if diff > 0:
                days = diff
        except Exception:
            pass

    content_json = await generate_trip_itinerary(
        destination=req.destination,
        days=days,
        budget=req.budget or 1500.0,
        travelers=req.travelers or 2,
        style=req.style or "Adventure",
        language=req.language or "en"
    )

    agency_id = None
    if current_user:
        agency_res = await db.execute(select(Agency).where(Agency.owner_user_id == current_user.id))
        agency = agency_res.scalars().first()
        if agency:
            agency_id = agency.id

    # Auto-persist generated itinerary with unique share_token
    new_itinerary = Itinerary(
        agency_id=agency_id or req.agency_id,
        package_id=req.package_id,
        user_id=current_user.id if current_user else None,
        title=content_json.get("title", f"Trip to {req.destination}"),
        destination=req.destination,
        generated_by="ai",
        content_json=content_json
    )
    db.add(new_itinerary)
    await db.commit()
    await db.refresh(new_itinerary)

    return {
        "id": new_itinerary.id,
        "share_token": new_itinerary.share_token,
        "itinerary": content_json,
        "raw_trip_data": content_json,
        "created_at": new_itinerary.created_at.isoformat()
    }

@router.get("", response_model=List[ItineraryOut])
async def list_trips(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Find agency if user belongs to one
    agency_res = await db.execute(select(Agency).where(Agency.owner_user_id == current_user.id))
    agency = agency_res.scalars().first()

    if agency:
        res = await db.execute(
            select(Itinerary)
            .where((Itinerary.agency_id == agency.id) | (Itinerary.user_id == current_user.id))
            .order_by(Itinerary.created_at.desc())
        )
    else:
        res = await db.execute(
            select(Itinerary)
            .where(Itinerary.user_id == current_user.id)
            .order_by(Itinerary.created_at.desc())
        )
    
    return res.scalars().all()

@router.post("", response_model=ItineraryOut)
async def create_itinerary(
    itin_in: ItineraryCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    agency_res = await db.execute(select(Agency).where(Agency.owner_user_id == current_user.id))
    agency = agency_res.scalars().first()

    new_itin = Itinerary(
        agency_id=agency.id if agency else itin_in.agency_id,
        package_id=itin_in.package_id,
        user_id=current_user.id,
        title=itin_in.title,
        destination=itin_in.destination,
        generated_by=itin_in.generated_by or "manual",
        content_json=itin_in.content_json
    )
    db.add(new_itin)
    await db.commit()
    await db.refresh(new_itin)

    return new_itin

@router.get("/share/{share_token}", response_model=PublicItineraryOut)
async def get_public_itinerary(
    share_token: str,
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Itinerary).where(Itinerary.share_token == share_token))
    itin = res.scalars().first()
    if not itin:
        raise HTTPException(status_code=404, detail="Itinerary not found or invalid share token.")

    agency_name = "TravelUZ Partner Agency"
    agency_logo = None
    agency_contact_email = None
    agency_contact_phone = None

    if itin.agency_id:
        ag_res = await db.execute(select(Agency).where(Agency.id == itin.agency_id))
        agency = ag_res.scalars().first()
        if agency:
            agency_name = agency.name
            agency_logo = agency.logo_url
            agency_contact_email = agency.contact_email
            agency_contact_phone = agency.contact_phone

    return PublicItineraryOut(
        id=itin.id,
        title=itin.title,
        destination=itin.destination,
        content_json=itin.content_json,
        share_token=itin.share_token,
        created_at=itin.created_at,
        agency_name=agency_name,
        agency_logo=agency_logo,
        agency_contact_email=agency_contact_email,
        agency_contact_phone=agency_contact_phone
    )

@router.get("/{trip_id}", response_model=ItineraryOut)
async def get_trip(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Itinerary).where(Itinerary.id == trip_id))
    itin = res.scalars().first()
    if not itin:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    return itin

@router.put("/{trip_id}", response_model=ItineraryOut)
async def update_trip(
    trip_id: int,
    itin_update: ItineraryUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Itinerary).where(Itinerary.id == trip_id))
    itin = res.scalars().first()
    if not itin:
        raise HTTPException(status_code=404, detail="Itinerary not found")

    if itin_update.title is not None:
        itin.title = itin_update.title
    if itin_update.destination is not None:
        itin.destination = itin_update.destination
    if itin_update.content_json is not None:
        itin.content_json = itin_update.content_json

    db.add(itin)
    await db.commit()
    await db.refresh(itin)
    return itin

@router.delete("/{trip_id}")
async def delete_trip(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Itinerary).where(Itinerary.id == trip_id))
    itin = res.scalars().first()
    if not itin:
        raise HTTPException(status_code=404, detail="Itinerary not found")

    await db.delete(itin)
    await db.commit()
    return {"message": "Itinerary deleted successfully"}

@router.get("/{trip_id}/pdf")
async def download_trip_pdf(
    trip_id: int,
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Itinerary).where(Itinerary.id == trip_id))
    itin = res.scalars().first()
    if not itin:
        raise HTTPException(status_code=404, detail="Itinerary not found")

    agency_name = "TravelUZ Partner Agency"
    if itin.agency_id:
        ag_res = await db.execute(select(Agency).where(Agency.id == itin.agency_id))
        agency = ag_res.scalars().first()
        if agency:
            agency_name = agency.name

    pdf_bytes = generate_itinerary_pdf(itin.content_json, agency_name=agency_name)
    
    filename = f"Itinerary_{itin.title.replace(' ', '_')}.pdf"
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
