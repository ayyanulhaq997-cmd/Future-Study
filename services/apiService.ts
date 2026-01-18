
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
    db.users.forEach(u => registry.set(u.email.toLowerCase(), u));
    local.forEach(u => registry.set(u.email.toLowerCase(), u));
    return Array.from(registry.values());
  },

  verifyLogin: async (id: string, p: string): Promise<User> => {
    const users = await api.getUsers();
    const user = users.find(u => u.email.toLowerCase() === id.toLowerCase());
    if (user) {
      if (user.status === 'Frozen' || user.status === 'Rejected') throw new Error("Registry access node revoked.");
      // We only store the basic info in session; status comes from Registry
      localStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email, name: user.name, role: user.role }));
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
    if (idx > -1) {
      local[idx] = { ...local[idx], ...u } as User;
    } else {
      const staticUser = db.users.find(item => item.email.toLowerCase() === emailKey);
      const newUser = { 
        ...(staticUser || {}), 
        ...u, 
        id: u.id || staticUser?.id || `u-${Date.now()}`,
        status: u.status || staticUser?.status || 'Pending',
        timestamp: u.timestamp || staticUser?.timestamp || new Date().toISOString()
      } as User;
      local.push(newUser);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(local));
  },

  getCurrentUser: (): User | null => {
    const s = localStorage.getItem(SESSION_KEY);
    if (!s) return null;
    const sessionData = JSON.parse(s);
    
    // HOT SYNC: Always pull the latest user profile from the registry
    const localStr = localStorage.getItem(USERS_KEY);
    const local: User[] = localStr ? JSON.parse(localStr) : [];
    const latest = local.find(u => u.email.toLowerCase() === sessionData.email.toLowerCase());
    
    if (latest) return latest;
    
    // Fallback to static DB if not in local registry
    const staticMatch = db.users.find(u => u.email.toLowerCase() === sessionData.email.toLowerCase());
    return staticMatch || null;
  },

  logout: () => localStorage.removeItem(SESSION_KEY),

  getProducts: async (): Promise<Product[]> => {
    const local = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
    const combined = [...db.products, ...local];
    return Array.from(new Map(combined.map(item => [item.id, item])).values());
  },

  // Added upsertProduct to fix Error in components/AdminDashboard.tsx
  upsertProduct: async (p: Partial<Product>): Promise<void> => {
    const local = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
    const idx = local.findIndex((item: Product) => item.id === p.id);
    if (idx > -1) {
      local[idx] = { ...local[idx], ...p };
    } else {
      local.push({ ...p, id: p.id || `p-${Date.now()}` });
    }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(local));
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
  
  // Added getOrderById to fix Error in components/SuccessScreen.tsx
  getOrderById: async (id: string): Promise<Order | null> => {
    const all = await api.getOrders();
    return all.find(o => o.id === id) || null;
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<void> => {
    const all = await api.getOrders();
    const idx = all.findIndex(o => o.id === orderId);
    if (idx > -1) {
      if (status === 'Approved' && all[idx].status !== 'Approved') {
        const productCodes = await api.getCodes();
        const available = productCodes.filter(c => c.productId === all[idx].productId && c.status === 'Available');
        if (available.length < all[idx].quantity) throw new Error("Vault Depletion Error");
        const assigned = available.slice(0, all[idx].quantity);
        assigned.forEach(c => { c.status = 'Used'; c.orderId = orderId; });
        all[idx].voucherCodes = assigned.map(c => c.code);
        all[idx].status = 'Approved';
        localStorage.setItem(CODES_KEY, JSON.stringify(productCodes));
      } else {
        all[idx].status = status;
      }
      localStorage.setItem(ORDERS_KEY, JSON.stringify(all));
    }
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
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email: u.email, name: u.name, role: u.role }));
    return u;
  },

  getProductById: async (id: string) => (await api.getProducts()).find(p => p.id === id),
  getCodes: async (): Promise<VoucherCode[]> => JSON.parse(localStorage.getItem(CODES_KEY) || JSON.stringify(db.voucherCodes)),
  getLeads: async (): Promise<Lead[]> => JSON.parse(localStorage.getItem('leads_v18') || '[]'),
  submitLead: async (t: string, d: any): Promise<void> => {
     const all = await api.getLeads();
     const nl = { id: `L-${Date.now()}`, type: t as any, data: d, status: 'New', timestamp: new Date().toISOString() };
     localStorage.setItem('leads_v18', JSON.stringify([nl, ...all]));
  },
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
  // Added getEnrollmentByCourse to fix Error in components/LMSCoursePlayer.tsx
  getEnrollmentByCourse: async (courseId: string): Promise<Enrollment | null> => {
    const all = JSON.parse(localStorage.getItem('progress_v18') || '{}');
    const progress = all[courseId];
    if (progress !== undefined) {
      return { courseId, userId: 'u-session', progress };
    }
    return null;
  },
  updateCourseProgress: async (courseId: string, progress: number) => {
    const all = JSON.parse(localStorage.getItem('progress_v18') || '{}');
    all[courseId] = progress;
    localStorage.setItem('progress_v18', JSON.stringify(all));
  },
  getCourseModules: async (courseId: string): Promise<LMSModule[]> => db.lmsModules,
  getAllTests: async () => db.lmsTests,
  getTestById: async (id: string) => db.lmsTests.find(t => t.id === id),
  // Added submitTestResult to fix Error in components/LMSPracticeTest.tsx
  submitTestResult: async (testId: string, answers: Record<string, any>, timeTaken: number): Promise<TestResult> => {
    const test = await api.getTestById(testId);
    const result: TestResult = {
      id: `TR-${Date.now()}`,
      userId: 'u-session',
      testId,
      testTitle: test?.title || 'Unknown Test',
      overallBand: 'SYNC',
      skillScores: [],
      timeTaken,
      timestamp: new Date().toISOString()
    };
    const all = JSON.parse(localStorage.getItem('results_v18') || '[]');
    localStorage.setItem('results_v18', JSON.stringify([result, ...all]));
    return result;
  },
  getTestResults: async () => JSON.parse(localStorage.getItem('results_v18') || '[]'),
  getPendingSubmissions: async () => JSON.parse(localStorage.getItem('submissions_v18') || '[]').filter((s: ManualSubmission) => s.status === 'Pending'),
  // Added gradeSubmission to fix Error in components/TrainerDashboard.tsx
  gradeSubmission: async (id: string, score: number, feedback: string): Promise<void> => {
    const all = JSON.parse(localStorage.getItem('submissions_v18') || '[]');
    const idx = all.findIndex((s: ManualSubmission) => s.id === id);
    if (idx > -1) {
      all[idx].status = 'Graded';
      localStorage.setItem('submissions_v18', JSON.stringify(all));
    }
  },
  getQualifications: async (): Promise<Qualification[]> => db.qualifications,
  // Added getQualificationById to fix Error in components/QualificationLeadForm.tsx
  getQualificationById: async (id: string): Promise<Qualification | undefined> => {
    const all = await api.getQualifications();
    return all.find(q => q.id === id);
  },
  // Added submitQualificationLead to fix Error in components/QualificationLeadForm.tsx
  submitQualificationLead: async (data: any): Promise<QualificationLead> => {
    const lead: QualificationLead = {
      id: `QL-${Date.now()}`,
      ...data,
      timestamp: new Date().toISOString()
    };
    const all = JSON.parse(localStorage.getItem('qual_leads_v18') || '[]');
    localStorage.setItem('qual_leads_v18', JSON.stringify([lead, ...all]));
    return lead;
  },
  // Added submitTestBooking to fix Error in components/RegistrationForm.tsx
  submitTestBooking: async (data: any): Promise<TestBooking> => {
    const booking: TestBooking = {
      id: `TB-${Date.now()}`,
      ...data,
      timestamp: new Date().toISOString()
    };
    const all = JSON.parse(localStorage.getItem('test_bookings_v18') || '[]');
    localStorage.setItem('test_bookings_v18', JSON.stringify([booking, ...all]));
    return booking;
  },
  // Added verifyEmail to fix Error in components/VerificationPending.tsx
  verifyEmail: async (email: string): Promise<void> => {
    await api.upsertUser({ email, verified: true, status: 'Active' });
  },
  getImmigrationGuides: async (): Promise<ImmigrationGuideData[]> => db.immigrationGuides,
  submitBankTransfer: async (productId: string, quantity: number, email: string, buyerName: string, bankRef: string, bankLastFour: string): Promise<Order> => {
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
    const p = await api.getProductById(productId);
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
    const all = await api.getOrders();
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...all]));
    return order;
  },
};
