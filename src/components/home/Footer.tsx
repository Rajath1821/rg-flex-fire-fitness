import React from 'react';
import { Flame, ArrowUp, MapPin, User } from 'lucide-react';
import { GYM_CONTACT_INFO } from '../../data/mockData';

interface FooterProps {
  onNavigate: (view: string, sectionId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gym-black border-t border-gym-border/80 pt-14 pb-10 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-28 bg-gym-neon/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-gym-border/60">
          
          {/* Brand & Address (5 Cols) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gym-neon flex items-center justify-center shadow-neon">
                <Flame className="w-5 h-5 text-gym-black font-black" />
              </div>
              <span className="font-heading text-xl font-black text-white">
                RG <span className="text-gym-neon">FLEX FIRE</span> FITNESS
              </span>
            </div>
            
            <p className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
              <MapPin className="w-4 h-4 text-gym-neon shrink-0 mt-0.5" />
              <span>#64, MIG First Floor, Lakshmikant Nagara, Hebbal 1st Stage, Mysore</span>
            </p>

            <div className="text-xs text-slate-400 space-y-1 pt-1">
              <div className="font-bold text-white font-mono text-[11px] uppercase">Direct Inquiries:</div>
              {GYM_CONTACT_INFO.contacts.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-300">
                  <span className="text-gym-neon">•</span>
                  <span>{c.name}{'role' in c && c.role ? ` (${c.role})` : ''}:</span>
                  <a href={`tel:${c.phone}`} className="font-mono text-gym-neon font-bold hover:underline">{c.phone}</a>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Pages (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-bold text-white tracking-widest font-mono">
              Gym Pages
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              <li><button onClick={() => onNavigate('home', 'hero')} className="hover:text-gym-neon transition-colors">Home Page</button></li>
              <li><button onClick={() => onNavigate('home', 'plans')} className="hover:text-gym-neon transition-colors">Packages & Pricing (From ₹899)</button></li>
              <li><button onClick={() => onNavigate('home', 'facilities')} className="hover:text-gym-neon transition-colors">Facilities & Equipment</button></li>
              <li><button onClick={() => onNavigate('home', 'contact')} className="hover:text-gym-neon transition-colors">Contact Page</button></li>
            </ul>
          </div>

          {/* Member Portal Access (4 Cols - Admin removed from user view) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs uppercase font-bold text-white tracking-widest font-mono">
              Member Portal
            </h4>
            <div className="space-y-2.5">
              <button
                onClick={() => onNavigate('user')}
                className="w-full text-left p-3 bg-gym-card hover:bg-gym-cardHover rounded-xl border border-gym-neon/40 hover:border-gym-neon flex items-center justify-between text-xs transition-all shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-gym-neon" />
                  <div>
                    <span className="font-bold text-white block">User / Member Portal</span>
                    <span className="text-[10px] text-slate-400">View pass, download PDF, streak</span>
                  </div>
                </div>
                <span className="text-[10px] text-gym-neon font-mono font-bold">Open →</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} RG FLEX FIRE FITNESS. Lakshmikant Nagara, Hebbal 1st Stage, Mysore. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-lg bg-gym-card hover:bg-gym-cardHover border border-gym-border flex items-center justify-center text-slate-300 hover:text-gym-neon transition-colors"
              title="Scroll to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
