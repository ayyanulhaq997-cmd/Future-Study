
import { Product, VoucherCode, User, University, CountryGuide, Course, Qualification, LMSCourse, LMSPracticeTest, ManualSubmission, TestResult, LMSModule } from '../types';

export const users: User[] = [
  { id: 'u-owner', name: 'Business Owner', email: 'admin@unicou.uk', role: 'System Admin/Owner', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom', timestamp: new Date().toISOString() },
  { id: 'u-std', name: 'Alex Student', email: 'student@test.com', role: 'Student', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom', timestamp: new Date().toISOString() },
];

export const products: Product[] = [
  { id: 'v-pte-aca', name: 'PTE Academic Voucher', category: 'PTE', type: 'Voucher', basePrice: 165, currency: 'USD', pricingModel: 'Country-Wise', description: 'Standard PTE Academic.', icon: '', openingStock: 2000 },
  { id: 'v-ielts-aca', name: 'IELTS Academic Voucher', category: 'IELTS', type: 'Voucher', basePrice: 160, currency: 'USD', pricingModel: 'Country-Wise', description: 'IELTS Academic.', icon: '', openingStock: 150 },
  { id: 'v-toefl-ibt', name: 'TOEFL iBT Voucher', category: 'TOEFL', type: 'Voucher', basePrice: 160, currency: 'USD', pricingModel: 'Global', description: 'TOEFL iBT Official Code.', icon: '', openingStock: 19 },
];

// Reaching the 2169 count exactly from the PDF screenshots
export const voucherCodes: VoucherCode[] = Array.from({ length: 2169 }).map((_, i) => ({
  id: `vc-${i}`,
  productId: i < 2000 ? 'v-pte-aca' : (i < 2150 ? 'v-ielts-aca' : 'v-toefl-ibt'),
  code: `UC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  status: 'Available',
  expiryDate: '2026-12-31',
  uploadDate: '2025-01-01'
}));

export const countryGuides: CountryGuide[] = [
  { id: 'uk', countryId: 'uk', slug: 'uk', title: 'Study in United Kingdom', heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', 
    costOfLiving: '£10,539 (Outer London) - £13,761 (Inner London)', 
    visaRequirements: '£10,000 – £18,000 / Annual', 
    content: '### Academic Excellence\nShorter durations: 3-year Bachelors and 1-year Masters. \n### eVisas 2025\nThe UK has transitioned to digital-only immigration status via secure UKVI nodes.' 
  },
  { id: 'australia', countryId: 'au', slug: 'australia', title: 'Study in Australia', heroImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200', 
    costOfLiving: 'AUD 21,000 / Annual', 
    visaRequirements: 'AUD 20,000 – 40,000 / Annual', 
    content: '### Quality Crackdown\nIn 2025, the Genuine Student (GS) requirement replaces GTE. Focus on specific study intent. \n### Enrollment Caps\nNational Planning Levels (NPL) are now established for international commencements.' 
  },
  { id: 'usa', countryId: 'us', slug: 'usa', title: 'Study in USA', heroImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200', 
    costOfLiving: 'USD 12,000 – 18,000 / Annual', 
    visaRequirements: 'USD 11,000 – 40,000 / Annual', 
    content: '### STEM OPT\nGraduates in STEM-designated courses are eligible for a 24-month extension, totaling 3 years of work nodes. \n### 2+2 Pathway\nSave 50% tuition by spending two years at a community college before transferring.' 
  },
  { id: 'canada', countryId: 'ca', slug: 'canada', title: 'Study in Canada', heroImage: 'https://images.unsplash.com/photo-1517935703635-27c736827375?w=1200', 
    costOfLiving: 'CAD 12,000 – 15,000 / Annual', 
    visaRequirements: 'CAD 11,000 – 35,000 / Annual', 
    content: '### PAL System\nMost students now require a Provincial Attestation Letter (PAL) from the target province. \n### Financial Audit\nShow money requirement increased to CAD $20,635 plus first-year tuition.' 
  },
  { id: 'new-zealand', countryId: 'nz', slug: 'new-zealand', title: 'Study in New Zealand', heroImage: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1200', 
    costOfLiving: 'NZD 15,000 / Annual', 
    visaRequirements: 'NZD 16,000 – 35,000 / Annual', 
    content: '### Green List Pathways\nFast-track to residency if your course leads to a Green List occupation. \n### Te Pūkenga Model\nHands-on learning directly aligned with global market nodes.' 
  },
  { id: 'ireland', countryId: 'ie', slug: 'ireland', title: 'Study in Ireland', heroImage: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=1200', 
    costOfLiving: '€7,000 / Annual', 
    visaRequirements: '€8,000 – 22,000 / Annual', 
    content: '### 1G Graduate Visa\nMaster & PhD graduates eligible for 2-year stay-back visa node. \n### Tech Capital\nEuropean HQ for 1,000+ multinational firms.' 
  },
  { id: 'cyprus', countryId: 'cy', slug: 'cyprus', title: 'Study in Cyprus', heroImage: 'https://images.unsplash.com/photo-1505305976870-c0be1cd39939?w=1200', 
    costOfLiving: '€7,000 – 8,000 / Annual', 
    visaRequirements: '€4,800 – 9,800 / Annual', 
    content: '### Mediterranean Hub\nEuropean experience without the high costs. Hospitality & Tourism nodes are world-leading. \n### Pink Slip\nTemporary Residence Permit required upon arrival for all international nodes.' 
  },
  { id: 'germany', countryId: 'de', slug: 'germany', title: 'Study in Germany', heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', 
    costOfLiving: '€11,208 (Blocked Account)', 
    visaRequirements: '€0 – 5,000 / Annual', 
    content: '### Engineering Precision\nTuition-free public universities for qualified candidates. \n### Werkstudent Nodes\nInternational students allowed to work 140 full days per year.' 
  },
  { id: 'italy', countryId: 'it', slug: 'italy', title: 'Study in Italy', heroImage: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200', 
    costOfLiving: '€7,000 – 10,000 / Annual', 
    visaRequirements: '€2,000 – 6,000 / Annual', 
    content: '### ISEE Income-Based Tuition\nFees adjusted based on family financial nodes. \n### DSU Scholarships\nZero tuition fees plus a yearly stipend of up to €7,000.' 
  },
  { id: 'sweden', countryId: 'se', slug: 'sweden', title: 'Study in Sweden', heroImage: 'https://images.unsplash.com/photo-1509339022327-1e1e25360a41?w=1200', 
    costOfLiving: 'SEK 96,000 - 120,000 / Annual', 
    visaRequirements: '€8,000 – 17,000 / Annual', 
    content: '### Lagom Life\nFocus on sustainability and informal, collaborative learning. \n### Personnummer\nKey identity node for healthcare and banking access.' 
  },
  { id: 'finland', countryId: 'fi', slug: 'finland', title: 'Study in Finland', heroImage: 'https://images.unsplash.com/photo-1528154032344-a6986460762c?w=1200', 
    costOfLiving: '€7,000 – 9,000 / Annual', 
    visaRequirements: '€6,000 – 15,000 / Annual', 
    content: '### Happiest Nation\nWorld-best education system with a focus on student-life balance. \n### One Permit Rule\nA single permit now covers the entire duration of your degree node.' 
  },
  { id: 'dubai', countryId: 'ae', slug: 'dubai', title: 'Study in Dubai', heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200', 
    costOfLiving: 'AED 4,000 – 9,000 / Annual', 
    visaRequirements: 'AED 35,000 – 80,000 / Annual', 
    content: '### Knowledge Economy\nTax-free earnings and 10-year Golden Visa for academic excellence. \n### DIAC & DKP Hubs\nGlobal university campuses clustered in specialized business nodes.' 
  },
  { id: 'malaysia', countryId: 'my', slug: 'malaysia', title: 'Study in Malaysia', heroImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a594?w=1200', 
    costOfLiving: 'RM 1,500 – 3,000 / Annual', 
    visaRequirements: 'USD 4,000 – 9,000 / Annual', 
    content: '### Twinning Programs\nEarn a UK or Australian degree at 70% lower cost. \n### e-VAL System\nNearly 100% digital visa approval process via EMGS node.' 
  },
  { id: 'turkey', countryId: 'tr', slug: 'turkey', title: 'Study in Turkey', heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200', 
    costOfLiving: 'USD 400 – 800 / Annual', 
    visaRequirements: 'USD 3,000 – 10,000 / Annual', 
    content: '### Bologna Process\nDegrees recognized across all of Europe. Zero-fee state university nodes available. \n### Denklik Protocol\nDiploma Equivalence is a mandatory technical node for graduation.' 
  },
  { id: 'europe', countryId: 'eu', slug: 'europe', title: 'Study in Europe', heroImage: 'https://images.unsplash.com/photo-1473951574080-01fe45ec8643?w=1200', 
    costOfLiving: '€8,000 – 12,000 / Annual', 
    visaRequirements: '€6,000 – 18,000 / Annual', 
    content: '### Schengen Mobility\nAccess the entire zone via 10,000+ English-taught programs. \n### Blue Card EU\nFastest pathway to permanent residency via high-salary employment nodes.' 
  }
];

export const universities: University[] = [
  { id: 'u-oxford', name: 'University of Oxford', slug: 'oxford', location: 'Oxford, UK', description: 'Consistently ranked top globally.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe1?w=200', ranking: 1, countryId: 'uk', website: 'https://ox.ac.uk' },
  { id: 'u-manchester', name: 'University of Manchester', slug: 'uom', location: 'Manchester, UK', description: 'Preeminent Russell Group institution.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe1?w=200', ranking: 32, countryId: 'uk', website: 'https://manchester.ac.uk' },
  { id: 'u-melbourne', name: 'University of Melbourne', slug: 'melb', location: 'Melbourne, AU', description: 'Australia\'s #1 research hub.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe1?w=200', ranking: 14, countryId: 'au', website: 'https://unimelb.edu.au' },
  { id: 'u-toronto', name: 'University of Toronto', slug: 'utoronto', location: 'Toronto, CA', description: 'Canada\'s global leader.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe1?w=200', ranking: 21, countryId: 'ca', website: 'https://utoronto.ca' },
];

export const courses: Course[] = [
  { id: 'cs-msc-ai', universityId: 'u-manchester', title: 'MSc Artificial Intelligence', degree: 'Postgraduate', duration: '1 Year', tuitionFee: '£28,000', description: 'Advanced AI and Machine Learning nodes.' }
];

export const lmsCourses: LMSCourse[] = [
  { id: 'c-pte-master', title: 'PTE 79+ Masterclass', category: 'PTE', thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800', description: 'Complete training for PTE Academic.', duration: '25 Hours', instructor: 'Prof. Michael Aris', price: 49 },
];

export const lmsModules: LMSModule[] = [
  { id: 'm-intro', title: 'Core Foundations', lessons: [{ id: 'l-01', title: 'Introduction', type: 'Video', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }] }
];

export const lmsTests: LMSPracticeTest[] = [
  {
    id: 'full-mock-1', title: 'IELTS Academic Full Simulation',
    sections: [
      {
        id: 'ielts-reading-1', title: 'Reading Part 1: Marie Curie', skill: 'Reading', timeLimit: 20,
        passageText: `Marie Curie is probably the most famous woman scientist who has ever lived. Born Maria Sklodowska in Poland in 1867, she is famous for her work on radioactivity...`,
        questions: [
          { id: 'q1', skill: 'Reading', type: 'TFNG', text: 'Marie Curie’s husband was a joint winner of both Marie’s Nobel Prizes.' },
          { id: 'q2', skill: 'Reading', type: 'TFNG', text: 'Marie became interested in science when she was a child.' }
        ]
      },
      {
        id: 'ielts-reading-2', title: 'Reading Part 2: Traffic Physics', skill: 'Reading', timeLimit: 20,
        passageText: `Some years ago, several theoretical physicists, principally Dirk Helbing and Boris Kerner... noted strange traffic flow results...`,
        questions: [
          { id: 'q3', skill: 'Reading', type: 'Ordering', text: 'Restore order of paragraph fragments.', options: ['Jackets didn’t become fashionable...', 'By 1817, trousers were shoe-length...', 'George "Beau" Brummell started a trend...'] }
        ]
      }
    ]
  }
];

export const qualifications: Qualification[] = [
  { id: 'othm-l3', title: 'OTHM Level 3 Foundation', qualificationBody: 'OTHM', level: 'Level 3', tuitionFees: '£1,500', description: 'Pathway to UK Universities.', duration: '6 Months', image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800', requirements: ['English B2', 'High School'] }
];

export const manualSubmissions: ManualSubmission[] = [];
export const testResults: TestResult[] = [];
export const immigrationGuides: any[] = [];
