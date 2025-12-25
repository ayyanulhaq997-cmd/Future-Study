import React, { useState } from 'react';
import { api } from '../services/apiService';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  onNavigateToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToSignup }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // API call now uses case-insensitive matching internally
      const user = await api.login(email);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Verification node failed. Registry mismatch.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto animate-slide-up">
      <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-unicou-navy" />
        
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[2rem] mx-auto flex items-center justify-center mb-8 shadow-inner">
            <svg className="w-10 h-10 text-unicou-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 21a10.003 10.003 0 008.384-4.562l.054.09c1.744-2.772 2.753-6.054 2.753-9.571 0-5.523-4.477-10-10-10S2 6.477 2 12c0 1.933.55 3.738 1.5 5.264" /></svg>
          </div>
          <h2 className="text-4xl font-display font-bold text-slate-900">Nexus <span className="text-unicou-orange">Auth</span></h2>
          <p className="text-slate-400 text-sm mt-3 font-medium uppercase tracking-widest">Global Identity Registry</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">Identity (Email)</label>
            <input 
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@unicou.uk"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-900 outline-none focus:border-unicou-navy focus:bg-white transition-all shadow-inner"
            />
          </div>

          <div>
             <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">Security Key</label>
             <input 
               type="password" placeholder="••••••••"
               className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-900 outline-none focus:border-unicou-navy focus:bg-white transition-all shadow-inner"
             />
          </div>

          {error && <div className="text-red-600 text-xs font-bold bg-red-50 p-4 rounded-xl border border-red-100 animate-pulse text-center">{error}</div>}

          <button 
            type="submit" disabled={loading}
            className="w-full py-6 bg-unicou-navy hover:bg-slate-900 text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Decrypting Protocol...' : 'Initialize Session'}
          </button>

          <div className="text-center pt-4 border-t border-slate-50 mt-10">
            <p className="text-sm text-slate-500">
              New to UNICOU?{' '}
              <button type="button" onClick={onNavigateToSignup} className="text-unicou-orange font-black hover:underline underline-offset-4">Create Registry</button>
            </p>
          </div>
        </form>
      </div>
      
      <div className="mt-8 text-center p-8 glass rounded-[2rem] border-slate-200">
         <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Demo Staff Credentials</h4>
         <div className="grid grid-cols-2 gap-4 text-[11px] font-mono text-slate-500">
            <div className="bg-white p-3 rounded-xl border border-slate-100">admin@unicou.uk</div>
            <div className="bg-white p-3 rounded-xl border border-slate-100">finance@unicou.uk</div>
         </div>
      </div>
    </div>
  );
};

export default Login;