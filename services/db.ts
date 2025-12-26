import { Product, VoucherCode, User, University, Course, CountryGuide, LMSCourse, LMSModule, LMSPracticeTest, Enrollment, CourseVoucher, Qualification, ImmigrationGuideData } from '../types';

export const users: User[] = [
  { id: 'u-admin', name: 'System Admin / Owner', email: 'admin@nexus.ai', role: 'Admin' },
  { id: 'u-finance', name: 'Finance / Audit Team', email: 'finance@nexus.ai', role: 'Finance' },
  { id: 'u-manager', name: 'Operations Manager', email: 'manager@nexus.ai', role: 'Admin' },
  { id: 'u-trainer', name: 'Lead Trainer', email: 'trainer@nexus.ai', role: 'Trainer' },
  { id: 'u-support', name: 'Support / Sales Node', email: 'support@nexus.ai', role: 'Admin' },
  { id: 'u-agent', name: 'Agent Partner / Prep Center', email: 'partner@nexus.ai', role: 'Agent', tier: 2 },
  { id: 'u-student', name: 'Alex Smith (Student)', email: 'alex@gmail.com', role: 'Customer' },
];

export const products: Product[] = [
  { id: 'v-1', name: 'IELTS Academic Voucher', category: 'IELTS', type: 'Voucher', basePrice: 149, currency: 'USD', description: 'Standard British Council/IDP Academic training voucher.', icon: '🌐' },
  { id: 'v-2', name: 'IELTS General Training', category: 'IELTS', type: 'Voucher', basePrice: 149, currency: 'USD', description: 'Standard IELTS General training voucher for migration.', icon: '🌐' },
  { id: 'v-6', name: 'PTE Academic Voucher', category: 'PTE', type: 'Voucher', basePrice: 165, currency: 'USD', description: 'Pearson Test of English Academic standard voucher.', icon: '📊' },
  { id: 'v-10', name: 'LanguageCert SELT B1', category: 'LanguageCert', type: 'Voucher', basePrice: 155, currency: 'USD', description: 'Secure English Language Test (SELT) for UKVI.', icon: '⚡' },
  { id: 'v-11', name: 'LanguageCert SELT B2', category: 'LanguageCert', type: 'Voucher', basePrice: 175, currency: 'USD', description: 'Advanced SELT assessment for University Tier 4.', icon: '⚡' },
  { id: 'v-17', name: 'Skills for English SELT', category: 'Skills for English', type: 'Voucher', basePrice: 160, currency: 'USD', description: 'PSI Skills for English UKVI compliant voucher.', icon: '🛡️' },
  { id: 'v-19', name: 'TOEFL iBT Official', category: 'TOEFL', type: 'Voucher', basePrice: 195, currency: 'USD', description: 'ETS TOEFL iBT Official Global voucher.', icon: '🌎' },
  { id: 'v-20', name: 'Duolingo English Test', category: 'Duolingo', type: 'Voucher', basePrice: 60, currency: 'USD', description: 'Duolingo English Test Global Access.', icon: '🦉' },
  { id: 'v-21', name: 'Oxford ELLT Digital', category: 'ELLT', type: 'Voucher', basePrice: 85, currency: 'USD', description: 'Oxford International Digital English Test.', icon: '🏫' },
  { id: 'v-22', name: 'Password Skills Plus', category: 'OTHER', type: 'Voucher', basePrice: 95, currency: 'USD', description: 'Password Skills Plus Global assessment node.', icon: '🔑' }
];

export const countryGuides: CountryGuide[] = [
  { 
    id: 'uk', 
    countryId: 'uk', 
    slug: 'uk', 
    title: 'Study in United Kingdom', 
    content: `Are you dreaming of walking through the historic campuses of Oxford, London, Manchester, Birmingham, Glasgow, Cardiff, Belfast? The United Kingdom remains one of the world's premier destinations for higher education, offering a blend of tradition, innovation, and global career opportunities.

### Why Study in the UK?
- Shorter Course Durations: Most UK Bachelor's take 3 years, Masters take 1 year.
- World-Class Research: Forefront of global innovation.
- Cultural Diversity: Community from over 180 countries.

### Latest Visa Rules
The UK has fully transitioned to **eVisas**. You will now access your status online. Required funds: £1,529/mo in London, £1,171/mo outside London.`,
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', 
    costOfLiving: '£1,171 - £1,529/mo', 
    visaRequirements: 'Student Visa (eVisas Active)' 
  },
  { 
    id: 'australia', 
    countryId: 'australia', 
    slug: 'australia', 
    title: 'Study in Australia', 
    content: `G’day! Australia combines world-class education with an outdoor lifestyle. The 2025 focus is on **National Planning Levels** and caps.

### Strategic Sectors
- Healthcare & Nursing
- Early Childhood Education
- Green Energy Engineering
- Cybersecurity & AI

Required proof of funding: roughly AUD $30,000+ for living expenses.`, 
    heroImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200', 
    costOfLiving: 'AUD $2,500/mo', 
    visaRequirements: 'Subclass 500' 
  },
  { 
    id: 'canada', 
    countryId: 'canada', 
    slug: 'canada', 
    title: 'Study in Canada', 
    content: `World-class education and generous post-study work permits. Most students now require a **Provincial Attestation Letter (PAL)**.

### Career Pathways
- Skilled Trades
- STEM (Science, Tech, Engineering, Math)
- Healthcare

Financial requirement: CAD $20,635+ plus tuition.`, 
    heroImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200', 
    costOfLiving: 'CAD $1,800/mo', 
    visaRequirements: 'Study Permit (SDS/Non-SDS)' 
  },
  { 
    id: 'new-zealand', 
    countryId: 'new-zealand', 
    slug: 'new-zealand', 
    title: 'Study in New Zealand', 
    content: `Kia Ora! A destination defined by natural beauty and high-quality practical learning. All 8 universities are in the global top 3%.

### The Green List
Hard-to-fill roles that provide a fast-track to residency in construction, ICT, and teaching.`, 
    heroImage: 'https://images.unsplash.com/photo-1469521669194-b785a1131b20?w=1200', 
    costOfLiving: 'NZD $20,000/yr', 
    visaRequirements: 'Fee-Paying Student Visa' 
  },
  { 
    id: 'usa', 
    countryId: 'usa', 
    slug: 'usa', 
    title: 'Study in USA', 
    content: `The undisputed "Land of Opportunity". Flexibility allows you to tailor your education to your exact passions.

### The STEM Advantage
STEM graduates are eligible for a **3-year OPT** (Optional Practical Training) to work in the USA.`, 
    heroImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200', 
    costOfLiving: 'USD $1,500/mo', 
    visaRequirements: 'F-1 Student Visa' 
  },
  { 
    id: 'ireland', 
    countryId: 'ireland', 
    slug: 'ireland', 
    title: 'Study in Ireland', 
    content: `The tech hub of Europe and the only English-speaking country in the Eurozone. Dublin is HQ for over 1,000 multinationals.

### Third Level Graduate Scheme
Master's graduates get a **2-year stay-back visa** to launch their European career.`, 
    heroImage: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=1200', 
    costOfLiving: '€1,000/mo', 
    visaRequirements: 'Stamp 2 Visa' 
  },
  { 
    id: 'cyprus', 
    countryId: 'cyprus', 
    slug: 'cyprus', 
    title: 'Study in Cyprus', 
    content: `A booming Mediterranean hub with recognized EU degrees. Live in one of the safest countries while earning a world-class degree.

### Key Industries
- Hospitality & Tourism
- Maritime & Shipping
- Computer Science`, 
    heroImage: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=1200', 
    costOfLiving: '€700/mo', 
    visaRequirements: 'National Student Visa' 
  },
  { 
    id: 'germany', 
    countryId: 'germany', 
    slug: 'germany', 
    title: 'Study in Germany', 
    content: `The engine of Europe. Public universities offer near-zero tuition fees for high-achieving students.

### Blocked Account
You must deposit roughly **€11,904** for your first year of living expenses.`, 
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', 
    costOfLiving: '€934/mo', 
    visaRequirements: 'National Visa (Type D)' 
  },
  { 
    id: 'italy', 
    countryId: 'italy', 
    slug: 'italy', 
    title: 'Study in Italy', 
    content: `The heart of culture, design, and affordable public education. Tuition is often based on family income (ISEE).

### DSU Scholarships
Zero tuition fees plus a yearly stipend of up to €7,000 for qualifying students.`, 
    heroImage: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1200', 
    costOfLiving: '€800/mo', 
    visaRequirements: 'National Visa (Type D)' 
  },
  { 
    id: 'sweden', 
    countryId: 'sweden', 
    slug: 'sweden', 
    title: 'Study in Sweden', 
    content: `The land of innovation and sustainability. Study where equality is real and nature is respected.

### Stay-Back Permit
Sweden offers a **12-month permit** after graduation specifically to look for work.`, 
    heroImage: 'https://images.unsplash.com/photo-1509339022327-1e1e25360a41?w=1200', 
    costOfLiving: 'SEK 10,500/mo', 
    visaRequirements: 'Residence Permit' 
  },
  { 
    id: 'finland', 
    countryId: 'finland', 
    slug: 'finland', 
    title: 'Study in Finland', 
    content: `The world's happiest country. Home to arguably the best education system on the planet.

### Post-Study Freedom
Graduates can apply for a **2-year stay-back permit**, one of the longest in Europe.`, 
    heroImage: 'https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?w=1200', 
    costOfLiving: '€900/mo', 
    visaRequirements: 'Residence Permit' 
  },
  { 
    id: 'dubai', 
    countryId: 'dubai', 
    slug: 'dubai', 
    title: 'Study in Dubai', 
    content: `Study in the city of the future. Access world-renowned branch campuses from the UK and Australia in a tax-free hub.

### Golden Visa
Academic excellence can lead to a **10-Year Golden Visa** without the need for a sponsor.`, 
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200', 
    costOfLiving: 'AED 3,500/mo', 
    visaRequirements: 'Student Residence Visa' 
  },
  { 
    id: 'malaysia', 
    countryId: 'malaysia', 
    slug: 'malaysia', 
    title: 'Study in Malaysia', 
    content: `A top-10 global education hub. Get a Western degree with a Southeast Asian budget through international branch campuses.

### Digital Visa Approval
Approval time for e-VAL is remarkably fast, typically 14–21 working days.`, 
    heroImage: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=1200', 
    costOfLiving: 'USD $500/mo', 
    visaRequirements: 'Student Pass (e-VAL)' 
  },
  { 
    id: 'turkey', 
    countryId: 'turkey', 
    slug: 'turkey', 
    title: 'Study in Turkey', 
    content: `Where continents meet. European standards with a Mediterranean soul. Turkey is a full member of the Bologna Process.

### Comprehensive Scholarships
**Türkiye Bursları** covers full tuition, stipend, accommodation, and health insurance.`, 
    heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200', 
    costOfLiving: 'USD $400/mo', 
    visaRequirements: 'Student Residence Permit' 
  },
  { 
    id: 'europe', 
    countryId: 'europe', 
    slug: 'europe', 
    title: 'Study in Europe Hub', 
    content: `Access the wider Schengen area. Poland, Hungary, Spain, and France offer unique, specialized routes for global talent.

### The Blue Card
Transition into a career across the entire European Union after graduation.`, 
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', 
    costOfLiving: 'Variable', 
    visaRequirements: 'Schengen Student Route' 
  },
];

export const voucherCodes: VoucherCode[] = [
  ...Array(50).fill(0).map((_, i) => ({ id: `v1-${i}`, productId: 'v-1', code: `IL-AC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, status: 'Available' as const, expiryDate: '2026-01-01' })),
];

export const universities: University[] = [
  { id: 'uni-manchester', name: 'University of Manchester', slug: 'manchester', location: 'Manchester, UK', ranking: 32, description: 'Global research powerhouse.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200', countryId: 'uk', website: 'https://www.manchester.ac.uk' }
];

export const courses: Course[] = [
  { id: 'c-1', universityId: 'uni-manchester', degree: 'Postgraduate', title: 'MSc Advanced Computer Science', duration: '1 Year', tuitionFee: '$32,000', description: 'Deep tech specialization.' }
];

export const lmsCourses: LMSCourse[] = [
  { id: 'pte-mastery', title: 'PTE Academic Mastery', description: 'Complete prep for Pearson Test of English.', thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', category: 'PTE', duration: '20 Hours', instructor: 'Dr. Jane Smith', price: 99, status: 'Paid' }
];

export const lmsModules: LMSModule[] = [
  { id: 'm1-pte', courseId: 'pte-mastery', title: 'Module 1: Strategy', lessons: [] }
];

export const lmsTests: LMSPracticeTest[] = [
  { id: 'full-mock-1', title: 'IELTS/PTE Alpha Mock', sections: [] }
];

export const qualifications: Qualification[] = [
  { id: 'q-othm-3', title: 'OTHM Level 3 Diploma in Business', duration: '6 Months', qualificationBody: 'OTHM', tuitionFees: '$1,200', requirements: ['High School Certificate'], description: 'Foundation for business management.', level: 'Level 3', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800' }
];

export const initialEnrollments: Enrollment[] = [];
export const courseVouchers: CourseVoucher[] = [];
export const immigrationGuides: ImmigrationGuideData[] = [];
export const universityBySlug = (slug: string): University | null => universities.find(u => u.slug === slug) || null;