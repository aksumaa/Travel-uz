import httpx
import logging
from typing import Optional
from app.services.encryption import decrypt_string

logger = logging.getLogger(__name__)

async def send_telegram_lead_notification(
    encrypted_bot_token: Optional[str],
    chat_id: Optional[str],
    client_name: str,
    client_contact: str,
    itinerary_title: str,
    share_token: str,
    notes: Optional[str] = None
) -> bool:
    if not encrypted_bot_token or not chat_id:
        return False
    
    bot_token = decrypt_string(encrypted_bot_token)
    if not bot_token:
        return False

    message = (
        f"🌟 <b>NEW LEAD RECEIVED!</b> 🌟\n\n"
        f"👤 <b>Client:</b> {client_name}\n"
        f"📞 <b>Contact:</b> {client_contact}\n"
        f"🗺️ <b>Trip:</b> {itinerary_title}\n"
    )
    if notes:
        message += f"📝 <b>Notes:</b> {notes}\n"
    message += f"\n🔗 <a href='http://localhost:5173/trip/{share_token}'>View Itinerary</a>"

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "HTML",
        "disable_web_page_preview": False
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                logger.info("Successfully sent Telegram notification")
                return True
            else:
                logger.warning(f"Telegram API error {resp.status_code}: {resp.text}")
                return False
    except Exception as e:
        logger.error(f"Failed to send Telegram notification: {e}")
        return False
