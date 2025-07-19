from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from database import get_db
from auth_service import authenticate_user, create_user, user_exists, create_access_token
from datetime import timedelta

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    specialization: Optional[str] = None
    license_number: Optional[str] = None
    department: Optional[str] = None
    ward_assigned: Optional[str] = None
    shift: Optional[str] = None
    certification_level: Optional[str] = None

# Authentication endpoints matching frontend expectations
@router.post("/login/")
async def login(login_request: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, login_request.email, login_request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]},
        expires_delta=access_token_expires
    )

    return {
        "access": access_token,
        "refresh": access_token,  # For simplicity, using same token
        "user": user
    }

@router.post("/logout/")
async def logout():
    return {"message": "Logout successful"}

@router.post("/refresh/")
async def refresh_token(refresh_data: dict):
    return {"access_token": "new_fake_token", "message": "Token refreshed"}

# Role-specific registration endpoints
@router.post("/admin/register/")
async def register_admin(user_data: RegisterRequest, db: Session = Depends(get_db)):
    if user_exists(db, user_data.email):
        raise HTTPException(status_code=400, detail="User with this email already exists")

    try:
        user = create_user(db, user_data.name, user_data.email, user_data.password, "admin")
        return {"message": "Admin registered successfully", "user": user}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating admin: {str(e)}")

@router.post("/doctor/register/")
async def register_doctor(user_data: RegisterRequest, db: Session = Depends(get_db)):
    if user_exists(db, user_data.email):
        raise HTTPException(status_code=400, detail="User with this email already exists")

    try:
        user = create_user(
            db, user_data.name, user_data.email, user_data.password, "doctor",
            specialization=user_data.specialization,
            license_number=user_data.license_number,
            department=user_data.department
        )
        return {"message": "Doctor registered successfully", "user": user}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating doctor: {str(e)}")

@router.post("/nurse/register/")
async def register_nurse(user_data: RegisterRequest, db: Session = Depends(get_db)):
    if user_exists(db, user_data.email):
        raise HTTPException(status_code=400, detail="User with this email already exists")

    try:
        user = create_user(
            db, user_data.name, user_data.email, user_data.password, "nurse",
            ward_assigned=user_data.ward_assigned,
            shift=user_data.shift,
            certification_level=user_data.certification_level
        )
        return {"message": "Nurse registered successfully", "user": user}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating nurse: {str(e)}")

@router.post("/logout/")
async def logout():
    return {"message": "Logout successful"}

@router.post("/refresh/")
async def refresh_token():
    return {"message": "Token refresh not implemented yet"}
