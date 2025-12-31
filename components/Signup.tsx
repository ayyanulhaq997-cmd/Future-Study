
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

  const entropyStatus = 
    passwordStrength <= 25 ? 'CRITICAL' : 
    passwordStrength <= 50 ? 'POOR' : 
    passwordStrength <= 75 ? 'SECURE' : 
    'OPTIMAL';

  const roles: { label: string; value: UserRole }[] = [
    { label: 'Customer', value: 'Customer' },
    { label: 'Agent Partner', value: 'Agent' },
    { label: 'Sales Executive', value: 'Sales Executive' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Manager', value: 'Manager' },
    { label: 'Admin', value: 'Admin' }
  ];

  return (
    <div className="max-w-md mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-3xl relative overflow-hidden flex flex-col items-center">
        
        {/* Top Branding Section */}
        <div className="mb-10 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center mb-6 shadow-md">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect x='10' y='10' width='80' height='80' rx='12' fill='none' stroke='%23004a61' stroke-width='4'/%3E%3Cpath d='M30 40c0-2 2-4 4-4h28c2 0 4 2 4 4v35c0 2-2 4-4 4H34c-2 0-4-2-4-4V40z' fill='%23004a61'/%3E%3C/svg%3E" className="w-8 h-8" alt="Logo" />
          </div>
          <h2 className="text-4xl font-display font-black text-unicou-navy tracking-tight">New Identity</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Initialize your UNICOU Academy credentials.</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Role Access Selector */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Initialize Role Access</label>
            <div className="relative">
              <select 
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full bg-[#0d111d] border-none rounded-xl p-5 text-slate-100 font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500/50 transition-all"
              >
                {roles.map(r => (
                  <option key={r.value} value={r.value} className="bg-[#0d111d] text-white py-4">{r.label}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          {/* Email Identity */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Identity Node (Email)</label>
            <input 
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="alex@unicou.uk"
              className="w-full bg-[#0d111d] border-none rounded-xl p-5 text-white font-bold outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
          
          {/* Entropy Analysis / Password */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entropy Analysis</label>
              <span className={`text-[10px] font-black uppercase tracking-widest ${passwordStrength <= 25 ? 'text-red-500' : 'text-emerald-500'}`}>{entropyStatus}</span>
            </div>
            
            <div className="flex gap-1 h-1">
              {[25, 50, 75, 100].map((step) => (
                <div key={step} className={`flex-1 rounded-full transition-all duration-500 ${passwordStrength >= step ? strengthColor : 'bg-slate-800'}`} />
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Create Password</label>
                <input 
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-[#0d111d] border-none rounded-xl p-5 text-white font-bold outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Confirm Password</label>
                <input 
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-[#0d111d] border-none rounded-xl p-5 text-white font-bold outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          {error && <div className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center bg-red-500/5 py-3 rounded-xl border border-red-500/10">{error}</div>}

          {/* Action Trigger */}
          <div className="pt-6">
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 text-unicou-navy font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Processing Node...' : 'Initialize Credentials'}
            </button>
          </div>

          <div className="text-center pt-8">
            <p className="text-sm text-slate-400 font-bold">
              Already have an identity?{' '}
              <button 
                type="button" 
                onClick={onNavigateToLogin}
                className="text-slate-600 font-black hover:text-unicou-navy transition-colors"
              >
                Log In
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
