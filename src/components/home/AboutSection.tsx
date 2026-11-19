import React from 'react';
import { Shield, Zap, Target, CheckCircle2, Award } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-gym-darker relative overflow-hidden border-t border-gym-border/40">
      {/* Decorative neon accent glow */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-gym-neon/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gym-card border border-gym-neon/30 text-gym-neon text-xs font-bold tracking-widest uppercase">
            <Award className="w-3.5 h-3.5" />
            <span>The GymForge Standard</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight">
            NOT JUST A GYM. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gym-neon to-emerald-400">
              AN EVOLUTIONARY SYSTEM.
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Founded on the intersection of human physiological science and modern digital intelligence, GYMFORGE provides high-performance athletes, busy professionals, and fitness beginners with an uncompromising environment to reach their highest potential.
          </p>
        </div>

        {/* 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Media Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-gym-border shadow-glass">
              <img
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=900&q=80"
                alt="GymForge Interior"
                className="w-full h-[440px] object-cover filter brightness-90 contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gym-black via-transparent to-transparent" />
              
              {/* Floating Stat Card */}
              <div className="absolute bottom-6 left-6 right-6 glass-card p-5 rounded-xl border border-gym-neon/30 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-mono">FACILITY FOOTPRINT</div>
                  <div className="text-2xl font-bold font-heading text-white">35,000 SQ FT</div>
                  <div className="text-xs text-gym-neon font-medium">Olympic Calibrated Hardware</div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gym-neon/20 border border-gym-neon flex items-center justify-center text-gym-neon font-bold">
                  24/7
                </div>
              </div>
            </div>
          </div>

          {/* Right Feature Highlights */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white font-heading">
                PRECISION TRAINING MEETS UNMATCHED HOSPITALITY
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                Every square meter of GYMFORGE has been engineered to eliminate friction from your training regimen. From touchless QR turnstiles to real-time biometric telemetry and cryo recovery, you spend zero time waiting and 100% of your energy breaking plateaus.
              </p>
            </div>

            {/* Checklist of Unique Features */}
            <div className="space-y-3.5 pt-2">
              {[
                { title: 'Fully Integrated Cloud Member Dossier', desc: 'Real-time membership cards, attendance history, and instant downloadable PDF registration dossiers.' },
                { title: 'Olympic Calibrated Steel Plates & Bars', desc: 'Eleiko, Rogue, and calibrated competition platforms with shock-absorbing sound barriers.' },
                { title: 'Cryotherapy & Contrast Hydrotherapy Suite', desc: 'Accelerate systemic recovery, flush lactic acid, and decrease recovery times by over 40%.' },
                { title: 'Touchless QR Code & Biometric Turnstiles', desc: 'Instant authorized entry using your phone’s live security token or fingerprint.' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-gym-card/60 border border-gym-border/70 hover:border-gym-neon/40 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-gym-neon/15 border border-gym-neon/40 flex items-center justify-center shrink-0 mt-0.5 text-gym-neon">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-heading">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
