import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowLeft, AlertCircle, ArrowRight, Flame } from 'lucide-react';
import { StorageService } from '../../services/storage';
import { Member } from '../../types';

interface MemberLoginProps {
  onSuccess: (member: Member) => void;
  onBackToHome: () => void;
  onGoToJoin: () => void;
}

export const MemberLogin: React.FC<MemberLoginProps> = ({ onSuccess, onBackToHome, onGoToJoin }) => {
  const [identifier, setIdentifier] = useState('rohan.gowda@gmail.com');
  const [password, setPassword] = useState('member123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const member = StorageService.findMemberByCredential(identifier);

    if (!member) {
      setError('No member account found with this Phone, Email, or Member ID.');
      return;
    }

    if (member.password && member.password !== password) {
      setError('Incorrect member password. Please check or contact Sachin R / Kiran R.');
      return;
    }

    StorageService.setMemberSession(member.id);
    onSuccess(member);
  };

  const handleDemoSelect = (id: string) => {
    const m = StorageService.getMemberById(id);
    if (m) {
      setIdentifier(m.phone || m.email);
      setPassword(m.password || 'member123');
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-gym-black relative flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-gym-neon/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-gym-orange/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Back button */}
      <button
        onClick={onBackToHome}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-gym-card/80 px-3.5 py-2 rounded-xl border border-gym-border hover:border-slate-500 transition-all z-20"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home Page</span>
      </button>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-to-r from-gym-neon to-gym-orange rounded-3xl blur-md opacity-30" />

        <div className="relative glass-card bg-gym-darker/95 p-8 sm:p-10 rounded-3xl border border-gym-border shadow-glass">
          
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gym-neon to-emerald-600 mx-auto flex items-center justify-center shadow-neon">
              <Flame className="w-8 h-8 text-gym-black stroke-[2.5]" />
            </div>
            
            <h1 className="text-2xl font-extrabold font-heading text-white tracking-wider">
              USER / MEMBER <span className="text-gym-neon">PORTAL</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              RG FLEX FIRE FITNESS • Lakshmikant Nagara, Mysore
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/40 rounded-xl flex items-start gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs uppercase font-bold text-slate-300 font-mono tracking-wider">
                Phone Number, Email, or Member ID
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. 9964671267 or RG-2024-001"
                className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase font-bold text-slate-300 font-mono tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-gym-neon" />
                  <span>Portal Password</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">Default: member123</span>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl glass-input text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-neon py-3.5 rounded-xl font-heading text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-neon mt-2"
            >
              <span>Open Member Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Athletes */}
          <div className="mt-6 pt-5 border-t border-gym-border/70 space-y-2">
            <div className="text-[11px] text-slate-400 font-mono uppercase text-center">
              Quick Test Athlete Accounts:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSelect('RG-2024-001')}
                className="text-left p-2 rounded-lg bg-gym-card hover:bg-gym-cardHover border border-gym-border text-[11px] text-slate-300 hover:text-white"
              >
                <span className="font-bold block text-white">Rohan Gowda</span>
                <span className="text-[10px] text-gym-neon font-mono">RG-2024-001</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoSelect('RG-2024-002')}
                className="text-left p-2 rounded-lg bg-gym-card hover:bg-gym-cardHover border border-amber-500/30 text-[11px] text-slate-300 hover:text-white"
              >
                <span className="font-bold block text-white">Ananya Sharma</span>
                <span className="text-[10px] text-amber-400 font-mono">Expiring Soon (4d)</span>
              </button>
            </div>
          </div>

          <div className="mt-5 text-center text-xs text-slate-400">
            Want to join RG Flex Fire Fitness?{' '}
            <button
              onClick={onGoToJoin}
              className="text-gym-neon font-bold hover:underline"
            >
              Join Now (From ₹899)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
