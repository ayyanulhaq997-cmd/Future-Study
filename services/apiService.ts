
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

export const api = {
  // --- 1. BUSINESS INTELLIGENCE NODES ---
  getBusinessMetrics: async (): Promise<BusinessMetrics> => {
    const orders: Order[] = await api.getOrders();
    const users: User[] = await api.getUsers();
    const codes: VoucherCode[] = await api.getCodes();
    
    const now = new Date();
    const todayStr = now.toLocaleDateString('en-GB');

    const todaySales = orders
      .filter(o => o.date === todayStr && o.status === 'Approved')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const monthRevenue = orders
      .filter(o => {
        const parts = o.date.split('/');
        return parts[1] === String(now.getMonth() + 1) && parts[2] === String(now.getFullYear()) && o.status === 'Approved';
      })
      .reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      todaySales,
      monthRevenue,
      vouchersInStock: codes.filter(c => c.status === 'Available').length,
      activeAgents: users.filter(u => u.role === 'Agent' && u.status === 'Active').length,
      riskAlerts: orders.filter(o => o.status === 'Hold' || o.status === 'Rejected').length,
      refundRequests: orders.filter(o => o.status === 'RefundRequested').length,
      systemHealth: 'Optimal'
    };
  },

  // --- 2. MANDATORY 3-STAGE ORDER PROCESSING (WITH EMAIL) ---
  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<void> => {
    const allOrders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    const orderIndex = allOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;
    
    const order = allOrders[orderIndex];

    if (status === 'Approved') {
      // Stage I: Approval & Automated Fulfillment
      await api.fulfillOrder(orderId);
    } else {
      // Stage II: Hold or Stage III: Rejected
      allOrders[orderIndex].status = status;
      localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
      
      // Mandatory Email Dispatch
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
      throw new Error("Vault Alert: Insufficient stock node for fulfillment.");
    }

    const assigned = targetCodes.map(c => c.code);
    const updatedCodes = allCodes.map(c => assigned.includes(c.code) ? { ...c, status: 'Used' as const, orderId: order.id } : c);
    localStorage.setItem(CODES_KEY, JSON.stringify(updatedCodes));

    allOrders[orderIndex] = { ...order, status: 'Approved', voucherCodes: assigned };
    localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));

    // Mandatory Approval Email with Allocated Codes
    await MailService.sendOrderStatusEmail(order.buyerName, order.customerEmail, order.id, 'Approved', assigned);
  },

  // --- 3. VOUCHER STOCK & INJECTION (FIX: ADD TO EXISTING) ---
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

  // --- 4. STAFF & USER MANAGEMENT (ADD/EDIT/REMOVE) ---
  upsertUser: async (userData: Partial<User>): Promise<void> => {
    const users = await api.getUsers();
    let updated;
    if (userData.id) {
      updated = users.map(u => u.id === userData.id ? { ...u, ...userData } : u);
    } else {
      const newUser = {
        ...userData,
        id: `u-staff-${Date.now()}`,
        status: 'Active',
        verified: true,
        isAuthorized: true
      } as User;
      updated = [...users, newUser];
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));
  },

  deleteUser: async (id: string): Promise<void> => {
    const users = await api.getUsers();
    const filtered = users.filter(u => u.id !== id);
    localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
  },

  // --- 5. RESTORED PAYMENT SUBMISSIONS ---
  submitBankTransfer: async (productId: string, quantity: number, email: string, buyerName: string, bankRef: string): Promise<Order> => {
    return api.createOrderNode(productId, quantity, email, buyerName, bankRef, 'BankTransfer', true);
  },

  submitGatewayPayment: async (productId: string, quantity: number, email: string, buyerName: string): Promise<Order> => {
    return api.createOrderNode(productId, quantity, email, buyerName, 'GATEWAY_AUTH_SYNC', 'Gateway', false);
  },

  createOrderNode: async (productId: string, quantity: number, email: string, buyerName: string, ref: string, method: 'BankTransfer' | 'Gateway', proof: boolean): Promise<Order> => {
    const p = await api.getProductById(productId);
    const currentUser = api.getCurrentUser();
    if (!currentUser) throw new Error("Auth required.");

    const now = new Date();
    const order: Order = {
      id: `UNICOU-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
      date: now.toLocaleDateString('en-GB'),
      time: now.toLocaleTimeString('en-GB'),
      buyerName: buyerName || currentUser.name,
      productName: p?.name || 'Voucher',
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

  // --- 6. LEAD MANAGEMENT ---
  /* Fix: Added missing submitLead method to allow EnquiryForm and ApplyForm to submit new leads */
  submitLead: async (type: Lead['type'], data: Record<string, string>): Promise<Lead> => {
    const lead: Lead = {
      id: `LD-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
      type,
      data,
      status: 'New',
      timestamp: new Date().toISOString()
    };
    const all = await api.getLeads();
    localStorage.setItem(LEADS_KEY, JSON.stringify([lead, ...all]));
    return lead;
  },
  /* Fix: Added missing getLeads method for SalesDashboard to retrieve captured leads */
  getLeads: async (): Promise<Lead[]> => JSON.parse(localStorage.getItem(LEADS_KEY) || '[]'),

  // --- CORE SYSTEM NODES ---
  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },
  getUsers: async (): Promise<User[]> => {
    const raw = localStorage.getItem(USERS_KEY);
    const local = raw ? JSON.parse(raw) : [];
    // Combine base DB users with local storage users
    const combined = [...db.users];
    local.forEach((u: User) => {
      if (!combined.find(x => x.id === u.id)) combined.push(u);
    });
    return combined;
  },
  getCodes: async (): Promise<VoucherCode[]> => {
    const raw = localStorage.getItem(CODES_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(CODES_KEY, JSON.stringify(db.voucherCodes));
    return db.voucherCodes;
  },
  getProducts: async (): Promise<Product[]> => db.products,
  getProductById: async (id: string): Promise<Product | undefined> => db.products.find(p => p.id === id),
  getOrders: async (): Promise<Order[]> => JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'),
  getOrderById: async (id: string): Promise<Order | null> => {
    const orders = await api.getOrders();
    return orders.find(o => o.id === id) || null;
  },
  logout: () => localStorage.removeItem(SESSION_KEY),
  getFinanceReport: async (): Promise<FinanceReport> => {
    const orders = await api.getOrders();
    const approved = orders.filter(o => o.status === 'Approved');
    return {
      totalRevenue: approved.reduce((s, o) => s + o.totalAmount, 0),
      totalVouchersSold: approved.reduce((s, o) => s + o.quantity, 0),
      salesByType: [],
      recentSales: orders
    };
  },
  verifyLogin: async (id: string, p: string) => {
    const all = await api.getUsers();
    const user = all.find(u => u.email === id);
    if (user) { localStorage.setItem(SESSION_KEY, JSON.stringify(user)); return user; }
    throw new Error("Invalid Credentials.");
  },
  getAllLMSCourses: async (): Promise<LMSCourse[]> => {
    const raw = localStorage.getItem(LMS_COURSES_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(LMS_COURSES_KEY, JSON.stringify(db.lmsCourses));
    return db.lmsCourses;
  },
  getCourseModules: async (courseId: string): Promise<LMSModule[]> => {
    const raw = localStorage.getItem(LMS_MODULES_KEY);
    const allModules: Record<string, LMSModule[]> = raw ? JSON.parse(raw) : {};
    return allModules[courseId] || [];
  },
  saveLMSCourse: async (course: LMSCourse) => {
    const all = await api.getAllLMSCourses();
    const updated = all.some(c => c.id === course.id) 
      ? all.map(c => c.id === course.id ? course : c)
      : [{ ...course, id: `lms-${Date.now()}` }, ...all];
    localStorage.setItem(LMS_COURSES_KEY, JSON.stringify(updated));
  },
  saveLMSModule: async (courseId: string, module: LMSModule) => {
    const raw = localStorage.getItem(LMS_MODULES_KEY);
    const allModules: Record<string, LMSModule[]> = raw ? JSON.parse(raw) : {};
    const courseModules = allModules[courseId] || [];
    const updated = courseModules.some(m => m.id === module.id) 
      ? courseModules.map(m => m.id === module.id ? module : m) 
      : [...courseModules, { ...module, id: `mod-${Date.now()}`, lessons: [] }];
    allModules[courseId] = updated;
    localStorage.setItem(LMS_MODULES_KEY, JSON.stringify(allModules));
  },
  saveLMSLesson: async (courseId: string, moduleId: string, lesson: LMSLesson) => {
    const raw = localStorage.getItem(LMS_MODULES_KEY);
    const allModules: Record<string, LMSModule[]> = raw ? JSON.parse(raw) : {};
    const updated = (allModules[courseId] || []).map(m => {
      if (m.id === moduleId) {
        const lessons = m.lessons || [];
        const updatedLessons = lessons.some(l => l.id === lesson.id) 
          ? lessons.map(l => l.id === lesson.id ? lesson : l) 
          : [...lessons, { ...lesson, id: `les-${Date.now()}` }];
        return { ...m, lessons: updatedLessons };
      }
      return m;
    });
    allModules[courseId] = updated;
    localStorage.setItem(LMS_MODULES_KEY, JSON.stringify(allModules));
  },
  getEnrolledCourses: async (): Promise<LMSCourse[]> => [],
  redeemCourseVoucher: async (c: string) => {},
  getEnrollmentByCourse: async (id: string) => null,
  updateCourseProgress: async (id: string, p: number) => {},
  getGuideBySlug: async (s: string) => db.countryGuides.find(g => g.slug === s) || null,
  getUniversitiesByCountry: async (id: string) => db.universities.filter(u => u.countryId === id),
  getTestById: async (id: string) => db.lmsTests.find(t => t.id === id) || null,
  submitTestResult: async (testId: string, a: any, t: number) => ({}) as any,
  getTestResults: async () => [],
  getPendingSubmissions: async () => [],
  gradeSubmission: async (id: string, s: number, f: string) => {},
  verifyEmail: async (e: string) => {},
  getUniversities: async (): Promise<University[]> => db.universities,
  getUniversityBySlug: async (slug: string): Promise<University | undefined> => db.universities.find(u => u.slug === slug),
  getCoursesByUniversity: async (uniId: string): Promise<Course[]> => db.courses.filter(c => c.universityId === uniId),
  getQualifications: async (): Promise<Qualification[]> => db.qualifications,
  getQualificationById: async (id: string): Promise<Qualification | undefined> => db.qualifications.find(q => q.id === id),
  submitQualificationLead: async (data: any): Promise<QualificationLead> => { return { ...data, id: `ql-${Date.now()}`, timestamp: new Date().toISOString() }; },
  submitTestBooking: async (data: any): Promise<TestBooking> => { return { ...data, id: `tb-${Date.now()}`, timestamp: new Date().toISOString() }; },
  signup: async (email: string, role: UserRole): Promise<User> => {
    const newUser: User = { id: `u-${Date.now()}`, name: email.split('@')[0].toUpperCase(), email, role, status: 'Active', verified: true, isAuthorized: true };
    const all = await api.getUsers();
    localStorage.setItem(USERS_KEY, JSON.stringify([newUser, ...all.filter(u => u.id.startsWith('u-'))]));
    return newUser;
  },
  getImmigrationGuides: async (): Promise<ImmigrationGuideData[]> => db.immigrationGuides,
};
