import React, { useState } from 'react';
import { api } from '../services/apiService';
import { User, ViewState } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  onNavigateToSignup: () => void;
  onBack?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToSignup, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await api.login(email);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto animate-slide-up bg-white py-12 px-4">
      <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-unicou-navy to-unicou-orange" />
        
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[2.5rem] mx-auto flex items-center justify-center mb-8 shadow-inner">
            <svg className="w-10 h-10 text-unicou-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 21a10.003 10.003 0 008.384-4.562l.054.09c1.744-2.772 2.753-6.054 2.753-9.571 0-5.523-4.477-10-10-10S2 6.477 2 12c0 1.933.55 3.738 1.5 5.264" /></svg>
          </div>
          <h2 className="text-4xl font-display font-black text-slate-900 tracking-tighter">Sign <span className="text-unicou-orange">In</span></h2>
          <p className="text-slate-500 text-[10px] mt-3 font-black uppercase tracking-[0.3em]">Access Your Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">Email ID</label>
            <input 
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@unicou.uk"
              className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-5 text-slate-900 outline-none focus:border-unicou-navy focus:bg-white transition-all shadow-inner font-bold"
            />
          </div>

          <div className="relative">
             <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">Password</label>
             <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-5 text-slate-900 outline-none focus:border-unicou-navy focus:bg-white transition-all shadow-inner font-bold" 
             />
             <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 bottom-5 text-slate-400 hover:text-unicou-navy transition-colors"
             >
                {showPassword ? (
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
             </button>
          </div>

          {error && <div className="text-red-600 text-xs font-bold bg-red-50 p-4 rounded-2xl border border-red-100 animate-pulse text-center">{error}</div>}

          <div className="flex flex-col gap-4">
             <button type="submit" disabled={loading} className="w-full py-6 bg-unicou-navy hover:bg-slate-950 text-white font-black uppercase text-xs tracking-widest rounded-3xl transition-all shadow-2xl active:scale-95 disabled:opacity-50">
               {loading ? 'Authenticating...' : 'Sign In'}
             </button>
             {onBack && (
                <button type="button" onClick={onBack} className="w-full py-5 bg-white border-2 border-unicou-navy text-unicou-navy font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-unicou-navy hover:text-white transition-all">Back</button>
             )}
          </div>

          <div className="text-center pt-8 border-t border-slate-100 mt-10">
            <p className="text-sm text-slate-600 font-medium">New to UniCou? <button type="button" onClick={onNavigateToSignup} className="text-unicou-orange font-black hover:underline underline-offset-8 transition-all">Sign Up</button></p>
          </div>
        </form>
      </div>
      
      <div className="mt-8 text-center p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 border-dashed">
         <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Sample Logins</h4>
         <div className="grid grid-cols-1 gap-3 text-[11px] font-mono text-slate-500">
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex justify-between px-6 items-center">
              <span className="font-black text-unicou-navy uppercase">Admin</span>
              <span>admin@unicou.uk</span>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex justify-between px-6 items-center">
              <span className="font-black text-emerald-600 uppercase">Finance</span>
              <span>finance@unicou.uk</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Login;