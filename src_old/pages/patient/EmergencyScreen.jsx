import React from 'react';
import { motion } from 'framer-motion';
import { 
  PhoneCall, 
  Ambulance, 
  Building2, 
  Droplet, 
  AlertTriangle, 
  MapPin, 
  Clock
} from 'lucide-react';

import PatientLayout from '../../layouts/PatientLayout';
import TopHeader from '../../components/navigation/TopHeader';
import EmergencyCard from '../../components/cards/EmergencyCard';

export const EmergencyScreen = () => {
  const handleCall = (number) => {
    window.location.href = `tel:${number.replace(/\s+/g, '')}`;
  };

  return (
    <PatientLayout>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full space-y-6 pb-8"
      >
        {/* Header (Screen 15) */}
        <TopHeader
          title="Emergency Services"
          subtitle="24/7 Immediate medical dispatch & critical trauma hotlines"
          showBack={true}
          backTo="/dashboard"
          className="px-1"
        />

        {/* Hero SOS Emergency Banner */}
        <div className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden space-y-4">
          <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center animate-pulse">
              <PhoneCall className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-100">
                Critical Emergency SOS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Dial 102 / 112
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-red-50 max-w-lg leading-relaxed">
            In life-threatening situations (cardiac arrest, unconsciousness, severe trauma), tap below immediately for automated hospital geo-dispatch.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="tel:102"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-red-600 hover:bg-red-50 font-bold px-6 py-3.5 rounded-2xl shadow-md transition-all active:scale-95 text-sm"
            >
              <PhoneCall className="w-4 h-4" />
              Call Ambulance (102)
            </a>

            <a
              href="tel:+911204567890"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-red-800/60 hover:bg-red-800/80 text-white font-semibold px-6 py-3.5 rounded-2xl border border-red-400/40 transition-all active:scale-95 text-sm"
            >
              <Building2 className="w-4 h-4" />
              Casualty Desk (+91 120 456 7890)
            </a>
          </div>
        </div>

        {/* Emergency Services Cards (Figma Screen 15) */}
        <section className="space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-medisetu-navy px-1">
            Emergency Hotlines & Medical Support
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <EmergencyCard
              variant="service"
              title="Ambulance Service"
              subtitle="24/7 Fast response advanced ICU life support vehicles"
              icon={<Ambulance className="w-6 h-6" />}
              actionText="Call Ambulance (102)"
              actionType="danger"
              phoneNumber="102"
              onAction={() => handleCall('102')}
            />

            <EmergencyCard
              variant="service"
              title="Hospital Emergency Desk"
              subtitle="Direct trauma reception, ICU triage & casualty admission"
              icon={<Building2 className="w-6 h-6" />}
              actionText="Call Desk"
              actionType="primary"
              phoneNumber="+91 120 456 7890"
              onAction={() => handleCall('+91 120 456 7890')}
            />

            <EmergencyCard
              variant="service"
              title="Emergency Blood Bank"
              subtitle="Immediate availability of all blood groups & plasma units"
              icon={<Droplet className="w-6 h-6" />}
              actionText="Call Blood Bank"
              actionType="outline"
              phoneNumber="+91 11 2345 6789"
              onAction={() => handleCall('+91 11 2345 6789')}
            />

            <EmergencyCard
              variant="service"
              title="Poison & Chemical Control"
              subtitle="National toxicological guidance and antidote advisory"
              icon={<AlertTriangle className="w-6 h-6" />}
              actionText="Call Poison Helpline"
              actionType="outline"
              phoneNumber="+91 11 2658 9391"
              onAction={() => handleCall('+91 11 2658 9391')}
            />
          </div>
        </section>

        {/* Nearest Hospital ER Status */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-medisetu-navy">
              Nearest Partner Emergency Room
            </h3>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
              Open 24/7 · 0 Wait
            </span>
          </div>

          <div className="space-y-2 text-sm text-medisetu-slate">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-medisetu-primary flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-medisetu-navy block">Apollo Hospitals Central Trauma Center</strong>
                <p className="text-xs text-medisetu-muted">Sarita Vihar, Delhi Mathura Road, New Delhi 110076 (2.4 km away)</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-1 text-xs text-medisetu-muted">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Average Ambulance Arrival: ~8 to 12 minutes in your sector</span>
            </div>
          </div>
        </section>
      </motion.div>
    </PatientLayout>
  );
};

export default EmergencyScreen;
