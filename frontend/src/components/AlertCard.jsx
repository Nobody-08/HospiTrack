const AlertCard = ({ alert, onAcknowledge, onResolve }) => {
  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-red-50 border-red-500 text-red-800';
      case 'high': return 'bg-orange-50 border-orange-500 text-orange-800';
      case 'medium': return 'bg-yellow-50 border-yellow-500 text-yellow-800';
      case 'low': return 'bg-blue-50 border-blue-500 text-blue-800';
      default: return 'bg-gray-50 border-gray-500 text-gray-800';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return 'ℹ️';
      default: return '📢';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className={`p-4 border-l-4 rounded-lg shadow-md ${getSeverityColor(alert.severity)}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getSeverityIcon(alert.severity)}</span>
          <span className="font-semibold text-sm uppercase tracking-wide">
            {alert.severity} Alert
          </span>
        </div>
        <span className="text-xs opacity-75">
          {formatTime(alert.timestamp)}
        </span>
      </div>

      <h3 className="font-bold text-lg mb-2">{alert.title}</h3>
      <p className="text-sm mb-3">{alert.message}</p>

      <div className="space-y-1 text-xs">
        {alert.location && (
          <p><span className="font-medium">Location:</span> {alert.location}</p>
        )}
        {alert.patient && (
          <p><span className="font-medium">Patient:</span> {alert.patient}</p>
        )}
        {alert.ward && (
          <p><span className="font-medium">Ward:</span> {alert.ward}</p>
        )}
        {alert.bed && (
          <p><span className="font-medium">Bed:</span> {alert.bed}</p>
        )}
        {alert.reportedBy && (
          <p><span className="font-medium">Reported by:</span> {alert.reportedBy}</p>
        )}
      </div>

      {alert.vitalSigns && (
        <div className="mt-3 p-2 bg-white bg-opacity-50 rounded">
          <p className="text-xs font-medium mb-1">Related Vital Signs:</p>
          <div className="text-xs space-y-1">
            {alert.vitalSigns.heartRate && (
              <p>Heart Rate: <span className="font-medium">{alert.vitalSigns.heartRate} bpm</span></p>
            )}
            {alert.vitalSigns.bloodPressure && (
              <p>Blood Pressure: <span className="font-medium">{alert.vitalSigns.bloodPressure}</span></p>
            )}
            {alert.vitalSigns.oxygenLevel && (
              <p>Oxygen Level: <span className="font-medium">{alert.vitalSigns.oxygenLevel}%</span></p>
            )}
            {alert.vitalSigns.temperature && (
              <p>Temperature: <span className="font-medium">{alert.vitalSigns.temperature}°F</span></p>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 flex space-x-2">
        {!alert.acknowledged && onAcknowledge && (
          <button
            onClick={() => onAcknowledge(alert.id)}
            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
          >
            Acknowledge
          </button>
        )}
        
        {alert.acknowledged && !alert.resolved && onResolve && (
          <button
            onClick={() => onResolve(alert.id)}
            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
          >
            Mark Resolved
          </button>
        )}

        {alert.acknowledged && (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded">
            ✓ Acknowledged
          </span>
        )}

        {alert.resolved && (
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded">
            ✓ Resolved
          </span>
        )}
      </div>

      {alert.acknowledgedBy && (
        <p className="mt-2 text-xs opacity-75">
          Acknowledged by {alert.acknowledgedBy} at {formatTime(alert.acknowledgedAt)}
        </p>
      )}

      {alert.resolvedBy && (
        <p className="mt-1 text-xs opacity-75">
          Resolved by {alert.resolvedBy} at {formatTime(alert.resolvedAt)}
        </p>
      )}
    </div>
  );
};

export default AlertCard;
