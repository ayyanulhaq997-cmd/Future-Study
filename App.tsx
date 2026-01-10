
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
import SalesDashboard from './components/SalesDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import QualificationCatalogue from './components/QualificationCatalogue';
import PolicyPage from './components/PolicyPage';
import Resources from './components/Resources';
import About from './components/About';
import CookieConsent from './components/CookieConsent';
import PartnerShowcase from './components/PartnerShowcase';
import UserGuide from './components/UserGuide';
import SystemMap from './components/SystemMap';
import HandoverView from './components/HandoverView';
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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (newView: ViewState) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => { api.logout(); setUser(null); navigateTo({ type: 'home' }); };

  const isFocusMode = view.type === 'lms-course-player' || view.type === 'lms-practice-test';

  const renderContent = () => {
    if (view.type === 'lms-dashboard' && user) {
       switch (user.role) {
         case 'System Admin/Owner':
         case 'Operation Manager':
         case 'Academic Manager':
           return <div className="view-container"><AdminDashboard user={user} onNavigate={navigateTo} /></div>;
         case 'Finance Manager':
         case 'Finance':
           return <div className="view-container"><FinanceDashboard user={user} /></div>;
         case 'Sales Manager':
         case 'Sales Agent':
           return <div className="view-container"><SalesDashboard user={user} /></div>;
         case 'Agent':
         case 'Academic Institute':
           return <div className="view-container"><AgentDashboard user={user} onBuy={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} /></div>;
         case 'Teacher':
         case 'Trainer':
           return <div className="view-container"><TrainerDashboard user={user} /></div>;
         default:
           return <div className="view-container"><CustomerDashboard user={user} onNavigate={navigateTo} initialTab={(view as any).initialTab} /></div>;
       }
    }

    switch (view.type) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
            <Hero onStart={() => navigateTo({ type: 'store' })} onApplyClick={() => navigateTo({ type: 'apply', formType: 'student-apply' })} />
            <Features />
            <PartnerShowcase />
            <CountryList onNavigateToGuide={(slug) => navigateTo({ type: 'country-guide', slug })} />
          </div>
        );
      case 'store': return <div className="view-container"><VoucherStore onCheckout={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} onBook={() => {}} onNavigateToAgent={() => navigateTo({ type: 'apply', formType: 'agent-reg' })} /></div>;
      case 'lms-dashboard': return <div className="view-container"><LMSDashboard onNavigate={navigateTo} /></div>;
      case 'country-list': return <div className="view-container"><CountryList onNavigateToGuide={(slug) => navigateTo({ type: 'country-guide', slug })} /></div>;
      case 'country-guide': return <div className="view-container"><CountryGuide slug={(view as any).slug} onViewUniversity={(slug) => navigateTo({ type: 'university', slug })} onRegister={() => navigateTo({ type: 'apply', formType: 'student-apply' })} /></div>;
      case 'university': return <div className="view-container"><UniversityProfile slug={(view as any).slug} /></div>;
      case 'apply': return <div className="view-container"><ApplyForm type={(view as any).formType} context={(view as any).context} /></div>;
      case 'join-hub': return <div className="view-container"><ApplicationHub onNavigate={navigateTo} /></div>;
      case 'qualifications': return <div className="view-container"><QualificationCatalogue onApply={(id) => navigateTo({ type: 'apply', formType: 'student-apply', context: `Qualification: ${id}` })} /></div>;
      case 'resources': return <div className="view-container"><Resources onNavigate={navigateTo} /></div>;
      case 'about': return <div className="view-container"><About /></div>;
      case 'login': return <div className="view-container"><Login onLogin={(u) => { setUser(u); navigateTo({ type: 'lms-dashboard' }); }} onNavigateToSignup={() => navigateTo({ type: 'signup' })} onNavigateToForgot={() => navigateTo({ type: 'home' })} /></div>;
      case 'signup': return <div className="view-container"><Signup onSuccess={(u) => { setUser(u); navigateTo({ type: 'lms-dashboard' }); }} onNavigateToLogin={() => navigateTo({ type: 'login' })} onNavigate={navigateTo} /></div>;
      case 'checkout': return <CheckoutProcess productId={(view as any).productId} quantity={(view as any).quantity} onSuccess={(oid) => navigateTo({ type: 'success', orderId: oid })} onCancel={() => navigateTo({ type: 'store' })} onNavigate={navigateTo} />;
      case 'success': return <div className="view-container"><SuccessScreen orderId={(view as any).orderId} onClose={() => navigateTo({ type: 'lms-dashboard' })} /></div>;
      case 'lms-course-player': return <LMSCoursePlayer courseId={(view as any).courseId} onNavigate={navigateTo} />;
      case 'lms-practice-test': return <LMSPracticeTest testId={(view as any).testId} onNavigate={navigateTo} />;
      case 'policy': return <div className="view-container"><PolicyPage policyId={(view as any).policyId} /></div>;
      case 'system-map': return <div className="view-container"><SystemMap /></div>;
      case 'user-guide': return <div className="view-container"><UserGuide /></div>;
      default: return <div className="view-container text-center pt-40">Syncing Node...</div>;
    }
  };

  return (
    <div className="min-h-screen text-unicou-navy bg-white relative">
      <Navbar view={view as any} user={user} scrolled={scrolled} onNavigate={navigateTo} onLogout={handleLogout} onOpenSearch={() => setSearchOpen(true)} isVisible={!isFocusMode} />
      <main className="relative z-0">{renderContent()}</main>
      {!isFocusMode && (
        <footer className="bg-slate-900 text-white pt-24 pb-12 mt-auto">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/10">
              <div className="lg:col-span-2">
                 <img src={LOGO_SRC} alt="UniCou Ltd" className="h-12 w-auto mb-8 cursor-pointer object-contain brightness-0 invert" onClick={() => navigateTo({type: 'home'})} />
                 <p className="text-slate-400 text-sm font-bold italic leading-relaxed max-w-sm mb-10">"Premier global academic mobility platform with presence in Manchester, Dubai, and Lahore."</p>
                 <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-unicou-orange">Regional Nodes:</p>
                    <div className="text-[11px] text-slate-300 font-bold space-y-1">
                      <p>UK: 123 Oxford Rd, Manchester M13 9PL</p>
                      <p>UAE: Business Bay, Dubai Corporate Hub</p>
                      <p>PK: Gulberg III, Lahore Academic Node</p>
                    </div>
                 </div>
              </div>
              <div>
                <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Verticals</h5>
                <ul className="space-y-4 text-xs font-bold text-slate-400 uppercase">
                  <li><button onClick={() => navigateTo({type: 'store'})} className="hover:text-unicou-orange transition-colors">Exam Vouchers</button></li>
                  <li><button onClick={() => navigateTo({type: 'lms-dashboard'})} className="hover:text-unicou-orange transition-colors">Study Hub</button></li>
                  <li><button onClick={() => navigateTo({type: 'join-hub'})} className="hover:text-unicou-orange transition-colors">Admission Hub</button></li>
                  <li><button onClick={() => navigateTo({type: 'about'})} className="hover:text-unicou-orange transition-colors">About Us</button></li>
                </ul>
              </div>
              <div>
                <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Legal & Policies</h5>
                <ul className="space-y-4 text-xs font-bold text-slate-400 uppercase">
                  <li><button onClick={() => navigateTo({type: 'policy', policyId: 'privacy'})} className="hover:text-unicou-orange transition-colors">Privacy Policy</button></li>
                  <li><button onClick={() => navigateTo({type: 'policy', policyId: 'modern-slavery'})} className="hover:text-unicou-orange transition-colors">Modern Slavery</button></li>
                  <li><button onClick={() => navigateTo({type: 'policy', policyId: 'accessibility'})} className="hover:text-unicou-orange transition-colors">Accessibility</button></li>
                  <li><button onClick={() => navigateTo({type: 'policy', policyId: 'cookies'})} className="hover:text-unicou-orange transition-colors">Cookie Use</button></li>
                  <li><button onClick={() => navigateTo({type: 'policy', policyId: 'whistleblowing'})} className="hover:text-unicou-orange transition-colors">Whistleblowing</button></li>
                  <li><button onClick={() => navigateTo({type: 'policy', policyId: 'carbon-reduction'})} className="hover:text-unicou-orange transition-colors">Carbon Reduction</button></li>
                  <li><button onClick={() => navigateTo({type: 'policy', policyId: 'terms-of-use'})} className="hover:text-unicou-orange transition-colors">Terms of Use</button></li>
                </ul>
              </div>
              <div>
                <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Contact</h5>
                <div className="space-y-4 text-xs font-bold text-slate-400 uppercase">
                   <p className="text-unicou-orange">connect@unicou.uk</p>
                   <p>+44 7XX XXXXXXX</p>
                   <p>UK Registered: 12345678</p>
                </div>
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mt-16 text-center">© 2025 UNICOU LTD • REGISTERED IN ENGLAND & WALES.</p>
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
