#!/usr/bin/env python3
"""
Fixed server startup script with compatible SQLAlchemy version
"""
import os
import sys
import subprocess

def install_compatible_packages():
    """Install compatible package versions"""
    print("📦 Installing compatible packages...")
    
    # Uninstall potentially problematic packages first
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "uninstall", "-y", "sqlalchemy", "pydantic"], 
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except:
        pass
    
    # Install specific compatible versions
    packages = [
        "fastapi==0.104.1",
        "uvicorn[standard]==0.24.0",
        "sqlalchemy==1.4.53",  # Use 1.4.x for compatibility
        "passlib[bcrypt]==1.7.4",
        "python-jose[cryptography]==3.3.0",
        "python-multipart==0.0.6",
        "pydantic==1.10.13"  # Use 1.x for compatibility
    ]
    
    for package in packages:
        try:
            print(f"Installing {package}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", package], 
                                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except subprocess.CalledProcessError:
            print(f"❌ Failed to install {package}")
            return False
    
    print("✅ Compatible packages installed!")
    return True

def setup_simple_database():
    """Setup database with simple configuration"""
    print("🗄️ Setting up database...")
    try:
        # Add the my_fastapi_app directory to Python path
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'my_fastapi_app'))
        
        # Use the simple database configuration
        from database_simple import create_tables, clear_all_data, SessionLocal, AdminUser, DoctorUser, NurseUser
        from passlib.context import CryptContext
        
        # Clear and create
        clear_all_data()
        create_tables()
        
        # Create password hasher
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
        # Create default users
        db = SessionLocal()
        try:
            # Create admin
            admin = AdminUser(
                name="Admin User",
                email="admin@hospital.com",
                password_hash=pwd_context.hash("admin123")
            )
            db.add(admin)
            
            # Create doctor
            doctor = DoctorUser(
                name="Dr. Smith",
                email="doctor@hospital.com",
                password_hash=pwd_context.hash("doctor123"),
                specialization="Cardiology",
                department="Cardiology"
            )
            db.add(doctor)
            
            # Create nurse
            nurse = NurseUser(
                name="Nurse Johnson",
                email="nurse@hospital.com",
                password_hash=pwd_context.hash("nurse123"),
                ward_assigned="ICU",
                shift="Day"
            )
            db.add(nurse)
            
            db.commit()
            print("✅ Default users created!")
            
        finally:
            db.close()
        
        print("✅ Database setup complete!")
        return True
        
    except Exception as e:
        print(f"❌ Database setup failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def create_simple_main():
    """Create a simple main.py that works"""
    main_content = '''"""
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
'''
    
    with open("my_fastapi_app/main_simple.py", "w") as f:
        f.write(main_content)
    
    print("✅ Simple main.py created!")

def start_simple_server():
    """Start the simple FastAPI server"""
    print("🚀 Starting simple FastAPI server...")
    
    try:
        # Change to the FastAPI app directory
        os.chdir("my_fastapi_app")
        
        # Import and run
        import uvicorn
        
        print("📍 Server starting on: http://localhost:8000")
        print("📚 API Documentation: http://localhost:8000/docs")
        print("🔗 Health Check: http://localhost:8000/api/health/")
        print()
        print("🔑 Login Credentials:")
        print("   Admin: admin@hospital.com / admin123")
        print("   Doctor: doctor@hospital.com / doctor123")
        print("   Nurse: nurse@hospital.com / nurse123")
        print()
        print("⚠️  Press Ctrl+C to stop the server")
        print("=" * 50)
        
        # Start the server
        uvicorn.run(
            "main_simple:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
        
    except KeyboardInterrupt:
        print("\n✅ Server stopped by user")
    except Exception as e:
        print(f"❌ Server startup failed: {e}")

def main():
    print("🏥 HospiTrack Fixed Server Startup")
    print("=" * 50)

    # Install compatible packages
    if not install_compatible_packages():
        print("❌ Package installation failed")
        return

    # Setup database
    if not setup_simple_database():
        print("❌ Database setup failed")
        return

    # Create simple main
    create_simple_main()

    # Start server
    start_simple_server()

if __name__ == "__main__":
    main()
