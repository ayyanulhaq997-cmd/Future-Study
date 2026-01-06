
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
  // --- IELTS CLUSTER ---
  { id: 'v-ielts-ac', name: 'IELTS Academic Voucher', category: 'IELTS', type: 'Voucher', basePrice: 149, currency: 'USD', pricingModel: 'Country-Wise', description: 'Standard Academic for university admissions.', icon: '🌐' },
  { id: 'v-ielts-gt', name: 'IELTS General Training', category: 'IELTS', type: 'Voucher', basePrice: 149, currency: 'USD', pricingModel: 'Country-Wise', description: 'For immigration and work permits.', icon: '🌐' },
  { id: 'v-ielts-ukvi-ac', name: 'IELTS UKVI Academic', category: 'IELTS', type: 'Voucher', basePrice: 175, currency: 'USD', pricingModel: 'Country-Wise', description: 'SELT approved for UK student visas.', icon: '🇬🇧' },
  { id: 'v-ielts-ukvi-gt', name: 'IELTS UKVI General', category: 'IELTS', type: 'Voucher', basePrice: 175, currency: 'USD', pricingModel: 'Country-Wise', description: 'SELT approved for UK work/life visas.', icon: '🇬🇧' },

  // --- PTE CLUSTER ---
  { id: 'v-pte-ac', name: 'PTE Academic Voucher', category: 'PTE', type: 'Voucher', basePrice: 165, currency: 'USD', pricingModel: 'Country-Wise', description: 'Standard Pearson PTE Academic.', icon: '📊' },
  { id: 'v-pte-ukvi', name: 'PTE Academic UKVI', category: 'PTE', type: 'Voucher', basePrice: 180, currency: 'USD', pricingModel: 'Country-Wise', description: 'SELT variant for UK Visas.', icon: '📊' },
  { id: 'v-pte-home', name: 'PTE Home (A1/A2/B1)', category: 'PTE', type: 'Voucher', basePrice: 150, currency: 'USD', pricingModel: 'Country-Wise', description: 'For family and settlement visas.', icon: '🏠' },
  { id: 'v-pte-core', name: 'PTE Core Voucher', category: 'PTE', type: 'Voucher', basePrice: 170, currency: 'USD', pricingModel: 'Country-Wise', description: 'Approved for Canada migration.', icon: '🇨🇦' },

  // --- TOEFL CLUSTER ---
  { id: 'v-toefl-ibt', name: 'TOEFL iBT Voucher', category: 'ETS', type: 'Voucher', basePrice: 195, currency: 'USD', pricingModel: 'Global', description: 'Official ETS TOEFL iBT.', icon: '🎓' },

  // --- LANGUAGECERT CLUSTER ---
  { id: 'v-lc-ac', name: 'LanguageCert Academic', category: 'LanguageCert', type: 'Voucher', basePrice: 155, currency: 'USD', pricingModel: 'Global', description: 'High-stakes academic English test.', icon: '📜' },
  { id: 'v-lc-b1', name: 'LanguageCert ESOL B1', category: 'LanguageCert', type: 'Voucher', basePrice: 140, currency: 'USD', pricingModel: 'Global', description: 'SELT for UK Citizenship/Settle.', icon: '📜' },
  { id: 'v-lc-b2', name: 'LanguageCert ESOL B2', category: 'LanguageCert', type: 'Voucher', basePrice: 150, currency: 'USD', pricingModel: 'Global', description: 'Communicator level for study/work.', icon: '📜' },

  // --- SKILLS FOR ENGLISH ---
  { id: 'v-sfe-ukvi', name: 'Skills for English UKVI', category: 'Skills for English', type: 'Voucher', basePrice: 160, currency: 'USD', pricingModel: 'Global', description: 'PSI Services official UKVI test.', icon: '🧠' },

  // --- DUOLINGO ---
  { id: 'v-det', name: 'Duolingo English Test', category: 'Duolingo', type: 'Voucher', basePrice: 59, currency: 'USD', pricingModel: 'Global', description: 'Official DET credit voucher.', icon: '🦉' },

  // --- OXFORD ELLT ---
  { id: 'v-ellt', name: 'Oxford ELLT Academic', category: 'Oxford ELLT', type: 'Voucher', basePrice: 120, currency: 'USD', pricingModel: 'Global', description: 'Digital test for university entry.', icon: '📖' }
];

// Seed inventory for EVERY product to prevent fulfillment errors
export const voucherCodes: VoucherCode[] = products.flatMap(p => 
  Array(20).fill(0).map((_, i) => ({
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
    title: 'LanguageCert Academic Test 2',
    sections: [
      {
        id: 'lc2-read-p2',
        title: 'Reading Part 2: Chicken Domestication',
        skill: 'Reading',
        timeLimit: 15,
        passageText: `The domestication of chickens\n\nFor millions of people around the world, chicken products are a staple food item, and chicken keeping is a common practice. But the question of when exactly chickens became domesticated and how humans have interacted with them over time has never, until now, been satisfactorily addressed. (12)…………… But one new study is changing this perception.\n\nThe study looked at what were thought to be the earliest examples of chicken bones to be found by archaeologists in Europe and northwest Africa. Twenty-three sets of bones underwent radio-carbon dating in an attempt to discover how old they actually were, so that researchers could get a clearer idea of when the species first arrived in Europe, and how the process of domestication may have taken place. (13) ..................The others were much more recent, sometimes by thousands of years.\n\nEarlier hypotheses suggested that chickens were present in Europe up to 7,000 years ago. But these results show they were not introduced until around 2,800 years ago. (14)...................Cattle and sheep, for example, are thought to have reached Europe around 6,000 years ago.`,
        questions: [
          {
            id: 'lc2-q12',
            skill: 'Reading',
            type: 'Insert-Sentence',
            text: '12. Select the correct sentence for gap (12)',
            targetSentence: 'In the past, these long-established theories fail to take into account certain crucial factors.',
            options: [
              'A. These birds were regarded as rare, exotic creatures.',
              'B. This makes them a relatively recent arrival.',
              'C. Despite this, these long-established theories fail to take into account...',
              'D. Only five of those tested turned out to be as old.'
            ]
          },
          {
            id: 'lc2-q13',
            skill: 'Reading',
            type: 'Insert-Sentence',
            text: '13. Select the correct sentence for gap (13)',
            targetSentence: 'In the event, only five of those tested turned out to be as old as had been claimed.',
            options: [
              'A. These birds were regarded as rare, exotic creatures.',
              'B. This makes them a relatively recent arrival.',
              'C. Despite this, these long-established theories fail to take into account...',
              'D. In the event, only five of those tested turned out to be as old as had been claimed.'
            ]
          }
        ]
      },
      {
        id: 'lc2-read-p3',
        title: 'Reading Part 3: Cloud Seeding',
        skill: 'Reading',
        timeLimit: 15,
        passageText: `Text A: Cloud seeding techniques that aim to artificially induce rainfall or snowfall only work if the clouds already have sufficient moisture and are accompanied by the right temperature and wind conditions.\n\nText B: Cloud seeding has been used to mitigate damage caused by hailstorms for years, and also to try to enhance rainfall and snowfall for water storage in reservoirs and underground.\n\nText C: In the 1940s, the atmospheric scientist Bernard Vonnegut found that particles of silver iodide can cause supercool clouds of water vapor to freeze into snow in the lab.\n\nText D: Today, many entities – including government agencies, utility companies and ski resorts – seed clouds in an effort to boost winter snowfall in the mountains.`,
        questions: [
          {
            id: 'lc2-q18',
            skill: 'Reading',
            type: 'MCQ',
            text: '18. In which text does the writer mention that cloud seeding can also be used to reduce the incidence of certain weather features?',
            options: ['Text A', 'Text B', 'Text C', 'Text D']
          },
          {
            id: 'lc2-q21',
            skill: 'Reading',
            type: 'MCQ',
            text: '21. In which text does the writer specify ways in which seeding materials actually reach the clouds?',
            options: ['Text A', 'Text B', 'Text C', 'Text D']
          }
        ]
      },
      {
        id: 'lc2-read-p4',
        title: 'Reading Part 4: Reality TV',
        skill: 'Reading',
        timeLimit: 20,
        passageText: `What reality TV says about our culture\n\nYou may call reality TV a ‘guilty pleasure’ or, if you’re feeling less charitable, ‘trash’ or ‘train-wreck TV,’ or perhaps, like the respected broadcast journalist Ted Koppel, you may wonder aloud if the genre marks the end of civilization. The truth is that vastly more of us are watching reality TV than not, and those who avert their eyes are still haunted by its apparitions.`,
        questions: [
          {
            id: 'lc2-q25',
            skill: 'Reading',
            type: 'MCQ',
            text: '25. The writer uses the phrase ‘haunted by its apparitions’ in the first paragraph to emphasise:',
            options: [
              'a) the effort some people go to avoid watching',
              'b) the exaggerated language often used to criticise',
              'c) the impossibility of remaining untouched by reality TV',
              'd) the horror with which many people regard reality TV'
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
  { id: 'usa', countryId: 'usa', slug: 'usa', title: 'Study in USA', heroImage: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=1200', costOfLiving: '$2,500/mo', visaRequirements: 'F-1 Student Visa', content: 'American Dream.' },
  { id: 'canada', countryId: 'canada', slug: 'canada', title: 'Study in Canada', heroImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200', costOfLiving: 'C$2,000/mo', visaRequirements: 'Study Permit', content: 'Canadian Opportunities.' },
];

export const universities: University[] = [
  { id: 'uni-man', name: 'University of Manchester', slug: 'manchester', location: 'UK', ranking: 32, description: 'Research Node.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200', countryId: 'uk', website: 'https://www.manchester.ac.uk' },
];

export const courses: Course[] = [];
export const qualifications: Qualification[] = [];
export const lmsCourses: LMSCourse[] = [
  { id: 'lms-1', title: 'LanguageCert Mastery', category: 'LanguageCert', thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', description: 'Complete Academic Test 2 Simulation and Video Blueprint.', duration: '10 Hours', instructor: 'Dr. Danielle Gray', price: 0 },
];
export const manualSubmissions: ManualSubmission[] = [];
export const testResults: TestResult[] = [];
export const immigrationGuides: any[] = [];
