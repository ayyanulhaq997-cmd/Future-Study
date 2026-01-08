
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

  // Monitor the global window variable for simulated codes to help users in local testing
  useEffect(() => {
    const interval = setInterval(() => {
      const code = (window as any)._last_unicou_code;
      if (code && code !== debugCode) setDebugCode(code);
    }, 1000);
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
      setError("Dispatch Transmission Failure.");
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
      (window as any)._last_unicou_code = null;
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
          <form onSubmit={handleVerifyCode} className="space-y-8">
            <div className="text-center space-y-2 mb-4">
              <p className="text-xs text-slate-500 font-bold italic">Verification code dispatched to your identity node.</p>
              {debugCode && (
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                   <p className="text-[10px] font-black text-unicou-orange uppercase mb-1">Internal Debug Bypass</p>
                   <p className="text-2xl font-mono font-black text-unicou-navy tracking-widest">{debugCode}</p>
                   <p className="text-[8px] text-slate-400 mt-2">This is visible only because Email Server is in Local Mode.</p>
                </div>
              )}
            </div>
            <input 
              type="text" required maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="000000"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-3xl font-mono font-black text-center text-unicou-navy outline-none focus:border-unicou-navy shadow-inner"
            />
            {error && <div className="text-unicou-orange text-[10px] font-black uppercase tracking-widest bg-orange-50 p-4 rounded-2xl border border-orange-100 text-center animate-pulse">{error}</div>}
            <button type="submit" className="w-full py-4 bg-unicou-navy text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">VERIFY IDENTITY NODE</button>
            <button type="button" onClick={() => setStep('email')} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-unicou-navy">Incorrect Email? Back</button>
          </form>
        )}

        {step === 'complete' && (
          <form onSubmit={handleFinalSubmit} className="space-y-5">
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
