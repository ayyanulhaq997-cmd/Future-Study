
import React, { useState } from 'react';
import { api } from '../services/apiService';

interface VerificationPendingProps {
  email: string;
  onVerified: () => void;
}

const VerificationPending: React.FC<VerificationPendingProps> = ({ email, onVerified }) => {
  const [verifying, setVerifying] = useState(false);

  const handleSimulateVerify = async () => {
    setVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
      await api.verifyEmail(email);
      onVerified();
    } catch (e) {
      alert("Verification node failed to respond.");
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-24 px-4 animate-in zoom-in duration-500">
      <div className="bg-white p-12 rounded-[4rem] border border-slate-200 text-center shadow-3xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-unicou-navy via-unicou-orange to-unicou-navy animate-pulse" />
        
        <div className="w-24 h-24 bg-unicou-navy/5 text-unicou-navy rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border border-unicou-navy/10 shadow-inner">
           <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
             <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
           </svg>
        </div>

        <h2 className="text-3xl font-display font-black text-unicou-navy uppercase tracking-tighter mb-4">Identity <span className="text-unicou-orange">Audit</span></h2>
        <p className="text-slate-600 mb-8 leading-relaxed font-bold italic">
          "Establishing digital identity node for procurement access."
        </p>

        <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 mb-10 text-left shadow-inner">
           <p className="text-[12px] text-slate-500 leading-relaxed font-bold italic">
             Verification protocol initiated. For this demonstration environment, physical email dispatch is simulated. Use the override below to authorize this session.
           </p>
        </div>

        <div className="space-y-6">
          <button 
            onClick={handleSimulateVerify}
            disabled={verifying}
            className="w-full py-6 bg-unicou-orange hover:bg-orange-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4 group"
          >
            {verifying ? (
              <>
                <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                Establishing Sync...
              </>
            ) : (
              <>
                AUTHORIZE NODE MANUALLY
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </>
            )}
          </button>
          
          <div className="pt-8 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Node ID: {email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPending;
