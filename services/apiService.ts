import * as db from './db';
import { 
  Product, VoucherCode, VoucherStatus, Order, User, ActivityLog, SecurityStatus, LMSCourse, 
  LMSModule, LMSLesson, Enrollment, TestResult, CourseVoucher, Qualification, 
  QualificationLead, TestBooking, ManualSubmission, SkillScore, SkillType, LeadSubmission, 
  LeadStatus, PromoCode, FinanceReport, UserRole, ImmigrationGuideData, Lead 
} from '../types';

// ==========================================
// PRODUCTION CONFIGURATION
// ==========================================
const RAZORPAY_KEY_ID = 'rzp_test_UNICOU_DemoKey123'; 
const SESSION_KEY = 'unicou_active_session_v4';
const LEADS_KEY = 'unicou_leads_v1';

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

// Global State
let products = [...db.products];
let codes = [...db.voucherCodes];
let users = [...db.users]; 
let orders: Order[] = [];
let logs: ActivityLog[] = [];
let enrollments: Enrollment[] = [...db.initialEnrollments];
let currentUser: User | null = null;

// Persistent Session Recovery
const savedUserStr = localStorage.getItem(SESSION_KEY);
if (savedUserStr) {
  try {
    const parsed = JSON.parse(savedUserStr);
    const liveMatch = users.find(u => u.email.toLowerCase() === parsed.email.toLowerCase());
    if (liveMatch) {
        currentUser = liveMatch;
    } else {
        users.push(parsed);
        currentUser = parsed;
    }
  } catch (e) {
    localStorage.removeItem(SESSION_KEY);
  }
}

// Leads Persistence
let leads: Lead[] = [];
const savedLeads = localStorage.getItem(LEADS_KEY);
if (savedLeads) {
  try { leads = JSON.parse(savedLeads); } catch (e) { leads = []; }
}

const networkDelay = () => new Promise(resolve => setTimeout(resolve, 400));

const checkRole = (allowedRoles: UserRole[]) => {
  if (!currentUser) throw new Error('401 Unauthorized Session');
  if (!allowedRoles.includes(currentUser.role)) throw new Error(`403 Access Node Restricted`);
};

export const api = {
  login: async (email: string) => {
    await networkDelay();
    const cleanEmail = email.trim().toLowerCase();
    let user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      user = db.users.find(u => u.email.toLowerCase() === cleanEmail);
      if (user) users.push(user);
    }
    if (!user) throw new Error('Identity Node Not Found. Please verify your credentials.');
    currentUser = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    api.logActivity('Auth', `Identity established: ${user.role} [${user.email}]`, 'info');
    return user;
  },
  signup: async (email: string, role: UserRole = 'Customer') => {
    await networkDelay();
    const cleanEmail = email.trim().toLowerCase();
    if (users.find(u => u.email.toLowerCase() === cleanEmail)) throw new Error('Identity already exists.');
    const newUser: User = { 
      id: 'u-' + Math.random().toString(36).substr(2, 9), 
      name: cleanEmail.split('@')[0], 
      email: cleanEmail, 
      role, 
      verified: false 
    };
    users.push(newUser);
    return newUser;
  },
  getUsers: async () => { checkRole(['Admin']); return users; },
  updateUserRole: async (userId: string, newRole: UserRole) => {
    checkRole(['Admin']);
    const user = users.find(u => u.id === userId);
    if (user) user.role = newRole;
    return user;
  },
  verifyEmail: async (email: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) user.verified = true;
    return user;
  },
  logout: () => { currentUser = null; localStorage.removeItem(SESSION_KEY); },
  getCurrentUser: () => currentUser,
  logActivity: async (action: string, details: string, severity: 'info' | 'warning' | 'critical' = 'info') => {
    const log: ActivityLog = { 
      id: 'L-'+Math.random().toString(36).substr(2, 5), 
      timestamp: new Date().toISOString(), 
      userId: currentUser?.id || 'guest', 
      userEmail: currentUser?.email || 'guest', 
      action, details, ip: '10.0.0.1', country: 'Global', severity 
    };
    logs.unshift(log);
  },
  getLogs: async () => { checkRole(['Admin']); return logs; },
  getCodes: async () => { checkRole(['Admin', 'Finance']); return codes; },
  importVouchers: async (productId: string, rawCodes: string[]) => {
    checkRole(['Admin']);
    let added = 0;
    rawCodes.forEach(codeStr => {
      const clean = codeStr.trim();
      if (clean && !codes.find(c => c.code === clean)) {
        codes.push({ id: 'V-'+Math.random().toString(36).substr(2,7), productId, code: clean, status: 'Available', expiryDate: '2026-12-31' });
        added++;
      }
    });
    return { addedCount: added, duplicateCount: rawCodes.length - added };
  },
  getStockCount: async (productId: string) => codes.filter(c => c.productId === productId && c.status === 'Available').length,
  calculatePrice: async (productId: string, quantity: number, promoCode?: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) throw new Error('Product SKU Mismatch');
    let total = product.basePrice * quantity;
    let disc = currentUser?.role === 'Agent' ? total * 0.10 : 0;
    return { baseAmount: total, tierDiscount: disc, promoDiscount: 0, totalAmount: total - disc };
  },
  submitBankTransfer: async (productId: string, quantity: number, email: string, bankRef: string) => {
    const product = products.find(p => p.id === productId)!;
    const price = await api.calculatePrice(productId, quantity);
    const order: Order = { 
      id: 'ORD-'+Math.random().toString(36).toUpperCase().substr(2, 5), 
      userId: currentUser?.id || 'guest', productId, productName: product.name, quantity, ...price, currency: 'USD', customerEmail: email, status: 'Pending', paymentMethod: 'BankTransfer', timestamp: new Date().toISOString(), voucherCodes: [], bankRef 
    };
    orders.push(order);
    return order;
  },
  verifyBankTransfer: async (orderId: string) => {
    checkRole(['Admin', 'Finance', 'Teller']);
    const order = orders.find(o => o.id === orderId);
    if (order && order.status === 'Pending') {
      const available = codes.filter(c => c.productId === order.productId && c.status === 'Available');
      if (available.length < order.quantity) throw new Error('Vault Stock Exhausted');
      for (let i = 0; i < order.quantity; i++) {
        available[i].status = 'Used';
        order.voucherCodes.push(available[i].code);
      }
      order.status = 'Completed';
    }
    return order;
  },
  getOrders: async () => {
    if (!currentUser) return [];
    const isStaff = ['Admin', 'Finance', 'Teller'].includes(currentUser.role);
    return isStaff ? orders : orders.filter(o => o.userId === currentUser?.id);
  },
  getOrderById: async (id: string) => orders.find(o => o.id === id) || null,
  getProducts: async () => products,
  getProductById: async (id: string) => products.find(p => p.id === id) || null,
  getSecurityStatus: async () => ({ uptime: '99.9%', rateLimitsTriggered: 0, activeSessions: 42, threatLevel: 'Low' } as SecurityStatus),
  getLeads: async () => { checkRole(['Admin']); return leads; },
  submitLead: async (type: Lead['type'], data: Record<string, string>) => {
    await networkDelay();
    const newLead: Lead = {
      id: 'LD-' + Math.random().toString(36).substr(2, 7).toUpperCase(),
      type,
      data,
      status: 'New',
      timestamp: new Date().toISOString()
    };
    leads.unshift(newLead);
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
    api.logActivity('Lead', `New ${type} lead captured: ${data.email || 'N/A'}`, 'info');
    return newLead;
  },
  getAllLMSCourses: async () => db.lmsCourses,
  getEnrolledCourses: async () => { if (!currentUser) return []; const ids = enrollments.filter(e => e.userId === currentUser?.id).map(e => e.courseId); return db.lmsCourses.filter(c => ids.includes(c.id)); },
  getEnrollmentByCourse: async (cid: string) => enrollments.find(e => e.userId === currentUser?.id && e.courseId === cid),
  updateCourseProgress: async (cid: string, progress: number) => {
    const enrollment = enrollments.find(e => e.userId === currentUser?.id && e.courseId === cid);
    if (enrollment) enrollment.progress = progress;
  },
  getCourseModules: async (cid: string) => db.lmsModules.filter(m => m.courseId === cid),
  getTestById: async (id: string) => db.lmsTests.find(t => t.id === id),
  submitTestResult: async (tid: string, ans: any, time: number) => ({ id: 'RES-1', userId: currentUser?.id || 'guest', testId: tid, testTitle: 'Mock', skillScores: [], overallBand: '7.5', timeTaken: time, timestamp: new Date().toISOString(), status: 'Graded', reviews: [] } as TestResult),
  getGuideBySlug: async (slug: string) => db.countryGuides.find(g => g.slug === slug) || null,
  getUniversitiesByCountry: async (cid: string) => db.universities.filter(u => u.countryId === cid),
  getUniversityBySlug: async (s: string) => db.universityBySlug(s),
  getCoursesByUniversity: async (id: string) => db.courses.filter(c => c.universityId === id),
  redeemCourseVoucher: async (c: string) => true,
  getUniversities: async () => db.universities,
  createGatewayOrder: async (amount: number) => ({ id: 'rzp_'+Math.random(), key: RAZORPAY_KEY_ID, amount, currency: 'USD' }),
  processPayment: async (productId: string, quantity: number, email: string, paymentData: any) => {
    const product = products.find(p => p.id === productId)!;
    const price = await api.calculatePrice(productId, quantity);
    const order: Order = { 
      id: 'ORD-'+Math.random().toString(36).toUpperCase().substr(2, 5), 
      userId: currentUser?.id || 'guest', productId, productName: product.name, quantity, ...price, currency: 'USD', customerEmail: email, status: 'Completed', paymentMethod: 'Gateway', timestamp: new Date().toISOString(), voucherCodes: [], paymentId: paymentData.paymentId 
    };
    orders.push(order);
    return order;
  },
  getTestResults: async () => [],
  enrollInCourse: async (courseId: string) => {
    if (!currentUser) throw new Error('Auth required');
    enrollments.push({ id: 'en-'+Math.random(), userId: currentUser.id, courseId, enrolledAt: new Date().toISOString(), progress: 0 });
  },
  getQualifications: async () => db.qualifications,
  getQualificationById: async (id: string) => db.qualifications.find(q => q.id === id),
  submitQualificationLead: async (data: any) => ({ ...data, id: 'QL-'+Math.random(), timestamp: new Date().toISOString() }),
  submitTestBooking: async (data: any) => ({ ...data, id: 'BK-'+Math.random(), trackingRef: 'REF-'+Math.random() }),
  getPendingSubmissions: async () => [],
  gradeSubmission: async (id: string, score: number, feedback: string) => true,
  getFinanceReport: async () => {
    const completed = orders.filter(o => o.status === 'Completed');
    return {
      totalRevenue: completed.reduce((acc, o) => acc + o.totalAmount, 0),
      totalVouchersSold: completed.reduce((acc, o) => acc + o.quantity, 0),
      salesByType: [],
      recentSales: orders.slice(-10).reverse()
    } as FinanceReport;
  },
  getImmigrationGuides: async () => db.immigrationGuides
};