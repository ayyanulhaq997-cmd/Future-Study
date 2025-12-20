
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
    // Artificial delay to simulate real network verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      await api.verifyEmail(email);
      onVerified();
    } catch (e) {
      alert("Verification failed.");
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-24 px-4 animate-in zoom-in duration-500">
      <div className="glass p-12 rounded-[3rem] border border-slate-800 text-center shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-indigo-600 animate-pulse" />
        
        <div className="w-24 h-24 bg-primary-600/10 text-primary-400 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-primary-500/20 shadow-2xl">
           <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
           </svg>
        </div>

        <h2 className="text-3xl font-display font-bold mb-4">Verify Your <span className="text-primary-400">Email</span></h2>
        <p className="text-slate-500 mb-10 leading-relaxed">
          We've sent a mandatory verification link to <br />
          <strong className="text-slate-200">{email}</strong>. <br />
          Please click it to unlock your academic terminal.
        </p>

        <div className="space-y-6">
          <button 
            onClick={handleSimulateVerify}
            disabled={verifying}
            className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {verifying ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Authenticating...
              </>
            ) : (
              'Simulate Verification Link'
            )}
          </button>
          
          <p className="text-xs text-slate-600">
            Didn't receive it? <button className="text-primary-400 hover:underline">Resend Email</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationPending;
