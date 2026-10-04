import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Pill,
  Calendar,
  Download,
  FileText,
  ShoppingBag,
} from 'lucide-react';

import PatientLayout from '../../layouts/PatientLayout';
import TopHeader from '../../components/navigation/TopHeader';
import MedicineItem from '../../components/cards/MedicineItem';
import StatusBadge from '../../components/common/StatusBadge';
import PrimaryButton from '../../components/common/PrimaryButton';
import OutlineButton from '../../components/common/OutlineButton';
import SegmentedTabs from '../../components/common/SegmentedTabs';
import EmptyState from '../../components/feedback/EmptyState';
import ErrorAlert from '../../components/feedback/ErrorAlert';
import LoadingSpinner from '../../components/feedback/LoadingSpinner';

import { prescriptionService } from '../../services/prescriptionService';
import { getDoctorAvatar } from '../../utils/doctorAvatar';

const getBackendError = (error) => {
  const data = error?.response?.data;

  if (typeof data?.detail === 'string') {
    return data.detail;
  }

  if (typeof data?.message === 'string') {
    return data.message;
  }

  if (data && typeof data === 'object') {
    const firstFieldError = Object.values(data)
      .flat()
      .find((value) => typeof value === 'string');

    if (firstFieldError) {
      return firstFieldError;
    }
  }

  return (
    error?.message ||
    'Unable to load prescriptions from the hospital server.'
  );
};

const normalizePrescriptions = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  return [];
};

const getDoctorName = (prescription) => {
  const doctor = prescription?.doctor_detail || prescription?.doctor;

  if (typeof doctor === 'string') {
    return doctor;
  }

  const firstName =
    doctor?.user?.first_name ||
    doctor?.first_name ||
    '';

  const lastName =
    doctor?.user?.last_name ||
    doctor?.last_name ||
    '';

  const fullName = `${firstName} ${lastName}`.trim();

  if (fullName) {
    return fullName.startsWith('Dr.') ? fullName : `Dr. ${fullName}`;
  }

  return 'Doctor information unavailable';
};

const getDoctorSpecialty = (prescription) => {
  const doctor = prescription?.doctor_detail || prescription?.doctor;

  return (
    doctor?.specialization ||
    doctor?.specialty ||
    prescription?.specialization ||
    prescription?.specialty ||
    'Specialization not provided'
  );
};

const getPrescriptionDate = (prescription) => {
  return (
    prescription?.date ||
    prescription?.prescription_date ||
    prescription?.issued_date ||
    prescription?.created_at ||
    ''
  );
};

const formatDate = (value) => {
  if (!value) {
    return 'Date not provided';
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }

  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/*
 * Backend currently does not provide a status field.
 *
 * Therefore:
 * - Explicit active/ongoing/current/valid → Active
 * - Explicit completed/expired/stopped/inactive → History
 * - No status → Active
 *
 * This prevents the real backend prescription from incorrectly
 * appearing only under Prescription History.
 */
const isActivePrescription = (prescription) => {
  const rawStatus = prescription?.status;

  if (!rawStatus) {
    return true;
  }

  const status = String(rawStatus).toLowerCase();

  if (
    ['completed', 'expired', 'stopped', 'inactive', 'cancelled'].includes(
      status
    )
  ) {
    return false;
  }

  return [
    'active',
    'ongoing',
    'current',
    'valid',
  ].includes(status);
};

const getStatus = (prescription) => {
  if (!prescription?.status) {
    return 'Active';
  }

  return prescription.status;
};

/*
 * Supports both:
 *
 * 1. Future/alternative backend format:
 *    medicines: [...]
 *
 * 2. Current backend format:
 *    medicine_name
 *    dosage
 *    duration
 */
const getMedicines = (prescription) => {
  if (Array.isArray(prescription?.medicines)) {
    return prescription.medicines;
  }

  if (Array.isArray(prescription?.medications)) {
    return prescription.medications;
  }

  if (prescription?.medicine_name) {
    return [
      {
        id: prescription.id,
        name: prescription.medicine_name,
        dosage: prescription.dosage || '',
        frequency: '',
        duration: prescription.duration || '',
      },
    ];
  }

  return [];
};

const getInstructions = (prescription) => {
  if (Array.isArray(prescription?.instructions)) {
    return prescription.instructions;
  }

  if (typeof prescription?.instructions === 'string') {
    return [prescription.instructions];
  }

  return [];
};

const getDoctorId = (prescription) => {
  const doctor = prescription?.doctor_detail || prescription?.doctor;

  if (typeof doctor === 'object') {
    return doctor?.id;
  }

  if (prescription?.doctor_id) {
    return prescription.doctor_id;
  }

  return undefined;
};

const getDownloadUrl = (prescription) => {
  return (
    prescription?.file_url ||
    prescription?.document_url ||
    prescription?.download_url ||
    prescription?.file ||
    null
  );
};

export const PrescriptionsScreen = () => {
  const [activeTab, setActiveTab] = useState('active');

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiNotice, setApiNotice] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        setApiNotice(null);

        const data = await prescriptionService.getPrescriptions();

        if (!isMounted) return;

        setPrescriptions(normalizePrescriptions(data));
      } catch (error) {
        if (!isMounted) return;

        console.error('Prescriptions API error:', error);

        setPrescriptions([]);
        setApiNotice(getBackendError(error));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPrescriptions();

    return () => {
      isMounted = false;
    };
  }, []);

  const activePrescriptions = useMemo(
    () => prescriptions.filter(isActivePrescription),
    [prescriptions]
  );

  const historyPrescriptions = useMemo(
    () =>
      prescriptions.filter(
        (prescription) => !isActivePrescription(prescription)
      ),
    [prescriptions]
  );

  const tabs = [
    { id: 'active', label: 'Active Prescription' },
    { id: 'history', label: 'Prescription History' },
  ];

  const handleRefill = () => {
    setApiNotice(
      'Prescription refill is not connected yet because the backend team has not provided a refill endpoint.'
    );
  };

  const handleDownload = (prescription) => {
    const url = getDownloadUrl(prescription);

    if (!url) {
      setApiNotice(
        'Prescription download is not available because the backend did not provide a document URL.'
      );
      return;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const renderPrescriptionCard = (prescription) => {
    const doctorId = getDoctorId(prescription);
    const doctorName = getDoctorName(prescription);
    const specialty = getDoctorSpecialty(prescription);
    const date = getPrescriptionDate(prescription);
    const status = getStatus(prescription);
    const medicines = getMedicines(prescription);
    const instructions = getInstructions(prescription);

    return (
      <div
        key={prescription?.id ?? `${doctorName}-${date}`}
        className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5"
      >
        {/* Doctor Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex-shrink-0 border-2 border-white shadow-xs">
              {getDoctorAvatar(
                doctorId || prescription?.doctor_id || 'unknown',
                doctorName,
                'w-full h-full'
              )}
            </div>

            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-medisetu-navy leading-tight truncate">
                {doctorName}
              </h3>

              <span className="text-xs text-medisetu-primary font-semibold">
                {specialty}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-medisetu-muted flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(date)}
            </span>

            <StatusBadge
              status={status}
              variant={
                String(status).toLowerCase() === 'active'
                  ? 'success'
                  : 'default'
              }
              size="sm"
            />
          </div>
        </div>

        {/* Medicines */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-medisetu-navy flex items-center gap-2">
              <Pill className="w-4 h-4 text-medisetu-primary" />
              Prescribed Medicines
            </h4>

            <span className="text-xs text-medisetu-muted">
              {medicines.length} {medicines.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>

          {medicines.length > 0 ? (
            <div className="space-y-2.5">
              {medicines.map((medicine, index) => (
                <MedicineItem
                  key={medicine?.id ?? index}
                  name={
                    medicine?.name ||
                    medicine?.medicine_name ||
                    medicine?.drug_name ||
                    'Medicine'
                  }
                  dosage={medicine?.dosage || ''}
                  frequency={medicine?.frequency || ''}
                  duration={medicine?.duration || ''}
                  color={
                    index === 0
                      ? 'red'
                      : index === 1
                        ? 'blue'
                        : 'amber'
                  }
                />
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-medisetu-muted">
              No medicine details were provided by the backend for this
              prescription.
            </div>
          )}
        </div>

        {/* Instructions */}
        {instructions.length > 0 && (
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 space-y-2">
            <h5 className="text-xs font-bold text-medisetu-navy">
              Doctor Advice & Precautions:
            </h5>

            <ul className="text-xs text-medisetu-slate space-y-1 pl-4 list-disc">
              {instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <PrimaryButton
            fullWidth
            onClick={handleRefill}
            className="gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Order Pharmacy Refill
          </PrimaryButton>

          <OutlineButton
            fullWidth
            onClick={() => handleDownload(prescription)}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </OutlineButton>
        </div>
      </div>
    );
  };

  return (
    <PatientLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full space-y-5 pb-6"
      >
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

        <SegmentedTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {loading ? (
          <div className="py-16 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : activeTab === 'active' ? (
          <div className="space-y-4">
            {activePrescriptions.length > 0 ? (
              activePrescriptions.map(renderPrescriptionCard)
            ) : (
              <EmptyState
                title="No Active Prescriptions"
                description="You do not have any active prescriptions from the hospital."
              />
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {historyPrescriptions.length > 0 ? (
              historyPrescriptions.map((item) => {
                const doctorName = getDoctorName(item);
                const specialty = getDoctorSpecialty(item);
                const date = getPrescriptionDate(item);
                const status = getStatus(item);

                return (
                  <div
                    key={item?.id ?? `${doctorName}-${date}`}
                    className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center justify-between gap-3 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-medisetu-primary flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-medisetu-navy truncate">
                          {doctorName}
                        </h4>

                        <p className="text-xs text-medisetu-muted truncate">
                          {specialty} · {formatDate(date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <StatusBadge
                        status={status}
                        variant={
                          String(status).toLowerCase() === 'active'
                            ? 'success'
                            : 'default'
                        }
                        size="sm"
                      />

                      <OutlineButton
                        size="sm"
                        onClick={() => {
                          setApiNotice(
                            'Prescription detail view is not connected because no prescription detail contract has been confirmed yet.'
                          );
                        }}
                      >
                        View
                      </OutlineButton>
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState
                title="No Prescription History"
                description="Past prescriptions will appear here when they are provided by the hospital backend."
              />
            )}
          </div>
        )}
      </motion.div>
    </PatientLayout>
  );
};

export default PrescriptionsScreen;