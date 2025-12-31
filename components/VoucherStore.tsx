
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
    return activeCategory === 'ALL' ? products : products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  const getBrandLogo = (category: string) => EXAM_LOGOS[category] || EXAM_LOGOS['OTHER'];

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase text-[11px] tracking-[0.4em]">Loading vouchers...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 animate-slide-up bg-white pb-32">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-12 pt-12">
        <div className="max-w-3xl">
          <h2 className="text-6xl md:text-8xl font-display font-black text-slate-950 tracking-tighter leading-[0.9] mb-10 uppercase">Exam <span className="text-unicou-orange">Vouchers.</span></h2>
          <p className="text-slate-700 text-xl font-bold leading-relaxed max-w-2xl border-l-8 border-unicou-navy pl-10 italic">
            Official proficiency exam vouchers with instant delivery. Trusted by students and centers for IELTS, PTE, TOEFL, and OTHM exams.
          </p>
        </div>
        <button onClick={onNavigateToAgent} className="px-12 py-6 bg-unicou-navy text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-slate-950 transition-all">Partner Registration</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pb-24">
        {filteredProducts.map(p => (
          <div key={p.id} className="bg-white p-12 rounded-[4rem] border border-slate-100 hover:border-unicou-orange/20 transition-all group shadow-xl relative overflow-hidden flex flex-col h-full">
            <div className="flex justify-between items-start mb-12">
              <img src={getBrandLogo(p.category)} alt={p.category} className="h-12 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-700" />
              <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600`}>{p.pricingModel} Price</span>
            </div>
            <div className="mb-10">
              <h3 className="text-2xl font-display font-black text-slate-950 group-hover:text-unicou-navy transition-colors tracking-tight leading-tight uppercase">{p.name}</h3>
              <p className="text-slate-500 text-sm italic mt-4 leading-relaxed font-bold">"{p.description}"</p>
            </div>
            <div className="mt-auto pt-10 border-t border-slate-50 flex justify-between items-end">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Standard Fee</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-display font-black text-slate-950 tracking-tighter">
                    {p.currency === 'GBP' ? '£' : p.currency === 'USD' ? '$' : p.currency} {p.basePrice}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => onCheckout(p.id, 1)}
                className="bg-unicou-orange hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              >
                Buy Voucher
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoucherStore;
