
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
      const user = await api.login(email);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-4 animate-in fade-in duration-500">
      <div className="glass p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-indigo-600 to-primary-400 rounded-t-full" />
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-primary-500/20 border border-white/10">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-display font-bold">Secure <span className="text-primary-400">Access</span></h2>
          <p className="text-slate-500 text-sm mt-2">Access your global education assets.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Professional Email</label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alex@nexus.ai"
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-5 text-slate-200 outline-none focus:border-primary-500 transition-all placeholder:text-slate-600"
            />
          </div>

          <div>
             <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Security Key</label>
             <input 
               type="password"
               placeholder="••••••••"
               className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-5 text-slate-200 outline-none focus:border-primary-500 transition-all placeholder:text-slate-600"
             />
          </div>

          {error && <p className="text-red-400 text-xs font-bold bg-red-500/10 p-4 rounded-xl border border-red-500/20">{error}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary-500/20 active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Establish Connection'}
          </button>

          <p className="text-center text-sm text-slate-500 pt-4">
            New to Nexus?{' '}
            <button 
              type="button" 
              onClick={onNavigateToSignup}
              className="text-primary-400 font-bold hover:underline"
            >
              Create Account
            </button>
          </p>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-800/50">
          <p className="text-center text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] mb-6">Demo Access Nodes</p>
          <div className="grid grid-cols-1 gap-3">
            <button onClick={() => setEmail('admin@nexus.ai')} className="text-[10px] bg-slate-900/50 border border-slate-800 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all text-slate-400 hover:text-white flex justify-between items-center group">
              <span>System Admin</span>
              <span className="opacity-0 group-hover:opacity-100 font-bold">SELECT</span>
            </button>
            <button onClick={() => setEmail('partner@edu.com')} className="text-[10px] bg-slate-900/50 border border-slate-800 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all text-slate-400 hover:text-white flex justify-between items-center group">
              <span>Agent Partner</span>
              <span className="opacity-0 group-hover:opacity-100 font-bold">SELECT</span>
            </button>
            <button onClick={() => setEmail('finance@nexus.ai')} className="text-[10px] bg-slate-900/50 border border-slate-800 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all text-slate-400 hover:text-white flex justify-between items-center group">
              <span>Finance Controller</span>
              <span className="opacity-0 group-hover:opacity-100 font-bold">SELECT</span>
            </button>
            <button onClick={() => setEmail('trainer@nexus.ai')} className="text-[10px] bg-slate-900/50 border border-slate-800 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all text-slate-400 hover:text-white flex justify-between items-center group">
              <span>Exam Grader</span>
              <span className="opacity-0 group-hover:opacity-100 font-bold">SELECT</span>
            </button>
            <button onClick={() => setEmail('alex@gmail.com')} className="text-[10px] bg-slate-900/50 border border-slate-800 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all text-slate-400 hover:text-white flex justify-between items-center group">
              <span>Verified Customer</span>
              <span className="opacity-0 group-hover:opacity-100 font-bold">SELECT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
