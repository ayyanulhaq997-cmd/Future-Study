
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

  const handleQtyChange = (pid: string, val: string) => {
    const num = parseInt(val) || 1;
    setPurchaseQuantities(prev => ({ ...prev, [pid]: num }));
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
             <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-100">Verified Status</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-black tracking-tighter text-slate-900 uppercase leading-none">
            Partner <span className="text-unicou-orange">Portal</span>
          </h1>
          <p className="text-slate-600 mt-6 font-bold italic text-lg leading-relaxed max-w-3xl border-l-4 border-unicou-orange pl-6">
            Welcome {user.name}! Your UniCou partner dashboard is ready. Continue supporting students with study abroad, IELTS/PTE/TOEFL vouchers, and training solutions.
          </p>
        </div>

        <div className="flex flex-wrap bg-slate-50 p-2 rounded-[2rem] border border-slate-200 shadow-inner">
          <button onClick={() => setActiveTab('inventory')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-white text-unicou-navy shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>Voucher Vault</button>
          <button onClick={() => setActiveTab('leads')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'bg-white text-unicou-navy shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>Registry Node</button>
          <button onClick={() => setActiveTab('white-label')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'white-label' ? 'bg-white text-unicou-navy shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>White-label Hub</button>
        </div>
      </div>

      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map(p => {
                const discountAmount = p.basePrice * (user.tier ? user.tier * 0.05 : 0.1);
                const finalPrice = p.basePrice - discountAmount;
                const qty = purchaseQuantities[p.id] || 1;
                const totalSettlement = finalPrice * qty;

                return (
                  <div key={p.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-unicou-orange/20 transition-all group shadow-xl relative flex flex-col">
                    <div className="mb-6">
                      <span className="text-[9px] font-black text-unicou-orange uppercase tracking-widest mb-1 block">{p.category} NODE</span>
                      <h3 className="text-xl font-display font-black text-slate-900 tracking-tight leading-none">{p.name}</h3>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 space-y-2">
                       <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
                          <span>Official Rate:</span>
                          <span className="line-through">${p.basePrice.toFixed(2)}</span>
                       </div>
                       <div className="flex justify-between text-[9px] font-black uppercase text-emerald-600">
                          <span>Partner Tier Discount:</span>
                          <span>-${discountAmount.toFixed(2)}</span>
                       </div>
                       <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                          <span className="text-[10px] font-black text-unicou-navy uppercase">Net Price:</span>
                          <span className="text-2xl font-display font-black text-unicou-navy">${finalPrice.toFixed(2)}</span>
                       </div>
                    </div>

                    <div className="space-y-4 mt-auto">
                      <div>
                        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Procurement Quantity</label>
                        <input 
                          type="number" min="1" value={qty} 
                          onChange={(e) => handleQtyChange(p.id, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-lg font-bold text-unicou-navy outline-none focus:border-unicou-navy shadow-inner"
                        />
                      </div>
                      
                      <div className="flex justify-between items-center px-1 mb-2">
                         <span className="text-[9px] font-black text-slate-500 uppercase">Est. Settlement:</span>
                         <span className="text-sm font-black text-unicou-navy">${totalSettlement.toFixed(2)}</span>
                      </div>

                      <button 
                        onClick={() => onBuy(p.id, qty)}
                        className="w-full bg-unicou-navy hover:bg-slate-950 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                      >PROCURE VOUCHERS</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="lg:col-span-4 space-y-8">
             <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl border-l-4 border-unicou-orange">
                <h4 className="text-xs font-black uppercase tracking-widest mb-4">Partner Logic</h4>
                <p className="text-slate-400 text-sm leading-relaxed italic">
                  "Your partner node is authorized for direct procurement. Orders are limited to 3 units for card and 10 units for bank transfers. Contact support for bulk node overrides."
                </p>
             </div>
             <div className="bg-unicou-navy p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Lifetime Procurement Value</p>
                <p className="text-5xl font-display font-black tracking-tighter">${totalSpent.toLocaleString()}</p>
                <div className="mt-6 pt-6 border-t border-white/10">
                   <p className="text-[9px] font-black text-unicou-vibrant uppercase tracking-widest">Support: connect@unicou.uk</p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
