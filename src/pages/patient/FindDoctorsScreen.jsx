import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, X, SlidersHorizontal } from 'lucide-react';

import PatientLayout from '../../layouts/PatientLayout';
import TopHeader from '../../components/navigation/TopHeader';
import DoctorCard from '../../components/cards/DoctorCard';
import FilterChip from '../../components/common/FilterChip';
import EmptyState from '../../components/feedback/EmptyState';
import LoadingSpinner from '../../components/feedback/LoadingSpinner';
import ErrorAlert from '../../components/feedback/ErrorAlert';

import { doctorService } from '../../services/doctorService';
import { getDoctorAvatar } from '../../utils/doctorAvatar';

const SPECIALTIES = [
  'All',
  'Cardiologist',
  'General Physician',
  'Neurologist',
  'Dermatologist',
];

const getDoctorName = (doctor) => {
  const firstName = doctor?.user?.first_name || '';
  const lastName = doctor?.user?.last_name || '';

  const fullName = `${firstName} ${lastName}`.trim();

  if (!fullName) {
    return 'Doctor';
  }

  return fullName.startsWith('Dr.') ? fullName : `Dr. ${fullName}`;
};

const getDoctorSpecialty = (doctor) => {
  return (
    doctor?.specialization ||
    doctor?.specialty ||
    'Specialization not provided'
  );
};

const getDoctorQualification = (doctor) => {
  return (
    doctor?.qualification ||
    doctor?.education ||
    'Qualification not provided'
  );
};

const getDoctorFee = (doctor) => {
  return doctor?.consultation_fee ?? doctor?.consultationFee ?? null;
};

export const FindDoctorsScreen = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedSpecialty, setSelectedSpecialty] = useState(
    searchParams.get('specialty') || 'All'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [doctorsList, setDoctorsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState(null);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setErrorNotice(null);

      /*
       * Important:
       * We fetch all doctors from the backend.
       * Specialty filtering is done on the frontend because
       * backend specialization values may be "Cardiology",
       * while UI chips use "Cardiologist".
       */
      const data = await doctorService.getDoctors();

      if (Array.isArray(data)) {
        setDoctorsList(data);
      } else if (Array.isArray(data?.results)) {
        setDoctorsList(data.results);
      } else {
        setDoctorsList([]);
      }
    } catch (err) {
      console.error('Backend doctors API error:', err);

      setDoctorsList([]);

      setErrorNotice(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          'Unable to load doctors from the hospital server.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleSpecialtyChange = (specialty) => {
    setSelectedSpecialty(specialty);

    if (specialty === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ specialty });
    }
  };

  const filteredDoctors = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return doctorsList.filter((doctor) => {
      const name = getDoctorName(doctor).toLowerCase();
      const specialty = getDoctorSpecialty(doctor).toLowerCase();
      const qualification = getDoctorQualification(doctor).toLowerCase();

      /*
       * "Cardiologist" UI chip should also match backend
       * specialization "Cardiology".
       */
      const normalizedSelected =
        selectedSpecialty.toLowerCase() === 'cardiologist'
          ? 'cardiology'
          : selectedSpecialty.toLowerCase();

      const matchesSpecialty =
        selectedSpecialty === 'All' ||
        specialty.includes(normalizedSelected) ||
        normalizedSelected.includes(specialty);

      const matchesSearch =
        !query ||
        name.includes(query) ||
        specialty.includes(query) ||
        qualification.includes(query);

      return matchesSpecialty && matchesSearch;
    });
  }, [doctorsList, selectedSpecialty, searchQuery]);

  return (
    <PatientLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full space-y-5 pb-6"
      >
        <TopHeader
          title="Find a Doctor"
          subtitle="Book consultations with certified specialists"
          showBack={true}
          backTo="/dashboard"
          className="px-1"
        />

        {errorNotice && (
          <ErrorAlert
            title="Doctors Service"
            message={errorNotice}
            onRetry={fetchDoctors}
          />
        )}

        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-medisetu-muted">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by doctor name, specialty, or qualification..."
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

        {/* Specialty filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SPECIALTIES.map((specialty) => (
            <FilterChip
              key={specialty}
              label={specialty}
              isActive={
                selectedSpecialty.toLowerCase() === specialty.toLowerCase()
              }
              hasDropdown={false}
              onClick={() => handleSpecialtyChange(specialty)}
            />
          ))}
        </div>

        {/* Count */}
        <div className="flex items-center justify-between px-1 text-xs text-medisetu-muted">
          <span>
            Showing {filteredDoctors.length}{' '}
            {filteredDoctors.length === 1 ? 'doctor' : 'doctors'}
          </span>

          <span className="flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-medisetu-primary" />
            Verified Only
          </span>
        </div>

        {/* Doctors */}
        {loading ? (
          <div className="py-16 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : errorNotice ? (
          <EmptyState
            title="Unable to Load Doctors"
            description={errorNotice}
            actionText="Try Again"
            onAction={fetchDoctors}
          />
        ) : filteredDoctors.length > 0 ? (
          <div className="space-y-3.5">
            {filteredDoctors.map((doctor) => {
              const name = getDoctorName(doctor);
              const specialty = getDoctorSpecialty(doctor);
              const qualification = getDoctorQualification(doctor);
              const fee = getDoctorFee(doctor);

              return (
                <DoctorCard
                  key={doctor.id}
                  id={doctor.id}
                  name={name}
                  specialty={specialty}
                  rating={null}
                  reviewsCount={null}
                  experience={doctor.experience}
                  consultationFee={fee}
                  isTopRated={false}
                  avatar={getDoctorAvatar(doctor.id, name)}
                  onSelect={() => navigate(`/doctors/${doctor.id}`)}
                  qualification={qualification}
                />
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="No Doctors Found"
            description={
              searchQuery
                ? `No doctors matched "${searchQuery}". Try another name or specialty.`
                : 'No specialists are available in this category currently.'
            }
            actionText={
              searchQuery || selectedSpecialty !== 'All'
                ? 'Clear Filters'
                : undefined
            }
            onAction={
              searchQuery || selectedSpecialty !== 'All'
                ? () => {
                    setSearchQuery('');
                    handleSpecialtyChange('All');
                  }
                : undefined
            }
          />
        )}
      </motion.div>
    </PatientLayout>
  );
};

export default FindDoctorsScreen;