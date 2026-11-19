import React from 'react';
import { WHY_CHOOSE_US } from '../../data/mockData';
import { QrCode, Dumbbell, Flame, ShieldCheck, Users, Clock, Zap } from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'QrCode': return <QrCode className="w-6 h-6 text-gym-neon" />;
      case 'Dumbbell': return <Dumbbell className="w-6 h-6 text-gym-cyan" />;
      case 'Flame': return <Flame className="w-6 h-6 text-gym-orange" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
      case 'Users': return <Users className="w-6 h-6 text-purple-400" />;
      case 'Clock': return <Clock className="w-6 h-6 text-amber-400" />;
      default: return <Zap className="w-6 h-6 text-gym-neon" />;
    }
  };

  return (
    <section className="py-24 bg-gym-black relative overflow-hidden border-t border-gym-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gym-card border border-gym-neon/30 text-gym-neon text-xs font-bold tracking-widest uppercase">
            <Zap className="w-3.5 h-3.5" />
            <span>The Competitive Edge</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight">
            WHY CHOOSE <span className="text-transparent bg-clip-text bg-gradient-to-r from-gym-neon to-emerald-400">GYMFORGE</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Engineered for members who refuse ordinary gyms. Where biometric innovation powers real-world athletic triumphs.
          </p>
        </div>

        {/* 6 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WHY_CHOOSE_US.map((item, index) => (
            <div
              key={index}
              className="glass-card p-7 rounded-2xl border border-gym-border hover:border-gym-neon/40 transition-all duration-300 group hover:-translate-y-1 shadow-md relative overflow-hidden"
            >
              {/* Corner accent glow */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-gym-neon/10 rounded-full blur-2xl group-hover:bg-gym-neon/20 transition-colors" />

              <div className="w-12 h-12 rounded-xl bg-gym-cardHover border border-gym-border flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-gym-neon/50 transition-all">
                {getIcon(item.icon)}
              </div>

              <h3 className="text-lg font-bold font-heading text-white group-hover:text-gym-neon transition-colors">
                {item.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
