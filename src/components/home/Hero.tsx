import React from 'react';
import { ArrowRight, Flame, User, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { GYM_CONTACT_INFO } from '../../data/mockData';

interface HeroProps {
  onJoinClick: () => void;
  onExplorePlans: () => void;
  onGoToMember: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onJoinClick,
  onExplorePlans,
  onGoToMember
}) => {
  return (
    <section id="hero" className="relative min-h-[90vh] pt-28 pb-16 flex items-center justify-center overflow-hidden bg-gym-black">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=85"
          alt="RG Flex Fire Fitness Facility"
          className="w-full h-full object-cover object-center opacity-25 filter brightness-75 contrast-125 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gym-black via-gym-black/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-gym-black via-gym-black/85 to-transparent" />
        <div className="absolute inset-0 bg-cyber-grid opacity-30 pointer-events-none" />
      </div>

      {/* Futuristic Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gym-neon/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-gym-orange/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Main Hero Copy (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Location Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gym-card/90 border border-gym-neon/40 shadow-neon backdrop-blur-md">
              <MapPin className="w-4 h-4 text-gym-neon shrink-0 animate-bounce" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                #64, MIG 1st Floor, Lakshmikant Nagara, Hebbal 1st Stage, Mysore
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.08] text-white uppercase">
              BUILD YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">BODY.</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gym-neon via-emerald-400 to-teal-300 drop-shadow-[0_0_35px_rgba(0,255,102,0.4)]">
                TRANSFORM
              </span> YOUR LIFE.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
              Welcome to <strong className="text-gym-neon">RG FLEX FIRE FITNESS</strong>. Your neighborhood power & transformation center in Lakshmikant Nagara, Mysore. Heavy free weights, high-impact cardio, couples training, and dedicated mentorship from Sachin R & Kiran R.
            </p>

            {/* Packages Highlight Banner */}
            <div className="p-3.5 bg-gym-card/80 rounded-2xl border border-gym-border/80 max-w-xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-300">
                Packages starting from only <strong className="text-gym-neon text-base font-heading">₹899/-</strong>
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                Couples Plan: ₹4,799/- (3 Months)
              </span>
            </div>

            {/* Direct CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={onJoinClick}
                className="btn-neon px-7 py-3.5 rounded-xl font-heading text-sm uppercase tracking-wider flex items-center gap-2.5 shadow-neon"
              >
                <span>Join Now</span>
                <ArrowRight className="w-4 h-4 font-bold" />
              </button>

              <button
                onClick={onExplorePlans}
                className="btn-outline-neon px-6 py-3.5 rounded-xl font-heading text-sm uppercase tracking-wider flex items-center gap-2"
              >
                <span>View Packages (From ₹899)</span>
              </button>

              <a
                href="#contact"
                className="px-5 py-3.5 rounded-xl bg-gym-card hover:bg-gym-cardHover text-xs font-bold uppercase tracking-wider text-slate-200 border border-gym-border hover:border-slate-500 flex items-center gap-2 transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-gym-neon" />
                <span>Contact Us</span>
              </a>
            </div>

            {/* USER / MEMBER PORTAL ACCESS CARD (Only User Page displayed here - Admin access removed) */}
            <div className="pt-3 max-w-md">
              <button
                onClick={onGoToMember}
                className="w-full p-4 rounded-2xl bg-gym-darker/90 hover:bg-gym-card border-2 border-gym-neon/60 hover:border-gym-neon flex items-center justify-between text-left transition-all group shadow-neon"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-gym-neon/20 border border-gym-neon flex items-center justify-center text-gym-neon group-hover:bg-gym-neon group-hover:text-gym-black transition-colors shrink-0">
                    <User className="w-5 h-5 font-bold" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-white font-heading tracking-wide flex items-center gap-2">
                      <span>USER / MEMBER PORTAL</span>
                      <span className="text-[10px] bg-gym-neon text-gym-black font-mono font-bold px-1.5 py-0.2 rounded">
                        ATHLETE ACCESS
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 mt-0.5">
                      View QR Pass • Download Registration Details PDF • Attendance
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gym-neon group-hover:translate-x-1 transition-transform shrink-0" />
              </button>
            </div>

          </div>

          {/* Right Visual Interactive Card (5 Cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              
              <div className="absolute -inset-1.5 bg-gradient-to-r from-gym-neon to-gym-orange rounded-3xl blur-xl opacity-30 pointer-events-none" />

              <div className="relative glass-card rounded-2xl p-5 border border-gym-border shadow-glass overflow-hidden space-y-4">
                
                {/* Visual Image */}
                <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
                  <img
                    src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80"
                    alt="RG Flex Fire Fitness Center"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gym-darker via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3 bg-gym-black/90 backdrop-blur-md px-3 py-1 rounded-full border border-gym-neon/40 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gym-neon animate-pulse" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">
                      RG FLEX FIRE • MYSORE
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 bg-gym-darker/90 backdrop-blur-md p-2.5 rounded-xl border border-gym-border text-xs">
                    <div className="text-[10px] text-slate-400 font-mono">GYM ADDRESS</div>
                    <div className="text-xs font-bold text-white truncate">
                      #64, MIG 1st Floor, Lakshmikant Nagara, Hebbal
                    </div>
                  </div>
                </div>

                {/* Team Quick Contact Strip */}
                <div className="p-3 bg-gym-darker rounded-xl border border-gym-border/80 space-y-2">
                  <span className="text-[10px] uppercase font-mono font-bold text-gym-neon block">
                    Direct Contact Mentors:
                  </span>
                  <div className="grid grid-cols-1 gap-1.5 text-xs">
                    {GYM_CONTACT_INFO.contacts.map((c, i) => (
                      <a
                        key={i}
                        href={`tel:${c.phone}`}
                        className="flex items-center justify-between p-2 rounded-lg bg-gym-card hover:bg-gym-cardHover text-slate-200 border border-gym-border/60"
                      >
                        <span className="font-bold text-white">{c.name}</span>
                        <span className="font-mono text-gym-neon font-bold flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {c.phone}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
