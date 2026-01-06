
import { Product, VoucherCode, User, University, CountryGuide, Course, Qualification, LMSCourse, LMSPracticeTest, ImmigrationGuideData, ManualSubmission, TestResult } from '../types';

export const users: User[] = [
  { id: 'u-admin', name: 'System Administrator', email: 'admin@unicou.uk', role: 'System Admin/Owner', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-finance', name: 'Finance Controller', email: 'finance@unicou.uk', role: 'Finance', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-trainer-1', name: 'Lead Evaluator', email: 'trainer@unicou.uk', role: 'Trainer', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-sales', name: 'Sales Manager', email: 'sales@unicou.uk', role: 'Sales', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-agent-test', name: 'Authorized Agent', email: 'agent@unicou.uk', role: 'Agent', isAuthorized: true, verified: true, status: 'Active', tier: 2 },
  { id: 'u-student-test', name: 'Legacy Student', email: 'student@unicou.uk', role: 'Student', isAuthorized: true, verified: true, status: 'Active' },
];

export const products: Product[] = [
  { id: 'v-1', name: 'IELTS Academic Voucher', category: 'IELTS', type: 'Voucher', basePrice: 149, currency: 'USD', pricingModel: 'Country-Wise', description: 'British Council/IDP Official.', icon: '🌐' },
  { id: 'v-6', name: 'PTE Academic Voucher', category: 'PTE', type: 'Voucher', basePrice: 165, currency: 'USD', pricingModel: 'Country-Wise', description: 'Pearson Official Standard.', icon: '📊' },
  { id: 'v-19', name: 'TOEFL iBT Official', category: 'ETS', type: 'Voucher', basePrice: 195, currency: 'USD', pricingModel: 'Country-Wise', description: 'ETS TOEFL iBT Global.', icon: '🌎' },
  { id: 'v-24', name: 'LanguageCert Academic', category: 'LanguageCert', type: 'Voucher', basePrice: 180, currency: 'USD', pricingModel: 'Global', description: 'LanguageCert International Academic Exam.', icon: '📜' },
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
  { id: 'uk', countryId: 'uk', slug: 'uk', title: 'Study in United Kingdom', heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', costOfLiving: '£1,200/mo', visaRequirements: 'Student Visa (Tier 4)', content: 'The UK remains a premier node for global academic excellence.' },
  { id: 'australia', countryId: 'australia', slug: 'australia', title: 'Study in Australia', heroImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200', costOfLiving: 'A$2,200/mo', visaRequirements: 'Student Visa (Subclass 500)', content: 'Australia offers high-quality education and post-study work opportunities.' },
  /* Fixed: Wrapped the content property value in quotes to resolve multiple syntax errors */
  { id: 'canada', countryId: 'canada', slug: 'canada', title: 'Study in Canada', heroImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200', costOfLiving: 'C$1,800/mo', visaRequirements: 'Study Permit', content: 'Canada provides a welcoming environment and path to PR.' },
  { id: 'usa', countryId: 'usa', slug: 'usa', title: 'Study in USA', heroImage: 'https://images.unsplash.com/photo-1550944034-4fed72448d22?w=1200', costOfLiving: '$2,000/mo', visaRequirements: 'F-1 Visa', content: 'World-leading universities and diverse academic pathways.' },
  { id: 'germany', countryId: 'germany', slug: 'germany', title: 'Study in Germany', heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', costOfLiving: '€950/mo', visaRequirements: 'German National Visa', content: 'Tuition-free public universities and strong engineering nodes.' },
  { id: 'italy', countryId: 'italy', slug: 'italy', title: 'Study in Italy', heroImage: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=1200', costOfLiving: '€800/mo', visaRequirements: 'Type D Visa', content: 'Rich cultural heritage and innovative academic hubs.' },
  { id: 'europe', countryId: 'europe', slug: 'europe', title: 'Study in Europe Hub', heroImage: 'https://images.unsplash.com/photo-1471115853179-bb1d604434e0?w=1200', costOfLiving: 'Variable', visaRequirements: 'Schengen Area Policies', content: 'Unified access to multiple European academic destinations.' },
];

export const universities: University[] = [
  { id: 'uni-man', name: 'University of Manchester', slug: 'manchester', location: 'UK', ranking: 32, description: 'Research node.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200', countryId: 'uk', website: 'https://www.manchester.ac.uk' },
  { id: 'uni-melb', name: 'University of Melbourne', slug: 'melbourne', location: 'Australia', ranking: 14, description: 'Academic excellence hub.', logo: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=200', countryId: 'australia', website: 'https://www.unimelb.edu.au' },
  { id: 'uni-tor', name: 'University of Toronto', slug: 'toronto', location: 'Canada', ranking: 21, description: 'Canada leading research hub.', logo: 'https://images.unsplash.com/photo-1498243639351-a0609b46610b?w=200', countryId: 'canada', website: 'https://www.utoronto.ca' },
];

export const courses: Course[] = [
  { id: 'c-1', universityId: 'uni-man', title: 'MSc Data Science', degree: 'Postgraduate', duration: '1 Year', tuitionFee: '£28,000' }
];

export const qualifications: Qualification[] = [
  { id: 'q-1', title: 'OTHM Level 3 Diploma', qualificationBody: 'OTHM', level: 'Level 3', duration: '6 Months', tuitionFees: '£1,200', description: 'Foundation pathway.', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800', requirements: ['High School'] }
];

export const lmsCourses: LMSCourse[] = [
  { id: 'lms-1', title: 'PTE Mastery: Full Lifecycle', category: 'PTE', thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', description: 'Pearson Test of English Blueprint.', duration: '40 Hours', instructor: 'Dr. Sarah', price: 99 },
];

export const lmsTests: LMSPracticeTest[] = [
  { id: 'full-mock-1', title: 'PTE Full Mock Exam A', sections: [{ id: 's-1', title: 'Speaking & Writing', skill: 'Speaking', timeLimit: 77, questions: [] }] }
];

export const manualSubmissions: ManualSubmission[] = [
  { id: 'sub-101', userId: 'u-student-test', userName: 'Test Student', userEmail: 'student@unicou.uk', testTitle: 'PTE Mock A', skill: 'Writing', questionText: 'Summarize the impact of AI.', studentAnswer: 'AI is changing education paradigms...', maxScore: 90, timestamp: new Date().toISOString() }
];

export const testResults: TestResult[] = [
  { id: 'res-505', userId: 'u-student-test', testId: 'full-mock-1', testTitle: 'PTE Full Mock A', skillScores: [{ skill: 'Listening', score: 78, total: 90, isGraded: true, band: '78' }], overallBand: '78', timeTaken: 10800, timestamp: new Date().toISOString() }
];

export const immigrationGuides: ImmigrationGuideData[] = [
  { id: 'ig-uk', slug: 'uk-pr', title: 'UK PR Pathways', content: 'Comprehensive guide to Graduate Route settlements.', heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', pathways: [] }
];
