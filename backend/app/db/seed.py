import asyncio
import logging
from datetime import datetime, date, timedelta
from sqlalchemy.future import select

from app.db.session import engine, AsyncSessionLocal, Base
from app.models.user import User, UserRole, Profile
from app.models.destination import Category, Destination, Place, SavedDestination
from app.models.trip import Trip, TripDay, TripActivity, CommunityTrip, TripParticipant, SavedTrip
from app.models.guide import Guide
from app.models.agency import Agency, AgencyMember, AgencyService
from app.models.package import Package
from app.models.booking import Booking
from app.models.review import Review
from app.models.social import FriendRequest, Conversation, Message
from app.models.notification import Notification
from app.models.admin import Report, AdminAction
from app.api.deps import get_password_hash

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("seed")

async def seed_database():
    logger.info("Initializing schema...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # Check if already seeded
        res = await session.execute(select(Destination))
        if res.scalars().first():
            logger.info("Database already seeded with destinations. Skipping duplication.")
            return

        logger.info("Seeding realistic Uzbekistan data...")

        # ==========================================
        # 1. CATEGORIES
        # ==========================================
        categories_data = [
            {"name": "UNESCO Silk Road Heritage", "slug": "unesco-heritage", "icon": "landmark", "description": "Centuries-old Islamic monuments, turquoise domes, and historic caravanserais."},
            {"name": "Mountain & Alpine Adventure", "slug": "mountain-adventure", "icon": "mountain", "description": "Trekking, skiing, alpine lakes, and scenic gorges in the Tian Shan range."},
            {"name": "Lakes & Water Recreation", "slug": "lakes-recreation", "icon": "waves", "description": "Turquoise mountain reservoirs, sandy beaches, sailing, and water sports."},
            {"name": "Bazaars & Gastronomy", "slug": "bazaars-gastronomy", "icon": "utensils", "description": "Legendary spice markets, wood-fired tandyr bread, and authentic regional plov."},
            {"name": "Greco-Buddhist Antiquities", "slug": "buddhist-antiquities", "icon": "scroll", "description": "Central Asian Kushan Buddhist monasteries and ancient Amu Darya outposts."},
            {"name": "Avant-Garde Art & Desert Ecotourism", "slug": "desert-art", "icon": "palette", "description": "The Savitsky modern art collection and dramatic desert salt flat expeditions."}
        ]
        cat_objs = {}
        for c in categories_data:
            cat = Category(**c)
            session.add(cat)
            await session.flush()
            cat_objs[c["slug"]] = cat

        # ==========================================
        # 2. USERS & PROFILES
        # ==========================================
        pwd_hash = get_password_hash("Password123!")

        # Admin
        admin = User(
            email="admin@traveluz.com",
            password_hash=pwd_hash,
            name="Ulugbek Rashidov",
            role=UserRole.ADMIN.value,
            avatar="https://api.dicebear.com/7.x/bottts/svg?seed=admin"
        )
        session.add(admin)
        await session.flush()
        session.add(Profile(user_id=admin.id, bio="Senior Platform Administrator at TravelUZ", country="Uzbekistan"))

        # Agency Owner 1
        agency_user_1 = User(
            email="silkroad@agency.uz",
            password_hash=pwd_hash,
            name="Bobur Mirzo",
            role=UserRole.AGENCY.value,
            avatar="https://api.dicebear.com/7.x/bottts/svg?seed=bobur"
        )
        session.add(agency_user_1)
        await session.flush()
        session.add(Profile(user_id=agency_user_1.id, bio="Founder of Silk Road Voyages. Dedicated to showcasing Central Asian wonders.", country="Uzbekistan"))

        # Guide 1
        guide_user_1 = User(
            email="anvar@guide.uz",
            password_hash=pwd_hash,
            name="Anvar Samarkandi",
            role=UserRole.GUIDE.value,
            avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
        )
        session.add(guide_user_1)
        await session.flush()
        session.add(Profile(user_id=guide_user_1.id, bio="Licensed Silk Road Historian & Heritage Guide with 9 years experience.", country="Uzbekistan"))

        # Guide 2
        guide_user_2 = User(
            email="nilufar@guide.uz",
            password_hash=pwd_hash,
            name="Nilufar Bukhari",
            role=UserRole.GUIDE.value,
            avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
        )
        session.add(guide_user_2)
        await session.flush()
        session.add(Profile(user_id=guide_user_2.id, bio="Expert in Bukhara crafts, miniature painting, and Sufi shrine architecture.", country="Uzbekistan"))

        # Travelers
        traveler_1 = User(
            email="traveler@gmail.com",
            password_hash=pwd_hash,
            name="David Miller",
            role=UserRole.USER.value,
            avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
        )
        session.add(traveler_1)
        await session.flush()
        session.add(Profile(user_id=traveler_1.id, bio="Adventure photographer backpacking through the ancient cities of the Silk Road.", country="United States", travel_style="Backpacker & Cultural"))

        traveler_2 = User(
            email="sarah.connor@gmail.com",
            password_hash=pwd_hash,
            name="Sarah Connor",
            role=UserRole.USER.value,
            avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
        )
        session.add(traveler_2)
        await session.flush()
        session.add(Profile(user_id=traveler_2.id, bio="Solo traveler passionate about Central Asian textiles, ceramics, and architecture.", country="United Kingdom", travel_style="Cultural Heritage"))

        # ==========================================
        # 3. AGENCIES & SERVICES
        # ==========================================
        agency_1 = Agency(
            name="Silk Road Voyages",
            slug="silk-road-voyages",
            logo_url="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80",
            contact_email="info@silkroadvoyages.uz",
            contact_phone="+998901234567",
            owner_user_id=agency_user_1.id,
            description="Leading inbound tour operator specializing in authentic Silk Road itineraries, private Afrosiyob rail travel, and premier boutique hotels.",
            address="45 Amir Timur Avenue, Mirabad District",
            city="Tashkent",
            rating=4.9,
            reviews_count=48,
            is_verified=True,
            subscription_tier="enterprise"
        )
        session.add(agency_1)
        await session.flush()

        session.add(AgencyMember(agency_id=agency_1.id, user_id=agency_user_1.id, role="owner"))

        session.add(AgencyService(
            agency_id=agency_1.id,
            name="VIP High-Speed Afrosiyob Train Transfer",
            description="Guaranteed business class rail tickets between Tashkent, Samarkand, and Bukhara with chauffeur pickup.",
            price=85.0,
            currency="USD",
            service_type="Transport"
        ))
        session.add(AgencyService(
            agency_id=agency_1.id,
            name="Private Silk Masterclass & Gastronomy Tour",
            description="Behind-the-scenes access to Margilan silk looms followed by private masterclass with an Ustoz plov master.",
            price=120.0,
            currency="USD",
            service_type="Masterclass"
        ))

        # ==========================================
        # 4. PACKAGES
        # ==========================================
        pkg_1 = Package(
            agency_id=agency_1.id,
            title="Golden Triangle: Tashkent, Samarkand & Bukhara",
            slug="golden-triangle-uzbekistan",
            destination="Samarkand, Bukhara, Tashkent",
            days=7,
            price=890.0,
            currency="USD",
            description="The quintessential 7-day Central Asian odyssey covering majestic madrassas, atmospheric desert trading domes, and luxury rail transport.",
            included_services="Boutique 4-star hotels, Afrosiyob train tickets, English-speaking guide, all monument entry passes, daily breakfast",
            excluded_services="International flights, travel insurance, personal souvenirs",
            status="published",
            image_url="https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=800&q=80"
        )
        session.add(pkg_1)

        pkg_2 = Package(
            agency_id=agency_1.id,
            title="Aral Sea & Kyzylkum Desert 4x4 Expedition",
            slug="aral-sea-desert-expedition",
            destination="Nukus & Aral Sea",
            days=4,
            price=680.0,
            currency="USD",
            description="Traverse the dramatic Ustyurt chalk cliffs, explore the haunting Muynak ship cemetery, and camp in traditional Karakalpak yurts under desert stars.",
            included_services="4WD Toyota Land Cruiser with expedition driver, nomadic yurt camp stay, full board meals, Savitsky Museum pass",
            excluded_services="Alcoholic beverages, tips",
            status="published",
            image_url="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80"
        )
        session.add(pkg_2)

        # ==========================================
        # 5. GUIDES
        # ==========================================
        guide_1 = Guide(
            user_id=guide_user_1.id,
            full_name="Anvar Samarkandi",
            bio="Certified national guide with Master's degree in Central Asian Archaeology. Passionate about revealing the hidden celestial geometry of Timurid tilework.",
            languages="Uzbek, English, Russian, French",
            cities_covered="Samarkand, Shahrisabz",
            experience_years=9,
            daily_rate=75.0,
            currency="USD",
            rating=5.0,
            reviews_count=62,
            is_verified=True,
            avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
            contact_phone="+998931112233"
        )
        session.add(guide_1)

        guide_2 = Guide(
            user_id=guide_user_2.id,
            full_name="Nilufar Bukhari",
            bio="Born in the old Jewish quarter of Bukhara. Specializes in Sufi sanctuary architecture, traditional embroidery (suzani), and spice trade history.",
            languages="Uzbek, English, Russian, German",
            cities_covered="Bukhara, Khiva",
            experience_years=6,
            daily_rate=65.0,
            currency="USD",
            rating=4.9,
            reviews_count=41,
            is_verified=True,
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
            contact_phone="+998974445566"
        )
        session.add(guide_2)

        # ==========================================
        # 6. DESTINATIONS & PLACES
        # ==========================================
        destinations_data = [
            {
                "name": "Tashkent",
                "slug": "tashkent",
                "cat_slug": "unesco-heritage",
                "region": "Tashkent Province",
                "description": "The dynamic capital of Uzbekistan, harmoniously marrying tree-lined Soviet boulevards, avant-garde metro stations, and timeless Islamic courtyards holding the world's oldest Quran.",
                "latitude": 41.2995,
                "longitude": 69.2401,
                "budget_tier": "moderate",
                "average_cost_per_day": 65.0,
                "recommended_duration_days": 3,
                "best_season": "Year-Round (Best Apr-Jun & Sep-Nov)",
                "image_url": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80"
                ],
                "is_featured": True,
                "places": [
                    {"name": "Hazrati Imam Complex", "slug": "hazrati-imam-complex", "description": "Spiritual heart of Tashkent housing the venerated 7th-century Uthman Quran written on deer parchment.", "latitude": 41.3364, "longitude": 69.2406, "entry_fee": 5.0},
                    {"name": "Chorsu Bazaar", "slug": "chorsu-bazaar", "description": "Gigantic turquoise-domed open market overflowing with freshly baked non, dry fruits, spices, and silk textiles.", "latitude": 41.3267, "longitude": 69.2355, "entry_fee": 0.0},
                    {"name": "Tashkent Metro Architecture Tour", "slug": "tashkent-metro", "description": "Subterranean art museum with chandelier-lit granite stations dedicated to cosmonauts, poets, and cotton harvests.", "latitude": 41.3111, "longitude": 69.2797, "entry_fee": 0.20}
                ]
            },
            {
                "name": "Samarkand",
                "slug": "samarkand",
                "cat_slug": "unesco-heritage",
                "region": "Samarkand Province",
                "description": "The crown jewel of the Silk Road and capital of Timur's empire. Its grand turquoise domes, kaleidoscopic mosaic facades, and colossal minarets have captivated travelers for over two millennia.",
                "latitude": 39.6270,
                "longitude": 66.9750,
                "budget_tier": "moderate",
                "average_cost_per_day": 55.0,
                "recommended_duration_days": 4,
                "best_season": "April to June, September to November",
                "image_url": "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=800&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=800&q=80"
                ],
                "is_featured": True,
                "places": [
                    {"name": "Registan Square", "slug": "registan-square", "description": "Central Asia's most iconic architectural ensemble of three grand madrasahs: Ulugh Beg, Sher-Dor, and Tilya-Kori.", "latitude": 39.6548, "longitude": 66.9758, "entry_fee": 10.0},
                    {"name": "Shah-i-Zinda Necropolis", "slug": "shah-i-zinda", "description": "Breathtaking avenue of sapphire and cobalt-glazed mausoleums spanning the 11th to 15th centuries.", "latitude": 39.6644, "longitude": 66.9878, "entry_fee": 6.0},
                    {"name": "Gur-e-Amir Mausoleum", "slug": "gur-e-amir", "description": "The monumental fluted azure dome sheltering the dark nephrite jade tomb of Emperor Timur (Tamerlane).", "latitude": 39.6483, "longitude": 66.9692, "entry_fee": 6.0}
                ]
            },
            {
                "name": "Bukhara",
                "slug": "bukhara",
                "cat_slug": "unesco-heritage",
                "region": "Bukhara Province",
                "description": "An intact medieval oasis city with over 2,500 years of recorded history, featuring vaulted clay trading domes, ancient pond plazas shaded by mulberries, and hundreds of preserved madrasahs.",
                "latitude": 39.7681,
                "longitude": 64.4556,
                "budget_tier": "budget",
                "average_cost_per_day": 45.0,
                "recommended_duration_days": 3,
                "best_season": "March to May, September to November",
                "image_url": "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80"
                ],
                "is_featured": True,
                "places": [
                    {"name": "Po-i-Kalyan Complex", "slug": "poi-kalyan", "description": "Historic ensemble comprising the 46m Kalyan Minaret (which even Genghis Khan spared) and the grand Kalyan Mosque.", "latitude": 39.7758, "longitude": 64.4150, "entry_fee": 6.0},
                    {"name": "The Ark of Bukhara", "slug": "ark-of-bukhara", "description": "Colossal 5th-century fortified citadel that once housed the Emirs of Bukhara, Royal Coronation Court, and Mint.", "latitude": 39.7778, "longitude": 64.4111, "entry_fee": 5.0},
                    {"name": "Lyabi-Hauz Ensemble", "slug": "lyabi-hauz", "description": "Picturesque central water reservoir surrounded by 16th-century madrasahs and open-air teahouses (chaikhanas).", "latitude": 39.7731, "longitude": 64.4208, "entry_fee": 0.0}
                ]
            },
            {
                "name": "Khiva",
                "slug": "khiva",
                "cat_slug": "unesco-heritage",
                "region": "Xorazm Province",
                "description": "An open-air museum city enclosed within preserved crenellated mud-brick walls. Walking through Ichan Kala feels like stepping straight into the pages of One Thousand and One Nights.",
                "latitude": 41.3783,
                "longitude": 60.3639,
                "budget_tier": "budget",
                "average_cost_per_day": 40.0,
                "recommended_duration_days": 2,
                "best_season": "April to June, September to October",
                "image_url": "https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=800&q=80",
                "gallery": ["https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=800&q=80"],
                "is_featured": True,
                "places": [
                    {"name": "Ichan Kala Citadel", "slug": "ichan-kala", "description": "UNESCO World Heritage walled inner city with 50 historic monuments and 250 ancient folk dwellings.", "latitude": 41.3783, "longitude": 60.3600, "entry_fee": 12.0},
                    {"name": "Kalta Minor Minaret", "slug": "kalta-minor", "description": "Vibrant turquoise glazed stub minaret conceived to be the tallest in Central Asia, renowned for intricate mosaic patterns.", "latitude": 41.3775, "longitude": 60.3589, "entry_fee": 0.0},
                    {"name": "Juma Mosque", "slug": "juma-mosque-khiva", "description": "Unique hypostyle hall supported by 218 exquisitely hand-carved elm pillars dating back to the 10th century.", "latitude": 41.3786, "longitude": 60.3606, "entry_fee": 4.0}
                ]
            },
            {
                "name": "Shahrisabz",
                "slug": "shahrisabz",
                "cat_slug": "unesco-heritage",
                "region": "Qashqadaryo Province",
                "description": "The ancestral cradle of Emperor Timur, located at the foot of the snow-capped Zarafshan mountain range, displaying the gargantuan mosaic pylons of Ak-Saray Palace.",
                "latitude": 39.0558,
                "longitude": 66.8286,
                "budget_tier": "budget",
                "average_cost_per_day": 35.0,
                "recommended_duration_days": 2,
                "best_season": "May to October",
                "image_url": "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80",
                "is_featured": False,
                "places": [
                    {"name": "Ak-Saray Palace Ruins", "slug": "ak-saray-palace", "description": "Titanic 38-meter gate towers of Timur's imperial white summer palace with monumental Kufic inscriptions.", "latitude": 39.0600, "longitude": 66.8300, "entry_fee": 4.0}
                ]
            },
            {
                "name": "Chimgan",
                "slug": "chimgan",
                "cat_slug": "mountain-adventure",
                "region": "Tashkent Province (Western Tian Shan)",
                "description": "The alpine playground of Uzbekistan, known as the 'Uzbek Switzerland'. Features powder snow ski runs in winter and emerald hiking trails past tumbling waterfalls in summer.",
                "latitude": 41.5208,
                "longitude": 70.0097,
                "budget_tier": "moderate",
                "average_cost_per_day": 60.0,
                "recommended_duration_days": 3,
                "best_season": "Dec-Mar (Ski), Jun-Sep (Hike)",
                "image_url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
                "is_featured": True,
                "places": [
                    {"name": "Greater Chimgan Peak", "slug": "greater-chimgan", "description": "3,309-meter alpine summit providing 360-degree vistas across the Chatkal and Pskem mountain ranges.", "latitude": 41.4961, "longitude": 70.0547, "entry_fee": 0.0},
                    {"name": "Gulkam Gorges & Waterfalls", "slug": "gulkam-gorge", "description": "Exciting canyoning passage through narrow rock clefts with natural swimming pools and boulder scrambling.", "latitude": 41.5300, "longitude": 70.0200, "entry_fee": 2.0}
                ]
            },
            {
                "name": "Charvak",
                "slug": "charvak",
                "cat_slug": "lakes-recreation",
                "region": "Tashkent Province",
                "description": "A high-altitude turquoise alpine reservoir surrounded by dramatic mountain crags. Popular for water sports, paragliding over sparkling blue bays, and scenic shoreline yurt resorts.",
                "latitude": 41.6367,
                "longitude": 70.0433,
                "budget_tier": "moderate",
                "average_cost_per_day": 70.0,
                "recommended_duration_days": 2,
                "best_season": "June to September",
                "image_url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
                "is_featured": True,
                "places": [
                    {"name": "Yusufhona Paragliding Bay", "slug": "yusufhona-bay", "description": "Tandem paragliding take-off point offering bird's-eye views above turquoise waters and mountain ridgelines.", "latitude": 41.6400, "longitude": 70.0500, "entry_fee": 45.0}
                ]
            },
            {
                "name": "Fergana",
                "slug": "fergana",
                "cat_slug": "bazaars-gastronomy",
                "region": "Fergana Valley",
                "description": "The fertile, green heartland of the Fergana Valley. Shaded by centuries-old plane trees, it is the center of world-class handcrafted mulberry silk weaving and ceramic master workshops.",
                "latitude": 40.3864,
                "longitude": 71.7864,
                "budget_tier": "budget",
                "average_cost_per_day": 35.0,
                "recommended_duration_days": 2,
                "best_season": "April to June, September to October",
                "image_url": "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80",
                "is_featured": False,
                "places": [
                    {"name": "Yodgorlik Silk Factory (Margilan)", "slug": "yodgorlik-silk", "description": "Historic factory conserving centuries-old natural dyeing and manual loom weaving of royal Khan Atlas silk.", "latitude": 40.4739, "longitude": 71.7169, "entry_fee": 3.0}
                ]
            },
            {
                "name": "Andijan",
                "slug": "andijan",
                "cat_slug": "bazaars-gastronomy",
                "region": "Andijan Province",
                "description": "Historic Silk Road nexus and birthplace of Zahiruddin Babur, founder of the Mughal Empire. Celebrated for lively artisan quarters and traditional copper craftsmanship.",
                "latitude": 40.7821,
                "longitude": 72.3442,
                "budget_tier": "budget",
                "average_cost_per_day": 30.0,
                "recommended_duration_days": 2,
                "best_season": "April to May, September to November",
                "image_url": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
                "is_featured": False,
                "places": [
                    {"name": "Babur Memorial Park (Bog-i Babur)", "slug": "bogi-babur", "description": "Expansive hillside botanical memorial park and museum holding relics from the Timurid and Mughal periods.", "latitude": 40.7500, "longitude": 72.3600, "entry_fee": 2.0}
                ]
            },
            {
                "name": "Namangan",
                "slug": "namangan",
                "cat_slug": "bazaars-gastronomy",
                "region": "Namangan Province",
                "description": "Uzbekistan's vibrant 'City of Flowers', famous for its spectacular springtime flower festival, lush apple orchards, and the master blacksmiths of Chust producing national knives.",
                "latitude": 40.9983,
                "longitude": 71.6726,
                "budget_tier": "budget",
                "average_cost_per_day": 30.0,
                "recommended_duration_days": 2,
                "best_season": "May to June (Annual Flower Festival)",
                "image_url": "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80",
                "is_featured": False,
                "places": [
                    {"name": "Chust Knife-Making Workshops", "slug": "chust-knives", "description": "Centuries-old workshops of usto blacksmiths hand-forging high-carbon steel pitchaq knives with bone handles.", "latitude": 41.0000, "longitude": 71.2300, "entry_fee": 0.0}
                ]
            },
            {
                "name": "Termez",
                "slug": "termez",
                "cat_slug": "buddhist-antiquities",
                "region": "Surkhandarya Province",
                "description": "Southernmost Silk Road frontier town on the banks of the Amu Darya river, conserving priceless 1st-century Buddhist cave monasteries from the Greco-Bactrian and Kushan eras.",
                "latitude": 37.2242,
                "longitude": 67.2783,
                "budget_tier": "budget",
                "average_cost_per_day": 40.0,
                "recommended_duration_days": 3,
                "best_season": "October to April (Mild winter & spring)",
                "image_url": "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=800&q=80",
                "is_featured": True,
                "places": [
                    {"name": "Fayaz Tepe Buddhist Monastery", "slug": "fayaz-tepe", "description": "1st-century CE Kushan monastery complex featuring a hemispherical stupa and vibrant Gandharan wall paintings.", "latitude": 37.2861, "longitude": 67.1861, "entry_fee": 4.0},
                    {"name": "Termez Archaeological Museum", "slug": "termez-museum", "description": "Central Asia's premier provincial museum housing golden Bactrian artifacts, statues, and stone carvings.", "latitude": 37.2300, "longitude": 67.2800, "entry_fee": 5.0}
                ]
            },
            {
                "name": "Nukus",
                "slug": "nukus",
                "cat_slug": "desert-art",
                "region": "Republic of Karakalpakstan",
                "description": "The capital of Karakalpakstan, home to the extraordinary Savitsky Art Museum (dubbed the 'Louvre in the Sands'), protecting the world's second-largest collection of Russian avant-garde art.",
                "latitude": 42.4602,
                "longitude": 59.6166,
                "budget_tier": "moderate",
                "average_cost_per_day": 50.0,
                "recommended_duration_days": 2,
                "best_season": "April to May, September to October",
                "image_url": "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
                "is_featured": True,
                "places": [
                    {"name": "The Savitsky Art Museum", "slug": "savitsky-museum", "description": "World-famous art sanctuary safeguarding over 90,000 works of suppressed Soviet modernism and Karakalpak folk craft.", "latitude": 42.4650, "longitude": 59.6100, "entry_fee": 10.0},
                    {"name": "Mizdahkan Ancient Necropolis", "slug": "mizdahkan", "description": "Massive 2,000-year-old desert cemetery complex shrouded in myth with the Mausoleum of Mazlum Khan Slu.", "latitude": 42.4000, "longitude": 59.3900, "entry_fee": 2.0}
                ]
            },
            {
                "name": "Aral Sea",
                "slug": "aral-sea",
                "cat_slug": "desert-art",
                "region": "Ustyurt Plateau, Karakalpakstan",
                "description": "One of the planet's most haunting, dramatic landscapes. An expedition reveals towering limestone canyons of the Ustyurt Plateau and rusting trawlers marooned in the desert sands of Muynak.",
                "latitude": 44.5000,
                "longitude": 58.5000,
                "budget_tier": "moderate",
                "average_cost_per_day": 95.0,
                "recommended_duration_days": 3,
                "best_season": "May to June, September to October",
                "image_url": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
                "is_featured": True,
                "places": [
                    {"name": "Muynak Ship Cemetery", "slug": "muynak-ship-cemetery", "description": "Haunting collection of stranded fishing ships resting on dry seabed sands that once formed a thriving port.", "latitude": 43.7667, "longitude": 59.0333, "entry_fee": 0.0},
                    {"name": "Ustyurt Plateau Chinks & Canyons", "slug": "ustyurt-plateau", "description": "Surreal sheer chalk cliff walls dropping 200 meters into ancient dried salt basins resembling an alien planet.", "latitude": 44.2000, "longitude": 58.3000, "entry_fee": 0.0}
                ]
            }
        ]

        dest_objs = {}
        for d_info in destinations_data:
            cat = cat_objs.get(d_info["cat_slug"])
            dest = Destination(
                name=d_info["name"],
                slug=d_info["slug"],
                category_id=cat.id if cat else None,
                region=d_info["region"],
                description=d_info["description"],
                latitude=d_info["latitude"],
                longitude=d_info["longitude"],
                budget_tier=d_info["budget_tier"],
                average_cost_per_day=d_info["average_cost_per_day"],
                recommended_duration_days=d_info["recommended_duration_days"],
                best_season=d_info["best_season"],
                image_url=d_info["image_url"],
                gallery=d_info.get("gallery", [d_info["image_url"]]),
                is_featured=d_info["is_featured"]
            )
            session.add(dest)
            await session.flush()
            dest_objs[d_info["slug"]] = dest

            for p_info in d_info.get("places", []):
                place = Place(
                    destination_id=dest.id,
                    category_id=cat.id if cat else None,
                    name=p_info["name"],
                    slug=p_info["slug"],
                    description=p_info["description"],
                    latitude=p_info["latitude"],
                    longitude=p_info["longitude"],
                    entry_fee=p_info.get("entry_fee", 0.0),
                    image_url=d_info["image_url"]
                )
                session.add(place)

        # ==========================================
        # 7. RELATIONAL TRIPS, DAYS & ACTIVITIES
        # ==========================================
        trip_1 = Trip(
            user_id=traveler_1.id,
            destination_id=dest_objs["samarkand"].id,
            title="Samarkand 3-Day Architectural Wonder",
            destination="Samarkand",
            start_date=date.today() + timedelta(days=10),
            end_date=date.today() + timedelta(days=13),
            duration_days=3,
            estimated_budget=450.0,
            currency="USD",
            travelers_count=2,
            travel_style="Cultural Heritage",
            status="planned",
            is_public=True
        )
        session.add(trip_1)
        await session.flush()

        day_1 = TripDay(
            trip_id=trip_1.id,
            day_number=1,
            date=trip_1.start_date,
            title="Heart of Samarkand: Registan & Gur-e-Amir",
            daily_budget=150.0
        )
        session.add(day_1)
        await session.flush()

        session.add(TripActivity(
            trip_day_id=day_1.id,
            title="Registan Ensemble Guided Walking Tour",
            description="Examine the geometric tiles and madrasah courtyard architecture with audio guide.",
            location_name="Registan Square",
            time_slot="morning",
            time_start="09:30",
            duration_hours=2.5,
            estimated_cost=25.0,
            order_index=0
        ))
        session.add(TripActivity(
            trip_day_id=day_1.id,
            title="Traditional Samarkand Plov Lunch at Osh Markazi",
            description="Savor authentic yellow carrot and tender lamb plov cooked in massive cast-iron kazans.",
            location_name="Panjakent Road Osh Markazi",
            time_slot="afternoon",
            time_start="13:00",
            duration_hours=1.5,
            estimated_cost=15.0,
            order_index=1
        ))
        session.add(TripActivity(
            trip_day_id=day_1.id,
            title="Gur-e-Amir Sunset Illumination",
            description="Witness the golden hour lighting illuminate the fluted azure dome of Timur's tomb.",
            location_name="Gur-e-Amir Complex",
            time_slot="evening",
            time_start="18:00",
            duration_hours=2.0,
            estimated_cost=10.0,
            order_index=2
        ))

        # ==========================================
        # 8. COMMUNITY TRIPS & PARTICIPANTS
        # ==========================================
        comm_trip = CommunityTrip(
            creator_user_id=traveler_2.id,
            trip_id=trip_1.id,
            title="Silk Road Backpacking Cohort: Samarkand to Bukhara",
            destination="Samarkand & Bukhara",
            description="Looking for fellow cultural travelers and photographers to share private transport and local guides across Samarkand and Bukhara!",
            start_date=date.today() + timedelta(days=20),
            end_date=date.today() + timedelta(days=26),
            max_participants=6,
            current_participants_count=2,
            estimated_cost_per_person=320.0,
            currency="USD",
            status="open"
        )
        session.add(comm_trip)
        await session.flush()

        session.add(TripParticipant(
            community_trip_id=comm_trip.id,
            user_id=traveler_2.id,
            status="accepted",
            notes="Trip Leader"
        ))
        session.add(TripParticipant(
            community_trip_id=comm_trip.id,
            user_id=traveler_1.id,
            status="accepted",
            notes="Excited to capture architectural photographs!"
        ))

        # ==========================================
        # 9. BOOKINGS & REVIEWS
        # ==========================================
        booking_1 = Booking(
            user_id=traveler_1.id,
            agency_id=agency_1.id,
            package_id=pkg_1.id,
            service_title=pkg_1.title,
            start_date=date.today() + timedelta(days=15),
            end_date=date.today() + timedelta(days=22),
            travelers_count=2,
            final_price=1780.0,
            currency="USD",
            special_requests="Requesting vegetarian meals on train transfers.",
            status="confirmed"
        )
        session.add(booking_1)

        booking_2 = Booking(
            user_id=traveler_2.id,
            guide_id=guide_1.id,
            service_title="Private Samarkand Heritage Tour",
            start_date=date.today() + timedelta(days=11),
            travelers_count=1,
            final_price=75.0,
            currency="USD",
            special_requests="Focus on architectural tile preservation.",
            status="confirmed"
        )
        session.add(booking_2)

        # Reviews
        session.add(Review(
            user_id=traveler_1.id,
            destination_id=dest_objs["samarkand"].id,
            rating=5,
            comment="Registan Square at sunrise is a spiritual experience. Unbelievable preservation of 15th-century architecture."
        ))
        session.add(Review(
            user_id=traveler_2.id,
            guide_id=guide_1.id,
            rating=5,
            comment="Anvar is phenomenal! His explanation of the astronomical calculations at Ulugh Beg's observatory brought history alive."
        ))
        session.add(Review(
            user_id=traveler_1.id,
            agency_id=agency_1.id,
            rating=5,
            comment="Silk Road Voyages handled our Afrosiyob rail bookings seamlessly. Chauffeurs were punctual and professional."
        ))

        # ==========================================
        # 10. SOCIAL: FRIEND REQUESTS & MESSAGES
        # ==========================================
        session.add(FriendRequest(
            sender_id=traveler_1.id,
            receiver_id=traveler_2.id,
            status="accepted"
        ))

        conv = Conversation(
            participant_one_id=traveler_1.id,
            participant_two_id=traveler_2.id,
            last_message_at=datetime.utcnow()
        )
        session.add(conv)
        await session.flush()

        session.add(Message(
            conversation_id=conv.id,
            sender_id=traveler_1.id,
            content="Hi Sarah! Looking forward to exploring Bukhara's trading domes next week.",
            is_read=True
        ))
        session.add(Message(
            conversation_id=conv.id,
            sender_id=traveler_2.id,
            content="Same here David! Don't forget to visit the miniature painting masterclass at Lyabi-Hauz.",
            is_read=True
        ))

        # ==========================================
        # 11. NOTIFICATIONS
        # ==========================================
        session.add(Notification(
            user_id=traveler_1.id,
            type="booking_confirmed",
            title="Booking Confirmed!",
            content="Your booking for 'Golden Triangle: Tashkent, Samarkand & Bukhara' has been confirmed by Silk Road Voyages.",
            action_url="/bookings",
            entity_type="booking",
            entity_id=booking_1.id,
            is_read=True
        ))
        session.add(Notification(
            user_id=traveler_2.id,
            type="friend_accepted",
            title="Friend Request Accepted",
            content="David Miller accepted your connection request.",
            action_url="/community",
            entity_type="friend_request",
            is_read=False
        ))
        session.add(Notification(
            user_id=guide_user_1.id,
            type="review",
            title="New 5-Star Review!",
            content="Sarah Connor left you a 5-star review for your Samarkand tour.",
            action_url="/guides",
            entity_type="review",
            is_read=False
        ))

        # ==========================================
        # 12. ADMIN ACTIONS & REPORTS
        # ==========================================
        session.add(AdminAction(
            admin_user_id=admin.id,
            action_type="verify_guide",
            target_type="guide",
            target_id=guide_1.id,
            details="Verified State Tourism Committee license #UZ-TG-8492"
        ))
        session.add(AdminAction(
            admin_user_id=admin.id,
            action_type="verify_agency",
            target_type="agency",
            target_id=agency_1.id,
            details="Verified tour operator license and commercial registry"
        ))

        # Saved items
        session.add(SavedDestination(user_id=traveler_1.id, destination_id=dest_objs["bukhara"].id))
        session.add(SavedDestination(user_id=traveler_1.id, destination_id=dest_objs["khiva"].id))
        session.add(SavedTrip(user_id=traveler_2.id, trip_id=trip_1.id))

        await session.commit()
        logger.info("Successfully seeded all realistic Uzbekistan records!")

if __name__ == "__main__":
    asyncio.run(seed_database())
