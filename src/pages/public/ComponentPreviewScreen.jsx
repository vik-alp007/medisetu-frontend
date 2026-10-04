import React, { useState } from 'react';
import {
  MediSetuLogo,
  PublicNavbar,
  BottomDock,
  TopHeader,
  PaginationDots,
  BackButton,
  InputField,
  PasswordInput,
  SelectDropdown,
  Checkbox,
  SegmentedTabs,
  FilterChip,
  RadioOptionCard,
  PrimaryButton,
  OutlineButton,
  DangerButton,
  IconButton,
  LinkButton,
  PastelActionCard,
  DoctorCard,
  RecordRow,
  MedicineItem,
  StatusBadge,
  InfoCard,
  EmergencyCard,
  AppointmentCard,
  PaymentCard,
  CalendarWidget,
  TimeSlotGrid,
  ConsultationTypeRadio,
  BookingStepper,
  LoadingSpinner,
  LoadingSkeleton,
  ErrorAlert,
  EmptyState,
  SuccessCheckmark,
  AlertBanner,
} from '../../components';
import { User, Mail, Phone, Calendar, Heart, Brain, Hand, Bell, Flame } from 'lucide-react';
import PatientLayout from '../../layouts/PatientLayout';

export const ComponentPreviewScreen = () => {
  const [roleTab, setRoleTab] = useState('patient');
  const [billTab, setBillTab] = useState('outstanding');
  const [dotIndex, setDotIndex] = useState(1);
  const [slot, setSlot] = useState('11:00 AM');
  const [date, setDate] = useState(28);
  const [consultType, setConsultType] = useState('in-person');
  const [agreed, setAgreed] = useState(true);

  return (
    <PatientLayout>
      <div className="space-y-10 py-6 max-w-5xl mx-auto">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-3xl font-extrabold text-medisetu-navy">
            Phase 2: Reusable Component Showcase
          </h1>
          <p className="text-sm text-medisetu-muted mt-1">
            Visual verification of all components matching the MediSetu Figma design system.
          </p>
        </div>

        {/* 2A: Brand & Navigation */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-medisetu-navy border-l-4 border-medisetu-primary pl-3">
            2A — Brand & Navigation
          </h2>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
            <div className="flex flex-wrap items-center gap-8">
              <MediSetuLogo size="sm" />
              <MediSetuLogo size="md" />
              <MediSetuLogo size="lg" />
            </div>
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <BackButton label="Back to Directory" />
              <PaginationDots total={3} current={dotIndex} onDotClick={setDotIndex} />
            </div>
          </div>
        </section>

        {/* 2B: Form Components */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-medisetu-navy border-l-4 border-medisetu-teal pl-3">
            2B — Form Components
          </h2>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-5">
            <SegmentedTabs
              tabs={[
                { id: 'patient', label: 'Patient', icon: User },
                { id: 'doctor', label: 'Doctor', icon: Heart },
                { id: 'admin', label: 'Admin', icon: Brain },
              ]}
              activeTab={roleTab}
              onChange={setRoleTab}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Full Name" placeholder="e.g. Vaibhav Agrawal" icon={User} />
              <InputField label="Mobile Number" placeholder="+91 98765 43210" icon={Phone} />
              <InputField label="Email Address" placeholder="vaibhav@gmail.com" icon={Mail} />
              <PasswordInput label="Password" placeholder="Enter password" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectDropdown
                label="Specialization"
                icon={Heart}
                options={['Cardiology', 'Neurology', 'Dermatology']}
                placeholder="Select Specialization"
              />
              <div className="flex items-center gap-2 pt-6">
                <FilterChip label="Specialty" isActive={true} />
                <FilterChip label="Availability" />
                <FilterChip label="Experience" />
              </div>
            </div>

            <Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)}>
              I agree to the <span className="text-medisetu-primary font-semibold">Terms & Conditions</span> and <span className="text-medisetu-primary font-semibold">Privacy Policy</span>
            </Checkbox>
          </div>
        </section>

        {/* 2C: Buttons */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-medisetu-navy border-l-4 border-medisetu-primary pl-3">
            2C — Buttons
          </h2>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-wrap items-center gap-4">
            <PrimaryButton>Primary Button</PrimaryButton>
            <PrimaryButton loading>Processing</PrimaryButton>
            <OutlineButton>View</OutlineButton>
            <OutlineButton variant="neutral">Edit Profile</OutlineButton>
            <DangerButton>📞 Call Now</DangerButton>
            <IconButton icon={Bell} aria-label="Notifications" badge />
            <LinkButton>View All →</LinkButton>
          </div>
        </section>

        {/* 2D: Cards & Badges */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-medisetu-navy border-l-4 border-amber-500 pl-3">
            2D — Cards & Badges
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <PastelActionCard title="Find Doctor" subtitle="Search specialists" icon={User} color="blue" />
            <PastelActionCard title="Book Appointment" subtitle="Easy & quick" icon={Calendar} color="pink" />
            <PastelActionCard title="Medical Records" subtitle="View your history" icon={Brain} color="cyan" />
          </div>

          <DoctorCard
            id="1"
            name="Dr. Rahul Sharma"
            specialty="Cardiologist"
            rating={4.8}
            reviewsCount={124}
            experience="12 years experience"
            consultationFee={800}
            isTopRated={true}
            onCall={() => alert('Call trigger')}
          />

          <RecordRow id="rec-1" type="lab" title="Blood Test Report" date="12 Sep 2026" />
          <MedicineItem name="Paracetamol" dosage="500 mg" frequency="1 tablet × 2/day | After food" duration="5 days" color="red" />

          <div className="flex flex-wrap gap-2">
            <StatusBadge status="Top Rated" variant="success" />
            <StatusBadge status="Active" variant="success" />
            <StatusBadge status="Completed" variant="neutral" />
            <StatusBadge status="Due" variant="danger" />
            <StatusBadge status="Paid" variant="success" />
          </div>
        </section>

        {/* 2E: Booking Components */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-medisetu-navy border-l-4 border-emerald-500 pl-3">
            2E — Booking Components
          </h2>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6">
            <BookingStepper currentStep={2} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-semibold text-medisetu-slate mb-2">Select Date</h4>
                <CalendarWidget selectedDate={date} onSelectDate={setDate} />
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-medisetu-slate mb-2">Select Time Slot</h4>
                  <TimeSlotGrid selectedSlot={slot} onSelectSlot={setSlot} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-medisetu-slate mb-2">Consultation Mode</h4>
                  <ConsultationTypeRadio selectedValue={consultType} onChange={setConsultType} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2F: Feedback Components */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-medisetu-navy border-l-4 border-rose-500 pl-3">
            2F — Feedback Components
          </h2>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6">
            <SuccessCheckmark />
            <AlertBanner variant="info" message="You will receive a confirmation message on your registered mobile number." />
            <ErrorAlert title="Backend Connection Notice" message="Real API errors are displayed explicitly with a retry action." onRetry={() => {}} />
            <LoadingSkeleton variant="row" count={2} />
          </div>
        </section>
      </div>
    </PatientLayout>
  );
};

export default ComponentPreviewScreen;
