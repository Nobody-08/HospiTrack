import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardCard from "../components/DashboardCard";
import AlertCard from "../components/AlertCard";

const AdminDashboard = () => {
  const [systemStats, setSystemStats] = useState({});
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [opdTrends, setOpdTrends] = useState({});

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockStats = {
      totalPatients: 128,
      availableBeds: 34,
      totalBeds: 150,
      emergencyAlerts: 2,
      opdToday: 15,
      opdThisWeek: 89,
      staffOnDuty: 45,
      totalStaff: 67,
      systemUptime: "99.8%",
      avgResponseTime: "2.3s"
    };

    const mockAlerts = [
      {
        id: 1,
        severity: "critical",
        title: "ICU Capacity Alert",
        message: "ICU is at 95% capacity - consider patient transfers",
        timestamp: new Date().toISOString(),
        location: "ICU",
        ward: "ICU",
        reportedBy: "System Monitor",
        acknowledged: false
      },
      {
        id: 2,
        severity: "high",
        title: "Staff Shortage",
        message: "Night shift in General Ward is understaffed",
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        location: "General Ward",
        ward: "General",
        reportedBy: "HR System",
        acknowledged: true,
        acknowledgedBy: "Admin User",
        acknowledgedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      }
    ];

    const mockRecentPatients = [
      {
        id: 1,
        name: "Amit Singh",
        age: 35,
        ward: "ICU",
        admissionDate: "2025-01-16",
        status: "Critical",
        registeredBy: "Dr. Sharma"
      },
      {
        id: 2,
        name: "Priya Patel",
        age: 28,
        ward: "Maternity",
        admissionDate: "2025-01-15",
        status: "Stable",
        registeredBy: "Nurse Meera"
      },
      {
        id: 3,
        name: "Arjun Kumar",
        age: 8,
        ward: "Pediatrics",
        admissionDate: "2025-01-15",
        status: "Recovering",
        registeredBy: "Dr. Nair"
      }
    ];

    const mockOpdTrends = {
      today: 15,
      yesterday: 18,
      thisWeek: 89,
      lastWeek: 76,
      thisMonth: 342,
      lastMonth: 298
    };

    setSystemStats(mockStats);
    setRecentAlerts(mockAlerts);
    setRecentPatients(mockRecentPatients);
    setOpdTrends(mockOpdTrends);
  }, []);

  const handleAcknowledgeAlert = (alertId) => {
    setRecentAlerts(prev => prev.map(alert =>
      alert.id === alertId
        ? {
            ...alert,
            acknowledged: true,
            acknowledgedBy: "Admin User",
            acknowledgedAt: new Date().toISOString()
          }
        : alert
    ));
  };

  const handleResolveAlert = (alertId) => {
    setRecentAlerts(prev => prev.map(alert =>
      alert.id === alertId
        ? {
            ...alert,
            resolved: true,
            resolvedBy: "Admin User",
            resolvedAt: new Date().toISOString()
          }
        : alert
    ));
  };

  const bedOccupancyRate = ((systemStats.totalBeds - systemStats.availableBeds) / systemStats.totalBeds * 100).toFixed(1);
  const staffUtilization = (systemStats.staffOnDuty / systemStats.totalStaff * 100).toFixed(1);
  const opdGrowth = ((opdTrends.thisWeek - opdTrends.lastWeek) / opdTrends.lastWeek * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🧑‍💼 Admin Portal</h1>
              <p className="text-gray-600 mt-1">Complete system overview and management</p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/register-patient"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                ➕ Register Patient
              </Link>
              <Link
                to="/bed-management"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                🛏️ Bed Management
              </Link>
              <Link
                to="/opd-schedule"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                📅 OPD Schedule
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Total Patients"
            value={systemStats.totalPatients}
            icon="👥"
            color="blue"
            subtitle="Currently registered"
            linkTo="/register-patient"
            linkText="Register New"
          />
          <DashboardCard
            title="Available Beds"
            value={systemStats.availableBeds}
            icon="🛏️"
            color="green"
            subtitle={`${bedOccupancyRate}% occupied`}
            linkTo="/bed-management"
            linkText="Manage Beds"
          />
          <DashboardCard
            title="Emergency Alerts"
            value={systemStats.emergencyAlerts}
            icon="🚨"
            color="red"
            subtitle="Require attention"
            linkTo="/emergency-alerts"
            linkText="View Alerts"
          />
          <DashboardCard
            title="OPD Today"
            value={systemStats.opdToday}
            icon="📅"
            color="purple"
            subtitle={`${opdGrowth}% vs last week`}
            trend={parseFloat(opdGrowth)}
            linkTo="/opd-schedule"
            linkText="View Schedule"
          />
        </div>

        {/* System Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Staff on Duty"
            value={`${systemStats.staffOnDuty}/${systemStats.totalStaff}`}
            icon="👨‍⚕️"
            color="blue"
            subtitle={`${staffUtilization}% utilization`}
          />
          <DashboardCard
            title="System Uptime"
            value={systemStats.systemUptime}
            icon="⚡"
            color="green"
            subtitle="Last 30 days"
          />
          <DashboardCard
            title="Response Time"
            value={systemStats.avgResponseTime}
            icon="⏱️"
            color="yellow"
            subtitle="Average system response"
          />
        </div>

        {/* Emergency Alerts Section */}
        {recentAlerts.filter(a => !a.resolved).length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🚨 Recent System Alerts</h2>
            <div className="space-y-4">
              {recentAlerts
                .filter(alert => !alert.resolved)
                .map(alert => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onAcknowledge={handleAcknowledgeAlert}
                    onResolve={handleResolveAlert}
                  />
                ))}
            </div>
          </div>
        )}

        {/* OPD Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📊 OPD Appointment Trends</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Today</span>
                <span className="font-semibold">{opdTrends.today} appointments</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Week</span>
                <span className="font-semibold">{opdTrends.thisWeek} appointments</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="font-semibold">{opdTrends.thisMonth} appointments</span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Growth (Week)</span>
                  <span className={`font-semibold ${parseFloat(opdGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {opdGrowth}%
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Link
                to="/opd-schedule"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View detailed schedule →
              </Link>
            </div>
          </div>

          {/* Recent Patient Registrations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">👥 Recent Patient Registrations</h3>
            <div className="space-y-4">
              {recentPatients.map(patient => (
                <div key={patient.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <p className="text-sm text-gray-600">{patient.ward} Ward • Age {patient.age}</p>
                    <p className="text-xs text-gray-500">Registered by {patient.registeredBy}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      patient.status === 'Critical' ? 'bg-red-100 text-red-800' :
                      patient.status === 'Stable' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {patient.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{patient.admissionDate}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link
                to="/register-patient"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Register new patient →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">⚡ Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/register-patient"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">➕</span>
              <div>
                <h4 className="font-medium">Register Patient</h4>
                <p className="text-sm text-gray-600">Add new patient to system</p>
              </div>
            </Link>
            <Link
              to="/bed-management"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">🛏️</span>
              <div>
                <h4 className="font-medium">Bed Management</h4>
                <p className="text-sm text-gray-600">Monitor bed availability</p>
              </div>
            </Link>
            <Link
              to="/opd-schedule"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">📅</span>
              <div>
                <h4 className="font-medium">OPD Schedule</h4>
                <p className="text-sm text-gray-600">View appointment trends</p>
              </div>
            </Link>
            <Link
              to="/emergency-alerts"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">🚨</span>
              <div>
                <h4 className="font-medium">Emergency Alerts</h4>
                <p className="text-sm text-gray-600">System alerts overview</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;