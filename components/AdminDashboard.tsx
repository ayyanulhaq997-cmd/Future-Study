
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/apiService';
import { Product, VoucherCode, Order, User, Lead, UserRole, LMSCourse } from '../types';

type AdminTab = 'ledger' | 'inventory' | 'partners' | 'staff' | 'security' | 'qa-tools' | 'settings';

const AdminDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('ledger');
  const [loading, setLoading] = useState(true);
  const [security, setSecurity] = useState(api.getSecurityState());
  const [settings, setSettings] = useState(api.getSystemSettings());
  const [data, setData] = useState<{
    products: Product[],
    codes: VoucherCode[],
    orders: Order[],
    users: User[],
    leads: Lead[]
  }>({ products: [], codes: [], orders: [], users: [], leads: [] });

  const [qaEmailSearch, setQaEmailSearch] = useState('');
  const [bulkCodes, setBulkCodes] = useState('');
  const [targetProductId, setTargetProductId] = useState('');
  const [newStaff, setNewStaff] = useState<Partial<User>>({ role: 'Finance' });

  const fetchData = async () => {
    const [p, c, o, u, le] = await Promise.all([
      api.getProducts(), api.getCodes(), api.getOrders(), api.getUsers(), api.getLeads()
    ]);
    setData({ products: p, codes: c, orders: o, users: u, leads: le });
    setSecurity(api.getSecurityState());
    setSettings(api.getSystemSettings());
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleWipeOrders = async () => {
    if (confirm("QA ACTION: This will permanently DELETE ALL PREVIOUS ORDERS and reset your daily procurement quotas. Proceed?")) {
      await api.clearAllOrders();
      alert("Order Ledger Purged. All limits have been reset.");
      fetchData();
    }
  };

  const handleBypassUser = async (email: string) => {
    await api.bypassUserQuota(email);
    alert(`Node Authority Updated: ${email} now has infinite procurement quota.`);
    fetchData();
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Remove custom product node: ${name}?`)) {
       await api.deleteProduct(id);
       fetchData();
    }
  };

  const handleInjectCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProductId || !bulkCodes.trim()) return alert("Select product and paste codes.");
    const codesArray = bulkCodes.split('\n').map(c => c.trim()).filter(c => c.length > 0);
    await api.addVoucherCodes(targetProductId, codesArray);
    alert(`Vault Synced: ${codesArray.length} codes injected.`);
    setBulkCodes('');
    fetchData();
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-[#004a61] font-black uppercase text-[11px] tracking-[0.4em]">Initializing Global Control Hub...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="flex flex-col xl:flex-row justify-between items-center gap-10 mb-16 border-b border-slate-100 pb-12">
        <div className="text-center xl:text-left">
           <h1 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">
             SYSTEM <span className="text-[#f15a24]">HUB</span>
           </h1>
           <p className="text-[10px] font-black text-[#004a61] uppercase tracking-[0.4em]">UniCou Institutional Control Node</p>
        </div>
        
        <div className="flex flex-wrap justify-center bg-slate-50 p-2 rounded-[2rem] border border-slate-200 shadow-inner">
           {(['ledger', 'inventory', 'partners', 'staff', 'security', 'qa-tools', 'settings'] as AdminTab[]).map((tab) => (
             <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-[#004a61] shadow-lg border border-slate-200' : 'text-slate-400 hover:text-slate-900'} ${tab === 'qa-tools' ? 'text-cyan-600' : ''}`}>
               {tab === 'qa-tools' ? 'QA & DEV HUB' : tab}
             </button>
           ))}
        </div>
      </div>

      {activeTab === 'qa-tools' && (
        <div className="animate-in slide-in-from-bottom-6 duration-700">
           <div className="bg-slate-950 p-16 rounded-[4rem] text-white shadow-3xl relative overflow-hidden border-2 border-cyan-500/20">
              <div className="absolute top-0 right-0 p-16 opacity-10 font-display font-black text-[12rem] text-cyan-400 pointer-events-none">QA</div>
              
              <div className="relative z-10">
                 <h2 className="text-4xl font-display font-black uppercase mb-4 tracking-tighter text-cyan-400">Testing & <span className="text-white">Fulfillment Terminal</span></h2>
                 <p className="text-slate-400 font-bold italic text-lg mb-12 max-w-2xl">"Tools to reset procurement limits and bypass security protocols for development testing."</p>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Quota Reset Box */}
                    <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-6">
                       <h3 className="text-xl font-black uppercase text-cyan-400 tracking-widest">Global Limit Reset</h3>
                       <p className="text-sm text-slate-400 leading-relaxed italic">"If you have hit the Agent or Center order limits, use this to wipe order history and start fresh."</p>
                       <button 
                         onClick={handleWipeOrders}
                         className="w-full py-6 bg-cyan-600 hover:bg-cyan-500 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-cyan-600/20 active:scale-95"
                       >
                         PURGE ALL LOGS (RESET QUOTAS)
                       </button>
                    </div>

                    {/* Infinite Quota Box */}
                    <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-6">
                       <h3 className="text-xl font-black uppercase text-cyan-400 tracking-widest">Authorize Infinite Quota</h3>
                       <div className="space-y-4">
                          <input 
                            className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-cyan-400"
                            placeholder="Search tester email..."
                            value={qaEmailSearch}
                            onChange={(e) => setQaEmailSearch(e.target.value)}
                          />
                          <div className="max-h-40 overflow-y-auto no-scrollbar space-y-2">
                             {data.users.filter(u => u.email.includes(qaEmailSearch)).slice(0, 3).map(u => (
                               <div key={u.id} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                                  <div>
                                     <p className="text-xs font-black uppercase">{u.name}</p>
                                     <p className="text-[10px] text-slate-500">{u.email}</p>
                                  </div>
                                  <button 
                                    onClick={() => handleBypassUser(u.email)}
                                    className="px-4 py-2 bg-white text-slate-900 rounded-lg text-[9px] font-black uppercase hover:bg-cyan-400 transition-colors"
                                  >
                                    Grant Bypass
                                  </button>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="mt-16 pt-12 border-t border-white/10 text-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Requirement 14.IV-QA • Deployment Node Environment</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in duration-500">
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 shadow-inner">
                 <h3 className="text-xl font-black text-[#004a61] uppercase mb-8 tracking-tighter">Vault stock injection</h3>
                 <form onSubmit={handleInjectCodes} className="space-y-6">
                    <select required className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-xs font-bold" value={targetProductId} onChange={e => setTargetProductId(e.target.value)}>
                      <option value="">Select Target Voucher...</option>
                      {data.products.filter(p => p.type === 'Voucher').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <textarea required rows={8} className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-[12px] font-mono shadow-inner" value={bulkCodes} onChange={e => setBulkCodes(e.target.value)} placeholder="PASTE CODES (ONE PER LINE)" />
                    <button type="submit" className="w-full py-5 bg-[#004a61] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black">SYNC VAULT STOCK</button>
                 </form>
              </div>
           </div>
           
           <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
              <table className="w-full text-left">
                 <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <tr><th className="px-10 py-6">Voucher SKU</th><th className="px-10 py-6 text-center">In Stock</th><th className="px-10 py-6 text-right">Actions</th></tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {data.products.map(p => {
                      const count = data.codes.filter(c => c.productId === p.id && c.status === 'Available').length;
                      const isCustom = !['v-1', 'v-6', 'v-19', 'v-20', 'v-21', 'v-24', 'v-26'].includes(p.id);
                      return (
                        <tr key={p.id}>
                          <td className="px-10 py-6 font-black text-xs text-[#004a61] uppercase">{p.name} {isCustom && <span className="ml-2 text-[8px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded">CUSTOM</span>}</td>
                          <td className="px-10 py-6 text-center font-mono font-black">{count}</td>
                          <td className="px-10 py-6 text-right">
                             {isCustom && <button onClick={() => handleDeleteProduct(p.id, p.name)} className="text-red-500 hover:text-red-700 text-[10px] font-black uppercase">Revoke Node</button>}
                          </td>
                        </tr>
                      );
                    })}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="animate-in fade-in duration-500">
           <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <h3 className="text-sm font-black uppercase tracking-widest text-[#004a61]">Global Audit Ledger</h3>
                 <div className="flex gap-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Records: {data.orders.length}</span>
                    <button onClick={handleWipeOrders} className="text-red-600 hover:text-black font-black text-[9px] uppercase tracking-widest">Purge Logs</button>
                 </div>
              </div>
              <table className="w-full text-left">
                 <thead className="bg-slate-900 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <tr>
                      <th className="px-10 py-6">Order ID</th>
                      <th className="px-10 py-6">Buyer Identity</th>
                      <th className="px-10 py-6">Product</th>
                      <th className="px-10 py-6 text-right">Value</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {data.orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-10 py-6 font-mono font-black text-xs text-[#004a61]">{o.id}</td>
                        <td className="px-10 py-6">
                           <div className="font-black text-xs text-slate-900 uppercase">{o.buyerName}</div>
                           <div className="text-[9px] font-bold text-slate-400 uppercase">{o.customerEmail}</div>
                        </td>
                        <td className="px-10 py-6 font-black text-xs text-slate-950 uppercase">{o.productName}</td>
                        <td className="px-10 py-6 text-right font-display font-black text-slate-950 text-xl">${o.totalAmount}</td>
                      </tr>
                    ))}
                    {data.orders.length === 0 && (
                      <tr><td colSpan={4} className="p-20 text-center text-slate-300 font-bold uppercase italic">Audit Ledger is currently empty. All quotas reset.</td></tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
