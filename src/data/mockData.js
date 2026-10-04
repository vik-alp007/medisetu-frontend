/**
 * Figma Reference / Mock Data
 *
 * IMPORTANT RULES:
 * 1. This data is derived directly from the Figma design screenshots.
 * 2. It is used strictly for initial UI development, local prototyping, or demo mode.
 * 3. It must NEVER silently overwrite or replace real API responses if a real API call fails.
 */

export const mockPatient = {
  id: "MS-20481",
  name: "Vaibhav Agrawal",
  greetingName: "Shriyansh Mishra",
  email: "vaibhav@gmail.com",
  mobile: "+91 98765 43210",
  dateOfBirth: "15 May 2003",
  gender: "Male",
  bloodGroup: "O+",
  allergies: "None",
  existingConditions: "None",
};

export const mockDoctors = [
  {
    id: "1",
    name: "Dr. Rahul Sharma",
    specialty: "Cardiologist",
    rating: 4.8,
    reviewsCount: 124,
    experience: "12 years experience",
    consultationFee: 800,
    isTopRated: true,
    education: "MD - Cardiology, AIIMS",
    languages: "English, Hindi",
    about:
      "Dr. Rahul Sharma is a leading cardiologist with 12 years of experience in treating heart-related conditions. He is known for his patient-centric approach and modern treatment methods.",
    highlights: [
      { label: "12+ Years Experience", subtext: "In heart treatment" },
      { label: "5000+ Happy Patients", subtext: "Treated successfully" },
      { label: "Modern Treatment Methods", subtext: "Advanced & safe" },
      { label: "Patient-Centric Approach", subtext: "Your health, our priority" },
    ],
    contact: {
      phone: "+91 98765 43210",
      hospital: "Apollo Hospitals, New Delhi",
    },
    availableDays: ["Mon", "Tue", "Wed"],
    availableSlots: ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "04:30 PM", "05:00 PM"],
  },
  {
    id: "2",
    name: "Dr. Ananya Dubey",
    specialty: "General Physician",
    rating: 4.7,
    reviewsCount: 96,
    experience: "8 years experience",
    consultationFee: 600,
    isTopRated: false,
    education: "MBBS, MD - Medicine",
    languages: "English, Hindi",
    availableDays: ["Mon", "Wed", "Fri"],
    availableSlots: ["09:00 AM", "10:00 AM", "02:00 PM", "04:00 PM"],
  },
  {
    id: "3",
    name: "Dr. Vikram Singh",
    specialty: "Neurologist",
    rating: 4.6,
    reviewsCount: 78,
    experience: "10 years experience",
    consultationFee: 900,
    isTopRated: false,
    education: "DM - Neurology, PGI",
    languages: "English, Hindi, Punjabi",
    availableDays: ["Tue", "Thu", "Sat"],
    availableSlots: ["11:00 AM", "12:00 PM", "05:00 PM"],
  },
  {
    id: "4",
    name: "Dr. Sneha Patel",
    specialty: "Dermatologist",
    rating: 4.9,
    reviewsCount: 110,
    experience: "7 years experience",
    consultationFee: 700,
    isTopRated: true,
    education: "MD - Dermatology, CMC",
    languages: "English, Hindi, Gujarati",
    availableDays: ["Mon", "Tue", "Thu"],
    availableSlots: ["10:00 AM", "11:00 AM", "03:00 PM", "04:00 PM"],
  },
];

export const mockUpcomingAppointment = {
  id: "apt-101",
  doctorName: "Dr. Rahul Sharma",
  specialty: "Cardiologist",
  timing: "Today - 4:30 PM",
  date: "28 Sep 2026",
  time: "11:00 AM",
  consultationType: "In-person",
  hospital: "At hospital",
  fee: 800,
};

export const mockRecommendedSpecialists = [
  { id: "cardio", title: "Cardiology", subtitle: "Heart Care", color: "pink" },
  { id: "neuro", title: "Neurology", subtitle: "Brain & Nerve", color: "cyan" },
  { id: "derma", title: "Dermatology", subtitle: "Skin Care", color: "peach" },
];

export const mockMedicalRecords = [
  { id: "rec-1", type: "lab", title: "Blood Test Report", date: "12 Sep 2026", category: "Reports" },
  { id: "rec-2", type: "xray", title: "Chest X-Ray", date: "05 Sep 2026", category: "Reports" },
  { id: "rec-3", type: "rx", title: "Prescription", date: "02 Sep 2026", category: "Prescriptions" },
  { id: "rec-4", type: "mri", title: "MRI Scan", date: "28 Aug 2026", category: "Reports" },
  { id: "rec-5", type: "visit", title: "Doctor Visit Summary", date: "20 Aug 2026", category: "Visits" },
  { id: "rec-6", type: "ecg", title: "ECG Report", date: "15 Aug 2026", category: "Reports" },
];

export const mockPrescriptions = {
  active: {
    id: "rx-901",
    doctor: "Dr. Rahul Sharma",
    specialty: "Cardiologist",
    date: "28 Sep 2026",
    status: "Consulted",
    notes: "Patient presents with mild fever and cough. Advised rest and prescribed medicines for 5 days.",
    medicines: [
      { name: "Paracetamol", dosage: "500 mg", frequency: "1 tablet × 2/day | After food", duration: "5 days" },
      { name: "Azithromycin", dosage: "250 mg", frequency: "1 tablet × 1/day | After food", duration: "5 days" },
      { name: "Vitamin C", dosage: "500 mg", frequency: "1 tablet × 1/day | After food", duration: "5 days" },
    ],
    instructions: [
      "Drink plenty of water",
      "Take medicines as prescribed",
      "Rest and avoid cold drinks",
    ],
  },
  history: [
    { id: "rx-801", doctor: "Dr. Rahul Sharma", specialty: "Cardiologist", date: "28 Sep 2026", status: "Active" },
    { id: "rx-802", doctor: "Dr. Ananya Dubey", specialty: "General Physician", date: "02 Sep 2026", status: "Active" },
    { id: "rx-803", doctor: "Dr. Vikram Singh", specialty: "Neurologist", date: "15 Aug 2026", status: "Completed" },
  ],
};

export const mockBills = {
  outstandingAmount: 1200,
  dueStatus: "Due",
  billDetails: [
    { item: "Consultation", amount: 800 },
    { item: "Lab Test", amount: 400 },
  ],
  total: 1200,
  previousPayments: [
    { id: "pay-1", amount: 750, date: "12 Sep 2026", status: "Paid" },
    { id: "pay-2", amount: 500, date: "04 Sep 2026", status: "Paid" },
  ],
};

export const mockEmergencyContacts = [
  { name: "Hospital Emergency", number: "+91 120 456 7890" },
  { name: "Ambulance", number: "102" },
];
