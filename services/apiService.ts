
import * as db from './db';
import { 
  Product, VoucherCode, Order, User, LMSCourse, 
  LMSModule, Enrollment, TestResult, ManualSubmission, UserRole, 
  Lead, OrderStatus, BusinessMetrics,
  University, CountryGuide, Course, Qualification, ImmigrationGuideData,
  LMSPracticeTest, PurchaseRecord, QualificationLead, TestBooking
} from '../types';

const SESSION_KEY = 'unicou_active_identity_v18';
const ORDERS_KEY = 'unicou_orders_v18';
const USERS_KEY = 'unicou_user_registry_v18';
const CODES_KEY = 'unicou_voucher_vault_v18';
const PRODUCTS_KEY = 'unicou_product_catalog_v18';
const SYSTEM_HALT_KEY = 'unicou_system_halt_v18';

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
    const localStr = localStorage.getItem(USERS_KEY);
    const local: User[] = localStr ? JSON.parse(localStr) : [];
    
    const registry = new Map<string, User>();
    
    // 1. Load defaults
    db.users.forEach(u => registry.set(u.email.toLowerCase(), u));
    
    // 2. Overwrite with local Admin updates
    local.forEach(u => {
      if (u.email) registry.set(u.email.toLowerCase(), u);
    });
    
    return Array.from(registry.values());
  },

  verifyLogin: async (id: string, p: string): Promise<User> => {
    const users = await api.getUsers();
    const user = users.find(u => u.email.toLowerCase() === id.toLowerCase());
    if (user) {
      if (user.status === 'Frozen' || user.status === 'Rejected') throw new Error("Registry access node revoked.");
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    }
    throw new Error("Identity node not found in global registry.");
  },

  upsertUser: async (u: Partial<User>): Promise<void> => {
    const localStr = localStorage.getItem(USERS_KEY);
    const local: User[] = localStr ? JSON.parse(localStr) : [];
    const emailKey = u.email?.toLowerCase();
    
    if (!emailKey) return;

    const idx = local.findIndex((item: User) => item.email.toLowerCase() === emailKey);
    let updatedUser: User;

    if (idx > -1) {
      local[idx] = { ...local[idx], ...u } as User;
      updatedUser = local[idx];
    } else {
      const staticUser = db.users.find(item => item.email.toLowerCase() === emailKey);
      const newUser = { 
        ...(staticUser || {}), 
        ...u, 
        id: u.id || staticUser?.id || `u-${Date.now()}`,
        status: u.status || staticUser?.status || 'Active',
        timestamp: u.timestamp || staticUser?.timestamp || new Date().toISOString()
      } as User;
      local.push(newUser);
      updatedUser = newUser;
    }
    
    localStorage.setItem(USERS_KEY, JSON.stringify(local));

    // SYNC SESSION: If the updated user is the one currently logged in, update their session too
    const currentSession = localStorage.getItem(SESSION_KEY);
    if (currentSession) {
      const sessionUser = JSON.parse(currentSession);
      if (sessionUser.email.toLowerCase() === emailKey) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
      }
    }
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
    const localStr = localStorage.getItem(CODES_KEY);
    if (!localStr) {
      localStorage.setItem(CODES_KEY, JSON.stringify(db.voucherCodes));
      return db.voucherCodes;
    }
    return JSON.parse(localStr);
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
      if (status === 'Approved' && all[idx].status !== 'Approved') {
        const productCodes = await api.getCodes();
        const available = productCodes.filter(c => c.productId === all[idx].productId && c.status === 'Available');
        
        if (available.length < all[idx].quantity) {
          throw new Error("Vault Depletion Error: Inject more stock in Admin Terminal.");
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
    const productCodes = await api.getCodes();
    const available = productCodes.filter(c => c.productId === productId && c.status === 'Available');
    if (available.length < quantity) throw new Error("Vault Depletion Error: Desired quantity is not available in stock.");

    const order: Order = {
      id: `UC-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
      date: new Date().toLocaleDateString('en-GB'),
      time: new Date().toLocaleTimeString('en-GB'),
      buyerName, bankLastFour, bankRef: 'SETTLED_DIRECTLY',
      productName: p?.name || 'Academic Asset',
      totalAmount: (p?.basePrice || 0) * quantity,
      proofAttached: true, userId: 'u-session',
      productId, currency: 'USD',
      customerEmail: email, status: 'Approved',
      paymentMethod: 'Gateway', timestamp: new Date().toISOString(),
      voucherCodes: [], quantity
    };
    
    const assigned = available.slice(0, quantity);
    assigned.forEach(c => {
      c.status = 'Used';
      c.orderId = order.id;
      c.assignmentDate = new Date().toISOString();
    });
    order.voucherCodes = assigned.map(c => c.code);
    order.deliveryTime = new Date().toLocaleTimeString();
    
    localStorage.setItem(CODES_KEY, JSON.stringify(productCodes));
    const all = await api.getOrders();
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...all]));
    return order;
  },

  getCurrentUser: (): User | null => {
    const s = localStorage.getItem(SESSION_KEY);
    if (!s) return null;
    
    const sessionUser = JSON.parse(s);
    // DYNAMIC SYNC: Re-fetch latest status from global registry to prevent stale "Pending" states
    const localUsers = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const latest = localUsers.find((u: User) => u.email.toLowerCase() === sessionUser.email.toLowerCase());
    
    if (latest) {
      // Keep session updated with latest registry data
      localStorage.setItem(SESSION_KEY, JSON.stringify(latest));
      return latest;
    }
    
    return sessionUser;
  },

  logout: () => localStorage.removeItem(SESSION_KEY),
  getLeads: async (): Promise<Lead[]> => JSON.parse(localStorage.getItem('leads_v18') || '[]'),
  submitLead: async (t: string, d: any): Promise<void> => {
     const all = await api.getLeads();
     const nl = { id: `L-${Date.now()}`, type: t as any, data: d, status: 'New', timestamp: new Date().toISOString() };
     localStorage.setItem('leads_v18', JSON.stringify([nl, ...all]));
  },
  signup: async (email: string, role: UserRole): Promise<User> => {
    const u: User = { 
      id: `u-${Date.now()}`, 
      name: email.split('@')[0], 
      email, 
      role, 
      status: 'Pending', 
      verified: true, 
      isAuthorized: true, 
      timestamp: new Date().toISOString() 
    };
    await api.upsertUser(u);
    // PERSISTENCE FIX: Ensure the new user is set in session so they don't log out on refresh
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
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
    const local = JSON.parse(localStorage.getItem('enrolled_v18') || '[]');
    return db.lmsCourses.filter(c => local.includes(c.id));
  },
  getEnrollmentByCourse: async (courseId: string) => {
    const all = JSON.parse(localStorage.getItem('progress_v18') || '{}');
    return { courseId, userId: 'u', progress: all[courseId] || 0 };
  },
  updateCourseProgress: async (courseId: string, progress: number) => {
    const all = JSON.parse(localStorage.getItem('progress_v18') || '{}');
    all[courseId] = progress;
    localStorage.setItem('progress_v18', JSON.stringify(all));
  },
  getCourseModules: async (courseId: string): Promise<LMSModule[]> => db.lmsModules,
  getAllTests: async () => db.lmsTests,
  getTestById: async (id: string) => db.lmsTests.find(t => t.id === id),
  submitTestResult: async (tid: string, a: any, t: number) => {
    const user = api.getCurrentUser();
    const test = db.lmsTests.find(x => x.id === tid);
    const result: TestResult = { id: `tr-${Date.now()}`, userId: user?.id || 'u', testId: tid, testTitle: test?.title || 'Mock', overallBand: 'Evaluating', skillScores: [], timeTaken: t, timestamp: new Date().toISOString() };
    const all = JSON.parse(localStorage.getItem('results_v18') || '[]');
    localStorage.setItem('results_v18', JSON.stringify([result, ...all]));
    return result;
  },
  getTestResults: async () => JSON.parse(localStorage.getItem('results_v18') || '[]'),
  getPendingSubmissions: async () => JSON.parse(localStorage.getItem('submissions_v18') || '[]').filter((s: ManualSubmission) => s.status === 'Pending'),
  gradeSubmission: async (id: string, s: number, f: string) => {
    const all = JSON.parse(localStorage.getItem('submissions_v18') || '[]');
    const idx = all.findIndex((x: ManualSubmission) => x.id === id);
    if (idx > -1) {
      all[idx].status = 'Graded';
      localStorage.setItem('submissions_v18', JSON.stringify(all));
    }
  },
  redeemCourseVoucher: async (code: string) => {
    const enrolled = JSON.parse(localStorage.getItem('enrolled_v18') || '[]');
    const match = db.lmsCourses.find(c => code.includes(c.id.split('-')[1]));
    if (match) {
      if (!enrolled.includes(match.id)) {
        enrolled.push(match.id);
        localStorage.setItem('enrolled_v18', JSON.stringify(enrolled));
      }
    } else {
      throw new Error("Registry Fault: Invalid Authorization Code.");
    }
  },
  getQualifications: async (): Promise<Qualification[]> => db.qualifications,
  getQualificationById: async (id: string): Promise<Qualification | undefined> => db.qualifications.find(q => q.id === id),
  submitQualificationLead: async (data: any): Promise<QualificationLead> => {
    const lead: QualificationLead = { id: `QL-${Date.now()}`, ...data, timestamp: new Date().toISOString() };
    await api.submitLead('student', { ...data, origin: 'Qualification-Portal' });
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
