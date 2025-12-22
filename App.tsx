
import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import VoucherStore from './components/VoucherStore';
import Navbar from './components/Navbar';
import ApplyForm from './components/ApplyForm';
import SearchOverlay from './components/SearchOverlay';
import CountryGuide from './components/CountryGuide';
import CountryList from './components/CountryList';
import ImmigrationGuide from './components/ImmigrationGuide';
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
import QualificationLeadForm from './components/QualificationLeadForm';
import AdminDashboard from './components/AdminDashboard';
import AgentDashboard from './components/AgentDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import { ViewState, User } from './types';
import { api } from './services/apiService';

const POLICY_CONTENT: Record<string, { title: string; content: string }> = {
  'modern-slavery': {
    title: 'Modern Slavery Statement',
    content: `UNICOU is committed to ensuring that there is no modern slavery or human trafficking in our supply chains or in any part of our business. We operate a zero-tolerance policy towards modern slavery and are committed to acting ethically and with integrity in all our business relationships.\n\nOur Commitment:\n1. We verify all academic and recruitment partners to ensure ethical standards.\n2. We provide transparency in our student recruitment processes.\n3. We maintain open channels for whistleblowing regarding any unethical practices in global education.`
  },
  'accessibility': {
    title: 'Accessibility Statement',
    content: `UNICOU is committed to making its website accessible, in accordance with the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018. We want as many people as possible to be able to use this website.\n\nAdaptability Features:\n- High contrast visual modes for all learning materials.\n- Screen reader compatibility for our LMS dashboard.\n- Keyboard-only navigation support for the Voucher Vault.\n- Regular audits to meet WCAG 2.1 AA standards.`
  },
  'privacy': {
    title: 'Privacy Policy',
    content: `Your privacy is critical to the UNICOU ecosystem. We only collect data essential for your academic mobility and visa processing.\n\nData Collection:\n- Academic records for university placement.\n- Contact information for voucher delivery.\n- Payment metadata for secure transaction verification.\n\nWe do not sell your data to third-party marketing nodes. All data is encrypted using AES-256 standards.`
  },
  'carbon': {
    title: 'Carbon Reduction Plan',
    content: `UNICOU is committed to achieving Net Zero emissions by 2035. As a digital-first platform, we actively reduce the carbon footprint of the international education sector.\n\nKey Initiatives:\n- Digitization of all paper-based entrance exams.\n- Remote-first counseling sessions reducing international travel.\n- Use of green-energy data centers for our global nexus nodes.\n- Supporting students in finding sustainable living options abroad.`
  },
  'terms': {
    title: 'Website Terms of Use',
    content: `By accessing the UNICOU portal, you agree to follow our protocols for academic integrity and secure procurement.\n\nRules of Engagement:\n1. Vouchers procured are for individual or authorized agent use only.\n2. Fraudulent attempts to access the Exam Vault will result in immediate identity termination.\n3. Content within the UNICOU Academy is protected by international copyright laws.\n4. Users must maintain secure credentials for their student or agent terminal.`
  },
  'cookies': {
    title: 'Cookie Use Policy',
    content: `We use cookies to maintain your secure session and optimize your navigation through the academic nexus.\n\nTypes of Cookies:\n- Functional: Essential for the login and checkout nodes.\n- Analytical: To understand how students navigate country guides.\n- Performance: To ensure high-speed delivery of mock test assets.`
  },
  'whistleblowing': {
    title: 'Whistleblowing Policy',
    content: `UNICOU encourages students, partners, and staff to report any concerns about malpractice, illegal acts, or omissions within the global mobility network.\n\nOur Guarantee:\n- All reports are handled with absolute confidentiality.\n- Protection against any form of retaliation.\n- Independent investigation of all legitimate concerns regarding academic fraud or recruitment ethics.`
  }
};

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState<ViewState>({ type: 'store' });
  const [user, setUser] = useState<User | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cookies, setCookies] = useState(localStorage.getItem('unicou_consent') === 'true');

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
      case 'store':
        return (
          <>
            <Hero onStart={() => document.getElementById('vault')?.scrollIntoView({ behavior: 'smooth' })} onResellerClick={() => navigateTo({ type: 'apply', formType: 'membership', context: 'Become A Partner' })} />
            <div id="vault" className="py-20">
              <VoucherStore 
                onCheckout={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} 
                onBook={(p) => navigateTo({ type: 'apply', formType: 'study-abroad', context: `Booking: ${p}` })} 
              />
            </div>
            <Features />
            <section className="py-24 max-w-4xl mx-auto px-4"><ApplyForm type="general" context="Instant Connection Node" /></section>
          </>
        );
      case 'apply':
        return <div className="max-w-4xl mx-auto py-20 px-4"><ApplyForm type={view.formType} context={view.context} /></div>;
      case 'country-list':
        return <div className="pt-8"><CountryList onNavigateToGuide={(slug) => navigateTo({ type: 'country-guide', slug })} /></div>;
      case 'country-guide':
        return (
          <div className="animate-in fade-in">
            <CountryGuide slug={view.slug} onViewUniversity={(uSlug) => navigateTo({ type: 'university', slug: uSlug })} />
            <div className="max-w-4xl mx-auto py-20 px-4"><ApplyForm type="study-abroad" context={`Interest: Study in ${view.slug.toUpperCase()}`} /></div>
          </div>
        );
      case 'immigration-guide':
        return (
          <div className="animate-in fade-in">
            <ImmigrationGuide 
              slug={view.slug} 
              onConsult={() => navigateTo({ type: 'apply', formType: 'immigration', context: `Consult: ${view.slug.replace('-', ' ').toUpperCase()}` })}
            />
            <div className="max-w-4xl mx-auto py-20 px-4"><ApplyForm type="immigration" context={`Eligibility Check: ${view.slug}`} /></div>
          </div>
        );
      case 'lms-dashboard':
        return <LMSDashboard onNavigate={navigateTo} />;
      case 'course-catalogue':
        return <CourseCatalogue onCheckout={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} />;
      case 'resources':
        return <Resources />;
      case 'library':
        return <Resources />; 
      case 'careers':
        return <Careers />;
      case 'checkout':
        return (
          <div className="pt-20">
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
        return <QualificationCatalogue onApply={(qid) => navigateTo({ type: 'apply', formType: 'general', context: `Program ID: ${qid}` })} />;
      case 'admin':
        return <AdminDashboard />;
      case 'agent':
        if (!user) return <div className="p-40 text-center">Auth Required.</div>;
        return <AgentDashboard user={user} onBuy={(pid, qty) => navigateTo({ type: 'checkout', productId: pid, quantity: qty })} />;
      case 'policy':
        const policy = POLICY_CONTENT[view.policyId];
        if (!policy) return <div className="p-40 text-center text-slate-500">Policy Node Not Found.</div>;
        return (
          <div className="max-w-3xl mx-auto py-24 px-6 animate-in fade-in duration-500">
            <button 
              onClick={() => navigateTo({ type: 'store' })}
              className="text-primary-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 mb-8 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Portal
            </button>
            <h1 className="text-5xl font-display font-bold mb-12 tracking-tighter text-white">{policy.title}</h1>
            <div className="glass p-10 md:p-14 rounded-[3rem] border-slate-800">
              <div className="prose prose-invert prose-lg max-w-none">
                {policy.content.split('\n').map((para, i) => (
                  <p key={i} className="text-slate-400 leading-relaxed mb-6 font-medium text-lg">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="max-w-4xl mx-auto py-32 px-4 text-center">
            <h1 className="text-6xl font-display font-bold mb-8 tracking-tighter text-unicou-navy">About <span className="text-unicou-orange">UNICOU</span></h1>
            <p className="text-xl text-slate-400 leading-relaxed mb-12 font-medium">UNICOU is a unified academic mobility infrastructure bridging education and global opportunity.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
              <div className="glass p-8 rounded-3xl border-slate-800 shadow-xl">
                <h4 className="text-3xl font-bold text-primary-400 mb-2">120+</h4>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Global Partners</p>
              </div>
              <div className="glass p-8 rounded-3xl border-slate-800 shadow-xl">
                <h4 className="text-3xl font-bold text-unicou-orange mb-2">15k+</h4>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Students Synced</p>
              </div>
              <div className="glass p-8 rounded-3xl border-slate-800 shadow-xl">
                <h4 className="text-3xl font-bold text-emerald-500 mb-2">98%</h4>
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Visa Success Rate</p>
              </div>
            </div>
            <ApplyForm type="general" context="Corporate Enquiries" />
          </div>
        );
      case 'login': 
        return (
          <div className="pt-10">
            <Login 
              onLogin={(u) => { 
                setUser(u); 
                if (u.role === 'Admin') navigateTo({ type: 'admin' });
                else if (u.role === 'Agent') navigateTo({ type: 'agent' });
                else navigateTo({ type: 'store' });
              }} 
              onNavigateToSignup={() => navigateTo({ type: 'signup' })} 
            />
          </div>
        );
      case 'signup': return <div className="pt-10"><Signup onSuccess={(email) => navigateTo({ type: 'verification-pending', email })} onNavigateToLogin={() => navigateTo({ type: 'login' })} /></div>;
      case 'verification-pending': return <div className="pt-10"><VerificationPending email={view.email} onVerified={() => navigateTo({ type: 'login' })} /></div>;
      default: return <div className="p-40 text-center text-slate-500">Node Configuration Pending...</div>;
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    navigateTo({ type: 'store' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar 
        view={view} user={user} scrolled={scrolled} 
        onNavigate={navigateTo} 
        onLogout={handleLogout} 
        onOpenSearch={() => setSearchOpen(true)} 
      />
      <main className="pt-[var(--nav-height)] min-h-screen relative z-0">
        {renderContent()}
      </main>

      <footer className="bg-slate-950 border-t border-slate-900 py-24 mt-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 bg-unicou-navy rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/10"><svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9l-2.5-1.5L14 11V4h5v7z" /></svg></div>
              <h3 className="text-3xl font-display font-bold uppercase tracking-tighter"><span className="text-white uppercase">Uni</span><span className="text-unicou-orange uppercase">cou</span></h3>
            </div>
            <div className="space-y-6 text-[11px] text-slate-500 font-bold uppercase tracking-widest">
              <div><p className="text-slate-200 mb-1">United Kingdom</p><p>Manchester Business Park, Manchester, UK</p></div>
              <div><p className="text-slate-200 mb-1">Dubai</p><p>Deira Business Hub, Dubai, UAE</p></div>
              <div><p className="text-slate-200 mb-1">Pakistan</p><p>Plot 23, Township, Lahore, Pakistan</p></div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">Nexus Policies</h4>
            <ul className="space-y-4 text-[10px] text-slate-500 font-bold uppercase">
              <li>
                <button 
                  onClick={() => navigateTo({ type: 'policy', policyId: 'modern-slavery' })} 
                  className="hover:text-unicou-orange transition-colors block text-left"
                >
                  Modern Slavery
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo({ type: 'policy', policyId: 'accessibility' })} 
                  className="hover:text-unicou-orange transition-colors block text-left"
                >
                  Accessibility Statement
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo({ type: 'policy', policyId: 'cookies' })} 
                  className="hover:text-unicou-orange transition-colors block text-left"
                >
                  Cookie Use Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo({ type: 'policy', policyId: 'whistleblowing' })} 
                  className="hover:text-unicou-orange transition-colors block text-left"
                >
                  Whistleblowing Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo({ type: 'policy', policyId: 'privacy' })} 
                  className="hover:text-unicou-orange transition-colors block text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo({ type: 'policy', policyId: 'carbon' })} 
                  className="hover:text-unicou-orange transition-colors block text-left"
                >
                  Carbon Reduction Plan
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo({ type: 'policy', policyId: 'terms' })} 
                  className="hover:text-unicou-orange transition-colors block text-left"
                >
                  Website Terms of use
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigateTo({ type: 'careers' })} 
                  className="hover:text-unicou-orange transition-colors block text-left"
                >
                  Careers
                </button>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-5">
             <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">Nexus Update Subscription</h4>
             <p className="text-xs text-slate-500 mb-8 font-bold uppercase tracking-tight leading-relaxed">Establish a sync node for real-time scholarship push notifications via Email and WhatsApp.</p>
             <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); alert("Subscription Synced via Node JS Protocol."); }}>
               <input type="email" placeholder="Professional Email" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 text-xs outline-none focus:border-primary-500 transition-all" required />
               <div className="flex gap-2">
                 <input type="tel" placeholder="WhatsApp Number" className="flex-grow bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 text-xs outline-none focus:border-primary-500 transition-all" />
                 <button className="bg-unicou-navy px-8 py-4 rounded-xl text-[10px] font-black uppercase text-white shadow-xl hover:bg-[#003647] transition-all">Establish Sync</button>
               </div>
             </form>
          </div>
        </div>
      </footer>

      {!cookies && (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:w-96 glass border border-primary-500/20 p-8 rounded-[2.5rem] z-[100] animate-in slide-in-from-bottom shadow-3xl">
           <h4 className="text-sm font-bold mb-3 uppercase tracking-widest text-unicou-orange">Cookie Verification</h4>
           <p className="text-[10px] text-slate-500 mb-6 leading-relaxed uppercase font-bold tracking-tight">We use academic tracking nodes to optimize your mobility experience. By syncing, you agree to our data protocol.</p>
           <div className="flex gap-2">
              <button onClick={() => { setCookies(true); localStorage.setItem('unicou_consent', 'true'); }} className="flex-1 py-3 bg-unicou-orange text-white rounded-xl text-[10px] font-black uppercase shadow-lg">Accept Sync</button>
              <button onClick={() => setCookies(true)} className="flex-1 py-3 glass rounded-xl text-[10px] font-black uppercase text-slate-400">Decline</button>
           </div>
        </div>
      )}

      <AIChat />
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} onNavigate={navigateTo} />}
    </div>
  );
};

export default App;
