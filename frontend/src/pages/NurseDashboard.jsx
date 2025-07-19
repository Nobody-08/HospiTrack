import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DashboardCard from "../components/DashboardCard";
import BedCard from "../components/BedCard";
import PatientCard from "../components/PatientCard";
import AlertCard from "../components/AlertCard";
import { patientsAPI, bedsAPI, alertsAPI, transfersAPI } from "../api";
import { useAPI, useRealTimeData, useAPIMutation } from "../hooks/useAPI";

const NurseDashboard = () => {
  const [selectedWard, setSelectedWard] = useState("all");
  const [transferModal, setTransferModal] = useState({ open: false, patient: null });
  const [escalationModal, setEscalationModal] = useState({ open: false, patient: null });
  const [doctorUpdateModal, setDoctorUpdateModal] = useState({ open: false, patient: null });

  // API calls for real-time data
  const { data: beds, loading: bedsLoading, refetch: refetchBeds } = useRealTimeData(
    () => bedsAPI.getAll(),
    30000 // Refresh every 30 seconds
  );

  const { data: patients, loading: patientsLoading, refetch: refetchPatients } = useRealTimeData(
    () => patientsAPI.getAll(),
    30000 // Refresh every 30 seconds
  );

  const { data: emergencyAlerts, loading: alertsLoading, refetch: refetchAlerts } = useRealTimeData(
    () => alertsAPI.getUnresolved(),
    15000 // Refresh every 15 seconds for alerts
  );

  // API mutations
  const { mutate: updateBedStatus } = useAPIMutation();
  const { mutate: createTransfer } = useAPIMutation();
  const { mutate: createAlert } = useAPIMutation();
  const { mutate: updatePatientNotes } = useAPIMutation();
    // All data now comes from API calls - no mock data needed

  // Enhanced handler functions
  const handlePatientTransfer = (patient) => {
    setTransferModal({ open: true, patient });
  };

  const confirmTransfer = (patientId, newBedNumber, reason) => {
    setPatients(prev => prev.map(p =>
      p.id === patientId
        ? { ...p, bed: newBedNumber, transferRequested: false, lastNotes: `Transferred to bed ${newBedNumber}. Reason: ${reason}` }
        : p
    ));

    // Update bed statuses
    setBeds(prev => prev.map(bed => {
      if (bed.number === newBedNumber) {
        const patient = patients.find(p => p.id === patientId);
        return {
          ...bed,
          status: "Occupied",
          patient: {
            name: patient.name,
            age: patient.age,
            condition: patient.diagnosis,
            admissionTime: new Date().toLocaleString()
          }
        };
      }
      return bed;
    }));

    setTransferModal({ open: false, patient: null });
    alert(`Patient successfully transferred to bed ${newBedNumber}`);
  };

  const handleBedStatusUpdate = async (bedNumber, newStatus) => {
    try {
      // Find the bed by number to get its ID
      const bed = beds?.find(b => b.number === bedNumber);
      if (!bed) {
        alert('Bed not found');
        return;
      }

      await updateBedStatus(
        () => bedsAPI.updateStatus(bed.id, newStatus),
        {
          onSuccess: () => {
            alert(`Bed ${bedNumber} status updated to ${newStatus}`);
            refetchBeds(); // Refresh beds data
          },
          onError: (error) => {
            console.error('Error updating bed status:', error);
            alert('Failed to update bed status');
          }
        }
      );
    } catch (error) {
      console.error('Error updating bed status:', error);
      alert('Failed to update bed status');
    }
  };

  const handleEscalateCase = (patient) => {
    setEscalationModal({ open: true, patient });
  };

  const confirmEscalation = async (patientId, urgencyLevel, notes) => {
    try {
      const patient = patients?.find(p => p.id === patientId);
      const alertData = {
        severity: urgencyLevel.toLowerCase(),
        title: `Patient Escalation - ${patient?.name || 'Unknown'}`,
        message: notes,
        ward: patient?.ward || 'Unknown',
        bed: patient?.bed_number || patient?.bed,
        patient: patient?.name || 'Unknown',
        reported_by: 'Nurse Station'
      };

      await createAlert(
        () => alertsAPI.create(alertData),
        {
          onSuccess: () => {
            setEscalationModal({ open: false, patient: null });
            alert(`Case escalated successfully. Doctor has been notified.`);
            refetchAlerts(); // Refresh alerts data
          },
          onError: (error) => {
            console.error('Error creating alert:', error);
            alert('Failed to escalate case');
          }
        }
      );
    } catch (error) {
      console.error('Error escalating case:', error);
      alert('Failed to escalate case');
    }
  };

  const handleDoctorUpdate = (patient) => {
    setDoctorUpdateModal({ open: true, patient });
  };

  const confirmDoctorUpdate = async (patientId, statusUpdate, notes) => {
    try {
      await updatePatientNotes(
        () => patientsAPI.updateNotes(patientId, { notes: `Nurse Update: ${notes}`, status: statusUpdate }),
        {
          onSuccess: () => {
            setDoctorUpdateModal({ open: false, patient: null });
            const patient = patients?.find(p => p.id === patientId);
            alert(`Status update sent to ${patient?.doctor_assigned || 'Doctor'}`);
            refetchPatients(); // Refresh patients data
          },
          onError: (error) => {
            console.error('Error updating patient:', error);
            alert('Failed to update patient status');
          }
        }
      );
    } catch (error) {
      console.error('Error updating patient:', error);
      alert('Failed to update patient status');
    }
  };

  const handleAcknowledgeAlert = async (alertId) => {
    try {
      await updateBedStatus( // Reusing mutation hook
        () => alertsAPI.acknowledge(alertId, { acknowledged_by: "Current Nurse" }),
        {
          onSuccess: () => {
            refetchAlerts(); // Refresh alerts data
          },
          onError: (error) => {
            console.error('Error acknowledging alert:', error);
            alert('Failed to acknowledge alert');
          }
        }
      );
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      alert('Failed to acknowledge alert');
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await updateBedStatus( // Reusing mutation hook
        () => alertsAPI.resolve(alertId, { resolved_by: "Current Nurse", resolution: "Resolved by nurse" }),
        {
          onSuccess: () => {
            refetchAlerts(); // Refresh alerts data
          },
          onError: (error) => {
            console.error('Error resolving alert:', error);
            alert('Failed to resolve alert');
          }
        }
      );
    } catch (error) {
      console.error('Error resolving alert:', error);
      alert('Failed to resolve alert');
    }
  };

  // Calculate statistics
  const bedStats = {
    total: beds.length,
    available: beds.filter(b => b.status === "Available").length,
    occupied: beds.filter(b => b.status === "Occupied").length,
    cleaning: beds.filter(b => b.status === "Cleaning").length,
    maintenance: beds.filter(b => b.status === "Maintenance").length,
  };

  const filteredBeds = selectedWard === "all"
    ? beds
    : beds.filter(bed => bed.ward.toLowerCase() === selectedWard.toLowerCase());

  const pendingTransfers = patients.filter(p => p.transferRequested).length;
  const criticalPatients = patients.filter(p => p.status === "Critical").length;
  const activeAlerts = emergencyAlerts.filter(a => !a.resolved).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🧑‍⚕️ Nurse Dashboard</h1>
              <p className="text-gray-600 mt-1">Patient care coordination and bed management</p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/emergency-alerts"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                🚨 Emergency Alerts ({activeAlerts})
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
            subtitle="All assigned beds"
          />
          <DashboardCard
            title="Available Beds"
            value={bedStats.available}
            icon="✅"
            color="green"
            subtitle="Ready for patients"
          />
          <DashboardCard
            title="Critical Patients"
            value={criticalPatients}
            icon="🚨"
            color="red"
            subtitle="Require immediate attention"
          />
          <DashboardCard
            title="Pending Transfers"
            value={pendingTransfers}
            icon="🔄"
            color="yellow"
            subtitle="Awaiting bed assignment"
          />
          <DashboardCard
            title="Active Alerts"
            value={activeAlerts}
            icon="⚠️"
            color="purple"
            subtitle="Unresolved alerts"
            linkTo="/emergency-alerts"
            linkText="View All"
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

        {/* Patient Management Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">👥 Patient Management</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {patients.map(patient => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{patient.name}</h3>
                    <p className="text-sm text-gray-600">Age: {patient.age} | Bed: {patient.bed}</p>
                    <p className="text-sm text-gray-600">Ward: {patient.ward}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    patient.status === 'Critical' ? 'bg-red-100 text-red-800' :
                    patient.status === 'Stable' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {patient.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p><span className="font-medium">Diagnosis:</span> {patient.diagnosis}</p>
                  <p><span className="font-medium">Doctor:</span> {patient.doctorAssigned}</p>
                  {patient.transferRequested && (
                    <p className="text-orange-600 font-medium">
                      🔄 Transfer Requested: {patient.transferReason}
                    </p>
                  )}
                </div>

                {patient.vitalSigns && (
                  <div className="mb-4 p-3 bg-blue-50 rounded">
                    <p className="text-xs font-medium text-blue-800 mb-2">Latest Vitals:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
                      <p>HR: {patient.vitalSigns.heartRate} bpm</p>
                      <p>BP: {patient.vitalSigns.bloodPressure}</p>
                      <p>Temp: {patient.vitalSigns.temperature}°F</p>
                      <p>O2: {patient.vitalSigns.oxygenLevel}%</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handlePatientTransfer(patient)}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                  >
                    🔄 Transfer
                  </button>
                  <button
                    onClick={() => handleEscalateCase(patient)}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                  >
                    🚨 Escalate
                  </button>
                  <button
                    onClick={() => handleDoctorUpdate(patient)}
                    className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                  >
                    📝 Update Doctor
                  </button>
                </div>

                {patient.lastNotes && (
                  <div className="mt-3 p-2 bg-gray-50 rounded">
                    <p className="text-xs font-medium text-gray-700 mb-1">Recent Notes:</p>
                    <p className="text-xs text-gray-600">{patient.lastNotes}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bed Management Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">🛏️ Bed Status Management</h2>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBeds.map(bed => (
              <BedCard
                key={bed.number}
                bed={bed}
                onStatusUpdate={handleBedStatusUpdate}
              />
            ))}
          </div>
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
                <p className="text-sm text-gray-600">View active alerts</p>
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
                <p className="text-sm text-gray-600">Mark cleaning as done</p>
              </div>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mr-3">🔄</span>
              <div>
                <h4 className="font-medium">Refresh Data</h4>
                <p className="text-sm text-gray-600">Update information</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {transferModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Transfer Patient: {transferModal.patient?.name}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              confirmTransfer(
                transferModal.patient.id,
                formData.get('bedNumber'),
                formData.get('reason')
              );
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transfer to Bed:
                </label>
                <select name="bedNumber" required className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Select available bed</option>
                  {beds.filter(b => b.status === "Available").map(bed => (
                    <option key={bed.number} value={bed.number}>
                      Bed {bed.number} - {bed.ward} Ward
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Transfer:
                </label>
                <textarea
                  name="reason"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows="3"
                  placeholder="Enter reason for transfer..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Confirm Transfer
                </button>
                <button
                  type="button"
                  onClick={() => setTransferModal({ open: false, patient: null })}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Escalation Modal */}
      {escalationModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Escalate Case: {escalationModal.patient?.name}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              confirmEscalation(
                escalationModal.patient.id,
                formData.get('urgencyLevel'),
                formData.get('notes')
              );
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level:
                </label>
                <select name="urgencyLevel" required className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Select urgency level</option>
                  <option value="high">High - Requires immediate attention</option>
                  <option value="critical">Critical - Emergency intervention needed</option>
                  <option value="medium">Medium - Monitor closely</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinical Notes:
                </label>
                <textarea
                  name="notes"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows="4"
                  placeholder="Describe the patient's condition and reason for escalation..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                >
                  Escalate to Doctor
                </button>
                <button
                  type="button"
                  onClick={() => setEscalationModal({ open: false, patient: null })}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doctor Update Modal */}
      {doctorUpdateModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Update Doctor: {doctorUpdateModal.patient?.name}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              confirmDoctorUpdate(
                doctorUpdateModal.patient.id,
                formData.get('statusUpdate'),
                formData.get('notes')
              );
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Status:
                </label>
                <select name="statusUpdate" required className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="">Select status</option>
                  <option value="Stable">Stable</option>
                  <option value="Improving">Improving</option>
                  <option value="Critical">Critical</option>
                  <option value="Under Observation">Under Observation</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nursing Notes:
                </label>
                <textarea
                  name="notes"
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows="4"
                  placeholder="Enter nursing observations and updates for the doctor..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                >
                  Send Update
                </button>
                <button
                  type="button"
                  onClick={() => setDoctorUpdateModal({ open: false, patient: null })}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NurseDashboard;
