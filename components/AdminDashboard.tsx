
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Product, Order, User, OrderStatus, BusinessMetrics, Lead } from '../types';

type AdminTab = 'intelligence' | 'registrations' | 'vault' | 'ledgers' | 'staff' | 'catalog';

const AdminDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('intelligence');
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [halted, setHalted] = useState(api.getSystemHaltStatus());
  const [data, setData] = useState<{
    orders: Order[],
    users: User[],
    products: Product[],
    leads: Lead[]
  }>({ orders: [], users: [], products: [], leads: [] });
  const [loading, setLoading] = useState(true);

  // Form States
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ type: 'Voucher', currency: 'USD', pricingModel: 'Global', category: 'PTE' });

  const isOwner = user.role === 'System Admin/Owner';
  const isManager = user.role === 'Operation Manager';

  const refreshData = async () => {
    const [o, u, p, m, l] = await Promise.all([
      api.getOrders(), api.getUsers(), api.getProducts(), api.getBusinessMetrics(), api.getLeads()
    ]);
    setData({ orders: o, users: u, products: p, leads: l });
    setMetrics(m);
    setLoading(false);
  };

  useEffect(() => { refreshData(); }, []);

  const handleToggleHalt = () => {
    const next = !halted;
    if (confirm(`CRITICAL: Stop all voucher procurement nodes immediately?`)) {
      api.setSystemHaltStatus(next);
      setHalted(next);
      refreshData();
    }
  };

  const handleExportRegistry = () => {
    const headers = "ID,Name,Email,Role,Status,Verified\n";
    const rows = data.users.map(u => `${u.id},${u.name},${u.email},${u.role},${u.status},${u.verified}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `UNICOU_MASTER_REGISTRY_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    alert("Requirement IV: Master Registry record sheet exported to CSV.");
  };

  const handleUserAction = async (uid: string, nextStatus: any) => {
    await api.upsertUser({ id: uid, status: nextStatus });
    refreshData();
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.basePrice) return;
    const id = `v-${newProduct.name.toLowerCase().replace(/\s+/g, '-')}`;
    await api.upsertProduct({ ...newProduct, id } as Product);
    setNewProduct({ type: 'Voucher', currency: 'USD', pricingModel: 'Global', category: 'PTE' });
    alert("Product deployed to Catalog.");
    refreshData();
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase tracking-[0.4em]">Establishing Secure Control Node...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 bg-white min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-10 mb-12 border-b border-slate-100 pb-12">
        <div>
          <h1 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">
            {isOwner ? 'OWNER' : 'OPS'} <span className="text-unicou-orange">CONTROL</span>
          </h1>
          <p className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.4em]">Authority Terminal: {user.email}</p>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleToggleHalt}
            className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl ${halted ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white animate-pulse'}`}
          >
            {halted ? 'I. RESUME PROCUREMENT' : 'X. STOP ALL VOUCHER SYSTEM'}
          </button>
          
          <div className="flex bg-slate-50 p-1.5 rounded-[2rem] border border-slate-200 shadow-inner overflow-x-auto">
            {[
              { id: 'intelligence', label: 'Reports' },
              { id: 'catalog', label: 'Catalog' },
              { id: 'registrations', label: 'Approvals' },
              { id: 'vault', label: 'Stock' },
              { id: 'ledgers', label: 'Ledgers' },
              { id: 'staff', label: 'Staff' }
            ].map(t => (
              <button 
                key={t.id} 
                onClick={() => setActiveTab(t.id as any)} 
                className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-white text-unicou-navy shadow-lg border border-slate-200' : 'text-slate-400'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* INTELLIGENCE / OWNER REPORTS */}
      {activeTab === 'intelligence' && metrics && (
        <div className="animate-in fade-in duration-500 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard label="Gross Revenue" value={`$${metrics.monthRevenue.toLocaleString()}`} icon="💰" color="text-emerald-600" />
            <KPICard label="Vault Inventory" value={metrics.vouchersInStock.toString()} icon="🎫" color="text-unicou-orange" />
            <KPICard label="Active Agents" value={metrics.activeAgents.toString()} icon="🤝" color="text-blue-600" />
            <KPICard label="Refund Requests" value={metrics.refundRequests.toString()} icon="💸" color="text-red-600" alert={metrics.refundRequests > 0} />
          </div>

          <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-3xl">
             <div className="flex justify-between items-start mb-12">
                <h3 className="text-2xl font-display font-black uppercase">Business Intelligence Registry</h3>
                <button onClick={handleExportRegistry} className="px-6 py-3 bg-unicou-orange rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-orange-600">Export Master Record Sheet (CSV)</button>
             </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Financial Performance Node</h4>
                   <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-4">
                      <div className="flex justify-between items-center"><span className="text-xs font-bold">Total Sales Count</span><span className="font-mono">{data.orders.length}</span></div>
                      <div className="flex justify-between items-center"><span className="text-xs font-bold">Today Gross Settlement</span><span className="font-mono">${metrics.todaySales}</span></div>
                   </div>
                </div>
                <div className="space-y-6">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Audit Stability</h4>
                   <div className="space-y-4">
                      {data.orders.slice(0, 3).map(o => (
                        <div key={o.id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl text-[10px] italic">
                           <span>AUDIT: {o.id} initialized for {o.buyerName}</span>
                           <span className="text-emerald-400 uppercase font-black">{o.status}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* CATALOG MANAGEMENT */}
      {activeTab === 'catalog' && (
        <div className="animate-in fade-in duration-500 space-y-12">
          <div className="bg-slate-50 p-10 rounded-[4rem] border border-slate-200">
            <h3 className="text-2xl font-display font-black uppercase mb-8 text-unicou-navy">IX. Deploy New Product Node</h3>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <input className="p-5 bg-white border border-slate-200 rounded-2xl outline-none font-bold" placeholder="Product Name..." value={newProduct.name || ''} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
               <select className="p-5 bg-white border border-slate-200 rounded-2xl outline-none font-bold" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                 {['PTE', 'IELTS', 'TOEFL', 'LanguageCert', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
               </select>
               <input type="number" className="p-5 bg-white border border-slate-200 rounded-2xl outline-none font-bold" placeholder="Price (USD)..." value={newProduct.basePrice || ''} onChange={e => setNewProduct({...newProduct, basePrice: Number(e.target.value)})} required />
               <button type="submit" className="md:col-span-3 py-5 bg-unicou-navy text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all">Create Asset</button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.products.map(p => (
              <div key={p.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl group">
                <p className="text-[9px] font-black text-unicou-orange uppercase mb-2">{p.category}</p>
                <h4 className="text-xl font-display font-black text-slate-900 uppercase leading-tight mb-6">{p.name}</h4>
                <div className="flex justify-between items-end border-t pt-6">
                   <span className="text-2xl font-black text-unicou-navy">${p.basePrice}</span>
                   <button onClick={() => api.deleteProduct(p.id).then(refreshData)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VAULT / STOCK */}
      {activeTab === 'vault' && (
        <div className="animate-in fade-in duration-500 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             <div className="bg-slate-900 p-12 rounded-[4rem] text-white">
                <h3 className="text-xl font-display font-black uppercase mb-8">XVI. Add Voucher Stock</h3>
                <StockInjectionForm products={data.products} onRefresh={refreshData} />
             </div>
             <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl">
                <h3 className="text-xl font-display font-black text-unicou-navy uppercase mb-8">Stock Audit Registry</h3>
                <div className="space-y-6">
                   {data.products.map(p => (
                     <div key={p.id} className="flex justify-between items-center border-b pb-4">
                        <div>
                           <p className="font-black text-slate-900 uppercase text-xs">{p.name}</p>
                           <p className="text-[9px] font-black text-slate-400 uppercase">Available Units</p>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className={`text-2xl font-black ${(p.stockCount || 0) < 5 ? 'text-red-500 animate-pulse' : 'text-unicou-navy'}`}>{p.stockCount || 0}</span>
                           {(p.stockCount || 0) < 5 && <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-[7px] font-black uppercase tracking-tighter">XVII. LOW STOCK ALERT</span>}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      )}

      {/* REGISTRATIONS / APPROVALS */}
      {activeTab === 'registrations' && (
        <div className="animate-in fade-in duration-500 space-y-8">
           <h3 className="text-2xl font-display font-black uppercase text-unicou-navy">Stakeholder Approval Queue</h3>
           <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-500 tracking-widest">
                  <tr>
                    <th className="px-6 py-6">User Node</th>
                    <th className="px-6 py-6">Email</th>
                    <th className="px-6 py-6">Applied Role</th>
                    <th className="px-6 py-6">Identity Docs</th>
                    <th className="px-6 py-6 text-center">Authority Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.users.filter(u => u.status === 'Pending').map(u => (
                    <tr key={u.id}>
                      <td className="px-6 py-5 font-black text-slate-900">{u.name}</td>
                      <td className="px-6 py-5 font-mono text-slate-400">{u.email}</td>
                      <td className="px-6 py-5"><span className="px-3 py-1 bg-unicou-navy text-white rounded-full text-[8px] font-black uppercase">{u.role}</span></td>
                      <td className="px-6 py-5"><button className="text-unicou-orange font-black text-[9px] uppercase hover:underline">Download Agreement</button></td>
                      <td className="px-6 py-5">
                         <div className="flex justify-center gap-2">
                           <button onClick={() => handleUserAction(u.id, 'Active')} className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-[8px] font-black uppercase">Approve</button>
                           <button onClick={() => handleUserAction(u.id, 'Hold')} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-[8px] font-black uppercase">Hold</button>
                           <button onClick={() => handleUserAction(u.id, 'Rejected')} className="px-4 py-2 bg-red-600 text-white rounded-lg text-[8px] font-black uppercase">Reject</button>
                         </div>
                      </td>
                    </tr>
                  ))}
                  {data.users.filter(u => u.status === 'Pending').length === 0 && (
                    <tr><td colSpan={5} className="p-20 text-center text-slate-400 italic font-bold">No pending registration nodes in queue.</td></tr>
                  )}
                </tbody>
              </table>
           </div>
        </div>
      )}

      {/* LEDGERS / FINANCE */}
      {activeTab === 'ledgers' && (
        <div className="animate-in fade-in duration-500 space-y-8">
           <div className="flex justify-between items-center">
             <h3 className="text-2xl font-display font-black uppercase text-unicou-navy">Unified Audit Ledger</h3>
             <div className="flex gap-2">
                <button className="px-4 py-2 bg-slate-100 rounded-xl text-[9px] font-black uppercase">Item-Wise Sales</button>
                <button className="px-4 py-2 bg-slate-100 rounded-xl text-[9px] font-black uppercase">Agent-Wise Report</button>
             </div>
           </div>
           <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
              <table className="w-full text-left text-[10px]">
                 <thead className="bg-slate-50 font-black uppercase text-slate-500 border-b">
                    <tr>
                      <th className="px-6 py-6">Order ID</th>
                      <th className="px-6 py-6">Buyer Name</th>
                      <th className="px-6 py-6">Asset Node</th>
                      <th className="px-6 py-6">Amount</th>
                      <th className="px-6 py-6">Status</th>
                      <th className="px-6 py-6 text-center">Fulfillment Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {data.orders.map(o => (
                      <tr key={o.id}>
                        <td className="px-6 py-5 font-mono font-bold text-unicou-navy">{o.id}</td>
                        <td className="px-6 py-5 font-black uppercase text-slate-900">{o.buyerName}</td>
                        <td className="px-6 py-5 font-bold text-slate-600 uppercase">{o.productName}</td>
                        <td className="px-6 py-5 font-display font-black text-slate-950 text-base">${o.totalAmount}</td>
                        <td className="px-6 py-5">
                          <span className={`px-4 py-1.5 rounded-full text-[8px] font-black border ${o.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>{o.status}</span>
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex justify-center gap-1">
                             <button onClick={() => api.updateOrderStatus(o.id, 'Refunded').then(refreshData)} className="p-2 bg-red-500 text-white rounded-lg text-[8px] font-black uppercase">Approve Refund</button>
                           </div>
                        </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {/* STAFF / CRM */}
      {activeTab === 'staff' && (
        <div className="animate-in fade-in duration-500 space-y-10">
           <div className="flex justify-between items-center">
              <h3 className="text-2xl font-display font-black uppercase text-unicou-navy">XIV. Staff & Partner Directory</h3>
              <button className="px-8 py-4 bg-unicou-navy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">+ Deploy New Node</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.users.map(u => (
                <div key={u.id} className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 hover:bg-white transition-all group shadow-sm hover:shadow-2xl">
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-unicou-navy text-xl shadow-inner">{u.name.charAt(0)}</div>
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${u.status === 'Frozen' ? 'bg-red-600 text-white' : 'bg-unicou-navy text-white'}`}>{u.status}</span>
                   </div>
                   <h4 className="font-black text-slate-900 uppercase truncate mb-1">{u.name}</h4>
                   <p className="text-[10px] font-mono text-slate-400 mb-6 truncate">{u.email}</p>
                   <p className="text-[10px] font-black text-unicou-orange uppercase tracking-widest mb-8">{u.role}</p>
                   <div className="flex gap-2">
                      <button onClick={() => handleUserAction(u.id, u.status === 'Frozen' ? 'Active' : 'Frozen')} className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase hover:bg-red-600 transition-all">
                        {u.status === 'Frozen' ? 'XV. Unfreeze' : 'XV. Freeze Node'}
                      </button>
                      <button onClick={() => api.deleteUser(u.id).then(refreshData)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

const StockInjectionForm = ({ products, onRefresh }: any) => {
  const [pid, setPid] = useState('');
  const [codes, setCodes] = useState('');
  const [syncing, setSyncing] = useState(false);

  const handleInject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pid || !codes) return;
    setSyncing(true);
    await api.addStockToProduct(pid, codes.split('\n').filter(c => c.trim()));
    setCodes('');
    setSyncing(false);
    alert("Voucher nodes synchronized with Vault.");
    onRefresh();
  };

  return (
    <form onSubmit={handleInject} className="space-y-6">
       <select className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl font-bold text-white outline-none" value={pid} onChange={e => setPid(e.target.value)}>
          <option value="" className="bg-slate-900">Select Asset Node...</option>
          {products.map((p: any) => <option key={p.id} value={p.id} className="bg-slate-900">{p.name}</option>)}
       </select>
       <textarea className="w-full p-5 bg-white/5 border border-white/10 rounded-3xl font-mono text-emerald-400 min-h-[200px] outline-none" placeholder="Enter codes (One per line)..." value={codes} onChange={e => setCodes(e.target.value)} />
       <button disabled={syncing} className="w-full py-5 bg-unicou-orange rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-600 transition-all">
          {syncing ? 'Synchronizing...' : 'COMMIT STOCK INJECTION'}
       </button>
    </form>
  );
};

const KPICard = ({ label, value, icon, color, alert }: any) => (
  <div className={`bg-white p-8 rounded-[3rem] border-2 transition-all ${alert ? 'border-red-500 shadow-red-500/10' : 'border-slate-50'} hover:shadow-xl flex flex-col`}>
     <div className="flex justify-between items-start mb-6">
        <span className="text-3xl">{icon}</span>
        {alert && <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />}
     </div>
     <p className={`text-4xl font-display font-black leading-none ${color} mb-2 tracking-tighter`}>{value}</p>
     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
  </div>
);

export default AdminDashboard;
