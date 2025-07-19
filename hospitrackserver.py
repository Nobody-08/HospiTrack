from fastapi import FastAPI, HTTPException
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
    return {"message": "HospiTrack API is running successfully"}

@app.get("/api/health/")
def health_check():
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

@app.post("/api/auth/admin/register/")
def register_admin(request: dict):
    return {"message": f"Admin registered: {request.get('name', 'Unknown')}"}

@app.post("/api/auth/doctor/register/")
def register_doctor(request: dict):
    return {"message": f"Doctor registered: {request.get('name', 'Unknown')}"}

@app.post("/api/auth/nurse/register/")
def register_nurse(request: dict):
    return {"message": f"Nurse registered: {request.get('name', 'Unknown')}"}

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

@app.get("/api/dashboard/bed-occupancy/")
def bed_occupancy():
    return {
        "icu": {"total": 10, "occupied": 8, "available": 2},
        "general": {"total": 15, "occupied": 10, "available": 5},
        "emergency": {"total": 5, "occupied": 3, "available": 2}
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
    return [
        {"id": 1, "name": "John Doe", "age": 45, "ward": "ICU", "bed_number": "101", "condition": "Critical"},
        {"id": 2, "name": "Jane Smith", "age": 32, "ward": "General", "bed_number": "205", "condition": "Stable"}
    ]

@app.get("/api/beds/")
def get_beds():
    return [
        {"id": 1, "number": "101", "ward": "ICU", "status": "Occupied", "patient_name": "John Doe"},
        {"id": 2, "number": "102", "ward": "ICU", "status": "Available", "patient_name": None},
        {"id": 3, "number": "205", "ward": "General", "status": "Occupied", "patient_name": "Jane Smith"}
    ]

@app.get("/api/alerts/")
def get_alerts():
    return [
        {"id": 1, "title": "Equipment Check", "message": "Ventilator needs maintenance", "severity": "high", "ward": "ICU", "resolved": False}
    ]

if __name__ == "__main__":
    print("HospiTrack Server Starting...")
    print("Server: http://localhost:8000")
    print("Health: http://localhost:8000/api/health/")
    print("Login: admin@hospital.com / admin123")
    print("Press Ctrl+C to stop")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
