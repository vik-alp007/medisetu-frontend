import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Stethoscope,
  X,
  FileCheck,
  Download,
  Activity,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

import PrimaryButton from '../common/PrimaryButton';
import OutlineButton from '../common/OutlineButton';
import ErrorAlert from '../feedback/ErrorAlert';
import {
  mlService,
  validateReportFile,
  parsePredictionResponse,
  getMlErrorMessage,
} from '../../services/mlService';

/**
 * Helper to format byte sizes into readable string (e.g. 2.4 MB)
 */
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Return appropriate risk badge styling based on risk percentage or level
 */
const getRiskBadgeClass = (riskLevel, riskPercent) => {
  const level = String(riskLevel || '').toLowerCase();
  const percent = Number(riskPercent) || 0;

  if (level === 'high' || percent >= 70) {
    return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900';
  }
  if (level === 'moderate' || (percent >= 30 && percent < 70)) {
    return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900';
  }
  return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900';
};

/**
 * ReportUploadModal
 *
 * Dedicated modal for uploading a medical report file to the Django ML endpoint:
 * POST /api/predict-disease/
 *
 * Handles:
 * 1. File selection & strict client-side validation (PDF, JPG, PNG, WEBP <= 10MB)
 * 2. Optional symptoms text
 * 3. Loading state with informative OCR/ML progress
 * 4. Dynamic prediction result display
 * 5. Medical disclaimer
 * 6. Refreshes records on completion (Django already creates MedicalRecord)
 */
export const ReportUploadModal = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const fileInputRef = useRef(null);

  // Form states
  const [selectedFile, setSelectedFile] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [fileValidationError, setFileValidationError] = useState(null);

  // Execution states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);

  // Reset all states
  const handleReset = () => {
    setSelectedFile(null);
    setSymptoms('');
    setFileValidationError(null);
    setIsAnalyzing(false);
    setApiError(null);
    setPredictionResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleModalClose = () => {
    if (isAnalyzing) return; // Prevent closing while analysis is underway
    const hadResult = Boolean(predictionResult);
    handleReset();
    onClose(hadResult);
  };

  // Process chosen file
  const handleFileChange = (file) => {
    setFileValidationError(null);
    setApiError(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const validation = validateReportFile(file);
    if (!validation.isValid) {
      setFileValidationError(validation.error);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setSelectedFile(file);
  };

  const handleInputChange = (event) => {
    const file = event.target.files?.[0];
    handleFileChange(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    handleFileChange(file);
  };

  // Handle form submission to Django ML endpoint
  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    if (!selectedFile || isAnalyzing) return;

    // Validate one more time before submit
    const validation = validateReportFile(selectedFile);
    if (!validation.isValid) {
      setFileValidationError(validation.error);
      return;
    }

    try {
      setIsAnalyzing(true);
      setApiError(null);
      setPredictionResult(null);

      // Call Django endpoint: POST /api/predict-disease/
      const responseData = await mlService.predictDisease(
        selectedFile,
        symptoms
      );

      // Parse response safely
      const parsed = parsePredictionResponse(responseData);
      setPredictionResult(parsed);

      // Notify parent to refresh medical records list
      if (onSuccess) {
        onSuccess(parsed);
      }
    } catch (error) {
      console.error('ML Disease prediction failed:', error);
      const friendlyMessage = getMlErrorMessage(error);
      setApiError(friendlyMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isOpen) return null;

  const isPdf =
    selectedFile?.type === 'application/pdf' ||
    selectedFile?.name?.toLowerCase().endsWith('.pdf');

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleModalClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 my-auto overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-medisetu-primary dark:text-blue-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-medisetu-navy dark:text-white leading-tight">
                  Medical Report AI Prediction
                </h2>
                <p className="text-xs text-medisetu-muted dark:text-slate-400 mt-0.5">
                  Automated OCR & ML disease-risk analysis
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleModalClose}
              disabled={isAnalyzing}
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-5">
            {/* =========================================================
                STATE 1: ANALYZING / LOADING SPINNER
            ========================================================= */}
            {isAnalyzing && (
              <div className="py-10 px-4 text-center space-y-6">
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-950 border-t-medisetu-primary animate-spin" />
                  <Activity className="w-8 h-8 text-medisetu-primary animate-pulse" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-base sm:text-lg font-bold text-medisetu-navy dark:text-white">
                    Analyzing Medical Report...
                  </h3>
                  <p className="text-xs sm:text-sm text-medisetu-muted dark:text-slate-400 leading-relaxed">
                    The hospital server is performing optical character
                    recognition (OCR), extracting clinical parameters, and
                    evaluating machine learning disease-risk models.
                  </p>
                </div>

                {/* Progress Indicators */}
                <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-4 text-left max-w-md mx-auto space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-medisetu-primary shrink-0" />
                    <span>Transmitting file to hospital API (POST /api/predict-disease/)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-medisetu-primary border-t-transparent animate-spin shrink-0" />
                    <span>OCR text & clinical feature extraction...</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                    <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[10px]">
                      •
                    </span>
                    <span>16 disease-risk predictions & record archiving</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  This comprehensive analysis may take up to a minute. Please keep this window open.
                </p>
              </div>
            )}

            {/* =========================================================
                STATE 2: PREDICTION SUCCESS RESULTS DISPLAY
            ========================================================= */}
            {!isAnalyzing && predictionResult && (
              <div className="space-y-5">
                {/* Success Banner */}
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                      Analysis Completed & Medical Record Created
                    </h3>
                    <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                      {predictionResult.medicalRecordId
                        ? `Medical Record #${predictionResult.medicalRecordId} has been automatically stored in your hospital profile.`
                        : 'Your report and prediction have been securely archived.'}
                    </p>
                  </div>
                </div>

                {/* Primary Prediction Card */}
                <div className="bg-white dark:bg-[#182234] border-2 border-blue-100 dark:border-blue-900/60 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-medisetu-primary dark:text-blue-400">
                      Primary Disease / Risk Finding
                    </span>
                    {predictionResult.confidence && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/80 text-medisetu-primary dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        Confidence: {predictionResult.confidence}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-medisetu-navy dark:text-white">
                    {predictionResult.primaryDisease}
                  </h3>

                  {/* Recommendation */}
                  {predictionResult.recommendation && (
                    <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-start gap-3 mt-3">
                      <Stethoscope className="w-5 h-5 text-medisetu-primary dark:text-blue-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                          Clinical Recommendation
                        </p>
                        <p className="text-xs sm:text-sm text-medisetu-navy dark:text-slate-200 font-medium mt-1 leading-relaxed">
                          {predictionResult.recommendation}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Uploaded report file link if returned */}
                  {predictionResult.reportFileUrl && (
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">
                        Archived Report File:
                      </span>
                      <a
                        href={predictionResult.reportFileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-semibold text-medisetu-primary dark:text-blue-400 hover:underline"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download Document
                      </a>
                    </div>
                  )}
                </div>

                {/* Additional Risk Results (16 Models breakdown if provided by API) */}
                {predictionResult.riskResults &&
                  predictionResult.riskResults.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-medisetu-muted dark:text-slate-400 px-1">
                        Disease Risk Model Breakdown ({predictionResult.riskResults.length})
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                        {predictionResult.riskResults.map((item, index) => {
                          const badgeClass = getRiskBadgeClass(
                            item.risk_level,
                            item.risk_percent
                          );
                          return (
                            <div
                              key={item.disease_code || item.disease || index}
                              className="bg-white dark:bg-[#182234] border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex items-center justify-between gap-3"
                            >
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-medisetu-navy dark:text-white truncate">
                                  {item.disease}
                                </p>
                                {item.risk_percent !== undefined && (
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                    Risk Score: {item.risk_percent}%
                                  </p>
                                )}
                              </div>

                              {item.risk_level && (
                                <span
                                  className={`px-2.5 py-0.5 text-[11px] font-bold rounded-lg border ${badgeClass} whitespace-nowrap`}
                                >
                                  {item.risk_level}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {/* Written Results List if available */}
                {predictionResult.writtenResults &&
                  predictionResult.writtenResults.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-3.5 space-y-1 text-xs">
                      <p className="font-semibold text-medisetu-navy dark:text-white mb-1.5">
                        Clinical Findings Summary:
                      </p>
                      {predictionResult.writtenResults.map((wr, idx) => (
                        <p
                          key={idx}
                          className="text-slate-600 dark:text-slate-300 leading-relaxed"
                        >
                          • {typeof wr === 'string' ? wr : wr?.message || wr?.disease}
                        </p>
                      ))}
                    </div>
                  )}

                {/* Graph Data if available */}
                {predictionResult.graphData &&
                  predictionResult.graphData.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-medisetu-navy dark:text-white">
                        Risk Level Distribution
                      </p>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {predictionResult.graphData.map((g, i) => {
                          const percent = Math.min(
                            100,
                            Math.max(0, Number(g.risk_percent) || 0)
                          );
                          return (
                            <div key={i} className="text-xs space-y-1">
                              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                                <span>{g.disease}</span>
                                <span className="font-semibold">{percent}%</span>
                              </div>
                              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    percent >= 70
                                      ? 'bg-red-500'
                                      : percent >= 30
                                      ? 'bg-amber-500'
                                      : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {/* MANDATORY Medical Disclaimer */}
                <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <p className="leading-relaxed">
                    <strong>Medical Notice:</strong> AI/ML prediction only — this
                    result is not a confirmed medical diagnosis. Please consult
                    a licensed doctor for clinical decisions.
                  </p>
                </div>

                {/* Result Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <PrimaryButton
                    fullWidth
                    onClick={handleModalClose}
                    className="gap-2"
                  >
                    <span>View in Medical Records</span>
                    <ArrowRight className="w-4 h-4" />
                  </PrimaryButton>

                  <OutlineButton
                    fullWidth
                    onClick={handleReset}
                    className="gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Analyze Another Report</span>
                  </OutlineButton>
                </div>
              </div>
            )}

            {/* =========================================================
                STATE 3: INITIAL FILE UPLOAD & SYMPTOMS FORM
            ========================================================= */}
            {!isAnalyzing && !predictionResult && (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Error Banner */}
                {apiError && (
                  <ErrorAlert
                    title="Report Analysis Error"
                    message={apiError}
                    onRetry={handleSubmit}
                  />
                )}

                {/* File Validation Alert */}
                {fileValidationError && (
                  <div className="p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-2xl flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
                    <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <span>{fileValidationError}</span>
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleInputChange}
                  accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
                  className="hidden"
                />

                {/* Dropzone */}
                {!selectedFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
                      isDragging
                        ? 'border-medisetu-primary bg-blue-50/60 dark:bg-blue-950/30 scale-[1.01]'
                        : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-400'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-medisetu-primary dark:text-blue-400 flex items-center justify-center mx-auto mb-3 shadow-xs">
                      <Upload className="w-7 h-7" />
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-medisetu-navy dark:text-white">
                      Click or drag medical report to upload
                    </h4>

                    <p className="text-xs text-medisetu-muted dark:text-slate-400 mt-1 max-w-sm mx-auto">
                      Supports lab reports, blood tests, clinical summaries, and diagnostic documents containing measurable values.
                    </p>

                    <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      <span>Supported: PDF, JPG, PNG, WEBP</span>
                      <span>•</span>
                      <span>Max: 10 MB</span>
                    </div>
                  </div>
                ) : (
                  /* Selected File Card */
                  <div className="bg-slate-50 dark:bg-[#182234] border border-blue-200 dark:border-blue-900/60 rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-medisetu-primary dark:text-blue-400 flex items-center justify-center shrink-0">
                        {isPdf ? (
                          <FileText className="w-6 h-6" />
                        ) : (
                          <ImageIcon className="w-6 h-6" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-medisetu-navy dark:text-white truncate">
                          {selectedFile.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-medisetu-muted dark:text-slate-400 mt-0.5">
                          <span>{formatFileSize(selectedFile.size)}</span>
                          <span>•</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-1">
                            <FileCheck className="w-3.5 h-3.5" />
                            Valid format
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 text-xs font-semibold rounded-xl text-medisetu-primary dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                      >
                        Change
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Optional Symptoms / Clinical Notes Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-medisetu-navy dark:text-slate-200">
                      Symptoms & Clinical Notes (Optional)
                    </label>
                    <span className="text-[11px] text-slate-400">Optional</span>
                  </div>

                  <textarea
                    rows={3}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g., Shortness of breath, mild chest discomfort, fever for 3 days..."
                    className="w-full px-4 py-3 bg-white dark:bg-[#182234] border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-medisetu-navy dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950 focus:border-medisetu-primary transition-all resize-none"
                  />
                  <p className="text-[11px] text-medisetu-muted dark:text-slate-400">
                    Entering your active symptoms provides helpful clinical context alongside the report.
                  </p>
                </div>

                {/* Medical Disclaimer Notice */}
                <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-2xl flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <Activity className="w-4 h-4 text-medisetu-primary shrink-0" />
                  <p>
                    <strong>AI/ML prediction only</strong> — this result is not a
                    confirmed medical diagnosis. Records are automatically saved upon prediction.
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <OutlineButton
                    type="button"
                    onClick={handleModalClose}
                  >
                    Cancel
                  </OutlineButton>

                  <PrimaryButton
                    type="submit"
                    disabled={!selectedFile || Boolean(fileValidationError)}
                    className="gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Run ML Prediction</span>
                  </PrimaryButton>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReportUploadModal;
