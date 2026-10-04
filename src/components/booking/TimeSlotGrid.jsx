import React from 'react';

/**
 * Reusable TimeSlotGrid Component
 * Visual Reference: Available time slots grid (Screen 10 & Screen 11)
 */
export const TimeSlotGrid = ({
  slots = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '04:30 PM', '05:00 PM'],
  selectedSlot = '11:00 AM',
  onSelectSlot,
  disabledSlots = [],
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 ${className}`}>
      {slots.map((slot) => {
        const isSelected = selectedSlot === slot;
        const isDisabled = disabledSlots.includes(slot);

        return (
          <button
            key={slot}
            type="button"
            disabled={isDisabled}
            onClick={() => onSelectSlot && onSelectSlot(slot)}
            className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-xl border transition-all duration-150 select-none text-center ${
              isSelected
                ? 'bg-medisetu-primary border-medisetu-primary text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-medisetu-slate dark:text-slate-200 hover:border-blue-300 dark:hover:border-blue-500 hover:text-medisetu-primary dark:hover:text-blue-400'
            } ${isDisabled ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-800/40' : 'active:scale-95'}`}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
};

export default TimeSlotGrid;
