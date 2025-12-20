
import { Product, VoucherCode, User, University, Course, CountryGuide, LMSCourse, LMSModule, LMSPracticeTest, Enrollment, CourseVoucher, Qualification } from '../types';

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

export const universityBySlug = (slug: string) => universities.find(u => u.slug === slug) || null;

export const courses: Course[] = [
  { id: 'c1', title: 'MSc Computer Science', degree: 'Postgraduate', duration: '1 Year', tuitionFee: '£32,000', universityId: 'uni1' },
  { id: 'c2', title: 'Bachelor of IT', degree: 'Undergraduate', duration: '3 Years', tuitionFee: 'A$45,000', universityId: 'uni2' }
];

export const countryGuides: CountryGuide[] = [
  {
    id: 'g1',
    countryId: 'uk',
    slug: 'united-kingdom',
    title: 'Study in the United Kingdom',
    content: 'The UK is a world leader in education. With historic universities and a diverse student community, it offers unparalleled academic prestige.',
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=600&fit=crop',
    costOfLiving: '£12,000 - £15,000 per year',
    visaRequirements: 'Student Visa (formerly Tier 4) required with CAS.'
  },
  {
    id: 'g2',
    countryId: 'au',
    slug: 'australia',
    title: 'Study in Australia',
    content: 'Australia offers high-quality education, a relaxed lifestyle, and excellent post-study work opportunities for international students.',
    heroImage: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200&h=600&fit=crop',
    costOfLiving: 'A$21,000 - A$25,000 per year',
    visaRequirements: 'Student Visa (Subclass 500) required.'
  },
  {
    id: 'g3',
    countryId: 'ca',
    slug: 'canada',
    title: 'Study in Canada',
    content: 'Canada is known for its welcoming atmosphere, affordable quality education, and multicultural campus environments.',
    heroImage: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&h=600&fit=crop',
    costOfLiving: 'C$15,000 - C$20,000 per year',
    visaRequirements: 'Study Permit required.'
  },
  {
    id: 'g4',
    countryId: 'us',
    slug: 'usa',
    title: 'Study in the USA',
    content: 'The United States is home to some of the world’s most prestigious universities and is a global hub for innovation and research.',
    heroImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=600&fit=crop',
    costOfLiving: '$15,000 - $25,000 per year',
    visaRequirements: 'F-1 Student Visa required.'
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
  },
  {
    id: 'mod-2',
    courseId: 'lms-1',
    title: 'Part 2: Reading & Listening',
    order: 2,
    lessons: [
      { id: 'les-3', moduleId: 'mod-2', title: 'Reading: Multiple Choice Secrets', type: 'Video', skill: 'Reading', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '15m', order: 1 }
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
    sections: [
      {
        id: 'sec-reading',
        title: 'Section A: Reading',
        skill: 'Reading',
        timeLimit: 30,
        questions: [
          { id: 'q1', skill: 'Reading', text: 'What is the main topic of the passage?', type: 'MCQ', options: ['Climate Change', 'Global Economy', 'Technological Singularity', 'Modern Art'], correctAnswer: 0, explanation: 'The passage primarily focuses on atmospheric changes and their impact.' },
          { id: 'q2', skill: 'Reading', text: 'According to paragraph 2, why did the project fail?', type: 'MCQ', options: ['Lack of funding', 'Inclement weather', 'Lack of stakeholder interest'], correctAnswer: 2, explanation: 'Paragraph 2 specifically mentions the withdrawal of key investors due to disinterest.' }
        ]
      },
      {
        id: 'sec-writing',
        title: 'Section B: Writing',
        skill: 'Writing',
        timeLimit: 40,
        questions: [
          { id: 'q3', skill: 'Writing', text: 'Write an essay (200-300 words) on the following topic: "The impact of social media on modern communication."', type: 'Essay' }
        ]
      },
      {
        id: 'sec-listening',
        title: 'Section C: Listening',
        skill: 'Listening',
        timeLimit: 30,
        questions: [
          { id: 'q4', skill: 'Listening', text: 'Listen to the audio and select the correct summary.', type: 'MCQ', options: ['A description of local history.', 'A detailed scientific report on ocean life.', 'A personal anecdote about traveling.'], correctAnswer: 1, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }
        ]
      }
    ]
  }
];

export const initialEnrollments: Enrollment[] = [
  { id: 'enr-1', userId: 'u-student', courseId: 'lms-1', enrolledAt: '2024-03-01T10:00:00Z', progress: 45 },
];

export const courseVouchers: CourseVoucher[] = [];
