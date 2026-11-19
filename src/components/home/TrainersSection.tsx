import React, { useState } from 'react';
import { GYM_TRAINERS } from '../../data/mockData';
import { Star, Award, Shield, UserCheck, ChevronRight } from 'lucide-react';
import { GymTrainer } from '../../types';

export const TrainersSection: React.FC = () => {
  const [selectedTrainer, setSelectedTrainer] = useState<GymTrainer | null>(null);

  return (
    <section id="trainers" className="py-24 bg-gym-darker relative overflow-hidden border-t border-gym-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gym-card border border-gym-neon/30 text-gym-neon text-xs font-bold tracking-widest uppercase">
            <Award className="w-3.5 h-3.5" />
            <span>World-Class Coaching Faculty</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight">
            MEET OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-gym-neon via-emerald-400 to-teal-300">MASTER TRAINERS</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Certified exercise physiologists, Olympic lifters, and IFBB coaches committed to personalizing your progression, biomechanics, and diet.
          </p>
        </div>

        {/* 4 Trainers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GYM_TRAINERS.map((trainer) => (
            <div
              key={trainer.id}
              className="glass-card rounded-2xl overflow-hidden border border-gym-border hover:border-gym-neon/50 group transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5 shadow-lg"
            >
              <div>
                {/* Trainer Photo */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={trainer.photoUrl}
                    alt={trainer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gym-darker via-transparent to-transparent" />
                  
                  {/* Rating Tag */}
                  <div className="absolute top-3 right-3 bg-gym-black/85 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 border border-gym-border">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-white font-mono">{trainer.rating}</span>
                  </div>

                  {/* Experience Tag */}
                  <div className="absolute bottom-3 left-3 bg-gym-neon text-gym-black font-extrabold text-[10px] uppercase font-mono px-2.5 py-0.5 rounded shadow-neon">
                    {trainer.experience}
                  </div>
                </div>

                {/* Trainer Info */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold font-heading text-white group-hover:text-gym-neon transition-colors">
                      {trainer.name}
                    </h3>
                    <div className="text-xs text-gym-neon font-medium mt-0.5">{trainer.role}</div>
                    <div className="text-xs text-slate-400 mt-1">{trainer.specialty}</div>
                  </div>

                  {/* Certifications badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {trainer.certifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="bg-gym-cardHover text-[10px] text-slate-300 px-2 py-0.5 rounded border border-gym-border font-mono"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* View Bio Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => setSelectedTrainer(trainer)}
                  className="w-full py-2.5 rounded-xl bg-gym-dark hover:bg-gym-card text-xs font-bold text-slate-200 hover:text-white border border-gym-border hover:border-gym-neon flex items-center justify-center gap-1 transition-all"
                >
                  <span>View Full Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Trainer Detail Modal */}
        {selectedTrainer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative glass-card bg-gym-darker max-w-lg w-full rounded-2xl border border-gym-neon/40 p-6 space-y-4 shadow-neon">
              <div className="flex items-center gap-4">
                <img
                  src={selectedTrainer.photoUrl}
                  alt={selectedTrainer.name}
                  className="w-20 h-20 rounded-xl object-cover border border-gym-neon"
                />
                <div>
                  <h4 className="text-xl font-bold font-heading text-white">{selectedTrainer.name}</h4>
                  <div className="text-xs text-gym-neon font-bold">{selectedTrainer.role}</div>
                  <div className="text-xs text-slate-400">{selectedTrainer.experience}</div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{selectedTrainer.rating} Rating across 320+ Sessions</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t border-gym-border pt-3">
                <div className="text-xs uppercase font-bold text-slate-400 font-mono">Biography & Philosophy</div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{selectedTrainer.bio}</p>
              </div>

              <div className="space-y-2 border-t border-gym-border pt-3">
                <div className="text-xs uppercase font-bold text-slate-400 font-mono">Verified Credentials</div>
                <div className="flex flex-wrap gap-2">
                  {selectedTrainer.certifications.map((c, i) => (
                    <span key={i} className="text-xs bg-gym-card px-2.5 py-1 rounded-lg border border-gym-border text-slate-200">
                      ✓ {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedTrainer(null)}
                  className="btn-neon px-5 py-2 rounded-xl text-xs uppercase font-bold"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
