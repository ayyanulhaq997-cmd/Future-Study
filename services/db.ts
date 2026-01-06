
import { Product, VoucherCode, User, University, CountryGuide, Course, Qualification, LMSCourse, LMSPracticeTest, ManualSubmission, TestResult, Lead } from '../types';

export const users: User[] = [
  // --- OWNER / ADMIN ---
  { id: 'u-admin', name: 'System Owner', email: 'admin@unicou.uk', role: 'System Admin/Owner', isAuthorized: true, verified: true, status: 'Active' },
  
  // --- OPERATIONS MANAGERS ---
  { id: 'u-ops', name: 'Ops Director', email: 'ops@unicou.uk', role: 'Operation Manager', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-m1', name: 'Ops Manager 1', email: 'manager1@unicou.uk', role: 'Operation Manager', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-m2', name: 'Ops Manager 2', email: 'manager2@unicou.uk', role: 'Operation Manager', isAuthorized: true, verified: true, status: 'Active' },
  
  // --- SUPPORT TEAMS ---
  { id: 'u-sup', name: 'Support Lead', email: 'support@unicou.uk', role: 'Support', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-sup1', name: 'Support Node 1', email: 'support1@unicou.uk', role: 'Support', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-sup2', name: 'Support Node 2', email: 'support2@unicou.uk', role: 'Support', isAuthorized: true, verified: true, status: 'Active' },
  
  // --- FINANCE & SALES ---
  { id: 'u-fin', name: 'Finance Controller', email: 'finance@unicou.uk', role: 'Finance', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-sales', name: 'Sales Manager', email: 'sales@unicou.uk', role: 'Sales', isAuthorized: true, verified: true, status: 'Active' },
  
  // --- PARTNERS & INSTITUTES ---
  { id: 'u-alpha', name: 'Agent Alpha', email: 'agent_alpha@test.com', role: 'Agent', isAuthorized: true, verified: true, status: 'Active', tier: 2 },
  { id: 'u-beta', name: 'Center Beta', email: 'center_beta@test.com', role: 'Institute', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-train-node', name: 'Training Hub', email: 'training@unicou.uk', role: 'Institute', isAuthorized: true, verified: true, status: 'Active' },
  
  // --- STUDENTS & CANDIDATES ---
  { id: 'u-std', name: 'Legacy Student', email: 'student@unicou.uk', role: 'Student', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-c1', name: 'Candidate 1', email: 'candidate1@test.com', role: 'Student', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-c2', name: 'Candidate 2', email: 'candidate2@test.com', role: 'Student', isAuthorized: true, verified: true, status: 'Active' },
];

export const products: Product[] = [
  { id: 'v-pte-ac', name: 'PTE Academic Voucher', category: 'PTE', type: 'Voucher', basePrice: 165, currency: 'USD', pricingModel: 'Country-Wise', description: 'Standard PTE Academic.', icon: '📊' },
  { id: 'v-ielts-ac', name: 'IELTS Academic Voucher', category: 'IELTS', type: 'Voucher', basePrice: 155, currency: 'USD', pricingModel: 'Country-Wise', description: 'Standard IELTS.', icon: '🌐' },
  { id: 'v-lc-ac', name: 'LanguageCert Academic', category: 'LanguageCert', type: 'Voucher', basePrice: 150, currency: 'USD', pricingModel: 'Global', description: 'High-stakes English.', icon: '📜' },
];

export const voucherCodes: VoucherCode[] = products.flatMap(p => 
  Array(15).fill(0).map((_, i) => ({
    id: `vc-${p.id}-${i}`,
    productId: p.id,
    code: `${p.category.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    status: 'Available' as const,
    expiryDate: '2026-12-31',
    uploadDate: new Date().toISOString()
  }))
);

export const lmsTests: LMSPracticeTest[] = [
  {
    id: 'lc-test-2',
    title: 'LanguageCert Academic Mock',
    sections: [
      {
        id: 's1', title: 'Reading: Chicken Domestication', skill: 'Reading', timeLimit: 15,
        passageText: "Full passage about chicken domestication history...",
        questions: [{ id: 'q1', skill: 'Reading', type: 'Insert-Sentence', text: 'Select correct sentence for gap (12)', options: ['A', 'B', 'C', 'D'] }]
      }
    ]
  }
];

export const countryGuides: CountryGuide[] = [
  { id: 'uk', countryId: 'uk', slug: 'uk', title: 'Study in UK', heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', costOfLiving: '£1,200', visaRequirements: 'Student Visa', content: 'UK Guide Content' },
];

export const universities: University[] = [];
export const courses: Course[] = [];
export const qualifications: Qualification[] = [];
export const lmsCourses: LMSCourse[] = [];
export const manualSubmissions: ManualSubmission[] = [];
export const testResults: TestResult[] = [];
export const immigrationGuides: any[] = [];
