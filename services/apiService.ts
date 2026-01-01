
import * as db from './db';
import { 
  Product, VoucherCode, VoucherStatus, Order, User, ActivityLog, SecurityStatus, LMSCourse, 
  LMSModule, LMSLesson, Enrollment, TestResult, CourseVoucher, Qualification, 
  QualificationLead, TestBooking, ManualSubmission, SkillScore, SkillType, LeadSubmission, 
  LeadStatus, PromoCode, FinanceReport, UserRole, ImmigrationGuideData, Lead,
  University, CountryGuide, Course, LMSPracticeTest
} from '../types';

const SESSION_KEY = 'unicou_active_session_v4';
const LEADS_KEY = 'unicou_leads_v1';
const ORDERS_KEY = 'unicou_orders_v1';
const CODES_KEY = 'unicou_codes_v1';
const USERS_KEY = 'unicou_local_users_v1';
const RESULTS_KEY = 'unicou_test_results_v1';

export const api = {
  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  login: async (email: string): Promise<User> => {
    let cleanEmail = email.trim().toLowerCase();
    const staffShortcuts: Record<string, string> = {
      'admin': 'admin@unicou.uk',
      'trainer': 'trainer@unicou.uk',
      'finance': 'finance@unicou.uk',
      'sales': 'sales@unicou.uk'
    };
    if (staffShortcuts[cleanEmail]) cleanEmail = staffShortcuts[cleanEmail];

    const raw = localStorage.getItem('unicou_local_users_v1');
    const localUsers = raw ? JSON.parse(raw) : [];
    const allUsers = [...db.users, ...localUsers];
    
    const user = allUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) throw new Error('Identity node not found. Please verify credentials.');
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  signup: async (email: string, role: UserRole): Promise<User> => {
    const cleanEmail = email.trim().toLowerCase();
    const raw = localStorage.getItem('unicou_local_users_v1');
    const localUsers = raw ? JSON.parse(raw) : [];
    
    const newUser: User = { 
      id: `u-${Math.random().toString(36).substr(2, 9)}`, 
      name: cleanEmail.split('@')[0].toUpperCase(), 
      email: cleanEmail, 
      role, 
      verified: true,
      isAuthorized: true 
    };
    
    localStorage.setItem('unicou_local_users_v1', JSON.stringify([...localUsers, newUser]));
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return newUser;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = '/'; 
  },

  getProducts: async (): Promise<Product[]> => db.products,
  getProductById: async (id: string): Promise<Product | undefined> => db.products.find(p => p.id === id),
  
  getOrders: async (): Promise<Order[]> => {
    const currentUser = api.getCurrentUser();
    if (!currentUser) return [];
    const allOrders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    if (['System Admin/Owner', 'Finance/Audit Team', 'Support/Sales Node'].includes(currentUser.role)) {
      return allOrders;
    }
    return allOrders.filter(o => o.userId === currentUser.id);
  },

  getOrderById: async (id: string): Promise<Order | null> => {
    const allOrders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    return allOrders.find(o => o.id === id) || null;
  },

  checkUserQuota: async (paymentMethod: 'Gateway' | 'BankTransfer'): Promise<{ allowed: boolean; remaining: number; limit: number }> => {
    const currentUser = api.getCurrentUser();
    if (!currentUser) return { allowed: false, remaining: 0, limit: 0 };
    
    // Support Override check
    if (currentUser.canBypassQuota) return { allowed: true, remaining: 99, limit: 99 };

    const allOrders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    const oneDayAgo = new Date().getTime() - (24 * 60 * 60 * 1000);
    
    const recentOrders = allOrders.filter(o => 
      o.userId === currentUser.id && 
      new Date(o.timestamp).getTime() > oneDayAgo
    );

    let limit = 1; // Default for Student
    if (currentUser.role === 'Agent Partner/Prep Center') {
      limit = paymentMethod === 'Gateway' ? 3 : 10;
    }

    return {
      allowed: recentOrders.length < limit,
      remaining: limit - recentOrders.length,
      limit
    };
  },

  bypassUserQuota: async (email: string) => {
    const raw = localStorage.getItem('unicou_local_users_v1');
    const localUsers: User[] = raw ? JSON.parse(raw) : [];
    const updated = localUsers.map(u => u.email.toLowerCase() === email.toLowerCase() ? { ...u, canBypassQuota: true } : u);
    localStorage.setItem('unicou_local_users_v1', JSON.stringify(updated));
    
    const current = api.getCurrentUser();
    if (current && current.email.toLowerCase() === email.toLowerCase()) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ ...current, canBypassQuota: true }));
    }
  },

  submitBankTransfer: async (productId: string, quantity: number, email: string, buyerName: string, bankRef: string): Promise<Order> => {
    const quota = await api.checkUserQuota('BankTransfer');
    if (!quota.allowed) {
      throw new Error("QUOTA_EXCEEDED");
    }

    const p = db.products.find(x => x.id === productId);
    const currentUser = api.getCurrentUser();
    if (!currentUser) throw new Error("Session expired.");

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

  getCodes: async () => JSON.parse(localStorage.getItem(CODES_KEY) || '[]') || db.voucherCodes,
  getLeads: async () => JSON.parse(localStorage.getItem(LEADS_KEY) || '[]'),
  submitLead: async (type: string, data: any) => {
    const leads = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
    localStorage.setItem(LEADS_KEY, JSON.stringify([{ id: Date.now().toString(), type, data, status: 'New', timestamp: new Date().toISOString() }, ...leads]));
  },
  getFinanceReport: async () => ({ totalRevenue: 50000, totalVouchersSold: 420, salesByType: [], recentSales: [] }),
  getUsers: async () => {
    const raw = localStorage.getItem('unicou_local_users_v1');
    const localUsers = raw ? JSON.parse(raw) : [];
    const allUsers = [...db.users, ...localUsers];
    return allUsers;
  },
  getQualifications: async () => db.qualifications,
  getGuideBySlug: async (slug: string) => db.countryGuides.find(g => g.slug === slug) || null,
  getUniversities: async () => db.universities,
  getUniversityBySlug: async (slug: string) => db.universities.find(u => u.slug === slug) || null,
  getUniversitiesByCountry: async (id: string) => db.universities.filter(u => u.countryId === id),
  getCoursesByUniversity: async (id: string) => db.courses.filter(c => c.universityId === id),
  getAllLMSCourses: async () => db.lmsCourses,
  getEnrolledCourses: async () => db.lmsCourses,
  getCourseModules: async (id: string) => [],
  getEnrollmentByCourse: async (id: string) => ({ id: '1', userId: 'u', courseId: id, progress: 0 }),
  updateCourseProgress: async (id: string, p: number) => {},
  redeemCourseVoucher: async (c: string) => {},
  getTestById: async (id: string) => db.lmsTests.find(t => t.id === id),
  submitTestResult: async (id: string, a: any, t: number) => ({ id: '1', userId: 'u', testId: id, testTitle: 'T', skillScores: [], overallBand: '8', timeTaken: t, timestamp: '', status: 'Completed', reviews: [] } as any),
  getTestResults: async () => [],
  getPendingSubmissions: async () => [],
  gradeSubmission: async (id: string, s: number, f: string) => {},
  getImmigrationGuides: async () => db.immigrationGuides,
  processOrderAction: async (id: string, a: string) => ({} as any),
  verifyEmail: async (e: string) => {},
  getQualificationById: async (id: string) => db.qualifications.find(q => q.id === id),
  submitQualificationLead: async (d: any) => ({ ...d, id: '1', timestamp: '', status: 'New', trackingId: 'T' }),
  submitTestBooking: async (d: any) => ({ ...d, id: '1', trackingRef: 'T' })
};
