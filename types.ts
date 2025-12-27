export type UserRole = 'Admin' | 'Agent' | 'Customer' | 'Trainer' | 'Finance' | 'Teller';
export type FormType = 'student-apply' | 'agent-reg' | 'prep-center-reg' | 'institute-connect' | 'careers' | 'general' | 'immigration-consult';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tier?: number;
  verified?: boolean;
}

export interface University {
  id: string;
  name: string;
  logo: string;
  location: string;
  ranking: number;
  description: string;
  slug: string;
  countryId: string;
  website: string;
}

export interface Course {
  id: string;
  universityId: string;
  degree: 'Undergraduate' | 'Postgraduate';
  title: string;
  duration: string;
  tuitionFee: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  type: 'Voucher' | 'Course';
  basePrice: number;
  currency: string;
  description: string;
  icon: string;
  supportsFullRegistration?: boolean;
  priceTiers?: { minQuantity: number; discountPercentage: number }[];
  lmsCourseId?: string;
}

export type VoucherStatus = 'Available' | 'Used' | 'Expired';

export interface VoucherCode {
  id: string;
  productId: string;
  code: string;
  status: VoucherStatus;
  expiryDate: string;
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
  status: 'Pending' | 'Completed' | 'Cancelled';
  paymentMethod: 'Gateway' | 'BankTransfer';
  timestamp: string;
  voucherCodes: string[];
  paymentId?: string;
  bankRef?: string;
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
  threatLevel: string;
}

export interface SkillScore {
  skill: string;
  score: number;
  total: number;
  isGraded: boolean;
  band?: string;
  feedback?: string;
}

export interface TestResult {
  id: string;
  userId: string;
  testId: string;
  testTitle: string;
  skillScores: SkillScore[];
  overallBand?: string;
  timeTaken: number;
  timestamp: string;
  status: string;
  reviews: any[];
}

export interface ManualSubmission {
  id: string;
  testResultId: string;
  userId: string;
  userName: string;
  userEmail: string;
  testTitle: string;
  skill: string;
  questionId: string;
  studentAnswer: string;
  maxScore: number;
  timestamp: string;
  gradedBy?: string;
  score?: number;
  feedback?: string;
}

export interface LeadSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  targetCountry: string;
  preferredCourse: string;
  status: string;
  timestamp: string;
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
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  highestQualification: string;
  workExperience: string;
  qualificationId: string;
  qualificationTitle: string;
  status: string;
  timestamp: string;
  trackingId: string;
}

export interface TestBooking {
  id: string;
  productId: string;
  productName: string;
  studentName: string;
  studentEmail: string;
  preferredDate: string;
  testCenter: string;
  serviceType: string;
  trackingRef: string;
}

export interface FinanceReport {
  totalRevenue: number;
  totalVouchersSold: number;
  salesByType: { name: string; value: number }[];
  recentSales: Order[];
}

export interface LMSLesson {
  id: string;
  title: string;
  type: 'Video' | 'Text' | 'Quiz';
  content: string;
}

export interface LMSModule {
  id: string;
  courseId: string;
  title: string;
  lessons: LMSLesson[];
}

export interface LMSCourse {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  duration: string;
  instructor: string;
  price: number;
  status: 'Free' | 'Paid';
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  progress: number;
}

export interface CourseVoucher {
  id: string;
  code: string;
  courseId: string;
  isRedeemed: boolean;
}

export interface LMSTestQuestion {
  id: string;
  text: string;
  type: 'MCQ' | 'Essay' | 'Audio-Record';
  skill: string;
  options?: string[];
  correctOption?: number;
  audioUrl?: string;
  maxScore: number;
}

export interface LMSTestSection {
  id: string;
  skill: string;
  title: string;
  timeLimit: number;
  questions: LMSTestQuestion[];
}

export interface LMSPracticeTest {
  id: string;
  title: string;
  sections: LMSTestSection[];
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

export interface ImmigrationPathway {
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
  pathways: ImmigrationPathway[];
}

export interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  authRequired: boolean;
  params?: string[];
  response: string;
}

export type SkillType = string;
export type LeadStatus = string;
export type PromoCode = string;
export type QuestionReview = string;

export type ViewState = 
  | { type: 'home' }
  | { type: 'store' } 
  | { type: 'admin' }
  | { type: 'agent' }
  | { type: 'login' }
  | { type: 'signup' }
  | { type: 'about' }
  | { type: 'resources' }
  | { type: 'library' }
  | { type: 'careers' }
  | { type: 'guide' }
  | { type: 'apply'; formType: FormType; context?: string }
  | { type: 'join-hub' }
  | { type: 'country-list' }
  | { type: 'country-guide'; slug: string }
  | { type: 'immigration-guide'; slug: string }
  | { type: 'lms-dashboard' }
  | { type: 'course-catalogue' }
  | { type: 'qualifications' }
  | { type: 'policy'; policyId: string }
  | { type: 'verification-pending'; email: string }
  | { type: 'checkout'; productId: string; quantity: number }
  | { type: 'success'; orderId: string }
  | { type: 'lms-course-player'; courseId: string; initialLessonId?: string }
  | { type: 'lms-practice-test'; testId: string }
  | { type: 'university'; slug: string };