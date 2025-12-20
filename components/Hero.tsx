import React from 'react';

const Hero: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <section className="pt-24 pb-36 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-primary-500/5 blur-[200px] rounded-full -z-10 animate-pulse-slow" />
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass border border-primary-500/30 text-primary-400 text-[10px] font-black uppercase tracking-widest mb-12 shadow-xl shadow-primary-500/5">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Direct API Inventory Access • Live Nodes Active
        </div>
        
        <h1 className="text-7xl md:text-[10rem] font-display font-bold tracking-tighter mb-12 leading-[0.85] animate-in slide-in-from-bottom duration-700">
          EXAM <span className="gradient-text">VOUCHERS.</span> <br />
          <span className="text-slate-100">PROCURED.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-16 leading-relaxed font-medium animate-in slide-in-from-bottom delay-100 duration-700">
          Nexus provides high-performance infrastructure for <span className="text-slate-200">PTE, IELTS, and TOEFL</span> procurement. Instant fulfillment via secure automated vault sync.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in slide-in-from-bottom delay-200 duration-700">
          <button 
            onClick={onStart} 
            className="group relative w-full sm:w-auto px-12 py-6 bg-white text-slate-950 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.15)] overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              Explore Vault
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </span>
          </button>
          <button className="w-full sm:w-auto px-12 py-6 glass text-white rounded-2xl font-bold text-lg transition-all hover:bg-slate-800/80 border border-slate-700/50 hover:border-slate-500">
            Reseller Portal
          </button>
        </div>

        <div className="mt-32 pt-20 border-t border-slate-900/50 grid grid-cols-2 md:grid-cols-4 gap-12 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
           <div className="text-2xl font-black tracking-tighter">PEARSON</div>
           <div className="text-2xl font-black tracking-tighter">IDP IELTS</div>
           <div className="text-2xl font-black tracking-tighter">DUOLINGO</div>
           <div className="text-2xl font-black tracking-tighter">BRITISH COUNCIL</div>
        </div>
      </div>
    </section>
  );
};

export default Hero;