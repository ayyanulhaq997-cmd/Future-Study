
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
import AgentDashboard from './components/AgentDashboard';
import AdminDashboard from './components/AdminDashboard';
import FinanceDashboard from './components/FinanceDashboard';
import TrainerDashboard from './components/TrainerDashboard';
import SupportDashboard from './components/SupportDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import SalesDashboard from './components/SalesDashboard';
import CourseCatalogue from './components/CourseCatalogue';
import QualificationCatalogue from './components/QualificationCatalogue';
import PolicyPage from './components/PolicyPage';
import Resources from './components/Resources';
import About from './components/About';
import CookieConsent from './components/CookieConsent';
import { ViewState, User } from './types';
import { api } from './services/apiService';
import { LOGO_SRC } from './constants/assets';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState<ViewState>({ type: 'home' });
  const [user, setUser] = useState<User | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const active = api.getCurrentUser();
    if (active) setUser(active);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (newView: ViewState) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthorizedNavigation = (u: User) => {
    setUser(u);
    navigateTo({ type: 'lms-dashboard' }); 
  };

  const isFocusMode = view.type === 'lms-course-player' || view.type === 'lms-practice-test';

  const renderContent = () => {
    // Identity-Locked Dashboard Routing (Req 13)
    if (view.type === 'lms-dashboard' && user) {
       switch (user.role) {
         case 'System Admin/Owner':
         case 'Operation Manager':
         case 'Academic Manager':
           return <div className="view-container"><AdminDashboard user={user} /></div>;
         
         case 'Finance Manager':
         case 'Finance':
           return <div className="view-container"><FinanceDashboard user={user} /></div>;
         
         case 'Sales Manager':
         case 'Sales Agent':
         case 'Sales':
         case 'Support':
           return <div className="view-container"><SalesDashboard user={user} /></div>;
         
         case 'Agent':
         case 'Academic Institute':
         case 'Institute':
           return <div className="view-container"><AgentDashboard user={user} onBuy={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} /></div>;
         
         case 'Teacher':
         case 'Trainer':
           return <div className="view-container"><TrainerDashboard user={user} /></div>;
         
         case 'Student':
         default:
           return <div className="view-container"><CustomerDashboard user={user} onNavigate={navigateTo} initialTab={(view as any).initialTab} /></div>;
       }
    }

    // Public View Logic
    switch (view.type) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
            <Hero onStart={() => navigateTo({ type: 'store' })} onApplyClick={() => navigateTo({ type: 'apply', formType: 'student-apply' })} />
            <Features />
            <CountryList onNavigateToGuide={(slug) => navigateTo({ type: 'country-guide', slug })} />
          </div>
        );
      case 'store':
        return <div className="view-container"><VoucherStore onCheckout={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} onBook={() => {}} onNavigateToAgent={() => navigateTo({ type: 'agent' })} /></div>;
      case 'lms-dashboard':
        // Fallback for logged-out users clicking Study Hub
        return <div className="view-container"><LMSDashboard onNavigate={navigateTo} /></div>;
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
        return <div className="view-container"><Login onLogin={handleAuthorizedNavigation} onNavigateToSignup={() => navigateTo({ type: 'signup' })} onNavigateToForgot={() => navigateTo({ type: 'forgot-password' })} /></div>;
      case 'signup':
        return <div className="view-container"><Signup onSuccess={handleAuthorizedNavigation} onNavigateToLogin={() => navigateTo({ type: 'login' })} /></div>;
      case 'checkout':
        return <CheckoutProcess productId={(view as any).productId} quantity={(view as any).quantity} onSuccess={(oid) => navigateTo({ type: 'success', orderId: oid })} onCancel={() => navigateTo({ type: 'store' })} onNavigate={navigateTo} />;
      case 'success':
        return <div className="view-container"><SuccessScreen orderId={(view as any).orderId} onClose={() => navigateTo({ type: 'lms-dashboard' })} /></div>;
      case 'policy':
        return <div className="view-container"><PolicyPage policyId={(view as any).policyId} /></div>;
      case 'lms-course-player':
        return <LMSCoursePlayer courseId={(view as any).courseId} onNavigate={navigateTo} />;
      case 'lms-practice-test':
        return <LMSPracticeTest testId={(view as any).testId} onNavigate={navigateTo} />;
      default:
        return <div className="view-container text-center pt-40">Synchronizing Global Portal...</div>;
    }
  };

  const handleLogout = () => { api.logout(); setUser(null); navigateTo({ type: 'home' }); };

  return (
    <div className="min-h-screen text-unicou-navy bg-white relative">
      <Navbar view={view as any} user={user} scrolled={scrolled} onNavigate={navigateTo} onLogout={handleLogout} onOpenSearch={() => setSearchOpen(true)} isVisible={!isFocusMode} />
      <main className="relative z-0">{renderContent()}</main>
      
      {!isFocusMode && (
        <footer className="bg-slate-50 border-t border-slate-200 pt-24 pb-12 mt-auto">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-slate-200">
              <div className="lg:col-span-2">
                 <img src={LOGO_SRC} alt="UniCou Ltd" className="h-12 w-auto mb-8 cursor-pointer object-contain" onClick={() => navigateTo({type: 'home'})} />
                 <p className="text-slate-600 text-sm font-bold italic leading-relaxed max-w-sm mb-10">"UniCou Ltd is a premier global academic mobility platform with a physical presence in key educational nodes."</p>
                 
                 <div className="space-y-6">
                    <h5 className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.3em] mb-4 text-unicou-orange">Regional Headquarters</h5>
                    <div className="space-y-4 text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                       <p className="flex items-start gap-4">
                        <span className="w-8 py-1 bg-unicou-navy text-white text-[8px] flex items-center justify-center rounded shrink-0 shadow-sm">UK</span> 
                        <span className="leading-relaxed">26 Chepstow Avenue, Sale Manchester, United Kingdom</span>
                       </p>
                       <p className="flex items-start gap-4">
                        <span className="w-8 py-1 bg-unicou-orange text-white text-[8px] flex items-center justify-center rounded shrink-0 shadow-sm">UAE</span> 
                        <span className="leading-relaxed">24695 Deira, Dubai, UAE</span>
                       </p>
                       <p className="flex items-start gap-4">
                        <span className="w-8 py-1 bg-unicou-navy text-white text-[8px] flex items-center justify-center rounded shrink-0 shadow-sm">PK</span> 
                        <span className="leading-relaxed">Plot No.23-17-B-1, Township, Lahore, Pakistan</span>
                       </p>
                    </div>
                 </div>
              </div>
              <div>
                <h5 className="text-[10px] font-black text-unicou-navy uppercase tracking-widest mb-6">Verticals</h5>
                <ul className="space-y-4 text-xs font-bold text-slate-500 uppercase">
                  <li><button onClick={() => navigateTo({type: 'store'})} className="hover:text-unicou-orange">Exam Vouchers</button></li>
                  <li><button onClick={() => navigateTo({type: 'lms-dashboard'})} className="hover:text-unicou-orange">Study Hub</button></li>
                  <li><button onClick={() => navigateTo({type: 'join-hub'})} className="hover:text-unicou-orange">Application Hub</button></li>
                </ul>
              </div>
              <div>
                <h5 className="text-[10px] font-black text-unicou-navy uppercase tracking-widest mb-6">Legal & Policy</h5>
                <ul className="space-y-4 text-xs font-bold text-slate-500 uppercase">
                  <li><button onClick={() => navigateTo({type: 'policy', policyId: 'privacy'})} className="hover:text-unicou-orange">Privacy Policy</button></li>
                  <li><button onClick={() => navigateTo({type: 'policy', policyId: 'terms-of-use'})} className="hover:text-unicou-orange">Terms of Use</button></li>
                  <li><button onClick={() => navigateTo({type: 'policy', policyId: 'modern-slavery'})} className="hover:text-unicou-orange">Modern Slavery</button></li>
                  <li><button onClick={() => navigateTo({type: 'policy', policyId: 'cookies'})} className="hover:text-unicou-orange">Cookies Policy</button></li>
                </ul>
              </div>
              <div>
                <h5 className="text-[10px] font-black text-unicou-navy uppercase tracking-widest mb-6">Connect</h5>
                <ul className="space-y-4 text-xs font-bold text-slate-500 uppercase">
                  <li><a href="mailto:connect@unicou.uk" className="hover:text-unicou-orange lowercase italic">connect@unicou.uk</a></li>
                  <li><button onClick={() => navigateTo({type: 'about'})} className="hover:text-unicou-orange">About Us</button></li>
                </ul>
              </div>
            </div>
            <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">© 2025 UNICOU LTD • REGISTERED IN ENGLAND & WALES.</p>
            </div>
          </div>
        </footer>
      )}

      <AIChat />
      <CookieConsent />
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} onNavigate={navigateTo} />}
    </div>
  );
};

export default App;
