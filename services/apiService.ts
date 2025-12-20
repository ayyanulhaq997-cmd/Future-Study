
import * as db from './db';
import { Product, VoucherCode, VoucherStatus, Order, User, ActivityLog, SecurityStatus, LMSCourse, LMSModule, LMSPracticeTest, Enrollment, TestResult, CourseVoucher, Qualification, QualificationLead, TestBooking, ManualSubmission, SkillScore, SkillType } from '../types';

let products = [...db.products];
let codes = [...db.voucherCodes];
let courseVouchers = [...db.courseVouchers];
let qualifications = [...db.qualifications];
let users = [...db.users];
let orders: Order[] = [];
let logs: ActivityLog[] = [];
let qualificationLeads: QualificationLead[] = [];
let testBookings: TestBooking[] = [];
let enrollments: Enrollment[] = [...db.initialEnrollments];
let testResults: TestResult[] = [];
let manualSubmissions: ManualSubmission[] = [];
let currentUser: User | null = null;

const checkOwnership = (ownerId: string) => {
  if (currentUser?.role === 'Admin' || currentUser?.role === 'Trainer') return true;
  if (currentUser?.id !== ownerId) {
    throw new Error('403: Security Breach Attempt. Unauthorized access to peer data.');
  }
};

export const api = {
  // --- AUTH ---
  login: async (email: string) => {
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('User not found');
    if (!user.verified && user.role !== 'Admin') throw new Error('Email not verified');
    currentUser = user;
    await api.logActivity('Auth', `User logged in: ${user.email}`);
    return user;
  },
  signup: async (name: string, email: string) => {
    const exists = users.find(u => u.email === email);
    if (exists) throw new Error('User already exists');
    
    const newUser: User = {
      id: 'u-' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: 'Customer',
      verified: false
    };
    users.push(newUser);
    await api.logActivity('Auth', `New user registered: ${email}`);
    return newUser;
  },
  verifyEmail: async (email: string) => {
    const user = users.find(u => u.email === email);
    if (user) {
      user.verified = true;
      await api.logActivity('Auth', `Email verified for: ${email}`);
    }
    return user;
  },
  logout: () => { currentUser = null; },
  getCurrentUser: () => currentUser,

  // --- SECURITY & AUDIT ---
  getSecurityStatus: async (): Promise<SecurityStatus> => ({
    uptime: '168h 15m',
    rateLimitsTriggered: 0,
    activeSessions: 24,
    threatLevel: 'Low'
  }),

  logActivity: async (action: string, details: string, severity: 'info' | 'warning' | 'critical' = 'info') => {
    const log: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || 'guest',
      userEmail: currentUser?.email || 'guest',
      action,
      details,
      ip: '127.0.0.1',
      country: 'N/A',
      severity
    };
    logs = [log, ...logs].slice(0, 500);
  },

  getLogs: async () => {
    if (currentUser?.role !== 'Admin') throw new Error('Forbidden');
    return logs;
  },

  // --- ENHANCED LMS TEST SYSTEM ---
  submitTestResult: async (testId: string, answers: Record<string, string | number>, timeTaken: number) => {
    if (!currentUser) throw new Error('Auth required');
    const test = db.lmsTests.find(t => t.id === testId);
    if (!test) throw new Error('Test not found');

    const resultId = 'RES-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    const skillScores: SkillScore[] = [];

    // Process each section
    for (const section of test.sections) {
      let sectionScore = 0;
      let sectionTotal = 0;
      let requiresManualGrading = false;

      for (const q of section.questions) {
        if (q.type === 'MCQ' || q.type === 'Text-Input') {
          sectionTotal++;
          if (answers[q.id] === q.correctAnswer) sectionScore++;
        } else {
          // Writing/Speaking manual submission
          requiresManualGrading = true;
          manualSubmissions.push({
            id: 'MS-' + Math.random().toString(36).substr(2, 5).toUpperCase(),
            testResultId: resultId,
            userId: currentUser.id,
            userEmail: currentUser.email,
            testTitle: test.title,
            skill: section.skill,
            questionId: q.id,
            studentAnswer: String(answers[q.id] || ''),
            maxScore: 10, // Default max for manual tasks
            timestamp: new Date().toISOString(),
            isNotified: false
          });
        }
      }

      skillScores.push({
        skill: section.skill,
        score: sectionScore,
        total: sectionTotal || 1, // Avoid div by zero
        isGraded: !requiresManualGrading
      });
    }

    const newResult: TestResult = {
      id: resultId,
      userId: currentUser.id,
      testId,
      testTitle: test.title,
      skillScores,
      timeTaken,
      timestamp: new Date().toISOString(),
      status: skillScores.every(s => s.isGraded) ? 'Graded' : 'Submitted'
    };

    testResults.push(newResult);
    await api.logActivity('Test', `Test "${test.title}" submitted by ${currentUser.email}`);
    return newResult;
  },

  // Trainer Portal Endpoints
  getPendingSubmissions: async () => {
    if (currentUser?.role !== 'Admin' && currentUser?.role !== 'Trainer') throw new Error('Forbidden');
    // Sort by timestamp (oldest first for the task queue)
    return manualSubmissions
      .filter(s => !s.gradedBy)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  gradeSubmission: async (submissionId: string, score: number, feedback: string) => {
    if (currentUser?.role !== 'Admin' && currentUser?.role !== 'Trainer') throw new Error('Forbidden');
    const submission = manualSubmissions.find(s => s.id === submissionId);
    if (!submission) throw new Error('Submission not found');

    submission.score = score;
    submission.feedback = feedback;
    submission.gradedBy = currentUser.name;
    submission.isNotified = true; // Trigger simulated notification

    // Update parent TestResult
    const result = testResults.find(r => r.id === submission.testResultId);
    if (result) {
      const skillScore = result.skillScores.find(s => s.skill === submission.skill);
      if (skillScore) {
        skillScore.score += score;
        skillScore.total += submission.maxScore;
        skillScore.feedback = feedback;
        
        // Check if all tasks for this result are now graded
        const pendingForThisResult = manualSubmissions.filter(ms => ms.testResultId === result.id && !ms.gradedBy);
        if (pendingForThisResult.length === 0) {
          result.status = 'Graded';
          skillScore.isGraded = true;
          // Simple overall band calculation logic
          const avg = result.skillScores.reduce((acc, s) => acc + (s.score / s.total), 0) / result.skillScores.length;
          result.overallBand = (avg * 9).toFixed(1); // Mock IELTS scale
        }
      }
    }
  },

  getTestResults: async () => {
    if (!currentUser) throw new Error('Auth required');
    if (currentUser.role === 'Admin') return testResults;
    return testResults.filter(r => r.userId === currentUser?.id);
  },

  getTestResult: async (id: string) => {
    const r = testResults.find(x => x.id === id);
    if (!r) throw new Error('Result not found');
    checkOwnership(r.userId);
    return r;
  },

  // --- RBAC LOCKING ---
  getCourseModules: async (courseId: string) => {
    const course = db.lmsCourses.find(c => c.id === courseId);
    if (course?.status === 'Paid') {
      const isEnrolled = enrollments.some(e => e.userId === currentUser?.id && e.courseId === courseId);
      if (!isEnrolled && currentUser?.role !== 'Admin' && currentUser?.role !== 'Trainer') {
        throw new Error('403: Forbidden. Enrollment required to access this course content.');
      }
    }
    return db.lmsModules.filter(m => m.courseId === courseId);
  },

  // --- OTHER API METHODS ---
  getProducts: async () => products,
  getProductById: async (id: string) => products.find(x => x.id === id) || null,
  getEnrolledCourses: async () => {
    if (!currentUser) return [];
    const userEnrollments = enrollments.filter(e => e.userId === currentUser?.id);
    return db.lmsCourses.filter(c => userEnrollments.some(e => e.courseId === c.id));
  },

  enrollInCourse: async (courseId: string) => {
    if (!currentUser) throw new Error('Auth required');
    const course = db.lmsCourses.find(c => c.id === courseId);
    if (!course) throw new Error('Course not found');
    
    const isAlreadyEnrolled = enrollments.some(e => e.userId === currentUser?.id && e.courseId === courseId);
    if (!isAlreadyEnrolled) {
      enrollments.push({
        id: 'E-' + Math.random().toString(36).substr(2, 9),
        userId: currentUser.id,
        courseId,
        enrolledAt: new Date().toISOString(),
        progress: 0
      });
      await api.logActivity('LMS', `User enrolled in course: ${course.title}`);
    }
  },

  getTestById: async (id: string) => db.lmsTests.find(t => t.id === id),
  getTestBookings: async () => {
    if (currentUser?.role === 'Admin') return testBookings;
    return testBookings.filter(b => b.userId === currentUser?.id);
  },
  updateBookingStatus: async (id: string, status: any) => {
    if (currentUser?.role !== 'Admin') throw new Error('Forbidden');
    const booking = testBookings.find(b => b.id === id);
    if (booking) booking.status = status;
  },
  submitTestBooking: async (data: any) => {
    const b = { ...data, id: 'BK-'+Math.random(), userId: currentUser!.id, status: 'Pending', timestamp: new Date().toISOString(), trackingRef: 'REF-'+Math.random() };
    testBookings.push(b);
    return b;
  },
  processPayment: async (pid: string, qty: number, email: string) => {
    const p = products.find(x => x.id === pid)!;
    const o: Order = { id: 'ORD-'+Math.random(), userId: currentUser!.id, productId: pid, productName: p.name, quantity: qty, totalAmount: p.basePrice * qty, currency: 'USD', customerEmail: email, status: 'Completed', timestamp: new Date().toISOString(), voucherCodes: ['SIM-CODE-123'] };
    orders.push(o);
    if (p.lmsCourseId) {
      enrollments.push({ id: 'E-'+Math.random(), userId: currentUser!.id, courseId: p.lmsCourseId, enrolledAt: new Date().toISOString(), progress: 0 });
    }
    return o;
  },
  getOrders: async () => {
    if (currentUser?.role === 'Admin') return orders;
    return orders.filter(o => o.userId === currentUser?.id);
  },
  getOrderById: async (id: string) => {
    const o = orders.find(x => x.id === id);
    if (o) checkOwnership(o.userId);
    return o || null;
  },
  getCodes: async () => codes,
  getStockCount: async (id: string) => 99,
  getQualifications: async () => qualifications,
  getQualificationById: async (id: string) => qualifications.find(q => q.id === id) || null,
  submitQualificationLead: async (data: any) => ({ ...data, trackingId: 'TR-'+Math.random() }),
  getQualificationLeads: async () => qualificationLeads,
  getAllLMSCourses: async () => db.lmsCourses,
  getCourseVouchers: async () => courseVouchers,
  generateCourseVouchers: async (id: string, count: number) => [],
  redeemCourseVoucher: async (code: string) => {},
  getGuideBySlug: async (slug: string) => db.countryGuides.find(g => g.slug === slug) || null,
  getUniversities: async () => db.universities,
  getUniversitiesByCountry: async (cid: string) => db.universities.filter(u => u.countryId === cid),
  getUniversityBySlug: async (slug: string) => db.universities.find(u => u.slug === slug) || null,
  getCoursesByUniversity: async (id: string) => db.courses.filter(c => c.universityId === id),
  submitLead: async (data: any) => ({ id: 'L-'+Math.random(), ...data })
};
