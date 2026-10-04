import React from 'react';

/**
 * Doctor Avatar Hero Illustration with Floating Bubbles
 * Visual Reference: Registration Left Panel (Screen 5)
 */
export const DoctorHeroIllustration = ({ className = 'w-56 h-56 sm:w-64 sm:h-64' }) => {
  return (
    <svg
      viewBox="0 0 300 300"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Soft Glow */}
      <circle cx="150" cy="160" r="110" fill="#EBF4FF" />

      {/* Floating Medical Bubble Left: Medical Cross */}
      <g filter="url(#bubbleShadow1)">
        <circle cx="65" cy="180" r="18" fill="#1877F2" />
        <path d="M62 173H68V187H62V173Z" fill="white" />
        <path d="M58 177H72V183H58V177Z" fill="white" />
      </g>

      {/* Floating Medical Bubble Right: Heartbeat / Pulse */}
      <g filter="url(#bubbleShadow2)">
        <circle cx="240" cy="185" r="18" fill="#1877F2" />
        <path
          d="M230 185H235L237 179L241 191L243 182L245 185H250"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <circle cx="250" cy="225" r="8" fill="#38BDF8" />

      {/* Doctor Figure */}
      {/* Hair */}
      <path
        d="M125 105C125 75 175 75 175 105C185 130 180 160 178 170H122C120 160 115 130 125 105Z"
        fill="#1E293B"
      />

      {/* Head */}
      <rect x="140" y="130" width="20" height="24" rx="5" fill="#FED7AA" />
      <circle cx="150" cy="115" r="28" fill="#FFEDD5" />

      {/* Face */}
      <circle cx="142" cy="116" r="2.5" fill="#1E293B" />
      <circle cx="158" cy="116" r="2.5" fill="#1E293B" />
      <ellipse cx="136" cy="122" rx="3.5" ry="2" fill="#FDA4AF" />
      <ellipse cx="164" cy="122" rx="3.5" ry="2" fill="#FDA4AF" />
      <path
        d="M145 125C147 128 153 128 155 125"
        stroke="#1E293B"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Lab Coat / Torso */}
      <path
        d="M105 190C105 155 125 150 150 150C175 150 195 155 195 190V230H105V190Z"
        fill="white"
        stroke="#E2E8F0"
        strokeWidth="3"
      />

      {/* Inner V-Neck Tie / Blue Collar */}
      <path d="M142 150L150 168L158 150H142Z" fill="#1877F2" />

      {/* Stethoscope */}
      <path
        d="M136 155C132 175 140 195 145 195"
        stroke="#0F172A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M164 155C168 175 160 195 155 195"
        stroke="#0F172A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="150" cy="196" r="3.5" fill="#0F172A" />

      {/* Hands Folded */}
      <ellipse cx="150" cy="205" rx="16" ry="8" fill="#FED7AA" />

      <defs>
        <filter id="bubbleShadow1" x="40" y="158" width="50" height="50" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#1877F2" floodOpacity="0.25" />
        </filter>
        <filter id="bubbleShadow2" x="215" y="163" width="50" height="50" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#1877F2" floodOpacity="0.25" />
        </filter>
      </defs>
    </svg>
  );
};

export default DoctorHeroIllustration;
