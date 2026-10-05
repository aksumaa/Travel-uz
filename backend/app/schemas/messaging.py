from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class MessageSend(BaseModel):
    text: str

class MessageOut(BaseModel):
    id: int
    conversation_id: int
    sender_id: int
    sender_name: Optional[str] = None
    sender_avatar: Optional[str] = None
    text: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ConversationStart(BaseModel):
    recipient_id: int

class ConversationOut(BaseModel):
    id: int
    recipient_id: int
    recipient_name: Optional[str] = None
    recipient_avatar: Optional[str] = None
    last_message: Optional[str] = None
    last_message_at: datetime
    unread_count: int = 0

    class Config:
        from_attributes = True
