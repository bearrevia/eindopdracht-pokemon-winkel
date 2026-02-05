from pydantic import BaseModel, field_serializer
from typing import List, Optional
from datetime import datetime
from uuid import UUID


class OrderItemCreate(BaseModel):
    item_id: str
    product_name: str
    product_price: float
    quantity: int


class AddressCreate(BaseModel):
    street: str
    house_number: str
    postal_code: str
    city: str
    country: str = "Nederland"


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    address: AddressCreate


class OrderItemResponse(BaseModel):
    id: UUID
    product_name: str
    product_price: float
    quantity: int

    class Config:
        from_attributes = True

    @field_serializer('id')
    def serialize_id(self, id: UUID) -> str:
        return str(id)


class OrderResponse(BaseModel):
    id: UUID
    status: str
    total_amount: float
    street: str
    house_number: str
    postal_code: str
    city: str
    country: str
    created_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True

    @field_serializer('id')
    def serialize_id(self, id: UUID) -> str:
        return str(id)
