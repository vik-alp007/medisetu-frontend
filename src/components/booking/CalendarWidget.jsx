import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * @param isDateDisabled optional (Date) => boolean. Past dates are always disabled.
 */
export const CalendarWidget = ({
  selectedDate,
  selectedMonth,
  selectedYear,
  onSelectDate,
  isDateDisabled,
  className = '',
}) => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(() => {
    const idx = selectedMonth ? months.indexOf(selectedMonth) : -1;
    return idx >= 0 ? idx : new Date().getMonth();
  });
  const [currentYear, setCurrentYear] = useState(() => selectedYear || new Date().getFullYear());

  // Follow the parent's selection (e.g. when it changes programmatically).
  useEffect(() => {
    if (selectedMonth && months.includes(selectedMonth)) {
      setCurrentMonthIndex(months.indexOf(selectedMonth));
    }
    if (selectedYear) setCurrentYear(selectedYear);
  }, [selectedMonth, selectedYear]);

  const todayStart = useMemo(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
  }, []);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarCells = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonthIndex, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
    const previousMonthDays = new Date(currentYear, currentMonthIndex, 0).getDate();
    const cells = [];

    for (let i = firstDay - 1; i >= 0; i -= 1) {
      cells.push({ day: previousMonthDays - i, isCurrentMonth: false });
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({ day, isCurrentMonth: true });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ day: cells.length - firstDay - daysInMonth + 1, isCurrentMonth: false });
    }
    return cells;
  }, [currentMonthIndex, currentYear]);

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((year) => year - 1);
    } else {
      setCurrentMonthIndex((month) => month - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((year) => year + 1);
    } else {
      setCurrentMonthIndex((month) => month + 1);
    }
  };

  return (
    <div className={`bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={handlePrevMonth} aria-label="Previous month" className="p-1 rounded-lg text-slate-400 hover:text-medisetu-navy dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm sm:text-base font-bold text-medisetu-navy dark:text-white">
          {months[currentMonthIndex]} {currentYear}
        </span>
        <button type="button" onClick={handleNextMonth} aria-label="Next month" className="p-1 rounded-lg text-slate-400 hover:text-medisetu-navy dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {daysOfWeek.map((day) => <span key={day} className="text-xs font-semibold text-slate-400 dark:text-slate-500 py-1">{day}</span>)}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {calendarCells.map((cell, index) => {
          const cellDate = new Date(currentYear, currentMonthIndex, cell.day);
          const disabledByRule =
            cell.isCurrentMonth &&
            (cellDate < todayStart || (isDateDisabled ? isDateDisabled(cellDate) : false));
          const isSelected =
            cell.isCurrentMonth &&
            cell.day === selectedDate &&
            currentMonthIndex === months.indexOf(selectedMonth) &&
            currentYear === selectedYear;
          return (
            <button
              key={`${currentYear}-${currentMonthIndex}-${index}`}
              type="button"
              disabled={!cell.isCurrentMonth || disabledByRule}
              aria-pressed={isSelected}
              onClick={() => cell.isCurrentMonth && !disabledByRule && onSelectDate?.(cell.day, months[currentMonthIndex], currentYear)}
              className={`w-8 h-8 sm:w-9 sm:h-9 mx-auto rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-all duration-150 ${
                isSelected
                  ? 'bg-medisetu-primary text-white font-bold shadow-xs'
                  : cell.isCurrentMonth && disabledByRule
                    ? 'text-slate-300 dark:text-slate-600 line-through cursor-not-allowed'
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
