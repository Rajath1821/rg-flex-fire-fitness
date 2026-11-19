import React, { useState } from 'react';
import { Flame, User, Menu, X, ArrowRight, LogOut, Phone, Shield } from 'lucide-react';
import { Member } from '../../types';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, sectionId?: string) => void;
  isAdmin: boolean;
  loggedMember: Member | null;
  onAdminLogout: () => void;
  onMemberLogout: () => void;
  onOpenJoinModal: (plan?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  isAdmin,
  loggedMember,
  onAdminLogout,
  onMemberLogout,
  onOpenJoinModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (currentView !== 'home') {
      onNavigate('home', id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gym-darker/90 backdrop-blur-md border-b border-gym-border/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Brand Logo: RG FLEX FIRE FITNESS */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-gym-neon via-emerald-500 to-gym-orange flex items-center justify-center shadow-neon group-hover:scale-105 transition-transform duration-300">
              <Flame className="w-6 h-6 text-gym-black font-extrabold stroke-[2.5]" />
              <div className="absolute -inset-1 bg-gym-neon rounded-xl blur-sm opacity-40 group-hover:opacity-80 transition-opacity" />
            </div>
            <div>
              <span className="font-heading text-lg sm:text-xl font-black tracking-wider text-white flex items-center gap-1.5">
                RG <span className="text-gym-neon drop-shadow-[0_0_12px_rgba(0,255,102,0.8)]">FLEX FIRE</span> FITNESS
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400 block -mt-1 font-mono">
                Lakshmikant Nagara, Mysore
              </span>
            </div>
          </div>

          {/* Navigation Links: Home, Packages, Facilities, Contact */}
          <div className="hidden lg:flex items-center gap-7 text-sm font-semibold">
            <button
              onClick={() => scrollToSection('hero')}
              className={`hover:text-gym-neon transition-colors ${currentView === 'home' ? 'text-white' : 'text-slate-400'}`}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('plans')}
              className="text-slate-300 hover:text-gym-neon transition-colors"
            >
              Packages (From ₹899)
            </button>
            <button
              onClick={() => scrollToSection('facilities')}
              className="text-slate-300 hover:text-gym-neon transition-colors"
            >
              Facilities
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-slate-300 hover:text-gym-neon transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-gym-neon" />
              <span>Contact Us</span>
            </button>
          </div>

          {/* Desktop Direct Buttons: User Portal (No Admin Access shown to Users) */}
          <div className="hidden md:flex items-center gap-2.5">

            {/* User / Member Page Button */}
            {loggedMember ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onNavigate('user')}
                  className="flex items-center gap-2 bg-gym-card hover:bg-gym-cardHover text-white px-3.5 py-2 rounded-xl text-xs border border-gym-neon/50 transition-all"
                >
                  <img
                    src={loggedMember.photoUrl}
                    alt={loggedMember.fullName}
                    className="w-5 h-5 rounded-full object-cover border border-gym-neon"
                  />
                  <span className="font-bold text-slate-200">{loggedMember.fullName.split(' ')[0]}</span>
                  <span className="bg-gym-neon/20 text-gym-neon text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">User Portal</span>
                </button>
                <button
                  onClick={onMemberLogout}
                  title="Logout Member"
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('user')}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-slate-200 hover:text-white bg-gym-card hover:bg-gym-cardHover border border-gym-neon/50 hover:border-gym-neon transition-all shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-gym-neon" />
                <span>User Portal</span>
              </button>
            )}

            {/* ONLY show Admin Panel button if administrator is ALREADY authenticated */}
            {isAdmin && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onNavigate('admin')}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-gym-neon text-gym-black font-extrabold px-3 py-2 rounded-xl text-xs shadow-neon"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </button>
                <button
                  onClick={onAdminLogout}
                  title="Logout Admin"
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Join CTA */}
            <button
              onClick={() => onOpenJoinModal()}
              className="btn-neon px-4 py-2 rounded-xl font-heading text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-neon ml-1"
            >
              <span>Join Now</span>
              <ArrowRight className="w-3.5 h-3.5 font-bold" />
            </button>
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onOpenJoinModal()}
              className="bg-gym-neon text-gym-black text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-neon"
            >
              Join
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-gym-card focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gym-darker/95 border-b border-gym-border px-4 pt-3 pb-6 space-y-3 backdrop-blur-xl">
          <div className="space-y-1 pb-3 border-b border-gym-border text-sm font-semibold">
            <button
              onClick={() => scrollToSection('hero')}
              className="w-full text-left py-2 px-3 text-slate-200 hover:bg-gym-card rounded-lg"
            >
              Home Page
            </button>
            <button
              onClick={() => scrollToSection('plans')}
              className="w-full text-left py-2 px-3 text-slate-200 hover:bg-gym-card rounded-lg"
            >
              Packages & Pricing (From ₹899)
            </button>
            <button
              onClick={() => scrollToSection('facilities')}
              className="w-full text-left py-2 px-3 text-slate-200 hover:bg-gym-card rounded-lg"
            >
              Gym Facilities
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="w-full text-left py-2 px-3 text-slate-200 hover:bg-gym-card rounded-lg flex items-center justify-between"
            >
              <span>Contact Us</span>
              <span className="text-[10px] text-gym-neon font-mono">9964671267</span>
            </button>
          </div>

          <div className="space-y-2 pt-2">
            {loggedMember ? (
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('user'); }}
                className="w-full flex items-center justify-between p-3 bg-gym-card rounded-xl border border-gym-neon/40 text-xs font-bold text-white"
              >
                <span>User Portal ({loggedMember.fullName})</span>
                <span className="text-gym-neon">Open →</span>
              </button>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('user'); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gym-card border border-gym-border text-sm font-semibold text-slate-200"
              >
                <User className="w-4 h-4 text-gym-neon" />
                <span>User Portal</span>
              </button>
            )}

            {/* ONLY visible if admin is already signed in */}
            {isAdmin && (
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigate('admin'); }}
                className="w-full flex items-center justify-between p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/40 text-xs font-bold text-emerald-300"
              >
                <span>Admin Dashboard</span>
                <span>Open →</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
