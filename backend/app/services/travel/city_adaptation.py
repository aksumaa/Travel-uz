import logging
from typing import Dict, Any, List, Optional
from app.schemas.travel import CityAdaptationResponse

logger = logging.getLogger(__name__)

# Universal base categories supported globally across TripMind
UNIVERSAL_CATEGORIES = [
    "attraction",
    "museum",
    "restaurant",
    "cafe",
    "shopping",
    "entertainment",
    "pharmacy",
    "hospital",
    "atm",
    "transport",
    "tourist_info"
]

# Curated global destination profiles
CITY_PROFILES: Dict[str, Dict[str, Any]] = {
    "paris": {
        "city_name": "Paris",
        "country": "France",
        "timezone": "Europe/Paris",
        "currency": "EUR",
        "currency_symbol": "€",
        "transit_modes": [
            {"id": "metro_rer", "name": "Metro & RER (RATP)", "type": "rail", "icon": "train", "ticket_price_eur": 2.15},
            {"id": "bus", "name": "City Bus", "type": "bus", "icon": "bus", "ticket_price_eur": 2.15},
            {"id": "velib", "name": "Vélib Bike Share", "type": "bike", "icon": "bike", "base_price_eur": 3.00},
            {"id": "taxi", "name": "Taxi Parisien / G7 / Uber", "type": "taxi", "icon": "car", "base_price_eur": 3.00, "per_km_eur": 1.60}
        ],
        "fare_heuristics": {
            "currency": "EUR",
            "taxi_base_fare": 3.00,
            "taxi_per_km": 1.60,
            "transit_single_ticket": 2.15,
            "min_taxi_fare": 7.30
        },
        "category_localization": {
            "attraction": {"title": "Monuments & Heritage", "search_terms": ["monument", "palace", "landmark", "château"]},
            "museum": {"title": "Art Museums & Galleries", "search_terms": ["musée", "art gallery", "exhibition"]},
            "restaurant": {"title": "Bistros & Brasseries", "search_terms": ["bistro", "brasserie", "french restaurant"]},
            "cafe": {"title": "Sidewalk Cafes & Patisseries", "search_terms": ["café", "pâtisserie", "boulangerie", "croissant"]},
            "shopping": {"title": "Grand Boulevards & Boutiques", "search_terms": ["boutique", "galeries", "marche aux puces"]},
            "entertainment": {"title": "Opera, Cabaret & Theaters", "search_terms": ["opera", "theatre", "cabaret", "concert hall"]},
            "pharmacy": {"title": "Pharmacie (Green Cross)", "search_terms": ["pharmacie", "parapharmacie"]},
            "hospital": {"title": "Hôpital & Urgences", "search_terms": ["hopital", "urgences medicales", "clinique"]},
            "atm": {"title": "Distributeur Automatique (ATM)", "search_terms": ["dab", "distributeur", "banque", "bureau de change"]},
            "transport": {"title": "Metro & RER Stations", "search_terms": ["metro", "rer", "gare", "station"]},
            "tourist_info": {"title": "Office de Tourisme", "search_terms": ["office de tourisme", "point info"]}
        }
    },
    "samarkand": {
        "city_name": "Samarkand",
        "country": "Uzbekistan",
        "timezone": "Asia/Samarkand",
        "currency": "UZS",
        "currency_symbol": "soʻm",
        "transit_modes": [
            {"id": "taxi_yandex", "name": "Yandex Go / Local Taxi", "type": "taxi", "icon": "car", "base_price_usd": 1.00, "per_km_usd": 0.35},
            {"id": "tram", "name": "Samarkand Tram (Line 1 & 2)", "type": "tram", "icon": "train", "ticket_price_usd": 0.15},
            {"id": "marshrutka", "name": "Marshrutka & City Bus", "type": "bus", "icon": "bus", "ticket_price_usd": 0.15},
            {"id": "highspeed_train", "name": "Afrosiyob Express (Station)", "type": "rail", "icon": "train", "ticket_price_usd": 12.00}
        ],
        "fare_heuristics": {
            "currency": "USD",
            "taxi_base_fare": 1.00,
            "taxi_per_km": 0.35,
            "transit_single_ticket": 0.15,
            "min_taxi_fare": 1.20
        },
        "category_localization": {
            "attraction": {"title": "Silk Road Madrasahs & Mausoleums", "search_terms": ["madrasah", "mausoleum", "registan", "historic site"]},
            "museum": {"title": "Historical & Archaeological Museums", "search_terms": ["museum", "archaeological site", "observatory"]},
            "restaurant": {"title": "Chaykhanas & National Cuisine", "search_terms": ["chaykhana", "osh", "plov center", "national food", "shashlik"]},
            "cafe": {"title": "Tea Houses & Modern Coffee", "search_terms": ["tea house", "chaykhana", "coffee shop", "halva cafe"]},
            "shopping": {"title": "Oriental Bazaars & Silk Crafts", "search_terms": ["bazaar", "siab bazaar", "silk workshop", "carpet factory"]},
            "entertainment": {"title": "Cultural Shows & Registan Light Show", "search_terms": ["registan light show", "theatre", "folk performance"]},
            "pharmacy": {"title": "Dorixona / Apteka (24/7)", "search_terms": ["dorixona", "apteka", "pharmacy"]},
            "hospital": {"title": "City Hospitals & Clinics", "search_terms": ["shifoxona", "poliklinika", "hospital", "clinic"]},
            "atm": {"title": "Bankomat & Currency Exchange", "search_terms": ["bankomat", "atm", "valyuta ayirboshlash", "currency exchange"]},
            "transport": {"title": "Train Station & Tram Stops", "search_terms": ["samarkand vokzal", "tram", "bus terminal"]},
            "tourist_info": {"title": "Tourist Information Center", "search_terms": ["tourist information", "visit samarkand"]}
        }
    },
    "tashkent": {
        "city_name": "Tashkent",
        "country": "Uzbekistan",
        "timezone": "Asia/Tashkent",
        "currency": "UZS",
        "currency_symbol": "soʻm",
        "transit_modes": [
            {"id": "metro", "name": "Tashkent Metro (Artistic Underground)", "type": "metro", "icon": "train", "ticket_price_usd": 0.18},
            {"id": "taxi_yandex", "name": "Yandex Go Taxi", "type": "taxi", "icon": "car", "base_price_usd": 1.20, "per_km_usd": 0.40},
            {"id": "bus", "name": "Tashkent Modern Electric Buses", "type": "bus", "icon": "bus", "ticket_price_usd": 0.15}
        ],
        "fare_heuristics": {
            "currency": "USD",
            "taxi_base_fare": 1.20,
            "taxi_per_km": 0.40,
            "transit_single_ticket": 0.18,
            "min_taxi_fare": 1.50
        },
        "category_localization": {
            "attraction": {"title": "Architectural Landmarks & Squares", "search_terms": ["square", "monument", "tashkent tv tower", "chorsu"]},
            "museum": {"title": "State Museums & Galleries", "search_terms": ["state museum", "fine arts", "history museum"]},
            "restaurant": {"title": "Central Asian Centers & Dining", "search_terms": ["besh qozon", "plov center", "national cuisine", "restaurant"]},
            "cafe": {"title": "Specialty Coffee & Urban Bakeries", "search_terms": ["coffee shop", "bakery", "cafe"]},
            "shopping": {"title": "Traditional Bazaars & Shopping Malls", "search_terms": ["chorsu bazaar", "mall", "artisan center"]},
            "entertainment": {"title": "Navoi Opera Theater & Parks", "search_terms": ["opera", "theater", "magic city", "park"]},
            "pharmacy": {"title": "Dorixona / Apteka (24h)", "search_terms": ["dorixona", "apteka", "pharmacy"]},
            "hospital": {"title": "Medical Centers & Emergency", "search_terms": ["medical center", "hospital", "clinic"]},
            "atm": {"title": "Bankomat & International Exchange", "search_terms": ["bankomat", "atm", "exchange"]},
            "transport": {"title": "Tashkent Metro Stations", "search_terms": ["metro station", "railway station", "airport"]},
            "tourist_info": {"title": "Tashkent Tourism Center", "search_terms": ["tourist info", "visit tashkent"]}
        }
    },
    "tokyo": {
        "city_name": "Tokyo",
        "country": "Japan",
        "timezone": "Asia/Tokyo",
        "currency": "JPY",
        "currency_symbol": "¥",
        "transit_modes": [
            {"id": "jr_metro", "name": "Tokyo Metro & JR Yamanote", "type": "metro", "icon": "train", "ticket_price_jpy": 210},
            {"id": "taxi", "name": "Tokyo JapanTaxi / Go", "type": "taxi", "icon": "car", "base_price_jpy": 500, "per_km_jpy": 400}
        ],
        "fare_heuristics": {
            "currency": "JPY",
            "taxi_base_fare": 500,
            "taxi_per_km": 400,
            "transit_single_ticket": 210,
            "min_taxi_fare": 500
        },
        "category_localization": {
            "attraction": {"title": "Shrines, Temples & Skyscraper Observatories", "search_terms": ["shrine", "temple", "tower", "observatory"]},
            "museum": {"title": "National Museums & Digital Art", "search_terms": ["national museum", "teamlab", "art museum"]},
            "restaurant": {"title": "Ramen, Izakayas & Michelin Dining", "search_terms": ["ramen", "izakaya", "sushi", "restaurant"]},
            "cafe": {"title": "Kissaten & Matcha Cafes", "search_terms": ["cafe", "kissaten", "matcha", "coffee"]},
            "shopping": {"title": "Anime Hubs & Department Stores", "search_terms": ["department store", "akihabara", "ginza", "market"]},
            "entertainment": {"title": "Arcades, Kabuki & Karaoke", "search_terms": ["karaoke", "arcade", "kabuki", "theater"]},
            "pharmacy": {"title": "Drugstores (Matsumoto Kiyoshi)", "search_terms": ["drugstore", "pharmacy"]},
            "hospital": {"title": "General Hospitals & Clinics", "search_terms": ["hospital", "clinic", "medical center"]},
            "atm": {"title": "7-Eleven ATM (Global Cards)", "search_terms": ["7-bank atm", "atm", "currency exchange"]},
            "transport": {"title": "JR & Subway Stations", "search_terms": ["station", "subway", "shinkansen"]},
            "tourist_info": {"title": "Tourist Information Centers", "search_terms": ["tourist info", "tic"]}
        }
    },
    "new york": {
        "city_name": "New York",
        "country": "United States",
        "timezone": "America/New_York",
        "currency": "USD",
        "currency_symbol": "$",
        "transit_modes": [
            {"id": "mta_subway", "name": "MTA Subway (OMNY Contactless)", "type": "subway", "icon": "train", "ticket_price_usd": 2.90},
            {"id": "yellow_cab", "name": "NYC Yellow Cab / Uber / Lyft", "type": "taxi", "icon": "car", "base_price_usd": 3.50, "per_km_usd": 2.00},
            {"id": "citi_bike", "name": "Citi Bike", "type": "bike", "icon": "bike", "base_price_usd": 4.79}
        ],
        "fare_heuristics": {
            "currency": "USD",
            "taxi_base_fare": 3.50,
            "taxi_per_km": 2.00,
            "transit_single_ticket": 2.90,
            "min_taxi_fare": 7.00
        },
        "category_localization": {
            "attraction": {"title": "Landmarks & Observatories", "search_terms": ["landmark", "observation deck", "statue", "park"]},
            "museum": {"title": "World-Class Art & Science Museums", "search_terms": ["museum", "metropolitan", "moma", "guggenheim"]},
            "restaurant": {"title": "Diverse Diners & Global Cuisine", "search_terms": ["restaurant", "diner", "pizzeria", "delicatessen"]},
            "cafe": {"title": "Espresso Bars & Bagel Cafes", "search_terms": ["coffee shop", "bagel shop", "cafe", "bakery"]},
            "shopping": {"title": "Fifth Ave & SoHo Boutiques", "search_terms": ["boutique", "shopping center", "soho", "market"]},
            "entertainment": {"title": "Broadway Shows & Comedy Clubs", "search_terms": ["broadway", "comedy club", "music hall"]},
            "pharmacy": {"title": "Duane Reade / CVS Pharmacy", "search_terms": ["pharmacy", "duane reade", "cvs", "walgreens"]},
            "hospital": {"title": "Emergency Care & Medical Centers", "search_terms": ["hospital", "urgent care", "medical center"]},
            "atm": {"title": "Chase / BoA ATMs & Foreign Exchange", "search_terms": ["atm", "bank", "currency exchange"]},
            "transport": {"title": "Subway Stations & Grand Central", "search_terms": ["subway station", "penn station", "grand central"]},
            "tourist_info": {"title": "NYC Visitor Information Kiosks", "search_terms": ["visitor center", "kiosk"]}
        }
    }
}

# Coordinate-to-city detector
def detect_city_from_coordinates(lat: float, lng: float) -> str:
    """Return key in CITY_PROFILES matching coordinates or 'generic'."""
    if 39.4 <= lat <= 39.9 and 66.7 <= lng <= 67.2:
        return "samarkand"
    if 41.1 <= lat <= 41.5 and 69.1 <= lng <= 69.5:
        return "tashkent"
    if 48.7 <= lat <= 49.0 and 2.1 <= lng <= 2.6:
        return "paris"
    if 35.5 <= lat <= 35.9 and 139.5 <= lng <= 140.0:
        return "tokyo"
    if 40.5 <= lat <= 40.9 and -74.3 <= lng <= -73.7:
        return "new york"
    return "generic"

def get_city_adaptation(city_or_location: Optional[str] = None, lat: Optional[float] = None, lng: Optional[float] = None) -> CityAdaptationResponse:
    """
    Returns city adaptation metadata. Adapts universal categories to local context,
    providing city-specific transit modes, local names, and fare metrics.
    """
    matched_key = None
    if city_or_location:
        c_lower = city_or_location.strip().lower()
        for key in CITY_PROFILES:
            if key in c_lower:
                matched_key = key
                break

    if not matched_key and lat is not None and lng is not None:
        matched_key = detect_city_from_coordinates(lat, lng)

    if matched_key and matched_key in CITY_PROFILES:
        profile = CITY_PROFILES[matched_key]
        cats = []
        loc_map = profile.get("category_localization", {})
        for cat in UNIVERSAL_CATEGORIES:
            info = loc_map.get(cat, {})
            cats.append({
                "category": cat,
                "localized_title": info.get("title", cat.replace("_", " ").title()),
                "search_hint": ", ".join(info.get("search_terms", [cat]))
            })
        return CityAdaptationResponse(
            city_name=profile["city_name"],
            country=profile["country"],
            timezone=profile["timezone"],
            currency=profile["currency"],
            currency_symbol=profile["currency_symbol"],
            transit_modes=profile["transit_modes"],
            fare_heuristics=profile["fare_heuristics"],
            categories=cats
        )

    # Generic Global fallback
    generic_categories = [
        {"category": c, "localized_title": c.replace("_", " ").title(), "search_hint": c}
        for c in UNIVERSAL_CATEGORIES
    ]
    return CityAdaptationResponse(
        city_name=city_or_location.title() if city_or_location else "Global",
        country="International",
        timezone="UTC",
        currency="USD",
        currency_symbol="$",
        transit_modes=[
            {"id": "walking", "name": "Walking", "type": "foot", "icon": "footprints"},
            {"id": "public_transit", "name": "Local Public Transit", "type": "transit", "icon": "bus"},
            {"id": "taxi", "name": "Local Taxi / Rideshare", "type": "taxi", "icon": "car"}
        ],
        fare_heuristics={
            "currency": "USD",
            "taxi_base_fare": 2.50,
            "taxi_per_km": 1.50,
            "transit_single_ticket": 2.00,
            "min_taxi_fare": 5.00
        },
        categories=generic_categories
    )
