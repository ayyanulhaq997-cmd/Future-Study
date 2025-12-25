import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import VoucherStore from './components/VoucherStore';
import Navbar from './components/Navbar';
import ApplyForm from './components/ApplyForm';
import SearchOverlay from './components/SearchOverlay';
import CountryGuide from './components/CountryGuide';
import CountryList from './components/CountryList';
import Login from './components/Login';
import Signup from './components/Signup';
import VerificationPending from './components/VerificationPending';
import AIChat from './components/AIChat';
import LMSDashboard from './components/LMSDashboard';
import CourseCatalogue from './components/CourseCatalogue';
import Resources from './components/Resources';
import Careers from './components/Careers';
import CheckoutProcess from './components/CheckoutProcess';
import SuccessScreen from './components/SuccessScreen';
import UniversityProfile from './components/UniversityProfile';
import QualificationCatalogue from './components/QualificationCatalogue';
import AdminDashboard from './components/AdminDashboard';
import AgentDashboard from './components/AgentDashboard';
import PartnerShowcase from './components/PartnerShowcase';
import CookieConsent from './components/CookieConsent';
import CustomerDashboard from './components/CustomerDashboard';
import { ViewState, User } from './types';
import { api } from './services/apiService';
import { LOGO_SRC } from './constants/assets';

const POLICY_CONTENT: Record<string, { title: string; content: string }> = {
  'modern-slavery': { 
    title: 'Modern Slavery Policy', 
    content: `Modern Slavery and Human Trafficking Statement – UniCou Ltd\nUniCou Ltd is committed to preventing modern slavery and human trafficking in all its business operations and supply chains...` 
  },
  'privacy': { 
    title: 'Privacy Policy', 
    content: `UniCou Ltd is committed to protecting personal data and respecting privacy rights...` 
  },
  'terms': { 
    title: 'Terms of Use', 
    content: `These Website Terms of Use govern access to and use of the UniCou Ltd website...` 
  }
};

const OFFICE_LOCATIONS = [
  { country: "United Kingdom", address: "26 Chepstow Avenue, Sale Manchester, United Kingdom" },
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

  const renderContent = () => {
    switch (view.type) {
      case 'home':
        return (
          <div className="animate-in fade-in duration-1000">
            <Hero onStart={() => navigateTo({ type: 'store' })} onResellerClick={() => navigateTo({ type: 'apply', formType: 'agent-reg', context: 'Partner Entry' })} />
            <Features />
            <PartnerShowcase />
            <div id="destination-directory" className="scroll-mt-32">
               <CountryList onNavigateToGuide={(slug) => navigateTo({ type: 'country-guide', slug })} />
            </div>
          </div>
        );
      case 'store':
        return <div className="view-container"><VoucherStore onCheckout={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} onBook={(p) => navigateTo({ type: 'apply', formType: 'student-apply', context: `Booking: ${p}` })} onNavigateToAgent={() => navigateTo({ type: 'agent' })} /></div>;
      case 'apply':
        return <div className="max-w-4xl mx-auto view-container px-4"><ApplyForm type={view.formType} context={view.context} /></div>;
      case 'country-list':
        return <div className="view-container"><CountryList onNavigateToGuide={(slug) => navigateTo({ type: 'country-guide', slug })} /></div>;
      case 'country-guide':
        return <div className="view-container"><CountryGuide slug={view.slug} onViewUniversity={(uSlug) => navigateTo({ type: 'university', slug: uSlug })} onRegister={() => navigateTo({ type: 'apply', formType: 'student-apply', context: `Register: ${view.slug}` })} /></div>;
      case 'lms-dashboard':
        return <div className="view-container">{user ? <CustomerDashboard user={user} /> : <LMSDashboard onNavigate={navigateTo} />}</div>;
      case 'course-catalogue':
        return <div className="view-container"><CourseCatalogue onCheckout={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} /></div>;
      case 'checkout':
        return <div className="view-container"><CheckoutProcess productId={view.productId} quantity={view.quantity} onSuccess={(oid) => navigateTo({ type: 'success', orderId: oid })} onCancel={() => navigateTo({ type: 'store' })} /></div>;
      case 'success':
        return <div className="view-container"><SuccessScreen orderId={view.orderId} onClose={() => navigateTo({ type: 'store' })} /></div>;
      case 'admin':
        if (!user || !['Admin', 'Finance', 'Teller'].includes(user.role)) return <div className="view-container text-center pt-40">Identity Verification Required.</div>;
        return <div className="view-container"><AdminDashboard /></div>;
      case 'agent':
        if (!user || user.role !== 'Agent') return <div className="view-container text-center pt-40">Partner Portal Access Restricted.</div>;
        return <div className="view-container"><AgentDashboard user={user} onBuy={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} /></div>;
      case 'login': 
        return <div className="view-container"><Login onLogin={(u) => { setUser(u); navigateTo(['Admin', 'Finance'].includes(u.role) ? { type: 'admin' } : { type: 'lms-dashboard' }); }} onNavigateToSignup={() => navigateTo({ type: 'signup' })} /></div>;
      case 'signup':
        return <div className="view-container"><Signup onSuccess={(e) => navigateTo({ type: 'verification-pending', email: e })} onNavigateToLogin={() => navigateTo({ type: 'login' })} /></div>;
      case 'about':
        return (
          <div className="max-w-7xl mx-auto view-container px-6 animate-in fade-in pb-24">
             <div className="text-center mb-24">
                <h1 className="text-6xl font-display font-bold text-slate-900 mb-6">About <span className="text-unicou-orange">Us</span></h1>
                <div className="h-1.5 w-24 bg-unicou-orange mx-auto rounded-full" />
             </div>
             <div className="glass p-12 md:p-20 rounded-[3rem] text-slate-700 leading-relaxed text-lg space-y-8 shadow-xl">
               <p>Founded in 2009, UNICOU is a leading international education and immigration consultancy with deep roots and a growing global footprint. We serve clients from offices in the UK, Dubai, and Pakistan.</p>
               <p>Our vision is to become the most trusted gateway for students and professionals seeking global mobility solutions, simplifying pathways and building bridges across continents.</p>
             </div>
          </div>
        );
      case 'policy':
        const policy = POLICY_CONTENT[view.policyId];
        return (
          <div className="max-w-4xl mx-auto view-container px-6">
            <h1 className="text-5xl font-display font-bold mb-10 text-slate-900">{policy?.title}</h1>
            <div className="glass p-12 rounded-[3rem] text-slate-600 leading-relaxed whitespace-pre-wrap shadow-xl">
              {policy?.content}
            </div>
          </div>
        );
      case 'resources':
        return <div className="view-container"><Resources onNavigate={navigateTo} /></div>;
      default:
        return <div className="view-container text-center pt-40">Navigation node unmapped.</div>;
    }
  };

  const handleLogout = () => { api.logout(); setUser(null); navigateTo({ type: 'home' }); };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-unicou-orange selection:text-white">
      <Navbar view={view} user={user} scrolled={scrolled} onNavigate={navigateTo} onLogout={handleLogout} onOpenSearch={() => setSearchOpen(true)} />
      <main className="relative z-0">
        {renderContent()}
      </main>
      <footer className="bg-white border-t border-slate-200 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 pb-20 border-b border-slate-100">
            <div className="md:col-span-1">
               <img src={LOGO_SRC} alt="UNICOU" className="h-24 w-auto mb-10" />
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Global Mobility Infrastructure</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-12">
              {OFFICE_LOCATIONS.map((loc, i) => (
                <div key={i}>
                  <h5 className="text-[10px] font-black text-unicou-navy uppercase tracking-widest mb-3">{loc.country} Node</h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-bold italic">{loc.address}</p>
                </div>
              ))}
            </div>
            <div className="md:col-span-1">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Nexus Links</h4>
              <ul className="space-y-4 text-[11px] font-bold text-slate-600 uppercase tracking-widest">
                <li><button onClick={() => navigateTo({ type: 'store' })} className="hover:text-unicou-orange transition-colors">Voucher Shop</button></li>
                <li><button onClick={() => navigateTo({ type: 'lms-dashboard' })} className="hover:text-unicou-orange transition-colors">Learning Hub</button></li>
                <li><button onClick={() => navigateTo({ type: 'about' })} className="hover:text-unicou-orange transition-colors">Our Mission</button></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 flex flex-wrap gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
             {Object.entries(POLICY_CONTENT).map(([id, p]) => (
               <button key={id} onClick={() => navigateTo({ type: 'policy', policyId: id })} className="hover:text-unicou-navy">{p.title}</button>
             ))}
             <p className="ml-auto">© 2024 UNICOU INTERNATIONAL LTD.</p>
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