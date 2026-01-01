
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/apiService';
import { Product, VoucherCode, Order, User, Lead, SecurityStatus } from '../types';

type AdminTab = 'shield' | 'agents' | 'orders' | 'inventory' | 'products';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('shield');
  const [loading, setLoading] = useState(true);
  const [security, setSecurity] = useState<SecurityStatus>(api.getSecurityState());
  const [data, setData] = useState<{
    products: Product[],
    codes: VoucherCode[],
    orders: Order[],
    users: User[],
    leads: Lead[]
  }>({ products: [], codes: [], orders: [], users: [], leads: [] });

  const [newProd, setNewProd] = useState<Partial<Product>>({ name: '', category: 'PTE', basePrice: 150, currency: 'USD', type: 'Voucher' });

  const fetchData = async () => {
    try {
      const [p, c, o, u, le] = await Promise.all([
        api.getProducts(), api.getCodes(), api.getOrders(), api.getUsers(), api.getLeads()
      ]);
      setData({ products: p, codes: c, orders: o, users: u, leads: le });
      setSecurity(api.getSecurityState());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleShieldToggle = (stop: boolean) => {
    api.setGlobalStop(stop);
    fetchData();
  };

  const handleVerifyAgent = async (leadId: string) => {
    if (confirm("Authorize this Agency Partner? This will create a legal agreement record and grant procurement nodes.")) {
      await api.verifyAgent(leadId);
      alert("Agency Verified and Node Authorized.");
      fetchData();
    }
  };

  const handleAddVoucherType = async () => {
    if (!newProd.name) return;
    await api.addProduct({
      ...newProd as Product,
      id: `v-${Math.random().toString(36).substr(2, 5)}`,
      description: 'Official Institutional Voucher.',
      icon: '🎫',
      pricingModel: 'Global'
    });
    alert("New Voucher Node Injected Successfully.");
    setNewProd({ name: '', category: 'PTE', basePrice: 150, currency: 'USD', type: 'Voucher' });
    fetchData();
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase text-[11px] tracking-[0.4em]">Establishing Institutional Control...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-16">
        <div>
           <h1 className="text-4xl font-display font-black text-slate-900 uppercase">Operation <span className="text-unicou-orange">Manager</span></h1>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Authority Node Status: CONNECTED</p>
        </div>
        <div className="flex bg-slate-50 p-2 rounded-[2rem] border border-slate-200 shadow-inner">
           {['shield', 'agents', 'orders', 'inventory', 'products'].map(tab => (
             <button key={tab} onClick={() => setActiveTab(tab as AdminTab)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-unicou-navy shadow-lg' : 'text-slate-400'}`}>
               {tab}
             </button>
           ))}
        </div>
      </div>

      {activeTab === 'shield' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           <div className="bg-slate-900 p-16 rounded-[4rem] text-white shadow-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-16 opacity-5 font-display font-black text-[12rem] select-none pointer-events-none uppercase">SHIELD</div>
              <h2 className="text-3xl font-display font-black mb-8 uppercase tracking-tighter">Global Kill-Switch</h2>
              <p className="text-slate-400 mb-12 font-bold italic text-lg leading-relaxed">"Emergency override to halt all procurement cycles immediately if abnormal system behavior is observed."</p>
              
              <div className="flex items-center justify-between p-10 bg-white/5 border border-white/10 rounded-[2.5rem]">
                 <div>
                   <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Current State</p>
                   <p className={`text-2xl font-black ${security.isGlobalOrderStop ? 'text-red-500' : 'text-emerald-500'}`}>
                     {security.isGlobalOrderStop ? 'SYSTEM HALTED' : 'OPERATIONAL'}
                   </p>
                 </div>
                 <button 
                  onClick={() => handleShieldToggle(!security.isGlobalOrderStop)}
                  className={`px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-2xl active:scale-95 ${security.isGlobalOrderStop ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500 shadow-red-500/20'}`}
                 >
                   {security.isGlobalOrderStop ? 'RESTORE SYSTEM' : 'TRIGGER STOP'}
                 </button>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="max-w-3xl mx-auto bg-white p-12 md:p-16 rounded-[4.5rem] border border-slate-200 shadow-3xl">
           <h2 className="text-3xl font-display font-black mb-10 text-slate-950 uppercase tracking-tighter">Inject New <span className="text-unicou-orange">Voucher Node</span></h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Product Identity (Name)</label>
                 <input className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 font-bold outline-none focus:border-unicou-orange" value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})} placeholder="e.g. GRE General Voucher" />
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Exam Category</label>
                 <select className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 font-bold outline-none" value={newProd.category} onChange={e => setNewProd({...newProd, category: e.target.value})}>
                    <option>PTE</option><option>IELTS</option><option>TOEFL</option><option>GRE</option><option>LanguageCert</option>
                 </select>
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Settlement Price (USD)</label>
                 <input type="number" className="w-full p-5 bg-slate-50 rounded-2xl border border-slate-200 font-bold outline-none" value={newProd.basePrice} onChange={e => setNewProd({...newProd, basePrice: Number(e.target.value)})} />
              </div>
           </div>
           <button onClick={handleAddVoucherType} className="w-full py-6 bg-unicou-navy text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl hover:bg-slate-900 transition-all active:scale-95">PUBLISH VOUCHER TYPE</button>
        </div>
      )}

      {activeTab === 'agents' && (
        <div className="bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-2xl min-h-[600px]">
           <div className="p-10 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Partner Verification Hub</h3>
              <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">Pending Applications</span>
           </div>
           <div className="divide-y divide-slate-50">
             {data.leads.filter(l => l.type === 'agent').map(l => (
               <div key={l.id} className="p-10 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-slate-50 transition-colors group">
                  <div className="mb-6 md:mb-0">
                    <h4 className="text-2xl font-display font-black text-slate-900 uppercase group-hover:text-unicou-navy transition-colors">{l.data.agency_name}</h4>
                    <p className="text-xs text-slate-500 font-bold italic mt-1">{l.data.email} • {l.data.whatsapp}</p>
                    <div className="mt-4 flex gap-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                       <span className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-300 rounded-full"/> Reg: {l.data.reg_no}</span>
                       <span className="flex items-center gap-2"><div className="w-1 h-1 bg-slate-300 rounded-full"/> Intake: {l.data.student_flow}/yr</span>
                       <span className={`px-2 py-0.5 rounded border ${l.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>{l.status}</span>
                    </div>
                  </div>
                  {l.status !== 'Approved' && (
                    <div className="flex gap-3">
                       <button onClick={() => handleVerifyAgent(l.id)} className="px-8 py-4 bg-unicou-navy text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-900 transition-all active:scale-95">Authorize Agency</button>
                       <button className="px-8 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all">Archive</button>
                    </div>
                  )}
               </div>
             ))}
             {data.leads.filter(l => l.type === 'agent').length === 0 && (
               <div className="py-40 text-center italic text-slate-300 font-black uppercase tracking-widest">No pending agency applications in registry.</div>
             )}
           </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
           <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b tracking-widest">
                  <th className="px-10 py-6">Order ID</th><th className="px-10 py-6">Buyer Identity</th><th className="px-10 py-6">Voucher Node</th><th className="px-10 py-6 text-right">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {data.orders.map(o => (
                   <tr key={o.id} className="hover:bg-slate-50 group transition-colors">
                      <td className="px-10 py-6 font-mono font-black text-unicou-navy text-xs">{o.id}</td>
                      <td className="px-10 py-6">
                         <div className="font-black uppercase text-xs text-slate-900">{o.buyerName}</div>
                         <div className="text-[10px] text-slate-400 font-mono italic">{o.customerEmail}</div>
                      </td>
                      <td className="px-10 py-6 font-bold text-slate-500 text-xs uppercase">{o.productName} (x{o.quantity})</td>
                      <td className="px-10 py-6 text-right">
                         <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${o.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>{o.status}</span>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 border-b tracking-widest">
                    <th className="px-10 py-6">Voucher Identity</th><th className="px-10 py-6 text-center">Available Nodes</th><th className="px-10 py-6 text-center">Settlements</th><th className="px-10 py-6 text-right">Observation</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {data.products.filter(p => p.type === 'Voucher').map(p => {
                    const stock = data.codes.filter(c => c.productId === p.id && c.status === 'Available').length;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50">
                         <td className="px-10 py-6 font-black text-slate-950 uppercase text-xs">{p.name}</td>
                         <td className="px-10 py-6 text-center font-mono font-black text-unicou-navy text-xl">{stock}</td>
                         <td className="px-10 py-6 text-center font-mono font-bold text-slate-400">{data.codes.filter(c => c.productId === p.id && c.status === 'Used').length}</td>
                         <td className="px-10 py-6 text-right">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${stock < 5 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                              {stock < 5 ? 'LOW VAULT STOCK' : 'OPTIMIZED'}
                            </span>
                         </td>
                      </tr>
                    );
                 })}
              </tbody>
           </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
