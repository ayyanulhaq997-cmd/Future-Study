
import React, { useState } from 'react';
import { api } from '../services/apiService';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
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
    } catch (err) {
      setError('Email not found. Use admin@nexus.ai, partner@edu.com, or alex@gmail.com');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20">
      <div className="glass p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-primary-500/20">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold">Secure Access</h2>
          <p className="text-slate-500 text-sm mt-2">Enter your email to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Email Address</label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@nexus.ai"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 outline-none focus:border-primary-500 transition-all"
            />
          </div>

          {error && <p className="text-red-400 text-xs font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary-500/20"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-slate-800/50">
          <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">Demo Credentials</p>
          <div className="grid grid-cols-1 gap-2 mt-4">
            <button onClick={() => setEmail('admin@nexus.ai')} className="text-[10px] bg-slate-800 p-2 rounded hover:bg-slate-700 transition-colors">admin@nexus.ai (Admin)</button>
            <button onClick={() => setEmail('partner@edu.com')} className="text-[10px] bg-slate-800 p-2 rounded hover:bg-slate-700 transition-colors">partner@edu.com (Agent)</button>
            <button onClick={() => setEmail('alex@gmail.com')} className="text-[10px] bg-slate-800 p-2 rounded hover:bg-slate-700 transition-colors">alex@gmail.com (Customer)</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
