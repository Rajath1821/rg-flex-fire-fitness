import { Member, AttendanceRecord, MembershipPlanType, ContactMessage, EmailNotificationLog } from '../types';

const MEMBERS_STORAGE_KEY = 'rg_flex_fire_members_v2';
const ATTENDANCE_STORAGE_KEY = 'rg_flex_fire_attendance_v2';
const MESSAGES_STORAGE_KEY = 'rg_flex_fire_messages_v2';
const EMAIL_LOGS_STORAGE_KEY = 'rg_flex_fire_email_logs_v2';
const ADMIN_PASSWORD_KEY = 'rg_flex_fire_admin_pwd_v2';
const ADMIN_USERNAME_KEY = 'rg_flex_fire_admin_user_v2';
const ADMIN_SESSION_KEY = 'rg_flex_fire_admin_auth';
const MEMBER_SESSION_KEY = 'rg_flex_fire_member_auth';

export const PLANS_CONFIG: Record<MembershipPlanType, { months: number; amount: number; label: string }> = {
  'Basic Package (1 Month)': { months: 1, amount: 899, label: 'Basic Package - 1 Month (₹899)' },
  'Standard Package (3 Months)': { months: 3, amount: 2499, label: 'Standard Package - 3 Months (₹2,499)' },
  'Premium Package (6 Months)': { months: 6, amount: 4699, label: 'Premium Package - 6 Months (₹4,699)' },
  'Ultimate Package (12 Months)': { months: 12, amount: 8499, label: 'Ultimate Package - 12 Months (₹8,499)' },
  'Couples Buddy Plan (3 Months)': { months: 3, amount: 4799, label: 'Couples / Buddy Plan - 3 Months (₹4,799)' },
};

// Calculate status based on expiry date
export function computeMemberStatus(expiryDateStr: string): 'Active' | 'Expiring Soon' | 'Expired' {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Expired';
  if (diffDays <= 7) return 'Expiring Soon';
  return 'Active';
}

export function calculateDaysRemaining(expiryDateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getDateOffset(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

const INITIAL_MEMBERS: Member[] = [
  {
    id: 'RG-2024-001',
    fullName: 'Rohan Gowda',
    username: 'rohangowda',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    dob: '1998-05-14',
    gender: 'Male',
    phone: '9964671267',
    email: 'rohan.gowda@gmail.com',
    address: '#112, 3rd Cross, Lakshmikant Nagara, Hebbal 1st Stage, Mysore',
    emergencyContact: {
      name: 'Sachin R',
      phone: '9964671267',
      relation: 'Brother'
    },
    height: 178,
    weight: 76,
    bmi: 24.0,
    joiningDate: '2024-01-10',
    plan: 'Ultimate Package (12 Months)',
    startDate: getDateOffset(-120),
    expiryDate: getDateOffset(245),
    amount: 8499,
    paymentStatus: 'Paid',
    medicalNotes: 'Cleared for high-intensity powerlifting and CrossFit routines.',
    fitnessGoals: 'Muscle hypertrophy, strength building, 140kg bench press.',
    password: 'member123',
    status: 'Active',
    lastCheckIn: 'Today, 06:45 AM'
  },
  {
    id: 'RG-2024-002',
    fullName: 'Ananya Sharma',
    username: 'ananyasharma',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    dob: '2000-08-22',
    gender: 'Female',
    phone: '9164557180',
    email: 'ananya.s@gmail.com',
    address: '#45, Near Kaveri Circle, Lakshmikant Nagara, Mysore',
    emergencyContact: {
      name: 'Kiran R',
      phone: '9164557180',
      relation: 'Guardian'
    },
    height: 165,
    weight: 58,
    bmi: 21.3,
    joiningDate: '2024-02-15',
    plan: 'Standard Package (3 Months)',
    startDate: getDateOffset(-86),
    expiryDate: getDateOffset(4), // Expiring in 4 days!
    amount: 2499,
    paymentStatus: 'Paid',
    medicalNotes: 'None. Good physical endurance.',
    fitnessGoals: 'Core strengthening, functional mobility, HIIT cardio.',
    password: 'member123',
    status: 'Expiring Soon',
    lastCheckIn: 'Yesterday, 07:15 PM'
  },
  {
    id: 'RG-2024-003',
    fullName: 'Darshan Kumar & Priya',
    username: 'darshankumar',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    dob: '1995-11-03',
    gender: 'Male',
    phone: '9148640684',
    email: 'darshan.mysore@gmail.com',
    address: 'Hebbal 1st Stage, Near Ring Road, Mysore',
    emergencyContact: {
      name: 'Krupa Sagar',
      phone: '9148640684',
      relation: 'Friend'
    },
    height: 180,
    weight: 82,
    bmi: 25.3,
    joiningDate: '2024-03-01',
    plan: 'Couples Buddy Plan (3 Months)',
    startDate: getDateOffset(-40),
    expiryDate: getDateOffset(50),
    amount: 4799,
    paymentStatus: 'Paid',
    medicalNotes: 'None.',
    fitnessGoals: 'Couples partner workouts, stamina, overall conditioning.',
    password: 'member123',
    status: 'Active',
    lastCheckIn: 'Today, 07:30 AM'
  },
  {
    id: 'RG-2024-004',
    fullName: 'Karthik Rao',
    username: 'karthikrao',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    dob: '1992-03-19',
    gender: 'Male',
    phone: '9845012345',
    email: 'karthik.rao@outlook.com',
    address: '#78, Industrial Suburb, Mysore',
    emergencyContact: {
      name: 'Suresh Rao',
      phone: '9845099881',
      relation: 'Father'
    },
    height: 174,
    weight: 88,
    bmi: 29.1,
    joiningDate: '2024-01-05',
    plan: 'Basic Package (1 Month)',
    startDate: getDateOffset(-45),
    expiryDate: getDateOffset(-15), // Expired 15 days ago
    amount: 899,
    paymentStatus: 'Overdue',
    medicalNotes: 'Sedentary work desk, lower back tightness.',
    fitnessGoals: 'Weight loss (-10kg), mobility, daily cardio habit.',
    password: 'member123',
    status: 'Expired',
    lastCheckIn: '16 days ago'
  }
];

const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'ATT-101',
    memberId: 'RG-2024-001',
    memberName: 'Rohan Gowda',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    plan: 'Ultimate Package (12 Months)',
    date: getDateOffset(0),
    checkInTime: '06:45:10',
    checkOutTime: '08:15:30',
    type: 'QR Scan'
  },
  {
    id: 'ATT-102',
    memberId: 'RG-2024-003',
    memberName: 'Darshan Kumar & Priya',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    plan: 'Couples Buddy Plan (3 Months)',
    date: getDateOffset(0),
    checkInTime: '07:30:20',
    type: 'QR Scan'
  },
  {
    id: 'ATT-103',
    memberId: 'RG-2024-002',
    memberName: 'Ananya Sharma',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    plan: 'Standard Package (3 Months)',
    date: getDateOffset(-1),
    checkInTime: '19:15:00',
    checkOutTime: '20:30:45',
    type: 'Manual Check-in'
  }
];

const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'MSG-001',
    name: 'Vikas Gowda',
    email: 'vikas.g@gmail.com',
    phone: '9845112233',
    inquiryType: 'Standard Package (3 Months)',
    message: 'Hello Sachin sir, I want to know about morning workout batches and trainer availability for 3 months package.',
    date: `${getDateOffset(0)} 09:15 AM`,
    read: false
  },
  {
    id: 'MSG-002',
    name: 'Meghana R',
    email: 'meghana.mys@yahoo.com',
    phone: '9980554433',
    inquiryType: 'Couples Buddy Plan (3 Months)',
    message: 'Hi Kiran, looking to join with my friend under the Couples / Buddy 3 months plan (₹4799). Please share timing slots.',
    date: `${getDateOffset(-1)} 05:40 PM`,
    read: true
  }
];

export const StorageService = {
  // Members
  getMembers(): Member[] {
    const raw = localStorage.getItem(MEMBERS_STORAGE_KEY);
    if (!raw) {
      this.saveAllMembers(INITIAL_MEMBERS);
      return INITIAL_MEMBERS;
    }
    try {
      const parsed: Member[] = JSON.parse(raw);
      return parsed.map(m => ({
        ...m,
        status: computeMemberStatus(m.expiryDate)
      }));
    } catch {
      return INITIAL_MEMBERS;
    }
  },

  saveAllMembers(members: Member[]) {
    localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(members));
  },

  getMemberById(id: string): Member | undefined {
    return this.getMembers().find(m => m.id.toLowerCase() === id.trim().toLowerCase());
  },

  findMemberByCredential(query: string): Member | undefined {
    const clean = query.trim().toLowerCase();
    return this.getMembers().find(
      m => m.id.toLowerCase() === clean ||
        m.email.toLowerCase() === clean ||
        (m.username && m.username.toLowerCase() === clean) ||
        m.phone.replace(/\D/g, '') === clean.replace(/\D/g, '')
    );
  },

  addMember(memberData: Omit<Member, 'id' | 'bmi' | 'status'> & { id?: string }): Member {
    const members = this.getMembers();
    const id = memberData.id || this.generateNextMemberId();
    const bmi = Number((memberData.weight / Math.pow(memberData.height / 100, 2)).toFixed(1));
    const status = computeMemberStatus(memberData.expiryDate);

    const newMember: Member = {
      ...memberData,
      id,
      bmi,
      status,
      password: memberData.password || 'member123'
    };

    const updated = [newMember, ...members];
    this.saveAllMembers(updated);
    return newMember;
  },

  updateMember(updatedMember: Member): void {
    const members = this.getMembers();
    const bmi = Number((updatedMember.weight / Math.pow(updatedMember.height / 100, 2)).toFixed(1));
    const status = computeMemberStatus(updatedMember.expiryDate);

    const index = members.findIndex(m => m.id === updatedMember.id);
    if (index !== -1) {
      members[index] = { ...updatedMember, bmi, status };
      this.saveAllMembers(members);
    }
  },

  deleteMember(id: string): void {
    const members = this.getMembers().filter(m => m.id !== id);
    this.saveAllMembers(members);
  },

  generateNextMemberId(): string {
    const members = this.getMembers();
    const currentYear = new Date().getFullYear();
    const maxNum = members.reduce((max, m) => {
      const match = m.id.match(/\d+$/);
      if (match) {
        const val = parseInt(match[0], 10);
        return val > max ? val : max;
      }
      return max;
    }, 4);
    const nextNum = String(maxNum + 1).padStart(3, '0');
    return `RG-${currentYear}-${nextNum}`;
  },

  // Attendance
  getAttendance(): AttendanceRecord[] {
    const raw = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(INITIAL_ATTENDANCE));
      return INITIAL_ATTENDANCE;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ATTENDANCE;
    }
  },

  recordCheckIn(memberId: string, type: 'QR Scan' | 'Manual Check-in' | 'Biometric' = 'QR Scan'): { success: boolean; message: string; record?: AttendanceRecord; member?: Member } {
    const member = this.getMemberById(memberId);
    if (!member) {
      return { success: false, message: `Member with ID "${memberId}" not found in system.` };
    }

    if (member.status === 'Expired') {
      return {
        success: false,
        message: `ACCESS DENIED: Membership for ${member.fullName} has EXPIRED. Contact Sachin R / Kiran R at front desk.`,
        member
      };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toTimeString().split(' ')[0];
    const allAttendance = this.getAttendance();

    const activeCheckIn = allAttendance.find(
      a => a.memberId === member.id && a.date === todayStr && !a.checkOutTime
    );

    if (activeCheckIn) {
      activeCheckIn.checkOutTime = nowTime;
      localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(allAttendance));
      return {
        success: true,
        message: `CHECK-OUT SUCCESS: Goodbye, ${member.fullName}! Workout session recorded (${activeCheckIn.checkInTime} - ${nowTime}).`,
        record: activeCheckIn,
        member
      };
    }

    const newRecord: AttendanceRecord = {
      id: `ATT-${Date.now().toString().slice(-5)}`,
      memberId: member.id,
      memberName: member.fullName,
      photoUrl: member.photoUrl,
      plan: member.plan,
      date: todayStr,
      checkInTime: nowTime,
      type
    };

    allAttendance.unshift(newRecord);
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(allAttendance));

    member.lastCheckIn = `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    this.updateMember(member);

    return {
      success: true,
      message: `ACCESS GRANTED: Welcome to RG FLEX FIRE FITNESS, ${member.fullName}!`,
      record: newRecord,
      member
    };
  },

  getMemberAttendance(memberId: string): AttendanceRecord[] {
    return this.getAttendance().filter(a => a.memberId.toLowerCase() === memberId.toLowerCase());
  },

  // Contact Messages sent by users
  getMessages(): ContactMessage[] {
    const raw = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(INITIAL_MESSAGES));
      return INITIAL_MESSAGES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_MESSAGES;
    }
  },

  saveMessage(data: { name: string; email: string; phone: string; inquiryType?: string; message: string }): ContactMessage {
    const messages = this.getMessages();
    const newMsg: ContactMessage = {
      id: `MSG-${Date.now().toString().slice(-5)}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      inquiryType: data.inquiryType || 'General Inquiry',
      message: data.message,
      date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      read: false
    };

    messages.unshift(newMsg);
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    return newMsg;
  },

  markMessageRead(id: string): void {
    const messages = this.getMessages();
    const item = messages.find(m => m.id === id);
    if (item) {
      item.read = true;
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    }
  },

  deleteMessage(id: string): void {
    const messages = this.getMessages().filter(m => m.id !== id);
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  },

  // Admin Credentials Management (Username & Password)
  getAdminUsername(): string {
    return localStorage.getItem(ADMIN_USERNAME_KEY) || 'admin@rgflexfire.com';
  },

  getAdminPassword(): string {
    return localStorage.getItem(ADMIN_PASSWORD_KEY) || 'admin123';
  },

  updateAdminCredentials(oldPass: string, newUsername?: string, newPass?: string): { success: boolean; message: string } {
    const current = this.getAdminPassword();
    if (oldPass !== current) {
      return { success: false, message: 'Current Admin password is incorrect.' };
    }
    if (newUsername !== undefined) {
      const cleanUser = newUsername.trim();
      if (cleanUser.length < 3) {
        return { success: false, message: 'Admin username must be at least 3 characters.' };
      }
      localStorage.setItem(ADMIN_USERNAME_KEY, cleanUser);
    }
    if (newPass !== undefined && newPass.trim() !== '') {
      if (newPass.length < 6) {
        return { success: false, message: 'New password must be at least 6 characters.' };
      }
      localStorage.setItem(ADMIN_PASSWORD_KEY, newPass);
    }
    return { success: true, message: 'Admin credentials successfully updated!' };
  },

  updateAdminPassword(oldPass: string, newPass: string): { success: boolean; message: string } {
    return this.updateAdminCredentials(oldPass, undefined, newPass);
  },

  // Member Credentials Management (Username & Password)
  updateMemberCredentials(memberId: string, newUsername?: string, newPassword?: string): { success: boolean; message: string } {
    const member = this.getMemberById(memberId);
    if (!member) {
      return { success: false, message: 'Member record not found.' };
    }

    if (newUsername !== undefined) {
      const clean = newUsername.trim().toLowerCase();
      if (clean.length < 3) {
        return { success: false, message: 'Username must be at least 3 characters.' };
      }
      // Check uniqueness among other members
      const existing = this.getMembers().find(
        m => m.id !== memberId && m.username && m.username.toLowerCase() === clean
      );
      if (existing) {
        return { success: false, message: `Username "${clean}" is already taken by another athlete.` };
      }
      member.username = clean;
    }

    if (newPassword !== undefined && newPassword.trim() !== '') {
      if (newPassword.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters.' };
      }
      member.password = newPassword;
    }

    this.updateMember(member);
    return { success: true, message: 'Member credentials successfully updated!' };
  },

  // Auth Session Helpers
  setAdminSession(isAuth: boolean) {
    if (isAuth) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    } else {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    }
  },

  isAdminAuthenticated(): boolean {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  },

  setMemberSession(memberId: string | null) {
    if (memberId) {
      sessionStorage.setItem(MEMBER_SESSION_KEY, memberId);
    } else {
      sessionStorage.removeItem(MEMBER_SESSION_KEY);
    }
  },

  getLoggedMember(): Member | null {
    const id = sessionStorage.getItem(MEMBER_SESSION_KEY);
    if (!id) return null;
    return this.getMemberById(id) || null;
  },

  // Automated Email Notification System
  getEmailLogs(): EmailNotificationLog[] {
    const raw = localStorage.getItem(EMAIL_LOGS_STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveEmailLog(log: EmailNotificationLog) {
    const logs = this.getEmailLogs();
    logs.unshift(log);
    localStorage.setItem(EMAIL_LOGS_STORAGE_KEY, JSON.stringify(logs.slice(0, 100)));
  },

  deleteEmailLog(id: string) {
    const logs = this.getEmailLogs().filter(l => l.id !== id);
    localStorage.setItem(EMAIL_LOGS_STORAGE_KEY, JSON.stringify(logs));
  },

  clearEmailLogs() {
    localStorage.removeItem(EMAIL_LOGS_STORAGE_KEY);
  },

  generateEmailTemplate(member: Member): { subject: string; body: string } {
    const days = calculateDaysRemaining(member.expiryDate);
    const urgency = days > 0 ? `Expires in ${days} Days` : days === 0 ? 'Expires TODAY' : `EXPIRED (${Math.abs(days)} Days Overdue)`;
    const subject = `[URGENT] RG FLEX FIRE FITNESS: Renewal Notice - Your ${member.plan} ${urgency}`;

    const body = `Dear ${member.fullName},

This is an automated priority alert from RG FLEX FIRE FITNESS (Lakshmikant Nagara, Mysore).

Your gym membership subscription is ending soon. Below are your account details:

--------------------------------------------------
ATHLETE NAME     : ${member.fullName}
MEMBER ID        : ${member.id}
PACKAGE PLAN     : ${member.plan}
EXPIRY DATE      : ${member.expiryDate}
STATUS           : ${days > 0 ? `${days} Day(s) Left` : days === 0 ? 'Expires TODAY' : `${Math.abs(days)} Day(s) Expired`}
REGISTERED EMAIL : ${member.email}
REGISTERED PHONE : ${member.phone}
--------------------------------------------------

RENEWAL PLANS & SPECIAL RATES:
• Basic Package (1 Month)         : ₹ 899/-
• Standard Package (3 Months)      : ₹ 2,499/-
• Premium Package (6 Months)       : ₹ 4,699/-
• Ultimate Package (12 Months)     : ₹ 8,499/-
• Couples / Buddy Plan (3 Months)  : ₹ 4,799/-

HOW TO RENEW YOUR PASS:
1. Pay via UPI / Google Pay / PhonePe to 9964671267 (Sachin R) or 9164557180 (Kiran R).
2. Or pay at the gym reception desk via cash or card.
3. Bring your digital QR pass to reception for instant automatic extension.

GYM LOCATION:
RG FLEX FIRE FITNESS
#64, MIG First Floor, Lakshmikant Nagara, Hebbal 1st Stage, Mysore - 570016
Training Hours: Monday - Saturday: 05:30 AM - 10:00 PM | Sunday: 06:00 AM - 12:00 PM

COACHES CONTACT HOTLINES:
• Sachin R    : 9964671267
• Kiran R     : 9164557180
• Krupa Sagar : 9148640684

Stay committed to your workout routine. We look forward to seeing you at the gym!

Warm regards,
Team RG FLEX FIRE FITNESS
Lakshmikant Nagara, Mysore`;

    return { subject, body };
  },

  generateEmailMailtoUrl(member: Member): string {
    const { subject, body } = this.generateEmailTemplate(member);
    return `mailto:${encodeURIComponent(member.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  },

  sendExpiryNotificationEmail(member: Member, autoTriggered = true): EmailNotificationLog {
    const days = calculateDaysRemaining(member.expiryDate);
    const { subject, body } = this.generateEmailTemplate(member);

    const log: EmailNotificationLog = {
      id: `EMAIL-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      memberId: member.id,
      memberName: member.fullName,
      recipientEmail: member.email,
      subject,
      plan: member.plan,
      expiryDate: member.expiryDate,
      daysRemaining: days,
      sentAt: new Date().toISOString(),
      status: 'Delivered',
      messagePreview: body.slice(0, 160) + '...',
      autoTriggered
    };

    this.saveEmailLog(log);
    return log;
  },

  autoCheckAndSendExpiryEmails(): { sentCount: number; notifiedMembers: string[] } {
    const members = this.getMembers();
    const todayStr = new Date().toISOString().split('T')[0];
    const existingLogs = this.getEmailLogs();

    let sentCount = 0;
    const notifiedMembers: string[] = [];

    members.forEach(member => {
      // Check if subscription is ending in <= 7 days or expired
      const days = calculateDaysRemaining(member.expiryDate);
      if (days <= 7 && member.email && member.email.includes('@')) {
        // Prevent duplicate automatic emails sent on the exact same date to the same member
        const alreadySentToday = existingLogs.some(
          log => log.memberId === member.id && log.sentAt.startsWith(todayStr)
        );

        if (!alreadySentToday) {
          this.sendExpiryNotificationEmail(member, true);
          sentCount++;
          notifiedMembers.push(`${member.fullName} (${member.email})`);
        }
      }
    });

    return { sentCount, notifiedMembers };
  },

  resetToDefault() {
    localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(INITIAL_MEMBERS));
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(INITIAL_ATTENDANCE));
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(INITIAL_MESSAGES));
    localStorage.removeItem(EMAIL_LOGS_STORAGE_KEY);
    localStorage.removeItem(ADMIN_USERNAME_KEY);
    localStorage.setItem(ADMIN_PASSWORD_KEY, 'admin123');
  }
};
