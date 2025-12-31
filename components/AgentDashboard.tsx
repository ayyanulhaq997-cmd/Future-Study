import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Product, Order, User, Lead } from '../types';

const AgentDashboard: React.FC<{ user: User; onBuy: (pid: string, qty: number) => void }> = ({ user, onBuy }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inventory' | 'leads' | 'white-label'>('inventory');
  const [purchaseQuantities, setPurchaseQuantities] = useState<Record<string, number>>({});

  const [branding, setBranding] = useState({
    agencyName: user.name,
    primaryColor: '#004a61',
    accentColor: '#f15a24',
    logoStatus: 'Verified',
    domain: 'portal.' + user.name.toLowerCase().replace(/\s/g, '') + '.com'
  });

  useEffect(() => {
    const fetch = async () => {
      const [p, o, le] = await Promise.all([
        api.getProducts(), 
        api.getOrders(),
        api.getLeads()
      ]);
      setProducts(p.filter(x => x.type === 'Voucher'));
      setOrders(o);
      setLeads(le.filter((l: Lead) => l.type === 'student').slice(0, 5)); 
      setLoading(false);
    };
    fetch();
  }, []);

  const totalSpent = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalCodes = orders.reduce((acc, o) => acc + o.quantity, 0);

  const handleQtyChange = (pid: string, val: string) => {
    const num = parseInt(val) || 1;
    const capped = Math.max(1, Math.min(3, num));
    setPurchaseQuantities(prev => ({ ...prev, [pid]: capped }));
  };

  if (loading) return (
    <div className="p-40 text-center animate-pulse">
      <div className="w-16 h-16 border-4 border-unicou-navy/10 border-t-unicou-navy rounded-full animate-spin mx-auto mb-8" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-unicou-navy">Synchronizing Partner Node...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16 border-b border-slate-100 pb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <span className="px-4 py-1.5 bg-unicou-navy text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">Partner Authority Node</span>
             <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-100">Tier {user.tier || 1} Status</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-black tracking-tighter text-slate-900 uppercase leading-none">
            Agent/Training Center <span className="text-unicou-orange">Portal</span>
          </h1>
          <p className="text-slate-500 mt-6 font-bold italic text-lg leading-relaxed max-w-3xl">
            Welcome {user.name}! Your UniCou partner dashboard is ready. Continue supporting students with study abroad, IELTS/PTE/TOEFL vouchers, and training solutions.
          </p>
        </div>

        <div className="flex flex-wrap bg-slate-50 p-2 rounded-[2rem] border border-slate-200 shadow-inner">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-white text-unicou-navy shadow-lg border border-slate-200' : 'text-slate-400 hover:text-slate-900'}`}
          >Voucher Vault</button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'bg-white text-unicou-navy shadow-lg border border-slate-200' : 'text-slate-400 hover:text-slate-900'}`}
          >Registry Node</button>
          <button 
            onClick={() => setActiveTab('white-label')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'white-label' ? 'bg-white text-unicou-navy shadow-lg border border-slate-200' : 'text-slate-400 hover:text-slate-900'}`}
          >White-label Hub</button>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Inventory Procurement</h2>
                <span className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full">Membership Restrictions Active</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {products.map(p => {
                  const agentDiscount = (user.tier || 1) * 2;
                  const finalPrice = p.basePrice * (1 - agentDiscount/100);
                  const qty = purchaseQuantities[p.id] || 1;
                  
                  return (
                    <div key={p.id} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 hover:border-unicou-orange/20 transition-all group shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[3rem] flex items-center justify-center opacity-30 group-hover:opacity-100 transition-opacity">
                         <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{p.icon}</span>
                      </div>

                      <div className="mb-8">
                        <span className="text-[9px] font-black text-unicou-orange uppercase tracking-widest mb-2 block">{p.category} NODE</span>
                        <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight leading-none group-hover:text-unicou-navy transition-colors">{p.name}</h3>
                      </div>

                      <div className="flex items-baseline gap-2 mb-10">
                         <span className="text-4xl font-display font-black text-slate-950 tracking-tighter">${finalPrice.toFixed(0)}</span>
                         <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">per unit / {agentDiscount}% OFF</span>
                      </div>

                      <div className="space-y-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantity (Order Limit: 3)</label>
                          <input 
                            type="number" min="1" max="3" 
                            value={qty} 
                            onChange={(e) => handleQtyChange(p.id, e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-lg font-bold text-unicou-navy outline-none focus:border-unicou-orange shadow-inner"
                          />
                        </div>
                        <button 
                          onClick={() => onBuy(p.id, qty)}
                          className="w-full bg-unicou-navy hover:bg-slate-950 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3"
                        >
                          INITIALIZE PURCHASE
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="bg-unicou-navy p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-unicou-vibrant opacity-10 rounded-full blur-3xl" />
                <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-unicou-vibrant">Settlement Metrics</h4>
                <div className="space-y-10">
                   <div>
                     <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Total Procurement Value</p>
                     <p className="text-5xl font-display font-black tracking-tighter">${totalSpent.toLocaleString()}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Active Vouchers in Vault</p>
                     <p className="text-5xl font-display font-black tracking-tighter">{totalCodes}</p>
                   </div>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl">
                 <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 border-b border-slate-100 pb-4">Transaction Stream</h4>
                 <div className="space-y-6">
                    {orders.slice(0, 3).map(o => (
                      <div key={o.id} className="flex justify-between items-center group">
                        <div>
                          <p className="text-[10px] font-mono font-bold text-unicou-navy">{o.id}</p>
                          <p className="text-[11px] font-bold text-slate-500 uppercase">{o.quantity}x Units Procured</p>
                        </div>
                        <span className="text-sm font-black text-emerald-600">${o.totalAmount}</span>
                      </div>
                    ))}
                    {orders.length === 0 && <p className="text-[10px] font-bold text-slate-400 uppercase italic">No recent transactions.</p>}
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden">
            <div className="p-12 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-3xl font-display font-black text-slate-900 tracking-tighter uppercase">Student Registry Node</h2>
                <p className="text-slate-500 mt-2 font-bold uppercase text-[10px] tracking-widest">Global CRM for {user.name} Recruitment Stream</p>
              </div>
              <button onClick={() => alert('Opening Lead Intake Node...')} className="px-8 py-4 bg-unicou-orange text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Manual Registration</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] border-b border-slate-100">
                  <tr>
                    <th className="px-12 py-8">Candidate Profile</th>
                    <th className="px-12 py-8">Target Strategic mapping</th>
                    <th className="px-12 py-8">Status</th>
                    <th className="px-12 py-8 text-right">Operational Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-all group">
                      <td className="px-12 py-8">
                        <div className="font-black text-slate-900 uppercase tracking-tight text-lg">{lead.data.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono italic">{lead.data.email}</div>
                      </td>
                      <td className="px-12 py-8">
                        <div className="text-[11px] font-black text-unicou-navy uppercase">{lead.data.destination || 'UK'} • Intake 2025</div>
                        <div className="text-[10px] text-slate-400 font-bold italic truncate max-w-xs">{lead.data.course || 'Admissions Protocol'}</div>
                      </td>
                      <td className="px-12 py-8">
                        <span className="px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-orange-100">In-Progress</span>
                      </td>
                      <td className="px-12 py-8 text-right">
                         <button className="text-[10px] font-black text-unicou-navy uppercase tracking-widest hover:text-unicou-orange transition-colors">Open Record →</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'white-label' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
             <div className="lg:col-span-7">
                <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl space-y-12">
                   <div>
                      <h2 className="text-3xl font-display font-black text-slate-900 tracking-tighter uppercase">Branding & Virtual Terminal</h2>
                      <p className="text-slate-500 mt-2 font-bold italic leading-relaxed">Customize the Study Hub interface for your regional students. Changes mirror to your unique sub-domain node.</p>
                   </div>

                   <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Agency Brand Identity (Logo)</label>
                            <div className="h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center group hover:bg-white hover:border-unicou-navy transition-all cursor-pointer">
                               <span className="text-3xl mb-2 opacity-30 group-hover:scale-110 transition-transform">🖼️</span>
                               <p className="text-[10px] font-black text-slate-400 uppercase group-hover:text-unicou-navy">Sync Logo Node</p>
                            </div>
                         </div>
                         <div className="space-y-6">
                            <div>
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-3">Primary Theme Color</label>
                               <div className="flex items-center gap-4">
                                  <input type="color" value={branding.primaryColor} onChange={(e) => setBranding({...branding, primaryColor: e.target.value})} className="w-14 h-14 rounded-2xl cursor-pointer border-none" />
                                  <span className="font-mono text-xs font-bold text-slate-500">{branding.primaryColor.toUpperCase()}</span>
                               </div>
                            </div>
                            <div>
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-3">Accent Node Color</label>
                               <div className="flex items-center gap-4">
                                  <input type="color" value={branding.accentColor} onChange={(e) => setBranding({...branding, accentColor: e.target.value})} className="w-14 h-14 rounded-2xl cursor-pointer border-none" />
                                  <span className="font-mono text-xs font-bold text-slate-500">{branding.accentColor.toUpperCase()}</span>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block mb-3">Authorized Domain Proxy</label>
                         <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center gap-3">
                            <span className="text-slate-400">https://</span>
                            <input type="text" value={branding.domain} readOnly className="bg-transparent font-bold text-unicou-navy outline-none flex-grow" />
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase">SSL Verified</span>
                         </div>
                      </div>

                      <button onClick={() => alert('Mirroring branding to virtual terminal...')} className="w-full py-6 bg-unicou-navy text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-950 transition-all active:scale-95">SYNC BRANDING METADATA</button>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-5 space-y-8">
                <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                   <div className="vibrant-strip mb-8 w-12"></div>
                   <h4 className="text-xl font-display font-black mb-6 uppercase tracking-tighter">Terminal Preview</h4>
                   <div className="aspect-[4/3] bg-white rounded-3xl overflow-hidden border-8 border-slate-800 shadow-inner relative">
                      <div className="h-10 border-b border-slate-100 flex items-center px-4 gap-2">
                         <div className="w-3 h-3 rounded-full bg-slate-100" />
                         <div className="w-12 h-2 rounded-full bg-slate-50" />
                      </div>
                      <div className="p-6">
                         <div className="w-24 h-12 rounded-xl mb-6 flex items-center justify-center border-2 border-slate-50 text-[10px] font-black uppercase text-slate-300" style={{ borderColor: branding.primaryColor + '20' }}>
                            {user.name.split(' ')[0]}
                         </div>
                         <h5 className="text-[11px] font-black uppercase tracking-widest mb-4" style={{ color: branding.primaryColor }}>LMS Entry Portal</h5>
                         <div className="space-y-2">
                            <div className="h-4 w-full bg-slate-50 rounded-lg" />
                            <div className="h-4 w-3/4 bg-slate-50 rounded-lg" />
                            <div className="h-10 w-full rounded-xl mt-6" style={{ backgroundColor: branding.primaryColor }} />
                         </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/20 pointer-events-none" />
                   </div>
                   <p className="text-[10px] text-white/50 font-black uppercase mt-8 tracking-widest text-center italic">"This interface is what your local students will interact with."</p>
                </div>

                <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl group">
                   <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">LMS License Protocol</h4>
                   <p className="text-slate-500 text-sm font-bold leading-relaxed mb-8 italic">"Your agency has active authorization to provide PTE/IELTS training nodes to up to 500 concurrent users."</p>
                   <div className="flex items-center gap-4">
                      <div className="flex-grow h-2 bg-slate-50 rounded-full overflow-hidden shadow-inner">
                         <div className="h-full bg-unicou-orange w-1/4" />
                      </div>
                      <span className="text-[10px] font-black text-unicou-navy uppercase">125 / 500 Slots</span>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;