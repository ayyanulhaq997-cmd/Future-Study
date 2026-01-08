
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
  { id: 'v-toefl-ibt', name: 'TOEFL iBT Voucher', category: 'TOEFL', type: 'Voucher', basePrice: 160, currency: 'USD', pricingModel: 'Global', description: 'TOEFL iBT Official Code.', icon: '' },
];

export const lmsCourses: LMSCourse[] = [
  { id: 'c-pte-master', title: 'PTE 79+ Masterclass', category: 'PTE', thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800', description: 'Complete training for PTE Academic.', duration: '25 Hours', instructor: 'Prof. Michael Aris', price: 49 },
];

export const countryGuides: CountryGuide[] = [
  { 
    id: 'uk', countryId: 'uk', slug: 'uk', title: 'Study in United Kingdom', heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', costOfLiving: '£10,539 - £13,761', visaRequirements: 'UKVI Student Visa', 
    content: `The UK offers shorter course durations and world-class research nodes. Graduate Route allows 2-year post-study work.`
  },
  { 
    id: 'australia', countryId: 'au', slug: 'australia', title: 'Study in Australia', heroImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200', costOfLiving: 'AUD 21,041', visaRequirements: 'Subclass 500', 
    content: `Australia is a leader in technology and healthcare education with extensive regional work opportunities.`
  },
  { 
    id: 'usa', countryId: 'us', slug: 'usa', title: 'Study in USA', heroImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200', costOfLiving: 'USD 15,000 - 25,000', visaRequirements: 'F1 Student Visa', 
    content: `Home to the Ivy League and Silicon Valley clusters. OPT/CPT provides paths for industrial training.`
  },
  { 
    id: 'canada', countryId: 'ca', slug: 'canada', title: 'Study in Canada', heroImage: 'https://images.unsplash.com/photo-1517935703635-27c736827375?w=1200', costOfLiving: 'CAD 20,635', visaRequirements: 'Study Permit (SDS)', 
    content: `Canada offers the most straightforward PR pathways for international graduates via the Express Entry system.`
  },
  { 
    id: 'germany', countryId: 'de', slug: 'germany', title: 'Study in Germany', heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', costOfLiving: '€11,208 (Blocked A/C)', visaRequirements: 'National Visa (D)', 
    content: `Tuition-free public universities and a powerhouse engineering sector make Germany a top choice.`
  },
  { 
    id: 'italy', countryId: 'it', slug: 'italy', title: 'Study in Italy', heroImage: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200', costOfLiving: '€6,000 - 10,000', visaRequirements: 'D-Type Visa', 
    content: `Affordable excellence in design, fashion, and medical sciences with DSU regional scholarship nodes.`
  },
  { 
    id: 'dubai', countryId: 'ae', slug: 'dubai', title: 'Study in Dubai', heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200', costOfLiving: 'AED 35,000 - 50,000', visaRequirements: 'Student Residence Visa', 
    content: `Study in a global logistics and business hub with campuses from top UK and Australian universities.`
  },
  { 
    id: 'malaysia', countryId: 'my', slug: 'malaysia', title: 'Study in Malaysia', heroImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a594?w=1200', costOfLiving: 'USD 4,000 - 6,000', visaRequirements: 'VAL Process', 
    content: `A top 10 global education hub offering affordable high-quality living and English-taught courses.`
  },
  { 
    id: 'cyprus', countryId: 'cy', slug: 'cyprus', title: 'Study in Cyprus', heroImage: 'https://images.unsplash.com/photo-1505305976870-c0be1cd39939?w=1200', costOfLiving: '€7,000 - 9,000', visaRequirements: 'EU Study Permit', 
    content: `Gateway to Europe with high visa success rates and specialization in hospitality and maritime studies.`
  },
  { 
    id: 'turkey', countryId: 'tr', slug: 'turkey', title: 'Study in Turkey', heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200', costOfLiving: 'USD 5,000 - 8,000', visaRequirements: 'Student Ikamet', 
    content: `Bridging East and West, Turkey offers high-quality medicine and engineering programs with diverse culture.`
  }
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
  }
];

export const universities: University[] = [];
export const courses: Course[] = [];
export const qualifications: Qualification[] = [];
export const manualSubmissions: ManualSubmission[] = [];
export const testResults: TestResult[] = [];
export const immigrationGuides: any[] = [];
export const voucherCodes: VoucherCode[] = [];
