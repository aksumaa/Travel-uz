from fastapi import APIRouter, Depends, HTTPException, Query, status, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import or_, and_
from typing import List, Optional, Any
from datetime import datetime

from app.db.session import get_db
from app.models.user import User
from app.models.social import Conversation, Message
from app.api.deps import get_current_user
from app.services.notification_service import create_notification

router = APIRouter(prefix="/messages", tags=["Messages & Chat"])

@router.get("/conversations", response_model=List[dict])
async def list_conversations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Conversation)
        .options(
            selectinload(Conversation.participant_one),
            selectinload(Conversation.participant_two),
            selectinload(Conversation.messages)
        )
        .where(
            or_(
                Conversation.participant_one_id == current_user.id,
                Conversation.participant_two_id == current_user.id
            )
        )
        .order_by(Conversation.last_message_at.desc())
    )
    convs = res.scalars().all()

    out = []
    for c in convs:
        other_user = c.participant_two if c.participant_one_id == current_user.id else c.participant_one
        last_msg = c.messages[-1] if c.messages else None
        unread_count = sum(1 for m in c.messages if not m.is_read and m.sender_id != current_user.id)

        out.append({
            "id": c.id,
            "other_user": {
                "id": other_user.id,
                "name": other_user.name or other_user.email,
                "avatar": other_user.avatar
            } if other_user else None,
            "last_message": last_msg.content if last_msg else None,
            "last_message_at": c.last_message_at.isoformat() if c.last_message_at else None,
            "unread_count": unread_count
        })
    return out

@router.get("/{conversation_id}", response_model=List[dict])
async def get_conversation_messages(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(Conversation).where(Conversation.id == conversation_id))
    conv = res.scalars().first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Server-side Authorization: user must be a participant
    if conv.participant_one_id != current_user.id and conv.participant_two_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden: You are not a participant in this conversation.")

    msg_res = await db.execute(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
    )
    messages = msg_res.scalars().all()

    # Mark unread messages as read
    for m in messages:
        if m.sender_id != current_user.id and not m.is_read:
            m.is_read = True
            db.add(m)
    await db.commit()

    return [
        {
            "id": m.id,
            "conversation_id": m.conversation_id,
            "sender_id": m.sender_id,
            "content": m.content,
            "is_read": m.is_read,
            "created_at": m.created_at.isoformat()
        }
        for m in messages
    ]

@router.post("", response_model=dict)
async def send_message(
    msg_in: Any = Body(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    data = msg_in if isinstance(msg_in, dict) else msg_in.dict()
    content = (data.get("content") or data.get("text") or "").strip()
    if not content:
        raise HTTPException(status_code=400, detail="Message content cannot be empty.")

    conversation_id = data.get("conversation_id")
    recipient_id = data.get("recipient_id")

    if not conversation_id and not recipient_id:
        raise HTTPException(status_code=400, detail="Must specify conversation_id or recipient_id.")

    conv = None
    if conversation_id:
        c_res = await db.execute(select(Conversation).where(Conversation.id == conversation_id))
        conv = c_res.scalars().first()
        if not conv:
            raise HTTPException(status_code=404, detail="Conversation not found")
        if conv.participant_one_id != current_user.id and conv.participant_two_id != current_user.id:
            raise HTTPException(status_code=403, detail="Forbidden: You are not a participant.")
        target_id = conv.participant_two_id if conv.participant_one_id == current_user.id else conv.participant_one_id
    else:
        target_id = recipient_id
        # Find or create conversation
        c_res = await db.execute(
            select(Conversation).where(
                or_(
                    and_(Conversation.participant_one_id == current_user.id, Conversation.participant_two_id == target_id),
                    and_(Conversation.participant_one_id == target_id, Conversation.participant_two_id == current_user.id)
                )
            )
        )
        conv = c_res.scalars().first()
        if not conv:
            conv = Conversation(
                participant_one_id=current_user.id,
                participant_two_id=target_id,
                last_message_at=datetime.utcnow()
            )
            db.add(conv)
            await db.flush()

    new_msg = Message(
        conversation_id=conv.id,
        sender_id=current_user.id,
        content=content,
        is_read=False
    )
    db.add(new_msg)

    conv.last_message_at = datetime.utcnow()
    db.add(conv)
    await db.flush()

    # Generate NOTIFICATION: new message!
    await create_notification(
        db=db,
        user_id=target_id,
        notification_type="new_message",
        title=f"New Message from {current_user.name or current_user.email}",
        content=content[:100],
        action_url=f"/messages/{conv.id}",
        entity_type="message",
        entity_id=new_msg.id
    )

    await db.commit()
    await db.refresh(new_msg)

    return {
        "id": new_msg.id,
        "conversation_id": conv.id,
        "sender_id": current_user.id,
        "content": new_msg.content,
        "is_read": new_msg.is_read,
        "created_at": new_msg.created_at.isoformat()
    }
