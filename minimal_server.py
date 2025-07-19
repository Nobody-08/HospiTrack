#!/usr/bin/env python3
"""
Minimal Django server for testing
"""
import os
import sys
from django.conf import settings
from django.core.wsgi import get_wsgi_application
from django.http import JsonResponse
from django.urls import path
from django.core.management import execute_from_command_line

# Configure Django settings
if not settings.configured:
    settings.configure(
        DEBUG=True,
        SECRET_KEY='test-secret-key',
        ROOT_URLCONF=__name__,
        ALLOWED_HOSTS=['*'],
        INSTALLED_APPS=[
            'corsheaders',
        ],
        MIDDLEWARE=[
            'corsheaders.middleware.CorsMiddleware',
            'django.middleware.common.CommonMiddleware',
        ],
        CORS_ALLOW_ALL_ORIGINS=True,
        CORS_ALLOW_CREDENTIALS=True,
    )

# Views
def root_view(request):
    return JsonResponse({
        "message": "Minimal Django server is working!",
        "status": "success",
        "endpoints": ["/", "/test/", "/api/health/"]
    })

def test_view(request):
    return JsonResponse({"message": "Test endpoint working!"})

def health_view(request):
    return JsonResponse({"status": "healthy", "message": "API is working"})

def login_view(request):
    if request.method == 'POST':
        return JsonResponse({
            "access": "test_token",
            "user": {"name": "Test User", "role": "admin"}
        })
    return JsonResponse({"error": "POST required"})

# URL patterns
urlpatterns = [
    path('', root_view),
    path('test/', test_view),
    path('api/health/', health_view),
    path('api/auth/login/', login_view),
]

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'runserver':
        print("🚀 Starting minimal Django server...")
        print("📍 Server will run on http://localhost:8000")
        print("🔗 Test endpoints:")
        print("   http://localhost:8000/")
        print("   http://localhost:8000/test/")
        print("   http://localhost:8000/api/health/")
        print("   http://localhost:8000/api/auth/login/")
        
    execute_from_command_line(sys.argv)
