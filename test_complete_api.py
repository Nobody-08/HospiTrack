#!/usr/bin/env python3
"""
Comprehensive API test for HospiTrack
Tests all endpoints with real database operations
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_endpoint(method, url, data=None, headers=None, expected_status=200):
    """Test an API endpoint"""
    try:
        print(f"\n🔍 Testing {method} {url}")
        
        if headers is None:
            headers = {'Content-Type': 'application/json'}
        
        if method == "GET":
            response = requests.get(url, headers=headers, timeout=10)
        elif method == "POST":
            response = requests.post(url, json=data, headers=headers, timeout=10)
        elif method == "PATCH":
            response = requests.patch(url, json=data, headers=headers, timeout=10)
        
        print(f"Status: {response.status_code}")
        
        if response.status_code == expected_status:
            print("✅ SUCCESS")
            try:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    print(f"📄 Response: {len(result)} items returned")
                    print(f"📄 Sample: {json.dumps(result[0], indent=2)[:200]}...")
                else:
                    print(f"📄 Response: {json.dumps(result, indent=2)[:300]}...")
            except:
                print(f"📄 Response: {response.text[:200]}...")
            return True, response.json() if response.text else {}
        else:
            print(f"❌ FAILED - Expected: {expected_status}, Got: {response.status_code}")
            print(f"📄 Error: {response.text[:200]}...")
            return False, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ CONNECTION ERROR: {e}")
        return False, None

def main():
    print("🏥 HospiTrack Complete API Test Suite")
    print("=" * 60)
    
    # Test authentication first
    print("\n🔐 AUTHENTICATION TESTS")
    print("-" * 30)
    
    # Test login
    login_data = {"email": "admin@hospital.com", "password": "admin123"}
    success, auth_response = test_endpoint("POST", f"{BASE_URL}/api/auth/login/", login_data)
    
    if not success:
        print("❌ Authentication failed - cannot continue with other tests")
        return
    
    access_token = auth_response.get("access", "")
    auth_headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {access_token}'
    }
    
    # Test registration
    test_endpoint("POST", f"{BASE_URL}/api/auth/nurse/register/", {
        "name": "Test Nurse",
        "email": "test.nurse@hospital.com",
        "password": "test123",
        "ward_assigned": "ICU",
        "shift": "Day"
    })
    
    print("\n🏥 DASHBOARD TESTS")
    print("-" * 30)
    
    # Test dashboard endpoints
    test_endpoint("GET", f"{BASE_URL}/api/dashboard/system-stats/")
    test_endpoint("GET", f"{BASE_URL}/api/dashboard/bed-occupancy/")
    test_endpoint("GET", f"{BASE_URL}/api/dashboard/opd-stats/")
    
    print("\n👥 PATIENT TESTS")
    print("-" * 30)
    
    # Test patients
    test_endpoint("GET", f"{BASE_URL}/api/patients/")
    
    # Create a new patient
    patient_data = {
        "name": "Test Patient",
        "age": 35,
        "ward": "General",
        "condition_notes": "Test admission",
        "emergency_contact": "Test Contact",
        "contact_phone": "+1234567890",
        "blood_group": "O+",
        "status": "Stable"
    }
    success, patient_response = test_endpoint("POST", f"{BASE_URL}/api/patients/", patient_data, expected_status=200)
    
    if success and patient_response:
        patient_id = patient_response.get("id")
        if patient_id:
            # Test patient details
            test_endpoint("GET", f"{BASE_URL}/api/patients/{patient_id}")
            
            # Test patient notes update
            test_endpoint("PATCH", f"{BASE_URL}/api/patients/{patient_id}/notes/", {
                "notes": "Updated by API test"
            })
    
    print("\n🛏️ BED TESTS")
    print("-" * 30)
    
    # Test beds
    test_endpoint("GET", f"{BASE_URL}/api/beds/")
    test_endpoint("GET", f"{BASE_URL}/api/beds/?ward=ICU")
    test_endpoint("GET", f"{BASE_URL}/api/beds/?status=Available")
    
    # Create a new bed
    bed_data = {
        "number": "TEST001",
        "ward": "Test Ward",
        "status": "Available"
    }
    success, bed_response = test_endpoint("POST", f"{BASE_URL}/api/beds/", bed_data)
    
    if success and bed_response:
        bed_id = bed_response.get("id")
        if bed_id:
            # Test bed status update
            test_endpoint("PATCH", f"{BASE_URL}/api/beds/{bed_id}/status/", {
                "status": "Cleaning"
            })
    
    print("\n🚨 ALERT TESTS")
    print("-" * 30)
    
    # Test alerts
    test_endpoint("GET", f"{BASE_URL}/api/alerts/")
    test_endpoint("GET", f"{BASE_URL}/api/alerts/?resolved=false")
    
    # Create a new alert
    alert_data = {
        "severity": "high",
        "title": "API Test Alert",
        "message": "This is a test alert created by the API test suite",
        "ward": "Test Ward",
        "reported_by": "API Test"
    }
    success, alert_response = test_endpoint("POST", f"{BASE_URL}/api/alerts/", alert_data)
    
    if success and alert_response:
        alert_id = alert_response.get("id")
        if alert_id:
            # Test alert acknowledgment
            test_endpoint("PATCH", f"{BASE_URL}/api/alerts/{alert_id}/acknowledge/", {
                "acknowledged_by": "API Test"
            })
            
            # Test alert resolution
            test_endpoint("PATCH", f"{BASE_URL}/api/alerts/{alert_id}/resolve/", {
                "resolved_by": "API Test",
                "resolution": "Resolved by API test"
            })
    
    print("\n🔄 TRANSFER TESTS")
    print("-" * 30)
    
    # Test transfers
    test_endpoint("GET", f"{BASE_URL}/api/transfers/")
    
    print("\n" + "=" * 60)
    print("🎉 API Test Suite Complete!")
    print()
    print("💡 Next Steps:")
    print("1. Start your frontend: npm run dev (in frontend directory)")
    print("2. Go to: http://localhost:5174/auth")
    print("3. Login with: admin@hospital.com / admin123")
    print("4. Test real-time functionality:")
    print("   - Login as Nurse and add/update beds")
    print("   - Login as Admin and see changes reflected")
    print("   - Create alerts and see them across roles")
    print("   - Register patients and manage transfers")

if __name__ == "__main__":
    main()
