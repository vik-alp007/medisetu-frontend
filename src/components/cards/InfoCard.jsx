import React from 'react';

/**
 * Reusable InfoCard Component
 * Visual Reference: Doctor Highlights & Contact (Screen 10), Patient Profile Info (Screen 17)
 */
export const InfoCard = ({
  title,
  action,
  children,
  items, // Optional array of { icon, label, value, subtext, onClick }
  className = '',
}) => {
  return (
    <div
      className={`bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-xs ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          {title && (
            <h3 className="text-base sm:text-lg font-bold text-medisetu-navy dark:text-white">
              {title}
            </h3>
          )}
          {action && <div>{action}</div>}
        </div>
      )}

      {children}

      {items && items.length > 0 && (
        <div className="space-y-3.5">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={item.onClick}
                className={`flex items-start justify-between gap-3 text-sm ${
                  item.onClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 p-2 rounded-xl transition-colors' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {Icon && (
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-medisetu-primary dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                      {React.isValidElement(Icon) ? Icon : <Icon className="w-4 h-4" />}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-medium text-medisetu-slate dark:text-slate-300">{item.label}</span>
                    {item.subtext && (
                      <span className="text-xs text-medisetu-muted dark:text-slate-400">{item.subtext}</span>
                    )}
                  </div>
                </div>

                {item.value && (
                  <span className="font-semibold text-medisetu-navy dark:text-white text-right">
                    {item.value}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InfoCard;
