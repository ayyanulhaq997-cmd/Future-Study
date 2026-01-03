
import * as db from './db';
import { MailService } from './mailService';
import { 
  Product, VoucherCode, Order, User, SecurityStatus, LMSCourse, 
  LMSModule, Enrollment, TestResult, ManualSubmission, FinanceReport, UserRole, 
  Lead, LMSPracticeTest, LMSLesson, OrderStatus, BusinessMetrics,
  University, CountryGuide, Course, Qualification, ImmigrationGuideData,
  QualificationLead, TestBooking
} from '../types';

const SESSION_KEY = 'unicou_active_session_v5';
const ORDERS_KEY = 'unicou_orders_v2';
const USERS_KEY = 'unicou_local_users_v2';
const CODES_KEY = 'unicou_inventory_vault_v2';
const LMS_COURSES_KEY = 'unicou_lms_courses_v2';
const LMS_MODULES_KEY = 'unicou_lms_modules_v2';
const LMS_ENROLLMENTS_KEY = 'unicou_lms_enrollments_v2';

export const api = {
  // --- BUSINESS INTELLIGENCE NODES ---
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

  // --- MANDATORY 3-STAGE ORDER PROCESSING (REQ: EMAIL AT EVERY STEP) ---
  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<void> => {
    const allOrders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    const orderIndex = allOrders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return;
    
    const order = allOrders[orderIndex];

    if (status === 'Approved') {
      // Stage I: Payment verified -> Approval & Fulfillment
      await api.fulfillOrder(orderId);
    } else {
      // Stage II: Hold or Stage III: Rejected
      allOrders[orderIndex].status = status;
      localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
      
      // Dispatch Email Notification for Hold or Rejected status
      if (status === 'Hold' || status === 'Rejected') {
        await MailService.sendOrderStatusEmail(order.buyerName, order.customerEmail, order.id, status);
      }
    }
  },

  fulfillOrder: async (orderId: string): Promise<void> => {
    const allOrders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    const orderIndex = allOrders.findIndex(o => o.id === orderId);
    const order = allOrders[orderIndex];
    if (order.status === 'Approved') return;

    const allCodes = await api.getCodes();
    const targetCodes = allCodes.filter(c => c.productId === order.productId && c.status === 'Available').slice(0, order.quantity);
    
    if (targetCodes.length < order.quantity) {
      throw new Error("Vault Exhausted: Insufficient stock for fulfillment.");
    }

    const assigned = targetCodes.map(c => c.code);
    const updatedCodes = allCodes.map(c => assigned.includes(c.code) ? { ...c, status: 'Used' as const, orderId: order.id } : c);
    localStorage.setItem(CODES_KEY, JSON.stringify(updatedCodes));

    allOrders[orderIndex] = { ...order, status: 'Approved', voucherCodes: assigned };
    localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));

    // Dispatch Approval Email with allocated Voucher Codes
    await MailService.sendOrderStatusEmail(order.buyerName, order.customerEmail, order.id, 'Approved', assigned);
  },

  // --- LMS MANAGEMENT NODES ---
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

  // --- CORE SYSTEM NODES ---
  submitBankTransfer: async (productId: string, quantity: number, email: string, buyerName: string, bankRef: string): Promise<Order> => {
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
      bankRef,
      proofAttached: true,
      userId: currentUser.id,
      productId,
      currency: p?.currency || 'USD',
      customerEmail: currentUser.email,
      status: 'Pending',
      paymentMethod: 'BankTransfer',
      timestamp: now.toISOString(),
      voucherCodes: [],
      quantity
    };
    
    const allOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...allOrders]));
    return order;
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },
  getUsers: async (): Promise<User[]> => {
    const raw = localStorage.getItem(USERS_KEY);
    return [...db.users, ...(raw ? JSON.parse(raw) : [])];
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
  getLeads: async (): Promise<Lead[]> => [],
  submitLead: async (type: any, data: any) => { console.log(`Lead transmitted: ${type}`, data); },
  verifyLogin: async (id: string, p: string) => {
    const user = db.users.find(u => u.email === id);
    if (user) { localStorage.setItem(SESSION_KEY, JSON.stringify(user)); return user; }
    throw new Error("Incorrect Identity Node Credentials.");
  },
  getEnrolledCourses: async (): Promise<LMSCourse[]> => {
    const session = api.getCurrentUser();
    if (!session) return [];
    const raw = localStorage.getItem(LMS_ENROLLMENTS_KEY);
    const all: Enrollment[] = raw ? JSON.parse(raw) : [];
    const myIds = all.filter(e => e.userId === session.id).map(e => e.courseId);
    const courses = await api.getAllLMSCourses();
    return courses.filter(c => myIds.includes(c.id));
  },
  redeemCourseVoucher: async (code: string) => {
    const session = api.getCurrentUser();
    if (!session) throw new Error("Auth required");
    const allEnrollments = JSON.parse(localStorage.getItem(LMS_ENROLLMENTS_KEY) || '[]');
    const course = (await api.getAllLMSCourses())[0]; 
    const exists = allEnrollments.some((e: any) => e.userId === session.id && e.courseId === course.id);
    if (!exists) {
      allEnrollments.push({ id: `en-${Date.now()}`, userId: session.id, courseId: course.id, progress: 0 });
      localStorage.setItem(LMS_ENROLLMENTS_KEY, JSON.stringify(allEnrollments));
    }
  },
  getEnrollmentByCourse: async (id: string) => {
    const session = api.getCurrentUser();
    if (!session) return null;
    const all: Enrollment[] = JSON.parse(localStorage.getItem(LMS_ENROLLMENTS_KEY) || '[]');
    return all.find(e => e.userId === session.id && e.courseId === id) || null;
  },
  updateCourseProgress: async (id: string, p: number) => {
    const session = api.getCurrentUser();
    if (!session) return;
    const all: Enrollment[] = JSON.parse(localStorage.getItem(LMS_ENROLLMENTS_KEY) || '[]');
    const updated = all.map(e => (e.userId === session.id && e.courseId === id) ? { ...e, progress: p } : e);
    localStorage.setItem(LMS_ENROLLMENTS_KEY, JSON.stringify(updated));
  },
  getGuideBySlug: async (s: string) => db.countryGuides.find(g => g.slug === s) || null,
  getUniversitiesByCountry: async (id: string) => db.universities.filter(u => u.countryId === id),
  getTestById: async (id: string) => db.lmsTests.find(t => t.id === id) || null,
  submitTestResult: async (testId: string, a: any, t: number) => {
    return { id: `res-${Date.now()}`, userId: 'u', testId, testTitle: 'PTE Mock', skillScores: [], overallBand: 'PENDING', timeTaken: t, timestamp: new Date().toISOString() } as any;
  },
  getTestResults: async () => db.testResults,
  getPendingSubmissions: async () => db.manualSubmissions,
  gradeSubmission: async (id: string, s: number, f: string) => { console.log(`Evaluation Committed: ${id}`); },
  verifyEmail: async (e: string) => { console.log(`Identity verified: ${e}`); },
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
