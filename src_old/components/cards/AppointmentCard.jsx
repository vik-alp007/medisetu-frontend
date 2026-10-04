import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';

/**
 * Reusable AppointmentCard Component
 * Visual Reference: Dashboard Upcoming Appointment (Screen 8) & Booking summaries
 */
export const AppointmentCard = ({
  doctorName,
  specialty,
  timing = 'Today - 4:30 PM',
  date,
  time,
  consultationType,
  avatar,
  avatarUrl,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`w-full bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xs hover:border-blue-200 dark:hover:border-blue-700/60 hover:shadow-card transition-all duration-200 cursor-pointer active:scale-[0.99] ${className}`}
    >
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 border-2 border-white dark:border-slate-700 shadow-xs">
          {avatar ? (
            React.isValidElement(avatar) ? avatar : <img src={avatar} alt={doctorName} className="w-full h-full object-cover" />
          ) : avatarUrl ? (
            <img src={avatarUrl} alt={doctorName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-medisetu-primary font-bold text-sm">
              {doctorName?.replace('Dr. ', '').slice(0, 2) || 'DR'}
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <h4 className="text-sm sm:text-base font-bold text-medisetu-navy dark:text-white leading-tight">
            {doctorName}
          </h4>
          <span className="text-xs text-medisetu-muted dark:text-slate-400 mt-0.5">{specialty}</span>

          <div className="flex items-center gap-1.5 mt-1.5 text-xs font-medium text-medisetu-primary dark:text-blue-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{timing || `${date} - ${time}`}</span>
            {consultationType && (
              <span className="text-slate-400 dark:text-slate-500">· {consultationType}</span>
            )}
          </div>
        </div>
      </div>

      <div className="p-2 text-slate-400 dark:text-slate-500 group-hover:text-medisetu-primary">
        <ChevronRight className="w-5 h-5 stroke-[2.5]" />
      </div>
    </div>
  );
};

export default AppointmentCard;
