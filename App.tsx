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
import LMSCoursePlayer from './components/LMSCoursePlayer';
import LMSPracticeTest from './components/LMSPracticeTest';
import QualificationCatalogue from './components/QualificationCatalogue';
import AdminDashboard from './components/AdminDashboard';
import PartnerShowcase from './components/PartnerShowcase';
import CookieConsent from './components/CookieConsent';
import { ViewState, User } from './types';
import { api } from './services/apiService';
import { LOGO_SRC } from './constants/assets';

const POLICY_CONTENT: Record<string, { title: string; content: string }> = {
  'modern-slavery': { title: 'Modern Slavery Statement', content: 'UniCou Ltd is committed to preventing modern slavery...' },
  'accessibility': { title: 'Accessibility Statement', content: 'UniCou Ltd is committed to ensuring digital accessibility...' },
  'privacy': { title: 'Privacy Policy', content: 'UniCou Ltd is committed to protecting personal data...' },
  'carbon': { title: 'Carbon Reduction Plan', content: 'UniCou Ltd recognises its responsibility to reduce environmental impact...' },
  'terms': { title: 'Website Terms of Use', content: 'These Website Terms of Use govern access to and use...' },
  'terms-conditions': { title: 'Terms and Conditions', content: 'These Terms and Conditions set forth the legally binding terms...' },
  'cookies': { title: 'Cookie Use Policy', content: 'UniCou Ltd uses cookies and similar technologies...' },
  'whistleblowing': { title: 'Whistleblowing Policy', content: 'UniCou Ltd encourages openness and transparency...' }
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
            <Hero 
              onStart={() => navigateTo({ type: 'store' })} 
              onResellerClick={() => navigateTo({ type: 'apply', formType: 'agent-reg', context: 'Reseller Portal Initialization' })} 
            />
            <Features />
            <PartnerShowcase />
            
            <div id="destination-directory" className="scroll-mt-24">
               <CountryList onNavigateToGuide={(slug) => navigateTo({ type: 'country-guide', slug })} />
            </div>

            <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="glass p-12 rounded-[3rem] border-slate-800">
                  <h2 className="text-4xl font-display font-bold mb-6 tracking-tight">Academic <span className="text-unicou-orange">Excellence</span></h2>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8 italic">
                    UNICOU provides a seamless bridge for students aiming for global horizons. Our automated infrastructure handles the complexity, so you can focus on your future.
                  </p>
                  <button onClick={() => navigateTo({ type: 'apply', formType: 'student-apply', context: 'Free Admission Guidance Request' })} className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl">
                    Get Free Admission Guidance
                  </button>
               </div>
               <div className="glass p-12 rounded-[3rem] border-slate-800 bg-unicou-orange/5">
                  <h2 className="text-4xl font-display font-bold mb-6 tracking-tight">Voucher <span className="text-unicou-orange">Vault</span></h2>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8">
                    Instant procurement for Pearson PTE, IELTS, Oxford ELLT, and TOEFL. Fast fulfillment via secure email node.
                  </p>
                  <button onClick={() => navigateTo({ type: 'store' })} className="px-10 py-4 bg-unicou-orange text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl">
                    Enter Voucher Store
                  </button>
               </div>
            </section>
            
            {/* Subscription Section */}
            <section className="py-24 max-w-5xl mx-auto px-6">
              <div className="glass p-12 md:p-20 rounded-[4rem] border border-primary-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 font-black text-9xl">NEWS</div>
                <div className="relative z-10 text-center">
                  <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">Sync for <span className="text-primary-400">Updates</span></h2>
                  <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto font-medium">Receive real-time push notifications about scholarships, news, and rate changes via Email and WhatsApp.</p>
                  <ApplyForm type="general" context="Sync Hub: Email & WhatsApp Notifications" />
                </div>
              </div>
            </section>
          </div>
        );
      case 'store':
        return (
          <div className="animate-in fade-in duration-700">
            <VoucherStore 
              onCheckout={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} 
              onBook={(p) => navigateTo({ type: 'apply', formType: 'student-apply', context: `Booking: ${p}` })} 
              onNavigateToAgent={() => navigateTo({ type: 'apply', formType: 'agent-reg', context: 'Partner Hub Access' })}
            />
            <div className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-900">
               <ApplyForm type="student-apply" context="Secure Instant Inquiry" />
            </div>
          </div>
        );
      case 'apply':
        return <div className="max-w-4xl mx-auto py-20 px-4"><ApplyForm type={view.formType} context={view.context} /></div>;
      case 'country-list':
        return <div className="pt-8"><CountryList onNavigateToGuide={(slug) => navigateTo({ type: 'country-guide', slug })} /></div>;
      case 'country-guide':
        return <CountryGuide slug={view.slug} onViewUniversity={(uSlug) => navigateTo({ type: 'university', slug: uSlug })} onRegister={() => navigateTo({ type: 'apply', formType: 'student-apply', context: `Registration: ${view.slug}` })} />;
      case 'lms-dashboard':
        return <LMSDashboard onNavigate={navigateTo} />;
      case 'course-catalogue':
        return <CourseCatalogue onCheckout={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} />;
      case 'library':
        return <Resources onNavigate={navigateTo} />;
      case 'careers':
        return <div className="max-w-7xl mx-auto px-6 py-12"><Careers /></div>;
      case 'checkout':
        return (
          <div className="pt-20 min-h-[80vh]">
            <CheckoutProcess 
              productId={view.productId} 
              quantity={view.quantity} 
              onSuccess={(orderId) => navigateTo({ type: 'success', orderId })} 
              onCancel={() => navigateTo({ type: 'store' })} 
            />
          </div>
        );
      case 'success':
        return <SuccessScreen orderId={view.orderId} onClose={() => navigateTo({ type: 'store' })} />;
      case 'university':
        return <UniversityProfile slug={view.slug} />;
      case 'lms-course-player':
        return <LMSCoursePlayer courseId={view.courseId} initialLessonId={view.initialLessonId} onNavigate={navigateTo} />;
      case 'lms-practice-test':
        return <LMSPracticeTest testId={view.testId} onNavigate={navigateTo} />;
      case 'qualifications':
        return <QualificationCatalogue onApply={(qid) => navigateTo({ type: 'apply', formType: 'student-apply', context: `Qualification node: ${qid}` })} />;
      case 'admin':
        return <AdminDashboard />;
      case 'login': 
        return <div className="pt-10"><Login onLogin={(u) => { setUser(u); navigateTo(u.role === 'Admin' ? { type: 'admin' } : { type: 'home' }); }} onNavigateToSignup={() => navigateTo({ type: 'signup' })} /></div>;
      case 'signup':
        return <div className="pt-10"><Signup onSuccess={(email) => navigateTo({ type: 'verification-pending', email })} onNavigateToLogin={() => navigateTo({ type: 'login' })} /></div>;
      case 'verification-pending':
        return <div className="pt-10"><VerificationPending email={view.email} onVerified={() => navigateTo({ type: 'login' })} /></div>;
      case 'about':
        return (
          <div className="max-w-7xl mx-auto py-24 px-6 animate-in fade-in duration-700 text-center">
            <h1 className="text-6xl font-display font-bold mb-8">About <span className="text-unicou-orange">UNICOU</span></h1>
            <div className="glass p-12 rounded-[3rem] border-slate-800 shadow-2xl">
              <p className="text-slate-300 text-xl leading-relaxed font-medium">
                Founded with a passion for global education, we are a leading consultancy with deep roots in Pakistan and a growing presence in the UK and Dubai. Our mission is to simplify international pathways and build bridges between talent and opportunity.
              </p>
            </div>
          </div>
        );
      case 'policy':
        const policy = POLICY_CONTENT[view.policyId];
        return (
          <div className="max-w-4xl mx-auto py-24 px-6 animate-in fade-in duration-500">
             <h1 className="text-5xl font-display font-bold mb-8">{policy?.title}</h1>
             <div className="glass p-12 rounded-[3rem] border-slate-800 text-slate-400 leading-relaxed whitespace-pre-wrap">
                {policy?.content}
             </div>
          </div>
        );
      default:
        return <div className="py-40 text-center">View Node Not Found.</div>;
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    navigateTo({ type: 'home' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden">
      <Navbar 
        view={view} user={user} scrolled={scrolled} 
        onNavigate={navigateTo} 
        onLogout={handleLogout} 
        onOpenSearch={() => setSearchOpen(true)} 
      />
      <main className="pt-[var(--nav-height)] min-h-[calc(100vh-var(--nav-height))] relative z-0">
        {renderContent()}
      </main>

      <footer className="bg-slate-950 border-t border-slate-900 py-24 mt-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 pb-16">
            <div className="md:col-span-1">
               <img src={LOGO_SRC} alt="UNICOU" className="h-24 md:h-32 w-auto object-contain mb-8" />
               <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">Global Academic Mobility Hub <br /> Unified Infrastructure v2.1</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {OFFICE_LOCATIONS.map((loc, i) => (
                <div key={i}>
                  <h5 className="text-[10px] font-black text-unicou-orange uppercase tracking-widest mb-3">{loc.country}</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed max-w-[240px]">{loc.address}</p>
                </div>
              ))}
            </div>
            <div className="md:col-span-1">
              <h4 className="text-[10px] font-black text-slate-600 uppercase mb-8 tracking-widest">Explore</h4>
              <ul className="space-y-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <li><button onClick={() => navigateTo({ type: 'store' })} className="hover:text-unicou-orange transition-colors">Voucher Store</button></li>
                <li><button onClick={() => navigateTo({ type: 'careers' })} className="hover:text-unicou-orange transition-colors">Careers</button></li>
                <li><button onClick={() => navigateTo({ type: 'lms-dashboard' })} className="hover:text-unicou-orange transition-colors">Learning Hub</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-900 pt-16 flex flex-wrap gap-x-8 gap-y-4 text-xs font-medium text-primary-400">
             {Object.entries(POLICY_CONTENT).map(([id, p]) => (
               <button key={id} onClick={() => navigateTo({ type: 'policy', policyId: id })} className="hover:underline">{p.title}</button>
             ))}
          </div>
          <div className="mt-8 pt-8 border-t border-slate-900 flex justify-between items-center text-[10px] font-bold text-slate-600 uppercase tracking-widest">
             <p>© 2024 UNICOU. Authorized Fulfillment Center</p>
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