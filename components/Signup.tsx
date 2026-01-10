import React, { useState } from 'react';
import { api } from '../services/apiService';
import { MailService } from '../services/mailService';
import { User, UserRole, ViewState } from '../types';

interface SignupProps {
  onSuccess: (user: User) => void;
  onNavigateToLogin: () => void;
  onNavigate: (view: ViewState) => void;
}

type SignupStep = 'email' | 'code-entry' | 'complete';

const Signup: React.FC<SignupProps> = ({ onSuccess, onNavigateToLogin }) => {
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
      setError("Please enter a valid email address."); 
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
        setError("Warning: Email service not configured in Admin Dashboard. Code sent to console for demo.");
        setStep('code-entry');
      } else {
        setError("Failed to send code. Please try again.");
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
      setSuccessMsg("A new code has been sent to your inbox.");
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err: any) {
      setError("Resend failed. Check connection.");
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
      setError("Incorrect verification code.");
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const user = await api.signup(formData.email, 'Student');
      onSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-24 px-6 animate-in fade-in duration-700">
      <div className="bg-white p-8 md:p-16 rounded-[3rem] border border-slate-100 shadow-3xl relative overflow-hidden">
        {step === 'email' && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-12">
               <h2 className="text-4xl font-display font-black text-unicou-navy uppercase tracking-tighter">Register <span className="text-unicou-orange">Account</span></h2>
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-4">Begin Your Global Journey</p>
            </div>
            <form onSubmit={handleRequestCode} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-unicou-navy uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  type="email" required value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="alex@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-base font-bold outline-none focus:border-unicou-navy transition-all shadow-inner"
                />
              </div>
              {error && <div className="text-unicou-orange text-[10px] font-black uppercase bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">{error}</div>}
              <button 
                type="submit" disabled={loading}
                className="w-full py-5 bg-unicou-navy text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-slate-950 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'SENDING CODE...' : 'REGISTER EMAIL'}
              </button>
            </form>
          </div>
        )}

        {step === 'code-entry' && (
          <div className="max-w-xl mx-auto space-y-12 animate-in fade-in duration-500">
            <div className="text-center">
               <div className="flex justify-center mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-sm">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                  </div>
               </div>
               <h3 className="text-2xl font-display font-black text-unicou-navy uppercase tracking-tighter mb-2">Check Your Inbox</h3>
               <p className="text-slate-500 font-bold italic leading-relaxed">
                 A 6-digit code has been dispatched to <span className="text-unicou-navy underline">{formData.email}</span>.
               </p>
            </div>

            <form onSubmit={handleVerifyCode} className="space-y-8">
              <input 
                type="text" required maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] p-8 text-5xl font-mono font-black text-center text-unicou-navy outline-none focus:border-unicou-orange shadow-inner tracking-[0.4em] placeholder:opacity-10"
              />
              
              {error && <div className="text-unicou-orange text-[10px] font-black uppercase tracking-widest bg-orange-50 p-4 rounded-xl border border-orange-100 text-center animate-pulse">{error}</div>}
              {successMsg && <div className="text-emerald-600 text-[10px] font-black uppercase tracking-widest bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">{successMsg}</div>}
              
              <div className="space-y-6">
                <button type="submit" className="w-full py-6 bg-unicou-navy hover:bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95">VERIFY CODE</button>
                
                <div className="flex flex-col items-center gap-4">
                  <button 
                    type="button" 
                    onClick={handleResendCode}
                    disabled={resending}
                    className="text-[10px] font-black text-unicou-orange uppercase tracking-widest hover:underline disabled:opacity-30"
                  >
                    {resending ? 'TRANSMITTING...' : 'RESEND CODE'}
                  </button>
                  <button type="button" onClick={() => setStep('email')} className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-unicou-navy transition-colors">BACK</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {step === 'complete' && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-display font-black text-unicou-navy uppercase">Complete <span className="text-unicou-orange">Profile</span></h2>
            </div>
            <form onSubmit={handleFinalSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-unicou-navy uppercase tracking-widest ml-1">Full Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold" placeholder="Legal Name" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-unicou-navy uppercase tracking-widest ml-1">Password</label>
                <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold" placeholder="••••••••" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-unicou-navy uppercase tracking-widest ml-1">Confirm Password</label>
                <input type="password" required value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold" placeholder="••••••••" />
              </div>
              {error && <div className="text-unicou-orange text-[10px] font-black uppercase text-center">{error}</div>}
              <button type="submit" className="w-full py-5 bg-unicou-orange text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">FINALIZE ACCOUNT</button>
            </form>
          </div>
        )}
      </div>

      <div className="text-center mt-12">
        <button onClick={onNavigateToLogin} className="text-[11px] font-bold uppercase text-slate-400 hover:text-unicou-navy transition-colors">
          Already have an account? <span className="text-unicou-navy font-black">Sign In</span>
        </button>
      </div>
    </div>
  );
};

export default Signup;
