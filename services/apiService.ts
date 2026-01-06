
import * as db from './db';
import { 
  Product, VoucherCode, Order, User, LMSCourse, 
  LMSModule, Enrollment, TestResult, ManualSubmission, UserRole, 
  Lead, LMSPracticeTest, LMSLesson, OrderStatus, BusinessMetrics,
  University, CountryGuide, Course, Qualification, ImmigrationGuideData,
  QualificationLead, TestBooking
} from '../types';

const SESSION_KEY = 'unicou_active_session_v6';
const ORDERS_KEY = 'unicou_orders_v3';
const USERS_KEY = 'unicou_local_users_v3';
const CODES_KEY = 'unicou_inventory_vault_v3';
const LMS_COURSES_KEY = 'unicou_lms_courses_v3';
const LMS_ENROLLMENTS_KEY = 'unicou_lms_enrollments_v3';
const LEADS_KEY = 'unicou_leads_v3';
const SYSTEM_CONFIG_KEY = 'unicou_global_config_v1';
const TEST_RESULTS_KEY = 'unicou_test_results_v3';
const BOOKINGS_KEY = 'unicou_bookings_v3';

export const api = {
  // --- 1. SYSTEM CONFIG & GLOBAL HALT (Page 1) ---
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
    
    return {
      todaySales: orders.filter(o => o.status === 'Approved').reduce((s,o) => s + o.totalAmount, 0),
      monthRevenue: orders.filter(o => o.status === 'Approved').reduce((s,o) => s + o.totalAmount, 0),
      vouchersInStock: codes.filter(c => c.status === 'Available').length,
      activeAgents: users.filter(u => u.role === 'Agent' && u.status === 'Active').length,
      riskAlerts: orders.filter(o => o.status === 'Hold').length,
      refundRequests: 0,
      systemHealth: api.getSystemHaltStatus() ? 'Critical' : 'Optimal',
      systemHalt: api.getSystemHaltStatus()
    };
  },

  // --- 2. MANDATORY 8-COLUMN ORDER PROCESSING (Page 2) ---
  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<void> => {
    const allOrders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
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
    const allOrders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    const orderIndex = allOrders.findIndex(o => o.id === orderId);
    const order = allOrders[orderIndex];
    if (!order || order.status === 'Approved') return;

    const allCodes = await api.getCodes();
    const targetCodes = allCodes.filter(c => c.productId === order.productId && c.status === 'Available').slice(0, order.quantity);
    
    if (targetCodes.length < order.quantity) {
      throw new Error("Vault Exhausted: Insufficient stock.");
    }

    const assigned = targetCodes.map(c => c.code);
    const updatedCodes = allCodes.map(c => assigned.includes(c.code) ? { ...c, status: 'Used' as const, orderId: order.id } : c);
    localStorage.setItem(CODES_KEY, JSON.stringify(updatedCodes));

    allOrders[orderIndex] = { ...order, status: 'Approved', voucherCodes: assigned, deliveryTime: new Date().toLocaleTimeString('en-GB') };
    localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
  },

  // --- 3. PROCUREMENT TERMINAL LOGIC ---
  submitBankTransfer: async (productId: string, quantity: number, email: string, buyerName: string, bankRef: string, bankLastFour: string): Promise<Order> => {
    return api.createOrderNode(productId, quantity, email, buyerName, bankRef, 'BankTransfer', true, bankLastFour);
  },

  submitGatewayPayment: async (productId: string, quantity: number, email: string, buyerName: string, bankLastFour: string): Promise<Order> => {
    return api.createOrderNode(productId, quantity, email, buyerName, 'CARD_LEDGER_SYNC', 'Gateway', false, bankLastFour);
  },

  createOrderNode: async (productId: string, quantity: number, email: string, buyerName: string, ref: string, method: 'BankTransfer' | 'Gateway', proof: boolean, bankLastFour: string): Promise<Order> => {
    if (api.getSystemHaltStatus()) throw new Error("CRITICAL: Voucher procurement nodes are currently halted.");
    
    const p = await api.getProductById(productId);
    const currentUser = api.getCurrentUser();
    if (!currentUser) throw new Error("Identity verification failed.");

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
    return session ? JSON.parse(session) : null;
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
  verifyLogin: async (id: string, p: string) => {
    const user = (await api.getUsers()).find(u => u.email === id);
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      return user;
    }
    throw new Error("Unauthorized.");
  },
  signup: async (email: string, role: UserRole): Promise<User> => {
    const newUser: User = { 
      id: `u-${Date.now()}`, 
      name: email.split('@')[0], 
      email, 
      role, 
      status: 'Pending', 
      verified: false,
      isAuthorized: role === 'Student'
    };
    const all = await api.getUsers();
    localStorage.setItem(USERS_KEY, JSON.stringify([...all, newUser]));
    return newUser;
  },
  verifyEmail: async (email: string): Promise<void> => {
    const all = await api.getUsers();
    const updated = all.map(u => u.email === email ? { ...u, verified: true, status: 'Active' as const } : u);
    localStorage.setItem(USERS_KEY, JSON.stringify(updated));
    const current = api.getCurrentUser();
    if (current && current.email === email) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ ...current, verified: true, status: 'Active' }));
    }
  },

  // --- LMS NODES ---
  getAllLMSCourses: async (): Promise<LMSCourse[]> => JSON.parse(localStorage.getItem(LMS_COURSES_KEY) || JSON.stringify(db.lmsCourses)),
  getEnrolledCourses: async (): Promise<LMSCourse[]> => {
    const enrollments: Enrollment[] = JSON.parse(localStorage.getItem(LMS_ENROLLMENTS_KEY) || '[]');
    const user = api.getCurrentUser();
    if (!user) return [];
    const myEnrollments = enrollments.filter(e => e.userId === user.id);
    const allCourses = await api.getAllLMSCourses();
    return allCourses.filter(c => myEnrollments.some(e => e.courseId === c.id));
  },
  getCourseModules: async (courseId: string): Promise<LMSModule[]> => {
    // Return mock modules for functional LMS demonstration
    return [
      {
        id: 'mod-1',
        title: 'Module 1: Foundation Strategy',
        lessons: [
          { id: 'les-1', title: 'Course Orientation', type: 'Video', content: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'les-2', title: 'Linguistic Protocol', type: 'Text', content: '### Core Syntax\nFocus on lexical diversity.' },
          { id: 'les-3', title: 'Skill Evaluation', type: 'Quiz', content: JSON.stringify([{id:'q1', question:'What is the primary goal of PTE?', options:['Communication','Memory'], correct:0}]) }
        ]
      }
    ];
  },
  getEnrollmentByCourse: async (courseId: string): Promise<Enrollment | null> => {
    const user = api.getCurrentUser();
    if (!user) return null;
    const enrollments: Enrollment[] = JSON.parse(localStorage.getItem(LMS_ENROLLMENTS_KEY) || '[]');
    return enrollments.find(e => e.userId === user.id && e.courseId === courseId) || null;
  },
  updateCourseProgress: async (courseId: string, progress: number): Promise<void> => {
    const user = api.getCurrentUser();
    if (!user) return;
    const enrollments: Enrollment[] = JSON.parse(localStorage.getItem(LMS_ENROLLMENTS_KEY) || '[]');
    const idx = enrollments.findIndex(e => e.userId === user.id && e.courseId === courseId);
    if (idx !== -1) {
      enrollments[idx].progress = progress;
    } else {
      enrollments.push({ id: `en-${Date.now()}`, userId: user.id, courseId, progress });
    }
    localStorage.setItem(LMS_ENROLLMENTS_KEY, JSON.stringify(enrollments));
  },
  redeemCourseVoucher: async (code: string): Promise<void> => {
    const allCourses = await api.getAllLMSCourses();
    await api.updateCourseProgress(allCourses[0].id, 0); 
  },

  // --- TEST & EVALUATION ---
  getTestById: async (id: string): Promise<LMSPracticeTest | undefined> => db.lmsTests.find(t => t.id === id),
  getTestResults: async () => JSON.parse(localStorage.getItem(TEST_RESULTS_KEY) || JSON.stringify(db.testResults)),
  submitTestResult: async (testId: string, answers: any, timeTaken: number): Promise<TestResult> => {
    const user = api.getCurrentUser();
    const test = await api.getTestById(testId);
    const result: TestResult = {
      id: `res-${Date.now()}`,
      userId: user?.id || 'anon',
      testId,
      testTitle: test?.title || 'Mock Exam',
      skillScores: [
        { skill: 'Listening', score: 75, total: 90, isGraded: true, band: '75' },
        { skill: 'Reading', score: 80, total: 90, isGraded: true, band: '80' },
        { skill: 'Writing', score: 0, total: 90, isGraded: false, band: 'PENDING' },
        { skill: 'Speaking', score: 0, total: 90, isGraded: false, band: 'PENDING' }
      ],
      overallBand: '75',
      timeTaken,
      timestamp: new Date().toISOString()
    };
    const all = await api.getTestResults();
    localStorage.setItem(TEST_RESULTS_KEY, JSON.stringify([result, ...all]));
    return result;
  },
  getPendingSubmissions: async (): Promise<ManualSubmission[]> => db.manualSubmissions,
  gradeSubmission: async (id: string, score: number, feedback: string): Promise<void> => {
    // Automated grading update logic placeholder
  },

  // --- CMS & DIRECTORY NODES ---
  getUniversities: async (): Promise<University[]> => db.universities,
  getUniversitiesByCountry: async (countryId: string): Promise<University[]> => db.universities.filter(u => u.countryId === countryId),
  getUniversityBySlug: async (slug: string): Promise<University | undefined> => db.universities.find(u => u.slug === slug),
  getCoursesByUniversity: async (uniId: string): Promise<Course[]> => db.courses.filter(c => c.universityId === uniId),
  getGuideBySlug: async (s: string) => db.countryGuides.find(g => g.slug === s) || null,
  getQualifications: async (): Promise<Qualification[]> => db.qualifications,
  getQualificationById: async (id: string): Promise<Qualification | undefined> => db.qualifications.find(q => q.id === id),
  getImmigrationGuides: async (): Promise<ImmigrationGuideData[]> => db.immigrationGuides,

  // --- LEADS & CAPTURE NODES ---
  submitLead: async (type: 'student' | 'agent' | 'general', data: any): Promise<void> => {
    const leads = await api.getLeads();
    const lead: Lead = { id: `lead-${Date.now()}`, type, data, status: 'New', timestamp: new Date().toISOString() };
    localStorage.setItem(LEADS_KEY, JSON.stringify([lead, ...leads]));
  },
  getLeads: async (): Promise<Lead[]> => JSON.parse(localStorage.getItem(LEADS_KEY) || '[]'),
  submitQualificationLead: async (data: any): Promise<QualificationLead> => {
    const lead: QualificationLead = { id: `ql-${Date.now()}`, ...data, timestamp: new Date().toISOString() };
    return lead;
  },
  submitTestBooking: async (data: any): Promise<TestBooking> => {
    const booking: TestBooking = { id: `tb-${Date.now()}`, ...data, timestamp: new Date().toISOString() };
    const all = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify([booking, ...all]));
    return booking;
  },

  upsertUser: async (u: Partial<User>) => {
    const all = await api.getUsers();
    localStorage.setItem(USERS_KEY, JSON.stringify(all.map(x => x.id === u.id ? {...x, ...u} : x)));
  },
  addStockToProduct: async (pid: string, codes: string[]) => {
    const all = await api.getCodes();
    const news: VoucherCode[] = codes.map(c => ({ id: `vc-${Date.now()}`, code: c, productId: pid, status: 'Available', expiryDate: '2026', uploadDate: new Date().toISOString() }));
    localStorage.setItem(CODES_KEY, JSON.stringify([...all, ...news]));
  },
};
