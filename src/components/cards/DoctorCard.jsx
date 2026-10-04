import React from 'react';
import { Star, Clock, Phone } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

/**
 * Reusable DoctorCard Component
 * Visual Reference: Doctor search results (Screen 9) & booking previews
 */
export const DoctorCard = ({
  id,
  name,
  specialty,
  rating,
  reviewsCount,
  experience,
  consultationFee,
  avatar,
  avatarUrl,
  isTopRated = false,
  onSelect,
  onCall,
  className = '',
}) => {
  return (
    <div
      onClick={onSelect}
      className={`bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:shadow-card hover:border-blue-200 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer active:scale-[0.99] ${className}`}
    >
      {/* Left: Avatar & Doctor Info */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-blue-100 flex-shrink-0 border-2 border-white shadow-xs">
          {avatar ? (
            React.isValidElement(avatar) ? avatar : <img src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-medisetu-primary font-bold text-lg">
              {name?.replace('Dr. ', '').slice(0, 2) || 'DR'}
            </div>
          )}
        </div>

        {/* Doctor Meta */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-medisetu-navy leading-tight">
              {name}
            </h3>
            {isTopRated && <StatusBadge status="Top Rated" variant="success" size="sm" />}
          </div>

          <span className="text-xs sm:text-sm font-medium text-medisetu-muted mt-0.5">
            {specialty}
          </span>

          <div className="flex items-center gap-3 mt-1.5 text-xs text-medisetu-slate">
            {rating !== undefined && (
              <span className="flex items-center gap-1 font-semibold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                <span>{rating}</span>
                {reviewsCount && (
                  <span className="text-medisetu-muted font-normal">({reviewsCount} reviews)</span>
                )}
              </span>
            )}
            {experience && (
              <span className="flex items-center gap-1 text-medisetu-muted">
                <Clock className="w-3.5 h-3.5" />
                <span>{experience}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Phone CTA & Consultation Fee */}
      <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
        {onCall && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCall();
            }}
            aria-label={`Call ${name}`}
            className="w-10 h-10 rounded-full border border-blue-200 text-medisetu-primary flex items-center justify-center hover:bg-blue-50 transition-colors active:scale-95"
          >
            <Phone className="w-4 h-4" />
          </button>
        )}

        {consultationFee && (
          <div className="text-right">
            <span className="text-lg sm:text-xl font-bold text-medisetu-navy">
              ₹{consultationFee}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;
