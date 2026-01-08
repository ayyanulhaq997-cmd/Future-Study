
import { Product, VoucherCode, User, University, CountryGuide, Course, Qualification, LMSCourse, LMSPracticeTest, ManualSubmission, TestResult } from '../types';

export const users: User[] = [
  { id: 'u-owner', name: 'Business Owner', email: 'admin@unicou.uk', role: 'System Admin/Owner', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom' },
  { id: 'u-ops', name: 'General Manager', email: 'ops@unicou.uk', role: 'Operation Manager', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom' },
  { id: 'u-std', name: 'Alex Student', email: 'student@test.com', role: 'Student', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom' },
];

export const products: Product[] = [
  { id: 'v-pte-aca', name: 'PTE Academic Voucher', category: 'PTE', type: 'Voucher', basePrice: 165, currency: 'USD', pricingModel: 'Country-Wise', description: 'Standard PTE Academic.', icon: '' },
  { id: 'v-pte-ukvi', name: 'PTE Academic UKVI', category: 'PTE', type: 'Voucher', basePrice: 185, currency: 'USD', pricingModel: 'Country-Wise', description: 'SELT version for UKVI.', icon: '' },
  { id: 'v-ielts-aca', name: 'IELTS Academic Voucher', category: 'IELTS', type: 'Voucher', basePrice: 160, currency: 'USD', pricingModel: 'Country-Wise', description: 'IELTS Academic.', icon: '' },
  { id: 'v-ielts-ukvi', name: 'IELTS for UKVI', category: 'IELTS', type: 'Voucher', basePrice: 195, currency: 'USD', pricingModel: 'Country-Wise', description: 'IELTS for UKVI Applications.', icon: '' },
  { id: 'v-toefl-ibt', name: 'TOEFL iBT Voucher', category: 'TOEFL', type: 'Voucher', basePrice: 160, currency: 'USD', pricingModel: 'Global', description: 'TOEFL iBT Official Code.', icon: '' },
  { id: 'v-langcert-aca', name: 'LanguageCert Academic', category: 'LanguageCert', type: 'Voucher', basePrice: 155, currency: 'USD', pricingModel: 'Global', description: 'LanguageCert ESOL Voucher.', icon: '' },
  { id: 'v-ellt-oxford', name: 'Oxford ELLT Global', category: 'Oxford ELLT', type: 'Voucher', basePrice: 120, currency: 'USD', pricingModel: 'Global', description: 'Oxford International Digital Test.', icon: '' },
  { id: 'v-duo-lingo', name: 'Duolingo English Test', category: 'Duolingo', type: 'Voucher', basePrice: 59, currency: 'USD', pricingModel: 'Global', description: 'Fast results Duolingo code.', icon: '' },
  { id: 'v-skills-eng', name: 'Skills for English SELT', category: 'Skills for English', type: 'Voucher', basePrice: 170, currency: 'USD', pricingModel: 'Global', description: 'SELT approved for UK Visas.', icon: '' },
  { id: 'v-gre-gen', name: 'GRE General Voucher', category: 'OTHER', type: 'Voucher', basePrice: 220, currency: 'USD', pricingModel: 'Global', description: 'ETS GRE Official Voucher.', icon: '' },
];

export const lmsCourses: LMSCourse[] = [
  { id: 'c-pte-master', title: 'PTE 79+ Masterclass', category: 'PTE', thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800', description: 'Complete training for PTE Academic.', duration: '25 Hours', instructor: 'Prof. Michael Aris', price: 49 },
  { id: 'c-ielts-band8', title: 'IELTS Band 8 Strategy', category: 'IELTS', thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', description: 'Advanced strategies for IELTS Academic.', duration: '30 Hours', instructor: 'Sarah Jenkins', price: 55 },
];

export const countryGuides: CountryGuide[] = [
  { id: 'uk', countryId: 'uk', slug: 'uk', title: 'Study in United Kingdom', heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', costOfLiving: '£1,023 - £1,334 / Mo', visaRequirements: 'CAS + Maintenance', content: 'World-renowned degrees with 2-year Post Study Work rights.' },
  { id: 'usa', countryId: 'us', slug: 'usa', title: 'Study in USA', heroImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200', costOfLiving: '$1,200 - $2,500 / Mo', visaRequirements: 'I-20 + F1 Visa', content: 'Home to the Ivy League and world-leading research opportunities.' },
  { id: 'canada', countryId: 'ca', slug: 'canada', title: 'Study in Canada', heroImage: 'https://images.unsplash.com/photo-1517935703635-27c736827375?w=1200', costOfLiving: 'CAD 1,500 / Mo', visaRequirements: 'PAL + Study Permit', content: 'Leading PR pathways and diverse multicultural environment.' },
  { id: 'australia', countryId: 'au', slug: 'australia', title: 'Study in Australia', heroImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200', costOfLiving: 'AUD 2,000 / Mo', visaRequirements: 'Subclass 500', content: 'Exceptional lifestyle and globally ranked universities.' },
  { id: 'germany', countryId: 'de', slug: 'germany', title: 'Study in Germany', heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', costOfLiving: '€934 / Mo (Blocked)', visaRequirements: 'National Visa D', content: 'Tuition-free public universities and engineering excellence.' },
  { id: 'italy', countryId: 'it', slug: 'italy', title: 'Study in Italy', heroImage: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200', costOfLiving: '€700 - €1,000 / Mo', visaRequirements: 'D-Type Visa', content: 'Affordable fashion, design, and medicine with DSU scholarships.' },
  { id: 'dubai', countryId: 'ae', slug: 'dubai', title: 'Study in Dubai', heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200', costOfLiving: 'AED 3,000 / Mo', visaRequirements: 'Student Residence', content: 'A global business hub with satellite campuses from top UK unis.' },
  { id: 'malaysia', countryId: 'my', slug: 'malaysia', title: 'Study in Malaysia', heroImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a594?w=1200', costOfLiving: 'RM 1,500 / Mo', visaRequirements: 'VAL Process', content: 'A top 10 education destination with very affordable high quality living.' },
  { id: 'cyprus', countryId: 'cy', slug: 'cyprus', title: 'Study in Cyprus', heroImage: 'https://images.unsplash.com/photo-1505305976870-c0be1cd39939?w=1200', costOfLiving: '€600 - €900 / Mo', visaRequirements: 'Blue Card / Permit', content: 'Gateway to Europe with specialization in hospitality and maritime.' },
  { id: 'turkey', countryId: 'tr', slug: 'turkey', title: 'Study in Turkey', heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200', costOfLiving: '$400 - $700 / Mo', visaRequirements: 'Student Ikamet', content: 'Bridging East and West with world-class medical and tech faculties.' },
  { id: 'europe', countryId: 'eu', slug: 'europe', title: 'Study in Europe', heroImage: 'https://images.unsplash.com/photo-1473951574080-01fe45ec8643?w=1200', costOfLiving: 'Variable', visaRequirements: 'Schengen Student', content: 'Access the entire Schengen zone via diverse academic programs.' }
];

export const lmsTests: LMSPracticeTest[] = [
  {
    id: 'full-mock-1', title: 'IELTS Academic Full Simulation',
    sections: [
      {
        id: 'ielts-reading-1', title: 'Reading: Text Analysis', skill: 'Reading', timeLimit: 60,
        passageText: `The Impact of Urban Green Spaces...`,
        questions: [{ id: 'q1', skill: 'Reading', type: 'TFNG', text: 'Urban green spaces have a negative impact on mental health.' }]
      }
    ]
  },
  {
    id: 'pte-mock-1', title: 'PTE Academic Mock (Full)',
    sections: [
      {
        id: 'pte-read-1', title: 'Read Aloud & Repeat Sentence', skill: 'Speaking', timeLimit: 30,
        questions: [{ id: 'pq1', skill: 'Speaking', type: 'Read-Aloud', text: 'The development of clean energy sources is the most significant challenge of our century.' }]
      }
    ]
  }
];

export const universities: University[] = [];
export const courses: Course[] = [];
export const qualifications: Qualification[] = [];
export const manualSubmissions: ManualSubmission[] = [];
export const testResults: TestResult[] = [];
export const immigrationGuides: any[] = [];
export const voucherCodes: VoucherCode[] = [];
