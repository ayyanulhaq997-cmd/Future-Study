import * as db from './db';
import { 
  Product, VoucherCode, Order, User, LMSCourse, 
  LMSModule, Enrollment, TestResult, ManualSubmission, UserRole, 
  Lead, OrderStatus, BusinessMetrics,
  University, CountryGuide, Course, Qualification, ImmigrationGuideData,
  LMSPracticeTest, PurchaseRecord, QualificationLead, TestBooking
} from '../types';

const SESSION_KEY = 'unicou_active_session_v16';
const ORDERS_KEY = 'unicou_orders_v16';
const USERS_KEY = 'unicou_identity_registry_v16';
const CODES_KEY = 'unicou_vault_inventory_v16';
const PRODUCTS_KEY = 'unicou_catalog_v16';
const SYSTEM_HALT_KEY = 'unicou_halt_status_v16';

export const api = {
  getSystemHaltStatus: (): boolean => localStorage.getItem(SYSTEM_HALT_KEY) === 'HALTED',
  setSystemHaltStatus: (halted: boolean): void => localStorage.setItem(SYSTEM_HALT_KEY, halted ? 'HALTED' : 'ACTIVE'),

  getBusinessMetrics: async (): Promise<BusinessMetrics> => {
    const orders = await api.getOrders();
    const codes = await api.getCodes();
    const approved = orders.filter(o => o.status === 'Approved');
    return {
      todaySales: approved.reduce((s,o) => s + (o.totalAmount || 0), 0),
      monthRevenue: approved.reduce((s,o) => s + (o.totalAmount || 0), 0),
      vouchersInStock: codes.filter(c => c.status === 'Available').length,
      activeAgents: (await api.getUsers()).filter(u => u.role.includes('Agent')).length,
      riskAlerts: orders.filter(o => o.status === 'Hold').length,
      refundRequests: orders.filter(o => o.status === 'RefundRequested').length,
      systemHealth: 'Optimal',
      systemHalt: api.getSystemHaltStatus()
    };
  },

  getUsers: async (): Promise<User[]> => {
    const local = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const combined = [...db.users, ...local];
    return Array.from(new Map(combined.map(u => [u.email.toLowerCase(), u])).values());
  },

  upsertUser: async (u: Partial<User>): Promise<void> => {
    const local = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const idx = local.findIndex((item: User) => item.id === u.id || item.email === u.email);
    if (idx > -1) {
      local[idx] = { ...local[idx], ...u };
    } else {
      local.push({ ...u, id: u.id || `u-${Date.now()}`, status: u.status || 'Active', timestamp: new Date().toISOString() } as User);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(local));
  },

  verifyLogin: async (id: string, p: string): Promise<User> => {
    const users = await api.getUsers();
    const user = users.find(u => u.email.toLowerCase() === id.toLowerCase());
    if (user) {
      if (user.status === 'Frozen') throw new Error("Registry account deactivated.");
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    }
    throw new Error("Identity node not found in registry.");
  },

  getProducts: async (): Promise<Product[]> => {
    const local = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
    const combined = [...db.products, ...local];
    return Array.from(new Map(combined.map(item => [item.id, item])).values());
  },

  upsertProduct: async (p: Partial<Product>): Promise<void> => {
    const local = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
    const idx = local.findIndex((item: Product) => item.id === p.id);
    if (idx > -1) {
      local[idx] = { ...local[idx], ...p };
    } else {
      local.push({ ...p, id: p.id || `p-${Date.now()}` } as Product);
    }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(local));
  },

  getProductById: async (id: string) => (await api.getProducts()).find(p => p.id === id),

  getCodes: async (): Promise<VoucherCode[]> => {
    const local = JSON.parse(localStorage.getItem(CODES_KEY) || '[]');
    return local.length > 0 ? local : db.voucherCodes;
  },

  injectBulkCodes: async (productId: string, codesList: string[]): Promise<void> => {
    const current = await api.getCodes();
    const newCodes = codesList.filter(c => c.trim()).map(c => ({
      id: `vc-${Date.now()}-${Math.random()}`,
      productId,
      code: c.trim(),
      status: 'Available' as const,
      expiryDate: '2026-12-31',
      uploadDate: new Date().toISOString()
    }));
    localStorage.setItem(CODES_KEY, JSON.stringify([...current, ...newCodes]));
  },

  getOrders: async (): Promise<Order[]> => JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'),
  
  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<void> => {
    const all = await api.getOrders();
    const idx = all.findIndex(o => o.id === orderId);
    if (idx > -1) {
      // THE WATCHER: Execution node for atomic fulfillment on approval
      if (status === 'Approved' && all[idx].status !== 'Approved') {
        const productCodes = await api.getCodes();
        const available = productCodes.filter(c => c.productId === all[idx].productId && c.status === 'Available');
        
        if (available.length < all[idx].quantity) {
          throw new Error("Vault Depleted: Please inject codes in Admin Terminal.");
        }

        const assigned = available.slice(0, all[idx].quantity);
        assigned.forEach(c => {
          c.status = 'Used';
          c.orderId = orderId;
          c.assignmentDate = new Date().toISOString();
        });
        all[idx].voucherCodes = assigned.map(c => c.code);
        all[idx].deliveryTime = new Date().toLocaleTimeString();
        localStorage.setItem(CODES_KEY, JSON.stringify(productCodes));
      }
      all[idx].status = status;
      localStorage.setItem(ORDERS_KEY, JSON.stringify(all));
    }
  },

  submitBankTransfer: async (productId: string, quantity: number, email: string, buyerName: string, bankRef: string, bankLastFour: string): Promise<Order> => {
    if (api.getSystemHaltStatus()) throw new Error("Fulfillment system offline.");
    const p = await api.getProductById(productId);
    const order: Order = {
      id: `UC-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
      date: new Date().toLocaleDateString('en-GB'),
      time: new Date().toLocaleTimeString('en-GB'),
      buyerName, bankLastFour, bankRef,
      productName: p?.name || 'Academic Asset',
      totalAmount: (p?.basePrice || 0) * quantity,
      proofAttached: true, userId: 'u-session',
      productId, currency: 'USD',
      customerEmail: email, status: 'Pending',
      paymentMethod: 'BankTransfer', timestamp: new Date().toISOString(),
      voucherCodes: [], quantity
    };
    const all = await api.getOrders();
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...all]));
    return order;
  },

  submitGatewayPayment: async (productId: string, quantity: number, email: string, buyerName: string, bankLastFour: string): Promise<Order> => {
    if (api.getSystemHaltStatus()) throw new Error("Fulfillment system offline.");
    const p = await api.getProductById(productId);
    const order: Order = {
      id: `UC-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
      date: new Date().toLocaleDateString('en-GB'),
      time: new Date().toLocaleTimeString('en-GB'),
      buyerName, bankLastFour, bankRef: 'DIRECT_SETTLEMENT',
      productName: p?.name || 'Academic Asset',
      totalAmount: (p?.basePrice || 0) * quantity,
      proofAttached: true, userId: 'u-session',
      productId, currency: 'USD',
      customerEmail: email, status: 'Approved',
      paymentMethod: 'Gateway', timestamp: new Date().toISOString(),
      voucherCodes: [], quantity
    };
    
    const productCodes = await api.getCodes();
    const available = productCodes.filter(c => c.productId === productId && c.status === 'Available');
    if (available.length >= quantity) {
      const assigned = available.slice(0, quantity);
      assigned.forEach(c => {
        c.status = 'Used';
        c.orderId = order.id;
        c.assignmentDate = new Date().toISOString();
      });
      order.voucherCodes = assigned.map(c => c.code);
      order.deliveryTime = new Date().toLocaleTimeString();
      localStorage.setItem(CODES_KEY, JSON.stringify(productCodes));
    }

    const all = await api.getOrders();
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...all]));
    return order;
  },

  getCurrentUser: (): User | null => {
    const s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  },
  logout: () => localStorage.removeItem(SESSION_KEY),
  getLeads: async (): Promise<Lead[]> => JSON.parse(localStorage.getItem('leads_v16') || '[]'),
  submitLead: async (t: string, d: any): Promise<void> => {
     const all = await api.getLeads();
     const nl = { id: `L-${Date.now()}`, type: t as any, data: d, status: 'New', timestamp: new Date().toISOString() };
     localStorage.setItem('leads_v16', JSON.stringify([nl, ...all]));
  },
  signup: async (email: string, role: UserRole): Promise<User> => {
    const u: User = { id: `u-${Date.now()}`, name: email.split('@')[0], email, role, status: 'Active', verified: true, isAuthorized: true, timestamp: new Date().toISOString() };
    await api.upsertUser(u);
    return u;
  },
  getOrderById: async (id: string) => (await api.getOrders()).find(o => o.id === id) || null,
  getUniversities: async () => db.universities,
  getUniversitiesByCountry: async (cid: string) => db.universities.filter(u => u.countryId === cid),
  getUniversityBySlug: async (s: string) => db.universities.find(u => u.slug === s),
  getCoursesByUniversity: async (uniId: string): Promise<Course[]> => db.courses.filter(c => c.universityId === uniId),
  getGuideBySlug: async (s: string) => db.countryGuides.find(g => g.slug === s) || null,
  getAllLMSCourses: async () => db.lmsCourses,
  getEnrolledCourses: async () => {
    const local = JSON.parse(localStorage.getItem('enrolled_v16') || '[]');
    return db.lmsCourses.filter(c => local.includes(c.id));
  },
  getEnrollmentByCourse: async (courseId: string) => {
    const all = JSON.parse(localStorage.getItem('progress_v16') || '{}');
    return { courseId, userId: 'u', progress: all[courseId] || 0 };
  },
  updateCourseProgress: async (courseId: string, progress: number) => {
    const all = JSON.parse(localStorage.getItem('progress_v16') || '{}');
    all[courseId] = progress;
    localStorage.setItem('progress_v16', JSON.stringify(all));
  },
  getCourseModules: async (courseId: string): Promise<LMSModule[]> => db.lmsModules,
  getAllTests: async () => db.lmsTests,
  getTestById: async (id: string) => db.lmsTests.find(t => t.id === id),
  submitTestResult: async (tid: string, a: any, t: number) => {
    const user = api.getCurrentUser();
    const test = db.lmsTests.find(x => x.id === tid);
    const result: TestResult = { id: `tr-${Date.now()}`, userId: user?.id || 'u', testId: tid, testTitle: test?.title || 'Mock', overallBand: 'Evaluating', skillScores: [], timeTaken: t, timestamp: new Date().toISOString() };
    const all = JSON.parse(localStorage.getItem('results_v16') || '[]');
    localStorage.setItem('results_v16', JSON.stringify([result, ...all]));
    return result;
  },
  getTestResults: async () => JSON.parse(localStorage.getItem('results_v16') || '[]'),
  getPendingSubmissions: async () => JSON.parse(localStorage.getItem('submissions_v16') || '[]').filter((s: ManualSubmission) => s.status === 'Pending'),
  gradeSubmission: async (id: string, s: number, f: string) => {
    const all = JSON.parse(localStorage.getItem('submissions_v16') || '[]');
    const idx = all.findIndex((x: ManualSubmission) => x.id === id);
    if (idx > -1) {
      all[idx].status = 'Graded';
      localStorage.setItem('submissions_v16', JSON.stringify(all));
    }
  },
  redeemCourseVoucher: async (code: string) => {
    const enrolled = JSON.parse(localStorage.getItem('enrolled_v16') || '[]');
    const match = db.lmsCourses.find(c => code.includes(c.id.split('-')[1]));
    if (match) {
      if (!enrolled.includes(match.id)) {
        enrolled.push(match.id);
        localStorage.setItem('enrolled_v16', JSON.stringify(enrolled));
      }
    } else {
      throw new Error("Invalid Authorization Node.");
    }
  },
  getQualifications: async (): Promise<Qualification[]> => db.qualifications,
  getQualificationById: async (id: string): Promise<Qualification | undefined> => db.qualifications.find(q => q.id === id),
  submitQualificationLead: async (data: any): Promise<QualificationLead> => {
    const lead: QualificationLead = { id: `QL-${Date.now()}`, ...data, timestamp: new Date().toISOString() };
    await api.submitLead('student', { ...data, origin: 'Qualification-Registry' });
    return lead;
  },
  submitTestBooking: async (data: any): Promise<TestBooking> => {
    const booking: TestBooking = { id: `TB-${Date.now()}`, ...data, timestamp: new Date().toISOString() };
    return booking;
  },
  verifyEmail: async (email: string): Promise<void> => {
    const local = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const idx = local.findIndex((u: User) => u.email.toLowerCase() === email.toLowerCase());
    if (idx > -1) {
      local[idx].verified = true;
      localStorage.setItem(USERS_KEY, JSON.stringify(local));
    }
  },
  getImmigrationGuides: async (): Promise<ImmigrationGuideData[]> => db.immigrationGuides,
};
