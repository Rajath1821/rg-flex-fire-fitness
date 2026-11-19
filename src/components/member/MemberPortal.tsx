import React, { useState } from 'react';
import { Member } from '../../types';
import { StorageService, calculateDaysRemaining } from '../../services/storage';
import { generateMemberDetailsPDF } from '../../services/pdfService';
import { QRCodeSVG } from 'qrcode.react';
import {
  Download, Printer, User, Calendar, CreditCard, Shield, Activity,
  AlertTriangle, CheckCircle2, Clock, Dumbbell,
  Edit3, Key, LogOut, RefreshCw, Flame, HeartPulse, MapPin, Phone, Mail
} from 'lucide-react';
import { GYM_CONTACT_INFO } from '../../data/mockData';

interface MemberPortalProps {
  member: Member;
  onLogout: () => void;
  onNavigateHome: () => void;
  onMemberUpdated: (updated: Member) => void;
}

export const MemberPortal: React.FC<MemberPortalProps> = ({
  member,
  onLogout,
  onNavigateHome,
  onMemberUpdated
}) => {
  const [currentMember, setCurrentMember] = useState<Member>(member);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [emailSentToast, setEmailSentToast] = useState(false);
  
  // Edit Profile Form State
  const [editForm, setEditForm] = useState({
    phone: currentMember.phone,
    address: currentMember.address,
    emergencyName: currentMember.emergencyContact.name,
    emergencyPhone: currentMember.emergencyContact.phone,
    emergencyRelation: currentMember.emergencyContact.relation,
    height: currentMember.height,
    weight: currentMember.weight,
    fitnessGoals: currentMember.fitnessGoals || ''
  });

  // Change Password Form State (Requested for User)
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ text: '', isError: false });

  // Attendance
  const memberAttendance = StorageService.getMemberAttendance(currentMember.id);
  const daysRemaining = calculateDaysRemaining(currentMember.expiryDate);

  // PDF Download Handler
  const handleDownloadPDF = async () => {
    try {
      setDownloadingPdf(true);
      await generateMemberDetailsPDF(currentMember);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Unable to generate PDF document. Please try again.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handlePrintCard = () => {
    window.print();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Member = {
      ...currentMember,
      phone: editForm.phone,
      address: editForm.address,
      height: Number(editForm.height),
      weight: Number(editForm.weight),
      fitnessGoals: editForm.fitnessGoals,
      emergencyContact: {
        name: editForm.emergencyName,
        phone: editForm.emergencyPhone,
        relation: editForm.emergencyRelation
      }
    };

    StorageService.updateMember(updated);
    setCurrentMember(updated);
    onMemberUpdated(updated);
    setEditProfileOpen(false);
  };

  // Change Password for User
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg({ text: '', isError: false });

    if (currentMember.password && oldPassword !== currentMember.password) {
      setPasswordMsg({ text: 'Current password does not match.', isError: true });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ text: 'New password must be at least 6 characters.', isError: true });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'New passwords do not match.', isError: true });
      return;
    }

    const updated = { ...currentMember, password: newPassword };
    StorageService.updateMember(updated);
    setCurrentMember(updated);
    onMemberUpdated(updated);
    setPasswordMsg({ text: 'Password successfully updated!', isError: false });
    setTimeout(() => {
      setChangePasswordOpen(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMsg({ text: '', isError: false });
    }, 1500);
  };

  const handleQuickRenew = () => {
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);

    const updated: Member = {
      ...currentMember,
      startDate: today.toISOString().split('T')[0],
      expiryDate: nextYear.toISOString().split('T')[0],
      status: 'Active',
      paymentStatus: 'Paid'
    };

    StorageService.updateMember(updated);
    setCurrentMember(updated);
    onMemberUpdated(updated);
    alert('Membership renewed for 1 Year! Your access pass has been updated.');
  };

  const handleResendEmail = () => {
    StorageService.sendExpiryNotificationEmail(currentMember, false);
    setEmailSentToast(true);
    setTimeout(() => setEmailSentToast(false), 4500);
  };

  return (
    <div className="min-h-screen bg-gym-black pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-7">
        
        {/* Navigation Bar inside Member Portal */}
        <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-gym-border/80">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
            >
              ← Back to Main Site
            </button>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-gym-neon" />
              <span className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
                RG FLEX FIRE ATHLETE PORTAL
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditProfileOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gym-card hover:bg-gym-cardHover text-xs font-semibold text-slate-200 border border-gym-border hover:border-slate-500 flex items-center gap-1.5 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5 text-gym-neon" />
              <span>Edit Details</span>
            </button>

            {/* Change User Password Trigger */}
            <button
              onClick={() => setChangePasswordOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gym-card hover:bg-gym-cardHover text-xs font-semibold text-slate-200 border border-gym-border hover:border-slate-500 flex items-center gap-1.5 transition-all"
            >
              <Key className="w-3.5 h-3.5 text-gym-cyan" />
              <span>Change Password</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-xs font-semibold text-red-300 border border-red-500/30 flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Expiry Alerts & Warnings */}
        {currentMember.status === 'Expiring Soon' && (
          <div className="glass-card bg-amber-950/40 border-2 border-amber-500/60 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400 shrink-0">
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h4 className="text-base font-bold font-heading text-amber-300 uppercase tracking-wide">
                  MEMBERSHIP EXPIRING SOON ({daysRemaining} DAYS REMAINING)
                </h4>
                <p className="text-xs text-amber-200/90 mt-0.5">
                  Your {currentMember.plan} expires on <strong className="underline">{currentMember.expiryDate}</strong>. Contact Sachin R or Kiran R to renew.
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-300 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/40">
                    <Mail className="w-3.5 h-3.5 text-gym-neon shrink-0" />
                    <span>Automated email reminder dispatched to <strong>{currentMember.email}</strong></span>
                  </div>
                  <button
                    onClick={handleResendEmail}
                    className="text-[10px] font-mono font-bold text-gym-neon hover:text-white underline px-1"
                  >
                    Resend Notice
                  </button>
                  {emailSentToast && (
                    <span className="text-[10px] text-gym-neon font-bold animate-in fade-in">
                      ✓ Email reminder resent!
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleQuickRenew}
              className="btn-neon px-5 py-2.5 rounded-xl text-xs uppercase font-bold shrink-0 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Renew Membership</span>
            </button>
          </div>
        )}

        {/* Top Welcome Banner */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-gym-border shadow-glass relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative">
                <img
                  src={currentMember.photoUrl}
                  alt={currentMember.fullName}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-gym-neon shadow-neon"
                />
                <span className={`absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider ${
                  currentMember.status === 'Active'
                    ? 'bg-gym-neon text-gym-black shadow-neon'
                    : currentMember.status === 'Expiring Soon'
                    ? 'bg-amber-400 text-black'
                    : 'bg-red-500 text-white'
                }`}>
                  {currentMember.status}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                    {currentMember.fullName}
                  </h1>
                  <span className="bg-gym-cardHover text-gym-neon text-xs font-mono font-bold px-2.5 py-1 rounded-lg border border-gym-neon/30">
                    {currentMember.id}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  {currentMember.plan} • Member Since {currentMember.joiningDate}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gym-cyan" />
                    Valid Until: <strong className="text-slate-200">{currentMember.expiryDate}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-gym-neon" />
                    Payment: <strong className="text-gym-neon">₹{currentMember.amount}/- ({currentMember.paymentStatus})</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: Download PDF & Print Card */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <button
                onClick={handleDownloadPDF}
                disabled={downloadingPdf}
                className="flex-1 lg:flex-initial btn-neon px-5 py-3.5 rounded-xl font-heading text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-neon transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <Download className="w-4 h-4 font-bold" />
                <span>{downloadingPdf ? 'Generating PDF...' : 'Download My Details (PDF)'}</span>
              </button>

              <button
                onClick={handlePrintCard}
                className="flex-1 lg:flex-initial bg-gym-card hover:bg-gym-cardHover text-white px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-gym-border hover:border-slate-500 flex items-center justify-center gap-2 transition-all"
              >
                <Printer className="w-4 h-4 text-gym-cyan" />
                <span>Print Card</span>
              </button>
            </div>

          </div>

          {pdfSuccess && (
            <div className="mt-4 p-3 bg-emerald-950/60 border border-emerald-500/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-gym-neon shrink-0" />
              <span>Downloaded: <strong>RGFLEXFIRE_{currentMember.id}_MemberDetails.pdf</strong></span>
            </div>
          )}
        </div>

        {/* 2 Columns: Digital Pass & Registration Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          
          {/* Left Column: Digital Gym Pass (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400 tracking-wider">
                <span>DIGITAL GYM PASS</span>
                <span className="text-gym-neon font-bold">NFC & QR ACTIVE</span>
              </div>

              {/* Holographic Card Container */}
              <div
                id="printable-membership-card"
                className="relative rounded-2xl p-6 bg-gradient-to-br from-gym-card via-gym-darker to-[#09151F] border-2 border-gym-neon/60 shadow-neon overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gym-border/80 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gym-neon flex items-center justify-center font-black text-gym-black shadow-neon">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-heading text-base font-black text-white tracking-wider">
                        RG <span className="text-gym-neon">FLEX FIRE</span>
                      </span>
                      <span className="text-[8px] uppercase tracking-widest text-slate-400 block -mt-1 font-mono">
                        Lakshmikant Nagara, Mysore
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-gym-neon/20 border border-gym-neon text-gym-neon font-mono text-[10px] font-bold">
                    {currentMember.plan.split(' ')[0].toUpperCase()}
                  </span>
                </div>

                {/* Card Body */}
                <div className="flex items-center gap-3.5 py-1">
                  <img
                    src={currentMember.photoUrl}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover border-2 border-gym-border shrink-0"
                  />

                  <div className="space-y-0.5 min-w-0 flex-1 text-left">
                    <h3 className="text-sm font-bold font-heading text-white truncate">
                      {currentMember.fullName}
                    </h3>
                    <div className="text-xs font-mono text-gym-neon font-bold">
                      ID: {currentMember.id}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      VALID: {currentMember.startDate} to {currentMember.expiryDate}
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="bg-white p-1.5 rounded-lg shrink-0">
                    <QRCodeSVG
                      value={`RGFLEXFIRE:${currentMember.id}:${currentMember.fullName}:${currentMember.status}`}
                      size={54}
                    />
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-3 pt-2.5 border-t border-gym-border/70 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>#64, MIG 1st Floor, Hebbal</span>
                  <span className="text-emerald-400 font-bold">AUTHORIZED PASS</span>
                </div>
              </div>

              <button
                onClick={handlePrintCard}
                className="w-full py-2.5 rounded-xl bg-gym-card hover:bg-gym-cardHover text-xs font-semibold text-slate-200 border border-gym-border flex items-center justify-center gap-2"
              >
                <Printer className="w-3.5 h-3.5 text-gym-neon" />
                <span>Print Physical Card</span>
              </button>
            </div>

            {/* Attendance Log */}
            <div className="glass-card p-5 rounded-2xl border border-gym-border space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold font-heading text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-gym-neon" />
                  <span>PERSONAL ATTENDANCE LOG</span>
                </h3>
                <span className="text-xs font-mono text-gym-neon font-bold">
                  {memberAttendance.length} Sessions
                </span>
              </div>

              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {memberAttendance.length > 0 ? (
                  memberAttendance.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-2.5 bg-gym-darker rounded-xl border border-gym-border/70 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">{rec.date}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{rec.type}</div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-gym-neon font-bold">IN: {rec.checkInTime}</div>
                        {rec.checkOutTime && <div className="text-slate-400 text-[10px]">OUT: {rec.checkOutTime}</div>}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-500 text-center py-3">No check-ins logged yet.</div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Registration Details (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Section 1: Personal Details */}
            <div className="glass-card p-6 rounded-2xl border border-gym-border space-y-4">
              <div className="flex items-center justify-between border-b border-gym-border/70 pb-3">
                <h3 className="text-sm font-bold font-heading text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-gym-neon" />
                  <span>1. ATHLETE PERSONAL INFORMATION</span>
                </h3>
                <button
                  onClick={() => setEditProfileOpen(true)}
                  className="text-xs text-gym-neon hover:underline font-mono flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" /> Edit Details
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-gym-darker rounded-xl border border-gym-border/60">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Full Name</span>
                  <span className="font-semibold text-white text-sm mt-0.5 block">{currentMember.fullName}</span>
                </div>
                <div className="p-3 bg-gym-darker rounded-xl border border-gym-border/60">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Member ID</span>
                  <span className="font-semibold text-gym-neon font-mono text-sm mt-0.5 block">{currentMember.id}</span>
                </div>
                <div className="p-3 bg-gym-darker rounded-xl border border-gym-border/60">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Phone Number</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block font-mono">{currentMember.phone}</span>
                </div>
                <div className="p-3 bg-gym-darker rounded-xl border border-gym-border/60">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Date of Birth</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block font-mono">{currentMember.dob} ({currentMember.gender})</span>
                </div>
                <div className="sm:col-span-2 p-3 bg-gym-darker rounded-xl border border-gym-border/60">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Residential Address</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">{currentMember.address}</span>
                </div>
                <div className="sm:col-span-2 p-3 bg-gym-darker rounded-xl border border-gym-border/60">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Emergency Contact</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">
                    {currentMember.emergencyContact.name} ({currentMember.emergencyContact.relation}) - <span className="text-gym-neon font-mono">{currentMember.emergencyContact.phone}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Package & Subscription */}
            <div className="glass-card p-6 rounded-2xl border border-gym-border space-y-4">
              <div className="border-b border-gym-border/70 pb-3">
                <h3 className="text-sm font-bold font-heading text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>2. PACKAGE SUBSCRIPTION & PAYMENT DETAILS</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-gym-darker rounded-xl border border-gym-border/60">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Package Tier</span>
                  <span className="font-bold text-white text-sm mt-0.5 block">{currentMember.plan}</span>
                </div>
                <div className="p-3 bg-gym-darker rounded-xl border border-gym-border/60">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Package Fee</span>
                  <span className="font-heading text-lg font-bold text-gym-neon mt-0.5 block">₹{currentMember.amount}/- INR</span>
                </div>
                <div className="p-3 bg-gym-darker rounded-xl border border-gym-border/60">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Coverage Start Date</span>
                  <span className="font-mono text-slate-200 mt-0.5 block">{currentMember.startDate}</span>
                </div>
                <div className="p-3 bg-gym-darker rounded-xl border border-gym-border/60">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Coverage Expiry Date</span>
                  <span className="font-mono text-gym-neon font-bold mt-0.5 block">{currentMember.expiryDate}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleDownloadPDF}
                  disabled={downloadingPdf}
                  className="w-full btn-neon py-3.5 rounded-xl font-heading text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-neon"
                >
                  <Download className="w-4 h-4 font-bold" />
                  <span>Download Registration Dossier (PDF)</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* CHANGE USER PASSWORD MODAL */}
      {changePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card bg-gym-darker max-w-sm w-full p-6 rounded-2xl border border-gym-neon/40 shadow-neon space-y-4">
            <div className="flex items-center justify-between border-b border-gym-border pb-3">
              <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-gym-cyan" />
                <span>CHANGE MEMBER PASSWORD</span>
              </h3>
              <button onClick={() => setChangePasswordOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {passwordMsg.text && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                passwordMsg.isError ? 'bg-red-500/10 text-red-300 border border-red-500/30' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
              }`}>
                {passwordMsg.isError ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-300 font-mono block mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-300 font-mono block mb-1">
                  New Password (min 6 chars)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-300 font-mono block mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setChangePasswordOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-neon px-4 py-2 rounded-xl uppercase font-bold"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {editProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-card bg-gym-darker max-w-lg w-full p-6 sm:p-8 rounded-2xl border border-gym-neon/40 shadow-neon space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gym-border pb-3">
              <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-gym-neon" />
                <span>UPDATE DETAILS</span>
              </h3>
              <button onClick={() => setEditProfileOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-300 font-mono block mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-300 font-mono block mb-1">Residential Address</label>
                <input
                  type="text"
                  required
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-300 font-mono block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={editForm.height}
                    onChange={(e) => setEditForm({ ...editForm, height: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-300 font-mono block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={editForm.weight}
                    onChange={(e) => setEditForm({ ...editForm, weight: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditProfileOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                <button type="submit" className="btn-neon px-5 py-2.5 rounded-xl uppercase font-bold">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
