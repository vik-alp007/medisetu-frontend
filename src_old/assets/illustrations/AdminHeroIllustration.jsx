import React from 'react';

/**
 * Admin at Desk with Laptop & Hospital Backdrop
 * Visual Reference: Admin Registration Landing (Screen 6)
 */
export const AdminHeroIllustration = ({ className = 'w-64 h-64 sm:w-80 sm:h-80' }) => {
  return (
    <svg
      viewBox="0 0 360 360"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Soft Circle */}
      <circle cx="180" cy="180" r="140" fill="#E8F4FF" />

      {/* Hospital Building (Far Left Backdrop) */}
      <g opacity="0.6">
        <rect x="50" y="160" width="60" height="90" rx="4" fill="#CBD5E1" />
        <rect x="60" y="170" width="8" height="8" rx="1" fill="#93C5FD" />
        <rect x="76" y="170" width="8" height="8" rx="1" fill="#93C5FD" />
        <rect x="92" y="170" width="8" height="8" rx="1" fill="#93C5FD" />
        <rect x="60" y="185" width="8" height="8" rx="1" fill="#93C5FD" />
        <rect x="76" y="185" width="8" height="8" rx="1" fill="#93C5FD" />
        <rect x="92" y="185" width="8" height="8" rx="1" fill="#93C5FD" />
        {/* Hospital Cross on top */}
        <circle cx="80" cy="150" r="10" fill="#38BDF8" />
        <path d="M78 145H82V155H78V145Z" fill="white" />
        <path d="M75 148H85V152H75V148Z" fill="white" />
      </g>

      {/* Admin Analytics / Screen Display (Center Backdrop) */}
      <g filter="url(#displayShadow)">
        <rect x="130" y="110" width="125" height="85" rx="8" fill="white" stroke="#E2E8F0" strokeWidth="2" />
        {/* Browser Top Dots */}
        <circle cx="140" cy="118" r="2" fill="#94A3B8" />
        <circle cx="146" cy="118" r="2" fill="#94A3B8" />
        <circle cx="152" cy="118" r="2" fill="#94A3B8" />
        {/* User Card Icon */}
        <circle cx="155" cy="140" r="10" fill="#1877F2" />
        {/* Graph / Analytics Bars */}
        <rect x="220" y="145" width="6" height="25" rx="2" fill="#38BDF8" />
        <rect x="230" y="135" width="6" height="35" rx="2" fill="#1877F2" />
        <rect x="240" y="152" width="6" height="18" rx="2" fill="#00A896" />
        {/* Lines */}
        <line x1="175" y1="135" x2="205" y2="135" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
        <line x1="175" y1="145" x2="200" y2="145" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
        <line x1="175" y1="155" x2="210" y2="155" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Desk */}
      <path d="M110 240H265V246H110V240Z" fill="#0284C7" />
      <rect x="180" y="246" width="8" height="40" fill="#0F172A" />

      {/* Potted Plant (Right of Desk) */}
      <path d="M260 220C260 200 275 190 275 220Z" fill="#38BDF8" />
      <path d="M275 220C275 195 290 190 285 220Z" fill="#0284C7" />
      <path d="M260 220H290L285 240H265L260 220Z" fill="#0F172A" />

      {/* Administrator Figure (Sitting on left looking at laptop) */}
      {/* Chair Back */}
      <rect x="85" y="200" width="30" height="50" rx="8" fill="#1E293B" />
      {/* Head */}
      <circle cx="120" cy="180" r="14" fill="#FFEDD5" />
      {/* Hair */}
      <path d="M108 178C108 168 126 168 132 176C128 178 124 175 118 175C114 175 110 177 108 178Z" fill="#1E293B" />
      {/* Torso / Shirt */}
      <path d="M105 210C105 195 115 192 125 192C135 192 145 195 145 210V250H105V210Z" fill="#E0F2FE" />
      {/* Arms on Desk / Laptop */}
      <path d="M125 215L150 232H165" stroke="#CBD5E1" strokeWidth="5" strokeLinecap="round" />

      {/* Laptop on Desk */}
      <path d="M145 235L155 215H175L170 235H145Z" fill="#0F172A" />
      <rect x="142" y="235" width="35" height="3" rx="1.5" fill="#64748B" />

      <defs>
        <filter id="displayShadow" x="120" y="105" width="145" height="105" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#1877F2" floodOpacity="0.15" />
        </filter>
      </defs>
    </svg>
  );
};

export default AdminHeroIllustration;
