"""
API Views for HospiTrack
"""
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

# Mock user data for testing
MOCK_USERS = {
    "admin@hospital.com": {"name": "Admin User", "role": "admin", "password": "admin123"},
    "doctor@hospital.com": {"name": "Dr. Smith", "role": "doctor", "password": "doctor123"},
    "nurse@hospital.com": {"name": "Nurse Johnson", "role": "nurse", "password": "nurse123"},
    "demo@hospital.com": {"name": "Demo User", "role": "admin", "password": "password"},
}

@require_http_methods(["GET"])
def api_root(request):
    """API root endpoint for testing"""
    return JsonResponse({
        "message": "HospiTrack API is working!",
        "version": "1.0.0",
        "endpoints": {
            "health": "/api/health/",
            "login": "/api/auth/login/",
            "register_admin": "/api/auth/admin/register/",
            "register_doctor": "/api/auth/doctor/register/",
            "register_nurse": "/api/auth/nurse/register/",
            "system_stats": "/api/dashboard/system-stats/"
        },
        "test_users": {
            "admin": "admin@hospital.com / admin123",
            "doctor": "doctor@hospital.com / doctor123",
            "nurse": "nurse@hospital.com / nurse123",
            "demo": "demo@hospital.com / password"
        }
    })

@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def login_view(request):
    """Handle login requests"""
    if request.method == "OPTIONS":
        response = JsonResponse({})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return response
    
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        print(f"Login attempt: {email}")
        
        # Check mock users
        user = MOCK_USERS.get(email)
        if user and user["password"] == password:
            return JsonResponse({
                "access": f"mock_jwt_token_{user['role']}",
                "refresh": "mock_refresh_token",
                "user": {
                    "id": 1,
                    "name": user["name"],
                    "email": email,
                    "role": user["role"]
                }
            })
        else:
            return JsonResponse({"error": "Invalid email or password"}, status=400)
            
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def register_admin(request):
    """Register admin user"""
    if request.method == "OPTIONS":
        return JsonResponse({})
    
    try:
        data = json.loads(request.body)
        name = data.get('name')
        email = data.get('email')
        print(f"Admin registration: {name} - {email}")
        return JsonResponse({"message": f"Admin account created for {name}"})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def register_doctor(request):
    """Register doctor user"""
    if request.method == "OPTIONS":
        return JsonResponse({})
    
    try:
        data = json.loads(request.body)
        name = data.get('name')
        email = data.get('email')
        print(f"Doctor registration: {name} - {email}")
        return JsonResponse({"message": f"Doctor account created for {name}"})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def register_nurse(request):
    """Register nurse user"""
    if request.method == "OPTIONS":
        return JsonResponse({})
    
    try:
        data = json.loads(request.body)
        name = data.get('name')
        email = data.get('email')
        print(f"Nurse registration: {name} - {email}")
        return JsonResponse({"message": f"Nurse account created for {name}"})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@require_http_methods(["GET"])
def health_check(request):
    """Health check endpoint"""
    return JsonResponse({
        "status": "healthy", 
        "message": "HospiTrack Django API is running",
        "cors": "enabled"
    })

@require_http_methods(["GET"])
def system_stats(request):
    """Mock system statistics"""
    return JsonResponse({
        "totalPatients": 25,
        "availableBeds": 15,
        "totalBeds": 50,
        "emergencyAlerts": 3,
        "staffOnDuty": 12,
        "totalStaff": 25,
        "systemUptime": "99.9%",
        "avgResponseTime": "1.2s"
    })

@require_http_methods(["GET"])
def bed_occupancy(request):
    """Mock bed occupancy data"""
    return JsonResponse({
        "occupancyRate": 70,
        "availableBeds": 15,
        "occupiedBeds": 35,
        "totalBeds": 50
    })

@require_http_methods(["GET"])
def patient_stats(request):
    """Mock patient statistics"""
    return JsonResponse({
        "totalPatients": 25,
        "criticalPatients": 3,
        "stablePatients": 18,
        "dischargesToday": 5
    })

@require_http_methods(["GET"])
def patients_list(request):
    """Mock patients list"""
    return JsonResponse({
        "patients": [],
        "count": 0,
        "message": "Mock patients endpoint working"
    })

@require_http_methods(["GET"])
def beds_list(request):
    """Mock beds list"""
    return JsonResponse({
        "beds": [],
        "count": 0,
        "message": "Mock beds endpoint working"
    })

@require_http_methods(["GET"])
def alerts_list(request):
    """Mock alerts list"""
    return JsonResponse({
        "alerts": [],
        "count": 0,
        "message": "Mock alerts endpoint working"
    })
