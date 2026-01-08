
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { MailService } from '../services/mailService';
import { User, UserRole } from '../types';

interface SignupProps {
  onSuccess: (user: User) => void;
  onNavigateToLogin: () => void;
}

type SignupStep = 'email' | 'code-entry' | 'complete';

const Signup: React.FC<SignupProps> = ({ onSuccess, onNavigateToLogin }) => {
  const [step, setStep] = useState<SignupStep>('email');
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    role: 'Student' as UserRole
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugCode, setDebugCode] = useState<string | null>(null);

  // Monitor global sync for simulated delivery
  useEffect(() => {
    const check = () => {
      const code = (window as any)._last_unicou_code;
      if (code && code !== debugCode) setDebugCode(code);
    };
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, [debugCode]);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.includes('@')) {
      setError("Valid Email Node Required."); 
      return;
    }
    setLoading(true);
    setError('');
    try {
      await MailService.sendVerificationCode(formData.name || 'Student', formData.email);
      setStep('code-entry');
    } catch (err: any) {
      // If server is offline but code was generated, proceed to entry step
      setStep('code-entry');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (MailService.verifyStoredCode(formData.email, verificationCode)) {
      setStep('complete');
      setError('');
      setDebugCode(null);
    } else {
      setError("Incorrect Verification Node.");
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
      setError('Registration Protocol Failure.');
      setLoading(false);
    }
  };

  const EyeIcon = ({ visible }: { visible: boolean }) => (
    visible ? (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
    ) : (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
    )
  );

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 flex flex-col md:flex-row gap-12 animate-in fade-in duration-700 bg-white">
      <div className="flex-1 bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl relative overflow-hidden h-fit">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-unicou-orange" />
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-black text-unicou-navy uppercase tracking-tight">
            Student <span className="text-unicou-orange">Sign Up</span>
          </h2>
          <p className="text-unicou-charcoal text-[10px] font-black uppercase tracking-widest mt-2">
            UniCou Ltd Student Registry
          </p>
        </div>

        {step === 'email' && (
          <form onSubmit={handleRequestCode} className="space-y-6">
            <label className="block text-[10px] font-black text-unicou-navy uppercase tracking-widest mb-1 ml-1">Official Email Node</label>
            <input 
              type="email" required value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="alex@unicou.uk"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-unicou-navy transition-all shadow-inner placeholder:text-unicou-slate"
            />
            {error && <div className="text-unicou-orange text-[10px] font-black uppercase tracking-widest bg-orange-50 p-4 rounded-2xl border border-orange-100 text-center animate-pulse">{error}</div>}
            <button 
              type="submit" disabled={loading}
              className="w-full py-4 bg-unicou-navy text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg active:scale-95"
            >
              {loading ? 'TRANSMITTING...' : 'AUTHORIZE REGISTRATION'}
            </button>
          </form>
        )}

        {step === 'code-entry' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                 <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center animate-bounce">📧</div>
              </div>
              <p className="text-sm text-slate-500 font-bold italic px-4">"Verification protocol initiated. Check your inbox for the authorization node."</p>
              
              {/* EMERGENCY UI FALLBACK FOR LOCAL MODE */}
              <div className="p-8 bg-slate-950 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-white text-5xl select-none">SYNC</div>
                 <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-4">On-Screen Identity Fallback</p>
                 {debugCode ? (
                   <div className="space-y-2">
                     <p className="text-4xl font-mono font-black text-white tracking-[0.3em]">{debugCode}</p>
                     <p className="text-[8px] text-slate-500 uppercase font-bold">Local Sync Node Active • Code generated for demo</p>
                   </div>
                 ) : (
                   <div className="flex items-center justify-center gap-2 py-4">
                     <div className="w-1.5 h-1.5 bg-slate-700 rounded-full animate-pulse" />
                     <p className="text-[10px] text-slate-600 font-black uppercase">Waiting for dispatch...</p>
                   </div>
                 )}
              </div>
            </div>

            <form onSubmit={handleVerifyCode} className="space-y-6">
              <label className="block text-[10px] font-black text-unicou-navy uppercase tracking-widest text-center mb-2">Enter 6-Digit Node</label>
              <input 
                type="text" required maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-4xl font-mono font-black text-center text-unicou-navy outline-none focus:border-unicou-orange shadow-inner tracking-[0.2em]"
              />
              {error && <div className="text-unicou-orange text-[10px] font-black uppercase tracking-widest bg-orange-50 p-4 rounded-2xl border border-orange-100 text-center animate-pulse">{error}</div>}
              <button type="submit" className="w-full py-5 bg-unicou-navy text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">VERIFY IDENTITY NODE</button>
              <button type="button" onClick={() => setStep('email')} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-unicou-navy">Reset Identity Node</button>
            </form>
          </div>
        )}

        {step === 'complete' && (
          <form onSubmit={handleFinalSubmit} className="space-y-5 animate-in slide-in-from-bottom-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-unicou-navy uppercase tracking-widest ml-1">Full Legal Name</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold outline-none" placeholder="Student Name" />
            </div>
            
            <div className="space-y-2">
              <label className="text-[9px] font-black text-unicou-navy uppercase tracking-widest ml-1">Password Node</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} required value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 pr-12 text-sm font-bold outline-none focus:border-unicou-navy" 
                  placeholder="••••••••" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-unicou-slate hover:text-unicou-navy p-1">
                  <EyeIcon visible={showPassword} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-unicou-navy uppercase tracking-widest ml-1">Verify Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} required value={formData.confirmPassword} 
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 pr-12 text-sm font-bold outline-none focus:border-unicou-navy" 
                  placeholder="••••••••" 
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-unicou-slate hover:text-unicou-navy p-1">
                  <EyeIcon visible={showConfirmPassword} />
                </button>
              </div>
            </div>

            {error && <div className="text-unicou-orange text-[10px] font-black uppercase tracking-widest bg-orange-50 p-4 rounded-2xl border border-orange-100 text-center animate-pulse">{error}</div>}
            
            <button type="submit" className="w-full py-5 bg-unicou-orange text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">ESTABLISH IDENTITY NODE</button>
          </form>
        )}

        <div className="text-center pt-8 mt-8 border-t border-slate-50">
          <button type="button" onClick={onNavigateToLogin} className="text-[10px] text-unicou-charcoal font-bold uppercase tracking-widest hover:text-unicou-orange transition-colors">
            Existing Student? <span className="text-unicou-navy font-black">Sign In</span>
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-50 p-8 md:p-12 rounded-[3.5rem] border border-slate-200 flex flex-col justify-center shadow-inner relative overflow-hidden">
        <h3 className="text-2xl font-black text-unicou-navy uppercase tracking-tight mb-8 border-b border-slate-200 pb-4">
          Partners / Agents
        </h3>
        <p className="text-unicou-charcoal text-sm font-bold italic leading-relaxed mb-8">
          Professional registration protocol for global partners and institutional representatives.
        </p>
        <button 
          onClick={() => window.open('https://afeic.pk/membership/', '_blank')}
          className="w-full py-5 bg-unicou-navy text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-black transition-all"
        >
          Institutional Entry Protocol
        </button>
      </div>
    </div>
  );
};

export default Signup;
