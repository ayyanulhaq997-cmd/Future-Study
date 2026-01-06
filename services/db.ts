
import { Product, VoucherCode, User, University, CountryGuide, Course, Qualification, LMSCourse, LMSPracticeTest, ManualSubmission, TestResult } from '../types';

export const users: User[] = [
  { id: 'u-owner', name: 'Business Owner', email: 'admin@unicou.uk', role: 'System Admin/Owner', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-ops', name: 'General Manager', email: 'ops@unicou.uk', role: 'Operation Manager', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-fin', name: 'Finance Lead', email: 'finance@unicou.uk', role: 'Finance Manager', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-aca', name: 'Academic Director', email: 'academic@unicou.uk', role: 'Academic Manager', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-sal-m', name: 'Sales Director', email: 'sales_mgr@unicou.uk', role: 'Sales Manager', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-sal-a', name: 'Support Frontline', email: 'sales_agent@unicou.uk', role: 'Sales Agent', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-agent', name: 'Consultancy Alpha', email: 'agent@test.com', role: 'Agent', isAuthorized: true, verified: true, status: 'Active', tier: 2 },
  { id: 'u-inst', name: 'Prep Center Beta', email: 'center@test.com', role: 'Academic Institute', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-teacher', name: 'Lead Instructor', email: 'teacher@test.com', role: 'Teacher', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-std', name: 'Alex Student', email: 'student@test.com', role: 'Student', isAuthorized: true, verified: true, status: 'Active' },
];

export const countryGuides: CountryGuide[] = [
  { id: 'uk', countryId: 'uk', slug: 'uk', title: 'Study in UK', heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', costOfLiving: '£1,200', visaRequirements: 'Tier 4 Student Visa', content: 'The UK remains a top destination for global education with post-study work options.' },
  { id: 'australia', countryId: 'au', slug: 'australia', title: 'Study in Australia', heroImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200', costOfLiving: '$2,100 AUD', visaRequirements: 'Subclass 500', content: 'Australia offers world-class research facilities and a vibrant lifestyle for international students.' },
  { id: 'canada', countryId: 'ca', slug: 'canada', title: 'Study in Canada', heroImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200', costOfLiving: '$1,800 CAD', visaRequirements: 'Study Permit / SDS', content: 'Canada is known for its high quality of life and friendly immigration pathways for graduates.' },
  { id: 'usa', countryId: 'us', slug: 'usa', title: 'Study in USA', heroImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200', costOfLiving: '$2,500 USD', visaRequirements: 'F-1 Student Visa', content: 'The USA hosts the largest number of top-ranked universities globally with OPT opportunities.' },
  { id: 'germany', countryId: 'de', slug: 'germany', title: 'Study in Germany', heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', costOfLiving: '€950', visaRequirements: 'National Visa', content: 'Germany offers low-to-no tuition fees at public universities and a strong industrial base.' },
  { id: 'italy', countryId: 'it', slug: 'italy', title: 'Study in Italy', heroImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200', costOfLiving: '€800', visaRequirements: 'Type D Visa', content: 'Italy is perfect for design, architecture, and humanities with generous regional scholarships.' },
  { id: 'europe', countryId: 'eu', slug: 'europe', title: 'Study in Europe Hub', heroImage: 'https://images.unsplash.com/photo-1471623197341-389f41434f8d?w=1200', costOfLiving: 'Variable', visaRequirements: 'Schengen Educational', content: 'Explore pathways in Sweden, Finland, Cyprus and more through our unified hub.' },
  { id: 'new-zealand', countryId: 'nz', slug: 'new-zealand', title: 'Study in NZ', heroImage: 'https://images.unsplash.com/photo-1469521669194-bdf95559c13d?w=1200', costOfLiving: '$1,900 NZD', visaRequirements: 'Fee Paying Student Visa', content: 'New Zealand offers a safe, peaceful environment with a focus on practical learning.' },
  { id: 'malaysia', countryId: 'my', slug: 'malaysia', title: 'Study in Malaysia', heroImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200', costOfLiving: '$600 USD', visaRequirements: 'Student Pass', content: 'Affordable high-quality education and a multicultural atmosphere in Southeast Asia.' },
  { id: 'turkey', countryId: 'tr', slug: 'turkey', title: 'Study in Turkey', heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200', costOfLiving: '$500 USD', visaRequirements: 'Education Visa', content: 'Turkey bridges East and West with historic institutions and competitive programs.' },
];

export const lmsCourses: LMSCourse[] = [
  { id: 'course-pte-1', title: 'PTE Academic Masterclass', category: 'PTE', thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800', description: 'Comprehensive strategies for all 20 item types in PTE Academic.', duration: '20 Hours', instructor: 'Dr. Sarah Smith', price: 49 },
  { id: 'course-ielts-1', title: 'IELTS Band 8+ Foundation', category: 'IELTS', thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', description: 'Master the Writing and Speaking modules for IELTS Academic.', duration: '15 Hours', instructor: 'James Clear', price: 39 },
  { id: 'course-toefl-1', title: 'TOEFL iBT Success Path', category: 'TOEFL', thumbnail: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800', description: 'Focused training for the computer-based TOEFL exam.', duration: '18 Hours', instructor: 'Amy Vance', price: 45 }
];

export const lmsTests: LMSPracticeTest[] = [
  { id: 'test-pte-1', title: 'PTE Mock Exam #01', sections: [{ id: 's1', title: 'Reading & Writing', skill: 'Reading', timeLimit: 30, questions: [{ id: 'q1', skill: 'Reading', type: 'MCQ', text: 'Select the best option.', options: ['A', 'B', 'C'] }] }] },
  { id: 'test-ielts-1', title: 'IELTS Full Mock #01', sections: [{ id: 's1', title: 'Listening Module', skill: 'Listening', timeLimit: 40, questions: [{ id: 'q2', skill: 'Listening', type: 'MCQ', text: 'Where did they meet?', options: ['Library', 'Cafe', 'Park'] }] }] }
];

export const products: Product[] = [
  { id: 'v-pte', name: 'PTE Academic Voucher', category: 'PTE', type: 'Voucher', basePrice: 165, currency: 'USD', pricingModel: 'Country-Wise', description: 'Standard PTE Voucher.', icon: '📊' },
  { id: 'v-ielts', name: 'IELTS Exam Voucher', category: 'IELTS', type: 'Voucher', basePrice: 155, currency: 'USD', pricingModel: 'Country-Wise', description: 'Standard IELTS Voucher.', icon: '🌐' },
  { id: 'v-toefl', name: 'TOEFL iBT Voucher', category: 'TOEFL', type: 'Voucher', basePrice: 160, currency: 'USD', pricingModel: 'Global', description: 'TOEFL Voucher.', icon: '📜' },
];

export const universities: University[] = [];
export const courses: Course[] = [];
export const qualifications: Qualification[] = [];
export const manualSubmissions: ManualSubmission[] = [];
export const testResults: TestResult[] = [];
export const immigrationGuides: any[] = [];
export const voucherCodes: VoucherCode[] = [];
