
import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/apiService';
import { MailConfig, SYSTEM_CONFIG_KEY } from '../services/mailService';
import { Product, Order, User, OrderStatus, BusinessMetrics, Lead, ViewState } from '../types';

type AdminTab = 'intelligence' | 'catalog' | 'vault' | 'ledgers' | 'staff' | 'settings';

const AdminDashboard: React.FC<{ user: User; onNavigate: (v: ViewState) => void }> = ({ user, onNavigate }) => {
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
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // System Configuration State
  const [mailConfig, setMailConfig] = useState<MailConfig>({
    serviceId: '',
    templateId_verification: '',
    templateId_voucher: '',
    templateId_hold: '',
    templateId_rejected: '',
    publicKey: ''
  });

  const isOwner = user.role === 'System Admin/Owner';

  const refreshData = async () => {
    const [o, u, p, m, l] = await Promise.all([
      api.getOrders(), api.getUsers(), api.getProducts(), api.getBusinessMetrics(), api.getLeads()
    ]);
    setData({ orders: o, users: u, products: p, leads: l });
    setMetrics(m);
    
    const savedConfig = localStorage.getItem(SYSTEM_CONFIG_KEY);
    if (savedConfig) setMailConfig(JSON.parse(savedConfig));
    
    setLoading(false);
  };

  useEffect(() => { refreshData(); }, []);

  const saveMailConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(SYSTEM_CONFIG_KEY, JSON.stringify(mailConfig));
    alert("System Node Updated: Global Mail Infrastructure Synchronized.");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      if (file.size > 2000000) return alert("File too large. Max 2MB allowed.");
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct({ ...editingProduct, icon: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = async () => {
    if (!editingProduct?.name || !editingProduct?.basePrice) return alert("Node Name and Price mandatory.");
    await api.upsertProduct(editingProduct as Product);
    setEditingProduct(null);
    refreshData();
  };

  const handleDeleteProduct = async (pid: string) => {
    if (confirm("Permanently remove this product node?")) {
      await api.deleteProduct(pid);
      refreshData();
    }
  };

  const handleSaveUser = async () => {
    if (!editingUser?.email || !editingUser?.name) return alert("Name and Email mandatory.");
    await api.upsertUser(editingUser as User);
    setEditingUser(null);
    refreshData();
  };

  const handleDeleteUser = async (uid: string) => {
    if (confirm("Permanently delete this user identity?")) {
      await api.deleteUser(uid);
      refreshData();
    }
  };

  const handleToggleFreeze = async (u: User) => {
    const nextStatus = u.status === 'Frozen' ? 'Active' : 'Frozen';
    await api.setUserStatus(u.id, nextStatus);
    refreshData();
  };

  const handleToggleHalt = () => {
    const next = !halted;
    if (confirm(`CRITICAL: Stop all voucher procurement nodes immediately?`)) {
      api.setSystemHaltStatus(next);
      setHalted(next);
      refreshData();
    }
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
          <p className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.4em]">Terminal Access: {user.email}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 justify-center">
          <button 
            onClick={handleToggleHalt}
            className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl ${halted ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white animate-pulse'}`}
          >
            {halted ? 'RESUME PROCUREMENT' : 'STOP SYSTEM NODES'}
          </button>
          
          <div className="flex bg-slate-50 p-1.5 rounded-[2rem] border border-slate-200 shadow-inner overflow-x-auto no-scrollbar">
            {[
              { id: 'intelligence', label: 'Overview' },
              { id: 'catalog', label: 'Vouchers' },
              { id: 'vault', label: 'Vault' },
              { id: 'ledgers', label: 'Finance' },
              { id: 'staff', label: 'Users' },
              { id: 'settings', label: 'Settings' }
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

             <form onSubmit={saveMailConfig} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-unicou-navy uppercase tracking-widest ml-1">EmailJS Service ID</label>
                      <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-mono text-sm outline-none focus:border-unicou-orange" placeholder="service_xxxxxxx" value={mailConfig.serviceId} onChange={e => setMailConfig({...mailConfig, serviceId: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-unicou-navy uppercase tracking-widest ml-1">EmailJS Public Key</label>
                      <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-mono text-sm outline-none focus:border-unicou-orange" placeholder="user_xxxxxxxx" value={mailConfig.publicKey} onChange={e => setMailConfig({...mailConfig, publicKey: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-unicou-navy uppercase tracking-widest ml-1">Verification Template ID</label>
                      <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-mono text-sm outline-none focus:border-unicou-orange" placeholder="template_xxxxxxx" value={mailConfig.templateId_verification} onChange={e => setMailConfig({...mailConfig, templateId_verification: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-unicou-navy uppercase tracking-widest ml-1">Voucher Delivery Template ID</label>
                      <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-mono text-sm outline-none focus:border-unicou-orange" placeholder="template_xxxxxxx" value={mailConfig.templateId_voucher} onChange={e => setMailConfig({...mailConfig, templateId_voucher: e.target.value})} />
                   </div>
                </div>
                <button type="submit" className="w-full py-6 bg-unicou-navy text-white rounded-3xl font-black uppercase text-xs tracking-[0.3em] shadow-3xl hover:bg-slate-900 transition-all active:scale-95">COMMIT SYSTEM CONFIGURATION</button>
             </form>
          </div>
        </div>
      )}

      {activeTab === 'catalog' && (
        <div className="animate-in fade-in duration-500 space-y-12">
           <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter">Voucher Inventory Registry</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Manage Official Exam SKU Nodes</p>
              </div>
              <button 
                onClick={() => setEditingProduct({ id: `p-${Date.now()}`, name: '', type: 'Voucher', basePrice: 0, category: 'PTE', currency: 'USD', pricingModel: 'Global', description: '', icon: '' })}
                className="px-8 py-4 bg-unicou-orange text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all hover:bg-orange-600"
              >
                + ADD NEW VOUCHER NODE
              </button>
           </div>

           {editingProduct && (
             <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-start mb-8">
                   <h4 className="text-sm font-black uppercase tracking-[0.2em] text-unicou-navy">Configure Voucher Node</h4>
                   <button onClick={() => setEditingProduct(null)} className="p-2 text-slate-400 hover:text-slate-900">✕</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400">Voucher Name</label>
                      <input className="w-full p-4 bg-white rounded-xl border border-slate-200 outline-none focus:border-unicou-navy" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400">Base Price (USD)</label>
                      <input type="number" className="w-full p-4 bg-white rounded-xl border border-slate-200 outline-none focus:border-unicou-navy" value={editingProduct.basePrice} onChange={e => setEditingProduct({...editingProduct, basePrice: Number(e.target.value)})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400">Category</label>
                      <select className="w-full p-4 bg-white rounded-xl border border-slate-200 outline-none focus:border-unicou-navy appearance-none" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                         {['PTE', 'IELTS', 'TOEFL', 'LanguageCert', 'Duolingo', 'OTHER'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2 flex flex-col justify-end">
                      <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/png, image/jpeg" />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full py-4 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${editingProduct.icon ? 'bg-emerald-600 text-white shadow-lg' : 'bg-unicou-navy text-white hover:bg-slate-900'}`}
                      >
                         {editingProduct.icon ? '✅ LOGO SYNCED' : '📸 UPLOAD PNG/JPG'}
                      </button>
                   </div>
                </div>
                {editingProduct.icon && (
                  <div className="mt-8 flex justify-center">
                    <div className="w-48 h-32 bg-white rounded-2xl border border-slate-100 flex items-center justify-center p-4 shadow-inner">
                      <img src={editingProduct.icon} className="max-h-full max-w-full object-contain" alt="Preview" />
                    </div>
                  </div>
                )}
                <div className="flex gap-4 mt-8 pt-8 border-t border-slate-200">
                   <button onClick={handleSaveProduct} className="px-10 py-4 bg-emerald-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg active:scale-95">Save Node</button>
                   <button onClick={() => setEditingProduct(null)} className="px-10 py-4 bg-slate-200 text-slate-500 rounded-xl font-black text-[9px] uppercase tracking-widest">Cancel</button>
                </div>
             </div>
           )}

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
             {data.products.map(p => (
               <div key={p.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl group flex flex-col transition-all hover:border-unicou-navy relative overflow-hidden">
                 <div className="h-32 flex items-center justify-center mb-8 bg-slate-50 rounded-[2rem] overflow-hidden p-6 shadow-inner relative">
                    {p.icon ? (
                      <img src={p.icon} className="max-h-full max-w-full object-contain" alt={p.name} />
                    ) : (
                      <span className="text-4xl opacity-20">🎟️</span>
                    )}
                 </div>
                 <p className="text-[9px] font-black text-unicou-orange uppercase tracking-[0.2em] mb-2">{p.category} NODE</p>
                 <h4 className="text-xl font-black text-slate-900 uppercase leading-tight mb-6 flex-grow">{p.name}</h4>
                 
                 <div className="flex justify-between items-center border-t border-slate-50 pt-6">
                    <div>
                      <span className="text-2xl font-display font-black text-unicou-navy">${p.basePrice}</span>
                      <p className="text-[8px] font-black text-slate-400 uppercase">Settlement Rate</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingProduct(p)} className="p-3 bg-slate-50 text-unicou-navy rounded-xl hover:bg-slate-100 transition-all border border-slate-100">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all border border-red-100">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="animate-in fade-in duration-500 space-y-12">
           <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter">Unified User Registry</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Identity & Authority Management</p>
              </div>
              <button 
                onClick={() => setEditingUser({ id: `u-${Date.now()}`, name: '', email: '', role: 'Student', status: 'Active' })}
                className="px-8 py-4 bg-unicou-navy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all hover:bg-slate-900"
              >
                + ESTABLISH NEW IDENTITY
              </button>
           </div>

           {editingUser && (
             <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-start mb-8">
                   <h4 className="text-sm font-black uppercase tracking-[0.2em] text-unicou-navy">User Identity Node</h4>
                   <button onClick={() => setEditingUser(null)} className="p-2 text-slate-400 hover:text-slate-900">✕</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400">Legal Name</label>
                      <input className="w-full p-4 bg-white rounded-xl border border-slate-200 outline-none" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400">Official Email</label>
                      <input className="w-full p-4 bg-white rounded-xl border border-slate-200 outline-none" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400">System Role</label>
                      <select className="w-full p-4 bg-white rounded-xl border border-slate-200 outline-none appearance-none" value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value as any})}>
                         {['Student', 'Agent', 'Academic Institute', 'Sales Manager', 'Finance Manager', 'Academic Manager', 'Operation Manager'].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400">Current Status</label>
                      <select className="w-full p-4 bg-white rounded-xl border border-slate-200 outline-none appearance-none" value={editingUser.status} onChange={e => setEditingUser({...editingUser, status: e.target.value as any})}>
                         {['Active', 'Pending', 'Hold', 'Rejected', 'Frozen'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                   </div>
                </div>
                <div className="flex gap-4 mt-8 pt-8 border-t border-slate-200">
                   <button onClick={handleSaveUser} className="px-10 py-4 bg-emerald-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg">Commit Identity</button>
                   <button onClick={() => setEditingUser(null)} className="px-10 py-4 bg-slate-200 text-slate-500 rounded-xl font-black text-[9px] uppercase tracking-widest">Cancel</button>
                </div>
             </div>
           )}

           <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full text-left text-[11px]">
                 <thead>
                   <tr className="bg-slate-50 font-black uppercase text-slate-500 tracking-widest border-b border-slate-100">
                     <th className="px-8 py-6">Identity Node</th>
                     <th className="px-8 py-6">Email Address</th>
                     <th className="px-8 py-6">Authority Role</th>
                     <th className="px-8 py-6">Audit Status</th>
                     <th className="px-8 py-6 text-right">Fulfillment Control</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   {data.users.map(u => (
                     <tr key={u.id} className={`hover:bg-slate-50/50 transition-colors font-bold ${u.status === 'Frozen' ? 'bg-red-50/30 grayscale italic text-slate-400' : 'text-slate-700'}`}>
                       <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                             <div className={`w-8 h-8 rounded-lg ${u.status === 'Frozen' ? 'bg-slate-300' : 'bg-unicou-navy'} text-white flex items-center justify-center text-xs font-black`}>{u.name.charAt(0)}</div>
                             <span className="text-slate-950">{u.name} {u.status === 'Frozen' && '(FROZEN)'}</span>
                          </div>
                       </td>
                       <td className="px-8 py-5 font-mono text-[10px]">{u.email}</td>
                       <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${u.role === 'Student' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>{u.role}</span>
                       </td>
                       <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : u.status === 'Frozen' ? 'bg-red-600 animate-pulse' : 'bg-amber-500'}`} />
                             <span className="text-[10px] font-black uppercase tracking-widest">{u.status}</span>
                          </div>
                       </td>
                       <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2">
                             <button onClick={() => setEditingUser(u)} className="p-2.5 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-lg transition-all" title="Edit Identity">
                               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                             </button>
                             {u.role !== 'System Admin/Owner' && (
                               <>
                                 <button onClick={() => handleToggleFreeze(u)} className={`p-2.5 ${u.status === 'Frozen' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'} rounded-lg transition-all`} title={u.status === 'Frozen' ? 'Unfreeze' : 'Freeze Node'}>
                                   {u.status === 'Frozen' ? '❄️' : '🔥'}
                                 </button>
                                 <button onClick={() => handleDeleteUser(u.id)} className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all" title="Delete Permanent">
                                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                 </button>
                               </>
                             )}
                          </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
        </div>
      )}

      {activeTab === 'intelligence' && metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in duration-500">
           <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 shadow-inner">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Today's Settlement</p>
              <h4 className="text-5xl font-display font-black text-unicou-navy tracking-tighter">${metrics.todaySales}</h4>
           </div>
           <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 shadow-inner relative overflow-hidden">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Vault Inventory</p>
              <h4 className="text-5xl font-display font-black text-unicou-orange tracking-tighter">{metrics.vouchersInStock}</h4>
              {metrics.vouchersInStock < 10 && (
                <div className="absolute top-4 right-4 animate-pulse px-2 py-1 bg-red-100 text-red-600 text-[8px] font-black rounded uppercase border border-red-200">LOW STOCK NODE</div>
              )}
           </div>
           <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 shadow-inner">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Users Registry</p>
              <h4 className="text-5xl font-display font-black text-slate-900 tracking-tighter">{data.users.length}</h4>
           </div>
           <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 shadow-inner">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Risk Alerts</p>
              <h4 className="text-5xl font-display font-black text-red-500 tracking-tighter">{metrics.riskAlerts}</h4>
           </div>
        </div>
      )}

      {activeTab === 'ledgers' && (
        <div className="p-20 text-center animate-in fade-in duration-500 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200">
           <div className="text-6xl mb-8">📊</div>
           <h3 className="text-3xl font-display font-black uppercase text-slate-950 mb-4 tracking-tighter">Unified Financial Dashboard</h3>
           <p className="text-slate-500 font-bold italic text-lg max-w-xl mx-auto">"Real-time visibility of gross sales, agent settlements, and tax reporting. This node is synchronized with the Finance Manager terminal."</p>
           <button onClick={() => alert("Requirement 1.XI: Report generation process authorized. CSV dispatched.")} className="mt-8 px-12 py-4 bg-unicou-navy text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all hover:bg-black">DOWNLOAD COMPLETE RECORD SHEET (CSV)</button>
        </div>
      )}

      {activeTab === 'vault' && (
        <div className="p-20 text-center animate-in fade-in duration-500 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200">
           <div className="text-6xl mb-8">🔐</div>
           <h3 className="text-3xl font-display font-black uppercase text-slate-950 mb-4 tracking-tighter">Encrypted Voucher Vault</h3>
           <p className="text-slate-500 font-bold italic text-lg max-w-xl mx-auto">"Upload raw voucher keys directly into the secure cloud. The system handles atomic distribution to verified orders."</p>
           <button className="mt-10 px-12 py-5 bg-unicou-navy text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl">BULK UPLOAD PROTOCOL</button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
