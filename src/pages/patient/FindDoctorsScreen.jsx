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
import { mockDoctors } from '../../data/mockData';
import { getDoctorAvatar } from '../../utils/doctorAvatar';

const SPECIALTIES = [
  'All',
  'Cardiologist',
  'General Physician',
  'Neurologist',
  'Dermatologist',
];

export const FindDoctorsScreen = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const specialtyParam = searchParams.get('specialty') || 'All';
  const [selectedSpecialty, setSelectedSpecialty] = useState(specialtyParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [doctorsList, setDoctorsList] = useState(mockDoctors);
  const [loading, setLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState(null);

  // Sync state if URL query param changes
  useEffect(() => {
    if (searchParams.get('specialty')) {
      setSelectedSpecialty(searchParams.get('specialty'));
    }
  }, [searchParams]);

  // Fetch doctors from backend (GET /api/doctors/)
  useEffect(() => {
    let isMounted = true;

    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setErrorNotice(null);
        const params = selectedSpecialty !== 'All' ? { specialty: selectedSpecialty } : {};
        // Backend endpoint: GET /api/doctors/
        const data = await doctorService.getDoctors(params);
        if (isMounted && data) {
          // If backend returns array, update list (TODO: Map complete backend response schema when published)
          if (Array.isArray(data) && data.length > 0) {
            setDoctorsList(data);
          } else if (data.results && Array.isArray(data.results)) {
            setDoctorsList(data.results);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.warn('Backend doctors API not reachable:', err.message);
          // Backend rule: Never silently replace real failure. Inform user if live connection failed.
          setErrorNotice('Live doctor registry server unavailable. Showing offline directory.');
          setDoctorsList(mockDoctors);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDoctors();
    return () => {
      isMounted = false;
    };
  }, [selectedSpecialty]);

  const handleSpecialtyChange = (spec) => {
    setSelectedSpecialty(spec);
    if (spec === 'All') {
      searchParams.delete('specialty');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ specialty: spec });
    }
  };

  // Filter list based on search and selected specialty
  const filteredDoctors = useMemo(() => {
    return doctorsList.filter((doc) => {
      const matchSpecialty =
        selectedSpecialty === 'All' ||
        doc.specialty?.toLowerCase().includes(selectedSpecialty.toLowerCase());

      const matchSearch =
        searchQuery.trim() === '' ||
        doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.education?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchSpecialty && matchSearch;
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
        {/* Sub-page Header (Screen 9) */}
        <TopHeader
          title="Find a Doctor"
          subtitle="Book consultations with certified specialists"
          showBack={true}
          backTo="/dashboard"
          className="px-1"
        />

        {errorNotice && (
          <ErrorAlert
            title="Registry Notice"
            message={errorNotice}
            onDismiss={() => setErrorNotice(null)}
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
            placeholder="Search by doctor name, specialty, or condition..."
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

        {/* Specialty Filter Chips (Screen 9) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SPECIALTIES.map((spec) => (
            <FilterChip
              key={spec}
              label={spec}
              isSelected={selectedSpecialty.toLowerCase() === spec.toLowerCase()}
              onClick={() => handleSpecialtyChange(spec)}
            />
          ))}
        </div>

        {/* Doctor Count / Status */}
        <div className="flex items-center justify-between px-1 text-xs text-medisetu-muted">
          <span>Showing {filteredDoctors.length} available doctors</span>
          <span className="flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-medisetu-primary" /> Verified Only
          </span>
        </div>

        {/* Doctor List */}
        {loading ? (
          <div className="py-16 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="space-y-3.5">
            {filteredDoctors.map((doc) => (
              <DoctorCard
                key={doc.id}
                id={doc.id}
                name={doc.name}
                specialty={doc.specialty}
                rating={doc.rating}
                reviewsCount={doc.reviewsCount}
                experience={doc.experience}
                consultationFee={doc.consultationFee}
                isTopRated={doc.isTopRated}
                avatar={getDoctorAvatar(doc.id, doc.name)}
                onSelect={() => navigate(`/doctors/${doc.id}`)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Doctors Found"
            description={
              searchQuery
                ? `No doctors matched "${searchQuery}". Try searching another name or specialty.`
                : 'No specialists are available in this category currently.'
            }
            actionText="Clear Filters"
            onAction={() => {
              setSearchQuery('');
              handleSpecialtyChange('All');
            }}
          />
        )}
      </motion.div>
    </PatientLayout>
  );
};

export default FindDoctorsScreen;
