
import React, { useState, useEffect, useMemo } from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import VoucherStore from './components/VoucherStore';
import AdminDashboard from './components/AdminDashboard';
import AgentDashboard from './components/AgentDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import TrainerDashboard from './components/TrainerDashboard';
import FinanceDashboard from './components/FinanceDashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import VerificationPending from './components/VerificationPending';
import CheckoutProcess from './components/CheckoutProcess';
import SuccessScreen from './components/SuccessScreen';
import EnquiryForm from './components/EnquiryForm';
import APIDocs from './components/APIDocs';
import AdminDeveloperGuide from './components/AdminDeveloperGuide';
import LMSDashboard from './components/LMSDashboard';
import LMSCoursePlayer from './components/LMSCoursePlayer';
import LMSPracticeTest from './components/LMSPracticeTest';
import CourseCatalogue from './components/CourseCatalogue';
import QualificationCatalogue from './components/QualificationCatalogue';
import QualificationLeadForm from './components/QualificationLeadForm';
import HandoverView from './components/HandoverView';
import RegistrationForm from './components/RegistrationForm';
import AIChat from './components/AIChat';
import Navbar from './components/Navbar';
import CountryGuide from './components/CountryGuide';
import ImmigrationGuide from './components/ImmigrationGuide';
import UniversityProfile from './components/UniversityProfile';
import SearchOverlay from './components/SearchOverlay';
import { ViewState, User } from './types';
import { api } from './services/apiService';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState<ViewState>({ type: 'store' });
  const [user, setUser] = useState<User | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navigateTo = (newView: ViewState) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleLogin = (u: User) => {
    setUser(u);
    const redirectMap: Record<string, ViewState> = {
      'Admin': { type: 'admin' },
      'Agent': { type: 'agent' },
      'Trainer': { type: 'trainer' },
      'Finance': { type: 'finance' },
    };
    navigateTo(redirectMap[u.role] || { type: 'lms-dashboard' });
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    navigateTo({ type: 'store' });
  };

  const mainContent = useMemo(() => {
    switch (view.type) {
      case 'store':
        return (
          <div className="page-transition">
            <Hero onStart={() => document.getElementById('inventory')?.scrollIntoView({ behavior: 'smooth' })} />
            <div id="inventory">
              <VoucherStore 
                onCheckout={(pid, qty) => !user ? navigateTo({type:'login'}) : setView({type:'checkout', productId: pid, quantity: qty})} 
                onBook={(pid) => !user ? navigateTo({type:'login'}) : setView({type:'book-test', productId: pid})}
              />
            </div>
            <Features />
            <EnquirySection />
          </div>
        );
      case 'login': return <div className="page-transition"><Login onLogin={handleLogin} onNavigateToSignup={() => navigateTo({ type: 'signup' })} /></div>;
      case 'signup': return <div className="page-transition"><Signup onNavigateToLogin={() => navigateTo({ type: 'login' })} onSuccess={(email) => navigateTo({ type: 'verification-pending', email })} /></div>;
      case 'verification-pending': return <div className="page-transition"><VerificationPending email={view.email} onVerified={() => { alert('Identity Verified'); navigateTo({ type: 'login' }); }} /></div>;
      case 'admin': return user?.role === 'Admin' ? <div className="page-transition"><AdminDashboard /></div> : null;
      case 'trainer': return user?.role === 'Trainer' ? <div className="page-transition"><TrainerDashboard user={user} /></div> : null;
      case 'agent': return user?.role === 'Agent' ? <div className="page-transition"><AgentDashboard user={user} onBuy={(pid, qty) => setView({ type: 'checkout', productId: pid, quantity: qty })} /></div> : null;
      case 'finance': return user?.role === 'Finance' ? <div className="page-transition"><FinanceDashboard user={user} /></div> : null;
      case 'customer': return user?.role === 'Customer' ? <div className="page-transition"><CustomerDashboard user={user} /></div> : null;
      case 'api-docs': return <div className="page-transition"><APIDocs /></div>;
      case 'admin-guide': return <div className="page-transition"><AdminDeveloperGuide /></div>;
      case 'course-catalogue': return <div className="page-transition"><CourseCatalogue onCheckout={(pid, qty) => !user ? navigateTo({type:'login'}) : setView({type:'checkout', productId: pid, quantity: qty})} /></div>;
      case 'qualifications': return <div className="page-transition"><QualificationCatalogue onApply={(id) => navigateTo({ type: 'qualification-apply', qualificationId: id })} /></div>;
      case 'qualification-apply': return <div className="page-transition"><QualificationLeadForm qualificationId={view.qualificationId} onCancel={() => navigateTo({ type: 'qualifications' })} onSuccess={(l) => navigateTo({ type: 'store' })} /></div>;
      case 'lms-dashboard': return <div className="page-transition"><LMSDashboard onNavigate={navigateTo} /></div>;
      case 'lms-course-player': return <div className="page-transition"><LMSCoursePlayer courseId={view.courseId} onNavigate={navigateTo} /></div>;
      case 'lms-practice-test': return <div className="page-transition"><LMSPracticeTest testId={view.testId} onNavigate={navigateTo} /></div>;
      case 'success': return <div className="page-transition"><SuccessScreen orderId={view.orderId} onClose={() => navigateTo({type:'store'})} /></div>;
      case 'checkout': return <div className="page-transition"><CheckoutProcess productId={view.productId} quantity={view.quantity} onSuccess={(oid) => navigateTo({ type: 'success', orderId: oid })} onCancel={() => navigateTo({type:'store'})} /></div>;
      case 'book-test': return <div className="page-transition"><RegistrationForm productId={view.productId} onCancel={() => navigateTo({type:'store'})} onSuccess={(b) => { alert(`Booking Confirmed: ${b.trackingRef}`); navigateTo({type:'store'}); }} /></div>;
      case 'country-guide': return <div className="page-transition"><CountryGuide slug={view.slug} onViewUniversity={(uslug) => navigateTo({ type: 'university', slug: uslug })} /></div>;
      case 'immigration-guide': return <div className="page-transition"><ImmigrationGuide slug={view.slug} /></div>;
      case 'university': return <div className="page-transition"><UniversityProfile slug={view.slug} /></div>;
      case 'handover': return <div className="page-transition"><HandoverView /></div>;
      default: return null;
    }
  }, [view, user]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-primary-500/30">
      <div className="fixed inset-0 gradient-bg pointer-events-none z-0" aria-hidden="true" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar 
          view={view} user={user} scrolled={scrolled} 
          onNavigate={navigateTo} onLogout={handleLogout} 
          onOpenSearch={() => setSearchOpen(true)}
        />
        <main className="flex-grow pt-24">{mainContent}</main>
        <footer className="py-20 border-t border-slate-900 bg-slate-950 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <h3 className="text-2xl font-display font-bold tracking-tighter uppercase">NEXUS<span className="text-primary-400">IMMIGRATION</span></h3>
              </div>
              <p className="text-slate-500 max-w-sm text-sm leading-relaxed mb-8">Unified Global Infrastructure for Student Mobility and International Settlement.</p>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase text-slate-500 mb-8 tracking-widest">Global Destinations</h4>
              <ul className="space-y-4 text-sm font-medium text-slate-400">
                {['United Kingdom', 'Australia', 'Canada', 'USA'].map(c => (
                  <li key={c}><button onClick={() => navigateTo({type:'country-guide', slug:c.toLowerCase().replace(' ', '-')})} className="hover:text-primary-400 transition-colors">{c}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase text-slate-500 mb-8 tracking-widest">System Access</h4>
              <ul className="space-y-4 text-sm font-medium text-slate-400">
                <li><button onClick={() => navigateTo({type:'api-docs'})} className="hover:text-primary-400 transition-colors">Developer Console</button></li>
                <li><button onClick={() => navigateTo({type:'admin-guide'})} className="hover:text-primary-400 transition-colors">Admin Guide</button></li>
                <li><button onClick={() => navigateTo({type:'store'})} className="hover:text-primary-400 transition-colors">Unified Store</button></li>
              </ul>
            </div>
          </div>
        </footer>
        <AIChat />
        {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} onNavigate={navigateTo} />}
      </div>
    </div>
  );
};

const EnquirySection = () => (
  <section className="py-24 max-w-7xl mx-auto px-4 relative overflow-hidden">
    <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary-500/5 blur-[120px] rounded-full -z-10" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div>
        <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-[1.1] tracking-tight">Direct <span className="gradient-text">Council</span> Links.</h2>
        <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-lg">Authorized node for Pearson, British Council, and International Settlement Boards.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FeatureItem icon="🎖️" title="Board Certified" desc="Official tier-1 partner status." />
          <FeatureItem icon="🌍" title="Multi-Region" desc="12 global fulfillment nodes." />
        </div>
      </div>
      <EnquiryForm />
    </div>
  </section>
);

const FeatureItem = ({ icon, title, desc }: { icon: string; title: string; desc: string }) => (
  <div className="flex flex-col gap-3 p-6 glass rounded-3xl border-slate-800/50 hover:border-primary-500/20 transition-colors group">
    <span className="text-3xl group-hover:scale-110 transition-transform w-fit">{icon}</span>
    <div>
      <h4 className="font-bold text-slate-100 text-sm tracking-tight">{title}</h4>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default App;
