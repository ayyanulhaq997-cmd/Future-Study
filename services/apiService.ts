
import * as db from './db';
// Added University, CountryGuide, Course, and LMSPracticeTest to the imports to fix missing name errors
import { 
  Product, VoucherCode, VoucherStatus, Order, User, ActivityLog, SecurityStatus, LMSCourse, 
  LMSModule, LMSLesson, Enrollment, TestResult, CourseVoucher, Qualification, 
  QualificationLead, TestBooking, ManualSubmission, SkillScore, SkillType, LeadSubmission, 
  LeadStatus, PromoCode, FinanceReport, UserRole, ImmigrationGuideData, Lead,
  University, CountryGuide, Course, LMSPracticeTest
} from '../types';

const SESSION_KEY = 'unicou_active_session_v4';
const LEADS_KEY = 'unicou_leads_v1';
const ORDERS_KEY = 'unicou_orders_v1';
const CODES_KEY = 'unicou_codes_v1';
const USERS_KEY = 'unicou_local_users_v1';
const RESULTS_KEY = 'unicou_test_results_v1';
const QUAL_LEADS_KEY = 'unicou_qual_leads_v1';
const TEST_BOOKINGS_KEY = 'unicou_test_bookings_v1';

export const BANK_DETAILS = {
  bankName: 'UniCou International Ltd Central Finance (UK)',
  accountName: 'UNICOU INTERNATIONAL LTD',
  accountNumber: '88772299',
  sortCode: '20-44-12',
  iban: 'GB29 UNIC 2044 1288 7722 99',
  swift: 'UNICGB2L'
};

const dispatchOrderConfirmationEmail = (email: string, orderId: string, customerName: string) => {
  console.log(`[EMAIL DISPATCH] Confirmation sent to ${email} for order ${orderId}`);
};

const dispatchAnnexEmail = (email: string, annex: 'C' | 'D' | 'E', orderId: string, extraData?: any) => {
  console.log(`[EMAIL DISPATCH] Annex-${annex} sent to ${email} for order ${orderId}`);
};

const generateDemoStock = (productId: string, quantity: number): VoucherCode[] => {
  const product = db.products.find(p => p.id === productId);
  return Array(quantity).fill(0).map((_, i) => ({
    id: `vc-auto-${productId}-${Date.now()}-${i}`,
    productId,
    code: `${product?.category.substring(0,2).toUpperCase() || 'EX'}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    status: 'Available' as VoucherStatus,
    expiryDate: '2026-12-31',
    uploadDate: new Date().toISOString()
  }));
};

export const api = {
  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  login: async (email: string): Promise<User> => {
    const cleanEmail = email.trim().toLowerCase();
    const localUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const allUsers = [...db.users, ...localUsers];
    const user = allUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) throw new Error('Account not found. Please check your email or sign up.');
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  signup: async (email: string, role: UserRole): Promise<User> => {
    const cleanEmail = email.trim().toLowerCase();
    const localUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const allUsers = [...db.users, ...localUsers];
    if (allUsers.some(u => u.email.toLowerCase() === cleanEmail)) throw new Error('An account with this email already exists.');
    
    const newUser: User = { 
      id: `u-${Math.random().toString(36).substr(2, 9)}`, 
      name: cleanEmail.split('@')[0].toUpperCase(), 
      email: cleanEmail, 
      role, 
      verified: true, 
      isPlatinum: false 
    };
    
    localUsers.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(localUsers));
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return newUser;
  },

  logout: () => localStorage.removeItem(SESSION_KEY),

  getUsers: async (): Promise<User[]> => {
    const localUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return [...db.users, ...localUsers];
  },

  getProducts: async (): Promise<Product[]> => db.products,
  getProductById: async (id: string): Promise<Product | undefined> => db.products.find(p => p.id === id),
  getUniversities: async (): Promise<University[]> => db.universities,
  getUniversityBySlug: async (slug: string): Promise<University | null> => db.universities.find(u => u.slug === slug) || null,
  getGuideBySlug: async (slug: string): Promise<CountryGuide | null> => db.countryGuides.find(g => g.slug === slug) || null,
  getUniversitiesByCountry: async (countryId: string): Promise<University[]> => db.universities.filter(u => u.countryId === countryId),
  getCoursesByUniversity: async (universityId: string): Promise<Course[]> => db.courses.filter(c => c.universityId === universityId),

  getCodes: async (): Promise<VoucherCode[]> => {
    let codes = JSON.parse(localStorage.getItem(CODES_KEY) || '[]');
    if (codes.length === 0) codes = [...db.voucherCodes];
    return codes;
  },

  getOrders: async (): Promise<Order[]> => {
    const currentUser = api.getCurrentUser();
    if (!currentUser) return [];
    const allOrders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    if (['System Admin/Owner', 'Finance/Audit Team', 'Operation Manager', 'Support/Sales Node'].includes(currentUser.role)) {
      return allOrders;
    }
    return allOrders.filter(o => o.userId === currentUser.id);
  },

  getOrderById: async (id: string): Promise<Order | null> => {
    const orders = await api.getOrders();
    return orders.find(o => o.id === id) || null;
  },

  getDailyOrderStats: async (userId: string) => {
    const orders = await api.getOrders();
    const today = new Date().toISOString().split('T')[0];
    const userToday = orders.filter(o => o.userId === userId && o.timestamp.startsWith(today));
    return {
      total: userToday.length,
      bankTotal: userToday.filter(o => o.paymentMethod === 'BankTransfer').reduce((acc, o) => acc + o.quantity, 0),
      cardTotal: userToday.filter(o => o.paymentMethod === 'Gateway').reduce((acc, o) => acc + o.quantity, 0)
    };
  },

  processOrderAction: async (orderId: string, action: 'verify' | 'hold' | 'cancel'): Promise<Order> => {
    const allOrders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    const orderIdx = allOrders.findIndex(o => o.id === orderId);
    if (orderIdx === -1) throw new Error('Order not found.');
    const order = allOrders[orderIdx];
    const currentUser = api.getCurrentUser();

    if (action === 'verify') {
      let codes = await api.getCodes();
      let available = codes.filter(c => c.productId === order.productId && c.status === 'Available');
      if (available.length < order.quantity) {
        const replenish = generateDemoStock(order.productId, 20);
        codes = [...codes, ...replenish];
        available = codes.filter(c => c.productId === order.productId && c.status === 'Available');
      }
      const assigned = available.slice(0, order.quantity);
      assigned.forEach(c => {
        c.status = 'Used';
        c.orderId = order.id;
        c.buyerName = order.buyerName;
        c.assignmentDate = new Date().toISOString();
        c.salesExecutiveName = order.salesExecutiveName || currentUser?.name || 'Automated Node';
      });
      order.status = 'Completed';
      order.voucherCodes = assigned.map(c => c.code);
      localStorage.setItem(CODES_KEY, JSON.stringify(codes));
      dispatchAnnexEmail(order.customerEmail, 'C', order.id);
      console.log(`Order Processing Completed: The Voucher(s) for Order ${order.id} delivered to the client registered email ID: ${order.customerEmail}`);
    } else if (action === 'hold') {
      order.status = 'On-Hold';
      dispatchAnnexEmail(order.customerEmail, 'D', order.id);
    } else if (action === 'cancel') {
      order.status = 'Cancelled';
      dispatchAnnexEmail(order.customerEmail, 'E', order.id);
    }

    localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
    return order;
  },

  submitBankTransfer: async (productId: string, quantity: number, email: string, buyerName: string, bankRef: string): Promise<Order> => {
    const p = db.products.find(x => x.id === productId);
    const currentUser = api.getCurrentUser();
    if (!currentUser) throw new Error("Session expired. Please log in.");

    if (currentUser.role === 'Student') {
      const stats = await api.getDailyOrderStats(currentUser.id);
      if (stats.total >= 1) {
        throw new Error("For your security, further orders are restricted. Kindly reach out to our support team for assistance.");
      }
    }

    const order: Order = {
      id: `UNICOU-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
      userId: currentUser.id,
      productId,
      productName: p?.name || 'Voucher',
      quantity,
      totalAmount: (p?.basePrice || 0) * quantity,
      currency: p?.currency || 'USD',
      customerEmail: email,
      buyerName: buyerName || currentUser.name,
      salesExecutiveName: currentUser.role === 'Agent Partner/Prep Center' ? currentUser.name : 'Direct Node',
      status: 'Pending',
      paymentMethod: 'BankTransfer',
      timestamp: new Date().toISOString(),
      voucherCodes: [],
      bankRef,
      proofAttached: true
    };
    
    const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...allOrders]));
    dispatchOrderConfirmationEmail(email, order.id, buyerName || currentUser.name);
    return order;
  },

  submitLead: async (type: string, data: any): Promise<void> => {
    const leads = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
    const newLead = { id: `LD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, type: type as any, data, status: 'New' as const, timestamp: new Date().toISOString() };
    localStorage.setItem(LEADS_KEY, JSON.stringify([newLead, ...leads]));
  },

  getLeads: async (): Promise<Lead[]> => JSON.parse(localStorage.getItem(LEADS_KEY) || '[]'),
  
  getFinanceReport: async (): Promise<FinanceReport> => {
    const orders = await api.getOrders();
    const completed = orders.filter(o => o.status === 'Completed');
    const totalRev = completed.reduce((acc, o) => acc + o.totalAmount, 0);
    const totalVouchers = completed.reduce((acc, o) => acc + o.quantity, 0);
    
    const salesByTypeMap: Record<string, number> = {};
    completed.forEach(o => {
      salesByTypeMap[o.productName] = (salesByTypeMap[o.productName] || 0) + o.totalAmount;
    });

    return {
      totalRevenue: totalRev,
      totalVouchersSold: totalVouchers,
      salesByType: Object.entries(salesByTypeMap).map(([name, value]) => ({ name, value })),
      recentSales: orders
    };
  },

  getSecurityStatus: async (): Promise<SecurityStatus> => ({ uptime: '99.99%', rateLimitsTriggered: 0, activeSessions: 1, threatLevel: 'Normal' }),
  getLogs: async () => [],
  getQualifications: async (): Promise<Qualification[]> => db.qualifications,
  getAllLMSCourses: async (): Promise<LMSCourse[]> => db.lmsCourses,
  getEnrolledCourses: async (): Promise<LMSCourse[]> => [],
  getCourseModules: async (cid: string): Promise<LMSModule[]> => [],
  getEnrollmentByCourse: async (cid: string): Promise<Enrollment | null> => null,
  updateCourseProgress: async (cid: string, p: number): Promise<void> => {},
  redeemCourseVoucher: async (code: string): Promise<void> => {},
  getTestById: async (tid: string): Promise<LMSPracticeTest | undefined> => db.lmsTests.find(t => t.id === tid),
  submitTestResult: async (tid: string, a: any, t: number): Promise<TestResult> => {
    const currentUser = api.getCurrentUser();
    const newRes: TestResult = { id: `RES-${Date.now()}`, userId: currentUser?.id || 'guest', testId: tid, testTitle: 'Test Result', skillScores: [], overallBand: 'N/A', timeTaken: t, timestamp: new Date().toISOString(), status: 'Pending', reviews: [] };
    const results = JSON.parse(localStorage.getItem(RESULTS_KEY) || '[]');
    localStorage.setItem(RESULTS_KEY, JSON.stringify([newRes, ...results]));
    return newRes;
  },
  getTestResults: async (): Promise<TestResult[]> => {
    const currentUser = api.getCurrentUser();
    if (!currentUser) return [];
    const allResults: TestResult[] = JSON.parse(localStorage.getItem(RESULTS_KEY) || '[]');
    if (['System Admin/Owner', 'Lead Trainer'].includes(currentUser.role)) return allResults;
    return allResults.filter(r => r.userId === currentUser.id);
  },
  getPendingSubmissions: async (): Promise<ManualSubmission[]> => [],
  gradeSubmission: async (id: string, s: number, f: string): Promise<void> => {},
  getImmigrationGuides: async (): Promise<ImmigrationGuideData[]> => db.immigrationGuides,
  updateUserRole: async (uid: string, role: UserRole): Promise<void> => {},
  getQualificationById: async (id: string): Promise<Qualification | undefined> => db.qualifications.find(q => q.id === id),
  submitQualificationLead: async (data: any): Promise<QualificationLead> => ({ ...data, id: 'ql', timestamp: new Date().toISOString(), status: 'New', trackingId: 'tr' }),
  submitTestBooking: async (data: any): Promise<TestBooking> => ({ ...data, id: 'bk', trackingRef: 'ref' }),
  verifyEmail: async (email: string): Promise<void> => {}
};
