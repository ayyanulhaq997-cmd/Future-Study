
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
import AdminDashboard from './components/AdminDashboard';
import { ViewState, User } from './types';
import { api } from './services/apiService';

const POLICY_CONTENT: Record<string, { title: string; content: string }> = {
  'modern-slavery': { title: 'Modern Slavery Statement', content: `UniCou Ltd is committed to preventing modern slavery and human trafficking...` },
  'accessibility': { title: 'Accessibility Statement', content: `UniCou Ltd is committed to ensuring digital accessibility...` },
  'privacy': { title: 'Privacy Policy', content: `UniCou Ltd is committed to protecting personal data...` },
  'carbon': { title: 'Carbon Reduction Plan', content: `UniCou Ltd recognises its responsibility to reduce environmental impact...` },
  'terms': { title: 'Website Terms of Use', content: `These Website Terms of Use govern access to and use of the UniCou Ltd website...` },
  'cookies': { title: 'Cookie Use Policy', content: `UniCou Ltd uses cookies and similar technologies to enhance user experience...` },
  'whistleblowing': { title: 'Whistleblowing Policy', content: `UniCou Ltd encourages openness and transparency...` }
};

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState<ViewState>({ type: 'store' }); // Default to store view
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
          <div className="animate-in fade-in duration-700">
            <div className="bg-slate-900/20 py-12 border-b border-slate-900">
              <VoucherStore 
                onCheckout={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} 
                onBook={(p) => navigateTo({ type: 'apply', formType: 'study-abroad', context: `Booking: ${p}` })} 
                onNavigateToAgent={() => navigateTo({ type: 'signup' })}
              />
            </div>
            <Features />
            <section className="py-24 max-w-4xl mx-auto px-4">
              <ApplyForm type="general" context="Instant Connection Node" />
            </section>
          </div>
        );
      case 'apply':
        return <div className="max-w-4xl mx-auto py-20 px-4"><ApplyForm type={view.formType} context={view.context} /></div>;
      case 'country-list':
        return <div className="pt-8"><CountryList onNavigateToGuide={(slug) => navigateTo({ type: 'country-guide', slug })} /></div>;
      case 'country-guide':
        return <CountryGuide slug={view.slug} onViewUniversity={(uSlug) => navigateTo({ type: 'university', slug: uSlug })} onRegister={() => navigateTo({ type: 'apply', formType: 'study-abroad', context: `Registration: ${view.slug}` })} />;
      case 'immigration-guide':
        return <ImmigrationGuide slug={view.slug} onConsult={() => navigateTo({ type: 'apply', formType: 'immigration', context: `Consult: ${view.slug}` })} />;
      case 'lms-dashboard':
        return <LMSDashboard onNavigate={navigateTo} />;
      case 'course-catalogue':
        return <CourseCatalogue onCheckout={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} />;
      case 'library':
        return <Resources onNavigate={navigateTo} />;
      case 'careers':
        return <Careers />;
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
        return <QualificationCatalogue onApply={(qid) => navigateTo({ type: 'apply', formType: 'general', context: `Program: ${qid}` })} />;
      case 'admin':
        return <AdminDashboard />;
      case 'login': 
        return <div className="pt-10"><Login onLogin={(u) => { setUser(u); navigateTo(u.role === 'Admin' ? { type: 'admin' } : { type: 'store' }); }} onNavigateToSignup={() => navigateTo({ type: 'signup' })} /></div>;
      case 'signup':
        return <div className="pt-10"><Signup onSuccess={(email) => navigateTo({ type: 'verification-pending', email })} onNavigateToLogin={() => navigateTo({ type: 'login' })} /></div>;
      case 'verification-pending':
        return <div className="pt-10"><VerificationPending email={view.email} onVerified={() => navigateTo({ type: 'login' })} /></div>;
      case 'about':
        return (
          <div className="max-w-5xl mx-auto py-24 px-6 animate-in fade-in">
             <h1 className="text-6xl font-display font-bold mb-8 text-white">About <span className="text-unicou-orange">UNICOU</span></h1>
             <div className="glass p-12 rounded-[3rem] border-slate-800 text-slate-300 leading-relaxed text-lg">
                Founded in 2009, UNICOU is a leader in global academic mobility. We bridge the gap between ambitious students and world-class institutions.
             </div>
          </div>
        );
      default:
        return (
          <div className="py-40 text-center">
            <Hero onStart={() => navigateTo({ type: 'store' })} onResellerClick={() => navigateTo({ type: 'signup' })} />
          </div>
        );
    }
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    navigateTo({ type: 'store' });
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

      <footer className="bg-slate-950 border-t border-slate-900 py-16 mt-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
             <img src="logo.png" alt="UNICOU" className="h-10 mb-6" />
             <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Global Academic Mobility Hub</p>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-600 uppercase mb-6">Explore</h4>
            <ul className="space-y-4 text-[10px] font-bold text-slate-400 uppercase">
              <li><button onClick={() => navigateTo({ type: 'store' })} className="hover:text-unicou-orange">Voucher Sale</button></li>
              <li><button onClick={() => navigateTo({ type: 'library' })} className="hover:text-unicou-orange">Library</button></li>
              <li><button onClick={() => navigateTo({ type: 'lms-dashboard' })} className="hover:text-unicou-orange">Academy</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-600 uppercase mb-6">Policies</h4>
            <ul className="space-y-4 text-[10px] font-bold text-slate-400 uppercase">
              <li><button onClick={() => navigateTo({ type: 'policy', policyId: 'privacy' })} className="hover:text-unicou-orange">Privacy</button></li>
              <li><button onClick={() => navigateTo({ type: 'policy', policyId: 'terms' })} className="hover:text-unicou-orange">Terms</button></li>
            </ul>
          </div>
        </div>
      </footer>

      <AIChat />
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} onNavigate={navigateTo} />}
    </div>
  );
};

export default App;
