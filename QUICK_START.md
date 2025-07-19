# 🚀 HospiTrack Quick Start Guide

## Step 1: Install Required Packages

Open terminal in your project directory and run:

```bash
pip install django django-cors-headers
```

## Step 2: Run Database Migrations

```bash
python manage.py migrate
```

## Step 3: Start Django Server

```bash
python manage.py runserver 0.0.0.0:8000
```

## Step 4: Test the Backend

Open a new terminal and test:

```bash
# Test health endpoint
curl http://localhost:8000/api/health/

# Test login endpoint
curl -X POST http://localhost:8000/api/auth/login/ -H "Content-Type: application/json" -d "{\"email\": \"admin@hospital.com\", \"password\": \"admin123\"}"
```

## Step 5: Test Frontend Login

1. Go to: http://localhost:5174/auth
2. Login with:
   - Email: `admin@hospital.com`
   - Password: `admin123`

## 🔑 Test Credentials:

- **Admin**: admin@hospital.com / admin123
- **Doctor**: doctor@hospital.com / doctor123  
- **Nurse**: nurse@hospital.com / nurse123
- **Demo**: demo@hospital.com / password

## 🔗 Available API Endpoints:

- `GET http://localhost:8000/api/health/`
- `POST http://localhost:8000/api/auth/login/`
- `POST http://localhost:8000/api/auth/admin/register/`
- `POST http://localhost:8000/api/auth/doctor/register/`
- `POST http://localhost:8000/api/auth/nurse/register/`
- `GET http://localhost:8000/api/dashboard/system-stats/`

## 🐛 Troubleshooting:

### If you get "ModuleNotFoundError":
```bash
pip install django django-cors-headers
```

### If you get "No module named 'api'":
Make sure the `api` folder exists with `__init__.py` file

### If you get CORS errors:
The backend is configured for http://localhost:5174 - make sure your frontend is running on this port

## ✅ Success Indicators:

When everything is working, you should see:
1. Django server running on http://localhost:8000
2. No errors in the terminal
3. Successful login from frontend
4. API endpoints responding correctly
