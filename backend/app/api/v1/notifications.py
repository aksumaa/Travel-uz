from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional

from app.db.session import get_db
from app.models.user import User
from app.models.notification import Notification
from app.api.deps import get_current_user

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=dict)
async def list_notifications(
    unread_only: bool = False,
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Notification).where(Notification.user_id == current_user.id)
    if unread_only:
        query = query.where(Notification.is_read == False)
    query = query.order_by(Notification.created_at.desc()).limit(limit)

    res = await db.execute(query)
    items = res.scalars().all()

    unread_res = await db.execute(
        select(Notification).where(Notification.user_id == current_user.id, Notification.is_read == False)
    )
    unread_count = len(unread_res.scalars().all())

    notifications_list = [
        {
            "id": n.id,
            "type": n.type,
            "title": n.title,
            "content": n.content,
            "message": n.content,
            "is_read": n.is_read,
            "action_url": n.action_url,
            "link": n.action_url,
            "entity_type": n.entity_type,
            "entity_id": n.entity_id,
            "created_at": n.created_at.isoformat()
        }
        for n in items
    ]

    return {
        "unread_count": unread_count,
        "total": len(notifications_list),
        "notifications": notifications_list
    }

@router.patch("/{notification_id}/read", response_model=dict)
async def mark_notification_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Notification).where(Notification.id == notification_id))
    n = res.scalars().first()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found")

    # Server-side Authorization: User can only mark their own notification read
    if n.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden: You cannot modify another user's notification.")

    n.is_read = True
    db.add(n)
    await db.commit()
    return {"message": "Notification marked as read.", "id": n.id, "is_read": True}

@router.post("/read-all", response_model=dict)
async def mark_all_notifications_read(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Notification).where(Notification.user_id == current_user.id, Notification.is_read == False)
    )
    items = res.scalars().all()
    for n in items:
        n.is_read = True
        db.add(n)
    await db.commit()
    return {"message": f"All {len(items)} notifications marked as read."}
