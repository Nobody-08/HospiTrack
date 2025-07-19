#!/usr/bin/env python3
"""
Simple server startup script
"""
import os
import sys
import subprocess

def install_packages():
    """Install required packages"""
    print("📦 Installing required packages...")
    packages = [
        "fastapi",
        "uvicorn[standard]",
        "sqlalchemy",
        "passlib[bcrypt]",
        "python-jose[cryptography]",
        "python-multipart",
        "pydantic"
    ]
    
    for package in packages:
        try:
            print(f"Installing {package}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", package], 
                                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except subprocess.CalledProcessError:
            print(f"❌ Failed to install {package}")
            return False
    
    print("✅ All packages installed!")
    return True

def setup_database():
    """Setup database"""
    print("🗄️ Setting up database...")
    try:
        # Add the my_fastapi_app directory to Python path
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'my_fastapi_app'))
        
        from database import create_tables, clear_all_data, SessionLocal
        from auth_service import create_default_users
        
        # Clear and create
        clear_all_data()
        create_tables()
        
        # Create default users
        db = SessionLocal()
        try:
            create_default_users(db)
        finally:
            db.close()
        
        print("✅ Database setup complete!")
        return True
        
    except Exception as e:
        print(f"❌ Database setup failed: {e}")
        return False

def start_server():
    """Start the FastAPI server"""
    print("🚀 Starting FastAPI server...")
    
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
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
        
    except KeyboardInterrupt:
        print("\n✅ Server stopped by user")
    except Exception as e:
        print(f"❌ Server startup failed: {e}")
        print("\n💡 Try running the diagnostics: python diagnose_server.py")

def main():
    print("🏥 HospiTrack Simple Server Startup")
    print("=" * 50)
    
    # Install packages
    if not install_packages():
        print("❌ Package installation failed")
        return
    
    # Setup database
    if not setup_database():
        print("❌ Database setup failed")
        return
    
    # Start server
    start_server()

if __name__ == "__main__":
    main()
