"""
Authentication service for HospiTrack
"""
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, Union
from sqlalchemy.orm import Session
from database import AdminUser, DoctorUser, NurseUser
import os

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def authenticate_user(db: Session, email: str, password: str) -> Optional[dict]:
    """Authenticate a user and return user info if valid"""
    
    # Check admin users
    admin = db.query(AdminUser).filter(AdminUser.email == email, AdminUser.is_active == True).first()
    if admin and verify_password(password, admin.password_hash):
        return {
            "id": admin.id,
            "name": admin.name,
            "email": admin.email,
            "role": "admin"
        }
    
    # Check doctor users
    doctor = db.query(DoctorUser).filter(DoctorUser.email == email, DoctorUser.is_active == True).first()
    if doctor and verify_password(password, doctor.password_hash):
        return {
            "id": doctor.id,
            "name": doctor.name,
            "email": doctor.email,
            "role": "doctor",
            "specialization": doctor.specialization,
            "department": doctor.department
        }
    
    # Check nurse users
    nurse = db.query(NurseUser).filter(NurseUser.email == email, NurseUser.is_active == True).first()
    if nurse and verify_password(password, nurse.password_hash):
        return {
            "id": nurse.id,
            "name": nurse.name,
            "email": nurse.email,
            "role": "nurse",
            "ward_assigned": nurse.ward_assigned,
            "shift": nurse.shift
        }
    
    return None

def create_user(db: Session, name: str, email: str, password: str, role: str, **kwargs) -> dict:
    """Create a new user based on role"""
    hashed_password = get_password_hash(password)
    
    if role == "admin":
        user = AdminUser(
            name=name,
            email=email,
            password_hash=hashed_password
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return {"id": user.id, "name": user.name, "email": user.email, "role": "admin"}
    
    elif role == "doctor":
        user = DoctorUser(
            name=name,
            email=email,
            password_hash=hashed_password,
            specialization=kwargs.get("specialization"),
            license_number=kwargs.get("license_number"),
            department=kwargs.get("department")
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return {"id": user.id, "name": user.name, "email": user.email, "role": "doctor"}
    
    elif role == "nurse":
        user = NurseUser(
            name=name,
            email=email,
            password_hash=hashed_password,
            ward_assigned=kwargs.get("ward_assigned"),
            shift=kwargs.get("shift"),
            certification_level=kwargs.get("certification_level")
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return {"id": user.id, "name": user.name, "email": user.email, "role": "nurse"}
    
    else:
        raise ValueError("Invalid role specified")

def user_exists(db: Session, email: str) -> bool:
    """Check if a user with the given email already exists"""
    admin_exists = db.query(AdminUser).filter(AdminUser.email == email).first() is not None
    doctor_exists = db.query(DoctorUser).filter(DoctorUser.email == email).first() is not None
    nurse_exists = db.query(NurseUser).filter(NurseUser.email == email).first() is not None
    
    return admin_exists or doctor_exists or nurse_exists

def create_default_users(db: Session):
    """Create default users for testing"""
    default_users = [
        {
            "name": "Admin User",
            "email": "admin@hospital.com",
            "password": "admin123",
            "role": "admin"
        },
        {
            "name": "Dr. Smith",
            "email": "doctor@hospital.com",
            "password": "doctor123",
            "role": "doctor",
            "specialization": "Cardiology",
            "department": "Cardiology",
            "license_number": "DOC001"
        },
        {
            "name": "Nurse Johnson",
            "email": "nurse@hospital.com",
            "password": "nurse123",
            "role": "nurse",
            "ward_assigned": "ICU",
            "shift": "Day",
            "certification_level": "RN"
        }
    ]
    
    for user_data in default_users:
        if not user_exists(db, user_data["email"]):
            try:
                create_user(db, **user_data)
                print(f"✅ Created default {user_data['role']}: {user_data['email']}")
            except Exception as e:
                print(f"❌ Error creating {user_data['role']}: {e}")
        else:
            print(f"ℹ️  User already exists: {user_data['email']}")
