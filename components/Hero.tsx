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
    <section className="pt-48 pb-32 px-6 relative overflow-hidden bg-white">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-50 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white border border-slate-200 text-unicou-navy text-[11px] font-black uppercase tracking-[0.2em] mb-12 shadow-sm animate-slide-up">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          GLOBAL NEXUS • 15 DESTINATIONS | VOUCHER VAULT | MASTER HUB
        </div>
        
        <h1 className="text-6xl md:text-[7.5rem] font-display font-black tracking-tighter mb-10 leading-[0.9] text-slate-950 animate-slide-up">
          ACADEMIC <span className="gradient-text">MOBILITY.</span> <br />
          <span className="text-slate-900 tracking-tight">TRIPLE VERTICAL.</span>
        </h1>
        
        <p className="text-2xl md:text-3xl text-slate-800 max-w-4xl mx-auto mb-20 leading-relaxed font-bold animate-slide-up italic">
          Authoritative ecosystem for <span className="text-unicou-navy border-b-4 border-unicou-orange">Consultancy</span>, <span className="text-unicou-navy border-b-4 border-unicou-orange">Voucher Store</span>, and <span className="text-unicou-navy border-b-4 border-unicou-orange">Learning Hub</span>.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up">
          <button 
            onClick={onStart} 
            className="w-full sm:w-auto px-12 py-6 bg-unicou-orange text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:bg-orange-600 active:scale-95 shadow-2xl flex items-center justify-center gap-4"
          >
            VOUCHER STORE
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </button>
          <button 
            onClick={onApplyClick}
            className="w-full sm:w-auto px-12 py-6 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:bg-slate-50 active:scale-95 border-2 border-slate-950 shadow-lg"
          >
            START APPLICATION
          </button>
        </div>

        {/* PARTNER MARQUEE */}
        <div className="mt-40 pt-16 border-t border-slate-100 overflow-hidden relative">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-12">Institutional Fulfillment Partners</h4>
          <div className="flex gap-20 animate-marquee whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity">
            {[...partners, ...partners].map((p, i) => (
              <div key={i} className="text-3xl font-black tracking-tighter inline-block text-slate-950 uppercase">
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