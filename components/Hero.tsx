
import React from 'react';

interface HeroProps {
  onStart: () => void;
  onResellerClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart, onResellerClick }) => {
  const partners = [
    "PEARSON PTE", "BRITISH COUNCIL", "IDP IELTS", "OTHM UK", "OXFORD ELLT", 
    "CAMBRIDGE", "ETS TOEFL", "DUOLINGO", "VFS GLOBAL", "GTEC"
  ];

  return (
    <section className="pt-24 pb-36 px-4 relative overflow-hidden bg-slate-950">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary-600/10 blur-[180px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass border border-primary-500/30 text-primary-400 text-[10px] font-black uppercase tracking-[0.3em] mb-12 shadow-xl animate-in slide-in-from-top-4 duration-1000">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          UNICOU UNIFIED INFRASTRUCTURE • STUDY | IMMIGRATION | ACADEMY
        </div>
        
        <h1 className="text-6xl md:text-[9.5rem] font-display font-bold tracking-tighter mb-12 leading-[0.85] animate-in slide-in-from-bottom duration-700">
          GLOBAL <span className="gradient-text">MOBILITY.</span> <br />
          <span className="text-slate-100 uppercase">Simplified.</span>
        </h1>
        
        <p className="text-lg md:text-2xl text-slate-400 max-w-4xl mx-auto mb-16 leading-relaxed font-medium px-4">
          UNICOU unifies <span className="text-slate-200">Study Abroad</span>, <span className="text-slate-200">Immigration Paths</span>, and <span className="text-slate-200">Academy Training</span> into a single, high-performance ecosystem.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 px-4">
          <button 
            onClick={onStart} 
            className="w-full sm:w-auto px-12 py-7 bg-unicou-orange text-white rounded-2xl font-black text-xl transition-all hover:scale-105 hover:bg-orange-600 active:scale-95 shadow-2xl flex items-center justify-center gap-4"
          >
            VOUCHER SALE
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </button>
          <button 
            onClick={() => window.scrollTo({ top: 1200, behavior: 'smooth' })}
            className="w-full sm:w-auto px-12 py-7 glass text-white rounded-2xl font-bold text-xl transition-all hover:bg-white/5 active:scale-95 uppercase tracking-widest border-slate-800"
          >
            STUDY ABROAD
          </button>
        </div>

        {/* PARTNER MARQUEE */}
        <div className="mt-32 pt-20 border-t border-slate-900/50 overflow-hidden relative">
          <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mb-12">Accredited Academic Nodes & Certifications</h4>
          <div className="flex gap-16 animate-marquee whitespace-nowrap opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
            {[...partners, ...partners].map((p, i) => (
              <div key={i} className="text-xl font-black tracking-tighter inline-block text-slate-300">
                {p}
              </div>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 to-transparent" />
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          display: flex;
          width: max-content;
        }
      `}</style>
    </section>
  );
};

export default Hero;
