# Django CORS Configuration
# Add this to your Django settings.py file

# 1. First install django-cors-headers:
# pip install django-cors-headers

# 2. Add to INSTALLED_APPS
INSTALLED_APPS = [
    # ... your existing apps
    'corsheaders',
    # ... rest of your apps
]

# 3. Add to MIDDLEWARE (IMPORTANT: Add at the top!)
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ... your existing middleware
]

# 4. CORS Settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

# For development only - allows all origins (REMOVE IN PRODUCTION!)
CORS_ALLOW_ALL_ORIGINS = True

# Allow credentials (cookies, authorization headers)
CORS_ALLOW_CREDENTIALS = True

# Allowed headers
CORS_ALLOWED_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Allowed methods
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# Preflight max age
CORS_PREFLIGHT_MAX_AGE = 86400

# Example Django view for login endpoint
"""
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def login_view(request):
    if request.method == "OPTIONS":
        response = JsonResponse({})
        response["Access-Control-Allow-Origin"] = "http://localhost:5174"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        return response
    
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        # Your authentication logic here
        # For now, return a mock response
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
"""
