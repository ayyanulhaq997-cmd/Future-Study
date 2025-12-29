
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
import CheckoutProcess from './components/CheckoutProcess';
import SuccessScreen from './components/SuccessScreen';
import UniversityProfile from './components/UniversityProfile';
import AdminDashboard from './components/AdminDashboard';
import AgentDashboard from './components/AgentDashboard';
import TrainerDashboard from './components/TrainerDashboard';
import PartnerShowcase from './components/PartnerShowcase';
import CookieConsent from './components/CookieConsent';
import CustomerDashboard from './components/CustomerDashboard';
import LMSCoursePlayer from './components/LMSCoursePlayer';
import LMSPracticeTest from './components/LMSPracticeTest';
import QualificationCatalogue from './components/QualificationCatalogue';
import ApplicationHub from './components/ApplicationHub';
import PolicyPage from './components/PolicyPage';
import Resources from './components/Resources';
import Careers from './components/Careers';
import UserGuide from './components/UserGuide';
import { ViewState, User } from './types';
import { api } from './services/apiService';
import { LOGO_SRC } from './constants/assets';

const OFFICE_LOCATIONS = [
  { country: "United Kingdom", address: "26 Chepstow Avenue, Sale Manchester, United Kingdom" },
  { country: "Dubai", address: "24695 Deira, Dubai, UAE" },
  { country: "Pakistan", address: "Plot No.23-17-B-1, Township, Lahore, Pakistan" }
];

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  // View initialized correctly with home state
  const [view, setView] = useState<ViewState>({ type: 'home' });
  const [user, setUser] = useState<User | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  useEffect(() => {
    const active = api.getCurrentUser();
    if (active) setUser(active);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // navigateTo now strictly expects ViewState for enhanced type safety
  const navigateTo = (newView: ViewState) => {
    setView(newView);
    setIsNavbarVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleNavbar = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isInteractive = target.closest('button') || target.closest('a') || target.closest('input') || target.closest('select') || target.closest('textarea');
    if (!isInteractive) {
      setIsNavbarVisible(!isNavbarVisible);
    }
  };

  const wrapperClass = `view-container ${!isNavbarVisible ? 'full-view' : ''}`;

  const renderContent = () => {
    switch (view.type) {
      case 'home':
        return (
          <div className={`animate-in fade-in duration-1000 ${!isNavbarVisible ? 'pt-10' : 'pt-0'}`}>
            <Hero onStart={() => navigateTo({ type: 'store' })} onApplyClick={() => navigateTo({ type: 'join-hub' })} />
            <Features />
            <PartnerShowcase />
            <div id="destination-directory" className="scroll-mt-32">
               <CountryList onNavigateToGuide={(slug) => navigateTo({ type: 'country-guide', slug })} />
            </div>
          </div>
        );
      case 'store':
        return <div className={wrapperClass}><VoucherStore onCheckout={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} onBook={(p) => navigateTo({ type: 'apply', formType: 'student-apply', context: `Booking: ${p}` })} onNavigateToAgent={() => navigateTo({ type: 'agent' })} /></div>;
      case 'join-hub':
        return <div className={wrapperClass}><ApplicationHub onNavigate={navigateTo} /></div>;
      case 'apply':
        return <div className={`max-w-4xl mx-auto ${wrapperClass} px-4`}><ApplyForm type={(view as any).formType} context={(view as any).context} /></div>;
      case 'country-list':
        return <div className={wrapperClass}><CountryList onNavigateToGuide={(slug) => navigateTo({ type: 'country-guide', slug })} /></div>;
      case 'country-guide':
        return <div className={wrapperClass}><CountryGuide slug={(view as any).slug} onViewUniversity={(uSlug) => navigateTo({ type: 'university', slug: uSlug })} onRegister={() => navigateTo({ type: 'join-hub' })} /></div>;
      case 'university':
        return <div className={wrapperClass}><UniversityProfile slug={(view as any).slug} /></div>;
      case 'lms-dashboard':
        return <div className={wrapperClass}>{user ? <CustomerDashboard user={user} onNavigate={navigateTo} initialTab={(view as any).initialTab} /> : <LMSDashboard onNavigate={navigateTo} />}</div>;
      case 'library':
        return (
          <div className={`max-w-7xl mx-auto ${wrapperClass} px-6 animate-in fade-in py-20`}>
             <div className="text-center mb-16">
               <h2 className="text-5xl font-display font-black text-unicou-navy uppercase tracking-tighter mb-4">Digital <span className="text-unicou-orange">Library</span></h2>
               <p className="text-slate-500 font-bold italic">"Authorized access to global academic journals, prep material, and research nodes."</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[1,2,3,4,5,6].map(i => (
                 <div key={i} className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-premium transition-all">
                    <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all">📚</div>
                    <h3 className="font-black text-unicou-navy uppercase text-sm mb-2">Academic Node 0{i}</h3>
                    <p className="text-xs text-slate-400 font-bold mb-8 italic">Encrypted educational resources for {i === 1 ? 'PTE' : 'General'} Mastery.</p>
                    <button onClick={() => navigateTo({ type: 'lms-dashboard' })} className="px-6 py-2.5 bg-unicou-navy text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-unicou-orange transition-colors">View Index</button>
                 </div>
               ))}
             </div>
          </div>
        );
      case 'qualifications':
        return <div className={wrapperClass}><QualificationCatalogue onApply={(qid) => navigateTo({ type: 'apply', formType: 'general', context: `Qualification ID: ${qid}` })} /></div>;
      case 'policy':
        return <div className={wrapperClass}><PolicyPage policyId={(view as any).policyId} /></div>;
      case 'resources':
        return <div className={wrapperClass}><Resources onNavigate={navigateTo} /></div>;
      case 'careers':
        return <div className={wrapperClass}><Careers /></div>;
      case 'guide':
        return <div className={wrapperClass}><UserGuide /></div>;
      case 'about':
        return (
          <div className={`max-w-7xl mx-auto ${wrapperClass} px-6 animate-in fade-in pb-32`}>
             <div className="text-center mb-24">
                <span className="text-[11px] font-black text-unicou-orange uppercase tracking-[0.5em] mb-4 block">Institutional Core</span>
                <h2 className="text-6xl md:text-[7rem] font-display font-black text-unicou-navy mb-8 tracking-tighter leading-none">The UNICOU <span className="text-unicou-orange">Legacy</span></h2>
                <div className="h-2 w-32 bg-unicou-navy mx-auto rounded-full" />
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
               <div className="lg:col-span-8 space-y-16">
                 <section className="bg-white p-12 md:p-16 rounded-3xl border border-slate-100 shadow-premium relative overflow-hidden">
                   <div className="relative z-10 space-y-8">
                     <h2 className="text-4xl font-display font-black uppercase text-unicou-navy border-b-2 border-unicou-orange pb-6 inline-block">Established 2009</h2>
                     <p className="text-xl text-slate-800 font-black leading-relaxed italic border-l-4 border-unicou-orange pl-8">
                       Founded with a passion for global education, UNICOU is a leading international consultancy with deep roots and a growing global footprint.
                     </p>
                     <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-bold italic">
                       <p>Our journey began in 2009 in Pakistan. As of 2023, we expanded our operations to include offices in the United Kingdom and Dubai, enhancing our ability to serve clients with localized expertise in competitive markets.</p>
                       <div className="flex flex-wrap gap-2 pt-4">
                         {["British Council", "ICEF", "AIRC", "LanguageCert", "TOEFL", "Duolingo", "Pearson"].map(tag => (
                           <span key={tag} className="px-4 py-2 bg-slate-50 text-unicou-navy text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-100">{tag} Certified</span>
                         ))}
                       </div>
                     </div>
                   </div>
                 </section>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-unicou-navy p-10 rounded-3xl shadow-premium group transition-all hover:scale-[1.02]">
                       <h3 className="text-2xl font-display font-black text-white uppercase mb-6 flex items-center gap-4">
                         <span className="text-unicou-orange">01</span> Our Vision
                       </h3>
                       <p className="text-slate-300 text-lg font-black italic leading-relaxed">
                         "To become the most trusted gateway for students and institutions seeking global mobility solutions."
                       </p>
                    </div>
                    <div className="bg-unicou-orange p-10 rounded-3xl shadow-premium group transition-all hover:scale-[1.02]">
                       <h3 className="text-2xl font-display font-black text-white uppercase mb-6 flex items-center gap-4">
                         <span className="text-unicou-navy">02</span> Our Mission
                       </h3>
                       <p className="text-white text-lg font-black italic leading-relaxed">
                         "Guided by expertise and personalized support, we streamline study abroad journeys for every client."
                       </p>
                    </div>
                 </div>
               </div>
               <div className="lg:col-span-4 space-y-8 sticky top-36">
                 <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-premium">
                   <h3 className="text-xl font-display font-black mb-8 uppercase text-unicou-navy">Why Partner With Us</h3>
                   <ul className="space-y-4">
                      {["Advisors Certified by British Council", "Direct Institutional Fulfillment", "Ethical Counseling Protocols", "Verified Testing Nodes"].map(p => (
                        <li key={p} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-slate-700">
                          <div className="w-5 h-5 rounded-lg bg-emerald-500 flex items-center justify-center text-white text-[10px]">✓</div>
                          {p}
                        </li>
                      ))}
                   </ul>
                 </div>
                 <button onClick={() => navigateTo({ type: 'join-hub' })} className="w-full py-8 bg-unicou-navy hover:bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-premium transition-all active:scale-95">
                   START YOUR JOURNEY
                 </button>
               </div>
             </div>
          </div>
        );
      case 'login': 
        return <div className={wrapperClass}><Login onLogin={(u) => { 
            setUser(u); 
            if (['Admin', 'Finance'].includes(u.role)) navigateTo({ type: 'admin' });
            else if (u.role === 'Trainer') navigateTo({ type: 'trainer' });
            else navigateTo({ type: 'lms-dashboard' }); 
        }} onNavigateToSignup={() => navigateTo({ type: 'signup' })} /></div>;
      case 'signup':
        return <div className={wrapperClass}><Signup onSuccess={(e) => navigateTo({ type: 'verification-pending', email: e })} onNavigateToLogin={() => navigateTo({ type: 'login' })} /></div>;
      case 'verification-pending':
        return <div className={wrapperClass}><VerificationPending email={(view as any).email} onVerified={() => navigateTo({ type: 'login' })} /></div>;
      case 'checkout':
        return <div className={wrapperClass}><CheckoutProcess productId={(view as any).productId} quantity={(view as any).quantity} onSuccess={(oid) => navigateTo({ type: 'success', orderId: oid })} onCancel={() => navigateTo({ type: 'store' })} /></div>;
      case 'success':
        return <div className={wrapperClass}><SuccessScreen orderId={(view as any).orderId} onClose={() => navigateTo({ type: 'store' })} /></div>;
      case 'admin':
        if (!user || !['Admin', 'Finance'].includes(user.role)) return <div className="view-container text-center pt-40 font-black uppercase text-slate-400">Restricted Access.</div>;
        return <div className={wrapperClass}><AdminDashboard /></div>;
      case 'trainer':
        if (!user || user.role !== 'Trainer') return <div className="view-container text-center pt-40 font-black uppercase text-slate-400">Trainer Access Only.</div>;
        return <div className={wrapperClass}><TrainerDashboard user={user} /></div>;
      case 'agent':
        if (!user || user.role !== 'Agent') return <div className="view-container text-center pt-40 font-black uppercase text-slate-400">Agent Portal Restricted.</div>;
        return <div className={wrapperClass}><AgentDashboard user={user} onBuy={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} /></div>;
      case 'lms-course-player':
        return <LMSCoursePlayer courseId={(view as any).courseId} initialLessonId={(view as any).initialLessonId} onNavigate={navigateTo} />;
      case 'lms-practice-test':
        return <LMSPracticeTest testId={(view as any).testId} onNavigate={navigateTo} />;
      default:
        return <div className="view-container text-center pt-40 font-black uppercase text-slate-400 italic">Endpoint unmapped.</div>;
    }
  };

  const handleLogout = () => { api.logout(); setUser(null); navigateTo({ type: 'home' }); };

  return (
    <div 
      className="min-h-screen text-unicou-navy selection:bg-unicou-orange selection:text-white bg-white relative"
      onClick={toggleNavbar}
    >
      <Navbar 
        view={view as any} 
        user={user} 
        scrolled={scrolled} 
        onNavigate={navigateTo} 
        onLogout={handleLogout} 
        onOpenSearch={() => setSearchOpen(true)}
        isVisible={isNavbarVisible}
      />
      
      {!isNavbarVisible && (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[101] bg-unicou-navy/10 hover:bg-unicou-navy/20 px-4 py-1 rounded-b-xl cursor-pointer animate-bounce mt-1 print:hidden">
           <svg className="w-4 h-4 text-unicou-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
        </div>
      )}

      <main className="relative z-0">
        {renderContent()}
      </main>
      <footer className="bg-slate-50 border-t border-slate-100 py-24 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 pb-16 border-b border-slate-200">
            <div className="md:col-span-1">
               <img src={LOGO_SRC} alt="UNICOU" className="h-10 w-auto mb-8 hover:opacity-80 transition-opacity cursor-pointer" onClick={() => navigateTo({type: 'home'})} />
               <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-loose">Academic Mobility Infrastructure.<br />Established 2009.</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-10">
              {OFFICE_LOCATIONS.map((loc, i) => (
                <div key={i}>
                  <h5 className="text-[11px] font-black text-unicou-navy uppercase tracking-widest mb-4">{loc.country} Terminal</h5>
                  <p className="text-[13px] text-slate-600 leading-relaxed font-bold italic">"{loc.address}"</p>
                </div>
              ))}
            </div>
            <div className="md:col-span-1">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8">Navigation</h4>
              <ul className="space-y-4 text-[12px] font-black text-unicou-navy uppercase tracking-widest">
                <li><button onClick={() => navigateTo({ type: 'store' })} className="hover:text-unicou-orange transition-colors">Voucher Store</button></li>
                <li><button onClick={() => navigateTo({ type: 'join-hub' })} className="hover:text-unicou-orange transition-colors">Apply Node</button></li>
                <li><button onClick={() => navigateTo({ type: 'guide' })} className="hover:text-unicou-orange transition-colors">User Guide</button></li>
                <li><button onClick={() => navigateTo({ type: 'policy', policyId: 'privacy' })} className="hover:text-unicou-orange transition-colors">Privacy Policy</button></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 flex flex-wrap gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
             <button onClick={() => navigateTo({ type: 'policy', policyId: 'modern-slavery' })} className="hover:text-unicou-navy transition-colors">Modern Slavery Policy</button>
             <button onClick={() => navigateTo({ type: 'policy', policyId: 'accessibility' })} className="hover:text-unicou-navy transition-colors">Accessibility</button>
             <button onClick={() => navigateTo({ type: 'policy', policyId: 'cookies' })} className="hover:text-unicou-navy transition-colors">Cookie Strategy</button>
             <button onClick={() => navigateTo({ type: 'policy', policyId: 'privacy' })} className="hover:text-unicou-navy transition-colors">Privacy Policy</button>
             <p className="ml-auto italic">© 2025 UNICOU INTERNATIONAL LTD. REG #06900657</p>
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
