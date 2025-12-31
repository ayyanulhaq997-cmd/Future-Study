
import React, { useState } from 'react';
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
    role: 'Student' as UserRole
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please verify your security string.");
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.signup(formData.email, formData.role);
      alert("Registration request received. Please check your email for a verification link.");
      onSuccess(formData.email);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
      setLoading(false);
    }
  };

  const roles: { label: string; value: UserRole }[] = [
    { label: 'Student (Direct Consumer)', value: 'Student' },
    { label: 'Agent Partner / Center', value: 'Agent Partner/Prep Center' },
    { label: 'Academic Trainer', value: 'Lead Trainer' },
    { label: 'Support / Sales Executive', value: 'Support/Sales Node' },
  ];

  return (
    <div className="max-w-md mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-3xl relative overflow-hidden">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-display font-black text-unicou-navy tracking-tight uppercase leading-none">Create <span className="text-unicou-orange">Account</span></h2>
          <p className="text-slate-500 text-[10px] mt-3 font-black uppercase tracking-widest">Start Your UniCou Journey</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">User Type</label>
            <select 
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-900 font-bold outline-none focus:border-unicou-navy"
            >
              {roles.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Email Address</label>
            <input 
              type="email" required value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. john@example.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-900 font-bold outline-none focus:border-unicou-navy"
            />
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <div className="flex justify-between mb-3">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Password</label>
                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[10px] font-black text-unicou-navy uppercase tracking-widest">{showPassword ? 'Hide' : 'Show'}</button>
              </div>
              <input 
                type={showPassword ? "text" : "password"} required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-900 font-bold outline-none focus:border-unicou-navy"
              />
            </div>

            <input 
              type={showPassword ? "text" : "password"} required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Confirm Password"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-900 font-bold outline-none focus:border-unicou-navy"
            />
          </div>

          {error && <div className="text-red-500 text-[9px] font-black uppercase text-center bg-red-50 py-3 rounded-xl border border-red-100">{error}</div>}

          <button 
            type="submit" disabled={loading}
            className="w-full py-6 bg-unicou-navy text-white rounded-2xl shadow-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-950 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>

          <div className="text-center pt-6">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              Already have an account?{' '}
              <button type="button" onClick={onNavigateToLogin} className="text-unicou-orange font-black hover:underline">Sign In</button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
