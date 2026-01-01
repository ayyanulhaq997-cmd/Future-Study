
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
  const [showPassword, setShowPassword] = useState(false);
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
      const user = await api.signup(formData.email, formData.role);
      await api.verifyEmail(formData.email);
      onSuccess(user);
    } catch (err: any) {
      setError(err.message || 'Signup failed.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-4 animate-in fade-in duration-500">
      <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
        {/* Requirement 1 style consistency: Solid orange line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-unicou-orange" />
        
        <div className="text-center mb-8">
          {/* Requirement 6: Sign Up */}
          <h2 className="text-3xl font-display font-black text-unicou-navy uppercase tracking-tight">
            {step === 'complete' ? 'Setup Profile' : 'Sign Up'}
          </h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">
            UniCou Global Registry
          </p>
        </div>

        {step === 'email' && (
          <form onSubmit={handleRequestCode} className="space-y-5">
            <input 
              type="email" required value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email Address (User ID)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold outline-none focus:border-unicou-navy transition-all"
            />
            {error && <p className="text-red-500 text-xs font-bold text-center">{error}</p>}
            <button 
              type="submit" disabled={loading}
              className="w-full py-4 bg-unicou-navy text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all"
            >
              {loading ? 'Processing...' : 'Send Verification Code'}
            </button>
          </form>
        )}

        {step === 'code-entry' && (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            {simulatedCode && (
              <div className="p-4 bg-unicou-orange/5 border border-unicou-orange/20 rounded-xl text-center">
                <p className="text-[10px] font-black text-unicou-orange uppercase tracking-widest mb-1">Test Code (Automatic)</p>
                <p className="text-xl font-mono font-black text-unicou-navy">{simulatedCode}</p>
              </div>
            )}
            <input 
              type="text" required maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit Code"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-2xl font-mono font-black text-center text-unicou-navy outline-none focus:border-unicou-navy"
            />
            <button type="submit" className="w-full py-4 bg-unicou-navy text-white rounded-xl font-black text-xs uppercase tracking-widest">Verify Code</button>
          </form>
        )}

        {step === 'complete' && (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold outline-none" placeholder="Full Name" />
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold outline-none">
              <option value="Student">Student (Default)</option>
              <option value="Agent Partner/Prep Center">Agent / Academy Partner</option>
            </select>
            <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold outline-none" placeholder="Password" />
            <input type="password" required value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-bold outline-none" placeholder="Confirm Password" />
            <button type="submit" className="w-full py-4 bg-unicou-orange text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg">Sign Up</button>
          </form>
        )}

        <div className="text-center pt-6 mt-6 border-t border-slate-100">
          <button type="button" onClick={onNavigateToLogin} className="text-xs text-slate-400 font-bold uppercase tracking-widest hover:text-unicou-orange">
            Have an account? <span className="text-unicou-navy font-black">Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
