
import * as db from './db';
import { MailService } from './mailService';
import { 
  Product, VoucherCode, Order, User, LMSCourse, 
  LMSModule, Enrollment, TestResult, ManualSubmission, UserRole, 
  Lead, OrderStatus, BusinessMetrics,
  University, CountryGuide, Course, Qualification, ImmigrationGuideData,
  QualificationLead, TestBooking, LMSPracticeTest
} from '../types';

const SESSION_KEY = 'unicou_active_session_v9';
const ORDERS_KEY = 'unicou_orders_v9';
const USERS_KEY = 'unicou_local_users_v9';
const CODES_KEY = 'unicou_inventory_vault_v9';
const LMS_ENROLLMENTS_KEY = 'unicou_lms_enrollments_v9';
const LEADS_KEY = 'unicou_leads_v9';
const PRODUCTS_KEY = 'unicou_catalog_v9';
const SYSTEM_CONFIG_KEY = 'unicou_global_config_v1';
const LMS_PROGRESS_KEY = 'unicou_lms_progress_v9';

export const api = {
  // --- SYSTEM CONFIG ---
  getSystemHaltStatus: (): boolean => localStorage.getItem(SYSTEM_CONFIG_KEY) === 'HALTED',
  setSystemHaltStatus: (halted: boolean): void => localStorage.setItem(SYSTEM_CONFIG_KEY, halted ? 'HALTED' : 'ACTIVE'),

  getBusinessMetrics: async (): Promise<BusinessMetrics> => {
    const orders = await api.getOrders();
    const users = await api.getUsers();
    const codes = await api.getCodes();
    const approved = orders.filter(o => o.status === 'Approved');
    return {
      todaySales: approved.reduce((s,o) => s + (o.totalAmount || 0), 0),
      monthRevenue: approved.reduce((s,o) => s + (o.totalAmount || 0), 0),
      vouchersInStock: codes.filter(c => c.status === 'Available').length,
      activeAgents: users.filter(u => u.role === 'Agent').length,
      riskAlerts: orders.filter(o => o.status === 'Hold').length,
      refundRequests: orders.filter(o => o.status === 'RefundRequested').length,
      systemHealth: 'Optimal',
      systemHalt: api.getSystemHaltStatus()
    };
  },

  // --- USER AUTH ---
  getUsers: async (): Promise<User[]> => {
    const local = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return [...db.users, ...local.filter((l: User) => !db.users.find(u => u.email === l.email))];
  },

  verifyLogin: async (id: string, p: string): Promise<User> => {
    const users = await api.getUsers();
    const user = users.find(u => u.email.toLowerCase() === id.toLowerCase());
    if (user) {
      if (p !== '123456' && p !== 'admin' && p !== 'student') throw new Error("Invalid Credentials.");
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    }
    throw new Error("Unauthorized Access.");
  },

  upsertUser: async (userData: Partial<User>): Promise<void> => {
    const local = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const index = local.findIndex((u: User) => u.id === userData.id);
    if (index > -1) local[index] = { ...local[index], ...userData };
    else local.push({ ...userData, id: `u-${Date.now()}`, status: 'Active', verified: true, isAuthorized: true } as User);
    localStorage.setItem(USERS_KEY, JSON.stringify(local));
  },

  // --- VOUCHERS & PRODUCTS ---
  getProducts: async (): Promise<Product[]> => {
    const local = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
    const codes = await api.getCodes();
    const combined = [...db.products, ...local];
    const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
    return unique.map(p => ({
      ...p,
      stockCount: codes.filter(c => c.productId === p.id && c.status === 'Available').length
    }));
  },

  upsertProduct: async (p: Product): Promise<void> => {
    const local = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
    const index = local.findIndex((item: Product) => item.id === p.id);
    if (index > -1) local[index] = p;
    else local.push(p);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(local));
  },

  addStockToProduct: async (productId: string, codes: string[]): Promise<void> => {
    const all = await api.getCodes();
    const newEntries: VoucherCode[] = codes.map(code => ({
      id: `vc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      productId,
      code: code.trim().toUpperCase(),
      status: 'Available',
      expiryDate: '2026-12-31',
      uploadDate: new Date().toISOString()
    }));
    localStorage.setItem(CODES_KEY, JSON.stringify([...all, ...newEntries]));
  },

  assignCodesToOrder: async (order: Order): Promise<string[]> => {
    const allCodes = await api.getCodes();
    const available = allCodes.filter(c => c.productId === order.productId && c.status === 'Available');
    const qty = order.quantity || 1;
    if (available.length < qty) return [];
    const assigned = available.slice(0, qty);
    const codes: string[] = [];
    assigned.forEach(c => {
      c.status = 'Used';
      c.orderId = order.id;
      c.buyerName = order.buyerName;
      c.assignmentDate = new Date().toISOString();
      codes.push(c.code);
    });
    localStorage.setItem(CODES_KEY, JSON.stringify(allCodes));
    return codes;
  },

  // --- LMS HUB ---
  getAllLMSCourses: async (): Promise<LMSCourse[]> => db.lmsCourses,
  getEnrolledCourses: async (): Promise<LMSCourse[]> => {
    const local = JSON.parse(localStorage.getItem(LMS_ENROLLMENTS_KEY) || '[]');
    return db.lmsCourses.filter(c => local.includes(c.id));
  },

  getCourseModules: async (courseId: string): Promise<LMSModule[]> => {
    return [
      { 
        id: `m1-${courseId}`, 
        title: 'Section 1: Fundamental Strategy', 
        lessons: [
          { id: `l1-${courseId}`, title: 'Platform Orientation', type: 'Text', content: '### Welcome Student\nWelcome to the UNICOU Hub. This module establishes your academic baseline.' },
          { id: `l2-${courseId}`, title: 'Introduction to Exam Logic', type: 'Text', content: '### Strategy Node\nLearn the core timing protocols required for high-stakes English testing.' }
        ] 
      }
    ];
  },

  getEnrollmentByCourse: async (courseId: string): Promise<Enrollment | null> => {
    const allProgress = JSON.parse(localStorage.getItem(LMS_PROGRESS_KEY) || '{}');
    return { courseId, userId: 'current', progress: allProgress[courseId] || 0 };
  },

  updateCourseProgress: async (courseId: string, progress: number): Promise<void> => {
    const allProgress = JSON.parse(localStorage.getItem(LMS_PROGRESS_KEY) || '{}');
    allProgress[courseId] = progress;
    localStorage.setItem(LMS_PROGRESS_KEY, JSON.stringify(allProgress));
  },

  redeemCourseVoucher: async (code: string): Promise<void> => {
    const enrollments = JSON.parse(localStorage.getItem(LMS_ENROLLMENTS_KEY) || '[]');
    if (code.toUpperCase().includes('UNLOCK') || code.toUpperCase() === 'PTE100' || code.toUpperCase() === 'IELTS100') {
      enrollments.push(db.lmsCourses[0].id);
      if (code.toUpperCase() === 'IELTS100') enrollments.push(db.lmsCourses[1]?.id);
    } else {
      throw new Error("Invalid Code.");
    }
    localStorage.setItem(LMS_ENROLLMENTS_KEY, JSON.stringify([...new Set(enrollments)]));
  },

  // --- ORDERS ---
  getOrders: async (): Promise<Order[]> => JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'),
  getOrderById: async (id: string): Promise<Order | null> => (await api.getOrders()).find(o => o.id === id) || null,

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<void> => {
    const all = await api.getOrders();
    const idx = all.findIndex(o => o.id === orderId);
    if (idx > -1) {
      if (status === 'Approved' && all[idx].status !== 'Approved') {
        const assigned = await api.assignCodesToOrder(all[idx]);
        all[idx].voucherCodes = assigned;
        all[idx].deliveryTime = new Date().toLocaleTimeString();
      }
      all[idx].status = status;
      localStorage.setItem(ORDERS_KEY, JSON.stringify(all));
    }
  },

  submitBankTransfer: async (productId: string, quantity: number, email: string, buyerName: string, bankRef: string, bankLastFour: string): Promise<Order> => {
    const p = await api.getProductById(productId);
    const order: Order = {
      id: `UNICOU-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
      date: new Date().toLocaleDateString('en-GB'),
      time: new Date().toLocaleTimeString('en-GB'),
      buyerName, bankLastFour, bankRef,
      productName: p?.name || 'Asset',
      totalAmount: (p?.basePrice || 0) * quantity,
      proofAttached: true, userId: 'u-session',
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
    const p = await api.getProductById(productId);
    const order: Order = {
      id: `UNICOU-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
      date: new Date().toLocaleDateString('en-GB'),
      time: new Date().toLocaleTimeString('en-GB'),
      buyerName, bankLastFour, bankRef: 'AUTO_Fulfillment',
      productName: p?.name || 'Asset',
      totalAmount: (p?.basePrice || 0) * quantity,
      proofAttached: true, userId: 'u-session',
      productId, currency: p?.currency || 'USD',
      customerEmail: email, status: 'Approved',
      paymentMethod: 'Gateway', timestamp: new Date().toISOString(),
      voucherCodes: [], quantity
    };
    order.voucherCodes = await api.assignCodesToOrder(order);
    const all = await api.getOrders();
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...all]));
    return order;
  },

  getCurrentUser: (): User | null => {
    const s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  },
  logout: () => localStorage.removeItem(SESSION_KEY),
  getCodes: async (): Promise<VoucherCode[]> => JSON.parse(localStorage.getItem(CODES_KEY) || '[]'),
  getProductById: async (id: string): Promise<Product | undefined> => (await api.getProducts()).find(p => p.id === id),
  getAllTests: async (): Promise<LMSPracticeTest[]> => db.lmsTests,
  getTestById: async (id: string): Promise<LMSPracticeTest | undefined> => db.lmsTests.find(t => t.id === id),
  getTestResults: async (): Promise<TestResult[]> => [],
  submitTestResult: async (tid: string, a: any, t: number): Promise<TestResult> => ({ id: `R-${Date.now()}`, overallBand: 'B2', skillScores: [], testTitle: 'Mock', testId: tid, timeTaken: t, timestamp: new Date().toISOString(), userId: 'u' }),
  getPendingSubmissions: async (): Promise<ManualSubmission[]> => [],
  gradeSubmission: async (id: string, s: number, f: string): Promise<void> => {},
  getGuideBySlug: async (s: string): Promise<CountryGuide | null> => db.countryGuides.find(g => g.slug === s) || null,
  getLeads: async (): Promise<Lead[]> => JSON.parse(localStorage.getItem(LEADS_KEY) || '[]'),
  submitLead: async (t: string, d: any): Promise<void> => {
     const all = await api.getLeads();
     const nl = { id: `L-${Date.now()}`, type: t as any, data: d, status: 'New', timestamp: new Date().toISOString() };
     localStorage.setItem(LEADS_KEY, JSON.stringify([nl, ...all]));
  },
  getUniversities: async (): Promise<University[]> => db.universities,
  getUniversitiesByCountry: async (cid: string): Promise<University[]> => db.universities.filter(u => u.countryId === cid),
  getUniversityBySlug: async (s: string): Promise<University | undefined> => db.universities.find(u => u.slug === s),
  getCoursesByUniversity: async (uid: string): Promise<Course[]> => db.courses.filter(c => c.universityId === uid),
  signup: async (email: string, role: UserRole): Promise<User> => {
    const u: User = { id: `u-${Date.now()}`, name: email.split('@')[0], email, role, status: 'Active', verified: true, isAuthorized: true };
    await api.upsertUser(u);
    return u;
  },
  getQualifications: async (): Promise<Qualification[]> => db.qualifications,
  getQualificationById: async (id: string): Promise<Qualification | undefined> => db.qualifications.find(q => q.id === id),
  getImmigrationGuides: async (): Promise<ImmigrationGuideData[]> => db.immigrationGuides,
  submitQualificationLead: async (d: any) => ({ ...d, id: `QL-${Date.now()}`, timestamp: new Date().toISOString() }),
  submitTestBooking: async (d: any) => ({ ...d, id: `TB-${Date.now()}`, timestamp: new Date().toISOString() }),
  verifyEmail: async (e: string): Promise<void> => {},
  deleteUser: async (id: string) => {
    const local = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    localStorage.setItem(USERS_KEY, JSON.stringify(local.filter((u: any) => u.id !== id)));
  },
  deleteProduct: async (id: string) => {
    const local = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(local.filter((p: any) => p.id !== id)));
  }
};
