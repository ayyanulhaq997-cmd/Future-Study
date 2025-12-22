
import * as db from './db';
import { 
  Product, VoucherCode, VoucherStatus, Order, User, ActivityLog, SecurityStatus, LMSCourse, 
  LMSModule, LMSLesson, Enrollment, TestResult, CourseVoucher, Qualification, 
  QualificationLead, TestBooking, ManualSubmission, SkillScore, SkillType, LeadSubmission, 
  LeadStatus, PromoCode, FinanceReport, QuestionReview, UserRole, ImmigrationGuideData 
} from '../types';

// ==========================================
// REAL PAYMENT GATEWAY CONFIGURATION
// ==========================================
// Replace 'rzp_test_...' with your actual Razorpay Key ID from the dashboard
const RAZORPAY_KEY_ID = 'rzp_test_NexusDemoKey123'; 
// ==========================================

let products = [...db.products];
let codes = [...db.voucherCodes];
let courseVouchers = [...db.courseVouchers];
let qualifications = [...db.qualifications];
let users = [...db.users];

let orders: Order[] = [];
let logs: ActivityLog[] = [];
let qualificationLeads: QualificationLead[] = [];
let testBookings: TestBooking[] = [];
let enrollments: Enrollment[] = [...db.initialEnrollments];
let testResults: TestResult[] = [];
let manualSubmissions: ManualSubmission[] = [];
let leadSubmissions: LeadSubmission[] = [];
let currentUser: User | null = null;

let rateLimitsTriggered = 0;

const sanitizeInput = (str: string): string => {
  return str.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "").replace(/on\w+="[^"]*"/gim, "").trim();
};

const networkDelay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 150 + 100));

const checkRole = (allowedRoles: UserRole[]) => {
  if (!currentUser) throw new Error('401 Unauthorized');
  if (!allowedRoles.includes(currentUser.role)) throw new Error(`403 Forbidden`);
};

export const api = {
  login: async (email: string) => {
    await networkDelay();
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('User node not found. Please sign up first.');
    currentUser = user;
    api.logActivity('Auth', `Identity connection established: ${user.email}`, 'info');
    return user;
  },
  signup: async (email: string, role: UserRole = 'Customer') => {
    await networkDelay();
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists in the Nexus registry.');
    }
    
    const newUser: User = { 
      id: 'u-' + Math.random().toString(36).substr(2, 9), 
      name: email.split('@')[0], 
      email, 
      role, 
      verified: false,
      tier: role === 'Agent' ? 1 : undefined 
    };
    users.push(newUser);
    return newUser;
  },
  verifyEmail: async (email: string) => {
    await networkDelay();
    const user = users.find(u => u.email === email);
    if (user) user.verified = true;
    return user;
  },
  logout: () => { currentUser = null; },
  getCurrentUser: () => currentUser,
  logActivity: async (action: string, details: string, severity: 'info' | 'warning' | 'critical' = 'info') => {
    const log: ActivityLog = { id: 'L-'+Math.random().toString(36).substr(2, 5), timestamp: new Date().toISOString(), userId: currentUser?.id || 'guest', userEmail: currentUser?.email || 'guest', action, details: sanitizeInput(details), ip: '10.0.0.1', country: 'Global', severity };
    logs.unshift(log);
    if (logs.length > 100) logs.pop();
  },
  getCodes: async () => { checkRole(['Admin', 'Finance']); return codes; },
  getStockCount: async (productId: string) => codes.filter(c => c.productId === productId && c.status === 'Available').length,
  importVouchers: async (productId: string, rawCodes: string[]) => {
    await networkDelay();
    checkRole(['Admin']);
    rawCodes.forEach(code => codes.push({ id: 'V-'+Math.random(), productId, code: sanitizeInput(code), status: 'Available', expiryDate: '2026-01-01' }));
    return { addedCount: rawCodes.length, duplicateCount: 0 };
  },
  calculatePrice: async (productId: string, quantity: number, promoCode?: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) throw new Error('Product not found');
    let total = product.basePrice * quantity;
    let disc = currentUser?.role === 'Agent' ? total * 0.04 : 0;
    return { baseAmount: total, tierDiscount: disc, promoDiscount: 0, totalAmount: total - disc };
  },
  
  createGatewayOrder: async (amount: number) => {
    await networkDelay();
    return { 
      id: 'order_' + Math.random().toString(36).substr(2, 12), 
      amount: Math.round(amount * 83 * 100), 
      currency: 'INR', 
      key: RAZORPAY_KEY_ID 
    };
  },

  processPayment: async (productId: string, quantity: number, email: string, paymentData: any, promoCode?: string) => {
    await networkDelay();
    const product = products.find(p => p.id === productId)!;
    const price = await api.calculatePrice(productId, quantity, promoCode);
    
    const order: Order = { 
      id: 'ORD-'+Math.random().toString(36).toUpperCase().substr(2, 5), 
      userId: currentUser?.id || 'guest', 
      productId, 
      productName: product.name, 
      quantity, 
      ...price, 
      currency: 'USD', 
      customerEmail: sanitizeInput(email), 
      status: 'Completed', 
      timestamp: new Date().toISOString(), 
      voucherCodes: ['NEXUS-'+Math.random().toString(36).toUpperCase().substr(0, 8)],
      paymentId: paymentData.paymentId
    };
    
    orders.push(order);
    if (product.lmsCourseId && currentUser) await api.enrollInCourse(product.lmsCourseId);
    api.logActivity('Fulfillment', `Order ${order.id} fulfilled for ${email}`, 'info');
    return order;
  },

  getFinanceReport: async () => {
    checkRole(['Admin', 'Finance']);
    return { 
      totalRevenue: orders.reduce((a, o) => a + o.totalAmount, 0), 
      totalVouchersSold: orders.reduce((a, o) => a + o.quantity, 0), 
      salesByType: [], 
      recentSales: orders.slice(-20) 
    } as FinanceReport;
  },
  submitLead: async (data: any) => { 
    await networkDelay(); 
    const lead = { ...data, id: 'L-'+Math.random(), status: 'New', timestamp: new Date().toISOString() };
    leadSubmissions.push(lead);
    return lead; 
  },
  getPendingSubmissions: async () => { checkRole(['Trainer', 'Admin']); return manualSubmissions.filter(s => !s.gradedBy); },
  gradeSubmission: async (id: string, score: number, fb: string) => {
    checkRole(['Trainer', 'Admin']);
    const s = manualSubmissions.find(x => x.id === id);
    if (s) { s.score = score; s.feedback = sanitizeInput(fb); s.gradedBy = currentUser?.name; }
  },
  getProducts: async () => products,
  getProductById: async (id: string) => products.find(p => p.id === id) || null,
  getOrders: async () => currentUser ? (['Admin', 'Finance'].includes(currentUser.role) ? orders : orders.filter(o => o.userId === currentUser?.id)) : [],
  getOrderById: async (id: string) => orders.find(x => x.id === id) || null,
  getLogs: async () => { checkRole(['Admin']); return logs; },
  getSecurityStatus: async () => ({ uptime: '334h', rateLimitsTriggered: 0, activeSessions: 42, threatLevel: 'Low' } as SecurityStatus),
  getTestResults: async () => currentUser ? (['Admin', 'Trainer'].includes(currentUser.role) ? testResults : testResults.filter(r => r.userId === currentUser?.id)) : [],
  getAllLMSCourses: async () => db.lmsCourses,
  getEnrolledCourses: async () => { if (!currentUser) return []; const ids = enrollments.filter(e => e.userId === currentUser?.id).map(e => e.courseId); return db.lmsCourses.filter(c => ids.includes(c.id)); },
  getEnrollmentByCourse: async (cid: string) => enrollments.find(e => e.userId === currentUser?.id && e.courseId === cid),
  enrollInCourse: async (id: string) => { if (currentUser) enrollments.push({ id: 'E-'+Math.random(), userId: currentUser.id, courseId: id, enrolledAt: new Date().toISOString(), progress: 0 }); },
  updateCourseProgress: async (cid: string, progress: number) => {
    await networkDelay();
    const enrollment = enrollments.find(e => e.userId === currentUser?.id && e.courseId === cid);
    if (enrollment) enrollment.progress = progress;
    return enrollment;
  },
  getCourseModules: async (cid: string) => db.lmsModules.filter(m => m.courseId === cid),
  getTestById: async (id: string) => db.lmsTests.find(t => t.id === id),
  submitTestResult: async (testId: string, answers: any, time: number) => { 
    await networkDelay();
    const test = db.lmsTests.find(t => t.id === testId);
    
    const skillScores: SkillScore[] = [
      { skill: 'Reading', score: 8, total: 10, isGraded: true, band: '7.5', feedback: 'Excellent reading precision.' },
      { skill: 'Writing', score: 0, total: 9, isGraded: false, feedback: 'Pending human evaluator.' },
      { skill: 'Listening', score: 7, total: 10, isGraded: true, band: '7.0' },
      { skill: 'Speaking', score: 0, total: 9, isGraded: false }
    ];

    const result: TestResult = { 
      id: 'RES-'+Math.random().toString(36).toUpperCase().substr(2, 5), 
      userId: currentUser?.id || 'guest', 
      testId, 
      testTitle: test?.title || 'Practice Test', 
      skillScores, 
      overallBand: 'Partial',
      timeTaken: time, 
      timestamp: new Date().toISOString(), 
      status: 'Submitted', 
      reviews: [] 
    }; 
    
    testResults.push(result); 

    if (answers['q3']) {
      manualSubmissions.push({
        id: 'MS-'+Math.random().toString(36).toUpperCase().substr(2, 5),
        testResultId: result.id,
        userId: currentUser?.id || 'guest',
        userName: currentUser?.name || 'Guest Student',
        userEmail: currentUser?.email || 'guest',
        testTitle: result.testTitle,
        skill: 'Writing',
        questionId: 'q3',
        studentAnswer: answers['q3'],
        maxScore: 9,
        timestamp: new Date().toISOString()
      });
    }

    return result; 
  },
  getQualifications: async () => qualifications,
  getQualificationById: async (id: string) => qualifications.find(q => q.id === id) || null,
  getQualificationLeads: async () => { checkRole(['Admin']); return qualificationLeads; },
  getLeads: async () => { checkRole(['Admin']); return leadSubmissions; },
  submitQualificationLead: async (data: any) => {
    const lead = { ...data, id: 'QL-'+Math.random(), status: 'Pending', timestamp: new Date().toISOString(), trackingId: 'TRK-'+Math.random() };
    qualificationLeads.push(lead);
    return lead;
  },
  getGuideBySlug: async (s: string) => db.countryGuides.find(g => g.slug === s) || null,
  getImmigrationGuides: async () => db.immigrationGuides,
  getUniversities: async () => db.universities,
  getUniversitiesByCountry: async (cid: string) => db.universities.filter(u => u.countryId === cid),
  getUniversityBySlug: async (s: string) => db.universityBySlug(s),
  getCoursesByUniversity: async (id: string) => db.courses.filter(c => c.universityId === id),
  redeemCourseVoucher: async (c: string) => true,
  submitTestBooking: async (d: any) => ({ ...d, id: 'B-'+Math.random(), trackingRef: 'REF-'+Math.random() })
};
