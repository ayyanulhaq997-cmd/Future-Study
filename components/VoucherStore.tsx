import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/apiService';
import { Product } from '../types';
import { EXAM_LOGOS } from '../constants/assets';

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
            counts[item.id] = 0;
          }
        }
        setStockMap(counts);
      } catch (e) {
        console.error("Voucher Store Sync Failure:", e);
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

  const getBrandLogo = (category: string) => {
    return EXAM_LOGOS[category] || EXAM_LOGOS['OTHER'];
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-40 min-h-[60vh]">
      <div className="w-16 h-16 border-4 border-unicou-orange/20 border-t-unicou-orange rounded-full animate-spin mb-6" />
      <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Establishing Secure Storefront Link...</p>
    </div>
  );

  return (
    <div id="voucher-sale-node" className="max-w-7xl mx-auto px-6 py-16 animate-in fade-in duration-1000">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
             <div className="px-4 py-1.5 bg-unicou-orange/10 border border-unicou-orange/20 rounded-full text-[10px] font-black text-unicou-orange uppercase tracking-[0.2em] shadow-lg">
               Official Fulfillment Node
             </div>
             <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">
               Vault Online
             </div>
          </div>
          <h2 className="text-5xl md:text-8xl font-display font-bold mb-8 tracking-tighter leading-none">
            Authorized <br /><span className="text-unicou-orange">Fulfillment</span>
          </h2>
          <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-2xl italic border-l-2 border-slate-800 pl-8">
            Procure authentic vouchers for Pearson PTE, British Council IELTS, LanguageCert, and TOEFL iBT with <strong>Instant Email Delivery</strong> following secure settlement.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
           <button 
             onClick={onNavigateToAgent}
             className="px-10 py-6 bg-unicou-navy hover:bg-slate-900 text-white rounded-3xl font-black text-[12px] uppercase tracking-[0.1em] transition-all shadow-3xl flex items-center justify-center gap-4 border border-white/5 active:scale-95 group"
           >
             Partner Access Portal
             <svg className="w-5 h-5 text-unicou-orange group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
           </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-16 flex flex-wrap gap-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
              activeCategory === cat 
              ? 'bg-white text-slate-950 border-white shadow-xl scale-105' 
              : 'bg-slate-900/50 text-slate-500 border-slate-800 hover:border-slate-600 hover:text-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredProducts.map(p => {
          const stockCount = stockMap[p.id] || 0;
          const isOutOfStock = stockCount === 0;
          
          return (
            <div 
              key={p.id} 
              className="glass p-12 rounded-[4rem] border border-slate-800 hover:border-unicou-orange/30 transition-all duration-500 group flex flex-col h-full shadow-2xl relative overflow-hidden"
            >
              {/* Card Accent Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-unicou-orange/5 blur-[80px] group-hover:bg-unicou-orange/10 transition-all duration-700" />
              
              {/* Logo Node */}
              <div className="flex justify-between items-start mb-12">
                <div className="w-32 h-16 bg-white/5 rounded-2xl p-4 flex items-center justify-center transition-all group-hover:bg-white/10 shadow-inner">
                  <img src={getBrandLogo(p.category)} alt={p.category} className="w-full h-full object-contain filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-all" />
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                  isOutOfStock ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                }`}>
                  {isOutOfStock ? 'OUT OF STOCK' : 'LIVE READY'}
                </div>
              </div>
              
              <div className="mb-10">
                <h3 className="text-3xl font-display font-bold text-white mb-4 group-hover:text-unicou-orange transition-colors tracking-tight">{p.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed italic font-medium">"{p.description}"</p>
              </div>
              
              <div className="mt-auto space-y-10 pt-8 border-t border-slate-900/50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Standard Settlement</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-display font-bold text-white font-mono tracking-tighter">
                        {p.basePrice === 0 ? 'TBD' : `$${p.basePrice}`}
                      </span>
                      <span className="text-slate-600 font-bold text-xs">USD</span>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Stock Protocol</p>
                     <p className={`text-lg font-bold font-mono ${isOutOfStock ? 'text-slate-700' : 'text-primary-400'}`}>
                       {stockCount.toString().padStart(2, '0')}
                     </p>
                  </div>
                </div>

                <button 
                  onClick={() => onCheckout(p.id, 1)}
                  disabled={isOutOfStock}
                  className={`w-full py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-4 group/buy ${
                    isOutOfStock 
                    ? 'bg-slate-900 text-slate-700 border border-slate-800 cursor-not-allowed' 
                    : 'bg-unicou-orange hover:bg-orange-600 text-white shadow-unicou-orange/20'
                  }`}
                >
                  {isOutOfStock ? 'Fulfillment Locked' : 'Secure Checkout'}
                  {!isOutOfStock && <svg className="w-5 h-5 group-hover/buy:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Footer */}
      <div className="mt-32 p-16 glass rounded-[5rem] border border-white/5 text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-unicou-navy/20 to-transparent pointer-events-none" />
         <div className="relative z-10 max-w-2xl mx-auto">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6">Security Certificate</h4>
            <p className="text-2xl font-display font-bold text-white mb-8 tracking-tight">Direct procurement from Pearson and British Council nodes ensures 100% validity for every voucher dispatched.</p>
            <div className="flex justify-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
               {['PTE', 'IELTS', 'TOEFL'].map(t => (
                 <span key={t} className="text-xs font-black text-slate-500 tracking-widest">{t} VERIFIED</span>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default VoucherStore;