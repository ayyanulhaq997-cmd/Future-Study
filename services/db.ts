
import { Product, VoucherCode, User, University, CountryGuide, Course, Qualification, LMSCourse, LMSPracticeTest, ManualSubmission, TestResult, LMSModule } from '../types';

export const users: User[] = [
  { id: 'u-owner', name: 'Business Owner', email: 'admin@unicou.uk', role: 'System Admin/Owner', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom', timestamp: new Date().toISOString() },
  { id: 'u-ops', name: 'General Manager', email: 'ops@unicou.uk', role: 'Operation Manager', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom', timestamp: new Date().toISOString() },
  { id: 'u-finance', name: 'Finance Lead', email: 'finance@unicou.uk', role: 'Finance Manager', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom', timestamp: new Date().toISOString() },
  { id: 'u-std', name: 'Alex Student', email: 'student@test.com', role: 'Student', isAuthorized: true, verified: true, status: 'Active', country: 'United Kingdom', timestamp: new Date().toISOString() },
];

export const products: Product[] = [
  { id: 'v-pte-aca', name: 'PTE Academic Voucher', category: 'PTE', type: 'Voucher', basePrice: 165, currency: 'USD', pricingModel: 'Country-Wise', description: 'Standard PTE Academic.', icon: '', openingStock: 2000 },
  { id: 'v-ielts-aca', name: 'IELTS Academic Voucher', category: 'IELTS', type: 'Voucher', basePrice: 160, currency: 'USD', pricingModel: 'Country-Wise', description: 'IELTS Academic.', icon: '', openingStock: 150 },
  { id: 'v-toefl-ibt', name: 'TOEFL iBT Voucher', category: 'TOEFL', type: 'Voucher', basePrice: 160, currency: 'USD', pricingModel: 'Global', description: 'TOEFL iBT Official Code.', icon: '', openingStock: 19 },
];

export const voucherCodes: VoucherCode[] = Array.from({ length: 2169 }).map((_, i) => ({
  id: `vc-${i}`,
  productId: i < 2000 ? 'v-pte-aca' : (i < 2150 ? 'v-ielts-aca' : 'v-toefl-ibt'),
  code: `UC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  status: 'Available',
  expiryDate: '2026-12-31',
  uploadDate: '2025-01-01'
}));

export const countryGuides: CountryGuide[] = [
  { 
    id: 'uk', countryId: 'uk', slug: 'uk', title: 'Study in United Kingdom', 
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80', 
    costOfLiving: '£1,171 - £1,529 / Month', 
    visaRequirements: '£10,000 – £18,000 / Year', 
    content: '### Why Study in the UK?\nThe UK is the gold standard for global academic prestige. Shorter durations mean you save on living costs while graduating earlier. ### 2025 Updates\nFull transition to eVisa is now active.' 
  },
  { 
    id: 'australia', countryId: 'au', slug: 'australia', title: 'Study in Australia', 
    heroImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&q=80', 
    costOfLiving: 'AUD $30,000+ / Year', 
    visaRequirements: 'AUD $20,000 – 40,000 / Year', 
    content: '### Study in Australia\nAustralia is implementing the Genuine Student (GS) requirement. This ensures students are matched with high-quality institutional nodes.' 
  },
  { 
    id: 'canada', countryId: 'ca', slug: 'canada', title: 'Study in Canada', 
    heroImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&q=80', 
    costOfLiving: 'CAD $20,635 / Year', 
    visaRequirements: 'CAD $11,000 – 35,000 / Year', 
    content: '### Study in Canada\nCanada focuses on STEM and Healthcare specialists. Provincial Attestation Letters (PAL) are now mandatory for most study permits.' 
  },
  { 
    id: 'usa', countryId: 'us', slug: 'usa', title: 'Study in USA', 
    heroImage: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=1200&q=80', 
    costOfLiving: 'USD $12,000 – 18,000 / Year', 
    visaRequirements: 'USD $11,000 – 40,000 / Year', 
    content: '### Academic Flexibility\nThe USA offers the most diverse range of majors. Digital I-20s have streamlined the F-1 visa process.' 
  },
  { 
    id: 'new-zealand', countryId: 'nz', slug: 'new-zealand', title: 'Study in New Zealand', 
    heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80', 
    costOfLiving: 'NZD $20,000 / Year', 
    visaRequirements: 'NZD $16,000 – 35,000 / Year', 
    content: '### Think New!\nEvery single university in NZ is ranked in the top 3% globally. Practical education is the priority here.' 
  },
  { 
    id: 'ireland', countryId: 'ie', slug: 'ireland', title: 'Study in Ireland', 
    heroImage: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=1200&q=80', 
    costOfLiving: '€12,000 / Year', 
    visaRequirements: '€8,000 – 22,000 / Year', 
    content: '### The European Tech Hub\nDublin hosts over 1,000 multinationals. Master’s graduates get a 2-year stay-back visa.' 
  },
  { 
    id: 'germany', countryId: 'de', slug: 'germany', title: 'Study in Germany', 
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&q=80', 
    costOfLiving: '€11,904 - €12,200 / Year', 
    visaRequirements: '€0 – 5,000 / Year', 
    content: '### Engine of Europe\nPublic universities are mostly tuition-free. Proof of living funds via a blocked account is mandatory.' 
  },
  { 
    id: 'italy', countryId: 'it', slug: 'italy', title: 'Study in Italy', 
    heroImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&q=80', 
    costOfLiving: '€6,500 – €7,500 / Year', 
    visaRequirements: '€500 – €3,000 / Year', 
    content: '### Affordable Prestige\nPublic universities use income-based fees. Regional grants like DSU can cover all tuition.' 
  },
  { 
    id: 'sweden', countryId: 'se', slug: 'sweden', title: 'Study in Sweden', 
    heroImage: 'https://images.unsplash.com/photo-1509339022327-1e1e25360a41?w=1200&q=80', 
    costOfLiving: 'SEK 11,000 / Month', 
    visaRequirements: '€7,000 – €25,000 / Year', 
    content: '### The Lagom Life\nSweden focuses on collaborative, non-hierarchical learning and sustainability node development.' 
  },
  { 
    id: 'finland', countryId: 'fi', slug: 'finland', title: 'Study in Finland', 
    heroImage: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=1200&q=80', 
    costOfLiving: '€800 - €900 / Month', 
    visaRequirements: '€6,000 – 15,000 / Year', 
    content: '### Happiest Education System\nFinland prioritizes problem-solving and critical thinking over standard memorization.' 
  },
  { 
    id: 'cyprus', countryId: 'cy', slug: 'cyprus', title: 'Study in Cyprus', 
    heroImage: 'https://images.unsplash.com/photo-1505305976870-c0be1cd39939?w=1200&q=80', 
    costOfLiving: '€600 - €900 / Month', 
    visaRequirements: '€4,800 – 9,800 / Year', 
    content: '### Mediterranean Hub\nEnjoy EU-recognized degrees in a sunny, affordable Mediterranean environment.' 
  },
  { 
    id: 'dubai', countryId: 'ae', slug: 'dubai', title: 'Study in Dubai', 
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80', 
    costOfLiving: 'AED 4,000 - 9,000 / Month', 
    visaRequirements: 'AED 35,000 – 80,000 / Year', 
    content: '### City of the Future\nStudy at prestigious UK/US branch campuses in DIAC. Zero tax on student internship earnings.' 
  },
  { 
    id: 'malaysia', countryId: 'my', slug: 'malaysia', title: 'Study in Malaysia', 
    heroImage: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=1200&q=80', 
    costOfLiving: 'RM 1,500 - 3,000 / Month', 
    visaRequirements: 'USD $4,000 – 9,000 / Year', 
    content: '### Western Degrees, Asian Prices\nMalaysia offers world-class education via branch campuses at 70% lower costs.' 
  },
  { 
    id: 'turkey', countryId: 'tr', slug: 'turkey', title: 'Study in Turkey', 
    heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80', 
    costOfLiving: 'USD $400 - 800 / Month', 
    visaRequirements: 'USD $3,000 – 10,000 / Year', 
    content: '### Where Continents Meet\nTurkey is part of the Bologna process, ensuring your degree is recognized across Europe.' 
  },
  { 
    id: 'europe', countryId: 'eu', slug: 'europe', title: 'Study in Europe Hub', 
    heroImage: 'https://images.unsplash.com/photo-1473951574080-01fe45ec8643?w=1200&q=80', 
    costOfLiving: '€500 - €1,100 / Month', 
    visaRequirements: '€6,000 – 18,000 / Year', 
    content: '### The Continent Awaits\nAccess the entire Schengen zone via over 10,000 English-taught programs across Europe.' 
  }
];

export const universities: University[] = [
  { id: 'u-oxford', name: 'University of Oxford', slug: 'oxford', location: 'Oxford, UK', description: 'Top global research node.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe1?w=200', ranking: 1, countryId: 'uk', website: 'https://ox.ac.uk' },
  { id: 'u-nyu', name: 'New York University', slug: 'nyu', location: 'New York, USA', description: 'Global private university.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe1?w=200', ranking: 38, countryId: 'us', website: 'https://nyu.edu' },
];

export const courses: Course[] = [
  { id: 'cs-msc-ai', universityId: 'u-manchester', title: 'MSc Artificial Intelligence', degree: 'Postgraduate', duration: '1 Year', tuitionFee: '£28,000', description: 'Advanced AI nodes.' }
];

export const lmsCourses: LMSCourse[] = [
  { id: 'c-pte-master', title: 'PTE 79+ Masterclass', category: 'PTE', thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800', description: 'Comprehensive PTE training.', duration: '25 Hours', instructor: 'Prof. Michael Aris', price: 49 },
];

export const lmsModules: LMSModule[] = [
  { id: 'm-intro', title: 'Core Foundations', lessons: [{ id: 'l-01', title: 'Introduction', type: 'Video', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }] }
];

export const lmsTests: LMSPracticeTest[] = [
  {
    id: 'full-mock-1', title: 'IELTS Academic Full Simulation',
    sections: [
      {
        id: 'ielts-reading-1', title: 'Reading Task: Marie Curie', skill: 'Reading', timeLimit: 20,
        passageText: `Marie Curie is probably the most famous woman scientist who has ever lived...`,
        questions: [
          { id: 'q1', skill: 'Reading', type: 'TFNG', text: 'Marie Curie’s husband was a joint winner of both Marie’s Nobel Prizes.' }
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
