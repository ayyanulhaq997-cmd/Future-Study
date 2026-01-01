
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Product, VoucherCode, Order, User, Lead } from '../types';

type AdminTab = 'orders' | 'agents' | 'inventory' | 'security';

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

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase text-[10px] tracking-[0.4em]">Initializing Control Hub...</div>;

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-16 border-b border-slate-100 pb-10">
        <div>
           <h1 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter">
             SYSTEM <span className="text-unicou-orange">ADMIN</span>
           </h1>
           <div className="flex items-center gap-3 mt-2">
              <span className={`w-2 h-2 rounded-full ${security.isGlobalOrderStop ? 'bg-red-600 animate-pulse' : 'bg-emerald-500'}`} />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Nodes: {security.isGlobalOrderStop ? 'LOCKED (Emergency Stop)' : 'OPERATIONAL'}
              </p>
           </div>
        </div>
        <div className="flex bg-slate-50 p-1.5 rounded-[2rem] border border-slate-200 shadow-inner">
           {(['orders', 'agents', 'inventory', 'security'] as AdminTab[]).map((tab) => (
             <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-unicou-navy shadow-lg border border-slate-200' : 'text-slate-400 hover:text-slate-900'}`}>
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
              <p className="text-slate-500 font-bold italic text-lg mb-12">"Deactivates all voucher procurement nodes instantly across the entire platform."</p>
              <button 
                onClick={handleToggleEmergencyStop}
                className={`w-full py-8 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 ${security.isGlobalOrderStop ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-red-600 text-white hover:bg-black'}`}
              >
                {security.isGlobalOrderStop ? 'RESUME SYSTEM OPERATIONS' : 'ACTIVATE GLOBAL LOCK'}
              </button>
           </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in duration-500">
           <div className="lg:col-span-4">
              <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 shadow-inner">
                 <h3 className="text-xl font-black text-unicou-navy uppercase mb-8">Provision New Voucher (Req 14.d)</h3>
                 <form onSubmit={handleAddProduct} className="space-y-6">
                    <div>
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Voucher Name</label>
                       <input required className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-xs font-bold outline-none" value={newProduct.name || ''} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="e.g. PTE Academic (Gold)" />
                    </div>
                    <div>
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                       <input required className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-xs font-bold outline-none" value={newProduct.category || ''} onChange={e => setNewProduct({...newProduct, category: e.target.value})} placeholder="PTE" />
                    </div>
                    <div>
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Net Base Rate ($)</label>
                       <input required type="number" className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-xs font-bold outline-none" value={newProduct.basePrice || ''} onChange={e => setNewProduct({...newProduct, basePrice: Number(e.target.value)})} placeholder="165" />
                    </div>
                    <button type="submit" className="w-full py-5 bg-unicou-navy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black">Inject Voucher Node</button>
                 </form>
              </div>
           </div>
           <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
              <table className="w-full text-left">
                 <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">
                    <tr><th className="px-10 py-6">Voucher Node</th><th className="px-10 py-6">Category</th><th className="px-10 py-6 text-right">Exclusive Discounted Price</th></tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {data.products.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="px-10 py-6 font-black text-xs text-unicou-navy uppercase">{p.name}</td>
                        <td className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.category}</td>
                        <td className="px-10 py-6 text-right font-display font-black text-slate-950">${p.basePrice}</td>
                      </tr>
                    ))}
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
                  <th className="px-10 py-6">Order ID</th><th className="px-10 py-6">Identity Node</th><th className="px-10 py-6">Product</th><th className="px-10 py-6 text-right">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {data.orders.map(o => (
                   <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-10 py-6 font-mono font-black text-unicou-navy text-xs">{o.id}</td>
                      <td className="px-10 py-6">
                         <div className="font-black uppercase text-xs text-slate-900">{o.buyerName}</div>
                         <div className="text-[10px] text-slate-400 font-mono italic">{o.customerEmail}</div>
                      </td>
                      <td className="px-10 py-6 font-bold text-slate-600 text-xs uppercase">{o.productName} (x{o.quantity})</td>
                      <td className="px-10 py-6 text-right">
                         {o.status === 'Pending' ? (
                           <button onClick={() => api.fulfillOrder(o.id).then(fetchData)} className="px-6 py-2 bg-unicou-navy text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-unicou-orange transition-all">Verify & Dispatch</button>
                         ) : (
                           <span className="px-4 py-1.5 bg-slate-100 text-emerald-600 rounded-full text-[8px] font-black uppercase border border-slate-200">Dispatched Node</span>
                         )}
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}

      {activeTab === 'agents' && (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in duration-500">
           <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                   <th className="px-10 py-5">Agency Profile</th><th className="px-10 py-5">Verified Email</th><th className="px-10 py-5">Status</th><th className="px-10 py-5 text-right">Verification (Req 14.b)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {data.leads.filter(l => l.type === 'agent').map(l => (
                   <tr key={l.id}>
                      <td className="px-10 py-6 font-black uppercase text-xs text-slate-900">{l.data.agency_name}</td>
                      <td className="px-10 py-6 font-bold text-slate-500 text-xs italic">{l.data.email}</td>
                      <td className="px-10 py-6"><span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${l.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>{l.status}</span></td>
                      <td className="px-10 py-6 text-right">
                         {l.status !== 'Approved' && <button onClick={() => api.verifyAgent(l.id).then(fetchData)} className="px-5 py-2 bg-unicou-orange text-white rounded-lg text-[8px] font-black uppercase tracking-widest shadow-action hover:bg-black transition-all">Authorize Agent Node</button>}
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
