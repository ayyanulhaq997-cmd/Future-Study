
import { Product, VoucherCode, User, University, CountryGuide, Course, Qualification, LMSCourse, LMSPracticeTest, ImmigrationGuideData, ManualSubmission, TestResult } from '../types';

export const users: User[] = [
  { id: 'u-admin', name: 'System Administrator', email: 'admin@unicou.uk', role: 'System Admin/Owner', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-finance', name: 'Finance Controller', email: 'finance@unicou.uk', role: 'Finance', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-support', name: 'Operations Support', email: 'support@unicou.uk', role: 'Support', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-ops', name: 'Operations Manager', email: 'ops@unicou.uk', role: 'Operation Manager', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-training', name: 'Authorized Training Center', email: 'training@unicou.uk', role: 'Institute', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-student-test', name: 'Test Student', email: 'student@unicou.uk', role: 'Student', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-trainer-test', name: 'Lead Evaluator', email: 'trainer@unicou.uk', role: 'Trainer', isAuthorized: true, verified: true, status: 'Active' },
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
  Array(50).fill(0).map((_, i) => ({
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
    content: `### The Global Gold Standard for Education\nThe United Kingdom remains the most prestigious destination for international students worldwide. Home to Oxford, Cambridge, and London's elite institutions, it offers a fast-track to global career nodes.`
  },
  { 
    id: 'australia', countryId: 'australia', slug: 'australia', title: 'Study in Australia', 
    heroImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200', 
    costOfLiving: '$1,800 - $2,200 AUD/mo', visaRequirements: 'Subclass 500',
    content: `### Excellence in Research and Innovation\nAustralia offers a unique blend of high-ranking universities and an unparalleled quality of life. Post-study work rights make it a primary target for global mobility.`
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
  { id: 'lms-1', title: 'PTE Academic Masterclass', category: 'PTE', thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', description: 'Complete end-to-end preparation for the Pearson Test of English.', duration: '40 Hours', instructor: 'Dr. Sarah', price: 99 }
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
    studentAnswer: 'Digital migration has revolutionized how international students access academic nodes. By utilizing virtual learning hubs and automated voucher systems, the traditional barriers of geography are being dismantled...',
    maxScore: 90,
    timestamp: new Date().toISOString()
  },
  {
    id: 'sub-102',
    userId: 'u-student-test',
    userName: 'Test Student',
    userEmail: 'student@unicou.uk',
    testTitle: 'IELTS Academic 01',
    skill: 'Speaking',
    questionText: 'Describe a traditional festival in your country.',
    studentAnswer: '[AUDIO_NODE_SIMULATED: student_voice_record_001.mp3]',
    maxScore: 9,
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
