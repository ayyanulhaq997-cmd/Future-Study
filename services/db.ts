
import { Product, VoucherCode, User, University, CountryGuide, Course, Qualification, LMSCourse, LMSPracticeTest, ManualSubmission, TestResult } from '../types';

export const users: User[] = [
  // --- OWNER & OPS NODES ---
  { id: 'u-admin', name: 'System Owner', email: 'admin@unicou.uk', role: 'System Admin/Owner', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-ops', name: 'Operations Director', email: 'ops@unicou.uk', role: 'Operation Manager', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-m1', name: 'Ops Manager 1', email: 'manager1@unicou.uk', role: 'Operation Manager', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-m2', name: 'Ops Manager 2', email: 'manager2@unicou.uk', role: 'Operation Manager', isAuthorized: true, verified: true, status: 'Active' },
  
  // --- FINANCE & SALES ---
  { id: 'u-fin', name: 'Finance Controller', email: 'finance@unicou.uk', role: 'Finance', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-sales', name: 'Sales Head', email: 'sales@unicou.uk', role: 'Sales', isAuthorized: true, verified: true, status: 'Active' },
  
  // --- SUPPORT NODES ---
  { id: 'u-sup', name: 'Global Support', email: 'support@unicou.uk', role: 'Support', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-sup1', name: 'Support Node 1', email: 'support1@unicou.uk', role: 'Support', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-sup2', name: 'Support Node 2', email: 'support2@unicou.uk', role: 'Support', isAuthorized: true, verified: true, status: 'Active' },
  
  // --- PARTNERS & STUDENTS ---
  { id: 'u-alpha', name: 'Agent Alpha', email: 'agent_alpha@test.com', role: 'Agent', isAuthorized: true, verified: true, status: 'Active', tier: 2 },
  { id: 'u-beta', name: 'Center Beta', email: 'center_beta@test.com', role: 'Institute', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-std', name: 'Legacy Student', email: 'student@unicou.uk', role: 'Student', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-c1', name: 'Candidate 1', email: 'candidate1@test.com', role: 'Student', isAuthorized: true, verified: true, status: 'Active' },
];

export const lmsCourses: LMSCourse[] = [
  {
    id: 'course-pte-1',
    title: 'PTE Academic Masterclass',
    category: 'PTE',
    thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800',
    description: 'Comprehensive strategies for all 20 item types in PTE Academic.',
    duration: '20 Hours',
    instructor: 'Dr. Sarah Smith',
    price: 49
  },
  {
    id: 'course-ielts-1',
    title: 'IELTS Band 8+ Foundation',
    category: 'IELTS',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
    description: 'Master the Writing and Speaking modules for IELTS Academic.',
    duration: '15 Hours',
    instructor: 'James Clear',
    price: 39
  }
];

export const lmsTests: LMSPracticeTest[] = [
  {
    id: 'test-pte-full-1',
    title: 'PTE Academic Full Mock #01',
    sections: [
      {
        id: 's1', title: 'PTE Reading & Writing Section', skill: 'Reading', timeLimit: 30,
        passageText: "Global economic shifts are primarily driven by technological innovation and human capital development. In recent years, the rise of artificial intelligence has redefined the productivity frontier...",
        questions: [
          { id: 'q1', skill: 'Reading', type: 'MCQ', text: 'What is the primary driver of economic shifts according to the text?', options: ['Agriculture', 'Technological Innovation', 'Mineral Extraction', 'Tourism'] }
        ]
      }
    ]
  },
  {
    id: 'test-lc-1',
    title: 'LanguageCert ESOL B2 Mock',
    sections: [
      {
        id: 's1', title: 'Listening & Responding', skill: 'Listening', timeLimit: 20,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        questions: [
          { id: 'q-lc-1', skill: 'Listening', type: 'MCQ', text: 'The speaker mentions a deadline for which day?', options: ['Monday', 'Friday', 'Next Week', 'Immediately'] }
        ]
      }
    ]
  }
];

export const products: Product[] = [
  { id: 'v-pte-ac', name: 'PTE Academic Voucher', category: 'PTE', type: 'Voucher', basePrice: 165, currency: 'USD', pricingModel: 'Country-Wise', description: 'Standard PTE Academic.', icon: '📊', stockCount: 12 },
  { id: 'v-ielts-ac', name: 'IELTS Academic Voucher', category: 'IELTS', type: 'Voucher', basePrice: 155, currency: 'USD', pricingModel: 'Country-Wise', description: 'Standard IELTS.', icon: '🌐', stockCount: 4 },
  { id: 'v-lc-ac', name: 'LanguageCert Academic', category: 'LanguageCert', type: 'Voucher', basePrice: 150, currency: 'USD', pricingModel: 'Global', description: 'High-stakes English.', icon: '📜', stockCount: 15 },
];

export const voucherCodes: VoucherCode[] = products.flatMap(p => 
  Array(10).fill(0).map((_, i) => ({
    id: `vc-${p.id}-${i}`,
    productId: p.id,
    code: `${p.category.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    status: 'Available' as const,
    expiryDate: '2026-12-31',
    uploadDate: new Date().toISOString()
  }))
);

export const countryGuides: CountryGuide[] = [
  { id: 'uk', countryId: 'uk', slug: 'uk', title: 'Study in UK', heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', costOfLiving: '£1,200', visaRequirements: 'Student Visa', content: 'UK Content' },
];

export const universities: University[] = [];
export const courses: Course[] = [];
export const qualifications: Qualification[] = [];
export const manualSubmissions: ManualSubmission[] = [];
export const testResults: TestResult[] = [];
export const immigrationGuides: any[] = [];
