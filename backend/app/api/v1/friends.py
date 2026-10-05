from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import or_, and_
from typing import List, Optional
from datetime import datetime

from app.db.session import get_db
from app.models.user import User
from app.models.social import FriendRequest, Conversation, Message
from app.schemas.social import (
    FriendRequestIn, FriendRequestOut, UserProfileOut
)
from app.api.deps import get_current_user
from app.services.notification_service import create_notification

router = APIRouter(prefix="/friends", tags=["Friends & Social"])

@router.post("/request", response_model=FriendRequestOut)
async def send_friend_request(
    req_in: FriendRequestIn,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if req_in.receiver_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot send friend request to yourself."
        )

    # Check receiver exists
    rec_res = await db.execute(select(User).where(User.id == req_in.receiver_id))
    receiver = rec_res.scalars().first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Target user not found.")

    # Check if request already exists
    existing = await db.execute(
        select(FriendRequest).where(
            or_(
                and_(FriendRequest.sender_id == current_user.id, FriendRequest.receiver_id == req_in.receiver_id),
                and_(FriendRequest.sender_id == req_in.receiver_id, FriendRequest.receiver_id == current_user.id)
            )
        )
    )
    req = existing.scalars().first()
    if req:
        if req.status == "accepted":
            raise HTTPException(status_code=400, detail="You are already friends.")
        elif req.status == "pending":
            raise HTTPException(status_code=400, detail="Friend request is already pending.")
        else:
            # Reopen rejected request
            req.sender_id = current_user.id
            req.receiver_id = req_in.receiver_id
            req.status = "pending"
            db.add(req)
            await db.commit()
            await db.refresh(req)
    else:
        req = FriendRequest(
            sender_id=current_user.id,
            receiver_id=req_in.receiver_id,
            status="pending"
        )
        db.add(req)
        await db.commit()
        await db.refresh(req)

    # Generate NOTIFICATION for friend request!
    await create_notification(
        db=db,
        user_id=receiver.id,
        notification_type="friend_request",
        title="New Friend Request",
        content=f"{current_user.name or current_user.email} sent you a friend request.",
        action_url="/community",
        entity_type="friend_request",
        entity_id=req.id
    )
    await db.commit()

    return FriendRequestOut(
        id=req.id,
        requester_id=current_user.id,
        receiver_id=receiver.id,
        requester_name=current_user.name or current_user.email,
        requester_avatar=current_user.avatar,
        receiver_name=receiver.name or receiver.email,
        receiver_avatar=receiver.avatar,
        status=req.status,
        created_at=req.created_at
    )

@router.patch("/request/{request_id}")
async def update_friend_request(
    request_id: int,
    action: str = "accept", # accept or reject
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(select(FriendRequest).where(FriendRequest.id == request_id))
    req = res.scalars().first()
    if not req:
        raise HTTPException(status_code=404, detail="Friend request not found.")

    # Authorization: Only the receiver can accept/reject the request
    if req.receiver_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden: You are not authorized to respond to this request.")

    new_status = "accepted" if action.lower() in ["accept", "accepted"] else "rejected"
    req.status = new_status
    db.add(req)
    await db.flush()

    # Generate NOTIFICATION on friend accepted
    if new_status == "accepted":
        await create_notification(
            db=db,
            user_id=req.sender_id,
            notification_type="friend_accepted",
            title="Friend Request Accepted",
            content=f"{current_user.name or current_user.email} accepted your friend request!",
            action_url="/community",
            entity_type="friend_request",
            entity_id=req.id
        )

        # Create conversation if not exists
        conv_res = await db.execute(
            select(Conversation).where(
                or_(
                    and_(Conversation.participant_one_id == req.sender_id, Conversation.participant_two_id == req.receiver_id),
                    and_(Conversation.participant_one_id == req.receiver_id, Conversation.participant_two_id == req.sender_id)
                )
            )
        )
        if not conv_res.scalars().first():
            conv = Conversation(
                participant_one_id=req.sender_id,
                participant_two_id=req.receiver_id,
                last_message_at=datetime.utcnow()
            )
            db.add(conv)

    await db.commit()
    return {"message": f"Friend request {new_status} successfully.", "status": new_status}

@router.get("", response_model=List[UserProfileOut])
async def list_friends(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(FriendRequest).where(
            and_(
                or_(FriendRequest.sender_id == current_user.id, FriendRequest.receiver_id == current_user.id),
                FriendRequest.status == "accepted"
            )
        )
    )
    friend_records = res.scalars().all()
    friends = []
    for f in friend_records:
        friend_id = f.receiver_id if f.sender_id == current_user.id else f.sender_id
        u_res = await db.execute(select(User).options(selectinload(User.profile)).where(User.id == friend_id))
        friend_user = u_res.scalars().first()
        if friend_user:
            friends.append(UserProfileOut(
                id=friend_user.id,
                name=friend_user.name,
                avatar=friend_user.avatar,
                bio=friend_user.profile.bio if friend_user.profile else None,
                travel_style=friend_user.profile.travel_style if friend_user.profile else None,
                location=friend_user.profile.country if friend_user.profile else "Uzbekistan",
                friendship_status="friends"
            ))
    return friends
