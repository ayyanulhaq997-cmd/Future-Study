import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 bg-white animate-in fade-in duration-1000">
      {/* Header Section */}
      <div className="mb-24 text-center">
        <span className="text-[11px] font-black text-unicou-orange uppercase tracking-[0.5em] mb-4 block">Established 2009</span>
        <h1 className="text-6xl md:text-7xl font-display font-black text-unicou-navy mb-8 tracking-tighter leading-none uppercase italic">ABOUT UNICOU</h1>
        <div className="vibrant-strip mx-auto mb-12 w-24"></div>
      </div>

      {/* Main Introduction Section */}
      <div className="space-y-12 mb-32 max-w-5xl mx-auto">
        <p className="text-xl text-slate-700 font-medium leading-relaxed italic border-l-4 border-unicou-orange pl-10">
          UniCou is a UK-based worldwide educational consulting and learning company, where students, professionals, and institutions from around the globe place their trust. Since its inception in 2009, the company has evolved its educational advisory service into a world-class brand offering students ethical, transparent, and results-oriented educational services.
        </p>
        
        <p className="text-xl text-slate-700 font-medium leading-relaxed italic border-l-4 border-unicou-navy pl-10">
          With its headquarters in the United Kingdom and an additional branch in Dubai, UniCou operates on all continents, providing education, professional learning, and licensed evaluation services. We aim for clarity, credibility, and enduring benefits for the learners we assist.
        </p>

        <p className="text-xl text-slate-700 font-medium leading-relaxed italic border-l-4 border-slate-300 pl-10">
          UniCou has its roots in the organizational need for dependable, student-oriented guidance on studying abroad and an educational support system in the evolving global education framework. With the same purpose, we have been serving students and professionals globally, providing a unified educational framework that integrates consultancy, learning, and assessment services.
        </p>
      </div>

      {/* Accredited Authority */}
      <div className="mb-32">
        <div className="bg-slate-50 p-12 md:p-16 rounded-[4rem] border border-slate-100 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-5 font-black text-9xl uppercase tracking-tighter">Authority</div>
           <h2 className="text-4xl font-display font-black text-unicou-navy mb-10 uppercase tracking-tighter">Accredited Authority</h2>
           <div className="space-y-8 relative z-10">
              <p className="text-lg text-slate-600 font-bold leading-relaxed italic">
                UniCou is aligned with internationally recognized education and assessment bodies to ensure the highest standards of quality, transparency, and compliance. We are affiliated with LanguageCert, Skills for English, TOEFL, Oxford ELLT, Duolingo English Test, UKVI-approved test providers, and Pearson Partners.
              </p>
              <p className="text-lg text-slate-600 font-bold leading-relaxed italic">
                These affiliations enable UniCou to offer official exam vouchers, preparation resources, assessment support, and learning solutions on a single trusted platform. Our licensed consultants and education advisors uphold global best practices, ensuring accurate guidance and dependable outcomes for learners worldwide.
              </p>
           </div>
        </div>
      </div>

      {/* Vision & Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
         <div className="bg-unicou-navy p-16 rounded-[4rem] text-white shadow-3xl group hover:scale-[1.02] transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl">🔭</div>
            <h2 className="text-4xl font-display font-black uppercase mb-8 tracking-tighter">Our Vision</h2>
            <p className="text-slate-300 text-lg font-medium leading-relaxed italic relative z-10">
              "UniCou strives to facilitate international education pathways & to clarify the potential educational opportunities for learners worldwide. While educational journeys may be confusing, risky, and uncertain, we work to replace them with confidence."
            </p>
         </div>
         <div className="bg-unicou-orange p-16 rounded-[4rem] text-white shadow-3xl group hover:scale-[1.02] transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 text-8xl">🚀</div>
            <h2 className="text-4xl font-display font-black uppercase mb-8 tracking-tighter">Our Mission</h2>
            <p className="text-white/90 text-lg font-medium leading-relaxed italic relative z-10">
              "Our mission stems from an ethical, experiential, and humanistic lens to education. We limit our focus to international educational pathways, coupled with professional learning and assessment frameworks, and provide directional support for the constructive choice of academic and career pathways. We build trust to offer our services seamlessly."
            </p>
         </div>
      </div>

      {/* What We Do Section */}
      <div className="mb-32">
         <h2 className="text-4xl font-display font-black text-unicou-navy text-center mb-20 uppercase tracking-tighter">What We <span className="text-unicou-orange">Do</span></h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl hover:border-unicou-navy/20 transition-all flex flex-col group">
               <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest mb-6 border-b border-emerald-100 pb-2">Service 01</span>
               <h4 className="text-2xl font-display font-black text-slate-900 mb-6 uppercase">1. Study Abroad</h4>
               <p className="text-slate-500 font-bold italic leading-relaxed flex-grow">
                 "UniCou provides global study-abroad consultancy and assists students with university selection, applications, and academic planning for top destinations such as the UK, USA, Canada, Australia, New Zealand, Europe, Malaysia, Turkey, and Dubai. We ensure students' academic aspirations, budgets, and future career pathways are in sync."
               </p>
            </div>
            
            <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl hover:border-unicou-orange/20 transition-all flex flex-col group">
               <span className="text-unicou-orange font-black text-[10px] uppercase tracking-widest mb-6 border-b border-orange-100 pb-2">Service 02</span>
               <h4 className="text-2xl font-display font-black text-slate-900 mb-6 uppercase">2. Learning</h4>
               <p className="text-slate-500 font-bold italic leading-relaxed flex-grow">
                 "UniCou offers a wide array of education services, professional courses, and blended learning solutions for international students. From academic and professional courses to skills training, we utilize contemporary learning systems to support students and professionals who aspire to advance their academic and career goals globally."
               </p>
            </div>

            <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl hover:border-unicou-navy/20 transition-all flex flex-col group">
               <span className="text-blue-500 font-black text-[10px] uppercase tracking-widest mb-6 border-b border-blue-100 pb-2">Service 03</span>
               <h4 className="text-2xl font-display font-black text-slate-900 mb-6 uppercase text-sm">3. Discounted Vouchers & Exam Solutions</h4>
               <p className="text-slate-500 font-bold italic leading-relaxed flex-grow">
                 "UniCou issues exam vouchers at a reduced price and offers preparatory assistance tailored to the globally accepted standardized tests, including IELTS, PTE, TOEFL iBT, Oxford ELLT, Duolingo English Test, Skills for English, and others. Through our Learning Management System (LMS), students access their exam prep materials and university-grade professional solutions at a more affordable and efficient rate."
               </p>
            </div>
         </div>
      </div>

      {/* Why Choose UniCou */}
      <div className="mb-32">
         <div className="bg-slate-950 p-16 md:p-24 rounded-[5rem] text-white shadow-3xl relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 p-16 opacity-10 font-display font-black text-[12rem] uppercase pointer-events-none select-none italic tracking-tighter">WHY</div>
            
            <h2 className="text-5xl font-display font-black uppercase mb-10 tracking-tighter relative z-10">Why Choose UniCou</h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-12 relative z-10 opacity-50">(Why work with us)</p>
            
            <div className="max-w-4xl mx-auto space-y-10 relative z-10">
               <p className="text-xl md:text-2xl text-white font-medium italic leading-relaxed">
                 "UniCou provides trustworthy guidance with international knowledge and local understanding. Because of our credibility and transparency as a UK organization operating globally, we have positive international reviews. From the first consultation to supporting you until you are academically ready, UniCou provides uninterrupted and reliable education services focused on meeting your needs."
               </p>
               
               <div className="pt-16 border-t border-white/10">
                  <h3 className="text-2xl md:text-3xl font-display font-black text-unicou-orange uppercase tracking-tight">
                    UniCou – Trusted guidance for global education, learning, and assessment, from start to success.
                  </h3>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default About;
