// frontend/src/api.js

import axios from 'axios';

// Instance for calling your Django API
export const djangoApi = axios.create({
    baseURL: 'http://localhost:8000/api' // URL for your Django backend
});

// Instance for calling your FastAPI API
export const fastApi = axios.create({
    baseURL: 'http://localhost:8001/api' // URL for your FastAPI backend
});

// You can also add interceptors here to automatically attach auth tokens
// For example, for JWTs:
const token = localStorage.getItem('accessToken');
if (token) {
    djangoApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fastApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}