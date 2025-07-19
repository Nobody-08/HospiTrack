import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';
import { useAPIMutation } from '../hooks/useAPI';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { mutate: loginMutation, loading: loginLoading, error: loginError } = useAPIMutation();
  const { mutate: registerMutation, loading: registerLoading, error: registerError } = useAPIMutation();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', role: 'doctor' });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      return;
    }

    try {
      const response = await loginMutation(() => authAPI.login(loginData), {
        onSuccess: (data) => {
          // Store authentication data
          localStorage.setItem('accessToken', data.access);
          localStorage.setItem('refreshToken', data.refresh);
          localStorage.setItem('userRole', data.user.role);
          localStorage.setItem('username', data.user.name || data.user.email);
          localStorage.setItem('userId', data.user.id);

          // Navigate based on user role
          switch (data.user.role) {
            case 'doctor':
              navigate('/doctor');
              break;
            case 'nurse':
              navigate('/nurse');
              break;
            case 'admin':
              navigate('/admin');
              break;
            default:
              navigate('/admin');
          }
        },
        onError: (error) => {
          console.error('Login failed:', error);
          // Handle specific error types
          if (error.includes('Network Error') || error.includes('ECONNREFUSED')) {
            alert('Cannot connect to server. Please make sure the backend is running on http://localhost:8000');
          }
        }
      });
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Login error:', error);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (!signupData.name || !signupData.email || !signupData.password || !signupData.role) {
      return;
    }

    try {
      await registerMutation(() => authAPI.register(signupData), {
        onSuccess: (data) => {
          alert(`${signupData.role.charAt(0).toUpperCase() + signupData.role.slice(1)} account created successfully! Please login with your credentials.`);
          setIsLogin(true);
          setSignupData({ name: '', email: '', password: '', role: 'doctor' });
        },
        onError: (error) => {
          console.error('Registration failed:', error);
        }
      });
    } catch (error) {
      // Error is handled by the mutation hook
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex border-b mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-4 text-center font-medium ${isLogin ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-4 text-center font-medium ${!isLogin ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Sign Up
          </button>
        </div>

        {isLogin ? (
          <form onSubmit={handleLoginSubmit}>
            <h2 className="text-2xl font-bold mb-6 text-center">Login to your account</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{loginError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className={`w-full py-2 rounded-lg transition-colors ${
                loginLoading
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loginLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit}>
            <h2 className="text-2xl font-bold mb-6 text-center">Create a new account</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={signupData.name}
                onChange={handleSignupChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={signupData.email}
                onChange={handleSignupChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={signupData.password}
                onChange={handleSignupChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Role</label>
              <select
                name="role"
                value={signupData.role}
                onChange={handleSignupChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {registerError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{registerError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={registerLoading}
              className={`w-full py-2 rounded-lg transition-colors ${
                registerLoading
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {registerLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
