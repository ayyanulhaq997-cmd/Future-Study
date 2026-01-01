
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 bg-white animate-in fade-in duration-1000">
      {/* Header Section */}
      <div className="mb-24 text-center">
        <span className="text-[11px] font-black text-unicou-orange uppercase tracking-[0.5em] mb-4 block">Established 2009</span>
        <h1 className="text-6xl md:text-[8rem] font-display font-black text-unicou-navy mb-8 tracking-tighter leading-none uppercase">About <span className="text-unicou-orange">UniCou</span></h1>
        <div className="vibrant-strip mx-auto mb-12 w-24"></div>
      </div>

      {/* Main Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32">
        <div className="lg:col-span-7 space-y-8 text-xl text-slate-700 font-medium leading-relaxed italic border-l-4 border-unicou-orange pl-10">
          <p>
            Founded with a passion for global education and international opportunity, we are a leading international education and immigration consultancy with deep roots and a growing global footprint. 
            Our journey began in 2009 in Pakistan, where we first opened our doors to support ambitious students and professionals in navigating the complexities of studying, living, and working abroad.
          </p>
          <p>
            As of 2023, we expanded our operations to include offices in the United Kingdom and Dubai, enhancing our ability to serve clients with localized expertise in two of the world’s most competitive education and migration markets.
          </p>
          <p>
            Our founder’s extensive professional training—including certifications from British Council UK agent training, ICEF Trained Agent Counsellor, AIRC enrollment management for U.S. education, and regional credentials such as Ireland Certified Counsellor—ensures that our guidance is both expert and trustworthy.
          </p>
        </div>
        <div className="lg:col-span-5 bg-slate-50 p-12 rounded-[4rem] border border-slate-100 shadow-2xl flex flex-col justify-center relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-5 font-black text-9xl">UC</div>
           <h3 className="text-2xl font-black text-unicou-navy uppercase mb-6 tracking-tight">Accredited Authority</h3>
           <p className="text-slate-500 text-sm font-bold leading-relaxed mb-8">
             We are proud to be linked with globally recognized testing and recruitment partners including LanguageCert, Skills for English, TOEFL, Oxford ELLT, and Duolingo. We operate as UKVI and Pearson approved test centers.
           </p>
           <div className="flex gap-4">
              <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase">UKVI Approved</div>
              <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase">Pearson Partner</div>
           </div>
        </div>
      </div>

      {/* Vision & Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
         <div className="bg-unicou-navy p-16 rounded-[4rem] text-white shadow-3xl group hover:scale-[1.02] transition-all">
            <span className="text-4xl mb-6 block">🔭</span>
            <h2 className="text-4xl font-display font-black uppercase mb-6">Our Vision</h2>
            <p className="text-slate-300 text-lg font-medium leading-relaxed italic">
              "To become the most trusted gateway for students, professionals, and institutions seeking global education and mobility solutions. We aspire to simplify international pathways and build bridges between talent and opportunity across continents."
            </p>
         </div>
         <div className="bg-unicou-orange p-16 rounded-[4rem] text-white shadow-3xl group hover:scale-[1.02] transition-all">
            <span className="text-4xl mb-6 block">🚀</span>
            <h2 className="text-4xl font-display font-black uppercase mb-6">Our Mission</h2>
            <p className="text-white/90 text-lg font-medium leading-relaxed italic">
              "Guided by ethics, expertise, and personalized support, our mission is to streamline study abroad journeys, immigration pathways, and professional placements. We are dedicated to helping individuals realize their aspirations with confidence."
            </p>
         </div>
      </div>

      {/* Services Grid */}
      <div className="mb-32">
         <h2 className="text-4xl font-display font-black text-unicou-navy text-center mb-20 uppercase tracking-tighter">What We <span className="text-unicou-orange">Do</span></h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                title: "Study Abroad", 
                text: "Comprehensive guidance for UK, USA, Canada, Australia, NZ, Europe, Dubai, Malaysia, and Turkey. Admissions and visa support managed with meticulous care." 
              },
              { 
                title: "Immigration", 
                text: "Support for skilled migration, business immigration, citizenship by investment, and digital nomad visas aligned with long-term goals." 
              },
              { 
                title: "Exam Solutions", 
                text: "Official vouchers and preparation tools for IELTS, PTE, TOEFL, Skills for English, GRE, GMAT and more via our high-performance LMS." 
              }
            ].map(service => (
              <div key={service.title} className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl hover:border-unicou-orange/20 transition-all">
                 <h4 className="text-2xl font-display font-black text-slate-900 mb-4 uppercase">{service.title}</h4>
                 <p className="text-slate-500 font-bold italic leading-relaxed">"{service.text}"</p>
              </div>
            ))}
         </div>
      </div>

      {/* Final Sections */}
      <div className="space-y-12">
         <div className="bg-slate-50 p-16 rounded-[5rem] border border-slate-200">
            <div className="max-w-4xl mx-auto text-center">
               <h3 className="text-3xl font-display font-black text-unicou-navy mb-8 uppercase">Looking Ahead</h3>
               <p className="text-xl text-slate-600 font-medium italic leading-relaxed">
                 Building on our legacy, we are actively planning expansion into the Middle East, India, China, Nepal, Bangladesh, Nigeria and Ghana. This next phase will deepen our global network and create more opportunities for our community.
               </p>
            </div>
         </div>
         <div className="flex flex-col md:flex-row justify-between items-center bg-slate-950 p-12 rounded-[4rem] text-white shadow-3xl">
            <div className="mb-8 md:mb-0">
               <h3 className="text-2xl font-display font-black uppercase mb-2">Institution Partnerships</h3>
               <p className="text-slate-400 font-medium italic">"Collaborating globally to connect meaningful talent with learners."</p>
            </div>
            <button className="px-12 py-5 bg-unicou-orange text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all">Connect with Hub</button>
         </div>
      </div>
    </div>
  );
};

export default About;
