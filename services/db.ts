
import { Product, VoucherCode, User, University, CountryGuide, Course, Qualification, LMSCourse, LMSPracticeTest, ImmigrationGuideData, ManualSubmission, TestResult } from '../types';

export const users: User[] = [
  { id: 'u-admin', name: 'System Administrator', email: 'admin@unicou.uk', role: 'System Admin/Owner', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-finance', name: 'Finance Controller', email: 'finance@unicou.uk', role: 'Finance', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-support-1', name: 'Support Node Alpha', email: 'support1@unicou.uk', role: 'Support', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-ops-1', name: 'Operations Manager 1', email: 'manager1@unicou.uk', role: 'Operation Manager', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-trainer-1', name: 'Lead Evaluator', email: 'trainer@unicou.uk', role: 'Trainer', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-agent-alpha', name: 'Alpha Global Partners', email: 'agent_alpha@test.com', role: 'Agent', isAuthorized: true, verified: true, status: 'Active', tier: 2 },
  { id: 'u-student-test', name: 'Legacy Test Student', email: 'student@unicou.uk', role: 'Student', isAuthorized: true, verified: true, status: 'Active' },
];

export const products: Product[] = [
  { id: 'v-1', name: 'IELTS Academic Voucher', category: 'IELTS', type: 'Voucher', basePrice: 149, currency: 'USD', pricingModel: 'Country-Wise', description: 'British Council/IDP Official.', icon: '🌐' },
  { id: 'v-6', name: 'PTE Academic Voucher', category: 'PTE', type: 'Voucher', basePrice: 165, currency: 'USD', pricingModel: 'Country-Wise', description: 'Pearson Official Standard.', icon: '📊' },
  { id: 'v-19', name: 'TOEFL iBT Official', category: 'ETS', type: 'Voucher', basePrice: 195, currency: 'USD', pricingModel: 'Country-Wise', description: 'ETS TOEFL iBT Global.', icon: '🌎' },
  { id: 'v-20', name: 'Duolingo English Test', category: 'Duolingo', type: 'Voucher', basePrice: 60, currency: 'USD', pricingModel: 'Global', description: 'Duolingo Access.', icon: '🦉' },
  { id: 'v-21', name: 'Oxford ELLT Voucher', category: 'Oxford ELLT', type: 'Voucher', basePrice: 120, currency: 'GBP', pricingModel: 'Global', description: 'Oxford International Digital.', icon: '🎓' },
  { id: 'v-24', name: 'LanguageCert Academic', category: 'LanguageCert', type: 'Voucher', basePrice: 180, currency: 'USD', pricingModel: 'Global', description: 'LanguageCert International Academic Exam.', icon: '📜' },
  { id: 'v-26', name: 'Skills for English (SELT)', category: 'Skills for English', type: 'Voucher', basePrice: 175, currency: 'GBP', pricingModel: 'Global', description: 'PSI Global Skills for English.', icon: '🎯' },
];

export const voucherCodes: VoucherCode[] = products.flatMap(p => 
  Array(100).fill(0).map((_, i) => ({
    id: `vc-${p.id}-${i}`,
    productId: p.id,
    code: `${p.category.substring(0,2).toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    status: 'Available' as const,
    expiryDate: '2026-12-31',
    uploadDate: '2024-01-01T00:00:00Z'
  }))
);

export const countryGuides: CountryGuide[] = [
  { 
    id: 'uk', countryId: 'uk', slug: 'uk', title: 'Study in United Kingdom', 
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', 
    costOfLiving: '£1,200 - £1,500/mo', visaRequirements: 'Student Visa (CAS)',
    content: `### The Global Gold Standard for Education\nThe United Kingdom remains the most prestigious destination for international students worldwide.`
  },
  { 
    id: 'australia', countryId: 'australia', slug: 'australia', title: 'Study in Australia', 
    heroImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200', 
    costOfLiving: '$1,800 - $2,200 AUD/mo', visaRequirements: 'Subclass 500',
    content: `### Excellence in Research and Innovation\nAustralia offers a unique blend of high-ranking universities.`
  },
  { 
    id: 'canada', countryId: 'canada', slug: 'canada', title: 'Study in Canada', 
    heroImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200', 
    costOfLiving: '$1,200 - $1,800 CAD/mo', visaRequirements: 'Study Permit (SDS/Non-SDS)',
    content: `### A Safe Haven for Excellence\nCanada combines top-tier academic standards.`
  }
];

export const universities: University[] = [
  { id: 'uni-manchester', name: 'University of Manchester', slug: 'manchester', location: 'Manchester, UK', ranking: 32, description: 'Global research powerhouse and member of the Russell Group.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200', countryId: 'uk', website: 'https://www.manchester.ac.uk' }
];

export const courses: Course[] = [
  { id: 'c-1', universityId: 'uni-manchester', title: 'MSc Data Science', degree: 'Postgraduate', duration: '1 Year', tuitionFee: '£28,000' }
];

export const qualifications: Qualification[] = [
  { id: 'q-1', title: 'OTHM Level 3 Foundation Diploma', qualificationBody: 'OTHM', level: 'Level 3', duration: '6 Months', tuitionFees: '£1,200', description: 'Entry path to UK universities.', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', requirements: ['High School'] }
];

export const lmsCourses: LMSCourse[] = [
  { id: 'lms-1', title: 'PTE Academic Masterclass', category: 'PTE', thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', description: 'Complete end-to-end preparation for the Pearson Test of English.', duration: '40 Hours', instructor: 'Dr. Sarah', price: 99 },
  { id: 'lms-2', title: 'LanguageCert ESOL Mastery', category: 'LanguageCert', thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800', description: 'Full preparation for LanguageCert International ESOL exams.', duration: '30 Hours', instructor: 'Prof. James', price: 120 },
  { id: 'lms-3', title: 'TOEFL iBT Digital Prep', category: 'TOEFL', thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800', description: 'Master the four sections of the digital TOEFL iBT exam.', duration: '35 Hours', instructor: 'Elena V.', price: 145 },
  { id: 'lms-4', title: 'IELTS Band 8+ Blueprint', category: 'IELTS', thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800', description: 'Advanced strategies for scoring Band 7.5 or higher in IELTS.', duration: '50 Hours', instructor: 'Simon R.', price: 150 }
];

export const lmsTests: LMSPracticeTest[] = [
  {
    id: 'full-mock-1',
    title: 'PTE Full Mock Exam A',
    sections: [
      { id: 's-1', title: 'Speaking & Writing', skill: 'Speaking', timeLimit: 77, questions: [] }
    ]
  }
];

export const manualSubmissions: ManualSubmission[] = [
  {
    id: 'sub-101',
    userId: 'u-student-test',
    userName: 'Test Student',
    userEmail: 'student@unicou.uk',
    testTitle: 'PTE Mock A',
    skill: 'Writing',
    questionText: 'Summarize the impact of digital migration on global education in 300 words.',
    studentAnswer: 'Digital migration has revolutionized how international students access academic nodes...',
    maxScore: 90,
    timestamp: new Date().toISOString()
  }
];

export const testResults: TestResult[] = [
  {
    id: 'res-505',
    userId: 'u-student-test',
    testId: 'full-mock-1',
    testTitle: 'PTE Full Mock A',
    skillScores: [
      { skill: 'Listening', score: 78, total: 90, isGraded: true, band: '78' },
      { skill: 'Reading', score: 82, total: 90, isGraded: true, band: '82' },
      { skill: 'Writing', score: 0, total: 90, isGraded: false, band: '--' },
      { skill: 'Speaking', score: 0, total: 90, isGraded: false, band: '--' }
    ],
    overallBand: 'PENDING',
    timeTaken: 10800,
    timestamp: new Date().toISOString()
  }
];

export const immigrationGuides: ImmigrationGuideData[] = [
  { id: 'ig-uk', slug: 'uk-pr', title: 'UK PR Pathways', content: 'Comprehensive guide to Skilled Worker and Graduate Route settlements.', heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', pathways: [] }
];
