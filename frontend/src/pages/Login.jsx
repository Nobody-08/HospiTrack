import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const Login = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const roleConfig = {
    admin: {
      title: "Admin Portal",
      icon: "🧑‍💼",
      description: "Access full system control and management",
      redirectPath: "/admin",
      features: ["Patient Management", "Bed Overview", "Staff Management", "System Analytics"]
    },
    doctor: {
      title: "Doctor Portal",
      icon: "👨‍⚕️",
      description: "Review and treat assigned patients",
      redirectPath: "/doctor",
      features: ["Patient Care", "Medical Notes", "OPD Schedule", "Emergency Alerts"]
    },
    nurse: {
      title: "Nurse Dashboard",
      icon: "🧑‍⚕️",
      description: "Manage bed flow and assist with alerts",
      redirectPath: "/bed-management",
      features: ["Bed Management", "Patient Transfer", "Emergency Response", "Care Coordination"]
    }
  };

  const currentRole = roleConfig[role] || {
    title: "Unknown Role",
    icon: "❓",
    description: "Invalid role specified",
    redirectPath: "/",
    features: []
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In real app, this would be an API call:
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...formData, role })
      // });

      // Mock authentication - accept any non-empty credentials
      if (formData.username.trim() && formData.password.trim()) {
        // Store auth info (in real app, use proper token management)
        localStorage.setItem('userRole', role);
        localStorage.setItem('username', formData.username);

        // Navigate to appropriate dashboard
        navigate(currentRole.redirectPath);
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back to Home */}
        <div className="text-center mb-6">
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{currentRole.icon}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentRole.title}</h2>
            <p className="text-gray-600">{currentRole.description}</p>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Access to:</h3>
            <div className="grid grid-cols-2 gap-2">
              {currentRole.features.map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <span className="text-green-500 mr-2">✓</span>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                `Login as ${role?.charAt(0).toUpperCase() + role?.slice(1)}`
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Demo Credentials:</h4>
            <p className="text-xs text-gray-600">
              Username: <span className="font-mono">demo</span><br />
              Password: <span className="font-mono">password</span>
            </p>
          </div>
        </div>

        {/* Other Roles */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">Need a different role?</p>
          <div className="flex justify-center space-x-4">
            {Object.entries(roleConfig).map(([roleKey, config]) => (
              roleKey !== role && (
                <Link
                  key={roleKey}
                  to={`/login/${roleKey}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {config.icon} {config.title}
                </Link>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;