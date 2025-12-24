import React, { useState, useEffect } from 'react';

const CookieConsent: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('unicou_cookies');
    if (!consent) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem('unicou_cookies', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] w-full max-w-2xl px-6 animate-in slide-in-from-bottom-8 duration-500">
      <div className="glass bg-slate-900/95 border border-white/10 p-6 rounded-[2.5rem] shadow-3xl flex flex-col md:flex-row items-center gap-6">
        <div className="w-12 h-12 rounded-2xl bg-primary-600/10 border border-primary-500/20 flex items-center justify-center shrink-0">
          <span className="text-2xl">🍪</span>
        </div>
        <div className="flex-grow text-center md:text-left">
          <h4 className="text-sm font-bold text-white mb-1">Cookie Compliance Node</h4>
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
            We use analytics nodes to optimize your navigation experience. By continuing, you agree to our cookie strategy.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button onClick={accept} className="px-6 py-2.5 bg-white text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Accept</button>
          <button onClick={accept} className="px-6 py-2.5 glass border border-slate-800 text-slate-400 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:text-white transition-all">Settings</button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;