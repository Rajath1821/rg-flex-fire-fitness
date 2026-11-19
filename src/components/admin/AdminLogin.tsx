import React, { useState } from 'react';
import { Shield, Lock, User, Eye, EyeOff, ArrowLeft, AlertCircle, KeyRound, Flame } from 'lucide-react';
import { StorageService } from '../../services/storage';

interface AdminLoginProps {
  onSuccess: () => void;
  onBackToHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onBackToHome }) => {
  const currentAdminPass = StorageService.getAdminPassword();
  const [username, setUsername] = useState('admin@rgflexfire.com');
  const [password, setPassword] = useState(currentAdminPass);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validUsernames = ['admin', 'admin@rgflexfire.com', 'sachin', 'kiran', 'admin@gymforge.com'];
    const activePass = StorageService.getAdminPassword();

    if (validUsernames.includes(username.trim().toLowerCase()) && password === activePass) {
      StorageService.setAdminSession(true);
      onSuccess();
    } else {
      setError(`Invalid Administrator credentials. Active default password is: "${activePass}".`);
    }
  };

  const handleFillDemo = () => {
    setUsername('admin@rgflexfire.com');
    setPassword(StorageService.getAdminPassword());
    setError('');
  };

  return (
    <div className="min-h-screen bg-gym-black relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background cyber mesh */}
      <div className="absolute inset-0 bg-cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gym-neon/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gym-orange/15 rounded-full blur-[140px] pointer-events-none" />

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
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-gym-neon to-gym-orange rounded-3xl blur-md opacity-30" />

        <div className="relative glass-card bg-gym-darker/95 p-8 sm:p-10 rounded-3xl border border-gym-border shadow-glass">
          
          {/* Header Icon */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-gym-neon mx-auto flex items-center justify-center shadow-neon">
              <Shield className="w-8 h-8 text-gym-black stroke-[2.5]" />
            </div>
            
            <h1 className="text-2xl font-extrabold font-heading text-white tracking-wider">
              ADMINISTRATOR <span className="text-gym-neon">PORTAL</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              RG FLEX FIRE FITNESS • Management & Inquiries Console
            </p>
          </div>

          {/* Error notice */}
          {error && (
            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/40 rounded-xl flex items-start gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs uppercase font-bold text-slate-300 font-mono tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gym-neon" />
                <span>Admin Username or Email</span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@rgflexfire.com"
                className="w-full px-4 py-3 rounded-xl glass-input text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase font-bold text-slate-300 font-mono tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-gym-neon" />
                  <span>Admin Security Password</span>
                </label>
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
              <KeyRound className="w-4 h-4" />
              <span>Access Admin Dashboard</span>
            </button>
          </form>

          {/* Quick Demo Credentials Helper */}
          <div className="mt-6 pt-5 border-t border-gym-border/70 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs text-slate-300 hover:text-gym-neon bg-gym-card hover:bg-gym-cardHover px-3.5 py-2 rounded-lg border border-gym-border transition-all font-mono"
            >
              ⚡ Auto-Fill Admin Credentials ({StorageService.getAdminPassword()})
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
