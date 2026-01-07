
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
        audioUrl: 'SIMULATED_LECTURE_STREAM',
        questions: [
          { id: 'l3q18', skill: 'Listening', type: 'Fill-Blanks', text: 'This cave art was first brought to public attention in (18) ___________________.' },
          { id: 'l3q19', skill: 'Listening', type: 'Fill-Blanks', text: 'In 2014, Adam Brumm dated a Sulawesi cave painting by analysing material found on an image of a (19) ______________________.' },
          { id: 'l3q20', skill: 'Listening', type: 'Fill-Blanks', text: 'There is some disagreement about whether one 44,000-year-old painting is an attempt to represent (20) ______________________ in art.' },
          { id: 'l3q21', skill: 'Listening', type: 'Fill-Blanks', text: 'The artwork they found in one cave near Makassar is probably intended to show (21) ______________________ between pigs.' },
          { id: 'l3q22', skill: 'Listening', type: 'Fill-Blanks', text: 'The picture of pigs may be the earliest known example of what’s called (22) ______________________ art.' },
          { id: 'l3q23', skill: 'Listening', type: 'Fill-Blanks', text: 'From what can still be seen, Brumm suggests that the picture of pigs may be part of a (23) ______________________.' },
          { id: 'l3q24', skill: 'Listening', type: 'Fill-Blanks', text: 'Scientists use the word (24) ______________________ to describe the calcite deposit that allowed the picture of pigs to be dated accurately.' }
        ]
      },
      {
        id: 'lc-reading-2',
        title: 'Reading Part 2: The Domestication of Chickens',
        skill: 'Reading',
        timeLimit: 15,
        passageText: `The domestication of chickens\n\nFor millions of people around the world, chicken products are a staple food item, and chicken keeping is a common practice. But the question of when exactly chickens became domesticated and how humans have interacted with them over time has never, until now, been satisfactorily addressed. (12)…………… But one new study is changing this perception.\n\nThe study looked at what were thought to be the earliest examples of chicken bones to be found by archaeologists in Europe and northwest Africa. Twenty-three sets of bones underwent radio-carbon dating in an attempt to discover how old they actually were, so that researchers could get a clearer idea of when the species first arrived in Europe, and how the process of domestication may have taken place. (13) ..................The others were much more recent, sometimes by thousands of years.\n\nEarlier hypotheses suggested that chickens were present in Europe up to 7,000 years ago. But these results show they were not introduced until around 2,800 years ago. (14)...................Cattle and sheep, for example, are thought to have reached Europe around 6,000 years ago.\n\nThe radio-carbon dating also suggests that in many locations there was a gap of several hundred years between the introduction of the species to an area and chicken meat appearing in the local people’s diet. Indeed, many of the earliest chickens identified by the radio-carbon dating, including all of those from Britain, seem not to have been kept for their meat. (15)................... Further evidence for this conclusion comes from an estimate of chicken numbers at the time which remain low, and from the fact that the bones studied are from very mature animals. One specimen even has a well-healed leg fracture, indicating human care. (16) ..................They may have had spiritual significance too.\n\nIn some instances, in the period after chickens were introduced, they were buried alongside humans, perhaps because it was believed that they would lead the person’s soul to the afterlife. (17)……………. In later cases, the chickens were used as a food offering for the dead – a practice that became more common in Britain through the Ancient Roman period.`,
        questions: [
          { id: 'r2q12', skill: 'Reading', type: 'Insert-Sentence', text: 'Gap (12)', targetSentence: 'Sentence G: For many people it is difficult to imagine that chickens were ever anything other than a source of food.', options: ['Gap 12', 'Gap 13', 'Gap 14', 'Gap 15', 'Gap 16', 'Gap 17'] },
          { id: 'r2q13', skill: 'Reading', type: 'Insert-Sentence', text: 'Gap (13)', targetSentence: 'Sentence D: In the event, only five of those tested turned out to be as old as had been claimed.', options: ['Gap 12', 'Gap 13', 'Gap 14', 'Gap 15', 'Gap 16', 'Gap 17'] },
          { id: 'r2q14', skill: 'Reading', type: 'Insert-Sentence', text: 'Gap (14)', targetSentence: 'Sentence B: This makes them a relatively recent arrival compared to other domesticated species.', options: ['Gap 12', 'Gap 13', 'Gap 14', 'Gap 15', 'Gap 16', 'Gap 17'] },
          { id: 'r2q15', skill: 'Reading', type: 'Insert-Sentence', text: 'Gap (15)', targetSentence: 'Sentence E: The skeletons studied were largely complete, and so clearly hadn’t been butchered for human consumption.', options: ['Gap 12', 'Gap 13', 'Gap 14', 'Gap 15', 'Gap 16', 'Gap 17'] },
          { id: 'r2q16', skill: 'Reading', type: 'Insert-Sentence', text: 'Gap (16)', targetSentence: 'Sentence A: These clues suggest that rather than being considered a source of food, these birds were more likely regarded as rare, exotic creatures.', options: ['Gap 12', 'Gap 13', 'Gap 14', 'Gap 15', 'Gap 16', 'Gap 17'] }
        ]
      },
      {
        id: 'lc-reading-4',
        title: 'Reading Part 4: Reality TV Sociology',
        skill: 'Reading',
        timeLimit: 15,
        passageText: `What reality TV says about our culture\n\nYou may call reality TV a ‘guilty pleasure’ or, if you’re feeling less charitable, ‘trash’ or ‘train-wreck TV,’ or perhaps, like the respected broadcast journalist Ted Koppel, you may wonder aloud if the genre marks the end of civilization. The truth is that vastly more of us are watching reality TV than not, and those who avert their eyes are still haunted by its apparitions. One study found that college students who claimed not to watch reality TV still knew specific details about these shows. But even for those who really don’t watch, these programs have become part of the cultural ether. Elements from them reach us via product lines, online posts, advertisements, snippets of conversation, and references in the media.`,
        questions: [
          { 
            id: 'r4q25', 
            skill: 'Reading', 
            type: 'MCQ', 
            text: 'The writer uses the phrase ‘haunted by its apparitions’ in the first paragraph to emphasise', 
            options: [
              'a) the effort some people go to in order to avoid watching reality TV.',
              'b) the exaggerated language often used to criticise reality TV.',
              'c) the impossibility of remaining untouched by reality TV.',
              'd) the horror with which many people regard reality TV.'
            ] 
          }
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
// Fix: Add missing countryGuides export required by services/apiService.ts
export const countryGuides: CountryGuide[] = [];
