import axios from 'axios';

/**
 * Single shared Axios client for the whole app.
 *
 * Base URL can be overridden with VITE_API_BASE_URL (see .env.example);
 * it defaults to the deployed backend.
 */
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  'https://hospital-management-system-ccc.onrender.com'
).replace(/\/+$/, '');

export const ACCESS_TOKEN_KEY = 'medisetu_access_token';
export const REFRESH_TOKEN_KEY = 'medisetu_refresh_token';
export const ROLE_KEY = 'medisetu_role';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Render free-tier backends can take a while to wake up.
  timeout: 45000,
});

// Attach JWT access token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/*
 * On 401, try ONE silent refresh using POST /api/auth/refresh/ with the
 * stored refresh token, then replay the original request. This reuses the
 * existing JWT keys - it is not a second auth mechanism.
 * Errors are never replaced with mock data.
 */
let refreshPromise = null;

const clearSessionAndRedirect = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  if (!['/login', '/'].includes(window.location.pathname)) {
    window.location.assign('/login');
  }
};

const refreshAccessToken = () => {
  if (!refreshPromise) {
    const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refresh) return Promise.reject(new Error('No refresh token'));

    // Plain axios (no interceptors) to avoid recursion.
    refreshPromise = axios
      .post(`${API_BASE_URL}/api/auth/refresh/`, { refresh })
      .then((res) => {
        const newAccess = res.data?.access;
        if (!newAccess) throw new Error('Refresh returned no access token');
        localStorage.setItem(ACCESS_TOKEN_KEY, newAccess);
        if (res.data?.refresh) {
          localStorage.setItem(REFRESH_TOKEN_KEY, res.data.refresh);
        }
        return newAccess;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const isAuthCall = original?.url?.includes('/api/auth/');

    if (
      status === 401 &&
      original &&
      !original._retry &&
      !isAuthCall &&
      localStorage.getItem(ACCESS_TOKEN_KEY)
    ) {
      original._retry = true;
      try {
        const newAccess = await refreshAccessToken();
        original.headers.Authorization = `Bearer ${newAccess}`;
        return apiClient(original);
      } catch {
        clearSessionAndRedirect();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
