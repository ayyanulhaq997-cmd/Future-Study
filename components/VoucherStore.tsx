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
          counts[item.id] = await api.getStockCount(item.id);
        }
        setStockMap(counts);
      } catch (e) { console.error(e); } finally { setLoading(false); }
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

  const getBrandLogo = (category: string) => EXAM_LOGOS[category] || EXAM_LOGOS['OTHER'];

  if (loading) return <div className="p-40 text-center animate-pulse text-slate-400 font-bold uppercase text-[10px] tracking-widest">Opening Storefront...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 animate-slide-up">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
             <span className="px-4 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-black text-slate-600 uppercase tracking-widest">Official Fulfillment Hub</span>
             <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest">Vault Live</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-bold text-slate-900 tracking-tighter leading-none mb-8">
            Voucher <span className="text-unicou-orange">Store</span>
          </h2>
          <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl border-l-4 border-unicou-navy pl-8">
            Instant digital procurement for Pearson PTE, IELTS, and TOEFL iBT. Secure settlement with <strong>Instant Email Delivery</strong> protocols.
          </p>
        </div>
        
        <button onClick={onNavigateToAgent} className="px-10 py-5 bg-unicou-navy text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl hover:scale-105 active:scale-95">Partner Access Portal</button>
      </div>

      <div className="mb-12 flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
              activeCategory === cat ? 'bg-unicou-navy text-white border-unicou-navy shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map(p => {
          const stock = stockMap[p.id] || 0;
          const out = stock === 0;
          
          return (
            <div key={p.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 hover:border-unicou-navy/20 transition-all group flex flex-col h-full shadow-lg hover:shadow-2xl">
              <div className="flex justify-between items-start mb-10">
                <div className="w-24 h-12 flex items-center justify-center p-2 rounded-xl bg-slate-50">
                  <img src={getBrandLogo(p.category)} alt={p.category} className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all" />
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${out ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {out ? 'Out of Stock' : 'In Vault'}
                </span>
              </div>
              
              <div className="mb-8">
                <h3 className="text-2xl font-display font-bold text-slate-900 group-hover:text-unicou-navy transition-colors">{p.name}</h3>
                <p className="text-slate-400 text-sm italic mt-3 leading-relaxed">"{p.description}"</p>
              </div>
              
              <div className="mt-auto space-y-8 pt-8 border-t border-slate-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Standard Rate</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-display font-bold text-slate-900 font-mono">${p.basePrice}</span>
                      <span className="text-slate-400 font-bold text-[10px]">USD</span>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Available</p>
                     <p className="text-lg font-bold font-mono text-slate-700">{stock.toString().padStart(2, '0')}</p>
                  </div>
                </div>

                <button 
                  onClick={() => onCheckout(p.id, 1)}
                  disabled={out}
                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4 ${
                    out ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' : 'bg-unicou-orange hover:bg-orange-600 text-white shadow-orange-500/20'
                  }`}
                >
                  {out ? 'Procurement Locked' : 'Secure Checkout'}
                  {!out && <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VoucherStore;