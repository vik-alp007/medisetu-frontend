/**
 * Report Service - medical report upload & ML disease prediction
 *
 * Architecture:
 * React -> POST /api/predict-disease/ (via Django backend)
 * Django -> ML microservice /predict-report -> auto-creates MedicalRecord -> returns prediction
 *
 * NOTE: /api/predict-disease/ handles both file upload and MedicalRecord creation in one step.
 */
import { mlService, validateReportFile as validateFileWithMl } from './mlService';

export const REPORT_UPLOAD_ENABLED = true;

export const MAX_REPORT_SIZE_MB = 10;
export const ALLOWED_REPORT_TYPES = {
  'application/pdf': 'PDF',
  'image/jpeg': 'JPG',
  'image/jpg': 'JPG',
  'image/png': 'PNG',
  'image/webp': 'WEBP',
};

export const validateReportFile = (file) => {
  const result = validateFileWithMl(file);
  return {
    valid: result.isValid,
    error: result.error,
  };
};

export const reportService = {
  /**
   * Upload report and predict disease via Django ML endpoint (POST /api/predict-disease/)
   * Automatically creates MedicalRecord on backend.
   *
   * @param {File} file
   * @param {string} [symptoms]
   * @returns {Promise<{uploaded: boolean, demo: boolean, record: object, message: string}>}
   */
  uploadReport: async (file, { symptoms = '' } = {}) => {
    const check = validateReportFile(file);
    if (!check.valid) throw new Error(check.error);

    const rawResponse = await mlService.predictDisease(file, symptoms);

    return {
      uploaded: true,
      demo: false,
      record: rawResponse,
      message: rawResponse?.message || 'Report analyzed and medical record created successfully.',
    };
  },
};

export default reportService;
