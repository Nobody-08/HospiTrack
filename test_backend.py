#!/usr/bin/env python3
"""
Quick Test Backend for HospiTrack CORS Testing
Run this to test if CORS is working properly with your frontend.

Requirements:
pip install fastapi uvicorn python-multipart

Usage:
python test_backend.py

Then test your frontend login at http://localhost:5174
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="HospiTrack Test API", version="1.0.0")

# CORS Configuration - This fixes the CORS issue
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

# Request/Response models
class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str = "doctor"

class LoginResponse(BaseModel):
    access: str
    refresh: str
    user: dict

# Mock user data for testing
MOCK_USERS = {
    "admin@hospital.com": {"name": "Admin User", "role": "admin", "password": "admin123"},
    "doctor@hospital.com": {"name": "Dr. Smith", "role": "doctor", "password": "doctor123"},
    "nurse@hospital.com": {"name": "Nurse Johnson", "role": "nurse", "password": "nurse123"},
    "demo@hospital.com": {"name": "Demo User", "role": "admin", "password": "password"},
}

@app.get("/")
async def root():
    return {
        "message": "HospiTrack Test API is running!",
        "status": "CORS should be working now",
        "test_users": {
            "admin": "admin@hospital.com / admin123",
            "doctor": "doctor@hospital.com / doctor123", 
            "nurse": "nurse@hospital.com / nurse123",
            "demo": "demo@hospital.com / password"
        }
    }

@app.get("/api/health/")
async def health_check():
    return {"status": "healthy", "message": "API is working", "cors": "enabled"}

@app.post("/api/auth/login/", response_model=LoginResponse)
async def login(request: LoginRequest):
    print(f"Login attempt: {request.email}")
    
    user = MOCK_USERS.get(request.email)
    if not user or user["password"] != request.password:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    return LoginResponse(
        access="mock_jwt_token_" + user["role"],
        refresh="mock_refresh_token",
        user={
            "id": 1,
            "name": user["name"],
            "email": request.email,
            "role": user["role"]
        }
    )

@app.post("/api/auth/admin/register/")
async def register_admin(request: RegisterRequest):
    print(f"Admin registration: {request.name} - {request.email}")
    return {"message": f"Admin account created for {request.name}"}

@app.post("/api/auth/doctor/register/")
async def register_doctor(request: RegisterRequest):
    print(f"Doctor registration: {request.name} - {request.email}")
    return {"message": f"Doctor account created for {request.name}"}

@app.post("/api/auth/nurse/register/")
async def register_nurse(request: RegisterRequest):
    print(f"Nurse registration: {request.name} - {request.email}")
    return {"message": f"Nurse account created for {request.name}"}

# Mock endpoints for testing
@app.get("/api/patients/")
async def get_patients():
    return {"patients": [], "message": "Mock patients endpoint working"}

@app.get("/api/beds/")
async def get_beds():
    return {"beds": [], "message": "Mock beds endpoint working"}

@app.get("/api/dashboard/system-stats/")
async def get_system_stats():
    return {
        "totalPatients": 0,
        "availableBeds": 10,
        "totalBeds": 20,
        "emergencyAlerts": 0,
        "staffOnDuty": 5,
        "totalStaff": 15
    }

if __name__ == "__main__":
    print("🏥 Starting HospiTrack Test Backend...")
    print("🌐 CORS is configured for http://localhost:5174")
    print("📋 Test users available:")
    for email, user in MOCK_USERS.items():
        print(f"   {user['role']}: {email} / {user['password']}")
    print("🚀 Starting server on http://localhost:8000")
    
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
