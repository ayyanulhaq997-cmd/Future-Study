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
    return activeCategory === 'ALL' ? products : products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  const getBrandLogo = (category: string) => EXAM_LOGOS[category] || EXAM_LOGOS['OTHER'];

  if (loading) return <div className="p-40 text-center animate-pulse text-slate-800 font-black uppercase text-[11px] tracking-[0.4em]">Initializing Digital Vault...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 animate-slide-up bg-white">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
             <span className="px-5 py-2 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-black text-slate-600 uppercase tracking-widest shadow-sm">Verified Fulfillment Hub</span>
             <span className="px-5 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Vault Online
             </span>
          </div>
          <h2 className="text-6xl md:text-8xl font-display font-black text-slate-950 tracking-tighter leading-[0.9] mb-10">Digital <span className="text-unicou-orange">Vault.</span></h2>
          <p className="text-slate-700 text-xl font-bold leading-relaxed max-w-2xl border-l-8 border-unicou-navy pl-10 italic">
            Procurement terminal for official proficiency exams. Secured node-to-node delivery with <strong>immediate stock allocation</strong> protocols.
          </p>
        </div>
        <button onClick={onNavigateToAgent} className="px-12 py-6 bg-unicou-navy text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-2xl hover:bg-slate-950 active:scale-95">Partner Portal</button>
      </div>

      <div className="mb-16 flex flex-wrap gap-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
              activeCategory === cat ? 'bg-unicou-navy text-white border-unicou-navy shadow-2xl scale-105' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pb-24">
        {filteredProducts.map(p => {
          const stock = stockMap[p.id] || 0;
          const out = stock === 0;
          return (
            <div key={p.id} className="bg-white p-12 rounded-[4rem] border border-slate-100 hover:border-unicou-orange/20 transition-all group flex flex-col h-full shadow-xl hover:shadow-3xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-12">
                <div className="h-14 flex items-center justify-center p-1">
                  <img src={getBrandLogo(p.category)} alt={p.category} className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110" />
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${out ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>{out ? 'Node Locked' : 'Stock Valid'}</span>
              </div>
              <div className="mb-10">
                <h3 className="text-3xl font-display font-black text-slate-950 group-hover:text-unicou-navy transition-colors tracking-tight leading-tight">{p.name}</h3>
                <p className="text-slate-500 text-sm italic mt-4 leading-relaxed font-bold">"{p.description}"</p>
              </div>
              <div className="mt-auto space-y-10 pt-10 border-t border-slate-50">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Registry Rate</p>
                    <div className="flex items-baseline gap-2"><span className="text-4xl font-display font-black text-slate-950 tracking-tighter">${p.basePrice}</span><span className="text-slate-400 font-black text-[11px] uppercase tracking-widest">USD</span></div>
                  </div>
                  <div className="text-right">
                     <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">Available</p>
                     <p className="text-xl font-black font-mono text-slate-950 bg-slate-50 px-3 py-1 rounded-xl border border-slate-100">{stock.toString().padStart(2, '0')}</p>
                  </div>
                </div>
                <button 
                  onClick={() => onCheckout(p.id, 1)}
                  disabled={out}
                  className={`w-full py-7 rounded-[2rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-5 ${
                    out ? 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100' : 'bg-unicou-orange hover:bg-orange-600 text-white shadow-orange-500/20'
                  }`}
                >
                  {out ? 'Procurement Paused' : 'Secure Checkout'}
                  {!out && <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
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