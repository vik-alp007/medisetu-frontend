import axios from 'axios';

export const API_BASE_URL = 'https://hospital-management-system-ccc.onrender.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor to attach JWT token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('medisetu_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - does NOT silently replace errors with mock data
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Pass real error through so callers handle explicit error state
    return Promise.reject(error);
  }
);

export default apiClient;
