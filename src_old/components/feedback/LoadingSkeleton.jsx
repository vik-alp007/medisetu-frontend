import React from 'react';

/**
 * Reusable LoadingSkeleton Component
 * For loading states in lists, doctor cards, and record rows
 */
export const LoadingSkeleton = ({
  variant = 'card', // 'card' | 'row' | 'text' | 'avatar'
  count = 1,
  className = '',
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'avatar':
        return <div className="w-12 h-12 rounded-full bg-slate-200 animate-pulse" />;

      case 'row':
        return (
          <div className="w-full bg-white rounded-2xl border border-slate-100 p-4 flex items-center justify-between gap-4 animate-pulse">
            <div className="flex items-center gap-3 w-3/4">
              <div className="w-10 h-10 rounded-xl bg-slate-200 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="h-3 bg-slate-100 rounded w-1/3" />
              </div>
            </div>
            <div className="w-16 h-8 bg-slate-200 rounded-xl" />
          </div>
        );

      case 'text':
        return (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-4/5" />
          </div>
        );

      case 'card':
      default:
        return (
          <div className="w-full bg-white rounded-3xl border border-slate-100 p-5 space-y-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-slate-200 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-3 bg-slate-100 rounded w-1/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`space-y-3 w-full ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>{renderSkeleton()}</React.Fragment>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
