from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.db.session import get_db
from app.models.agency import Agency
from app.models.package import Package
from app.schemas.package import PackageCreate, PackageUpdate, PackageOut
from app.api.deps import get_current_user, get_current_agency

router = APIRouter(prefix="/packages", tags=["Packages"])

@router.get("", response_model=List[PackageOut])
async def list_packages(
    agency: Agency = Depends(get_current_agency),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Package)
        .where(Package.agency_id == agency.id)
        .order_by(Package.created_at.desc())
    )
    return res.scalars().all()

@router.post("", response_model=PackageOut)
async def create_package(
    pkg_in: PackageCreate,
    agency: Agency = Depends(get_current_agency),
    db: AsyncSession = Depends(get_db)
):
    new_pkg = Package(
        agency_id=agency.id,
        title=pkg_in.title,
        destination=pkg_in.destination,
        days=pkg_in.days,
        price=pkg_in.price,
        description=pkg_in.description,
        status=pkg_in.status or "published"
    )
    db.add(new_pkg)
    await db.commit()
    await db.refresh(new_pkg)
    return new_pkg

@router.put("/{package_id}", response_model=PackageOut)
async def update_package(
    package_id: int,
    pkg_in: PackageUpdate,
    agency: Agency = Depends(get_current_agency),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Package).where(Package.id == package_id, Package.agency_id == agency.id)
    )
    pkg = res.scalars().first()
    if not pkg:
        raise HTTPException(status_code=404, detail="Package not found")

    if pkg_in.title is not None:
        pkg.title = pkg_in.title
    if pkg_in.destination is not None:
        pkg.destination = pkg_in.destination
    if pkg_in.days is not None:
        pkg.days = pkg_in.days
    if pkg_in.price is not None:
        pkg.price = pkg_in.price
    if pkg_in.description is not None:
        pkg.description = pkg_in.description
    if pkg_in.status is not None:
        pkg.status = pkg_in.status

    db.add(pkg)
    await db.commit()
    await db.refresh(pkg)
    return pkg

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
        raise HTTPException(status_code=404, detail="Package not found")

    await db.delete(pkg)
    await db.commit()
    return {"message": "Package deleted"}
