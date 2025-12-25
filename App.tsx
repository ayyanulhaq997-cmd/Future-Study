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
import { ViewState, User } from './types';
import { api } from './services/apiService';
import { LOGO_SRC } from './constants/assets';

const POLICY_CONTENT: Record<string, { title: string; content: string }> = {
  'modern-slavery': { 
    title: 'Modern Slavery Policy', 
    content: `Modern Slavery and Human Trafficking Statement – UniCou Ltd\n\nUniCou Ltd is committed to preventing modern slavery and human trafficking in all its business operations and supply chains. We recognise our responsibility under the UK Modern Slavery Act 2015 and support international efforts to eradicate slavery, forced labour, child labour, and human trafficking.\n\nUniCou Ltd operates as an education consultancy firm based in the United Kingdom, working with students, academic institutions, training providers, agents, and business partners across multiple countries. We take a zero-tolerance approach to modern slavery and expect the same high standards from all our partners, suppliers, and associates worldwide.\n\nOur business model does not involve manufacturing or high-risk labour sectors; however, we acknowledge that risks may exist within extended supply chains, particularly in international operations. We actively assess and monitor risks through due diligence, contractual obligations, and ethical standards.\n\nAll staff members are expected to act ethically and report any concerns related to modern slavery. We provide guidance to employees to help them recognise signs of exploitation and understand reporting procedures. Any reported concerns are taken seriously and investigated promptly.\n\nUniCou Ltd only engages with suppliers and associates who demonstrate lawful employment practices and compliance with applicable labour laws. We reserve the right to terminate relationships where breaches of modern slavery laws are identified.\n\nThis statement is reviewed annually and reflects our ongoing commitment to ethical business practices and human rights protection.` 
  },
  'accessibility': {
    title: 'Accessibility Statement',
    content: `Website Accessibility Statement – UniCou Ltd\n\nUniCou Ltd is committed to ensuring digital accessibility for all users, including people with disabilities. We aim to provide a website experience that is inclusive, user-friendly, and compliant with recognised accessibility standards.\n\nOur website is designed to align with the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA, and relevant UK accessibility regulations. We strive to ensure that our content is accessible through assistive technologies such as screen readers, keyboard navigation, and text enlargement tools.\n\nWe regularly review our website design, structure, and content to improve accessibility. This includes ensuring readable fonts, appropriate colour contrast, alternative text for images, and clear navigation.\n\nWhile we make every effort to maintain accessibility across all areas of our website, some third-party tools or external content may not fully meet accessibility standards. We continue to work with providers to improve accessibility where possible.\n\nIf you experience difficulty accessing any part of our website or require information in an alternative format, please contact us. We are committed to responding promptly and making reasonable adjustments where feasible.`
  },
  'cookie-policy': {
    title: 'Cookie Use Policy',
    content: `UniCou Ltd uses cookies and similar technologies to enhance user experience, analyse website performance, and support marketing activities. This Cookie Policy explains how and why cookies are used when you visit our website.\n\nCookies are small text files stored on your device that help websites function efficiently. We use essential cookies required for website operation, as well as analytical and marketing cookies to understand user behaviour and improve our services.\n\nOur use of cookies complies with the UK GDPR, Data Protection Act 2018, and Privacy and Electronic Communications Regulations (PECR). Where required, we seek user consent before placing non-essential cookies.\n\nSome cookies may be placed by trusted third-party service providers for analytics, advertising, or functionality purposes. These providers process data in accordance with their own privacy policies.\n\nYou can manage or disable cookies through your browser settings at any time. Please note that disabling cookies may affect website performance.`
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
      case 'immigration-guide':
        return <div className="view-container"><ImmigrationGuide slug={view.slug} onConsult={() => navigateTo({ type: 'apply', formType: 'general', context: `Immigration: ${view.slug}` })} /></div>;
      case 'university':
        return <div className="view-container"><UniversityProfile slug={view.slug} /></div>;
      case 'lms-dashboard':
        return <div className="view-container">{user ? <CustomerDashboard user={user} /> : <LMSDashboard onNavigate={navigateTo} />}</div>;
      case 'lms-course-player':
        return <div className="min-h-screen bg-slate-950"><LMSCoursePlayer courseId={view.courseId} initialLessonId={view.initialLessonId} onNavigate={navigateTo} /></div>;
      case 'lms-practice-test':
        return <div className="min-h-screen bg-slate-950"><LMSPracticeTest testId={view.testId} onNavigate={navigateTo} /></div>;
      case 'qualifications':
        return <div className="view-container"><QualificationCatalogue onApply={(qid) => navigateTo({ type: 'apply', formType: 'general', context: `Qualification ID: ${qid}` })} /></div>;
      case 'course-catalogue':
        return <div className="view-container"><CourseCatalogue onCheckout={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} /></div>;
      case 'checkout':
        return <div className="view-container"><CheckoutProcess productId={view.productId} quantity={view.quantity} onSuccess={(oid) => navigateTo({ type: 'success', orderId: oid })} onCancel={() => navigateTo({ type: 'store' })} /></div>;
      case 'success':
        return <div className="view-container"><SuccessScreen orderId={view.orderId} onClose={() => navigateTo({ type: 'store' })} /></div>;
      case 'admin':
        if (!user || !['Admin', 'Finance', 'Teller'].includes(user.role)) return <div className="view-container text-center pt-40 text-slate-900 font-bold">Identity Verification Required.</div>;
        return <div className="view-container"><AdminDashboard /></div>;
      case 'agent':
        if (!user || user.role !== 'Agent') return <div className="view-container text-center pt-40 text-slate-900 font-bold">Partner Portal Access Restricted.</div>;
        return <div className="view-container"><AgentDashboard user={user} onBuy={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} /></div>;
      case 'login': 
        return <div className="view-container"><Login onLogin={(u) => { setUser(u); navigateTo(['Admin', 'Finance'].includes(u.role) ? { type: 'admin' } : { type: 'lms-dashboard' }); }} onNavigateToSignup={() => navigateTo({ type: 'signup' })} /></div>;
      case 'signup':
        return <div className="view-container"><Signup onSuccess={(e) => navigateTo({ type: 'verification-pending', email: e })} onNavigateToLogin={() => navigateTo({ type: 'login' })} /></div>;
      case 'verification-pending':
        return <div className="view-container"><VerificationPending email={view.email} onVerified={() => navigateTo({ type: 'login' })} /></div>;
      case 'about':
        return (
          <div className="max-w-7xl mx-auto view-container px-6 animate-in fade-in pb-24 bg-white text-slate-950">
             <div className="text-center mb-24">
                <span className="text-xs font-black text-unicou-orange uppercase tracking-[0.4em] mb-4 block">Institutional Profile</span>
                <h1 className="text-6xl md:text-[5rem] font-display font-black text-slate-950 mb-6 tracking-tighter leading-none">About <span className="text-unicou-navy">UNICOU</span></h1>
                <div className="h-1.5 w-24 bg-unicou-orange mx-auto rounded-full" />
             </div>

             <div className="space-y-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                   <div className="lg:col-span-7 space-y-8">
                      <h2 className="text-4xl font-black tracking-tight uppercase text-slate-900">Founded with Passion</h2>
                      <p className="text-2xl leading-relaxed font-semibold italic border-l-8 border-unicou-orange pl-8 text-slate-900">
                        Founded with a passion for global education and international opportunity, we are a leading international education and immigration consultancy with deep roots and a growing global footprint.
                      </p>
                      <div className="space-y-6 text-lg text-slate-800 leading-relaxed font-medium">
                        <p>
                          Our journey began in 2009 in Pakistan, where we first opened our doors to support ambitious students and professionals in navigating the complexities of studying, living, and working abroad. Over the years, we have built a reputation rooted in transparency, integrity, and long-term success.
                        </p>
                        <p>
                          As of 2023, we expanded our operations to include offices in the United Kingdom and Dubai, enhancing our ability to serve clients with localized expertise in two of the world’s most competitive education and migration markets.
                        </p>
                        <p>
                          Our founder’s extensive professional training—including certifications from <strong>British Council UK agent training</strong>, <strong>ICEF Trained Agent Counsellor</strong>, <strong>AIRC enrollment management</strong> for U.S. education, and regional credentials such as <strong>Ireland Certified Counsellor</strong>—ensures that our guidance is both expert and trustworthy.
                        </p>
                        <p>
                          We are also proud to be linked with globally recognized testing and recruitment partners including LanguageCert, Skills for English, TOEFL, Oxford ELLT, and Duolingo, and to operate as <strong>UKVI and Pearson approved test centers</strong>, reinforcing our leadership in secure English language testing and preparation.
                        </p>
                      </div>
                   </div>
                   <div className="lg:col-span-5 space-y-8">
                      <div className="glass p-10 rounded-[3.5rem] bg-slate-50 border border-slate-200 shadow-2xl">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Authoritative Credentials</h4>
                        <div className="grid grid-cols-1 gap-4">
                          {[
                            'British Council UK Certified',
                            'ICEF Trained Agent Counsellor',
                            'AIRC Enrollment Management',
                            'Ireland Certified Counsellor',
                            'UKVI Approved Center',
                            'Pearson Approved Center'
                          ].map(cert => (
                            <div key={cert} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                               <div className="w-8 h-8 rounded-lg bg-unicou-navy text-white flex items-center justify-center text-xs font-black">✓</div>
                               <span className="font-bold text-slate-900 text-xs uppercase tracking-tight">{cert}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="bg-unicou-navy p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-7xl select-none">VISION</div>
                      <h3 className="text-3xl font-black mb-6 uppercase tracking-tight">Vision</h3>
                      <p className="text-xl text-slate-100 font-bold leading-relaxed italic">
                        "To become the most trusted gateway for students, professionals, and institutions seeking global education and mobility solutions. We aspire to simplify international pathways, empower every client with informed choices, and build bridges between talent and opportunity across continents."
                      </p>
                   </div>
                   <div className="bg-unicou-orange p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-10 font-black text-7xl select-none">MISSION</div>
                      <h3 className="text-3xl font-black mb-6 uppercase tracking-tight">Mission</h3>
                      <p className="text-xl text-white font-bold leading-relaxed">
                        Guided by ethics, expertise, and personalized support, our mission is to streamline study abroad journeys, immigration pathways, and professional placements. We are dedicated to helping individuals realize their aspirations with confidence while fostering strong partnerships.
                      </p>
                   </div>
                </div>

                <div className="space-y-12">
                  <div className="text-center">
                    <h2 className="text-4xl font-black uppercase tracking-tight text-slate-900">What We Do</h2>
                    <div className="h-1 w-20 bg-unicou-orange mx-auto mt-4" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="p-10 bg-slate-50 border border-slate-200 rounded-[3rem] shadow-lg">
                      <h4 className="text-xl font-black text-unicou-navy mb-4 uppercase">Study Abroad</h4>
                      <p className="text-slate-800 font-medium leading-relaxed">Comprehensive guidance for destinations including the UK, USA, Canada, Australia, New Zealand, Ireland, Cyprus, Germany, Italy, Sweden, Finland, Europe, Dubai, Malaysia, and Turkey.</p>
                    </div>
                    <div className="p-10 bg-slate-50 border border-slate-200 rounded-[3rem] shadow-lg">
                      <h4 className="text-xl font-black text-unicou-navy mb-4 uppercase">Immigration</h4>
                      <p className="text-slate-800 font-medium leading-relaxed">Supporting skilled individuals, entrepreneurs, and remote professionals through skilled migration, business immigration, citizenship by investment, or digital nomad visas.</p>
                    </div>
                    <div className="p-10 bg-slate-50 border border-slate-200 rounded-[3rem] shadow-lg">
                      <h4 className="text-xl font-black text-unicou-navy mb-4 uppercase">Exam & E-Learning</h4>
                      <p className="text-slate-800 font-medium leading-relaxed">Providing official vouchers and tools for IELTS, PTE, TOEFL iBT, LanguageCert, and Duolingo. Our e-learning resources help candidates enhance skills with flexible tools.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                  <div className="lg:col-span-6 space-y-10">
                    <h3 className="text-3xl font-black text-slate-950 uppercase tracking-tight">Why Work With Us</h3>
                    <p className="text-lg text-slate-800 font-medium leading-relaxed">
                      Choosing us means choosing experience—more than a decade of trusted service, a global perspective, and expert guidance. Our advisors are certified and trained by leading global organizations.
                    </p>
                    <div className="bg-unicou-navy/5 p-8 rounded-[2.5rem] border border-unicou-navy/10">
                       <h4 className="font-black text-slate-900 uppercase text-sm mb-4">Corporate Placement & Sponsors</h4>
                       <p className="text-sm text-slate-700 leading-relaxed font-medium">Matching international talent with strategic opportunities, helping organizations navigate compliance and global recruitment.</p>
                    </div>
                  </div>
                  <div className="lg:col-span-6 space-y-10">
                    <h3 className="text-3xl font-black text-slate-950 uppercase tracking-tight">Looking Ahead</h3>
                    <p className="text-lg text-slate-800 font-medium leading-relaxed">
                      Building on our strong legacy in Pakistan, the UK, and Dubai, we are actively planning expansion into the <strong>Middle East, India, China, Nepal, Bangladesh, Nigeria and Ghana</strong>.
                    </p>
                    <div className="bg-unicou-orange/5 p-8 rounded-[2.5rem] border border-unicou-orange/10">
                       <h4 className="font-black text-slate-900 uppercase text-sm mb-4">Institution Partnership</h4>
                       <p className="text-sm text-slate-700 leading-relaxed font-medium">Supporting student recruitment, brand visibility, and international program success for universities worldwide.</p>
                    </div>
                  </div>
                </div>
             </div>

             <div className="mt-24 pt-16 border-t border-slate-100 text-center">
                <button onClick={() => navigateTo({ type: 'apply', formType: 'general', context: 'Institutional Inquiry' })} className="px-16 py-6 bg-unicou-navy text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-950 transition-all shadow-2xl active:scale-95">Establish Connection with Global Hub</button>
             </div>
          </div>
        );
      case 'policy':
        const policy = POLICY_CONTENT[view.policyId];
        return (
          <div className="max-w-4xl mx-auto view-container px-6 bg-white text-slate-950">
            <h1 className="text-5xl font-display font-black mb-10 tracking-tight">{policy?.title}</h1>
            <div className="glass p-12 rounded-[3.5rem] bg-slate-50 border border-slate-200 text-slate-900 leading-relaxed whitespace-pre-wrap shadow-xl font-bold italic">
              {policy?.content}
            </div>
          </div>
        );
      case 'resources':
        return <div className="view-container"><Resources onNavigate={navigateTo} /></div>;
      default:
        return <div className="view-container text-center pt-40 font-bold text-slate-900">Identity Node Unmapped.</div>;
    }
  };

  const handleLogout = () => { api.logout(); setUser(null); navigateTo({ type: 'home' }); };

  return (
    <div className="min-h-screen bg-white text-slate-950 selection:bg-unicou-orange selection:text-white">
      <Navbar view={view} user={user} scrolled={scrolled} onNavigate={navigateTo} onLogout={handleLogout} onOpenSearch={() => setSearchOpen(true)} />
      <main className="relative z-0">
        {renderContent()}
      </main>
      <footer className="bg-slate-50 border-t border-slate-200 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 pb-20 border-b border-slate-200">
            <div className="md:col-span-1">
               <img src={LOGO_SRC} alt="UNICOU" className="h-14 w-auto mb-10" />
               <p className="text-slate-900 text-xs font-black uppercase tracking-[0.2em] leading-loose">Global Mobility Infrastructure.<br />Established 2009.</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-12">
              {OFFICE_LOCATIONS.map((loc, i) => (
                <div key={i}>
                  <h5 className="text-[11px] font-black text-unicou-navy uppercase tracking-widest mb-4">{loc.country} Terminal</h5>
                  <p className="text-xs text-slate-900 leading-relaxed font-bold italic">{loc.address}</p>
                </div>
              ))}
            </div>
            <div className="md:col-span-1">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8">Navigation Map</h4>
              <ul className="space-y-4 text-xs font-black text-slate-900 uppercase tracking-widest">
                <li><button onClick={() => navigateTo({ type: 'store' })} className="hover:text-unicou-orange transition-colors">Digital Store</button></li>
                <li><button onClick={() => navigateTo({ type: 'lms-dashboard' })} className="hover:text-unicou-orange transition-colors">Study Hub</button></li>
                <li><button onClick={() => navigateTo({ type: 'about' })} className="hover:text-unicou-orange transition-colors">About Us</button></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 flex flex-wrap gap-8 text-[11px] font-black uppercase tracking-widest text-slate-600">
             <button onClick={() => navigateTo({ type: 'policy', policyId: 'modern-slavery' })} className="hover:text-unicou-navy">Modern Slavery Policy</button>
             <button onClick={() => navigateTo({ type: 'policy', policyId: 'accessibility' })} className="hover:text-unicou-navy">Accessibility Statement</button>
             <button onClick={() => navigateTo({ type: 'policy', policyId: 'cookie-policy' })} className="hover:text-unicou-navy">Cookie Policy</button>
             <p className="ml-auto">© 2024 UNICOU INTERNATIONAL LTD. REG #06900657</p>
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