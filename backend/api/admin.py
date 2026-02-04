from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from database import get_db
from models.user import User
from schemas.user import UserResponse
from utils.auth import hash_password

router = APIRouter(prefix="/admin", tags=["admin"])


# Maak admin user aan (alleen via backend/command line)
@router.post("/create-admin", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_admin(
    email: str,
    password: str,
    secret_key: str,
    db: Session = Depends(get_db)
):
    # Beveilig met een secret key
    import os
    if secret_key != os.getenv("ADMIN_SECRET_KEY", "super-secret-admin-key"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Ongeldige secret key"
        )
    
    # Check of email al bestaat
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is al geregistreerd"
        )
    
    # Maak admin user aan
    admin_user = User(
        email=email,
        hashed_password=hash_password(password),
        is_active=True,
        is_admin=True
    )
    
    db.add(admin_user)
    db.commit()
    db.refresh(admin_user)
    
    return admin_user


# Maak bestaande user admin (alleen via backend)
@router.put("/make-admin/{user_id}", response_model=UserResponse)
def make_user_admin(
    user_id: UUID,
    secret_key: str,
    db: Session = Depends(get_db)
):
    import os
    if secret_key != os.getenv("ADMIN_SECRET_KEY", "super-secret-admin-key"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Ongeldige secret key"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User niet gevonden"
        )
    
    user.is_admin = True
    db.commit()
    db.refresh(user)
    
    return user