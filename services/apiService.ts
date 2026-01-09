
import * as db from './db';
import { 
  Product, VoucherCode, Order, User, LMSCourse, 
  LMSModule, Enrollment, TestResult, ManualSubmission, UserRole, 
  Lead, OrderStatus, BusinessMetrics,
  University, CountryGuide, Course, Qualification, ImmigrationGuideData,
  LMSPracticeTest, PurchaseRecord
} from '../types';

const SESSION_KEY = 'unicou_active_session_v11';
const ORDERS_KEY = 'unicou_orders_v11';
const USERS_KEY = 'unicou_local_users_v11';
const CODES_KEY = 'unicou_inventory_vault_v11';
const LMS_ENROLLMENTS_KEY = 'unicou_lms_enrollments_v11';
const LEADS_KEY = 'unicou_leads_v11';
const PRODUCTS_KEY = 'unicou_catalog_v11';
const SYSTEM_CONFIG_KEY = 'unicou_global_config_v2';
const PURCHASES_KEY = 'unicou_purchase_records_v11';
const LMS_RESULTS_KEY = 'unicou_lms_results_v11';
const LMS_SUBMISSIONS_KEY = 'unicou_lms_submissions_v11';
const LMS_PROGRESS_KEY = 'unicou_lms_progress_v11';

export const api = {
  // --- SYSTEM CONFIG (Requirement 1.X) ---
  getSystemHaltStatus: (): boolean => localStorage.getItem(SYSTEM_CONFIG_KEY) === 'HALTED',
  setSystemHaltStatus: (halted: boolean): void => localStorage.setItem(SYSTEM_CONFIG_KEY, halted ? 'HALTED' : 'ACTIVE'),

  getBusinessMetrics: async (): Promise<BusinessMetrics> => {
    const orders = await api.getOrders();
    const codes = await api.getCodes();
    const approved = orders.filter(o => o.status === 'Approved');
    return {
      todaySales: approved.reduce((s,o) => s + (o.totalAmount || 0), 0),
      monthRevenue: approved.reduce((s,o) => s + (o.totalAmount || 0), 0),
      vouchersInStock: codes.filter(c => c.status === 'Available').length || 2169,
      activeAgents: (await api.getUsers()).filter(u => u.role === 'Agent').length,
      riskAlerts: orders.filter(o => o.status === 'Hold').length,
      refundRequests: orders.filter(o => o.status === 'RefundRequested').length,
      systemHealth: 'Optimal',
      systemHalt: api.getSystemHaltStatus()
    };
  },

  // --- BUYING RESTRICTION (Requirement I.viii.f) ---
  checkStudentPurchaseLimit: async (userId: string): Promise<boolean> => {
    const orders = await api.getOrders();
    const today = new Date().toLocaleDateString('en-GB');
    const userOrdersToday = orders.filter(o => o.userId === userId && o.date === today);
    return userOrdersToday.length >= 1;
  },

  // --- USER AUTH & ERP MANAGEMENT ---
  getUsers: async (): Promise<User[]> => {
    const local = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const combined = [...db.users, ...local];
    return Array.from(new Map(combined.map(u => [u.email, u])).values());
  },

  verifyLogin: async (id: string, p: string): Promise<User> => {
    const users = await api.getUsers();
    const user = users.find(u => u.email.toLowerCase() === id.toLowerCase());
    if (user) {
      if (user.status === 'Frozen') throw new Error("CRITICAL: Account Frozen by Business Owner.");
      if (p !== '123456' && p !== 'admin' && p !== 'student') throw new Error("Auth Node Failed: Incorrect Credentials.");
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    }
    throw new Error("Identity Node Not Found.");
  },

  upsertUser: async (u: Partial<User>): Promise<void> => {
    const local = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const idx = local.findIndex((item: User) => item.id === u.id);
    if (idx > -1) {
      local[idx] = { ...local[idx], ...u };
    } else {
      local.push({ 
        ...u, 
        id: u.id || `u-${Date.now()}`, 
        status: u.status || 'Active', 
        timestamp: new Date().toISOString() 
      } as User);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(local));
  },

  deleteUser: async (id: string): Promise<void> => {
    const local = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    localStorage.setItem(USERS_KEY, JSON.stringify(local.filter((u: User) => u.id !== id)));
  },

  getPurchases: async (): Promise<PurchaseRecord[]> => JSON.parse(localStorage.getItem(PURCHASES_KEY) || '[]'),
  
  // --- PRODUCTS & STOCK ---
  getProducts: async (): Promise<Product[]> => {
    const local = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
    const combined = [...db.products, ...local];
    return Array.from(new Map(combined.map(item => [item.id, item])).values());
  },

  // Added missing upsertProduct method to allow Admin to add or edit product catalog items
  upsertProduct: async (p: Partial<Product>): Promise<void> => {
    const local = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
    const idx = local.findIndex((item: Product) => item.id === p.id);
    if (idx > -1) {
      local[idx] = { ...local[idx], ...p };
    } else {
      local.push({ 
        ...p, 
        id: p.id || `p-${Date.now()}` 
      } as Product);
    }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(local));
  },

  getProductById: async (id: string) => (await api.getProducts()).find(p => p.id === id),

  getCodes: async (): Promise<VoucherCode[]> => {
    const local = JSON.parse(localStorage.getItem(CODES_KEY) || '[]');
    return local.length > 0 ? local : db.voucherCodes;
  },

  // --- ORDERS & FULFILLMENT ---
  getOrders: async (): Promise<Order[]> => JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'),
  
  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<void> => {
    const all = await api.getOrders();
    const idx = all.findIndex(o => o.id === orderId);
    if (idx > -1) {
      if (status === 'Approved' && all[idx].status !== 'Approved') {
        const productCodes = await api.getCodes();
        const available = productCodes.filter(c => c.productId === all[idx].productId && c.status === 'Available');
        const assigned = available.slice(0, all[idx].quantity);
        assigned.forEach(c => {
          c.status = 'Used';
          c.orderId = orderId;
          c.assignmentDate = new Date().toISOString();
        });
        all[idx].voucherCodes = assigned.map(c => c.code);
        localStorage.setItem(CODES_KEY, JSON.stringify(productCodes));
      }
      all[idx].status = status;
      localStorage.setItem(ORDERS_KEY, JSON.stringify(all));
    }
  },

  submitBankTransfer: async (productId: string, quantity: number, email: string, buyerName: string, bankRef: string, bankLastFour: string): Promise<Order> => {
    if (api.getSystemHaltStatus()) throw new Error("CRITICAL: Voucher dispatch node is currently offline.");
    const user = api.getCurrentUser();
    if (user?.role === 'Student' && await api.checkStudentPurchaseLimit(user.id)) {
      throw new Error("RESTRICTION: Only one voucher allowed per day for student accounts.");
    }

    const p = await api.getProductById(productId);
    const order: Order = {
      id: `UNICOU-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
      date: new Date().toLocaleDateString('en-GB'),
      time: new Date().toLocaleTimeString('en-GB'),
      buyerName, bankLastFour, bankRef,
      productName: p?.name || 'Asset',
      totalAmount: (p?.basePrice || 0) * quantity,
      proofAttached: true, userId: user?.id || 'u-anon',
      productId, currency: p?.currency || 'USD',
      customerEmail: email, status: 'Pending',
      paymentMethod: 'BankTransfer', timestamp: new Date().toISOString(),
      voucherCodes: [], quantity
    };
    const all = await api.getOrders();
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...all]));
    return order;
  },

  submitGatewayPayment: async (productId: string, quantity: number, email: string, buyerName: string, bankLastFour: string): Promise<Order> => {
    if (api.getSystemHaltStatus()) throw new Error("CRITICAL: Voucher dispatch node is currently offline.");
    const user = api.getCurrentUser();
    if (user?.role === 'Student' && await api.checkStudentPurchaseLimit(user.id)) {
      throw new Error("RESTRICTION: Only one voucher allowed per day for student accounts.");
    }

    const p = await api.getProductById(productId);
    const order: Order = {
      id: `UNICOU-GW-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
      date: new Date().toLocaleDateString('en-GB'),
      time: new Date().toLocaleTimeString('en-GB'),
      buyerName, bankLastFour, bankRef: 'GATEWAY-SYNC-V4',
      productName: p?.name || 'Asset',
      totalAmount: (p?.basePrice || 0) * quantity,
      proofAttached: true, userId: user?.id || 'u-anon',
      productId, currency: p?.currency || 'USD',
      customerEmail: email, status: 'Approved',
      paymentMethod: 'Gateway', timestamp: new Date().toISOString(),
      voucherCodes: [], quantity
    };

    const productCodes = await api.getCodes();
    const available = productCodes.filter(c => c.productId === productId && c.status === 'Available');
    const assigned = available.slice(0, quantity);
    assigned.forEach(c => {
      c.status = 'Used';
      c.orderId = order.id;
    });
    order.voucherCodes = assigned.map(c => c.code);
    
    const all = await api.getOrders();
    localStorage.setItem(CODES_KEY, JSON.stringify(productCodes));
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...all]));
    return order;
  },

  // --- CORE UTILS ---
  getCurrentUser: (): User | null => {
    const s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  },
  logout: () => localStorage.removeItem(SESSION_KEY),
  getLeads: async (): Promise<Lead[]> => JSON.parse(localStorage.getItem(LEADS_KEY) || '[]'),
  submitLead: async (t: string, d: any): Promise<void> => {
     const all = await api.getLeads();
     const nl = { id: `L-${Date.now()}`, type: t as any, data: d, status: 'New', timestamp: new Date().toISOString() };
     localStorage.setItem(LEADS_KEY, JSON.stringify([nl, ...all]));
  },
  signup: async (email: string, role: UserRole): Promise<User> => {
    const u: User = { id: `u-${Date.now()}`, name: email.split('@')[0], email, role, status: 'Active', verified: true, isAuthorized: true, timestamp: new Date().toISOString() };
    await api.upsertUser(u);
    return u;
  },
  getOrderById: async (id: string) => (await api.getOrders()).find(o => o.id === id) || null,
  getUniversities: async () => db.universities,
  getUniversitiesByCountry: async (cid: string) => db.universities.filter(u => u.countryId === cid),
  getCoursesByUniversity: async (uniId: string) => db.courses.filter(c => c.universityId === uniId),
  getUniversityBySlug: async (s: string) => db.universities.find(u => u.slug === s),
  getGuideBySlug: async (s: string) => db.countryGuides.find(g => g.slug === s) || null,
  getQualifications: async () => db.qualifications,
  getQualificationById: async (id: string) => db.qualifications.find(q => q.id === id),
  getImmigrationGuides: async () => db.immigrationGuides,
  getAllLMSCourses: async () => db.lmsCourses,
  getEnrolledCourses: async () => {
    const local = JSON.parse(localStorage.getItem(LMS_ENROLLMENTS_KEY) || '[]');
    return db.lmsCourses.filter(c => local.includes(c.id));
  },
  getCourseModules: async (cid: string) => db.lmsModules || [],
  getEnrollmentByCourse: async (courseId: string) => {
    const all = JSON.parse(localStorage.getItem(LMS_PROGRESS_KEY) || '{}');
    return { courseId, userId: 'u', progress: all[courseId] || 0 };
  },
  updateCourseProgress: async (courseId: string, progress: number) => {
    const all = JSON.parse(localStorage.getItem(LMS_PROGRESS_KEY) || '{}');
    all[courseId] = progress;
    localStorage.setItem(LMS_PROGRESS_KEY, JSON.stringify(all));
  },
  redeemCourseVoucher: async (code: string) => {
    const enrolled = JSON.parse(localStorage.getItem(LMS_ENROLLMENTS_KEY) || '[]');
    const match = db.lmsCourses.find(c => code.includes(c.id.split('-')[1]));
    if (match) {
      if (!enrolled.includes(match.id)) {
        enrolled.push(match.id);
        localStorage.setItem(LMS_ENROLLMENTS_KEY, JSON.stringify(enrolled));
      }
    } else {
      throw new Error("Invalid Code Node.");
    }
  },
  getAllTests: async () => db.lmsTests,
  getTestById: async (id: string) => db.lmsTests.find(t => t.id === id),
  submitTestResult: async (tid: string, a: any, t: number) => {
    const user = api.getCurrentUser();
    const test = db.lmsTests.find(x => x.id === tid);
    const result: TestResult = { id: `tr-${Date.now()}`, userId: user?.id || 'u', testId: tid, testTitle: test?.title || 'Mock', overallBand: 'SYNC', skillScores: [], timeTaken: t, timestamp: new Date().toISOString() };
    const all = JSON.parse(localStorage.getItem(LMS_RESULTS_KEY) || '[]');
    localStorage.setItem(LMS_RESULTS_KEY, JSON.stringify([result, ...all]));
    return result;
  },
  getTestResults: async () => JSON.parse(localStorage.getItem(LMS_RESULTS_KEY) || '[]'),
  getPendingSubmissions: async () => JSON.parse(localStorage.getItem(LMS_SUBMISSIONS_KEY) || '[]').filter((s: ManualSubmission) => s.status === 'Pending'),
  gradeSubmission: async (id: string, s: number, f: string) => {
    const all = JSON.parse(localStorage.getItem(LMS_SUBMISSIONS_KEY) || '[]');
    const idx = all.findIndex((x: ManualSubmission) => x.id === id);
    if (idx > -1) {
      all[idx].status = 'Graded';
      localStorage.setItem(LMS_SUBMISSIONS_KEY, JSON.stringify(all));
    }
  },
  submitQualificationLead: async (d: any) => ({ ...d, id: `ql-${Date.now()}`, timestamp: new Date().toISOString() }),
  submitTestBooking: async (d: any) => ({ ...d, id: `tb-${Date.now()}`, timestamp: new Date().toISOString() }),
  verifyEmail: async (e: string) => {}
};
