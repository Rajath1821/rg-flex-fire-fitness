import React, { useState, useEffect } from 'react';
import { Member, AttendanceRecord, MembershipPlanType, PaymentStatus, MemberStatus, ContactMessage, EmailNotificationLog } from '../../types';
import { StorageService, calculateDaysRemaining, PLANS_CONFIG } from '../../services/storage';
import { generateMemberDetailsPDF, exportMembersToCSV, exportMembersToExcel } from '../../services/pdfService';
import { QRCodeSVG } from 'qrcode.react';
import {
  Users, UserCheck, UserX, Clock, Search,
  Download, FileSpreadsheet, Eye, Edit, Trash2, AlertTriangle, CheckCircle2,
  QrCode, RefreshCw, LogOut, Activity, Key,
  UserPlus, Phone, Mail, Send, MessageSquare, Check, Flame, ArrowLeft, X
} from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onNavigateHome }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | MemberStatus>('All');
  const [planFilter, setPlanFilter] = useState<'All' | MembershipPlanType>('All');

  // Modals
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewMemberModal, setViewMemberModal] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [adminPasswordModalOpen, setAdminPasswordModalOpen] = useState(false);

  // Admin Change Credentials Form State (Username & Password)
  const [adminNewUser, setAdminNewUser] = useState(StorageService.getAdminUsername());
  const [adminOldPass, setAdminOldPass] = useState('');
  const [adminNewPass, setAdminNewPass] = useState('');
  const [adminConfirmPass, setAdminConfirmPass] = useState('');
  const [adminPassMsg, setAdminPassMsg] = useState({ text: '', isError: false });

  // Scanner State
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; record?: AttendanceRecord; member?: Member } | null>(null);

  // Delete Confirm State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'members' | 'messages' | 'attendance' | 'emails' | 'analytics'>('members');
  const [emailLogs, setEmailLogs] = useState<EmailNotificationLog[]>([]);
  const [emailToast, setEmailToast] = useState<string | null>(null);
  const [previewEmailLog, setPreviewEmailLog] = useState<EmailNotificationLog | null>(null);

  useEffect(() => {
    loadData();
    // Automated scanner: Checks if monthly/any subscription is ending and auto-sends email
    const autoResult = StorageService.autoCheckAndSendExpiryEmails();
    if (autoResult.sentCount > 0) {
      setEmailLogs(StorageService.getEmailLogs());
      setEmailToast(`Auto-Notification Engine: Dispatched ${autoResult.sentCount} renewal notice(s) to expiring members!`);
      setTimeout(() => setEmailToast(null), 6000);
    }
  }, []);

  const loadData = () => {
    setMembers(StorageService.getMembers());
    setAttendance(StorageService.getAttendance());
    setMessages(StorageService.getMessages());
    setEmailLogs(StorageService.getEmailLogs());
  };

  const handleAutoSendAllExpiryEmails = () => {
    const expiring = members.filter(m => calculateDaysRemaining(m.expiryDate) <= 7 && m.email);
    if (expiring.length === 0) {
      alert('No members have subscriptions expiring within 7 days.');
      return;
    }
    let count = 0;
    expiring.forEach(m => {
      StorageService.sendExpiryNotificationEmail(m, false);
      count++;
    });
    setEmailLogs(StorageService.getEmailLogs());
    setEmailToast(`Successfully dispatched ${count} automated renewal email(s) to registered member addresses!`);
    setTimeout(() => setEmailToast(null), 5000);
  };

  const handleSendSingleEmail = (m: Member) => {
    if (!m.email || !m.email.includes('@')) {
      alert(`Member ${m.fullName} does not have a valid email address.`);
      return;
    }
    StorageService.sendExpiryNotificationEmail(m, false);
    setEmailLogs(StorageService.getEmailLogs());
    setEmailToast(`Renewal notice dispatched to ${m.fullName} (${m.email})!`);
    setTimeout(() => setEmailToast(null), 4000);
  };

  const filteredMembers = members.filter((m) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query ||
      m.fullName.toLowerCase().includes(query) ||
      m.id.toLowerCase().includes(query) ||
      (m.username && m.username.toLowerCase().includes(query)) ||
      m.phone.toLowerCase().includes(query) ||
      m.email.toLowerCase().includes(query);

    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    const matchesPlan = planFilter === 'All' || m.plan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  // KPI Metrics Calculation
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'Active').length;
  const expiringSoonMembers = members.filter(m => m.status === 'Expiring Soon');
  const expiredMembers = members.filter(m => m.status === 'Expired').length;
  const totalRevenue = members.reduce((sum, m) => sum + (m.paymentStatus === 'Paid' ? m.amount : 0), 0);
  const unreadMessagesCount = messages.filter(msg => !msg.read).length;

  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayCheckins = attendance.filter(a => a.date === todayDateStr).length;

  // Registration Form State
  const initialFormState = {
    fullName: '',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    dob: '1998-06-15',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    phone: '',
    email: '',
    address: '#64, Lakshmikant Nagara, Hebbal 1st Stage, Mysore',
    emergencyName: 'Sachin R',
    emergencyPhone: '9964671267',
    emergencyRelation: 'Guardian',
    height: 175,
    weight: 75,
    joiningDate: todayDateStr,
    plan: 'Standard Package (3 Months)' as MembershipPlanType,
    startDate: todayDateStr,
    expiryDate: '',
    amount: PLANS_CONFIG['Standard Package (3 Months)'].amount,
    paymentStatus: 'Paid' as PaymentStatus,
    medicalNotes: '',
    fitnessGoals: '',
    username: '',
    password: 'member123'
  };

  const [regForm, setRegForm] = useState(initialFormState);

  useEffect(() => {
    const planInfo = PLANS_CONFIG[regForm.plan] || PLANS_CONFIG['Standard Package (3 Months)'];
    const sDate = new Date(regForm.startDate || todayDateStr);
    sDate.setMonth(sDate.getMonth() + planInfo.months);
    const expStr = sDate.toISOString().split('T')[0];

    setRegForm(prev => ({
      ...prev,
      expiryDate: expStr,
      amount: planInfo.amount
    }));
  }, [regForm.plan, regForm.startDate]);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.fullName || !regForm.phone) {
      alert('Please fill in required fields (Name, Phone Number).');
      return;
    }

    const chosenUsername = (
      regForm.username ||
      regForm.fullName.toLowerCase().replace(/[^a-z0-9_]/g, '') ||
      `athlete_${Date.now().toString().slice(-4)}`
    ).trim().toLowerCase();

    // Check username uniqueness
    const existing = StorageService.getMembers().find(
      m => m.username && m.username.toLowerCase() === chosenUsername
    );
    if (existing) {
      alert(`Username "${chosenUsername}" is already taken by another athlete (${existing.fullName}). Please choose another.`);
      return;
    }

    if (regForm.password && regForm.password.trim().length < 6) {
      alert('Initial password must be at least 6 characters long.');
      return;
    }

    const newMember = StorageService.addMember({
      fullName: regForm.fullName,
      photoUrl: regForm.photoUrl,
      dob: regForm.dob,
      gender: regForm.gender,
      phone: regForm.phone,
      email: regForm.email || `${regForm.phone}@rgflexfire.com`,
      address: regForm.address,
      emergencyContact: {
        name: regForm.emergencyName || 'Emergency',
        phone: regForm.emergencyPhone || regForm.phone,
        relation: regForm.emergencyRelation || 'Family'
      },
      height: Number(regForm.height),
      weight: Number(regForm.weight),
      joiningDate: regForm.joiningDate,
      plan: regForm.plan,
      startDate: regForm.startDate,
      expiryDate: regForm.expiryDate,
      amount: Number(regForm.amount),
      paymentStatus: regForm.paymentStatus,
      medicalNotes: regForm.medicalNotes,
      fitnessGoals: regForm.fitnessGoals,
      username: chosenUsername,
      password: regForm.password || 'member123'
    });

    loadData();
    setRegisterModalOpen(false);
    setRegForm(initialFormState);
    alert(`Member Registered Successfully!\nAssigned Member ID: ${newMember.id}\nUsername: @${newMember.username}\nPortal Password: ${newMember.password}`);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    if (editingMember.username) {
      const cleanUser = editingMember.username.trim().toLowerCase();
      if (cleanUser.length < 3) {
        alert('Member username must be at least 3 characters.');
        return;
      }
      const collision = StorageService.getMembers().find(
        m => m.id !== editingMember.id && m.username && m.username.toLowerCase() === cleanUser
      );
      if (collision) {
        alert(`Username "${cleanUser}" is already taken by ${collision.fullName} (${collision.id}). Please assign a unique username.`);
        return;
      }
      editingMember.username = cleanUser;
    }

    if (editingMember.password && editingMember.password.trim().length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }

    StorageService.updateMember(editingMember);
    loadData();
    setEditModalOpen(false);
    setEditingMember(null);
    alert(`Member ${editingMember.fullName} updated successfully!`);
  };

  const handleDeleteMember = (id: string) => {
    StorageService.deleteMember(id);
    loadData();
    setDeletingId(null);
  };

  const handleQuickRenew = (m: Member) => {
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);

    const updated: Member = {
      ...m,
      startDate: today.toISOString().split('T')[0],
      expiryDate: nextYear.toISOString().split('T')[0],
      status: 'Active',
      paymentStatus: 'Paid'
    };

    StorageService.updateMember(updated);
    loadData();
    alert(`Renewed membership for ${m.fullName} until ${updated.expiryDate}`);
  };

  const handleScanExecute = (memberIdInput: string) => {
    const res = StorageService.recordCheckIn(memberIdInput, 'QR Scan');
    setScanResult(res);
    setScanInput('');
    loadData();
  };

  const handleAdminCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminPassMsg({ text: '', isError: false });

    if (adminNewPass && adminNewPass !== adminConfirmPass) {
      setAdminPassMsg({ text: 'New passwords do not match.', isError: true });
      return;
    }

    const res = StorageService.updateAdminCredentials(
      adminOldPass,
      adminNewUser.trim() || undefined,
      adminNewPass.trim() || undefined
    );
    if (!res.success) {
      setAdminPassMsg({ text: res.message, isError: true });
    } else {
      setAdminPassMsg({ text: res.message, isError: false });
      setTimeout(() => {
        setAdminPasswordModalOpen(false);
        setAdminOldPass('');
        setAdminNewPass('');
        setAdminConfirmPass('');
        setAdminPassMsg({ text: '', isError: false });
      }, 1500);
    }
  };

  const handleMarkRead = (id: string) => {
    StorageService.markMessageRead(id);
    loadData();
  };

  const handleDeleteMsg = (id: string) => {
    StorageService.deleteMessage(id);
    loadData();
  };

  return (
    <div className="min-h-screen bg-gym-black text-slate-100 flex flex-col font-sans">

      {/* 1. DEDICATED TOP ADMIN NAVBAR (Cleanly aligned, standalone) */}
      <header className="sticky top-0 z-40 bg-gym-darker/95 backdrop-blur-md border-b border-gym-border/80 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">

          {/* Left Brand & Return link */}
          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-gym-card hover:bg-gym-cardHover px-3 py-1.5 rounded-lg border border-gym-border transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Website</span>
            </button>

            <div className="h-5 w-px bg-gym-border hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gym-neon flex items-center justify-center text-gym-black shadow-neon shrink-0">
                <Flame className="w-5 h-5 font-bold" />
              </div>
              <div>
                <div className="font-heading font-black text-sm sm:text-base text-white tracking-wider flex items-center gap-1.5">
                  RG <span className="text-gym-neon">FLEX FIRE</span> FITNESS
                  <span className="text-[10px] bg-gym-neon/15 text-gym-neon px-2 py-0.5 rounded font-mono font-bold border border-gym-neon/30">
                    ADMIN
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono -mt-0.5">
                  Lakshmikant Nagara, Hebbal 1st Stage, Mysore
                </div>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setAdminNewUser(StorageService.getAdminUsername());
                setAdminOldPass('');
                setAdminNewPass('');
                setAdminConfirmPass('');
                setAdminPassMsg({ text: '', isError: false });
                setAdminPasswordModalOpen(true);
              }}
              className="px-3 py-2 rounded-xl bg-gym-card hover:bg-gym-cardHover text-xs font-semibold text-slate-200 border border-gym-border hover:border-slate-500 flex items-center gap-1.5 transition-all"
              title="Change Admin Username and Password"
            >
              <Key className="w-3.5 h-3.5 text-gym-cyan" />
              <span className="hidden sm:inline">Admin Credentials</span>
            </button>

            <button
              onClick={() => { setScannerOpen(true); setScanResult(null); }}
              className="px-3.5 py-2 rounded-xl bg-gym-card hover:bg-gym-cardHover text-xs font-bold uppercase tracking-wider text-gym-neon border border-gym-neon/40 flex items-center gap-1.5 shadow-neon transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>Door Scanner</span>
            </button>

            <button
              onClick={() => setRegisterModalOpen(true)}
              className="btn-neon px-4 py-2 rounded-xl text-xs font-heading uppercase tracking-wider flex items-center gap-1.5 shadow-neon"
            >
              <UserPlus className="w-4 h-4 font-bold" />
              <span>New Member</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-slate-700/60 transition-colors"
              title="Logout from Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* 2. MAIN ADMIN CONTENT CONTAINER (Clean margins & alignment) */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Automated Email Feedback Toast */}
        {emailToast && (
          <div className="p-3.5 bg-emerald-950/80 border border-gym-neon rounded-2xl flex items-center justify-between gap-3 text-xs text-gym-neon animate-in fade-in shadow-neon">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-gym-neon shrink-0" />
              <span className="font-semibold">{emailToast}</span>
            </div>
            <button
              onClick={() => setEmailToast(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Expiring Soon Alert Banner with Automated Email Notification Trigger */}
        {expiringSoonMembers.length > 0 && (
          <div className="glass-card bg-amber-950/30 border border-amber-500/50 p-4 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400 shrink-0">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-left">
                <h4 className="text-xs sm:text-sm font-bold font-heading text-amber-300 uppercase tracking-wide">
                  ATTENTION: {expiringSoonMembers.length} MEMBERSHIP(S) EXPIRING IN &lt; 7 DAYS
                </h4>
                <p className="text-xs text-amber-200/80 mt-0.5">
                  Members: {expiringSoonMembers.map(m => `${m.fullName} (${calculateDaysRemaining(m.expiryDate)}d left)`).join(', ')}
                </p>
                <div className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1.5">
                  <Mail className="w-3 h-3" />
                  <span>Auto-email system scans and dispatches renewal notices directly to registered member emails.</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleAutoSendAllExpiryEmails}
                className="btn-neon px-3.5 py-2 rounded-xl text-xs uppercase font-bold flex items-center gap-1.5 shadow-neon"
                title="Send automated renewal notice emails to all expiring members"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Auto-Send Renewal Emails</span>
              </button>

              <button
                onClick={() => setActiveTab('emails')}
                className="text-xs font-semibold text-slate-200 bg-gym-card hover:bg-gym-cardHover border border-gym-border px-3 py-2 rounded-xl flex items-center gap-1"
                title="View email dispatch audit logs"
              >
                <Mail className="w-3.5 h-3.5 text-gym-neon" />
                <span>Email Logs ({emailLogs.length})</span>
              </button>

              <button
                onClick={() => { setStatusFilter('Expiring Soon'); setActiveTab('members'); }}
                className="text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 px-3 py-2 rounded-xl uppercase transition-colors"
              >
                View Members
              </button>
            </div>
          </div>
        )}

        {/* Overview KPI Cards (Aligned 6-Column Responsive Grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5">

          <div className="glass-card p-4 rounded-2xl border border-gym-border flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] uppercase font-mono font-bold">Total Athletes</span>
              <Users className="w-4 h-4 text-slate-300" />
            </div>
            <div className="text-2xl font-black font-heading text-white">{totalMembers}</div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">Enrolled members</div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-gym-border flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-[10px] uppercase font-mono font-bold">Active Members</span>
              <UserCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black font-heading text-emerald-400">{activeMembers}</div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">Valid gym passes</div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-gym-border flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <span className="text-[10px] uppercase font-mono font-bold">Expiring Soon</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black font-heading text-amber-400">{expiringSoonMembers.length}</div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">&lt; 7 days window</div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-gym-border flex flex-col justify-between">
            <div className="flex items-center justify-between text-red-400 mb-2">
              <span className="text-[10px] uppercase font-mono font-bold">Expired</span>
              <UserX className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-black font-heading text-red-400">{expiredMembers}</div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">Renewal required</div>
          </div>

          <div
            onClick={() => setActiveTab('messages')}
            className="glass-card p-4 rounded-2xl border border-gym-neon/50 hover:border-gym-neon cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between text-gym-neon mb-2">
              <span className="text-[10px] uppercase font-mono font-bold">User Messages</span>
              <MessageSquare className="w-4 h-4 text-gym-neon group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-2xl font-black font-heading text-gym-neon flex items-center gap-1.5">
              <span>{messages.length}</span>
              {unreadMessagesCount > 0 && (
                <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-mono font-bold">
                  {unreadMessagesCount} new
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">Website contact leads</div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-gym-border flex flex-col justify-between">
            <div className="flex items-center justify-between text-gym-cyan mb-2">
              <span className="text-[10px] uppercase font-mono font-bold">Collected Fees</span>
              <span className="text-xs text-gym-cyan font-bold font-mono">₹</span>
            </div>
            <div className="text-2xl font-black font-heading text-gym-cyan">₹{totalRevenue.toLocaleString('en-IN')}</div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">Total paid packages</div>
          </div>

        </div>

        {/* Toolbar: Navigation Tabs & Global Export Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gym-border pb-3">

          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('members')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-heading uppercase tracking-wider transition-all ${activeTab === 'members'
                  ? 'bg-gym-neon text-gym-black shadow-neon font-black'
                  : 'bg-gym-card text-slate-400 hover:text-white'
                }`}
            >
              Athletes Management ({members.length})
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-heading uppercase tracking-wider transition-all flex items-center gap-1.5 ${activeTab === 'messages'
                  ? 'bg-gym-neon text-gym-black shadow-neon font-black'
                  : 'bg-gym-card text-slate-400 hover:text-white'
                }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>User Messages ({messages.length})</span>
              {unreadMessagesCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-heading uppercase tracking-wider transition-all ${activeTab === 'attendance'
                  ? 'bg-gym-neon text-gym-black shadow-neon font-black'
                  : 'bg-gym-card text-slate-400 hover:text-white'
                }`}
            >
              Turnstile Attendance ({attendance.length})
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-heading uppercase tracking-wider transition-all ${activeTab === 'analytics'
                  ? 'bg-gym-neon text-gym-black shadow-neon font-black'
                  : 'bg-gym-card text-slate-400 hover:text-white'
                }`}
            >
              Package Stats
            </button>

            <button
              onClick={() => setActiveTab('emails')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-heading uppercase tracking-wider transition-all flex items-center gap-1.5 ${activeTab === 'emails'
                  ? 'bg-gym-neon text-gym-black shadow-neon font-black'
                  : 'bg-gym-card text-slate-400 hover:text-white'
                }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Expiry Email Alerts ({emailLogs.length})</span>
              {expiringSoonMembers.length > 0 && (
                <span className="bg-amber-500 text-black text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {expiringSoonMembers.length}
                </span>
              )}
            </button>
          </div>

          {/* Right Export Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportMembersToCSV(filteredMembers.length > 0 ? filteredMembers : members)}
              className="px-3 py-2 rounded-xl bg-gym-card hover:bg-gym-cardHover text-xs font-bold text-slate-200 border border-gym-border hover:border-emerald-500/50 flex items-center gap-1.5 transition-all shadow-sm"
              title="Export all member records with full details and summary audit to CSV (Excel UTF-8 BOM ready)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => exportMembersToExcel(filteredMembers.length > 0 ? filteredMembers : members)}
              className="px-3 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 text-xs font-bold text-emerald-300 border border-emerald-500/50 flex items-center gap-1.5 transition-all shadow-neon"
              title="Export stylized luxury Excel ledger with colors, metric cards, and status badges"
            >
              <Download className="w-4 h-4 text-gym-neon" />
              <span>Export Excel (.xls)</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Reset to default initial members and packages?')) {
                  StorageService.resetToDefault();
                  loadData();
                }
              }}
              className="p-2 rounded-xl bg-gym-card hover:bg-gym-cardHover text-slate-400 hover:text-white border border-gym-border"
              title="Reset sample members & packages"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* TAB 1: ATHLETES MANAGEMENT TABLE */}
        {activeTab === 'members' && (
          <div className="space-y-4">

            {/* Search and Filters Bar */}
            <div className="glass-card p-3.5 rounded-2xl border border-gym-border flex flex-wrap items-center justify-between gap-3">

              {/* Search Bar */}
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by Name, Member ID, Phone, or Email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 rounded-xl glass-input text-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                {(['All', 'Active', 'Expiring Soon', 'Expired'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${statusFilter === st
                        ? 'bg-gym-cardHover text-gym-neon border border-gym-neon/50 font-bold'
                        : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Package Filter dropdown */}
              <div>
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl glass-input text-xs bg-gym-card text-white font-medium"
                >
                  <option value="All">All Packages</option>
                  <option value="Basic Package (1 Month)">Basic (1 Month - ₹899)</option>
                  <option value="Standard Package (3 Months)">Standard (3 Months - ₹2,499)</option>
                  <option value="Premium Package (6 Months)">Premium (6 Months - ₹4,699)</option>
                  <option value="Ultimate Package (12 Months)">Ultimate (12 Months - ₹8,499)</option>
                  <option value="Couples Buddy Plan (3 Months)">Couples Buddy Plan (₹4,799)</option>
                </select>
              </div>

            </div>

            {/* Members Data Table with Clean Column Alignment */}
            <div className="glass-card rounded-2xl border border-gym-border overflow-hidden shadow-glass">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-xs">
                  <thead className="bg-gym-darker/95 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-gym-border">
                    <tr>
                      <th className="px-5 py-3.5">Athlete</th>
                      <th className="px-4 py-3.5">Member ID</th>
                      <th className="px-4 py-3.5">Package / Fee</th>
                      <th className="px-4 py-3.5">Coverage Dates</th>
                      <th className="px-4 py-3.5">Payment</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gym-border/60">
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map((m) => (
                        <tr key={m.id} className="hover:bg-gym-cardHover/40 transition-colors group">

                          {/* Athlete Info */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={m.photoUrl}
                                alt=""
                                className="w-10 h-10 rounded-xl object-cover border border-gym-border shrink-0"
                              />
                              <div>
                                <div className="font-bold text-white text-sm group-hover:text-gym-neon transition-colors">
                                  {m.fullName}
                                </div>
                                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
                                  <span>{m.phone}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Member ID */}
                          <td className="px-4 py-3.5 font-mono whitespace-nowrap">
                            <div className="font-bold text-gym-neon">{m.id}</div>
                            {m.username && (
                              <div className="text-[10px] text-purple-400 font-semibold">@{m.username}</div>
                            )}
                          </td>

                          {/* Package */}
                          <td className="px-4 py-3.5">
                            <span className="font-semibold text-white block">{m.plan}</span>
                            <span className="text-[10px] text-gym-neon font-mono font-bold">₹{m.amount.toLocaleString('en-IN')}/-</span>
                          </td>

                          {/* Dates */}
                          <td className="px-4 py-3.5 text-slate-300 font-mono text-[11px] whitespace-nowrap">
                            <div>Start: {m.startDate}</div>
                            <div className={m.status === 'Expiring Soon' ? 'text-amber-400 font-bold' : m.status === 'Expired' ? 'text-red-400 font-bold' : 'text-slate-400'}>
                              Exp: {m.expiryDate}
                            </div>
                          </td>

                          {/* Payment */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${m.paymentStatus === 'Paid'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              }`}>
                              {m.paymentStatus}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider ${m.status === 'Active'
                                ? 'bg-gym-neon/15 text-gym-neon border border-gym-neon/30'
                                : m.status === 'Expiring Soon'
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/40'
                              }`}>
                              {m.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setViewMemberModal(m)}
                                className="p-1.5 rounded-lg bg-gym-card hover:bg-gym-cardHover text-slate-300 hover:text-white"
                                title="View Member Profile"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => generateMemberDetailsPDF(m)}
                                className="p-1.5 rounded-lg bg-gym-card hover:bg-gym-cardHover text-gym-neon hover:text-emerald-300"
                                title={`Download PDF (${m.id})`}
                              >
                                <Download className="w-4 h-4" />
                              </button>

                              {m.status !== 'Active' && (
                                <>
                                  <button
                                    onClick={() => handleSendSingleEmail(m)}
                                    className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400"
                                    title={`Send Automated Expiry Notice to ${m.email}`}
                                  >
                                    <Mail className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => handleQuickRenew(m)}
                                    className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400"
                                    title="Renew Membership 1 Year"
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                  </button>
                                </>
                              )}

                              <button
                                onClick={() => { setEditingMember(m); setEditModalOpen(true); }}
                                className="p-1.5 rounded-lg bg-gym-card hover:bg-gym-cardHover text-cyan-400 hover:text-cyan-300"
                                title="Edit Information"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => setDeletingId(m.id)}
                                className="p-1.5 rounded-lg bg-gym-card hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                                title="Delete Member Record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                          No members matched the filter query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: USER SENDED MESSAGES (Cleanly Aligned Cards) */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div className="glass-card p-4 rounded-2xl border border-gym-border flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold font-heading text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gym-neon" />
                  <span>USER INQUIRIES & MESSAGES SENT FROM WEBSITE</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Real-time leads submitted by visitors on the Contact Page
                </p>
              </div>
              <span className="text-xs font-mono text-gym-neon font-bold">
                {messages.length} Total Messages
              </span>
            </div>

            <div className="space-y-3">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`glass-card p-5 rounded-2xl border transition-all ${msg.read
                        ? 'border-gym-border/80 bg-gym-card/40'
                        : 'border-gym-neon/60 bg-gym-card/90 shadow-[0_0_15px_rgba(0,255,102,0.15)]'
                      }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gym-border/60 pb-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gym-neon/20 border border-gym-neon flex items-center justify-center text-gym-neon font-bold text-sm shrink-0">
                          {msg.name[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm flex items-center gap-2">
                            <span>{msg.name}</span>
                            {!msg.read && (
                              <span className="bg-gym-neon text-gym-black text-[9px] font-extrabold px-1.5 py-0.5 rounded font-mono uppercase">
                                New Message
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 flex items-center gap-3 font-mono mt-0.5">
                            <span className="text-gym-cyan font-bold">{msg.phone}</span>
                            {msg.email && <span>• {msg.email}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400 font-mono text-[11px]">{msg.date}</span>
                        <a
                          href={`tel:${msg.phone}`}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40 hover:bg-emerald-500 hover:text-black flex items-center gap-1 transition-all"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call</span>
                        </a>
                        {!msg.read && (
                          <button
                            onClick={() => handleMarkRead(msg.id)}
                            className="p-1.5 rounded-lg bg-gym-card hover:bg-gym-cardHover text-slate-300 hover:text-gym-neon"
                            title="Mark as Read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteMsg(msg.id)}
                          className="p-1.5 rounded-lg bg-gym-card hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                          title="Delete message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {msg.inquiryType && (
                        <div className="inline-block px-2.5 py-1 rounded-lg bg-gym-darker text-[11px] font-mono text-gym-neon border border-gym-border font-semibold">
                          Interested In: {msg.inquiryType}
                        </div>
                      )}
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-gym-darker/60 p-3 rounded-xl border border-gym-border/60">
                        "{msg.message}"
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-card p-12 text-center text-slate-400 rounded-2xl border border-gym-border">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                  <p className="text-sm font-semibold">No messages received yet.</p>
                  <p className="text-xs text-slate-500 mt-1">
                    When visitors submit the form on the Contact Page, their messages will display here.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: ATTENDANCE LOG */}
        {activeTab === 'attendance' && (
          <div className="space-y-4">
            <div className="glass-card p-4 rounded-2xl border border-gym-border flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold font-heading text-white">LIVE TURNSTILE ATTENDANCE STREAM</h3>
                <p className="text-xs text-slate-400">Real-time check-in logs through QR validator</p>
              </div>
              <button
                onClick={() => setScannerOpen(true)}
                className="btn-neon px-4 py-2 rounded-xl text-xs uppercase font-bold flex items-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>Simulate QR Door Check-in</span>
              </button>
            </div>

            <div className="glass-card rounded-2xl border border-gym-border overflow-hidden shadow-glass">
              <table className="w-full text-left text-xs">
                <thead className="bg-gym-darker/90 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-gym-border">
                  <tr>
                    <th className="px-5 py-3.5">Athlete</th>
                    <th className="px-4 py-3.5">Member ID</th>
                    <th className="px-4 py-3.5">Plan Tier</th>
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-4 py-3.5">Check-In Time</th>
                    <th className="px-4 py-3.5">Check-Out Time</th>
                    <th className="px-4 py-3.5">Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gym-border/60">
                  {attendance.map((att) => (
                    <tr key={att.id} className="hover:bg-gym-cardHover/40 transition-colors">
                      <td className="px-5 py-3.5 flex items-center gap-2.5">
                        <img src={att.photoUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        <span className="font-bold text-white">{att.memberName}</span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-gym-neon font-bold">{att.memberId}</td>
                      <td className="px-4 py-3.5">{att.plan}</td>
                      <td className="px-4 py-3.5 font-mono text-slate-300">{att.date}</td>
                      <td className="px-4 py-3.5 font-mono text-emerald-400 font-bold">{att.checkInTime}</td>
                      <td className="px-4 py-3.5 font-mono text-slate-400">{att.checkOutTime || 'Active Session'}</td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-gym-card text-[10px] font-mono text-slate-300 border border-gym-border">
                          {att.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PACKAGE ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl border border-gym-border space-y-4">
              <h3 className="text-base font-bold font-heading text-white">RG FLEX FIRE PACKAGE DISTRIBUTION</h3>

              <div className="space-y-3">
                {(Object.keys(PLANS_CONFIG) as MembershipPlanType[]).map((planName) => {
                  const count = members.filter(m => m.plan === planName).length;
                  const pct = totalMembers ? Math.round((count / totalMembers) * 100) : 0;
                  const price = PLANS_CONFIG[planName].amount;

                  return (
                    <div key={planName} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-semibold">{planName} (₹{price})</span>
                        <span className="font-mono text-gym-neon font-bold">{count} members ({pct}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-gym-dark overflow-hidden border border-slate-800">
                        <div
                          style={{ width: `${pct}%` }}
                          className="h-full bg-gradient-to-r from-emerald-500 to-gym-neon rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-gym-border space-y-4">
              <h3 className="text-base font-bold font-heading text-white">GYM CENTER & REVENUE SUMMARY</h3>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 bg-gym-darker rounded-xl border border-gym-border flex items-center justify-between">
                  <span>Location</span>
                  <span className="text-gym-neon font-bold">Lakshmikant Nagara, Mysore</span>
                </div>
                <div className="p-3 bg-gym-darker rounded-xl border border-gym-border flex items-center justify-between">
                  <span>Mentors on Deck</span>
                  <span className="text-white font-mono">Sachin R, Kiran R, Krupa Sagar</span>
                </div>
                <div className="p-3 bg-gym-darker rounded-xl border border-gym-border flex items-center justify-between">
                  <span>Total Subscription Value</span>
                  <span className="text-gym-neon font-mono font-bold text-sm">₹{totalRevenue.toLocaleString('en-IN')}/-</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AUTOMATED SUBSCRIPTION EXPIRY EMAIL CENTER */}
        {activeTab === 'emails' && (
          <div className="space-y-6 animate-in fade-in">

            {/* Engine Overview Banner */}
            <div className="glass-card p-6 rounded-2xl border border-gym-neon/60 bg-gradient-to-r from-gym-darker via-gym-dark to-emerald-950/30 space-y-4 shadow-neon">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gym-neon/20 border border-gym-neon flex items-center justify-center text-gym-neon shrink-0 shadow-neon">
                    <Mail className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold font-heading text-white tracking-wide">
                        AUTOMATED SUBSCRIPTION EXPIRY NOTIFICATIONS
                      </h3>
                      <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ENGINE ACTIVE
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                      Whenever a monthly, quarterly, or yearly subscription is ending (≤ 7 days window), our automated scanner composes and dispatches a personalized renewal notice directly to the member's registered email with pricing packages and coach contact details.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={handleAutoSendAllExpiryEmails}
                    className="btn-neon px-4 py-2.5 rounded-xl text-xs uppercase font-bold flex items-center gap-2 shadow-neon"
                  >
                    <Send className="w-4 h-4" />
                    <span>Auto-Dispatch Renewal Emails</span>
                  </button>
                </div>
              </div>

              {/* Status Stats Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-gym-border/70 text-xs">
                <div className="p-3 bg-gym-darker/90 rounded-xl border border-gym-border flex items-center justify-between">
                  <span className="text-slate-400 font-mono">Members Ending Soon:</span>
                  <span className="font-bold text-amber-400 font-mono text-sm">{expiringSoonMembers.length} Athletes</span>
                </div>
                <div className="p-3 bg-gym-darker/90 rounded-xl border border-gym-border flex items-center justify-between">
                  <span className="text-slate-400 font-mono">Total Emails Logged:</span>
                  <span className="font-bold text-gym-neon font-mono text-sm">{emailLogs.length} Dispatched</span>
                </div>
                <div className="p-3 bg-gym-darker/90 rounded-xl border border-gym-border flex items-center justify-between">
                  <span className="text-slate-400 font-mono">Delivery Rate:</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">100% Verified</span>
                </div>
              </div>
            </div>

            {/* Expiring Subscriptions Requiring Notices */}
            <div className="glass-card p-6 rounded-2xl border border-gym-border space-y-4">
              <div className="flex items-center justify-between border-b border-gym-border pb-3">
                <div>
                  <h4 className="text-sm font-bold font-heading text-white uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Ending & Expired Subscriptions ({expiringSoonMembers.length + expiredMembers})</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Athletes with packages ending in ≤ 7 days or recently expired.
                  </p>
                </div>
                {expiringSoonMembers.length > 0 && (
                  <button
                    onClick={handleAutoSendAllExpiryEmails}
                    className="text-xs font-bold text-gym-neon hover:text-white underline"
                  >
                    Auto-Send to All ({expiringSoonMembers.length})
                  </button>
                )}
              </div>

              {expiringSoonMembers.length === 0 && expiredMembers === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-gym-neon mx-auto" />
                  <p className="text-slate-300 font-bold">All active member subscriptions are in good standing!</p>
                  <p>No monthly or quarterly packages are expiring within the next 7 days.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...expiringSoonMembers, ...members.filter(m => m.status === 'Expired')].map((m) => {
                    const days = calculateDaysRemaining(m.expiryDate);
                    const daysText = days > 0 ? `${days} Days Left` : days === 0 ? 'Expires Today' : `${Math.abs(days)} Days Expired`;
                    const template = StorageService.generateEmailTemplate(m);

                    return (
                      <div
                        key={m.id}
                        className="p-4 bg-gym-darker rounded-2xl border border-gym-border hover:border-gym-neon/50 transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={m.photoUrl}
                              alt={m.fullName}
                              className="w-11 h-11 rounded-xl object-cover border border-gym-border"
                            />
                            <div>
                              <div className="font-bold text-white text-sm flex items-center gap-2">
                                <span>{m.fullName}</span>
                                <span className="text-[10px] text-slate-400 font-mono">({m.id})</span>
                              </div>
                              <div className="text-xs text-gym-neon font-medium mt-0.5">
                                {m.plan}
                              </div>
                            </div>
                          </div>

                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${days > 0
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-red-500/20 text-red-300 border border-red-500/40'
                            }`}>
                            {daysText}
                          </span>
                        </div>

                        {/* Email Address & Expiry Date */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 bg-gym-card rounded-xl border border-gym-border/60">
                          <div>
                            <span className="text-slate-400 block font-mono text-[10px]">RECIPIENT EMAIL</span>
                            <span className="font-bold text-white truncate block">{m.email || 'No email provided'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-mono text-[10px]">EXPIRY DATE</span>
                            <span className="font-bold text-amber-300 font-mono">{m.expiryDate}</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleSendSingleEmail(m)}
                            className="flex-1 py-2 px-3 rounded-xl bg-gym-neon hover:bg-emerald-400 text-gym-black font-heading text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-neon transition-all"
                            title={`Send automated expiry notification to ${m.email}`}
                          >
                            <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Dispatch Notice</span>
                          </button>

                          <a
                            href={StorageService.generateEmailMailtoUrl(m)}
                            className="py-2 px-3 rounded-xl bg-gym-card hover:bg-gym-cardHover text-slate-200 border border-gym-border text-xs font-bold flex items-center gap-1"
                            title="Open prefilled in your default email client (Gmail/Outlook)"
                          >
                            <Mail className="w-3.5 h-3.5 text-gym-cyan" />
                            <span>Mail App</span>
                          </a>

                          <button
                            onClick={() => setPreviewEmailLog({
                              id: 'preview',
                              memberId: m.id,
                              memberName: m.fullName,
                              recipientEmail: m.email,
                              subject: template.subject,
                              plan: m.plan,
                              expiryDate: m.expiryDate,
                              daysRemaining: days,
                              sentAt: new Date().toISOString(),
                              status: 'Delivered',
                              messagePreview: template.body,
                              autoTriggered: true
                            })}
                            className="p-2 rounded-xl bg-gym-card hover:bg-gym-cardHover text-slate-300 hover:text-white border border-gym-border"
                            title="Preview formatted email template"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Audit Log Table of Sent Emails */}
            <div className="glass-card p-6 rounded-2xl border border-gym-border space-y-4">
              <div className="flex items-center justify-between border-b border-gym-border pb-3">
                <div>
                  <h4 className="text-sm font-bold font-heading text-white uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gym-neon" />
                    <span>Automated Email Dispatch History ({emailLogs.length})</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Chronological audit ledger of renewal alert notifications sent to athlete email inboxes.
                  </p>
                </div>
                {emailLogs.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Clear email dispatch history?')) {
                        StorageService.clearEmailLogs();
                        setEmailLogs([]);
                      }
                    }}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Clear History
                  </button>
                )}
              </div>

              {emailLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No automated emails logged yet. They will appear here when dispatched.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gym-border text-slate-400 uppercase font-mono text-[10px]">
                        <th className="py-2.5 px-3">Date & Time</th>
                        <th className="py-2.5 px-3">Recipient Athlete</th>
                        <th className="py-2.5 px-3">Target Email</th>
                        <th className="py-2.5 px-3">Subscription Plan</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                        <th className="py-2.5 px-3 text-right">Preview</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gym-border/60">
                      {emailLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gym-card/50 transition-colors">
                          <td className="py-3 px-3 font-mono text-slate-400 whitespace-nowrap">
                            {new Date(log.sentAt).toLocaleString('en-IN', {
                              dateStyle: 'short',
                              timeStyle: 'short'
                            })}
                          </td>
                          <td className="py-3 px-3 font-bold text-white whitespace-nowrap">
                            {log.memberName} <span className="text-[10px] text-slate-400 font-mono">({log.memberId})</span>
                          </td>
                          <td className="py-3 px-3 font-mono text-gym-neon whitespace-nowrap">
                            {log.recipientEmail}
                          </td>
                          <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                            {log.plan}
                          </td>
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              {log.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => setPreviewEmailLog(log)}
                              className="px-2.5 py-1 rounded-lg bg-gym-card hover:bg-gym-cardHover text-[11px] text-slate-200 border border-gym-border hover:border-gym-neon"
                            >
                              Read Email
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* CHANGE ADMIN USERNAME & PASSWORD MODAL */}
      {adminPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card bg-gym-darker max-w-sm w-full p-6 sm:p-7 rounded-3xl border border-gym-cyan/50 shadow-cyan space-y-4">
            <div className="flex items-center justify-between border-b border-gym-border pb-3">
              <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-gym-cyan" />
                <span>ADMIN USERNAME & PASSWORD</span>
              </h3>
              <button onClick={() => setAdminPasswordModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {adminPassMsg.text && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${adminPassMsg.isError ? 'bg-red-500/10 text-red-300 border border-red-500/30' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                }`}>
                {adminPassMsg.isError ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                <span>{adminPassMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleAdminCredentialsSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-300 font-mono block mb-1">
                  Admin Login Username / Email
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. admin@rgflexfire.com or sachin_admin"
                  value={adminNewUser}
                  onChange={(e) => setAdminNewUser(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-300 font-mono block mb-1">
                  Current Admin Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter current password"
                  value={adminOldPass}
                  onChange={(e) => setAdminOldPass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-300 font-mono block mb-1">
                  New Admin Password (leave empty to keep current)
                </label>
                <input
                  type="password"
                  placeholder="Enter new password (optional)"
                  value={adminNewPass}
                  onChange={(e) => setAdminNewPass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              {adminNewPass && (
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-300 font-mono block mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Confirm new password"
                    value={adminConfirmPass}
                    onChange={(e) => setAdminConfirmPass(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdminPasswordModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-neon px-5 py-2 rounded-xl uppercase font-bold"
                >
                  Save Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REGISTER NEW MEMBER MODAL (Properly Aligned Grid) */}
      {registerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card bg-gym-darker max-w-3xl w-full p-6 sm:p-8 rounded-3xl border border-gym-neon/50 shadow-neon space-y-5 max-h-[92vh] overflow-y-auto">

            <div className="flex items-center justify-between border-b border-gym-border pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gym-neon flex items-center justify-center font-black text-gym-black shadow-neon">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-heading text-white">
                    REGISTER NEW GYM ATHLETE
                  </h3>
                  <p className="text-xs text-slate-400">
                    RG Flex Fire Fitness • Lakshmikant Nagara, Mysore
                  </p>
                </div>
              </div>
              <button onClick={() => setRegisterModalOpen(false)} className="text-slate-400 hover:text-white text-lg p-1">✕</button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">

              {/* Row 1: ID & Avatar */}
              <div className="p-4 bg-gym-card rounded-2xl border border-gym-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={regForm.photoUrl}
                    alt="Preview"
                    className="w-14 h-14 rounded-xl object-cover border-2 border-gym-neon shadow-neon"
                  />
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Assigned Member ID</span>
                    <span className="text-base font-extrabold font-heading text-gym-neon">
                      {StorageService.generateNextMemberId()} (Auto-Generated)
                    </span>
                  </div>
                </div>

                <div className="w-full sm:w-auto">
                  <label className="text-[10px] text-slate-400 font-mono uppercase block mb-1">
                    Preset Avatar
                  </label>
                  <select
                    onChange={(e) => setRegForm({ ...regForm, photoUrl: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg glass-input text-xs bg-gym-darker"
                  >
                    <option value="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80">Athlete Avatar 1 (Male)</option>
                    <option value="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80">Athlete Avatar 2 (Male)</option>
                    <option value="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80">Athlete Avatar 3 (Female)</option>
                    <option value="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80">Athlete Avatar 4 (Female)</option>
                  </select>
                </div>
              </div>

              {/* Personal Info */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase font-mono text-gym-neon block border-b border-gym-border/60 pb-1">
                  1. Athlete Personal Information
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Madhu Gowda"
                      value={regForm.fullName}
                      onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Gender *</label>
                    <select
                      value={regForm.gender}
                      onChange={(e) => setRegForm({ ...regForm, gender: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input bg-gym-darker"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={regForm.dob}
                      onChange={(e) => setRegForm({ ...regForm, dob: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="9964671267"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="madhu@gmail.com"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Residential Address *</label>
                  <input
                    type="text"
                    required
                    value={regForm.address}
                    onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                  />
                </div>
              </div>

              {/* Physical Stats */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase font-mono text-gym-cyan block border-b border-gym-border/60 pb-1">
                  2. Physical & Biometric Measurements
                </span>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Height (cm) *</label>
                    <input
                      type="number"
                      required
                      value={regForm.height}
                      onChange={(e) => setRegForm({ ...regForm, height: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Weight (kg) *</label>
                    <input
                      type="number"
                      required
                      value={regForm.weight}
                      onChange={(e) => setRegForm({ ...regForm, weight: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                    />
                  </div>
                  <div className="p-2 bg-gym-card rounded-xl border border-gym-border flex flex-col justify-center text-center">
                    <span className="text-[9px] uppercase font-mono text-slate-400">Calculated BMI</span>
                    <span className="text-base font-extrabold font-heading text-gym-neon">
                      {(regForm.weight / Math.pow(regForm.height / 100, 2)).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Package & Payment */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase font-mono text-emerald-400 block border-b border-gym-border/60 pb-1">
                  3. Membership Package & Fee (Rupees)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Package Tier *</label>
                    <select
                      value={regForm.plan}
                      onChange={(e) => setRegForm({ ...regForm, plan: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input bg-gym-darker font-bold text-white"
                    >
                      <option value="Basic Package (1 Month)">Basic (1 Month - ₹899)</option>
                      <option value="Standard Package (3 Months)">Standard (3 Months - ₹2,499)</option>
                      <option value="Premium Package (6 Months)">Premium (6 Months - ₹4,699)</option>
                      <option value="Ultimate Package (12 Months)">Ultimate (12 Months - ₹8,499)</option>
                      <option value="Couples Buddy Plan (3 Months)">Couples Buddy Plan (₹4,799)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Start Date *</label>
                    <input
                      type="date"
                      required
                      value={regForm.startDate}
                      onChange={(e) => setRegForm({ ...regForm, startDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Expiry Date</label>
                    <input
                      type="date"
                      readOnly
                      value={regForm.expiryDate}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input font-mono text-gym-neon bg-gym-card cursor-not-allowed font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Fee Amount (₹ INR) *</label>
                    <input
                      type="number"
                      required
                      value={regForm.amount}
                      onChange={(e) => setRegForm({ ...regForm, amount: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input font-bold text-gym-neon"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Payment Status *</label>
                    <select
                      value={regForm.paymentStatus}
                      onChange={(e) => setRegForm({ ...regForm, paymentStatus: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input bg-gym-darker"
                    >
                      <option value="Paid">Paid (Full)</option>
                      <option value="Pending">Pending Payment</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Member Login Credentials */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase font-mono text-purple-400 block border-b border-gym-border/60 pb-1">
                  4. Member Portal Credentials (Username & Password)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">
                      Member Username (Unique Login ID)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. madhugowda"
                      value={regForm.username}
                      onChange={(e) => setRegForm({ ...regForm, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input font-mono"
                    />
                    <span className="text-[9px] text-slate-400 block mt-1">If blank, auto-generated from full name.</span>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">
                      Initial Password *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="member123"
                      value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input font-mono"
                    />
                    <span className="text-[9px] text-slate-400 block mt-1">Member can log in and change this anytime.</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gym-border">
                <button
                  type="button"
                  onClick={() => setRegisterModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-neon px-7 py-3 rounded-xl font-heading text-xs uppercase tracking-wider flex items-center gap-2 shadow-neon"
                >
                  <CheckCircle2 className="w-4 h-4 font-bold" />
                  <span>Enroll Athlete & Generate Pass</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}
      {editModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card bg-gym-darker max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-cyan-500/50 shadow-cyan space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gym-border pb-3">
              <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-gym-cyan" />
                <span>EDIT MEMBER ({editingMember.id})</span>
              </h3>
              <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingMember.fullName}
                    onChange={(e) => setEditingMember({ ...editingMember, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={editingMember.phone}
                    onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Package Tier</label>
                  <select
                    value={editingMember.plan}
                    onChange={(e) => setEditingMember({ ...editingMember, plan: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl glass-input bg-gym-darker"
                  >
                    <option value="Basic Package (1 Month)">Basic Package (1 Month - ₹899)</option>
                    <option value="Standard Package (3 Months)">Standard Package (3 Months - ₹2,499)</option>
                    <option value="Premium Package (6 Months)">Premium Package (6 Months - ₹4,699)</option>
                    <option value="Ultimate Package (12 Months)">Ultimate Package (12 Months - ₹8,499)</option>
                    <option value="Couples Buddy Plan (3 Months)">Couples Buddy Plan (3 Months - ₹4,799)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Fee (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingMember.amount}
                    onChange={(e) => setEditingMember({ ...editingMember, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={editingMember.expiryDate}
                    onChange={(e) => setEditingMember({ ...editingMember, expiryDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Payment Status</label>
                  <select
                    value={editingMember.paymentStatus}
                    onChange={(e) => setEditingMember({ ...editingMember, paymentStatus: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl glass-input bg-gym-darker"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>

              {/* Member Portal Login Credentials (Admin Control) */}
              <div className="p-3.5 bg-gym-card/60 rounded-2xl border border-purple-500/30 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-[11px] font-bold font-mono text-purple-300 uppercase tracking-wider">
                    Member Portal Credentials (Admin Control)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">
                      Member Username
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. rohangowda"
                      value={editingMember.username || ''}
                      onChange={(e) => setEditingMember({
                        ...editingMember,
                        username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')
                      })}
                      className="w-full px-3 py-2 rounded-xl glass-input font-mono"
                    />
                    <span className="text-[9px] text-slate-400 block mt-0.5">Used for athlete portal login</span>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">
                      Reset Password
                    </label>
                    <input
                      type="text"
                      placeholder="Enter new password"
                      value={editingMember.password || ''}
                      onChange={(e) => setEditingMember({
                        ...editingMember,
                        password: e.target.value
                      })}
                      className="w-full px-3 py-2 rounded-xl glass-input font-mono"
                    />
                    <span className="text-[9px] text-slate-400 block mt-0.5">Min 6 characters</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-neon px-5 py-2 rounded-xl uppercase font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MEMBER DETAILS MODAL */}
      {viewMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card bg-gym-darker max-w-xl w-full p-6 sm:p-7 rounded-3xl border border-gym-neon/40 shadow-neon space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gym-border pb-3">
              <div className="flex items-center gap-3">
                <img src={viewMemberModal.photoUrl} alt="" className="w-12 h-12 rounded-xl object-cover border border-gym-neon" />
                <div>
                  <h4 className="text-lg font-bold font-heading text-white">{viewMemberModal.fullName}</h4>
                  <span className="text-xs text-gym-neon font-mono font-bold">{viewMemberModal.id}</span>
                </div>
              </div>
              <button onClick={() => setViewMemberModal(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-gym-card rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Package</span>
                <span className="font-bold text-white">{viewMemberModal.plan}</span>
              </div>
              <div className="p-2.5 bg-gym-card rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Status</span>
                <span className="font-bold text-gym-neon uppercase">{viewMemberModal.status}</span>
              </div>
              <div className="p-2.5 bg-gym-card rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Portal Username</span>
                <span className="font-bold font-mono text-purple-400">@{viewMemberModal.username || 'Not set'}</span>
              </div>
              <div className="p-2.5 bg-gym-card rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Portal Password</span>
                <span className="font-mono text-slate-200 font-semibold">{viewMemberModal.password || 'member123'}</span>
              </div>
              <div className="p-2.5 bg-gym-card rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Validity</span>
                <span className="font-mono text-slate-200">{viewMemberModal.startDate} to {viewMemberModal.expiryDate}</span>
              </div>
              <div className="p-2.5 bg-gym-card rounded-xl">
                <span className="text-[10px] text-slate-400 font-mono block">Fee Paid</span>
                <span className="font-bold text-emerald-400">₹{viewMemberModal.amount}/- ({viewMemberModal.paymentStatus})</span>
              </div>
            </div>

            <div className="p-4 bg-gym-dark rounded-xl border border-gym-border flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block">QR Entry Pass</span>
                <span className="text-xs font-mono text-gym-neon font-bold">RG-{viewMemberModal.id}</span>
              </div>
              <div className="bg-white p-2 rounded-lg">
                <QRCodeSVG value={`RGFLEXFIRE:${viewMemberModal.id}:${viewMemberModal.fullName}`} size={48} />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => generateMemberDetailsPDF(viewMemberModal)}
                className="btn-neon px-4 py-2 rounded-xl text-xs uppercase font-bold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF Dossier</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCANNER MODAL */}
      {scannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card bg-gym-darker max-w-md w-full p-6 sm:p-7 rounded-3xl border border-gym-neon shadow-neon space-y-4">
            <div className="flex items-center justify-between border-b border-gym-border pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-gym-neon" />
                <h3 className="text-base font-bold font-heading text-white">RG FLEX FIRE DOOR SCANNER</h3>
              </div>
              <button onClick={() => setScannerOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {scanResult && (
              <div className={`p-4 rounded-xl text-xs space-y-1 ${scanResult.success ? 'bg-emerald-950/70 border border-emerald-500/80 text-emerald-300' : 'bg-red-950/70 border border-red-500/80 text-red-300'
                }`}>
                <div className="font-bold font-heading text-sm">{scanResult.success ? 'TURNSTILE UNLOCKED' : 'ACCESS DENIED'}</div>
                <p>{scanResult.message}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-300 uppercase block">Scan or Enter Member ID:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. RG-2024-001"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono uppercase"
                />
                <button
                  onClick={() => handleScanExecute(scanInput)}
                  className="btn-neon px-4 py-2.5 rounded-xl text-xs uppercase font-bold shrink-0"
                >
                  Scan
                </button>
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t border-gym-border">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Test Members:</span>
              <div className="grid grid-cols-2 gap-2">
                {members.slice(0, 4).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleScanExecute(m.id)}
                    className="p-2 rounded-lg bg-gym-card hover:bg-gym-cardHover text-[10px] font-mono text-left border border-gym-border"
                  >
                    <span className="text-white block font-bold truncate">{m.fullName.split(' ')[0]}</span>
                    <span className="text-gym-neon">{m.id}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="glass-card bg-gym-darker max-w-sm w-full p-6 rounded-2xl border border-red-500/50 shadow-lg space-y-4">
            <h4 className="text-base font-bold font-heading text-white flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <span>DELETE MEMBER RECORD</span>
            </h4>
            <p className="text-xs text-slate-300">
              Permanently delete member <strong>{deletingId}</strong> from RG Flex Fire database?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setDeletingId(null)} className="px-4 py-2 text-xs text-slate-400 hover:text-white">Cancel</button>
              <button onClick={() => handleDeleteMember(deletingId)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-xs uppercase font-bold">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW SENT EMAIL MODAL */}
      {previewEmailLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="glass-card bg-gym-darker max-w-xl w-full p-6 sm:p-7 rounded-3xl border border-gym-neon/60 shadow-neon space-y-4">
            <div className="flex items-center justify-between border-b border-gym-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gym-neon/20 border border-gym-neon flex items-center justify-center text-gym-neon">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-heading text-white">
                    AUTOMATED EXPIRY NOTIFICATION PREVIEW
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-mono">Status: DELIVERED TO MEMBER INBOX</span>
                </div>
              </div>
              <button
                onClick={() => setPreviewEmailLog(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gym-dark rounded-xl border border-gym-border space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">TO:</span>
                  <span className="text-gym-neon font-bold">{previewEmailLog.recipientEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ATHLETE:</span>
                  <span className="text-white">{previewEmailLog.memberName} ({previewEmailLog.memberId})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SUBJECT:</span>
                  <span className="text-amber-300 font-bold truncate max-w-sm">{previewEmailLog.subject}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  FULL MESSAGE BODY:
                </label>
                <div className="p-4 bg-gym-black rounded-xl border border-gym-border font-mono text-[11px] text-slate-200 whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto">
                  {previewEmailLog.messagePreview}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gym-border/70">
              <a
                href={`mailto:${encodeURIComponent(previewEmailLog.recipientEmail)}?subject=${encodeURIComponent(previewEmailLog.subject)}&body=${encodeURIComponent(previewEmailLog.messagePreview)}`}
                className="btn-neon px-4 py-2 rounded-xl text-xs font-heading uppercase font-bold flex items-center gap-1.5 shadow-neon"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Open in Mail App</span>
              </a>
              <button
                onClick={() => setPreviewEmailLog(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
