import React, { useState, useEffect } from 'react';
import { MembershipPlanType, Member } from '../../types';
import { StorageService, PLANS_CONFIG } from '../../services/storage';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';

interface JoinModalProps {
  initialPlan?: MembershipPlanType;
  isOpen: boolean;
  onClose: () => void;
  onSuccessEnroll: (member: Member) => void;
  initialStats?: { weight: number; height: number };
}

export const JoinModal: React.FC<JoinModalProps> = ({
  initialPlan = 'Standard Package (3 Months)',
  isOpen,
  onClose,
  onSuccessEnroll,
  initialStats
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [selectedPlan, setSelectedPlan] = useState<MembershipPlanType>(initialPlan);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [dob, setDob] = useState('1998-04-12');
  const [address, setAddress] = useState('Lakshmikant Nagara, Hebbal 1st Stage, Mysore');
  const [height, setHeight] = useState(initialStats?.height || 175);
  const [weight, setWeight] = useState(initialStats?.weight || 72);
  const [emergencyName, setEmergencyName] = useState('Sachin R');
  const [emergencyPhone, setEmergencyPhone] = useState('9964671267');
  const [emergencyRelation, setEmergencyRelation] = useState('Coach / Guardian');
  const [fitnessGoals, setFitnessGoals] = useState('Weight loss & strength conditioning');
  const [medicalNotes, setMedicalNotes] = useState('No medical conditions');

  useEffect(() => {
    if (initialPlan) setSelectedPlan(initialPlan);
  }, [initialPlan]);

  useEffect(() => {
    if (initialStats) {
      setHeight(initialStats.height);
      setWeight(initialStats.weight);
    }
  }, [initialStats]);

  if (!isOpen) return null;

  const planInfo = PLANS_CONFIG[selectedPlan] || PLANS_CONFIG['Standard Package (3 Months)'];
  const sDate = new Date();
  sDate.setMonth(sDate.getMonth() + planInfo.months);
  const expiryStr = sDate.toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    const newMember = StorageService.addMember({
      fullName,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      dob,
      gender,
      phone,
      email: email || `${phone}@rgflexfire.com`,
      address,
      emergencyContact: {
        name: emergencyName,
        phone: emergencyPhone,
        relation: emergencyRelation
      },
      height: Number(height),
      weight: Number(weight),
      joiningDate: todayStr,
      plan: selectedPlan,
      startDate: todayStr,
      expiryDate: expiryStr,
      amount: planInfo.amount,
      paymentStatus: 'Paid',
      medicalNotes,
      fitnessGoals,
      password: 'member123'
    });

    StorageService.setMemberSession(newMember.id);
    onSuccessEnroll(newMember);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card bg-gym-darker max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-gym-neon/60 shadow-neon space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gym-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gym-neon flex items-center justify-center text-gym-black font-black shadow-neon">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading text-white">
                JOIN RG FLEX FIRE FITNESS
              </h3>
              <p className="text-xs text-slate-400">
                #64, MIG 1st Floor, Lakshmikant Nagara, Hebbal 1st Stage, Mysore
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg p-1">✕</button>
        </div>

        {/* Plan Selector Carousel */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase text-slate-300 font-bold block">
            Select Gym Package:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(Object.keys(PLANS_CONFIG) as MembershipPlanType[]).map((p) => {
              const info = PLANS_CONFIG[p];
              const isSel = selectedPlan === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPlan(p)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isSel
                      ? 'bg-gym-cardHover border-gym-neon shadow-neon'
                      : 'bg-gym-card border-gym-border text-slate-400 hover:text-white'
                  }`}
                >
                  <div className={`text-[11px] font-bold font-heading ${isSel ? 'text-white' : 'text-slate-300'} truncate`}>
                    {p.split(' ')[0]}
                  </div>
                  <div className="text-sm font-extrabold text-gym-neon font-heading mt-0.5">₹{info.amount}</div>
                  <div className="text-[9px] text-slate-400 font-mono">{info.months}M</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Chethan Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="e.g. 9845012345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Email Address</label>
              <input
                type="email"
                placeholder="athlete@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Date of Birth</label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Gender *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input bg-gym-darker"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Height (cm)</label>
              <input
                type="number"
                required
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Weight (kg)</label>
              <input
                type="number"
                required
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-300 uppercase block mb-1">Residential Address in Mysore</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input"
            />
          </div>

          <div className="p-3 bg-gym-card rounded-xl border border-gym-border flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Total Due (INR)</span>
              <span className="text-xl font-black font-heading text-gym-neon">₹{planInfo.amount}/-</span>
            </div>
            <span className="text-xs font-mono text-slate-300 bg-gym-darker px-2.5 py-1 rounded-lg border border-gym-border">
              Expires: {expiryStr}
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-neon px-6 py-3 rounded-xl font-heading text-xs uppercase tracking-wider flex items-center gap-2 shadow-neon"
            >
              <span>Enroll & Open Member Pass</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
