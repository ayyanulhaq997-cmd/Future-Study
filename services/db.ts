
import { Product, VoucherCode, User, University, CountryGuide, Course, Qualification, LMSCourse, LMSPracticeTest, ManualSubmission, TestResult } from '../types';

export const users: User[] = [
  { id: 'u-owner', name: 'Business Owner', email: 'admin@unicou.uk', role: 'System Admin/Owner', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom' },
  { id: 'u-ops', name: 'General Manager', email: 'ops@unicou.uk', role: 'Operation Manager', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom' },
  { id: 'u-fin', name: 'Finance Lead', email: 'finance@unicou.uk', role: 'Finance Manager', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom' },
  { id: 'u-aca', name: 'Academic Director', email: 'academic@unicou.uk', role: 'Academic Manager', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom' },
  { id: 'u-sal-m', name: 'Sales Director', email: 'sales_mgr@unicou.uk', role: 'Sales Manager', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom' },
  { id: 'u-sal-a', name: 'Support Frontline', email: 'sales_agent@unicou.uk', role: 'Sales Agent', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom' },
  { id: 'u-agent', name: 'Consultancy Alpha', email: 'agent@test.com', role: 'Agent', isAuthorized: true, verified: true, status: 'Active', tier: 2, country: 'Pakistan' },
  { id: 'u-inst', name: 'Prep Center Beta', email: 'center@test.com', role: 'Academic Institute', isAuthorized: true, verified: true, status: 'Active', country: 'United Arab Emirates' },
  { id: 'u-teacher', name: 'Lead Instructor', email: 'teacher@test.com', role: 'Teacher', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom' },
  { id: 'u-std', name: 'Alex Student', email: 'student@test.com', role: 'Student', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom' },
];

export const products: Product[] = [
  { id: 'v-pte-aca', name: 'PTE Academic Voucher', category: 'PTE', type: 'Voucher', basePrice: 165, currency: 'USD', pricingModel: 'Country-Wise', description: 'Standard PTE Academic for University Admissions.', icon: '📊' },
  { id: 'v-pte-core', name: 'PTE Core Voucher', category: 'PTE', type: 'Voucher', basePrice: 170, currency: 'USD', pricingModel: 'Country-Wise', description: 'PTE Core for Canadian Migration.', icon: '🇨🇦' },
  { id: 'v-pte-ukvi', name: 'PTE Academic UKVI', category: 'PTE', type: 'Voucher', basePrice: 185, currency: 'USD', pricingModel: 'Country-Wise', description: 'SELT version for UK Visa & Immigration.', icon: '🇬🇧' },
  { id: 'v-ielts-aca', name: 'IELTS Academic Voucher', category: 'IELTS', type: 'Voucher', basePrice: 160, currency: 'USD', pricingModel: 'Country-Wise', description: 'IELTS Academic for Higher Education.', icon: '🌐' },
  { id: 'v-ielts-ukvi', name: 'IELTS for UKVI', category: 'IELTS', type: 'Voucher', basePrice: 195, currency: 'USD', pricingModel: 'Country-Wise', description: 'Official SELT IELTS for UKVI purposes.', icon: '👑' },
  { id: 'v-ielts-ls', name: 'IELTS Life Skills (A1/B1)', category: 'IELTS', type: 'Voucher', basePrice: 140, currency: 'USD', pricingModel: 'Global', description: 'IELTS Life Skills for Spouse/Settlement visas.', icon: '🗣️' },
  { id: 'v-toefl-ibt', name: 'TOEFL iBT Voucher', category: 'TOEFL', type: 'Voucher', basePrice: 160, currency: 'USD', pricingModel: 'Global', description: 'TOEFL iBT Official Exam Code.', icon: '📜' },
  { id: 'v-duolingo', name: 'Duolingo English Test', category: 'Duolingo', type: 'Voucher', basePrice: 59, currency: 'USD', pricingModel: 'Global', description: 'Fast, affordable online English test.', icon: '🦉' },
  { id: 'v-lc-aca', name: 'LanguageCert Academic', category: 'LanguageCert', type: 'Voucher', basePrice: 155, currency: 'USD', pricingModel: 'Global', description: 'LanguageCert International ESOL.', icon: '📝' },
  { id: 'v-sfe-selt', name: 'Skills for English SELT', category: 'Skills for English', type: 'Voucher', basePrice: 165, currency: 'USD', pricingModel: 'Country-Wise', description: 'PSI Skills for English for UKVI.', icon: '🎓' },
  { id: 'v-gre-gen', name: 'GRE General Test', category: 'OTHER', type: 'Voucher', basePrice: 220, currency: 'USD', pricingModel: 'Global', description: 'GRE General Voucher for Grad School.', icon: '📈' },
  { id: 'v-gmat-focus', name: 'GMAT Focus Edition', category: 'OTHER', type: 'Voucher', basePrice: 275, currency: 'USD', pricingModel: 'Global', description: 'GMAT Voucher for Business School.', icon: '💼' },
  { id: 'c-pte-master', name: 'PTE 79+ Masterclass', category: 'PTE', type: 'Course', basePrice: 49, currency: 'USD', pricingModel: 'Global', description: 'Complete video training for PTE Academic.', icon: '📽️' },
  { id: 'c-ielts-7', name: 'IELTS Band 7.0 Express', category: 'IELTS', type: 'Course', basePrice: 39, currency: 'USD', pricingModel: 'Global', description: 'Intensive 2-week IELTS preparation.', icon: '⚡' },
];

export const lmsCourses: LMSCourse[] = [
  { id: 'c-pte-master', title: 'PTE 79+ Masterclass', category: 'PTE', thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800', description: 'Complete video training for PTE Academic, covering all 20 task types.', duration: '25 Hours', instructor: 'Prof. Michael Aris', price: 49 },
  { id: 'c-ielts-7', title: 'IELTS Band 7.0 Express', category: 'IELTS', thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', description: 'Intensive preparation focusing on Writing and Speaking high-score criteria.', duration: '12 Hours', instructor: 'Dr. Anna Bell', price: 39 },
];

export const countryGuides: CountryGuide[] = [
  { 
    id: 'uk', 
    countryId: 'uk', 
    slug: 'uk', 
    title: 'Study in UK', 
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', 
    costOfLiving: '£1,200 - £1,500 / Month', 
    visaRequirements: 'Student Visa (formerly Tier 4)', 
    content: 'The UK remains a top destination for global education. With post-study work options (Graduate Route) and world-class universities like Oxford, Cambridge, and Imperial, it offers a premium academic environment.\n\n### Key Benefits\n- High-speed 1-year Masters programs.\n- Graduate Route: 2-year work permit after studies.\n- Cultural diversity and historic academic heritage.' 
  },
  { 
    id: 'australia', 
    countryId: 'au', 
    slug: 'australia', 
    title: 'Study in Australia', 
    heroImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200', 
    costOfLiving: '$2,100 AUD / Month', 
    visaRequirements: 'Student Visa (Subclass 500)', 
    content: 'Australia is famous for its research facilities and high quality of life. Cities like Melbourne and Sydney are consistently ranked as the most student-friendly in the world.\n\n### Why Australia?\n- Simplified Student Visa Framework (SSVF).\n- Extensive part-time work opportunities.\n- High employability for graduates in STEM and Healthcare.' 
  },
  { 
    id: 'canada', 
    countryId: 'ca', 
    slug: 'canada', 
    title: 'Study in Canada', 
    heroImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200', 
    costOfLiving: '$1,800 CAD / Month', 
    visaRequirements: 'Study Permit / SDS Pathway', 
    content: 'Canada is the ideal choice for students seeking long-term settlement. The Post-Graduation Work Permit (PGWP) provides a clear path to Permanent Residency.\n\n### Highlights\n- Affordable tuition compared to the USA.\n- World-class healthcare and safety.\n- Diverse landscape from Vancouver to Toronto.' 
  },
  { 
    id: 'usa', 
    countryId: 'us', 
    slug: 'usa', 
    title: 'Study in USA', 
    heroImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200', 
    costOfLiving: '$2,500 USD / Month', 
    visaRequirements: 'F-1 Student Visa', 
    content: 'The USA hosts the largest number of international students globally. With the Ivy League and thousands of specialized institutions, it is the center of global innovation.\n\n### Opportunities\n- OPT (Optional Practical Training) for up to 3 years (STEM).\n- Huge variety of scholarships and research grants.\n- Largest global professional network.' 
  },
  { 
    id: 'germany', 
    countryId: 'de', 
    slug: 'germany', 
    title: 'Study in Germany', 
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', 
    costOfLiving: '€950 - €1,100 / Month', 
    visaRequirements: 'National Visa for Studies', 
    content: 'Germany offers low or no tuition fees at public universities. It is an industrial powerhouse with immense opportunities for engineering and technology students.\n\n### Key Facts\n- 18-month post-study job search visa.\n- Strong link between universities and industry.\n- Centrally located in Europe for easy travel.' 
  },
  { 
    id: 'italy', 
    countryId: 'it', 
    slug: 'italy', 
    title: 'Study in Italy', 
    heroImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200', 
    costOfLiving: '€700 - €900 / Month', 
    visaRequirements: 'Type D (Study) Visa', 
    content: 'Italy is home to some of the oldest and most prestigious universities in Europe. It is the world leader in Art, Design, and Architecture.\n\n### Advantages\n- Generous regional scholarships (DSU).\n- Low cost of living compared to North Europe.\n- Rich cultural experience and Mediterranean climate.' 
  },
  { 
    id: 'europe', 
    countryId: 'eu', 
    slug: 'europe', 
    title: 'Study in Europe Hub', 
    heroImage: 'https://images.unsplash.com/photo-1471623197341-389f41434f8d?w=1200', 
    costOfLiving: 'Variable', 
    visaRequirements: 'Schengen Educational', 
    content: 'Explore pathways in Sweden, Finland, Cyprus, and Ireland through our unified European hub. Each region offers unique academic and professional benefits.' 
  },
  { 
    id: 'new-zealand', 
    countryId: 'nz', 
    slug: 'new-zealand', 
    title: 'Study in NZ', 
    heroImage: 'https://images.unsplash.com/photo-1469521669194-bdf95559c13d?w=1200', 
    costOfLiving: '$1,900 NZD / Month', 
    visaRequirements: 'Fee Paying Student Visa', 
    content: 'New Zealand is known for its safe environment and focus on practical learning. It is a preferred destination for students seeking a balanced lifestyle.' 
  },
  { 
    id: 'malaysia', 
    countryId: 'my', 
    slug: 'malaysia', 
    title: 'Study in Malaysia', 
    heroImage: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200', 
    costOfLiving: '$600 USD / Month', 
    visaRequirements: 'Student Pass / EMGS', 
    content: 'Affordable high-quality education and a multicultural atmosphere in Southeast Asia. Malaysia is a hub for international branch campuses.' 
  },
  { 
    id: 'turkey', 
    countryId: 'tr', 
    slug: 'turkey', 
    title: 'Study in Turkey', 
    heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200', 
    costOfLiving: '$500 USD / Month', 
    visaRequirements: 'Education Visa', 
    content: 'Turkey bridges East and West with historic institutions and modern facilities. It is a gateway to Europe with competitive tuition rates.' 
  },
];

export const lmsTests: LMSPracticeTest[] = [
  {
    id: 'test-lc-academic-02',
    title: 'LanguageCert Academic Test 2 (Full Mock)',
    sections: [
      {
        id: 'lc-listening-3',
        title: 'Listening Part 3: Lecture Note Completion',
        skill: 'Listening',
        timeLimit: 10,
        audioUrl: 'SIMULATED_LECTURE_FEED',
        questions: [
          { id: 'l3q18', skill: 'Listening', type: 'Note-Completion', text: 'This cave art was first brought to public attention in (18) ___________________.' },
          { id: 'l3q19', skill: 'Listening', type: 'Note-Completion', text: 'Adam Brumm dated a Sulawesi cave painting by analysing material found on an image of a (19) ______________________.' },
          { id: 'l3q21', skill: 'Listening', type: 'Note-Completion', text: 'The artwork they found near Makassar is probably intended to show (21) ______________________ between pigs.' },
          { id: 'l3q22', skill: 'Listening', type: 'Note-Completion', text: 'The picture of pigs may be the earliest known example of (22) ______________________ art.' },
          { id: 'l3q24', skill: 'Listening', type: 'Note-Completion', text: 'Scientists use the word (24) ______________________ to describe the calcite deposit.' }
        ]
      },
      {
        id: 'lc-reading-2',
        title: 'Reading Part 2: The Domestication of Chickens',
        skill: 'Reading',
        timeLimit: 15,
        passageText: `The domestication of chickens\n\nFor millions of people around the world, chicken products are a staple food item. But the question of when exactly chickens became domesticated has never been satisfactorily addressed. (12)…………… But one new study is changing this perception.\n\nResearchers found twenty-three sets of bones in Europe and Africa. (13) ..................The others were much more recent.\n\nEarlier hypotheses suggested chickens were present in Europe up to 7,000 years ago. (14)...................Cattle and sheep, for example, reached Europe around 6,000 years ago.`,
        questions: [
          { id: 'r2q12', skill: 'Reading', type: 'Insert-Sentence', text: 'Gap (12)', targetSentence: 'Sentence G: For many people it is difficult to imagine that chickens were ever anything other than a source of food.', options: ['Gap 12', 'Gap 13', 'Gap 14', 'Gap 15', 'Gap 16', 'Gap 17'] },
          { id: 'r2q13', skill: 'Reading', type: 'Insert-Sentence', text: 'Gap (13)', targetSentence: 'Sentence D: In the event, only five of those tested turned out to be as old as had been claimed.', options: ['Gap 12', 'Gap 13', 'Gap 14', 'Gap 15', 'Gap 16', 'Gap 17'] },
          { id: 'r2q14', skill: 'Reading', type: 'Insert-Sentence', text: 'Gap (14)', targetSentence: 'Sentence B: This makes them a relatively recent arrival compared to other domesticated species.', options: ['Gap 12', 'Gap 13', 'Gap 14', 'Gap 15', 'Gap 16', 'Gap 17'] }
        ]
      },
      {
        id: 'pte-speaking-1',
        title: 'PTE Speaking: Read Aloud & Describe Image',
        skill: 'Speaking',
        timeLimit: 5,
        questions: [
          { id: 's1q1', skill: 'Speaking', type: 'Read-Aloud', text: 'The industrial revolution marked a significant shift in human history, characterized by the transition from manual labour to mechanized production. This era witnessed groundbreaking advancements in technology.' },
          { id: 's1q2', skill: 'Speaking', type: 'Describe-Image', text: 'Describe the following statistical chart regarding book sales in the U.S.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800' }
        ]
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
