import React from 'react';
import { GYM_PLANS } from '../../data/mockData';
import { Check, Flame, ArrowRight, ShieldCheck, Users } from 'lucide-react';
import { MembershipPlanType } from '../../types';

interface MembershipPlansProps {
  onSelectPlan: (plan: MembershipPlanType) => void;
}

export const MembershipPlans: React.FC<MembershipPlansProps> = ({ onSelectPlan }) => {
  return (
    <section id="plans" className="py-20 bg-gym-darker relative overflow-hidden border-t border-gym-border/60">
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-gym-neon/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-gym-orange/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gym-card border border-gym-neon/30 text-gym-neon text-xs font-bold tracking-widest uppercase">
            <Flame className="w-3.5 h-3.5" />
            <span>Official RG Flex Fire Packages</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight">
            AFFORDABLE <span className="text-transparent bg-clip-text bg-gradient-to-r from-gym-neon via-emerald-400 to-teal-300">FITNESS PACKAGES</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Transparent pricing in Rupees (₹). Unrestricted equipment access, custom routine charts, and expert spotting by Sachin R, Kiran R & Krupa Sagar.
          </p>
        </div>

        {/* 5 Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 items-stretch">
          {GYM_PLANS.map((plan) => {
            const isPopular = plan.popular;
            const isBuddy = plan.name.includes('Couples');

            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl flex flex-col justify-between transition-all duration-300 ${isPopular
                  ? 'glass-card border-2 border-gym-neon shadow-neon bg-gradient-to-b from-gym-card via-gym-card to-emerald-950/30'
                  : isBuddy
                    ? 'glass-card border-2 border-gym-orange shadow-[0_0_20px_rgba(255,94,0,0.3)] bg-gradient-to-b from-gym-card to-amber-950/20'
                    : 'glass-card border border-gym-border hover:border-slate-500 hover:-translate-y-1'
                  }`}
              >
                {/* Popular Pill */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gym-neon text-gym-black font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-neon flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-current" />
                    <span>Best Value</span>
                  </div>
                )}

                {isBuddy && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gym-orange text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>2 Persons</span>
                  </div>
                )}

                <div className="p-5">
                  {/* Plan Name & Tagline */}
                  <div className="border-b border-gym-border/70 pb-4 mb-4">
                    <h3 className="text-base font-bold font-heading text-white uppercase tracking-wide min-h-[44px] flex items-center">
                      {plan.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 min-h-[30px]">
                      {plan.tagline}
                    </p>

                    {/* Price in Rupees */}
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-slate-400 text-base font-bold">₹</span>
                      <span className="text-3xl font-extrabold font-heading text-white">{plan.price.toLocaleString('en-IN')}</span>
                      <span className="text-xs text-slate-400 font-medium">/-</span>
                    </div>

                    <div className="text-[10px] text-gym-neon font-mono mt-1 font-semibold">
                      {plan.durationMonths} {plan.durationMonths === 1 ? 'Month Plan' : 'Months Coverage'}
                    </div>
                  </div>

                  {/* Features list */}
                  <div className="space-y-2.5 mb-5">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <div className="w-3.5 h-3.5 rounded-full bg-gym-neon/20 border border-gym-neon/50 flex items-center justify-center shrink-0 mt-0.5 text-gym-neon">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className="leading-tight text-[11px]">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => onSelectPlan(plan.name)}
                    className={`w-full py-3 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${isPopular
                      ? 'btn-neon'
                      : isBuddy
                        ? 'bg-gym-orange hover:bg-orange-600 text-white shadow-md'
                        : 'bg-gym-cardHover hover:bg-gym-neon text-white hover:text-gym-black border border-slate-700 hover:border-gym-neon'
                      }`}
                  >
                    <span>Choose Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Contact Strip Banner under Plans */}
        <div className="mt-12 glass-card p-4 rounded-2xl border border-gym-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gym-neon/20 border border-gym-neon flex items-center justify-center text-gym-neon shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white block text-sm">Need help choosing a plan or want a free trial session?</span>
              <span className="text-slate-400">Call Sachin R: 9964671267 | Kiran R: 9164557180 | Krupa Sagar: 9148640684</span>
            </div>
          </div>
          <a
            href="#contact"
            className="btn-neon px-5 py-2.5 rounded-xl uppercase font-bold shrink-0 text-xs"
          >
            Visit Our Gym
          </a>
        </div>

      </div>
    </section>
  );
};
