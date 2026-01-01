
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { User, Order } from '../types';

const SupportDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    const u = await api.getUsers();
    setUsers(u);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleBypass = async (email: string) => {
    if (confirm(`Authorize manual override for student: ${email}? This allows them to bypass the 1-per-day restriction.`)) {
       await api.bypassUserQuota(email);
       alert(`Authorization Node Updated: Student can now purchase their next voucher immediately.`);
       fetchData();
    }
  };

  const filtered = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) || 
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase text-[11px] tracking-[0.4em]">Establishing Support Node...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-emerald-100">
           <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
           Live Services Hub
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-black text-slate-950 uppercase tracking-tighter leading-none mb-6">Support <span className="text-emerald-600">Terminal</span></h1>
        <p className="text-xl text-slate-500 font-bold italic leading-relaxed max-w-2xl border-l-4 border-emerald-500 pl-8">
           "Search student nodes to authorize manual quota overrides or investigate identity synchronization issues."
        </p>
      </div>

      <div className="bg-slate-950 p-12 md:p-16 rounded-[4rem] text-white shadow-3xl mb-12 relative overflow-hidden">
         <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />
         <div className="relative z-10 mb-12">
            <h3 className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.4em] mb-6">Identity Registry Search</h3>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-2xl font-bold outline-none focus:border-emerald-500 focus:bg-white/10 transition-all placeholder:text-white/20" 
              placeholder="Enter Student Email or Full Name Identity..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
         </div>
         
         <div className="space-y-4 relative z-10">
            {filtered.slice(0, 5).map(u => (
              <div key={u.id} className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center group hover:bg-white/10 transition-all">
                 <div className="mb-6 sm:mb-0">
                   <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-black uppercase tracking-tight">{u.name}</h4>
                      {u.verified && <span className="text-[8px] bg-emerald-500 text-white px-2 py-0.5 rounded font-black uppercase">Verified Node</span>}
                   </div>
                   <p className="text-emerald-400 font-mono text-xs opacity-60 tracking-wider">{u.email}</p>
                   <div className="mt-4 flex gap-4">
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Role: {u.role}</span>
                      {u.canBypassQuota && <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 animate-pulse">✓ Quota Bypass Active</span>}
                   </div>
                 </div>
                 
                 {u.role === 'Student' && !u.canBypassQuota && (
                   <button 
                     onClick={() => handleBypass(u.email)} 
                     className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-emerald-600/20 transition-all active:scale-95"
                   >
                     AUTHORIZE NEXT ORDER
                   </button>
                 )}
              </div>
            ))}
            {search && filtered.length === 0 && (
              <div className="py-20 text-center opacity-40 italic font-bold">"No active identity matches your query."</div>
            )}
         </div>
      </div>
    </div>
  );
};

export default SupportDashboard;
