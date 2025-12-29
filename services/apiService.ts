
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
const ORDERS_KEY = 'unicou_orders_v1';
const CODES_KEY = 'unicou_codes_v1';

// Fix for line 18: 'const' declarations must be initialized.
// Added missing export for BANK_DETAILS
export const BANK_DETAILS = {
  bankName: 'UNICOU Central Finance (UK)',
  accountName: 'UNICOU INTERNATIONAL LTD',
  accountNumber: '88772299',
  sortCode: '20-44-12',
  iban: 'GB29 UNIC 2044 1288 7722 99',
  swift: 'UNICGB2L'
};

// Simulated persistent state
let localOrders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
let localLeads: Lead[] = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
let localCodes: VoucherCode[] = JSON.parse(localStorage.getItem(CODES_KEY) || '[]');

// Exporting the api object to fix multiple module errors
export const api = {
  // Auth Node
  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  login: async (email: string): Promise<User> => {
    const user = db.users.find(u => u.email === email);
    if (!user) throw new Error('Identity mismatch. Registry node not found.');
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  signup: async (email: string, role: UserRole): Promise<void> => {
    if (db.users.some(u => u.email === email)) throw new Error('Identity already exists.');
    // In demo, we just allow progression to verification
  },

  verifyEmail: async (email: string): Promise<void> => {
    // Demo verification success
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  updateUserRole: async (uid: string, role: UserRole) => {
    const user = db.users.find(u => u.id === uid);
    if (user) {
      user.role = role;
      // If updating current user, update session
      const current = api.getCurrentUser();
      if (current?.id === uid) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ ...current, role }));
      }
    }
  },

  getUsers: async () => db.users,

  // Global Registry Nodes (Universities & Countries)
  getUniversities: async () => db.universities,
  getUniversityBySlug: async (slug: string) => db.universities.find(u => u.slug === slug) || null,
  getUniversitiesByCountry: async (countryId: string) => db.universities.filter(u => u.countryId === countryId),
  getCoursesByUniversity: async (uniId: string) => db.courses.filter(c => c.universityId === uniId),
  getGuideBySlug: async (slug: string) => db.countryGuides.find(g => g.slug === slug) || null,
  getImmigrationGuides: async (): Promise<ImmigrationGuideData[]> => db.immigrationGuides,

  // Procurement Node (Voucher Store)
  getProducts: async () => db.products,
  getProductById: async (id: string) => db.products.find(p => p.id === id),
  
  getCodes: async () => [...db.voucherCodes, ...localCodes],
  
  getStockCount: async (productId: string) => {
    const all = [...db.voucherCodes, ...localCodes];
    return all.filter(c => c.productId === productId && c.status === 'Available').length;
  },

  importVouchers: async (productId: string, codes: string[]) => {
    const newCodes = codes.map(c => ({
      id: `vc-${productId}-${Math.random().toString(36).substr(2, 6)}`,
      productId,
      code: c,
      status: 'Available' as VoucherStatus,
      expiryDate: '2026-12-31'
    }));
    localCodes = [...localCodes, ...newCodes];
    localStorage.setItem(CODES_KEY, JSON.stringify(localCodes));
    return { addedCount: newCodes.length, duplicateCount: 0 };
  },

  // Settlement Engine
  getOrders: async () => localOrders,
  getOrderById: async (id: string) => localOrders.find(o => o.id === id) || null,
  
  calculatePrice: async (productId: string, quantity: number, promoCode?: string) => {
    const p = db.products.find(x => x.id === productId);
    if (!p) throw new Error('Registry fault: Product not found.');
    return {
      baseAmount: p.basePrice * quantity,
      tierDiscount: 0,
      promoDiscount: 0,
      totalAmount: p.basePrice * quantity
    };
  },

  submitBankTransfer: async (productId: string, quantity: number, email: string, bankRef: string): Promise<Order> => {
    const p = db.products.find(x => x.id === productId);
    const order: Order = {
      id: `UNICOU-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
      userId: 'guest-node',
      productId,
      productName: p?.name || 'Academic Voucher',
      quantity,
      baseAmount: (p?.basePrice || 0) * quantity,
      tierDiscount: 0,
      promoDiscount: 0,
      totalAmount: (p?.basePrice || 0) * quantity,
      currency: 'USD',
      customerEmail: email,
      status: 'Pending',
      paymentMethod: 'BankTransfer',
      timestamp: new Date().toISOString(),
      voucherCodes: [],
      bankRef
    };
    localOrders = [order, ...localOrders];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(localOrders));
    return order;
  },

  verifyBankTransfer: async (orderId: string) => {
    const order = localOrders.find(o => o.id === orderId);
    if (!order) throw new Error('Order node not found.');
    
    const available = [...db.voucherCodes, ...localCodes].filter(c => c.productId === order.productId && c.status === 'Available');
    if (available.length < order.quantity) throw new Error('Insufficient vault inventory.');
    
    const assigned = available.slice(0, order.quantity);
    assigned.forEach(c => c.status = 'Used');
    
    order.status = 'Completed';
    order.voucherCodes = assigned.map(c => c.code);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(localOrders));
  },

  createGatewayOrder: async (amount: number) => {
    return {
      key: RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: 'USD',
      id: `rzp_${Math.random().toString(36).substr(2, 9)}`
    };
  },

  processPayment: async (productId: string, quantity: number, email: string, paymentData: any): Promise<Order> => {
    const p = db.products.find(x => x.id === productId);
    const available = [...db.voucherCodes, ...localCodes].filter(c => c.productId === productId && c.status === 'Available');
    const assigned = available.slice(0, quantity);
    assigned.forEach(c => c.status = 'Used');

    const order: Order = {
      id: `UNICOU-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
      userId: 'guest-node',
      productId,
      productName: p?.name || 'Academic Voucher',
      quantity,
      baseAmount: (p?.basePrice || 0) * quantity,
      tierDiscount: 0,
      promoDiscount: 0,
      totalAmount: (p?.basePrice || 0) * quantity,
      currency: 'USD',
      customerEmail: email,
      status: 'Completed',
      paymentMethod: 'Gateway',
      timestamp: new Date().toISOString(),
      voucherCodes: assigned.map(c => c.code),
      paymentId: paymentData.paymentId
    };
    localOrders = [order, ...localOrders];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(localOrders));
    return order;
  },

  // CRM & Leads
  getLeads: async () => localLeads,
  submitLead: async (type: 'student' | 'agent' | 'career' | 'general', data: Record<string, string>) => {
    const lead: Lead = {
      id: `LD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      type,
      data,
      status: 'New',
      timestamp: new Date().toISOString()
    };
    localLeads = [lead, ...localLeads];
    localStorage.setItem(LEADS_KEY, JSON.stringify(localLeads));
    return lead;
  },

  submitQualificationLead: async (data: any) => {
    const lead = await api.submitLead('student', data);
    return { ...data, id: lead.id, timestamp: lead.timestamp, status: 'New', trackingId: lead.id };
  },

  submitTestBooking: async (data: any) => {
    return { ...data, id: `BK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, trackingRef: `TRK-${Math.random().toString(36).substr(2, 6).toUpperCase()}` };
  },

  // Study Hub Node (LMS)
  getAllLMSCourses: async () => db.lmsCourses,
  getEnrolledCourses: async () => db.lmsCourses, // For demo, allow access to all
  getCourseModules: async (courseId: string) => db.lmsModules.filter(m => m.courseId === courseId),
  getEnrollmentByCourse: async (courseId: string) => ({ id: 'enr-demo', userId: 'demo-user', courseId, enrolledAt: new Date().toISOString(), progress: 45 }),
  updateCourseProgress: async (courseId: string, progress: number) => { /* Demo logic */ },
  redeemCourseVoucher: async (code: string) => {
    if (code !== 'UNICOU-FREE') throw new Error('Invalid authorization code.');
  },
  getTestById: async (testId: string) => db.lmsTests.find(t => t.id === testId),
  submitTestResult: async (testId: string, answers: any, timeTaken: number): Promise<TestResult> => {
    return {
      id: `TR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      userId: 'student-node',
      testId,
      testTitle: 'Alpha Mock Test',
      skillScores: [
        { skill: 'Reading', score: 28, total: 30, isGraded: true, band: '8.5' },
        { skill: 'Listening', score: 26, total: 30, isGraded: true, band: '8.0' },
        { skill: 'Writing', score: 0, total: 30, isGraded: false },
        { skill: 'Speaking', score: 0, total: 30, isGraded: false }
      ],
      overallBand: 'Awaiting Assessment',
      timeTaken,
      timestamp: new Date().toISOString(),
      status: 'Pending',
      reviews: []
    };
  },
  getTestResults: async () => [],

  // Assessment Node (Trainer)
  getPendingSubmissions: async (): Promise<ManualSubmission[]> => [
    { id: 'sub-demo-1', testResultId: 'res-demo-1', userId: 'u-student', userName: 'Alex Smith', userEmail: 'alex@gmail.com', testTitle: 'IELTS Alpha Mock', skill: 'Writing', questionId: 'q-w1', studentAnswer: 'The data indicates a significant shift...', maxScore: 9, timestamp: new Date().toISOString() }
  ],
  gradeSubmission: async (id: string, score: number, feedback: string) => { /* Assessment logic */ },

  // Governance Node (Admin/Finance)
  getSecurityStatus: async (): Promise<SecurityStatus> => ({ uptime: '99.98%', rateLimitsTriggered: 14, activeSessions: 42, threatLevel: 'Secure' }),
  getLogs: async (): Promise<ActivityLog[]> => [
    { id: 'log-1', timestamp: new Date().toISOString(), userId: 'u-admin', userEmail: 'admin@unicou.uk', action: 'NODE_AUTH', details: 'Authorized new staff session.', ip: '127.0.0.1', country: 'UK', severity: 'info' }
  ],
  getFinanceReport: async (): Promise<FinanceReport> => ({
    totalRevenue: 28450,
    totalVouchersSold: 189,
    salesByType: [
      { name: 'PTE Academic', value: 15400 },
      { name: 'IELTS Academic', value: 9200 },
      { name: 'LanguageCert', value: 3850 }
    ],
    recentSales: localOrders.slice(0, 15)
  }),

  // Qualification Registry
  getQualifications: async () => db.qualifications,
  getQualificationById: async (id: string) => db.qualifications.find(q => q.id === id)
};
