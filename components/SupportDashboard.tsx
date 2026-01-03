
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
    await api.bypassUserQuota(email);
    alert(`QA SYNC: Infinite Quota Authorized for ${email}.`);
    fetchData();
  };

  const handleDeleteOrder = async (id: string) => {
    if (confirm(`QA ACTION: Permanently remove order ${id} from ledger?`)) {
      await api.deleteOrder(id);
      alert(`Order ${id} removed and vouchers released.`);
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
          <button onClick={() => setActiveTab('bypass')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'bypass' ? 'bg-white text-unicou-navy shadow-xl' : 'text-slate-500'}`}>Quota Override</button>
          <button onClick={() => setActiveTab('leads')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'bg-white text-unicou-navy shadow-xl' : 'text-slate-500'}`}>Lead Registry</button>
          <button onClick={() => setActiveTab('orders')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-white text-unicou-navy shadow-xl' : 'text-slate-500'}`}>Order Feed</button>
        </div>
      </div>

      {activeTab === 'bypass' && (
        <div className="bg-slate-950 p-12 md:p-16 rounded-[4rem] text-white shadow-3xl relative overflow-hidden">
           <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px]" />
           <div className="relative z-10 mb-12">
              <h3 className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.4em] mb-6">Unblock Test Accounts</h3>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-2xl font-bold outline-none focus:border-emerald-500 focus:bg-white/10 transition-all placeholder:text-white/20" 
                placeholder="Search email to unblock..." 
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
                        <span className="text-[8px] bg-white/10 px-2 py-0.5 rounded font-black uppercase">{u.role} Node</span>
                     </div>
                     <p className="text-emerald-400 font-mono text-xs opacity-60 tracking-wider">{u.email}</p>
                   </div>
                   
                   <div className="flex items-center gap-4">
                      {u.canBypassQuota ? (
                        <span className="px-6 py-3 bg-emerald-500/10 border border-emerald-500 text-emerald-500 rounded-xl font-black text-[10px] uppercase tracking-widest">Infinite Quota Active</span>
                      ) : (
                        <button onClick={() => handleBypass(u.email)} className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all">UNBLOCK PROCUREMENT</button>
                      )}
                   </div>
                </div>
              ))}
              {search && filteredUsers.length === 0 && <div className="py-20 text-center opacity-40 italic font-bold">"No identity found."</div>}
           </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-[4rem] border border-slate-200 shadow-2xl overflow-hidden p-8">
           <h3 className="text-xl font-black mb-8 uppercase tracking-tighter text-unicou-navy">Live Transaction Sync</h3>
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-slate-50 text-[9px] font-black uppercase text-slate-500 tracking-widest border-y border-slate-100">
                   <th className="px-6 py-6">I. Number</th>
                   <th className="px-6 py-6">II. Date</th>
                   <th className="px-6 py-6">III. Time</th>
                   <th className="px-6 py-6">IV. Buyer Name</th>
                   <th className="px-6 py-6">V. Product Name</th>
                   <th className="px-6 py-6">VI. Amount</th>
                   <th className="px-6 py-6">VII. Ref Node</th>
                   <th className="px-6 py-6">VIII. Proof</th>
                   <th className="px-6 py-6 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {orders.map(o => {
                   const d = new Date(o.timestamp);
                   return (
                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-5 font-mono font-bold text-unicou-navy text-[11px]">{o.id}</td>
                      <td className="px-6 py-5 font-mono text-slate-400 text-[10px]">{d.toLocaleDateString()}</td>
                      <td className="px-6 py-5 font-mono text-slate-400 text-[10px]">{d.toLocaleTimeString()}</td>
                      <td className="px-6 py-5 font-black text-slate-900 uppercase text-[10px]">{o.buyerName}</td>
                      <td className="px-6 py-5 font-black text-slate-700 uppercase text-[10px]">{o.productName}</td>
                      <td className="px-6 py-5 font-display font-black text-slate-950 text-base">${o.totalAmount}</td>
                      <td className="px-6 py-5 font-mono text-slate-400 text-[9px] uppercase truncate max-w-[100px]">{o.bankRef || 'PENDING'}</td>
                      <td className="px-6 py-5">
                         {o.proofAttached ? (
                           <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[7px] font-black uppercase">VERIFIED</span>
                         ) : (
                           <span className="text-[7px] font-black text-slate-300 uppercase italic">MISSING</span>
                         )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button onClick={() => handleDeleteOrder(o.id)} className="text-red-600 hover:text-red-800 font-black text-[9px] uppercase tracking-widest">Remove</button>
                      </td>
                    </tr>
                   );
                 })}
                 {orders.length === 0 && <tr><td colSpan={9} className="p-20 text-center font-bold text-slate-300 italic uppercase">All transaction logs purged. Limits reset.</td></tr>}
               </tbody>
             </table>
           </div>
        </div>
      )}
    </div>
  );
};

export default SupportDashboard;
