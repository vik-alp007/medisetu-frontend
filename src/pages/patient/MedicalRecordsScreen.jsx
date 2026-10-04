import React, { useEffect, useMemo, useState } from 'react';
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
} from 'lucide-react';

import PatientLayout from '../../layouts/PatientLayout';
import TopHeader from '../../components/navigation/TopHeader';
import EmptyState from '../../components/feedback/EmptyState';
import LoadingSpinner from '../../components/feedback/LoadingSpinner';
import ErrorAlert from '../../components/feedback/ErrorAlert';
import ReportUploadCard from '../../components/records/ReportUploadCard';

import { recordService } from '../../services/recordService';

const formatDate = (dateValue) => {
  if (!dateValue) return 'Date not available';

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
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

  return fullName
    ? fullName.startsWith('Dr.')
      ? fullName
      : `Dr. ${fullName}`
    : 'Doctor';
};

const getSpecialization = (record) => {
  return (
    record?.doctor_detail?.specialization ||
    record?.doctor_detail?.specialty ||
    'Specialization not provided'
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
  if (record?.diagnosis) {
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
    'No additional notes available.'
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-medisetu-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-medisetu-navy text-sm">
            {title}
          </h3>

          <p className="text-xs text-medisetu-muted mt-1">
            {type}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" />
              {date}
            </span>

            <span className="flex items-center gap-1">
              <UserRound className="w-3.5 h-3.5" />
              {doctorName}
            </span>
          </div>

          <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
            <Stethoscope className="w-3.5 h-3.5" />
            {specialization}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onPreview(record)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-medisetu-primary hover:opacity-80"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>

        {fileUrl ? (
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-medisetu-primary"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
        ) : (
          <span className="text-xs text-slate-400">
            No file
          </span>
        )}
      </div>
    </motion.div>
  );
};

export const MedicalRecordsScreen = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState(null);

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

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
        <TopHeader
          title="Medical Records"
          subtitle="View your medical history and reports"
          showBack={true}
          backTo="/dashboard"
          className="px-1"
        />

        {errorNotice && (
          <ErrorAlert
            title="Medical Records Service"
            message={errorNotice}
            onRetry={fetchRecords}
          />
        )}

        <ReportUploadCard onUploaded={() => fetchRecords()} />

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search records, doctors..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-medisetu-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-medisetu-primary"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'Reports', 'Visits'].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                activeFilter === filter
                  ? 'bg-medisetu-primary text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

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
                : 'No medical records are available yet.'
            }
            actionText={searchQuery ? 'Clear Search' : undefined}
            onAction={
              searchQuery
                ? () => setSearchQuery('')
                : undefined
            }
          />
        )}

        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <div>
                  <h2 className="font-semibold text-lg text-medisetu-navy">
                    Medical Record
                  </h2>
                  <p className="text-xs text-medisetu-muted mt-1">
                    {formatDate(selectedRecord.created_at)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">
                    Diagnosis
                  </p>
                  <p className="text-sm font-semibold text-medisetu-navy mt-1">
                    {selectedRecord.diagnosis || 'Not provided'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">
                    Doctor
                  </p>
                  <p className="text-sm text-slate-700 mt-1">
                    {getDoctorName(selectedRecord)}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {getSpecialization(selectedRecord)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">
                    Doctor Notes
                  </p>
                  <p className="text-sm text-slate-700 mt-1 leading-6">
                    {getRecordNotes(selectedRecord)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">
                    Appointment
                  </p>
                  <p className="text-sm text-slate-700 mt-1">
                    {selectedRecord.appointment
                      ? `Appointment #${selectedRecord.appointment}`
                      : 'Not linked'}
                  </p>
                </div>

                {getReportFile(selectedRecord) && (
                  <a
                    href={getReportFile(selectedRecord)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-medisetu-primary text-white text-sm font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Download Report
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </PatientLayout>
  );
};

export default MedicalRecordsScreen;