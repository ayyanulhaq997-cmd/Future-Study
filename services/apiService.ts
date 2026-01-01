import * as db from './db';
import { MailService } from './mailService';
import { 
  Product, VoucherCode, Order, User, SecurityStatus, LMSCourse, 
  LMSModule, Enrollment, TestResult, Qualification, 
  QualificationLead, TestBooking, ManualSubmission, FinanceReport, UserRole, 
  ImmigrationGuideData, Lead, University, CountryGuide, Course, LMSPracticeTest
} from '../types';

const SESSION_KEY = 'unicou_active_session_v4';
const LEADS_KEY = 'unicou_leads_v1';
const ORDERS_KEY = 'unicou_orders_v1';
const CODES_KEY = 'unicou_codes_v1';
const USERS_KEY = 'unicou_local_users_v1';
const SECURITY_KEY = 'unicou_shield_state';
const PRODUCTS_KEY = 'unicou_custom_products';

export const api = {
  // --- Security Architecture ---
  getSecurityState: (): SecurityStatus => {
    const raw = localStorage.getItem(SECURITY_KEY);
    return raw ? JSON.parse(raw) : { isGlobalOrderStop: false, threatLevel: 'Normal', lastAudit: new Date().toISOString() };
  },

  setGlobalStop: (stop: boolean) => {
    const current = api.getSecurityState();
    localStorage.setItem(SECURITY_KEY, JSON.stringify({ ...current, isGlobalOrderStop: stop }));
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  login: async (email: string): Promise<User> => {
    let cleanEmail = email.trim().toLowerCase();
    const raw = localStorage.getItem(USERS_KEY);
    const localUsers: User[] = raw ? JSON.parse(raw) : [];
    const allUsers = [...db.users, ...localUsers];
    
    const user = allUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) throw new Error('Identity Node Not Found.');
    if (user.status === 'Suspended') throw new Error('Security Restriction: Node Suspended.');
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  signup: async (email: string, role: UserRole): Promise<User> => {
    const cleanEmail = email.trim().toLowerCase();
    const raw = localStorage.getItem(USERS_KEY);
    const localUsers = raw ? JSON.parse(raw) : [];
    
    if (localUsers.find((u: User) => u.email.toLowerCase() === cleanEmail)) {
       throw new Error("Identity conflict: Node already registered in registry.");
    }

    const newUser: User = { 
      id: `u-${Math.random().toString(36).substr(2, 9)}`, 
      name: cleanEmail.split('@')[0].toUpperCase(), 
      email: cleanEmail, 
      role, 
      status: role === 'Agent Partner/Prep Center' ? 'Pending' : 'Active',
      verified: true, 
      isAuthorized: role !== 'Agent Partner/Prep Center' 
    };
    
    localStorage.setItem(USERS_KEY, JSON.stringify([...localUsers, newUser]));
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return newUser;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getProducts: async (): Promise<Product[]> => {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    const custom = raw ? JSON.parse(raw) : [];
    return [...db.products, ...custom];
  },

  addProduct: async (p: Product): Promise<void> => {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    const custom = raw ? JSON.parse(raw) : [];
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify([p, ...custom]));
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    const all = await api.getProducts();
    return all.find(p => p.id === id);
  },
  
  getOrders: async (): Promise<Order[]> => {
    const currentUser = api.getCurrentUser();
    if (!currentUser) return [];
    const allOrders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    if (['System Admin/Owner', 'Finance/Audit Team', 'Operation Manager'].includes(currentUser.role)) {
      return allOrders;
    }
    return allOrders.filter(o => o.userId === currentUser.id);
  },

  getOrderById: async (id: string): Promise<Order | null> => {
    const all = await api.getOrders();
    return all.find(o => o.id === id) || null;
  },

  fulfillOrder: async (orderId: string): Promise<void> => {
    const allOrders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    const orderIndex = allOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) throw new Error("Order node not found.");
    
    const order = allOrders[orderIndex];
    if (order.status !== 'Pending') return;

    // Assignment Logic
    const availableCodes: VoucherCode[] = [...db.voucherCodes]; // In real app, from local storage CODES_KEY
    const targetCodes = availableCodes
      .filter(c => c.productId === order.productId && c.status === 'Available')
      .slice(0, order.quantity);

    if (targetCodes.length < order.quantity) {
      throw new Error("Vault Exhausted: Not enough codes in inventory for this fulfillment.");
    }

    const assignedCodes = targetCodes.map(c => c.code);
    
    // Update order state
    allOrders[orderIndex] = { 
      ...order, 
      status: 'Completed', 
      voucherCodes: assignedCodes 
    };
    
    localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));

    // TRIGGER EMAIL DISPATCH
    await MailService.sendVoucherEmail(
      order.buyerName, 
      order.customerEmail, 
      order.productName, 
      assignedCodes, 
      order.id
    );
  },

  checkUserQuota: async (): Promise<{ allowed: boolean; reason?: string }> => {
    const security = api.getSecurityState();
    if (security.isGlobalOrderStop) return { allowed: false, reason: 'SYSTEM_LOCKED' };
    const currentUser = api.getCurrentUser();
    if (!currentUser) return { allowed: false, reason: 'AUTH_REQUIRED' };
    if (!currentUser.verified) return { allowed: false, reason: 'EMAIL_VERIFICATION_REQUIRED' };
    if (currentUser.canBypassQuota) return { allowed: true };
    const allOrders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    const oneDayAgo = new Date().getTime() - (24 * 60 * 60 * 1000);
    if (currentUser.role === 'Student') {
      const recentOrders = allOrders.filter(o => 
        o.userId === currentUser.id && 
        new Date(o.timestamp).getTime() > oneDayAgo
      );
      if (recentOrders.length >= 1) return { allowed: false, reason: 'DAILY_QUOTA_REACHED' };
    }
    return { allowed: true };
  },

  submitBankTransfer: async (productId: string, quantity: number, email: string, buyerName: string, bankRef: string): Promise<Order> => {
    const p = await api.getProductById(productId);
    const currentUser = api.getCurrentUser();
    if (!currentUser) throw new Error("Session Invalid.");

    const order: Order = {
      id: `UNICOU-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
      userId: currentUser.id,
      productId,
      productName: p?.name || 'Voucher',
      quantity,
      totalAmount: (p?.basePrice || 0) * quantity,
      currency: p?.currency || 'USD',
      customerEmail: email,
      buyerName: buyerName || currentUser.name,
      status: 'Pending',
      paymentMethod: 'BankTransfer',
      timestamp: new Date().toISOString(),
      voucherCodes: [],
      bankRef,
      proofAttached: true
    };
    
    const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...allOrders]));
    return order;
  },

  getCodes: async (): Promise<VoucherCode[]> => db.voucherCodes,
  getLeads: async (): Promise<Lead[]> => JSON.parse(localStorage.getItem(LEADS_KEY) || '[]'),
  submitLead: async (type: string, data: any): Promise<void> => {
    const leads = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
    localStorage.setItem(LEADS_KEY, JSON.stringify([{ id: Date.now().toString(), type, data, status: 'New', timestamp: new Date().toISOString() }, ...leads]));
  },
  getFinanceReport: async (): Promise<FinanceReport> => ({ totalRevenue: 50000, totalVouchersSold: 420, salesByType: [], recentSales: [] }),
  getUsers: async (): Promise<User[]> => {
    const raw = localStorage.getItem(USERS_KEY);
    const localUsers = raw ? JSON.parse(raw) : [];
    return [...db.users, ...localUsers];
  },
  verifyEmail: async (email: string) => {
    const raw = localStorage.getItem(USERS_KEY);
    const users: User[] = raw ? JSON.parse(raw) : [];
    const updated = users.map(u => u.email.toLowerCase() === email.toLowerCase() ? { ...u, verified: true } : u);
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));
    const active = api.getCurrentUser();
    if (active && active.email.toLowerCase() === email.toLowerCase()) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ ...active, verified: true }));
    }
  },
  getQualifications: async (): Promise<Qualification[]> => db.qualifications,
  getGuideBySlug: async (slug: string): Promise<CountryGuide | null> => db.countryGuides.find(g => g.slug === slug) || null,
  getUniversities: async (): Promise<University[]> => db.universities,
  getUniversityBySlug: async (slug: string): Promise<University | null> => db.universities.find(u => u.slug === slug) || null,
  getUniversitiesByCountry: async (id: string): Promise<University[]> => db.universities.filter(u => u.countryId === id),
  getCoursesByUniversity: async (id: string): Promise<Course[]> => db.courses.filter(c => c.universityId === id),
  getAllLMSCourses: async (): Promise<LMSCourse[]> => db.lmsCourses,
  getEnrolledCourses: async (): Promise<LMSCourse[]> => db.lmsCourses,
  getCourseModules: async (id: string): Promise<LMSModule[]> => [],
  getEnrollmentByCourse: async (id: string): Promise<Enrollment | null> => null,
  updateCourseProgress: async (id: string, p: number): Promise<void> => {},
  redeemCourseVoucher: async (c: string): Promise<void> => {},
  getTestById: async (id: string): Promise<LMSPracticeTest | undefined> => db.lmsTests[0],
  submitTestResult: async (id: string, a: any, t: number): Promise<TestResult> => ({ id: '1', userId: 'u', testId: id, testTitle: 'T', skillScores: [], overallBand: '8', timeTaken: t, timestamp: '' } as any),
  getTestResults: async (): Promise<TestResult[]> => [],
  getPendingSubmissions: async (): Promise<ManualSubmission[]> => [],
  gradeSubmission: async (id: string, s: number, f: string): Promise<void> => {},
  getImmigrationGuides: async (): Promise<ImmigrationGuideData[]> => [],
  processOrderAction: async (id: string, a: string): Promise<any> => ({} as any),
  getQualificationById: async (id: string): Promise<Qualification | undefined> => db.qualifications.find(q => q.id === id),
  submitQualificationLead: async (d: any): Promise<QualificationLead> => ({ ...d, id: '1', timestamp: '', status: 'New', trackingId: 'T' }),
  submitTestBooking: async (d: any): Promise<TestBooking> => ({ ...d, id: '1', trackingRef: 'T' }),
  // Fixes: Error in file components/AdminDashboard.tsx on line 62: Property 'verifyAgent' does not exist
  verifyAgent: async (leadId: string): Promise<void> => {
    const rawLeads = localStorage.getItem(LEADS_KEY);
    const leads: Lead[] = rawLeads ? JSON.parse(rawLeads) : [];
    const leadIndex = leads.findIndex(l => l.id === leadId);
    if (leadIndex === -1) return;

    leads[leadIndex].status = 'Approved';
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));

    const email = leads[leadIndex].data.email;
    if (!email) return;

    const rawUsers = localStorage.getItem(USERS_KEY);
    const users: User[] = rawUsers ? JSON.parse(rawUsers) : [];
    const updatedUsers = users.map(u => 
      u.email.toLowerCase() === email.toLowerCase() 
      ? { ...u, isAuthorized: true, status: 'Active' as const } 
      : u
    );
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  },
  // Fixes: Error in file components/SupportDashboard.tsx on line 30: Property 'bypassUserQuota' does not exist
  bypassUserQuota: async (email: string): Promise<void> => {
    const rawUsers = localStorage.getItem(USERS_KEY);
    const users: User[] = rawUsers ? JSON.parse(rawUsers) : [];
    const updatedUsers = users.map(u => 
      u.email.toLowerCase() === email.toLowerCase() 
      ? { ...u, canBypassQuota: true } 
      : u
    );
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    
    const active = api.getCurrentUser();
    if (active && active.email.toLowerCase() === email.toLowerCase()) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ ...active, canBypassQuota: true }));
    }
  }
};