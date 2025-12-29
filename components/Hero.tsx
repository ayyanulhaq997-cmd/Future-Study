import React from 'react';

interface HeroProps {
  onStart: () => void;
  onApplyClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart, onApplyClick }) => {
  const partners = [
    "PEARSON PTE", "BRITISH COUNCIL", "IDP IELTS", "OTHM UK", "OXFORD ELLT", 
    "CAMBRIDGE", "ETS TOEFL", "DUOLINGO", "VFS GLOBAL", "GTEC", "LANGUAGECERT"
  ];

  return (
    <section className="pt-40 pb-24 px-6 relative overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="text-slate-500 text-sm md:text-base italic mb-6 animate-slide-up block font-medium">
          Your Gateway to International Excellence
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-display font-black tracking-tighter mb-10 leading-[1.05] text-unicou-navy animate-slide-up uppercase">
          Global Education Hub: <br />
          <span className="text-unicou-orange">Study Abroad & Test Prep Specialist</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-4xl mx-auto mb-16 leading-relaxed font-bold animate-slide-up px-4">
          Secure your <span className="text-unicou-navy underline decoration-unicou-orange/30 underline-offset-4">University Admission</span>, 
          Master your Exams with our <span className="text-unicou-navy underline decoration-unicou-orange/30 underline-offset-4">LMS</span>, and 
          Save on <span className="text-unicou-navy underline decoration-unicou-orange/30 underline-offset-4">Official Vouchers</span> for IELTS, PTE, TOEFL, LanguageCert, Duolingo, GRE and more.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-slide-up">
          <button 
            onClick={onStart} 
            className="w-full sm:w-auto px-12 py-6 bg-unicou-orange text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-orange-600 shadow-action active:scale-95 flex items-center justify-center gap-3"
          >
            Voucher Store
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </button>
          <button 
            onClick={onApplyClick}
            className="w-full sm:w-auto px-12 py-6 bg-unicou-navy text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-slate-900 shadow-premium active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group"
          >
            <span className="relative z-10">Apply Now</span>
            <div className="absolute top-0 left-0 w-1 h-full bg-unicou-vibrant group-hover:w-full transition-all duration-500 opacity-20" />
            <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>

        {/* Eye-touching decorative element */}
        <div className="mt-24 flex justify-center">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-unicou-vibrant shadow-[0_0_8px_#00f2ff]"></div>
             <div className="vibrant-strip w-24"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-unicou-orange"></div>
          </div>
        </div>

        <div className="mt-40 pt-16 border-t border-slate-50">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-12">Institutional Partners</h4>
          <div className="flex gap-20 animate-marquee whitespace-nowrap opacity-50 hover:opacity-100 transition-opacity">
            {[...partners, ...partners].map((p, i) => (
              <div key={i} className="text-xl font-black text-unicou-navy uppercase tracking-tighter">
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 45s linear infinite;
          display: flex;
          width: max-content;
        }
      `}</style>
    </section>
  );
};

export default Hero;