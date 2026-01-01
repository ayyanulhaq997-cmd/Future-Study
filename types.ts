
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
  isPlatinum?: boolean;
  isAuthorized?: boolean;
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
  // Audit fields
  orderId?: string;
  buyerName?: string;
  assignmentDate?: string;
  salesExecutiveName?: string;
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
  buyerName: string; // New: Audit requirement
  salesExecutiveName?: string; // New: Track processing staff/agent
  status: 'Pending' | 'Completed' | 'Cancelled' | 'On-Hold';
  paymentMethod: 'Gateway' | 'BankTransfer';
  timestamp: string;
  voucherCodes: string[];
  bankRef: string;
  proofAttached: boolean;
  baseAmount?: number;
  tierDiscount?: number;
  promoDiscount?: number;
  bankCharges?: number;
  paymentId?: string;
}

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

export interface Course {
  id: string;
  universityId: string;
  title: string;
  degree: 'Undergraduate' | 'Postgraduate';
  duration: string;
  tuitionFee: string;
  description?: string;
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

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details?: string;
}

export interface SecurityStatus {
  uptime: string;
  rateLimitsTriggered: number;
  activeSessions: number;
  threatLevel: 'Normal' | 'High' | 'Critical';
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

export type SkillType = 'Listening' | 'Reading' | 'Writing' | 'Speaking';

export interface SkillScore {
  skill: SkillType;
  score: number;
  total: number;
  band?: string;
  isGraded: boolean;
}

export interface TestResult {
  id: string;
  userId: string;
  testId: string;
  testTitle: string;
  skillScores: SkillScore[];
  overallBand: string;
  timeTaken: number;
  timestamp: string;
  status: 'Pending' | 'Completed';
  reviews: string[];
}

export interface CourseVoucher {
  id: string;
  code: string;
  courseId: string;
  status: 'Available' | 'Used';
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

export interface QualificationLead {
  id: string;
  qualificationId: string;
  qualificationTitle: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  highestQualification: string;
  workExperience: string;
  status: 'New' | 'Contacted' | 'Processed';
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

export interface ManualSubmission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  skill: SkillType;
  testTitle: string;
  questionText: string;
  studentAnswer: string;
  maxScore: number;
  timestamp: string;
}

export interface LeadSubmission {
  id: string;
  type: string;
  data: any;
  status: string;
  timestamp: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Processed' | 'Approved' | 'Rejected';

export interface PromoCode {
  code: string;
  discountType: 'Percentage' | 'Fixed';
  value: number;
}

export interface FinanceReport {
  totalRevenue: number;
  totalVouchersSold: number;
  salesByType: { name: string; value: number }[];
  recentSales: Order[];
}

export interface ImmigrationGuideData {
  id: string;
  slug: string;
  title: string;
  content: string;
  heroImage: string;
  pathways: {
    id: string;
    title: string;
    description: string;
    requirements: string[];
  }[];
}

export interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  authRequired: boolean;
  params?: string[];
  response: string;
}

export interface LMSTestQuestion {
  id: string;
  type: 'MCQ' | 'Essay' | 'Audio-Record';
  skill: SkillType;
  text: string;
  audioUrl?: string;
  options?: string[];
}

export interface LMSTestSection {
  id: string;
  title: string;
  skill: SkillType;
  timeLimit: number;
  questions: LMSTestQuestion[];
}

export interface LMSPracticeTest {
  id: string;
  title: string;
  sections: LMSTestSection[];
}

export type ViewState = 
  | { type: 'home' }
  | { type: 'store' } 
  | { type: 'admin' }
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
  | { type: 'university'; slug: string };
