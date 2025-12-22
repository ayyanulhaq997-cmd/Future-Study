
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

export const universities: University[] = [
  {
    id: 'uni-manchester',
    name: 'University of Manchester',
    slug: 'manchester',
    location: 'Manchester, UK',
    ranking: 32,
    description: 'A world-class research institution located in the heart of Manchester.',
    logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200&h=200&fit=crop',
    countryId: 'uk',
    website: 'https://www.manchester.ac.uk'
  }
];

export const courses: Course[] = [
  {
    id: 'c-cs-man',
    universityId: 'uni-manchester',
    title: 'MSc Computer Science',
    degree: 'Postgraduate',
    duration: '1 Year',
    tuitionFee: '£28,000',
    description: 'Advanced computing course focusing on AI and software engineering.'
  }
];

export const immigrationGuides: ImmigrationGuideData[] = [
  {
    id: 'skilled', countryId: 'skilled', slug: 'skilled-immigration', title: 'Skilled Immigration',
    content: 'In today’s global economy, skilled professionals are increasingly in demand. Countries worldwide actively seek talented individuals to fill labour shortages, drive innovation, and strengthen their economies. By 2026, many countries will face significant labour shortages, especially in healthcare, IT, engineering, construction, teaching, and renewable energy.',
    heroImage: 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?w=1200&auto=format&fit=crop',
    pathways: [
      { id: 'uk-sw', title: 'United Kingdom - Skilled Worker', description: 'Points-based route for professionals with a job offer from a licensed sponsor.', requirements: ['CoS from Employer', 'IELTS/PTE Proficiency', '£1,270 Maintenance'] },
      { id: 'ca-ee', title: 'Canada - Express Entry', description: 'Federal pathway for skilled immigrants based on CRS scores (Age, Education, Experience).', requirements: ['ECA Report', 'IELTS/CELPIP CLB 7+', 'Proof of Funds'] },
      { id: 'au-si', title: 'Australia - Skilled Independent', description: 'Points-tested visa for skilled workers not sponsored by an employer or family member.', requirements: ['Skills Assessment', 'EOI Submission', 'Minimum 65 Points'] }
    ]
  },
  {
    id: 'business', countryId: 'business', slug: 'business-immigration', title: 'Business Immigration',
    content: 'Business immigration refers to programs designed for individuals who wish to establish, invest in, manage, or expand businesses in another country. By 2026, many countries are expected to rely heavily on foreign entrepreneurs to stimulate economic growth and job creation.',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop',
    pathways: [
      { id: 'uk-if', title: 'UK Innovator Founder', description: 'For entrepreneurs with an innovative, viable, and scalable business idea endorsed by an approved body.', requirements: ['Endorsement Letter', 'Innovative Business Plan', 'Sufficient Funds'] },
      { id: 'ca-suv', title: 'Canada Start-Up Visa', description: 'Support for innovative founders backed by designated Canadian investors or incubators.', requirements: ['Support Letter', 'Language Proficiency', 'Settlement Funds'] }
    ]
  },
  {
    id: 'cbi', countryId: 'cbi', slug: 'citizenship-by-investment', title: 'Citizenship by Investment',
    content: 'A government-regulated immigration pathway that allows foreign nationals to obtain citizenship by making a qualifying economic contribution. CBI programs provide strategic global mobility and family security.',
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5eaad0ff3b0d?w=1200&auto=format&fit=crop',
    pathways: [
      { id: 'skn-cbi', title: 'Saint Kitts and Nevis', description: 'Citizenship via non-refundable donation to the state fund or real estate purchase.', requirements: ['USD 250,000+ Donation', 'Clean Background', 'Lawful Wealth Source'] },
      { id: 'mt-ce', title: 'Malta Exceptional Citizenship', description: 'EU citizenship by naturalisation for exceptional services by direct investment.', requirements: ['EUR 600,000+ Contribution', 'Residency Period', 'Strict Due Diligence'] }
    ]
  },
  {
    id: 'nomads', countryId: 'nomads', slug: 'nomads', title: 'Nomad & Remote Work Visas',
    content: 'Live Globally. Work Remotely. Nomad Visas allow you to live in a foreign country while working for overseas clients or employers. By 2026, global work trends are expected to further normalise remote employment.',
    heroImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop',
    pathways: [
      { id: 'pt-nomad', title: 'Portugal Digital Nomad', description: 'Residency for remote workers with a minimum monthly income of approx. EUR 3,280.', requirements: ['Foreign Income Proof', 'Health Insurance', 'Clean Record'] },
      { id: 'es-nomad', title: 'Spain Digital Nomad', description: 'Permit for freelancers and remote employees with university degrees or professional experience.', requirements: ['EUR 2,520+ Monthly Income', 'Schengen Coverage', 'Remote Contract'] }
    ]
  }
];

export const countryGuides: CountryGuide[] = [
  { 
    id: 'uk', 
    countryId: 'uk', 
    slug: 'uk', 
    title: 'Study in UK 2025/2026', 
    content: 'The United Kingdom remains one of the world\'s premier destinations for higher education. For 2025-2026, the Home Office has increased financial maintenance requirements: £1,529/mo in London and £1,171/mo outside London. Most Bachelor\'s take 3 years and Master\'s take 1 year. From 2027, the Graduate Route will be reduced to 18 months for non-PhD graduates. Official tests like Oxford ELLT and LanguageCert are widely accepted for CAS issuance in 2025.', 
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', 
    costOfLiving: '£1,171 - £1,529/mo', 
    visaRequirements: 'Student Visa (CAS & Financials)' 
  },
  { 
    id: 'australia', 
    countryId: 'au', 
    slug: 'australia', 
    title: 'Study in Australia 2026', 
    content: 'Australia is undergoing its biggest immigration transformation in a decade. The 2026 National Planning Level (NPL) sets caps on international commencements, making early applications (8-10 months) vital. The Genuine Student (GS) requirement has replaced GTE. You must demonstrate approximately AUD $30,000 for living expenses. High-demand sectors include Nursing, Green Energy, and Cybersecurity.', 
    heroImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200', 
    costOfLiving: 'AUD $2,500/mo', 
    visaRequirements: 'Subclass 500 (GS & Caps)' 
  },
  { 
    id: 'canada', 
    countryId: 'ca', 
    slug: 'canada', 
    title: 'Study in Canada 2026', 
    content: 'Canada has implemented a National Study Permit Cap. Most students now require a Provincial Attestation Letter (PAL). Financial requirements have increased to CAD $20,635/year for living expenses. PGWP eligibility is now linked to long-term shortage occupations for college grads. University graduates remain largely exempt from field-of-study restrictions.', 
    heroImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200', 
    costOfLiving: 'CAD $1,720/mo', 
    visaRequirements: 'Study Permit (PAL & GIC)' 
  },
  { 
    id: 'nz', 
    countryId: 'nz', 
    slug: 'new-zealand', 
    title: 'Study in New Zealand 2026', 
    content: 'New Zealand offers a world-class system where every university is in the top 3% globally. For 2026, financial maintenance is adjusted to NZD $20,000/year. The "Green List" provides fast-track residency for roles in Construction, Engineering, and ICT. Most Bachelor/Master grads get a 3-year Post-Study Work Visa.', 
    heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200', 
    costOfLiving: 'NZD $1,800/mo', 
    visaRequirements: 'Fee Paying Student Visa' 
  },
  { 
    id: 'usa', 
    countryId: 'us', 
    slug: 'usa', 
    title: 'Study in USA 2026', 
    content: 'The USA remains the global epicenter for STEM research. For 2026, digital I-20s are the standard. STEM OPT provides a 3-year work advantage (12 months + 24 month extension). High-growth fields include AI, Data Science, and Healthcare Admin. The Community College 2+2 pathway remains a popular way to save 50% on tuition.', 
    heroImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200', 
    costOfLiving: '$1,500 - $2,500/mo', 
    visaRequirements: 'F-1 Visa (SEVIS & I-20)' 
  },
  { 
    id: 'ireland', 
    countryId: 'ie', 
    slug: 'ireland', 
    title: 'Study in Ireland 2026', 
    content: 'Ireland is the only English-speaking country in the Eurozone. Dublin is a European tech hub for 1,000+ multinationals. Stamp 2 visa requires €12,000/year in financial proof. Graduates (Level 9) get a 2-year Stamp 1G stay-back visa. Critical skills include Pharmaceutical Science and Fintech.', 
    heroImage: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=1200', 
    costOfLiving: '€1,000 - €1,200/mo', 
    visaRequirements: 'Stamp 2 (AVATS & Insurance)' 
  },
  { 
    id: 'cyprus', 
    countryId: 'cy', 
    slug: 'cyprus', 
    title: 'Study in Cyprus 2026', 
    content: 'Cyprus is a booming Mediterranean hub offering European degrees at lower costs. For 2026, proof of roughly €8,000 for living expenses is required. Limassol is a major global shipping hub. Students can work 20 hours/week. Access to Erasmus+ allows for semesters in other EU nations.', 
    heroImage: 'https://images.unsplash.com/photo-1589146522366-06103e33917d?w=1200', 
    costOfLiving: '€600 - €900/mo', 
    visaRequirements: 'Temporary Residence (Pink Slip)' 
  },
  { 
    id: 'germany', 
    countryId: 'de', 
    slug: 'germany', 
    title: 'Study in Germany 2026', 
    content: 'Germany is the land of tuition-free public excellence. For 2026, the Blocked Account (Sperrkonto) requirement is approx. €11,904. Graduates get an 18-month job seeker visa. High demand in IT, Nursing, and Renewable Energy. Getting to B1 German level is highly recommended for career integration.', 
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', 
    costOfLiving: '€900/mo', 
    visaRequirements: 'Blocked Account & APS' 
  },
  { 
    id: 'italy', 
    countryId: 'it', 
    slug: 'italy', 
    title: 'Study in Italy 2026', 
    content: 'Public universities in Italy use income-based tuition (ISEE), often €500 - €3,000/year. The Universitaly portal is the digital gateway for 2026. DSU regional scholarships can cover tuition and living costs. Graduates can apply for a 12-month job seeking residency.', 
    heroImage: 'https://images.unsplash.com/photo-1529260839382-3eff517bac74?w=1200', 
    costOfLiving: '€600 - €900/mo', 
    visaRequirements: 'D-Type Visa (Universitaly)' 
  },
  { 
    id: 'sweden', 
    countryId: 'se', 
    slug: 'sweden', 
    title: 'Study in Sweden 2026', 
    content: 'Sweden is a global hub for Green Tech and innovation (Spotify, Volvo). For 2026, SEK 10,500 - 11,000/month is required for residence permits. Deadlines are early (mid-January for August intake). Graduates get a 12-month stay-back for job hunting.', 
    heroImage: 'https://images.unsplash.com/photo-1509356843151-3e7d96241e11?w=1200', 
    costOfLiving: 'SEK 11,000/mo', 
    visaRequirements: 'Residence Permit (SEK Proof)' 
  },
  { 
    id: 'finland', 
    countryId: 'fi', 
    slug: 'finland', 
    title: 'Study in Finland 2026', 
    content: 'Finland has perfect its "one permit for entire degree" system for 2026. Living cost proof is approx. €800 - €900/mo. International students can work 30 hours/week. Graduates get a 2-year post-study residence permit, one of the longest in Europe.', 
    heroImage: 'https://images.unsplash.com/photo-1473951574080-01fe45ec8643?w=1200', 
    costOfLiving: '€850/mo', 
    visaRequirements: 'A-Permit (Continuous)' 
  },
  { 
    id: 'dubai', 
    countryId: 'ae', 
    slug: 'dubai', 
    title: 'Study in Dubai 2026', 
    content: 'Dubai has officially transitioned to a Knowledge Economy. Branch campuses of UK/AU/US universities provide the same degree tax-free. Outstanding students can qualify for the 10-Year Golden Visa. No personal income tax makes part-time work very attractive.', 
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5eaad0ff3b0d?w=1200', 
    costOfLiving: 'AED 3,000 - 4,500/mo', 
    visaRequirements: 'Student Visa (University Sponsored)' 
  },
  { 
    id: 'malaysia', 
    countryId: 'my', 
    slug: 'malaysia', 
    title: 'Study in Malaysia 2026', 
    content: 'Malaysia is a Top-10 global hub offering Twinning (3+0) programs with UK/AU universities at 70% lower cost. The EMGS e-VAL system is fully digital for 2026. High demand sectors: Semiconductor Engineering and Islamic Finance.', 
    heroImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a594?w=1200', 
    costOfLiving: 'USD $400/mo', 
    visaRequirements: 'Student Pass (EMGS e-VAL)' 
  },
  { 
    id: 'turkey', 
    countryId: 'tr', 
    slug: 'turkey', 
    title: 'Study in Turkey 2026', 
    content: 'Turkey is a Bologna Process member; its degrees are recognised across Europe. Financial proof for 2026 is approx. USD $5,000 - $7,000. Turkiye Bursları offers 100% scholarships for high achievers. Istanbul is a massive hub for e-commerce and international relations.', 
    heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200', 
    costOfLiving: 'USD $350/mo', 
    visaRequirements: 'Student Visa & Ikamet' 
  },
  { 
    id: 'europe', 
    countryId: 'eu', 
    slug: 'europe', 
    title: 'Study in Europe 2026 (Hidden Gems)', 
    content: 'Discover Poland, Hungary, Spain, and France. Poland and Hungary offer world-famous medical programs at 40% lower rent. France offers prestigious Grande Écoles. ETIAS and digital Schengen visas are streamlining mobility for 2026. Proof of funds averages €10,000/year.', 
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200', 
    costOfLiving: '€600 - €1,100/mo', 
    visaRequirements: 'Schengen Student Visa' 
  }
];

export const lmsCourses: LMSCourse[] = [
  { id: 'pte-mastery', title: 'PTE Academic Mastery', description: 'Complete prep for Pearson Test of English.', thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800', category: 'PTE', duration: '20 Hours', instructor: 'Dr. Jane Smith', price: 99, status: 'Paid' },
  { id: 'ielts-bootcamp', title: 'IELTS Band 8 Bootcamp', description: 'Intensive prep for Higher Band IELTS scores.', thumbnail: 'https://images.unsplash.com/photo-1544391496-1ca7c97457cd?w=800', category: 'IELTS', duration: '35 Hours', instructor: 'Prof. Mark Wood', price: 149, status: 'Paid' }
];
export const lmsModules: LMSModule[] = [];
export const lmsTests: LMSPracticeTest[] = [];
export const initialEnrollments: Enrollment[] = [];
export const courseVouchers: CourseVoucher[] = [];
export const universityBySlug = (slug: string): University | null => {
  return universities.find(u => u.slug === slug) || null;
};
