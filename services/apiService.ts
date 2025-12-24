
import * as db from './db';
import { 
  Product, VoucherCode, VoucherStatus, Order, User, ActivityLog, SecurityStatus, LMSCourse, 
  LMSModule, LMSLesson, Enrollment, TestResult, CourseVoucher, Qualification, 
  QualificationLead, TestBooking, ManualSubmission, SkillScore, SkillType, LeadSubmission, 
  LeadStatus, PromoCode, FinanceReport, UserRole, ImmigrationGuideData 
} from '../types';

// ==========================================
// PRODUCTION PAYMENT CONFIGURATION
// ==========================================
// Replace this with your LIVE Key from Razorpay Dashboard for real card payments
const RAZORPAY_KEY_ID = 'rzp_test_NexusDemoKey123'; 

// Update these with your ACTUAL bank account details
export const BANK_DETAILS = {
  bankName: "UNICOU HUB INTERNATIONAL",
  accountName: "UniCou Ltd",
  accountNumber: "9988776655",
  sortCode: "20-44-55",
  iban: "GB00UNICOU1234567890",
  swift: "UNICOUGB2L",
  referenceNote: "Use your Email as Reference"
};
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
let leadSubmissions: LeadSubmission[] = [
  { id: 'L-1', name: 'Zahra Ahmed', email: 'zahra@example.com', phone: '+92 300 1234567', targetCountry: 'United Kingdom', preferredCourse: 'MSc Data Science', status: 'New', timestamp: new Date().toISOString() },
  { id: 'L-2', name: 'John Doe', email: 'john@example.com', phone: '+44 7700 900000', targetCountry: 'Canada', preferredCourse: 'MBA', status: 'Contacted', timestamp: new Date().toISOString() }
];
let currentUser: User | null = null;

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
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists in the Nexus registry.');
    }
    const newUser: User = { id: 'u-' + Math.random().toString(36).substr(2, 9), name: email.split('@')[0], email, role, verified: false, tier: role === 'Agent' ? 1 : undefined };
    users.push(newUser);
    return newUser;
  },
  getUsers: async () => {
    checkRole(['Admin']);
    return users;
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
    const log: ActivityLog = { id: 'L-'+Math.random().toString(36).substr(2, 5), timestamp: new Date().toISOString(), userId: currentUser?.id || 'guest', userEmail: currentUser?.email || 'guest', action, details, ip: '10.0.0.1', country: 'Global', severity };
    logs.unshift(log);
    if (logs.length > 100) logs.pop();
  },
  getCodes: async () => { 
    checkRole(['Admin']); 
    return codes; 
  },
  getStockCount: async (productId: string) => codes.filter(c => c.productId === productId && c.status === 'Available').length,
  importVouchers: async (productId: string, rawCodes: string[]) => {
    await networkDelay();
    checkRole(['Admin']);
    rawCodes.forEach(code => codes.push({ id: 'V-'+Math.random(), productId, code, status: 'Available', expiryDate: '2026-01-01' }));
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
    return { id: 'order_' + Math.random().toString(36).substr(2, 12), amount: Math.round(amount * 83 * 100), currency: 'INR', key: RAZORPAY_KEY_ID };
  },
  submitBankTransfer: async (productId: string, quantity: number, email: string, bankRef: string) => {
    await networkDelay();
    const product = products.find(p => p.id === productId)!;
    const price = await api.calculatePrice(productId, quantity);
    const order: Order = { 
      id: 'BT-'+Math.random().toString(36).toUpperCase().substr(2, 5), 
      userId: currentUser?.id || 'guest', 
      productId, 
      productName: product.name, 
      quantity, 
      ...price, 
      currency: 'USD', 
      customerEmail: email, 
      status: 'Pending', 
      paymentMethod: 'BankTransfer',
      timestamp: new Date().toISOString(), 
      voucherCodes: [], 
      bankRef 
    };
    orders.push(order);
    api.logActivity('Finance', `Bank reference ${bankRef} submitted for order ${order.id}`, 'info');
    return order;
  },
  verifyBankTransfer: async (orderId: string) => {
    checkRole(['Admin', 'Teller', 'Finance']);
    const order = orders.find(o => o.id === orderId);
    if (order && order.status === 'Pending') {
      const available = codes.filter(c => c.productId === order.productId && c.status === 'Available');
      
      if (available.length < order.quantity) {
        for(let i=0; i<order.quantity; i++) {
            order.voucherCodes.push('REC-'+Math.random().toString(36).toUpperCase().substr(0,8));
        }
      } else {
        for (let i = 0; i < order.quantity; i++) {
          available[i].status = 'Used';
          order.voucherCodes.push(available[i].code);
        }
      }

      order.status = 'Completed';
      api.logActivity('Verification', `Payment verified for ${orderId}. Vouchers released.`, 'info');
    }
    return order;
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
      customerEmail: email, 
      status: 'Pending', 
      paymentMethod: 'Gateway',
      timestamp: new Date().toISOString(), 
      voucherCodes: [], 
      paymentId: paymentData.paymentId 
    };
    
    orders.push(order);
    api.logActivity('Payment', `Gateway payment captured for ${order.id}. Awaiting Admin verification.`, 'info');
    return order;
  },
  getFinanceReport: async () => {
    checkRole(['Admin', 'Finance', 'Teller']);
    return { 
      totalRevenue: orders.filter(o => o.status === 'Completed').reduce((a, o) => a + o.totalAmount, 0), 
      totalVouchersSold: orders.filter(o => o.status === 'Completed').reduce((a, o) => a + o.quantity, 0), 
      salesByType: [], 
      recentSales: orders.slice(-50) 
    } as FinanceReport;
  },
  submitLead: async (data: any) => { 
    await networkDelay(); 
    const lead = { ...data, id: 'L-'+Math.random().toString(36).substr(2, 5).toUpperCase(), status: 'New', timestamp: new Date().toISOString() };
    leadSubmissions.unshift(lead);
    return lead; 
  },
  updateLeadStatus: async (id: string, status: string) => {
    await networkDelay();
    checkRole(['Admin']);
    const lead = leadSubmissions.find(l => l.id === id);
    if (lead) lead.status = status;
    return lead;
  },
  getPendingSubmissions: async () => { checkRole(['Trainer', 'Admin']); return manualSubmissions.filter(s => !s.gradedBy); },
  gradeSubmission: async (id: string, score: number, fb: string) => {
    checkRole(['Trainer', 'Admin']);
    const s = manualSubmissions.find(x => x.id === id);
    if (s) { s.score = score; s.feedback = fb; s.gradedBy = currentUser?.name; }
  },
  getProducts: async () => products,
  getProductById: async (id: string) => products.find(p => p.id === id) || null,
  getOrders: async () => {
    if (!currentUser) return [];
    const isSpecial = ['Admin', 'Finance', 'Teller'].includes(currentUser.role);
    const unfiltered = isSpecial ? orders : orders.filter(o => o.userId === currentUser?.id);
    
    if (currentUser.role === 'Finance' || currentUser.role === 'Teller' || currentUser.role === 'Trainer') {
      return unfiltered.map(o => ({ ...o, voucherCodes: o.voucherCodes.map(() => '****-****-****') }));
    }
    return unfiltered;
  },
  getOrderById: async (id: string) => {
    await networkDelay();
    const order = orders.find(o => o.id === id);
    if (!order) return null;
    if (currentUser && ['Finance', 'Teller', 'Trainer'].includes(currentUser.role)) {
      return { ...order, voucherCodes: order.voucherCodes.map(() => '****-****-****') };
    }
    return order;
  },
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
      { skill: 'Reading', score: 8, total: 10, isGraded: true, band: '7.5', feedback: 'Excellent precision.' },
      { skill: 'Writing', score: 0, total: 9, isGraded: false },
      { skill: 'Listening', score: 7, total: 10, isGraded: true },
      { skill: 'Speaking', score: 0, total: 9, isGraded: false }
    ];
    const result: TestResult = { id: 'RES-'+Math.random().toString(36).toUpperCase().substr(2, 5), userId: currentUser?.id || 'guest', testId, testTitle: test?.title || 'Practice Test', skillScores, overallBand: 'Partial', timeTaken: time, timestamp: new Date().toISOString(), status: 'Submitted', reviews: [] }; 
    testResults.push(result); 
    return result; 
  },
  getQualifications: async () => qualifications,
  getQualificationById: async (id: string) => qualifications.find(q => q.id === id) || null,
  getQualificationLeads: async () => { checkRole(['Admin']); return qualificationLeads; },
  updateQualificationStatus: async (id: string, status: string) => {
    await networkDelay();
    checkRole(['Admin']);
    const lead = qualificationLeads.find(l => l.id === id);
    if (lead) lead.status = status;
    return lead;
  },
  getLeads: async () => { checkRole(['Admin']); return leadSubmissions; },
  submitQualificationLead: async (data: any) => {
    const lead = { ...data, id: 'QL-'+Math.random().toString(36).substr(2, 5).toUpperCase(), status: 'New', timestamp: new Date().toISOString(), trackingId: 'TRK-'+Math.random().toString(36).toUpperCase().substr(2, 6) };
    qualificationLeads.unshift(lead);
    return lead;
  },
  getGuideBySlug: async (s: string) => db.countryGuides.find(g => g.slug === s) || null,
  getImmigrationGuides: async () => db.immigrationGuides,
  getUniversities: async () => db.universities,
  getUniversitiesByCountry: async (cid: string) => db.universities.filter(u => u.countryId === cid),
  getUniversityBySlug: async (s: string) => db.universityBySlug(s),
  getCoursesByUniversity: async (id: string) => db.courses.filter(c => c.universityId === id),
  redeemCourseVoucher: async (c: string) => true,
  submitTestBooking: async (d: any) => ({ ...d, id: 'B-'+Math.random().toString(36).toUpperCase().substr(2, 5), trackingRef: 'REF-'+Math.random().toString(36).toUpperCase().substr(2, 6) })
};
