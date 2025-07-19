"""
Simple FastAPI main application
"""
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database_simple import get_db, AdminUser, DoctorUser, NurseUser
from passlib.context import CryptContext
from pydantic import BaseModel

app = FastAPI(title="HospiTrack API", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Pydantic models
class LoginRequest(BaseModel):
    email: str
    password: str

@app.get("/")
def root():
    return {"message": "HospiTrack API is running"}

@app.get("/api/health/")
def health_check():
    return {
        "status": "healthy",
        "message": "HospiTrack API is running",
        "cors": "enabled"
    }

@app.post("/api/auth/login/")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    # Check admin users
    admin = db.query(AdminUser).filter(AdminUser.email == request.email).first()
    if admin and pwd_context.verify(request.password, admin.password_hash):
        return {
            "access": "admin_token",
            "refresh": "admin_refresh",
            "user": {
                "id": admin.id,
                "name": admin.name,
                "email": admin.email,
                "role": "admin"
            }
        }
    
    # Check doctor users
    doctor = db.query(DoctorUser).filter(DoctorUser.email == request.email).first()
    if doctor and pwd_context.verify(request.password, doctor.password_hash):
        return {
            "access": "doctor_token",
            "refresh": "doctor_refresh",
            "user": {
                "id": doctor.id,
                "name": doctor.name,
                "email": doctor.email,
                "role": "doctor"
            }
        }
    
    # Check nurse users
    nurse = db.query(NurseUser).filter(NurseUser.email == request.email).first()
    if nurse and pwd_context.verify(request.password, nurse.password_hash):
        return {
            "access": "nurse_token",
            "refresh": "nurse_refresh",
            "user": {
                "id": nurse.id,
                "name": nurse.name,
                "email": nurse.email,
                "role": "nurse"
            }
        }
    
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/dashboard/system-stats/")
def get_system_stats():
    return {
        "totalPatients": 0,
        "availableBeds": 10,
        "totalBeds": 20,
        "emergencyAlerts": 0,
        "staffOnDuty": 3,
        "totalStaff": 5
    }

@app.get("/api/dashboard/opd-stats/")
def get_opd_stats():
    return {
        "today": 5,
        "yesterday": 3,
        "thisWeek": 25,
        "lastWeek": 20,
        "thisMonth": 100,
        "lastMonth": 95
    }
