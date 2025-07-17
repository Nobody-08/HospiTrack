import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BedCard from "../components/BedCard";
import AlertCard from "../components/AlertCard";
import DashboardCard from "../components/DashboardCard";

const BedManagement = () => {
  const [beds, setBeds] = useState([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);
  const [selectedWard, setSelectedWard] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockBeds = [
      {
        number: "101",
        ward: "ICU",
        status: "Occupied",
        patient: {
          name: "Amit Singh",
          age: 35,
          condition: "Cardiac emergency"
        },
        lastCleaned: "2025-01-16 08:00",
        assignedNurse: "Nurse Sarah",
        emergencyAlert: "Oxygen level monitoring required"
      },
      {
        number: "102",
        ward: "ICU",
        status: "Available",
        lastCleaned: "2025-01-16 10:30",
        assignedNurse: "Nurse Sarah"
      },
      {
        number: "103",
        ward: "ICU",
        status: "Cleaning",
        lastCleaned: "2025-01-16 09:15",
        assignedNurse: "Nurse Sarah"
      },
      {
        number: "201",
        ward: "General",
        status: "Occupied",
        patient: {
          name: "Rajesh Kumar",
          age: 62,
          condition: "Diabetes management"
        },
        lastCleaned: "2025-01-16 07:45",
        assignedNurse: "Nurse Priya"
      },
      {
        number: "202",
        ward: "General",
        status: "Available",
        lastCleaned: "2025-01-16 11:00",
        assignedNurse: "Nurse Priya"
      },
      {
        number: "203",
        ward: "General",
        status: "Maintenance",
        lastCleaned: "2025-01-15 16:30",
        assignedNurse: "Nurse Priya"
      },
      {
        number: "301",
        ward: "Maternity",
        status: "Occupied",
        patient: {
          name: "Priya Patel",
          age: 28,
          condition: "Post-delivery care"
        },
        lastCleaned: "2025-01-16 06:00",
        assignedNurse: "Nurse Meera"
      },
      {
        number: "302",
        ward: "Maternity",
        status: "Available",
        lastCleaned: "2025-01-16 09:30",
        assignedNurse: "Nurse Meera"
      },
      {
        number: "401",
        ward: "Pediatrics",
        status: "Occupied",
        patient: {
          name: "Arjun Sharma",
          age: 8,
          condition: "Respiratory infection"
        },
        lastCleaned: "2025-01-16 08:30",
        assignedNurse: "Nurse Kavya"
      },
      {
        number: "402",
        ward: "Pediatrics",
        status: "Available",
        lastCleaned: "2025-01-16 10:00",
        assignedNurse: "Nurse Kavya"
      }
    ];

    const mockAlerts = [
      {
        id: 1,
        severity: "critical",
        title: "ICU Bed 101 - Oxygen Alert",
        message: "Patient requires immediate oxygen level monitoring",
        timestamp: new Date().toISOString(),
        location: "ICU",
        patient: "Amit Singh",
        ward: "ICU",
        bed: "101",
        reportedBy: "Monitoring System",
        acknowledged: false
      },
      {
        id: 2,
        severity: "high",
        title: "Bed Transfer Request",
        message: "Patient in General Ward bed 201 requesting transfer to private room",
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        location: "General Ward",
        patient: "Rajesh Kumar",
        ward: "General",
        bed: "201",
        reportedBy: "Patient Request",
        acknowledged: true,
        acknowledgedBy: "Nurse Priya",
        acknowledgedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        severity: "medium",
        title: "Maintenance Required",
        message: "Bed 203 requires urgent maintenance - electrical issue",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        location: "General Ward",
        ward: "General",
        bed: "203",
        reportedBy: "Maintenance Team",
        acknowledged: true,
        acknowledgedBy: "Nurse Priya",
        acknowledgedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString()
      }
    ];

    setBeds(mockBeds);
    setEmergencyAlerts(mockAlerts);
  }, []);

  const handleStatusUpdate = async (bedNumber, newStatus) => {
    setBeds(prev => prev.map(bed =>
      bed.number === bedNumber
        ? {
            ...bed,
            status: newStatus,
            lastCleaned: newStatus === "Cleaning" ? new Date().toLocaleString() : bed.lastCleaned
          }
        : bed
    ));
  };

  const handleAcknowledgeAlert = (alertId) => {
    setEmergencyAlerts(prev => prev.map(alert =>
      alert.id === alertId
        ? {
            ...alert,
            acknowledged: true,
            acknowledgedBy: "Current Nurse",
            acknowledgedAt: new Date().toISOString()
          }
        : alert
    ));
  };

  const handleResolveAlert = (alertId) => {
    setEmergencyAlerts(prev => prev.map(alert =>
      alert.id === alertId
        ? {
            ...alert,
            resolved: true,
            resolvedBy: "Current Nurse",
            resolvedAt: new Date().toISOString()
          }
        : alert
    ));
  };

  const filteredBeds = beds.filter(bed => {
    const wardMatch = selectedWard === "all" || bed.ward.toLowerCase() === selectedWard.toLowerCase();
    const statusMatch = selectedStatus === "all" || bed.status.toLowerCase() === selectedStatus.toLowerCase();
    return wardMatch && statusMatch;
  });

  const bedStats = {
    total: beds.length,
    available: beds.filter(b => b.status === "Available").length,
    occupied: beds.filter(b => b.status === "Occupied").length,
    cleaning: beds.filter(b => b.status === "Cleaning").length,
    maintenance: beds.filter(b => b.status === "Maintenance").length
  };

  const pendingAlerts = emergencyAlerts.filter(a => !a.acknowledged).length;
  const icuAlerts = emergencyAlerts.filter(a => a.ward === "ICU" && !a.resolved).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🧑‍⚕️ Nurse Dashboard</h1>
              <p className="text-gray-600 mt-1">Monitor bed assignments and respond to emergency alerts</p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/emergency-alerts"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                🚨 Emergency Alerts ({pendingAlerts})
              </Link>
              <Link
                to="/register-patient"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                ➕ Register Patient
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <DashboardCard
            title="Total Beds"
            value={bedStats.total}
            icon="🛏️"
            color="blue"
            subtitle="All hospital beds"
          />
          <DashboardCard
            title="Available"
            value={bedStats.available}
            icon="✅"
            color="green"
            subtitle="Ready for patients"
          />
          <DashboardCard
            title="Occupied"
            value={bedStats.occupied}
            icon="👤"
            color="gray"
            subtitle="Currently in use"
          />
          <DashboardCard
            title="Cleaning"
            value={bedStats.cleaning}
            icon="🧹"
            color="yellow"
            subtitle="Being sanitized"
          />
          <DashboardCard
            title="ICU Alerts"
            value={icuAlerts}
            icon="🚨"
            color="red"
            subtitle="Critical care alerts"
            linkTo="/emergency-alerts"
            linkText="View Alerts"
          />
        </div>

        {/* Emergency Alerts Section */}
        {emergencyAlerts.filter(a => !a.resolved).length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🚨 Active Emergency Alerts</h2>
            <div className="space-y-4">
              {emergencyAlerts
                .filter(alert => !alert.resolved)
                .slice(0, 2)
                .map(alert => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onAcknowledge={handleAcknowledgeAlert}
                    onResolve={handleResolveAlert}
                  />
                ))}
            </div>
            {emergencyAlerts.filter(a => !a.resolved).length > 2 && (
              <div className="mt-4 text-center">
                <Link
                  to="/emergency-alerts"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View all {emergencyAlerts.filter(a => !a.resolved).length} alerts →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">🔍 Filter Beds</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ward:</label>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Wards</option>
                <option value="icu">ICU</option>
                <option value="general">General</option>
                <option value="maternity">Maternity</option>
                <option value="pediatrics">Pediatrics</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="cleaning">Cleaning</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bed Grid */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">🛏️ Bed Status Overview</h2>
            <div className="text-sm text-gray-600">
              Showing {filteredBeds.length} of {beds.length} beds
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBeds.map(bed => (
              <BedCard
                key={bed.number}
                bed={bed}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>

          {filteredBeds.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🛏️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No beds found</h3>
              <p className="text-gray-600">
                No beds match the current filter criteria.
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">⚡ Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              to="/register-patient"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">➕</span>
              <div>
                <h4 className="font-medium">Register Patient</h4>
                <p className="text-sm text-gray-600">Add new patient</p>
              </div>
            </Link>
            <Link
              to="/emergency-alerts"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">🚨</span>
              <div>
                <h4 className="font-medium">Emergency Alerts</h4>
                <p className="text-sm text-gray-600">View and respond to alerts</p>
              </div>
            </Link>
            <button
              onClick={() => {
                setBeds(prev => prev.map(bed =>
                  bed.status === "Cleaning"
                    ? { ...bed, status: "Available", lastCleaned: new Date().toLocaleString() }
                    : bed
                ));
              }}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">🧹</span>
              <div>
                <h4 className="font-medium">Complete Cleaning</h4>
                <p className="text-sm text-gray-600">Mark all cleaning as done</p>
              </div>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">🔄</span>
              <div>
                <h4 className="font-medium">Refresh Data</h4>
                <p className="text-sm text-gray-600">Update bed information</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BedManagement;