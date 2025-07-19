#!/usr/bin/env python3
"""
Complete HospiTrack FastAPI Server with Real Database Integration
"""
import uvicorn
import os
import subprocess
import sys

def install_requirements():
    """Install required packages"""
    print("📦 Installing required packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Packages installed successfully!")
    except subprocess.CalledProcessError:
        print("❌ Failed to install packages. Please run: pip install -r requirements.txt")
        return False
    return True

def test_database_connection():
    """Test database connection"""
    print("🔍 Testing database connection...")
    try:
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'my_fastapi_app'))
        from database import SessionLocal, Patient, Bed, EmergencyAlert

        db = SessionLocal()
        try:
            # Test basic queries
            patient_count = db.query(Patient).count()
            bed_count = db.query(Bed).count()
            alert_count = db.query(EmergencyAlert).count()

            print(f"✅ Database connected successfully!")
            print(f"   📊 Patients: {patient_count}")
            print(f"   🛏️  Beds: {bed_count}")
            print(f"   🚨 Alerts: {alert_count}")
            return True
        finally:
            db.close()
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

if __name__ == "__main__":
    print("🏥 HospiTrack - Complete Hospital Management System")
    print("=" * 60)

    # Install requirements
    if not install_requirements():
        sys.exit(1)

    # Setup database
    print("\n🗄️ Setting up database...")
    try:
        subprocess.check_call([sys.executable, "setup_database.py"])
    except subprocess.CalledProcessError:
        print("❌ Database setup failed")
        sys.exit(1)

    # Test database connection
    if not test_database_connection():
        sys.exit(1)

    print("\n" + "=" * 60)
    print("🚀 Starting FastAPI Server...")
    print("📍 Server: http://localhost:8000")
    print("🌐 CORS: Configured for http://localhost:5174")
    print("📚 API Docs: http://localhost:8000/docs")
    print("🔗 Health Check: http://localhost:8000/api/health/")
    print()
    print("🔑 Login Credentials:")
    print("   👨‍💼 Admin: admin@hospital.com / admin123")
    print("   👨‍⚕️ Doctor: doctor@hospital.com / doctor123")
    print("   👩‍⚕️ Nurse: nurse@hospital.com / nurse123")
    print()
    print("🎯 Real-time Features:")
    print("   ✅ Database-backed authentication")
    print("   ✅ Role-based access control")
    print("   ✅ Real-time bed management")
    print("   ✅ Patient tracking")
    print("   ✅ Emergency alerts system")
    print("   ✅ Cross-role data synchronization")
    print()
    print("📱 Frontend: http://localhost:5174/auth")
    print("=" * 60)

    # Change to the my_fastapi_app directory
    os.chdir("my_fastapi_app")

    # Run the FastAPI app directly
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
