from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import or_, and_, func
from typing import List, Optional

from app.db.session import get_db
from app.models.user import User
from app.models.messaging import Conversation, Message
from app.schemas.messaging import (
    MessageSend, MessageOut, ConversationStart, ConversationOut
)
from app.api.deps import get_current_user
from app.services.notification_service import create_notification

router = APIRouter(prefix="/messages", tags=["Conversations & Messaging"])

@router.get("/conversations", response_model=List[ConversationOut])
async def list_conversations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(Conversation)
        .options(selectinload(Conversation.messages))
        .where(
            or_(
                Conversation.participant1_id == current_user.id,
                Conversation.participant2_id == current_user.id
            )
        )
        .order_by(Conversation.last_message_at.desc())
    )
    res = await db.execute(stmt)
    convs = res.scalars().all()

    out = []
    for c in convs:
        other_id = c.participant2_id if c.participant1_id == current_user.id else c.participant1_id
        u_res = await db.execute(select(User).where(User.id == other_id))
        other_user = u_res.scalars().first()

        last_msg = c.messages[-1].text if c.messages else None
        unread = sum(1 for m in c.messages if m.sender_id != current_user.id and not m.is_read)

        out.append(ConversationOut(
            id=c.id,
            recipient_id=other_id,
            recipient_name=other_user.name if other_user else f"Traveler #{other_id}",
            recipient_avatar=other_user.avatar if other_user else None,
            last_message=last_msg,
            last_message_at=c.last_message_at,
            unread_count=unread
        ))

    return out

@router.post("/conversations", response_model=ConversationOut)
async def start_or_get_conversation(
    conv_in: ConversationStart,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if conv_in.recipient_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot start conversation with yourself")

    target_res = await db.execute(select(User).where(User.id == conv_in.recipient_id))
    other_user = target_res.scalars().first()
    if not other_user:
        raise HTTPException(status_code=404, detail="Recipient user not found")

    p1, p2 = min(current_user.id, conv_in.recipient_id), max(current_user.id, conv_in.recipient_id)

    stmt = select(Conversation).options(selectinload(Conversation.messages)).where(
        Conversation.participant1_id == p1,
        Conversation.participant2_id == p2
    )
    res = await db.execute(stmt)
    conv = res.scalars().first()

    if not conv:
        conv = Conversation(
            participant1_id=p1,
            participant2_id=p2,
            last_message_at=datetime.utcnow()
        )
        db.add(conv)
        await db.commit()
        await db.refresh(conv)

    return ConversationOut(
        id=conv.id,
        recipient_id=other_user.id,
        recipient_name=other_user.name or f"Traveler #{other_user.id}",
        recipient_avatar=other_user.avatar,
        last_message=conv.messages[-1].text if (hasattr(conv, 'messages') and conv.messages) else None,
        last_message_at=conv.last_message_at,
        unread_count=0
    )

@router.get("/conversations/{conversation_id}", response_model=List[MessageOut])
async def get_conversation_messages(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Conversation).where(
        Conversation.id == conversation_id,
        or_(
            Conversation.participant1_id == current_user.id,
            Conversation.participant2_id == current_user.id
        )
    )
    res = await db.execute(stmt)
    conv = res.scalars().first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found or access denied")

    # Fetch messages
    msg_stmt = (
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
    )
    msg_res = await db.execute(msg_stmt)
    messages = msg_res.scalars().all()

    # Mark incoming messages as read
    need_commit = False
    for m in messages:
        if m.sender_id != current_user.id and not m.is_read:
            m.is_read = True
            db.add(m)
            need_commit = True
    if need_commit:
        await db.commit()

    out = []
    # Cache user names
    user_cache = {}
    for m in messages:
        if m.sender_id not in user_cache:
            u_r = await db.execute(select(User).where(User.id == m.sender_id))
            user_cache[m.sender_id] = u_r.scalars().first()
        u = user_cache[m.sender_id]

        out.append(MessageOut(
            id=m.id,
            conversation_id=m.conversation_id,
            sender_id=m.sender_id,
            sender_name=u.name if u else "User",
            sender_avatar=u.avatar if u else None,
            text=m.text,
            is_read=m.is_read,
            created_at=m.created_at
        ))

    return out

@router.post("/conversations/{conversation_id}/send", response_model=MessageOut)
async def send_message(
    conversation_id: int,
    msg_in: MessageSend,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not msg_in.text.strip():
        raise HTTPException(status_code=400, detail="Message text cannot be empty")

    stmt = select(Conversation).where(
        Conversation.id == conversation_id,
        or_(
            Conversation.participant1_id == current_user.id,
            Conversation.participant2_id == current_user.id
        )
    )
    res = await db.execute(stmt)
    conv = res.scalars().first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found or access denied")

    new_msg = Message(
        conversation_id=conversation_id,
        sender_id=current_user.id,
        text=msg_in.text.strip(),
        is_read=False,
        created_at=datetime.utcnow()
    )
    db.add(new_msg)

    conv.last_message_at = datetime.utcnow()
    db.add(conv)
    await db.commit()
    await db.refresh(new_msg)

    # Notify recipient
    recipient_id = conv.participant2_id if conv.participant1_id == current_user.id else conv.participant1_id
    await create_notification(
        db,
        user_id=recipient_id,
        title="New Message",
        message=f"{current_user.name or 'A traveler'}: {new_msg.text[:50]}",
        notification_type="message",
        link="/messages"
    )

    return MessageOut(
        id=new_msg.id,
        conversation_id=new_msg.conversation_id,
        sender_id=new_msg.sender_id,
        sender_name=current_user.name,
        sender_avatar=current_user.avatar,
        text=new_msg.text,
        is_read=new_msg.is_read,
        created_at=new_msg.created_at
    )

@router.get("/unread-count", response_model=dict)
async def get_unread_messages_count(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Find all conversations the user is in
    c_stmt = select(Conversation.id).where(
        or_(
            Conversation.participant1_id == current_user.id,
            Conversation.participant2_id == current_user.id
        )
    )
    c_res = await db.execute(c_stmt)
    c_ids = c_res.scalars().all()

    if not c_ids:
        return {"unread_count": 0}

    # Count unread messages not sent by current user
    m_stmt = select(func.count(Message.id)).where(
        Message.conversation_id.in_(c_ids),
        Message.sender_id != current_user.id,
        Message.is_read == False
    )
    m_res = await db.execute(m_stmt)
    count = m_res.scalar() or 0

    return {"unread_count": count}
