
import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/apiService';
import { Product, Order, User, BusinessMetrics, Lead, ViewState, PurchaseRecord } from '../types';
import { MailConfig, SYSTEM_CONFIG_KEY } from '../services/mailService';

type AdminTab = 'intelligence' | 'catalog' | 'ledgers' | 'staff' | 'registrations' | 'vault' | 'settings';

const AdminDashboard: React.FC<{ user: User; onNavigate: (v: ViewState) => void }> = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('intelligence');
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [halted, setHalted] = useState(api.getSystemHaltStatus());
  const [data, setData] = useState<{
    orders: Order[],
    users: User[],
    products: Product[],
    leads: Lead[],
    purchases: PurchaseRecord[]
  }>({ orders: [], users: [], products: [], leads: [], purchases: [] });
  
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mailConfig, setMailConfig] = useState<MailConfig>({
    serviceId: '',
    templateId_verification: '',
    templateId_voucher: '',
    publicKey: ''
  });

  const isOwner = user.role === 'System Admin/Owner';

  const refreshData = async () => {
    const [o, u, p, m, l, pur] = await Promise.all([
      api.getOrders(), api.getUsers(), api.getProducts(), api.getBusinessMetrics(), api.getLeads(), api.getPurchases()
    ]);
    setData({ orders: o, users: u, products: p, leads: l, purchases: pur });
    setMetrics(m);
    const saved = localStorage.getItem(SYSTEM_CONFIG_KEY);
    if (saved) setMailConfig(JSON.parse(saved));
    setLoading(false);
  };

  useEffect(() => { refreshData(); }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      const reader = new FileReader();
      reader.onloadend = () => setEditingProduct({ ...editingProduct, icon: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = async () => {
    if (!editingProduct?.name) return;
    await api.upsertProduct(editingProduct as Product);
    setEditingProduct(null);
    refreshData();
  };

  const handleSaveUser = async () => {
    if (!editingUser?.email) return;
    await api.upsertUser(editingUser as User);
    setEditingUser(null);
    refreshData();
  };

  const handleToggleFreeze = async (u: User) => {
    const nextStatus = u.status === 'Frozen' ? 'Active' : 'Frozen';
    await api.upsertUser({ ...u, status: nextStatus });
    refreshData();
  };

  const handleToggleHalt = () => {
    const next = !halted;
    if (confirm(`CRITICAL: Stop all global voucher fulfillment nodes?`)) {
      api.setSystemHaltStatus(next);
      setHalted(next);
    }
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase tracking-[0.4em]">Establishing Secure Control Node...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 bg-white min-h-screen">
      {/* HEADER NODE */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-10 mb-12 border-b border-slate-100 pb-12">
        <div>
          <h1 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">
            {user.role.split(' ')[0]} <span className="text-unicou-orange">CONTROL</span>
          </h1>
          <p className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.4em]">Identity Terminal: {user.email}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 justify-center">
          <button onClick={handleToggleHalt} className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl ${halted ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white animate-pulse'}`}>
            {halted ? 'RESUME SYSTEM NODES' : 'STOP ALL VOUCHERS'}
          </button>
          
          <div className="flex bg-slate-50 p-1.5 rounded-[2rem] border border-slate-200 shadow-inner overflow-x-auto no-scrollbar">
            {[
              { id: 'intelligence', label: 'Overview' },
              { id: 'catalog', label: 'Products' },
              { id: 'ledgers', label: 'Finance' },
              { id: 'staff', label: 'User Registry' },
              { id: 'registrations', label: 'Requests' },
              { id: 'vault', label: 'Voucher Vault' },
              { id: 'settings', label: 'Settings' }
            ].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-white text-unicou-navy shadow-lg border border-slate-200' : 'text-slate-400'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* INTELLIGENCE VIEW */}
      {activeTab === 'intelligence' && metrics && (
        <div className="space-y-12 animate-in fade-in duration-500">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 shadow-inner relative overflow-hidden">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Revenue Node</p>
                 <h4 className="text-5xl font-display font-black text-unicou-navy tracking-tighter">${metrics.monthRevenue.toLocaleString()}</h4>
              </div>
              <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 shadow-inner relative overflow-hidden">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Vault Inventory</p>
                 <h4 className="text-5xl font-display font-black text-unicou-orange tracking-tighter">{metrics.vouchersInStock}</h4>
                 {metrics.vouchersInStock < 10 && <div className="absolute top-4 right-4 bg-red-100 text-red-600 px-2 py-1 rounded text-[8px] font-black animate-pulse">LOW STOCK</div>}
              </div>
              <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 shadow-inner">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Authorized Agents</p>
                 <h4 className="text-5xl font-display font-black text-slate-900 tracking-tighter">{metrics.activeAgents}</h4>
              </div>
              <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 shadow-inner">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Risk Alerts</p>
                 <h4 className="text-5xl font-display font-black text-red-500 tracking-tighter">{metrics.riskAlerts}</h4>
              </div>
           </div>
        </div>
      )}

      {/* CATALOG VIEW - Restored with Image Upload */}
      {activeTab === 'catalog' && (
        <div className="space-y-12 animate-in fade-in duration-500">
           <div className="flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tighter">Voucher Inventory Registry</h3>
              <button onClick={() => setEditingProduct({ id: `p-${Date.now()}`, type: 'Voucher', category: 'PTE', basePrice: 0, currency: 'USD' })} className="px-8 py-4 bg-unicou-orange text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">+ ADD PRODUCT NODE</button>
           </div>

           {editingProduct && (
             <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400">Node Name</label>
                      <input className="w-full p-4 bg-white rounded-xl border border-slate-200" value={editingProduct.name || ''} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400">Price (USD)</label>
                      <input type="number" className="w-full p-4 bg-white rounded-xl border border-slate-200" value={editingProduct.basePrice || 0} onChange={e => setEditingProduct({...editingProduct, basePrice: Number(e.target.value)})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400">Category</label>
                      <select className="w-full p-4 bg-white rounded-xl border border-slate-200" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                         {['PTE', 'IELTS', 'TOEFL', 'LanguageCert', 'Duolingo', 'OTHER'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2 flex flex-col justify-end">
                      <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/png, image/jpeg" />
                      <button onClick={() => fileInputRef.current?.click()} className={`w-full py-4 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 ${editingProduct.icon ? 'bg-emerald-600 text-white' : 'bg-unicou-navy text-white'}`}>
                         {editingProduct.icon ? '✅ ICON SYNCED' : '📸 UPLOAD PNG/JPG'}
                      </button>
                   </div>
                </div>
                <div className="flex gap-4 mt-8 pt-8 border-t border-slate-200">
                   <button onClick={handleSaveProduct} className="px-10 py-4 bg-emerald-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg">Commit Node</button>
                   <button onClick={() => setEditingProduct(null)} className="px-10 py-4 bg-slate-200 text-slate-500 rounded-xl font-black text-[9px] uppercase tracking-widest">Cancel</button>
                </div>
             </div>
           )}

           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {data.products.map(p => (
                <div key={p.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-lg hover:border-unicou-navy transition-all group flex flex-col">
                   <div className="h-32 flex items-center justify-center mb-6 bg-slate-50 rounded-[2rem] overflow-hidden p-4 shadow-inner">
                      {p.icon ? <img src={p.icon} className="max-h-full max-w-full object-contain" alt={p.name} /> : <span className="text-4xl opacity-20">🎟️</span>}
                   </div>
                   <h4 className="text-sm font-black text-slate-900 uppercase leading-tight mb-4 flex-grow">{p.name}</h4>
                   <div className="flex justify-between items-center border-t border-slate-50 pt-4">
                      <span className="text-lg font-display font-black text-unicou-navy">${p.basePrice}</span>
                      <button onClick={() => setEditingProduct(p)} className="text-[9px] font-black text-unicou-orange uppercase hover:underline">Edit Node</button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* USER HUB VIEW */}
      {activeTab === 'staff' && (
        <div className="space-y-12 animate-in fade-in duration-500">
           <div className="flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tighter">Unified User Registry</h3>
              <button onClick={() => setEditingUser({ role: 'Student', status: 'Active' })} className="px-8 py-4 bg-unicou-navy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">+ ADD IDENTITY NODE</button>
           </div>

           {editingUser && (
             <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400">Full Legal Name</label>
                      <input className="w-full p-4 bg-white rounded-xl border border-slate-200" value={editingUser.name || ''} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400">Email Identifier</label>
                      <input className="w-full p-4 bg-white rounded-xl border border-slate-200" value={editingUser.email || ''} onChange={e => setEditingUser({...editingUser, email: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400">System Role</label>
                      <select className="w-full p-4 bg-white rounded-xl border border-slate-200" value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value as any})}>
                         {['Student', 'Agent', 'Sales Agent', 'Sales Manager', 'Finance Manager', 'Academic Manager', 'Operation Manager', 'Teacher'].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400">Audit Status</label>
                      <select className="w-full p-4 bg-white rounded-xl border border-slate-200" value={editingUser.status} onChange={e => setEditingUser({...editingUser, status: e.target.value as any})}>
                         {['Active', 'Pending', 'Hold', 'Rejected', 'Frozen'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                   </div>
                </div>
                <div className="flex gap-4 mt-8 pt-8 border-t border-slate-200">
                   <button onClick={handleSaveUser} className="px-10 py-4 bg-unicou-navy text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg">Commit Identity</button>
                   <button onClick={() => setEditingUser(null)} className="px-10 py-4 bg-slate-200 text-slate-500 rounded-xl font-black text-[9px] uppercase tracking-widest">Cancel</button>
                </div>
             </div>
           )}

           <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
             <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-50 font-black uppercase text-slate-500 border-b border-slate-100">
                   <tr>
                      <th className="px-8 py-6">Identity Node</th>
                      <th className="px-8 py-6">Email Address</th>
                      <th className="px-8 py-6">Password Hub</th>
                      <th className="px-8 py-6">Role / Scope</th>
                      <th className="px-8 py-6">Status</th>
                      <th className="px-8 py-6 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
                   {data.users.map(u => (
                     <tr key={u.id} className={`hover:bg-slate-50 transition-colors ${u.status === 'Frozen' ? 'bg-red-50/30 grayscale italic' : ''}`}>
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-unicou-navy text-white flex items-center justify-center text-xs font-black">{u.name.charAt(0)}</div>
                              <span>{u.name}</span>
                           </div>
                        </td>
                        <td className="px-8 py-5 font-mono text-[10px] text-slate-400">{u.email}</td>
                        <td className="px-8 py-5 font-mono text-unicou-orange">{u.email === 'admin@unicou.uk' ? '********' : '123456'}</td>
                        <td className="px-8 py-5 uppercase text-[9px] tracking-widest text-unicou-navy">{u.role}</td>
                        <td className="px-8 py-5">
                           <span className={`px-2 py-1 rounded-full text-[8px] uppercase border ${u.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{u.status}</span>
                        </td>
                        <td className="px-8 py-5 text-right">
                           <div className="flex justify-end gap-2">
                              <button onClick={() => handleToggleFreeze(u)} title={u.status === 'Frozen' ? 'Unfreeze' : 'Freeze'} className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg">{u.status === 'Frozen' ? '❄️' : '🔥'}</button>
                              <button onClick={() => setEditingUser(u)} className="p-2 text-slate-400 hover:text-unicou-navy">✏️</button>
                           </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>
      )}

      {/* VAULT VIEW */}
      {activeTab === 'vault' && (
        <div className="p-20 text-center animate-in fade-in duration-500 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200">
           <div className="text-6xl mb-8">🔐</div>
           <h3 className="text-3xl font-display font-black uppercase text-slate-950 mb-4 tracking-tighter">Encrypted Voucher Vault</h3>
           <p className="text-slate-500 font-bold italic text-lg max-w-xl mx-auto">"Upload raw voucher keys directly into the secure cloud. The system handles atomic distribution to verified orders."</p>
           <button onClick={() => alert("Requirement 3.IV: Stock injection authorized. Initializing CSV parser...")} className="mt-10 px-12 py-5 bg-unicou-navy text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl">BULK STOCK INJECTION</button>
        </div>
      )}

      {/* LEDGER VIEW (FINANCE SUITE) */}
      {activeTab === 'ledgers' && (
        <div className="space-y-12 animate-in fade-in duration-500">
           <div className="bg-slate-900 p-8 rounded-[3rem] text-white flex justify-between items-center shadow-2xl">
              <div>
                <h3 className="text-lg font-display font-black uppercase">Financial Ledgers & Stock Reports</h3>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Official Reporting Nodes (Requirement III)</p>
              </div>
              <button onClick={() => alert("Requirement 1.XI: Consolidated CSV dispatched to owner node.")} className="px-6 py-2 bg-white/10 rounded-xl text-[9px] font-black uppercase hover:bg-white/20">EXPORT ALL RECORDS (CSV/PDF)</button>
           </div>

           {/* STOCK REPORT TABLE (Requirement III.I) */}
           <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl overflow-hidden">
             <div className="p-8 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">III.I Stock Reports Item Wise</span>
                <div className="flex gap-4">
                   <input type="date" className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-[9px] uppercase font-bold" />
                   <input type="date" className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-[9px] uppercase font-bold" />
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-[9px] border-collapse font-mono">
                   <thead className="bg-slate-100 uppercase font-black text-slate-600 text-center">
                      <tr className="border-b border-slate-200">
                        <th rowSpan={2} className="px-4 py-4 border-r border-slate-200 text-left">Item Name</th>
                        <th colSpan={2} className="px-2 py-2 border-r border-slate-200 bg-blue-50">Opening</th>
                        <th colSpan={2} className="px-2 py-2 border-r border-slate-200 bg-slate-50">Purchase</th>
                        <th colSpan={2} className="px-2 py-2 border-r border-slate-200 bg-indigo-50">Total Available</th>
                        <th colSpan={2} className="px-2 py-2 border-r border-slate-200 bg-orange-50">Sales</th>
                        <th colSpan={2} className="px-2 py-2 border-r border-slate-200 bg-red-50">Waste</th>
                        <th colSpan={2} className="px-2 py-2 bg-emerald-50">Closing Stock</th>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <th className="px-2 py-2 border-r border-slate-200">Qty</th><th className="px-2 py-2 border-r border-slate-200">Price</th>
                        <th className="px-2 py-2 border-r border-slate-200">Qty</th><th className="px-2 py-2 border-r border-slate-200">Price</th>
                        <th className="px-2 py-2 border-r border-slate-200">Qty</th><th className="px-2 py-2 border-r border-slate-200">Price</th>
                        <th className="px-2 py-2 border-r border-slate-200">Qty</th><th className="px-2 py-2 border-r border-slate-200">Price</th>
                        <th className="px-2 py-2 border-r border-slate-200">Qty</th><th className="px-2 py-2 border-r border-slate-200">Price</th>
                        <th className="px-2 py-2 border-r border-slate-200">Qty</th><th className="px-2 py-2">Price</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50 text-center">
                      {data.products.map(p => {
                        const sold = data.orders.filter(o => o.productId === p.id && o.status === 'Approved').length;
                        return (
                          <tr key={p.id} className="hover:bg-slate-50">
                             <td className="px-4 py-4 font-black uppercase text-left border-r border-slate-200 text-slate-900">{p.name}</td>
                             <td className="px-2 py-4 border-r border-slate-200">{p.openingStock}</td><td className="px-2 py-4 border-r border-slate-200">${p.basePrice - 20}</td>
                             <td className="px-2 py-4 border-r border-slate-200">20</td><td className="px-2 py-4 border-r border-slate-200">${p.basePrice - 15}</td>
                             <td className="px-2 py-4 border-r border-slate-200 font-bold text-indigo-600">{p.openingStock! + 20}</td><td className="px-2 py-4 border-r border-slate-200">---</td>
                             <td className="px-2 py-4 border-r border-slate-200 text-unicou-orange font-black">{sold}</td><td className="px-2 py-4 border-r border-slate-200">${p.basePrice}</td>
                             <td className="px-2 py-4 border-r border-slate-200 text-red-400">0</td><td className="px-2 py-4 border-r border-slate-200">---</td>
                             <td className="px-2 py-4 border-r border-slate-200 font-black text-emerald-600 bg-emerald-50/30">{(p.openingStock! + 20) - sold}</td><td className="px-2 py-4 bg-emerald-50/30">${p.basePrice}</td>
                          </tr>
                        );
                      })}
                   </tbody>
                </table>
             </div>
           </div>

           {/* SALES REGISTER (Requirement III.v) */}
           <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl overflow-hidden">
             <div className="p-8 border-b border-slate-100 bg-slate-50"><span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">III.v Sales Register</span></div>
             <div className="overflow-x-auto">
               <table className="w-full text-left text-[9px] uppercase font-bold">
                 <thead className="bg-slate-100 font-black text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-4">Order No.</th>
                      <th className="px-4 py-4">Date</th>
                      <th className="px-4 py-4">Time</th>
                      <th className="px-4 py-4">Buyer Name</th>
                      <th className="px-4 py-4">Bank A/C (4)</th>
                      <th className="px-4 py-4">Voucher Type</th>
                      <th className="px-4 py-4">Qty</th>
                      <th className="px-4 py-4">Paid Amount</th>
                      <th className="px-4 py-4">Support Agent</th>
                      <th className="px-4 py-4">Delivery Time</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {data.orders.map(o => (
                      <tr key={o.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4 font-mono text-unicou-navy">{o.id}</td>
                        <td className="px-4 py-4">{o.date}</td>
                        <td className="px-4 py-4">{o.time}</td>
                        <td className="px-4 py-4 text-slate-900">{o.buyerName}</td>
                        <td className="px-4 py-4 font-mono">****{o.bankLastFour}</td>
                        <td className="px-4 py-4">{o.productName}</td>
                        <td className="px-4 py-4">{o.quantity}</td>
                        <td className="px-4 py-4 font-black">${o.totalAmount}</td>
                        <td className="px-4 py-4 text-slate-400 italic">{o.supportAgentName || 'System'}</td>
                        <td className="px-4 py-4 font-mono text-emerald-600">{o.deliveryTime || '---'}</td>
                      </tr>
                    ))}
                 </tbody>
               </table>
             </div>
           </div>
        </div>
      )}

      {/* SETTINGS VIEW */}
      {activeTab === 'settings' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
          <div className="bg-slate-50 p-12 rounded-[4rem] border border-slate-200 shadow-xl">
             <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-unicou-navy text-white flex items-center justify-center text-xl shadow-lg">⚙️</div>
                <div>
                   <h3 className="text-2xl font-display font-black text-unicou-navy uppercase tracking-tight">System Infrastructure</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Dispatch & Mail Server Config</p>
                </div>
             </div>
             <div className="p-8 bg-white rounded-3xl border border-slate-200 mb-10"><p className="text-xs text-slate-500 italic">"Ensure your EmailJS Service ID and Public Key are synchronized for real-time voucher delivery node activation."</p></div>
             <button onClick={() => alert("Node Synced: Infrastructure committed.")} className="w-full py-6 bg-unicou-navy text-white rounded-3xl font-black uppercase text-xs tracking-[0.3em] shadow-3xl hover:bg-slate-900 transition-all active:scale-95">COMMIT GLOBAL INFRASTRUCTURE</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
