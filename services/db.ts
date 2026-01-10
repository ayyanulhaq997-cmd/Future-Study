import { Product, VoucherCode, User, University, CountryGuide, Course, Qualification, LMSCourse, LMSPracticeTest, ManualSubmission, TestResult, LMSModule, ImmigrationGuideData } from '../types';

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
    content: '### Why Study in the UK?\nThe UK is the gold standard for global academic prestige. Shorter durations mean you save on living costs while graduating earlier. ### 2025 Updates\nFull transition to eVisa is now active. All physical BRPs are being phased out in favor of secure digital identities.' 
  },
  { 
    id: 'australia', countryId: 'au', slug: 'australia', title: 'Study in Australia', 
    heroImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200&q=80', 
    costOfLiving: 'AUD $30,000+ / Year', 
    visaRequirements: 'AUD $20,000 – 40,000 / Year', 
    content: '### G’day, Future Leaders!\nAustralia is implementing the Genuine Student (GS) requirement. This ensures students are matched with high-quality institutional nodes. ### National Planning Level\nThe government has introduced caps on international commencements for 2025.' 
  },
  { 
    id: 'canada', countryId: 'ca', slug: 'canada', title: 'Study in Canada', 
    heroImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80', 
    costOfLiving: 'CAD $20,635 / Year', 
    visaRequirements: 'CAD $11,000 – 35,000 / Year', 
    content: '### Land of Opportunity\nCanada focuses on STEM and Healthcare specialists. Provincial Attestation Letters (PAL) are now mandatory for most study permits. ### Financial Proof\nApplicants must demonstrate at least CAD $20,635 in living funds plus first-year tuition.' 
  },
  { 
    id: 'usa', countryId: 'us', slug: 'usa', title: 'Study in USA', 
    heroImage: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=1200&q=80', 
    costOfLiving: 'USD $12,000 – 18,000 / Year', 
    visaRequirements: 'USD $11,000 – 40,000 / Year', 
    content: '### Academic Flexibility\nThe USA offers the most diverse range of majors. Digital I-20s have streamlined the F-1 visa process. ### STEM OPT\nSTEM graduates can stay up to 3 years post-graduation on work authorization.' 
  },
  { 
    id: 'new-zealand', countryId: 'nz', slug: 'new-zealand', title: 'Study in New Zealand', 
    heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80', 
    costOfLiving: 'NZD $20,000 / Year', 
    visaRequirements: 'NZD $16,000 – 35,000 / Year', 
    content: '### Think New!\nEvery single university in NZ is ranked in the top 3% globally. Practical education is the priority here. ### Green List\nNZ offers fast-track residency for roles on its critical skills Green List.' 
  },
  { 
    id: 'ireland', countryId: 'ie', slug: 'ireland', title: 'Study in Ireland', 
    heroImage: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=1200&q=80', 
    costOfLiving: '€12,000 / Year', 
    visaRequirements: '€8,000 – 22,000 / Year', 
    content: '### The European Tech Hub\nDublin hosts over 1,000 multinationals. Master’s graduates get a 2-year stay-back visa. ### Critical Skills\nIreland fast-tracks visas for specialists in Tech, Pharma, and Fintech.' 
  },
  { 
    id: 'germany', countryId: 'de', slug: 'germany', title: 'Study in Germany', 
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&q=80', 
    costOfLiving: '€11,904 - €12,200 / Year', 
    visaRequirements: '€0 – 5,000 / Year', 
    content: '### Industrial Powerhouse\nPublic universities are mostly tuition-free. Proof of living funds via a blocked account (Sperrkonto) is mandatory (~€11,904).' 
  },
  { 
    id: 'italy', countryId: 'it', slug: 'italy', title: 'Study in Italy', 
    heroImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&q=80', 
    costOfLiving: '€6,500 – €7,500 / Year', 
    visaRequirements: '€500 – €3,000 / Year', 
    content: '### Renaissance Education\nPublic universities use income-based fees (ISEE). Regional grants like DSU can cover all tuition and provide a stipend.' 
  },
  { 
    id: 'sweden', countryId: 'se', slug: 'sweden', title: 'Study in Sweden', 
    heroImage: 'https://images.unsplash.com/photo-1541043353979-99a389274291?w=1200&q=80', 
    costOfLiving: 'SEK 11,000 / Month', 
    visaRequirements: '€7,000 – €25,000 / Year', 
    content: '### The Lagom Life\nSweden focuses on collaborative, non-hierarchical learning. SI Scholarships offer full funding for future leaders. ### Innovation Node\nHome to major industrial nodes like Spotify, IKEA, and Volvo, Sweden is a leader in sustainability and green tech.' 
  },
  { 
    id: 'finland', countryId: 'fi', slug: 'finland', title: 'Study in Finland', 
    heroImage: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=1200&q=80', 
    costOfLiving: '€800 - €900 / Month', 
    visaRequirements: '€6,000 - €12,000 / Year', 
    content: '### The Land of a Thousand Lakes\nFinland is consistently ranked as the happiest country in the world. It offers world-class education with a focus on equality and innovation.'
  },
  { 
    id: 'cyprus', countryId: 'cy', slug: 'cyprus', title: 'Study in Cyprus', 
    heroImage: 'https://images.unsplash.com/photo-1505305976870-c0be1cd39939?w=1200&q=80', 
    costOfLiving: '€700 - €1,000 / Month', 
    visaRequirements: '€4,000 – €9,000 / Year', 
    content: '### Mediterranean Excellence\nCyprus offers European standard degrees with a significantly lower cost of living. It is a rising hub for business and hospitality management.' 
  },
  { 
    id: 'dubai', countryId: 'ae', slug: 'dubai', title: 'Study in Dubai', 
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80', 
    costOfLiving: 'AED 3,000 - 6,000 / Month', 
    visaRequirements: 'AED 35,000 – 70,000 / Year', 
    content: '### City of the Future\nDubai hosts world-renowned branch campuses like Middlesex and Heriot-Watt. Students enjoy a tax-free environment and incredible internship nodes.' 
  },
  { 
    id: 'malaysia', countryId: 'my', slug: 'malaysia', title: 'Study in Malaysia', 
    heroImage: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=1200&q=80', 
    costOfLiving: 'RM 1,500 - 3,000 / Month', 
    visaRequirements: 'USD $4,000 – 8,000 / Year', 
    content: '### Truly Asia\nMalaysia is a top destination for affordable, high-quality English-medium education. Many UK and Australian universities have direct campus nodes here.' 
  },
  { 
    id: 'turkey', countryId: 'tr', slug: 'turkey', title: 'Study in Turkey', 
    heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&q=80', 
    costOfLiving: 'USD $400 - 700 / Month', 
    visaRequirements: 'USD $3,000 – 10,000 / Year', 
    content: '### Bridging Continents\nTurkey offers a unique cultural node with deep history and modern academic infrastructure. State scholarships provide 100% funding for top applicants.' 
  },
  { 
    id: 'europe', countryId: 'eu', slug: 'europe', title: 'Study in Europe Hub', 
    heroImage: 'https://images.unsplash.com/photo-1473951574080-01fe45ec8643?w=1200&q=80', 
    costOfLiving: '€600 - €1,100 / Month', 
    visaRequirements: '€6,000 – 15,000 / Year', 
    content: '### The Continent Awaits\nExplore rising hubs like Poland, Hungary, and Spain. A degree from a Schengen member state opens doors to the entire European job market.' 
  }
];

export const universities: University[] = [
  { id: 'uni-1', name: 'University of Manchester', slug: 'uom', location: 'Manchester, UK', description: 'A world-leading research institution.', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e9/University_of_Manchester_logo.svg/1200px-University_of_Manchester_logo.svg.png', ranking: 32, countryId: 'uk', website: 'https://www.manchester.ac.uk' },
  { id: 'uni-2', name: 'University of Melbourne', slug: 'unimelb', location: 'Melbourne, Australia', description: "Australia's #1 university.", logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/University_of_Melbourne_logo.svg/1200px-University_of_Melbourne_logo.svg.png', ranking: 14, countryId: 'au', website: 'https://www.unimelb.edu.au' }
];

export const courses: Course[] = [
  { id: 'c-1', universityId: 'uni-1', title: 'MSc Data Science', degree: 'Postgraduate', duration: '1 Year', tuitionFee: '£28,000', description: 'Advanced study of data analysis and machine learning.' },
  { id: 'c-2', universityId: 'uni-1', title: 'BSc Computer Science', degree: 'Undergraduate', duration: '3 Years', tuitionFee: '£26,000', description: 'Foundational degree in computing.' }
];

export const qualifications: Qualification[] = [
  { id: 'othm-l3', title: 'OTHM Level 3 Foundation Diploma', qualificationBody: 'OTHM', level: 'Level 3', tuitionFees: '$1,200', description: 'Entry point for higher education.', duration: '6 Months', image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800', requirements: ['High school completion', 'IELTS 5.5'] }
];

export const immigrationGuides: ImmigrationGuideData[] = [
  { id: 'uk-pr', slug: 'uk-pr', title: 'UK PR Pathway', heroImage: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=1200', content: 'Permanent residency options in the UK.', pathways: [{ id: 'skilled-worker', title: 'Skilled Worker Visa', description: 'Work-based route to settlement.', requirements: ['Job offer', 'English skills'] }] }
];

export const lmsCourses: LMSCourse[] = [
  { id: 'lms-pte-mastery', title: 'PTE Academic Mastery', category: 'PTE', thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800', description: 'Complete PTE preparation.', duration: '40 Hours', instructor: 'Dr. Jane Smith', price: 99 }
];

export const lmsModules: LMSModule[] = [
  { id: 'm-1', title: 'Introduction to PTE', lessons: [{ id: 'l-1', title: 'Exam Overview', type: 'Video', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }] }
];

export const lmsTests: LMSPracticeTest[] = [
  { id: 'full-mock-1', title: 'PTE Full Mock Exam 1', sections: [{ id: 's-1', title: 'Reading Section', skill: 'Reading', timeLimit: 30, questions: [{ id: 'q-1', skill: 'Reading', type: 'MCQ', text: 'Select the correct answer.', options: ['Option A', 'Option B'] }] }] }
];

export const manualSubmissions: ManualSubmission[] = [];
export const testResults: TestResult[] = [];
