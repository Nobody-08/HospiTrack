#!/usr/bin/env python3
"""
Start server with --user package installation
"""
import os
import sys
import subprocess

def install_packages_user():
    """Install packages with --user flag"""
    print("📦 Installing packages with --user flag...")
    
    packages = [
        "fastapi==0.104.1",
        "uvicorn[standard]==0.24.0",
        "pydantic==1.10.13"
    ]
    
    try:
        for package in packages:
            print(f"Installing {package}...")
            subprocess.check_call([
                sys.executable, "-m", "pip", "install", "--user", "--upgrade", package
            ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        print("✅ Packages installed with --user!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install packages: {e}")
        return False

def create_working_server():
    """Create a working server without SQLAlchemy"""
    server_code = '''from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="HospiTrack API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    email: str
    password: str

USERS = {
    "admin@hospital.com": {"password": "admin123", "role": "admin", "name": "Admin User"},
    "doctor@hospital.com": {"password": "doctor123", "role": "doctor", "name": "Dr. Smith"},
    "nurse@hospital.com": {"password": "nurse123", "role": "nurse", "name": "Nurse Johnson"}
}

@app.get("/")
def root():
    return {"message": "HospiTrack API Working!"}

@app.get("/api/health/")
def health():
    return {"status": "healthy", "message": "API working", "cors": "enabled"}

@app.post("/api/auth/login/")
def login(request: LoginRequest):
    user = USERS.get(request.email)
    if user and user["password"] == request.password:
        return {
            "access": f"token_{user['role']}",
            "refresh": f"refresh_{user['role']}",
            "user": {
                "id": 1,
                "name": user["name"],
                "email": request.email,
                "role": user["role"]
            }
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/dashboard/system-stats/")
def system_stats():
    return {
        "totalPatients": 15,
        "availableBeds": 10,
        "totalBeds": 30,
        "emergencyAlerts": 2,
        "staffOnDuty": 12,
        "totalStaff": 18
    }

@app.get("/api/dashboard/opd-stats/")
def opd_stats():
    return {
        "today": 8,
        "yesterday": 6,
        "thisWeek": 45,
        "lastWeek": 38,
        "thisMonth": 180,
        "lastMonth": 165
    }

@app.get("/api/patients/")
def patients():
    return []

@app.get("/api/beds/")
def beds():
    return []

@app.get("/api/alerts/")
def alerts():
    return []

if __name__ == "__main__":
    print("🏥 HospiTrack Server Starting...")
    print("📍 http://localhost:8000")
    print("🔑 admin@hospital.com / admin123")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
'''
    
    with open("working_server.py", "w") as f:
        f.write(server_code)
    
    print("✅ Working server created!")

def start_server():
    """Start the server"""
    print("🚀 Starting server...")
    try:
        subprocess.run([sys.executable, "working_server.py"])
    except KeyboardInterrupt:
        print("\n✅ Server stopped")

def main():
    print("🏥 HospiTrack - User Install Method")
    print("=" * 40)
    
    if not install_packages_user():
        print("❌ Installation failed")
        return
    
    create_working_server()
    start_server()

if __name__ == "__main__":
    main()
