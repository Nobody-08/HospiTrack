const OPDSchedule = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">OPD Schedule</h1>
    <table className="w-full border rounded shadow">
      <thead className="bg-blue-100">
        <tr>
          <th className="p-2 text-left">Doctor</th>
          <th className="text-left">Specialization</th>
          <th className="text-left">Available Slot</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-t">
          <td className="p-2">Dr. Sharma</td>
          <td>Cardiology</td>
          <td>10:00 AM - 1:00 PM</td>
        </tr>
        <tr className="border-t">
          <td className="p-2">Dr. Nair</td>
          <td>Pediatrics</td>
          <td>3:00 PM - 6:00 PM</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default OPDSchedule;