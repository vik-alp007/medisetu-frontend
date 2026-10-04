import React from 'react';

/**
 * MediSetu Brand Logo Component
 * Visual reference: Splash Screen (Screen 1) & Header/Auth Screens (Screens 5, 6, 7)
 */
export const MediSetuLogo = ({ size = 'md', showTagline = true, className = '' }) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const subtitleSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* MediSetu Heart + Shield + Cross Emblem */}
      <div className={`relative ${iconSizes[size]} flex-shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Blue Shield / Heart Base */}
          <path
            d="M50 92C50 92 14 70 14 36C14 22 25 12 38 12C44 12 48 15 50 18C52 15 56 12 62 12C75 12 86 22 86 36C86 70 50 92 50 92Z"
            fill="url(#heartGrad)"
          />
          {/* White Medical Cross */}
          <path
            d="M34 32H40V26C40 24.8954 40.8954 24 42 24H46C47.1046 24 48 24.8954 48 26V32H54C55.1046 32 56 32.8954 56 34V38C56 39.1046 55.1046 40 54 40H48V46C48 47.1046 47.1046 48 46 48H42C40.8954 48 40 47.1046 40 46V40H34C32.8954 40 32 39.1046 32 38V34C32 32.8954 32.8954 32 34 32Z"
            fill="white"
          />
          {/* Dynamic Swoosh / Wave */}
          <path
            d="M48 90C68 76 84 56 84 40C84 58 64 78 48 90Z"
            fill="#38BDF8"
            opacity="0.85"
          />
          <defs>
            <linearGradient id="heartGrad" x1="14" y1="12" x2="86" y2="92" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563EB" />
              <stop offset="0.55" stopColor="#1877F2" />
              <stop offset="1" stopColor="#0284C7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <span className={`font-extrabold text-medisetu-navy tracking-tight leading-none ${titleSizes[size]}`}>
          Medi<span className="text-medisetu-cyan">Setu</span>
        </span>
        {showTagline && (
          <span className={`text-medisetu-muted font-medium mt-1 leading-tight ${subtitleSizes[size]}`}>
            One Platform. Complete Care.
          </span>
        )}
      </div>
    </div>
  );
};

export default MediSetuLogo;
