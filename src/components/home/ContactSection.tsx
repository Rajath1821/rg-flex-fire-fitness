import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, User, Flame, MessageSquare, Shield, Dumbbell } from 'lucide-react';
import { GYM_CONTACT_INFO } from '../../data/mockData';
import { StorageService } from '../../services/storage';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Standard Package (3 Months - ₹2,499)',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    // Save message into persistent storage so it displays on the Admin Page
    StorageService.saveMessage({
      name: formData.name,
      email: formData.email || 'Not provided',
      phone: formData.phone,
      inquiryType: formData.inquiryType,
      message: formData.message || 'Interested in joining RG Flex Fire Fitness.'
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'Standard Package (3 Months - ₹2,499)',
        message: ''
      });
    }, 5000);
  };

  const contactPersons = [
    {
      name: 'Sachin R',
      phone: '9964671267',
      isOwner: true
    },
    {
      name: 'Kiran R',
      phone: '9164557180',
      isOwner: false
    },
    {
      name: 'Krupa Sagar',
      phone: '9148640684',
      isOwner: false
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gym-black relative overflow-hidden border-t border-gym-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gym-card border border-gym-neon/30 text-gym-neon text-xs font-bold tracking-widest uppercase">
            <Phone className="w-3.5 h-3.5" />
            <span>Contact Information</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight">
            CONTACT <span className="text-transparent bg-clip-text bg-gradient-to-r from-gym-neon via-emerald-400 to-teal-300">US</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            #64, MIG First Floor, Lakshmikant Nagara, Hebbal 1st Stage, Mysore. Call Sachin R (Owner), Kiran R, or Krupa Sagar directly, or submit your inquiry below.
          </p>
        </div>

        {/* Contact Cards: Display ONLY Name and Phone Number (Sachin R displayed as Owner) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {contactPersons.map((person, index) => (
            <div
              key={index}
              className={`glass-card p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between group shadow-lg ${
                person.isOwner
                  ? 'border-gym-neon/60 bg-gradient-to-b from-gym-card via-gym-card to-emerald-950/20 shadow-neon'
                  : 'border-gym-border hover:border-slate-500'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    person.isOwner
                      ? 'bg-gym-neon text-gym-black shadow-neon font-bold'
                      : 'bg-gym-cardHover text-gym-neon border border-gym-neon/30'
                  }`}>
                    <User className="w-5 h-5" />
                  </div>

                  {person.isOwner && (
                    <span className="text-[10px] font-mono font-extrabold bg-gym-neon text-gym-black uppercase tracking-wider px-3 py-1 rounded-full shadow-neon">
                      Owner
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold font-heading text-white flex items-center gap-2">
                    <span>{person.name}</span>
                    {person.isOwner && (
                      <span className="text-xs font-mono font-bold text-gym-neon uppercase">(Owner)</span>
                    )}
                  </h3>

                  <div className="mt-3">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
                      Phone Number
                    </span>
                    <a
                      href={`tel:${person.phone}`}
                      className="text-lg font-mono font-bold text-gym-neon hover:underline tracking-wide flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4 text-gym-neon" />
                      <span>{person.phone}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct Call & WhatsApp Action Buttons */}
              <div className="pt-4 mt-5 border-t border-gym-border/60 flex items-center gap-2">
                <a
                  href={`tel:${person.phone}`}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gym-neon text-gym-black font-heading text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-neon hover:bg-emerald-400 transition-all"
                  title={`Call ${person.name}`}
                >
                  <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Call {person.phone}</span>
                </a>
                <a
                  href={`https://wa.me/91${person.phone}?text=Hi%20${encodeURIComponent(person.name)},%20I%20am%20inquiring%20about%20RG%20Flex%20Fire%20Fitness%20Mysore.`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-gym-card hover:bg-emerald-950/40 text-emerald-400 border border-gym-border hover:border-emerald-500/50 transition-colors"
                  title={`WhatsApp ${person.name}`}
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* 2 Columns: Location Details & Interactive Message Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Direct Address & Timings (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">

            <div className="glass-card p-6 rounded-2xl border border-gym-border/80 space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gym-neon flex items-center justify-center text-gym-black font-bold">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-heading text-white">RG FLEX FIRE FITNESS</h3>
                  <span className="text-[11px] text-slate-400 font-mono">Lakshmikant Nagara • Hebbal 1st Stage • Mysore</span>
                </div>
              </div>

              {/* Exact Location */}
              <div className="flex items-start gap-3.5 p-3.5 bg-gym-darker rounded-xl border border-gym-border">
                <div className="w-9 h-9 rounded-lg bg-gym-cardHover border border-gym-neon/40 flex items-center justify-center text-gym-neon shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase text-slate-400 font-mono">Center Location</h4>
                  <p className="text-xs sm:text-sm font-semibold text-white mt-0.5 leading-snug">
                    #64, MIG First Floor, Lakshmikant Nagara, Hebbal 1st Stage, Mysore - 570016
                  </p>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="p-3.5 bg-gym-darker rounded-xl border border-gym-border flex items-start gap-3 text-xs">
                <Clock className="w-4 h-4 text-gym-cyan shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Training Hours</span>
                  <span className="text-slate-200 font-semibold block mt-0.5">Mon - Sat: 05:30 AM – 10:00 PM</span>
                  <span className="text-slate-400 text-[11px]">Sunday: 06:00 AM – 12:00 PM</span>
                </div>
              </div>

              {/* Quick Facility Highlights */}
              <div className="p-3.5 bg-gym-darker rounded-xl border border-gym-border space-y-2 text-xs">
                <div className="flex items-center gap-2 text-gym-neon font-mono text-[11px] font-bold uppercase">
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span>Facility Highlights</span>
                </div>
                <div className="text-[11px] text-slate-300 space-y-1">
                  <div>• Heavy Dumbbells up to 50kg & Olympic Benches</div>
                  <div>• Powerlifting Squat Racks & Deadlift Platform</div>
                  <div>• Cardio Deck, Lockers, Clean Showers & Water Station</div>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Interactive Inquiry Form (Syncs directly to Admin Page) */}
          <div className="lg:col-span-7">
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-gym-border/80 shadow-glass">
              <div className="border-b border-gym-border pb-3 mb-5">
                <h3 className="text-lg font-bold font-heading text-white">
                  SEND INQUIRY / MESSAGE TO US
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Have questions about our ₹899 basic or ₹2,499 standard packages? Submit your message below — it transmits directly to the Admin Dashboard.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 text-center space-y-3 bg-gym-darker rounded-2xl border border-gym-neon/60 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-gym-neon/20 border border-gym-neon flex items-center justify-center text-gym-neon mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold font-heading text-white">
                    MESSAGE TRANSMITTED TO ADMIN DASHBOARD!
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Thank you, <strong>{formData.name}</strong>. Your inquiry has been forwarded to Sachin R (Owner) and Kiran R. We will reach out to you at <strong>{formData.phone}</strong> shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-300 block mb-1.5 font-mono">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-300 block mb-1.5 font-mono">
                        Phone Number (For Call/WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9845012345"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-300 block mb-1.5 font-mono">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="athlete@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-300 block mb-1.5 font-mono">
                        Select Package
                      </label>
                      <select
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl glass-input bg-gym-card text-white font-medium"
                      >
                        <option value="Basic Package (1 Month - ₹899)">Basic Package (1 Month - ₹899)</option>
                        <option value="Standard Package (3 Months - ₹2,499)">Standard Package (3 Months - ₹2,499)</option>
                        <option value="Premium Package (6 Months - ₹4,699)">Premium Package (6 Months - ₹4,699)</option>
                        <option value="Ultimate Package (12 Months - ₹8,499)">Ultimate Package (12 Months - ₹8,499)</option>
                        <option value="Couples Buddy Plan (3 Months - ₹4,799)">Couples Buddy Plan (3 Months - ₹4,799)</option>
                        <option value="General Trial Session">Free Trial / Visit Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-300 block mb-1.5 font-mono">
                      Your Message / Questions
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Ask about batch timings, mentor coaching, duo discounts, etc..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-neon py-3.5 rounded-xl font-heading text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-neon"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to Admin & Mentors</span>
                  </button>
                  <p className="text-[10px] text-slate-500 font-mono text-center">
                    Submitted messages instantly sync to the RG Flex Fire Admin Dashboard.
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
