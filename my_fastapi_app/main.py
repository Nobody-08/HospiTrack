# my_fastapi_app/main.py

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from auth import router as auth_router
from database import (
    create_tables, clear_all_data, get_db, Patient, Bed, EmergencyAlert,
    PatientTransfer, AdminUser, DoctorUser, NurseUser
)
from auth_service import create_default_users

# Pydantic models for API requests/responses
class PatientCreate(BaseModel):
    name: str
    age: int
    ward: str
    bed_number: Optional[str] = None
    condition_notes: Optional[str] = None
    emergency_contact: Optional[str] = None
    contact_phone: Optional[str] = None
    blood_group: Optional[str] = None
    allergies: Optional[str] = None
    admission_type: Optional[str] = None
    status: Optional[str] = "Stable"
    diagnosis: Optional[str] = None
    doctor_assigned: Optional[str] = None

class BedCreate(BaseModel):
    number: str
    ward: str
    status: Optional[str] = "Available"
    assigned_nurse: Optional[str] = None

class BedStatusUpdate(BaseModel):
    status: str

class AlertCreate(BaseModel):
    severity: str
    title: str
    message: str
    ward: Optional[str] = None
    bed: Optional[str] = None
    patient: Optional[str] = None
    reported_by: Optional[str] = None

class TransferCreate(BaseModel):
    patient_id: int
    from_bed: str
    to_bed: str
    reason: Optional[str] = None
    requested_by: str

app = FastAPI(title="HospiTrack API", version="1.0.0")

# Create database tables on startup
@app.on_event("startup")
async def startup_event():
    print("🏥 Starting HospiTrack API...")
    print("🗄️ Creating database tables...")
    create_tables()

    # Initialize with default users
    db = next(get_db())
    create_default_users(db)
    print("✅ Database initialized successfully!")

# Include routers with /api prefix to match frontend expectations
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])

# Define the list of origins that are allowed to make requests
origins = [
    "http://localhost:3000",  # React app
    "http://localhost:5173",  # Vite dev server
    "http://localhost:5174",  # Alternative Vite port
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Dashboard endpoints with real database queries
@app.get("/api/dashboard/system-stats/")
def get_system_stats(db: Session = Depends(get_db)):
    total_patients = db.query(Patient).count()
    total_beds = db.query(Bed).count()
    available_beds = db.query(Bed).filter(Bed.status == "Available").count()
    emergency_alerts = db.query(EmergencyAlert).filter(EmergencyAlert.resolved == False).count()
    total_staff = (
        db.query(AdminUser).count() +
        db.query(DoctorUser).count() +
        db.query(NurseUser).count()
    )

    return {
        "totalPatients": total_patients,
        "availableBeds": available_beds,
        "totalBeds": total_beds,
        "emergencyAlerts": emergency_alerts,
        "staffOnDuty": total_staff,  # Simplified - all staff considered on duty
        "totalStaff": total_staff,
        "systemUptime": "99.9%",
        "avgResponseTime": "1.2s"
    }

@app.get("/api/dashboard/bed-occupancy/")
def get_bed_occupancy(db: Session = Depends(get_db)):
    # Get bed statistics by ward
    bed_stats = db.query(
        Bed.ward,
        func.count(Bed.id).label('total'),
        func.sum(func.case([(Bed.status == 'Occupied', 1)], else_=0)).label('occupied'),
        func.sum(func.case([(Bed.status == 'Available', 1)], else_=0)).label('available')
    ).group_by(Bed.ward).all()

    result = {}
    for stat in bed_stats:
        result[stat.ward.lower()] = {
            "total": stat.total,
            "occupied": stat.occupied or 0,
            "available": stat.available or 0
        }

    return result

@app.get("/api/dashboard/patient-stats/")
def get_patient_stats():
    return {
        "admitted_today": 8,
        "discharged_today": 5,
        "critical_patients": 12,
        "stable_patients": 108
    }

@app.get("/api/dashboard/alert-stats/")
def get_alert_stats():
    return {
        "critical": 1,
        "high": 2,
        "medium": 5,
        "low": 3
    }

@app.get("/api/dashboard/opd-stats/")
def get_opd_stats():
    return {
        "today": 15,
        "yesterday": 12,
        "thisWeek": 85,
        "lastWeek": 78,
        "thisMonth": 340,
        "lastMonth": 320
    }

@app.get("/api/dashboard/recent-activity/")
def get_recent_activity():
    return [
        {"time": "10:30 AM", "activity": "Patient John Doe admitted to ICU", "type": "admission"},
        {"time": "10:15 AM", "activity": "Emergency alert resolved in Ward 3", "type": "alert"},
        {"time": "09:45 AM", "activity": "Dr. Smith completed rounds", "type": "rounds"},
        {"time": "09:30 AM", "activity": "Bed 205 cleaned and ready", "type": "maintenance"}
    ]

# Patients endpoints with real database operations
@app.get("/api/patients/")
def get_patients(ward: Optional[str] = None, limit: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(Patient)

    if ward:
        query = query.filter(Patient.ward == ward)

    if limit:
        query = query.limit(limit)

    patients = query.all()

    return [
        {
            "id": patient.id,
            "name": patient.name,
            "age": patient.age,
            "ward": patient.ward,
            "bed_number": patient.bed_number,
            "condition": patient.status,
            "condition_notes": patient.condition_notes,
            "emergency_contact": patient.emergency_contact,
            "contact_phone": patient.contact_phone,
            "blood_group": patient.blood_group,
            "allergies": patient.allergies,
            "admission_type": patient.admission_type,
            "status": patient.status,
            "diagnosis": patient.diagnosis,
            "doctor_assigned": patient.doctor_assigned,
            "admitted_date": patient.created_at.strftime("%Y-%m-%d") if patient.created_at else None
        }
        for patient in patients
    ]

@app.post("/api/patients/")
def create_patient(patient_data: PatientCreate, db: Session = Depends(get_db)):
    try:
        new_patient = Patient(
            name=patient_data.name,
            age=patient_data.age,
            ward=patient_data.ward,
            bed_number=patient_data.bed_number,
            condition_notes=patient_data.condition_notes,
            emergency_contact=patient_data.emergency_contact,
            contact_phone=patient_data.contact_phone,
            blood_group=patient_data.blood_group,
            allergies=patient_data.allergies,
            admission_type=patient_data.admission_type,
            status=patient_data.status,
            diagnosis=patient_data.diagnosis,
            doctor_assigned=patient_data.doctor_assigned
        )

        db.add(new_patient)
        db.commit()
        db.refresh(new_patient)

        return {"message": "Patient created successfully", "id": new_patient.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating patient: {str(e)}")

@app.get("/api/patients/{patient_id}")
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    return {
        "id": patient.id,
        "name": patient.name,
        "age": patient.age,
        "ward": patient.ward,
        "bed_number": patient.bed_number,
        "condition_notes": patient.condition_notes,
        "emergency_contact": patient.emergency_contact,
        "contact_phone": patient.contact_phone,
        "blood_group": patient.blood_group,
        "allergies": patient.allergies,
        "admission_type": patient.admission_type,
        "status": patient.status,
        "diagnosis": patient.diagnosis,
        "doctor_assigned": patient.doctor_assigned,
        "created_at": patient.created_at,
        "updated_at": patient.updated_at
    }

@app.patch("/api/patients/{patient_id}/notes/")
def update_patient_notes(patient_id: int, notes_data: dict, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    patient.condition_notes = notes_data.get("notes", patient.condition_notes)
    patient.updated_at = datetime.utcnow()

    db.commit()
    return {"message": "Patient notes updated successfully"}

# Beds endpoints with real database operations
@app.get("/api/beds/")
def get_beds(ward: Optional[str] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Bed).outerjoin(Patient, Bed.patient_id == Patient.id)

    if ward:
        query = query.filter(Bed.ward == ward)

    if status:
        query = query.filter(Bed.status == status)

    beds = query.all()

    return [
        {
            "id": bed.id,
            "number": bed.number,
            "ward": bed.ward,
            "status": bed.status,
            "patient_name": bed.patient.name if bed.patient else None,
            "patient_id": bed.patient_id,
            "assigned_nurse": bed.assigned_nurse,
            "last_cleaned": bed.last_cleaned.strftime("%Y-%m-%d %H:%M") if bed.last_cleaned else None,
            "created_at": bed.created_at.strftime("%Y-%m-%d %H:%M") if bed.created_at else None
        }
        for bed in beds
    ]

@app.post("/api/beds/")
def create_bed(bed_data: BedCreate, db: Session = Depends(get_db)):
    try:
        # Check if bed number already exists
        existing_bed = db.query(Bed).filter(Bed.number == bed_data.number).first()
        if existing_bed:
            raise HTTPException(status_code=400, detail="Bed number already exists")

        new_bed = Bed(
            number=bed_data.number,
            ward=bed_data.ward,
            status=bed_data.status,
            assigned_nurse=bed_data.assigned_nurse
        )

        db.add(new_bed)
        db.commit()
        db.refresh(new_bed)

        return {"message": "Bed created successfully", "id": new_bed.id}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating bed: {str(e)}")

@app.patch("/api/beds/{bed_id}/status/")
def update_bed_status(bed_id: int, status_data: BedStatusUpdate, db: Session = Depends(get_db)):
    bed = db.query(Bed).filter(Bed.id == bed_id).first()
    if not bed:
        raise HTTPException(status_code=404, detail="Bed not found")

    bed.status = status_data.status
    bed.updated_at = datetime.utcnow()

    # If bed is being cleaned, update last_cleaned timestamp
    if status_data.status == "Cleaning":
        bed.last_cleaned = datetime.utcnow()

    db.commit()
    return {"message": "Bed status updated successfully"}

@app.post("/api/beds/{bed_id}/assign/")
def assign_patient_to_bed(bed_id: int, assignment_data: dict, db: Session = Depends(get_db)):
    bed = db.query(Bed).filter(Bed.id == bed_id).first()
    if not bed:
        raise HTTPException(status_code=404, detail="Bed not found")

    patient_id = assignment_data.get("patient_id")
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Update bed
    bed.patient_id = patient_id
    bed.status = "Occupied"
    bed.updated_at = datetime.utcnow()

    # Update patient
    patient.bed_number = bed.number
    patient.updated_at = datetime.utcnow()

    db.commit()
    return {"message": "Patient assigned to bed successfully"}

@app.post("/api/beds/{bed_id}/release/")
def release_bed(bed_id: int, db: Session = Depends(get_db)):
    bed = db.query(Bed).filter(Bed.id == bed_id).first()
    if not bed:
        raise HTTPException(status_code=404, detail="Bed not found")

    # Update patient if exists
    if bed.patient_id:
        patient = db.query(Patient).filter(Patient.id == bed.patient_id).first()
        if patient:
            patient.bed_number = None
            patient.updated_at = datetime.utcnow()

    # Update bed
    bed.patient_id = None
    bed.status = "Available"
    bed.updated_at = datetime.utcnow()

    db.commit()
    return {"message": "Bed released successfully"}

# Alerts endpoints with real database operations
@app.get("/api/alerts/")
def get_alerts(
    ward: Optional[str] = None,
    severity: Optional[str] = None,
    resolved: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(EmergencyAlert)

    if ward:
        query = query.filter(EmergencyAlert.ward == ward)

    if severity:
        query = query.filter(EmergencyAlert.severity == severity)

    if resolved is not None:
        query = query.filter(EmergencyAlert.resolved == resolved)

    alerts = query.order_by(EmergencyAlert.created_at.desc()).all()

    return [
        {
            "id": alert.id,
            "title": alert.title,
            "message": alert.message,
            "severity": alert.severity,
            "ward": alert.ward,
            "bed": alert.bed,
            "patient": alert.patient,
            "reported_by": alert.reported_by,
            "acknowledged": alert.acknowledged,
            "acknowledged_by": alert.acknowledged_by,
            "acknowledged_at": alert.acknowledged_at.strftime("%Y-%m-%d %H:%M") if alert.acknowledged_at else None,
            "resolved": alert.resolved,
            "resolved_by": alert.resolved_by,
            "resolved_at": alert.resolved_at.strftime("%Y-%m-%d %H:%M") if alert.resolved_at else None,
            "resolution": alert.resolution,
            "created_at": alert.created_at.strftime("%Y-%m-%d %H:%M") if alert.created_at else None
        }
        for alert in alerts
    ]

@app.post("/api/alerts/")
def create_alert(alert_data: AlertCreate, db: Session = Depends(get_db)):
    try:
        new_alert = EmergencyAlert(
            severity=alert_data.severity,
            title=alert_data.title,
            message=alert_data.message,
            ward=alert_data.ward,
            bed=alert_data.bed,
            patient=alert_data.patient,
            reported_by=alert_data.reported_by
        )

        db.add(new_alert)
        db.commit()
        db.refresh(new_alert)

        return {"message": "Alert created successfully", "id": new_alert.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating alert: {str(e)}")

@app.patch("/api/alerts/{alert_id}/acknowledge/")
def acknowledge_alert(alert_id: int, ack_data: dict, db: Session = Depends(get_db)):
    alert = db.query(EmergencyAlert).filter(EmergencyAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.acknowledged = True
    alert.acknowledged_by = ack_data.get("acknowledged_by")
    alert.acknowledged_at = datetime.utcnow()

    db.commit()
    return {"message": "Alert acknowledged successfully"}

@app.patch("/api/alerts/{alert_id}/resolve/")
def resolve_alert(alert_id: int, resolve_data: dict, db: Session = Depends(get_db)):
    alert = db.query(EmergencyAlert).filter(EmergencyAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert.resolved = True
    alert.resolved_by = resolve_data.get("resolved_by")
    alert.resolved_at = datetime.utcnow()
    alert.resolution = resolve_data.get("resolution")

    db.commit()
    return {"message": "Alert resolved successfully"}

# Staff endpoints
@app.get("/api/staff/")
def get_staff():
    return [
        {
            "id": 1,
            "name": "Dr. Smith",
            "role": "doctor",
            "department": "Cardiology",
            "on_duty": True,
            "shift": "Morning"
        },
        {
            "id": 2,
            "name": "Nurse Johnson",
            "role": "nurse",
            "department": "ICU",
            "on_duty": True,
            "shift": "Night"
        }
    ]

# OPD endpoints
@app.get("/api/opd/schedule/")
def get_opd_schedule():
    return [
        {
            "id": 1,
            "doctor_name": "Dr. Smith",
            "department": "Cardiology",
            "time_slot": "09:00-12:00",
            "available_slots": 5
        },
        {
            "id": 2,
            "doctor_name": "Dr. Johnson",
            "department": "Neurology",
            "time_slot": "14:00-17:00",
            "available_slots": 3
        }
    ]

@app.get("/api/opd/appointments/")
def get_appointments():
    return [
        {
            "id": 1,
            "patient_name": "Alice Brown",
            "doctor": "Dr. Smith",
            "time": "10:00 AM",
            "status": "confirmed"
        }
    ]

# Transfers endpoints with real database operations
@app.get("/api/transfers/")
def get_transfers(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(PatientTransfer).join(Patient, PatientTransfer.patient_id == Patient.id)

    if status:
        query = query.filter(PatientTransfer.status == status)

    transfers = query.order_by(PatientTransfer.created_at.desc()).all()

    return [
        {
            "id": transfer.id,
            "patient_id": transfer.patient_id,
            "patient_name": transfer.patient.name if transfer.patient else "Unknown",
            "from_bed": transfer.from_bed,
            "to_bed": transfer.to_bed,
            "reason": transfer.reason,
            "status": transfer.status,
            "requested_by": transfer.requested_by,
            "approved_by": transfer.approved_by,
            "created_at": transfer.created_at.strftime("%Y-%m-%d %H:%M") if transfer.created_at else None,
            "completed_at": transfer.completed_at.strftime("%Y-%m-%d %H:%M") if transfer.completed_at else None
        }
        for transfer in transfers
    ]

@app.post("/api/transfers/")
def create_transfer(transfer_data: TransferCreate, db: Session = Depends(get_db)):
    try:
        # Verify patient exists
        patient = db.query(Patient).filter(Patient.id == transfer_data.patient_id).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")

        # Verify destination bed exists and is available
        to_bed = db.query(Bed).filter(Bed.number == transfer_data.to_bed).first()
        if not to_bed:
            raise HTTPException(status_code=404, detail="Destination bed not found")

        if to_bed.status != "Available":
            raise HTTPException(status_code=400, detail="Destination bed is not available")

        new_transfer = PatientTransfer(
            patient_id=transfer_data.patient_id,
            from_bed=transfer_data.from_bed,
            to_bed=transfer_data.to_bed,
            reason=transfer_data.reason,
            requested_by=transfer_data.requested_by
        )

        db.add(new_transfer)
        db.commit()
        db.refresh(new_transfer)

        return {"message": "Transfer request created successfully", "id": new_transfer.id}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating transfer: {str(e)}")

@app.patch("/api/transfers/{transfer_id}/approve/")
def approve_transfer(transfer_id: int, approval_data: dict, db: Session = Depends(get_db)):
    transfer = db.query(PatientTransfer).filter(PatientTransfer.id == transfer_id).first()
    if not transfer:
        raise HTTPException(status_code=404, detail="Transfer not found")

    # Update transfer status
    transfer.status = "approved"
    transfer.approved_by = approval_data.get("approved_by")

    # Execute the transfer
    # Release old bed
    old_bed = db.query(Bed).filter(Bed.number == transfer.from_bed).first()
    if old_bed:
        old_bed.patient_id = None
        old_bed.status = "Available"
        old_bed.updated_at = datetime.utcnow()

    # Assign new bed
    new_bed = db.query(Bed).filter(Bed.number == transfer.to_bed).first()
    if new_bed:
        new_bed.patient_id = transfer.patient_id
        new_bed.status = "Occupied"
        new_bed.updated_at = datetime.utcnow()

    # Update patient
    patient = db.query(Patient).filter(Patient.id == transfer.patient_id).first()
    if patient:
        patient.bed_number = transfer.to_bed
        patient.updated_at = datetime.utcnow()

    # Mark transfer as completed
    transfer.status = "completed"
    transfer.completed_at = datetime.utcnow()

    db.commit()
    return {"message": "Transfer approved and completed successfully"}

@app.patch("/api/transfers/{transfer_id}/reject/")
def reject_transfer(transfer_id: int, rejection_data: dict, db: Session = Depends(get_db)):
    transfer = db.query(PatientTransfer).filter(PatientTransfer.id == transfer_id).first()
    if not transfer:
        raise HTTPException(status_code=404, detail="Transfer not found")

    transfer.status = "rejected"
    transfer.approved_by = rejection_data.get("rejected_by")
    transfer.reason = f"{transfer.reason} | Rejected: {rejection_data.get('reason', 'No reason provided')}"

    db.commit()
    return {"message": "Transfer rejected successfully"}

@app.get("/")
def root():
    return {"message": "HospiTrack FastAPI is running"}

@app.get("/api/health/")
def health_check():
    return {
        "status": "healthy",
        "message": "HospiTrack FastAPI is running",
        "cors": "enabled"
    }

@app.post("/api/admin/clear-all-data/")
def clear_all_database_data():
    """Clear all data from the database - USE WITH CAUTION!"""
    try:
        clear_all_data()
        # Recreate default users
        db = next(get_db())
        create_default_users(db)
        return {"message": "All data cleared and default users recreated"}
    except Exception as e:
        return {"error": f"Failed to clear data: {str(e)}"}
