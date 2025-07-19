import { Link } from "react-router-dom";
import DashboardCard from "../components/DashboardCard";
import { dashboardAPI, patientsAPI, alertsAPI } from "../api";
import { useAPI, useRealTimeData } from "../hooks/useAPI";
import AlertCard from "../components/AlertCard";

const AdminDashboard = () => {
  // Real-time data fetching with auto-refresh every 30 seconds
  const { data: systemStats, loading: statsLoading, error: statsError } = useRealTimeData(
    () => dashboardAPI.getSystemStats(),
    30000 // Refresh every 30 seconds
  );

  const { data: recentAlerts, loading: alertsLoading } = useAPI(
    () => alertsAPI.getUnresolved()
  );

  const { data: recentPatients, loading: patientsLoading } = useAPI(
    () => patientsAPI.getAll({ limit: 5, ordering: '-created_at' })
  );

  const { data: bedOccupancy, loading: bedsLoading } = useRealTimeData(
    () => dashboardAPI.getBedOccupancy(),
    60000 // Refresh every minute
  );

  const { data: opdStats, loading: opdLoading } = useAPI(
    () => dashboardAPI.getOpdStats()
  );

  // Provide default values to prevent undefined errors
  const safeSystemStats = systemStats || {};
  const safeOpdStats = opdStats || {};
  const safeRecentAlerts = recentAlerts || [];
  const safeRecentPatients = recentPatients || [];

  const handleAcknowledgeAlert = async (alertId) => {
    try {
      await alertsAPI.acknowledge(alertId, localStorage.getItem('username') || 'Admin User');
      // Refresh alerts data
      window.location.reload(); // Simple refresh for now
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
      alert('Failed to acknowledge alert. Please try again.');
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await alertsAPI.resolve(alertId, localStorage.getItem('username') || 'Admin User', 'Resolved by admin');
      // Refresh alerts data
      window.location.reload(); // Simple refresh for now
    } catch (error) {
      console.error('Failed to resolve alert:', error);
      alert('Failed to resolve alert. Please try again.');
    }
  };

  // Calculate derived statistics with safe defaults
  const bedOccupancyRate = safeSystemStats.totalBeds > 0
    ? ((safeSystemStats.totalBeds - safeSystemStats.availableBeds) / safeSystemStats.totalBeds * 100).toFixed(1)
    : '0.0';

  const staffUtilization = safeSystemStats.totalStaff > 0
    ? (safeSystemStats.staffOnDuty / safeSystemStats.totalStaff * 100).toFixed(1)
    : '0.0';

  const opdGrowth = safeOpdStats.lastWeek > 0
    ? ((safeOpdStats.thisWeek - safeOpdStats.lastWeek) / safeOpdStats.lastWeek * 100).toFixed(1)
    : '0.0';

  // Show loading state only if no data at all
  if (!systemStats && !recentAlerts && !recentPatients) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

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
            value={safeSystemStats.totalPatients || 0}
            icon="👥"
            color="blue"
            subtitle="Currently registered"
            linkTo="/register-patient"
            linkText="Register New"
          />
          <DashboardCard
            title="Available Beds"
            value={safeSystemStats.availableBeds || 0}
            icon="🛏️"
            color="green"
            subtitle={`${bedOccupancyRate}% occupied`}
            linkTo="/bed-management"
            linkText="Manage Beds"
          />
          <DashboardCard
            title="Emergency Alerts"
            value={safeSystemStats.emergencyAlerts || 0}
            icon="🚨"
            color="red"
            subtitle="Require attention"
            linkTo="/emergency-alerts"
            linkText="View Alerts"
          />
          <DashboardCard
            title="OPD Today"
            value={safeOpdStats.today || 0}
            icon="📅"
            color="purple"
            subtitle={`${opdGrowth}% vs last week`}
            trend={parseFloat(opdGrowth) || 0}
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
        {safeRecentAlerts.length > 0 ? (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🚨 Recent System Alerts</h2>
            <div className="space-y-4">
              {safeRecentAlerts
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
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🚨 Recent System Alerts</h2>
            <p>No recent alerts.</p>
          </div>
        )}

        {/* OPD Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📊 OPD Appointment Trends</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Today</span>
                <span className="font-semibold">{safeOpdStats.today || 0} appointments</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Week</span>
                <span className="font-semibold">{safeOpdStats.thisWeek || 0} appointments</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="font-semibold">{safeOpdStats.thisMonth || 0} appointments</span>
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
            {safeRecentPatients.length > 0 ? (
              <div className="space-y-4">
                {safeRecentPatients.map(patient => (
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
            ) : (
              <div className="text-center text-gray-500">
                <p>No recent patient registrations.</p>
              </div>
            )}
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
