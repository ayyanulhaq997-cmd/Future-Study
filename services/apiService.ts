
import * as db from './db';
import { 
  Product, VoucherCode, VoucherStatus, Order, User, ActivityLog, SecurityStatus, LMSCourse, 
  LMSModule, LMSLesson, Enrollment, TestResult, CourseVoucher, Qualification, 
  QualificationLead, TestBooking, ManualSubmission, SkillScore, SkillType, LeadSubmission, 
  LeadStatus, PromoCode, FinanceReport, UserRole, ImmigrationGuideData, Lead 
} from '../types';

// ==========================================
// REGISTRY KEYS
// ==========================================
const RAZORPAY_KEY_ID = 'rzp_test_UNICOU_DemoKey123'; 
const SESSION_KEY = 'unicou_active_session_v4';
const LEADS_KEY = 'unicou_leads_v1';
const ORDERS_KEY = 'unicou_orders_v1';
const CODES_KEY = 'unicou_codes_v1';
const USERS_KEY = 'unicou_local_users_v1';
const RESULTS_KEY = 'unicou_test_results_v1';
const MANUAL_SUBS_KEY = 'unicou_manual_subs_v1';
const QUAL_LEADS_KEY = 'unicou_qual_leads_v1';
const TEST_BOOKINGS_KEY = 'unicou_test_bookings_v1';

export const BANK_DETAILS = {
  bankName: 'UNICOU Central Finance (UK)',
  accountName: 'UNICOU INTERNATIONAL LTD',
  accountNumber: '88772299',
  sortCode: '20-44-12',
  iban: 'GB29 UNIC 2044 1288 7722 99',
  swift: 'UNICGB2L'
};

const generateDemoStock = (productId: string, quantity: number): VoucherCode[] => {
  const product = db.products.find(p => p.id === productId);
  return Array(quantity).fill(0).map((_, i) => ({
    id: `vc-auto-${productId}-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
    productId,
    code: `${product?.category.substring(0,2).toUpperCase() || 'EX'}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    status: 'Available' as VoucherStatus,
    expiryDate: '2026-12-31'
  }));
};

export const api = {
  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  login: async (email: string): Promise<User> => {
    const cleanEmail = email.trim().toLowerCase();
    const localUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const allUsers = [...db.users, ...localUsers];
    const user = allUsers.find(u => u.email.toLowerCase() === cleanEmail);
    
    if (!user) throw new Error('Identity mismatch. Registry node not found.');
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  signup: async (email: string, role: UserRole): Promise<void> => {
    const cleanEmail = email.trim().toLowerCase();
    const localUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const allUsers = [...db.users, ...localUsers];
    
    if (allUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('Identity already exists in global registry.');
    }

    const newUser: User = {
      id: `u-${Math.random().toString(36).substr(2, 9)}`,
      name: cleanEmail.split('@')[0].toUpperCase(),
      email: cleanEmail,
      role: role,
      verified: true,
      isPlatinum: false // Default to standard
    };

    localUsers.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(localUsers));
  },

  // Added verifyEmail to support identity verification flow in VerificationPending
  verifyEmail: async (email: string): Promise<void> => {
    // In demo environment, identity verification is assumed successful upon manual override.
    console.log(`Identity verified for: ${email}`);
    return Promise.resolve();
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  updateUserRole: async (uid: string, role: UserRole) => {
    const localUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = [...db.users, ...localUsers].find(u => u.id === uid);
    if (user) {
      user.role = role;
      const localIdx = localUsers.findIndex(u => u.id === uid);
      if (localIdx > -1) {
        localUsers[localIdx].role = role;
        localStorage.setItem(USERS_KEY, JSON.stringify(localUsers));
      }
      const current = api.getCurrentUser();
      if (current?.id === uid) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ ...current, role }));
      }
    }
  },

  getUsers: async () => {
    const localUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return [...db.users, ...localUsers];
  },

  getUniversities: async () => db.universities,
  getUniversityBySlug: async (slug: string) => db.universities.find(u => u.slug === slug) || null,
  getUniversitiesByCountry: async (countryId: string) => db.universities.filter(u => u.countryId === countryId),
  getCoursesByUniversity: async (uniId: string) => db.courses.filter(c => c.universityId === uniId),
  getGuideBySlug: async (slug: string) => db.countryGuides.find(g => g.slug === slug) || null,
  getImmigrationGuides: async (): Promise<ImmigrationGuideData[]> => db.immigrationGuides,

  getProducts: async () => db.products,
  getProductById: async (id: string) => db.products.find(p => p.id === id),
  
  // Added getCodes to retrieve vouchers from the vault for AdminDashboard
  getCodes: async (): Promise<VoucherCode[]> => {
    let codes = JSON.parse(localStorage.getItem(CODES_KEY) || '[]');
    if (codes.length === 0) codes = [...db.voucherCodes];
    return codes;
  },

  // Added importVouchers to allow bulk injection of codes into the vault in AdminDashboard
  importVouchers: async (productId: string, codeStrings: string[]) => {
    let allCodes: VoucherCode[] = JSON.parse(localStorage.getItem(CODES_KEY) || '[]');
    if (allCodes.length === 0) allCodes = [...db.voucherCodes];
    
    let addedCount = 0;
    let duplicateCount = 0;
    
    codeStrings.forEach(s => {
      const trimmed = s.trim();
      if (!trimmed) return;
      if (allCodes.some(c => c.code === trimmed)) {
        duplicateCount++;
      } else {
        allCodes.push({
          id: `vc-imp-${productId}-${Date.now()}-${addedCount}`,
          productId,
          code: trimmed.toUpperCase(),
          status: 'Available',
          expiryDate: '2026-12-31'
        });
        addedCount++;
      }
    });
    
    localStorage.setItem(CODES_KEY, JSON.stringify(allCodes));
    return { addedCount, duplicateCount };
  },

  calculatePrice: async (productId: string, quantity: number, paymentMethod: 'Gateway' | 'BankTransfer' = 'BankTransfer', promoCode?: string) => {
    const p = db.products.find(x => x.id === productId);
    if (!p) throw new Error('Registry fault: Product not found.');
    
    const baseAmount = p.basePrice * quantity;
    let tierDiscount = 0;
    const currentUser = api.getCurrentUser();
    
    if (currentUser?.role === 'Agent') {
      const discountPct = (currentUser.tier || 1) * 2;
      tierDiscount = (baseAmount * discountPct) / 100;
    }

    const bankCharges = paymentMethod === 'Gateway' ? (baseAmount - tierDiscount) * 0.045 : 0;
    
    return {
      baseAmount,
      tierDiscount,
      promoDiscount: 0,
      bankCharges,
      totalAmount: baseAmount - tierDiscount + bankCharges
    };
  },

  getOrders: async (): Promise<Order[]> => JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'),
  getOrderById: async (id: string) => {
    const orders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    return orders.find(o => o.id === id) || null;
  },

  checkPurchaseRestrictions: async (userId: string, quantity: number, method: 'Gateway' | 'BankTransfer'): Promise<void> => {
    const users = await api.getUsers();
    const user = users.find(u => u.id === userId);
    const orders = await api.getOrders();
    const today = new Date().toDateString();
    
    const todaysOrders = orders.filter(o => 
      o.userId === userId && 
      new Date(o.timestamp).toDateString() === today &&
      o.status !== 'Cancelled'
    );

    const totalVouchersToday = todaysOrders.reduce((acc, o) => acc + o.quantity, 0);

    // Hard Limit on Single Order Size
    if (quantity > 3) {
      throw new Error("Order Limit reached: Max 3 vouchers per single order allowed as per Operations Manager restriction.");
    }

    // Role-based Daily Restrictions
    if (user?.role === 'Agent') {
      if (method === 'BankTransfer') {
        if (totalVouchersToday + quantity > 5) {
          throw new Error("For your security, further orders are restricted. Kindly reach out to our support team for assistance. (Daily Agent Bank Limit: 5)");
        }
      } else {
        if (!user.isPlatinum) {
          throw new Error("RESTRICTED: Credit/Debit card payments are exclusively available to Platinum Members.");
        }
        if (totalVouchersToday + quantity > 3) {
          throw new Error("For your security, further orders are restricted. Kindly reach out to our support team for assistance. (Daily Agent Card Limit: 3)");
        }
      }
    } else if (user?.role === 'Customer') {
      // Student Limit: Only ONE Voucher per day
      if (totalVouchersToday + quantity > 1) {
        throw new Error("For your security, further orders are restricted. Kindly reach out to our support team for assistance. (Student Daily Limit: 1)");
      }
      if (method === 'Gateway' && !user.isPlatinum) {
        throw new Error("RESTRICTED: Card payments are only available to verified Platinum Partners.");
      }
    }
  },

  submitBankTransfer: async (productId: string, quantity: number, email: string, bankRef: string): Promise<Order> => {
    const currentUser = api.getCurrentUser();
    if (!currentUser) throw new Error("Authentication node inactive.");
    
    await api.checkPurchaseRestrictions(currentUser.id, quantity, 'BankTransfer');

    const p = db.products.find(x => x.id === productId);
    const pricing = await api.calculatePrice(productId, quantity, 'BankTransfer');
    const orders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    
    const order: Order = {
      id: `UNICOU-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
      userId: currentUser.id,
      productId,
      productName: p?.name || 'Academic Voucher',
      quantity,
      baseAmount: pricing.baseAmount,
      tierDiscount: pricing.tierDiscount,
      promoDiscount: 0,
      bankCharges: 0,
      totalAmount: pricing.totalAmount,
      currency: 'USD',
      customerEmail: email,
      status: 'Pending',
      paymentMethod: 'BankTransfer',
      timestamp: new Date().toISOString(),
      voucherCodes: [],
      bankRef
    };
    
    const updatedOrders = [order, ...orders];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
    return order;
  },

  verifyBankTransfer: async (orderId: string) => {
    const orders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    let codes: VoucherCode[] = JSON.parse(localStorage.getItem(CODES_KEY) || '[]');
    if (codes.length === 0) codes = [...db.voucherCodes];

    const orderIdx = orders.findIndex(o => o.id === orderId);
    if (orderIdx === -1) throw new Error('Order node not found.');
    const order = orders[orderIdx];
    
    let available = codes.filter(c => c.productId === order.productId && c.status === 'Available');
    if (available.length < order.quantity) {
      const replenishment = generateDemoStock(order.productId, 20);
      codes = [...codes, ...replenishment];
      available = codes.filter(c => c.productId === order.productId && c.status === 'Available');
    }
    
    const assignedCodes: string[] = [];
    for (let i = 0; i < order.quantity; i++) {
        const voucher = available[i];
        voucher.status = 'Used';
        assignedCodes.push(voucher.code);
    }
    
    order.status = 'Completed';
    order.voucherCodes = assignedCodes;
    
    localStorage.setItem(CODES_KEY, JSON.stringify(codes));
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    
    return order;
  },

  createGatewayOrder: async (amount: number) => {
    return {
      key: RAZORPAY_KEY_ID,
      amount: Math.round(amount * 100),
      currency: 'USD',
      id: `rzp_${Math.random().toString(36).substr(2, 9)}`
    };
  },

  processPayment: async (productId: string, quantity: number, email: string, paymentData: any): Promise<Order> => {
    const currentUser = api.getCurrentUser();
    if (!currentUser) throw new Error("Auth node inactive.");

    await api.checkPurchaseRestrictions(currentUser.id, quantity, 'Gateway');

    const p = db.products.find(x => x.id === productId);
    const pricing = await api.calculatePrice(productId, quantity, 'Gateway');
    let codes: VoucherCode[] = JSON.parse(localStorage.getItem(CODES_KEY) || '[]');
    if (codes.length === 0) codes = [...db.voucherCodes];

    let available = codes.filter(c => c.productId === productId && c.status === 'Available');
    if (available.length < quantity) {
      const replenishment = generateDemoStock(productId, 20);
      codes = [...codes, ...replenishment];
      available = codes.filter(c => c.productId === productId && c.status === 'Available');
    }

    const assigned = available.slice(0, quantity);
    assigned.forEach(c => c.status = 'Used');
    
    const orders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');

    const order: Order = {
      id: `UNICOU-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
      userId: currentUser.id,
      productId,
      productName: p?.name || 'Academic Voucher',
      quantity,
      baseAmount: pricing.baseAmount,
      tierDiscount: pricing.tierDiscount,
      promoDiscount: 0,
      bankCharges: pricing.bankCharges,
      totalAmount: pricing.totalAmount,
      currency: 'USD',
      customerEmail: email,
      status: 'Completed',
      paymentMethod: 'Gateway',
      timestamp: new Date().toISOString(),
      voucherCodes: assigned.map(c => c.code),
      paymentId: paymentData.paymentId
    };
    
    localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...orders]));
    localStorage.setItem(CODES_KEY, JSON.stringify(codes));
    return order;
  },

  getLeads: async (): Promise<Lead[]> => JSON.parse(localStorage.getItem(LEADS_KEY) || '[]'),
  submitLead: async (type: 'student' | 'agent' | 'career' | 'general', data: Record<string, string>) => {
    const leads: Lead[] = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
    const lead: Lead = {
      id: `LD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      type,
      data,
      status: 'New',
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(LEADS_KEY, JSON.stringify([lead, ...leads]));
    return lead;
  },

  submitQualificationLead: async (data: Omit<QualificationLead, 'id' | 'status' | 'timestamp' | 'trackingId'>): Promise<QualificationLead> => {
    const leads: QualificationLead[] = JSON.parse(localStorage.getItem(QUAL_LEADS_KEY) || '[]');
    const lead: QualificationLead = {
      id: `QL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      ...data,
      status: 'Pending',
      timestamp: new Date().toISOString(),
      trackingId: `TRK-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
    };
    localStorage.setItem(QUAL_LEADS_KEY, JSON.stringify([lead, ...leads]));
    return lead;
  },

  submitTestBooking: async (data: Omit<TestBooking, 'id' | 'trackingRef'>): Promise<TestBooking> => {
    const bookings: TestBooking[] = JSON.parse(localStorage.getItem(TEST_BOOKINGS_KEY) || '[]');
    const booking: TestBooking = {
      id: `TB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      ...data,
      trackingRef: `REF-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
    };
    localStorage.setItem(TEST_BOOKINGS_KEY, JSON.stringify([booking, ...bookings]));
    return booking;
  },

  getAllLMSCourses: async () => db.lmsCourses,
  getEnrolledCourses: async () => db.lmsCourses,
  getCourseModules: async (courseId: string) => db.lmsModules.filter(m => m.courseId === courseId),
  getEnrollmentByCourse: async (courseId: string) => ({ id: 'enr-demo', userId: 'demo-user', courseId, enrolledAt: new Date().toISOString(), progress: 45 }),
  updateCourseProgress: async (courseId: string, progress: number) => {},
  redeemCourseVoucher: async (code: string) => {
    if (code !== 'UNICOU-FREE') throw new Error('Invalid authorization code.');
  },
  getTestById: async (testId: string) => db.lmsTests.find(t => t.id === testId),
  
  submitTestResult: async (testId: string, answers: any, timeTaken: number): Promise<TestResult> => {
    const activeUser = api.getCurrentUser();
    if (!activeUser) throw new Error('Auth node inactive.');

    const test = db.lmsTests.find(t => t.id === testId);
    const results: TestResult[] = JSON.parse(localStorage.getItem(RESULTS_KEY) || '[]');
    const manualSubs: ManualSubmission[] = JSON.parse(localStorage.getItem(MANUAL_SUBS_KEY) || '[]');

    const newResult: TestResult = {
      id: `TR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      userId: activeUser.id,
      testId,
      testTitle: test?.title || 'Mock Test',
      skillScores: [
        { skill: 'Reading', score: 22, total: 30, isGraded: true, band: '7.0' },
        { skill: 'Listening', score: 24, total: 30, isGraded: true, band: '7.5' },
        { skill: 'Writing', score: 0, total: 9, isGraded: false },
        { skill: 'Speaking', score: 0, total: 9, isGraded: false }
      ],
      overallBand: 'PENDING',
      timeTaken,
      timestamp: new Date().toISOString(),
      status: 'Awaiting Evaluation',
      reviews: []
    };

    test?.sections.forEach(section => {
      section.questions.forEach(q => {
        if (q.type === 'Essay' || q.type === 'Audio-Record') {
          const sub: ManualSubmission = {
            id: `SUB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            testResultId: newResult.id,
            userId: activeUser.id,
            userName: activeUser.name,
            userEmail: activeUser.email,
            testTitle: test?.title || 'Mock Test',
            skill: q.skill,
            questionId: q.id,
            questionText: q.text,
            studentAnswer: String(answers[q.id] || "No response provided by student."),
            maxScore: q.maxScore,
            timestamp: new Date().toISOString()
          };
          manualSubs.push(sub);
        }
      });
    });

    results.unshift(newResult);
    localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
    localStorage.setItem(MANUAL_SUBS_KEY, JSON.stringify(manualSubs));
    
    return newResult;
  },

  getTestResults: async () => {
    const results: TestResult[] = JSON.parse(localStorage.getItem(RESULTS_KEY) || '[]');
    const user = api.getCurrentUser();
    if (!user) return [];
    return results.filter(r => r.userId === user.id);
  },

  getPendingSubmissions: async (): Promise<ManualSubmission[]> => {
    const subs: ManualSubmission[] = JSON.parse(localStorage.getItem(MANUAL_SUBS_KEY) || '[]');
    return subs.filter(s => !s.gradedBy);
  },

  gradeSubmission: async (id: string, score: number, feedback: string) => {
    const trainer = api.getCurrentUser();
    const subs: ManualSubmission[] = JSON.parse(localStorage.getItem(MANUAL_SUBS_KEY) || '[]');
    const results: TestResult[] = JSON.parse(localStorage.getItem(RESULTS_KEY) || '[]');

    const subIdx = subs.findIndex(s => s.id === id);
    if (subIdx === -1) throw new Error('Submission node not found.');
    
    const sub = subs[subIdx];
    sub.score = score;
    sub.feedback = feedback;
    sub.gradedBy = trainer?.name || 'Academic Trainer';

    const resIdx = results.findIndex(r => r.id === sub.testResultId);
    if (resIdx !== -1) {
        const res = results[resIdx];
        const skillIdx = res.skillScores.findIndex(ss => ss.skill === sub.skill);
        if (skillIdx !== -1) {
            res.skillScores[skillIdx] = {
                ...res.skillScores[skillIdx],
                score,
                isGraded: true,
                feedback,
                band: score.toFixed(1)
            };
        }

        const pendingCount = res.skillScores.filter(ss => !ss.isGraded).length;
        if (pendingCount === 0) {
            const sumBands = res.skillScores.reduce((acc, ss) => acc + parseFloat(ss.band || '0'), 0);
            res.overallBand = (sumBands / 4).toFixed(1);
            res.status = 'Graded';
        }
    }

    localStorage.setItem(MANUAL_SUBS_KEY, JSON.stringify(subs));
    localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
  },

  getSecurityStatus: async (): Promise<SecurityStatus> => ({ uptime: '99.98%', rateLimitsTriggered: 14, activeSessions: 42, threatLevel: 'Secure' }),
  getLogs: async (): Promise<ActivityLog[]> => [],
  getFinanceReport: async (): Promise<FinanceReport> => {
    const orders = await api.getOrders();
    const completed = orders.filter((o: any) => o.status === 'Completed');
    return {
        totalRevenue: completed.reduce((acc: number, o: any) => acc + o.totalAmount, 0),
        totalVouchersSold: completed.reduce((acc: number, o: any) => acc + o.quantity, 0),
        salesByType: [],
        recentSales: orders.slice(0, 15)
    };
  },

  getQualifications: async () => db.qualifications,
  getQualificationById: async (id: string) => db.qualifications.find(q => q.id === id)
};
