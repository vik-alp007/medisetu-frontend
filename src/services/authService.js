import apiClient from './api';

/**
 * Authentication Service
 * Endpoints provided by backend contract.
 * Note: Request payload schemas will be provided by backend team.
 */
export const authService = {
  // POST /api/auth/send-otp/
  // TODO: Awaiting backend payload schema (e.g., { phone/email })
  sendOtp: async (payload) => {
    const response = await apiClient.post('/api/auth/send-otp/', payload);
    return response.data;
  },

  // POST /api/auth/verify-otp/
  // TODO: Awaiting backend payload schema (e.g., { phone/email, otp })
  verifyOtp: async (payload) => {
    const response = await apiClient.post('/api/auth/verify-otp/', payload);
    return response.data;
  },

  // POST /api/auth/register/
  // TODO: Awaiting backend payload schema for Patient, Doctor, and Admin registration
  register: async (payload) => {
    const response = await apiClient.post('/api/auth/register/', payload);
    return response.data;
  },

  // POST /api/auth/login/
  // TODO: Awaiting backend payload schema (e.g., { email/phone, password })
  login: async (payload) => {
    const response = await apiClient.post('/api/auth/login/', payload);
    return response.data;
  },

  // POST /api/auth/refresh/
  // TODO: Awaiting backend refresh token schema
  refreshToken: async (payload) => {
    const response = await apiClient.post('/api/auth/refresh/', payload);
    return response.data;
  },

  // GET /api/auth/me/
  getCurrentUser: async () => {
    const response = await apiClient.get('/api/auth/me/');
    return response.data;
  },
};
