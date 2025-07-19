# 🏥 HospiTrack - Complete Hospital Management System

## 🎯 **REAL-TIME HOSPITAL MANAGEMENT WITH DATABASE INTEGRATION**

HospiTrack is a comprehensive hospital management system with **real database integration**, **role-based authentication**, and **real-time cross-role functionality**.

### ✅ **Key Features Implemented:**

- **🔐 Real Database Authentication** - SQLAlchemy with bcrypt password hashing
- **👥 Role-Based Access Control** - Admin, Doctor, Nurse with separate databases
- **🛏️ Real-Time Bed Management** - Nurses can add/update beds, visible to Admins instantly
- **👨‍⚕️ Patient Management** - Complete CRUD operations with database persistence
- **🚨 Emergency Alert System** - Cross-role alert creation and management
- **🔄 Patient Transfers** - Request and approval workflow
- **📊 Live Dashboard Statistics** - Real-time data from database queries
- **🌐 CORS Configured** - Frontend-backend communication enabled

---

## 🚀 **QUICK START (Complete Setup)**

### **Step 1: Start the Backend**
```bash
python run_fastapi.py
```

This will:
- ✅ Install all required packages
- ✅ Create SQLite database with proper schema
- ✅ Clear any existing mock data
- ✅ Create default users with hashed passwords
- ✅ Add sample hospital data (beds, patients)
- ✅ Start FastAPI server on http://localhost:8000

### **Step 2: Test the Backend**
```bash
python test_complete_api.py
```

### **Step 3: Start the Frontend**
```bash
cd frontend
npm install
npm run dev
```

### **Step 4: Login and Test**
Go to: http://localhost:5174/auth

**Login Credentials:**
- **Admin**: `admin@hospital.com` / `admin123`
- **Doctor**: `doctor@hospital.com` / `doctor123`  
- **Nurse**: `nurse@hospital.com` / `nurse123`

---

## 🎯 **REAL-TIME TESTING SCENARIOS**

### **Scenario 1: Nurse Adds Bed → Admin Sees It**
1. Login as **Nurse** (nurse@hospital.com / nurse123)
2. Go to Bed Management
3. Add a new bed (e.g., "401", "ICU", "Available")
4. Open new browser tab, login as **Admin**
5. Check Admin Dashboard → New bed appears in statistics
6. Go to Bed Management → New bed visible in list

### **Scenario 2: Cross-Role Alert System**
1. Login as **Nurse**
2. Create an emergency alert
3. Login as **Admin** in another tab
4. Alert appears in Admin dashboard immediately
5. Admin can acknowledge/resolve alerts

### **Scenario 3: Patient Management**
1. Login as **Admin**
2. Register a new patient
3. Assign patient to bed
4. Login as **Nurse** → Patient visible in ward
5. Nurse updates patient notes
6. Admin sees updated notes instantly

---

## 🗄️ **DATABASE STRUCTURE**

### **User Tables (Role-Based):**
- `admin_users` - Hospital administrators
- `doctor_users` - Medical doctors with specializations
- `nurse_users` - Nurses with ward assignments

### **Hospital Data Tables:**
- `patients` - Patient records with medical info
- `beds` - Bed management with status tracking
- `emergency_alerts` - Alert system with severity levels
- `patient_transfers` - Transfer requests and approvals

### **Key Features:**
- **Password Hashing** - bcrypt for security
- **JWT Authentication** - Secure token-based auth
- **Foreign Key Relationships** - Proper data integrity
- **Timestamps** - Created/updated tracking
- **Status Management** - Bed availability, patient status

---

## 🔗 **API ENDPOINTS (All Database-Backed)**

### **Authentication:**
- `POST /api/auth/login/` - Login with database verification
- `POST /api/auth/admin/register/` - Register admin user
- `POST /api/auth/doctor/register/` - Register doctor user
- `POST /api/auth/nurse/register/` - Register nurse user

### **Dashboard (Real-Time Statistics):**
- `GET /api/dashboard/system-stats/` - Live hospital statistics
- `GET /api/dashboard/bed-occupancy/` - Real bed occupancy by ward
- `GET /api/dashboard/opd-stats/` - OPD appointment statistics

### **Patients (Full CRUD):**
- `GET /api/patients/` - List all patients (with filters)
- `POST /api/patients/` - Create new patient
- `GET /api/patients/{id}/` - Get patient details
- `PATCH /api/patients/{id}/notes/` - Update patient notes

### **Beds (Real-Time Management):**
- `GET /api/beds/` - List all beds (with filters)
- `POST /api/beds/` - Create new bed (Nurse → Admin visibility)
- `PATCH /api/beds/{id}/status/` - Update bed status
- `POST /api/beds/{id}/assign/` - Assign patient to bed
- `POST /api/beds/{id}/release/` - Release bed

### **Alerts (Cross-Role System):**
- `GET /api/alerts/` - List alerts (with filters)
- `POST /api/alerts/` - Create new alert
- `PATCH /api/alerts/{id}/acknowledge/` - Acknowledge alert
- `PATCH /api/alerts/{id}/resolve/` - Resolve alert

### **Transfers (Workflow Management):**
- `GET /api/transfers/` - List transfer requests
- `POST /api/transfers/` - Create transfer request
- `PATCH /api/transfers/{id}/approve/` - Approve transfer
- `PATCH /api/transfers/{id}/reject/` - Reject transfer

---

## 🔧 **TECHNICAL IMPLEMENTATION**

### **Backend (FastAPI + SQLAlchemy):**
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM with proper relationships
- **bcrypt** - Password hashing
- **JWT** - Token-based authentication
- **CORS** - Cross-origin resource sharing
- **SQLite** - Database (easily changeable to PostgreSQL/MySQL)

### **Frontend (React + Vite):**
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client with interceptors
- **Custom Hooks** - useAPI, useAPIMutation, useRealTimeData
- **Role-Based Routing** - Different dashboards per role
- **Real-Time Updates** - Auto-refresh with API polling

### **Key Integration Points:**
- **Authentication Flow** - JWT tokens stored in localStorage
- **Role-Based Access** - Different API endpoints per role
- **Real-Time Data** - Automatic refresh every 15-30 seconds
- **Error Handling** - Comprehensive error management
- **Loading States** - User feedback during API calls

---

## 🎉 **SUCCESS INDICATORS**

When everything is working correctly, you should see:

### **Backend:**
```
✅ Database connected successfully!
   📊 Patients: 2
   🛏️  Beds: 8
   🚨 Alerts: 0
🚀 Starting FastAPI Server...
INFO: Uvicorn running on http://0.0.0.0:8000
```

### **Frontend:**
- ✅ Login works without CORS errors
- ✅ Dashboard shows real statistics from database
- ✅ Nurse can add beds → Admin sees them immediately
- ✅ Alerts created by one role visible to others
- ✅ Patient data persists across sessions
- ✅ Real-time updates work automatically

### **Cross-Role Functionality:**
- ✅ **Nurse adds bed** → **Admin dashboard updates**
- ✅ **Admin creates alert** → **Nurse sees it**
- ✅ **Doctor updates patient** → **Nurse sees changes**
- ✅ **All data persists** in database between sessions

---

## 🔍 **TROUBLESHOOTING**

### **Backend Issues:**
```bash
python troubleshoot.py  # Diagnose connection issues
```

### **Database Issues:**
```bash
python setup_database.py  # Reset database
```

### **API Testing:**
```bash
python test_complete_api.py  # Test all endpoints
```

### **Common Solutions:**
- **CORS Error**: Backend not running or wrong port
- **Login Failed**: Check database setup and user creation
- **Data Not Updating**: Check real-time polling intervals
- **404 Errors**: Verify API endpoint URLs match

---

## 📱 **USAGE INSTRUCTIONS**

1. **Start Backend**: `python run_fastapi.py`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Login**: http://localhost:5174/auth
4. **Test Real-Time**: Login as different roles in different tabs
5. **Verify Database**: Changes persist across browser sessions

**The system is now fully functional with real database integration and cross-role real-time functionality!** 🎉
