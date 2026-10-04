import apiClient from './api';

/**
 * Appointment Service
 * Endpoints provided by backend contract.
 */
export const appointmentService = {
  // GET /api/appointments/
  getAppointments: async (params = {}) => {
    const response = await apiClient.get('/api/appointments/', { params });
    return response.data;
  },

  // POST /api/appointments/
  // TODO: Awaiting backend payload schema (e.g., { doctor_id, date, time_slot, consultation_type })
  createAppointment: async (payload) => {
    const response = await apiClient.post('/api/appointments/', payload);
    return response.data;
  },

  // GET /api/appointments/:id/
  getAppointmentById: async (id) => {
    const response = await apiClient.get(`/api/appointments/${id}/`);
    return response.data;
  },

  // PUT /api/appointments/:id/
  // TODO: Awaiting backend payload schema
  updateAppointment: async (id, payload) => {
    const response = await apiClient.put(`/api/appointments/${id}/`, payload);
    return response.data;
  },

  // DELETE /api/appointments/:id/
  deleteAppointment: async (id) => {
    const response = await apiClient.delete(`/api/appointments/${id}/`);
    return response.data;
  },
};
