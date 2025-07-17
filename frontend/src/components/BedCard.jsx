import { useState } from "react";

const BedCard = ({ bed, onStatusUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available': return 'bg-green-50 border-green-200 text-green-800';
      case 'occupied': return 'bg-gray-100 border-gray-300 text-gray-800';
      case 'cleaning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'maintenance': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'available': return '✅';
      case 'occupied': return '🛏️';
      case 'cleaning': return '🧹';
      case 'maintenance': return '🔧';
      default: return '❓';
    }
  };

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    if (onStatusUpdate) {
      await onStatusUpdate(bed.number, newStatus);
    }
    setIsUpdating(false);
  };

  return (
    <div className={`p-4 rounded-lg border-2 shadow-md transition-all hover:shadow-lg ${getStatusColor(bed.status)}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold">Bed {bed.number}</h3>
          <p className="text-sm font-medium">{bed.ward} Ward</p>
        </div>
        <span className="text-2xl">{getStatusIcon(bed.status)}</span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">Status:</span>
          <span className="capitalize font-semibold">{bed.status}</span>
        </div>
        
        {bed.patient && (
          <div className="mt-2 p-2 bg-white bg-opacity-50 rounded">
            <p className="font-medium text-xs mb-1">Current Patient:</p>
            <p className="text-sm">{bed.patient.name}</p>
            <p className="text-xs text-gray-600">Age: {bed.patient.age}</p>
            <p className="text-xs text-gray-600">Condition: {bed.patient.condition}</p>
          </div>
        )}

        {bed.lastCleaned && (
          <p className="text-xs">
            <span className="font-medium">Last Cleaned:</span> {bed.lastCleaned}
          </p>
        )}

        {bed.assignedNurse && (
          <p className="text-xs">
            <span className="font-medium">Assigned Nurse:</span> {bed.assignedNurse}
          </p>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <p className="text-xs font-medium">Update Status:</p>
        <div className="grid grid-cols-2 gap-1">
          {['Available', 'Occupied', 'Cleaning', 'Maintenance'].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              disabled={isUpdating || bed.status.toLowerCase() === status.toLowerCase()}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                bed.status.toLowerCase() === status.toLowerCase()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-white bg-opacity-70 hover:bg-opacity-100 border border-current'
              }`}
            >
              {isUpdating ? '...' : status}
            </button>
          ))}
        </div>
      </div>

      {bed.emergencyAlert && (
        <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded">
          <p className="text-xs font-medium text-red-800">🚨 Emergency Alert</p>
          <p className="text-xs text-red-700">{bed.emergencyAlert}</p>
        </div>
      )}
    </div>
  );
};

export default BedCard;
