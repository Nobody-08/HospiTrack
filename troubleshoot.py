#!/usr/bin/env python3
"""
Troubleshooting script for HospiTrack backend connection
"""
import subprocess
import sys
import socket
import requests
import time

def check_port(port):
    """Check if a port is in use"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', port))
    sock.close()
    return result == 0

def test_url(url):
    """Test if a URL is accessible"""
    try:
        response = requests.get(url, timeout=5)
        return True, response.status_code, response.text[:100]
    except requests.exceptions.RequestException as e:
        return False, None, str(e)

def main():
    print("🔍 HospiTrack Backend Troubleshooting")
    print("=" * 50)
    
    # Check if FastAPI is installed
    print("1. Checking FastAPI installation...")
    try:
        import fastapi
        import uvicorn
        print(f"   ✅ FastAPI {fastapi.__version__} installed")
        print(f"   ✅ Uvicorn installed")
    except ImportError as e:
        print(f"   ❌ Missing package: {e}")
        print("   💡 Run: pip install fastapi uvicorn")
        return
    
    # Check ports
    print("\n2. Checking ports...")
    for port in [8000, 8001]:
        if check_port(port):
            print(f"   ✅ Port {port} is in use")
        else:
            print(f"   ❌ Port {port} is free")
    
    # Test URLs
    print("\n3. Testing backend URLs...")
    urls = [
        "http://localhost:8000/",
        "http://localhost:8000/api/health/",
        "http://localhost:8001/",
        "http://localhost:8001/api/health/"
    ]
    
    for url in urls:
        success, status, response = test_url(url)
        if success:
            print(f"   ✅ {url} - Status: {status}")
        else:
            print(f"   ❌ {url} - Error: {response}")
    
    # Check processes
    print("\n4. Checking running processes...")
    try:
        result = subprocess.run(['netstat', '-an'], capture_output=True, text=True)
        lines = [line for line in result.stdout.split('\n') if ':8000' in line or ':8001' in line]
        if lines:
            print("   Processes using ports 8000/8001:")
            for line in lines:
                print(f"   {line.strip()}")
        else:
            print("   ❌ No processes found on ports 8000/8001")
    except:
        print("   ⚠️  Could not check processes")
    
    print("\n" + "=" * 50)
    print("💡 Recommendations:")
    print("1. If no server is running, start one:")
    print("   python simple_test_server.py")
    print("2. If port 8000 is busy, use port 8001:")
    print("   python server_port_8001.py")
    print("3. Update frontend .env if using port 8001:")
    print("   VITE_BACKEND_URL=http://localhost:8001/api")
    print("4. Restart your frontend after changing .env")

if __name__ == "__main__":
    main()
