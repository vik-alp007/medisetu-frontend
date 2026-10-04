import React from 'react';

/**
 * Doctor with Clipboard & Shield Illustration
 * Visual Reference: Onboarding Slide 1 (Screen 2)
 */
export const DoctorIllustration = ({ className = 'w-64 h-64 sm:w-80 sm:h-80' }) => {
  return (
    <svg
      viewBox="0 0 360 360"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Soft Blobs */}
      <circle cx="180" cy="180" r="140" fill="#E8F3FF" />
      <circle cx="270" cy="110" r="16" fill="#38BDF8" fillOpacity="0.4" />
      <circle cx="90" cy="230" r="10" fill="#38BDF8" fillOpacity="0.3" />
      <circle cx="100" cy="170" r="14" fill="#00A896" fillOpacity="0.7" />
      <circle cx="95" cy="190" r="12" fill="#00A896" fillOpacity="0.9" />

      {/* Protective Medical Shield Badge */}
      <g filter="url(#shieldShadow)">
        <path
          d="M260 110C260 110 278 116 295 116C295 142 284 165 260 178C236 165 225 142 225 116C242 116 260 110 260 110Z"
          fill="#1877F2"
        />
        {/* Shield Cross */}
        <path
          d="M256 132H264V126H256V126H264V132H270V140H264V148H256V140H250V132H256Z"
          fill="white"
        />
      </g>

      {/* Doctor Body */}
      {/* Hair Behind */}
      <path
        d="M130 110C130 65 230 65 230 110C245 150 240 220 235 250H125C120 220 115 150 130 110Z"
        fill="#1E293B"
      />

      {/* Head / Neck */}
      <rect x="168" y="155" width="24" height="30" rx="6" fill="#FED7AA" />
      <circle cx="180" cy="130" r="38" fill="#FFEDD5" />

      {/* Face Features */}
      {/* Hair Bangs */}
      <path
        d="M148 115C160 95 200 95 212 115C200 110 185 115 180 120C175 115 160 110 148 115Z"
        fill="#1E293B"
      />
      {/* Eyes */}
      <circle cx="168" cy="132" r="3" fill="#1E293B" />
      <circle cx="192" cy="132" r="3" fill="#1E293B" />
      {/* Cheeks */}
      <ellipse cx="160" cy="140" rx="4" ry="2.5" fill="#FDA4AF" />
      <ellipse cx="200" cy="140" rx="4" ry="2.5" fill="#FDA4AF" />
      {/* Smile */}
      <path
        d="M174 144C177 148 183 148 186 144"
        stroke="#1E293B"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Lab Coat / Torso */}
      <path
        d="M125 240C125 190 145 180 180 180C215 180 235 190 235 240V270H125V240Z"
        fill="white"
        stroke="#E2E8F0"
        strokeWidth="3"
      />
      {/* Inner Scrub / Collar */}
      <path d="M170 180L180 200L190 180H170Z" fill="#0284C7" />

      {/* Stethoscope */}
      <path
        d="M160 185C155 215 165 245 170 245C175 245 172 230 172 230"
        stroke="#06B6D4"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M200 185C205 215 195 245 190 245"
        stroke="#06B6D4"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="170" cy="245" r="4.5" fill="#0891B2" />

      {/* Medical Clipboard */}
      <g transform="translate(170, 205) rotate(-5)">
        <rect width="46" height="65" rx="5" fill="#0F172A" />
        <rect x="5" y="10" width="36" height="50" rx="3" fill="#1E293B" />
        {/* Clip */}
        <rect x="15" y="-3" width="16" height="7" rx="2" fill="#94A3B8" />
        {/* Paper lines */}
        <line x1="10" y1="20" x2="35" y2="20" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="10" y1="28" x2="30" y2="28" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
        <line x1="10" y1="36" x2="25" y2="36" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Defs */}
      <defs>
        <filter id="shieldShadow" x="215" y="105" width="90" height="90" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#1877F2" floodOpacity="0.3" />
        </filter>
      </defs>
    </svg>
  );
};

export default DoctorIllustration;
