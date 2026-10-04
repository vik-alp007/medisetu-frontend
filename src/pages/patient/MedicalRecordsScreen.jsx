import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  X, 
  CheckCircle,
  FileSpreadsheet,
  Calendar,
  AlertCircle
} from 'lucide-react';

import PatientLayout from '../../layouts/PatientLayout';
import TopHeader from '../../components/navigation/TopHeader';
import RecordRow from '../../components/cards/RecordRow';
import FilterChip from '../../components/common/FilterChip';
import PrimaryButton from '../../components/common/PrimaryButton';
import OutlineButton from '../../components/common/OutlineButton';
import EmptyState from '../../components/feedback/EmptyState';
import LoadingSpinner from '../../components/feedback/LoadingSpinner';
import ErrorAlert from '../../components/feedback/ErrorAlert';

import { recordService } from '../../services/recordService';
import { mockMedicalRecords } from '../../data/mockData';

const CATEGORIES = ['All', 'Reports', 'Prescriptions', 'Visits'];

export const MedicalRecordsScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState(mockMedicalRecords);
  const [loading, setLoading] = useState(false);
  const [apiNotice, setApiNotice] = useState(null);

  // Preview Modal State
  const [activePreview, setActivePreview] = useState(null);

  // Upload Document State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Reports');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Fetch records from backend (GET /api/medical-records/)
  useEffect(() => {
    let isMounted = true;

    const fetchRecords = async () => {
      try {
        setLoading(true);
        setApiNotice(null);
        // Backend endpoint: GET /api/medical-records/
        const data = await recordService.getMedicalRecords();
        if (isMounted && data) {
          if (Array.isArray(data) && data.length > 0) {
            setRecords(data);
          } else if (data.results && Array.isArray(data.results)) {
            setRecords(data.results);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.warn('Backend medical records API error or offline:', err.message);
          setApiNotice('Live records service unavailable. Displaying local medical records.');
          setRecords(mockMedicalRecords);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRecords();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter records by category and search
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const matchCat =
        selectedCategory === 'All' ||
        (rec.category && rec.category.toLowerCase() === selectedCategory.toLowerCase());

      const matchSearch =
        searchQuery.trim() === '' ||
        rec.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.date?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.type?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchSearch;
    });
  }, [records, selectedCategory, searchQuery]);

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadFileName) return;

    const newRecord = {
      id: `rec-${Date.now()}`,
      type: uploadCategory === 'Prescriptions' ? 'rx' : 'lab',
      title: uploadFileName,
      date: 'Today - Just now',
      category: uploadCategory,
    };

    setRecords([newRecord, ...records]);
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setShowUploadModal(false);
      setUploadFileName('');
    }, 1200);
  };

  return (
    <PatientLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full space-y-5 pb-6"
      >
        {/* Header */}
        <TopHeader
          title="Medical Records"
          subtitle="All diagnostic reports, prescriptions & test summaries"
          showBack={true}
          backTo="/dashboard"
          rightElement={
            <PrimaryButton
              size="sm"
              onClick={() => setShowUploadModal(true)}
              className="gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </PrimaryButton>
          }
          className="px-1"
        />

        {apiNotice && (
          <ErrorAlert
            title="Records Service"
            message={apiNotice}
            onDismiss={() => setApiNotice(null)}
          />
        )}

        {/* Search Input Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-medisetu-muted">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search report name, date or lab type..."
            className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200/90 rounded-2xl text-sm text-medisetu-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-medisetu-primary transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <FilterChip
              key={cat}
              label={cat}
              isSelected={selectedCategory.toLowerCase() === cat.toLowerCase()}
              onClick={() => setSelectedCategory(cat)}
            />
          ))}
        </div>

        {/* Records Count */}
        <div className="flex items-center justify-between px-1 text-xs text-medisetu-muted">
          <span>{filteredRecords.length} documents archived</span>
          <span className="text-medisetu-primary font-medium">HIPAA Encrypted</span>
        </div>

        {/* Records List (Screen 13) */}
        {loading ? (
          <div className="py-16 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredRecords.length > 0 ? (
          <div className="space-y-3">
            {filteredRecords.map((rec) => (
              <RecordRow
                key={rec.id}
                id={rec.id}
                type={rec.type}
                title={rec.title}
                date={rec.date}
                onView={() => setActivePreview(rec)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Records Found"
            description="You don't have any uploaded medical records matching your filter."
            actionText="Clear Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          />
        )}

        {/* Document Preview Modal */}
        <AnimatePresence>
          {activePreview && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-medisetu-primary flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-medisetu-navy leading-tight">
                        {activePreview.title}
                      </h3>
                      <span className="text-xs text-medisetu-muted">{activePreview.date}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActivePreview(null)}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Simulated Document Canvas */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-3">
                  <FileSpreadsheet className="w-12 h-12 text-medisetu-primary mx-auto opacity-70" />
                  <div>
                    <h4 className="text-sm font-bold text-medisetu-navy">
                      Verified Clinical Document
                    </h4>
                    <p className="text-xs text-medisetu-muted mt-0.5">
                      Issued by MediSetu Partner Diagnostic Lab & Hospitals
                    </p>
                  </div>
                  <div className="text-xs bg-white border border-slate-200/80 rounded-xl p-3 text-left space-y-1 text-medisetu-slate">
                    <p><strong className="text-medisetu-navy">Document ID:</strong> {activePreview.id}</p>
                    <p><strong className="text-medisetu-navy">Status:</strong> Signed & Verified</p>
                    <p><strong className="text-medisetu-navy">Doctor Notes:</strong> Findings within normal clinical thresholds.</p>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3">
                  <PrimaryButton
                    fullWidth
                    onClick={() => {
                      alert(`Downloading ${activePreview.title} PDF...`);
                      setActivePreview(null);
                    }}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </PrimaryButton>
                  <OutlineButton
                    fullWidth
                    onClick={() => setActivePreview(null)}
                  >
                    Close
                  </OutlineButton>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Upload Record Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base sm:text-lg font-bold text-medisetu-navy">
                    Upload Health Document
                  </h3>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {uploadSuccess ? (
                  <div className="py-8 text-center space-y-2">
                    <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
                    <h4 className="text-base font-bold text-medisetu-navy">Uploaded Successfully!</h4>
                    <p className="text-xs text-medisetu-muted">Your document has been securely added to your records.</p>
                  </div>
                ) : (
                  <form onSubmit={handleUploadSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-medisetu-navy">Document Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Annual Health Checkup, Vitamin D Test"
                        value={uploadFileName}
                        onChange={(e) => setUploadFileName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-medisetu-navy focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-medisetu-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-medisetu-navy">Record Category</label>
                      <select
                        value={uploadCategory}
                        onChange={(e) => setUploadCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-medisetu-navy focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-medisetu-primary"
                      >
                        <option value="Reports">Reports (Blood test, X-Ray, Scan)</option>
                        <option value="Prescriptions">Prescriptions</option>
                        <option value="Visits">Visits & Summaries</option>
                      </select>
                    </div>

                    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-2 bg-slate-50/50 hover:bg-slate-50 cursor-pointer">
                      <Upload className="w-8 h-8 text-medisetu-primary mx-auto" />
                      <p className="text-xs text-medisetu-slate font-medium">
                        Click to select PDF or image document
                      </p>
                      <span className="text-[11px] text-medisetu-muted block">
                        Supported: PDF, JPG, PNG up to 10MB
                      </span>
                    </div>

                    <PrimaryButton fullWidth type="submit">
                      Upload Document
                    </PrimaryButton>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </PatientLayout>
  );
};

export default MedicalRecordsScreen;
