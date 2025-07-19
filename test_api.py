#!/usr/bin/env python3
"""
Test script for HospiTrack API endpoints
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_endpoint(url, method="GET", data=None):
    """Test an API endpoint"""
    try:
        print(f"\n🔍 Testing {method} {url}")

        headers = {'Content-Type': 'application/json'}

        if method == "GET":
            response = requests.get(url, timeout=5, headers=headers)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=5, headers=headers)

        print(f"Status: {response.status_code}")

        if response.status_code in [200, 201]:
            print("✅ SUCCESS")
            try:
                result = response.json()
                print(f"📄 Response: {json.dumps(result, indent=2)}")
            except:
                print(f"📄 Response: {response.text}")
            return True
        else:
            print(f"❌ FAILED - Status: {response.status_code}")
            print(f"📄 Error Response: {response.text}")
            return False

    except requests.exceptions.ConnectionError:
        print(f"❌ CONNECTION ERROR: Cannot connect to {url}")
        print("   🔧 Make sure Django server is running on http://localhost:8000")
        print("   🔧 Try: python manage.py runserver 0.0.0.0:8000")
        return False
    except Exception as e:
        print(f"❌ UNEXPECTED ERROR: {e}")
        return False

def main():
    print("🏥 HospiTrack API Test Suite")
    print("=" * 50)
    
    # Test endpoints
    endpoints = [
        ("Root", f"{BASE_URL}/", "GET"),
        ("API Root", f"{BASE_URL}/api/", "GET"),
        ("Health Check", f"{BASE_URL}/api/health/", "GET"),
        ("System Stats", f"{BASE_URL}/api/dashboard/system-stats/", "GET"),
        ("Bed Occupancy", f"{BASE_URL}/api/dashboard/bed-occupancy/", "GET"),
        ("Patient Stats", f"{BASE_URL}/api/dashboard/patient-stats/", "GET"),
        ("OPD Stats", f"{BASE_URL}/api/dashboard/opd-stats/", "GET"),
        ("Patients", f"{BASE_URL}/api/patients/", "GET"),
        ("Beds", f"{BASE_URL}/api/beds/", "GET"),
        ("Alerts", f"{BASE_URL}/api/alerts/", "GET"),
    ]
    
    results = []
    
    for name, url, method in endpoints:
        success = test_endpoint(url, method)
        results.append((name, success))
    
    # Test login endpoint
    print(f"\n🔍 Testing POST {BASE_URL}/api/auth/login/")
    login_data = {
        "email": "admin@hospital.com",
        "password": "admin123"
    }
    success = test_endpoint(f"{BASE_URL}/api/auth/login/", "POST", login_data)
    results.append(("Login", success))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    print("=" * 50)
    
    for name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{name:20} {status}")
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Your API is working correctly.")
        print("\n🌐 You can now test your frontend at: http://localhost:5174/auth")
        print("🔑 Use: admin@hospital.com / admin123")
    else:
        print("⚠️  Some tests failed. Check the Django server logs for errors.")

if __name__ == "__main__":
    main()
