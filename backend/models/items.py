from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, text
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime

from models.user import Base


class Item(Base):
    __tablename__ = "items"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        nullable=False,
        server_default=text("gen_random_uuid()"),
    )
    name = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    image_url = Column(String, nullable=True)
    category = Column(String, nullable=True, index=True)  # bijv. "plush", "clothing", "accessories"
    stock = Column(Integer, nullable=False, default=0)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, nullable=True, onupdate=datetime.utcnow)