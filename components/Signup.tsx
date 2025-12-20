
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';

interface SignupProps {
  onSuccess: (email: string) => void;
  onNavigateToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSuccess, onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    let strength = 0;
    if (formData.password.length >= 8) strength += 25;
    if (/[A-Z]/.test(formData.password)) strength += 25;
    if (/[0-9]/.test(formData.password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 25;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (passwordStrength < 50) {
      setError("Your password does not meet the minimum security requirements");
      return;
    }

    setLoading(true);
    setError('');
    try {
      await api.signup(formData.email);
      onSuccess(formData.email);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try a different email.');
      setLoading(false);
    }
  };

  const strengthColor = 
    passwordStrength <= 25 ? 'bg-red-500' : 
    passwordStrength <= 50 ? 'bg-orange-500' : 
    passwordStrength <= 75 ? 'bg-yellow-500' : 
    'bg-emerald-500';

  const strengthLabel = 
    passwordStrength <= 25 ? 'Critical' : 
    passwordStrength <= 50 ? 'Vulnerable' : 
    passwordStrength <= 75 ? 'Strong' : 
    'Unbreakable';

  return (
    <div className="max-w-md mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
        </div>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-600/10 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg border border-primary-500/20">
            <svg className="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 21a10.003 10.003 0 008.384-4.562l.054.09c1.744-2.772 2.753-6.054 2.753-9.571 0-5.523-4.477-10-10-10S2 6.477 2 12c0 1.933.55 3.738 1.5 5.264" />
            </svg>
          </div>
          <h2 className="text-3xl font-display font-bold">New <span className="text-primary-400">Identity</span></h2>
          <p className="text-slate-500 text-sm mt-2">Initialize your Nexus Academy credentials.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Primary Email</label>
              <input 
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alex@nexus-edu.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 outline-none focus:border-primary-500 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Secret Password</label>
              <input 
                type="password"
                required
                autoComplete="new-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 outline-none focus:border-primary-500 transition-all"
              />
              <div className="mt-3 flex gap-1 h-1.5">
                {[25, 50, 75, 100].map((step) => (
                  <div key={step} className={`flex-1 rounded-full transition-all duration-500 ${passwordStrength >= step ? strengthColor : 'bg-slate-800'}`} />
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-2 flex justify-between uppercase font-bold tracking-tighter">
                <span>Entropy Analysis</span>
                <span className={passwordStrength >= 50 ? (passwordStrength >= 75 ? 'text-emerald-400' : 'text-primary-400') : 'text-red-400'}>
                  {strengthLabel}
                </span>
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Verify Password</label>
              <input 
                type="password"
                required
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 outline-none focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          {error && <div className="text-red-400 text-[11px] font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center">{error}</div>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary-500/20 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              'Create My Terminal'
            )}
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-[#020617] px-4 text-slate-600">Or use Social ID</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <button type="button" className="flex items-center justify-center gap-3 py-3 glass rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
             </button>
             <button type="button" className="flex items-center justify-center gap-3 py-3 glass rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Social
             </button>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an identity?{' '}
            <button 
              type="button" 
              onClick={onNavigateToLogin}
              className="text-primary-400 font-bold hover:underline"
            >
              Log In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
