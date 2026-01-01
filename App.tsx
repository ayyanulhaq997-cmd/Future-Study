
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
import VerificationPending from './components/VerificationPending';
import AIChat from './components/AIChat';
import LMSDashboard from './components/LMSDashboard';
import CheckoutProcess from './components/CheckoutProcess';
import SuccessScreen from './components/SuccessScreen';
import AdminDashboard from './components/AdminDashboard';
import AgentDashboard from './components/AgentDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import QualificationCatalogue from './components/QualificationCatalogue';
import { ViewState, User } from './types';
import { api } from './services/apiService';
import { LOGO_SRC } from './constants/assets';

const OFFICE_LOCATIONS = [
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
    if (['System Admin/Owner', 'Finance/Audit Team', 'Operation Manager'].includes(u.role)) {
      navigateTo({ type: 'admin' });
    } else if (u.role === 'Agent Partner/Prep Center') {
      navigateTo({ type: 'agent' });
    } else {
      navigateTo({ type: 'lms-dashboard' });
    }
  };

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
        return <div className="view-container"><VoucherStore onCheckout={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} onBook={() => {}} onNavigateToAgent={() => navigateTo({ type: 'apply', formType: 'agent-reg' })} /></div>;
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
      case 'login': 
        return <div className="view-container"><Login 
          onLogin={handleAuthorizedNavigation} 
          onNavigateToSignup={() => navigateTo({ type: 'signup' })} 
          onNavigateToForgot={() => navigateTo({ type: 'forgot-password' })}
        /></div>;
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
        return <div className="view-container"><CheckoutProcess productId={(view as any).productId} quantity={(view as any).quantity} onSuccess={(oid) => navigateTo({ type: 'success', orderId: oid })} onCancel={() => navigateTo({ type: 'store' })} /></div>;
      case 'success':
        return <div className="view-container"><SuccessScreen orderId={(view as any).orderId} onClose={() => navigateTo({ type: 'store' })} /></div>;
      case 'admin':
        return <div className="view-container"><AdminDashboard /></div>;
      case 'agent':
        return <div className="view-container">{user ? <AgentDashboard user={user} onBuy={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} /> : <Login onLogin={handleAuthorizedNavigation} onNavigateToSignup={() => navigateTo({ type: 'signup' })} onNavigateToForgot={() => navigateTo({ type: 'forgot-password' })} />}</div>;
      case 'lms-dashboard':
        return <div className="view-container">{user ? <CustomerDashboard user={user} onNavigate={navigateTo} /> : <LMSDashboard onNavigate={navigateTo} />}</div>;
      default:
        return <div className="view-container text-center pt-40">Page updating soon.</div>;
    }
  };

  const handleLogout = () => { api.logout(); setUser(null); navigateTo({ type: 'home' }); };

  return (
    <div className="min-h-screen text-unicou-navy bg-white relative">
      <Navbar view={view as any} user={user} scrolled={scrolled} onNavigate={navigateTo} onLogout={handleLogout} onOpenSearch={() => setSearchOpen(true)} isVisible={true} />
      <main className="relative z-0">{renderContent()}</main>
      
      <footer className="bg-slate-50 border-t border-slate-100 py-24 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 pb-16 border-b border-slate-200">
            <div className="md:col-span-1">
               <img src={LOGO_SRC} alt="UniCou" className="h-10 w-auto mb-8 cursor-pointer" onClick={() => navigateTo({type: 'home'})} />
               <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-loose">Study Abroad Specialists.<br />Your path to global education.</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-10">
              {OFFICE_LOCATIONS.map((loc, i) => (
                <div key={i}>
                  <h5 className="text-[11px] font-black text-unicou-navy uppercase tracking-widest mb-4">{loc.country} Regional Office</h5>
                  <p className="text-[13px] text-slate-600 leading-relaxed font-bold italic">"{loc.address}"</p>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-10 flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
             <p className="ml-auto italic">© 2025 UniCou International Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AIChat />
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} onNavigate={navigateTo} />}
    </div>
  );
};

export default App;
