import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import BedManagement from "./pages/BedManagement";
import EmergencyAlerts from "./pages/EmergencyAlerts";
import PatientRegistration from "./pages/PatientRegistration";
import OPDSchedule from "./pages/OPDSchedule";
import About from "./pages/About";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/bed-management" element={<BedManagement />} />
        <Route path="/emergency-alerts" element={<EmergencyAlerts />} />
        <Route path="/register-patient" element={<PatientRegistration />} />
        <Route path="/opd-schedule" element={<OPDSchedule />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
};

export default App;