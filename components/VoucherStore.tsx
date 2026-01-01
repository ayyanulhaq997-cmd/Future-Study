
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/apiService';
import { Product } from '../types';
import { EXAM_LOGOS } from '../constants/assets';

interface VoucherStoreProps {
  onCheckout: (productId: string, quantity: number) => void;
  onBook: (productId: string) => void;
  onNavigateToAgent: () => void;
}

const CATEGORIES = [
  'ALL',
  'IELTS',
  'PTE',
  'LanguageCert',
  'Skills for English',
  'TOEFL',
  'Duolingo',
  'ELLT',
  'OTHER'
];

const VoucherStore: React.FC<VoucherStoreProps> = ({ onCheckout, onBook, onNavigateToAgent }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  useEffect(() => {
    const init = async () => {
      try {
        const p = await api.getProducts();
        setProducts(p.filter(x => x.type === 'Voucher'));
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    init();
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'ALL') return products;
    if (activeCategory === 'OTHER') {
      const topCategories = CATEGORIES.slice(1, 8);
      return products.filter(p => !topCategories.includes(p.category));
    }
    const categoryMap: Record<string, string> = {
      'ELLT': 'Oxford ELLT',
      'TOEFL': 'ETS'
    };
    const targetCat = categoryMap[activeCategory] || activeCategory;
    return products.filter(p => p.category === targetCat);
  }, [products, activeCategory]);

  const getBrandLogo = (category: string) => {
    const map: Record<string, string> = {
      'IELTS': 'IELTS',
      'PTE': 'PTE',
      'LanguageCert': 'LanguageCertAcademic',
      'ETS': 'TOEFL',
      'Skills for English': 'SkillsForEnglish',
      'Duolingo': 'Duolingo',
      'Oxford ELLT': 'ELLT',
      'Password': 'Password'
    };
    return EXAM_LOGOS[map[category] || category] || EXAM_LOGOS['OTHER'];
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase text-[11px] tracking-[0.4em]">Synchronizing Vault...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 animate-slide-up bg-white pb-32">
      <div className="flex flex-col lg:flex-row justify-between items-start mb-12 gap-8 pt-12">
        <div className="max-w-3xl">
          <div className="flex flex-wrap gap-3 mb-6">
             <span className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest shadow-sm">Verified Fulfillment Hub</span>
             <span className="px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Vault Online
             </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-display font-black text-unicou-navy tracking-tighter leading-none mb-6 uppercase">Digital Vault.</h2>
          
          <div className="max-w-2xl border-l-4 border-unicou-orange pl-6">
             <p className="text-unicou-navy text-xl font-black leading-tight uppercase tracking-tight mb-2">
               Secure Official Exam Vouchers
             </p>
             <p className="text-slate-600 text-base font-bold leading-relaxed italic">
               Protected node-to-node delivery with instant stock allocation for fast and reliable fulfillment.
             </p>
          </div>
        </div>
        
        <button onClick={onNavigateToAgent} className="shrink-0 px-10 py-5 bg-unicou-navy text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-950 transition-all active:scale-95">
          Partner Portal
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-12">
        {CATEGORIES.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
              activeCategory === cat 
              ? 'bg-unicou-navy text-white border-unicou-navy shadow-md scale-[1.02]' 
              : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24 min-h-[400px]">
        {filteredProducts.length > 0 ? filteredProducts.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-unicou-orange/20 transition-all group shadow-premium relative overflow-hidden flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <img src={getBrandLogo(p.category)} alt={p.category} className="h-7 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-700" />
              <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600`}>{p.pricingModel}</span>
            </div>
            <div className="mb-6 flex-grow">
              <h3 className="text-lg font-display font-black text-slate-950 group-hover:text-unicou-navy transition-colors tracking-tight leading-tight uppercase">{p.name}</h3>
              <p className="text-slate-500 text-xs italic mt-3 leading-relaxed font-bold line-clamp-2">"{p.description}"</p>
            </div>
            <div className="mt-auto pt-6 border-t border-slate-50">
              <div className="mb-4">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">OFFICIAL RATE</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-display font-black text-slate-950 tracking-tighter">
                    {p.currency === 'GBP' ? '£' : '$'}{p.basePrice}
                  </span>
                  <span className="text-slate-400 text-[9px] font-black">{p.currency}</span>
                </div>
              </div>
              <button 
                onClick={() => onCheckout(p.id, 1)}
                className="w-full bg-unicou-orange hover:bg-orange-600 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-action active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                SECURE CHECKOUT
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-32 text-center">
             <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-xs italic">"Voucher node currently synchronizing."</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoucherStore;
