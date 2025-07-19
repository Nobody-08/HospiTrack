#!/usr/bin/env python3
"""
Diagnose server startup issues
"""
import sys
import os
import subprocess
import importlib.util

def check_python_version():
    """Check Python version"""
    print(f"🐍 Python version: {sys.version}")
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ required")
        return False
    print("✅ Python version OK")
    return True

def check_packages():
    """Check if required packages are installed"""
    print("\n📦 Checking required packages...")
    
    required_packages = [
        'fastapi',
        'uvicorn',
        'sqlalchemy',
        'passlib',
        'python_jose',
        'python_multipart',
        'pydantic'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            if package == 'python_jose':
                import jose
            elif package == 'python_multipart':
                import multipart
            else:
                __import__(package)
            print(f"✅ {package}")
        except ImportError:
            print(f"❌ {package} - MISSING")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n❌ Missing packages: {', '.join(missing_packages)}")
        print("💡 Run: pip install fastapi uvicorn sqlalchemy passlib[bcrypt] python-jose[cryptography] python-multipart pydantic")
        return False
    
    print("✅ All packages installed")
    return True

def check_file_structure():
    """Check if all required files exist"""
    print("\n📁 Checking file structure...")
    
    required_files = [
        'my_fastapi_app/main.py',
        'my_fastapi_app/database.py',
        'my_fastapi_app/auth.py',
        'my_fastapi_app/auth_service.py',
        'my_fastapi_app/__init__.py'
    ]
    
    missing_files = []
    
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path} - MISSING")
            missing_files.append(file_path)
    
    if missing_files:
        print(f"\n❌ Missing files: {', '.join(missing_files)}")
        return False
    
    print("✅ All required files present")
    return True

def test_imports():
    """Test if we can import the main modules"""
    print("\n🔍 Testing imports...")
    
    try:
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'my_fastapi_app'))
        
        print("Testing database import...")
        import database
        print("✅ database module imported")
        
        print("Testing auth_service import...")
        import auth_service
        print("✅ auth_service module imported")
        
        print("Testing auth import...")
        import auth
        print("✅ auth module imported")
        
        print("Testing main import...")
        import main
        print("✅ main module imported")
        
        return True
        
    except Exception as e:
        print(f"❌ Import error: {e}")
        return False

def test_database_creation():
    """Test database creation"""
    print("\n🗄️ Testing database creation...")
    
    try:
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'my_fastapi_app'))
        from database import create_tables, SessionLocal
        
        print("Creating database tables...")
        create_tables()
        print("✅ Database tables created")
        
        print("Testing database connection...")
        db = SessionLocal()
        db.close()
        print("✅ Database connection successful")
        
        return True
        
    except Exception as e:
        print(f"❌ Database error: {e}")
        return False

def try_start_server():
    """Try to start the server manually"""
    print("\n🚀 Attempting to start server...")
    
    try:
        os.chdir("my_fastapi_app")
        print("Changed to my_fastapi_app directory")
        
        # Try to import and run
        import uvicorn
        print("✅ uvicorn imported")
        
        print("🔄 Starting server on port 8000...")
        print("📍 Server should be available at: http://localhost:8000")
        print("🔗 API docs at: http://localhost:8000/docs")
        print("⚠️  Press Ctrl+C to stop the server")
        
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
        
    except KeyboardInterrupt:
        print("\n✅ Server stopped by user")
    except Exception as e:
        print(f"❌ Server startup error: {e}")
        return False

def main():
    print("🏥 HospiTrack Server Diagnostics")
    print("=" * 50)
    
    # Run all checks
    checks = [
        ("Python Version", check_python_version),
        ("Required Packages", check_packages),
        ("File Structure", check_file_structure),
        ("Module Imports", test_imports),
        ("Database Setup", test_database_creation)
    ]
    
    all_passed = True
    
    for check_name, check_func in checks:
        if not check_func():
            all_passed = False
            break
    
    print("\n" + "=" * 50)
    
    if all_passed:
        print("✅ All diagnostics passed!")
        print("\n🚀 Attempting to start server...")
        try_start_server()
    else:
        print("❌ Some diagnostics failed")
        print("\n💡 Fix the issues above and try again")
        print("💡 Or run: python run_fastapi.py")

if __name__ == "__main__":
    main()
