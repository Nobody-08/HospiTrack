# 🚨 CORS Error Fix - HospiTrack Backend Setup

## The Problem
The error `127.0.0.1:52637 - "OPTIONS /api/auth/login/ HTTP/1.1" 400 Bad Request` means your backend is rejecting requests from your frontend due to CORS (Cross-Origin Resource Sharing) restrictions.

## 🚀 IMMEDIATE FIX - Test Backend

**Run this test backend to fix CORS immediately:**

1. **Install requirements:**
```bash
pip install fastapi uvicorn
```

2. **Run the test backend:**
```bash
python test_backend.py
```

3. **Test login with these credentials:**
   - Admin: `admin@hospital.com` / `admin123`
   - Doctor: `doctor@hospital.com` / `doctor123`
   - Nurse: `nurse@hospital.com` / `nurse123`
   - Demo: `demo@hospital.com` / `password`

## 🔧 Permanent Fix for Your Backend:

### 1. **For Django Backend:**

```bash
# Install CORS package
pip install django-cors-headers
```

Add to your `settings.py`:
```python
INSTALLED_APPS = [
    # ... other apps
    'corsheaders',
    # ... your apps
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ... other middleware
]

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True  # Only for development

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

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
```

### 2. **For FastAPI Backend:**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Required API Endpoints:

### Authentication:
- `POST /api/auth/login/`
- `POST /api/auth/admin/register/`
- `POST /api/auth/doctor/register/`
- `POST /api/auth/nurse/register/`

### Patients:
- `GET /api/patients/`
- `POST /api/patients/`
- `GET /api/patients/{id}/`
- `PATCH /api/patients/{id}/notes/`

### Beds:
- `GET /api/beds/`
- `PATCH /api/beds/{id}/status/`

### Alerts:
- `GET /api/alerts/`
- `POST /api/alerts/`
- `PATCH /api/alerts/{id}/acknowledge/`
- `PATCH /api/alerts/{id}/resolve/`

### Dashboard:
- `GET /api/dashboard/system-stats/`
- `GET /api/dashboard/bed-occupancy/`
- `GET /api/dashboard/patient-stats/`

## Database Schema:

See the main README for complete database schema with separate tables for:
- `admin_users`
- `doctor_users` 
- `nurse_users`
- `patients`
- `beds`
- `emergency_alerts`
- `patient_transfers`

## Testing the Fix:

1. Start your backend server on `http://localhost:8000`
2. Make sure CORS is configured as above
3. Try logging in from the frontend
4. Check browser console for any remaining errors

## Environment Variables:

Create a `.env` file in the frontend directory:
```
VITE_BACKEND_URL=http://localhost:8000/api
VITE_APP_MODE=development
```
