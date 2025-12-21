
import { Product, VoucherCode, User, University, Course, CountryGuide, LMSCourse, LMSModule, LMSPracticeTest, Enrollment, CourseVoucher, Qualification, ImmigrationGuideData } from '../types';

export const users: User[] = [
  { id: 'u-admin', name: 'System Admin', email: 'admin@nexus.ai', role: 'Admin' },
  { id: 'u-trainer', name: 'Lead IELTS Trainer', email: 'trainer@nexus.ai', role: 'Trainer' },
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
  },
  {
    id: 'p-toefl',
    name: 'TOEFL iBT',
    category: 'TOEFL',
    type: 'Voucher',
    basePrice: 205,
    currency: 'USD',
    description: 'Standardized test for English proficiency.',
    icon: '🏫',
    supportsFullRegistration: true,
    priceTiers: []
  },
  {
    id: 'p-course-1',
    name: 'PTE Core Mastery Course',
    category: 'PTE',
    type: 'Course',
    lmsCourseId: 'lms-1',
    basePrice: 149,
    currency: 'USD',
    description: 'The definitive online training for PTE Academic success.',
    icon: '🎓',
    priceTiers: []
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

export const voucherCodes: VoucherCode[] = [
  { id: 'v1', productId: 'p-pte', code: 'PTE-ABC-123', status: 'Available', expiryDate: '2025-12-31' },
];

export const universities: University[] = [
  {
    id: 'uni1',
    name: 'University of Oxford',
    slug: 'oxford',
    location: 'United Kingdom',
    countryId: 'uk',
    description: 'A world-leading centre of learning and a dream destination for researchers.',
    logo: 'https://images.unsplash.com/photo-1590403323719-2f22b82e2f3d?w=128&h=128&fit=crop',
    ranking: 1,
    website: 'https://www.ox.ac.uk'
  },
  {
    id: 'uni2',
    name: 'Monash University',
    slug: 'monash',
    location: 'Melbourne, Australia',
    countryId: 'au',
    description: 'Monash is a modern, global, research-intensive university.',
    logo: 'https://images.unsplash.com/photo-1525921429624-479b6a29d840?w=128&h=128&fit=crop',
    ranking: 57,
    website: 'https://www.monash.edu'
  }
];

export const immigrationGuides: ImmigrationGuideData[] = [
  {
    id: 'i1', countryId: 'uk', slug: 'uk', title: 'Immigrate to UK',
    content: 'The UK Skilled Worker and Spouse visa routes provide clear pathways to settlement.',
    heroImage: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=1200&auto=format&fit=crop',
    pathways: [
      { id: 'p1', title: 'Skilled Worker Visa', description: 'Requires a job offer from a licensed sponsor.', requirements: ['Job Offer', 'Salary Threshold', 'B1 English'] },
      { id: 'p2', title: 'Family/Spouse Visa', description: 'Settlement through family connection.', requirements: ['Relationship Proof', 'Financial Requirement'] }
    ]
  },
  {
    id: 'i2', countryId: 'ca', slug: 'canada', title: 'Canada PR Pathways',
    content: 'Express Entry and PNP routes for high-skilled professionals looking to move to Canada.',
    heroImage: 'https://images.unsplash.com/photo-1519832758034-f7b71780dec7?w=1200&auto=format&fit=crop',
    pathways: [
      { id: 'p3', title: 'Express Entry', description: 'Points based system for federal PR.', requirements: ['IELTS/PTE', 'ECA Report', 'Work Experience'] }
    ]
  }
];

export const universityBySlug = (slug: string) => universities.find(u => u.slug === slug) || null;

export const courses: Course[] = [
  { id: 'c1', title: 'MSc Computer Science', degree: 'Postgraduate', duration: '1 Year', tuitionFee: '£32,000', universityId: 'uni1' },
  { id: 'c2', title: 'Bachelor of IT', degree: 'Undergraduate', duration: '3 Years', tuitionFee: 'A$45,000', universityId: 'uni2' }
];

export const countryGuides: CountryGuide[] = [
  {
    id: 'g1', countryId: 'uk', slug: 'uk', title: 'Study in the UK',
    content: 'The UK offers world-class education with historic universities and a diverse student community.',
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&auto=format&fit=crop',
    costOfLiving: '£12,000 - £15,000 /yr', visaRequirements: 'Student Visa (Tier 4) required.'
  },
  {
    id: 'g2', countryId: 'au', slug: 'australia', title: 'Study in Australia',
    content: 'Australia is a leading destination for international students with high-quality education and a relaxed lifestyle.',
    heroImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200&auto=format&fit=crop',
    costOfLiving: 'A$21,000 - A$25,000 /yr', visaRequirements: 'Subclass 500 Visa required.'
  },
  {
    id: 'g3', countryId: 'us', slug: 'usa', title: 'Study in the USA',
    content: 'Home to some of the worlds most prestigious universities, the US offers unparalleled research opportunities.',
    heroImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&auto=format&fit=crop',
    costOfLiving: '$15,000 - $25,000 /yr', visaRequirements: 'F-1 Student Visa required.'
  },
  {
    id: 'g4', countryId: 'ca', slug: 'canada', title: 'Study in Canada',
    content: 'Canada is known for its welcoming atmosphere, affordable quality education, and multicultural environment.',
    heroImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&auto=format&fit=crop',
    costOfLiving: 'C$15,000 - C$20,000 /yr', visaRequirements: 'Study Permit required.'
  },
  {
    id: 'g5', countryId: 'nz', slug: 'new-zealand', title: 'Study in New Zealand',
    content: 'High-quality education in a stunning natural environment with excellent post-study work rights.',
    heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop',
    costOfLiving: 'NZ$15,000 - NZ$18,000 /yr', visaRequirements: 'Fee-paying Student Visa.'
  },
  {
    id: 'g6', countryId: 'se', slug: 'sweden', title: 'Study in Sweden',
    content: 'Innovation, sustainability, and high-quality education system in the heart of Scandinavia.',
    heroImage: 'https://images.unsplash.com/photo-1509339022327-1e1e25360a41?w=1200&auto=format&fit=crop',
    costOfLiving: 'SEK 90,000 /yr', visaRequirements: 'Residence Permit for Studies.'
  },
  {
    id: 'g7', countryId: 'fi', slug: 'finland', title: 'Study in Finland',
    content: 'The happiest country in the world offers a unique education system focused on research and equality.',
    heroImage: 'https://images.unsplash.com/photo-1529906920574-628dc1e49f9a?w=1200&auto=format&fit=crop',
    costOfLiving: '€8,000 - €12,000 /yr', visaRequirements: 'Residence Permit (Education).'
  },
  {
    id: 'g8', countryId: 'de', slug: 'germany', title: 'Study in Germany',
    content: 'Tuition-free public universities and a powerhouse for engineering and technology.',
    heroImage: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&auto=format&fit=crop',
    costOfLiving: '€11,000 /yr', visaRequirements: 'National Visa for Studies.'
  },
  {
    id: 'g9', countryId: 'it', slug: 'italy', title: 'Study in Italy',
    content: 'Rich cultural heritage combined with academic excellence in design, fashion, and history.',
    heroImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200&auto=format&fit=crop',
    costOfLiving: '€9,000 - €15,000 /yr', visaRequirements: 'Study Visa (Type D).'
  },
  {
    id: 'g10', countryId: 'ie', slug: 'ireland', title: 'Study in Ireland',
    content: 'Friendly, English-speaking hub for global tech and pharmaceuticals.',
    heroImage: 'https://images.unsplash.com/photo-1549918838-316a78bb456c?w=1200&auto=format&fit=crop',
    costOfLiving: '€10,000 - €15,000 /yr', visaRequirements: 'Student Visa (C or D).'
  },
  {
    id: 'g11', countryId: 'cy', slug: 'cyprus', title: 'Study in Cyprus',
    content: 'Modern education system with a Mediterranean lifestyle and strategic gateway to Europe.',
    heroImage: 'https://images.unsplash.com/photo-1473210113314-8acc60524b12?w=1200&auto=format&fit=crop',
    costOfLiving: '€7,000 - €10,000 /yr', visaRequirements: 'Student Permit required.'
  }
];

export const lmsCourses: LMSCourse[] = [
  {
    id: 'lms-1',
    title: 'PTE Core Mastery: The Complete Guide',
    description: 'Master every section of the PTE Academic with real simulated exams.',
    category: 'PTE',
    price: 149,
    duration: '12 Hours',
    status: 'Paid',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop',
    instructor: 'Dr. Sarah Jenkins'
  }
];

export const lmsModules: LMSModule[] = [
  {
    id: 'mod-1',
    courseId: 'lms-1',
    title: 'Part 1: Speaking & Writing',
    order: 1,
    lessons: [
      { id: 'les-1', moduleId: 'mod-1', title: 'Personal Introduction Strategy', type: 'Video', skill: 'Speaking', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '10m', order: 1 },
      { id: 'les-2', moduleId: 'mod-1', title: 'Summarize Written Text: Essay Structure', type: 'Text', skill: 'Writing', content: '### Advanced Essay Techniques\nUse formal vocabulary and complex structures...', duration: '20m', order: 2 }
    ]
  }
];

export const lmsTests: LMSPracticeTest[] = [
  {
    id: 'full-mock-1',
    courseId: 'lms-1',
    title: 'PTE Academic Full Length Mock #1',
    category: 'PTE',
    totalTimeLimit: 120,
    sections: []
  }
];

export const initialEnrollments: Enrollment[] = [
  { id: 'enr-1', userId: 'u-student', courseId: 'lms-1', enrolledAt: '2024-03-01T10:00:00Z', progress: 45 },
];

export const courseVouchers: CourseVoucher[] = [];
