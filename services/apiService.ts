
import * as db from './db';
import { MailService } from './mailService';
import { 
  Product, VoucherCode, Order, User, LMSCourse, 
  LMSModule, Enrollment, TestResult, ManualSubmission, FinanceReport, UserRole, 
  Lead, LMSPracticeTest, LMSLesson, OrderStatus, BusinessMetrics,
  University, CountryGuide, Course, Qualification, ImmigrationGuideData,
  QualificationLead, TestBooking
} from '../types';

const SESSION_KEY = 'unicou_active_session_v6';
const ORDERS_KEY = 'unicou_orders_v3';
const USERS_KEY = 'unicou_local_users_v3';
const CODES_KEY = 'unicou_inventory_vault_v3';
const LMS_COURSES_KEY = 'unicou_lms_courses_v3';
const LMS_MODULES_KEY = 'unicou_lms_modules_v3';
const LMS_ENROLLMENTS_KEY = 'unicou_lms_enrollments_v3';
const LEADS_KEY = 'unicou_leads_v3';
const SYSTEM_CONFIG_KEY = 'unicou_global_config_v1';

export const api = {
  // --- 1. SYSTEM CONFIG & GLOBAL HALT (X. Stop all Voucher System) ---
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
    const now = new Date();
    const todayStr = now.toLocaleDateString('en-GB');

    const todaySales = orders
      .filter(o => o.date === todayStr && o.status === 'Approved')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      todaySales,
      monthRevenue: orders.filter(o => o.status === 'Approved').reduce((s, o) => s + o.totalAmount, 0),
      vouchersInStock: codes.filter(c => c.status === 'Available').length,
      activeAgents: users.filter(u => u.role === 'Agent' && u.status === 'Active').length,
      riskAlerts: orders.filter(o => o.status === 'Hold').length,
      refundRequests: 0,
      systemHealth: api.getSystemHaltStatus() ? 'Critical' : 'Optimal',
      systemHalt: api.getSystemHaltStatus()
    };
  },

  // --- 2. MANDATORY 8-COLUMN ORDER PROCESSING ---
  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<void> => {
    const allOrders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    const orderIndex = allOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;
    
    const order = allOrders[orderIndex];
    if (status === 'Approved') {
      await api.fulfillOrder(orderId);
    } else {
      allOrders[orderIndex].status = status;
      localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
      // Fix: Guard call to sendOrderStatusEmail to only include statuses supported by the mail templates ('Hold' | 'Rejected')
      if (status === 'Hold' || status === 'Rejected') {
        await MailService.sendOrderStatusEmail(order.buyerName, order.customerEmail, order.id, status);
      }
    }
  },

  fulfillOrder: async (orderId: string): Promise<void> => {
    const allOrders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
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
      deliveryTime: new Date().toLocaleTimeString('en-GB')
    };
    localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
    await MailService.sendOrderStatusEmail(order.buyerName, order.customerEmail, order.id, 'Approved', assigned);
  },

  // --- 3. VOUCHER STOCK & INJECTION (3.I.IV) ---
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

  // --- 4. STAFF & USER GOVERNANCE (Login, Add/Edit/Delete/Freeze) ---
  upsertUser: async (userData: Partial<User>): Promise<void> => {
    const users = await api.getUsers();
    let updated;
    if (userData.id) {
      updated = users.map(u => u.id === userData.id ? { ...u, ...userData } : u);
    } else {
      updated = [...users, { ...userData, id: `u-${Date.now()}`, status: 'Active', verified: true } as User];
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));
  },

  deleteUser: async (id: string): Promise<void> => {
    const users = await api.getUsers();
    localStorage.setItem(USERS_KEY, JSON.stringify(users.filter(u => u.id !== id)));
  },

  // --- 5. PROCUREMENT TERMINAL LOGIC ---
  submitBankTransfer: async (productId: string, quantity: number, email: string, buyerName: string, bankRef: string, bankLastFour: string): Promise<Order> => {
    return api.createOrderNode(productId, quantity, email, buyerName, bankRef, 'BankTransfer', true, bankLastFour);
  },

  submitGatewayPayment: async (productId: string, quantity: number, email: string, buyerName: string, bankLastFour: string): Promise<Order> => {
    return api.createOrderNode(productId, quantity, email, buyerName, 'CARD_LEDGER_SYNC', 'Gateway', false, bankLastFour);
  },

  createOrderNode: async (productId: string, quantity: number, email: string, buyerName: string, ref: string, method: 'BankTransfer' | 'Gateway', proof: boolean, bankLastFour: string): Promise<Order> => {
    if (api.getSystemHaltStatus()) throw new Error("CRITICAL: Voucher procurement nodes are currently offline by administration.");
    
    const p = await api.getProductById(productId);
    const currentUser = api.getCurrentUser();
    if (!currentUser || currentUser.status === 'Frozen') throw new Error("Access Denied: Identity node frozen or unauthorized.");

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
    
    const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
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
  getProducts: async (): Promise<Product[]> => db.products,
  getProductById: async (id: string): Promise<Product | undefined> => db.products.find(p => p.id === id),
  getOrders: async (): Promise<Order[]> => JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'),
  getOrderById: async (id: string): Promise<Order | null> => (await api.getOrders()).find(o => o.id === id) || null,
  logout: () => localStorage.removeItem(SESSION_KEY),
  getFinanceReport: async (): Promise<FinanceReport> => {
    const orders = await api.getOrders();
    return {
      totalRevenue: orders.filter(o => o.status === 'Approved').reduce((s, o) => s + o.totalAmount, 0),
      totalVouchersSold: orders.filter(o => o.status === 'Approved').reduce((s, o) => s + o.quantity, 0),
      salesByType: [],
      recentSales: orders
    };
  },
  verifyLogin: async (id: string, p: string) => {
    const user = (await api.getUsers()).find(u => u.email === id);
    if (user && user.status !== 'Frozen') {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    }
    throw new Error("Access Blocked: Identity Node Frozen or Invalid.");
  },
  getAllLMSCourses: async (): Promise<LMSCourse[]> => JSON.parse(localStorage.getItem(LMS_COURSES_KEY) || JSON.stringify(db.lmsCourses)),
  getCourseModules: async (id: string): Promise<LMSModule[]> => JSON.parse(localStorage.getItem(LMS_MODULES_KEY) || '[]'),
  saveLMSCourse: async (course: LMSCourse) => {
    const all = await api.getAllLMSCourses();
    const updated = all.some(c => c.id === course.id) ? all.map(c => c.id === course.id ? course : c) : [course, ...all];
    localStorage.setItem(LMS_COURSES_KEY, JSON.stringify(updated));
  },
  getEnrolledCourses: async (): Promise<LMSCourse[]> => {
    const session = api.getCurrentUser();
    if (!session) return [];
    const enrollments = JSON.parse(localStorage.getItem(LMS_ENROLLMENTS_KEY) || '[]');
    const myIds = enrollments.filter((e: any) => e.userId === session.id).map((e: any) => e.courseId);
    return (await api.getAllLMSCourses()).filter(c => myIds.includes(c.id));
  },
  getEnrollmentByCourse: async (courseId: string): Promise<Enrollment | null> => {
    const session = api.getCurrentUser();
    if (!session) return null;
    const all = JSON.parse(localStorage.getItem(LMS_ENROLLMENTS_KEY) || '[]');
    return all.find((e: any) => e.userId === session.id && e.courseId === courseId) || null;
  },
  redeemCourseVoucher: async (code: string) => {
    const session = api.getCurrentUser();
    const all = JSON.parse(localStorage.getItem(LMS_ENROLLMENTS_KEY) || '[]');
    const course = (await api.getAllLMSCourses())[0];
    if (!all.some((e: any) => e.userId === session?.id && e.courseId === course.id)) {
      all.push({ id: `en-${Date.now()}`, userId: session?.id, courseId: course.id, progress: 0 });
      localStorage.setItem(LMS_ENROLLMENTS_KEY, JSON.stringify(all));
    }
  },
  updateCourseProgress: async (id: string, p: number) => {
    const session = api.getCurrentUser();
    const all = JSON.parse(localStorage.getItem(LMS_ENROLLMENTS_KEY) || '[]');
    const updated = all.map((e: any) => (e.userId === session?.id && e.courseId === id) ? { ...e, progress: p } : e);
    localStorage.setItem(LMS_ENROLLMENTS_KEY, JSON.stringify(updated));
  },
  getTestById: async (id: string) => db.lmsTests.find(t => t.id === id) || null,
  getPendingSubmissions: async () => db.manualSubmissions,
  gradeSubmission: async (id: string, s: number, f: string) => { console.log(`Evaluated: ${id}`); },
  getUniversities: async (): Promise<University[]> => db.universities,
  getUniversityBySlug: async (slug: string): Promise<University | undefined> => db.universities.find(u => u.slug === slug),
  getCoursesByUniversity: async (id: string): Promise<Course[]> => db.courses.filter(c => c.universityId === id),
  getUniversitiesByCountry: async (id: string) => db.universities.filter(u => u.countryId === id),
  getQualifications: async (): Promise<Qualification[]> => db.qualifications,
  getQualificationById: async (id: string): Promise<Qualification | undefined> => db.qualifications.find(q => q.id === id),
  submitQualificationLead: async (data: any) => ({ ...data, id: `ql-${Date.now()}`, timestamp: new Date().toISOString() }),
  signup: async (email: string, role: UserRole): Promise<User> => {
    const newUser: User = { id: `u-${Date.now()}`, name: email.split('@')[0].toUpperCase(), email, role, status: 'Active', verified: true };
    await api.upsertUser(newUser);
    return newUser;
  },
  getImmigrationGuides: async (): Promise<ImmigrationGuideData[]> => db.immigrationGuides,
  getLeads: async (): Promise<Lead[]> => JSON.parse(localStorage.getItem(LEADS_KEY) || '[]'),
  submitLead: async (type: Lead['type'], data: Record<string, string>): Promise<Lead> => {
    const lead: Lead = { id: `LD-${Math.random().toString(36).substr(2, 7).toUpperCase()}`, type, data, status: 'New', timestamp: new Date().toISOString() };
    const all = await api.getLeads();
    localStorage.setItem(LEADS_KEY, JSON.stringify([lead, ...all]));
    return lead;
  },
  getGuideBySlug: async (s: string) => db.countryGuides.find(g => g.slug === s) || null,
  getTestResults: async () => db.testResults,
  submitTestResult: async (id: string, a: any, t: number) => ({ id: `res-${Date.now()}`, userId: 'u', testId: id, testTitle: 'PTE Mock', skillScores: [], overallBand: '78', timeTaken: t, timestamp: new Date().toISOString() }),
  verifyEmail: async (e: string) => { console.log(`Identity Sync: ${e}`); },
  submitTestBooking: async (data: any) => ({ ...data, id: `tb-${Date.now()}`, timestamp: new Date().toISOString() }),
};
