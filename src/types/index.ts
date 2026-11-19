export type MembershipPlanType =
  | 'Basic Package (1 Month)'
  | 'Standard Package (3 Months)'
  | 'Premium Package (6 Months)'
  | 'Ultimate Package (12 Months)'
  | 'Couples Buddy Plan (3 Months)';

export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue';

export type MemberStatus = 'Active' | 'Expiring Soon' | 'Expired';

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface Member {
  id: string; // e.g. "RG-2024-001"
  fullName: string;
  photoUrl: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  emergencyContact: EmergencyContact;
  height: number; // in cm
  weight: number; // in kg
  bmi: number;
  joiningDate: string; // YYYY-MM-DD
  plan: MembershipPlanType;
  startDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  amount: number; // in Rupees
  paymentStatus: PaymentStatus;
  medicalNotes?: string;
  fitnessGoals?: string;
  password?: string;
  status: MemberStatus;
  lastCheckIn?: string;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  photoUrl: string;
  plan: MembershipPlanType;
  date: string; // YYYY-MM-DD
  checkInTime: string; // HH:mm:ss
  checkOutTime?: string; // HH:mm:ss
  type: 'QR Scan' | 'Manual Check-in' | 'Biometric';
}

export interface PlanDetails {
  name: MembershipPlanType;
  durationMonths: number;
  price: number; // in Rupees
  tagline: string;
  features: string[];
  popular?: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  inquiryType?: string;
  message: string;
  date: string;
  read: boolean;
}

export interface Facility {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  features: string[];
}

export interface GymTrainer {
  id: string;
  name: string;
  role: string;
  specialty: string;
  experience: string;
  photoUrl: string;
  bio: string;
  certifications: string[];
  rating: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  memberSince: string;
  photoUrl: string;
  quote: string;
  rating: number;
  transformation: string;
}

export interface EmailNotificationLog {
  id: string;
  memberId: string;
  memberName: string;
  recipientEmail: string;
  subject: string;
  plan: string;
  expiryDate: string;
  daysRemaining: number;
  sentAt: string;
  status: 'Delivered' | 'Sent' | 'Failed';
  messagePreview: string;
  autoTriggered: boolean;
}
