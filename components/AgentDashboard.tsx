
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Product, Order, User } from '../types';

const AgentDashboard: React.FC<{ user: User; onBuy: (pid: string, qty: number) => void }> = ({ user, onBuy }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'vault' | 'registry' | 'white-label'>('vault');
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetch = async () => {
      const [p, o] = await Promise.all([api.getProducts(), api.getOrders()]);
      setProducts(p.filter(x => x.type === 'Voucher'));
      setOrders(o);
      setLoading(false);
    };
    fetch();
  }, []);

  const totalSpent = orders.reduce((acc, o) => acc + o.totalAmount, 0);

  const handleQtyChange = (pid: string, val: string) => {
    const num = Math.max(1, parseInt(val) || 1);
    setQuantities(prev => ({ ...prev, [pid]: num }));
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase tracking-widest text-[11px]">Synchronizing Partner Hub...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-white min-h-screen">
      {/* 1 & 2: Corrected Header Badges and Title Accents */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-16 relative">
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-6">
             <span className="px-4 py-1.5 bg-unicou-navy text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-md shadow-lg">PARTNER AUTHORITY NODE</span>
             <span className="px-4 py-1.5 bg-unicou-emerald/10 text-unicou-emerald border border-unicou-emerald/20 text-[9px] font-black uppercase tracking-[0.2em] rounded-md">VERIFIED STATUS</span>
          </div>
          <div className="relative inline-block mb-8">
            <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-slate-900 uppercase leading-none">
              PARTNER <span className="text-unicou-orange">PORTAL</span>
            </h1>
            <div className="absolute -bottom-4 left-0 w-1/3 h-2 bg-unicou-orange rounded-full" />
          </div>
          <p className="text-slate-500 mt-6 font-bold italic text-lg leading-relaxed max-w-2xl border-l-4 border-unicou-orange pl-8">
            "Welcome {user.name}! Your UniCou partner dashboard is ready. Continue supporting students with study abroad, IELTS/PTE/TOEFL vouchers, and training solutions."
          </p>
        </div>

        {/* 6: Corrected Pill Tab Navigation Style */}
        <div className="shrink-0">
          <div className="flex flex-col bg-slate-50 p-2 rounded-[2rem] border border-slate-100 shadow-inner w-64">
            <button onClick={() => setActiveTab('vault')} className={`px-8 py-3 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all text-left ${activeTab === 'vault' ? 'bg-white text-unicou-navy shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>VOUCHER VAULT</button>
            <button onClick={() => setActiveTab('registry')} className={`px-8 py-3 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all text-left ${activeTab === 'registry' ? 'bg-white text-unicou-navy shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>REGISTRY NODE</button>
            <button onClick={() => setActiveTab('white-label')} className={`px-8 py-3 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all text-left ${activeTab === 'white-label' ? 'bg-white text-unicou-navy shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>WHITE-LABEL HUB</button>
          </div>
        </div>
      </div>

      {activeTab === 'vault' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {products.map(p => {
                const tierDiscountRate = user.tier ? user.tier * 0.05 : 0.1;
                const discountAmount = p.basePrice * tierDiscountRate;
                const netPrice = p.basePrice - discountAmount;
                const qty = quantities[p.id] || 1;
                const isTooHigh = qty > 10;
                const totalSettlement = netPrice * qty;

                return (
                  <div key={p.id} className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col group transition-all">
                    <p className="text-[10px] font-black text-unicou-orange uppercase tracking-[0.2em] mb-2">{p.category} NODE</p>
                    <h3 className="text-3xl font-display font-black text-unicou-navy tracking-tight leading-none mb-8 uppercase">{p.name}</h3>

                    {/* 3: Corrected Pricing Box with Required Separator Line */}
                    <div className="bg-slate-50/80 rounded-[2.5rem] p-8 border border-slate-100 mb-8">
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OFFICIAL RATE:</span>
                          <span className="text-sm font-bold text-slate-400 line-through tracking-tight">${p.basePrice.toFixed(2)}</span>
                       </div>
                       <div className="flex justify-between items-center mb-6">
                          <span className="text-[10px] font-black text-unicou-emerald uppercase tracking-widest">PARTNER TIER DISCOUNT:</span>
                          <span className="text-sm font-bold text-unicou-emerald tracking-tight">-${discountAmount.toFixed(2)}</span>
                       </div>
                       
                       {/* Required separator line identified in highlight 3 */}
                       <div className="h-[2px] bg-slate-200/60 mb-6" />

                       <div className="flex justify-between items-center">
                          <span className="text-[11px] font-black text-unicou-navy uppercase tracking-widest">NET PRICE:</span>
                          <span className="text-4xl font-display font-black text-unicou-navy tracking-tighter leading-none">${netPrice.toFixed(2)}</span>
                       </div>
                    </div>

                    <div className="space-y-6 mt-auto">
                       <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">PROCUREMENT QUANTITY</label>
                          <input 
                            type="number" min="1" max="10" value={qty} 
                            onChange={(e) => handleQtyChange(p.id, e.target.value)}
                            className={`w-full bg-slate-50 border ${isTooHigh ? 'border-red-500' : 'border-slate-200'} rounded-2xl p-5 text-2xl font-black text-unicou-navy outline-none focus:border-unicou-navy shadow-inner text-center leading-none transition-all`}
                          />
                       </div>
                       
                       <div className="flex justify-between items-center px-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">EST. SETTLEMENT:</span>
                          <span className="text-xl font-display font-black text-unicou-navy tracking-tighter">${totalSettlement.toFixed(2)}</span>
                       </div>

                       <button 
                        onClick={() => onBuy(p.id, qty)}
                        disabled={isTooHigh}
                        className={`w-full py-6 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-3xl transition-all active:scale-95 ${isTooHigh ? 'bg-red-600 text-white' : 'bg-unicou-navy text-white hover:bg-slate-900'}`}
                      >
                        {isTooHigh ? 'LIMIT: 10 UNITS' : 'PROCURE VOUCHERS'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-12">
             <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-3xl relative overflow-hidden group border border-slate-800">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-unicou-orange/10 rounded-full blur-3xl group-hover:bg-unicou-orange/20 transition-all" />
                <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-slate-500">PARTNER LOGIC</h4>
                <p className="text-lg font-bold italic leading-relaxed text-slate-300">
                  "Your partner node is authorized for direct procurement. Orders are limited to 3 units for card and 10 units for bank transfers. Contact support for bulk node overrides."
                </p>
             </div>

             <div className="bg-unicou-navy p-16 rounded-[4rem] shadow-3xl text-white relative overflow-hidden group">
                <p className="text-[11px] font-black text-unicou-vibrant uppercase tracking-[0.4em] mb-3 relative z-10">LIFETIME PROCUREMENT VALUE</p>
                <p className="text-7xl font-display font-black tracking-tighter relative z-10 leading-none">${totalSpent.toLocaleString()}</p>
                
                {/* 4: Corrected Support Link Margin/Padding */}
                <div className="mt-16 pt-10 border-t border-white/10 relative z-10">
                   <a href="mailto:connect@unicou.uk" className="text-[10px] font-black text-unicou-vibrant hover:text-white uppercase tracking-[0.2em] transition-colors flex items-center gap-3">
                     <span className="w-1.5 h-1.5 rounded-full bg-unicou-vibrant animate-pulse" />
                     SUPPORT: CONNECT@UNICOU.UK
                   </a>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
