from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from database import get_db
from models.orders import Order, OrderItem
from models.user import User
from schemas.orders import OrderCreate, OrderResponse
from utils.auth import get_current_user

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("/", response_model=OrderResponse)
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Maak een nieuwe bestelling aan"""
    # Bereken totaal
    total = sum(item.product_price * item.quantity for item in order_data.items)

    # Maak order aan
    db_order = Order(
        user_id=current_user.id,
        total_amount=total,
        street=order_data.address.street,
        house_number=order_data.address.house_number,
        postal_code=order_data.address.postal_code,
        city=order_data.address.city,
        country=order_data.address.country,
        status="pending",
    )
    db.add(db_order)
    db.flush()  # Om de order ID te krijgen

    # Voeg order items toe
    for item in order_data.items:
        db_item = OrderItem(
            order_id=db_order.id,
            item_id=UUID(item.item_id),
            product_name=item.product_name,
            product_price=item.product_price,
            quantity=item.quantity,
        )
        db.add(db_item)

    db.commit()
    db.refresh(db_order)

    return db_order


@router.get("/", response_model=List[OrderResponse])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Haal alle bestellingen van de ingelogde gebruiker op"""
    orders = (
        db.query(Order)
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return orders


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Haal een specifieke bestelling op"""
    order = db.query(Order).filter(Order.id == UUID(order_id)).first()

    if not order:
        raise HTTPException(status_code=404, detail="Bestelling niet gevonden")

    if order.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Geen toegang tot deze bestelling")

    return order
