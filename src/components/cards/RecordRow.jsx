import React from 'react';
import { FlaskConical, Image, Pill, Scan, FileText, Activity } from 'lucide-react';
import OutlineButton from '../common/OutlineButton';

/**
 * Reusable RecordRow Component
 * Visual Reference: Medical Records list items (Screen 13)
 */
export const RecordRow = ({
  id,
  type = 'lab', // 'lab' | 'xray' | 'rx' | 'mri' | 'visit' | 'ecg'
  title,
  date,
  onView,
  className = '',
}) => {
  // Category icon mapping matching Screen 13
  const getRecordIconConfig = (recType) => {
    switch (recType) {
      case 'lab':
        return {
          icon: FlaskConical,
          bg: 'bg-purple-50 text-purple-600',
        };
      case 'xray':
        return {
          icon: Image,
          bg: 'bg-blue-50 text-blue-600',
        };
      case 'rx':
        return {
          icon: Pill,
          bg: 'bg-emerald-50 text-emerald-600',
        };
      case 'mri':
        return {
          icon: Scan,
          bg: 'bg-rose-50 text-rose-600',
        };
      case 'visit':
        return {
          icon: FileText,
          bg: 'bg-sky-50 text-sky-600',
        };
      case 'ecg':
        return {
          icon: Activity,
          bg: 'bg-indigo-50 text-indigo-600',
        };
      default:
        return {
          icon: FileText,
          bg: 'bg-slate-50 text-slate-600',
        };
    }
  };

  const { icon: Icon, bg } = getRecordIconConfig(type);

  return (
    <div
      className={`w-full bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 flex items-center justify-between gap-4 hover:border-blue-200 transition-all duration-150 ${className}`}
    >
      <div className="flex items-center gap-3.5">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${bg}`}>
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex flex-col">
          <h4 className="text-sm sm:text-base font-bold text-medisetu-navy leading-tight">
            {title}
          </h4>
          <span className="text-xs text-medisetu-muted mt-0.5">{date}</span>
        </div>
      </div>

      <OutlineButton size="sm" onClick={() => onView && onView(id)}>
        View
      </OutlineButton>
    </div>
  );
};

export default RecordRow;
