import { Product, VoucherCode, User, University, Course, CountryGuide, LMSCourse, LMSModule, LMSPracticeTest, Enrollment, CourseVoucher, Qualification, ImmigrationGuideData } from '../types';

export const users: User[] = [
  { id: 'u-admin', name: 'System Admin', email: 'admin@unicou.uk', role: 'Admin' },
  { id: 'u-trainer', name: 'Lead IELTS Trainer', email: 'trainer@unicou.uk', role: 'Trainer' },
  { id: 'u-finance', name: 'Chief Financial Officer', email: 'finance@unicou.uk', role: 'Finance' },
  { id: 'u-agent', name: 'Global Training Center', email: 'partner@edu.com', role: 'Agent', tier: 2 },
  { id: 'u-student', name: 'Alex Smith', email: 'alex@gmail.com', role: 'Customer' },
];

export const products: Product[] = [
  {
    id: 'p-pte-std',
    name: 'PTE Academic (Standard)',
    category: 'PTE',
    type: 'Voucher',
    basePrice: 180,
    currency: 'USD',
    description: 'Pearson Test of English voucher. Valid for global test booking.',
    icon: '📊',
    supportsFullRegistration: true
  },
  {
    id: 'p-pte-ukvi',
    name: 'PTE Academic UKVI',
    category: 'PTE',
    type: 'Voucher',
    basePrice: 210,
    currency: 'USD',
    description: 'SELT for UK Visas and Immigration. Accepted by Home Office.',
    icon: '🇬🇧',
    supportsFullRegistration: true
  },
  {
    id: 'p-ielts-std',
    name: 'IELTS Academic / General',
    category: 'IELTS',
    type: 'Voucher',
    basePrice: 220,
    currency: 'USD',
    description: 'Standard IELTS voucher for Academic or General Training modules.',
    icon: '🌐',
    supportsFullRegistration: true
  },
  {
    id: 'p-ielts-ukvi',
    name: 'IELTS for UKVI (SELT)',
    category: 'IELTS',
    type: 'Voucher',
    basePrice: 255,
    currency: 'USD',
    description: 'Secure English Language Test (SELT) for UK immigration routes.',
    icon: '🛡️',
    supportsFullRegistration: true
  },
  {
    id: 'p-ellt-oxford',
    name: 'Oxford ELLT (Digital)',
    category: 'Oxford ELLT',
    type: 'Voucher',
    basePrice: 120,
    currency: 'USD',
    description: 'Oxford International English Language Level Test. Recognized by 80+ UK Universities.',
    icon: '🏫',
    supportsFullRegistration: true
  },
  {
    id: 'p-langcert-selt',
    name: 'LanguageCert ESOL SELT',
    category: 'LanguageCert',
    type: 'Voucher',
    basePrice: 195,
    currency: 'USD',
    description: 'Secure English Language Test for UKVI. Fast results in 3 business days.',
    icon: '⚡',
    supportsFullRegistration: true
  },
  {
    id: 'p-password-skills',
    name: 'Password Skills Plus',
    category: 'Password',
    type: 'Voucher',
    basePrice: 110,
    currency: 'USD',
    description: 'CRELLA aligned English proficiency test for University admissions.',
    icon: '🔑',
    supportsFullRegistration: true
  },
  {
    id: 'p-toefl-ibt',
    name: 'TOEFL iBT (Home/Center)',
    category: 'TOEFL',
    type: 'Voucher',
    basePrice: 205,
    currency: 'USD',
    description: 'ETS TOEFL iBT voucher valid for standard and Home Edition tests.',
    icon: '🌎',
    supportsFullRegistration: true
  },
  {
    id: 'pte-mastery-prod',
    name: 'PTE Academic Mastery Course',
    category: 'PTE',
    type: 'Course',
    basePrice: 99,
    currency: 'USD',
    description: 'Comprehensive video training and simulated practice for PTE Academic.',
    icon: '🎓',
    lmsCourseId: 'pte-mastery'
  },
  {
    id: 'ielts-bootcamp-prod',
    name: 'IELTS Band 8 Bootcamp',
    category: 'IELTS',
    type: 'Course',
    basePrice: 149,
    currency: 'USD',
    description: 'Intensive preparation track for achieving high band scores in IELTS.',
    icon: '🚀',
    lmsCourseId: 'ielts-bootcamp'
  }
];

export const qualifications: Qualification[] = [
  {
    id: 'q-othm-3',
    title: 'OTHM Level 3 Diploma in Business Studies',
    duration: '6 Months',
    qualificationBody: 'OTHM',
    tuitionFees: '$1,200',
    requirements: ['High School Certificate', 'English Proficiency (IELTS 5.0 equivalent)'],
    description: 'Understand the operations and structure of businesses.',
    level: 'Level 3',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop'
  }
];

export const voucherCodes: VoucherCode[] = [];

export const universities: University[] = [
  {
    id: 'uni-manchester',
    name: 'University of Manchester',
    slug: 'manchester',
    location: 'Manchester, UK',
    ranking: 32,
    description: 'A world-class research institution located in the heart of Manchester.',
    logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200&h=200&fit=crop',
    countryId: 'uk',
    website: 'https://www.manchester.ac.uk'
  }
];

export const courses: Course[] = [
  {
    id: 'c-cs-man',
    universityId: 'uni-manchester',
    title: 'MSc Computer Science',
    degree: 'Postgraduate',
    duration: '1 Year',
    tuitionFee: '£28,000',
    description: 'Advanced computing course focusing on AI and software engineering.'
  }
];

export const immigrationGuides: ImmigrationGuideData[] = [
  {
    id: 'skilled', countryId: 'skilled', slug: 'skilled-immigration', title: 'Skilled Immigration',
    content: 'In today’s global economy, skilled professionals are increasingly in demand. Countries worldwide actively seek talented individuals to fill labour shortages, drive innovation, and strengthen their economies.',
    heroImage: 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?w=1200&auto=format&fit=crop',
    pathways: [
      { id: 'uk-sw', title: 'United Kingdom - Skilled Worker', description: 'Points-based route for professionals with a job offer from a licensed sponsor.', requirements: ['CoS from Employer', 'IELTS/PTE Proficiency', '£1,270 Maintenance'] },
      { id: 'ca-ee', title: 'Canada - Express Entry', description: 'Federal pathway for skilled immigrants based on CRS scores.', requirements: ['ECA Report', 'IELTS/CELPIP CLB 7+', 'Proof of Funds'] }
    ]
  }
];

export const countryGuides: CountryGuide[] = [
  { 
    id: 'uk', 
    countryId: 'uk', 
    slug: 'uk', 
    title: 'Study in United Kingdom 2025/2026', 
    content: `The UK remains a top global destination...`, 
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', 
    costOfLiving: '£1,171 - £1,529/mo', 
    visaRequirements: 'Student Visa (eVisas Active)' 
  }
];

export const lmsCourses: LMSCourse[] = [
  { id: 'pte-mastery', title: 'PTE Academic Mastery', description: 'Complete prep for Pearson Test of English.', thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', category: 'PTE', duration: '20 Hours', instructor: 'Dr. Jane Smith', price: 99, status: 'Paid' },
  { id: 'ielts-bootcamp', title: 'IELTS Band 8 Bootcamp', description: 'Intensive prep for Higher Band IELTS scores.', thumbnail: 'https://images.unsplash.com/photo-1544391496-1ca7c97457cd?w=800', category: 'IELTS', duration: '35 Hours', instructor: 'Prof. Mark Wood', price: 149, status: 'Paid' }
];

export const lmsModules: LMSModule[] = [
  {
    id: 'm1-pte',
    courseId: 'pte-mastery',
    title: 'Module 1: Speaking & Writing Strategy',
    lessons: [
      { id: 'l1-pte', title: 'Read Aloud Technique', type: 'Video', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
    ]
  }
];

export const lmsTests: LMSPracticeTest[] = [
  {
    id: 'full-mock-1',
    title: 'IELTS/PTE Combined Mock Exam Alpha',
    sections: [
      {
        id: 's1',
        skill: 'Reading',
        title: 'Academic Reading Section',
        timeLimit: 20,
        questions: [
          { id: 'rq1', text: 'What is the primary theme of global academic mobility?', type: 'MCQ', skill: 'Reading', options: ['Tourism', 'Knowledge Exchange', 'Industrial Growth', 'Resource Extraction'], maxScore: 1 }
        ]
      }
    ]
  }
];

export const initialEnrollments: Enrollment[] = [];
export const courseVouchers: CourseVoucher[] = [];
export const universityBySlug = (slug: string): University | null => {
  return universities.find(u => u.slug === slug) || null;
};