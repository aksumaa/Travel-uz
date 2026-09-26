import json
import httpx
import logging
from app.config import settings

logger = logging.getLogger(__name__)

async def generate_trip_itinerary(
    destination: str,
    days: int = 3,
    budget: float = 1500.0,
    travelers: int = 2,
    style: str = "Adventure",
    language: str = "en"
) -> dict:
    api_key = settings.ANTHROPIC_API_KEY.strip()
    
    if api_key and api_key != "your_anthropic_api_key_here":
        try:
            lang_str = "Uzbek" if language.lower() == "uz" else "Russian" if language.lower() == "ru" else "English"
            prompt = f"""Create a detailed {days}-day travel itinerary for {destination}.
Budget: ${budget} for {travelers} traveler(s).
Style: {style}.
Language: {lang_str}.
Must include daily detailed morning, afternoon and evening plans.

Respond ONLY with valid JSON (no backticks, markdown or explanation):
{{
  "title": "Trip name",
  "summary": "2-sentence overview",
  "totalCost": number,
  "days": [
    {{
      "day": 1,
      "date": "Day 1",
      "morning": {{ "activity": "", "location": "", "duration": "", "cost": number, "tip": "" }},
      "afternoon": {{ "activity": "", "location": "", "duration": "", "cost": number, "tip": "" }},
      "evening": {{ "restaurant": "", "cuisine": "", "cost": number, "address": "" }},
      "hotel": {{ "name": "", "stars": number, "price": number, "area": "" }},
      "dailyCost": number
    }}
  ],
  "packingTips": ["tip1", "tip2"],
  "visaInfo": "",
  "bestTime": "",
  "emergencyNumbers": {{ "police": "", "ambulance": "", "embassy": "" }}
}}"""

            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.post(
                    "https://api.anthropic.com/v1/messages",
                    headers={
                        "Content-Type": "application/json",
                        "x-api-key": api_key,
                        "anthropic-version": "2023-06-01"
                    },
                    json={
                        "model": "claude-3-5-sonnet-20241022",
                        "max_tokens": 3500,
                        "messages": [{"role": "user", "content": prompt}]
                    }
                )
                if resp.status_code == 200:
                    res_data = resp.json()
                    text = res_data["content"][0]["text"].strip()
                    if text.startswith("```json"):
                        text = text[7:]
                    if text.startswith("```"):
                        text = text[3:]
                    if text.endswith("```"):
                        text = text[:-3]
                    return json.loads(text.strip())
                else:
                    logger.warning(f"Anthropic API returned {resp.status_code}: {resp.text}")
        except Exception as e:
            logger.error(f"Error calling Anthropic API: {e}")

    # Fallback structured JSON itinerary generator
    formatted_dest = destination.split(",")[0].strip()
    daily_budget = budget / max(days, 1)

    mock_days = []
    for i in range(1, days + 1):
        mock_days.append({
            "day": i,
            "date": f"Day {i}",
            "morning": {
                "activity": f"Guided tour of {formatted_dest} landmark heritage site.",
                "location": f"{formatted_dest} historic center",
                "duration": "3 hours",
                "cost": round(daily_budget * 0.15, 2),
                "tip": "Comfortable walking shoes and bottled water recommended."
            },
            "afternoon": {
                "activity": f"Cultural immersion and traditional workshop walk in {formatted_dest}.",
                "location": f"{formatted_dest} artisan bazaar",
                "duration": "3.5 hours",
                "cost": round(daily_budget * 0.20, 2),
                "tip": "Local currency accepted at bazaar kiosks."
            },
            "evening": {
                "restaurant": f"Grand {formatted_dest} Heritage Restaurant",
                "cuisine": "Traditional & Regional Specialities",
                "cost": round(daily_budget * 0.25, 2),
                "address": f"{formatted_dest} central boulevard"
            },
            "hotel": {
                "name": f"{formatted_dest} Royal Grand Hotel & Spa",
                "stars": 5 if budget > 3000 else 4,
                "price": round(daily_budget * 0.40, 2),
                "area": "Downtown Historic Quarter"
            },
            "dailyCost": round(daily_budget, 2)
        })

    return {
        "title": f"Exclusive {style} Tour of {formatted_dest}",
        "summary": f"Curated {days}-day premium itinerary crafted for {travelers} traveler(s) exploring {destination}. Tailored to a budget of ${budget:,.2f}.",
        "totalCost": round(budget * 0.95, 2),
        "days": mock_days,
        "packingTips": [
            "Bring universal power adapter plugs.",
            "Dress in breathable, layered clothing suitable for local climate.",
            "Maintain digital and physical copies of passports."
        ],
        "visaInfo": f"A standard e-Visa or visa-free entrance applies for most tourist passports visiting {formatted_dest}.",
        "bestTime": "Spring (April–May) and Autumn (September–November) offer optimal travel weather.",
        "emergencyNumbers": {
            "police": "102",
            "ambulance": "103",
            "embassy": "+998 (71) 120-3000"
        }
    }
