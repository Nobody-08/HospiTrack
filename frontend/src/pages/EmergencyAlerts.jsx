const EmergencyAlerts = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4 text-red-600">Emergency Alerts</h1>
    <div className="bg-red-50 p-4 border-l-4 border-red-500 rounded shadow">
      🚨 Oxygen level drop in ICU bed 103 — immediate action needed.
    </div>
    <div className="mt-4 bg-red-50 p-4 border-l-4 border-red-500 rounded shadow">
      🚨 Patient in Ward 5 showing elevated heart rate. Please review.
    </div>
  </div>
);

export default EmergencyAlerts;