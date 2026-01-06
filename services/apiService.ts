
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
const LMS_COURSES_KEY = 'unicou_lms_courses_v3';
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
      refundRequests: 0,
      systemHealth: api.getSystemHaltStatus() ? 'Critical' : 'Optimal',
      systemHalt: api.getSystemHaltStatus()
    };
  },

  // --- 2. MANDATORY ORDER PROCESSING ---
  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<void> => {
    const allOrders: Order[] = await api.getOrders();
    const orderIndex = allOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;
    
    if (status === 'Approved') {
      await api.fulfillOrder(orderId);
    } else {
      allOrders[orderIndex].status = status;
      localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
    }
  },

  fulfillOrder: async (orderId: string): Promise<void> => {
    const allOrders: Order[] = await api.getOrders();
    const orderIndex = allOrders.findIndex(o => o.id === orderId);
    const order = allOrders[orderIndex];
    if (!order || order.status === 'Approved') return;

    const allCodes = await api.getCodes();
    const targetCodes = allCodes.filter(c => c.productId === order.productId && c.status === 'Available').slice(0, order.quantity);
    
    if (targetCodes.length < order.quantity) {
      throw new Error("Vault Exhausted: Insufficient stock for fulfillment.");
    }

    const assigned = targetCodes.map(c => c.code);
    const updatedCodes = allCodes.map(c => assigned.includes(c.code) ? { ...c, status: 'Used' as const, orderId: order.id } : c);
    localStorage.setItem(CODES_KEY, JSON.stringify(updatedCodes));

    allOrders[orderIndex] = { 
      ...order, 
      status: 'Approved', 
      voucherCodes: assigned, 
      deliveryTime: new Date().toLocaleTimeString('en-GB'),
      supportAgentName: 'Admin System'
    };
    localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
    await MailService.sendOrderStatusEmail(order.buyerName, order.customerEmail, order.id, 'Approved', assigned);
  },

  // --- 3. VOUCHER STOCK & INJECTION ---
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

  // --- 4. PRODUCT & CATALOG MANAGEMENT ---
  getProducts: async (): Promise<Product[]> => {
    const local = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
    // Filter to ensure no duplicates between DB and Local
    const dbIds = db.products.map(p => p.id);
    return [...db.products, ...local.filter((p: Product) => !dbIds.includes(p.id))];
  },

  upsertProduct: async (product: Product): Promise<void> => {
    const local = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
    const index = local.findIndex((p: Product) => p.id === product.id);
    if (index > -1) {
      local[index] = product;
    } else {
      local.push(product);
    }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(local));
  },

  deleteProduct: async (id: string): Promise<void> => {
    const local = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(local.filter((p: Product) => p.id !== id)));
  },

  // --- 5. STAFF & USER GOVERNANCE ---
  upsertUser: async (userData: Partial<User>): Promise<void> => {
    const users = await api.getUsers();
    let updated;
    if (userData.id) {
      updated = users.map(u => u.id === userData.id ? { ...u, ...userData } as User : u);
    } else {
      updated = [...users, { ...userData, id: `u-${Date.now()}`, status: 'Active', verified: true, isAuthorized: true } as User];
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));
  },

  deleteUser: async (id: string): Promise<void> => {
    const users = await api.getUsers();
    localStorage.setItem(USERS_KEY, JSON.stringify(users.filter(u => u.id !== id)));
  },

  // --- 6. PROCUREMENT TERMINAL LOGIC ---
  submitBankTransfer: async (productId: string, quantity: number, email: string, buyerName: string, bankRef: string, bankLastFour: string): Promise<Order> => {
    return api.createOrderNode(productId, quantity, email, buyerName, bankRef, 'BankTransfer', true, bankLastFour);
  },

  submitGatewayPayment: async (productId: string, quantity: number, email: string, buyerName: string, bankLastFour: string): Promise<Order> => {
    return api.createOrderNode(productId, quantity, email, buyerName, 'CARD_LEDGER_SYNC', 'Gateway', false, bankLastFour);
  },

  createOrderNode: async (productId: string, quantity: number, email: string, buyerName: string, ref: string, method: 'BankTransfer' | 'Gateway', proof: boolean, bankLastFour: string): Promise<Order> => {
    if (api.getSystemHaltStatus()) throw new Error("CRITICAL: Voucher procurement nodes are currently halted.");
    
    const p = await api.getProductById(productId);
    const currentUser = api.getCurrentUser();
    if (!currentUser || currentUser.status === 'Frozen') throw new Error("Access Denied: Identity node frozen.");

    const now = new Date();
    const order: Order = {
      id: `UNICOU-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
      date: now.toLocaleDateString('en-GB'),
      time: now.toLocaleTimeString('en-GB'),
      buyerName: buyerName || currentUser.name,
      bankLastFour: bankLastFour || 'XXXX',
      productName: p?.name || 'Asset',
      totalAmount: (p?.basePrice || 0) * quantity,
      bankRef: ref,
      proofAttached: proof,
      userId: currentUser.id,
      productId,
      currency: p?.currency || 'USD',
      customerEmail: currentUser.email,
      status: 'Pending',
      paymentMethod: method,
      timestamp: now.toISOString(),
      voucherCodes: [],
      quantity
    };
    
    const allOrders = await api.getOrders();
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...allOrders]));
    return order;
  },

  // --- CORE DATA NODES ---
  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    const user = session ? JSON.parse(session) : null;
    if (user && user.status === 'Frozen') return null;
    return user;
  },
  getUsers: async (): Promise<User[]> => {
    const local = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return [...db.users, ...local].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
  },
  getCodes: async (): Promise<VoucherCode[]> => JSON.parse(localStorage.getItem(CODES_KEY) || JSON.stringify(db.voucherCodes)),
  getProductById: async (id: string): Promise<Product | undefined> => (await api.getProducts()).find(p => p.id === id),
  getOrders: async (): Promise<Order[]> => JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'),
  getOrderById: async (id: string): Promise<Order | null> => (await api.getOrders()).find(o => o.id === id) || null,
  logout: () => localStorage.removeItem(SESSION_KEY),
  verifyLogin: async (id: string, p: string): Promise<User> => {
    const user = (await api.getUsers()).find(u => u.email === id);
    if (user) {
      if (user.status === 'Frozen') throw new Error("Identity Frozen.");
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    }
    throw new Error("Unauthorized.");
  },
  signup: async (email: string, role: UserRole): Promise<User> => {
    const newUser: User = { id: `u-${Date.now()}`, name: email.split('@')[0], email, role, status: 'Active', verified: true, isAuthorized: true };
    await api.upsertUser(newUser);
    return newUser;
  },
  verifyEmail: async (email: string): Promise<void> => {
    const users = await api.getUsers();
    const updated = users.map(u => u.email === email ? { ...u, verified: true, status: 'Active' as const } : u);
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));
  },
  getAllLMSCourses: async (): Promise<LMSCourse[]> => JSON.parse(localStorage.getItem(LMS_COURSES_KEY) || JSON.stringify(db.lmsCourses)),
  getEnrolledCourses: async (): Promise<LMSCourse[]> => (await api.getAllLMSCourses()),
  getCourseModules: async (id: string): Promise<LMSModule[]> => [],
  getEnrollmentByCourse: async (id: string): Promise<Enrollment | null> => null,
  updateCourseProgress: async (id: string, p: number): Promise<void> => {},
  redeemCourseVoucher: async (c: string): Promise<void> => {},
  getAllTests: async (): Promise<LMSPracticeTest[]> => db.lmsTests,
  getTestById: async (id: string): Promise<LMSPracticeTest | undefined> => db.lmsTests.find(t => t.id === id),
  getTestResults: async (): Promise<TestResult[]> => db.testResults,
  submitTestResult: async (tid: string, a: any, t: number): Promise<TestResult> => ({ id: 'res-1', overallBand: '75', skillScores: [], testTitle: 'PTE Mock', testId: tid, timeTaken: t, timestamp: new Date().toISOString(), userId: 'u' }),
  getPendingSubmissions: async (): Promise<ManualSubmission[]> => db.manualSubmissions,
  gradeSubmission: async (id: string, s: number, f: string): Promise<void> => {},
  getUniversities: async (): Promise<University[]> => db.universities,
  getUniversitiesByCountry: async (cid: string): Promise<University[]> => db.universities.filter(u => u.countryId === cid),
  getUniversityBySlug: async (s: string): Promise<University | undefined> => db.universities.find(u => u.slug === s),
  getCoursesByUniversity: async (uid: string): Promise<Course[]> => db.courses.filter(c => c.universityId === uid),
  getGuideBySlug: async (s: string): Promise<CountryGuide | null> => db.countryGuides.find(g => g.slug === s) || null,
  getQualifications: async (): Promise<Qualification[]> => db.qualifications,
  getQualificationById: async (id: string): Promise<Qualification | undefined> => db.qualifications.find(q => q.id === id),
  getImmigrationGuides: async (): Promise<ImmigrationGuideData[]> => db.immigrationGuides,
  submitLead: async (t: string, d: any): Promise<void> => {},
  getLeads: async (): Promise<Lead[]> => JSON.parse(localStorage.getItem(LEADS_KEY) || '[]'),
  submitQualificationLead: async (d: any): Promise<QualificationLead> => ({ ...d, id: 'ql-1', timestamp: new Date().toISOString() }),
  submitTestBooking: async (d: any): Promise<TestBooking> => ({ ...d, id: 'tb-1', timestamp: new Date().toISOString() }),
};
