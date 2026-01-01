
import React, { useState } from 'react';
import { api } from '../services/apiService';
import { User, ViewState } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  onNavigateToSignup: () => void;
  onNavigateToForgot: () => void;
  onBack?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToSignup, onNavigateToForgot, onBack }) => {
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
      setError(err.message || 'Identity mismatch. Please verify node credentials.');
      setLoading(false);
    }
  };

  const staffHints = [
    { label: 'Trainer Node', alias: 'trainer' },
    { label: 'Admin Hub', alias: 'admin' },
    { label: 'Finance Port', alias: 'finance' }
  ];

  return (
    <div className="max-w-md mx-auto animate-slide-up bg-white py-12 px-4">
      <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-unicou-navy to-unicou-orange" />
        
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[2.5rem] mx-auto flex items-center justify-center mb-8 shadow-inner font-black text-2xl text-unicou-navy">
            U
          </div>
          <h2 className="text-4xl font-display font-black text-slate-900 tracking-tighter uppercase">Sign <span className="text-unicou-orange">In</span></h2>
          <p className="text-slate-500 text-[10px] mt-3 font-black uppercase tracking-[0.3em]">Access Your Authority Node</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3 ml-1">Email ID or Node Alias</label>
            <input 
              type="text" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@unicou.uk"
              className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-5 text-slate-900 outline-none focus:border-unicou-navy focus:bg-white transition-all shadow-inner font-bold"
            />
            <div className="flex flex-wrap gap-2 mt-4">
               {staffHints.map(hint => (
                 <button 
                  key={hint.alias} 
                  type="button" 
                  onClick={() => setEmail(hint.alias)}
                  className="px-3 py-1 bg-slate-100 rounded-lg text-[8px] font-black text-slate-400 hover:text-unicou-navy hover:bg-slate-200 transition-all uppercase tracking-widest"
                 >
                   Use {hint.label}
                 </button>
               ))}
            </div>
          </div>

          <div className="relative">
             <div className="flex justify-between items-center mb-3 ml-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Security Token</label>
                <button type="button" onClick={onNavigateToForgot} className="text-[10px] font-black text-unicou-orange hover:underline uppercase tracking-widest">Recovery?</button>
             </div>
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
                {showPassword ? 'Hide' : 'Show'}
             </button>
          </div>

          {error && <div className="text-red-600 text-[10px] font-black uppercase tracking-widest bg-red-50 p-4 rounded-2xl border border-red-100 text-center leading-relaxed">{error}</div>}

          <div className="flex flex-col gap-4">
             <button type="submit" disabled={loading} className="w-full py-6 bg-unicou-navy hover:bg-slate-950 text-white font-black uppercase text-xs tracking-widest rounded-3xl transition-all shadow-2xl active:scale-95 disabled:opacity-50">
               {loading ? 'Authenticating Node...' : 'Establish Session'}
             </button>
             {onBack && (
                <button type="button" onClick={onBack} className="w-full py-5 bg-white border-2 border-unicou-navy text-unicou-navy font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-unicou-navy hover:text-white transition-all">Back</button>
             )}
          </div>

          <div className="text-center pt-8 border-t border-slate-100 mt-10">
            <p className="text-sm text-slate-600 font-medium">New Entity? <button type="button" onClick={onNavigateToSignup} className="text-unicou-orange font-black hover:underline underline-offset-8 transition-all">Create Node</button></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
