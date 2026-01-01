
import React, { useState } from 'react';
import { api } from '../services/apiService';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  onNavigateToSignup: () => void;
  onNavigateToForgot: () => void;
  onBack?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToSignup, onNavigateToForgot, onBack }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !password.trim()) {
       setError("Incorrect User ID or Password");
       return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // For demonstration, using a mock verification. 
      // In production, this would call a real backend.
      const user = await api.verifyLogin(userId, '123456'); 
      onLogin(user);
    } catch (err: any) {
      setError("Incorrect User ID or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[400px] mx-auto animate-slide-up bg-white py-10 px-4">
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl relative overflow-hidden">
        {/* Requirement: Vivid Red line color */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-unicou-orange" />
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-inner font-black text-2xl text-unicou-navy">
            U
          </div>
          <h2 className="text-3xl font-display font-black text-unicou-navy tracking-tighter uppercase leading-none">
            Secure <span className="text-unicou-orange">Access</span>
          </h2>
          <p className="text-slate-400 text-[9px] mt-4 font-black uppercase tracking-[0.3em]">Protocol Node Authentication</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <div>
            <label className="block text-[9px] font-black text-unicou-navy uppercase tracking-[0.2em] mb-2.5 ml-1">User ID</label>
            <input 
              type="text" required value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="e.g. user@unicou.uk"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-unicou-charcoal outline-none focus:border-unicou-navy focus:bg-white transition-all shadow-inner font-bold text-base placeholder:text-unicou-slate"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2.5 ml-1">
              <label className="text-[9px] font-black text-unicou-navy uppercase tracking-[0.2em]">Password</label>
              <button type="button" onClick={onNavigateToForgot} className="text-[8px] font-black text-unicou-orange uppercase tracking-widest hover:underline">Recovery?</button>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} required value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pr-12 text-unicou-charcoal outline-none focus:border-unicou-navy focus:bg-white transition-all shadow-inner font-bold text-base"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-unicou-slate hover:text-unicou-navy transition-colors p-1.5"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                )}
              </button>
            </div>
          </div>

          {error && <div className="text-unicou-orange text-[9px] font-black uppercase tracking-widest bg-orange-50 p-3.5 rounded-xl border border-orange-100 text-center animate-pulse">{error}</div>}

          <button type="submit" disabled={loading} className="w-full py-4 bg-unicou-navy hover:bg-slate-900 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3">
            {loading ? 'SYNCING...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-8 border-t border-slate-50 mt-8">
          <p className="text-[11px] text-unicou-charcoal font-bold uppercase tracking-tight">New Student? <button type="button" onClick={onNavigateToSignup} className="text-unicou-orange font-black hover:underline underline-offset-4 transition-all ml-1">Sign Up</button></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
