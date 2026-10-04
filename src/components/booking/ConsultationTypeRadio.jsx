import React from 'react';
import { Building2, Video } from 'lucide-react';
import RadioOptionCard from '../common/RadioOptionCard';

/**
 * Reusable ConsultationTypeRadio Component
 * Visual Reference: Consultation type group (Screens 11 & 12)
 */
export const ConsultationTypeRadio = ({
  selectedValue = 'in-person',
  onChange,
  className = '',
}) => {
  const options = [
    {
      id: 'consult-in-person',
      value: 'in-person',
      title: 'In-person',
      subtitle: 'At hospital',
      icon: Building2,
    },
    {
      id: 'consult-video',
      value: 'video',
      title: 'Video Consultation',
      subtitle: 'Online',
      icon: Video,
    },
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${className}`}>
      {options.map((opt) => (
        <RadioOptionCard
          key={opt.id}
          id={opt.id}
          name="consultationType"
          value={opt.value}
          selectedValue={selectedValue}
          onChange={onChange}
          title={opt.title}
          subtitle={opt.subtitle}
          icon={opt.icon}
        />
      ))}
    </div>
  );
};

export default ConsultationTypeRadio;
