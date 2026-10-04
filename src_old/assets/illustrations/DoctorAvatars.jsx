import React from 'react';

/**
 * Doctor & Patient Avatars (SVG High-Fidelity Match)
 * Visual Reference: Doctor Cards (Screen 9), Doctor Profile (Screen 10), Dashboard Header (Screen 8)
 */

export const PatientAvatarIcon = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#E0F2FE" />
    {/* Hair */}
    <path d="M28 42C28 26 72 26 72 42C76 56 70 70 70 70H30C30 70 24 56 28 42Z" fill="#1E293B" />
    {/* Neck */}
    <rect x="44" y="58" width="12" height="15" rx="3" fill="#FED7AA" />
    {/* Face */}
    <circle cx="50" cy="46" r="20" fill="#FFEDD5" />
    <circle cx="44" cy="46" r="2" fill="#1E293B" />
    <circle cx="56" cy="46" r="2" fill="#1E293B" />
    <path d="M47 52C48.5 54 51.5 54 53 52" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
    {/* Suit / Collar */}
    <path d="M24 88C24 72 36 68 50 68C64 68 76 72 76 88V100H24V88Z" fill="#1877F2" />
    <path d="M44 68L50 80L56 68H44Z" fill="white" />
    <path d="M48 76L50 82L52 76H48Z" fill="#0284C7" />
  </svg>
);

export const DoctorRahulAvatar = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#DBEAFE" />
    {/* Hair */}
    <path d="M30 40C30 24 70 24 70 40C74 54 68 66 68 66H32C32 66 26 54 30 40Z" fill="#0F172A" />
    {/* Neck */}
    <rect x="44" y="54" width="12" height="16" rx="3" fill="#FED7AA" />
    {/* Face */}
    <circle cx="50" cy="44" r="19" fill="#FFEDD5" />
    <circle cx="44" cy="43" r="2" fill="#1E293B" />
    <circle cx="56" cy="43" r="2" fill="#1E293B" />
    <ellipse cx="39" cy="48" rx="2.5" ry="1.5" fill="#FDA4AF" />
    <ellipse cx="61" cy="48" rx="2.5" ry="1.5" fill="#FDA4AF" />
    <path d="M46 50C48 53 52 53 54 50" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" />
    {/* Coat */}
    <path d="M20 86C20 68 34 65 50 65C66 65 80 68 80 86V100H20V86Z" fill="white" stroke="#E2E8F0" strokeWidth="2" />
    {/* Stethoscope */}
    <path d="M42 66C38 78 44 90 46 90" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M58 66C62 78 56 90 54 90" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="50" cy="91" r="3" fill="#0891B2" />
    <path d="M46 65L50 74L54 65H46Z" fill="#1877F2" />
  </svg>
);

export const DoctorAnanyaAvatar = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#FCE7F3" />
    {/* Long Hair */}
    <path d="M26 42C26 22 74 22 74 42C78 60 76 80 72 88H28C24 80 22 60 26 42Z" fill="#1E293B" />
    {/* Face */}
    <circle cx="50" cy="44" r="18" fill="#FFEDD5" />
    {/* Bangs */}
    <path d="M34 38C40 32 60 32 66 38C60 35 40 35 34 38Z" fill="#1E293B" />
    <circle cx="44" cy="43" r="2" fill="#1E293B" />
    <circle cx="56" cy="43" r="2" fill="#1E293B" />
    <path d="M46 50C48 53 52 53 54 50" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" />
    {/* Lab Coat */}
    <path d="M22 86C22 68 35 65 50 65C65 65 78 68 78 86V100H22V86Z" fill="white" stroke="#E2E8F0" strokeWidth="2" />
    <path d="M44 65L50 75L56 65H44Z" fill="#0284C7" />
    <path d="M40 68C38 78 44 88 47 88" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
    <path d="M60 68C62 78 56 88 53 88" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const DoctorVikramAvatar = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#E0E7FF" />
    {/* Hair (Slightly grey/senior) */}
    <path d="M30 40C30 24 70 24 70 40C72 52 68 64 68 64H32C32 64 28 52 30 40Z" fill="#475569" />
    <circle cx="50" cy="45" r="19" fill="#FED7AA" />
    <circle cx="43" cy="44" r="2" fill="#1E293B" />
    <circle cx="57" cy="44" r="2" fill="#1E293B" />
    {/* Glasses */}
    <rect x="38" y="40" width="10" height="8" rx="2" fill="none" stroke="#1E293B" strokeWidth="1.5" />
    <rect x="52" y="40" width="10" height="8" rx="2" fill="none" stroke="#1E293B" strokeWidth="1.5" />
    <line x1="48" y1="44" x2="52" y2="44" stroke="#1E293B" strokeWidth="1.5" />
    <path d="M46 52C48 54 52 54 54 52" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
    {/* Suit / Tie */}
    <path d="M22 86C22 68 35 65 50 65C65 65 78 68 78 86V100H22V86Z" fill="#0F172A" />
    <path d="M44 65L50 78L56 65H44Z" fill="white" />
    <path d="M48 72L50 85L52 72H48Z" fill="#DC2626" />
  </svg>
);

export const DoctorSnehaAvatar = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#FEF3C7" />
    {/* Dark Wavy Hair */}
    <path d="M26 40C26 22 74 22 74 40C78 60 76 80 72 88H28C24 80 22 60 26 40Z" fill="#18181B" />
    <circle cx="50" cy="44" r="18" fill="#FFEDD5" />
    <circle cx="44" cy="43" r="2" fill="#1E293B" />
    <circle cx="56" cy="43" r="2" fill="#1E293B" />
    <path d="M46 50C48 53 52 53 54 50" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" />
    {/* Coat */}
    <path d="M22 86C22 68 35 65 50 65C65 65 78 68 78 86V100H22V86Z" fill="white" stroke="#E2E8F0" strokeWidth="2" />
    <path d="M44 65L50 76L56 65H44Z" fill="#10B981" />
  </svg>
);

/**
 * Doctor Clinic Office Banner Image (Figma Screen 10 Match)
 */
export const DoctorClinicBanner = ({ className = 'w-full h-44 sm:h-52 rounded-2xl overflow-hidden' }) => (
  <svg viewBox="0 0 600 240" className={className} preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Clinic Room Backdrop */}
    <rect width="600" height="240" fill="#F1F5F9" />
    {/* Window with City / Trees View */}
    <rect x="40" y="30" width="140" height="120" rx="6" fill="#E0F2FE" stroke="#CBD5E1" strokeWidth="4" />
    <line x1="110" y1="30" x2="110" y2="150" stroke="#CBD5E1" strokeWidth="4" />
    <line x1="40" y1="90" x2="180" y2="90" stroke="#CBD5E1" strokeWidth="4" />
    <circle cx="85" cy="115" r="20" fill="#93C5FD" opacity="0.6" />
    <circle cx="140" cy="120" r="15" fill="#38BDF8" opacity="0.5" />

    {/* Medical Certificates / Diplomas on Wall */}
    <rect x="480" y="40" width="50" height="40" rx="3" fill="white" stroke="#94A3B8" strokeWidth="2" />
    <rect x="488" y="48" width="34" height="2" fill="#CBD5E1" />
    <rect x="488" y="54" width="28" height="2" fill="#CBD5E1" />
    <circle cx="505" cy="68" r="4" fill="#F59E0B" />

    <rect x="480" y="90" width="50" height="40" rx="3" fill="white" stroke="#94A3B8" strokeWidth="2" />
    <rect x="488" y="98" width="34" height="2" fill="#CBD5E1" />
    <rect x="488" y="104" width="24" height="2" fill="#CBD5E1" />

    {/* Consultation Desk */}
    <path d="M0 160H600V240H0V160Z" fill="#C29B77" />
    <path d="M0 160H600V170H0V160Z" fill="#A87E58" />

    {/* Doctor Figure Sitting at Desk */}
    {/* Body / Coat */}
    <path d="M220 240V140C220 115 250 110 300 110C350 110 380 115 380 240H220Z" fill="white" stroke="#CBD5E1" strokeWidth="3" />
    <path d="M285 110L300 145L315 110H285Z" fill="#1877F2" />
    {/* Stethoscope */}
    <path d="M275 120C265 150 280 190 290 190" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
    <path d="M325 120C335 150 320 190 310 190" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
    <circle cx="300" cy="192" r="6" fill="#0F172A" />

    {/* Head / Face */}
    <circle cx="300" cy="80" r="30" fill="#FFEDD5" />
    {/* Dark Professional Hair */}
    <path d="M270 75C270 50 330 50 330 75C335 90 325 105 325 105H275C275 105 265 90 270 75Z" fill="#0F172A" />
    <circle cx="290" cy="80" r="2.5" fill="#1E293B" />
    <circle cx="310" cy="80" r="2.5" fill="#1E293B" />
    <path d="M294 92C298 96 302 96 306 92" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />

    {/* Nameplate on Desk */}
    <rect x="235" y="195" width="70" height="20" rx="3" fill="#1E293B" stroke="#DAA520" strokeWidth="1.5" />
    <rect x="245" y="202" width="50" height="2.5" rx="1" fill="#FEF08A" />
    <rect x="250" y="207" width="40" height="2" rx="1" fill="#CBD5E1" />

    {/* Laptop / Clipboard on Desk */}
    <rect x="330" y="185" width="60" height="35" rx="4" fill="#0F172A" />
    <rect x="335" y="190" width="50" height="25" rx="2" fill="#38BDF8" opacity="0.8" />
  </svg>
);
