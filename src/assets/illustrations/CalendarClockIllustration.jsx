import React from 'react';

/**
 * Calendar & Clock Illustration
 * Visual Reference: Onboarding Slide 2 (Screen 3)
 */
export const CalendarClockIllustration = ({ className = 'w-64 h-64 sm:w-80 sm:h-80' }) => {
  return (
    <svg
      viewBox="0 0 360 360"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Soft Blobs & Leaves */}
      <circle cx="180" cy="180" r="140" fill="#EBF4FF" />
      <circle cx="90" cy="120" r="8" fill="#38BDF8" fillOpacity="0.4" />
      <circle cx="85" cy="245" r="12" fill="#00A896" fillOpacity="0.2" />

      {/* Decorative Mint Leaves */}
      <path
        d="M260 110C260 110 290 120 295 150C270 155 250 135 260 110Z"
        fill="#2DD4BF"
        fillOpacity="0.7"
      />
      <path
        d="M275 140C275 140 305 160 300 190C280 185 265 165 275 140Z"
        fill="#14B8A6"
        fillOpacity="0.8"
      />

      {/* Calendar Card (Back) */}
      <g filter="url(#calShadow)">
        <rect x="90" y="80" width="160" height="175" rx="20" fill="white" />
        {/* Calendar Header */}
        <path d="M90 100C90 88.9543 98.9543 80 110 80H230C241.046 80 250 88.9543 250 100V115H90V100Z" fill="#1877F2" />
        {/* Calendar Rings */}
        <rect x="118" y="70" width="10" height="18" rx="5" fill="#0F172A" />
        <rect x="165" y="70" width="10" height="18" rx="5" fill="#0F172A" />
        <rect x="212" y="70" width="10" height="18" rx="5" fill="#0F172A" />

        {/* Calendar Month Grid Dots / Boxes */}
        <rect x="108" y="130" width="18" height="16" rx="4" fill="#F1F5F9" />
        <rect x="136" y="130" width="18" height="16" rx="4" fill="#F1F5F9" />
        <rect x="164" y="130" width="18" height="16" rx="4" fill="#F1F5F9" />
        <rect x="192" y="130" width="18" height="16" rx="4" fill="#F1F5F9" />

        <rect x="108" y="156" width="18" height="16" rx="4" fill="#F1F5F9" />
        <rect x="136" y="156" width="18" height="16" rx="4" fill="#F1F5F9" />
        <rect x="164" y="156" width="18" height="16" rx="4" fill="#F1F5F9" />
        <rect x="192" y="156" width="18" height="16" rx="4" fill="#F1F5F9" />

        <rect x="108" y="182" width="18" height="16" rx="4" fill="#F1F5F9" />
        {/* Highlighted Selected Date in Blue */}
        <rect x="136" y="182" width="18" height="16" rx="4" fill="#1877F2" />
        <rect x="164" y="182" width="18" height="16" rx="4" fill="#F1F5F9" />
        <rect x="192" y="182" width="18" height="16" rx="4" fill="#F1F5F9" />
      </g>

      {/* Analog Clock (Foreground Right) */}
      <g filter="url(#clockShadow)">
        {/* Outer Clock Blue Ring */}
        <circle cx="215" cy="215" r="55" fill="white" stroke="#1877F2" strokeWidth="12" />

        {/* Small Checkmark Badge on Clock Edge */}
        <circle cx="178" cy="178" r="14" fill="#1877F2" />
        <path d="M172 178L176 182L184 174" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Clock Ticks */}
        <circle cx="215" cy="174" r="2" fill="#0F172A" />
        <circle cx="215" cy="256" r="2" fill="#0F172A" />
        <circle cx="174" cy="215" r="2" fill="#0F172A" />
        <circle cx="256" cy="215" r="2" fill="#0F172A" />

        {/* Clock Hands */}
        <line x1="215" y1="215" x2="215" y2="185" stroke="#0F172A" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="215" y1="215" x2="238" y2="198" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
        {/* Center Pin */}
        <circle cx="215" cy="215" r="4" fill="#0F172A" />
      </g>

      <defs>
        <filter id="calShadow" x="75" y="70" width="190" height="205" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#1877F2" floodOpacity="0.12" />
        </filter>
        <filter id="clockShadow" x="145" y="145" width="140" height="140" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#1877F2" floodOpacity="0.25" />
        </filter>
      </defs>
    </svg>
  );
};

export default CalendarClockIllustration;
