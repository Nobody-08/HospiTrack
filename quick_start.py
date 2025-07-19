#!/usr/bin/env python3
"""
Quick start script for HospiTrack - Minimal setup
"""
import os
import sys
import subprocess

def install_packages():
    """Install required packages"""
    print("📦 Installing packages...")
    try:
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", 
            "fastapi==0.104.1", 
            "uvicorn[standard]==0.24.0",
            "sqlalchemy==1.4.53",
            "passlib[bcrypt]==1.7.4",
            "pydantic==1.10.13"
        ])
        print("✅ Packages installed!")
        return True
    except:
        print("❌ Package installation failed")
        return False

def create_minimal_app():
    """Create minimal working FastAPI app"""
    app_code = '''from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "HospiTrack API is running"}

@app.get("/api/health/")
def health():
    return {"status": "healthy", "message": "API working"}

@app.post("/api/auth/login/")
def login(data: dict):
    email = data.get("email", "")
    password = data.get("password", "")
    
    # Simple authentication check
    valid_users = {
        "admin@hospital.com": {"password": "admin123", "role": "admin", "name": "Admin User"},
        "doctor@hospital.com": {"password": "doctor123", "role": "doctor", "name": "Dr. Smith"},
        "nurse@hospital.com": {"password": "nurse123", "role": "nurse", "name": "Nurse Johnson"}
    }
    
    user = valid_users.get(email)
    if user and user["password"] == password:
        return {
            "access": f"token_{user['role']}",
            "refresh": f"refresh_{user['role']}",
            "user": {
                "id": 1,
                "name": user["name"],
                "email": email,
                "role": user["role"]
            }
        }
    
    return {"error": "Invalid credentials"}, 401

@app.get("/api/dashboard/system-stats/")
def system_stats():
    return {
        "totalPatients": 5,
        "availableBeds": 15,
        "totalBeds": 25,
        "emergencyAlerts": 2,
        "staffOnDuty": 8,
        "totalStaff": 12
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
def get_patients():
    return []

@app.get("/api/beds/")
def get_beds():
    return []

@app.get("/api/alerts/")
def get_alerts():
    return []
'''
    
    os.makedirs("my_fastapi_app", exist_ok=True)
    with open("my_fastapi_app/minimal_app.py", "w") as f:
        f.write(app_code)
    
    print("✅ Minimal app created!")

def start_server():
    """Start the server"""
    print("🚀 Starting server...")
    try:
        os.chdir("my_fastapi_app")
        import uvicorn
        
        print("📍 Server: http://localhost:8000")
        print("🔗 Health: http://localhost:8000/api/health/")
        print("🔑 Login: admin@hospital.com / admin123")
        print("⚠️  Press Ctrl+C to stop")
        print("=" * 40)
        
        uvicorn.run("minimal_app:app", host="0.0.0.0", port=8000, reload=True)
        
    except KeyboardInterrupt:
        print("\n✅ Server stopped")
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    print("🏥 HospiTrack Quick Start")
    print("=" * 30)
    
    if not install_packages():
        return
    
    create_minimal_app()
    start_server()

if __name__ == "__main__":
    main()
