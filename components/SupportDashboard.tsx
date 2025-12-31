
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { User, Order } from '../types';

const SupportDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');

  const fetchData = async () => {
    const [u, o] = await Promise.all([api.getUsers(), api.getOrders()]);
    setUsers(u);
    setOrders(o);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAllowNextOrder = (email: string) => {
    // In a real system, this would toggle a 'can_bypass_quota' flag on the user record in the DB.
    alert(`SECURITY OVERRIDE: Daily restriction lifted for ${email}. User is authorized for immediate procurement.`);
  };

  const filteredUsers = users.filter(u => u.email.toLowerCase().includes(searchEmail.toLowerCase()));

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase tracking-[0.4em]">Establishing Support Sync...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24 bg-white">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-display font-black tracking-tight text-slate-900 leading-none uppercase">Support <span className="text-emerald-500">Portal</span></h1>
          <p className="text-slate-500 mt-4 font-bold uppercase text-xs tracking-widest">Front End Services Terminal • Operator: {user.name}</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-emerald-50 border border-emerald-100 px-6 py-3 rounded-2xl flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Bypass Engine Online</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        <div className="bg-slate-900 p-10 rounded-[3.5rem] shadow-2xl text-white">
           <h3 className="text-sm font-black uppercase tracking-widest mb-8 text-white/50">Quota Authorization Engine</h3>
           <div className="relative mb-10">
              <input 
                type="text" value={searchEmail} onChange={e => setSearchEmail(e.target.value)}
                placeholder="Lookup Registered Email ID..."
                className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-8 text-xl font-bold text-white outline-none focus:border-emerald-500 transition-all"
              />
              <div className="absolute right-8 top-1/2 -translate-y-1/2 text-white/20">🔍</div>
           </div>

           <div className="space-y-4">
             {filteredUsers.slice(0, 5).map(u => (
               <div key={u.id} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-8 group hover:bg-white/10 transition-all">
                  <div>
                    <h4 className="text-xl font-black uppercase tracking-tight">{u.name}</h4>
                    <p className="text-emerald-400 font-mono text-sm">{u.email}</p>
                    <p className="text-[10px] text-white/30 uppercase font-black mt-2 tracking-widest">Status: {u.role} Node</p>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleAllowNextOrder(u.email)}
                      className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95"
                    >ALLOW NEXT ORDER</button>
                    <button className="px-10 py-5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 transition-all">View Logs</button>
                  </div>
               </div>
             ))}
             {filteredUsers.length === 0 && <div className="p-20 text-center italic text-white/20">Search for a node identity to manage quotas.</div>}
           </div>
        </div>

        <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-2xl">
           <h3 className="text-xl font-black mb-10 uppercase tracking-tighter text-slate-950">Security Sync Log</h3>
           <div className="space-y-4">
              {orders.slice(0, 5).map(o => (
                <div key={o.id} className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex justify-between items-center">
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Authorization Ref: {o.id}</p>
                     <p className="text-sm font-bold text-slate-900">{o.customerEmail}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-[9px] font-black text-emerald-600 uppercase">Settlement Confirmed</p>
                     <p className="text-xs font-mono font-bold text-slate-400">{new Date(o.timestamp).toLocaleTimeString()}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default SupportDashboard;
