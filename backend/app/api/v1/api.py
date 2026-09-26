from fastapi import APIRouter
from app.api.v1 import auth, agencies, trips, itineraries, packages, leads, bookings, admin

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(agencies.router)
api_router.include_router(trips.router)
api_router.include_router(itineraries.router)
api_router.include_router(packages.router)
api_router.include_router(leads.router)
api_router.include_router(bookings.router)
api_router.include_router(admin.router)

