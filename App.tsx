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
          <div className="animate-in fade-in duration-1000">
            <Hero onStart={() => navigateTo({ type: 'store' })} onApplyClick={() => navigateTo({ type: 'join-hub' })} />
            <Features />
            <PartnerShowcase />
            <div id="destination-directory" className="scroll-mt-32">
               <CountryList onNavigateToGuide={(slug) => navigateTo({ type: 'country-guide', slug })} />
            </div>
          </div>
        );
      case 'store':
        return <div className="view-container"><VoucherStore onCheckout={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} onBook={(p) => navigateTo({ type: 'apply', formType: 'student-apply', context: `Booking: ${p}` })} onNavigateToAgent={() => navigateTo({ type: 'agent' })} /></div>;
      case 'join-hub':
        return <div className="view-container"><ApplicationHub onNavigate={navigateTo} /></div>;
      case 'apply':
        return <div className="max-w-4xl mx-auto view-container px-4"><ApplyForm type={view.formType} context={view.context} /></div>;
      case 'country-list':
        return <div className="view-container"><CountryList onNavigateToGuide={(slug) => navigateTo({ type: 'country-guide', slug })} /></div>;
      case 'country-guide':
        return <div className="view-container"><CountryGuide slug={view.slug} onViewUniversity={(uSlug) => navigateTo({ type: 'university', slug: uSlug })} onRegister={() => navigateTo({ type: 'join-hub' })} /></div>;
      case 'university':
        return <div className="view-container"><UniversityProfile slug={view.slug} /></div>;
      case 'lms-dashboard':
        return <div className="view-container">{user ? <CustomerDashboard user={user} /> : <LMSDashboard onNavigate={navigateTo} />}</div>;
      case 'qualifications':
        return <div className="view-container"><QualificationCatalogue onApply={(qid) => navigateTo({ type: 'apply', formType: 'general', context: `Qualification ID: ${qid}` })} /></div>;
      case 'policy':
        return <div className="view-container"><PolicyPage policyId={view.policyId} /></div>;
      case 'about':
        return (
          <div className="max-w-7xl mx-auto view-container px-6 animate-in fade-in pb-32">
             <div className="text-center mb-24">
                <span className="text-[11px] font-black text-unicou-orange uppercase tracking-[0.5em] mb-4 block">Institutional Core</span>
                <h1 className="text-7xl md:text-[8rem] font-display font-black text-slate-950 mb-8 tracking-tighter leading-none">The <span className="text-unicou-navy">UNICOU</span> Legacy</h1>
                <div className="h-3 w-32 bg-gradient-to-r from-unicou-navy to-unicou-orange mx-auto rounded-full shadow-vibrant" />
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
               <div className="lg:col-span-8 space-y-16">
                 <section className="bg-white/80 backdrop-blur-2xl p-12 md:p-20 rounded-[5rem] border border-slate-100 shadow-nexus relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-3 h-full bg-gradient-to-b from-unicou-navy via-unicou-orange to-unicou-gold group-hover:w-5 transition-all duration-700" />
                   <div className="relative z-10 space-y-10">
                     <h2 className="text-5xl font-display font-black uppercase text-slate-950 tracking-tight leading-none border-b-4 border-unicou-orange pb-8 inline-block">Established 2009</h2>
                     <p className="text-2xl text-slate-900 font-bold leading-relaxed italic border-l-8 border-unicou-navy/20 pl-10">
                       Founded with a passion for global education and international opportunity, we are a leading international education and immigration consultancy with deep roots and a growing global footprint.
                     </p>
                     <div className="space-y-8 text-xl text-slate-700 leading-relaxed font-semibold italic">
                       <p>Our journey began in 2009 in Pakistan, where we first opened our doors to support ambitious students and professionals in navigating the complexities of studying, living, and working abroad. Over the years, we have built a reputation rooted in transparency, integrity, and long-term success.</p>
                       <p className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-inner">
                         As of 2023, we expanded our operations to include offices in the United Kingdom and Dubai, enhancing our ability to serve clients with localized expertise in two of the world’s most competitive education and migration markets.
                       </p>
                       <p>Our founder’s extensive professional training—including certifications from <strong>British Council UK agent training</strong>, <strong>ICEF Trained Agent Counsellor</strong>, <strong>AIRC enrollment management</strong> for U.S. education, and regional credentials such as <strong>Ireland Certified Counsellor</strong>—ensures that our guidance is both expert and trustworthy.</p>
                       <div className="flex flex-wrap gap-4 pt-4">
                         {["British Council", "ICEF", "AIRC", "LanguageCert", "TOEFL", "Duolingo", "Pearson"].map(tag => (
                           <span key={tag} className="px-6 py-2 bg-unicou-navy text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">{tag} Verified</span>
                         ))}
                       </div>
                     </div>
                   </div>
                 </section>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="bg-unicou-navy p-14 rounded-[4rem] shadow-Nexus hover:shadow-nexus transition-all group overflow-hidden relative">
                       <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                       <h3 className="text-3xl font-display font-black text-white uppercase mb-8 flex items-center gap-4">
                         <span className="text-unicou-orange">01</span> Vision Node
                       </h3>
                       <p className="text-slate-200 text-xl font-bold italic leading-relaxed">
                         "To become the most trusted gateway for students, professionals, and institutions seeking global education and mobility solutions. We aspire to simplify international pathways and build bridges across continents."
                       </p>
                    </div>
                    <div className="bg-unicou-orange p-14 rounded-[4rem] shadow-Nexus hover:shadow-vibrant transition-all group overflow-hidden relative">
                       <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                       <h3 className="text-3xl font-display font-black text-white uppercase mb-8 flex items-center gap-4">
                         <span className="text-unicou-navy">02</span> Mission Node
                       </h3>
                       <p className="text-white text-xl font-bold italic leading-relaxed">
                         "Guided by ethics, expertise, and personalized support, our mission is to streamline study abroad journeys, immigration pathways, and professional placements for every client we serve."
                       </p>
                    </div>
                 </div>

                 <section className="space-y-12 pt-16">
                   <div className="flex items-center gap-6">
                      <h2 className="text-5xl font-display font-black uppercase text-slate-950 tracking-tight">Our <span className="text-unicou-orange italic">Operational</span> Nodes</h2>
                      <div className="flex-grow h-px bg-slate-200" />
                   </div>
                   <div className="grid grid-cols-1 gap-8">
                     {[
                       { title: "Study Abroad Intelligence", color: "border-unicou-navy", text: "Comprehensive guidance for 15+ destinations including the United Kingdom, USA, Canada, Australia, Europe, Dubai, Malaysia, and Turkey. Tailored university counseling from admission to visa." },
                       { title: "Migration Engineering", color: "border-emerald-500", text: "Supporting skilled individuals, entrepreneurs, and digital nomads seeking relocation. Expertise in skilled migration, business immigration, and citizenship by investment routes." },
                       { title: "Testing & E-Learning", color: "border-unicou-orange", text: "Global provider for IELTS, PTE, TOEFL, Duolingo, and ELLT official vouchers. Comprehensive LMS library and mock test terminals for student mastery." }
                     ].map((item, idx) => (
                       <div key={idx} className={`bg-white p-12 rounded-[4rem] border-2 ${item.color} hover:bg-slate-50 transition-all shadow-xl group relative overflow-hidden`}>
                         <div className="absolute top-0 right-0 p-12 opacity-5 font-display font-black text-8xl pointer-events-none">{idx+1}</div>
                         <h4 className="text-2xl font-black text-slate-950 uppercase mb-6 tracking-tight">{item.title}</h4>
                         <p className="text-slate-700 text-lg font-bold italic leading-relaxed relative z-10">"{item.text}"</p>
                       </div>
                     ))}
                   </div>
                 </section>

                 <section className="bg-slate-950 p-16 md:p-24 rounded-[5.5rem] shadow-vibrant text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-16 opacity-10 font-display font-black text-[15rem] pointer-events-none group-hover:scale-110 transition-transform duration-1000">2025</div>
                    <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-unicou-navy via-unicou-orange to-unicou-gold" />
                    <div className="relative z-10">
                       <h2 className="text-5xl font-display font-black uppercase tracking-tight mb-10">Next <span className="text-unicou-orange italic">Phase</span> Expansion</h2>
                       <p className="text-2xl font-bold italic leading-relaxed text-slate-300 mb-14 max-w-3xl">
                         "Building on our strong legacy in Pakistan, the UK, and Dubai, we are actively planning expansion into the Middle East, India, China, Nepal, Bangladesh, Nigeria and Ghana."
                       </p>
                       <div className="flex flex-wrap gap-4">
                          {["Middle East", "India", "China", "Nepal", "Bangladesh", "Nigeria", "Ghana"].map(nation => (
                            <span key={nation} className="px-8 py-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 text-[11px] font-black uppercase tracking-[0.25em] hover:bg-unicou-orange transition-all cursor-default">{nation} HUB</span>
                          ))}
                       </div>
                    </div>
                 </section>
               </div>

               <div className="lg:col-span-4 space-y-10 sticky top-36">
                 <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-nexus relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-full h-3 bg-unicou-orange" />
                   <h3 className="text-2xl font-display font-black mb-10 uppercase tracking-tighter text-slate-950">Why Partner <br />With Us</h3>
                   <p className="text-slate-700 text-lg font-bold italic leading-relaxed mb-10">"Choosing UNICOU means choosing 15+ years of ethical service, global perspective, and certified expertise that meets international standards."</p>
                   <ul className="space-y-6">
                      {["Advisors Certified by British Council", "Direct Institutional Fulfillment", "Ethical Counseling Protocols", "Verified Testing Nodes"].map(p => (
                        <li key={p} className="flex items-center gap-5 text-[12px] font-black uppercase tracking-widest text-unicou-navy">
                          <div className="w-6 h-6 rounded-xl bg-emerald-500 flex items-center justify-center text-white text-[10px] shadow-lg shadow-emerald-500/20">✓</div>
                          {p}
                        </li>
                      ))}
                   </ul>
                 </div>

                 <div className="bg-slate-900 p-12 rounded-[4rem] border border-white/5 shadow-Nexus relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-3 bg-unicou-navy" />
                    <h3 className="text-2xl font-display font-black mb-8 uppercase tracking-tighter text-white">Institutional Connect</h3>
                    <div className="space-y-10">
                       <div className="space-y-4 group/item">
                          <h4 className="text-[12px] font-black text-unicou-orange uppercase tracking-[0.3em] group-hover/item:translate-x-2 transition-transform">Sponsor Solutions</h4>
                          <p className="text-sm text-slate-400 font-bold italic leading-relaxed">Matching international talent with strategic opportunities and navigating compliance nodes.</p>
                       </div>
                       <div className="space-y-4 pt-10 border-t border-white/5 group/item">
                          <h4 className="text-[12px] font-black text-unicou-orange uppercase tracking-[0.3em] group-hover/item:translate-x-2 transition-transform">Institution Sync</h4>
                          <p className="text-sm text-slate-400 font-bold italic leading-relaxed">Collaborating with colleges to support recruitment, visibility, and program success.</p>
                       </div>
                    </div>
                 </div>

                 <button onClick={() => navigateTo({ type: 'join-hub' })} className="w-full py-10 bg-unicou-navy hover:bg-slate-950 text-white rounded-[3rem] font-black text-sm uppercase tracking-[0.3em] shadow-nexus transition-all active:scale-95 group overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                   INITIALIZE CONNECTION
                   <svg className="w-6 h-6 inline-block ml-4 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                 </button>
               </div>
             </div>
          </div>
        );
      case 'login': 
        return <div className="view-container"><Login onLogin={(u) => { setUser(u); navigateTo(['Admin', 'Finance'].includes(u.role) ? { type: 'admin' } : { type: 'lms-dashboard' }); }} onNavigateToSignup={() => navigateTo({ type: 'signup' })} /></div>;
      case 'signup':
        return <div className="view-container"><Signup onSuccess={(e) => navigateTo({ type: 'verification-pending', email: e })} onNavigateToLogin={() => navigateTo({ type: 'login' })} /></div>;
      case 'verification-pending':
        return <div className="view-container"><VerificationPending email={view.email} onVerified={() => navigateTo({ type: 'login' })} /></div>;
      case 'checkout':
        return <div className="view-container"><CheckoutProcess productId={view.productId} quantity={view.quantity} onSuccess={(oid) => navigateTo({ type: 'success', orderId: oid })} onCancel={() => navigateTo({ type: 'store' })} /></div>;
      case 'success':
        return <div className="view-container"><SuccessScreen orderId={view.orderId} onClose={() => navigateTo({ type: 'store' })} /></div>;
      case 'admin':
        if (!user || !['Admin', 'Finance'].includes(user.role)) return <div className="view-container text-center pt-40 font-black uppercase text-slate-900 tracking-widest">Identity Verification Required.</div>;
        return <div className="view-container"><AdminDashboard /></div>;
      case 'agent':
        if (!user || user.role !== 'Agent') return <div className="view-container text-center pt-40 font-black uppercase text-slate-900 tracking-widest">Partner Portal Access Restricted.</div>;
        return <div className="view-container"><AgentDashboard user={user} onBuy={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} /></div>;
      case 'resources':
        return <div className="view-container"><Resources onNavigate={navigateTo} /></div>;
      case 'careers':
        return <div className="view-container"><Careers /></div>;
      default:
        return <div className="view-container text-center pt-40 font-black uppercase">Identity Node Unmapped.</div>;
    }
  };

  const handleLogout = () => { api.logout(); setUser(null); navigateTo({ type: 'home' }); };

  return (
    <div className="min-h-screen text-slate-950 selection:bg-unicou-orange selection:text-white font-sans">
      <Navbar view={view} user={user} scrolled={scrolled} onNavigate={navigateTo} onLogout={handleLogout} onOpenSearch={() => setSearchOpen(true)} />
      <main className="relative z-0">
        {renderContent()}
      </main>
      <footer className="bg-white border-t border-slate-100 py-32 mt-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-unicou-navy/5 blur-[100px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 pb-24 border-b border-slate-200">
            <div className="md:col-span-1">
               <img src={LOGO_SRC} alt="UNICOU" className="h-14 w-auto mb-12 hover:scale-105 transition-transform cursor-pointer" onClick={() => navigateTo({type: 'home'})} />
               <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.3em] leading-loose">Global Mobility Infrastructure.<br />Established 2009.</p>
               <div className="flex gap-4 mt-10">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 hover:bg-unicou-orange hover:text-white transition-all cursor-pointer flex items-center justify-center text-slate-400">
                     <div className="w-4 h-4 bg-current rounded-sm" />
                   </div>
                 ))}
               </div>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-16">
              {OFFICE_LOCATIONS.map((loc, i) => (
                <div key={i} className="group cursor-default">
                  <h5 className="text-[12px] font-black text-unicou-navy uppercase tracking-widest mb-6 group-hover:text-unicou-orange transition-colors">{loc.country} Terminal</h5>
                  <p className="text-[14px] text-slate-700 leading-relaxed font-bold italic group-hover:translate-x-2 transition-transform">"{loc.address}"</p>
                </div>
              ))}
            </div>
            <div className="md:col-span-1">
              <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-10">Navigation Map</h4>
              <ul className="space-y-6 text-[13px] font-black text-slate-950 uppercase tracking-widest">
                <li><button onClick={() => navigateTo({ type: 'store' })} className="hover:text-unicou-orange hover:translate-x-3 transition-all flex items-center gap-3">Voucher Store <div className="w-1.5 h-1.5 rounded-full bg-unicou-orange" /></button></li>
                <li><button onClick={() => navigateTo({ type: 'join-hub' })} className="hover:text-unicou-orange hover:translate-x-3 transition-all flex items-center gap-3">Apply Node <div className="w-1.5 h-1.5 rounded-full bg-unicou-orange" /></button></li>
                <li><button onClick={() => navigateTo({ type: 'about' })} className="hover:text-unicou-orange hover:translate-x-3 transition-all flex items-center gap-3">About UNICOU <div className="w-1.5 h-1.5 rounded-full bg-unicou-orange" /></button></li>
                <li><button onClick={() => navigateTo({ type: 'policy', policyId: 'whistleblowing' })} className="hover:text-unicou-orange hover:translate-x-3 transition-all flex items-center gap-3">Whistleblowing <div className="w-1.5 h-1.5 rounded-full bg-unicou-orange" /></button></li>
              </ul>
            </div>
          </div>
          <div className="pt-16 flex flex-wrap gap-12 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">
             <button onClick={() => navigateTo({ type: 'policy', policyId: 'modern-slavery' })} className="hover:text-unicou-navy transition-colors">Modern Slavery Policy</button>
             <button onClick={() => navigateTo({ type: 'policy', policyId: 'accessibility' })} className="hover:text-unicou-navy transition-colors">Accessibility</button>
             <button onClick={() => navigateTo({ type: 'policy', policyId: 'cookies' })} className="hover:text-unicou-navy transition-colors">Cookie Strategy</button>
             <button onClick={() => navigateTo({ type: 'policy', policyId: 'privacy' })} className="hover:text-unicou-navy transition-colors">Privacy Policy</button>
             <p className="ml-auto text-slate-300 italic">© 2025 UNICOU INTERNATIONAL LTD. REG #06900657</p>
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