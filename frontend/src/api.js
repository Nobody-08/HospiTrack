// frontend/src/api.js

import axios from 'axios';

// Development mode check
const isDevelopment = import.meta.env.MODE === 'development';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000/api';

// Main API instance - adjust baseURL based on your backend
const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false, // Set to true if you need cookies
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);

        // Handle network errors (backend not available)
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || !error.response) {
            const errorMsg = 'Cannot connect to backend server. Please ensure your backend is running on http://localhost:8000 and CORS is configured properly.';
            console.error(errorMsg);
            if (isDevelopment) {
                alert(errorMsg);
            }
            return Promise.reject(new Error(errorMsg));
        }

        // Handle CORS errors specifically
        if (error.response?.status === 0 ||
            (error.response?.status === 400 && error.config?.method?.toLowerCase() === 'options')) {
            const corsError = 'CORS error: Your backend needs to allow requests from http://localhost:5174. Please add CORS configuration to your backend.';
            console.error(corsError);
            alert(corsError);
            return Promise.reject(new Error(corsError));
        }

        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userRole');
            localStorage.removeItem('username');
            window.location.href = '/auth';
        }

        return Promise.reject(error);
    }
);

// Authentication API - Role-based
export const authAPI = {
    // General login endpoint that handles all roles
    login: (credentials) => api.post('/auth/login/', credentials),

    // Role-specific registration endpoints
    registerAdmin: (userData) => api.post('/auth/admin/register/', userData),
    registerDoctor: (userData) => api.post('/auth/doctor/register/', userData),
    registerNurse: (userData) => api.post('/auth/nurse/register/', userData),

    // General registration (determines role from userData.role)
    register: (userData) => {
        const { role, ...data } = userData;
        switch (role) {
            case 'admin':
                return api.post('/auth/admin/register/', data);
            case 'doctor':
                return api.post('/auth/doctor/register/', data);
            case 'nurse':
                return api.post('/auth/nurse/register/', data);
            default:
                throw new Error('Invalid role specified');
        }
    },

    logout: () => api.post('/auth/logout/'),
    refreshToken: (refreshToken) => api.post('/auth/refresh/', { refresh: refreshToken }),

    // Role-specific profile endpoints
    getAdminProfile: () => api.get('/auth/admin/profile/'),
    getDoctorProfile: () => api.get('/auth/doctor/profile/'),
    getNurseProfile: () => api.get('/auth/nurse/profile/'),
};

// Patients API
export const patientsAPI = {
    getAll: (params = {}) => api.get('/patients/', { params }),
    getById: (id) => api.get(`/patients/${id}/`),
    create: (patientData) => api.post('/patients/', patientData),
    update: (id, patientData) => api.put(`/patients/${id}/`, patientData),
    delete: (id) => api.delete(`/patients/${id}/`),
    getByWard: (ward) => api.get(`/patients/?ward=${ward}`),
    updateVitalSigns: (id, vitalSigns) => api.patch(`/patients/${id}/vital-signs/`, vitalSigns),
    updateNotes: (id, notes) => api.patch(`/patients/${id}/notes/`, { notes }),
};

// Beds API
export const bedsAPI = {
    getAll: (params = {}) => api.get('/beds/', { params }),
    getById: (id) => api.get(`/beds/${id}/`),
    updateStatus: (id, status) => api.patch(`/beds/${id}/status/`, { status }),
    getByWard: (ward) => api.get(`/beds/?ward=${ward}`),
    getAvailable: () => api.get('/beds/?status=available'),
    assignPatient: (bedId, patientId) => api.post(`/beds/${bedId}/assign/`, { patient_id: patientId }),
    releasePatient: (bedId) => api.post(`/beds/${bedId}/release/`),
    updateCleaning: (bedId, cleaningData) => api.patch(`/beds/${bedId}/cleaning/`, cleaningData),
};

// Emergency Alerts API
export const alertsAPI = {
    getAll: (params = {}) => api.get('/alerts/', { params }),
    getById: (id) => api.get(`/alerts/${id}/`),
    create: (alertData) => api.post('/alerts/', alertData),
    update: (id, alertData) => api.put(`/alerts/${id}/`, alertData),
    acknowledge: (id, acknowledgedBy) => api.patch(`/alerts/${id}/acknowledge/`, { acknowledged_by: acknowledgedBy }),
    resolve: (id, resolvedBy, resolution) => api.patch(`/alerts/${id}/resolve/`, { resolved_by: resolvedBy, resolution }),
    getByWard: (ward) => api.get(`/alerts/?ward=${ward}`),
    getUnresolved: () => api.get('/alerts/?resolved=false'),
    getBySeverity: (severity) => api.get(`/alerts/?severity=${severity}`),
};

// Staff API
export const staffAPI = {
    getAll: (params = {}) => api.get('/staff/', { params }),
    getById: (id) => api.get(`/staff/${id}/`),
    getByRole: (role) => api.get(`/staff/?role=${role}`),
    updateSchedule: (id, schedule) => api.patch(`/staff/${id}/schedule/`, schedule),
    getOnDuty: () => api.get('/staff/?on_duty=true'),
};

// OPD (Outpatient Department) API
export const opdAPI = {
    getSchedule: (date = null) => api.get('/opd/schedule/', { params: date ? { date } : {} }),
    getAppointments: (params = {}) => api.get('/opd/appointments/', { params }),
    createAppointment: (appointmentData) => api.post('/opd/appointments/', appointmentData),
    updateAppointment: (id, appointmentData) => api.put(`/opd/appointments/${id}/`, appointmentData),
    cancelAppointment: (id) => api.patch(`/opd/appointments/${id}/cancel/`),
    getDoctorSchedule: (doctorId, date = null) => api.get(`/opd/doctors/${doctorId}/schedule/`, { params: date ? { date } : {} }),
};

// Dashboard/Analytics API
export const dashboardAPI = {
    getSystemStats: () => api.get('/dashboard/system-stats/'),
    getBedOccupancy: () => api.get('/dashboard/bed-occupancy/'),
    getPatientStats: () => api.get('/dashboard/patient-stats/'),
    getAlertStats: () => api.get('/dashboard/alert-stats/'),
    getOpdStats: () => api.get('/dashboard/opd-stats/'),
    getRecentActivity: () => api.get('/dashboard/recent-activity/'),
};

// Transfers API
export const transfersAPI = {
    getAll: (params = {}) => api.get('/transfers/', { params }),
    create: (transferData) => api.post('/transfers/', transferData),
    approve: (id, approvedBy) => api.patch(`/transfers/${id}/approve/`, { approved_by: approvedBy }),
    reject: (id, rejectedBy, reason) => api.patch(`/transfers/${id}/reject/`, { rejected_by: rejectedBy, reason }),
    getPending: () => api.get('/transfers/?status=pending'),
};

export default api;