import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

@pytest.mark.asyncio
async def test_auth_flow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. Register new user
        unique_email = f"test_{int(pytest.importorskip('time').time())}@traveluz.com"
        reg_res = await ac.post("/api/auth/register", json={
            "email": unique_email,
            "password": "SecurePassword123!",
            "name": "Test Traveler",
            "role": "USER"
        })
        assert reg_res.status_code == 200
        reg_data = reg_res.json()
        assert "access_token" in reg_data
        assert reg_data["user"]["email"] == unique_email

        # 2. Login
        login_res = await ac.post("/api/auth/login", json={
            "email": unique_email,
            "password": "SecurePassword123!"
        })
        assert login_res.status_code == 200
        login_data = login_res.json()
        token = login_data["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 3. Get /me
        me_res = await ac.get("/api/auth/me", headers=headers)
        assert me_res.status_code == 200
        me_data = me_res.json()
        assert me_data["email"] == unique_email
        assert me_data["role"] == "USER"

        # 4. Logout
        logout_res = await ac.post("/api/auth/logout", headers=headers)
        assert logout_res.status_code == 200

@pytest.mark.asyncio
async def test_destinations_and_search():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # List destinations
        res = await ac.get("/api/destinations")
        assert res.status_code == 200
        destinations = res.json()
        assert len(destinations) >= 13
        slugs = [d["slug"] for d in destinations]
        assert "samarkand" in slugs
        assert "bukhara" in slugs
        assert "tashkent" in slugs
        assert "khiva" in slugs

        # Get destination by slug
        sam_res = await ac.get("/api/destinations/samarkand")
        assert sam_res.status_code == 200
        sam_data = sam_res.json()
        assert sam_data["name"] == "Samarkand"
        assert len(sam_data["places"]) >= 3

        # Unified Search
        search_res = await ac.get("/api/search?q=Registan")
        assert search_res.status_code == 200
        search_data = search_res.json()
        assert search_data["total_results"] > 0

@pytest.mark.asyncio
async def test_trip_crud_and_server_side_authorization():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # Login user 1
        u1_res = await ac.post("/api/auth/login", json={
            "email": "traveler@gmail.com",
            "password": "Password123!"
        })
        u1_token = u1_res.json()["access_token"]
        u1_headers = {"Authorization": f"Bearer {u1_token}"}

        # Login user 2
        u2_res = await ac.post("/api/auth/login", json={
            "email": "sarah.connor@gmail.com",
            "password": "Password123!"
        })
        u2_token = u2_res.json()["access_token"]
        u2_headers = {"Authorization": f"Bearer {u2_token}"}

        # User 1 creates trip with relational days and activities
        trip_payload = {
            "title": "Bukhara Craft Journey",
            "destination": "Bukhara",
            "duration_days": 2,
            "estimated_budget": 300.0,
            "days": [
                {
                    "day_number": 1,
                    "title": "Trading Domes & Suzani",
                    "daily_budget": 150.0,
                    "activities": [
                        {
                            "title": "Visit Toqi Zargaron",
                            "location_name": "Bukhara Trading Domes",
                            "time_slot": "morning",
                            "duration_hours": 2.0,
                            "estimated_cost": 20.0
                        }
                    ]
                }
            ]
        }
        create_res = await ac.post("/api/trips", json=trip_payload, headers=u1_headers)
        assert create_res.status_code == 200
        trip_data = create_res.json()
        trip_id = trip_data["id"]
        assert len(trip_data["days"]) == 1
        assert len(trip_data["days"][0]["activities"]) == 1

        # User 1 can update their trip
        update_res = await ac.patch(f"/api/trips/{trip_id}", json={"title": "Updated Bukhara Craft Journey"}, headers=u1_headers)
        assert update_res.status_code == 200
        assert update_res.json()["title"] == "Updated Bukhara Craft Journey"

        # SERVER-SIDE AUTHORIZATION: User 2 CANNOT update User 1's trip!
        forbidden_update = await ac.patch(f"/api/trips/{trip_id}", json={"title": "Hacked Title"}, headers=u2_headers)
        assert forbidden_update.status_code == 403

        # SERVER-SIDE AUTHORIZATION: User 2 CANNOT delete User 1's trip!
        forbidden_delete = await ac.delete(f"/api/trips/{trip_id}", headers=u2_headers)
        assert forbidden_delete.status_code == 403

        # User 1 can delete their own trip
        delete_res = await ac.delete(f"/api/trips/{trip_id}", headers=u1_headers)
        assert delete_res.status_code == 200

@pytest.mark.asyncio
async def test_guides_and_authorization():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # List verified guides
        guides_res = await ac.get("/api/guides")
        assert guides_res.status_code == 200
        guides = guides_res.json()
        assert len(guides) >= 2
        anvar = next(g for g in guides if "Anvar" in g["name"])

        # Login another user who is NOT Anvar
        u_res = await ac.post("/api/auth/login", json={
            "email": "traveler@gmail.com",
            "password": "Password123!"
        })
        u_headers = {"Authorization": f"Bearer {u_res.json()['access_token']}"}

        # SERVER-SIDE AUTHORIZATION: Another user cannot modify Anvar's guide profile!
        forbid_res = await ac.patch(f"/api/guides/{anvar['id']}", json={"price_per_day": 999.0}, headers=u_headers)
        assert forbid_res.status_code == 403

@pytest.mark.asyncio
async def test_bookings_and_notification_triggers():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. Login regular traveler
        traveler_res = await ac.post("/api/auth/login", json={
            "email": "traveler@gmail.com",
            "password": "Password123!"
        })
        t_headers = {"Authorization": f"Bearer {traveler_res.json()['access_token']}"}

        # 2. Login agency owner
        agency_res = await ac.post("/api/auth/login", json={
            "email": "silkroad@agency.uz",
            "password": "Password123!"
        })
        a_headers = {"Authorization": f"Bearer {agency_res.json()['access_token']}"}

        # 3. Traveler creates a booking
        book_res = await ac.post("/api/bookings", json={
            "agency_id": 1,
            "service_title": "Golden Triangle Tour",
            "final_price": 890.0,
            "currency": "USD",
            "travelers_count": 2,
            "special_requests": "Window seats on train"
        }, headers=t_headers)
        assert book_res.status_code == 200
        booking = book_res.json()
        b_id = booking["id"]
        assert booking["status"] == "pending"

        # 4. Agency confirms booking -> Triggers notification!
        confirm_res = await ac.patch(f"/api/bookings/{b_id}", json={"status": "confirmed"}, headers=a_headers)
        assert confirm_res.status_code == 200
        assert confirm_res.json()["status"] == "confirmed"

        # 5. Verify Traveler received booking_confirmed notification
        notif_res = await ac.get("/api/notifications", headers=t_headers)
        assert notif_res.status_code == 200
        notifs = notif_res.json()["notifications"]
        types = [n["type"] for n in notifs]
        assert "booking_confirmed" in types

@pytest.mark.asyncio
async def test_admin_apis_and_rbac():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. Traveler tries to access admin overview -> FORBIDDEN 403
        t_res = await ac.post("/api/auth/login", json={
            "email": "traveler@gmail.com",
            "password": "Password123!"
        })
        t_headers = {"Authorization": f"Bearer {t_res.json()['access_token']}"}
        denied_res = await ac.get("/api/admin/overview", headers=t_headers)
        assert denied_res.status_code == 403

        # 2. Admin logs in
        admin_res = await ac.post("/api/auth/login", json={
            "email": "admin@traveluz.com",
            "password": "Password123!"
        })
        admin_headers = {"Authorization": f"Bearer {admin_res.json()['access_token']}"}

        # 3. Admin can access real database-driven overview
        overview_res = await ac.get("/api/admin/overview", headers=admin_headers)
        assert overview_res.status_code == 200
        overview = overview_res.json()
        assert overview["total_destinations"] >= 13
        assert overview["total_users"] >= 6
        assert overview["total_bookings"] >= 2
