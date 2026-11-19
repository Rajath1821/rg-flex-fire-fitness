import React from 'react';
import { GYM_TESTIMONIALS } from '../../data/mockData';
import { Star, Quote, CheckCircle2, TrendingUp } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-24 bg-gym-darker relative overflow-hidden border-t border-gym-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gym-card border border-gym-neon/30 text-gym-neon text-xs font-bold tracking-widest uppercase">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Proven Transformations</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight">
            WHAT OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-gym-neon via-emerald-400 to-teal-300">ATHLETES SAY</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Real feedback from members who stepped onto our training floor and turned their fitness goals into reality.
          </p>
        </div>

        {/* Testimonials 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {GYM_TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="glass-card p-7 rounded-2xl border border-gym-border hover:border-gym-neon/40 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-glass relative"
            >
              <div className="space-y-4">
                {/* Top Quote Icon & Stars */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-gym-border group-hover:text-gym-neon/30 transition-colors" />
                </div>

                {/* Quote Text */}
                <p className="text-sm text-slate-300 italic leading-relaxed">
                  "{t.quote}"
                </p>

                {/* Transformation highlight tag */}
                <div className="flex items-center gap-2 p-2.5 bg-gym-black/70 rounded-xl border border-gym-neon/30">
                  <TrendingUp className="w-4 h-4 text-gym-neon shrink-0" />
                  <span className="text-xs font-bold text-gym-neon font-mono">{t.transformation}</span>
                </div>
              </div>

              {/* Member details bottom */}
              <div className="pt-6 mt-6 border-t border-gym-border/60 flex items-center gap-3.5">
                <img
                  src={t.photoUrl}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gym-neon"
                />
                <div>
                  <h4 className="text-sm font-bold font-heading text-white">{t.name}</h4>
                  <p className="text-xs text-slate-400">{t.role}</p>
                  <span className="text-[10px] text-gym-neon font-mono font-medium">{t.memberSince}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
