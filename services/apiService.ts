
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
      refundRequests: orders.filter(o => o.status === 'RefundRequested').length,
      systemHealth: api.getSystemHaltStatus() ? 'Critical' : 'Optimal',
      systemHalt: api.getSystemHaltStatus()
    };
  },

  // --- 2. USER AUTH & IDENTITY ---
  getUsers: async (): Promise<User[]> => {
    const local = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    // Master Merge: DB users take precedence
    const combined = [...db.users, ...local.filter((l: User) => !db.users.find(u => u.email === l.email))];
    return combined;
  },

  verifyLogin: async (id: string, p: string): Promise<User> => {
    const users = await api.getUsers();
    const user = users.find(u => u.email.toLowerCase() === id.toLowerCase());
    
    if (user) {
      if (user.status === 'Frozen') throw new Error("Identity Frozen by Security Node.");
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    }
    throw new Error("Unauthorized ID.");
  },

  upsertUser: async (userData: Partial<User>): Promise<void> => {
    const users = await api.getUsers();
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
    localStorage.setItem(USERS_KEY, JSON.stringify(local.filter((u: User) => u.id !== id)));
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

  upsertProduct: async (product: Product): Promise<void> => {
    const local = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
    const index = local.findIndex((p: Product) => p.id === product.id);
    if (index > -1) local[index] = product;
    else local.push(product);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(local));
  },

  deleteProduct: async (id: string): Promise<void> => {
    const local = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(local.filter((p: Product) => p.id !== id)));
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

  // --- 4. ORDER FULFILLMENT ---
  getOrders: async (): Promise<Order[]> => JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'),
  
  // Fix: Added missing getOrderById method to resolve property missing error in SuccessScreen.tsx
  getOrderById: async (id: string): Promise<Order | null> => {
    const orders = await api.getOrders();
    return orders.find(o => o.id === id) || null;
  },

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

    allOrders[orderIndex] = { ...order, status: 'Approved', voucherCodes: assigned, deliveryTime: new Date().toLocaleTimeString('en-GB') };
    localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
    await MailService.sendOrderStatusEmail(order.buyerName, order.customerEmail, order.id, 'Approved', assigned);
  },

  // --- PROCUREMENT TERMINAL ---
  submitBankTransfer: async (productId: string, quantity: number, email: string, buyerName: string, bankRef: string, bankLastFour: string): Promise<Order> => {
    return api.createOrderNode(productId, quantity, email, buyerName, bankRef, 'BankTransfer', true, bankLastFour);
  },

  submitGatewayPayment: async (productId: string, quantity: number, email: string, buyerName: string, bankLastFour: string): Promise<Order> => {
    return api.createOrderNode(productId, quantity, email, buyerName, 'CARD_LEDGER_SYNC', 'Gateway', false, bankLastFour);
  },

  createOrderNode: async (productId: string, quantity: number, email: string, buyerName: string, ref: string, method: 'BankTransfer' | 'Gateway', proof: boolean, bankLastFour: string): Promise<Order> => {
    if (api.getSystemHaltStatus()) throw new Error("CRITICAL: Voucher procurement nodes are currently halted.");
    const p = await api.getProductById(productId);
    const now = new Date();
    const order: Order = {
      id: `UNICOU-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
      date: now.toLocaleDateString('en-GB'),
      time: now.toLocaleTimeString('en-GB'),
      buyerName,
      bankLastFour,
      productName: p?.name || 'Asset',
      totalAmount: (p?.basePrice || 0) * quantity,
      bankRef: ref,
      proofAttached: proof,
      userId: 'u-session',
      productId,
      currency: p?.currency || 'USD',
      customerEmail: email,
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

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },
  logout: () => localStorage.removeItem(SESSION_KEY),
  signup: async (email: string, role: UserRole): Promise<User> => {
    const newUser: User = { id: `u-${Date.now()}`, name: email.split('@')[0], email, role, status: 'Active', verified: true, isAuthorized: true };
    await api.upsertUser(newUser);
    return newUser;
  },
  getCodes: async (): Promise<VoucherCode[]> => JSON.parse(localStorage.getItem(CODES_KEY) || JSON.stringify(db.voucherCodes)),
  getProductById: async (id: string): Promise<Product | undefined> => (await api.getProducts()).find(p => p.id === id),
  verifyEmail: async (email: string): Promise<void> => {},
  getAllLMSCourses: async (): Promise<LMSCourse[]> => [],
  getEnrolledCourses: async (): Promise<LMSCourse[]> => [],
  getCourseModules: async (id: string): Promise<LMSModule[]> => [],
  getEnrollmentByCourse: async (id: string): Promise<Enrollment | null> => null,
  updateCourseProgress: async (id: string, p: number): Promise<void> => {},
  redeemCourseVoucher: async (c: string): Promise<void> => {},
  getAllTests: async (): Promise<LMSPracticeTest[]> => db.lmsTests,
  getTestById: async (id: string): Promise<LMSPracticeTest | undefined> => db.lmsTests.find(t => t.id === id),
  getTestResults: async (): Promise<TestResult[]> => [],
  submitTestResult: async (tid: string, a: any, t: number): Promise<TestResult> => ({ id: 'res-1', overallBand: 'B2', skillScores: [], testTitle: 'Mock', testId: tid, timeTaken: t, timestamp: new Date().toISOString(), userId: 'u' }),
  getPendingSubmissions: async (): Promise<ManualSubmission[]> => [],
  gradeSubmission: async (id: string, s: number, f: string): Promise<void> => {},
  getUniversities: async (): Promise<University[]> => [],
  getUniversitiesByCountry: async (cid: string): Promise<University[]> => [],
  getUniversityBySlug: async (s: string): Promise<University | undefined> => undefined,
  getCoursesByUniversity: async (uid: string): Promise<Course[]> => [],
  getGuideBySlug: async (s: string): Promise<CountryGuide | null> => db.countryGuides.find(g => g.slug === s) || null,
  getQualifications: async (): Promise<Qualification[]> => [],
  getQualificationById: async (id: string): Promise<Qualification | undefined> => undefined,
  getImmigrationGuides: async (): Promise<ImmigrationGuideData[]> => [],
  submitLead: async (t: string, d: any): Promise<void> => {},
  getLeads: async (): Promise<Lead[]> => JSON.parse(localStorage.getItem(LEADS_KEY) || '[]'),
  submitQualificationLead: async (d: any): Promise<QualificationLead> => ({ ...d, id: 'ql-1', timestamp: new Date().toISOString() }),
  submitTestBooking: async (d: any): Promise<TestBooking> => ({ ...d, id: 'tb-1', timestamp: new Date().toISOString() }),
};
