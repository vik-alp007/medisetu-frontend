import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pill, 
  Calendar, 
  Download, 
  RefreshCw, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

import PatientLayout from '../../layouts/PatientLayout';
import TopHeader from '../../components/navigation/TopHeader';
import MedicineItem from '../../components/cards/MedicineItem';
import StatusBadge from '../../components/common/StatusBadge';
import PrimaryButton from '../../components/common/PrimaryButton';
import OutlineButton from '../../components/common/OutlineButton';
import SegmentedTabs from '../../components/common/SegmentedTabs';
import EmptyState from '../../components/feedback/EmptyState';
import LoadingSpinner from '../../components/feedback/LoadingSpinner';
import ErrorAlert from '../../components/feedback/ErrorAlert';

import { prescriptionService } from '../../services/prescriptionService';
import { mockPrescriptions } from '../../data/mockData';
import { getDoctorAvatar } from '../../utils/doctorAvatar';

export const PrescriptionsScreen = () => {
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'history'
  const [prescriptionData, setPrescriptionData] = useState(mockPrescriptions);
  const [loading, setLoading] = useState(false);
  const [apiNotice, setApiNotice] = useState(null);
  const [refillSuccess, setRefillSuccess] = useState(false);

  // Fetch prescriptions from backend (GET /api/prescriptions/)
  useEffect(() => {
    let isMounted = true;

    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        setApiNotice(null);
        // Backend endpoint: GET /api/prescriptions/
        const data = await prescriptionService.getPrescriptions();
        if (isMounted && data) {
          if (Array.isArray(data) && data.length > 0) {
            // Map first item as active and rest as history
            setPrescriptionData({
              active: data[0],
              history: data.slice(1),
            });
          }
        }
      } catch (err) {
        if (isMounted) {
          console.warn('Backend prescriptions API error or offline:', err.message);
          setApiNotice('Live prescription server unavailable. Showing current medical regime.');
          setPrescriptionData(mockPrescriptions);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPrescriptions();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRequestRefill = () => {
    setRefillSuccess(true);
    setTimeout(() => {
      setRefillSuccess(false);
    }, 3500);
  };

  const activeRx = prescriptionData.active || mockPrescriptions.active;
  const historyRx = prescriptionData.history || mockPrescriptions.history;

  const tabs = [
    { id: 'active', label: 'Active Prescription' },
    { id: 'history', label: 'Prescription History' },
  ];

  return (
    <PatientLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full space-y-5 pb-6"
      >
        {/* Header (Screen 14) */}
        <TopHeader
          title="Prescriptions"
          subtitle="Medications, dosage instructions & pharmacy refills"
          showBack={true}
          backTo="/dashboard"
          className="px-1"
        />

        {apiNotice && (
          <ErrorAlert
            title="Prescriptions Service"
            message={apiNotice}
            onDismiss={() => setApiNotice(null)}
          />
        )}

        {/* Refill Success Notification */}
        {refillSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div className="text-xs sm:text-sm">
              <strong className="block font-bold">Refill Request Submitted!</strong>
              Your prescription has been forwarded to the hospital pharmacy for home delivery / counter pickup.
            </div>
          </div>
        )}

        {/* Segmented View Switcher */}
        <SegmentedTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id)}
        />

        {/* Mode 1: Active Prescription (Screen 14) */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            {activeRx ? (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
                {/* Doctor Meta & Issue Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex-shrink-0 border-2 border-white shadow-xs">
                      {getDoctorAvatar('1', activeRx.doctor, 'w-full h-full')}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-medisetu-navy leading-tight">
                        {activeRx.doctor}
                      </h3>
                      <span className="text-xs text-medisetu-primary font-semibold">
                        {activeRx.specialty}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-medisetu-muted flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {activeRx.date}
                    </span>
                    <StatusBadge status={activeRx.status || 'Active'} variant="success" size="sm" />
                  </div>
                </div>

                {/* Clinical Notes */}
                {activeRx.notes && (
                  <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-3.5 text-xs text-medisetu-slate space-y-1">
                    <strong className="text-medisetu-navy block font-bold">Diagnosis / Notes:</strong>
                    <p className="leading-relaxed">{activeRx.notes}</p>
                  </div>
                )}

                {/* Prescribed Medicines List */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-medisetu-navy flex items-center gap-2">
                      <Pill className="w-4 h-4 text-medisetu-primary" /> Prescribed Medicines
                    </h4>
                    <span className="text-xs text-medisetu-muted">
                      {activeRx.medicines?.length || 0} Items
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {activeRx.medicines?.map((med, idx) => (
                      <MedicineItem
                        key={idx}
                        name={med.name}
                        dosage={med.dosage}
                        frequency={med.frequency}
                        duration={med.duration}
                        color={idx === 0 ? 'red' : idx === 1 ? 'blue' : 'amber'}
                      />
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                {activeRx.instructions && activeRx.instructions.length > 0 && (
                  <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 space-y-2">
                    <h5 className="text-xs font-bold text-medisetu-navy">
                      Doctor Advice & Precautions:
                    </h5>
                    <ul className="text-xs text-medisetu-slate space-y-1 pl-4 list-disc">
                      {activeRx.instructions.map((inst, idx) => (
                        <li key={idx}>{inst}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <PrimaryButton
                    fullWidth
                    onClick={handleRequestRefill}
                    className="gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Order Pharmacy Refill
                  </PrimaryButton>
                  <OutlineButton
                    fullWidth
                    onClick={() => alert('Downloading official digital prescription PDF...')}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </OutlineButton>
                </div>
              </div>
            ) : (
              <EmptyState
                title="No Active Prescriptions"
                description="You do not have any active prescription regimes at this time."
              />
            )}
          </div>
        )}

        {/* Mode 2: Prescription History */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {historyRx && historyRx.length > 0 ? (
              historyRx.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between gap-3 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-medisetu-primary flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-medisetu-navy">{item.doctor}</h4>
                      <p className="text-xs text-medisetu-muted">{item.specialty} · {item.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge
                      status={item.status}
                      variant={item.status === 'Active' ? 'success' : 'default'}
                      size="sm"
                    />
                    <OutlineButton
                      size="sm"
                      onClick={() => alert(`Opening prescription ${item.id}`)}
                    >
                      View
                    </OutlineButton>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                title="No Past Prescriptions"
                description="Past consultations and completed prescriptions will be catalogued here."
              />
            )}
          </div>
        )}
      </motion.div>
    </PatientLayout>
  );
};

export default PrescriptionsScreen;
