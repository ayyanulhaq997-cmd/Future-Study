
import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import VoucherStore from './components/VoucherStore';
import AdminDashboard from './components/AdminDashboard';
import AgentDashboard from './components/AgentDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import TrainerDashboard from './components/TrainerDashboard';
import Login from './components/Login';
import CheckoutProcess from './components/CheckoutProcess';
import SuccessScreen from './components/SuccessScreen';
import EnquiryForm from './components/EnquiryForm';
import APIDocs from './components/APIDocs';
import LMSDashboard from './components/LMSDashboard';
import LMSCoursePlayer from './components/LMSCoursePlayer';
import LMSPracticeTest from './components/LMSPracticeTest';
import CourseCatalogue from './components/CourseCatalogue';
import QualificationCatalogue from './components/QualificationCatalogue';
import QualificationLeadForm from './components/QualificationLeadForm';
import HandoverView from './components/HandoverView';
import RegistrationForm from './components/RegistrationForm';
import AIChat from './components/AIChat';
import { ViewState, User } from './types';
import { api } from './services/apiService';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [view, setView] = useState<ViewState>({ type: 'store' });
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (newView: ViewState) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (u: User) => {
    setUser(u);
    if (u.role === 'Admin') navigateTo({ type: 'admin' });
    else if (u.role === 'Agent') navigateTo({ type: 'agent' });
    else if (u.role === 'Trainer') navigateTo({ type: 'trainer' });
    else navigateTo({ type: 'lms-dashboard' }); 
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    navigateTo({ type: 'store' });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-primary-500/30">
      <div className="fixed inset-0 gradient-bg pointer-events-none z-0" />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-3 glass border-b border-slate-800/50 shadow-2xl' : 'py-6 bg-transparent'
        }`}>
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigateTo({ type: 'store' })}>
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xl font-display font-bold tracking-tight">NEXUS<span className="text-primary-400">EDU</span></span>
            </div>
            
            <div className="hidden md:flex items-center gap-1 bg-slate-900/40 p-1 rounded-2xl border border-slate-800/50 backdrop-blur-md">
              <NavBtn active={view.type === 'store'} onClick={() => navigateTo({ type: 'store' })}>Exams</NavBtn>
              <NavBtn active={view.type === 'course-catalogue'} onClick={() => navigateTo({ type: 'course-catalogue' })}>LMS</NavBtn>
              <NavBtn active={view.type === 'qualifications'} onClick={() => navigateTo({ type: 'qualifications' })}>Degrees</NavBtn>
              <NavBtn active={view.type === 'lms-dashboard'} onClick={() => navigateTo({ type: 'lms-dashboard' })}>Academy</NavBtn>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                      if(user.role === 'Admin') navigateTo({type:'admin'});
                      else if(user.role === 'Agent') navigateTo({type:'agent'});
                      else if(user.role === 'Trainer') navigateTo({type:'trainer'});
                      else navigateTo({type:'customer'});
                    }} 
                    className="text-sm font-bold text-primary-400 hover:text-white transition-colors"
                  >
                    Dashboard
                  </button>
                  <button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-red-500/20">
                    Exit
                  </button>
                </div>
              ) : (
                <button onClick={() => navigateTo({ type: 'login' })} className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2.5 rounded-xl transition-all shadow-lg font-bold text-sm">
                  Sign In
                </button>
              )}
            </div>
          </div>
        </nav>
        
        <main className="flex-grow pt-24">
          {view.type === 'store' && (
            <>
              <Hero onStart={() => document.getElementById('inventory')?.scrollIntoView({ behavior: 'smooth' })} />
              <div id="inventory">
                <VoucherStore 
                  onCheckout={(pid, qty) => !user ? navigateTo({type:'login'}) : setView({type:'checkout', productId: pid, quantity: qty})} 
                  onBook={(pid) => !user ? navigateTo({type:'login'}) : setView({type:'book-test', productId: pid})}
                />
              </div>
              <Features />
              <EnquirySection />
            </>
          )}

          {view.type === 'login' && <Login onLogin={handleLogin} />}
          {view.type === 'admin' && user?.role === 'Admin' && <AdminDashboard />}
          {view.type === 'trainer' && user?.role === 'Trainer' && <TrainerDashboard user={user} />}
          {view.type === 'api-docs' && <APIDocs />}
          {view.type === 'course-catalogue' && <CourseCatalogue onCheckout={(pid, qty) => !user ? navigateTo({type:'login'}) : setView({type:'checkout', productId: pid, quantity: qty})} />}
          {view.type === 'qualifications' && <QualificationCatalogue onApply={(id) => navigateTo({ type: 'qualification-apply', qualificationId: id })} />}
          {view.type === 'qualification-apply' && <QualificationLeadForm qualificationId={view.qualificationId} onCancel={() => navigateTo({ type: 'qualifications' })} onSuccess={(l) => { alert(`Success! Tracking ID: ${l.trackingId}`); navigateTo({ type: 'store' }); }} />}
          {view.type === 'lms-dashboard' && <LMSDashboard onNavigate={navigateTo} />}
          {view.type === 'lms-course-player' && <LMSCoursePlayer courseId={view.courseId} onNavigate={navigateTo} />}
          {view.type === 'lms-practice-test' && <LMSPracticeTest testId={view.testId} onNavigate={navigateTo} />}
          {view.type === 'agent' && user?.role === 'Agent' && <AgentDashboard user={user} onBuy={(pid, qty) => setView({ type: 'checkout', productId: pid, quantity: qty })} />}
          {view.type === 'customer' && user?.role === 'Customer' && <CustomerDashboard user={user} />}
          {view.type === 'success' && <SuccessScreen orderId={view.orderId} onClose={() => navigateTo({type:'store'})} />}
          {view.type === 'checkout' && <CheckoutProcess productId={view.productId} quantity={view.quantity} onSuccess={(oid) => navigateTo({ type: 'success', orderId: oid })} onCancel={() => navigateTo({type:'store'})} />}
          {view.type === 'book-test' && <RegistrationForm productId={view.productId} onCancel={() => navigateTo({type:'store'})} onSuccess={(b) => { alert(`Test Registration Submitted! Tracking Ref: ${b.trackingRef}`); navigateTo({type:'store'}); }} />}
          {view.type === 'handover' && <HandoverView />}
        </main>

        <footer className="py-12 border-t border-slate-900 bg-[#020617]">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-2">
              <h3 className="text-xl font-display font-bold mb-4">NEXUS<span className="text-primary-400">EDU</span></h3>
              <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
                Enterprise infrastructure for global exam registration. Verified partner for Pearson, IDP, and British Council.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase text-slate-500 mb-6 tracking-widest">Platform</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><button onClick={() => navigateTo({type:'store'})} className="hover:text-primary-400">Voucher Vault</button></li>
                <li><button onClick={() => navigateTo({type:'course-catalogue'})} className="hover:text-primary-400">Academy</button></li>
                <li><button onClick={() => navigateTo({type:'qualifications'})} className="hover:text-primary-400">Degrees</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase text-slate-500 mb-6 tracking-widest">Developer</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><button onClick={() => navigateTo({type:'api-docs'})} className="hover:text-primary-400">API Portal</button></li>
                <li><button onClick={() => navigateTo({type:'handover'})} className="hover:text-primary-400">Tech Docs</button></li>
              </ul>
            </div>
          </div>
        </footer>

        <AIChat />
      </div>
    </div>
  );
};

const NavBtn: React.FC<{ children: React.ReactNode; active: boolean; onClick: () => void }> = ({ children, active, onClick }) => (
  <button onClick={onClick} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${active ? 'bg-primary-600/10 text-primary-400' : 'text-slate-500 hover:text-slate-200'}`}>
    {children}
  </button>
);

const EnquirySection = () => (
  <section className="py-24 max-w-7xl mx-auto px-4">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div>
        <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">Direct <span className="text-primary-400">Council</span> Links.</h2>
        <p className="text-slate-400 text-lg leading-relaxed mb-10"> we handle the complexity of global test registration so you can focus on your scores.</p>
        <div className="space-y-6">
          <FeatureItem icon="🎖️" title="Certified Partners" desc="Official agents for PTE and IELTS boards." />
          <FeatureItem icon="🌍" title="24/7 Support" desc="Assisting students across 12 timezones." />
        </div>
      </div>
      <EnquiryForm />
    </div>
  </section>
);

const FeatureItem = ({ icon, title, desc }: { icon: string; title: string; desc: string }) => (
  <div className="flex gap-4 p-4 glass rounded-2xl border-slate-800/50">
    <span className="text-2xl">{icon}</span>
    <div>
      <h4 className="font-bold text-slate-200">{title}</h4>
      <p className="text-sm text-slate-500">{desc}</p>
    </div>
  </div>
);

export default App;
