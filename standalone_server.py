#!/usr/bin/env python3
"""
Standalone HospiTrack server using only Python standard library
"""
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse

class HospiTrackHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        """Override to reduce log spam"""
        pass
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def do_GET(self):
        """Handle GET requests"""
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # Route handling
        if self.path == '/':
            response = {"message": "HospiTrack API is running successfully"}
        
        elif self.path == '/api/health/':
            response = {
                "status": "healthy",
                "message": "HospiTrack API is working",
                "cors": "enabled"
            }
        
        elif self.path == '/api/dashboard/system-stats/':
            response = {
                "totalPatients": 15,
                "availableBeds": 10,
                "totalBeds": 30,
                "emergencyAlerts": 2,
                "staffOnDuty": 12,
                "totalStaff": 18,
                "systemUptime": "99.9%",
                "avgResponseTime": "1.2s"
            }
        
        elif self.path == '/api/dashboard/bed-occupancy/':
            response = {
                "icu": {"total": 10, "occupied": 8, "available": 2},
                "general": {"total": 15, "occupied": 10, "available": 5},
                "emergency": {"total": 5, "occupied": 3, "available": 2}
            }
        
        elif self.path == '/api/dashboard/patient-stats/':
            response = {
                "totalPatients": 15,
                "criticalPatients": 2,
                "stablePatients": 12,
                "dischargesToday": 1
            }
        
        elif self.path == '/api/dashboard/opd-stats/':
            response = {
                "today": 8,
                "yesterday": 6,
                "thisWeek": 45,
                "lastWeek": 38,
                "thisMonth": 180,
                "lastMonth": 165
            }
        
        elif self.path == '/api/patients/':
            response = [
                {
                    "id": 1,
                    "name": "John Doe",
                    "age": 45,
                    "ward": "ICU",
                    "bed_number": "101",
                    "condition": "Critical",
                    "admitted_date": "2025-01-15"
                },
                {
                    "id": 2,
                    "name": "Jane Smith",
                    "age": 32,
                    "ward": "General",
                    "bed_number": "205",
                    "condition": "Stable",
                    "admitted_date": "2025-01-16"
                }
            ]
        
        elif self.path == '/api/beds/':
            response = [
                {"id": 1, "number": "101", "ward": "ICU", "status": "Occupied", "patient_name": "John Doe"},
                {"id": 2, "number": "102", "ward": "ICU", "status": "Available", "patient_name": None},
                {"id": 3, "number": "205", "ward": "General", "status": "Occupied", "patient_name": "Jane Smith"},
                {"id": 4, "number": "206", "ward": "General", "status": "Available", "patient_name": None}
            ]
        
        elif self.path == '/api/alerts/':
            response = [
                {
                    "id": 1,
                    "title": "Equipment Check Required",
                    "message": "Ventilator in ICU Room 101 needs maintenance",
                    "severity": "high",
                    "ward": "ICU",
                    "created_at": "2025-01-19 10:30",
                    "resolved": False
                }
            ]

        elif self.path == '/api/transfers/':
            response = []

        elif self.path.startswith('/api/patients/') and len(self.path.split('/')) > 3:
            # Handle individual patient requests like /api/patients/1
            response = {
                "id": 1,
                "name": "John Doe",
                "age": 45,
                "ward": "ICU",
                "bed_number": "101",
                "condition": "Critical",
                "admitted_date": "2025-01-15"
            }

        elif self.path.startswith('/api/beds/') and len(self.path.split('/')) > 3:
            # Handle individual bed requests like /api/beds/1
            response = {
                "id": 1,
                "number": "101",
                "ward": "ICU",
                "status": "Occupied",
                "patient_name": "John Doe"
            }

        elif self.path.startswith('/api/alerts/') and len(self.path.split('/')) > 3:
            # Handle individual alert requests like /api/alerts/1
            response = {
                "id": 1,
                "title": "Equipment Check Required",
                "message": "Ventilator in ICU Room 101 needs maintenance",
                "severity": "high",
                "ward": "ICU",
                "resolved": False
            }

        else:
            response = {"error": "Endpoint not found", "path": self.path}
        
        self.wfile.write(json.dumps(response).encode())
    
    def do_POST(self):
        """Handle POST requests"""
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode()) if post_data else {}
        except json.JSONDecodeError:
            self.send_error_response(400, "Invalid JSON")
            return
        
        # Route handling
        if self.path == '/api/auth/login/':
            self.handle_login(data)
        
        elif self.path == '/api/auth/admin/register/':
            self.handle_register(data, "admin")
        
        elif self.path == '/api/auth/doctor/register/':
            self.handle_register(data, "doctor")
        
        elif self.path == '/api/auth/nurse/register/':
            self.handle_register(data, "nurse")

        elif self.path == '/api/patients/':
            self.handle_create_patient(data)

        elif self.path == '/api/beds/':
            self.handle_create_bed(data)

        elif self.path == '/api/alerts/':
            self.handle_create_alert(data)

        elif self.path == '/api/transfers/':
            self.handle_create_transfer(data)

        else:
            self.send_error_response(404, "Endpoint not found")
    
    def handle_login(self, data):
        """Handle login requests"""
        email = data.get("email", "")
        password = data.get("password", "")
        
        # User database
        users = {
            "admin@hospital.com": {"password": "admin123", "role": "admin", "name": "Admin User"},
            "doctor@hospital.com": {"password": "doctor123", "role": "doctor", "name": "Dr. Smith"},
            "nurse@hospital.com": {"password": "nurse123", "role": "nurse", "name": "Nurse Johnson"}
        }
        
        user = users.get(email)
        if user and user["password"] == password:
            response = {
                "access": f"token_{user['role']}_{email.split('@')[0]}",
                "refresh": f"refresh_{user['role']}",
                "user": {
                    "id": 1,
                    "name": user["name"],
                    "email": email,
                    "role": user["role"]
                }
            }
            self.send_json_response(200, response)
        else:
            self.send_error_response(401, "Invalid email or password")
    
    def handle_register(self, data, role):
        """Handle registration requests"""
        name = data.get("name", "Unknown")
        email = data.get("email", "unknown@hospital.com")

        response = {
            "message": f"{role.capitalize()} account created successfully",
            "user": {
                "name": name,
                "email": email,
                "role": role
            }
        }
        self.send_json_response(200, response)

    def handle_create_patient(self, data):
        """Handle patient creation"""
        response = {
            "message": "Patient created successfully",
            "id": 123,
            "patient": {
                "name": data.get("name", "Unknown"),
                "age": data.get("age", 0),
                "ward": data.get("ward", "General")
            }
        }
        self.send_json_response(201, response)

    def handle_create_bed(self, data):
        """Handle bed creation"""
        response = {
            "message": "Bed created successfully",
            "id": 456,
            "bed": {
                "number": data.get("number", "000"),
                "ward": data.get("ward", "General"),
                "status": data.get("status", "Available")
            }
        }
        self.send_json_response(201, response)

    def handle_create_alert(self, data):
        """Handle alert creation"""
        response = {
            "message": "Alert created successfully",
            "id": 789,
            "alert": {
                "title": data.get("title", "New Alert"),
                "severity": data.get("severity", "medium"),
                "ward": data.get("ward", "General")
            }
        }
        self.send_json_response(201, response)

    def handle_create_transfer(self, data):
        """Handle transfer creation"""
        response = {
            "message": "Transfer request created successfully",
            "id": 101,
            "transfer": {
                "patient_id": data.get("patient_id", 1),
                "from_bed": data.get("from_bed", "101"),
                "to_bed": data.get("to_bed", "102")
            }
        }
        self.send_json_response(201, response)
    
    def send_json_response(self, status_code, data):
        """Send JSON response"""
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def send_error_response(self, status_code, message):
        """Send error response"""
        self.send_json_response(status_code, {"error": message})

def main():
    """Start the server"""
    print("HospiTrack Standalone Server")
    print("=" * 40)
    print("Server: http://localhost:8000")
    print("Health: http://localhost:8000/api/health/")
    print("API Docs: Not available (standalone server)")
    print()
    print("Login Credentials:")
    print("  Admin: admin@hospital.com / admin123")
    print("  Doctor: doctor@hospital.com / doctor123")
    print("  Nurse: nurse@hospital.com / nurse123")
    print()
    print("Available Endpoints:")
    print("  GET  /api/health/")
    print("  POST /api/auth/login/")
    print("  GET  /api/dashboard/system-stats/")
    print("  GET  /api/dashboard/opd-stats/")
    print("  GET  /api/patients/")
    print("  GET  /api/beds/")
    print("  GET  /api/alerts/")
    print()
    print("Press Ctrl+C to stop the server")
    print("=" * 40)
    
    # Start server
    server = HTTPServer(('0.0.0.0', 8000), HospiTrackHandler)
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped by user")
        server.shutdown()
        print("Server shut down successfully")

if __name__ == "__main__":
    main()
