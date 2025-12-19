
import React from 'react';

const Hero: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <section className="pt-20 pb-32 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary-500/5 blur-[160px] rounded-full -z-10" />
      
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass border border-primary-500/20 text-primary-400 text-xs font-black uppercase tracking-widest mb-10 animate-fade-in">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Direct Inventory Access • Live
        </div>
        
        <h1 className="text-6xl md:text-9xl font-display font-bold tracking-tighter mb-10 leading-[0.9]">
          EXAM <span className="gradient-text">VOUCHERS.</span> <br />
          <span className="text-slate-200">PROCURED.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-14 leading-relaxed font-medium">
          The most reliable infrastructure for PTE, IELTS, and TOEFL vouchers. 
          Instant automated fulfillment with enterprise-grade security.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <button onClick={onStart} className="group relative w-full sm:w-auto px-10 py-5 bg-white text-slate-950 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/10 overflow-hidden">
            <span className="relative z-10 flex items-center justify-center gap-2">
              Browse Vault
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </span>
          </button>
          <button className="w-full sm:w-auto px-10 py-5 glass text-white rounded-2xl font-bold transition-all hover:bg-slate-800/80 border border-slate-700/50">
            Reseller Portal
          </button>
        </div>

        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
           <div className="text-xl font-black tracking-widest">PEARSON</div>
           <div className="text-xl font-black tracking-widest">IDP IELTS</div>
           <div className="text-xl font-black tracking-widest">DUOLINGO</div>
           <div className="text-xl font-black tracking-widest">BRITISH COUNCIL</div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
