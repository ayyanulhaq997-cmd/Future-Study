
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
      // Requirement 4: Incorrect User ID or Password
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
    <div className="max-w-md mx-auto animate-slide-up bg-white py-6 px-4">
      <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-200 shadow-3xl relative overflow-hidden">
        {/* Requirement 1: Solid orange line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-unicou-orange" />
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-[2rem] mx-auto flex items-center justify-center mb-6 shadow-inner font-black text-xl text-unicou-navy">
            U
          </div>
          {/* Requirement 5: Sign In */}
          <h2 className="text-3xl font-display font-black text-slate-900 tracking-tighter uppercase leading-none">Sign <span className="text-unicou-orange">In</span></h2>
          <p className="text-slate-500 text-[9px] mt-2 font-black uppercase tracking-[0.2em]">Access Your Authority Node</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            {/* Requirement 2: User ID */}
            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-1">User ID</label>
            <input 
              type="text" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@unicou.uk"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 outline-none focus:border-unicou-navy focus:bg-white transition-all shadow-inner font-bold text-sm"
            />
            <div className="flex flex-wrap gap-1.5 mt-3">
               {staffHints.map(hint => (
                 <button 
                  key={hint.alias} 
                  type="button" 
                  onClick={() => setEmail(hint.alias)}
                  className="px-2.5 py-1 bg-slate-100 rounded-lg text-[8px] font-black text-slate-400 hover:text-unicou-navy hover:bg-slate-200 transition-all uppercase tracking-widest"
                 >
                   Use {hint.label}
                 </button>
               ))}
            </div>
          </div>

          <div className="relative">
             <div className="flex justify-between items-center mb-2 ml-1">
                {/* Requirement 3: Password */}
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Password</label>
                <button type="button" onClick={onNavigateToForgot} className="text-[9px] font-black text-unicou-orange hover:underline uppercase tracking-widest">Recovery?</button>
             </div>
             <input 
                type={showPassword ? "text" : "password"} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 outline-none focus:border-unicou-navy focus:bg-white transition-all shadow-inner font-bold text-sm" 
             />
             <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 bottom-4 text-slate-400 hover:text-unicou-navy transition-colors text-xs"
             >
                {showPassword ? 'Hide' : 'Show'}
             </button>
          </div>

          {/* Requirement 4: Incorrect User ID or Password */}
          {error && <div className="text-red-600 text-[9px] font-black uppercase tracking-widest bg-red-50 p-3 rounded-xl border border-red-100 text-center leading-tight">{error}</div>}

          <div className="flex flex-col gap-3">
             {/* Requirement 5: Sign In */}
             <button type="submit" disabled={loading} className="w-full py-5 bg-unicou-navy hover:bg-slate-950 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl transition-all shadow-2xl active:scale-95 disabled:opacity-50">
               {loading ? 'Authenticating...' : 'Sign In'}
             </button>
             {onBack && (
                <button type="button" onClick={onBack} className="w-full py-4 bg-white border-2 border-unicou-navy text-unicou-navy font-black uppercase text-[9px] tracking-widest rounded-xl hover:bg-unicou-navy hover:text-white transition-all">Back</button>
             )}
          </div>

          <div className="text-center pt-6 border-t border-slate-100 mt-6">
            {/* Requirement 6: Sign Up */}
            <p className="text-xs text-slate-600 font-medium">New Entity? <button type="button" onClick={onNavigateToSignup} className="text-unicou-orange font-black hover:underline underline-offset-4 transition-all">Sign Up</button></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
