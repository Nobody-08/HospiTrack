#!/usr/bin/env python3
"""
Test server on port 8001
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Server on port 8001 is working!"}

@app.get("/api/health/")
def health():
    return {"status": "healthy", "message": "Port 8001 server working"}

@app.post("/api/auth/login/")
def login(data: dict):
    return {
        "access": "test_token_8001",
        "refresh": "test_refresh_8001",
        "user": {
            "id": 1,
            "name": "Test User",
            "email": data.get("email", "test@example.com"),
            "role": "admin"
        }
    }

@app.get("/api/dashboard/system-stats/")
def system_stats():
    return {
        "totalPatients": 25,
        "availableBeds": 15,
        "totalBeds": 50,
        "emergencyAlerts": 3,
        "staffOnDuty": 12,
        "totalStaff": 25
    }

@app.get("/api/dashboard/opd-stats/")
def opd_stats():
    return {
        "today": 15,
        "yesterday": 12,
        "thisWeek": 85,
        "lastWeek": 78,
        "thisMonth": 340,
        "lastMonth": 320
    }

if __name__ == "__main__":
    print("🧪 Starting Test Server on Port 8001...")
    print("📍 Server will run on http://localhost:8001")
    print("🔗 Test: http://localhost:8001/")
    print("🔗 Health: http://localhost:8001/api/health/")
    print("🔗 Login: http://localhost:8001/api/auth/login/")
    print()
    print("⚠️  To use this server, update your frontend .env file:")
    print("   VITE_BACKEND_URL=http://localhost:8001/api")
    
    uvicorn.run(app, host="0.0.0.0", port=8001, log_level="info")
