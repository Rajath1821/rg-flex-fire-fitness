import React, { useState } from 'react';
import { Calculator, Activity, ArrowRight, CheckCircle2 } from 'lucide-react';

interface BmiCalculatorProps {
  onJoinWithGoal: (weight: number, height: number) => void;
}

export const BmiCalculator: React.FC<BmiCalculatorProps> = ({ onJoinWithGoal }) => {
  const [height, setHeight] = useState<number>(178);
  const [weight, setWeight] = useState<number>(76);

  const heightInM = height / 100;
  const bmi = Number((weight / (heightInM * heightInM)).toFixed(1));

  let category = '';
  let color = '';
  let advice = '';

  if (bmi < 18.5) {
    category = 'Underweight';
    color = 'text-cyan-400';
    advice = 'Focus on progressive caloric surplus, foundational compound lifts, and hypertrophy programming.';
  } else if (bmi < 25) {
    category = 'Healthy / Athletic Weight';
    color = 'text-gym-neon';
    advice = 'Optimal physiological zone! Maintain clean macro balance, progressive overload, and athletic agility.';
  } else if (bmi < 30) {
    category = 'Overweight / Muscle Density';
    color = 'text-amber-400';
    advice = 'Incorporate high-intensity interval conditioning (HIIT) alongside heavy lifting to shed adipose tissue while preserving lean muscle.';
  } else {
    category = 'Elevated Mass / Obese';
    color = 'text-red-400';
    advice = 'Prioritize cardiovascular health, metabolic strength circuits, and low-impact functional endurance under coach supervision.';
  }

  // Ideal weight range calculation (BMI 18.5 - 24.9)
  const minIdealWeight = (18.5 * (heightInM * heightInM)).toFixed(1);
  const maxIdealWeight = (24.9 * (heightInM * heightInM)).toFixed(1);

  return (
    <section id="bmi" className="py-24 bg-gym-black relative overflow-hidden border-t border-gym-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gym-card border border-gym-neon/30 text-gym-neon text-xs font-bold tracking-widest uppercase">
            <Calculator className="w-3.5 h-3.5" />
            <span>Smart Biometric Diagnostic</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight">
            CALCULATE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-gym-neon to-gym-cyan">BODY MASS INDEX</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Instant benchmark analysis to tailor your strength, nutrition, and cardiovascular targets at GYMFORGE.
          </p>
        </div>

        <div className="max-w-4xl mx-auto glass-card rounded-2xl border border-gym-border/80 p-6 sm:p-10 shadow-glass">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Inputs (7 Cols) */}
            <div className="md:col-span-7 space-y-6">
              
              {/* Height Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs uppercase font-bold text-slate-300 tracking-wider">Height (cm)</label>
                  <span className="font-heading text-lg font-bold text-gym-neon">{height} cm</span>
                </div>
                <input
                  type="range"
                  min="130"
                  max="220"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full accent-gym-neon bg-gym-card h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>130 cm</span>
                  <span>175 cm</span>
                  <span>220 cm</span>
                </div>
              </div>

              {/* Weight Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs uppercase font-bold text-slate-300 tracking-wider">Weight (kg)</label>
                  <span className="font-heading text-lg font-bold text-gym-neon">{weight} kg</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="160"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full accent-gym-neon bg-gym-card h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>40 kg</span>
                  <span>100 kg</span>
                  <span>160 kg</span>
                </div>
              </div>

              {/* Target specs */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-gym-dark rounded-xl border border-gym-border text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Ideal Weight Zone</div>
                  <div className="text-sm font-bold text-white mt-0.5">{minIdealWeight} - {maxIdealWeight} kg</div>
                </div>
                <div className="p-3 bg-gym-dark rounded-xl border border-gym-border text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">Daily Protein Target</div>
                  <div className="text-sm font-bold text-gym-neon mt-0.5">{(weight * 1.8).toFixed(0)} - {(weight * 2.2).toFixed(0)} g</div>
                </div>
              </div>

            </div>

            {/* Right Display Gauge (5 Cols) */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-gym-darker rounded-xl border border-gym-border/80 text-center space-y-4">
              <div className="relative w-36 h-36 rounded-full border-4 border-gym-border flex flex-col items-center justify-center shadow-neon">
                <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">YOUR BMI</span>
                <span className="font-heading text-4xl font-black text-white">{bmi}</span>
                <span className="text-[10px] text-slate-400 font-mono">kg/m²</span>
              </div>

              <div>
                <div className={`font-heading text-base font-extrabold uppercase ${color}`}>
                  {category}
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {advice}
                </p>
              </div>

              <button
                onClick={() => onJoinWithGoal(weight, height)}
                className="w-full btn-neon py-2.5 rounded-xl text-xs uppercase font-bold flex items-center justify-center gap-2"
              >
                <span>Enroll With These Stats</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
