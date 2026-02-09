import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (email, password) => api.post('/auth/register', { email, password }),
    logout: () => api.post('/auth/logout'),
    verify: () => api.get('/auth/verify')
};

// Resume API
export const resumeAPI = {
    upload: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/resume/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    get: () => api.get('/resume'),
    delete: () => api.delete('/resume')
};

// Jobs API
export const jobsAPI = {
    getAll: (filters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        return api.get(`/jobs?${params.toString()}`);
    },
    getBestMatches: () => api.get('/jobs/best-matches')
};

// Applications API
export const applicationsAPI = {
    getAll: () => api.get('/applications'),
    create: (data) => api.post('/applications', data),
    update: (id, data) => api.patch(`/applications/${id}`, data),
    getByJobId: (jobId) => api.get(`/applications/job/${jobId}`)
};

// Assistant API
export const assistantAPI = {
    chat: (message) => api.post('/assistant/chat', { message }),
    clear: () => api.post('/assistant/clear')
};

export default api;
