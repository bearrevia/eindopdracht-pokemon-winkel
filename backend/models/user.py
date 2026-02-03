# filepath: c:\Users\DylandeBeerLinden-IT\OneDrive - Linden-IT\Bureaublad\pokemonwinkel\eindopdracht-pokemon-winkel\backend\models\user.py
from sqlalchemy import Column, String, Boolean, text
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.dialects.postgresql import UUID

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        nullable=False,
        server_default=text("gen_random_uuid()"),
    )
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    is_active = Column(Boolean, nullable=True)

    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")