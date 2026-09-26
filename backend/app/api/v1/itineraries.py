from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import io

from app.db.session import get_db
from app.models.agency import Agency
from app.models.itinerary import Itinerary
from app.schemas.itinerary import ItineraryOut
from app.services.pdf_service import generate_itinerary_pdf

router = APIRouter(prefix="/itineraries", tags=["Itineraries"])

@router.get("/{itinerary_id}/pdf")
async def download_itinerary_pdf(
    itinerary_id: int,
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Itinerary).where(Itinerary.id == itinerary_id))
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

@router.get("/{itinerary_id}", response_model=ItineraryOut)
async def get_itinerary_by_id(
    itinerary_id: int,
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Itinerary).where(Itinerary.id == itinerary_id))
    itin = res.scalars().first()
    if not itin:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    return itin
