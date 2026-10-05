from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
import math

from app.db.session import get_db
from app.models.user import User, UserRole
from app.models.agency import Agency
from app.models.package import Package, TourImage
from app.models.trip import Trip
from app.models.lead import Lead
from app.schemas.package import (
    PackageCreate, PackageUpdate, PackageOut, TourPackageOut,
    TourImageCreate, TourImageOut, TourMatchOut,
    TourComparisonOut, TourComparisonItem
)
from app.schemas.lead import PublicLeadCreate, LeadOut
from app.api.deps import get_current_user, get_current_user_optional, get_current_agency
from app.services.telegram_service import send_telegram_lead_notification

router = APIRouter(prefix="/packages", tags=["Ready Tours & Packages"])

def serialize_package(p: Package) -> dict:
    return {
        "id": p.id,
        "agency_id": p.agency_id,
        "agency_name": p.agency.name if p.agency else "Verified Agency",
        "title": p.title,
        "slug": p.slug,
        "destination": p.destination,
        "days": p.days,
        "price": p.price,
        "currency": p.currency,
        "description": p.description,
        "included_services": p.included_services,
        "excluded_services": p.excluded_services,
        "status": p.status,
        "image_url": p.image_url,
        "availability": p.availability or [],
        "min_group_size": p.min_group_size,
        "max_group_size": p.max_group_size,
        "languages": p.languages or ["en"],
        "itinerary_highlights": p.itinerary_highlights or [],
        "is_featured": p.is_featured,
        "translations_json": p.translations_json or {},
        "images": [
            {
                "id": img.id,
                "package_id": img.package_id,
                "image_url": img.image_url,
                "caption": img.caption,
                "is_cover": img.is_cover,
                "order_index": img.order_index,
                "created_at": img.created_at.isoformat()
            }
            for img in getattr(p, "images", [])
        ],
        "created_at": p.created_at.isoformat(),
        "updated_at": p.updated_at.isoformat()
    }

@router.get("", response_model=List[dict])
async def list_packages(
    destination: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    currency: Optional[str] = None,
    min_days: Optional[int] = None,
    max_days: Optional[int] = None,
    agency_id: Optional[int] = None,
    status: Optional[str] = None,
    sort_by: Optional[str] = Query(None, description="price_asc, price_desc, duration_asc, duration_desc"),
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db)
):
    query = select(Package).options(selectinload(Package.agency), selectinload(Package.images))

    if destination:
        query = query.where(Package.destination.ilike(f"%{destination}%"))
    if min_price is not None:
        query = query.where(Package.price >= min_price)
    if max_price is not None:
        query = query.where(Package.price <= max_price)
    if currency:
        query = query.where(Package.currency == currency.upper())
    if min_days is not None:
        query = query.where(Package.days >= min_days)
    if max_days is not None:
        query = query.where(Package.days <= max_days)

    if agency_id:
        query = query.where(Package.agency_id == agency_id)
        if status:
            query = query.where(Package.status == status.lower())
    else:
        # Default public listing shows only published tours
        if status:
            query = query.where(Package.status == status.lower())
        else:
            query = query.where(Package.status == "published")

    # Sorting
    if sort_by == "price_desc":
        query = query.order_by(Package.price.desc())
    elif sort_by == "duration_asc":
        query = query.order_by(Package.days.asc())
    elif sort_by == "duration_desc":
        query = query.order_by(Package.days.desc())
    else:
        query = query.order_by(Package.price.asc())

    res = await db.execute(query)
    packages = res.scalars().all()
    return [serialize_package(p) for p in packages]

@router.get("/match", response_model=List[TourMatchOut])
async def match_tours_for_itinerary(
    destination: Optional[str] = None,
    days: Optional[int] = None,
    budget: Optional[float] = None,
    currency: Optional[str] = "USD",
    trip_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Ready Tours Recommendation & Match Engine.
    Queries verified agency packages matching destination, duration, and budget.
    Computes a match score (0–100%) and returns top 3-4 matches.
    """
    target_dest = destination
    target_days = days or 3
    target_budget = budget or 1000.0

    if trip_id:
        t_res = await db.execute(select(Trip).where(Trip.id == trip_id))
        trip = t_res.scalars().first()
        if trip:
            target_dest = trip.destination
            target_days = trip.duration_days
            target_budget = trip.estimated_budget

    query = select(Package).options(selectinload(Package.agency), selectinload(Package.images)).where(Package.status == "published")
    if target_dest:
        query = query.where(Package.destination.ilike(f"%{target_dest}%"))

    res = await db.execute(query)
    packages = res.scalars().all()

    if not packages and target_dest:
        # Fallback to any published packages if no destination exact match
        fb_res = await db.execute(select(Package).options(selectinload(Package.agency), selectinload(Package.images)).where(Package.status == "published").limit(4))
        packages = fb_res.scalars().all()

    scored = []
    for p in packages:
        score = 50 # Base score for destination match
        reasons = []

        # Duration alignment (±2 days)
        day_diff = abs(p.days - target_days)
        if day_diff == 0:
            score += 25
            reasons.append(f"Exact {p.days}-day schedule alignment")
        elif day_diff <= 2:
            score += 15
            reasons.append(f"Compatible {p.days}-day duration (differs by {day_diff} day)")
        else:
            score += 5

        # Budget alignment (within 35%)
        if target_budget > 0:
            cost_ratio = abs(p.price - target_budget) / target_budget
            if cost_ratio <= 0.2:
                score += 25
                reasons.append("Optimal budget alignment (<20% variation)")
            elif cost_ratio <= 0.35:
                score += 15
                reasons.append("Comparable budget range (all-inclusive)")
            else:
                score += 5
        else:
            score += 15

        score = min(score, 98) # realistic score ceiling
        tradeoff = f"Covers primary {p.destination} sights with turnkey transport and boutique lodging."

        scored.append(TourMatchOut(
            package=PackageOut(**serialize_package(p)),
            match_score=score,
            match_reasons=reasons,
            tradeoff_summary=tradeoff
        ))

    scored.sort(key=lambda x: x.match_score, reverse=True)
    return scored[:4]

@router.get("/compare", response_model=TourComparisonOut)
async def compare_tours(
    ids: str = Query(..., description="Comma-separated package IDs, e.g. 1,2"),
    trip_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Side-by-Side Comparison Architecture.
    Contrasts multiple agency packages and optionally a custom DIY AI itinerary.
    """
    pkg_ids = [int(i.strip()) for i in ids.split(",") if i.strip().isdigit()]
    if not pkg_ids:
        raise HTTPException(status_code=400, detail="Please provide at least one valid package ID.")

    res = await db.execute(
        select(Package).options(selectinload(Package.agency)).where(Package.id.in_(pkg_ids))
    )
    packages = res.scalars().all()

    items = []
    # If trip_id provided, include DIY Itinerary
    if trip_id:
        t_res = await db.execute(select(Trip).where(Trip.id == trip_id))
        trip = t_res.scalars().first()
        if trip:
            travelers = max(trip.travelers_count, 1)
            cost_per_person = round(trip.estimated_budget / travelers, 2) if trip.estimated_budget else 0.0
            items.append(TourComparisonItem(
                id=f"diy_trip_{trip.id}",
                name=f"Your Custom AI Plan: {trip.title}",
                type="diy_itinerary",
                total_cost=trip.estimated_budget,
                cost_per_person=cost_per_person,
                currency=trip.currency,
                accommodation="Self-booked hotels / apartments",
                transportation="Self-managed taxis, walking & transit",
                guided_experience="Self-guided with TripMind AI notes",
                sight_admissions="Pay at entrance kiosks on arrival",
                effort_required="High (Self-managed logistics)",
                flexibility="100% Freeform & Modifiable",
                direct_booking_channel="Individual third-party sites",
                highlights=["Custom schedule", "Flexible timing", "Full itinerary control"]
            ))

    for p in packages:
        agency_name = p.agency.name if p.agency else "Partner Agency"
        items.append(TourComparisonItem(
            id=f"package_{p.id}",
            name=f"{agency_name}: {p.title}",
            type="agency_package",
            total_cost=p.price,
            cost_per_person=p.price,
            currency=p.currency,
            accommodation="Included (Pre-reserved Heritage 4★ Boutique)",
            transportation="Private AC vehicle + Express Train included",
            guided_experience="Dedicated Licensed Cultural Historian",
            sight_admissions="VIP Skip-the-line admissions included",
            effort_required="Zero (Turnkey agency delivery)",
            flexibility="Fixed daily guided milestones",
            direct_booking_channel="Direct Agency Escrow / Quote",
            highlights=[p.destination, f"{p.days} Days / {p.days-1} Nights", p.included_services or "All-inclusive logistics"]
        ))

    dimensions = [
        "Total Estimated Cost",
        "Cost Per Person",
        "Accommodation",
        "Transportation & Logistics",
        "Guided Experience",
        "Sight Admissions",
        "Planning Effort",
        "Schedule Flexibility",
        "Direct Booking Channel"
    ]

    return TourComparisonOut(dimensions=dimensions, items=items)

@router.get("/{package_id}", response_model=dict)
async def get_package(package_id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(
        select(Package)
        .options(selectinload(Package.agency), selectinload(Package.images))
        .where(Package.id == package_id)
    )
    p = res.scalars().first()
    if not p:
        raise HTTPException(status_code=404, detail="Package not found")

    return serialize_package(p)

@router.post("", response_model=dict)
async def create_package(
    pkg_in: PackageCreate,
    agency: Agency = Depends(get_current_agency),
    db: AsyncSession = Depends(get_db)
):
    slug_base = pkg_in.title.lower().replace(" ", "-").replace("/", "-")
    slug = f"{slug_base}-{agency.id}-{int(datetime.utcnow().timestamp())}"
    new_pkg = Package(
        agency_id=agency.id,
        title=pkg_in.title,
        slug=slug,
        destination=pkg_in.destination,
        days=pkg_in.days,
        price=pkg_in.price,
        currency=pkg_in.currency or "USD",
        description=pkg_in.description,
        included_services=pkg_in.included_services,
        excluded_services=pkg_in.excluded_services,
        status=pkg_in.status or "published",
        image_url=pkg_in.image_url,
        availability=pkg_in.availability or [],
        min_group_size=pkg_in.min_group_size or 1,
        max_group_size=pkg_in.max_group_size or 20,
        languages=pkg_in.languages or ["en"],
        itinerary_highlights=pkg_in.itinerary_highlights or [],
        is_featured=pkg_in.is_featured,
        translations_json=pkg_in.translations_json or {}
    )
    db.add(new_pkg)
    await db.commit()
    await db.refresh(new_pkg)
    return serialize_package(new_pkg)

@router.patch("/{package_id}", response_model=dict)
@router.put("/{package_id}", response_model=dict)
async def update_package(
    package_id: int,
    pkg_in: PackageUpdate,
    agency: Agency = Depends(get_current_agency),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Package)
        .options(selectinload(Package.agency), selectinload(Package.images))
        .where(Package.id == package_id, Package.agency_id == agency.id)
    )
    pkg = res.scalars().first()
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found or access denied.")

    if pkg_in.title is not None:
        pkg.title = pkg_in.title
    if pkg_in.destination is not None:
        pkg.destination = pkg_in.destination
    if pkg_in.days is not None:
        pkg.days = pkg_in.days
    if pkg_in.price is not None:
        pkg.price = pkg_in.price
    if pkg_in.currency is not None:
        pkg.currency = pkg_in.currency
    if pkg_in.description is not None:
        pkg.description = pkg_in.description
    if pkg_in.included_services is not None:
        pkg.included_services = pkg_in.included_services
    if pkg_in.excluded_services is not None:
        pkg.excluded_services = pkg_in.excluded_services
    if pkg_in.status is not None:
        pkg.status = pkg_in.status
    if pkg_in.image_url is not None:
        pkg.image_url = pkg_in.image_url
    if pkg_in.availability is not None:
        pkg.availability = pkg_in.availability
    if pkg_in.min_group_size is not None:
        pkg.min_group_size = pkg_in.min_group_size
    if pkg_in.max_group_size is not None:
        pkg.max_group_size = pkg_in.max_group_size
    if pkg_in.languages is not None:
        pkg.languages = pkg_in.languages
    if pkg_in.itinerary_highlights is not None:
        pkg.itinerary_highlights = pkg_in.itinerary_highlights
    if pkg_in.is_featured is not None:
        pkg.is_featured = pkg_in.is_featured
    if pkg_in.translations_json is not None:
        pkg.translations_json = pkg_in.translations_json

    db.add(pkg)
    await db.commit()
    await db.refresh(pkg)
    return serialize_package(pkg)

@router.delete("/{package_id}")
async def delete_package(
    package_id: int,
    agency: Agency = Depends(get_current_agency),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Package).where(Package.id == package_id, Package.agency_id == agency.id)
    )
    pkg = res.scalars().first()
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found or access denied.")

    await db.delete(pkg)
    await db.commit()
    return {"message": "Tour package deleted successfully"}

@router.patch("/{package_id}/publish", response_model=dict)
async def publish_package(
    package_id: int,
    agency: Agency = Depends(get_current_agency),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Package).where(Package.id == package_id, Package.agency_id == agency.id))
    pkg = res.scalars().first()
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found or access denied.")

    pkg.status = "published"
    db.add(pkg)
    await db.commit()
    return {"message": "Tour package published successfully", "status": "published"}

@router.patch("/{package_id}/unpublish", response_model=dict)
async def unpublish_package(
    package_id: int,
    agency: Agency = Depends(get_current_agency),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Package).where(Package.id == package_id, Package.agency_id == agency.id))
    pkg = res.scalars().first()
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found or access denied.")

    pkg.status = "draft"
    db.add(pkg)
    await db.commit()
    return {"message": "Tour package unpublished (set to draft)", "status": "draft"}

# ----------------- Tour Images -----------------

@router.post("/{package_id}/images", response_model=TourImageOut)
async def add_tour_image(
    package_id: int,
    img_in: TourImageCreate,
    agency: Agency = Depends(get_current_agency),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Package).where(Package.id == package_id, Package.agency_id == agency.id))
    pkg = res.scalars().first()
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found or access denied.")

    new_img = TourImage(
        package_id=pkg.id,
        image_url=img_in.image_url,
        caption=img_in.caption,
        is_cover=img_in.is_cover,
        order_index=img_in.order_index
    )
    db.add(new_img)
    # If set as cover, update package main image_url
    if img_in.is_cover:
        pkg.image_url = img_in.image_url
        db.add(pkg)

    await db.commit()
    await db.refresh(new_img)
    return new_img

@router.delete("/{package_id}/images/{image_id}")
async def delete_tour_image(
    package_id: int,
    image_id: int,
    agency: Agency = Depends(get_current_agency),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Package).where(Package.id == package_id, Package.agency_id == agency.id))
    pkg = res.scalars().first()
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found or access denied.")

    img_res = await db.execute(select(TourImage).where(TourImage.id == image_id, TourImage.package_id == package_id))
    img = img_res.scalars().first()
    if not img:
        raise HTTPException(status_code=404, detail="Tour image not found.")

    await db.delete(img)
    await db.commit()
    return {"message": "Tour image deleted successfully"}

# ----------------- Contact Agency / Tour Lead -----------------

@router.post("/{package_id}/contact", response_model=LeadOut)
async def contact_agency_for_tour(
    package_id: int,
    lead_in: PublicLeadCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Submits inquiry for an agency ready tour.
    Creates a lead in agency CRM and sends a notification.
    """
    pkg_res = await db.execute(select(Package).options(selectinload(Package.agency)).where(Package.id == package_id))
    pkg = pkg_res.scalars().first()
    if not pkg:
        raise HTTPException(status_code=404, detail="Tour package not found.")

    new_lead = Lead(
        agency_id=pkg.agency_id,
        package_id=pkg.id,
        trip_id=lead_in.trip_id,
        client_name=lead_in.client_name,
        client_contact=lead_in.client_contact,
        client_email=lead_in.client_email,
        client_phone=lead_in.client_phone,
        preferred_contact_method=lead_in.preferred_contact_method or "email",
        source="tour_inquiry",
        travelers_count=lead_in.travelers_count or 1,
        travel_date=lead_in.travel_date,
        budget=lead_in.budget or pkg.price,
        currency=lead_in.currency or pkg.currency,
        status="new",
        notes=lead_in.notes
    )
    db.add(new_lead)
    await db.commit()
    await db.refresh(new_lead)

    # Telegram notification if agency has bot configured
    if pkg.agency and pkg.agency.telegram_bot_token and pkg.agency.telegram_chat_id:
        try:
            await send_telegram_lead_notification(
                encrypted_bot_token=pkg.agency.telegram_bot_token,
                chat_id=pkg.agency.telegram_chat_id,
                client_name=new_lead.client_name,
                client_contact=new_lead.client_contact,
                itinerary_title=pkg.title,
                share_token=f"package-{pkg.id}",
                notes=new_lead.notes
            )
        except Exception:
            pass

    return LeadOut(
        id=new_lead.id,
        agency_id=new_lead.agency_id,
        client_name=new_lead.client_name,
        client_contact=new_lead.client_contact,
        client_email=new_lead.client_email,
        client_phone=new_lead.client_phone,
        preferred_contact_method=new_lead.preferred_contact_method,
        source=new_lead.source,
        package_id=new_lead.package_id,
        trip_id=new_lead.trip_id,
        package_title=pkg.title,
        travelers_count=new_lead.travelers_count,
        travel_date=new_lead.travel_date,
        budget=new_lead.budget,
        currency=new_lead.currency,
        status=new_lead.status,
        notes=new_lead.notes,
        created_at=new_lead.created_at
    )
