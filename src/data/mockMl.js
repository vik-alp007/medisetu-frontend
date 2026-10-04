/**
 * ============================================================================
 * TEMPORARY ML MOCK - the ONLY place it lives
 * ----------------------------------------------------------------------------
 * TEMPORARY ML MOCK / REPLACE WITH REAL ML API
 * The ML team has NOT yet provided an API contract. This payload deliberately
 * contains NO real-looking diagnosis: it is a clearly labelled placeholder so
 * the UI can be demonstrated without implying a medical result.
 *
 * It is passed through mlAdapter.adaptPrediction() like a real response would be.
 * ============================================================================
 */
export const mockMlRawResponse = {
  disease: 'Demo placeholder - no ML model connected',
  confidence: null,
  recommendations: [
    'This is placeholder output, not a medical result.',
    'Real predictions will appear here once the ML API is connected.',
  ],
};
