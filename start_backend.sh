#!/bin/bash
echo "🏥 Starting HospiTrack Django Backend..."
echo

echo "📦 Installing required packages..."
pip install django djangorestframework django-cors-headers

echo
echo "🗄️ Running database migrations..."
python manage.py migrate

echo
echo "🚀 Starting Django server on http://localhost:8000"
echo "🌐 CORS is configured for http://localhost:5174"
echo
echo "📋 Test users available:"
echo "   Admin: admin@hospital.com / admin123"
echo "   Doctor: doctor@hospital.com / doctor123"
echo "   Nurse: nurse@hospital.com / nurse123"
echo "   Demo: demo@hospital.com / password"
echo
echo "🔗 API endpoints available at:"
echo "   http://localhost:8000/api/auth/login/"
echo "   http://localhost:8000/api/health/"
echo

python manage.py runserver 0.0.0.0:8000
