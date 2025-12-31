
import { Product, VoucherCode, User, University, Course, CountryGuide, LMSCourse, LMSModule, LMSPracticeTest, Enrollment, CourseVoucher, Qualification, ImmigrationGuideData } from '../types';

export const users: User[] = [
  { id: 'u-admin', name: 'System Admin / Owner', email: 'admin@unicou.uk', role: 'Admin' },
  { id: 'u-finance', name: 'Finance / Audit Team', email: 'finance@unicou.uk', role: 'Finance' },
  { id: 'u-manager', name: 'Operations Manager', email: 'manager@unicou.uk', role: 'Manager' },
  { id: 'u-sales-exec', name: 'Global Sales Executive', email: 'sales@unicou.uk', role: 'Sales Executive' },
  { id: 'u-trainer', name: 'Academic Trainer', email: 'trainer@unicou.uk', role: 'Trainer' },
  { id: 'u-support', name: 'Support / Sales Node', email: 'support@unicou.uk', role: 'Support' },
  { id: 'u-agent', name: 'Agent Partner / Prep Center', email: 'partner@unicou.uk', role: 'Agent', tier: 2 },
  { id: 'u-student', name: 'Alex Smith (Student)', email: 'alex@gmail.com', role: 'Customer' },
];

export const products: Product[] = [
  { id: 'v-1', name: 'IELTS Academic Voucher', category: 'IELTS', type: 'Voucher', basePrice: 149, currency: 'USD', description: 'Standard British Council/IDP Academic training voucher.', icon: '🌐' },
  { id: 'v-6', name: 'PTE Academic Voucher', category: 'PTE', type: 'Voucher', basePrice: 165, currency: 'USD', description: 'Pearson Test of English Academic standard voucher.', icon: '📊' },
  { id: 'v-19', name: 'TOEFL iBT Official', category: 'TOEFL', type: 'Voucher', basePrice: 195, currency: 'USD', description: 'ETS TOEFL iBT Official Global voucher.', icon: '🌎' },
  { id: 'v-20', name: 'Duolingo English Test', category: 'Duolingo', type: 'Voucher', basePrice: 60, currency: 'USD', description: 'Duolingo English Test Global Access.', icon: '🦉' }
];

export const voucherCodes: VoucherCode[] = products.flatMap(p => 
  Array(50).fill(0).map((_, i) => ({
    id: `vc-${p.id}-${i}`,
    productId: p.id,
    code: `${p.category.substring(0,2).toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    status: 'Available' as const,
    expiryDate: '2026-12-31',
    uploadDate: '2024-01-01T00:00:00Z'
  }))
);

export const countryGuides: CountryGuide[] = [
  { 
    id: 'uk', 
    countryId: 'uk', 
    slug: 'uk', 
    title: 'Study in United Kingdom', 
    content: `Premier destination for high-tier academic mobility.`,
    heroImage: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200', 
    costOfLiving: '£1,171 - £1,529/mo', 
    visaRequirements: 'Student Visa (eVisas Active)' 
  }
];

export const universities: University[] = [
  { id: 'uni-manchester', name: 'University of Manchester', slug: 'manchester', location: 'Manchester, UK', ranking: 32, description: 'Global research powerhouse.', logo: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=200', countryId: 'uk', website: 'https://www.manchester.ac.uk' }
];

export const courses: Course[] = [];
export const lmsCourses: LMSCourse[] = [];
export const lmsModules: LMSModule[] = [];
export const lmsTests: LMSPracticeTest[] = [];
export const qualifications: Qualification[] = [];
export const immigrationGuides: ImmigrationGuideData[] = [];
export const initialEnrollments: Enrollment[] = [];
export const courseVouchers: CourseVoucher[] = [];
export const universityBySlug = (slug: string): University | null => universities.find(u => u.slug === slug) || null;
