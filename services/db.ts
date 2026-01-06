
import { Product, VoucherCode, User, University, CountryGuide, Course, Qualification, LMSCourse, LMSPracticeTest, ManualSubmission, TestResult } from '../types';

export const users: User[] = [
  { id: 'u-admin', name: 'System Administrator', email: 'admin@unicou.uk', role: 'System Admin/Owner', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-finance', name: 'Finance Controller', email: 'finance@unicou.uk', role: 'Finance', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-trainer-1', name: 'Lead Evaluator', email: 'trainer@unicou.uk', role: 'Trainer', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-sales', name: 'Sales Manager', email: 'sales@unicou.uk', role: 'Sales', isAuthorized: true, verified: true, status: 'Active' },
  { id: 'u-agent-test', name: 'Authorized Agent', email: 'agent@unicou.uk', role: 'Agent', isAuthorized: true, verified: true, status: 'Active', tier: 2 },
  { id: 'u-student-test', name: 'Legacy Student', email: 'student@unicou.uk', role: 'Student', isAuthorized: true, verified: true, status: 'Active' },
];

export const products: Product[] = [
  { id: 'v-1', name: 'IELTS Academic Voucher', category: 'IELTS', type: 'Voucher', basePrice: 149, currency: 'USD', pricingModel: 'Country-Wise', description: 'Official British Council/IDP.', icon: '🌐' },
  { id: 'v-6', name: 'PTE Academic Voucher', category: 'PTE', type: 'Voucher', basePrice: 165, currency: 'USD', pricingModel: 'Country-Wise', description: 'Official Pearson PTE.', icon: '📊' },
];

export const voucherCodes: VoucherCode[] = [];

export const lmsTests: LMSPracticeTest[] = [
  {
    id: 'lc-test-2',
    title: 'LanguageCert Academic Test 2',
    sections: [
      {
        id: 'lc2-read-p2',
        title: 'Reading Part 2: Chicken Domestication',
        skill: 'Reading',
        timeLimit: 15,
        passageText: `For millions of people around the world, chicken products are a staple food item, and chicken keeping is a common practice. But the question of when exactly chickens became domesticated and how humans have interacted with them over time has never, until now, been satisfactorily addressed. (12)…………… But one new study is changing this perception. \n\nThe study looked at what were thought to be the earliest examples of chicken bones to be found by archaeologists in Europe and northwest Africa. Twenty-three sets of bones underwent radio-carbon dating in an attempt to discover how old they actually were, so that researchers could get a clearer idea of when the species first arrived in Europe, and how the process of domestication may have taken place. (13)..................The others were much more recent, sometimes by thousands of years.`,
        questions: [
          {
            id: 'lc2-q12',
            skill: 'Reading',
            type: 'Insert-Sentence',
            text: '12. Choose the correct sentence for the gap.',
            targetSentence: 'In the past, these long-established theories fail to take into account certain crucial factors.',
            options: [
              'A. These birds were more likely regarded as rare.',
              'B. This makes them a relatively recent arrival.',
              'C. Despite this, these long-established theories fail to take into account...',
              'D. In the event, only five turned out to be as old.'
            ]
          }
        ]
      },
      {
        id: 'lc2-read-p4',
        title: 'Reading Part 4: Reality TV & Culture',
        skill: 'Reading',
        timeLimit: 20,
        passageText: `You may call reality TV a ‘guilty pleasure’ or, if you’re feeling less charitable, ‘trash’ or ‘train-wreck TV,’ or perhaps, like the respected broadcast journalist Ted Koppel, you may wonder aloud if the genre marks the end of civilization. The truth is that vastly more of us are watching reality TV than not, and those who avert their eyes are still haunted by its apparitions.`,
        questions: [
          {
            id: 'lc2-q25',
            skill: 'Reading',
            type: 'MCQ',
            text: '25. The writer uses the phrase ‘haunted by its apparitions’ to emphasise:',
            options: [
              'a) the effort people go to avoid it',
              'b) the exaggerated language used to criticise it',
              'c) the impossibility of remaining untouched by reality TV',
              'd) the horror with which people regard it'
            ]
          }
        ]
      }
    ]
  }
];

export const countryGuides: CountryGuide[] = [
  { id: 'uk', countryId: 'uk', slug: 'uk', title: 'Study in United Kingdom', heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', costOfLiving: '£1,200/mo', visaRequirements: 'Student Visa (Tier 4)', content: 'UK Excellence.' },
  { id: 'australia', countryId: 'australia', slug: 'australia', title: 'Study in Australia', heroImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200', costOfLiving: 'A$2,200/mo', visaRequirements: 'Subclass 500', content: 'Australian Hub.' },
];

export const universities: University[] = [
  { id: 'uni-man', name: 'University of Manchester', slug: 'manchester', location: 'UK', ranking: 32, description: 'Research Node.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200', countryId: 'uk', website: 'https://www.manchester.ac.uk' },
];

export const courses: Course[] = [];
export const qualifications: Qualification[] = [];
export const lmsCourses: LMSCourse[] = [
  { id: 'lms-1', title: 'LanguageCert Mastery', category: 'LanguageCert', thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', description: 'Academic Test 2 Blueprint.', duration: '10 Hours', instructor: 'Dr. Gray', price: 0 },
];
export const manualSubmissions: ManualSubmission[] = [];
export const testResults: TestResult[] = [];
export const immigrationGuides: any[] = [];
