
import { Product, VoucherCode, User, University, Course, CountryGuide, LMSCourse, LMSModule, LMSPracticeTest, Enrollment, CourseVoucher, Qualification, ImmigrationGuideData } from '../types';

export const users: User[] = [
  { id: 'u-admin', name: 'System Admin', email: 'admin@nexus.ai', role: 'Admin' },
  { id: 'u-trainer', name: 'Lead IELTS Trainer', email: 'trainer@nexus.ai', role: 'Trainer' },
  { id: 'u-finance', name: 'Chief Financial Officer', email: 'finance@nexus.ai', role: 'Finance' },
  { id: 'u-agent', name: 'Global Training Center', email: 'partner@edu.com', role: 'Agent', tier: 2 },
  { id: 'u-student', name: 'Alex Smith', email: 'alex@gmail.com', role: 'Customer' },
];

export const products: Product[] = [
  {
    id: 'p-pte',
    name: 'PTE Academic',
    category: 'PTE',
    type: 'Voucher',
    basePrice: 180,
    currency: 'USD',
    description: 'Pearson Test of English voucher. Valid for global test booking.',
    icon: '📊',
    supportsFullRegistration: true,
    priceTiers: [{ minQuantity: 5, discountPercentage: 5 }]
  },
  {
    id: 'p-ielts',
    name: 'IELTS Academic',
    category: 'IELTS',
    type: 'Voucher',
    basePrice: 220,
    currency: 'USD',
    description: 'International English Language Testing System voucher.',
    icon: '🌐',
    supportsFullRegistration: true,
    priceTiers: [{ minQuantity: 3, discountPercentage: 3 }]
  }
];

export const qualifications: Qualification[] = [
  {
    id: 'q-othm-3',
    title: 'OTHM Level 3 Diploma in Business Studies',
    duration: '6 Months',
    qualificationBody: 'OTHM',
    tuitionFees: '$1,200',
    requirements: ['High School Certificate', 'English Proficiency (IELTS 5.0 equivalent)'],
    description: 'Understand the operations and structure of businesses.',
    level: 'Level 3',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop'
  }
];

export const voucherCodes: VoucherCode[] = [];
export const universities: University[] = [];
export const courses: Course[] = [];

export const immigrationGuides: ImmigrationGuideData[] = [
  {
    id: 'skilled', countryId: 'skilled', slug: 'skilled-immigration', title: 'Skilled Immigration',
    content: 'Points-based migration paths for high-skilled professionals globally. Focus on high-demand technical and healthcare sectors.',
    heroImage: 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?w=1200&auto=format&fit=crop',
    pathways: [{ id: 'p1', title: 'Federal Skilled Worker', description: 'Global pathways for experts.', requirements: ['Degree', '3+ Yrs Exp', 'CLB 7+ English'] }]
  },
  {
    id: 'business', countryId: 'business', slug: 'business-immigration', title: 'Business Immigration',
    content: 'Investment and entrepreneur routes for business leaders seeking global residency or citizenship.',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop',
    pathways: [{ id: 'p2', title: 'Start-up Visa', description: 'Innovator paths for tech entrepreneurs.', requirements: ['Business Plan', 'Funding Commitment'] }]
  },
  {
    id: 'cbi', countryId: 'cbi', slug: 'citizenship-by-investment', title: 'Citizenship by Investment',
    content: 'Global mobility through strategic capital contribution. Fast-track second passports for investors.',
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5eaad0ff3b0d?w=1200&auto=format&fit=crop',
    pathways: [{ id: 'p3', title: 'Strategic Investment', description: 'Residency via real estate or capital.', requirements: ['Proof of Net Worth', 'Clear Criminal Record'] }]
  },
  {
    id: 'nomads', countryId: 'nomads', slug: 'nomads', title: 'Nomads & Remote Work',
    content: 'Digital nomad visas and remote work permits for global citizens. Work while traveling the world.',
    heroImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop',
    pathways: [{ id: 'p4', title: 'Digital Nomad Permit', description: 'Remote work flexibility.', requirements: ['Income Proof > $2.5k/mo', 'Health Insurance'] }]
  },
  {
    id: 'regional', countryId: 'regional', slug: 'regional', title: 'Regional Mobility',
    content: 'Pathways focused on specific regional development areas with specialized labor needs.',
    heroImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&auto=format&fit=crop',
    pathways: [{ id: 'p5', title: 'Regional Sponsored', description: 'Focus on growth areas.', requirements: ['Regional Job Offer', 'State Nomination'] }]
  }
];

export const countryGuides: CountryGuide[] = [
  { id: 'uk', countryId: 'uk', slug: 'uk', title: 'Study in UK', content: 'Historic excellence and world-class universities in London, Manchester, and Edinburgh.', heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', costOfLiving: '£1,200/mo', visaRequirements: 'Student Visa (CAS required)' },
  { id: 'australia', countryId: 'au', slug: 'australia', title: 'Study in Australia', content: 'Modern innovation and sun-drenched campuses in Sydney, Melbourne, and Brisbane.', heroImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200', costOfLiving: '$2,000/mo', visaRequirements: 'Subclass 500 Student Visa' },
  { id: 'usa', countryId: 'us', slug: 'usa', title: 'Study in USA', content: 'Global prestige and endless research opportunities across the Ivy League and beyond.', heroImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200', costOfLiving: '$1,500/mo', visaRequirements: 'F-1 Student Visa' },
  { id: 'canada', countryId: 'ca', slug: 'canada', title: 'Study in Canada', content: 'Welcoming hub for international talent with high post-study work prospects.', heroImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200', costOfLiving: '$1,500/mo', visaRequirements: 'Study Permit (SDS & Non-SDS)' },
  { id: 'nz', countryId: 'nz', slug: 'new-zealand', title: 'Study in New Zealand', content: 'Safe, scenic, and innovative education system focused on sustainability.', heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200', costOfLiving: '$1,800/mo', visaRequirements: 'Student Visa' },
  { id: 'ireland', countryId: 'ie', slug: 'ireland', title: 'Study in Ireland', content: 'The technical gateway to Europe and a hub for world-leading software companies.', heroImage: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=1200', costOfLiving: '€1,000/mo', visaRequirements: 'Student Visa (Stamp 2)' },
  { id: 'cyprus', countryId: 'cy', slug: 'cyprus', title: 'Study in Cyprus', content: 'Mediterranean learning with affordable tuition and a growing business sector.', heroImage: 'https://images.unsplash.com/photo-1589146522366-06103e33917d?w=1200', costOfLiving: '€800/mo', visaRequirements: 'Student Visa' },
  { id: 'germany', countryId: 'de', slug: 'germany', title: 'Study in Germany', content: 'Technical mastery and engineering excellence with tuition-free public options.', heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', costOfLiving: '€900/mo', visaRequirements: 'Student Visa (Blocked Account required)' },
  { id: 'italy', countryId: 'it', slug: 'italy', title: 'Study in Italy', content: 'Art, history, and fashion in the heart of Europe. Home to oldest world universities.', heroImage: 'https://images.unsplash.com/photo-1529260839382-3eff517bac74?w=1200', costOfLiving: '€800/mo', visaRequirements: 'D-type Visa' },
  { id: 'sweden', countryId: 'se', slug: 'sweden', title: 'Study in Sweden', content: 'Sustainability and design leadership in a society known for innovation.', heroImage: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=1200', costOfLiving: '9,000 SEK/mo', visaRequirements: 'Residence Permit for Studies' },
  { id: 'finland', countryId: 'fi', slug: 'finland', title: 'Study in Finland', content: 'World-best education system and the happiest nation on earth.', heroImage: 'https://images.unsplash.com/photo-1473951574080-01fe45ec8643?w=1200', costOfLiving: '€800/mo', visaRequirements: 'Residence Permit' },
  { id: 'dubai', countryId: 'ae', slug: 'dubai', title: 'Study in Dubai', content: 'The future hub of business and luxury. High-speed career pathways.', heroImage: 'https://images.unsplash.com/photo-1512453979798-5eaad0ff3b0d?w=1200', costOfLiving: 'AED 3,000/mo', visaRequirements: 'Student Visa (Institutional Sponsor)' },
  { id: 'malaysia', countryId: 'my', slug: 'malaysia', title: 'Study in Malaysia', content: 'Diverse, affordable, and home to global branch campuses from UK and Australia.', heroImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a594?w=1200', costOfLiving: 'RM 1,500/mo', visaRequirements: 'Student Pass (eVAL)' },
  { id: 'turkey', countryId: 'tr', slug: 'turkey', title: 'Study in Turkey', content: 'The bridge of cultures offering high-quality medical and technical programs.', heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200', costOfLiving: '₺ 5,000/mo', visaRequirements: 'Education Visa' },
  { id: 'europe', countryId: 'eu', slug: 'europe', title: 'Study in Europe', content: 'Across the Schengen area, find diverse cultures and some of the world\'s oldest and most prestigious universities.', heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', costOfLiving: '€1,000/mo', visaRequirements: 'Schengen Student Visa' }
];

export const lmsCourses: LMSCourse[] = [
  { id: 'pte-mastery', title: 'PTE Academic Mastery', description: 'Complete prep for Pearson Test of English.', thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', category: 'PTE', duration: '20 Hours', instructor: 'Dr. Jane Smith', price: 99, status: 'Paid' },
  { id: 'ielts-bootcamp', title: 'IELTS Band 8 Bootcamp', description: 'Intensive prep for Higher Band IELTS scores.', thumbnail: 'https://images.unsplash.com/photo-1544391496-1ca7c97457cd?w=800', category: 'IELTS', duration: '35 Hours', instructor: 'Prof. Mark Wood', price: 149, status: 'Paid' }
];
export const lmsModules: LMSModule[] = [];
export const lmsTests: LMSPracticeTest[] = [];
export const initialEnrollments: Enrollment[] = [];
export const courseVouchers: CourseVoucher[] = [];
export const universityBySlug = (slug: string): University | null => null;
