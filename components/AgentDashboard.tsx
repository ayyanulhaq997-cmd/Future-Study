
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
  const totalCodes = orders.reduce((acc, o) => acc + o.quantity, 0);

  const handleQtyChange = (pid: string, val: string) => {
    const num = parseInt(val) || 1;
    const capped = Math.max(1, Math.min(3, num)); // Restricted order limit 3
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
          <button onClick={() => setActiveTab('inventory')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-white text-unicou-navy shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>Voucher Vault</button>
          <button onClick={() => setActiveTab('leads')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'bg-white text-unicou-navy shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>Registry Node</button>
          <button onClick={() => setActiveTab('white-label')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'white-label' ? 'bg-white text-unicou-navy shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>White-label Hub</button>
        </div>
      </div>

      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {products.map(p => {
                const finalPrice = p.basePrice * 0.9;
                const qty = purchaseQuantities[p.id] || 1;
                return (
                  <div key={p.id} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 hover:border-unicou-orange/20 transition-all group shadow-xl relative">
                    <div className="mb-8">
                      <span className="text-[9px] font-black text-unicou-orange uppercase tracking-widest mb-2 block">{p.category} NODE</span>
                      <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight leading-none">{p.name}</h3>
                    </div>
                    <div className="flex items-baseline gap-2 mb-10">
                       <span className="text-4xl font-display font-black text-slate-950 tracking-tighter">${finalPrice.toFixed(0)}</span>
                       <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">per unit (Limited 3)</span>
                    </div>
                    <div className="space-y-4">
                      <input 
                        type="number" min="1" max="3" value={qty} 
                        onChange={(e) => handleQtyChange(p.id, e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-lg font-bold text-unicou-navy outline-none"
                      />
                      <button 
                        onClick={() => onBuy(p.id, qty)}
                        className="w-full bg-unicou-navy hover:bg-slate-950 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg active:scale-95"
                      >INITIALIZE PURCHASE</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="lg:col-span-4 space-y-8">
             <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl border-l-4 border-unicou-orange">
                <h4 className="text-xs font-black uppercase tracking-widest mb-4">Membership Restriction</h4>
                <p className="text-slate-400 text-sm leading-relaxed italic">
                  "Daily Quota: Bank (5), Card (3). Limits enforced for security synchronization. Contact Support for bypass."
                </p>
             </div>
             <div className="bg-unicou-navy p-10 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Total Procurement Value</p>
                <p className="text-5xl font-display font-black tracking-tighter">${totalSpent.toLocaleString()}</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
