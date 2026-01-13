
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
    <section className="pt-24 pb-16 px-6 relative overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="text-slate-400 text-xs italic mb-6 animate-slide-up block font-bold uppercase tracking-[0.2em]">
          Established 2009 • Global Mobility Protocol
        </div>
        
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black tracking-tighter mb-8 leading-[1.05] text-unicou-navy animate-slide-up uppercase">
          Global Education Hub <br />
          <span className="text-unicou-orange">Study Abroad & Test Prep Specialist</span>
        </h1>
        
        <p className="text-base md:text-lg text-slate-500 max-w-4xl mx-auto mb-12 leading-relaxed font-bold animate-slide-up px-4 italic">
          Secure your University Admission, Master your Exams with our LMS, and Save on Official Vouchers for IELTS, PTE, TOEFL, LanguageCert, Duolingo, GRE and more.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
          {/* 2) Buy Discounted Voucher */}
          <button 
            onClick={onStart} 
            className="w-full sm:w-auto px-8 py-5 bg-unicou-orange text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-orange-600 shadow-xl active:scale-95 flex items-center justify-center gap-3"
          >
            Buy Discounted Voucher
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </button>

          {/* 1) Apply Now */}
          <button 
            onClick={onApplyClick}
            className="w-full sm:w-auto px-8 py-5 bg-unicou-navy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-slate-900 shadow-xl active:scale-95 flex items-center justify-center gap-3 relative overflow-hidden group"
          >
            <span className="relative z-10">Apply Now</span>
            <div className="absolute top-0 left-0 w-1 h-full bg-unicou-orange group-hover:w-full transition-all duration-500 opacity-20" />
            <svg className="w-4 h-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>

          {/* 3) Learning Hub */}
          <a 
            href="https://lms.unicou.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-5 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-slate-50 shadow-xl active:scale-95 flex items-center justify-center gap-3"
          >
            Learning Hub
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </a>
        </div>

        <div className="mt-16 flex justify-center">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-unicou-orange shadow-[0_0_8px_rgba(241,90,36,0.5)] animate-pulse"></div>
             <div className="vibrant-strip w-24"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-unicou-orange shadow-[0_0_8px_rgba(241,90,36,0.5)] animate-pulse"></div>
          </div>
        </div>

        <div className="mt-24 pt-12 border-t brand-border-orange">
          <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">Authorized Partners</h4>
          <div className="flex gap-16 animate-marquee whitespace-nowrap opacity-40 hover:opacity-100 transition-opacity">
            {[...partners, ...partners].map((p, i) => (
              <div key={i} className="text-base font-black text-unicou-navy uppercase tracking-tighter">
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
