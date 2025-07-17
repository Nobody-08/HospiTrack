import { useState } from "react";

const PatientCard = ({ patient, onUpdateNotes, showMedicalNotes = false }) => {
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [notes, setNotes] = useState(patient.notes || "");

  const handleSaveNotes = () => {
    if (onUpdateNotes) {
      onUpdateNotes(patient.id, notes);
    }
    setIsNotesOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'stable': return 'text-green-600 bg-green-50';
      case 'critical': return 'text-red-600 bg-red-50';
      case 'recovering': return 'text-blue-600 bg-blue-50';
      case 'under observation': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{patient.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
          {patient.status}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <p><span className="font-medium">Age:</span> {patient.age}</p>
        <p><span className="font-medium">Ward:</span> {patient.ward}</p>
        <p><span className="font-medium">Bed:</span> {patient.bed}</p>
        <p><span className="font-medium">Diagnosis:</span> {patient.diagnosis}</p>
        {patient.admissionDate && (
          <p><span className="font-medium">Admitted:</span> {patient.admissionDate}</p>
        )}
      </div>

      {patient.vitalSigns && (
        <div className="mt-3 p-2 bg-blue-50 rounded">
          <p className="text-xs font-medium text-blue-800 mb-1">Latest Vitals:</p>
          <div className="text-xs text-blue-700 space-y-1">
            {patient.vitalSigns.heartRate && <p>Heart Rate: {patient.vitalSigns.heartRate} bpm</p>}
            {patient.vitalSigns.bloodPressure && <p>BP: {patient.vitalSigns.bloodPressure}</p>}
            {patient.vitalSigns.temperature && <p>Temp: {patient.vitalSigns.temperature}°F</p>}
            {patient.vitalSigns.oxygenLevel && <p>O2: {patient.vitalSigns.oxygenLevel}%</p>}
          </div>
        </div>
      )}

      {showMedicalNotes && (
        <div className="mt-4">
          <button
            onClick={() => setIsNotesOpen(!isNotesOpen)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {isNotesOpen ? "Hide" : "Add/Edit"} Medical Notes
          </button>
          
          {isNotesOpen && (
            <div className="mt-2 space-y-2">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter medical notes and treatment decisions..."
                className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
                rows="4"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveNotes}
                  className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                >
                  Save Notes
                </button>
                <button
                  onClick={() => setIsNotesOpen(false)}
                  className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {patient.lastNotes && (
        <div className="mt-3 p-2 bg-gray-50 rounded">
          <p className="text-xs font-medium text-gray-700 mb-1">Recent Notes:</p>
          <p className="text-xs text-gray-600">{patient.lastNotes}</p>
        </div>
      )}
    </div>
  );
};

export default PatientCard;
