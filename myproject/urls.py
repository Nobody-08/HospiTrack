"""
URL configuration for HospiTrack project.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json

def root_view(request):
    print(f"Root view called: {request.method} {request.path}")
    return JsonResponse({
        "message": "HospiTrack Django Backend is running!",
        "method": request.method,
        "path": request.path,
        "status": "success"
    })

def simple_test(request):
    print(f"Simple test called: {request.method} {request.path}")
    return HttpResponse("Simple test working!")

@csrf_exempt
def api_health(request):
    print(f"Health check called: {request.method} {request.path}")
    return JsonResponse({
        "status": "healthy",
        "message": "API is working",
        "method": request.method
    })

@csrf_exempt
def api_login(request):
    print(f"Login called: {request.method} {request.path}")
    if request.method == 'POST':
        try:
            data = json.loads(request.body) if request.body else {}
            email = data.get('email', '')
            password = data.get('password', '')

            print(f"Login attempt: {email}")

            # Mock authentication
            if email and password:
                return JsonResponse({
                    "access": "mock_jwt_token",
                    "refresh": "mock_refresh_token",
                    "user": {
                        "id": 1,
                        "name": "Test User",
                        "email": email,
                        "role": "admin"
                    }
                })
            else:
                return JsonResponse({"error": "Email and password required"}, status=400)
        except Exception as e:
            print(f"Login error: {e}")
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "POST method required"}, status=405)

def api_root(request):
    print(f"API root called: {request.method} {request.path}")
    return JsonResponse({
        "message": "HospiTrack API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/api/health/",
            "login": "/api/auth/login/",
            "system_stats": "/api/dashboard/system-stats/",
            "patients": "/api/patients/",
            "beds": "/api/beds/",
            "alerts": "/api/alerts/"
        }
    })

def dashboard_system_stats(request):
    print(f"System stats called: {request.method} {request.path}")
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

def dashboard_bed_occupancy(request):
    return JsonResponse({
        "occupancyRate": 70,
        "availableBeds": 15,
        "occupiedBeds": 35,
        "totalBeds": 50
    })

def dashboard_patient_stats(request):
    return JsonResponse({
        "totalPatients": 25,
        "criticalPatients": 3,
        "stablePatients": 18,
        "dischargesToday": 5
    })

def api_patients(request):
    return JsonResponse({
        "patients": [],
        "count": 0,
        "message": "Mock patients endpoint"
    })

def api_beds(request):
    return JsonResponse({
        "beds": [],
        "count": 0,
        "message": "Mock beds endpoint"
    })

def api_alerts(request):
    return JsonResponse({
        "alerts": [],
        "count": 0,
        "message": "Mock alerts endpoint"
    })

def dashboard_opd_stats(request):
    print(f"OPD stats called: {request.method} {request.path}")
    return JsonResponse({
        "today": 15,
        "yesterday": 12,
        "thisWeek": 85,
        "lastWeek": 78,
        "thisMonth": 340,
        "lastMonth": 320
    })

urlpatterns = [
    path('', root_view, name='root'),
    path('test/', simple_test, name='simple_test'),

    # API endpoints
    path('api/', api_root, name='api_root'),
    path('api/health/', api_health, name='api_health'),
    path('api/auth/login/', api_login, name='api_login'),

    # Dashboard endpoints
    path('api/dashboard/system-stats/', dashboard_system_stats, name='dashboard_system_stats'),
    path('api/dashboard/bed-occupancy/', dashboard_bed_occupancy, name='dashboard_bed_occupancy'),
    path('api/dashboard/patient-stats/', dashboard_patient_stats, name='dashboard_patient_stats'),
    path('api/dashboard/opd-stats/', dashboard_opd_stats, name='dashboard_opd_stats'),

    # Data endpoints
    path('api/patients/', api_patients, name='api_patients'),
    path('api/beds/', api_beds, name='api_beds'),
    path('api/alerts/', api_alerts, name='api_alerts'),

    path('admin/', admin.site.urls),
]
