
import * as db from './db';
import { MailService } from './mailService';
import { 
  Product, VoucherCode, Order, User, SecurityStatus, LMSCourse, 
  LMSModule, Enrollment, TestResult, Qualification, 
  QualificationLead, TestBooking, ManualSubmission, FinanceReport, UserRole, 
  Lead, University, CountryGuide, Course, LMSPracticeTest, ImmigrationGuideData, LMSLesson, OrderStatus
} from '../types';

const SESSION_KEY = 'unicou_active_session_v4';
const LEADS_KEY = 'unicou_leads_v1';
const ORDERS_KEY = 'unicou_orders_v1';
const USERS_KEY = 'unicou_local_users_v1';
const SECURITY_KEY = 'unicou_shield_state';
const PRODUCTS_KEY = 'unicou_custom_products';
const CODES_KEY = 'unicou_inventory_vault_v1';
const SYSTEM_SETTINGS_KEY = 'unicou_global_settings_v1';
const LMS_COURSES_KEY = 'unicou_lms_courses_v1';
const LMS_MODULES_KEY = 'unicou_lms_modules_v1';
const LMS_ENROLLMENTS_KEY = 'unicou_lms_enrollments_v1';

export const api = {
  getSystemSettings: () => {
    const raw = localStorage.getItem(SYSTEM_SETTINGS_KEY);
    return raw ? JSON.parse(raw) : { globalEmailRedirect: '', isTestMode: false };
  },

  updateSystemSettings: (settings: { globalEmailRedirect: string, isTestMode: boolean }) => {
    localStorage.setItem(SYSTEM_SETTINGS_KEY, JSON.stringify(settings));
  },

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

  addVoucherCodes: async (productId: string, codes: string[]): Promise<void> => {
    const allCodes = await api.getCodes();
    const newCodes: VoucherCode[] = codes.map(code => ({
      id: `vc-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      productId,
      code: code.trim().toUpperCase(),
      status: 'Available',
      expiryDate: '2026-12-31',
      uploadDate: new Date().toISOString()
    }));
    localStorage.setItem(CODES_KEY, JSON.stringify([...allCodes, ...newCodes]));
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
    return newUser;
  },

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

  checkUserQuota: async (paymentMethod: 'Card' | 'BankTransfer', currentQuantity: number = 1): Promise<{ allowed: boolean; reason?: string }> => {
    const security = api.getSecurityState();
    if (security.isGlobalOrderStop) return { allowed: false, reason: 'SYSTEM_LOCKED' };
    const sessionUser = api.getCurrentUser();
    if (!sessionUser) return { allowed: false, reason: 'AUTH_REQUIRED' };
    return { allowed: true };
  },

  submitBankTransfer: async (productId: string, quantity: number, email: string, buyerName: string, bankRef: string): Promise<Order> => {
    const quota = await api.checkUserQuota('BankTransfer', quantity);
    if (!quota.allowed) throw new Error(`Procurement limit exceeded.`);

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

  deleteOrder: async (orderId: string): Promise<void> => {
    const allOrders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    const filteredOrders = allOrders.filter(o => o.id !== orderId);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(filteredOrders));

    const allCodes = await api.getCodes();
    const updatedCodes = allCodes.map(c => {
      if (c.orderId === orderId) {
        return { ...c, status: 'Available' as const, orderId: undefined, buyerName: undefined, assignmentDate: undefined };
      }
      return c;
    });
    localStorage.setItem(CODES_KEY, JSON.stringify(updatedCodes));
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<void> => {
    if (status === 'Approved') {
      await api.fulfillOrder(orderId);
      return;
    }

    const allOrders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    const orderIndex = allOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;
    
    const order = allOrders[orderIndex];
    allOrders[orderIndex] = { ...order, status };
    localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));

    const settings = api.getSystemSettings();
    const targetEmail = (settings.isTestMode && settings.globalEmailRedirect) 
      ? settings.globalEmailRedirect 
      : order.customerEmail;

    if (status === 'Hold' || status === 'Rejected') {
      await MailService.sendOrderStatusEmail(order.buyerName, targetEmail, order.id, status);
    }
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
    if (order.status === 'Approved') return;

    const allCodes = await api.getCodes();
    const targetCodes = allCodes
      .filter(c => c.productId === order.productId && c.status === 'Available')
      .slice(0, order.quantity);

    if (targetCodes.length < order.quantity) throw new Error("Vault Exhausted.");

    const assignedCodes = targetCodes.map(c => c.code);
    
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

    allOrders[orderIndex] = { ...order, status: 'Approved', voucherCodes: assignedCodes };
    localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));

    const settings = api.getSystemSettings();
    const targetEmail = (settings.isTestMode && settings.globalEmailRedirect) 
      ? settings.globalEmailRedirect 
      : order.customerEmail;

    await MailService.sendOrderStatusEmail(order.buyerName, targetEmail, order.id, 'Approved', assignedCodes);
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

  deleteProduct: async (id: string): Promise<void> => {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) return;
    const custom: Product[] = JSON.parse(raw);
    const filtered = custom.filter(p => p.id !== id);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
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

  clearAllOrders: async (): Promise<void> => {
    localStorage.removeItem(ORDERS_KEY);
    const allCodes = await api.getCodes();
    const resetCodes = allCodes.map(c => ({
      ...c,
      status: 'Available' as const,
      orderId: undefined,
      buyerName: undefined,
      assignmentDate: undefined
    }));
    localStorage.setItem(CODES_KEY, JSON.stringify(resetCodes));
  },

  resetSystemData: async (): Promise<void> => {
    localStorage.removeItem(ORDERS_KEY);
    localStorage.removeItem(LEADS_KEY);
    localStorage.removeItem(PRODUCTS_KEY);
    localStorage.removeItem(CODES_KEY);
    localStorage.removeItem(LMS_ENROLLMENTS_KEY);
    localStorage.removeItem(SECURITY_KEY);
  },

  logout: () => localStorage.removeItem(SESSION_KEY),
  getLeads: async (): Promise<Lead[]> => JSON.parse(localStorage.getItem(LEADS_KEY) || '[]'),
  submitLead: async (type: string, data: any): Promise<void> => {
    const leads = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
    localStorage.setItem(LEADS_KEY, JSON.stringify([{ id: Date.now().toString(), type, data, status: 'New', timestamp: new Date().toISOString() }, ...leads]));
  },
  getFinanceReport: async (): Promise<FinanceReport> => {
    const orders = await api.getOrders();
    const completed = orders.filter(o => o.status === 'Approved');
    const revenue = completed.reduce((sum, o) => sum + o.totalAmount, 0);
    const sold = completed.reduce((sum, o) => sum + o.quantity, 0);
    
    return { 
      totalRevenue: revenue, 
      totalVouchersSold: sold, 
      salesByType: [], 
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
  
  getAllLMSCourses: async (): Promise<LMSCourse[]> => {
    const raw = localStorage.getItem(LMS_COURSES_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(LMS_COURSES_KEY, JSON.stringify(db.lmsCourses));
    return db.lmsCourses;
  },

  getEnrolledCourses: async (): Promise<LMSCourse[]> => {
    const user = api.getCurrentUser();
    if (!user) return [];
    const enrollments: Enrollment[] = JSON.parse(localStorage.getItem(LMS_ENROLLMENTS_KEY) || '[]');
    const userEnrollments = enrollments.filter(e => e.userId === user.id);
    const allCourses = await api.getAllLMSCourses();
    if (userEnrollments.length === 0 && user.role === 'Student') {
       return allCourses.slice(0, 1);
    }
    return allCourses.filter(c => userEnrollments.some(e => e.courseId === c.id));
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
      : [course, ...all];
    localStorage.setItem(LMS_COURSES_KEY, JSON.stringify(updated));
  },

  deleteLMSCourse: async (courseId: string) => {
    const all = await api.getAllLMSCourses();
    localStorage.setItem(LMS_COURSES_KEY, JSON.stringify(all.filter(c => c.id !== courseId)));
  },

  saveLMSModule: async (courseId: string, module: LMSModule) => {
    const raw = localStorage.getItem(LMS_MODULES_KEY);
    const allModules: Record<string, LMSModule[]> = raw ? JSON.parse(raw) : {};
    const courseModules = allModules[courseId] || [];
    const updated = courseModules.some(m => m.id === module.id) ? courseModules.map(m => m.id === module.id ? module : m) : [...courseModules, module];
    allModules[courseId] = updated;
    localStorage.setItem(LMS_MODULES_KEY, JSON.stringify(allModules));
  },

  saveLMSLesson: async (courseId: string, moduleId: string, lesson: LMSLesson) => {
    const raw = localStorage.getItem(LMS_MODULES_KEY);
    const allModules: Record<string, LMSModule[]> = raw ? JSON.parse(raw) : {};
    const courseModules = allModules[courseId] || [];
    const updated = courseModules.map(m => {
      if (m.id === moduleId) {
        const lessons = m.lessons || [];
        const updatedLessons = lessons.some(l => l.id === lesson.id) ? lessons.map(l => l.id === lesson.id ? lesson : l) : [...lessons, lesson];
        return { ...m, lessons: updatedLessons };
      }
      return m;
    });
    allModules[courseId] = updated;
    localStorage.setItem(LMS_MODULES_KEY, JSON.stringify(allModules));
  },

  getEnrollmentByCourse: async (id: string): Promise<Enrollment | null> => {
    const user = api.getCurrentUser();
    if (!user) return null;
    const enrollments: Enrollment[] = JSON.parse(localStorage.getItem(LMS_ENROLLMENTS_KEY) || '[]');
    return enrollments.find(e => e.userId === user.id && e.courseId === id) || null;
  },

  updateCourseProgress: async (id: string, p: number): Promise<void> => {
    const user = api.getCurrentUser();
    if (!user) return;
    const enrollments: Enrollment[] = JSON.parse(localStorage.getItem(LMS_ENROLLMENTS_KEY) || '[]');
    const existing = enrollments.findIndex(e => e.userId === user.id && e.courseId === id);
    if (existing !== -1) {
      enrollments[existing].progress = p;
    } else {
      enrollments.push({ id: `enr-${Date.now()}`, userId: user.id, courseId: id, progress: p });
    }
    localStorage.setItem(LMS_ENROLLMENTS_KEY, JSON.stringify(enrollments));
  },

  redeemCourseVoucher: async (code: string): Promise<void> => {
     const user = api.getCurrentUser();
     if (!user) throw new Error("Auth required.");
     if (code.toUpperCase().endsWith('-LMS')) {
        await api.updateCourseProgress('lms-1', 0);
     } else {
        throw new Error("Invalid Authorization Token.");
     }
  },

  getTestById: async (id: string): Promise<LMSPracticeTest | undefined> => db.lmsTests.find(t => t.id === id),
  submitTestResult: async (id: string, a: any, t: number): Promise<TestResult> => ({ id: '1', userId: 'u', testId: id, testTitle: 'PTE Mock', skillScores: [], overallBand: '8', timeTaken: t, timestamp: '' } as any),
  getTestResults: async (): Promise<TestResult[]> => db.testResults,
  getPendingSubmissions: async (): Promise<ManualSubmission[]> => db.manualSubmissions,
  gradeSubmission: async (id: string, s: number, f: string): Promise<void> => {
     console.log(`Graded ${id}`);
  },
  getImmigrationGuides: async (): Promise<ImmigrationGuideData[]> => db.immigrationGuides,
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
  },
  bypassUserQuota: async (email: string): Promise<void> => {
    const rawUsers = localStorage.getItem(USERS_KEY);
    const users: User[] = rawUsers ? JSON.parse(rawUsers) : [];
    const updatedUsers = users.map(u => u.email.toLowerCase() === email.toLowerCase() ? { ...u, canBypassQuota: true } : u);
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  },
  addProduct: async (p: Product): Promise<void> => {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    const custom = raw ? JSON.parse(raw) : [];
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify([p, ...custom]));
  }
};
