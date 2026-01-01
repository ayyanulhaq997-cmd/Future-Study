
export type UserRole = 
  | 'System Admin/Owner' 
  | 'Finance/Audit Team' 
  | 'Operation Manager' 
  | 'Lead Trainer' 
  | 'Support/Sales Node' 
  | 'Agent Partner/Prep Center' 
  | 'Student';

export type FormType = 'student-apply' | 'agent-reg' | 'prep-center-reg' | 'institute-connect' | 'careers' | 'general' | 'immigration-consult';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tier?: number;
  verified?: boolean;
  isAuthorized?: boolean;
  canBypassQuota?: boolean;
  status: 'Active' | 'Pending' | 'Suspended';
  agreementDate?: string; // Record-keeping for agents
  isFlagged?: boolean; // For security observation
}

export interface Lead {
  id: string;
  type: 'student' | 'agent' | 'career' | 'general';
  data: Record<string, string>;
  status: 'New' | 'Contacted' | 'Processed' | 'Approved' | 'Rejected';
  timestamp: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  type: 'Voucher' | 'Course';
  basePrice: number;
  currency: 'USD' | 'GBP' | 'INR' | 'PKR';
  pricingModel: 'Global' | 'Country-Wise';
  description: string;
  icon: string;
}

export type VoucherStatus = 'Available' | 'Used' | 'Expired';

export interface VoucherCode {
  id: string;
  productId: string;
  code: string;
  status: VoucherStatus;
  expiryDate: string;
  uploadDate: string;
  orderId?: string;
  buyerName?: string;
  salesExecutiveName?: string;
  assignmentDate?: string;
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  currency: string;
  customerEmail: string;
  buyerName: string;
  status: 'Pending' | 'Completed' | 'Cancelled' | 'Security-Stop';
  paymentMethod: 'Gateway' | 'BankTransfer';
  timestamp: string;
  voucherCodes: string[];
  bankRef: string;
  proofAttached: boolean;
}

export interface SecurityStatus {
  isGlobalOrderStop: boolean;
  threatLevel: 'Normal' | 'Observed' | 'Critical';
  lastAudit: string;
}

export type ViewState = 
  | { type: 'home' }
  | { type: 'store' } 
  | { type: 'admin' }
  | { type: 'finance' }
  | { type: 'agent' }
  | { type: 'sales-node' }
  | { type: 'trainer' }
  | { type: 'support-portal' }
  | { type: 'login' }
  | { type: 'signup' }
  | { type: 'forgot-password' }
  | { type: 'about' }
  | { type: 'resources' }
  | { type: 'apply'; formType: FormType; context?: string }
  | { type: 'country-list' }
  | { type: 'country-guide'; slug: string }
  | { type: 'lms-dashboard'; initialTab?: string }
  | { type: 'lms-course-player'; courseId: string; initialLessonId?: string }
  | { type: 'lms-practice-test'; testId: string }
  | { type: 'course-catalogue' }
  | { type: 'qualifications' }
  | { type: 'join-hub' }
  | { type: 'checkout'; productId: string; quantity: number }
  | { type: 'success'; orderId: string }
  | { type: 'university'; slug: string }
  | { type: 'policy'; policyId: string };

export interface University {
  id: string;
  name: string;
  slug: string;
  location: string;
  ranking: number;
  description: string;
  logo: string;
  countryId: string;
  website: string;
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

export interface Course {
  id: string;
  universityId: string;
  title: string;
  degree: string;
  duration: string;
  tuitionFee: string;
  description?: string;
}

export interface Qualification {
  id: string;
  title: string;
  qualificationBody: string;
  level: string;
  duration: string;
  tuitionFees: string;
  description: string;
  image: string;
  requirements: string[];
}

export interface LMSCourse {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  description: string;
  duration: string;
  instructor: string;
  price: number;
}

export interface LMSLesson {
  id: string;
  title: string;
  type: 'Video' | 'Text' | 'Quiz';
  content: string;
}

export interface LMSModule {
  id: string;
  title: string;
  lessons: LMSLesson[];
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
}

export interface TestResult {
  id: string;
  userId: string;
  testId: string;
  testTitle: string;
  skillScores: any[];
  overallBand: string;
  timeTaken: number;
  timestamp: string;
}

/**
 * Added LMSTestQuestion to resolve import error in components/LMSPracticeTest.tsx
 */
export interface LMSTestQuestion {
  id: string;
  text: string;
  type: 'MCQ' | 'Essay' | 'Audio-Record';
  skill: 'Listening' | 'Reading' | 'Writing' | 'Speaking';
  options?: string[];
  audioUrl?: string;
}

/**
 * Added LMSTestSection for structured testing metadata
 */
export interface LMSTestSection {
  id: string;
  title: string;
  skill: string;
  timeLimit: number;
  questions: LMSTestQuestion[];
}

/**
 * Updated LMSPracticeTest to use typed sections
 */
export interface LMSPracticeTest {
  id: string;
  title: string;
  sections: LMSTestSection[];
}

export interface ManualSubmission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  testTitle: string;
  skill: string;
  questionText: string;
  studentAnswer: string;
  maxScore: number;
  timestamp: string;
}

export interface FinanceReport {
  totalRevenue: number;
  totalVouchersSold: number;
  salesByType: { name: string; value: number }[];
  recentSales: Order[];
}

export interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  authRequired: boolean;
  params?: string[];
  response: string;
}

export interface QualificationLead {
  id: string;
  qualificationId: string;
  qualificationTitle: string;
  timestamp: string;
}

export interface TestBooking {
  id: string;
  trackingRef: string;
}

export interface ImmigrationGuideData {
  id: string;
  slug: string;
  title: string;
  content: string;
  heroImage: string;
  pathways: any[];
}
