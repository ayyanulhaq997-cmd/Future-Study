
import * as db from './db';
import { MailService } from './mailService';
import { 
  Product, VoucherCode, Order, User, SecurityStatus, LMSCourse, 
  LMSModule, Enrollment, TestResult, Qualification, 
  QualificationLead, TestBooking, ManualSubmission, FinanceReport, UserRole, 
  Lead, University, CountryGuide, Course, LMSPracticeTest, ImmigrationGuideData
} from '../types';

const SESSION_KEY = 'unicou_active_session_v4';
const LEADS_KEY = 'unicou_leads_v1';
const ORDERS_KEY = 'unicou_orders_v1';
const USERS_KEY = 'unicou_local_users_v1';
const SECURITY_KEY = 'unicou_shield_state';
const PRODUCTS_KEY = 'unicou_custom_products';
const CODES_KEY = 'unicou_inventory_vault_v1';

export const api = {
  getSecurityState: (): SecurityStatus => {
    const raw = localStorage.getItem(SECURITY_KEY);
    return raw ? JSON.parse(raw) : { isGlobalOrderStop: false, threatLevel: 'Normal', lastAudit: new Date().toISOString() };
  },

  setGlobalStop: (stop: boolean) => {
    const current = api.getSecurityState();
    localStorage.setItem(SECURITY_KEY, JSON.stringify({ 
      ...current, 
      isGlobalOrderStop: stop,
      threatLevel: stop ? 'Critical' : 'Normal',
      lastAudit: new Date().toISOString()
    }));
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  getCodes: async (): Promise<VoucherCode[]> => {
    const raw = localStorage.getItem(CODES_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(CODES_KEY, JSON.stringify(db.voucherCodes));
    return db.voucherCodes;
  },

  signup: async (email: string, role: UserRole): Promise<User> => {
    const cleanEmail = email.trim().toLowerCase();
    const raw = localStorage.getItem(USERS_KEY);
    const localUsers = raw ? JSON.parse(raw) : [];
    
    if (localUsers.find((u: User) => u.email.toLowerCase() === cleanEmail)) {
       throw new Error("Identity conflict: Node already registered.");
    }

    const newUser: User = { 
      id: `u-${Math.random().toString(36).substr(2, 9)}`, 
      name: cleanEmail.split('@')[0].toUpperCase(), 
      email: cleanEmail, 
      role, 
      status: (role === 'Agent' || role === 'Institute') ? 'Pending' : 'Active',
      verified: true, 
      isAuthorized: (role !== 'Agent' && role !== 'Institute'),
      agreementDate: new Date().toISOString() 
    };
    
    localStorage.setItem(USERS_KEY, JSON.stringify([...localUsers, newUser]));
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return newUser;
  },

  checkUserQuota: async (paymentMethod: 'Card' | 'BankTransfer', currentQuantity: number = 1): Promise<{ allowed: boolean; reason?: string }> => {
    const security = api.getSecurityState();
    if (security.isGlobalOrderStop) return { allowed: false, reason: 'SYSTEM_LOCKED' };
    
    const currentUser = api.getCurrentUser();
    if (!currentUser) return { allowed: false, reason: 'AUTH_REQUIRED' };
    
    if (['System Admin/Owner', 'Operation Manager'].includes(currentUser.role)) return { allowed: true };
    if (currentUser.canBypassQuota) return { allowed: true };

    const allOrders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    const oneDayAgo = new Date().getTime() - (24 * 60 * 60 * 1000);
    const recentOrders = allOrders.filter(o => o.userId === currentUser.id && o.status !== 'Cancelled' && new Date(o.timestamp).getTime() > oneDayAgo);

    if (currentUser.role === 'Student') {
      const studentTotal = recentOrders.reduce((sum, o) => sum + o.quantity, 0);
      if (studentTotal + currentQuantity > 1) return { allowed: false, reason: 'STUDENT_LIMIT' };
    }

    if (currentUser.role === 'Agent' || currentUser.role === 'Institute') {
      const cardTotal = recentOrders.filter(o => o.paymentMethod === 'Gateway').reduce((sum, o) => sum + o.quantity, 0);
      const bankTotal = recentOrders.filter(o => o.paymentMethod === 'BankTransfer').reduce((sum, o) => sum + o.quantity, 0);
      
      if (paymentMethod === 'Card' && (cardTotal + currentQuantity > 3)) return { allowed: false, reason: 'AGENT_CARD_LIMIT' };
      if (paymentMethod === 'BankTransfer' && (bankTotal + currentQuantity > 10)) return { allowed: false, reason: 'AGENT_BANK_LIMIT' };
    }

    return { allowed: true };
  },

  submitBankTransfer: async (productId: string, quantity: number, email: string, buyerName: string, bankRef: string): Promise<Order> => {
    const quota = await api.checkUserQuota('BankTransfer', quantity);
    if (!quota.allowed) throw new Error(`Procurement limit exceeded (${quota.reason}).`);

    const p = await api.getProductById(productId);
    const currentUser = api.getCurrentUser();
    if (!currentUser) throw new Error("Auth required.");

    const order: Order = {
      id: `UNICOU-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
      userId: currentUser.id,
      productId,
      productName: p?.name || 'Voucher',
      quantity,
      totalAmount: (p?.basePrice || 0) * quantity,
      currency: p?.currency || 'USD',
      customerEmail: currentUser.email,
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

  submitGatewayPayment: async (productId: string, quantity: number, email: string, buyerName: string): Promise<Order> => {
    const quota = await api.checkUserQuota('Card', quantity);
    if (!quota.allowed) throw new Error(`Security Alert: Card procurement limit reached.`);

    const p = await api.getProductById(productId);
    const currentUser = api.getCurrentUser();
    if (!currentUser) throw new Error("Auth required.");

    const order: Order = {
      id: `UNICOU-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
      userId: currentUser.id,
      productId,
      productName: p?.name || 'Voucher',
      quantity,
      totalAmount: (p?.basePrice || 0) * quantity,
      currency: p?.currency || 'USD',
      customerEmail: currentUser.email,
      buyerName: buyerName || currentUser.name,
      status: 'Pending',
      paymentMethod: 'Gateway', 
      timestamp: new Date().toISOString(),
      voucherCodes: [],
      bankRef: 'CARD_AUTH_OK',
      proofAttached: false
    };
    
    const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...allOrders]));
    return order;
  },

  verifyLogin: async (userId: string, code: string): Promise<User> => {
    const cleanId = userId.trim().toLowerCase();
    const dbUser = db.users.find(u => u.email.toLowerCase() === cleanId);
    if (dbUser) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(dbUser));
      return dbUser;
    }

    const raw = localStorage.getItem(USERS_KEY);
    const localUsers: User[] = raw ? JSON.parse(raw) : [];
    const localMatch = localUsers.find(u => u.email.toLowerCase() === cleanId);
    
    if (!localMatch) throw new Error("Incorrect User ID or Password");
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(localMatch));
    return localMatch;
  },

  fulfillOrder: async (orderId: string): Promise<void> => {
    const allOrders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    const orderIndex = allOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;
    
    const order = allOrders[orderIndex];
    if (order.status !== 'Pending') return;

    const allCodes = await api.getCodes();
    const targetCodes = allCodes
      .filter(c => c.productId === order.productId && c.status === 'Available')
      .slice(0, order.quantity);

    if (targetCodes.length < order.quantity) throw new Error("Vault Exhausted.");

    const assignedCodes = targetCodes.map(c => c.code);
    
    // Update local inventory state
    const updatedCodes = allCodes.map(c => {
      if (assignedCodes.includes(c.code)) {
        return { 
          ...c, 
          status: 'Used' as const, 
          orderId: order.id, 
          buyerName: order.buyerName,
          assignmentDate: new Date().toISOString()
        };
      }
      return c;
    });
    localStorage.setItem(CODES_KEY, JSON.stringify(updatedCodes));

    // Update order state
    allOrders[orderIndex] = { ...order, status: 'Completed', voucherCodes: assignedCodes };
    localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));

    await MailService.sendVoucherEmail(order.buyerName, order.customerEmail, order.productName, assignedCodes, order.id);
  },

  getProducts: async (): Promise<Product[]> => {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    const custom = raw ? JSON.parse(raw) : [];
    return [...db.products, ...custom];
  },

  getProductById: async (id: string): Promise<Product | undefined> => {
    const all = await api.getProducts();
    return all.find(p => p.id === id);
  },
  
  getOrders: async (): Promise<Order[]> => {
    const currentUser = api.getCurrentUser();
    if (!currentUser) return [];
    const allOrders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    if (['System Admin/Owner', 'Operation Manager', 'Finance', 'Support'].includes(currentUser.role)) return allOrders;
    return allOrders.filter(o => o.userId === currentUser.id);
  },

  getOrderById: async (id: string): Promise<Order | null> => {
    const orders = await api.getOrders();
    return orders.find(o => o.id === id) || null;
  },

  logout: () => localStorage.removeItem(SESSION_KEY),
  getLeads: async (): Promise<Lead[]> => JSON.parse(localStorage.getItem(LEADS_KEY) || '[]'),
  submitLead: async (type: string, data: any): Promise<void> => {
    const leads = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
    localStorage.setItem(LEADS_KEY, JSON.stringify([{ id: Date.now().toString(), type, data, status: 'New', timestamp: new Date().toISOString() }, ...leads]));
  },
  getFinanceReport: async (): Promise<FinanceReport> => {
    const orders = await api.getOrders();
    const completed = orders.filter(o => o.status === 'Completed');
    const revenue = completed.reduce((sum, o) => sum + o.totalAmount, 0);
    const sold = completed.reduce((sum, o) => sum + o.quantity, 0);
    
    // Group revenue by product category
    const salesByType: Record<string, number> = {};
    completed.forEach(o => {
      const cat = o.productName.split(' ')[0];
      salesByType[cat] = (salesByType[cat] || 0) + o.totalAmount;
    });

    return { 
      totalRevenue: revenue, 
      totalVouchersSold: sold, 
      salesByType: Object.entries(salesByType).map(([name, value]) => ({ name, value })), 
      recentSales: orders 
    };
  },
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
    if (active && active.email.toLowerCase() === email.toLowerCase()) localStorage.setItem(SESSION_KEY, JSON.stringify({ ...active, verified: true }));
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
  getTestResults: async (): Promise<TestResult[]> => db.testResults,
  getPendingSubmissions: async (): Promise<ManualSubmission[]> => db.manualSubmissions,
  gradeSubmission: async (id: string, s: number, f: string): Promise<void> => {
     console.log(`Node Auth: Submission ${id} graded with score ${s}`);
  },
  // Added ImmigrationGuideData to the imports and fixed the type missing on line 303
  getImmigrationGuides: async (): Promise<ImmigrationGuideData[]> => [],
  getQualificationById: async (id: string): Promise<Qualification | undefined> => db.qualifications.find(q => q.id === id),
  submitQualificationLead: async (d: any): Promise<QualificationLead> => ({ ...d, id: '1', timestamp: '', status: 'New', trackingId: 'T' }),
  submitTestBooking: async (d: any): Promise<TestBooking> => ({ ...d, id: '1', trackingRef: 'T' }),
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
    const updatedUsers = users.map(u => u.email.toLowerCase() === email.toLowerCase() ? { ...u, isAuthorized: true, status: 'Active' as const } : u);
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  },
  bypassUserQuota: async (email: string): Promise<void> => {
    const rawUsers = localStorage.getItem(USERS_KEY);
    const users: User[] = rawUsers ? JSON.parse(rawUsers) : [];
    const updatedUsers = users.map(u => u.email.toLowerCase() === email.toLowerCase() ? { ...u, canBypassQuota: true } : u);
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    const active = api.getCurrentUser();
    if (active && active.email.toLowerCase() === email.toLowerCase()) localStorage.setItem(SESSION_KEY, JSON.stringify({ ...active, canBypassQuota: true }));
  },
  addProduct: async (p: Product): Promise<void> => {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    const custom = raw ? JSON.parse(raw) : [];
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify([p, ...custom]));
  }
};
