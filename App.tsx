
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

const LOGO_SRC = "data:image/png;base64,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";

const POLICY_CONTENT: Record<string, { title: string; content: string }> = {
  'modern-slavery': { 
    title: 'Modern Slavery Statement', 
    content: `Modern Slavery and Human Trafficking Statement
Modern Slavery Statement – UniCou Ltd

UniCou Ltd is committed to preventing modern slavery and human trafficking in all its business operations and supply chains. We recognise our responsibility under the UK Modern Slavery Act 2015 and support international efforts to eradicate slavery, forced labour, child labour, and human trafficking.

UniCou Ltd operates as an education consultancy firm based in the United Kingdom, working with students, academic institutions, training providers, agents, and business partners across multiple countries. We take a zero-tolerance approach to modern slavery and expect the same high standards from all our partners, suppliers, and associates worldwide.

Our business model does not involve manufacturing or high-risk labour sectors; however, we acknowledge that risks may exist within extended supply chains, particularly in international operations. We actively assess and monitor risks through due diligence, contractual obligations, and ethical standards.

All staff members are expected to act ethically and report any concerns related to modern slavery. We provide guidance to employees to help them recognise signs of exploitation and understand reporting procedures. Any reported concerns are taken seriously and investigated promptly.

UniCou Ltd only engages with suppliers and associates who demonstrate lawful employment practices and compliance with applicable labour laws. We reserve the right to terminate relationships where breaches of modern slavery laws are identified.

This statement is reviewed annually and reflects our ongoing commitment to ethical business practices and human rights protection.` 
  },
  'accessibility': { 
    title: 'Accessibility Statement', 
    content: `Website Accessibility Statement – UniCou Ltd

UniCou Ltd is committed to ensuring digital accessibility for all users, including people with disabilities. We aim to provide a website experience that is inclusive, user-friendly, and compliant with recognised accessibility standards.

Our website is designed to align with the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA, and relevant UK accessibility regulations. We strive to ensure that our content is accessible through assistive technologies such as screen readers, keyboard navigation, and text enlargement tools.

We regularly review our website design, structure, and content to improve accessibility. This includes ensuring readable fonts, appropriate colour contrast, alternative text for images, and clear navigation.

While we make every effort to maintain accessibility across all areas of our website, some third-party tools or external content may not fully meet accessibility standards. We continue to work with providers to improve accessibility where possible.

If you experience difficulty accessing any part of our website or require information in an alternative format, please contact us at connect@unicou.uk. We are committed to responding promptly and making reasonable adjustments where feasible.` 
  },
  'privacy': { 
    title: 'Privacy Policy', 
    content: `UniCou Ltd is committed to protecting personal data and respecting privacy rights. This Privacy Policy explains how we collect, use, store, and share personal data in compliance with the UK GDPR, Data Protection Act 2018, and applicable international data protection laws.

We collect personal data such as names, contact details, academic records, and identification documents for legitimate business purposes, including student counselling, university applications, visa guidance, marketing, and service improvement.

Personal data may be shared with trusted associates, partner institutions, service providers, and regulatory authorities where necessary and lawful. Such sharing supports education placement, legal compliance, business development, lead management, and market analysis.

We implement appropriate technical and organisational measures to safeguard personal data. Data is retained only for as long as necessary for its intended purpose or legal obligations.

Individuals have rights regarding their personal data, including access, correction, deletion, and objection to processing. Requests can be made by contacting UniCou Ltd directly at connect@unicou.uk.` 
  },
  'carbon': { 
    title: 'Carbon Reduction Plan', 
    content: `UniCou Ltd recognises its responsibility to reduce environmental impact and contribute to global sustainability goals. We are committed to reducing carbon emissions across our operations in line with UK environmental policies and international climate objectives.

As a service-based organisation, our environmental impact primarily relates to office operations, energy usage, digital infrastructure, and business travel. We actively seek to minimise emissions through remote working practices, digital communication, and efficient resource use.

We encourage responsible travel, reduce paper consumption, and support energy-efficient technologies. Where possible, we work with suppliers who share our commitment to environmental responsibility.

UniCou Ltd continuously monitors environmental performance and seeks opportunities for improvement. Our carbon reduction strategy evolves as our business grows and as sustainability standards advance.` 
  },
  'terms': { 
    title: 'Website Terms of Use', 
    content: `These Website Terms of Use govern access to and use of the UniCou Ltd website. By using our website, you agree to comply with these terms and all applicable UK and international laws.

Website content is provided for general information purposes only and does not constitute legal, academic, or immigration advice. While we strive for accuracy, we do not guarantee completeness or reliability.

All intellectual property on this website, including text, logos, and design, belongs to UniCou Ltd unless otherwise stated. Unauthorised use or reproduction is prohibited.

We are not responsible for third-party websites linked from our site. Users access external links at their own risk.

UniCou Ltd reserves the right to update website content and terms at any time. Continued use of the website constitutes acceptance of updated terms.` 
  },
  'cookies': { 
    title: 'Cookie Use Policy', 
    content: `UniCou Ltd uses cookies and similar technologies to enhance user experience, analyse website performance, and support marketing activities. This Cookie Policy explains how and why cookies are used when you visit our website.

Cookies are small text files stored on your device that help websites function efficiently. We use essential cookies required for website operation, as well as analytical and marketing cookies to understand user behaviour and improve our services.

Our use of cookies complies with the UK GDPR, Data Protection Act 2018, and Privacy and Electronic Communications Regulations (PECR). Where required, we seek user consent before placing non-essential cookies.

Some cookies may be placed by trusted third-party service providers for analytics, advertising, or functionality purposes. These providers process data in accordance with their own privacy policies.

You can manage or disable cookies through your browser settings at any time. Please note that disabling cookies may affect website functionality.` 
  },
  'whistleblowing': { 
    title: 'Whistleblowing Policy', 
    content: `UniCou Ltd encourages openness and transparency and is committed to conducting business with honesty and integrity. This Whistleblowing Policy provides a framework for employees, contractors, partners, and associates to report concerns safely and confidentially.

Whistleblowing concerns may include unlawful activity, fraud, corruption, data misuse, modern slavery, unethical conduct, or breaches of company policy. Reports can be made without fear of retaliation.

All disclosures are treated seriously and investigated appropriately. UniCou Ltd ensures confidentiality and protects whistleblowers in line with the Public Interest Disclosure Act 1998.

Concerns can be raised internally through designated reporting channels. Where appropriate, matters may be escalated to external authorities.

Retaliation against whistleblowers is strictly prohibited and may result in disciplinary action.` 
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
              onResellerClick={() => navigateTo({ type: 'signup' })} 
            />
            <Features />
            <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="glass p-12 rounded-[3rem] border-slate-800">
                  <h2 className="text-4xl font-display font-bold mb-6 tracking-tight">Academic <span className="text-unicou-orange">Excellence</span></h2>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8 italic">
                    UNICOU provides a seamless bridge for students aiming for global horizons. Our automated infrastructure handles the complexity, so you can focus on your future.
                  </p>
                  <button onClick={() => navigateTo({ type: 'country-list' })} className="text-primary-400 font-black uppercase text-[10px] tracking-widest hover:underline flex items-center gap-2">
                    Explore Destinations <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
               </div>
               <div className="glass p-12 rounded-[3rem] border-slate-800 bg-unicou-orange/5">
                  <h2 className="text-4xl font-display font-bold mb-6 tracking-tight">Voucher <span className="text-unicou-orange">Vault</span></h2>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8">
                    Instant procurement for Pearson PTE, IELTS, and TOEFL. Bank-grade security for every transaction.
                  </p>
                  <button onClick={() => navigateTo({ type: 'store' })} className="px-10 py-4 bg-unicou-orange text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl">
                    Enter Voucher Sale
                  </button>
               </div>
            </section>
          </div>
        );
      case 'store':
        return (
          <div className="animate-in fade-in duration-700">
            <VoucherStore 
              onCheckout={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} 
              onBook={(p) => navigateTo({ type: 'apply', formType: 'study-abroad', context: `Booking: ${p}` })} 
              onNavigateToAgent={() => navigateTo({ type: 'signup' })}
            />
            <div className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-900">
               <ApplyForm type="general" context="Instant Connection Node" />
            </div>
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
        return <div className="pt-10"><Login onLogin={(u) => { setUser(u); navigateTo(u.role === 'Admin' ? { type: 'admin' } : { type: 'home' }); }} onNavigateToSignup={() => navigateTo({ type: 'signup' })} /></div>;
      case 'signup':
        return <div className="pt-10"><Signup onSuccess={(email) => navigateTo({ type: 'verification-pending', email })} onNavigateToLogin={() => navigateTo({ type: 'login' })} /></div>;
      case 'verification-pending':
        return <div className="pt-10"><VerificationPending email={view.email} onVerified={() => navigateTo({ type: 'login' })} /></div>;
      case 'about':
        return (
          <div className="max-w-7xl mx-auto py-24 px-6 animate-in fade-in duration-700">
            <div className="text-center mb-20">
              <span className="text-[10px] font-black text-unicou-orange uppercase tracking-[0.4em] mb-4 block">Our Identity</span>
              <h1 className="text-6xl md:text-8xl font-display font-bold mb-8 text-white tracking-tighter">About <span className="text-unicou-orange">Us</span></h1>
              <div className="glass p-12 rounded-[3.5rem] border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none text-9xl font-black italic">HISTORY</div>
                <p className="text-slate-300 text-xl leading-relaxed font-medium relative z-10">
                  Founded with a passion for global education and international opportunity, we are a leading international education and immigration consultancy with deep roots and a growing global footprint. Our journey began in 2009 in Pakistan, where we first opened our doors to support ambitious students and professionals in navigating the complexities of studying, living, and working abroad. Over the years, we have built a reputation rooted in transparency, integrity, and long-term success.
                </p>
                <p className="text-slate-400 mt-8 leading-relaxed text-lg italic">
                  As of 2023, we expanded our operations to include offices in the United Kingdom and Dubai, enhancing our ability to serve clients with localized expertise in two of the world’s most competitive education and migration markets. Our founder’s extensive professional training ensures that our guidance is both expert and trustworthy. We are also proud to be linked with globally recognized testing and recruitment partners including LanguageCert, Skills for English, TOEFL, Oxford ELLT, and Duolingo, reinforcing our leadership in secure English language testing.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
               <div className="glass p-12 rounded-[3.5rem] border-slate-800 hover:border-unicou-orange/20 transition-all group">
                  <h3 className="text-3xl font-display font-bold mb-6 tracking-tight">Our <span className="text-unicou-orange">Vision</span></h3>
                  <p className="text-slate-400 leading-relaxed text-lg mb-8">
                    To become the most trusted gateway for students, professionals, and institutions seeking global education and mobility solutions. We aspire to simplify international pathways, empower every client with informed choices, and build bridges between talent and opportunity across continents.
                  </p>
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-900/50">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                      🌍
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Mobility Node</span>
                  </div>
               </div>
               <div className="glass p-12 rounded-[3.5rem] border-slate-800 hover:border-unicou-orange/20 transition-all group">
                  <h3 className="text-3xl font-display font-bold mb-6 tracking-tight">Our <span className="text-unicou-orange">Mission</span></h3>
                  <p className="text-slate-400 leading-relaxed text-lg mb-8">
                    Guided by ethics, expertise, and personalized support, our mission is to streamline study abroad journeys, immigration pathways, and professional placements. We are dedicated to helping individuals realize their aspirations with confidence while fostering strong partnerships.
                  </p>
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-900/50">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                      🎯
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Client Aspirations Focused</span>
                  </div>
               </div>
            </div>

            <section className="mb-24">
              <h2 className="text-4xl font-display font-bold mb-12 text-center">What We <span className="text-unicou-orange">Do</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass p-10 rounded-[3rem] border-slate-800">
                  <h4 className="text-xl font-bold mb-4 text-white">Study Abroad</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Comprehensive guidance for destinations including UK, USA, Canada, Australia, NZ, Ireland, Europe, UAE, Malaysia, and Turkey. Tailored counseling, admissions, and visa support managed with meticulous care.
                  </p>
                </div>
                <div className="glass p-10 rounded-[3rem] border-slate-800">
                  <h4 className="text-xl font-bold mb-4 text-white">Immigration Services</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Supporting skilled individuals, entrepreneurs, and remote professionals. From skilled migration and business immigration to citizenship by investment and digital nomad visas.
                  </p>
                </div>
                <div className="glass p-10 rounded-[3rem] border-slate-800">
                  <h4 className="text-xl font-bold mb-4 text-white">Exam Solutions</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Official vouchers and prep tools for IELTS, PTE, TOEFL, Skills for English, LanguageCert, DET, GRE, SAT, and GMAT. Flexible e-learning resources for confidence building.
                  </p>
                </div>
              </div>
            </section>

            <div className="glass p-16 rounded-[4rem] border-slate-800 bg-unicou-orange/5 relative overflow-hidden mb-24">
               <h2 className="text-4xl font-display font-bold mb-8">Why Work <span className="text-unicou-orange">With Us</span></h2>
               <p className="text-slate-300 text-lg leading-relaxed mb-12">
                 Choosing us means choosing experience—more than a decade of trusted service, a global perspective, and expert guidance that speaks both to your personal aspirations and to international standards. Our advisors are certified and trained by leading global organizations, ensuring high-quality counseling that is both ethical and effective.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
                   <h5 className="font-bold text-white mb-3">Corporate Placement</h5>
                   <p className="text-slate-500 text-sm">Matching international talent with strategic opportunities. We help organizations navigate compliance, workforce planning, and global talent acquisition.</p>
                 </div>
                 <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
                   <h5 className="font-bold text-white mb-3">Institution Partnership</h5>
                   <p className="text-slate-500 text-sm">Collaborating with universities and training providers to support recruitment and international program success through strategic engagement.</p>
                 </div>
               </div>
            </div>

            <div className="text-center mb-24">
              <h2 className="text-3xl font-display font-bold mb-6">Looking <span className="text-unicou-orange">Ahead</span></h2>
              <div className="glass p-10 rounded-[3rem] border-slate-800 max-w-4xl mx-auto">
                <p className="text-slate-300 text-lg leading-relaxed italic">
                  Building on our strong legacy, we are actively planning expansion into the Middle East, India, China, Nepal, Bangladesh, Nigeria and Ghana. This next phase will deepen our global network and create more opportunities worldwide.
                </p>
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-3xl font-display font-bold mb-12">Global Headquarters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {OFFICE_LOCATIONS.map((loc, i) => (
                  <div key={i} className="glass p-8 rounded-[2.5rem] border border-slate-800 text-left">
                    <p className="text-unicou-orange font-black text-[10px] uppercase tracking-[0.3em] mb-3">{loc.country}</p>
                    <p className="text-slate-300 font-medium text-lg leading-relaxed">{loc.address}</p>
                  </div>
                ))}
              </div>
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
        return (
          <div className="py-40 text-center">
             <p className="text-slate-500 font-mono text-xs">Error: View Node Not Found</p>
             <button onClick={() => navigateTo({ type: 'home' })} className="mt-4 text-primary-400 font-bold hover:underline">Return to Home Node</button>
          </div>
        );
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

      <footer className="bg-slate-950 border-t border-slate-900 py-16 mt-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
             <div className="mb-6">
              <img 
                src={LOGO_SRC} 
                alt="UNICOU Logo" 
                className="h-10 w-auto object-contain"
              />
             </div>
             <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed mb-6">Global Academic Mobility Hub <br /> Unified Infrastructure v2.0</p>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-8">Our Global Offices</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {OFFICE_LOCATIONS.map((loc, i) => (
                <div key={i} className="space-y-2">
                  <h5 className="text-[9px] font-black text-unicou-orange uppercase tracking-widest">{loc.country}</h5>
                  <p className="text-[10px] text-slate-400 leading-relaxed max-w-[240px]">{loc.address}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-[10px] font-black text-slate-600 uppercase mb-8 tracking-widest">Explore</h4>
            <ul className="space-y-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <li><button onClick={() => navigateTo({ type: 'store' })} className="hover:text-unicou-orange transition-colors">Voucher Sale</button></li>
              <li><button onClick={() => navigateTo({ type: 'library' })} className="hover:text-unicou-orange transition-colors">Library</button></li>
              <li><button onClick={() => navigateTo({ type: 'lms-dashboard' })} className="hover:text-unicou-orange transition-colors">Academy</button></li>
              <li><button onClick={() => navigateTo({ type: 'policy', policyId: 'privacy' })} className="hover:text-unicou-orange transition-colors">Privacy Policy</button></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-900 flex justify-between items-center text-[9px] font-bold text-slate-600 uppercase tracking-widest">
           <p>© 2024 UNICOU. All rights reserved.</p>
           <p>Authorized Fulfillment Center</p>
        </div>
      </footer>

      <AIChat />
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} onNavigate={navigateTo} />}
    </div>
  );
};

export default App;
