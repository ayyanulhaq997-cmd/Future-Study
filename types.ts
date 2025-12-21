
export type VoucherStatus = 'Available' | 'Sold' | 'Reserved';
export type UserRole = 'Admin' | 'Agent' | 'Customer' | 'Trainer' | 'Finance';
export type ProductType = 'Voucher' | 'Course' | 'Qualification' | 'Registration';
export type SkillType = 'Reading' | 'Listening' | 'Writing' | 'Speaking';
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Follow-up' | 'Converted' | 'Lost';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tier?: number;
  verified?: boolean;
}

export interface VisaPathway {
  id: string;
  title: string;
  description: string;
  requirements: string[];
}

export interface ImmigrationGuideData {
  id: string;
  countryId: string;
  slug: string;
  title: string;
  content: string;
  heroImage: string;
  pathways: VisaPathway[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tier?: number;
  verified?: boolean;
}

export interface PromoCode {
  code: string;
  discountPercentage: number;
  isActive: boolean;
  expiryDate: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  action: string;
  details: string;
  ip: string;
  country: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface SecurityStatus {
  uptime: string;
  rateLimitsTriggered: number;
  activeSessions: number;
  threatLevel: 'Low' | 'Elevated' | 'High';
}

export interface TestBooking {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  studentName: string;
  studentEmail: string;
  preferredDate: string;
  testCenter?: string;
  status: 'Pending' | 'Confirmed' | 'Rescheduled' | 'Cancelled';
  serviceType: 'Full-Registration' | 'Voucher-Only';
  timestamp: string;
  trackingRef: string;
}

export interface Qualification {
  id: string;
  title: string;
  duration: string;
  qualificationBody: string;
  tuitionFees: string;
  requirements: string[];
  description: string;
  level: string;
  image: string;
}

export interface QualificationLead {
  id: string;
  qualificationId: string;
  qualificationTitle: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  highestQualification: string;
  workExperience: string;
  timestamp: string;
  status: 'Pending' | 'In Review' | 'Counselor Assigned' | 'Enrolled' | 'Rejected';
  trackingId: string;
}

export type LessonType = 'Video' | 'Text' | 'Quiz' | 'Asset';

export interface LMSLesson {
  id: string;
  moduleId: string;
  title: string;
  type: LessonType;
  skill?: SkillType;
  content: string;
  duration: string;
  order: number;
}

export interface LMSModule {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: LMSLesson[];
}

export interface LMSCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  duration: string;
  status: 'Free' | 'Paid';
  thumbnail: string;
  instructor: string;
}

export interface LMSTestQuestion {
  id: string;
  skill: SkillType;
  text: string;
  type: 'MCQ' | 'Text-Input' | 'Audio-Record' | 'Essay';
  options?: string[];
  correctAnswer?: string | number;
  explanation?: string;
  audioUrl?: string;
}

export interface LMSTestSection {
  id: string;
  title: string;
  skill: SkillType;
  questions: LMSTestQuestion[];
  timeLimit: number;
}

export interface LMSPracticeTest {
  id: string;
  courseId: string;
  title: string;
  category: 'PTE' | 'IELTS' | 'Duolingo' | 'TOEFL';
  totalTimeLimit: number;
  sections: LMSTestSection[];
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  progress: number;
}

export interface SkillScore {
  skill: SkillType;
  score: number;
  total: number;
  isGraded: boolean;
  feedback?: string;
  band?: number | string;
}

export interface QuestionReview {
  questionId: string;
  studentAnswer: string | number;
  correctAnswer: string | number;
  isCorrect: boolean;
}

export interface TestResult {
  id: string;
  userId: string;
  testId: string;
  testTitle: string;
  skillScores: SkillScore[];
  overallBand?: string | number;
  timeTaken: number;
  timestamp: string;
  status: 'Draft' | 'Submitted' | 'Graded';
  reviews: QuestionReview[];
}

export interface ManualSubmission {
  id: string;
  testResultId: string;
  userId: string;
  userEmail: string;
  testTitle: string;
  skill: SkillType;
  questionId: string;
  studentAnswer: string;
  gradedBy?: string;
  score?: number;
  maxScore: number;
  feedback?: string;
  timestamp: string;
  isNotified?: boolean;
}

export interface CourseVoucher {
  id: string;
  code: string;
  courseId: string;
  status: VoucherStatus;
  expiryDate: string;
}

export interface VoucherCode {
  id: string;
  productId: string;
  code: string;
  status: VoucherStatus;
  expiryDate: string;
  customerId?: string;
  agentId?: string;
}

export interface PriceTier {
  minQuantity: number;
  discountPercentage: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'PTE' | 'IELTS' | 'Duolingo' | 'TOEFL' | 'LanguageCert' | 'Oxford ELLT' | 'Password';
  type: ProductType;
  lmsCourseId?: string;
  basePrice: number;
  currency: string;
  description: string;
  icon: string;
  priceTiers: PriceTier[];
  supportsFullRegistration?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  quantity: number;
  baseAmount: number;
  tierDiscount: number;
  promoDiscount: number;
  totalAmount: number;
  currency: string;
  customerEmail: string;
  status: 'Pending' | 'Completed' | 'Failed';
  timestamp: string;
  voucherCodes: string[];
  gatewayOrderId?: string;
  paymentId?: string;
  paymentSignature?: string;
}

export interface FinanceReport {
  totalRevenue: number;
  totalVouchersSold: number;
  salesByType: { name: string; value: number }[];
  recentSales: Order[];
}

export interface University {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  logo: string;
  ranking: number;
  website: string;
  countryId: string;
}

export interface Course {
  id: string;
  title: string;
  degree: string;
  duration: string;
  tuitionFee: string;
  universityId: string;
}

export interface CountryGuide {
  id: string;
  countryId: string;
  slug: string;
  title: string;
  content: string;
  heroImage: string;
  costOfLiving: string;
  visaRequirements: string;
}

export interface LeadSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  targetCountry: string;
  preferredCourse: string;
  status: LeadStatus;
  timestamp: string;
  notes?: string;
}

export interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  authRequired: boolean;
  params?: string[];
  response: string;
}

export type ViewState = 
  | { type: 'store' } 
  | { type: 'admin' }
  | { type: 'agent' }
  | { type: 'trainer' }
  | { type: 'finance' }
  | { type: 'customer' }
  | { type: 'login' }
  | { type: 'signup' }
  | { type: 'verification-pending'; email: string }
  | { type: 'checkout'; productId: string; quantity: number }
  | { type: 'book-test'; productId: string }
  | { type: 'success'; orderId: string }
  | { type: 'university'; slug: string }
  | { type: 'country-guide'; slug: string }
  | { type: 'immigration-guide'; slug: string }
  | { type: 'api-docs' }
  | { type: 'admin-guide' }
  | { type: 'lms-dashboard' }
  | { type: 'lms-course-player'; courseId: string; lessonId?: string }
  | { type: 'lms-practice-test'; testId: string }
  | { type: 'course-catalogue' }
  | { type: 'qualifications' }
  | { type: 'qualification-apply'; qualificationId: string }
  | { type: 'handover' };
