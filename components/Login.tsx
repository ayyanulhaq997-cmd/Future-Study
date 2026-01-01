
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
      setError('Incorrect User ID or Password');
      setLoading(false);
    }
  };

  const staffHints = [
    { label: 'Trainer', alias: 'trainer' },
    { label: 'Admin', alias: 'admin' },
    { label: 'Finance', alias: 'finance' },
    { label: 'Sales', alias: 'sales' }
  ];

  return (
    <div className="max-w-[400px] mx-auto animate-slide-up bg-white py-4 px-4">
      <div className="bg-white p-8 md:p-9 rounded-[2.5rem] border border-slate-100 shadow-2xl relative overflow-hidden">
        {/* Requirement: Solid orange line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-unicou-orange" />
        
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-full mx-auto flex items-center justify-center mb-4 shadow-inner font-black text-xl text-unicou-navy">
            U
          </div>
          <h2 className="text-2xl font-display font-black text-slate-900 tracking-tighter uppercase leading-none">
            Sign <span className="text-unicou-orange">In</span>
          </h2>
          <p className="text-slate-400 text-[8px] mt-2 font-black uppercase tracking-[0.2em]">Access Your Authority Node</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5 ml-1">User ID</label>
            <input 
              type="text" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@unicou.uk"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-slate-900 outline-none focus:border-unicou-navy focus:bg-white transition-all shadow-inner font-bold text-sm"
            />
            <div className="flex flex-wrap gap-1 mt-2">
               {staffHints.map(hint => (
                 <button 
                  key={hint.alias} 
                  type="button" 
                  onClick={() => setEmail(hint.alias)}
                  className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[7px] font-black text-slate-400 hover:text-unicou-navy hover:bg-slate-100 transition-all uppercase tracking-widest"
                 >
                   Use {hint.label}
                 </button>
               ))}
            </div>
          </div>

          <div className="relative">
             <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Password</label>
                <button type="button" onClick={onNavigateToForgot} className="text-[8px] font-black text-unicou-orange hover:underline uppercase tracking-widest">Recovery?</button>
             </div>
             <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-slate-900 outline-none focus:border-unicou-navy focus:bg-white transition-all shadow-inner font-bold text-sm" 
             />
             <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 bottom-3.5 text-slate-400 hover:text-unicou-navy transition-colors text-[10px] font-bold"
             >
                {showPassword ? 'Hide' : 'Show'}
             </button>
          </div>

          {error && <div className="text-red-600 text-[8px] font-black uppercase tracking-widest bg-red-50 p-2 rounded-lg border border-red-100 text-center">{error}</div>}

          <div className="flex flex-col gap-2 pt-2">
             <button type="submit" disabled={loading} className="w-full py-4 bg-unicou-navy hover:bg-slate-950 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl transition-all shadow-xl active:scale-95 disabled:opacity-50">
               {loading ? 'Authenticating...' : 'Sign In'}
             </button>
             {onBack && (
                <button type="button" onClick={onBack} className="w-full py-3 bg-white border border-slate-200 text-unicou-navy font-black uppercase text-[9px] tracking-widest rounded-xl hover:bg-slate-50 transition-all">Back</button>
             )}
          </div>

          <div className="text-center pt-4 border-t border-slate-50 mt-4">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">New Entity? <button type="button" onClick={onNavigateToSignup} className="text-unicou-orange font-black hover:underline underline-offset-4 transition-all">Sign Up</button></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;