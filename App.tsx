
import React, { useState, useEffect, useMemo } from 'react';
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
import SupportDashboard from './components/SupportDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import QualificationCatalogue from './components/QualificationCatalogue';
import PolicyPage from './components/PolicyPage';
import Resources from './components/Resources';
import About from './components/About';
import CookieConsent from './components/CookieConsent';
import PartnerShowcase from './components/PartnerShowcase';
import UserGuide from './components/UserGuide';
import SystemMap from './components/SystemMap';
import { ViewState, User } from './types';
import { api } from './services/apiService';
import { LOGO_SRC } from './constants/assets';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  // PATH-BASED ROUTING SIMULATION
  const initialView = useMemo<ViewState>(() => {
    const path = window.location.pathname.toLowerCase();
    if (path === '/studyabroad') return { type: 'country-list' };
    if (path === '/exams') return { type: 'store' };
    if (path === '/learninghub') return { type: 'lms-dashboard' };
    if (path === '/blogs') return { type: 'resources' };
    return { type: 'home' };
  }, []);

  const [view, setView] = useState<ViewState>(initialView);

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
           return <div className="view-container"><AdminDashboard user={user} onNavigate={navigateTo} /></div>;
         case 'Finance Manager':
         case 'Finance':
           return <div className="view-container"><FinanceDashboard user={user} /></div>;
         case 'Sales Manager':
         case 'Sales Agent':
           return <div className="view-container"><SalesDashboard user={user} /></div>;
         case 'Support':
           return <div className="view-container"><SupportDashboard user={user} /></div>;
         case 'Agent':
           return <div className="view-container"><AgentDashboard user={user} onBuy={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} /></div>;
         case 'Trainer':
         case 'Teacher':
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
      default: return <div className="view-container text-center pt-40 font-bold uppercase text-slate-400">Node Sync...</div>;
    }
  };

  return (
    <div className="min-h-screen text-unicou-navy bg-white relative flex flex-col">
      <Navbar view={view as any} user={user} scrolled={scrolled} onNavigate={navigateTo} onLogout={handleLogout} onOpenSearch={() => setSearchOpen(true)} isVisible={!isFocusMode} />
      <main className="relative z-0 flex-grow">{renderContent()}</main>

      {!isFocusMode && (
        <footer className="bg-slate-900 text-white pt-24 pb-12 mt-auto">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-white/10">
              <div className="lg:col-span-2">
                 <div className="inline-block bg-white p-4 rounded-3xl mb-8 shadow-xl">
                   <img src={LOGO_SRC} alt="UniCou Ltd" className="h-10 w-auto cursor-pointer object-contain" onClick={() => navigateTo({type: 'home'})} />
                 </div>
                 <p className="text-slate-400 text-sm font-bold italic leading-relaxed max-w-sm mb-10">"Premier global academic mobility platform with presence in Manchester, Dubai, and Pakistan."</p>
                 <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-unicou-orange">Regional Offices:</p>
                    <div className="text-[11px] text-slate-300 font-bold space-y-1">
                      <p>UK: Sale Manchester, UK M33 4QP</p>
                      <p>UAE: 24695 Deira, Dubai, UAE</p>
                      <p>PK: 23-17-B-1, Township, Lahore, Pakistan</p>
                    </div>
                 </div>
              </div>
              <div>
                <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Quick Links</h5>
                <ul className="space-y-4 text-xs font-bold text-slate-400">
                  <li><button onClick={() => navigateTo({type: 'apply', formType: 'student-apply'})} className="hover:text-unicou-orange transition-colors">Apply Now</button></li>
                  <li><a href="https://lms.unicou.uk" target="_blank" rel="noopener noreferrer" className="hover:text-unicou-orange transition-colors">Learning Hub</a></li>
                  <li><a href="https://vouchers.unicou.uk" target="_blank" rel="noopener noreferrer" className="hover:text-unicou-orange transition-colors">Vouchers</a></li>
                  <li><button onClick={() => navigateTo({ type: 'apply', formType: 'general' })} className="hover:text-unicou-orange transition-colors">Contact Us</button></li>
                  <li><button onClick={() => navigateTo({ type: 'apply', formType: 'careers' })} className="hover:text-unicou-orange transition-colors">Career</button></li>
                </ul>
              </div>
              <div>
                <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Legal & Policies</h5>
                <ul className="space-y-3 text-xs font-bold text-slate-400">
                  <li><button onClick={() => navigateTo({type: 'policy', policyId: 'privacy'})} className="hover:text-unicou-orange transition-colors text-left">Privacy Policy</button></li>
                  <li><button onClick={() => navigateTo({type: 'policy', policyId: 'terms-of-use'})} className="hover:text-unicou-orange transition-colors text-left">Terms of Use</button></li>
                  <li><button onClick={() => navigateTo({type: 'policy', policyId: 'modern-slavery'})} className="hover:text-unicou-orange transition-colors text-left">Modern Slavery</button></li>
                  <li><button onClick={() => navigateTo({type: 'policy', policyId: 'accessibility'})} className="hover:text-unicou-orange transition-colors text-left">Accessibility</button></li>
                  <li><button onClick={() => navigateTo({type: 'policy', policyId: 'cookies'})} className="hover:text-unicou-orange transition-colors text-left">Cookie Use Policy</button></li>
                  <li><button onClick={() => navigateTo({type: 'policy', policyId: 'whistleblowing'})} className="hover:text-unicou-orange transition-colors text-left">Whistleblowing</button></li>
                  <li><button onClick={() => navigateTo({type: 'policy', policyId: 'carbon-reduction'})} className="hover:text-unicou-orange transition-colors text-left">Carbon Reduction</button></li>
                </ul>
              </div>
              <div>
                <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Contact</h5>
                <div className="space-y-4 text-xs font-bold text-slate-400">
                   <p className="text-unicou-orange underline cursor-pointer lowercase" onClick={() => navigateTo({ type: 'apply', formType: 'general' })}>connect@unicou.uk</p>
                   <p className="capitalize">Manchester Registry Office</p>
                </div>
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] mt-16 text-center">© 2025 UNICOU LTD • REGISTERED IN ENGLAND & WALES.</p>
          </div>
        </footer>
      )}
      <AIChat onNavigate={navigateTo} />
      <CookieConsent />
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} onNavigate={navigateTo} />}
    </div>
  );
};

export default App;
