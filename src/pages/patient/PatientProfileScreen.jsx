import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Heart, 
  ShieldAlert, 
  LogOut, 
  Edit3, 
  Activity, 
  Droplet,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';

import PatientLayout from '../../layouts/PatientLayout';
import TopHeader from '../../components/navigation/TopHeader';
import InfoCard from '../../components/cards/InfoCard';
import PrimaryButton from '../../components/common/PrimaryButton';
import DangerButton from '../../components/common/DangerButton';
import OutlineButton from '../../components/common/OutlineButton';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/feedback/LoadingSpinner';
import ErrorAlert from '../../components/feedback/ErrorAlert';

import { useAuth } from '../../context/AuthContext';
import { patientService } from '../../services/patientService';
import { mockPatient } from '../../data/mockData';
import { PatientAvatarIcon } from '../../utils/doctorAvatar';

export const PatientProfileScreen = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const [profile, setProfile] = useState(mockPatient);
  const [loading, setLoading] = useState(false);
  const [apiNotice, setApiNotice] = useState(null);

  // Edit Profile Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editBloodGroup, setEditBloodGroup] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Fetch patient profile from backend (GET /api/patients/my-profile/)
  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      if (isAuthenticated) {
        try {
          setLoading(true);
          setApiNotice(null);
          // Backend endpoint: GET /api/patients/my-profile/
          const data = await patientService.getMyProfile();
          if (isMounted && data) {
            setProfile((prev) => ({
              ...prev,
              ...data,
            }));
          }
        } catch (err) {
          if (isMounted) {
            console.warn('Backend patient profile fetch error or offline:', err.message);
            setApiNotice('Live profile server unavailable. Displaying cached patient credentials.');
          }
        } finally {
          if (isMounted) setLoading(false);
        }
      }
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const handleOpenEdit = () => {
    setEditName(user?.name || profile.name);
    setEditPhone(user?.mobile || profile.mobile);
    setEditBloodGroup(profile.bloodGroup || 'O+');
    setShowEditModal(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile((prev) => ({
      ...prev,
      name: editName,
      mobile: editPhone,
      bloodGroup: editBloodGroup,
    }));
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowEditModal(false);
    }, 1200);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const personalInfoItems = [
    { icon: User, label: 'Full Legal Name', value: profile.name },
    { icon: Calendar, label: 'Date of Birth', value: profile.dateOfBirth || '15 May 2003' },
    { icon: User, label: 'Gender', value: profile.gender || 'Male' },
    { icon: Phone, label: 'Mobile Number', value: profile.mobile },
    { icon: Mail, label: 'Email Address', value: profile.email },
  ];

  const medicalItems = [
    { icon: Droplet, label: 'Blood Group', value: profile.bloodGroup || 'O+' },
    { icon: AlertCircle, label: 'Known Allergies', value: profile.allergies || 'None' },
    { icon: Activity, label: 'Chronic Conditions', value: profile.existingConditions || 'None' },
  ];

  const emergencyItems = [
    { icon: ShieldAlert, label: 'Primary Contact', value: 'Suresh Agrawal (Father)' },
    { icon: Phone, label: 'Emergency Phone', value: '+91 98111 22334' },
  ];

  return (
    <PatientLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full space-y-6 pb-6"
      >
        {/* Header (Screen 17) */}
        <TopHeader
          title="Patient Profile"
          subtitle="Health credentials & account preferences"
          showBack={true}
          backTo="/dashboard"
          rightElement={
            <OutlineButton
              size="sm"
              onClick={handleOpenEdit}
              className="gap-1.5"
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </OutlineButton>
          }
          className="px-1"
        />

        {apiNotice && (
          <ErrorAlert
            title="Profile Status"
            message={apiNotice}
            onDismiss={() => setApiNotice(null)}
          />
        )}

        {/* Patient Hero Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-blue-100 flex-shrink-0 border-4 border-white shadow-sm flex items-center justify-center">
            <PatientAvatarIcon className="w-full h-full" />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl font-bold text-medisetu-navy">
                {profile.name}
              </h1>
              <StatusBadge status="Verified Patient" variant="success" size="sm" />
            </div>

            <p className="text-xs sm:text-sm font-semibold text-medisetu-primary">
              ID: {profile.id || 'MS-20481'}
            </p>

            <p className="text-xs text-medisetu-muted pt-1">
              {profile.email} · {profile.mobile}
            </p>
          </div>
        </div>

        {/* Personal Details (Screen 17) */}
        <InfoCard
          title="Personal & Contact Information"
          items={personalInfoItems}
        />

        {/* Medical & Clinical Details (Screen 17) */}
        <InfoCard
          title="Medical & Health Details"
          items={medicalItems}
        />

        {/* Emergency Contacts */}
        <InfoCard
          title="Emergency Contact"
          items={emergencyItems}
        />

        {/* Logout Section */}
        <div className="pt-2">
          <DangerButton
            fullWidth
            size="lg"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out of MediSetu
          </DangerButton>
        </div>

        {/* Edit Profile Modal */}
        <AnimatePresence>
          {showEditModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-base sm:text-lg font-bold text-medisetu-navy">
                    Edit Profile Details
                  </h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {savedSuccess ? (
                  <div className="py-8 text-center space-y-2">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                    <h4 className="text-base font-bold text-medisetu-navy">Profile Updated!</h4>
                    <p className="text-xs text-medisetu-muted">Changes have been saved successfully.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-medisetu-navy">Full Name</label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-medisetu-navy">Mobile Number</label>
                      <input
                        type="text"
                        required
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-medisetu-navy">Blood Group</label>
                      <select
                        value={editBloodGroup}
                        onChange={(e) => setEditBloodGroup(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>

                    <PrimaryButton fullWidth type="submit">
                      Save Changes
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

export default PatientProfileScreen;
