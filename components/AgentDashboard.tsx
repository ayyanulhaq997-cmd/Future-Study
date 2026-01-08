
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Product, Order, User } from '../types';
import { EXAM_LOGOS } from '../constants/assets';

const AgentDashboard: React.FC<{ user: User; onBuy: (pid: string, qty: number) => void }> = ({ user, onBuy }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'vault' | 'registry'>('vault');
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

  const totalSpent = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

  const handleQtyChange = (pid: string, val: string) => {
    const num = Math.max(1, Math.min(20, parseInt(val) || 1));
    setQuantities(prev => ({ ...prev, [pid]: num }));
  };

  const getBrandLogo = (category: string) => {
    const upperCat = category.toUpperCase();
    return EXAM_LOGOS[upperCat] || EXAM_LOGOS[category] || EXAM_LOGOS['OTHER'];
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-unicou-navy font-black uppercase tracking-widest text-[10px]">Syncing Hub...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="px-2 py-0.5 bg-unicou-navy text-white text-[7px] font-black uppercase rounded">PARTNER NODE</span>
             <span className="px-2 py-0.5 bg-unicou-ice text-unicou-navy border border-slate-200 text-[7px] font-black uppercase rounded flex items-center gap-1.5">
               <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
               LOCKED IDENTITY (Req 13): {user.email}
             </span>
          </div>
          <h1 className="text-3xl font-display font-black tracking-tight text-slate-900 uppercase">
            AGENT <span className="text-unicou-orange">PORTAL</span>
          </h1>
          <p className="text-slate-600 font-bold italic text-lg mt-2 max-w-3xl">
            "Your UniCou partner dashboard is ready. All settlements are verified against your immutable registration node."
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex bg-unicou-ice p-1 rounded-xl border border-slate-100 shadow-inner">
            {['vault', 'registry'].map(t => (
              <button 
                key={t}
                onClick={() => setActiveTab(t as any)} 
                className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white text-unicou-navy shadow-sm border border-slate-200' : 'text-slate-400'}`}
              >
                {t === 'vault' ? 'Voucher Warehouse' : 'Lead Registry'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'vault' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map(p => {
                const tierDiscountRate = user.tier ? user.tier * 0.05 : 0.1;
                const discountAmount = p.basePrice * tierDiscountRate;
                const netPrice = p.basePrice - discountAmount;
                const qty = quantities[p.id] || 1;
                const logoSrc = getBrandLogo(p.category);

                return (
                  <div key={p.id} className="bg-white p-7 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col group transition-all hover:border-unicou-navy relative overflow-hidden">
                    {/* BRAND LOGO INTEGRATION */}
                    <div className="h-24 flex items-center justify-center mb-6 bg-slate-50 rounded-2xl p-4 border border-slate-100/50">
                      <img 
                        src={logoSrc} 
                        alt={p.category} 
                        className="h-full w-auto object-contain transition-transform group-hover:scale-105" 
                        onError={(e) => { (e.target as HTMLImageElement).src = EXAM_LOGOS['OTHER']; }}
                      />
                    </div>

                    <p className="text-[8px] font-black text-unicou-orange uppercase tracking-widest mb-2 text-center">{p.category} NODE</p>
                    <h3 className="text-xl font-display font-black text-slate-950 leading-tight uppercase mb-8 group-hover:text-unicou-navy transition-colors text-center line-clamp-1">{p.name}</h3>

                    <div className="bg-[#f8fafc] p-6 rounded-[1.8rem] border border-slate-100 mb-8 shadow-inner">
                       <div className="flex justify-between items-center mb-1">
                          <span className="text-[9px] font-black text-[#64748b] uppercase tracking-widest">Official Rate:</span>
                          <span className="text-sm font-bold text-[#64748b] line-through">${p.basePrice.toFixed(2)}</span>
                       </div>
                       <div className="flex justify-between items-center mb-3">
                          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">Exclusive Exam Discounts:</span>
                          <span className="text-xs font-black text-emerald-600">-${discountAmount.toFixed(2)}</span>
                       </div>
                       <div className="h-px bg-slate-200 mb-4" />
                       <div className="flex justify-between items-end">
                          <span className="text-[10px] font-black text-[#004a61] uppercase tracking-widest mb-1">Exclusive Discounted Price:</span>
                          <span className="text-3xl font-display font-black text-[#004a61] tracking-tighter leading-none">${netPrice.toFixed(2)}</span>
                       </div>
                    </div>

                    <div className="space-y-4 mt-auto">
                       <div className="flex items-center justify-between px-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Quantity Node:</label>
                          <input 
                            type="number" min="1" max="50" value={qty} 
                            onChange={(e) => handleQtyChange(p.id, e.target.value)}
                            className="w-16 bg-white border border-slate-200 rounded-xl p-2 text-sm font-mono font-black text-[#004a61] outline-none focus:border-unicou-navy shadow-inner text-center"
                          />
                       </div>
                       <button 
                        onClick={() => onBuy(p.id, qty)}
                        className="w-full py-5 bg-[#004a61] text-white rounded-[1.2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95"
                      >
                        PROCURE VOUCHERS
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
             <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 font-display font-black text-9xl">P</div>
                <h4 className="text-[9px] font-black uppercase tracking-[0.3em] mb-4 text-slate-500">Security Node</h4>
                <p className="text-sm font-bold italic leading-relaxed text-slate-300 relative z-10">
                  "Your Partner Email is a verified procurement node. Identity parameters are locked."
                </p>
             </div>

             <div className="bg-unicou-navy p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
                <p className="text-[9px] font-black text-unicou-orange uppercase tracking-[0.4em] mb-2">Lifetime Portfolio</p>
                <p className="text-5xl font-display font-black tracking-tighter leading-none">${totalSpent.toLocaleString()}</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
