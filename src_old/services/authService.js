import apiClient from './api';

/**
 * MediSetu Authentication Service
 *
 * Backend:
 * https://hospital-management-system-ccc.onrender.com
 */

export const authService = {
  // POST /api/auth/send-otp/
  sendOtp: async (payload) => {
    const response = await apiClient.post(
      '/api/auth/send-otp/',
      payload
    );

    return response.data;
  },

  // POST /api/auth/verify-otp/
  verifyOtp: async (payload) => {
    const response = await apiClient.post(
      '/api/auth/verify-otp/',
      payload
    );

    return response.data;
  },

  // POST /api/auth/register/
  register: async (payload) => {
    const response = await apiClient.post(
      '/api/auth/register/',
      payload
    );

    return response.data;
  },

  // POST /api/auth/login/
  //
  // Request:
  // {
  //   username: "...",
  //   password: "..."
  // }
  //
  // Response:
  // {
  //   refresh: "...",
  //   access: "...",
  //   user: {...}
  // }
  login: async (payload) => {
    const response = await apiClient.post(
      '/api/auth/login/',
      payload
    );

    return response.data;
  },

  // POST /api/auth/refresh/
  refreshToken: async (payload) => {
    const response = await apiClient.post(
      '/api/auth/refresh/',
      payload
    );

    return response.data;
  },

  // GET /api/auth/me/
  getCurrentUser: async () => {
    const response = await apiClient.get(
      '/api/auth/me/'
    );

    return response.data;
  },
};