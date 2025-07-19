#!/usr/bin/env python3
"""
Database setup script for HospiTrack
"""
import sys
import os

# Add the my_fastapi_app directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'my_fastapi_app'))

from database import create_tables, clear_all_data, SessionLocal
from auth_service import create_default_users

def create_sample_data(db):
    """Create sample hospital data"""
    from database import Patient, Bed, EmergencyAlert

    # Create sample beds
    sample_beds = [
        {"number": "101", "ward": "ICU", "status": "Available"},
        {"number": "102", "ward": "ICU", "status": "Available"},
        {"number": "103", "ward": "ICU", "status": "Available"},
        {"number": "201", "ward": "General", "status": "Available"},
        {"number": "202", "ward": "General", "status": "Available"},
        {"number": "203", "ward": "General", "status": "Available"},
        {"number": "301", "ward": "Emergency", "status": "Available"},
        {"number": "302", "ward": "Emergency", "status": "Available"},
    ]

    for bed_data in sample_beds:
        existing_bed = db.query(Bed).filter(Bed.number == bed_data["number"]).first()
        if not existing_bed:
            bed = Bed(**bed_data)
            db.add(bed)

    # Create sample patients
    sample_patients = [
        {
            "name": "John Doe",
            "age": 45,
            "ward": "ICU",
            "bed_number": "101",
            "status": "Critical",
            "condition_notes": "Post-surgery recovery",
            "emergency_contact": "Jane Doe",
            "contact_phone": "+1234567890",
            "blood_group": "O+",
            "doctor_assigned": "Dr. Smith"
        },
        {
            "name": "Mary Johnson",
            "age": 32,
            "ward": "General",
            "bed_number": "201",
            "status": "Stable",
            "condition_notes": "Routine checkup",
            "emergency_contact": "Bob Johnson",
            "contact_phone": "+1234567891",
            "blood_group": "A+",
            "doctor_assigned": "Dr. Wilson"
        }
    ]

    for patient_data in sample_patients:
        existing_patient = db.query(Patient).filter(Patient.name == patient_data["name"]).first()
        if not existing_patient:
            patient = Patient(**patient_data)
            db.add(patient)

            # Update bed status
            bed = db.query(Bed).filter(Bed.number == patient_data["bed_number"]).first()
            if bed:
                bed.status = "Occupied"
                bed.patient_id = patient.id

    db.commit()
    print("✅ Sample data created!")

def setup_fresh_database():
    """Set up a fresh database with default users and sample data"""
    print("🏥 Setting up HospiTrack Database...")

    # Clear all existing data
    print("🗑️ Clearing existing data...")
    clear_all_data()

    # Create tables
    print("🗄️ Creating database tables...")
    create_tables()

    # Create default users
    print("👥 Creating default users...")
    db = SessionLocal()
    try:
        create_default_users(db)

        # Create sample data
        print("📊 Creating sample data...")
        create_sample_data(db)

    finally:
        db.close()

    print("✅ Database setup complete!")
    print()
    print("🔑 Default login credentials:")
    print("   Admin: admin@hospital.com / admin123")
    print("   Doctor: doctor@hospital.com / doctor123")
    print("   Nurse: nurse@hospital.com / nurse123")
    print()
    print("📊 Sample data includes:")
    print("   - 8 beds across ICU, General, and Emergency wards")
    print("   - 2 sample patients")
    print("   - Ready for real-time testing!")

if __name__ == "__main__":
    setup_fresh_database()
