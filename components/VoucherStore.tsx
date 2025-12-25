import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/apiService';
import { Product } from '../types';

interface VoucherStoreProps {
  onCheckout: (productId: string, quantity: number) => void;
  onBook: (productId: string) => void;
  onNavigateToAgent: () => void;
}

const VoucherStore: React.FC<VoucherStoreProps> = ({ onCheckout, onBook, onNavigateToAgent }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockMap, setStockMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  useEffect(() => {
    const init = async () => {
      try {
        const p = await api.getProducts();
        const filtered = p.filter(x => x.type === 'Voucher');
        setProducts(filtered);
        
        const counts: Record<string, number> = {};
        for (const item of filtered) {
          try {
            counts[item.id] = await api.getStockCount(item.id);
          } catch (e) {
            counts[item.id] = 0; // Fallback to 0 if count node fails
          }
        }
        setStockMap(counts);
      } catch (e) {
        console.error("Voucher Store Initialization Failure:", e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['ALL', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'ALL') return products;
    return products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  if (loading) return <div className="p-20 text-center animate-pulse">Establishing Secure Online Store Connection...</div>;

  const features = [
    { label: "Voucher Sale", icon: "💎" },
    { label: "Online Store", icon: "🛒" },
    { label: "Bank Transfer", icon: "🏦" },
    { label: "Instant Email Delivery", icon: "📩" },
    { label: "Agent Portal", icon: "🤝" },
    { label: "Teller Verification", icon: "⚖️" }
  ];

  return (
    <div id="voucher-sale-node" className="max-w-7xl mx-auto px-4 py-12 scroll-mt-24 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
             <span className="px-3 py-1 bg-unicou-orange/10 border border-unicou-orange/20 rounded-full text-[10px] font-black text-unicou-orange uppercase tracking-widest">
               Authorized Fulfillment Hub
             </span>
             <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-500 uppercase tracking-widest">
               Online Store Active
             </span>
          </div>
          <h2 className="text-4xl md:text-7xl font-display font-bold mb-6 tracking-tighter">
            Voucher <span className="text-unicou-orange">Sale</span>
          </h2>
          <p className="text-slate-400 leading-relaxed font-medium text-lg">
            Authorized digital procurement for Pearson PTE, IELTS, LanguageCert, and TOEFL iBT. Our system ensures **Instant Vouchers Delivery through email** following automated or teller-verified payment nodes.
          </p>
          
          <div className="flex flex-wrap gap-4 mt-8">
             {features.map(f => (
               <div key={f.label} className="flex items-center gap-2 px-4 py-2 glass border border-slate-800 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-500">
                 <span>{f.icon}</span> {f.label}
               </div>
             ))}
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
           <button 
             onClick={onNavigateToAgent}
             className="px-8 py-5 bg-unicou-navy hover:bg-[#003a4d] text-white rounded-[2rem] font-bold text-[11px] uppercase tracking-[0.2em] border border-white/10 transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95"
           >
             Agent / Training Centers Portal
             <svg className="w-5 h-5 text-unicou-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zM6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
           </button>
           <div className="p-5 glass border border-white/5 rounded-[2rem] flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
                 <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase">Fulfillment Status</p>
                <p className="text-xs font-bold text-emerald-400">Instant Email Delivery Active</p>
              </div>
           </div>
        </div>
      </div>

      <div className="mb-12 flex flex-wrap gap-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
              activeCategory === cat 
              ? 'bg-unicou-orange text-white border-unicou-orange shadow-lg shadow-rose-500/20' 
              : 'bg-slate-900 text-slate-500 border-slate-800 hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        {filteredProducts.map(p => {
          const stockCount = stockMap[p.id] || 0;
          const isOutOfStock = stockCount === 0;
          const hasNoPrice = p.basePrice === 0;

          return (
            <div key={p.id} className="glass p-10 rounded-[3.5rem] border border-slate-800 hover:border-unicou-orange/40 transition-all group flex flex-col h-full shadow-3xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-unicou-orange/5 blur-[60px] group-hover:bg-unicou-orange/10 transition-all" />
              
              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="w-20 h-20 bg-slate-950 rounded-[2rem] flex items-center justify-center text-5xl shadow-inner border border-white/5 group-hover:scale-110 transition-transform">
                  {p.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-full border ${
                  isOutOfStock ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-unicou-orange/10 text-unicou-orange border-unicou-orange/20'
                }`}>
                  {isOutOfStock ? 'OUT OF STOCK' : 'NEXUS VERIFIED'}
                </span>
              </div>
              
              <h3 className="text-3xl font-display font-bold mb-4 group-hover:text-white transition-colors tracking-tight">{p.name}</h3>
              <p className="text-slate-500 text-sm mb-12 leading-relaxed flex-grow italic">{p.description}</p>
              
              <div className="space-y-8 pt-8 border-t border-slate-900/50 relative z-10">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Standard Settlement</p>
                    <p className="text-4xl font-display font-bold text-white font-mono tracking-tighter">
                      {hasNoPrice ? 'Contact' : `$${p.basePrice}`}
                    </p>
                  </div>
                  <div className="text-right">
                     <div className="flex items-center gap-1.5 justify-end mb-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
                        <span className="text-[10px] font-black text-slate-500 uppercase">{isOutOfStock ? 'Depleted' : 'Vault Ready'}</span>
                     </div>
                     <span className="text-xs font-bold text-slate-400">Stock: {stockCount}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                   <button 
                    onClick={() => onCheckout(p.id, 1)}
                    disabled={isOutOfStock}
                    className={`w-full py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-4 group/buy ${
                      isOutOfStock 
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700' 
                      : 'bg-unicou-orange hover:bg-orange-600 text-white shadow-unicou-orange/20'
                    }`}
                  >
                    {isOutOfStock ? 'Sold Out' : 'Buy Now'}
                    {!isOutOfStock && <svg className="w-6 h-6 group-hover/buy:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VoucherStore;