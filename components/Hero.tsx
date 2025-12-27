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
    <section className="pt-48 pb-32 px-6 relative overflow-hidden">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-unicou-navy/5 blur-[120px] rounded-full animate-blob -z-10" />
      <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-unicou-orange/5 blur-[120px] rounded-full animate-blob -z-10" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-slate-100/30 blur-[150px] rounded-full -z-20" />
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-slate-200 text-unicou-navy text-[11px] font-black uppercase tracking-[0.25em] mb-12 shadow-nexus animate-slide-up group cursor-default">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse group-hover:scale-125 transition-transform" />
          GLOBAL NEXUS • <span className="text-unicou-orange">15 DESTINATIONS</span> | VOUCHER VAULT | MASTER HUB
        </div>
        
        <h1 className="text-7xl md:text-[8.5rem] font-display font-black tracking-tighter mb-12 leading-[0.85] text-slate-950 animate-slide-up">
          ACADEMIC <br />
          <span className="gradient-text italic">MOBILITY.</span>
        </h1>
        
        <p className="text-2xl md:text-4xl text-slate-800 max-w-4xl mx-auto mb-20 leading-relaxed font-bold animate-slide-up italic">
          High-performance ecosystem for <span className="text-unicou-navy border-b-4 border-unicou-orange/40">Consultancy</span>, <span className="text-unicou-navy border-b-4 border-unicou-orange/40">Voucher Store</span>, and <span className="text-unicou-navy border-b-4 border-unicou-orange/40">Learning Hub</span>.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-slide-up">
          <button 
            onClick={onStart} 
            className="w-full sm:w-auto px-16 py-8 bg-unicou-orange text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] transition-all hover:bg-orange-600 active:scale-95 shadow-vibrant flex items-center justify-center gap-5 group"
          >
            VOUCHER STORE
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </button>
          <button 
            onClick={onApplyClick}
            className="w-full sm:w-auto px-16 py-8 bg-white text-slate-950 rounded-3xl font-black text-sm uppercase tracking-[0.2em] transition-all hover:bg-slate-50 active:scale-95 border-2 border-slate-950 shadow-nexus flex items-center justify-center gap-5 group"
          >
            START APPLICATION
            <div className="w-6 h-6 rounded-full bg-unicou-navy text-white flex items-center justify-center group-hover:bg-unicou-orange transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
          </button>
        </div>

        {/* PARTNER MARQUEE */}
        <div className="mt-48 pt-20 border-t border-slate-200/50 overflow-hidden relative">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] mb-14">Institutional Fulfillment Partners</h4>
          <div className="flex gap-24 animate-marquee whitespace-nowrap opacity-40 hover:opacity-100 transition-all duration-1000">
            {[...partners, ...partners].map((p, i) => (
              <div key={i} className="text-4xl font-black tracking-tighter inline-block text-unicou-navy uppercase hover:text-unicou-orange transition-colors cursor-default">
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
          animation: marquee 50s linear infinite;
          display: flex;
          width: max-content;
        }
      `}</style>
    </section>
  );
};

export default Hero;