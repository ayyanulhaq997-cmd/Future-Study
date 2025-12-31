import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { UserRole } from '../types';

interface SignupProps {
  onSuccess: (email: string) => void;
  onNavigateToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSuccess, onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Customer' as UserRole
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
      setError("Please choose a stronger password");
      return;
    }

    setLoading(true);
    setError('');
    try {
      await api.signup(formData.email, formData.role);
      onSuccess(formData.email);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
      setLoading(false);
    }
  };

  const strengthColor = 
    passwordStrength <= 25 ? 'bg-red-500' : 
    passwordStrength <= 50 ? 'bg-orange-500' : 
    passwordStrength <= 75 ? 'bg-yellow-500' : 
    'bg-emerald-500';

  const strengthLabel = 
    passwordStrength <= 25 ? 'Weak' : 
    passwordStrength <= 50 ? 'Fair' : 
    passwordStrength <= 75 ? 'Strong' : 
    'Excellent';

  const roles: UserRole[] = ['Customer', 'Agent', 'Trainer', 'Finance', 'Admin'];

  return (
    <div className="max-w-md mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="glass p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
        </div>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-600/10 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg border border-primary-500/20">
            <svg className="w-8 h-8 text-unicou-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 21a10.003 10.003 0 008.384-4.562l.054.09c1.744-2.772 2.753-6.054 2.753-9.571 0-5.523-4.477-10-10-10S2 6.477 2 12c0 1.933.55 3.738 1.5 5.264" />
            </svg>
          </div>
          <h2 className="text-4xl font-display font-black text-slate-900 tracking-tighter">Sign <span className="text-unicou-orange">Up</span></h2>
          <p className="text-slate-500 text-sm mt-2">Create your UniCou account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">I am registering as a...</label>
              <div className="relative">
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 outline-none focus:border-unicou-navy transition-all appearance-none cursor-pointer font-bold"
                >
                  {roles.map(r => (
                    <option key={r} value={r}>{r === 'Trainer' ? 'Trainer' : r === 'Agent' ? 'Partner Agent' : r}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Email ID</label>
              <input 
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alex@unicou.uk"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 outline-none focus:border-unicou-navy transition-all font-bold"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Password</label>
              <input 
                type="password"
                required
                autoComplete="new-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 outline-none focus:border-unicou-navy transition-all font-bold"
              />
              <div className="mt-3 flex gap-1 h-1.5">
                {[25, 50, 75, 100].map((step) => (
                  <div key={step} className={`flex-1 rounded-full transition-all duration-500 ${passwordStrength >= step ? strengthColor : 'bg-slate-200'}`} />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Confirm Password</label>
              <input 
                type="password"
                required
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 outline-none focus:border-unicou-navy transition-all font-bold"
              />
            </div>
          </div>

          {error && <div className="text-red-600 text-[11px] font-bold bg-red-50 p-3 rounded-lg border border-red-100 text-center">{error}</div>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-unicou-navy hover:bg-slate-900 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50 uppercase tracking-widest text-xs"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{' '}
            <button 
              type="button" 
              onClick={onNavigateToLogin}
              className="text-unicou-orange font-bold hover:underline"
            >
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;