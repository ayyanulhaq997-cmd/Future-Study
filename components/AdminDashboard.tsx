
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
  const [qaOrderId, setQaOrderId] = useState('');
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

  const handleTargetDeleteOrder = async (id?: string) => {
    const targetId = id || qaOrderId.trim();
    if (!targetId) return alert("Enter a valid Order ID.");
    if (confirm(`QA ACTION: Permanently delete order ${targetId}?`)) {
      await api.deleteOrder(targetId);
      alert(`Record ${targetId} removed from global ledger.`);
      setQaOrderId('');
      fetchData();
    }
  };

  const handleFactoryReset = async () => {
    if (confirm("NUCLEAR RESET: This will wipe ALL Custom Products, Orders, Leads, and LMS Enrollments. Return to factory default?")) {
      await api.resetSystemData();
      alert("System Reset Complete. Portal re-initialized.");
      window.location.reload();
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

  const handleStaffAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.email || !newStaff.name) return;
    await api.upsertUser({ ...newStaff });
    alert("Staff Registry Updated.");
    setNewStaff({ role: 'Finance' });
    fetchData();
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (confirm(`REVOKE ACCESS: Permanently remove node for ${name}?`)) {
      await api.deleteUser(id);
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

  const saveSettings = () => {
    api.updateSystemSettings(settings);
    alert("System settings synchronized.");
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

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-6">
                       <h3 className="text-xl font-black uppercase text-cyan-400 tracking-widest">Global Reset</h3>
                       <button onClick={handleWipeOrders} className="w-full py-6 bg-cyan-600 hover:bg-cyan-500 text-white rounded-[1.5rem] font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-cyan-600/20 active:scale-95">PURGE ALL LOGS</button>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-6">
                       <h3 className="text-xl font-black uppercase text-cyan-400 tracking-widest">Remove Order</h3>
                       <div className="space-y-4">
                          <input className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-cyan-400" placeholder="Paste Order ID (e.g. UNICOU-...)" value={qaOrderId} onChange={(e) => setQaOrderId(e.target.value)} />
                          <button onClick={() => handleTargetDeleteOrder()} className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest">Purge Targeted Record</button>
                       </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] space-y-6">
                       <h3 className="text-xl font-black uppercase text-cyan-400 tracking-widest">Bypass Node</h3>
                       <div className="space-y-4">
                          <input className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-cyan-400" placeholder="Search tester email..." value={qaEmailSearch} onChange={(e) => setQaEmailSearch(e.target.value)} />
                          <div className="max-h-24 overflow-y-auto no-scrollbar space-y-2">
                             {data.users.filter(u => u.email.includes(qaEmailSearch)).slice(0, 3).map(u => (
                               <div key={u.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                  <span className="text-[10px] font-bold">{u.email}</span>
                                  <button onClick={() => handleBypassUser(u.email)} className="px-3 py-1.5 bg-white text-slate-900 rounded text-[8px] font-black uppercase">Grant</button>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
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
                    <button onClick={handleWipeOrders} className="text-red-600 hover:text-black font-black text-[9px] uppercase tracking-widest">Purge All Logs</button>
                 </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 text-[9px] font-black uppercase text-slate-400 tracking-[0.1em]">
                      <tr>
                        <th className="px-6 py-6">I. Number (ID)</th>
                        <th className="px-6 py-6">II. Date</th>
                        <th className="px-6 py-6">III. Time</th>
                        <th className="px-6 py-6">IV. Buyer Name</th>
                        <th className="px-6 py-6">V. Product Name</th>
                        <th className="px-6 py-6">VI. Amount</th>
                        <th className="px-6 py-6">VII. Payment Ref</th>
                        <th className="px-6 py-6">VIII. Proof</th>
                        <th className="px-6 py-6 text-right">Control</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {data.orders.map((o) => {
                        const dateObj = new Date(o.timestamp);
                        return (
                          <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-5 font-mono font-black text-[11px] text-[#004a61]">{o.id}</td>
                            <td className="px-6 py-5 font-mono text-[11px] text-slate-500 whitespace-nowrap">{dateObj.toLocaleDateString()}</td>
                            <td className="px-6 py-5 font-mono text-[11px] text-slate-500 whitespace-nowrap">{dateObj.toLocaleTimeString()}</td>
                            <td className="px-6 py-5 font-black text-[11px] text-slate-900 uppercase">{o.buyerName}</td>
                            <td className="px-6 py-5 font-black text-[11px] text-slate-700 uppercase">{o.productName}</td>
                            <td className="px-6 py-5 font-display font-black text-slate-950 text-base">${o.totalAmount}</td>
                            <td className="px-6 py-5 font-mono font-bold text-[10px] text-slate-400 uppercase truncate max-w-[120px]" title={o.bankRef}>{o.bankRef || 'N/A'}</td>
                            <td className="px-6 py-5">
                                {o.proofAttached ? (
                                  <button className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[8px] font-black uppercase hover:bg-emerald-600 hover:text-white transition-all">VIEW PROOF</button>
                                ) : (
                                  <span className="text-[8px] font-black text-slate-300 uppercase italic">NONE ATTACHED</span>
                                )}
                            </td>
                            <td className="px-6 py-5 text-right">
                              <button onClick={() => handleTargetDeleteOrder(o.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Order">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {data.orders.length === 0 && (
                        <tr><td colSpan={9} className="p-20 text-center text-slate-300 font-bold uppercase italic">Audit Ledger is currently empty. All quotas reset.</td></tr>
                      )}
                  </tbody>
                </table>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
