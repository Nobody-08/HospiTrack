#!/usr/bin/env python3
"""
FastAPI Server Startup Script for HospiTrack
"""
import uvicorn
import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("🏥 Starting HospiTrack FastAPI Backend...")
    print("📍 Server will run on http://localhost:8000")
    print("🌐 CORS is configured for http://localhost:5174")
    print("🔗 API Documentation: http://localhost:8000/docs")
    print("🔗 Health Check: http://localhost:8000/api/health/")
    print("🔗 Login Endpoint: http://localhost:8000/api/auth/login/")
    print()
    
    # Run the FastAPI app
    uvicorn.run(
        "my_fastapi_app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
