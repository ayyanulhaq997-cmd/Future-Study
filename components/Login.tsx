
import React, { useState } from 'react';
import { api } from '../services/apiService';
import { MailService } from '../services/mailService';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  onNavigateToSignup: () => void;
  onNavigateToForgot: () => void;
  onBack?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToSignup, onNavigateToForgot, onBack }) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [simulatedCode, setSimulatedCode] = useState<string | null>(null);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@') && !['admin', 'trainer', 'finance', 'sales', 'partner'].includes(email)) {
       setError("Please enter a valid User ID or Email.");
       return;
    }
    
    setLoading(true);
    setError('');
    
    // Support aliases for demo roles
    const aliasMap: Record<string, string> = {
      'admin': 'admin@unicou.uk',
      'trainer': 'trainer@unicou.uk',
      'finance': 'finance@unicou.uk',
      'sales': 'sales@unicou.uk',
      'partner': 'partner@unicou.uk'
    };
    const targetEmail = aliasMap[email] || email;
    setEmail(targetEmail);

    try {
      await api.requestLoginAccess(targetEmail);
      setStep('otp');
      setSimulatedCode(MailService.lastCodeDispatched);
    } catch (err: any) {
      setError(err.message || 'Identity Node Unreachable.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setLoading(true);
    setError('');
    try {
      const user = await api.verifyLogin(email, otp);
      onLogin(user);
    } catch (err: any) {
      setError("Invalid Access Code. Verification Failed.");
    } finally {
      setLoading(false);
    }
  };

  const staffHints = [
    { label: 'Trainer', alias: 'trainer' },
    { label: 'Admin', alias: 'admin' },
    { label: 'Finance', alias: 'finance' },
    { label: 'Partner', alias: 'partner' }
  ];

  return (
    <div className="max-w-[420px] mx-auto animate-slide-up bg-white py-12 px-4">
      <div className="bg-white p-10 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-unicou-orange" />
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[2rem] mx-auto flex items-center justify-center mb-6 shadow-inner font-black text-3xl text-unicou-navy">
            U
          </div>
          <h2 className="text-3xl font-display font-black text-slate-900 tracking-tighter uppercase leading-none">
            Secure <span className="text-unicou-orange">Access</span>
          </h2>
          <p className="text-slate-400 text-[9px] mt-4 font-black uppercase tracking-[0.3em]">Establishing Identity Node</p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleRequestOTP} className="space-y-6">
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">User ID / Email Registry</label>
              <input 
                type="text" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. user@unicou.uk"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 outline-none focus:border-unicou-navy focus:bg-white transition-all shadow-inner font-bold text-base"
              />
              <div className="flex flex-wrap gap-2 mt-4">
                 {staffHints.map(hint => (
                   <button 
                    key={hint.alias} 
                    type="button" 
                    onClick={() => setEmail(hint.alias)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[8px] font-black text-slate-400 hover:text-unicou-navy hover:bg-slate-100 transition-all uppercase tracking-widest"
                   >
                     {hint.label}
                   </button>
                 ))}
              </div>
            </div>

            {error && <div className="text-red-600 text-[9px] font-black uppercase tracking-widest bg-red-50 p-3 rounded-xl border border-red-100 text-center animate-pulse">{error}</div>}

            <button type="submit" disabled={loading} className="w-full py-5 bg-unicou-navy hover:bg-slate-950 text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-[1.5rem] transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  SYNCING...
                </>
              ) : 'Initialize Access Node'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center">
               <p className="text-xs text-slate-500 font-bold italic mb-6">"Access code dispatched to your registered identity node."</p>
               
               {simulatedCode && (
                 <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl mb-6">
                    <p className="text-[9px] font-black text-unicou-orange uppercase tracking-widest mb-1">Developer Helper</p>
                    <p className="text-2xl font-mono font-black text-unicou-navy">{simulatedCode}</p>
                 </div>
               )}

               <input 
                type="text" 
                maxLength={6} 
                required 
                autoFocus
                value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="••••••"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-4xl font-mono font-black text-center text-unicou-navy outline-none focus:border-unicou-navy shadow-inner tracking-[0.5em]"
              />
            </div>

            {error && <div className="text-red-600 text-[9px] font-black uppercase tracking-widest bg-red-50 p-3 rounded-xl border border-red-100 text-center animate-pulse">{error}</div>}

            <div className="space-y-3">
              <button type="submit" disabled={loading || otp.length !== 6} className="w-full py-5 bg-unicou-orange hover:bg-orange-600 text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-[1.5rem] transition-all shadow-xl active:scale-95 disabled:opacity-50">
                {loading ? 'AUTHORIZING...' : 'Verify Access Node'}
              </button>
              <button type="button" onClick={() => setStep('email')} className="w-full text-[9px] font-black text-slate-400 hover:text-unicou-navy uppercase tracking-widest">Wrong Identity? Restart Sync</button>
            </div>
          </form>
        )}

        <div className="text-center pt-8 border-t border-slate-50 mt-10">
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-tight">New Student? <button type="button" onClick={onNavigateToSignup} className="text-unicou-orange font-black hover:underline underline-offset-4 transition-all">Sign Up</button></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
