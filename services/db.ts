
import { Product, VoucherCode, User, University, CountryGuide, Course, Qualification, LMSCourse, LMSPracticeTest, ManualSubmission, TestResult, LMSModule } from '../types';

export const users: User[] = [
  { id: 'u-owner', name: 'Business Owner', email: 'admin@unicou.uk', role: 'System Admin/Owner', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom', timestamp: new Date().toISOString() },
  { id: 'u-ops', name: 'General Manager', email: 'ops@unicou.uk', role: 'Operation Manager', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom', timestamp: new Date().toISOString() },
  { id: 'u-std', name: 'Alex Student', email: 'student@test.com', role: 'Student', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom', timestamp: new Date().toISOString() },
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

export const lmsModules: LMSModule[] = [
  {
    id: 'm-intro', title: 'Core Foundations', lessons: [
      { id: 'l-01', title: 'Introduction to Academic Mobility', type: 'Video', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'l-02', title: 'Global Exam Standards', type: 'Text', content: '### Objective\nUnderstand the strategic shift in global academic markets.\n\n### Content\nOur ecosystem ensures that every student is prepared for the specific scoring nodes of their target exam.' }
    ]
  },
  {
    id: 'm-pte-1', title: 'PTE Reading Mastery', lessons: [
      { id: 'l-03', title: 'Multiple Choice, Single Answer', type: 'Video', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { id: 'l-04', title: 'Reading Proficiency Quiz', type: 'Quiz', content: JSON.stringify([
        { id: 'q1', question: 'What is the primary focus of PTE Reading?', options: ['Fluency', 'Comprehension', 'Spelling', 'Audio recall'], correct: 1 }
      ])}
    ]
  }
];

export const lmsTests: LMSPracticeTest[] = [
  {
    id: 'full-mock-1', title: 'IELTS Academic Full Simulation',
    sections: [
      {
        id: 'ielts-reading-1', title: 'Reading: Text Analysis', skill: 'Reading', timeLimit: 60,
        passageText: `The Impact of Urban Green Spaces on Public Health...`,
        questions: [{ id: 'q1', skill: 'Reading', type: 'TFNG', text: 'Urban green spaces have a negative impact on mental health.' }]
      },
      {
        id: 'ielts-writing-1', title: 'Writing Task 2: Essay', skill: 'Writing', timeLimit: 40,
        questions: [{ id: 'q2', skill: 'Writing', type: 'Essay', text: 'Some believe that global academic mobility should be restricted to prevent brain drain. Discuss both views.' }]
      }
    ]
  }
];

export const countryGuides: CountryGuide[] = [
  { id: 'uk', countryId: 'uk', slug: 'uk', title: 'Study in United Kingdom', heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', costOfLiving: '£10,539 - £13,761', visaRequirements: '£10,000 – £18,000', content: 'World-renowned degrees with 2-year Post Study Work rights.' },
  { id: 'usa', countryId: 'us', slug: 'usa', title: 'Study in USA', heroImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200', costOfLiving: 'USD 12,000 – 18,000', visaRequirements: 'USD 11,000 – 40,000', content: 'Home to the Ivy League and world-leading research opportunities.' },
  { id: 'canada', countryId: 'ca', slug: 'canada', title: 'Study in Canada', heroImage: 'https://images.unsplash.com/photo-1517935703635-27c736827375?w=1200', costOfLiving: 'CAD 12,000 – 15,000', visaRequirements: 'CAD 11,000 – 35,000', content: 'Leading PR pathways and diverse multicultural environment.' },
];

export const universities: University[] = [
  { id: 'u-manchester', name: 'University of Manchester', slug: 'uom', location: 'Manchester, UK', description: 'A prestigious Russell Group university.', logo: 'https://via.placeholder.com/150', ranking: 27, countryId: 'uk', website: 'https://manchester.ac.uk' }
];

export const courses: Course[] = [
  { id: 'cs-msc-ai', universityId: 'u-manchester', title: 'MSc Artificial Intelligence', degree: 'Postgraduate', duration: '1 Year', tuitionFee: '£28,000', description: 'Advanced AI and Machine Learning.' }
];

export const qualifications: Qualification[] = [
  { id: 'othm-l3', title: 'OTHM Level 3 Foundation', qualificationBody: 'OTHM', level: 'Level 3', tuitionFees: '£1,500', description: 'Pathway to UK Universities.', duration: '6 Months', image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800', requirements: ['English B2', 'High School'] }
];

export const manualSubmissions: ManualSubmission[] = [];
export const testResults: TestResult[] = [];
export const immigrationGuides: any[] = [];
export const voucherCodes: VoucherCode[] = [];
