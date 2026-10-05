from fastapi import APIRouter
from app.api.v1 import (
    auth, destinations, trips, friends, community, guides, agencies,
    bookings, booking_requests, notifications, reviews, messages,
    admin, packages, leads, itineraries, favorites, ai, travel
)

api_router = APIRouter()

# Core Domain Routers
api_router.include_router(auth.router)
api_router.include_router(destinations.router)
api_router.include_router(trips.router)
api_router.include_router(ai.router)
api_router.include_router(friends.router)
api_router.include_router(community.router)
api_router.include_router(guides.router)
api_router.include_router(agencies.router)
api_router.include_router(bookings.router)
api_router.include_router(booking_requests.router)
api_router.include_router(notifications.router)
api_router.include_router(reviews.router)
api_router.include_router(messages.router)
api_router.include_router(admin.router)
api_router.include_router(packages.router)
api_router.include_router(leads.router)
api_router.include_router(itineraries.router)
api_router.include_router(favorites.router)
api_router.include_router(travel.router)

