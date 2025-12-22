
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
    content: `Modern Slavery and Human Trafficking Statement – UniCou Ltd\n\nUniCou Ltd is committed to preventing modern slavery and human trafficking in all its business operations and supply chains. We recognise our responsibility under the UK Modern Slavery Act 2015 and support international efforts to eradicate slavery, forced labour, child labour, and human trafficking.\n\nUniCou Ltd operates as an education consultancy firm based in the United Kingdom, working with students, academic institutions, training providers, agents, and business partners across multiple countries. We take a zero-tolerance approach to modern slavery and expect the same high standards from all our partners, suppliers, and associates worldwide.\n\nOur business model does not involve manufacturing or high-risk labour sectors; however, we acknowledge that risks may exist within extended supply chains, particularly in international operations. We actively assess and monitor risks through due diligence, contractual obligations, and ethical standards.\n\nAll staff members are expected to act ethically and report any concerns related to modern slavery. We provide guidance to employees to help them recognise signs of exploitation and understand reporting procedures. Any reported concerns are taken seriously and investigated promptly.\n\nUniCou Ltd only engages with suppliers and associates who demonstrate lawful employment practices and compliance with applicable labour laws. We reserve the right to terminate relationships where breaches of modern slavery laws are identified.`
  },
  'accessibility': {
    title: 'Accessibility Statement',
    content: `Website Accessibility Statement – UniCou Ltd\n\nUniCou Ltd is committed to ensuring digital accessibility for all users, including people with disabilities. We aim to provide a website experience that is inclusive, user-friendly, and compliant with recognised accessibility standards.\n\nOur website is designed to align with the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA, and relevant UK accessibility regulations. We strive to ensure that our content is accessible through assistive technologies such as screen readers, keyboard navigation, and text enlargement tools.\n\nWe regularly review our website design, structure, and content to improve accessibility. This includes ensuring readable fonts, appropriate colour contrast, alternative text for images, and clear navigation.\n\nWhile we make every effort to maintain accessibility across all areas of our website, some third-party tools or external content may not fully meet accessibility standards. We continue to work with providers to improve accessibility where possible.`
  },
  'privacy': {
    title: 'Privacy Policy',
    content: `Privacy Policy – UniCou Ltd\n\nUniCou Ltd is committed to protecting personal data and respecting privacy rights. This Privacy Policy explains how we collect, use, store, and share personal data in compliance with the UK GDPR, Data Protection Act 2018, and applicable international data protection laws.\n\nWe collect personal data such as names, contact details, academic records, and identification documents for legitimate business purposes, including student counselling, university applications, visa guidance, marketing, and service improvement.\n\nPersonal data may be shared with trusted associates, partner institutions, service providers, and regulatory authorities where necessary and lawful. Such sharing supports education placement, legal compliance, business development, lead management, and market analysis.\n\nWe implement appropriate technical and organisational measures to safeguard personal data. Data is retained only for as long as necessary for its intended purpose or legal obligations.\n\nIndividuals have rights regarding their personal data, including access, correction, deletion, and objection to processing. Requests can be made by contacting UniCou Ltd directly.`
  },
  'carbon': {
    title: 'Carbon Reduction Plan',
    content: `Carbon Reduction Plan – UniCou Ltd\n\nUniCou Ltd recognises its responsibility to reduce environmental impact and contribute to global sustainability goals. We are committed to reducing carbon emissions across our operations in line with UK environmental policies and international climate objectives.\n\nAs a service-based organisation, our environmental impact primarily relates to office operations, energy usage, digital infrastructure, and business travel. We actively seek to minimise emissions through remote working practices, digital communication, and efficient resource use.\n\nWe encourage responsible travel, reduce paper consumption, and support energy-efficient technologies. Where possible, we work with suppliers who share our commitment to environmental responsibility.\n\nUniCou Ltd continuously monitors environmental performance and seeks opportunities for improvement. Our carbon reduction strategy evolves as our business grows and as sustainability standards advance.`
  },
  'terms': {
    title: 'Website Terms of Use',
    content: `Website Terms of Use – UniCou Ltd\n\nThese Website Terms of Use govern access to and use of the UniCou Ltd website. By using our website, you agree to comply with these terms and all applicable UK and international laws.\n\nWebsite content is provided for general information purposes only and does not constitute legal, academic, or immigration advice. While we strive for accuracy, we do not guarantee completeness or reliability.\n\nAll intellectual property on this website, including text, logos, and design, belongs to UniCou Ltd unless otherwise stated. Unauthorised use or reproduction is prohibited.\n\nWe are not responsible for third-party websites linked from our site. Users access external links at their own risk.\n\nUniCou Ltd reserves the right to update website content and terms at any time. Continued use of the website constitutes acceptance of updated terms.`
  },
  'cookies': {
    title: 'Cookie Use Policy',
    content: `Cookie Use Policy – UniCou Ltd\n\nUniCou Ltd uses cookies and similar technologies to enhance user experience, analyse website performance, and support marketing activities. This Cookie Policy explains how and why cookies are used when you visit our website.\n\nCookies are small text files stored on your device that help websites function efficiently. We use essential cookies required for website operation, as well as analytical and marketing cookies to understand user behaviour and improve our services.\n\nOur use of cookies complies with the UK GDPR, Data Protection Act 2018, and Privacy and Electronic Communications Regulations (PECR). Where required, we seek user consent before placing non-essential cookies.\n\nSome cookies may be placed by trusted third-party service providers for analytics, advertising, or functionality purposes. These providers process data in accordance with their own privacy policies.\n\nYou can manage or disable cookies through your browser settings at any time. Please note that disabling cookies may affect website functionality.`
  },
  'whistleblowing': {
    title: 'Whistleblowing Policy',
    content: `Whistleblowing Policy – UniCou Ltd\n\nUniCou Ltd encourages openness and transparency and is committed to conducting business with honesty and integrity. This Whistleblowing Policy provides a framework for employees, contractors, partners, and associates to report concerns safely and confidentially.\n\nWhistleblowing concerns may include unlawful activity, fraud, corruption, data misuse, modern slavery, unethical conduct, or breaches of company policy. Reports can be made without fear of retaliation.\n\nAll disclosures are treated seriously and investigated appropriately. UniCou Ltd ensures confidentiality and protects whistleblowers in line with the Public Interest Disclosure Act 1998.\n\nConcerns can be raised internally through designated reporting channels. Where appropriate, matters may be escalated to external authorities.\n\nRetaliation against whistleblowers is strictly prohibited and may result in disciplinary action.`
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
            <CountryGuide 
              slug={view.slug} 
              onViewUniversity={(uSlug) => navigateTo({ type: 'university', slug: uSlug })} 
              onRegister={() => navigateTo({ type: 'apply', formType: 'study-abroad', context: `Registration: Study in ${view.slug.toUpperCase()}` })}
            />
          </div>
        );
      case 'immigration-guide':
        return (
          <div className="animate-in fade-in">
            <ImmigrationGuide 
              slug={view.slug} 
              onConsult={() => navigateTo({ type: 'apply', formType: 'immigration', context: `Consult: ${view.slug.replace('-', ' ').toUpperCase()}` })}
            />
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
          <div className="max-w-5xl mx-auto py-24 px-6 animate-in fade-in duration-1000">
            <div className="text-center mb-20">
              <h1 className="text-6xl md:text-8xl font-display font-bold mb-8 tracking-tighter text-white">
                About <span className="text-unicou-orange">UniCou</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
                Established in 2009, UniCou Ltd is a premier international education and immigration consultancy bridging the gap between talent and global opportunity.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-16 text-slate-300">
              <section className="glass p-10 md:p-14 rounded-[3.5rem] border-slate-800">
                <h2 className="text-3xl font-display font-bold mb-8 text-white tracking-tight">Our Legacy & Global Footprint</h2>
                <div className="prose prose-invert max-w-none space-y-6 text-lg leading-relaxed italic">
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
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass p-10 rounded-[3rem] border-primary-500/20">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500 mb-4">Vision</h3>
                  <p className="text-xl font-medium leading-relaxed text-slate-100">
                    To become the most trusted gateway for students, professionals, and institutions seeking global mobility solutions, empowering every client with informed choices across continents.
                  </p>
                </div>
                <div className="glass p-10 rounded-[3rem] border-unicou-orange/20">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-unicou-orange mb-4">Mission</h3>
                  <p className="text-xl font-medium leading-relaxed text-slate-100">
                    To streamline study abroad journeys and immigration pathways through ethics, expertise, and personalized support, fostering strong partnerships with industry networks worldwide.
                  </p>
                </div>
              </div>

              <section className="space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-4">
                    <h2 className="text-3xl font-display font-bold text-white tracking-tight sticky top-24">What We Do</h2>
                  </div>
                  <div className="lg:col-span-8 space-y-8">
                    <div className="glass p-8 rounded-[2.5rem] border-slate-800">
                      <h4 className="text-primary-400 font-black text-xs uppercase tracking-widest mb-4">Study Abroad Guidance</h4>
                      <p className="leading-relaxed">
                        We provide comprehensive study abroad guidance for destinations including the UK, USA, Canada, Australia, NZ, Ireland, Europe, Dubai, Malaysia, and Turkey. From tailored counseling to admissions and visa support, we manage every step with meticulous care.
                      </p>
                    </div>
                    <div className="glass p-8 rounded-[2.5rem] border-slate-800">
                      <h4 className="text-primary-400 font-black text-xs uppercase tracking-widest mb-4">Immigration Services</h4>
                      <p className="leading-relaxed">
                        Supporting skilled individuals, entrepreneurs, and remote professionals seeking new beginnings. Whether it’s skilled migration, business immigration, citizenship by investment, or digital nomad visas, we offer strategic advice aligned with long-term goals.
                      </p>
                    </div>
                    <div className="glass p-8 rounded-[2.5rem] border-slate-800">
                      <h4 className="text-primary-400 font-black text-xs uppercase tracking-widest mb-4">Exam & E-Learning</h4>
                      <p className="leading-relaxed">
                        Official vouchers and preparation tools for IELTS, PTE, TOEFL iBT, Duolingo, GRE, SAT, and GMAT. Our e-learning resources help candidates enhance their skills with flexible, effective study tools.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="glass p-10 md:p-14 rounded-[3.5rem] border-slate-800 bg-slate-900/20">
                <h2 className="text-3xl font-display font-bold mb-8 text-white tracking-tight">Why Work With Us</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <p className="leading-relaxed text-lg">
                    Choosing us means choosing over a decade of trusted service, a global perspective, and expert guidance. Our advisors are certified by leading global organizations, ensuring high-quality counseling that is both ethical and effective.
                  </p>
                  <p className="leading-relaxed text-lg">
                    We pride ourselves on building long-term relationships with students, professionals, and institutions, offering clarity and support at every stage of the international lifecycle.
                  </p>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass p-10 rounded-[3rem] border-slate-800">
                  <h3 className="text-lg font-bold text-white mb-4">Corporate Solutions</h3>
                  <p className="text-sm leading-relaxed text-slate-400">
                    We match international talent with strategic opportunities, helping organizations navigate compliance, workforce planning, and global talent acquisition with precision.
                  </p>
                </div>
                <div className="glass p-10 rounded-[3rem] border-slate-800">
                  <h3 className="text-lg font-bold text-white mb-4">Institution Partnership</h3>
                  <p className="text-sm leading-relaxed text-slate-400">
                    Collaborating with universities and training providers to support student recruitment, brand visibility, and international program success across key global regions.
                  </p>
                </div>
              </div>

              <section className="text-center py-20 bg-gradient-to-b from-transparent to-primary-600/5 rounded-[4rem]">
                <h2 className="text-4xl font-display font-bold text-white mb-6">Looking Ahead</h2>
                <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12">
                  Building on our strong legacy in Pakistan, the UK, and Dubai, we are actively planning expansion into the Middle East, India, China, Nepal, Bangladesh, Nigeria, and Ghana to deepen our global network.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                   {['Middle East', 'India', 'China', 'Nigeria', 'Ghana', 'Bangladesh'].map(region => (
                     <span key={region} className="px-6 py-2 glass border-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                       {region}
                     </span>
                   ))}
                </div>
              </section>
            </div>

            <section className="mt-32 max-w-4xl mx-auto">
              <ApplyForm type="general" context="Corporate Enquiries & Partnerships" />
            </section>
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
