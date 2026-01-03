
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/apiService';
import { Product, VoucherCode, Order, User, Lead, UserRole } from '../types';

type AdminTab = 'ledger' | 'inventory' | 'partners' | 'staff' | 'security';

const AdminDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('ledger');
  const [loading, setLoading] = useState(true);
  const [security, setSecurity] = useState(api.getSecurityState());
  const [data, setData] = useState<{
    products: Product[],
    codes: VoucherCode[],
    orders: Order[],
    users: User[],
    leads: Lead[]
  }>({ products: [], codes: [], orders: [], users: [], leads: [] });

  const [newProduct, setNewProduct] = useState<Partial<Product>>({ type: 'Voucher', currency: 'USD', pricingModel: 'Global' });
  const [bulkCodes, setBulkCodes] = useState('');
  const [targetProductId, setTargetProductId] = useState('');
  const [newStaff, setNewStaff] = useState<Partial<User>>({ role: 'Finance' });

  const fetchData = async () => {
    const [p, c, o, u, le] = await Promise.all([
      api.getProducts(), api.getCodes(), api.getOrders(), api.getUsers(), api.getLeads()
    ]);
    setData({ products: p, codes: c, orders: o, users: u, leads: le });
    setSecurity(api.getSecurityState());
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // FINANCIAL AUDIT ENGINE (Requirement: Check record of sold vouchers, buyer, funds)
  const auditLedger = useMemo(() => {
    return data.codes.filter(c => c.status === 'Used').map(code => {
      const order = data.orders.find(o => o.id === code.orderId);
      const product = data.products.find(p => p.id === code.productId);
      return {
        id: code.id,
        orderNo: code.orderId || 'OFFLINE',
        type: product?.name || 'Voucher',
        code: code.code,
        buyer: code.buyerName || 'Unknown',
        saleDate: code.assignmentDate || code.uploadDate,
        amount: product?.basePrice || 0,
        currency: order?.currency || 'USD',
        paymentRef: order?.bankRef || 'GATEWAY_AUTH'
      };
    }).sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime());
  }, [data]);

  const handleInjectCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProductId || !bulkCodes.trim()) return alert("Select product and paste codes.");
    const codesArray = bulkCodes.split('\n').map(c => c.trim()).filter(c => c.length > 0);
    await api.addVoucherCodes(targetProductId, codesArray);
    alert(`Vault Synced: ${codesArray.length} codes injected.`);
    setBulkCodes('');
    fetchData();
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
        
        <div className="flex flex-wrap justify-center bg-slate-50 p-2 rounded-[2.5rem] border border-slate-200 shadow-inner">
           {(['ledger', 'inventory', 'partners', 'staff', 'security'] as AdminTab[]).map((tab) => (
             <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-[#004a61] shadow-lg border border-slate-200' : 'text-slate-400 hover:text-slate-900'}`}>
               {tab === 'ledger' ? 'Voucher Ledger' : tab}
             </button>
           ))}
        </div>
      </div>

      {/* LEDGER TAB: Check record of sold vouchers, buyer, funds etc. */}
      {activeTab === 'ledger' && (
        <div className="animate-in fade-in duration-500">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-[#004a61] p-10 rounded-[3rem] text-white shadow-2xl">
                 <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Gross Funds Processed</p>
                 <p className="text-5xl font-display font-black">${auditLedger.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</p>
              </div>
              <div className="bg-[#f15a24] p-10 rounded-[3rem] text-white shadow-2xl">
                 <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Total Vouchers Sold</p>
                 <p className="text-5xl font-display font-black">{auditLedger.length}</p>
              </div>
              <div className="bg-slate-100 p-10 rounded-[3rem] text-slate-900 border border-slate-200">
                 <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Active Vault Stock</p>
                 <p className="text-5xl font-display font-black">{data.codes.filter(c => c.status === 'Available').length}</p>
              </div>
           </div>

           <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
              <table className="w-full text-left">
                 <thead className="bg-slate-900 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <tr>
                      <th className="px-10 py-6">Order ID</th>
                      <th className="px-10 py-6">Voucher Node</th>
                      <th className="px-10 py-6">Code Identity</th>
                      <th className="px-10 py-6">Buyer Identity</th>
                      <th className="px-10 py-6">Settlement Ref</th>
                      <th className="px-10 py-6 text-right">Value</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {auditLedger.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-10 py-6 font-mono font-black text-xs text-[#004a61]">{row.orderNo}</td>
                        <td className="px-10 py-6 font-black text-xs text-slate-900 uppercase">{row.type}</td>
                        <td className="px-10 py-6 font-mono font-black text-xs text-[#f15a24]">{row.code}</td>
                        <td className="px-10 py-6">
                           <div className="font-black text-xs text-slate-900 uppercase">{row.buyer}</div>
                           <div className="text-[9px] font-bold text-slate-400 uppercase">{new Date(row.saleDate).toLocaleDateString()}</div>
                        </td>
                        <td className="px-10 py-6 font-mono text-[10px] text-slate-400 uppercase">{row.paymentRef}</td>
                        <td className="px-10 py-6 text-right font-display font-black text-slate-950 text-xl">${row.amount}</td>
                      </tr>
                    ))}
                    {auditLedger.length === 0 && (
                      <tr><td colSpan={6} className="p-20 text-center italic text-slate-300 font-bold uppercase">No successful settlements detected in ledger.</td></tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {/* INVENTORY TAB: Inject codes and add stock */}
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
                    <textarea required rows={8} className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-[12px] font-mono shadow-inner" value={bulkCodes} onChange={e => setBulkCodes(e.target.value)} placeholder="PASTE CODES (ONE PER LINE)&#10;ABC-123&#10;XYZ-456" />
                    <button type="submit" className="w-full py-5 bg-[#004a61] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black">SYNC VAULT STOCK</button>
                 </form>
              </div>
           </div>
           
           <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                 <h3 className="text-sm font-black uppercase text-slate-900 tracking-widest">Inventory Status</h3>
              </div>
              <table className="w-full text-left">
                 <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <tr><th className="px-10 py-6">Voucher SKU</th><th className="px-10 py-6 text-center">Available Stock</th><th className="px-10 py-6 text-right">Net Price</th></tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {data.products.filter(p => p.type === 'Voucher').map(p => {
                      const count = data.codes.filter(c => c.productId === p.id && c.status === 'Available').length;
                      return (
                        <tr key={p.id}>
                          <td className="px-10 py-6 font-black text-xs text-[#004a61] uppercase">{p.name}</td>
                          <td className="px-10 py-6 text-center">
                             <span className={`px-4 py-1.5 rounded-full font-mono font-black text-lg ${count < 5 ? 'bg-red-50 text-red-600' : 'bg-[#004a61]/5 text-[#004a61]'}`}>{count}</span>
                          </td>
                          <td className="px-10 py-6 text-right font-display font-black text-slate-950 text-xl">${p.basePrice}</td>
                        </tr>
                      );
                    })}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {/* STAFF TAB: Add/Edit/Remove Managers, Finance etc. */}
      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in duration-500">
          <div className="lg:col-span-4">
             <div className="bg-[#004a61] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <h3 className="text-xl font-black uppercase mb-8 tracking-tighter">Provision staff node</h3>
                <form onSubmit={handleStaffAction} className="space-y-6">
                   <input required className="w-full bg-white/10 border border-white/20 p-4 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:text-[#004a61]" value={newStaff.name || ''} onChange={e => setNewStaff({...newStaff, name: e.target.value})} placeholder="Legal Full Name" />
                   <input required type="email" className="w-full bg-white/10 border border-white/20 p-4 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:text-[#004a61]" value={newStaff.email || ''} onChange={e => setNewStaff({...newStaff, email: e.target.value})} placeholder="Official Email (user@unicou.uk)" />
                   <select required className="w-full bg-white/10 border border-white/20 p-4 rounded-2xl text-xs font-black outline-none text-white appearance-none" value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value as UserRole})}>
                     <option value="Finance" className="text-black">Finance Team</option>
                     <option value="Operation Manager" className="text-black">Ops Manager</option>
                     <option value="Support" className="text-black">Student Support</option>
                     <option value="Trainer" className="text-black">Academic Trainer</option>
                   </select>
                   <button type="submit" className="w-full py-5 bg-[#f15a24] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black">AUTHORIZE STAFF NODE</button>
                </form>
             </div>
          </div>

          <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
             <table className="w-full text-left">
                <thead className="bg-slate-900 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                   <tr><th className="px-10 py-6">Staff Identity</th><th className="px-10 py-6">Role Node</th><th className="px-10 py-6 text-right">Control</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {data.users.filter(u => ['Finance', 'Operation Manager', 'Support', 'Trainer'].includes(u.role)).map(u => (
                     <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-10 py-6">
                           <div className="font-black text-xs text-slate-900 uppercase">{u.name}</div>
                           <div className="text-[10px] font-mono text-slate-400">{u.email}</div>
                        </td>
                        <td className="px-10 py-6"><span className="px-3 py-1 bg-[#004a61] text-white rounded-full text-[8px] font-black uppercase tracking-widest">{u.role}</span></td>
                        <td className="px-10 py-6 text-right">
                           <button onClick={() => handleDeleteUser(u.id, u.name)} className="text-red-600 hover:text-black font-black text-[9px] uppercase tracking-widest">Revoke Authority</button>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      )}

      {/* PARTNERS TAB: Agents synchronization */}
      {activeTab === 'partners' && (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
           <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#004a61]">Authorized Partner Hub</h3>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{data.users.filter(u => u.role === 'Agent' || u.role === 'Institute').length} Nodes Operational</span>
           </div>
           <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                   <th className="px-10 py-5">Corporate Identity</th><th className="px-10 py-5">Email Node</th><th className="px-10 py-5">Status</th><th className="px-10 py-5 text-right">Revocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {data.users.filter(u => u.role === 'Agent' || u.role === 'Institute').map(p => (
                   <tr key={p.id}>
                      <td className="px-10 py-6 font-black uppercase text-xs text-[#004a61]">{p.name}</td>
                      <td className="px-10 py-6 font-mono text-slate-400 text-xs">{p.email}</td>
                      <td className="px-10 py-6"><span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${p.isAuthorized ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>{p.isAuthorized ? 'AUTHORIZED' : 'PENDING'}</span></td>
                      <td className="px-10 py-6 text-right">
                         <button onClick={() => handleDeleteUser(p.id, p.name)} className="px-5 py-2 bg-slate-100 text-red-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">De-Authorize Node</button>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="max-w-3xl mx-auto py-20 text-center animate-in zoom-in-95 duration-500">
           <div className={`p-16 rounded-[4rem] border-2 shadow-3xl transition-all ${security.isGlobalOrderStop ? 'bg-red-50 border-red-200' : 'bg-white border-slate-100'}`}>
              <h2 className="text-4xl font-display font-black text-slate-950 uppercase mb-4 tracking-tighter">Emergency Shutdown</h2>
              <p className="text-slate-500 font-bold italic mb-12 italic">"Deactivates all checkout nodes globally across all vertical registries."</p>
              {/* FIXED: Property 'then' does not exist on type 'void' error by making the onClick handler call api.setGlobalStop and fetchData sequentially, since api.setGlobalStop returns void. */}
              <button onClick={() => { api.setGlobalStop(!security.isGlobalOrderStop); fetchData(); }} className={`w-full py-8 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl transition-all ${security.isGlobalOrderStop ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white hover:bg-black'}`}>
                {security.isGlobalOrderStop ? 'RESUME PORTAL SETTLEMENTS' : 'TRIGGER GLOBAL LOCK'}
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
