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
import AdminDashboard from './components/AdminDashboard';
import AgentDashboard from './components/AgentDashboard';
import PartnerShowcase from './components/PartnerShowcase';
import CookieConsent from './components/CookieConsent';
import CustomerDashboard from './components/CustomerDashboard';
import LMSCoursePlayer from './components/LMSCoursePlayer';
import LMSPracticeTest from './components/LMSPracticeTest';
import QualificationCatalogue from './components/QualificationCatalogue';
import ImmigrationGuide from './components/ImmigrationGuide';
import ApplicationHub from './components/ApplicationHub';
import PolicyPage from './components/PolicyPage';
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
          <div className="animate-in fade-in duration-1000 bg-white">
            <Hero onStart={() => navigateTo({ type: 'store' })} onApplyClick={() => navigateTo({ type: 'join-hub' })} />
            <Features />
            <PartnerShowcase />
            <div id="destination-directory" className="scroll-mt-32">
               <CountryList onNavigateToGuide={(slug) => navigateTo({ type: 'country-guide', slug })} />
            </div>
          </div>
        );
      case 'store':
        return <div className="view-container bg-white"><VoucherStore onCheckout={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} onBook={(p) => navigateTo({ type: 'apply', formType: 'student-apply', context: `Booking: ${p}` })} onNavigateToAgent={() => navigateTo({ type: 'agent' })} /></div>;
      case 'join-hub':
        return <div className="view-container bg-white"><ApplicationHub onNavigate={navigateTo} /></div>;
      case 'apply':
        return <div className="max-w-4xl mx-auto view-container px-4 bg-white"><ApplyForm type={view.formType} context={view.context} /></div>;
      case 'country-list':
        return <div className="view-container bg-white"><CountryList onNavigateToGuide={(slug) => navigateTo({ type: 'country-guide', slug })} /></div>;
      case 'country-guide':
        return <div className="view-container bg-white"><CountryGuide slug={view.slug} onViewUniversity={(uSlug) => navigateTo({ type: 'university', slug: uSlug })} onRegister={() => navigateTo({ type: 'join-hub' })} /></div>;
      case 'university':
        return <div className="view-container bg-white"><UniversityProfile slug={view.slug} /></div>;
      case 'lms-dashboard':
        return <div className="view-container bg-white">{user ? <CustomerDashboard user={user} /> : <LMSDashboard onNavigate={navigateTo} />}</div>;
      case 'qualifications':
        return <div className="view-container bg-white"><QualificationCatalogue onApply={(qid) => navigateTo({ type: 'apply', formType: 'general', context: `Qualification ID: ${qid}` })} /></div>;
      case 'policy':
        return <div className="view-container bg-white"><PolicyPage policyId={view.policyId} /></div>;
      case 'about':
        return (
          <div className="max-w-7xl mx-auto view-container px-6 animate-in fade-in bg-white pb-32">
             <div className="text-center mb-24">
                <span className="text-[11px] font-black text-unicou-orange uppercase tracking-[0.5em] mb-4 block">Global Mobility Narrative</span>
                <h1 className="text-6xl md:text-[5.5rem] font-display font-black text-slate-950 mb-6 tracking-tighter leading-none">The <span className="text-unicou-navy">UNICOU</span> Story</h1>
                <div className="h-2 w-24 bg-unicou-orange mx-auto rounded-full" />
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
               <div className="lg:col-span-8 space-y-12">
                 <section className="bg-slate-50 p-12 md:p-16 rounded-[4rem] border border-slate-100 shadow-xl relative overflow-hidden">
                   <div className="relative z-10 space-y-8">
                     <h2 className="text-4xl font-display font-black uppercase text-slate-900 tracking-tight leading-tight border-b-2 border-unicou-orange pb-6 inline-block">About Us</h2>
                     <p className="text-xl text-slate-800 font-bold leading-relaxed italic border-l-8 border-unicou-navy pl-8">
                       Founded with a passion for global education and international opportunity, we are a leading international education and immigration consultancy with deep roots and a growing global footprint.
                     </p>
                     <div className="space-y-6 text-lg text-slate-700 leading-relaxed font-medium">
                       <p>Our journey began in 2009 in Pakistan, where we first opened our doors to support ambitious students and professionals in navigating the complexities of studying, living, and working abroad. Over the years, we have built a reputation rooted in transparency, integrity, and long-term success.</p>
                       <p>As of 2023, we expanded our operations to include offices in the United Kingdom and Dubai, enhancing our ability to serve clients with localized expertise in two of the world’s most competitive education and migration markets.</p>
                       <p>Our founder’s extensive professional training—including certifications from <strong>British Council UK agent training</strong>, <strong>ICEF Trained Agent Counsellor</strong>, <strong>AIRC enrollment management</strong> for U.S. education, and regional credentials such as <strong>Ireland Certified Counsellor</strong>—ensures that our guidance is both expert and trustworthy.</p>
                       <p>We are proud to be linked with globally recognized testing and recruitment partners including <strong>LanguageCert</strong>, <strong>Skills for English</strong>, <strong>TOEFL</strong>, <strong>Oxford ELLT</strong>, and <strong>Duolingo</strong>, and to operate as <strong>UKVI and Pearson approved test centers</strong>, reinforcing our leadership in secure English language testing and preparation.</p>
                     </div>
                   </div>
                 </section>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-unicou-navy p-12 rounded-[3.5rem] shadow-2xl group">
                       <h3 className="text-2xl font-display font-black text-white uppercase mb-6 flex items-center gap-3">
                         <span className="text-unicou-orange">01</span> Vision
                       </h3>
                       <p className="text-slate-200 text-lg font-bold italic leading-relaxed">
                         "To become the most trusted gateway for students, professionals, and institutions seeking global education and mobility solutions. We aspire to simplify international pathways, empower every client with informed choices, and build bridges between talent and opportunity across continents."
                       </p>
                    </div>
                    <div className="bg-unicou-orange p-12 rounded-[3.5rem] shadow-2xl group">
                       <h3 className="text-2xl font-display font-black text-white uppercase mb-6 flex items-center gap-3">
                         <span className="text-unicou-navy">02</span> Mission
                       </h3>
                       <p className="text-white text-lg font-bold italic leading-relaxed">
                         "Guided by ethics, expertise, and personalized support, our mission is to streamline study abroad journeys, immigration pathways, and professional placements. We are dedicated to helping individuals realize their aspirations with confidence while fostering strong partnerships with educational institutions and global industry networks."
                       </p>
                    </div>
                 </div>

                 <section className="space-y-8 pt-12">
                   <h2 className="text-4xl font-display font-black uppercase text-slate-900 tracking-tight">What We <span className="text-unicou-orange">Do</span></h2>
                   <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                     {[
                       { title: "Study Abroad Guidance", text: "Comprehensive guidance for destinations including the United Kingdom, United States, Canada, Australia, New Zealand, Ireland, Cyprus, Germany, Italy, Sweden, Finland, wider Europe, Dubai (UAE), Malaysia, and Turkey. From tailored university counseling to admissions and visa support, we manage every step with meticulous care." },
                       { title: "Immigration Services", text: "Supporting skilled individuals, entrepreneurs, and remote professionals seeking relocation or new beginnings overseas. Whether it’s skilled migration, business immigration, citizenship by investment, or digital nomad visas, we offer strategic advice aligned with your long-term goals." },
                       { title: "Exam Solutions & E-Learning", text: "Providing official vouchers and preparation tools for high-demand tests like IELTS, PTE, TOEFL iBT, Skills for English, LanguageCert, Duolingo English Test, Oxford ELLT, GRE, SAT, and GMAT. Our e-learning resources and library help candidates enhance their skills and confidence." }
                     ].map((item, idx) => (
                       <div key={idx} className="bg-white p-10 rounded-[3rem] border border-slate-100 hover:border-unicou-navy/20 transition-all shadow-lg group">
                         <h4 className="text-xl font-black text-unicou-navy uppercase mb-4 tracking-tight group-hover:text-unicou-orange transition-colors">{item.title}</h4>
                         <p className="text-slate-600 font-bold italic leading-relaxed">"{item.text}"</p>
                       </div>
                     ))}
                   </div>
                 </section>

                 <section className="bg-slate-900 p-12 md:p-16 rounded-[4rem] shadow-3xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 font-display font-black text-[12rem] pointer-events-none">2025</div>
                    <div className="relative z-10">
                       <h2 className="text-4xl font-display font-black uppercase tracking-tight mb-8">Looking <span className="text-unicou-orange">Ahead</span></h2>
                       <p className="text-xl font-bold italic leading-relaxed text-slate-300 mb-10">
                         "Building on our strong legacy in Pakistan, the UK, and Dubai, we are actively planning expansion into the Middle East, India, China, Nepal, Bangladesh, Nigeria and Ghana."
                       </p>
                       <div className="flex flex-wrap gap-4">
                          {["Middle East", "India", "China", "Nepal", "Bangladesh", "Nigeria", "Ghana"].map(nation => (
                            <span key={nation} className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest">{nation} Node</span>
                          ))}
                       </div>
                    </div>
                 </section>
               </div>

               <div className="lg:col-span-4 space-y-8 sticky top-32">
                 <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-xl">
                   <h3 className="text-xl font-black mb-8 uppercase tracking-tighter text-slate-900 border-b-4 border-unicou-orange pb-4">Why Work With Us</h3>
                   <p className="text-slate-600 font-bold italic leading-relaxed mb-6">"Choosing us means choosing experience—more than a decade of trusted service, a global perspective, and expert guidance that speaks both to your personal aspirations and to international standards."</p>
                   <ul className="space-y-4">
                      {["Certified Advisors", "Global Network", "Ethical Counseling", "Verified Testing Nodes"].map(p => (
                        <li key={p} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-unicou-navy">
                          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[9px]">✓</div>
                          {p}
                        </li>
                      ))}
                   </ul>
                 </div>

                 <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
                    <h3 className="text-xl font-black mb-6 uppercase tracking-tighter text-slate-900">Corporate & Institutional</h3>
                    <div className="space-y-8">
                       <div className="space-y-3">
                          <h4 className="text-[10px] font-black text-unicou-orange uppercase tracking-widest">Sponsor Solutions</h4>
                          <p className="text-xs text-slate-500 font-bold italic">Matching international talent with strategic opportunities and navigating global compliance.</p>
                       </div>
                       <div className="space-y-3 pt-6 border-t border-slate-100">
                          <h4 className="text-[10px] font-black text-unicou-orange uppercase tracking-widest">Institution Partnership</h4>
                          <p className="text-xs text-slate-500 font-bold italic">Collaborating with universities and colleges to support recruitment and brand visibility.</p>
                       </div>
                    </div>
                 </div>

                 <button onClick={() => navigateTo({ type: 'join-hub' })} className="w-full py-8 bg-unicou-navy hover:bg-slate-950 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-2xl transition-all active:scale-95 group">
                   INITIALIZE CONNECTION
                   <svg className="w-6 h-6 inline-block ml-3 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                 </button>
               </div>
             </div>
          </div>
        );
      case 'login': 
        return <div className="view-container bg-white"><Login onLogin={(u) => { setUser(u); navigateTo(['Admin', 'Finance'].includes(u.role) ? { type: 'admin' } : { type: 'lms-dashboard' }); }} onNavigateToSignup={() => navigateTo({ type: 'signup' })} /></div>;
      case 'signup':
        return <div className="view-container bg-white"><Signup onSuccess={(e) => navigateTo({ type: 'verification-pending', email: e })} onNavigateToLogin={() => navigateTo({ type: 'login' })} /></div>;
      case 'verification-pending':
        return <div className="view-container bg-white"><VerificationPending email={view.email} onVerified={() => navigateTo({ type: 'login' })} /></div>;
      case 'checkout':
        return <div className="view-container bg-white"><CheckoutProcess productId={view.productId} quantity={view.quantity} onSuccess={(oid) => navigateTo({ type: 'success', orderId: oid })} onCancel={() => navigateTo({ type: 'store' })} /></div>;
      case 'success':
        return <div className="view-container bg-white"><SuccessScreen orderId={view.orderId} onClose={() => navigateTo({ type: 'store' })} /></div>;
      case 'admin':
        if (!user || !['Admin', 'Finance'].includes(user.role)) return <div className="view-container text-center pt-40 font-black uppercase text-slate-900 tracking-widest bg-white">Identity Verification Required.</div>;
        return <div className="view-container bg-white"><AdminDashboard /></div>;
      case 'agent':
        if (!user || user.role !== 'Agent') return <div className="view-container text-center pt-40 font-black uppercase text-slate-900 tracking-widest bg-white">Partner Portal Access Restricted.</div>;
        return <div className="view-container bg-white"><AgentDashboard user={user} onBuy={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} /></div>;
      case 'resources':
        return <div className="view-container bg-white"><Resources onNavigate={navigateTo} /></div>;
      case 'careers':
        return <div className="view-container bg-white"><Careers /></div>;
      default:
        return <div className="view-container text-center pt-40 font-black uppercase bg-white">Identity Node Unmapped.</div>;
    }
  };

  const handleLogout = () => { api.logout(); setUser(null); navigateTo({ type: 'home' }); };

  return (
    <div className="min-h-screen bg-white text-slate-950 selection:bg-unicou-orange selection:text-white font-sans">
      <Navbar view={view} user={user} scrolled={scrolled} onNavigate={navigateTo} onLogout={handleLogout} onOpenSearch={() => setSearchOpen(true)} />
      <main className="relative z-0">
        {renderContent()}
      </main>
      <footer className="bg-slate-50 border-t border-slate-100 py-32 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 pb-20 border-b border-slate-200">
            <div className="md:col-span-1">
               <img src={LOGO_SRC} alt="UNICOU" className="h-12 w-auto mb-10" />
               <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] leading-loose">Global Mobility Infrastructure.<br />Established 2009.</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-12">
              {OFFICE_LOCATIONS.map((loc, i) => (
                <div key={i}>
                  <h5 className="text-[11px] font-black text-unicou-navy uppercase tracking-widest mb-4">{loc.country} Terminal</h5>
                  <p className="text-[12px] text-slate-800 leading-relaxed font-bold italic">{loc.address}</p>
                </div>
              ))}
            </div>
            <div className="md:col-span-1">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8">Navigation Map</h4>
              <ul className="space-y-4 text-[12px] font-black text-slate-900 uppercase tracking-widest">
                <li><button onClick={() => navigateTo({ type: 'store' })} className="hover:text-unicou-orange transition-colors">Voucher Store</button></li>
                <li><button onClick={() => navigateTo({ type: 'join-hub' })} className="hover:text-unicou-orange transition-colors">Apply Node</button></li>
                <li><button onClick={() => navigateTo({ type: 'about' })} className="hover:text-unicou-orange transition-colors">About UNICOU</button></li>
                <li><button onClick={() => navigateTo({ type: 'policy', policyId: 'whistleblowing' })} className="hover:text-unicou-orange transition-colors">Whistleblowing</button></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 flex flex-wrap gap-10 text-[10px] font-black uppercase tracking-widest text-slate-400">
             <button onClick={() => navigateTo({ type: 'policy', policyId: 'modern-slavery' })} className="hover:text-unicou-navy transition-colors">Modern Slavery Policy</button>
             <button onClick={() => navigateTo({ type: 'policy', policyId: 'accessibility' })} className="hover:text-unicou-navy transition-colors">Accessibility</button>
             <button onClick={() => navigateTo({ type: 'policy', policyId: 'cookies' })} className="hover:text-unicou-navy transition-colors">Cookie Strategy</button>
             <button onClick={() => navigateTo({ type: 'policy', policyId: 'privacy' })} className="hover:text-unicou-navy transition-colors">Privacy Policy</button>
             <p className="ml-auto text-slate-300">© 2025 UNICOU INTERNATIONAL LTD. REG #06900657</p>
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