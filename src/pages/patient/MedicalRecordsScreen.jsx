import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  CalendarDays,
  UserRound,
  Stethoscope,
  Eye,
  Download,
  X,
  Search,
  Upload,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

import PatientLayout from '../../layouts/PatientLayout';
import TopHeader from '../../components/navigation/TopHeader';
import PrimaryButton from '../../components/common/PrimaryButton';
import EmptyState from '../../components/feedback/EmptyState';
import LoadingSpinner from '../../components/feedback/LoadingSpinner';
import ErrorAlert from '../../components/feedback/ErrorAlert';
import ReportUploadCard from '../../components/records/ReportUploadCard';
import ReportUploadModal from '../../components/ml/ReportUploadModal';

import { recordService } from '../../services/recordService';

const formatDate = (dateValue) => {
  if (!dateValue) return 'Date not available';

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getDoctorName = (record) => {
  const firstName = record?.doctor_detail?.user?.first_name || '';
  const lastName = record?.doctor_detail?.user?.last_name || '';

  const fullName = `${firstName} ${lastName}`.trim();

  if (fullName) {
    return fullName.startsWith('Dr.') ? fullName : `Dr. ${fullName}`;
  }

  if (record?.diagnosis) {
    return 'MediSetu AI / Clinical Analysis';
  }

  return 'Doctor';
};

const getSpecialization = (record) => {
  return (
    record?.doctor_detail?.specialization ||
    record?.doctor_detail?.specialty ||
    (record?.diagnosis ? 'AI Disease-Risk Prediction' : 'Specialization not provided')
  );
};

const getRecordTitle = (record) => {
  return (
    record?.diagnosis ||
    record?.title ||
    record?.record_name ||
    record?.document_name ||
    'Medical Record'
  );
};

const getRecordType = (record) => {
  if (record?.diagnosis || record?.report_file) {
    return 'Medical Report';
  }

  return (
    record?.record_type ||
    record?.type ||
    record?.category ||
    'Medical Record'
  );
};

const getRecordNotes = (record) => {
  return (
    record?.doctor_notes ||
    record?.description ||
    record?.notes ||
    'No additional clinical notes recorded.'
  );
};

const getReportFile = (record) => {
  return (
    record?.report_file ||
    record?.file_url ||
    record?.document_url ||
    record?.download_url ||
    record?.file ||
    null
  );
};

const RecordCard = ({ record, onPreview }) => {
  const title = getRecordTitle(record);
  const doctorName = getDoctorName(record);
  const specialization = getSpecialization(record);
  const date = formatDate(record?.created_at || record?.record_date);
  const type = getRecordType(record);
  const fileUrl = getReportFile(record);
  const isAiReport = Boolean(record?.diagnosis || record?.report_file);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:border-blue-200 dark:hover:border-blue-700 transition-colors"
    >
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-medisetu-primary dark:text-blue-400 flex items-center justify-center shrink-0">
          {isAiReport ? (
            <Sparkles className="w-5 h-5 text-amber-500" />
          ) : (
            <FileText className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-medisetu-navy dark:text-white text-sm truncate">
              {title}
            </h3>
            {isAiReport && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/70 text-medisetu-primary dark:text-blue-300 border border-blue-200 dark:border-blue-800 shrink-0">
                AI Analyzed
              </span>
            )}
          </div>

          <p className="text-xs text-medisetu-muted dark:text-slate-400 mt-1">
            {type}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" />
              {date}
            </span>

            <span className="flex items-center gap-1">
              <UserRound className="w-3.5 h-3.5" />
              {doctorName}
            </span>
          </div>

          <div className="flex items-center gap-1 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <Stethoscope className="w-3.5 h-3.5" />
            {specialization}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onPreview(record)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-medisetu-primary dark:text-blue-400 hover:opacity-80"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>

        {fileUrl ? (
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-medisetu-primary dark:hover:text-blue-400"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
        ) : (
          <span className="text-xs text-slate-400">
            No attached file
          </span>
        )}
      </div>
    </motion.div>
  );
};

export const MedicalRecordsScreen = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState(null);

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Upload & ML Prediction Modal State
  const [showUploadModal, setShowUploadModal] = useState(() => {
    return (
      searchParams.get('upload') === 'true' ||
      Boolean(location.state?.openUpload)
    );
  });

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setErrorNotice(null);

      const data = await recordService.getMedicalRecords();

      if (Array.isArray(data)) {
        setRecords(data);
      } else if (Array.isArray(data?.results)) {
        setRecords(data.results);
      } else {
        setRecords([]);
      }
    } catch (error) {
      console.error('Medical records API error:', error);

      setRecords([]);

      setErrorNotice(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          'Unable to load medical records.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return records.filter((record) => {
      const title = getRecordTitle(record).toLowerCase();
      const doctor = getDoctorName(record).toLowerCase();
      const specialization = getSpecialization(record).toLowerCase();
      const notes = getRecordNotes(record).toLowerCase();

      const matchesSearch =
        !query ||
        title.includes(query) ||
        doctor.includes(query) ||
        specialization.includes(query) ||
        notes.includes(query);

      let matchesFilter = true;

      if (activeFilter === 'Reports') {
        matchesFilter = Boolean(record?.diagnosis || record?.report_file);
      }

      if (activeFilter === 'Visits') {
        matchesFilter = Boolean(record?.appointment);
      }

      return matchesSearch && matchesFilter;
    });
  }, [records, activeFilter, searchQuery]);

  return (
    <PatientLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full space-y-5 pb-6"
      >
        {/* Header with Upload & Analyze Action Button */}
        <TopHeader
          title="Medical Records"
          subtitle="View your medical history and clinical reports"
          showBack={true}
          backTo="/dashboard"
          rightElement={
            <PrimaryButton
              size="sm"
              onClick={() => setShowUploadModal(true)}
              className="gap-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload & Analyze</span>
              <span className="sm:hidden">Upload</span>
            </PrimaryButton>
          }
          className="px-1"
        />

        {/* Feature Hero Banner: AI Medical Report Prediction */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-5 sm:p-6 text-white shadow-card relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5 max-w-lg">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-semibold text-white">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Clinical Report Assistant</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">
                Upload & Predict Disease Risk
              </h2>
              <p className="text-xs text-blue-100 leading-relaxed">
                Upload medical reports (PDF, JPG, PNG, WEBP up to 10MB) for automated
                OCR text extraction, 16 ML disease-risk estimations, and automatic record creation.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2.5 rounded-2xl bg-white text-medisetu-primary hover:bg-blue-50 text-xs sm:text-sm font-bold shadow-md transition-transform active:scale-95 shrink-0 inline-flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Analyze Report</span>
            </button>
          </div>
        </div>

        {errorNotice && (
          <ErrorAlert
            title="Medical Records Service"
            message={errorNotice}
            onRetry={fetchRecords}
          />
        )}

        <ReportUploadCard onUploaded={() => fetchRecords()} />

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search records, diagnosis, doctors..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-medisetu-navy dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950 focus:border-medisetu-primary"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'Reports', 'Visits'].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                activeFilter === filter
                  ? 'bg-medisetu-primary text-white'
                  : 'bg-white dark:bg-[#1E293B] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Records Listing */}
        {loading ? (
          <div className="py-16 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : errorNotice ? (
          <EmptyState
            title="Unable to Load Records"
            description={errorNotice}
            actionText="Try Again"
            onAction={fetchRecords}
          />
        ) : filteredRecords.length > 0 ? (
          <div className="space-y-3.5">
            {filteredRecords.map((record) => (
              <RecordCard
                key={record.id}
                record={record}
                onPreview={setSelectedRecord}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Medical Records"
            description={
              searchQuery
                ? `No records matched "${searchQuery}".`
                : 'No medical records are available yet. Upload a report to start your clinical history.'
            }
            actionText={searchQuery ? 'Clear Search' : 'Upload & Analyze Report'}
            onAction={
              searchQuery
                ? () => setSearchQuery('')
                : () => setShowUploadModal(true)
            }
          />
        )}

        {/* Detail Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg bg-white dark:bg-[#1E293B] rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="font-semibold text-lg text-medisetu-navy dark:text-white">
                    Medical Record Details
                  </h2>
                  <p className="text-xs text-medisetu-muted dark:text-slate-400 mt-1">
                    {formatDate(selectedRecord.created_at)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">
                    Diagnosis / Finding
                  </p>
                  <p className="text-sm font-semibold text-medisetu-navy dark:text-white mt-1">
                    {selectedRecord.diagnosis || 'Not provided'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">
                    Clinical Provider
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-200 mt-1 font-medium">
                    {getDoctorName(selectedRecord)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {getSpecialization(selectedRecord)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">
                    Doctor / Analysis Notes
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-200 mt-1 leading-6">
                    {getRecordNotes(selectedRecord)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">
                    Appointment Association
                  </p>
                  <p className="text-sm text-slate-700 dark:text-slate-200 mt-1">
                    {selectedRecord.appointment
                      ? `Appointment #${selectedRecord.appointment}`
                      : 'Direct Report Upload (Self-Archived)'}
                  </p>
                </div>

                {/* Medical Disclaimer */}
                {Boolean(selectedRecord.diagnosis || selectedRecord.report_file) && (
                  <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <p>
                      <strong>Notice:</strong> AI/ML prediction only — this result is not a confirmed medical diagnosis.
                    </p>
                  </div>
                )}

                {getReportFile(selectedRecord) && (
                  <a
                    href={getReportFile(selectedRecord)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-medisetu-primary hover:bg-medisetu-primary-hover text-white text-sm font-semibold transition-colors shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    Download Attached Report
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Dedicated Report Upload & ML Prediction Modal */}
        <ReportUploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            fetchRecords();
          }}
        />
      </motion.div>
    </PatientLayout>
  );
};

export default MedicalRecordsScreen;