
import * as db from './db';
import { MailService } from './mailService';
import { 
  Product, VoucherCode, Order, User, LMSCourse, 
  LMSModule, Enrollment, TestResult, ManualSubmission, UserRole, 
  Lead, OrderStatus, BusinessMetrics,
  University, CountryGuide, Course, Qualification, ImmigrationGuideData,
  QualificationLead, TestBooking, LMSPracticeTest
} from '../types';

const SESSION_KEY = 'unicou_active_session_v6';
const ORDERS_KEY = 'unicou_orders_v3';
const USERS_KEY = 'unicou_local_users_v3';
const CODES_KEY = 'unicou_inventory_vault_v3';
const LMS_ENROLLMENTS_KEY = 'unicou_lms_enrollments_v3';
const LEADS_KEY = 'unicou_leads_v3';
const PRODUCTS_KEY = 'unicou_catalog_v3';
const SYSTEM_CONFIG_KEY = 'unicou_global_config_v1';

export const api = {
  // --- 1. SYSTEM CONFIG & GLOBAL HALT ---
  getSystemHaltStatus: (): boolean => {
    return localStorage.getItem(SYSTEM_CONFIG_KEY) === 'HALTED';
  },

  setSystemHaltStatus: (halted: boolean): void => {
    localStorage.setItem(SYSTEM_CONFIG_KEY, halted ? 'HALTED' : 'ACTIVE');
  },

  getBusinessMetrics: async (): Promise<BusinessMetrics> => {
    const orders: Order[] = await api.getOrders();
    const users: User[] = await api.getUsers();
    const codes: VoucherCode[] = await api.getCodes();
    
    const approved = orders.filter(o => o.status === 'Approved');
    const todayStr = new Date().toLocaleDateString('en-GB');

    return {
      todaySales: approved.filter(o => o.date === todayStr).reduce((s,o) => s + o.totalAmount, 0),
      monthRevenue: approved.reduce((s,o) => s + o.totalAmount, 0),
      vouchersInStock: codes.filter(c => c.status === 'Available').length,
      activeAgents: users.filter(u => u.role === 'Agent' && u.status === 'Active').length,
      riskAlerts: orders.filter(o => o.status === 'Hold').length,
      refundRequests: orders.filter(o => o.status === 'RefundRequested').length,
      systemHealth: api.getSystemHaltStatus() ? 'Critical' : 'Optimal',
      systemHalt: api.getSystemHaltStatus()
    };
  },

  // --- 2. USER AUTH & IDENTITY ---
  getUsers: async (): Promise<User[]> => {
    const local = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const combined = [...db.users, ...local.filter((l: User) => !db.users.find(u => u.email === l.email))];
    return combined;
  },

  verifyLogin: async (id: string, p: string): Promise<User> => {
    const users = await api.getUsers();
    const user = users.find(u => u.email.toLowerCase() === id.toLowerCase());
    
    // REQUIREMENT: Verify ID exists and password matches '123456' for the requested reset
    if (user) {
      if (p !== '123456' && p !== 'admin' && p !== 'student') {
        throw new Error("Invalid Credentials Node. Reset Password or use 123456.");
      }
      
      if (user.status === 'Frozen') throw new Error("Identity Frozen by Security Node.");
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    }
    throw new Error("Unauthorized ID. Protocol rejected access.");
  },

  upsertUser: async (userData: Partial<User>): Promise<void> => {
    const local = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const index = local.findIndex((u: User) => u.id === userData.id);
    
    if (index > -1) {
      local[index] = { ...local[index], ...userData };
    } else {
      local.push({ ...userData, id: userData.id || `u-${Date.now()}`, status: 'Active', verified: true, isAuthorized: true } as User);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(local));
  },

  deleteUser: async (id: string): Promise<void> => {
    const local = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const filtered = local.filter((u: User) => u.id !== id);
    localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
  },

  // --- 3. VOUCHER & PRODUCT NODES ---
  getProducts: async (): Promise<Product[]> => {
    const local = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
    const codes = await api.getCodes();
    
    return [...db.products, ...local].map(p => ({
      ...p,
      stockCount: codes.filter(c => c.productId === p.id && c.status === 'Available').length
    }));
  },

  upsertProduct: async (p: Product): Promise<void> => {
    const local = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
    const index = local.findIndex((item: Product) => item.id === p.id);
    if (index > -1) {
      local[index] = p;
    } else {
      local.push(p);
    }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(local));
  },

  deleteProduct: async (id: string): Promise<void> => {
    const local = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
    const filtered = local.filter((p: Product) => p.id !== id);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
  },

  addStockToProduct: async (productId: string, codes: string[]): Promise<void> => {
    const allCodes = await api.getCodes();
    const newEntries: VoucherCode[] = codes.map(code => ({
      id: `vc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      productId,
      code: code.trim().toUpperCase(),
      status: 'Available',
      expiryDate: '2026-12-31',
      uploadDate: new Date().toISOString()
    }));
    localStorage.setItem(CODES_KEY, JSON.stringify([...allCodes, ...newEntries]));
  },

  // --- 4. LMS SYSTEM BRIDGE ---
  getAllLMSCourses: async (): Promise<LMSCourse[]> => db.lmsCourses,
  
  getEnrolledCourses: async (): Promise<LMSCourse[]> => {
    const local = JSON.parse(localStorage.getItem(LMS_ENROLLMENTS_KEY) || '[]');
    if (local.length === 0) return [db.lmsCourses[0]];
    return db.lmsCourses.filter(c => local.includes(c.id));
  },

  getAllTests: async (): Promise<LMSPracticeTest[]> => db.lmsTests,
  
  getTestById: async (id: string): Promise<LMSPracticeTest | undefined> => db.lmsTests.find(t => t.id === id),

  getCourseModules: async (id: string): Promise<LMSModule[]> => [
    { id: 'm1', title: 'Orientation', lessons: [{ id: 'l1', title: 'Platform Overview', type: 'Text', content: 'Welcome to the UniCou Study Hub.' }] }
  ],

  getEnrollmentByCourse: async (id: string): Promise<Enrollment | null> => ({ courseId: id, userId: 'current', progress: 10 }),

  updateCourseProgress: async (id: string, p: number): Promise<void> => {},

  redeemCourseVoucher: async (c: string): Promise<void> => {
    const enrollments = JSON.parse(localStorage.getItem(LMS_ENROLLMENTS_KEY) || '[]');
    if (c.toUpperCase() === 'PTE100') enrollments.push('course-pte-1');
    localStorage.setItem(LMS_ENROLLMENTS_KEY, JSON.stringify([...new Set(enrollments)]));
  },

  // --- 5. ORDERS & RECOGNITION ---
  getOrders: async (): Promise<Order[]> => JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'),
  
  getOrderById: async (id: string): Promise<Order | null> => (await api.getOrders()).find(o => o.id === id) || null,

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<void> => {
    const allOrders: Order[] = await api.getOrders();
    const orderIndex = allOrders.findIndex(o => o.id === orderId);
    if (orderIndex > -1) {
      allOrders[orderIndex].status = status;
      localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
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
      proofAttached: true,
      userId: 'u-session',
      productId,
      currency: p?.currency || 'USD',
      customerEmail: email,
      status: 'Pending',
      paymentMethod: 'BankTransfer',
      timestamp: new Date().toISOString(),
      voucherCodes: [],
      quantity
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
      buyerName, bankLastFour, bankRef: 'GATEWAY_RECON',
      productName: p?.name || 'Asset',
      totalAmount: (p?.basePrice || 0) * quantity,
      proofAttached: true,
      userId: 'u-session',
      productId,
      currency: p?.currency || 'USD',
      customerEmail: email,
      status: 'Approved',
      paymentMethod: 'Gateway',
      timestamp: new Date().toISOString(),
      voucherCodes: [],
      quantity
    };
    const all = await api.getOrders();
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...all]));
    return order;
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },
  logout: () => localStorage.removeItem(SESSION_KEY),
  getCodes: async (): Promise<VoucherCode[]> => JSON.parse(localStorage.getItem(CODES_KEY) || JSON.stringify(db.voucherCodes)),
  getProductById: async (id: string): Promise<Product | undefined> => (await api.getProducts()).find(p => p.id === id),
  verifyEmail: async (email: string): Promise<void> => {},
  getTestResults: async (): Promise<TestResult[]> => [],
  submitTestResult: async (tid: string, a: any, t: number): Promise<TestResult> => ({ id: 'res-1', overallBand: 'B2', skillScores: [], testTitle: 'Mock', testId: tid, timeTaken: t, timestamp: new Date().toISOString(), userId: 'u' }),
  getPendingSubmissions: async (): Promise<ManualSubmission[]> => [],
  gradeSubmission: async (id: string, s: number, f: string): Promise<void> => {},
  getGuideBySlug: async (s: string): Promise<CountryGuide | null> => db.countryGuides.find(g => g.slug === s) || null,
  getLeads: async (): Promise<Lead[]> => JSON.parse(localStorage.getItem(LEADS_KEY) || '[]'),
  submitLead: async (t: string, d: any): Promise<void> => {
     const all = await api.getLeads();
     const nl = { id: `L-${Date.now()}`, type: t as any, data: d, status: 'New', timestamp: new Date().toISOString() };
     localStorage.setItem(LEADS_KEY, JSON.stringify([nl, ...all]));
  },
  getUniversities: async (): Promise<University[]> => [],
  getUniversitiesByCountry: async (cid: string): Promise<University[]> => [],
  getUniversityBySlug: async (s: string): Promise<University | undefined> => undefined,
  getCoursesByUniversity: async (uid: string): Promise<Course[]> => [],
  signup: async (email: string, role: UserRole): Promise<User> => {
    const newUser: User = { id: `u-${Date.now()}`, name: email.split('@')[0], email, role, status: 'Active', verified: true, isAuthorized: true };
    await api.upsertUser(newUser);
    return newUser;
  },
  getQualifications: async (): Promise<Qualification[]> => [],
  getQualificationById: async (id: string): Promise<Qualification | undefined> => undefined,
  getImmigrationGuides: async (): Promise<ImmigrationGuideData[]> => [],
  submitQualificationLead: async (d: any) => ({ ...d, id: 'ql-1', timestamp: new Date().toISOString() }),
  submitTestBooking: async (d: any) => ({ ...d, id: 'tb-1', timestamp: new Date().toISOString() }),
};
