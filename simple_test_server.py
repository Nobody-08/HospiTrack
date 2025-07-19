#!/usr/bin/env python3
"""
Simple test server to verify connection
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

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

@app.get("/")
def root():
    return {"message": "Simple test server is working!"}

@app.get("/api/health/")
def health():
    return {"status": "healthy", "message": "Test server working"}

@app.post("/api/auth/login/")
def login(data: dict):
    return {
        "access": "test_token",
        "refresh": "test_refresh",
        "user": {
            "id": 1,
            "name": "Test User",
            "email": data.get("email", "test@example.com"),
            "role": "admin"
        }
    }

if __name__ == "__main__":
    print("🧪 Starting Simple Test Server...")
    print("📍 Server will run on http://localhost:8000")
    print("🔗 Test: http://localhost:8000/")
    print("🔗 Health: http://localhost:8000/api/health/")
    print("🔗 Login: http://localhost:8000/api/auth/login/")
    
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
