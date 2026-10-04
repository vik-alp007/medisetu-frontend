import React from 'react';
import {
  DoctorRahulAvatar,
  DoctorAnanyaAvatar,
  DoctorVikramAvatar,
  DoctorSnehaAvatar,
  PatientAvatarIcon,
} from '../assets/illustrations/DoctorAvatars';

/**
 * Returns the matching SVG doctor avatar component based on doctor ID or name.
 */
export const getDoctorAvatar = (doctorId, doctorName, className = 'w-full h-full') => {
  const idStr = String(doctorId || '');
  const nameStr = (doctorName || '').toLowerCase();

  if (idStr === '1' || nameStr.includes('rahul')) {
    return <DoctorRahulAvatar className={className} />;
  }
  if (idStr === '2' || nameStr.includes('ananya')) {
    return <DoctorAnanyaAvatar className={className} />;
  }
  if (idStr === '3' || nameStr.includes('vikram')) {
    return <DoctorVikramAvatar className={className} />;
  }
  if (idStr === '4' || nameStr.includes('sneha')) {
    return <DoctorSnehaAvatar className={className} />;
  }

  // Fallback to Rahul avatar
  return <DoctorRahulAvatar className={className} />;
};

export {
  PatientAvatarIcon,
  DoctorRahulAvatar,
  DoctorAnanyaAvatar,
  DoctorVikramAvatar,
  DoctorSnehaAvatar,
};
