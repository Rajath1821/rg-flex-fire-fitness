import { Facility, GymTrainer, PlanDetails, Testimonial } from '../types';

export const GYM_CONTACT_INFO = {
  name: 'RG FLEX FIRE FITNESS',
  tagline: 'Smart Fitness & Strength Training Hub',
  address: '#64, MIG First Floor, Lakshmikant Nagara, Hebbal 1st Stage, Mysore',
  contacts: [
    { name: 'Sachin R', phone: '9964671267' },
    { name: 'Kiran R', phone: '9164557180' },
    { name: 'Krupa Sagar', phone: '9148640684' }
  ],
  email: 'rgflexfirefitness@gmail.com',
  timings: 'Monday - Saturday: 05:30 AM - 10:00 PM | Sunday: 06:00 AM - 12:00 PM'
};

export const GYM_PLANS: PlanDetails[] = [
  {
    name: 'Basic Package (1 Month)',
    durationMonths: 1,
    price: 899,
    tagline: 'Full gym floor & strength zone access',
    features: [
      'Full Gym Floor & Free Weights Access',
      'Cardio & Core Fitness Training Area',
      'General Fitness Trainer Guidance',
      'Locker & Changing Room Facilities',
      'Digital Attendance QR Code'
    ],
    popular: false
  },
  {
    name: 'Standard Package (3 Months)',
    durationMonths: 3,
    price: 2499,
    tagline: 'Best for beginners starting steady progression',
    features: [
      'All Basic Package Privileges',
      'Personalized Workout Routine Chart',
      'Diet & Nutrition General Advice',
      'Bi-Weekly Body Weight & BMI Audit',
      'Save ₹198 compared to monthly renewals'
    ],
    popular: false
  },
  {
    name: 'Premium Package (6 Months)',
    durationMonths: 6,
    price: 4699,
    tagline: 'Serious transformation & athletic conditioning',
    features: [
      'All Standard Package Privileges',
      'Advanced Barbell & Hypertrophy Protocols',
      'Dedicated Form & Technique Guidance',
      'Continuous Progress Tracking in Member Portal',
      'Save ₹695 compared to monthly renewals'
    ],
    popular: true
  },
  {
    name: 'Ultimate Package (12 Months)',
    durationMonths: 12,
    price: 8499,
    tagline: '1 Full Year of unlimited strength & peak physique',
    features: [
      'Full 365 Days Unrestricted Gym Access',
      'Comprehensive 12-Month Progression Plan',
      'Priority Trainer Consultation & Spotting',
      'Custom Macronutrient & Supplement Guide',
      'Save ₹2,289 (Highest Value Year Pass!)'
    ],
    popular: false
  },
  {
    name: 'Couples Buddy Plan (3 Months)',
    durationMonths: 3,
    price: 4799,
    tagline: 'Special 2-Person package (Work out with your partner/friend)',
    features: [
      'Valid for 2 Members (Couples / Gym Buddies)',
      'Joint 3 Months Membership Access',
      'Partner Workout Training Routines',
      'Double Digital QR Passes for Both Athletes',
      'Massive Savings for Duo Training'
    ],
    popular: false
  }
];

export const GYM_FACILITIES: Facility[] = [
  {
    id: 'fac-1',
    title: 'Olympic Heavy Lifting & Free Weights Zone',
    category: 'Heavy Lifting',
    description: 'Competition-grade steel plates, heavy-duty Olympic bars, power racks, squat cages, and dumbells up to 50kg.',
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
    features: ['Power Racks & Squat Cages', 'Heavy Dumbbells & Barbell Sets', 'Deadlift Platforms', 'Calibrated Steel Plates']
  },
  {
    id: 'fac-2',
    title: 'High-Impact Cardio & Stamina Studio',
    category: 'Cardio & Burn',
    description: 'Motorized treadmills, cross trainers, spin bikes, and battle ropes for intense calorie burn and endurance.',
    image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=80',
    features: ['Commercial Treadmills', 'Ellipticals & Cross Trainers', 'Spin Bikes', 'Battle Ropes & Plyo Boxes']
  },
  {
    id: 'fac-3',
    title: 'Functional Cross-Training & Combat Turf',
    category: 'Functional Fitness',
    description: 'Indoor sprint turf, punching bags, kettlebells, resistance bands, and pull-up rigs for functional agility.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    features: ['Punching & Kick Bags', 'Kettlebell Progression Set', 'Turf Sprint Lane', 'Core & Mobility Corner']
  }
];

export const GYM_TRAINERS: GymTrainer[] = [
  {
    id: 'tr-1',
    name: 'Sachin R',
    role: 'Head Fitness Coach & Strength Specialist',
    specialty: 'Powerlifting, Strength & Hypertrophy',
    experience: '8+ Years Coaching Experience',
    photoUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=600&q=80',
    bio: 'Dedicated strength mentor focused on biomechanics, heavy lifts, and natural muscle development at RG Flex Fire Fitness.',
    certifications: ['Certified Fitness Coach', 'Strength & Conditioning Specialist'],
    rating: 4.9
  },
  {
    id: 'tr-2',
    name: 'Kiran R',
    role: 'Senior Conditioning & Fat Loss Coach',
    specialty: 'Transformation & Metabolic HIIT',
    experience: '7+ Years Coaching Experience',
    photoUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80',
    bio: 'Expert in body recomposition, high-energy fat loss bootcamps, and personalized diet periodization for Mysore athletes.',
    certifications: ['Master Transformation Trainer', 'Nutrition & Lifestyle Coach'],
    rating: 4.95
  },
  {
    id: 'tr-3',
    name: 'Krupa Sagar',
    role: 'Functional Mobility & Posture Specialist',
    specialty: 'Functional Fitness & Endurance',
    experience: '6+ Years Coaching Experience',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    bio: 'Specialist in athletic endurance, joint mobility, posture correction, and injury-free progressive training.',
    certifications: ['Certified Personal Trainer', 'Functional Training Coach'],
    rating: 4.9
  }
];

export const WHY_CHOOSE_US = [
  {
    title: 'Top Barbell & Dumbbell Stations',
    description: 'Heavy dumbells up to 50kg, Olympic benches, squat racks, and deadlift platforms.',
    icon: 'Dumbbell'
  },
  {
    title: 'Expert Mentorship from Sachin & Kiran R',
    description: 'Personalized form spotting, injury-prevention coaching, and structured progression.',
    icon: 'Users'
  },
  {
    title: 'Touchless Digital QR Pass System',
    description: 'Instant turnstile access and digital attendance tracking via your mobile device.',
    icon: 'QrCode'
  },
  {
    title: 'Couples & Buddy Training Deals',
    description: 'Affordable 3 months duo plan (₹4,799/-) designed for pairs and workout partners.',
    icon: 'Flame'
  },
  {
    title: 'Prime Lakshmikant Nagara Location',
    description: 'Conveniently located at #64, MIG 1st Floor, Hebbal 1st Stage with ample parking.',
    icon: 'MapPin'
  },
  {
    title: 'Flexible Morning & Evening Batches',
    description: 'Open Monday to Saturday from 05:30 AM to 10:00 PM for working professionals and students.',
    icon: 'Clock'
  }
];


export const GYM_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Praveen Gowda',
    role: 'Mysore Resident & Member',
    memberSince: 'Member for 8 Months',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    quote: 'RG Flex Fire Fitness is the best gym in Lakshmikant Nagara Hebbal! Sachin sir and Kiran sir give top guidance on every set. Lost 9kg in 3 months!',
    rating: 5,
    transformation: '-9kg Fat Loss | Strength PR: 120kg'
  },
  {
    id: 'test-2',
    name: 'Deepak & Sneha',
    role: 'Couples Plan Athletes',
    memberSince: 'Members for 6 Months',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    quote: 'The ₹4799 Couples Buddy Plan for 3 months is unmatched value in Mysore. The gym atmosphere is motivating, friendly, and very safe.',
    rating: 5,
    transformation: 'Couples Consistency: 120+ Workouts'
  },
  {
    id: 'test-3',
    name: 'Manoj Kumar',
    role: 'Powerlifter',
    memberSince: 'Member for 1 Year',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    quote: 'Excellent iron equipment, spacious floor, and great community. Krupa Sagar sir helped fix my deadlift posture. Best fitness center!',
    rating: 5,
    transformation: 'Deadlift: 140kg → 210kg'
  }
];
