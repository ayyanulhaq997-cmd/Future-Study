
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Product, Order, User, BusinessMetrics, Lead, ViewState, VoucherCode, OrderStatus } from '../types';
import { MailConfig, SYSTEM_CONFIG_KEY } from '../services/mailService';

type AdminTab = 'intelligence' | 'catalog' | 'registrations' | 'sales' | 'staff' | 'vault' | 'settings';

const AdminDashboard: React.FC<{ user: User; onNavigate: (v: ViewState) => void }> = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('intelligence');
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [halted, setHalted] = useState(api.getSystemHaltStatus());
  const [data, setData] = useState<{
    orders: Order[],
    users: User[],
    products: Product[],
    leads: Lead[],
    codes: VoucherCode[]
  }>({ orders: [], users: [], products: [], leads: [], codes: [] });
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const [bulkCodes, setBulkCodes] = useState('');
  const [targetProductId, setTargetProductId] = useState('');

  const [mailConfig, setMailConfig] = useState<MailConfig>({
    serviceId: '',
    templateId_verification: '',
    templateId_voucher: '',
    publicKey: ''
  });

  const refreshData = async () => {
    const [o, u, p, m, l, c] = await Promise.all([
      api.getOrders(), api.getUsers(), api.getProducts(), api.getBusinessMetrics(), api.getLeads(), api.getCodes()
    ]);
    setData({ orders: o, users: u, products: p, leads: l, codes: c });
    setMetrics(m);
    setHalted(api.getSystemHaltStatus());
    
    const saved = localStorage.getItem(SYSTEM_CONFIG_KEY);
    if (saved) {
      try {
        setMailConfig(JSON.parse(saved));
      } catch (e) { console.error("Communication registry check failed."); }
    }
    setLoading(false);
  };

  useEffect(() => { refreshData(); }, []);

  const handleOrderAction = async (orderId: string, status: OrderStatus) => {
    setActionLoading(orderId);
    try {
      await api.updateOrderStatus(orderId, status);
      await refreshData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUserAction = async (u: User, status: User['status']) => {
    setActionLoading(u.id);
    try {
      // Explicitly forcing status update to bypass any state caching
      await api.upsertUser({ email: u.email, status: status as any });
      await refreshData();
    } catch (err: any) {
      alert("Registry Sync Error: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveProduct = async () => {
    if (!editingProduct?.name) {
      alert("Validation Node Failure: Product Name is required.");
      return;
    }
    await api.upsertProduct(editingProduct);
    setEditingProduct(null);
    refreshData();
  };

  const handleSaveUser = async () => {
    if (!editingUser?.email || !editingUser?.name) {
      alert("Validation Node Failure: Identify Node Incomplete.");
      return;
    }
    await api.upsertUser(editingUser);
    setEditingUser(null);
    refreshData();
  };

  const handleSaveMailConfig = () => {
    localStorage.setItem(SYSTEM_CONFIG_KEY, JSON.stringify(mailConfig));
    alert('Infrastructure Synchronized Successfully.');
  };

  const handleBulkSync = async () => {
    if (!targetProductId || !bulkCodes.trim()) {
      alert("Selection Error: Select target product and provide voucher list.");
      return;
    }
    await api.injectBulkCodes(targetProductId, bulkCodes.split('\n'));
    setBulkCodes('');
    alert("Voucher Vault Successfully Updated.");
    refreshData();
  };

  const handleToggleHalt = () => {
    const next = !halted;
    if (confirm(`CRITICAL SYSTEM OVERRIDE: Do you want to ${next ? 'HALT' : 'RESUME'} global transactions?`)) {
      api.setSystemHaltStatus(next);
      setHalted(next);
    }
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase text-xs tracking-widest">Accessing Command Terminal...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="flex flex-col xl:flex-row justify-between items-center gap-10 mb-12 border-b border-slate-100 pb-12">
        <div>
          <h1 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter mb-2 leading-none">
            ADMIN <span className="text-unicou-orange">CONTROL</span>
          </h1>
          <p className="text-[10px] font-black text-unicou-navy uppercase tracking-widest">Master Identity: {user.email}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 justify-center">
          <button onClick={handleToggleHalt} className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl ${halted ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white animate-pulse'}`}>
            {halted ? 'RESUME SYSTEM' : 'STOP ALL TRANSACTIONS'}
          </button>
          
          <div className="flex bg-slate-50 p-1.5 rounded-[2rem] border border-slate-200 shadow-inner overflow-x-auto no-scrollbar">
            {['intelligence', 'catalog', 'registrations', 'sales', 'staff', 'vault', 'settings'].map(t => (
              <button key={t} onClick={() => setActiveTab(t as any)} className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === t ? 'bg-white text-unicou-navy shadow-lg border border-slate-200' : 'text-slate-400'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'intelligence' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in duration-500">
           {[
             { label: 'Live Sales', val: `$${metrics?.todaySales.toLocaleString()}`, color: 'text-unicou-navy' },
             { label: 'Cycle Revenue', val: `$${metrics?.monthRevenue.toLocaleString()}`, color: 'text-unicou-orange' },
             { label: 'Warehouse Stock', val: metrics?.vouchersInStock, color: 'text-slate-900' },
             { label: 'Active Partners', val: metrics?.activeAgents, color: 'text-emerald-600' }
           ].map((m, i) => (
             <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl group hover:border-unicou-navy/20 transition-all">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{m.label}</p>
               <h4 className={`text-5xl font-display font-black tracking-tighter ${m.color}`}>{m.val}</h4>
             </div>
           ))}
        </div>
      )}

      {activeTab === 'registrations' && (
        <div className="space-y-12 animate-in fade-in duration-500">
          <div className="flex justify-between items-center px-4">
            <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900">Account Registration Requests</h3>
          </div>
          <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[10px] uppercase">
                <thead>
                  <tr className="bg-slate-50 font-black text-slate-500 tracking-widest border-b border-slate-100">
                    <th className="px-8 py-6">Name</th>
                    <th className="px-8 py-6">Email Node</th>
                    <th className="px-8 py-6">Target Role</th>
                    <th className="px-8 py-6">Current Status</th>
                    <th className="px-8 py-6 text-center">Fulfillment Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-bold">
                  {data.users.filter(u => ['Student', 'Agent', 'Academic Institute'].includes(u.role)).map(u => (
                    <tr key={u.id} className={`hover:bg-slate-50 transition-colors ${actionLoading === u.id ? 'opacity-50 grayscale' : ''}`}>
                      <td className="px-8 py-6 font-black text-slate-900">{u.name}</td>
                      <td className="px-8 py-6 font-mono text-unicou-navy lowercase">{u.email}</td>
                      <td className="px-8 py-6">
                        <span className="px-2 py-1 bg-slate-100 rounded text-[8px] font-black text-slate-600">{u.role}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black ${
                          u.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                          u.status === 'Hold' ? 'bg-amber-50 text-amber-600' : 
                          u.status === 'Pending' ? 'bg-indigo-50 text-indigo-600' : 
                          'bg-red-50 text-red-600'
                        }`}>{u.status}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center gap-2">
                          <button 
                            disabled={actionLoading === u.id}
                            onClick={() => handleUserAction(u, 'Active')} 
                            className={`px-6 py-2 bg-emerald-500 text-white rounded-xl text-[9px] font-black shadow-lg transition-all ${u.status === 'Active' ? 'ring-2 ring-emerald-200' : 'hover:bg-emerald-600 active:scale-95'}`}
                          >
                            {actionLoading === u.id ? '...' : 'Verify'}
                          </button>
                          <button 
                            disabled={actionLoading === u.id}
                            onClick={() => handleUserAction(u, 'Hold')} 
                            className="px-6 py-2 bg-amber-500 text-white rounded-xl text-[9px] font-black hover:bg-amber-600 shadow-lg transition-all active:scale-95"
                          >
                            Hold
                          </button>
                          <button 
                            disabled={actionLoading === u.id}
                            onClick={() => handleUserAction(u, 'Rejected')} 
                            className="px-6 py-2 bg-red-600 text-white rounded-xl text-[9px] font-black hover:bg-red-700 shadow-lg transition-all active:scale-95"
                          >
                            Pass
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {data.users.filter(u => ['Student', 'Agent', 'Academic Institute'].includes(u.role)).length === 0 && (
                    <tr><td colSpan={5} className="p-20 text-center text-slate-400 italic font-bold">No active registrations detected in registry.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sales' && (
        <div className="space-y-12 animate-in fade-in duration-500">
           <div className="flex justify-between items-center px-4">
              <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900">Procurement Register</h3>
           </div>
           <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-3xl overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px] uppercase">
                  <thead>
                    <tr className="bg-slate-50 font-black text-slate-500 tracking-widest border-b border-slate-100">
                      <th className="px-6 py-6">Order ID</th>
                      <th className="px-6 py-6">Timestamp</th>
                      <th className="px-6 py-6">Buyer</th>
                      <th className="px-6 py-6">Product</th>
                      <th className="px-6 py-6">Amount</th>
                      <th className="px-6 py-6 text-center">Status Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-bold">
                    {data.orders.map(o => (
                      <tr key={o.id} className={`hover:bg-slate-50 ${actionLoading === o.id ? 'opacity-50 grayscale' : ''}`}>
                        <td className="px-6 py-6 font-mono text-unicou-navy">{o.id}</td>
                        <td className="px-6 py-6 text-slate-400">{o.date} {o.time}</td>
                        <td className="px-6 py-6 font-black text-slate-900">{o.buyerName}</td>
                        <td className="px-6 py-6 text-unicou-navy">{o.productName}</td>
                        <td className="px-6 py-6 font-display font-black text-slate-950">${o.totalAmount}</td>
                        <td className="px-6 py-6">
                           <div className="flex items-center justify-center gap-2">
                              <button disabled={actionLoading === o.id} onClick={() => handleOrderAction(o.id, 'Approved')} className={`px-4 py-2 bg-emerald-500 text-white rounded-xl text-[8px] font-black ${o.status === 'Approved' ? 'ring-2 ring-emerald-200' : ''}`}>Verify</button>
                              <button disabled={actionLoading === o.id} onClick={() => handleOrderAction(o.id, 'Hold')} className={`px-4 py-2 bg-amber-500 text-white rounded-xl text-[8px] font-black ${o.status === 'Hold' ? 'ring-2 ring-amber-200' : ''}`}>Hold</button>
                              <button disabled={actionLoading === o.id} onClick={() => handleOrderAction(o.id, 'Rejected')} className={`px-4 py-2 bg-red-600 text-white rounded-xl text-[8px] font-black ${o.status === 'Rejected' ? 'ring-2 ring-red-200' : ''}`}>Reject</button>
                           </div>
                        </td>
                      </tr>
                    ))}
                    {data.orders.length === 0 && (
                      <tr><td colSpan={6} className="p-20 text-center text-slate-400 italic font-bold">No procurement records identified.</td></tr>
                    )}
                  </tbody>
                </table>
             </div>
           </div>
        </div>
      )}

      {activeTab === 'catalog' && (
        <div className="space-y-12 animate-in fade-in duration-500">
           <div className="flex justify-between items-center px-4">
              <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900">Product Assets</h3>
              <button onClick={() => setEditingProduct({ id: `p-${Date.now()}`, type: 'Voucher', category: 'PTE', basePrice: 0, currency: 'USD', pricingModel: 'Global', icon: '' })} className="px-8 py-4 bg-unicou-orange text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">+ ADD PRODUCT</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data.products.map(p => (
                <div key={p.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-lg flex flex-col group relative overflow-hidden">
                   <div className="h-32 flex items-center justify-center mb-6 bg-slate-50 rounded-[2rem] p-4 border border-slate-100 shadow-inner overflow-hidden">
                      {p.icon ? <img src={p.icon} className="max-h-full max-w-full object-contain" /> : <span className="text-4xl opacity-20">🎟️</span>}
                   </div>
                   <p className="text-[8px] font-black text-unicou-orange uppercase tracking-widest mb-1">{p.category}</p>
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

      {activeTab === 'staff' && (
        <div className="space-y-12 animate-in fade-in duration-500">
          <div className="flex justify-between items-center px-4">
            <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900">Identity Nodes</h3>
            <button onClick={() => setEditingUser({ role: 'Sales Agent', status: 'Active' })} className="px-8 py-4 bg-unicou-navy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">+ ADD STAFF</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.users.filter(u => !['Student', 'Agent', 'Academic Institute'].includes(u.role)).map(u => (
              <div key={u.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl group hover:border-unicou-navy/20 transition-all">
                 <div className="flex items-center gap-6 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-xl text-unicou-navy shadow-inner uppercase">{u.name.charAt(0)}</div>
                    <div>
                      <h4 className="font-black text-slate-950 uppercase">{u.name}</h4>
                      <p className="text-[9px] font-black text-unicou-orange uppercase tracking-widest">{u.role}</p>
                    </div>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-[10px] font-mono text-slate-500 mb-6 truncate">{u.email}</div>
                 <div className="flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${u.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{u.status}</span>
                    <button onClick={() => setEditingUser(u)} className="text-[9px] font-black text-unicou-navy uppercase hover:underline">Manage Access</button>
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'vault' && (
        <div className="max-w-3xl mx-auto space-y-12 animate-in slide-in-from-bottom-6 duration-500">
           <div className="bg-slate-950 p-10 rounded-[3.5rem] text-white shadow-3xl">
              <h3 className="text-2xl font-display font-black uppercase mb-8">Voucher Injection Node</h3>
              <div className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Target Product Registry</label>
                    <select value={targetProductId} onChange={e => setTargetProductId(e.target.value)} className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl font-bold outline-none text-white focus:bg-white/20 appearance-none">
                       <option value="">Select Target...</option>
                       {data.products.map(p => <option key={p.id} value={p.id} className="text-slate-900">{p.name}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Raw Voucher List (New Line Separated)</label>
                    <textarea 
                      value={bulkCodes} onChange={e => setBulkCodes(e.target.value)}
                      placeholder="UC-CODE-001&#10;UC-CODE-002..."
                      className="w-full p-8 bg-white/5 border border-white/20 rounded-[2rem] font-mono text-sm focus:bg-white/10 outline-none min-h-[300px] resize-none"
                    />
                 </div>
                 <button onClick={handleBulkSync} className="w-full py-6 bg-unicou-orange text-white rounded-[1.8rem] font-black text-xs uppercase tracking-widest shadow-action hover:scale-[1.02] transition-all">START SYNC</button>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
           <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-3xl">
              <h3 className="text-2xl font-display font-black text-unicou-navy uppercase mb-10">Infrastructure <span className="text-unicou-orange">Settings</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Mail Node (EmailJS)</h4>
                    <Input label="Service ID" value={mailConfig.serviceId} onChange={(v:any) => setMailConfig({...mailConfig, serviceId: v})} />
                    <Input label="Public Key" value={mailConfig.publicKey} onChange={(v:any) => setMailConfig({...mailConfig, publicKey: v})} />
                 </div>
                 <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Templates</h4>
                    <Input label="Verification Template ID" value={mailConfig.templateId_verification} onChange={(v:any) => setMailConfig({...mailConfig, templateId_verification: v})} />
                    <Input label="Voucher Delivery Template ID" value={mailConfig.templateId_voucher} onChange={(v:any) => setMailConfig({...mailConfig, templateId_voucher: v})} />
                 </div>
              </div>
              <div className="mt-12 pt-8 border-t border-slate-50 flex justify-end">
                 <button onClick={handleSaveMailConfig} className="px-12 py-4 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">Commit Configurations</button>
              </div>
           </div>
        </div>
      )}

      {/* MODALS */}
      {editingProduct && (
        <div className="fixed inset-0 z-[300] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
           <div className="bg-white w-full max-w-2xl rounded-[3.5rem] p-12 shadow-3xl animate-in zoom-in-95 duration-300">
              <h2 className="text-3xl font-display font-black text-unicou-navy uppercase mb-8">Asset <span className="text-unicou-orange">Registry</span></h2>
              <div className="space-y-6">
                 <Input label="Display Name" value={editingProduct.name || ''} onChange={(v:any) => setEditingProduct({...editingProduct, name: v})} />
                 <Input label="Restored: Voucher Image URL" placeholder="https://source.com/img.png" value={editingProduct.icon || ''} onChange={(v:any) => setEditingProduct({...editingProduct, icon: v})} />
                 <div className="grid grid-cols-2 gap-6">
                    <Input label="Category (PTE/IELTS)" value={editingProduct.category || ''} onChange={(v:any) => setEditingProduct({...editingProduct, category: v})} />
                    <Input label="Settlement Price (USD)" type="number" value={editingProduct.basePrice || 0} onChange={(v:any) => setEditingProduct({...editingProduct, basePrice: parseFloat(v)})} />
                 </div>
                 <div className="flex gap-4 pt-8">
                    <button onClick={() => editingProduct.id?.startsWith('p-') ? handleSaveProduct() : setEditingProduct(null)} className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest">Cancel</button>
                    <button onClick={handleSaveProduct} className="flex-[2] py-5 bg-unicou-navy text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Commit Asset</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 z-[300] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
           <div className="bg-white w-full max-w-2xl rounded-[3.5rem] p-12 shadow-3xl animate-in zoom-in-95 duration-300">
              <h2 className="text-3xl font-display font-black text-unicou-navy uppercase mb-8">Node <span className="text-unicou-orange">Authority</span></h2>
              <div className="space-y-6">
                 <Input label="Staff Name" value={editingUser.name || ''} onChange={(v:any) => setEditingUser({...editingUser, name: v})} />
                 <Input label="Identity Email" value={editingUser.email || ''} onChange={(v:any) => setEditingUser({...editingUser, email: v})} />
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Authority Role</label>
                       <select value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value as any})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold">
                          <option value="System Admin/Owner">Master Admin</option>
                          <option value="Finance Manager">Finance Node</option>
                          <option value="Sales Agent">Sales Hub</option>
                          <option value="Support">Client Desk</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Node Status</label>
                       <select value={editingUser.status} onChange={e => setEditingUser({...editingUser, status: e.target.value as any})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold">
                          <option value="Active">Authorized</option>
                          <option value="Hold">On Hold</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Frozen">Revoked</option>
                       </select>
                    </div>
                 </div>
                 <div className="flex gap-4 pt-8">
                    <button onClick={() => setEditingUser(null)} className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest">Cancel</button>
                    <button onClick={handleSaveUser} className="flex-[2] py-5 bg-unicou-navy text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Update Node</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const Input = ({ label, value, onChange, type = "text", placeholder = "" }: any) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      type={type} placeholder={placeholder}
      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 outline-none focus:border-unicou-orange transition-all shadow-inner" 
      value={value} 
      onChange={e => onChange(e.target.value)} 
    />
  </div>
);

export default AdminDashboard;
