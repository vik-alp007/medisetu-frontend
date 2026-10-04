import React from 'react';

/**
 * Reusable PastelActionCard Component
 * Visual Reference: Dashboard Quick Actions & Recommended Specialists (Screen 8)
 */
export const PastelActionCard = ({
  title,
  subtitle,
  icon: Icon,
  color = 'blue', // 'blue' | 'pink' | 'cyan' | 'green' | 'peach'
  onClick,
  className = '',
}) => {
  const colorStyles = {
    blue: {
      card: 'bg-blue-50/70 hover:bg-blue-50 border-blue-100',
      iconBox: 'text-medisetu-primary',
      title: 'text-medisetu-navy',
      sub: 'text-medisetu-muted',
    },
    pink: {
      card: 'bg-pink-50/70 hover:bg-pink-50 border-pink-100',
      iconBox: 'text-pink-600',
      title: 'text-medisetu-navy',
      sub: 'text-medisetu-muted',
    },
    cyan: {
      card: 'bg-cyan-50/70 hover:bg-cyan-50 border-cyan-100',
      iconBox: 'text-cyan-700',
      title: 'text-medisetu-navy',
      sub: 'text-medisetu-muted',
    },
    green: {
      card: 'bg-emerald-50/70 hover:bg-emerald-50 border-emerald-100',
      iconBox: 'text-emerald-700',
      title: 'text-medisetu-navy',
      sub: 'text-medisetu-muted',
    },
    peach: {
      card: 'bg-amber-50/70 hover:bg-amber-50 border-amber-100',
      iconBox: 'text-amber-700',
      title: 'text-medisetu-navy',
      sub: 'text-medisetu-muted',
    },
  };

  const scheme = colorStyles[color] || colorStyles.blue;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex flex-col items-center justify-center p-4 sm:p-5 rounded-3xl border transition-all duration-200 text-center active:scale-[0.98] ${
        scheme.card
      } ${className}`}
    >
      {Icon && (
        <div className={`mb-2.5 flex items-center justify-center ${scheme.iconBox}`}>
          {React.isValidElement(Icon) ? Icon : <Icon className="w-6 h-6" />}
        </div>
      )}

      <span className={`text-sm sm:text-base font-bold ${scheme.title} leading-tight`}>
        {title}
      </span>

      {subtitle && (
        <span className={`text-xs ${scheme.sub} mt-1 leading-tight`}>
          {subtitle}
        </span>
      )}
    </button>
  );
};

export default PastelActionCard;
