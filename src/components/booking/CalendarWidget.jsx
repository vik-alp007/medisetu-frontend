import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Reusable CalendarWidget Component
 * Visual Reference: Appointment booking calendar (Screen 11)
 */
export const CalendarWidget = ({
  selectedDate = 28,
  selectedMonth = 'September',
  selectedYear = 2026,
  onSelectDate,
  className = '',
}) => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(8); // September (0-indexed)
  const [currentYear, setCurrentYear] = useState(selectedYear);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonthIndex((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonthIndex((m) => m + 1);
    }
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Static calendar grid matching the Figma screen (September 2026)
  // Sep 1, 2026 starts on Tuesday (index 2)
  const calendarCells = [
    { day: 27, isCurrentMonth: false },
    { day: 28, isCurrentMonth: false },
    { day: 29, isCurrentMonth: false },
    { day: 30, isCurrentMonth: false },
    { day: 31, isCurrentMonth: false },
    { day: 1, isCurrentMonth: true },
    { day: 2, isCurrentMonth: true },
    { day: 3, isCurrentMonth: true },
    { day: 4, isCurrentMonth: true },
    { day: 5, isCurrentMonth: true },
    { day: 6, isCurrentMonth: true },
    { day: 7, isCurrentMonth: true },
    { day: 8, isCurrentMonth: true },
    { day: 9, isCurrentMonth: true },
    { day: 10, isCurrentMonth: true },
    { day: 11, isCurrentMonth: true },
    { day: 12, isCurrentMonth: true },
    { day: 13, isCurrentMonth: true },
    { day: 14, isCurrentMonth: true },
    { day: 15, isCurrentMonth: true },
    { day: 16, isCurrentMonth: true },
    { day: 17, isCurrentMonth: true },
    { day: 18, isCurrentMonth: true },
    { day: 19, isCurrentMonth: true },
    { day: 20, isCurrentMonth: true },
    { day: 21, isCurrentMonth: true },
    { day: 22, isCurrentMonth: true },
    { day: 23, isCurrentMonth: true },
    { day: 24, isCurrentMonth: true },
    { day: 25, isCurrentMonth: true },
    { day: 26, isCurrentMonth: true },
    { day: 27, isCurrentMonth: true },
    { day: 28, isCurrentMonth: true }, // Default selected in Figma
    { day: 29, isCurrentMonth: true },
    { day: 30, isCurrentMonth: true },
  ];

  return (
    <div
      className={`bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs ${className}`}
    >
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          aria-label="Previous month"
          className="p-1 rounded-lg text-slate-400 hover:text-medisetu-navy dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="text-sm sm:text-base font-bold text-medisetu-navy dark:text-white">
          {months[currentMonthIndex]} {currentYear}
        </span>

        <button
          type="button"
          onClick={handleNextMonth}
          aria-label="Next month"
          className="p-1 rounded-lg text-slate-400 hover:text-medisetu-navy dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {daysOfWeek.map((day) => (
          <span key={day} className="text-xs font-semibold text-slate-400 dark:text-slate-500 py-1">
            {day}
          </span>
        ))}
      </div>

      {/* Day Cells */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {calendarCells.map((cell, idx) => {
          const isSelected = cell.isCurrentMonth && cell.day === selectedDate;

          return (
            <button
              key={idx}
              type="button"
              disabled={!cell.isCurrentMonth}
              onClick={() => cell.isCurrentMonth && onSelectDate && onSelectDate(cell.day)}
              className={`w-8 h-8 sm:w-9 sm:h-9 mx-auto rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-150 ${
                isSelected
                  ? 'bg-medisetu-primary text-white font-bold shadow-xs'
                  : cell.isCurrentMonth
                  ? 'text-medisetu-navy dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-medisetu-primary dark:hover:text-blue-400'
                  : 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
              }`}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarWidget;
