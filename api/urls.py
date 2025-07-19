"""
API URLs for HospiTrack
"""
from django.urls import path
from . import views

urlpatterns = [
    # Root API endpoint for testing
    path('', views.api_root, name='api_root'),

    # Authentication endpoints
    path('auth/login/', views.login_view, name='login'),
    path('auth/admin/register/', views.register_admin, name='register_admin'),
    path('auth/doctor/register/', views.register_doctor, name='register_doctor'),
    path('auth/nurse/register/', views.register_nurse, name='register_nurse'),

    # Health check
    path('health/', views.health_check, name='health_check'),
    
    # Dashboard endpoints
    path('dashboard/system-stats/', views.system_stats, name='system_stats'),
    path('dashboard/bed-occupancy/', views.bed_occupancy, name='bed_occupancy'),
    path('dashboard/patient-stats/', views.patient_stats, name='patient_stats'),
    
    # Data endpoints
    path('patients/', views.patients_list, name='patients_list'),
    path('beds/', views.beds_list, name='beds_list'),
    path('alerts/', views.alerts_list, name='alerts_list'),
]
