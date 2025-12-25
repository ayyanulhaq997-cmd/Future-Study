
import * as db from './db';
import { 
  Product, VoucherCode, VoucherStatus, Order, User, ActivityLog, SecurityStatus, LMSCourse, 
  LMSModule, LMSLesson, Enrollment, TestResult, CourseVoucher, Qualification, 
  QualificationLead, TestBooking, ManualSubmission, SkillScore, SkillType, LeadSubmission, 
  LeadStatus, PromoCode, FinanceReport, UserRole, ImmigrationGuideData 
} from '../types';

// ==========================================
// PRODUCTION CONFIGURATION
// ==========================================
const RAZORPAY_KEY_ID = 'rzp_test_UNICOU_DemoKey123'; 

const EMAIL_MODE: 'simulated' | 'production' = 'simulated';
const EMAIL_API_ENDPOINT = 'https://api.unicou.uk/v1/dispatch-mail'; 

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

const dispatchMail = async (to: string, subject: string, body: string) => {
  if (EMAIL_MODE === 'simulated') {
    console.log(`%c[SIMULATED EMAIL] To: ${to}\nSubject: ${subject}\nBody: ${body}`, 'color: #f15a24; font-weight: bold;');
    return true;
  }
  
  try {
    const response = await fetch(EMAIL_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, body, apiKey: process.env.MAIL_API_KEY })
    });
    return response.ok;
  } catch (e) {
    console.error("Email Dispatch Node Failure:", e);
    return false;
  }
};

let products = [...db.products];
let codes = [...db.voucherCodes];
let users = [...db.users];
let orders: Order[] = [];
let logs: ActivityLog[] = [];
let enrollments: Enrollment[] = [...db.initialEnrollments];
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
    if (users.find(u => u.email === email)) throw new Error('User already exists.');
    const newUser: User = { id: 'u-' + Math.random().toString(36).substr(2, 9), name: email.split('@')[0], email, role, verified: false };
    users.push(newUser);
    return newUser;
  },
  getUsers: async () => {
    checkRole(['Admin']);
    return users;
  },
  updateUserRole: async (userId: string, newRole: UserRole) => {
    checkRole(['Admin']);
    const user = users.find(u => u.id === userId);
    if (user) {
      user.role = newRole;
      api.logActivity('Admin', `Role modified for ${user.email} to ${newRole}`, 'warning');
    }
    return user;
  },
  verifyEmail: async (email: string) => {
    const user = users.find(u => u.email === email);
    if (user) user.verified = true;
    return user;
  },
  logout: () => { currentUser = null; },
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
    if (logs.length > 1000) logs.pop();
  },
  getLogs: async () => {
    checkRole(['Admin']);
    return logs;
  },
  getCodes: async () => { 
    checkRole(['Admin', 'Finance']); 
    return codes; 
  },
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
    api.logActivity('Admin', `Imported ${added} vouchers for PID: ${productId}`, 'info');
    return { addedCount: added, duplicateCount: rawCodes.length - added };
  },
  getStockCount: async (productId: string) => codes.filter(c => c.productId === productId && c.status === 'Available').length,
  // Fix: Added optional promoCode parameter to satisfy CheckoutProcess.tsx usage
  calculatePrice: async (productId: string, quantity: number, promoCode?: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) throw new Error('Product not found');
    let total = product.basePrice * quantity;
    let disc = currentUser?.role === 'Agent' ? total * 0.05 : 0;
    // Simple promo code logic example
    if (promoCode === 'UNICOU10') disc += total * 0.10;
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
    api.logActivity('Sales', `New Bank Transfer Pending: ${order.id}`, 'info');
    return order;
  },
  verifyBankTransfer: async (orderId: string) => {
    checkRole(['Admin', 'Finance', 'Teller']);
    const order = orders.find(o => o.id === orderId);
    if (order && order.status === 'Pending') {
      const available = codes.filter(c => c.productId === order.productId && c.status === 'Available');
      if (available.length < order.quantity) throw new Error('Insufficient Stock in Vault.');
      
      for (let i = 0; i < order.quantity; i++) {
        available[i].status = 'Used';
        order.voucherCodes.push(available[i].code);
      }
      order.status = 'Completed';
      await dispatchMail(order.customerEmail, "Vouchers Fulfilled", `Vouchers: ${order.voucherCodes.join(', ')}`);
      api.logActivity('Finance', `Verified order ${orderId}. ${order.quantity} vouchers dispatched by ${currentUser?.name}`, 'info');
    }
    return order;
  },
  getOrders: async () => {
    if (!currentUser) return [];
    const isStaff = ['Admin', 'Finance', 'Teller', 'Trainer'].includes(currentUser.role);
    return isStaff ? orders : orders.filter(o => o.userId === currentUser?.id);
  },
  getOrderById: async (id: string) => orders.find(o => o.id === id) || null,
  getProducts: async () => products,
  getProductById: async (id: string) => products.find(p => p.id === id) || null,
  getSecurityStatus: async () => ({ uptime: '99.9%', rateLimitsTriggered: 0, activeSessions: 42, threatLevel: 'Low' } as SecurityStatus),
  getLeads: async () => [],
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
  // Fix: Implemented missing api methods
  getUniversities: async () => db.universities,
  createGatewayOrder: async (amount: number) => ({
    id: 'rzp_order_'+Math.random().toString(36).substr(2, 9),
    key: RAZORPAY_KEY_ID,
    amount: amount * 100,
    currency: 'USD'
  }),
  processPayment: async (productId: string, quantity: number, email: string, paymentData: any) => {
    const product = products.find(p => p.id === productId)!;
    const price = await api.calculatePrice(productId, quantity);
    const order: Order = { 
      id: 'ORD-'+Math.random().toString(36).toUpperCase().substr(2, 5), 
      userId: currentUser?.id || 'guest', productId, productName: product.name, quantity, ...price, currency: 'USD', customerEmail: email, status: 'Completed', paymentMethod: 'Gateway', timestamp: new Date().toISOString(), voucherCodes: [], paymentId: paymentData.paymentId 
    };
    
    // Auto-fulfill for gateway payments
    const available = codes.filter(c => c.productId === productId && c.status === 'Available');
    if (available.length >= quantity) {
        for (let i = 0; i < quantity; i++) {
            available[i].status = 'Used';
            order.voucherCodes.push(available[i].code);
        }
    }
    
    orders.push(order);
    api.logActivity('Sales', `New Gateway Payment Completed: ${order.id}`, 'info');
    return order;
  },
  getTestResults: async () => {
    if (!currentUser) return [];
    return [
      { 
        id: 'TR-001', 
        userId: currentUser.id, 
        testId: 'mock-1', 
        testTitle: 'PTE Full Mock Alpha', 
        timestamp: new Date().toISOString(), 
        status: 'Graded',
        overallBand: '79',
        timeTaken: 7200,
        skillScores: [
            { skill: 'Speaking', score: 82, total: 90, isGraded: true, feedback: 'Excellent fluency.' },
            { skill: 'Writing', score: 75, total: 90, isGraded: true, feedback: 'Good structure.' },
            { skill: 'Reading', score: 80, total: 90, isGraded: true },
            { skill: 'Listening', score: 78, total: 90, isGraded: true }
        ],
        reviews: []
      }
    ] as TestResult[];
  },
  submitLead: async (lead: any) => {
    api.logActivity('Leads', `New enquiry from ${lead.email}`, 'info');
    return { ...lead, id: 'L-'+Math.random().toString(36).substr(2,5), timestamp: new Date().toISOString() };
  },
  enrollInCourse: async (courseId: string) => {
    if (!currentUser) throw new Error('Auth required');
    const existing = enrollments.find(e => e.userId === currentUser?.id && e.courseId === courseId);
    if (!existing) {
      enrollments.push({ id: 'en-'+Math.random().toString(36).substr(2,5), userId: currentUser.id, courseId, enrolledAt: new Date().toISOString(), progress: 0 });
    }
  },
  getQualifications: async () => db.qualifications,
  getQualificationById: async (id: string) => db.qualifications.find(q => q.id === id),
  submitQualificationLead: async (data: any) => {
    return { ...data, id: 'QL-'+Math.random().toString(36).substr(2,5), status: 'Pending', timestamp: new Date().toISOString(), trackingId: 'TRK-'+Math.random().toString(36).toUpperCase().substr(2,6) };
  },
  submitTestBooking: async (data: any) => {
    return { ...data, id: 'BK-'+Math.random().toString(36).substr(2,5), trackingRef: 'REF-'+Math.random().toString(36).toUpperCase().substr(2,6) };
  },
  getPendingSubmissions: async () => {
    checkRole(['Admin', 'Trainer']);
    return [
      { 
        id: 'SUB-101', 
        testResultId: 'RES-X', 
        userId: 'u-student', 
        userName: 'Alex Smith', 
        userEmail: 'alex@gmail.com', 
        testTitle: 'IELTS Mock', 
        skill: 'Writing', 
        questionId: 'q-w1', 
        studentAnswer: 'The graph illustrates the changes in population...', 
        maxScore: 9, 
        timestamp: new Date().toISOString() 
      }
    ] as ManualSubmission[];
  },
  gradeSubmission: async (id: string, score: number, feedback: string) => {
    checkRole(['Admin', 'Trainer']);
    api.logActivity('Trainer', `Graded submission ${id} with score ${score}`, 'info');
    return true;
  },
  getFinanceReport: async () => {
    checkRole(['Admin', 'Finance']);
    const completed = orders.filter(o => o.status === 'Completed');
    const totalRevenue = completed.reduce((acc, o) => acc + o.totalAmount, 0);
    const totalVouchersSold = completed.reduce((acc, o) => acc + o.quantity, 0);
    
    return {
      totalRevenue,
      totalVouchersSold,
      salesByType: [
        { name: 'PTE', value: completed.filter(o => o.productName.includes('PTE')).reduce((a, b) => a + b.totalAmount, 0) },
        { name: 'IELTS', value: completed.filter(o => o.productName.includes('IELTS')).reduce((a, b) => a + b.totalAmount, 0) },
        { name: 'Others', value: completed.filter(o => !o.productName.includes('PTE') && !o.productName.includes('IELTS')).reduce((a, b) => a + b.totalAmount, 0) }
      ],
      recentSales: orders.slice(-10).reverse()
    } as FinanceReport;
  },
  getImmigrationGuides: async () => db.immigrationGuides
};
