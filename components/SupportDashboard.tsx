
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { User, Lead, Order } from '../types';

const SupportDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bypass' | 'leads' | 'orders'>('bypass');
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    const [u, le, o] = await Promise.all([
      api.getUsers(),
      api.getLeads(),
      api.getOrders()
    ]);
    setUsers(u);
    setLeads(le);
    setOrders(o);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleBypass = async (email: string) => {
    if (confirm(`Requirement 2f: Authorize manual quota override for student: ${email}? This allows them to bypass the 1-per-day restriction.`)) {
       await api.bypassUserQuota(email);
       alert(`Authorization Node Updated: Student can now purchase their next voucher immediately.`);
       fetchData();
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) || 
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase text-[11px] tracking-[0.4em]">Establishing Support Node...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-16">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-emerald-100">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Unified Support Terminal
           </div>
           <h1 className="text-5xl md:text-7xl font-display font-black text-slate-950 uppercase tracking-tighter leading-none">Global <span className="text-unicou-orange">Operations</span></h1>
        </div>
        
        <div className="flex bg-slate-50 p-2 rounded-[2rem] border border-slate-200 shadow-inner overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab('bypass')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'bypass' ? 'bg-white text-unicou-navy shadow-xl' : 'text-slate-500'}`}>Quota Bypass</button>
          <button onClick={() => setActiveTab('leads')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'bg-white text-unicou-navy shadow-xl' : 'text-slate-500'}`}>Lead Registry</button>
          <button onClick={() => setActiveTab('orders')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-white text-unicou-navy shadow-xl' : 'text-slate-500'}`}>Order Feed</button>
        </div>
      </div>

      {activeTab === 'bypass' && (
        <div className="bg-slate-950 p-12 md:p-16 rounded-[4rem] text-white shadow-3xl relative overflow-hidden">
           <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />
           <div className="relative z-10 mb-12">
              <h3 className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.4em] mb-6">Identity Registry Search</h3>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-2xl font-bold outline-none focus:border-emerald-500 focus:bg-white/10 transition-all placeholder:text-white/20" 
                placeholder="Search Student Email or Identity..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
              />
           </div>
           
           <div className="space-y-4 relative z-10">
              {filteredUsers.slice(0, 8).map(u => (
                <div key={u.id} className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center group hover:bg-white/10 transition-all">
                   <div className="mb-6 sm:mb-0">
                     <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-black uppercase tracking-tight">{u.name}</h4>
                        {u.verified && <span className="text-[8px] bg-emerald-500 text-white px-2 py-0.5 rounded font-black uppercase">Verified Node</span>}
                     </div>
                     <p className="text-emerald-400 font-mono text-xs opacity-60 tracking-wider">{u.email}</p>
                     <div className="mt-4 flex gap-4">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Role: {u.role}</span>
                        {u.canBypassQuota && <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 animate-pulse">✓ Quota Override Active</span>}
                     </div>
                   </div>
                   
                   {u.role === 'Student' && !u.canBypassQuota && (
                     <button onClick={() => handleBypass(u.email)} className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-emerald-600/20 transition-all active:scale-95">AUTHORIZE NEXT ORDER</button>
                   )}
                </div>
              ))}
              {search && filteredUsers.length === 0 && <div className="py-20 text-center opacity-40 italic font-bold">"No active identity matches your query."</div>}
           </div>
        </div>
      )}

      {activeTab === 'leads' && (
        <div className="bg-white rounded-[4rem] border border-slate-200 shadow-2xl overflow-hidden p-10">
           <h3 className="text-xl font-black mb-8 uppercase tracking-tighter text-unicou-navy">Global Lead Registry</h3>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-widest border-y border-slate-100">
                   <th className="px-8 py-6">Timestamp</th><th className="px-8 py-6">Type</th><th className="px-8 py-6">Identity</th><th className="px-8 py-6">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {leads.map(l => (
                   <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                     <td className="px-8 py-6 text-[11px] font-mono text-slate-400">{new Date(l.timestamp).toLocaleString()}</td>
                     <td className="px-8 py-6"><span className="px-3 py-1 bg-slate-100 rounded text-[9px] font-black uppercase">{l.type}</span></td>
                     <td className="px-8 py-6"><div className="font-black text-slate-900 uppercase text-xs">{l.data.name || 'Agent Application'}</div><div className="text-[10px] text-slate-500 font-mono italic">{l.data.email}</div></td>
                     <td className="px-8 py-6"><span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${l.status === 'New' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>{l.status}</span></td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-[4rem] border border-slate-200 shadow-2xl overflow-hidden p-10">
           <h3 className="text-xl font-black mb-8 uppercase tracking-tighter text-unicou-navy">Settlement Feed</h3>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-widest border-y border-slate-100">
                   <th className="px-8 py-6">Order ID</th><th className="px-8 py-6">Product Node</th><th className="px-8 py-6">Net Value</th><th className="px-8 py-6">Audit Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {orders.map(o => (
                   <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                     <td className="px-8 py-6 font-mono font-bold text-unicou-navy text-xs">{o.id}</td>
                     <td className="px-8 py-6 font-black text-slate-900 uppercase text-xs">{o.productName} (x{o.quantity})</td>
                     <td className="px-8 py-6 font-display font-black text-slate-950">${o.totalAmount}</td>
                     <td className="px-8 py-6"><span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${o.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>{o.status}</span></td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      )}
    </div>
  );
};

export default SupportDashboard;
