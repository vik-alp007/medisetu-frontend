import React from 'react';

/**
 * Smartphone & Health Shield Illustration
 * Visual Reference: Onboarding Slide 3 (Screen 4)
 */
export const HealthChecklistIllustration = ({ className = 'w-64 h-64 sm:w-80 sm:h-80' }) => {
  return (
    <svg
      viewBox="0 0 360 360"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Soft Background Circle */}
      <circle cx="180" cy="180" r="140" fill="#E8F4FF" />
      <circle cx="85" cy="130" r="6" fill="#38BDF8" fillOpacity="0.5" />

      {/* Decorative Greenery Leaves */}
      <path
        d="M85 240C85 240 60 200 90 170C120 185 110 230 85 240Z"
        fill="#00A896"
      />
      <path
        d="M260 210C260 210 290 190 280 150C250 160 240 190 260 210Z"
        fill="#2DD4BF"
      />
      <path
        d="M275 160C275 160 300 140 290 110C265 120 260 145 275 160Z"
        fill="#14B8A6"
      />

      {/* Smartphone Frame (Back) */}
      <g filter="url(#phoneShadow)">
        {/* Phone Body */}
        <rect x="110" y="70" width="130" height="230" rx="26" fill="#0F172A" />
        {/* Phone Screen */}
        <rect x="116" y="76" width="118" height="218" rx="22" fill="#F8FAFC" />
        {/* Speaker / Notch */}
        <rect x="155" y="84" width="40" height="5" rx="2.5" fill="#CBD5E1" />

        {/* Screen Header - Mini MediSetu Brand */}
        <path
          d="M174 116C174 116 164 108 164 98C164 94 167 91 171 91C173 91 174 92 175 93C176 92 177 91 179 91C183 91 186 94 186 98C186 108 176 116 176 116H174Z"
          fill="#1877F2"
        />
        <path d="M172 101H178V99H172V101Z" fill="white" />
        <path d="M174 98V104H176V98H174Z" fill="white" />

        {/* Health Checklist Items */}
        {/* Item 1 */}
        <rect x="130" y="130" width="16" height="16" rx="4" fill="#00A896" />
        <path d="M134 138L137 141L143 135" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="154" y1="138" x2="215" y2="138" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />

        {/* Item 2 */}
        <rect x="130" y="156" width="16" height="16" rx="4" fill="#00A896" />
        <path d="M134 164L137 167L143 161" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="154" y1="164" x2="205" y2="164" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />

        {/* Item 3 */}
        <rect x="130" y="182" width="16" height="16" rx="4" fill="#00A896" />
        <path d="M134 190L137 193L143 187" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="154" y1="190" x2="218" y2="190" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />

        {/* Item 4 */}
        <rect x="130" y="208" width="16" height="16" rx="4" fill="#00A896" />
        <path d="M134 216L137 219L143 213" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="154" y1="216" x2="195" y2="216" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Foreground Medical Shield with Cross */}
      <g filter="url(#shieldShadow2)">
        <path
          d="M200 175C200 175 220 182 240 182C240 215 225 242 200 258C175 242 160 215 160 182C180 182 200 175 200 175Z"
          fill="#0284C7"
        />
        <path
          d="M195 200H205V192H195V200ZM195 200V208H205V200H214V210H205V220H195V210H186V200H195Z"
          fill="white"
        />
      </g>

      <defs>
        <filter id="phoneShadow" x="95" y="60" width="160" height="260" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#0F172A" floodOpacity="0.15" />
        </filter>
        <filter id="shieldShadow2" x="145" y="165" width="110" height="115" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0284C7" floodOpacity="0.3" />
        </filter>
      </defs>
    </svg>
  );
};

export default HealthChecklistIllustration;
