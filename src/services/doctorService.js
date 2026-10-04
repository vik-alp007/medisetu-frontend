import apiClient from './api';

/**
 * Doctor Service
 * Endpoints provided by backend contract.
 */
export const doctorService = {
  // GET /api/doctors/
  // Optional query params: { specialty, availability, gender, experience, fee }
  getDoctors: async (params = {}) => {
    const response = await apiClient.get('/api/doctors/', { params });
    return response.data;
  },

  // GET /api/doctors/my-profile/
  getMyProfile: async () => {
    const response = await apiClient.get('/api/doctors/my-profile/');
    return response.data;
  },

  // POST /api/doctors/profile/
  // TODO: Awaiting backend payload schema
  createProfile: async (payload) => {
    const response = await apiClient.post('/api/doctors/profile/', payload);
    return response.data;
  },

  // PUT /api/doctors/profile/
  // TODO: Awaiting backend payload schema
  updateProfile: async (payload) => {
    const response = await apiClient.put('/api/doctors/profile/', payload);
    return response.data;
  },

  // GET /api/doctors/:id/
  getDoctorById: async (id) => {
    const response = await apiClient.get(`/api/doctors/${id}/`);
    return response.data;
  },
};
