
import * as db from './db';
import { 
  Product, VoucherCode, VoucherStatus, Order, User, ActivityLog, SecurityStatus, LMSCourse, 
  LMSModule, LMSLesson, Enrollment, TestResult, CourseVoucher, Qualification, 
  QualificationLead, TestBooking, ManualSubmission, SkillScore, SkillType, LeadSubmission, 
  LeadStatus, PromoCode, FinanceReport, UserRole, ImmigrationGuideData, Lead 
} from '../types';

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
  bankName: 'UniCou International Ltd Central Finance (UK)',
  accountName: 'UNICOU INTERNATIONAL LTD',
  accountNumber: '88772299',
  sortCode: '20-44-12',
  iban: 'GB29 UNIC 2044 1288 7722 99',
  swift: 'UNICGB2L'
};

const dispatchOrderConfirmationEmail = (email: string, orderId: string, customerName: string) => {
  const subject = `Your UniCou Order Confirmation: #${orderId} 🚀`;
  const body = `
Hi ${customerName},

Thank you for your purchase! We’ve received your order, and our team is currently processing it.

Order Summary
Status: Processing 
Item: Exam Voucher as per order description
Delivery Method: Secure Email Delivery

What Happens Next?
Your exam voucher will be delivered to this email address shortly after payment verification.

Why the wait? To ensure the highest level of security for your digital assets, we perform a quick verification on all transactions. This extra layer of protection ensures your voucher code reaches you safely.

💡 Pro-Tip: If you don't see our email in your main inbox within the hour, please check your Promotions or Spam folder.

Need Help?
If you have any questions about your order, simply reply to this email or visit our [Help Center].

Best regards, 
The UniCou International Team
  `;
  console.log(`[EMAIL DISPATCH] To: ${email}\nSubject: ${subject}\nBody: ${body}`);
};

const dispatchAnnexEmail = (email: string, annex: 'C' | 'D' | 'E', orderId: string, extraData?: any) => {
  let subject = '';
  let body = '';
  const customerName = extraData?.customerName || 'Customer';

  if (annex === 'C') {
    const { productName, voucherCodes, expiryDate } = extraData || {};
    subject = `Order No ${orderId}: Your Exam Voucher is Delivered – Please Read Important Terms`;
    body = `
Dear ${customerName},

Thank you for choosing UniCou. Your exam voucher has now been successfully delivered.

Voucher Details:
* Exam: ${productName || 'International Exam'}
* Voucher Code: ${voucherCodes ? voucherCodes.join(', ') : 'N/A'}
* Valid Until: ${expiryDate || '2026-12-31'}
* Redemption Instructions: Please log in to the official exam provider portal (Pearson/British Council/IDP) to apply this code during booking.

Important Purchase Conditions:
By receiving this voucher, you acknowledge and agree that:
1. Once the voucher code is delivered, it cannot be refunded, replaced, or exchanged.
2. You accept the website’s data privacy policy and consent to the use of your information as described therein.
3. You shall be liable for any payment obligations, including cases of refund, return, cancellation, exam cancellation, related charges, or legal action.

Please keep your voucher secure and do not share it publicly.

If you require assistance, our support team is here to help via our Support ChatBot or email.

We wish you success in your upcoming exam and your global education journey.

Kind regards,
UniCou Team
    `;
  } else if (annex === 'D') {
    subject = `Order No ${orderId}: Update on Your Voucher Order – Payment Verification in Progress`;
    body = `
Dear ${customerName},

Thank you for your order with UniCou.

We would like to inform you that your voucher delivery is currently delayed due to ongoing payment verification.

Our team is completing the required security and compliance checks to ensure a safe transaction. Once verification is successfully completed, your voucher will be delivered immediately.

We sincerely apologize for the inconvenience and appreciate your patience and understanding.

If you need any assistance or have questions, please contact our support team:
Support Email: connect@unicou.uk
Support Portal: https://www.unicou.uk/

Thank you for your cooperation.

Kind regards,
UniCou Team
    `;
  } else if (annex === 'E') {
    subject = `Order No ${orderId} Cancellation Notice`;
    body = `
Dear ${customerName},

We regret to inform you that your order ${orderId} has been cancelled due to payment verification or security compliance reasons. We sincerely apologize for the inconvenience caused.

If any amount has been deducted, please contact your bank or payment provider for a refund as per their policy.

For further assistance or clarification, please feel free to contact our support team:
Support Team: Chatbot

Thank you for your understanding and cooperation.

Kind regards,
UniCou Team
    `;
  }

  console.log(`[EMAIL DISPATCH] To: ${email}\nSubject: ${subject}\nBody: ${body}`);
};

const generateDemoStock = (productId: string, quantity: number): VoucherCode[] => {
  const product = db.products.find(p => p.id === productId);
  return Array(quantity).fill(0).map((_, i) => ({
    id: `vc-auto-${productId}-${Date.now()}-${i}`,
    productId,
    code: `${product?.category.substring(0,2).toUpperCase() || 'EX'}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    status: 'Available' as VoucherStatus,
    expiryDate: '2026-12-31',
    uploadDate: new Date().toISOString()
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
    if (!user) throw new Error('Account not found. Please check your email or sign up.');
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  signup: async (email: string, role: UserRole): Promise<void> => {
    const cleanEmail = email.trim().toLowerCase();
    const localUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const allUsers = [...db.users, ...localUsers];
    if (allUsers.some(u => u.email.toLowerCase() === cleanEmail)) throw new Error('An account with this email already exists.');
    const newUser: User = { id: `u-${Math.random().toString(36).substr(2, 9)}`, name: cleanEmail.split('@')[0].toUpperCase(), email: cleanEmail, role, verified: true, isPlatinum: false };
    localUsers.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(localUsers));
  },

  verifyEmail: async (email: string) => Promise.resolve(),
  logout: () => localStorage.removeItem(SESSION_KEY),

  updateUserRole: async (uid: string, role: UserRole) => {
    const localUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const all = await api.getUsers();
    const user = all.find(u => u.id === uid);
    if (user) {
      user.role = role;
      const idx = localUsers.findIndex(u => u.id === uid);
      if (idx > -1) {
        localUsers[idx].role = role;
        localStorage.setItem(USERS_KEY, JSON.stringify(localUsers));
      }
    }
  },

  getUsers: async () => {
    const localUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return [...db.users, ...localUsers];
  },

  getProducts: async () => db.products,
  getProductById: async (id: string) => db.products.find(p => p.id === id),
  getUniversities: async () => db.universities,
  getUniversityBySlug: async (slug: string) => db.universities.find(u => u.slug === slug) || null,
  getUniversitiesByCountry: async (countryId: string) => db.universities.filter(u => u.countryId === countryId),
  getCoursesByUniversity: async (universityId: string) => db.courses.filter(c => c.universityId === universityId),
  getGuideBySlug: async (slug: string) => db.countryGuides.find(g => g.slug === slug) || null,

  getCodes: async (): Promise<VoucherCode[]> => {
    let codes = JSON.parse(localStorage.getItem(CODES_KEY) || '[]');
    if (codes.length === 0) {
      codes = [...db.voucherCodes].map(c => ({...c, uploadDate: '2024-01-01T00:00:00Z'}));
    }
    return codes;
  },

  getOrders: async (): Promise<Order[]> => JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'),
  getOrderById: async (id: string) => (await api.getOrders()).find(o => o.id === id) || null,

  getDailyOrderStats: async (userId: string) => {
    const orders = await api.getOrders();
    const today = new Date().toISOString().split('T')[0];
    const userToday = orders.filter(o => o.userId === userId && o.timestamp.startsWith(today));
    return {
      total: userToday.length,
      bankTotal: userToday.filter(o => o.paymentMethod === 'BankTransfer').reduce((acc, o) => acc + o.quantity, 0),
      cardTotal: userToday.filter(o => o.paymentMethod === 'Gateway').reduce((acc, o) => acc + o.quantity, 0)
    };
  },

  processOrderAction: async (orderId: string, action: 'verify' | 'hold' | 'cancel') => {
    const orders = await api.getOrders();
    const orderIdx = orders.findIndex(o => o.id === orderId);
    if (orderIdx === -1) throw new Error('Order not found.');
    const order = orders[orderIdx];

    const allUsers = await api.getUsers();
    const buyer = allUsers.find(u => u.id === order.userId);
    const customerName = buyer?.name || order.customerEmail.split('@')[0];

    if (action === 'verify') {
      let codes = await api.getCodes();
      let available = codes.filter(c => c.productId === order.productId && c.status === 'Available');
      if (available.length < order.quantity) {
        const replenish = generateDemoStock(order.productId, 20);
        codes = [...codes, ...replenish];
        available = codes.filter(c => c.productId === order.productId && c.status === 'Available');
      }
      const assigned = available.slice(0, order.quantity);
      assigned.forEach(c => c.status = 'Used');
      order.status = 'Completed';
      order.voucherCodes = assigned.map(c => c.code);
      localStorage.setItem(CODES_KEY, JSON.stringify(codes));
      
      dispatchAnnexEmail(order.customerEmail, 'C', order.id, {
        customerName,
        productName: order.productName,
        voucherCodes: order.voucherCodes,
        expiryDate: assigned[0]?.expiryDate || '2026-12-31'
      });
    } else if (action === 'hold') {
      order.status = 'Pending';
      dispatchAnnexEmail(order.customerEmail, 'D', order.id, { customerName });
    } else if (action === 'cancel') {
      order.status = 'Cancelled';
      dispatchAnnexEmail(order.customerEmail, 'E', order.id, { customerName });
    }

    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return order;
  },

  submitBankTransfer: async (productId: string, quantity: number, email: string, bankRef: string): Promise<Order> => {
    const p = db.products.find(x => x.id === productId);
    const currentUser = api.getCurrentUser();
    
    if (currentUser && currentUser.role === 'Student') {
      const stats = await api.getDailyOrderStats(currentUser.id);
      if (stats.total >= 1) {
        throw new Error("For your security, further orders are restricted. Kindly reach out to our support team for assistance.");
      }
    }

    const order: Order = {
      id: `UNICOU-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
      userId: currentUser?.id || 'guest',
      productId,
      productName: p?.name || 'Voucher',
      quantity,
      totalAmount: (p?.basePrice || 0) * quantity,
      currency: p?.currency || 'USD',
      customerEmail: email,
      status: 'Pending',
      paymentMethod: 'BankTransfer',
      timestamp: new Date().toISOString(),
      voucherCodes: [],
      bankRef,
      proofAttached: true
    };
    const orders = [order, ...await api.getOrders()];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    
    dispatchOrderConfirmationEmail(email, order.id, currentUser?.name || email.split('@')[0]);
    return order;
  },

  submitLead: async (type: string, data: any) => {
    const leads = [ { id: `LD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`, type: type as any, data, status: 'New' as const, timestamp: new Date().toISOString() }, ...await api.getLeads() ];
    const LEADS_KEY = 'unicou_leads_v1';
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  },

  getLeads: async (): Promise<Lead[]> => JSON.parse(localStorage.getItem('unicou_leads_v1') || '[]'),
  getFinanceReport: async (): Promise<FinanceReport> => ({ totalRevenue: 0, totalVouchersSold: 0, salesByType: [], recentSales: [] }),
  getSecurityStatus: async (): Promise<SecurityStatus> => ({ uptime: '99.99%', rateLimitsTriggered: 0, activeSessions: 1, threatLevel: 'Normal' }),
  getLogs: async () => [],
  getQualifications: async () => db.qualifications,
  getQualificationById: async (id: string) => db.qualifications.find(q => q.id === id),
  getAllLMSCourses: async () => db.lmsCourses,
  getEnrolledCourses: async () => [],
  getCourseModules: async (cid: string) => [],
  getEnrollmentByCourse: async (cid: string) => null,
  updateCourseProgress: async (cid: string, p: number) => {},
  redeemCourseVoucher: async (code: string) => {},
  getTestById: async (tid: string) => db.lmsTests.find(t => t.id === tid),
  submitTestResult: async (tid: string, a: any, t: number) => ({ id: 'res', userId: 'u', testId: tid, testTitle: 'Test', skillScores: [], overallBand: '0', timeTaken: t, timestamp: new Date().toISOString(), status: 'Pending', reviews: [] }),
  getTestResults: async () => [],
  getPendingSubmissions: async () => [],
  gradeSubmission: async (id: string, s: number, f: string) => {},
  getImmigrationGuides: async () => db.immigrationGuides,

  submitQualificationLead: async (data: any): Promise<QualificationLead> => {
    const lead: QualificationLead = {
      id: `QL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      ...data,
      status: 'New',
      timestamp: new Date().toISOString(),
      trackingId: `TRK-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
    };
    const leads = [lead, ...JSON.parse(localStorage.getItem(QUAL_LEADS_KEY) || '[]')];
    localStorage.setItem(QUAL_LEADS_KEY, JSON.stringify(leads));
    return lead;
  },

  submitTestBooking: async (data: any): Promise<TestBooking> => {
    const booking: TestBooking = {
      id: `BK-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      ...data,
      trackingRef: `REF-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
    };
    const bookings = [booking, ...JSON.parse(localStorage.getItem(TEST_BOOKINGS_KEY) || '[]')];
    localStorage.setItem(TEST_BOOKINGS_KEY, JSON.stringify(bookings));
    return booking;
  }
};
