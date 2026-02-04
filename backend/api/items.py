from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from database import get_db
from models.items import Item
from models.user import User
from schemas.items import ItemCreate, ItemUpdate, ItemResponse
from utils.auth import get_admin_user

router = APIRouter(prefix="/items", tags=["items"])


# GET - Alle items ophalen (publiek)
@router.get("/", response_model=List[ItemResponse])
def get_all_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = db.query(Item).filter(Item.is_active == True).offset(skip).limit(limit).all()
    return items


# GET - Specifiek item ophalen (publiek)
@router.get("/{item_id}", response_model=ItemResponse)
def get_item(item_id: UUID, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item niet gevonden"
        )
    return item


# POST - Nieuw item aanmaken (alleen admin)
@router.post("/", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
def create_item(
    item_data: ItemCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    new_item = Item(
        name=item_data.name,
        description=item_data.description,
        price=item_data.price,
        image_url=item_data.image_url,
        category=item_data.category,
        stock=item_data.stock,
        is_active=True
    )
    
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    
    return new_item


# PUT - Item updaten (alleen admin)
@router.put("/{item_id}", response_model=ItemResponse)
def update_item(
    item_id: UUID,
    item_data: ItemUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    item = db.query(Item).filter(Item.id == item_id).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item niet gevonden"
        )
    
    update_data = item_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)
    
    db.commit()
    db.refresh(item)
    
    return item


# DELETE - Item verwijderen (alleen admin)
@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(
    item_id: UUID,
    db: Session = Depends(get_db),
    admin: User = Depends(get_admin_user)
):
    item = db.query(Item).filter(Item.id == item_id).first()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item niet gevonden"
        )
    
    db.delete(item)
    db.commit()
    
    return None