
import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/apiService';
import { Product, Order, User, OrderStatus, BusinessMetrics, Lead, ViewState } from '../types';

type AdminTab = 'intelligence' | 'registrations' | 'vault' | 'ledgers' | 'staff' | 'catalog' | 'handover';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form States
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ 
    type: 'Voucher', 
    currency: 'USD', 
    pricingModel: 'Global', 
    category: 'PTE',
    icon: '' 
  });

  const isOwner = user.role === 'System Admin/Owner';

  const refreshData = async () => {
    const [o, u, p, m, l] = await Promise.all([
      api.getOrders(), api.getUsers(), api.getProducts(), api.getBusinessMetrics(), api.getLeads()
    ]);
    setData({ orders: o, users: u, products: p, leads: l });
    setMetrics(m);
    setLoading(false);
  };

  useEffect(() => { refreshData(); }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, icon: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleHalt = () => {
    const next = !halted;
    if (confirm(`CRITICAL: Stop all voucher procurement nodes immediately?`)) {
      api.setSystemHaltStatus(next);
      setHalted(next);
      refreshData();
    }
  };

  const handleUserAction = async (uid: string, nextStatus: any) => {
    await api.upsertUser({ id: uid, status: nextStatus });
    refreshData();
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.basePrice) return;
    const id = `v-${newProduct.name.toLowerCase().replace(/\s+/g, '-')}`;
    await api.upsertProduct({ 
      ...newProduct, 
      id, 
      icon: newProduct.icon || '🎟️'
    } as Product);
    setNewProduct({ type: 'Voucher', currency: 'USD', pricingModel: 'Global', category: 'PTE', icon: '' });
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
          <p className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.4em]">Terminal Access: {user.email}</p>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleToggleHalt}
            className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl ${halted ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white animate-pulse'}`}
          >
            {halted ? 'RESUME PROCUREMENT' : 'STOP SYSTEM NODES'}
          </button>
          
          <div className="flex bg-slate-50 p-1.5 rounded-[2rem] border border-slate-200 shadow-inner overflow-x-auto">
            {[
              { id: 'intelligence', label: 'Overview' },
              { id: 'catalog', label: 'Voucher Hub' },
              { id: 'registrations', label: 'Sync Users' },
              { id: 'vault', label: 'Vault Stock' },
              { id: 'ledgers', label: 'Finance' },
              { id: 'staff', label: 'Team' },
              { id: 'handover', label: 'Manual' }
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

      {activeTab === 'catalog' && (
        <div className="animate-in fade-in duration-500 space-y-12">
          <div className="bg-slate-50 p-10 rounded-[4rem] border border-slate-200">
            <h3 className="text-2xl font-display font-black uppercase mb-8 text-unicou-navy">Deploy Voucher Asset</h3>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <input className="p-5 bg-white border border-slate-200 rounded-2xl outline-none font-bold" placeholder="Asset Name (e.g. PTE UKVI)..." value={newProduct.name || ''} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
               <select className="p-5 bg-white border border-slate-200 rounded-2xl outline-none font-bold" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                 {['PTE', 'IELTS', 'TOEFL', 'LanguageCert', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
               </select>
               <input type="number" className="p-5 bg-white border border-slate-200 rounded-2xl outline-none font-bold" placeholder="Market Price (USD)..." value={newProduct.basePrice || ''} onChange={e => setNewProduct({...newProduct, basePrice: Number(e.target.value)})} required />
               
               <div className="lg:col-span-2 flex gap-4">
                  <input className="flex-grow p-5 bg-white border border-slate-200 rounded-2xl outline-none font-bold" placeholder="Image URL (Optional)..." value={newProduct.icon?.startsWith('data:') ? 'Local Image Attached' : (newProduct.icon || '')} onChange={e => setNewProduct({...newProduct, icon: e.target.value})} />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="px-6 py-5 bg-slate-900 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-black whitespace-nowrap">Upload PNG/JPG</button>
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileUpload} />
               </div>

               <button type="submit" className="lg:col-span-1 py-5 bg-unicou-navy text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-all">Establish Node</button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.products.map(p => (
              <div key={p.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl group flex flex-col">
                <div className="h-24 flex items-center justify-center mb-6 bg-slate-50 rounded-2xl overflow-hidden p-4">
                  {p.icon?.includes('http') || p.icon?.startsWith('data:') ? (
                    <img src={p.icon} className="h-full w-auto object-contain" alt={p.name} />
                  ) : (
                    <span className="text-4xl">{p.icon || '🎟️'}</span>
                  )}
                </div>
                <p className="text-[9px] font-black text-unicou-orange uppercase mb-2">{p.category}</p>
                <h4 className="text-xl font-display font-black text-slate-900 uppercase leading-tight mb-4 flex-grow">{p.name}</h4>
                <div className="flex justify-between items-end border-t pt-6 mt-auto">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase">Settlement Value</p>
                      <span className="text-2xl font-black text-unicou-navy">${p.basePrice}</span>
                   </div>
                   <button onClick={() => api.deleteProduct(p.id).then(refreshData)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FINANCE / LEDGERS */}
      {activeTab === 'ledgers' && (
        <div className="animate-in fade-in duration-500 space-y-8">
           <h3 className="text-2xl font-display font-black uppercase text-unicou-navy">Consolidated Financial Ledger</h3>
           <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
              <table className="w-full text-left text-[10px]">
                 <thead className="bg-slate-50 font-black uppercase text-slate-500 border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-6">Order Identification</th>
                      <th className="px-6 py-6">Buyer Identity</th>
                      <th className="px-6 py-6">Voucher Node</th>
                      <th className="px-6 py-6">Settlement</th>
                      <th className="px-6 py-6">Status</th>
                      <th className="px-6 py-6 text-center">Protocol Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {data.orders.map(o => (
                      <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-5 font-mono font-black text-unicou-navy">{o.id}</td>
                        <td className="px-6 py-5 font-black uppercase text-slate-900">{o.buyerName}</td>
                        <td className="px-6 py-5 font-bold text-slate-600 uppercase">{o.productName}</td>
                        <td className="px-6 py-5 font-display font-black text-slate-950 text-base">${o.totalAmount}</td>
                        <td className="px-6 py-5">
                          <span className={`px-4 py-1.5 rounded-full text-[8px] font-black border ${o.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>{o.status}</span>
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex justify-center gap-2">
                             {o.status === 'Pending' && (
                               <button onClick={() => api.updateOrderStatus(o.id, 'Approved').then(refreshData)} className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-[8px] font-black uppercase shadow-lg">Verify & Deliver</button>
                             )}
                             <button onClick={() => api.updateOrderStatus(o.id, 'Refunded').then(refreshData)} className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all text-[8px] font-black">REFUND</button>
                           </div>
                        </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {/* VAULT / STOCK */}
      {activeTab === 'vault' && (
        <div className="animate-in fade-in duration-500 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-3xl">
                <h3 className="text-xl font-display font-black uppercase mb-8">Stock Injection Terminal</h3>
                <StockInjectionForm products={data.products} onRefresh={refreshData} />
             </div>
             <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl overflow-y-auto max-h-[600px] no-scrollbar">
                <h3 className="text-xl font-display font-black text-unicou-navy uppercase mb-8">Asset Inventory Registry</h3>
                <div className="space-y-6">
                   {data.products.map(p => (
                     <div key={p.id} className="flex justify-between items-center border-b pb-4 border-slate-50 last:border-none">
                        <div>
                           <p className="font-black text-slate-900 uppercase text-[11px]">{p.name}</p>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global SKU Hub</p>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className={`text-2xl font-black ${(p.stockCount || 0) < 5 ? 'text-red-500' : 'text-unicou-navy'}`}>{p.stockCount || 0}</span>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
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
    try {
      await api.addStockToProduct(pid, codes.split('\n').filter(c => c.trim()));
      setCodes('');
      alert("Vault Synchronized: Assets Committed to Cluster.");
    } catch (e) {
      alert("Transmission Failure: Node Sync Interrupted.");
    } finally {
      setSyncing(false);
      onRefresh();
    }
  };

  return (
    <form onSubmit={handleInject} className="space-y-6">
       <select className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl font-bold text-white outline-none focus:border-unicou-orange" value={pid} onChange={e => setPid(e.target.value)}>
          <option value="" className="bg-slate-900">Target Voucher SKU...</option>
          {products.map((p: any) => <option key={p.id} value={p.id} className="bg-slate-900">{p.name}</option>)}
       </select>
       <textarea className="w-full p-5 bg-white/5 border border-white/10 rounded-3xl font-mono text-emerald-400 min-h-[250px] outline-none placeholder:text-slate-700" placeholder="Paste codes here (New lines separated)..." value={codes} onChange={e => setCodes(e.target.value)} />
       <button disabled={syncing} className="w-full py-6 bg-unicou-orange rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.3em] shadow-action hover:bg-orange-600 transition-all">
          {syncing ? 'TRANSMITTING TO CLOUD...' : 'COMMIT STOCK INJECTION'}
       </button>
    </form>
  );
};

export default AdminDashboard;
