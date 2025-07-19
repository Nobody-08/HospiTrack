#!/usr/bin/env python3
"""
Ultra simple server that works with existing packages or fallback
"""
import json
import sys

# Try FastAPI first
try:
    from fastapi import FastAPI, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    import uvicorn
    
    app = FastAPI()
    app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
    
    USERS = {
        "admin@hospital.com": {"password": "admin123", "role": "admin", "name": "Admin User"},
        "doctor@hospital.com": {"password": "doctor123", "role": "doctor", "name": "Dr. Smith"},
        "nurse@hospital.com": {"password": "nurse123", "role": "nurse", "name": "Nurse Johnson"}
    }
    
    @app.get("/")
    def root():
        return {"message": "HospiTrack API Working"}
    
    @app.get("/api/health/")
    def health():
        return {"status": "healthy"}
    
    @app.post("/api/auth/login/")
    def login(request: dict):
        email = request.get("email")
        password = request.get("password")
        user = USERS.get(email)
        if user and user["password"] == password:
            return {
                "access": f"token_{user['role']}",
                "refresh": f"refresh_{user['role']}",
                "user": {"id": 1, "name": user["name"], "email": email, "role": user["role"]}
            }
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    @app.get("/api/dashboard/system-stats/")
    def stats():
        return {"totalPatients": 15, "availableBeds": 10, "totalBeds": 30, "emergencyAlerts": 2, "staffOnDuty": 12, "totalStaff": 18}
    
    @app.get("/api/dashboard/opd-stats/")
    def opd():
        return {"today": 8, "yesterday": 6, "thisWeek": 45, "lastWeek": 38, "thisMonth": 180, "lastMonth": 165}
    
    def start_fastapi():
        print("HospiTrack FastAPI Server")
        print("http://localhost:8000")
        print("Login: admin@hospital.com / admin123")
        uvicorn.run(app, host="0.0.0.0", port=8000)
    
    USE_FASTAPI = True

except ImportError:
    USE_FASTAPI = False

# Fallback to simple HTTP server
if not USE_FASTAPI:
    from http.server import HTTPServer, BaseHTTPRequestHandler
    import urllib.parse
    
    class Handler(BaseHTTPRequestHandler):
        def do_OPTIONS(self):
            self.send_response(200)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
        
        def do_GET(self):
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            if self.path == '/':
                response = {"message": "HospiTrack API Working"}
            elif self.path == '/api/health/':
                response = {"status": "healthy"}
            elif self.path == '/api/dashboard/system-stats/':
                response = {"totalPatients": 15, "availableBeds": 10, "totalBeds": 30, "emergencyAlerts": 2, "staffOnDuty": 12, "totalStaff": 18}
            elif self.path == '/api/dashboard/opd-stats/':
                response = {"today": 8, "yesterday": 6, "thisWeek": 45, "lastWeek": 38, "thisMonth": 180, "lastMonth": 165}
            else:
                response = {"error": "Not found"}
            
            self.wfile.write(json.dumps(response).encode())
        
        def do_POST(self):
            if self.path == '/api/auth/login/':
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                
                try:
                    data = json.loads(post_data.decode())
                    email = data.get("email")
                    password = data.get("password")
                    
                    users = {
                        "admin@hospital.com": {"password": "admin123", "role": "admin", "name": "Admin User"},
                        "doctor@hospital.com": {"password": "doctor123", "role": "doctor", "name": "Dr. Smith"},
                        "nurse@hospital.com": {"password": "nurse123", "role": "nurse", "name": "Nurse Johnson"}
                    }
                    
                    user = users.get(email)
                    if user and user["password"] == password:
                        response = {
                            "access": f"token_{user['role']}",
                            "refresh": f"refresh_{user['role']}",
                            "user": {"id": 1, "name": user["name"], "email": email, "role": user["role"]}
                        }
                        self.send_response(200)
                    else:
                        response = {"error": "Invalid credentials"}
                        self.send_response(401)
                    
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps(response).encode())
                    
                except Exception as e:
                    self.send_response(400)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": str(e)}).encode())
    
    def start_simple():
        print("HospiTrack Simple HTTP Server")
        print("http://localhost:8000")
        print("Login: admin@hospital.com / admin123")
        server = HTTPServer(('0.0.0.0', 8000), Handler)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped")
            server.shutdown()

if __name__ == "__main__":
    print("HospiTrack Server")
    print("=" * 20)
    
    if USE_FASTAPI:
        start_fastapi()
    else:
        start_simple()
