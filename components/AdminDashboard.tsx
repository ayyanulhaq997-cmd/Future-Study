
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/apiService';
import { Product, VoucherCode, Order, User, Lead, UserRole } from '../types';

type AdminTab = 'orders' | 'partners' | 'inventory' | 'staff' | 'security';

const AdminDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
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

  const handleToggleEmergencyStop = () => {
    const newState = !security.isGlobalOrderStop;
    if (confirm(`CRITICAL: ${newState ? 'DEACTIVATE' : 'ACTIVATE'} all procurement nodes globally?`)) {
      api.setGlobalStop(newState);
      fetchData();
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.basePrice) return;
    await api.addProduct({
      ...newProduct,
      id: `v-custom-${Date.now()}`,
      icon: '📦',
      description: 'Authorized Hub Provision'
    } as Product);
    alert("New Voucher Node Injected Successfully.");
    setNewProduct({ type: 'Voucher', currency: 'USD', pricingModel: 'Global' });
    fetchData();
  };

  const handleInjectCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProductId || !bulkCodes.trim()) {
      alert("Select target product and paste codes.");
      return;
    }
    const codesArray = bulkCodes.split('\n').map(c => c.trim()).filter(c => c.length > 0);
    await api.addVoucherCodes(targetProductId, codesArray);
    alert(`Successfully injected ${codesArray.length} nodes into the vault.`);
    setBulkCodes('');
    fetchData();
  };

  const handleStaffAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.email || !newStaff.name) return;
    await api.upsertUser({ ...newStaff });
    alert("Staff registry updated.");
    setNewStaff({ role: 'Finance' });
    fetchData();
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (confirm(`REVOKE ACCESS: Permanently remove identity node for ${name}?`)) {
      await api.deleteUser(id);
      fetchData();
    }
  };

  const staffUsers = data.users.filter(u => ['Finance', 'Trainer', 'Operation Manager', 'Support', 'System Admin/Owner'].includes(u.role));
  const activePartners = data.users.filter(u => u.role === 'Agent' || u.role === 'Institute');

  if (loading) return <div className="p-40 text-center animate-pulse text-[#004a61] font-black uppercase text-[11px] tracking-[0.4em]">Initializing Global Control Hub...</div>;

  return (
    <div className="max-w-[1500px] mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="flex flex-col xl:flex-row justify-between items-center gap-10 mb-16 border-b border-slate-100 pb-12">
        <div className="text-center xl:text-left">
           <h1 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">
             SYSTEM <span className="text-[#f15a24]">HUB</span>
           </h1>
           <div className="flex items-center justify-center xl:justify-start gap-4">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${security.isGlobalOrderStop ? 'bg-red-600 animate-pulse' : 'bg-emerald-500'}`} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Nodes: {security.isGlobalOrderStop ? 'LOCKED' : 'SYNCED'}
                </p>
              </div>
              <span className="text-slate-200">|</span>
              <p className="text-[10px] font-black text-[#004a61] uppercase tracking-widest">Admin Authorization Node</p>
           </div>
        </div>
        
        <div className="flex flex-wrap justify-center bg-slate-50 p-2 rounded-[2.5rem] border border-slate-200 shadow-inner">
           {(['orders', 'partners', 'inventory', 'staff', 'security'] as AdminTab[]).map((tab) => (
             <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-[#004a61] shadow-lg border border-slate-200' : 'text-slate-400 hover:text-slate-900'}`}>
               {tab}
             </button>
           ))}
        </div>
      </div>

      {activeTab === 'security' && (
        <div className="max-w-3xl mx-auto space-y-12 animate-in zoom-in-95 duration-500">
           <div className={`p-16 rounded-[4rem] border-2 text-center shadow-3xl transition-all ${security.isGlobalOrderStop ? 'bg-red-50 border-red-200' : 'bg-white border-slate-100'}`}>
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 text-4xl shadow-xl ${security.isGlobalOrderStop ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-400'}`}>🛑</div>
              <h2 className="text-4xl font-display font-black text-slate-950 uppercase mb-4 tracking-tighter leading-none">Emergency Node Shutdown</h2>
              <p className="text-slate-500 font-bold italic text-lg mb-12">"Instantly deactivates all checkout nodes for every student globally."</p>
              <button 
                onClick={handleToggleEmergencyStop}
                className={`w-full py-8 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 ${security.isGlobalOrderStop ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white hover:bg-black'}`}
              >
                {security.isGlobalOrderStop ? 'RESUME PORTAL SETTLEMENTS' : 'TRIGGER GLOBAL LOCK'}
              </button>
           </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in duration-500">
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 shadow-inner">
                 <h3 className="text-xl font-black text-[#004a61] uppercase mb-8 tracking-tighter">Voucher Stock Injection</h3>
                 <form onSubmit={handleInjectCodes} className="space-y-6">
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Product Node</label>
                       <select 
                         required 
                         className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-xs font-bold outline-none"
                         value={targetProductId}
                         onChange={e => setTargetProductId(e.target.value)}
                       >
                         <option value="">Select Existing Voucher...</option>
                         {data.products.filter(p => p.type === 'Voucher').map(p => (
                           <option key={p.id} value={p.id}>{p.name}</option>
                         ))}
                       </select>
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Paste Alphanumeric Codes (One per line)</label>
                       <textarea 
                         required 
                         rows={8}
                         className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-[12px] font-mono outline-none shadow-inner" 
                         value={bulkCodes}
                         onChange={e => setBulkCodes(e.target.value)}
                         placeholder="PTE-XXXXX&#10;PTE-YYYYY&#10;PTE-ZZZZZ"
                       />
                    </div>
                    <button type="submit" className="w-full py-5 bg-[#004a61] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black">SYNC VAULT STOCK</button>
                 </form>
              </div>

              <div className="bg-[#f15a24]/5 p-10 rounded-[3rem] border border-[#f15a24]/10">
                 <h3 className="text-xl font-black text-[#f15a24] uppercase mb-8 tracking-tighter">Provision New Type</h3>
                 <form onSubmit={handleAddProduct} className="space-y-6">
                    <input required className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-xs font-bold outline-none" value={newProduct.name || ''} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="Exam Name (e.g. GRE)" />
                    <input required className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-xs font-bold outline-none" value={newProduct.category || ''} onChange={e => setNewProduct({...newProduct, category: e.target.value})} placeholder="Category (e.g. GRE)" />
                    <input required type="number" className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-xs font-bold outline-none" value={newProduct.basePrice || ''} onChange={e => setNewProduct({...newProduct, basePrice: Number(e.target.value)})} placeholder="Net Base Price ($)" />
                    <button type="submit" className="w-full py-5 bg-[#f15a24] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black">INJECT NEW SKU</button>
                 </form>
              </div>
           </div>
           
           <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <h3 className="text-sm font-black uppercase text-slate-900 tracking-widest">Inventory Ledger</h3>
                 <span className="text-[10px] font-black text-[#004a61] bg-[#004a61]/5 px-3 py-1 rounded-full">Total Vault Items: {data.codes.length}</span>
              </div>
              <table className="w-full text-left">
                 <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <tr><th className="px-10 py-6">Voucher SKU</th><th className="px-10 py-6">Category</th><th className="px-10 py-6 text-center">Available Stock</th><th className="px-10 py-6 text-right">Settled Price</th></tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {data.products.filter(p => p.type === 'Voucher').map(p => {
                      const count = data.codes.filter(c => c.productId === p.id && c.status === 'Available').length;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50 group">
                          <td className="px-10 py-6 font-black text-xs text-[#004a61] uppercase">{p.name}</td>
                          <td className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.category}</td>
                          <td className="px-10 py-6 text-center">
                             <span className={`px-4 py-1.5 rounded-full font-mono font-black text-lg ${count < 5 ? 'bg-red-50 text-red-600' : 'bg-[#004a61]/5 text-[#004a61]'}`}>
                               {count}
                             </span>
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

      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in duration-500">
          <div className="lg:col-span-4">
             <div className="bg-[#004a61] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10 font-display font-black text-9xl">S</div>
                <h3 className="text-xl font-black uppercase mb-8 tracking-tighter relative z-10">Provision Staff Node</h3>
                <form onSubmit={handleStaffAction} className="space-y-6 relative z-10">
                   <input required className="w-full bg-white/10 border border-white/20 p-4 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:text-[#004a61]" value={newStaff.name || ''} onChange={e => setNewStaff({...newStaff, name: e.target.value})} placeholder="Legal Full Name" />
                   <input required type="email" className="w-full bg-white/10 border border-white/20 p-4 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:text-[#004a61]" value={newStaff.email || ''} onChange={e => setNewStaff({...newStaff, email: e.target.value})} placeholder="Official Email (user@unicou.uk)" />
                   <select 
                     required 
                     className="w-full bg-white/10 border border-white/20 p-4 rounded-2xl text-xs font-black outline-none text-white appearance-none"
                     value={newStaff.role}
                     onChange={e => setNewStaff({...newStaff, role: e.target.value as UserRole})}
                   >
                     <option value="Finance" className="text-black">Finance Team</option>
                     <option value="Trainer" className="text-black">Academic Evaluator</option>
                     <option value="Operation Manager" className="text-black">Ops Manager</option>
                     <option value="Support" className="text-black">Student Support</option>
                     <option value="System Admin/Owner" className="text-black">System Admin</option>
                   </select>
                   <button type="submit" className="w-full py-5 bg-[#f15a24] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black transition-all">AUTHORIZE STAFF NODE</button>
                </form>
             </div>
          </div>

          <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
             <table className="w-full text-left">
                <thead className="bg-slate-900 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                   <tr><th className="px-10 py-6">Staff Identity</th><th className="px-10 py-6">Role Node</th><th className="px-10 py-6">Status</th><th className="px-10 py-6 text-right">Control</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {staffUsers.map(u => (
                     <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-10 py-6">
                           <div className="font-black text-xs text-slate-900 uppercase">{u.name}</div>
                           <div className="text-[10px] font-mono text-slate-400">{u.email}</div>
                        </td>
                        <td className="px-10 py-6"><span className="px-3 py-1 bg-[#004a61] text-white rounded-full text-[8px] font-black uppercase tracking-widest">{u.role}</span></td>
                        <td className="px-10 py-6"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-2" /><span className="text-[9px] font-black text-slate-400 uppercase">{u.status}</span></td>
                        <td className="px-10 py-6 text-right">
                           <button onClick={() => handleDeleteUser(u.id, u.name)} className="text-red-600 hover:text-black font-black text-[9px] uppercase tracking-widest transition-colors">Revoke Authority</button>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      )}

      {activeTab === 'partners' && (
        <div className="space-y-12 animate-in fade-in duration-500">
           <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                 <h3 className="text-sm font-black uppercase tracking-widest text-[#004a61]">Authorized Partner Hub</h3>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{activePartners.length} Nodes Operational</span>
              </div>
              <table className="w-full text-left">
                 <thead>
                   <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                      <th className="px-10 py-5">Corporate Identity</th><th className="px-10 py-5">Email Node</th><th className="px-10 py-5">Type</th><th className="px-10 py-5">Status</th><th className="px-10 py-5 text-right">Revocation</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {activePartners.map(p => (
                      <tr key={p.id}>
                         <td className="px-10 py-6 font-black uppercase text-xs text-[#004a61]">{p.name}</td>
                         <td className="px-10 py-6 font-mono text-slate-400 text-xs">{p.email}</td>
                         <td className="px-10 py-6 font-bold text-slate-500 text-[9px] uppercase tracking-widest">{p.role}</td>
                         <td className="px-10 py-6"><span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[8px] font-black uppercase">SYNCED</span></td>
                         <td className="px-10 py-6 text-right">
                            <button onClick={() => handleDeleteUser(p.id, p.name)} className="px-5 py-2 bg-slate-100 text-red-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">De-Authorize Node</button>
                         </td>
                      </tr>
                    ))}
                    {activePartners.length === 0 && <tr><td colSpan={5} className="p-20 text-center italic text-slate-300 font-bold uppercase">No authorized partners found in registry.</td></tr>}
                 </tbody>
              </table>
           </div>

           <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                 <h3 className="text-sm font-black uppercase tracking-widest text-[#f15a24]">Pending Partner Leads</h3>
              </div>
              <table className="w-full text-left">
                 <thead>
                   <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                      <th className="px-10 py-5">Agency Profile</th><th className="px-10 py-5">Verified Email</th><th className="px-10 py-5">Lead Status</th><th className="px-10 py-5 text-right">Registry Approval</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {data.leads.filter(l => l.type === 'agent').map(l => (
                      <tr key={l.id}>
                         <td className="px-10 py-6 font-black uppercase text-xs text-slate-900">{l.data.org_name || l.data.agency_name}</td>
                         <td className="px-10 py-6 font-bold text-slate-500 text-xs italic">{l.data.email}</td>
                         <td className="px-10 py-6"><span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${l.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>{l.status}</span></td>
                         <td className="px-10 py-6 text-right">
                            {l.status !== 'Approved' && <button onClick={() => api.verifyAgent(l.id).then(fetchData)} className="px-5 py-2 bg-[#f15a24] text-white rounded-lg text-[8px] font-black uppercase tracking-widest shadow-action hover:bg-black transition-all">AUTHORIZE NODE</button>}
                         </td>
                      </tr>
                    ))}
                    {data.leads.filter(l => l.type === 'agent').length === 0 && <tr><td colSpan={4} className="p-20 text-center italic text-slate-300 font-bold uppercase">No pending lead applications.</td></tr>}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in duration-500">
           <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900 text-[10px] font-black uppercase text-slate-400 border-b tracking-widest">
                  <th className="px-10 py-6">Order ID</th><th className="px-10 py-6">Identity Node</th><th className="px-10 py-6">Product</th><th className="px-10 py-6 text-right">Fulfillment Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {data.orders.map(o => (
                   <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-10 py-6 font-mono font-black text-[#004a61] text-xs">{o.id}</td>
                      <td className="px-10 py-6">
                         <div className="font-black uppercase text-xs text-slate-900">{o.buyerName}</div>
                         <div className="text-[10px] text-slate-400 font-mono italic">{o.customerEmail}</div>
                      </td>
                      <td className="px-10 py-6 font-bold text-slate-600 text-xs uppercase">{o.productName} (x{o.quantity})</td>
                      <td className="px-10 py-6 text-right">
                         {o.status === 'Pending' ? (
                           <button onClick={() => api.fulfillOrder(o.id).then(fetchData)} className="px-6 py-2 bg-[#004a61] text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-[#f15a24] transition-all">VERIFY & DISPATCH</button>
                         ) : (
                           <span className="px-4 py-1.5 bg-slate-100 text-emerald-600 rounded-full text-[8px] font-black uppercase border border-slate-200">DISPATCHED NODE</span>
                         )}
                      </td>
                   </tr>
                 ))}
                 {data.orders.length === 0 && <tr><td colSpan={4} className="p-20 text-center italic text-slate-300 font-bold uppercase">No settlement nodes detected in feed.</td></tr>}
              </tbody>
           </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
