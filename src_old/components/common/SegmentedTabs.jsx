import React from 'react';

/**
 * Reusable Segmented Tabs Component
 * Visual Reference:
 * - Role Switcher (Screens 5, 7): [Patient | Doctor | Admin]
 * - Prescription Tabs (Screen 14): [Active | Completed | All]
 * - Bills Tabs (Screen 16): [Outstanding | Paid | All]
 */
export const SegmentedTabs = ({
  tabs = [],
  activeTab,
  onChange,
  size = 'md',
  fullWidth = true,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'p-0.5 text-xs rounded-xl',
    md: 'p-1 text-sm rounded-2xl',
    lg: 'p-1.5 text-base rounded-2xl',
  };

  const buttonPadding = {
    sm: 'py-1.5 px-3',
    md: 'py-2 px-4',
    lg: 'py-2.5 px-5',
  };

  return (
    <div
      className={`bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700 inline-flex items-center ${
        fullWidth ? 'w-full' : ''
      } ${sizeStyles[size]} ${className}`}
      role="tablist"
    >
      {tabs.map((tab) => {
        const tabId = typeof tab === 'string' ? tab : tab.id;
        const tabLabel = typeof tab === 'string' ? tab : tab.label;
        const Icon = tab.icon;
        const isActive = activeTab === tabId;

        return (
          <button
            key={tabId}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tabId)}
            className={`flex-1 flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 ${
              buttonPadding[size]
            } ${
              isActive
                ? 'bg-medisetu-primary text-white font-semibold shadow-xs'
                : 'text-medisetu-muted dark:text-slate-400 hover:text-medisetu-navy dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
          >
            {Icon && (
              <span className={`transition-colors ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                {React.isValidElement(Icon) ? Icon : <Icon className="w-4 h-4" />}
              </span>
            )}
            <span>{tabLabel}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SegmentedTabs;
