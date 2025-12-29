import { Product, VoucherCode, User, University, Course, CountryGuide, LMSCourse, LMSModule, LMSPracticeTest, Enrollment, CourseVoucher, Qualification, ImmigrationGuideData } from '../types';

export const users: User[] = [
  { id: 'u-admin', name: 'System Admin / Owner', email: 'admin@unicou.uk', role: 'Admin' },
  { id: 'u-finance', name: 'Finance / Audit Team', email: 'finance@unicou.uk', role: 'Finance' },
  { id: 'u-manager', name: 'Operations Manager', email: 'manager@unicou.uk', role: 'Admin' },
  { id: 'u-trainer', name: 'Lead Trainer', email: 'trainer@unicou.uk', role: 'Trainer' },
  { id: 'u-support', name: 'Support / Sales Node', email: 'support@unicou.uk', role: 'Admin' },
  { id: 'u-agent', name: 'Agent Partner / Prep Center', email: 'partner@unicou.uk', role: 'Agent', tier: 2 },
  { id: 'u-student', name: 'Alex Smith (Student)', email: 'alex@gmail.com', role: 'Customer' },
];

export const products: Product[] = [
  { id: 'v-1', name: 'IELTS Academic Voucher', category: 'IELTS', type: 'Voucher', basePrice: 149, currency: 'USD', description: 'Standard British Council/IDP Academic training voucher.', icon: '🌐' },
  { id: 'v-2', name: 'IELTS General Training', category: 'IELTS', type: 'Voucher', basePrice: 149, currency: 'USD', description: 'Standard IELTS General training voucher for migration.', icon: '🌐' },
  { id: 'v-6', name: 'PTE Academic Voucher', category: 'PTE', type: 'Voucher', basePrice: 165, currency: 'USD', description: 'Pearson Test of English Academic standard voucher.', icon: '📊' },
  { id: 'v-10', name: 'LanguageCert SELT B1', category: 'LanguageCert', type: 'Voucher', basePrice: 155, currency: 'USD', description: 'Secure English Language Test (SELT) for UKVI.', icon: '⚡' },
  { id: 'v-11', name: 'LanguageCert SELT B2', category: 'LanguageCert', type: 'Voucher', basePrice: 175, currency: 'USD', description: 'Advanced SELT assessment for University Tier 4.', icon: '⚡' },
  { id: 'v-17', name: 'Skills for English SELT', category: 'Skills for English', type: 'Voucher', basePrice: 160, currency: 'USD', description: 'PSI Skills for English UKVI compliant voucher.', icon: '🛡️' },
  { id: 'v-19', name: 'TOEFL iBT Official', category: 'TOEFL', type: 'Voucher', basePrice: 195, currency: 'USD', description: 'ETS TOEFL iBT Official Global voucher.', icon: '🌎' },
  { id: 'v-20', name: 'Duolingo English Test', category: 'Duolingo', type: 'Voucher', basePrice: 60, currency: 'USD', description: 'Duolingo English Test Global Access.', icon: '🦉' },
  { id: 'v-21', name: 'Oxford ELLT Digital', category: 'ELLT', type: 'Voucher', basePrice: 85, currency: 'USD', description: 'Oxford International Digital English Test.', icon: '🏫' },
  { id: 'v-22', name: 'Password Skills Plus', category: 'OTHER', type: 'Voucher', basePrice: 95, currency: 'USD', description: 'Password Skills Plus Global assessment node.', icon: '🔑' }
];

export const voucherCodes: VoucherCode[] = products.flatMap(p => 
  Array(100).fill(0).map((_, i) => ({
    id: `vc-${p.id}-${i}`,
    productId: p.id,
    code: `${p.category.substring(0,2).toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    status: 'Available' as const,
    expiryDate: '2026-12-31'
  }))
);

export const countryGuides: CountryGuide[] = [
  { 
    id: 'uk', 
    countryId: 'uk', 
    slug: 'uk', 
    title: 'Study in United Kingdom', 
    content: `Comprehensive guide to studying in the UK for 2025/2026...`,
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', 
    costOfLiving: '£1,171 - £1,529/mo', 
    visaRequirements: 'Student Visa (eVisas Active)' 
  },
  { 
    id: 'australia', 
    countryId: 'australia', 
    slug: 'australia', 
    title: 'Study in Australia', 
    content: `Guide to studying in Australia...`, 
    heroImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200', 
    costOfLiving: 'AUD $2,500/mo', 
    visaRequirements: 'Subclass 500' 
  }
];

export const universities: University[] = [
  { id: 'uni-manchester', name: 'University of Manchester', slug: 'manchester', location: 'Manchester, UK', ranking: 32, description: 'Global research powerhouse.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200', countryId: 'uk', website: 'https://www.manchester.ac.uk' }
];

export const courses: Course[] = [
  { id: 'c-1', universityId: 'uni-manchester', degree: 'Postgraduate', title: 'MSc Advanced Computer Science', duration: '1 Year', tuitionFee: '$32,000', description: 'Deep tech specialization.' }
];

export const lmsCourses: LMSCourse[] = [
  { id: 'pte-mastery', title: 'PTE Academic Mastery', description: 'Complete prep for Pearson Test of English.', thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', category: 'PTE', duration: '20 Hours', instructor: 'Dr. Jane Smith', price: 99, status: 'Paid' }
];

export const lmsModules: LMSModule[] = [
  { 
    id: 'm1-pte', 
    courseId: 'pte-mastery', 
    title: 'Module 1: Strategy & Architecture', 
    lessons: [
        { id: 'l1', title: 'PTE Introduction & Scoring Logic', type: 'Video', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        { id: 'l2', title: 'Academic Integrity Protocols', type: 'Text', content: '### Core Principles\n- Precision in response\n- Lexical variety\n- Grammatical range' },
        { id: 'l3', title: 'Foundational Knowledge Quiz', type: 'Quiz', content: JSON.stringify([
            { id: 'q1', question: 'What does PTE stand for?', options: ['Pearson Test of English', 'Professional Testing Engine', 'Primary Teaching Exam'], correct: 0 }
        ])}
    ] 
  }
];

export const lmsTests: LMSPracticeTest[] = [
  { 
    id: 'full-mock-1', 
    title: 'IELTS/PTE Alpha Mock', 
    sections: [
        {
            id: 'sec-1',
            skill: 'Reading',
            title: 'Critical Content Analysis',
            timeLimit: 20,
            questions: [
                { id: 'q-r1', text: 'Select the primary tone of the academic abstract provided.', type: 'MCQ', options: ['Objective', 'Persuasive', 'Critical'], skill: 'Reading', maxScore: 1 }
            ]
        },
        {
            id: 'sec-2',
            skill: 'Writing',
            title: 'Reflective Essay Node',
            timeLimit: 40,
            questions: [
                { id: 'q-w1', text: 'Discuss the impact of AI on international education systems.', type: 'Essay', skill: 'Writing', maxScore: 9 }
            ]
        }
    ] 
  }
];

export const qualifications: Qualification[] = [
  { id: 'q-othm-3', title: 'OTHM Level 3 Diploma in Business', duration: '6 Months', qualificationBody: 'OTHM', tuitionFees: '$1,200', requirements: ['High School Certificate'], description: 'Foundation for business management.', level: 'Level 3', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800' }
];

export const initialEnrollments: Enrollment[] = [];
export const courseVouchers: CourseVoucher[] = [];
export const immigrationGuides: ImmigrationGuideData[] = [];
export const universityBySlug = (slug: string): University | null => universities.find(u => u.slug === slug) || null;