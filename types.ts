
export type UserRole = 
  | 'System Admin/Owner'
  | 'Operation Manager'
  | 'Finance Manager'
  | 'Academic Manager'
  | 'Sales Manager'
  | 'Sales Agent'
  | 'Agent'
  | 'Academic Institute'
  | 'Teacher'
  | 'Student'
  // Legacy mappings for compatibility
  | 'Finance' | 'Support' | 'Trainer' | 'Sales' | 'Institute';

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
  status: 'Active' | 'Pending' | 'Hold' | 'Rejected' | 'Frozen'; 
  agreementDate?: string; 
  isFlagged?: boolean; 
  country?: string;
}

export interface Lead {
  id: string;
  type: 'student' | 'agent' | 'institute' | 'general';
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
  stockCount?: number; 
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
  assignmentDate?: string;
}

export type OrderStatus = 'Pending' | 'Approved' | 'Hold' | 'Rejected' | 'RefundRequested' | 'Refunded';

export interface Order {
  id: string; 
  date: string; 
  time: string; 
  buyerName: string; 
  bankLastFour: string; 
  productName: string; 
  quantity: number; 
  totalAmount: number; 
  currency: string;
  bankRef: string; 
  proofAttached: boolean; 
  userId: string;
  productId: string;
  customerEmail: string;
  status: OrderStatus;
  paymentMethod: 'Gateway' | 'BankTransfer';
  timestamp: string;
  voucherCodes: string[];
  supportAgentName?: string; 
  deliveryTime?: string; 
}

export type ViewState = 
  | { type: 'home' }
  | { type: 'store' } 
  | { type: 'agent' }
  | { type: 'institute' }
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
  | { type: 'policy'; policyId: string }
  | { type: 'system-map' }
  | { type: 'user-guide' }
  | { type: 'handover' }
  | { type: 'verification'; email: string };

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

export interface BusinessMetrics {
  todaySales: number;
  monthRevenue: number;
  vouchersInStock: number;
  activeAgents: number;
  riskAlerts: number;
  refundRequests: number;
  systemHealth: 'Optimal' | 'Degraded' | 'Critical';
  systemHalt: boolean;
}

export interface Qualification {
  id: string;
  title: string;
  qualificationBody: string;
  level: string;
  tuitionFees: string;
  description: string;
  duration: string;
  image: string;
  requirements: string[];
}

export interface QualificationLead {
  id: string;
  timestamp: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  highestQualification: string;
  workExperience: string;
  qualificationId: string;
  qualificationTitle: string;
}

export interface TestBooking {
  id: string;
  timestamp: string;
  productId: string;
  productName: string;
  studentName: string;
  studentEmail: string;
  preferredDate: string;
  testCenter: string;
  serviceType: string;
}

export interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  authRequired: boolean;
  params?: string[];
  response: string;
}

// Added to fix compilation error: Module '"../types"' has no exported member 'University'.
export interface University {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  logo: string;
  ranking: number;
  countryId: string;
  website?: string;
}

// Added to fix compilation error: Module '"../types"' has no exported member 'CountryGuide'.
export interface CountryGuide {
  id: string;
  countryId: string;
  slug: string;
  title: string;
  heroImage: string;
  costOfLiving: string;
  visaRequirements: string;
  content: string;
}

// Added to fix compilation error: Module '"../types"' has no exported member 'Course'.
export interface Course {
  id: string;
  universityId: string;
  title: string;
  degree: string;
  duration: string;
  tuitionFee: string;
  description: string;
}

// Added to fix compilation error: Module '"../types"' has no exported member 'LMSTestQuestion'.
export interface LMSTestQuestion {
  id: string;
  skill: string;
  type: string;
  text: string;
  options?: string[];
  image?: string;
  wordLimit?: number;
  targetSentence?: string;
}

// Added to fix compilation error: Module '"../types"' has no exported member 'LMSTestSection'.
export interface LMSTestSection {
  id: string;
  title: string;
  skill: string;
  timeLimit: number;
  passageText?: string;
  audioUrl?: string;
  questions: LMSTestQuestion[];
}

// Added to fix compilation error: Module '"../types"' has no exported member 'LMSPracticeTest'.
export interface LMSPracticeTest {
  id: string;
  title: string;
  sections: LMSTestSection[];
}

// Added to fix compilation error: Module '"../types"' has no exported member 'ManualSubmission'.
export interface ManualSubmission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  testId: string;
  testTitle: string;
  skill: string;
  questionText: string;
  studentAnswer: string;
  timestamp: string;
  maxScore: number;
  status: 'Pending' | 'Graded';
}

// Added to fix compilation error: Module '"../types"' has no exported member 'TestResult'.
export interface TestResult {
  id: string;
  userId: string;
  testId: string;
  testTitle: string;
  overallBand: string;
  skillScores: { skill: string; score: string }[];
  timeTaken: number;
  timestamp: string;
}

// Added to fix compilation error: Module '"../types"' has no exported member 'LMSLesson'.
export interface LMSLesson {
  id: string;
  title: string;
  type: 'Video' | 'Text' | 'Quiz' | string;
  content: string;
}

// Added to fix compilation error: Module '"../types"' has no exported member 'LMSModule'.
export interface LMSModule {
  id: string;
  title: string;
  lessons: LMSLesson[];
}

// Added to fix compilation error: Module '"../types"' has no exported member 'Enrollment'.
export interface Enrollment {
  courseId: string;
  userId: string;
  progress: number;
}

// Supporting interface for ImmigrationGuideData
export interface ImmigrationPathway {
  id: string;
  title: string;
  description: string;
  requirements: string[];
}

// Added to fix compilation error: Module '"../types"' has no exported member 'ImmigrationGuideData'.
export interface ImmigrationGuideData {
  id: string;
  slug: string;
  title: string;
  heroImage: string;
  content: string;
  pathways: ImmigrationPathway[];
}
