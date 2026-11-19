import React, { useState } from 'react';
import { GYM_FACILITIES } from '../../data/mockData';
import { Check, Sparkles, Dumbbell } from 'lucide-react';

export const FacilitiesSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(GYM_FACILITIES.map(f => f.category)))];

  const filteredFacilities = activeCategory === 'All'
    ? GYM_FACILITIES
    : GYM_FACILITIES.filter(f => f.category === activeCategory);

  return (
    <section id="facilities" className="py-24 bg-gym-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gym-card border border-gym-cyan/30 text-gym-cyan text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>State-of-the-Art Infrastructure</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight">
            WORLD-CLASS <span className="text-transparent bg-clip-text bg-gradient-to-r from-gym-cyan via-teal-300 to-gym-neon">FACILITIES & EQUIPMENT</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Equipped with tournament-standard powerlifting hardware, immersive HIIT cardio theatres, and advanced bio-recovery suites to empower every workout style.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeCategory === cat
                    ? 'bg-gym-neon text-gym-black shadow-neon font-bold'
                    : 'bg-gym-card text-slate-300 hover:text-white hover:bg-gym-cardHover border border-gym-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFacilities.map((facility) => (
            <div
              key={facility.id}
              className="glass-card rounded-2xl overflow-hidden border border-gym-border/80 group hover:border-gym-neon/50 transition-all duration-300 flex flex-col hover:-translate-y-1.5 shadow-lg"
            >
              {/* Facility Image with Category Tag */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={facility.image}
                  alt={facility.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gym-darker via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-gym-black/85 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold font-mono tracking-wider text-gym-neon border border-gym-neon/30">
                  {facility.category.toUpperCase()}
                </span>
              </div>

              {/* Facility Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold font-heading text-white group-hover:text-gym-neon transition-colors">
                    {facility.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                    {facility.description}
                  </p>
                </div>

                {/* Micro Features list */}
                <div className="space-y-1.5 pt-3 border-t border-gym-border/60">
                  {facility.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-gym-neon" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
