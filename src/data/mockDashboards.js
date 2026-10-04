/**
 * ============================================================================
 * TEMPORARY MOCK DATA - DOCTOR & ADMIN DASHBOARDS (the ONLY place for it)
 * ----------------------------------------------------------------------------
 * REPLACE WHEN BACKEND DASHBOARD API CONTRACTS ARE PROVIDED.
 * TODO: CONNECT TO /api/dashboard/doctor/ and /api/dashboard/admin/
 *
 * When is this used?
 *   Only when the real dashboard AND list endpoints all fail for a
 *   NON-authentication reason (offline server, 404, 5xx, timeout) AND
 *   VITE_ENABLE_DEMO_FALLBACK is not "false". The UI then shows a visible
 *   "Demo data" banner. It is never mixed into real data.
 *
 * Shape: already in the NORMALIZED structure the UI consumes, i.e. the same
 * output as services/adapters/doctorDashboardAdapter.js and
 * adminDashboardAdapter.js. Names are obviously fictional.
 * ============================================================================
 */

export const mockDoctorDashboard = {
  isDemo: true,
  doctor: { name: 'Dr. Demo Doctor', specialization: 'General Medicine (demo)' },
  stats: {
    todayAppointments: 3,
    upcomingAppointments: 8,
    pendingAppointments: 2,
    totalPatients: 42,
    recordsCount: 17,
    prescriptionsCount: 29,
  },
  todayAppointments: [
    { id: 'demo-1', patientName: 'Demo Patient A', time: '10:00:00', date: null, reason: 'Routine checkup', status: 'CONFIRMED' },
    { id: 'demo-2', patientName: 'Demo Patient B', time: '11:30:00', date: null, reason: 'Follow-up visit', status: 'PENDING' },
    { id: 'demo-3', patientName: 'Demo Patient C', time: '15:00:00', date: null, reason: 'Fever and cough', status: 'PENDING' },
  ],
  upcomingAppointments: [
    { id: 'demo-4', patientName: 'Demo Patient D', time: '09:30:00', date: '2026-10-12', reason: 'Blood pressure review', status: 'CONFIRMED' },
    { id: 'demo-5', patientName: 'Demo Patient E', time: '14:00:00', date: '2026-10-14', reason: 'Lab report discussion', status: 'PENDING' },
  ],
  recentPatients: [
    { id: 'demo-p1', name: 'Demo Patient A', lastVisit: '2026-09-30' },
    { id: 'demo-p2', name: 'Demo Patient F', lastVisit: '2026-09-28' },
    { id: 'demo-p3', name: 'Demo Patient G', lastVisit: '2026-09-25' },
  ],
  recentRecords: [
    { id: 'demo-r1', patientName: 'Demo Patient A', diagnosis: 'General wellness evaluation', date: '2026-09-30' },
    { id: 'demo-r2', patientName: 'Demo Patient F', diagnosis: 'Seasonal allergy review', date: '2026-09-28' },
  ],
  recentPrescriptions: [
    { id: 'demo-rx1', patientName: 'Demo Patient A', medicine: 'Multivitamin (demo)', date: '2026-09-30' },
    { id: 'demo-rx2', patientName: 'Demo Patient F', medicine: 'Antihistamine (demo)', date: '2026-09-28' },
  ],
  sources: {},
  notices: [],
};

export const mockAdminDashboard = {
  isDemo: true,
  stats: {
    totalPatients: 128,
    totalDoctors: 12,
    totalAppointments: 342,
    pendingAppointments: 19,
  },
  billing: {
    totalBilled: 256000,
    collected: 198500,
    outstanding: 57500,
    pendingBills: 14,
    totalBills: 96,
  },
  appointmentsByStatus: [
    { status: 'PENDING', count: 19 },
    { status: 'CONFIRMED', count: 41 },
    { status: 'COMPLETED', count: 270 },
    { status: 'CANCELLED', count: 12 },
  ],
  recentActivity: [
    { id: 'demo-a1', type: 'appointment', title: 'New appointment booked (demo)', detail: 'Demo Patient A with Dr. Demo Doctor', date: '2026-10-04' },
    { id: 'demo-a2', type: 'bill', title: 'Bill generated (demo)', detail: '₹750 - pending', date: '2026-10-04' },
    { id: 'demo-a3', type: 'record', title: 'Medical record added (demo)', detail: 'General wellness evaluation', date: '2026-10-03' },
  ],
  doctors: [
    { id: 'demo-d1', name: 'Dr. Demo Doctor', specialization: 'General Medicine (demo)' },
    { id: 'demo-d2', name: 'Dr. Sample Cardio', specialization: 'Cardiology (demo)' },
  ],
  sources: {},
  notices: [],
};
