import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PatientCard from "../components/PatientCard";
import AlertCard from "../components/AlertCard";
import DashboardCard from "../components/DashboardCard";

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);
  const [selectedWard, setSelectedWard] = useState("all");

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockPatients = [
      {
        id: 1,
        name: "Meena Sharma",
        age: 45,
        ward: "ICU",
        bed: "101",
        status: "Stable",
        diagnosis: "Post-operative recovery",
        admissionDate: "2025-01-10",
        vitalSigns: {
          heartRate: 72,
          bloodPressure: "120/80",
          temperature: 98.6,
          oxygenLevel: 98
        },
        lastNotes: "Continue current medication. Monitor vitals every 2 hours.",
        notes: "Patient responding well to treatment. Pain levels manageable."
      },
      {
        id: 2,
        name: "Rajesh Kumar",
        age: 62,
        ward: "General",
        bed: "205",
        status: "Under Observation",
        diagnosis: "Diabetes management",
        admissionDate: "2025-01-12",
        vitalSigns: {
          heartRate: 85,
          bloodPressure: "140/90",
          temperature: 99.1,
          oxygenLevel: 96
        },
        lastNotes: "Blood sugar levels stabilizing. Adjust insulin dosage.",
        notes: ""
      },
      {
        id: 3,
        name: "Priya Patel",
        age: 28,
        ward: "Maternity",
        bed: "301",
        status: "Recovering",
        diagnosis: "Post-delivery care",
        admissionDate: "2025-01-14",
        vitalSigns: {
          heartRate: 68,
          bloodPressure: "110/70",
          temperature: 98.4,
          oxygenLevel: 99
        },
        lastNotes: "Normal recovery progress. Ready for discharge tomorrow.",
        notes: "Excellent recovery. Baby and mother both healthy."
      },
      {
        id: 4,
        name: "Amit Singh",
        age: 35,
        ward: "ICU",
        bed: "103",
        status: "Critical",
        diagnosis: "Cardiac emergency",
        admissionDate: "2025-01-15",
        vitalSigns: {
          heartRate: 110,
          bloodPressure: "160/100",
          temperature: 100.2,
          oxygenLevel: 92
        },
        lastNotes: "Requires immediate attention. Monitor cardiac function closely.",
        notes: "Patient stabilized after emergency intervention. Continue intensive monitoring."
      }
    ];

    const mockAlerts = [
      {
        id: 1,
        severity: "critical",
        title: "Oxygen Level Drop",
        message: "Patient in ICU bed 103 showing decreased oxygen saturation",
        timestamp: new Date().toISOString(),
        location: "ICU",
        patient: "Amit Singh",
        ward: "ICU",
        bed: "103",
        reportedBy: "Nurse Station",
        vitalSigns: {
          oxygenLevel: 92,
          heartRate: 110
        },
        acknowledged: false
      },
      {
        id: 2,
        severity: "high",
        title: "Elevated Heart Rate",
        message: "Patient showing sustained elevated heart rate",
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        location: "General Ward",
        patient: "Rajesh Kumar",
        ward: "General",
        bed: "205",
        reportedBy: "Monitoring System",
        vitalSigns: {
          heartRate: 85,
          bloodPressure: "140/90"
        },
        acknowledged: true,
        acknowledgedBy: "Dr. Smith",
        acknowledgedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
      }
    ];

    setPatients(mockPatients);
    setEmergencyAlerts(mockAlerts);
  }, []);

  const handleUpdateNotes = (patientId, notes) => {
    setPatients(prev => prev.map(patient =>
      patient.id === patientId
        ? { ...patient, notes, lastNotes: notes }
        : patient
    ));
  };

  const handleAcknowledgeAlert = (alertId) => {
    setEmergencyAlerts(prev => prev.map(alert =>
      alert.id === alertId
        ? {
            ...alert,
            acknowledged: true,
            acknowledgedBy: "Dr. Current User",
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
            resolvedBy: "Dr. Current User",
            resolvedAt: new Date().toISOString()
          }
        : alert
    ));
  };

  const filteredPatients = selectedWard === "all"
    ? patients
    : patients.filter(patient => patient.ward.toLowerCase() === selectedWard.toLowerCase());

  const criticalPatients = patients.filter(p => p.status.toLowerCase() === "critical").length;
  const totalPatients = patients.length;
  const pendingAlerts = emergencyAlerts.filter(a => !a.acknowledged).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">👨‍⚕️ Doctor Portal</h1>
              <p className="text-gray-600 mt-1">Manage your assigned patients and medical care</p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/opd-schedule"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                📅 OPD Schedule
              </Link>
              <Link
                to="/emergency-alerts"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                🚨 Emergency Alerts
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Total Patients"
            value={totalPatients}
            icon="👥"
            color="blue"
            subtitle="Assigned to you"
          />
          <DashboardCard
            title="Critical Patients"
            value={criticalPatients}
            icon="🚨"
            color="red"
            subtitle="Require immediate attention"
          />
          <DashboardCard
            title="Pending Alerts"
            value={pendingAlerts}
            icon="⚠️"
            color="yellow"
            subtitle="Unacknowledged alerts"
            linkTo="/emergency-alerts"
            linkText="View Alerts"
          />
          <DashboardCard
            title="OPD Today"
            value="15"
            icon="📅"
            color="green"
            subtitle="Scheduled appointments"
            linkTo="/opd-schedule"
            linkText="View Schedule"
          />
        </div>

        {/* Emergency Alerts Section */}
        {emergencyAlerts.filter(a => !a.resolved).length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🚨 Active Emergency Alerts</h2>
            <div className="space-y-4">
              {emergencyAlerts
                .filter(alert => !alert.resolved)
                .slice(0, 3)
                .map(alert => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onAcknowledge={handleAcknowledgeAlert}
                    onResolve={handleResolveAlert}
                  />
                ))}
            </div>
            {emergencyAlerts.filter(a => !a.resolved).length > 3 && (
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

        {/* Patient List Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">👤 Assigned Patients</h2>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Filter by Ward:</label>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Wards</option>
                <option value="icu">ICU</option>
                <option value="general">General</option>
                <option value="maternity">Maternity</option>
                <option value="pediatrics">Pediatrics</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPatients.map(patient => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onUpdateNotes={handleUpdateNotes}
                showMedicalNotes={true}
              />
            ))}
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-600">
                {selectedWard === "all"
                  ? "You don't have any assigned patients at the moment."
                  : `No patients assigned in ${selectedWard.toUpperCase()} ward.`
                }
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">⚡ Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/opd-schedule"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">📅</span>
              <div>
                <h4 className="font-medium">OPD Schedule</h4>
                <p className="text-sm text-gray-600">Manage outpatient appointments</p>
              </div>
            </Link>
            <Link
              to="/emergency-alerts"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">🚨</span>
              <div>
                <h4 className="font-medium">Emergency Alerts</h4>
                <p className="text-sm text-gray-600">View and manage alerts</p>
              </div>
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">🔄</span>
              <div>
                <h4 className="font-medium">Refresh Data</h4>
                <p className="text-sm text-gray-600">Update patient information</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;