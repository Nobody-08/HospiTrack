"""
Simple database configuration for HospiTrack (SQLAlchemy 1.4 compatible)
"""
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from datetime import datetime
import os

# Database URL - using SQLite for simplicity
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./hospitrackdb.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# User Models (Role-based)
class AdminUser(Base):
    __tablename__ = "admin_users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)

class DoctorUser(Base):
    __tablename__ = "doctor_users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    specialization = Column(String(100))
    license_number = Column(String(50))
    department = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)

class NurseUser(Base):
    __tablename__ = "nurse_users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    ward_assigned = Column(String(100))
    shift = Column(String(20))
    certification_level = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)

# Hospital Data Models
class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    ward = Column(String(50), nullable=False)
    bed_number = Column(String(10))
    condition_notes = Column(Text)
    emergency_contact = Column(String(100))
    contact_phone = Column(String(20))
    blood_group = Column(String(5))
    allergies = Column(Text)
    admission_type = Column(String(20))
    status = Column(String(20), default="Stable")
    diagnosis = Column(Text)
    doctor_assigned = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Bed(Base):
    __tablename__ = "beds"
    
    id = Column(Integer, primary_key=True, index=True)
    number = Column(String(10), unique=True, nullable=False)
    ward = Column(String(50), nullable=False)
    status = Column(String(20), default="Available")  # Available, Occupied, Cleaning, Maintenance
    patient_id = Column(Integer, ForeignKey("patients.id"))
    last_cleaned = Column(DateTime)
    assigned_nurse = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    patient = relationship("Patient")

class EmergencyAlert(Base):
    __tablename__ = "emergency_alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    severity = Column(String(20), nullable=False)  # critical, high, medium, low
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    ward = Column(String(50))
    bed = Column(String(10))
    patient = Column(String(100))
    reported_by = Column(String(100))
    acknowledged = Column(Boolean, default=False)
    acknowledged_by = Column(String(100))
    acknowledged_at = Column(DateTime)
    resolved = Column(Boolean, default=False)
    resolved_by = Column(String(100))
    resolved_at = Column(DateTime)
    resolution = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class PatientTransfer(Base):
    __tablename__ = "patient_transfers"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    from_bed = Column(String(10))
    to_bed = Column(String(10))
    reason = Column(Text)
    status = Column(String(20), default="pending")  # pending, approved, rejected, completed
    requested_by = Column(String(100))
    approved_by = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)
    
    patient = relationship("Patient")

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create all tables
def create_tables():
    Base.metadata.create_all(bind=engine)

# Clear all data
def clear_all_data():
    """Clear all data from all tables"""
    db = SessionLocal()
    try:
        # Clear in reverse order to avoid foreign key constraints
        db.query(PatientTransfer).delete()
        db.query(EmergencyAlert).delete()
        db.query(Bed).delete()
        db.query(Patient).delete()
        db.query(NurseUser).delete()
        db.query(DoctorUser).delete()
        db.query(AdminUser).delete()
        db.commit()
        print("✅ All data cleared from database")
    except Exception as e:
        db.rollback()
        print(f"❌ Error clearing data: {e}")
    finally:
        db.close()
