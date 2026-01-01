
import React, { useState } from 'react';
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
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    role: 'Student' as UserRole
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [simulatedCode, setSimulatedCode] = useState<string | null>(null);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.includes('@')) {
      setError("Please enter a valid email.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      await MailService.sendVerificationCode(formData.name || 'Student', formData.email);
      setStep('code-entry');
      setSimulatedCode(MailService.lastCodeDispatched);
    } catch (err: any) {
      setError("Failed to send code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (MailService.verifyStoredCode(formData.email, verificationCode)) {
      setStep('complete');
      setError('');
    } else {
      setError("Invalid verification code.");
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
      await api.verifyEmail(formData.email);
      onSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Signup failed.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 flex flex-col md:flex-row gap-12 animate-in fade-in duration-700 bg-white">
      {/* Left: Student Signup Form */}
      <div className="flex-1 bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl relative overflow-hidden h-fit">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-unicou-orange" />
        
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-black text-unicou-navy uppercase tracking-tight">
            Student <span className="text-unicou-orange">Sign Up</span>
          </h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">
            UniCou Ltd Student Registry
          </p>
        </div>

        {step === 'email' && (
          <form onSubmit={handleRequestCode} className="space-y-6">
            <input 
              type="email" required value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email Address"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-unicou-navy transition-all shadow-inner"
            />
            {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
            <button 
              type="submit" disabled={loading}
              className="w-full py-4 bg-unicou-navy text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg"
            >
              {loading ? 'Processing...' : 'Send Verification Code'}
            </button>
          </form>
        )}

        {step === 'code-entry' && (
          <form onSubmit={handleVerifyCode} className="space-y-8">
            {simulatedCode && (
              <div className="p-4 bg-unicou-orange/5 border border-unicou-orange/20 rounded-xl text-center">
                <p className="text-[10px] font-black text-unicou-orange uppercase tracking-widest mb-1">Authorization Code</p>
                <p className="text-xl font-mono font-black text-unicou-navy">{simulatedCode}</p>
              </div>
            )}
            <input 
              type="text" required maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="••••••"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-3xl font-mono font-black text-center text-unicou-navy outline-none focus:border-unicou-navy shadow-inner"
            />
            <button type="submit" className="w-full py-4 bg-unicou-navy text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">Verify & Continue</button>
          </form>
        )}

        {step === 'complete' && (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold outline-none" placeholder="Full Name" />
            <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold outline-none" placeholder="Password" />
            <input type="password" required value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold outline-none" placeholder="Confirm Password" />
            <button type="submit" className="w-full py-5 bg-unicou-orange text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">Setup My Portal</button>
          </form>
        )}

        <div className="text-center pt-8 mt-8 border-t border-slate-50">
          <button type="button" onClick={onNavigateToLogin} className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hover:text-unicou-orange">
            Existing Student? <span className="text-unicou-navy font-black">Sign In</span>
          </button>
        </div>
      </div>

      {/* Right: Agent/Professional Section */}
      <div className="flex-1 bg-slate-50 p-8 md:p-12 rounded-[3.5rem] border border-slate-200 flex flex-col justify-center shadow-inner relative overflow-hidden">
        <h3 className="text-2xl font-black text-unicou-navy uppercase tracking-tight mb-8 border-b border-slate-200 pb-4">
          Agents / Training Centers
        </h3>
        
        <p className="text-slate-600 text-sm font-bold italic leading-relaxed mb-8">
          The registration process for Agents and Training Centers involves high security and significant funds, so careful handling is essential. The process includes:
        </p>
        
        <div className="space-y-6 mb-10">
           {[
             { step: 'Registration Application', desc: 'Submission of required details.' },
             { step: 'Verification', desc: 'Thorough review of submitted information.' },
             { step: 'Decision', desc: 'Acceptance, further verification, or rejection.' },
             { step: 'Agreement', desc: 'Signing of the legal agreement.' },
             { step: 'Record Keeping', desc: 'All agreements and submitted information are securely maintained for future legal reference in case of any violations.' }
           ].map((item, idx) => (
             <div key={idx} className="flex gap-4">
                <div className="w-7 h-7 rounded-lg bg-unicou-navy text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-md">{idx + 1}</div>
                <div>
                   <h4 className="text-[11px] font-black uppercase text-unicou-navy mb-0.5">{item.step}</h4>
                   <p className="text-[11px] text-slate-500 font-medium italic leading-snug">{item.desc}</p>
                </div>
             </div>
           ))}
        </div>

        <div className="space-y-4">
           <a 
            href="https://afeic.pk/membership/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full py-5 bg-unicou-navy text-white text-center rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            Professional Sign-Up
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
          <p className="text-center text-[9px] text-slate-400 font-black uppercase tracking-widest opacity-60">Visit: https://afeic.pk/membership/</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
