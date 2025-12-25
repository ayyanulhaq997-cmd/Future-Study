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
import AgentDashboard from './components/AgentDashboard';
import PartnerShowcase from './components/PartnerShowcase';
import CookieConsent from './components/CookieConsent';
import { ViewState, User } from './types';
import { api } from './services/apiService';
import { LOGO_SRC } from './constants/assets';

const POLICY_CONTENT: Record<string, { title: string; content: string }> = {
  'modern-slavery': { 
    title: 'Modern Slavery Policy', 
    content: `Modern Slavery and Human Trafficking Statement
Modern Slavery Statement – UniCou Ltd
UniCou Ltd is committed to preventing modern slavery and human trafficking in all its business operations and supply chains. We recognise our responsibility under the UK Modern Slavery Act 2015 and support international efforts to eradicate slavery, forced labour, child labour, and human trafficking.

UniCou Ltd operates as an education consultancy firm based in the United Kingdom, working with students, academic institutions, training providers, agents, and business partners across multiple countries. We take a zero-tolerance approach to modern slavery and expect the same high standards from all our partners, suppliers, and associates worldwide.

Our business model does not involve manufacturing or high-risk labour sectors; however, we acknowledge that risks may exist within extended supply chains, particularly in international operations. We actively assess and monitor risks through due diligence, contractual obligations, and ethical standards.

All staff members are expected to act ethically and report any concerns related to modern slavery. We provide guidance to employees to help them recognise signs of exploitation and understand reporting procedures. Any reported concerns are taken seriously and investigated promptly.

UniCou Ltd only engages with suppliers and associates who demonstrate lawful employment practices and compliance with applicable labour laws. We reserve the right to terminate relationships where breaches of modern slavery laws are identified.

This statement is reviewed annually and reflects our ongoing commitment to ethical business practices and human rights protection.` 
  },
  'privacy': { 
    title: 'Privacy Policy', 
    content: `UniCou Ltd is committed to protecting personal data and respecting privacy rights. This Privacy Policy explains how we collect, use, store, and share personal data in compliance with the UK GDPR, Data Protection Act 2018, and applicable international data protection laws.

We collect personal data such as names, contact details, academic records, and identification documents for legitimate business purposes, including student counselling, university applications, visa guidance, marketing, and service improvement.

Personal data may be shared with trusted associates, partner institutions, service providers, and regulatory authorities where necessary and lawful. Such sharing supports education placement, legal compliance, business development, lead management, and market analysis.

We implement appropriate technical and organisational measures to safeguard personal data. Data is retained only for as long as necessary for its intended purpose or legal obligations.

Individuals have rights regarding their personal data, including access, correction, deletion, and objection to processing. Requests can be made by contacting UniCou Ltd directly.` 
  },
  'accessibility': {
    title: 'Accessibility Statement',
    content: `Website Accessibility Statement – UniCou Ltd
UniCou Ltd is committed to ensuring digital accessibility for all users, including people with disabilities. We aim to provide a website experience that is inclusive, user-friendly, and compliant with recognised accessibility standards.

Our website is designed to align with the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA, and relevant UK accessibility regulations. We strive to ensure that our content is accessible through assistive technologies such as screen readers, keyboard navigation, and text enlargement tools.

We regularly review our website design, structure, and content to improve accessibility. This includes ensuring readable fonts, appropriate colour contrast, alternative text for images, and clear navigation.

While we make every effort to maintain accessibility across all areas of our website, some third-party tools or external content may not fully meet accessibility standards. We continue to work with providers to improve accessibility where possible.

If you experience difficulty accessing any part of our website or require information in an alternative format, please contact us. We are committed to responding promptly and making reasonable adjustments where feasible.`
  },
  'terms': { 
    title: 'Terms of Use', 
    content: `These Website Terms of Use govern access to and use of the UniCou Ltd website. By using our website, you agree to comply with these terms and all applicable UK and international laws.

Website content is provided for general information purposes only and does not constitute legal, academic, or immigration advice. While we strive for accuracy, we do not guarantee completeness or reliability.

All intellectual property on this website, including text, logos, and design, belongs to UniCou Ltd unless otherwise stated. Unauthorised use or reproduction is prohibited.

We are not responsible for third-party websites linked from our site. Users access external links at their own risk.

UniCou Ltd reserves the right to update website content and terms at any time. Continued use of the website constitutes acceptance of the updated terms.` 
  },
  'whistleblowing': {
    title: 'Whistleblowing Policy',
    content: `UniCou Ltd encourages openness and transparency and is committed to conducting business with honesty and integrity. This Whistleblowing Policy provides a framework for employees, contractors, partners, and associates to report concerns safely and confidentially.

Whistleblowing concerns may include unlawful activity, fraud, corruption, data misuse, modern slavery, unethical conduct, or breaches of company policy. Reports can be made without fear of retaliation.

All disclosures are treated seriously and investigated appropriately. UniCou Ltd ensures confidentiality and protects whistleblowers in line with the Public Interest Disclosure Act 1998.

Concerns can be raised internally through designated reporting channels. Where appropriate, matters may be escalated to external authorities.

Retaliation against whistleblowers is strictly prohibited and may result in disciplinary action.`
  },
  'carbon': {
    title: 'Carbon Reduction Plan',
    content: `UniCou Ltd recognises its responsibility to reduce environmental impact and contribute to global sustainability goals. We are committed to reducing carbon emissions across our operations in line with UK environmental policies and international climate objectives.

As a service-based organisation, our environmental impact primarily relates to office operations, energy usage, digital infrastructure, and business travel. We actively seek to minimise emissions through remote working practices, digital communication, and efficient resource use.

We encourage responsible travel, reduce paper consumption, and support energy-efficient technologies. Where possible, we work with suppliers who share our commitment to environmental responsibility.

UniCou Ltd continuously monitors environmental performance and seeks opportunities for improvement. Our carbon reduction strategy evolves as our business grows and as sustainability standards advance.`
  },
  'cookies': {
    title: 'Cookie Use Policy',
    content: `UniCou Ltd uses cookies and similar technologies to enhance user experience, analyse website performance, and support marketing activities. This Cookie Policy explains how and why cookies are used when you visit our website.

Cookies are small text files stored on your device that help websites function efficiently. We use essential cookies required for website operation, as well as analytical and marketing cookies to understand user behaviour and improve our services.

Our use of cookies complies with the UK GDPR, Data Protection Act 2018, and Privacy and Electronic Communications Regulations (PECR). Where required, we seek user consent before placing non-essential cookies.

Some cookies may be placed by trusted third-party service providers for analytics, advertising, or functionality purposes. These providers process data in accordance with their own privacy policies.

You can manage or disable cookies through your browser settings at any time. Please note that disabling cookies may affect website functionality.`
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
            <Hero onStart={() => navigateTo({ type: 'store' })} onResellerClick={() => navigateTo({ type: 'apply', formType: 'agent-reg', context: 'Partner Entry' })} />
            <Features />
            <PartnerShowcase />
            <div id="destination-directory" className="scroll-mt-32">
               <CountryList onNavigateToGuide={(slug) => navigateTo({ type: 'country-guide', slug })} />
            </div>
            <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="glass p-16 rounded-[4rem] border-slate-800 shadow-3xl">
                  <h2 className="text-4xl font-display font-bold mb-8">Academic <span className="text-unicou-orange">Excellence</span></h2>
                  <p className="text-slate-400 text-xl leading-relaxed mb-10 italic">UNICOU provides a seamless bridge for global scholars. Automated infrastructure handling complex mobility routes.</p>
                  <button onClick={() => navigateTo({ type: 'apply', formType: 'student-apply', context: 'Admission node' })} className="px-12 py-5 bg-primary-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-2xl">Get Free Guidance</button>
               </div>
               <div className="glass p-16 rounded-[4rem] border-slate-800 bg-unicou-orange/5 shadow-3xl">
                  <h2 className="text-4xl font-display font-bold mb-8">Voucher <span className="text-unicou-orange">Vault</span></h2>
                  <p className="text-slate-400 text-xl leading-relaxed mb-10">Instant digital procurement for PTE, IELTS, and TOEFL. Fulfillment dispatched to verified email node.</p>
                  <button onClick={() => navigateTo({ type: 'store' })} className="px-12 py-5 bg-unicou-orange text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-2xl">Enter Shop</button>
               </div>
            </section>
          </div>
        );
      case 'store':
        return <div className="view-container animate-in fade-in duration-700"><VoucherStore onCheckout={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} onBook={(p) => navigateTo({ type: 'apply', formType: 'student-apply', context: `Booking: ${p}` })} onNavigateToAgent={() => navigateTo({ type: 'agent' })} /></div>;
      case 'apply':
        return <div className="max-w-4xl mx-auto view-container px-4"><ApplyForm type={view.formType} context={view.context} /></div>;
      case 'country-list':
        return <div className="view-container"><CountryList onNavigateToGuide={(slug) => navigateTo({ type: 'country-guide', slug })} /></div>;
      case 'country-guide':
        return <div className="view-container"><CountryGuide slug={view.slug} onViewUniversity={(uSlug) => navigateTo({ type: 'university', slug: uSlug })} onRegister={() => navigateTo({ type: 'apply', formType: 'student-apply', context: `Register: ${view.slug}` })} /></div>;
      case 'lms-dashboard':
        return <div className="view-container"><LMSDashboard onNavigate={navigateTo} /></div>;
      case 'course-catalogue':
        return <div className="view-container"><CourseCatalogue onCheckout={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} /></div>;
      case 'checkout':
        return <div className="view-container min-h-[80vh]"><CheckoutProcess productId={view.productId} quantity={view.quantity} onSuccess={(oid) => navigateTo({ type: 'success', orderId: oid })} onCancel={() => navigateTo({ type: 'store' })} /></div>;
      case 'success':
        return <div className="view-container"><SuccessScreen orderId={view.orderId} onClose={() => navigateTo({ type: 'store' })} /></div>;
      case 'university':
        return <div className="view-container"><UniversityProfile slug={view.slug} /></div>;
      case 'admin':
        if (!user || !['Admin', 'Finance', 'Teller'].includes(user.role)) return <div className="view-container text-center text-red-500 font-bold">Access Authority Required.</div>;
        return <div className="view-container"><AdminDashboard /></div>;
      case 'agent':
        if (!user || user.role !== 'Agent') return <div className="view-container text-center">Please login with Partner Credentials.</div>;
        return <div className="view-container"><AgentDashboard user={user} onBuy={(p, q) => navigateTo({ type: 'checkout', productId: p, quantity: q })} /></div>;
      case 'login': 
        return <div className="view-container"><Login onLogin={(u) => { setUser(u); navigateTo(u.role === 'Admin' || u.role === 'Finance' || u.role === 'Teller' ? { type: 'admin' } : u.role === 'Agent' ? { type: 'agent' } : { type: 'home' }); }} onNavigateToSignup={() => navigateTo({ type: 'signup' })} /></div>;
      case 'signup':
        return <div className="view-container"><Signup onSuccess={(e) => navigateTo({ type: 'verification-pending', email: e })} onNavigateToLogin={() => navigateTo({ type: 'login' })} /></div>;
      case 'verification-pending':
        return <div className="view-container"><VerificationPending email={view.email} onVerified={() => navigateTo({ type: 'login' })} /></div>;
      case 'about':
        return (
          <div className="max-w-7xl mx-auto view-container px-6 animate-in fade-in duration-700 pb-24">
            <div className="text-center mb-24">
               <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 tracking-tighter">About <span className="text-unicou-orange">Us</span></h1>
               <div className="h-1.5 w-32 bg-unicou-orange mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32">
               <div className="lg:col-span-7">
                  <div className="glass p-12 md:p-16 rounded-[4rem] border-slate-800 shadow-3xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-unicou-orange" />
                    <h2 className="text-4xl font-display font-bold mb-8 text-white">Our Story</h2>
                    <div className="space-y-6 text-slate-300 text-lg leading-relaxed font-medium">
                      <p>
                        Founded with a passion for global education and international opportunity, we are a leading international education and immigration consultancy with deep roots and a growing global footprint. Our journey began in 2009 in Pakistan, where we first opened our doors to support ambitious students and professionals in navigating the complexities of studying, living, and working abroad. Over the years, we have built a reputation rooted in transparency, integrity, and long-term success.
                      </p>
                      <p>
                        As of 2023, we expanded our operations to include offices in the United Kingdom and Dubai, enhancing our ability to serve clients with localized expertise in two of the world’s most competitive education and migration markets. Our founder’s extensive professional training—including certifications from British Council UK agent training, ICEF Trained Agent Counsellor, AIRC enrollment management for U.S. education, and regional credentials such as Ireland Certified Counsellor—ensures that our guidance is both expert and trustworthy.
                      </p>
                      <p>
                        We are also proud to be linked with globally recognized testing and recruitment partners including LanguageCert, Skills for English, TOEFL, Oxford ELLT, and Duolingo, and to operate as UKVI and Pearson approved test centers, reinforcing our leadership in secure English language testing and preparation.
                      </p>
                    </div>
                  </div>
               </div>
               <div className="lg:col-span-5 flex flex-col gap-8">
                  <div className="glass p-10 rounded-[3rem] border-primary-500/20 bg-primary-600/5 shadow-2xl relative overflow-hidden group">
                     <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-all" />
                     <h3 className="text-2xl font-display font-bold mb-4 text-primary-400 flex items-center gap-3">
                       <span className="w-10 h-10 rounded-xl bg-primary-400/10 flex items-center justify-center text-sm">👁️</span>
                       Vision
                     </h3>
                     <p className="text-slate-200 text-lg italic leading-relaxed">
                       "To become the most trusted gateway for students, professionals, and institutions seeking global education and mobility solutions. We aspire to simplify international pathways, empower every client with informed choices, and build bridges between talent and opportunity across continents."
                     </p>
                  </div>
                  <div className="glass p-10 rounded-[3rem] border-unicou-orange/20 bg-unicou-orange/5 shadow-2xl relative overflow-hidden group">
                     <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-unicou-orange/10 rounded-full blur-3xl group-hover:bg-unicou-orange/20 transition-all" />
                     <h3 className="text-2xl font-display font-bold mb-4 text-unicou-orange flex items-center gap-3">
                       <span className="w-10 h-10 rounded-xl bg-unicou-orange/10 flex items-center justify-center text-sm">🚀</span>
                       Mission
                     </h3>
                     <p className="text-slate-200 text-lg italic leading-relaxed">
                       "Guided by ethics, expertise, and personalized support, our mission is to streamline study abroad journeys, immigration pathways, and professional placements. We are dedicated to helping individuals realize their aspirations with confidence while fostering strong partnerships with educational institutions and global industry networks."
                     </p>
                  </div>
               </div>
            </div>

            <div className="mb-32">
               <div className="flex justify-between items-end mb-12">
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-3 block">Operational Scopes</span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold">What We <span className="text-primary-400">Do</span></h2>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="glass p-10 rounded-[3rem] border-slate-800 hover:border-primary-500/30 transition-all shadow-xl">
                     <div className="w-14 h-14 bg-primary-600/10 rounded-2xl flex items-center justify-center text-3xl mb-8">🎓</div>
                     <h4 className="text-2xl font-bold mb-4">Study Abroad</h4>
                     <p className="text-slate-400 text-sm leading-relaxed mb-6">
                       Comprehensive guidance for destinations including the UK, USA, Canada, Australia, NZ, Ireland, Cyprus, Germany, Italy, Sweden, Finland, Europe Hub, Dubai, Malaysia, and Turkey.
                     </p>
                     <p className="text-slate-500 text-xs italic font-medium">From tailored university counseling to admissions and visa support, we manage every step with meticulous care.</p>
                  </div>
                  <div className="glass p-10 rounded-[3rem] border-slate-800 hover:border-primary-500/30 transition-all shadow-xl">
                     <div className="w-14 h-14 bg-primary-600/10 rounded-2xl flex items-center justify-center text-3xl mb-8">🛂</div>
                     <h4 className="text-2xl font-bold mb-4">Immigration</h4>
                     <p className="text-slate-400 text-sm leading-relaxed mb-6">
                       Support for skilled individuals, entrepreneurs, and remote professionals. Strategic advice aligned with your long-term goals for residency or citizenship by investment.
                     </p>
                     <p className="text-slate-500 text-xs italic font-medium">Skilled migration, business immigration, digital nomad visas, and citizenship consultancy.</p>
                  </div>
                  <div className="glass p-10 rounded-[3rem] border-slate-800 hover:border-primary-500/30 transition-all shadow-xl">
                     <div className="w-14 h-14 bg-primary-600/10 rounded-2xl flex items-center justify-center text-3xl mb-8">💻</div>
                     <h4 className="text-2xl font-bold mb-4">Exam & E-Learning</h4>
                     <p className="text-slate-400 text-sm leading-relaxed mb-6">
                       Official vouchers and prep tools for IELTS, PTE, TOEFL, Skills for English, LanguageCert, Duolingo, ELLT, GRE, SAT, and GMAT.
                     </p>
                     <p className="text-slate-500 text-xs italic font-medium">Flexible, effective study tools via our integrated digital library and learning hub.</p>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-32">
               <div className="glass p-12 rounded-[4rem] border-slate-800 shadow-2xl flex flex-col justify-center">
                  <h3 className="text-3xl font-display font-bold mb-6">Why Work <span className="text-unicou-orange">With Us</span></h3>
                  <p className="text-slate-300 text-lg leading-relaxed font-medium mb-8">
                    Choosing us means choosing experience—more than a decade of trusted service, a global perspective, and expert guidance that speaks both to your personal aspirations and to international standards.
                  </p>
                  <ul className="space-y-4">
                     {[
                       'Certified & Global-Trained Advisors',
                       'Ethical & Effective Counseling Registry',
                       'Long-term Institutional Partnerships',
                       'Clarity and support through every node'
                     ].map(item => (
                       <li key={item} className="flex items-center gap-4 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                         <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">✓</span>
                         {item}
                       </li>
                     ))}
                  </ul>
               </div>
               <div className="space-y-8">
                  <div className="glass p-10 rounded-[3rem] border-slate-800 hover:bg-white/[0.02] transition-colors">
                     <h4 className="text-xl font-bold mb-4 text-white">Corporate Placement & Sponsor Solutions</h4>
                     <p className="text-slate-400 text-sm leading-relaxed">
                       We work alongside employers and recruitment networks to match international talent with strategic opportunities, helping organizations navigate compliance and workforce planning.
                     </p>
                  </div>
                  <div className="glass p-10 rounded-[3rem] border-slate-800 hover:bg-white/[0.02] transition-colors">
                     <h4 className="text-xl font-bold mb-4 text-white">Institution Partnership</h4>
                     <p className="text-slate-400 text-sm leading-relaxed">
                       Collaborating with universities, colleges, and training providers to support student recruitment, brand visibility, and international program success through strategic engagement.
                     </p>
                  </div>
               </div>
            </div>

            <div className="glass p-12 md:p-24 rounded-[5rem] border border-primary-500/20 text-center relative overflow-hidden shadow-3xl">
               <div className="absolute top-0 right-0 p-16 opacity-5 font-display font-black text-[12rem] tracking-tighter select-none pointer-events-none">NEXT</div>
               <div className="relative z-10">
                  <span className="text-[10px] font-black text-primary-400 uppercase tracking-[0.6em] mb-8 block">Projecting Success</span>
                  <h2 className="text-4xl md:text-7xl font-display font-bold mb-8 tracking-tighter">Looking <span className="text-primary-400">Ahead</span></h2>
                  <p className="text-slate-300 text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto font-medium mb-12">
                    Building on our strong legacy in Pakistan, the UK, and Dubai, we are actively planning expansion into the Middle East, India, China, Nepal, Bangladesh, Nigeria and Ghana. This next phase will deepen our global network and create more opportunities for students, agents, and preparation centers worldwide.
                  </p>
                  <button onClick={() => navigateTo({ type: 'apply', formType: 'general', context: 'Strategic Partnership Inquiry' })} className="px-12 py-6 bg-white text-slate-950 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl">
                    Join Our Expansion Registry
                  </button>
               </div>
            </div>
          </div>
        );
      case 'policy':
        const policy = POLICY_CONTENT[view.policyId];
        return (
          <div className="max-w-4xl mx-auto view-container px-6 animate-in fade-in">
            <h1 className="text-5xl font-display font-bold mb-10">{policy?.title}</h1>
            <div className="glass p-12 rounded-[3rem] border-slate-800 text-slate-400 leading-relaxed italic text-lg whitespace-pre-wrap">
              {policy?.content}
            </div>
          </div>
        );
      default:
        return <div className="view-container text-center">Endpoint Node Unmapped.</div>;
    }
  };

  const handleLogout = () => { api.logout(); setUser(null); navigateTo({ type: 'home' }); };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 overflow-x-hidden selection:bg-unicou-orange selection:text-white">
      <Navbar view={view} user={user} scrolled={scrolled} onNavigate={navigateTo} onLogout={handleLogout} onOpenSearch={() => setSearchOpen(true)} />
      <main className="relative z-0">
        {renderContent()}
      </main>
      <footer className="bg-slate-950 border-t border-slate-900 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 pb-20">
            <div className="md:col-span-1">
               <img src={LOGO_SRC} alt="UNICOU" className="h-32 w-auto mb-10" />
               <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed">Unified Mobility Infrastructure v2.2<br />Authorized Fulfillment Center</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-12">
              {OFFICE_LOCATIONS.map((loc, i) => (
                <div key={i} className="space-y-3">
                  <h5 className="text-[10px] font-black text-primary-400 uppercase tracking-widest">{loc.country} Node</h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-bold italic">{loc.address}</p>
                </div>
              ))}
            </div>
            <div className="md:col-span-1 space-y-6">
              <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Connect</h4>
              <ul className="space-y-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <li><button onClick={() => navigateTo({ type: 'store' })} className="hover:text-unicou-orange">Voucher Store</button></li>
                <li><button onClick={() => navigateTo({ type: 'careers' })} className="hover:text-unicou-orange">Careers Node</button></li>
                <li><button onClick={() => navigateTo({ type: 'lms-dashboard' })} className="hover:text-unicou-orange">Learning Hub</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-900 pt-16 flex flex-wrap gap-8 text-[10px] font-black uppercase tracking-widest text-slate-600">
             {Object.entries(POLICY_CONTENT).map(([id, p]) => (
               <button key={id} onClick={() => navigateTo({ type: 'policy', policyId: id })} className="hover:text-primary-400">{p.title}</button>
             ))}
             <p className="ml-auto">© 2024 UNICOU. S/N: GLOBAL-ACAD-2024</p>
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