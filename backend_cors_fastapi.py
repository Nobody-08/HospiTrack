# FastAPI CORS Configuration
# Add this to your FastAPI main.py file

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

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
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# For development only - allow all origins (REMOVE IN PRODUCTION!)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# Pydantic models
class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginResponse(BaseModel):
    access: str
    refresh: str
    user: dict

# Example endpoints
@app.post("/api/auth/login/", response_model=LoginResponse)
async def login(request: LoginRequest):
    # Your authentication logic here
    # For now, return a mock response
    if request.email and request.password:
        return LoginResponse(
            access="mock_jwt_token",
            refresh="mock_refresh_token",
            user={
                "id": 1,
                "name": "Test User",
                "email": request.email,
                "role": "admin"
            }
        )
    else:
        raise HTTPException(status_code=400, detail="Invalid credentials")

@app.post("/api/auth/admin/register/")
async def register_admin(request: RegisterRequest):
    # Your registration logic here
    return {"message": f"Admin account created for {request.name}"}

@app.post("/api/auth/doctor/register/")
async def register_doctor(request: RegisterRequest):
    # Your registration logic here
    return {"message": f"Doctor account created for {request.name}"}

@app.post("/api/auth/nurse/register/")
async def register_nurse(request: RegisterRequest):
    # Your registration logic here
    return {"message": f"Nurse account created for {request.name}"}

# Health check endpoint
@app.get("/api/health/")
async def health_check():
    return {"status": "healthy", "message": "HospiTrack API is running"}

# Root endpoint
@app.get("/")
async def root():
    return {"message": "HospiTrack API", "docs": "/docs"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
