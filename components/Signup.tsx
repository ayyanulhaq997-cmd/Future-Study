import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { MailService } from '../services/mailService';
import { User, UserRole, ViewState } from '../types';

interface SignupProps {
  onSuccess: (user: User) => void;
  onNavigateToLogin: () => void;
  onNavigate: (view: ViewState) => void;
}

type SignupStep = 'email' | 'code-entry' | 'complete';

const Signup: React.FC<SignupProps> = ({ onSuccess, onNavigateToLogin, onNavigate }) => {
  const [step, setStep] = useState<SignupStep>('email');
  const [verificationCode, setVerificationCode] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    role: 'Student' as UserRole
  });
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.includes('@')) {
      setError("Valid Email Node Required."); 
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      await MailService.sendVerificationCode(formData.name || 'Student', formData.email);
      setStep('code-entry');
    } catch (err: any) {
      if (err.message === 'MAIL_NODE_UNCONFIGURED') {
        setError("Warning: Mail Dispatch Node not configured in Admin Dashboard. Code sent to browser console (F12) for development.");
        setStep('code-entry');
      } else {
        setError("Transmission Protocol Failure. Check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resending) return;
    setResending(true);
    setError('');
    setSuccessMsg('');
    try {
      await MailService.sendVerificationCode(formData.name || 'Student', formData.email);
      setSuccessMsg("A new verification node has been dispatched to your inbox.");
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err: any) {
      if (err.message === 'MAIL_NODE_UNCONFIGURED') {
        setError("Developer Mode: Check browser console for the new code.");
      } else {
        setError("Resend Protocol Failed.");
      }
    } finally {
      setResending(false);
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (MailService.verifyStoredCode(formData.email, verificationCode)) {
      setStep('complete');
      setError('');
    } else {
      setError("Incorrect Verification Node. Please check your email again.");
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Security Node Mismatch: Passwords.");
      return;
    }
    setLoading(true);
    try {
      const user = await api.signup(formData.email, 'Student');
      onSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Registration Protocol Failure.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-24 px-6 animate-in fade-in duration-700">
      <div className="bg-white p-8 md:p-16 rounded-[4rem] border border-slate-100 shadow-3xl relative overflow-hidden">
        {step === 'email' && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-12">
               <h2 className="text-4xl font-display font-black text-unicou-navy uppercase tracking-tighter">Identity <span className="text-unicou-orange">Registry</span></h2>
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-4">Protocol V4.1 Initialization</p>
            </div>
            <form onSubmit={handleRequestCode} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-unicou-navy uppercase tracking-widest ml-1">Official Email Node</label>
                <input 
                  type="email" required value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@unicou.uk"
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] p-5 text-base font-bold outline-none focus:border-unicou-navy transition-all shadow-inner"
                />
              </div>
              {error && <div className="text-unicou-orange text-[10px] font-black uppercase bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">{error}</div>}
              <button 
                type="submit" disabled={loading}
                className="w-full py-5 bg-unicou-navy text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-950 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'TRANSMITTING...' : 'AUTHORIZE REGISTRATION'}
              </button>
            </form>
          </div>
        )}

        {step === 'code-entry' && (
          <div className="max-w-xl mx-auto space-y-12 animate-in fade-in duration-500">
            <div className="text-center">
               <div className="flex justify-center mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center p-2 shadow-sm">
                    <svg fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                  </div>
               </div>
               <h3 className="text-2xl font-display font-black text-unicou-navy uppercase tracking-tighter mb-2">Check Your Email</h3>
               <p className="text-slate-500 font-bold italic leading-relaxed font-sans">
                 "Verification protocol initiated. A 6-digit authorization node has been dispatched to <span className="text-unicou-navy underline">{formData.email}</span>."
               </p>
            </div>

            <form onSubmit={handleVerifyCode} className="space-y-8">
              <label className="block text-[10px] font-black text-unicou-navy uppercase tracking-widest text-center">ENTER 6-DIGIT NODE</label>
              <input 
                type="text" required maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full bg-slate-50/50 border border-slate-100 rounded-[1.5rem] p-6 text-5xl font-mono font-black text-center text-unicou-navy outline-none focus:border-unicou-orange shadow-inner tracking-[0.3em] placeholder:opacity-10"
              />
              
              {error && <div className="text-unicou-orange text-[10px] font-black uppercase tracking-widest bg-orange-50 p-4 rounded-xl border border-orange-100 text-center animate-pulse">{error}</div>}
              {successMsg && <div className="text-emerald-600 text-[10px] font-black uppercase tracking-widest bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">{successMsg}</div>}
              
              <div className="space-y-6">
                <button type="submit" className="w-full py-6 bg-unicou-navy hover:bg-slate-950 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95">VERIFY IDENTITY NODE</button>
                
                <div className="flex flex-col items-center gap-4">
                  <button 
                    type="button" 
                    onClick={handleResendCode}
                    disabled={resending}
                    className="text-[10px] font-black text-unicou-orange uppercase tracking-widest hover:underline disabled:opacity-30"
                  >
                    {resending ? 'TRANSMITTING NEW NODE...' : 'DID NOT RECEIVE CODE? RESEND CODE'}
                  </button>
                  <button type="button" onClick={() => setStep('email')} className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-unicou-navy transition-colors">BACK TO EMAIL ENTRY</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {step === 'complete' && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-display font-black text-unicou-navy uppercase">Finalize <span className="text-unicou-orange">Node</span></h2>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Identity Verified: {formData.email}</p>
            </div>
            <form onSubmit={handleFinalSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-unicou-navy uppercase tracking-widest ml-1">Full Legal Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold" placeholder="Legal Name" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-unicou-navy uppercase tracking-widest ml-1">Password Node</label>
                <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold" placeholder="••••••••" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-unicou-navy uppercase tracking-widest ml-1">Verify Password</label>
                <input type="password" required value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold" placeholder="••••••••" />
              </div>
              {error && <div className="text-unicou-orange text-[10px] font-black uppercase text-center">{error}</div>}
              <button type="submit" className="w-full py-5 bg-unicou-orange text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-lg">ESTABLISH IDENTITY NODE</button>
            </form>
          </div>
        )}
      </div>

      <div className="text-center mt-12">
        <button onClick={onNavigateToLogin} className="text-[11px] font-bold uppercase text-slate-400 hover:text-unicou-navy transition-colors">
          Already verified? <span className="text-unicou-navy font-black">Sign In to Hub</span>
        </button>
      </div>
    </div>
  );
};

export default Signup;