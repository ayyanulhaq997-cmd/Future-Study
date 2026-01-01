
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
      const user = await api.verifyLogin(userId, '123456'); 
      onLogin(user);
    } catch (err: any) {
      setError("Incorrect User ID or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[440px] mx-auto animate-slide-up bg-white py-16 px-4">
      <div className="bg-white p-12 md:p-14 rounded-[4rem] border border-slate-100 shadow-3xl relative overflow-hidden">
        {/* Requirement: Vivid Red line color */}
        <div className="absolute top-0 left-0 w-full h-2 bg-unicou-orange" />
        
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-[2.5rem] mx-auto flex items-center justify-center mb-8 shadow-inner font-black text-4xl text-unicou-navy">
            U
          </div>
          <h2 className="text-4xl font-display font-black text-unicou-navy tracking-tighter uppercase leading-none">
            Secure <span className="text-unicou-orange">Access</span>
          </h2>
          <p className="text-unicou-charcoal text-[10px] mt-6 font-black uppercase tracking-[0.4em]">Establishing Protocol Node</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-8">
          <div>
            <label className="block text-[10px] font-black text-unicou-navy uppercase tracking-[0.2em] mb-4 ml-1">User ID</label>
            <input 
              type="text" required value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="e.g. user@unicou.uk"
              className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-5 text-unicou-charcoal outline-none focus:border-unicou-navy focus:bg-white transition-all shadow-inner font-bold text-lg placeholder:text-unicou-slate"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4 ml-1">
              <label className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.2em]">Password</label>
              <button type="button" onClick={onNavigateToForgot} className="text-[9px] font-black text-unicou-orange uppercase tracking-widest hover:underline">Recovery?</button>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} required value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-5 pr-14 text-unicou-charcoal outline-none focus:border-unicou-navy focus:bg-white transition-all shadow-inner font-bold text-lg"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-unicou-slate hover:text-unicou-navy transition-colors p-2"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                )}
              </button>
            </div>
          </div>

          {error && <div className="text-unicou-orange text-[10px] font-black uppercase tracking-widest bg-orange-50 p-4 rounded-2xl border border-orange-100 text-center animate-pulse">{error}</div>}

          <button type="submit" disabled={loading} className="w-full py-6 bg-unicou-navy hover:bg-slate-950 text-white font-black uppercase text-xs tracking-[0.25em] rounded-[2rem] transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4">
            {loading ? 'SYNCING...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-10 border-t border-slate-50 mt-12">
          <p className="text-xs text-unicou-charcoal font-bold uppercase tracking-tight">New Student? <button type="button" onClick={onNavigateToSignup} className="text-unicou-orange font-black hover:underline underline-offset-4 transition-all ml-1">Sign Up</button></p>
        </div>
      </div>
    </div>
  );
};

export default Login;