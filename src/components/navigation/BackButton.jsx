import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Reusable Back Button
 * Appears across sub-pages and headers (Screens 5, 8, 9, 10, 11, 13, 14, 15, 16, 17)
 */
export const BackButton = ({ onClick, to, className = '', label }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Go back"
      className={`inline-flex items-center gap-2 p-2 rounded-xl text-medisetu-navy dark:text-slate-200 hover:text-medisetu-primary dark:hover:text-blue-400 hover:bg-blue-50/70 dark:hover:bg-slate-800 transition-all duration-150 active:scale-95 ${className}`}
    >
      <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
      {label && <span className="text-sm font-semibold">{label}</span>}
    </button>
  );
};

export default BackButton;
