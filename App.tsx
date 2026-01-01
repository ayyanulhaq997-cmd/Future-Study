
import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import VoucherStore from './components/VoucherStore';
import Navbar from './components/Navbar';
import ApplyForm from './components/ApplyForm';
import SearchOverlay from './components/SearchOverlay';
import CountryList from './components/CountryList';
import CountryGuide from './components/CountryGuide';
import UniversityProfile from './components/UniversityProfile';
import ApplicationHub from './components/ApplicationHub';
import Login from './components/Login';
import Signup from './components/Signup';
import AIChat from './components/AIChat';
import LMSDashboard from './components/LMSDashboard';
import LMSCoursePlayer from './components/LMSCoursePlayer';
import LMSPracticeTest from './components/LMSPracticeTest';
import CheckoutProcess from './components/CheckoutProcess';
import SuccessScreen from './components/SuccessScreen';
import AdminDashboard from './components/AdminDashboard';
import AgentDashboard from './components/AgentDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import QualificationCatalogue from './components/QualificationCatalogue';
import PolicyPage from './components/PolicyPage';
import Resources from './components/Resources';
import About from './components/About';
import TrainerDashboard from './components/TrainerDashboard';
import FinanceDashboard from './components/FinanceDashboard';
import SupportDashboard from './components/SupportDashboard';
import VerificationPending from './components/VerificationPending';
import CookieConsent from './components/CookieConsent';
import { ViewState, User } from './types';
import { api } from './services/apiService';
import { LOGO_SRC } from './constants/assets';

const OFFICE_LOCATIONS = [
  { country: "United Kingdom", address: "Central Operations, Manchester, UK" },
  { country: "Dubai", address: "24695 Deira, Dubai, UAE" },
  { country: "Pakistan", address: "Plot No.23-17-B-1, Township, Lahore, Pakistan" }
];

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState<ViewState>({ type: 'home' });
  const [user, setUser] = useState<User | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const active = api.getCurrentUser();
    if (active) setUser(active);

    const params = new URLSearchParams(window.location.search);
    const verifyEmail = params.get('email');
    const verifyToken = params.get('token');

    if (verifyEmail && verifyToken) {
      handleAutoVerify(verifyEmail);
    }

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAutoVerify = async (email: string) => {
    try {
      await api.verifyEmail(email);
      const updated = api.getCurrentUser();
      if (updated && updated.email.toLowerCase() === email.toLowerCase()) {
        setUser(updated);
      }
      window.history.replaceState({}, document.title, "/");
      alert("IDENTITY VERIFIED: Your procurement node is now authorized.");
      setView({ type: 'store' });
    } catch (e) {
      console.error("Verification sync failed.");
    }
  };

  const navigateTo = (newView: ViewState) => {
    if (newView.type === 'store' && user?.role === 'Agent Partner/Prep Center') {
      setView({ type: 'agent' });
    } else {
      setView(newView);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthorizedNavigation = (u: User) => {
    setUser(u);
    if (['System Admin/Owner', 'Operation Manager'].includes(u.role)) {
      navigateTo({ type: 'admin' });
    } else if (u.role === 'Finance/Audit Team') {
      navigateTo({ type: 'finance' });
    } else if (u.role === 'Agent Partner/Prep Center') {
      navigateTo({ type: 'agent' });
    } else if (u.role === 'Lead Trainer') {
      navigateTo({ type: 'trainer' });
    } else if (u.role === 'Support/Sales Node') {
      navigateTo({ type: 'support-portal' });
    } else {
      navigateTo({ type: 'lms-dashboard' });
    }
  };

  // Reusable login component for auth gating
  const LoginGate = () => (
    <div className="view-container">
      <Login 
        onLogin={handleAuthorizedNavigation} 
        onNavigateToSignup={() => navigateTo({ type: 'signup' })} 
        onNavigateToForgot={() => navigateTo({ type: 'forgot-password' })}
      />
    </div>
  );

  const renderContent = () => {
    switch (view.type) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
            <Hero 
              onStart={() => navigateTo({ type: 'store' })} 
              onApplyClick={() => navigateTo({ type: 'apply', formType: 'student-apply' })} 
            />
            <Features />
            <CountryList onNavigateToGuide={(slug) => navigateTo({ type: 'country-guide', slug })} />
          </div>
        );
      case 'store':
        return <div className="view-container"><VoucherStore onCheckout={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} onBook={() => {}} onNavigateToAgent={() => navigateTo({ type: 'agent' })} /></div>;
      case 'country-list':
        return <div className="view-container"><CountryList onNavigateToGuide={(slug) => navigateTo({ type: 'country-guide', slug })} /></div>;
      case 'country-guide':
        return <div className="view-container"><CountryGuide slug={(view as any).slug} onViewUniversity={(slug) => navigateTo({ type: 'university', slug })} onRegister={() => navigateTo({ type: 'apply', formType: 'student-apply' })} /></div>;
      case 'university':
        return <div className="view-container"><UniversityProfile slug={(view as any).slug} /></div>;
      case 'apply':
        return <div className="view-container"><ApplyForm type={(view as any).formType} context={(view as any).context} /></div>;
      case 'join-hub':
        return <div className="view-container"><ApplicationHub onNavigate={navigateTo} /></div>;
      case 'qualifications':
        return <div className="view-container"><QualificationCatalogue onApply={(id) => navigateTo({ type: 'apply', formType: 'student-apply', context: `Qualification ID: ${id}` })} /></div>;
      case 'about':
        return <div className="view-container"><About /></div>;
      case 'resources':
        return <div className="view-container"><Resources onNavigate={navigateTo} /></div>;
      case 'login': 
        return <LoginGate />;
      case 'signup':
        return <div className="view-container"><Signup 
          onSuccess={handleAuthorizedNavigation} 
          onNavigateToLogin={() => navigateTo({ type: 'login' })} 
        /></div>;
      case 'forgot-password':
        return (
          <div className="view-container flex items-center justify-center min-h-[60vh]">
            <div className="max-w-md w-full p-12 bg-white rounded-[3rem] border border-slate-200 text-center shadow-3xl">
              <h2 className="text-3xl font-black uppercase mb-4">Account Recovery</h2>
              <p className="text-slate-500 mb-8 font-bold italic">Enter your registered email address to receive a password reset link.</p>
              <input type="email" placeholder="email@unicou.uk" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl mb-6 outline-none focus:border-unicou-navy font-bold" />
              <button onClick={() => {alert("Recovery link sent to your email."); navigateTo({type: 'login'});}} className="w-full py-5 bg-unicou-navy text-white rounded-2xl font-black uppercase tracking-widest text-xs">Send Recovery Link</button>
              <button onClick={() => navigateTo({type: 'login'})} className="mt-6 text-xs font-black text-slate-400 hover:text-unicou-navy uppercase tracking-widest">Back to Login</button>
            </div>
          </div>
        );
      case 'checkout':
        return <CheckoutProcess productId={(view as any).productId} quantity={(view as any).quantity} onSuccess={(oid) => navigateTo({ type: 'success', orderId: oid })} onCancel={() => navigateTo({ type: 'store' })} onNavigate={navigateTo} />;
      case 'success':
        return <div className="view-container"><SuccessScreen orderId={(view as any).orderId} onClose={() => navigateTo({ type: 'lms-dashboard' })} /></div>;
      case 'admin':
        return <div className="view-container">{user ? <AdminDashboard user={user} /> : <LoginGate />}</div>;
      case 'finance':
        return <div className="view-container">{user ? <FinanceDashboard user={user} /> : <LoginGate />}</div>;
      case 'trainer':
        return <div className="view-container">{user ? <TrainerDashboard user={user} /> : <LoginGate />}</div>;
      case 'support-portal':
        return <div className="view-container">{user ? <SupportDashboard user={user} /> : <LoginGate />}</div>;
      case 'agent':
        if (user && user.role === 'Agent Partner/Prep Center' && !user.isAuthorized) {
          return (
            <div className="view-container flex items-center justify-center p-12">
               <div className="max-w-xl bg-white p-16 rounded-[4rem] border border-slate-200 shadow-3xl text-center">
                  <div className="w-20 h-20 bg-orange-50 text-unicou-orange rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-inner text-4xl">🕒</div>
                  <h2 className="text-3xl font-display font-black text-unicou-navy uppercase tracking-tighter mb-4">Partner Node <span className="text-unicou-orange">Pending</span></h2>
                  <p className="text-slate-600 font-bold italic leading-relaxed mb-10">"Your agency profile is currently under review by the global operations manager. Procurement nodes will be authorized within 24 hours of successful verification."</p>
                  <button onClick={() => navigateTo({ type: 'home' })} className="px-10 py-4 bg-unicou-navy text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-slate-900">Return to Portal Home</button>
               </div>
            </div>
          );
        }
        return <div className="view-container">{user ? <AgentDashboard user={user} onBuy={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} /> : <LoginGate />}</div>;
      case 'lms-dashboard':
        return <div className="view-container">{user ? <CustomerDashboard user={user} onNavigate={navigateTo} /> : <LoginGate />}</div>;
      case 'lms-course-player':
        return <div className="view-container">{user ? <LMSCoursePlayer courseId={(view as any).courseId} onNavigate={navigateTo} /> : <LoginGate />}</div>;
      case 'lms-practice-test':
        return <div className="view-container">{user ? <LMSPracticeTest testId={(view as any).testId} onNavigate={navigateTo} /> : <LoginGate />}</div>;
      case 'policy':
        return <div className="view-container"><PolicyPage policyId={(view as any).policyId} /></div>;
      case 'verification':
        return <div className="view-container"><VerificationPending email={(view as any).email} onVerified={() => {
           const active = api.getCurrentUser();
           setUser(active);
           navigateTo({ type: 'store' });
        }} /></div>;
      default:
        return <div className="view-container text-center pt-40">Page updating soon.</div>;
    }
  };

  const handleLogout = () => { 
    api.logout(); 
    setUser(null); 
    navigateTo({ type: 'home' }); 
  };

  return (
    <div className="min-h-screen text-unicou-navy bg-white relative">
      <Navbar view={view as any} user={user} scrolled={scrolled} onNavigate={navigateTo} onLogout={handleLogout} onOpenSearch={() => setSearchOpen(true)} isVisible={true} />
      <main className="relative z-0">{renderContent()}</main>
      
      <footer className="bg-slate-50 border-t border-slate-200 pt-24 pb-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-slate-200">
            <div className="lg:col-span-2">
               <img src={LOGO_SRC} alt="UniCou" className="h-10 w-auto mb-8 cursor-pointer" onClick={() => navigateTo({type: 'home'})} />
               <p className="text-slate-600 text-sm font-bold italic leading-relaxed max-w-sm">
                 "UniCou Ltd is a premier global academic mobility platform, specializing in University Admissions, Official Exam Vouchers, and Professional Certifications."
               </p>
               <div className="mt-8 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">FB</div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">IG</div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">LI</div>
               </div>
            </div>
            
            <div>
              <h5 className="text-[10px] font-black text-unicou-navy uppercase tracking-widest mb-6">Our Verticals</h5>
              <ul className="space-y-4 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                <li><button onClick={() => navigateTo({type: 'store'})} className="hover:text-unicou-orange transition-colors">Exam Vouchers</button></li>
                <li><button onClick={() => navigateTo({type: 'lms-dashboard'})} className="hover:text-unicou-orange transition-colors">Learning Hub</button></li>
                <li><button onClick={() => navigateTo({type: 'country-list'})} className="hover:text-unicou-orange transition-colors">University Portal</button></li>
                <li><button onClick={() => navigateTo({type: 'qualifications'})} className="hover:text-unicou-orange transition-colors">Qualifications</button></li>
              </ul>
            </div>

            <div>
              <h5 className="text-[10px] font-black text-unicou-navy uppercase tracking-widest mb-6">Legal & Security</h5>
              <ul className="space-y-4 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                <li><button onClick={() => navigateTo({type: 'policy', policyId: 'privacy'})} className="hover:text-unicou-orange transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => navigateTo({type: 'policy', policyId: 'terms-of-use'})} className="hover:text-unicou-orange transition-colors">Terms of Use</button></li>
                <li><button onClick={() => navigateTo({type: 'policy', policyId: 'cookies'})} className="hover:text-unicou-orange transition-colors">Cookie Policy</button></li>
                <li><button onClick={() => navigateTo({type: 'policy', policyId: 'modern-slavery'})} className="hover:text-unicou-orange transition-colors">Modern Slavery</button></li>
                <li><button onClick={() => navigateTo({type: 'policy', policyId: 'accessibility'})} className="hover:text-unicou-orange transition-colors">Accessibility</button></li>
                <li><button onClick={() => navigateTo({type: 'policy', policyId: 'whistleblowing'})} className="hover:text-unicou-orange transition-colors">Whistleblowing</button></li>
                <li><button onClick={() => navigateTo({type: 'policy', policyId: 'carbon-reduction'})} className="hover:text-unicou-orange transition-colors">Carbon Plan</button></li>
              </ul>
            </div>

            <div>
              <h5 className="text-[10px] font-black text-unicou-navy uppercase tracking-widest mb-6">Global Connect</h5>
              <ul className="space-y-4 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                <li><button onClick={() => navigateTo({type: 'join-hub'})} className="hover:text-unicou-orange transition-colors">Application Hub</button></li>
                <li><a href="mailto:connect@unicou.uk" className="hover:text-unicou-orange transition-colors">connect@unicou.uk</a></li>
                <li><a href="https://wa.me/4470000000" className="hover:text-unicou-orange transition-colors">WhatsApp Sync</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
             {OFFICE_LOCATIONS.map((loc, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group hover:border-unicou-orange/20 transition-all">
                   <h6 className="text-[9px] font-black text-unicou-navy uppercase tracking-widest mb-2">{loc.country} Node</h6>
                   <p className="text-[11px] text-slate-500 font-bold italic leading-relaxed">"{loc.address}"</p>
                </div>
             ))}
          </div>

          <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">© 2025 UNICOU LTD • ALL RIGHTS RESERVED.</p>
             <div className="flex items-center gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-unicou-navy"></div>
                <div className="vibrant-strip w-12"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-unicou-orange"></div>
             </div>
          </div>
        </div>
      </footer>

      <AIChat />
      <CookieConsent />
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} onNavigate={navigateTo} />}
    </div>
  );
};

export default App;
