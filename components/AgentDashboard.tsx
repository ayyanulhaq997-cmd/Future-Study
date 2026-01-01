
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
    const num = Math.max(1, Math.min(10, parseInt(val) || 1));
    setQuantities(prev => ({ ...prev, [pid]: num }));
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-unicou-navy font-black uppercase tracking-widest text-[10px]">Syncing Hub...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <span className="px-2 py-0.5 bg-unicou-navy text-white text-[7px] font-black uppercase rounded">PARTNER NODE</span>
             <span className="px-2 py-0.5 bg-unicou-ice text-unicou-navy border border-slate-200 text-[7px] font-black uppercase rounded">VERIFIED</span>
          </div>
          <h1 className="text-3xl font-display font-black tracking-tight text-slate-900 uppercase">
            PARTNER <span className="text-unicou-orange">PORTAL</span>
          </h1>
          <p className="text-slate-500 font-bold italic text-sm mt-1">Authorized Node: {user.name}</p>
        </div>

        <div className="flex bg-unicou-ice p-1 rounded-xl border border-slate-100 shadow-inner">
          {['vault', 'registry', 'white-label'].map(t => (
            <button 
              key={t}
              onClick={() => setActiveTab(t as any)} 
              className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white text-unicou-navy shadow-sm' : 'text-slate-400'}`}
            >
              {t === 'vault' ? 'Vouchers' : t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'vault' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {products.map(p => {
                const tierDiscountRate = user.tier ? user.tier * 0.05 : 0.1;
                const discountAmount = p.basePrice * tierDiscountRate;
                const netPrice = p.basePrice - discountAmount;
                const qty = quantities[p.id] || 1;
                const totalSettlement = netPrice * qty;

                return (
                  <div key={p.id} className="bg-white p-6 rounded-[2rem] shadow-lg border border-slate-100 flex flex-col group transition-all hover:border-unicou-orange/20">
                    <p className="text-[8px] font-black text-unicou-orange uppercase tracking-widest mb-1">{p.category} NODE</p>
                    <h3 className="text-lg font-display font-black text-slate-900 leading-tight uppercase mb-4">{p.name}</h3>

                    <div className="bg-unicou-ice p-4 rounded-2xl border border-slate-200 mb-4">
                       <div className="flex justify-between items-center mb-1">
                          <span className="text-[8px] font-black text-slate-400 uppercase">Rate:</span>
                          <span className="text-[10px] font-bold text-slate-400 line-through">${p.basePrice.toFixed(2)}</span>
                       </div>
                       <div className="flex justify-between items-center mb-3">
                          <span className="text-[8px] font-black text-unicou-orange uppercase">Discount:</span>
                          <span className="text-[10px] font-bold text-unicou-orange">-${discountAmount.toFixed(2)}</span>
                       </div>
                       <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                          <span className="text-[9px] font-black text-unicou-navy uppercase">Net:</span>
                          <span className="text-xl font-display font-black text-unicou-navy leading-none">${netPrice.toFixed(2)}</span>
                       </div>
                    </div>

                    <div className="space-y-3 mt-auto">
                       <div className="flex items-center gap-3">
                          <label className="shrink-0 text-[8px] font-black text-slate-400 uppercase">QTY:</label>
                          <input 
                            type="number" min="1" max="10" value={qty} 
                            onChange={(e) => handleQtyChange(p.id, e.target.value)}
                            className="w-full bg-unicou-ice border border-slate-200 rounded-lg p-2 text-sm font-black text-unicou-navy outline-none focus:border-unicou-navy shadow-inner text-center"
                          />
                       </div>
                       <div className="flex justify-between items-center px-1">
                          <span className="text-[8px] font-black text-slate-400 uppercase">Settlement:</span>
                          <span className="text-sm font-display font-black text-unicou-navy">${totalSettlement.toFixed(2)}</span>
                       </div>
                       <button 
                        onClick={() => onBuy(p.id, qty)}
                        className="w-full py-3 bg-unicou-navy text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-md hover:bg-slate-950 transition-all active:scale-95"
                      >
                        Procure Vouchers
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
             <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl">
                <h4 className="text-[8px] font-black uppercase tracking-[0.2em] mb-3 text-slate-500">PARTNER LOGIC</h4>
                <p className="text-sm font-bold italic leading-relaxed text-slate-300">
                  "Your partner node is authorized for direct procurement. Orders limited to 10 units for bank transfers."
                </p>
             </div>

             <div className="bg-unicou-navy p-8 rounded-[2rem] shadow-xl text-white">
                <p className="text-[8px] font-black text-unicou-orange uppercase tracking-[0.3em] mb-1">LIFETIME PROCUREMENT</p>
                <p className="text-4xl font-display font-black tracking-tighter">${totalSpent.toLocaleString()}</p>
                <div className="mt-6 pt-4 border-t border-white/10">
                   <a href="mailto:connect@unicou.uk" className="text-[8px] font-black text-white hover:text-unicou-orange uppercase tracking-widest flex items-center gap-2">
                     Support: Connect@unicou.uk
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
