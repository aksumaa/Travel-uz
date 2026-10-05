from sqlalchemy.ext.asyncio import AsyncSession
from app.models.notification import Notification
from typing import Optional

async def create_notification(
    db: AsyncSession,
    user_id: int,
    title: str = "",
    message: str = "",
    notification_type: str = "general",
    link: Optional[str] = None,
    action_url: Optional[str] = None,
    entity_type: Optional[str] = None,
    entity_id: Optional[int] = None,
    content: Optional[str] = None,
) -> Notification:
    """
    Creates and records a notification for a user.
    Handles flexible argument signatures.
    """
    final_content = content or message or title
    final_url = action_url or link
    final_title = title or "Notification"

    notification = Notification(
        user_id=user_id,
        type=notification_type,
        title=final_title,
        content=final_content,
        action_url=final_url,
        entity_type=entity_type,
        entity_id=entity_id,
        is_read=False
    )
    db.add(notification)
    try:
        await db.commit()
    except Exception:
        await db.rollback()
    return notification
