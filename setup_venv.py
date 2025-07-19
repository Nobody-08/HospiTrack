#!/usr/bin/env python3
"""
Setup virtual environment and run HospiTrack
"""
import os
import sys
import subprocess
import venv

def create_virtual_environment():
    """Create a virtual environment"""
    print("🔧 Creating virtual environment...")
    
    venv_path = "hospitrack_venv"
    
    # Remove existing venv if it exists
    if os.path.exists(venv_path):
        import shutil
        shutil.rmtree(venv_path)
    
    # Create new venv
    venv.create(venv_path, with_pip=True)
    
    # Get the python executable path
    if os.name == 'nt':  # Windows
        python_exe = os.path.join(venv_path, "Scripts", "python.exe")
        pip_exe = os.path.join(venv_path, "Scripts", "pip.exe")
    else:  # Unix/Linux/Mac
        python_exe = os.path.join(venv_path, "bin", "python")
        pip_exe = os.path.join(venv_path, "bin", "pip")
    
    print("✅ Virtual environment created!")
    return python_exe, pip_exe

def install_packages_in_venv(pip_exe):
    """Install packages in virtual environment"""
    print("📦 Installing packages in virtual environment...")
    
    packages = [
        "fastapi==0.104.1",
        "uvicorn[standard]==0.24.0",
        "sqlalchemy==1.4.53",
        "passlib[bcrypt]==1.7.4",
        "pydantic==1.10.13",
        "python-multipart"
    ]
    
    try:
        for package in packages:
            print(f"Installing {package}...")
            subprocess.check_call([pip_exe, "install", package], 
                                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        print("✅ All packages installed in virtual environment!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install packages: {e}")
        return False

def create_simple_server():
    """Create a simple server file"""
    server_code = '''#!/usr/bin/env python3
"""
Simple HospiTrack Server
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

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

class LoginRequest(BaseModel):
    email: str
    password: str

# Mock user database
USERS = {
    "admin@hospital.com": {"password": "admin123", "role": "admin", "name": "Admin User"},
    "doctor@hospital.com": {"password": "doctor123", "role": "doctor", "name": "Dr. Smith"},
    "nurse@hospital.com": {"password": "nurse123", "role": "nurse", "name": "Nurse Johnson"}
}

@app.get("/")
def root():
    return {"message": "HospiTrack API is running successfully!"}

@app.get("/api/health/")
def health_check():
    return {
        "status": "healthy",
        "message": "HospiTrack API is running",
        "cors": "enabled"
    }

@app.post("/api/auth/login/")
def login(request: LoginRequest):
    user = USERS.get(request.email)
    if user and user["password"] == request.password:
        return {
            "access": f"token_{user['role']}_{request.email}",
            "refresh": f"refresh_{user['role']}",
            "user": {
                "id": 1,
                "name": user["name"],
                "email": request.email,
                "role": user["role"]
            }
        }
    
    raise HTTPException(status_code=401, detail="Invalid email or password")

@app.post("/api/auth/admin/register/")
def register_admin(request: dict):
    return {"message": f"Admin account created for {request.get('name', 'Unknown')}"}

@app.post("/api/auth/doctor/register/")
def register_doctor(request: dict):
    return {"message": f"Doctor account created for {request.get('name', 'Unknown')}"}

@app.post("/api/auth/nurse/register/")
def register_nurse(request: dict):
    return {"message": f"Nurse account created for {request.get('name', 'Unknown')}"}

@app.get("/api/dashboard/system-stats/")
def get_system_stats():
    return {
        "totalPatients": 12,
        "availableBeds": 8,
        "totalBeds": 25,
        "emergencyAlerts": 3,
        "staffOnDuty": 15,
        "totalStaff": 20,
        "systemUptime": "99.9%",
        "avgResponseTime": "1.2s"
    }

@app.get("/api/dashboard/bed-occupancy/")
def get_bed_occupancy():
    return {
        "icu": {"total": 10, "occupied": 8, "available": 2},
        "general": {"total": 15, "occupied": 10, "available": 5},
        "emergency": {"total": 5, "occupied": 4, "available": 1}
    }

@app.get("/api/dashboard/patient-stats/")
def get_patient_stats():
    return {
        "totalPatients": 12,
        "criticalPatients": 3,
        "stablePatients": 8,
        "dischargesToday": 1
    }

@app.get("/api/dashboard/opd-stats/")
def get_opd_stats():
    return {
        "today": 15,
        "yesterday": 12,
        "thisWeek": 85,
        "lastWeek": 78,
        "thisMonth": 340,
        "lastMonth": 320
    }

@app.get("/api/patients/")
def get_patients():
    return [
        {
            "id": 1,
            "name": "John Doe",
            "age": 45,
            "ward": "ICU",
            "bed_number": "101",
            "condition": "Critical",
            "admitted_date": "2025-01-15"
        },
        {
            "id": 2,
            "name": "Jane Smith",
            "age": 32,
            "ward": "General",
            "bed_number": "205",
            "condition": "Stable",
            "admitted_date": "2025-01-16"
        }
    ]

@app.get("/api/beds/")
def get_beds():
    return [
        {"id": 1, "number": "101", "ward": "ICU", "status": "Occupied", "patient_name": "John Doe"},
        {"id": 2, "number": "102", "ward": "ICU", "status": "Available", "patient_name": None},
        {"id": 3, "number": "205", "ward": "General", "status": "Occupied", "patient_name": "Jane Smith"},
        {"id": 4, "number": "206", "ward": "General", "status": "Available", "patient_name": None}
    ]

@app.get("/api/alerts/")
def get_alerts():
    return [
        {
            "id": 1,
            "title": "Equipment Check Required",
            "message": "Ventilator in ICU Room 101 needs maintenance",
            "severity": "high",
            "ward": "ICU",
            "created_at": "2025-01-19 10:30",
            "resolved": False
        }
    ]

if __name__ == "__main__":
    print("🏥 Starting HospiTrack Server...")
    print("📍 Server: http://localhost:8000")
    print("📚 API Docs: http://localhost:8000/docs")
    print("🔗 Health: http://localhost:8000/api/health/")
    print()
    print("🔑 Login Credentials:")
    print("   Admin: admin@hospital.com / admin123")
    print("   Doctor: doctor@hospital.com / doctor123")
    print("   Nurse: nurse@hospital.com / nurse123")
    print()
    print("⚠️  Press Ctrl+C to stop the server")
    print("=" * 50)
    
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
'''
    
    with open("simple_server.py", "w") as f:
        f.write(server_code)
    
    print("✅ Simple server created!")

def run_server_in_venv(python_exe):
    """Run the server in virtual environment"""
    print("🚀 Starting server in virtual environment...")
    
    try:
        subprocess.run([python_exe, "simple_server.py"])
    except KeyboardInterrupt:
        print("\n✅ Server stopped by user")
    except Exception as e:
        print(f"❌ Server error: {e}")

def main():
    print("🏥 HospiTrack Virtual Environment Setup")
    print("=" * 50)
    
    # Create virtual environment
    python_exe, pip_exe = create_virtual_environment()
    
    # Install packages
    if not install_packages_in_venv(pip_exe):
        return
    
    # Create simple server
    create_simple_server()
    
    # Run server
    run_server_in_venv(python_exe)

if __name__ == "__main__":
    main()
