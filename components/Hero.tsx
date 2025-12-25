import React from 'react';

interface HeroProps {
  onStart: () => void;
  onResellerClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart, onResellerClick }) => {
  const partners = [
    "PEARSON PTE", "BRITISH COUNCIL", "IDP IELTS", "OTHM UK", "OXFORD ELLT", 
    "CAMBRIDGE", "ETS TOEFL", "DUOLINGO", "VFS GLOBAL", "GTEC", "LANGUAGECERT"
  ];

  return (
    <section className="pt-40 pb-36 px-6 relative overflow-hidden bg-white">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-50 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white border border-slate-200 text-unicou-navy text-[10px] font-black uppercase tracking-[0.3em] mb-12 shadow-sm animate-slide-up">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          UNICOU UNIFIED MOBILITY • STUDY | ACADEMY | IMMIGRATION
        </div>
        
        <h1 className="text-6xl md:text-[8rem] font-display font-bold tracking-tighter mb-10 leading-[0.9] text-slate-900 animate-slide-up" style={{ animationDelay: '100ms' }}>
          GLOBAL <span className="gradient-text">MOBILITY.</span> <br />
          <span className="text-slate-800">SIMPLIFIED.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-16 leading-relaxed font-medium animate-slide-up" style={{ animationDelay: '200ms' }}>
          The world's most advanced ecosystem for <span className="text-slate-900 font-bold">Study Abroad</span>, <span className="text-slate-900 font-bold">Exam Vouchers</span>, and <span className="text-slate-900 font-bold">Visa Strategy</span>.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <button 
            onClick={onStart} 
            className="w-full sm:w-auto px-12 py-6 bg-unicou-orange text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105 hover:bg-orange-600 active:scale-95 shadow-2xl shadow-orange-500/20 flex items-center justify-center gap-4"
          >
            VOUCHER STORE
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </button>
          <button 
            onClick={() => document.getElementById('destination-directory')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-12 py-6 bg-white text-slate-900 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all hover:bg-slate-50 active:scale-95 border border-slate-200"
          >
            DESTINATION HUB
          </button>
        </div>

        {/* PARTNER MARQUEE */}
        <div className="mt-40 pt-16 border-t border-slate-100 overflow-hidden relative grayscale opacity-40 hover:opacity-100 transition-all duration-700">
          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-12">Authorized Fulfillment Nodes</h4>
          <div className="flex gap-16 animate-marquee whitespace-nowrap">
            {[...partners, ...partners].map((p, i) => (
              <div key={i} className="text-2xl font-black tracking-tighter inline-block text-slate-800">
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
          animation: marquee 40s linear infinite;
          display: flex;
          width: max-content;
        }
      `}</style>
    </section>
  );
};

export default Hero;