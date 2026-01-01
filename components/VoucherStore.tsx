
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/apiService';
import { Product, User } from '../types';
import { EXAM_LOGOS } from '../constants/assets';

interface VoucherStoreProps {
  onCheckout: (productId: string, quantity: number) => void;
  onBook: (productId: string) => void;
  onNavigateToAgent: () => void;
}

const CATEGORIES = ['ALL', 'IELTS', 'PTE', 'LanguageCert', 'Skills for English', 'TOEFL', 'Duolingo', 'ELLT', 'OTHER'];

const VoucherStore: React.FC<VoucherStoreProps> = ({ onCheckout, onBook, onNavigateToAgent }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const init = async () => {
      setUser(api.getCurrentUser());
      const p = await api.getProducts();
      setProducts(p.filter(x => x.type === 'Voucher'));
      setLoading(false);
    };
    init();
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'ALL') return products;
    return products.filter(p => p.category.includes(activeCategory));
  }, [products, activeCategory]);

  const getBrandLogo = (category: string) => {
    const map: Record<string, string> = { 'IELTS': 'IELTS', 'PTE': 'PTE', 'LanguageCert': 'LanguageCertAcademic', 'ETS': 'TOEFL', 'Duolingo': 'Duolingo', 'Oxford ELLT': 'ELLT' };
    return EXAM_LOGOS[map[category] || category] || EXAM_LOGOS['OTHER'];
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-[#004a61] font-black uppercase text-[11px] tracking-[0.4em]">Syncing Storefront...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 animate-slide-up bg-white pb-32">
      <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-8 pt-8 border-b border-slate-100 pb-12">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-display font-black text-[#004a61] tracking-tighter leading-none mb-4 uppercase">Voucher <span className="text-[#f15a24]">Shop</span></h2>
          <p className="text-[#64748b] text-base font-bold leading-relaxed italic border-l-4 border-[#f15a24] pl-4">"Authorized procurement terminal for official exam vouchers. Instant delivery verified."</p>
        </div>
        <button onClick={onNavigateToAgent} className="shrink-0 px-8 py-4 bg-[#004a61] text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg hover:bg-black transition-all">Agent Hub</button>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-12">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all border ${activeCategory === cat ? 'bg-[#004a61] text-white border-[#004a61] shadow-md' : 'bg-white text-slate-400 border-slate-100'}`}>{cat}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(p => {
          const officialRate = p.basePrice * 1.1;
          const discount = officialRate - p.basePrice;
          return (
            <div key={p.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 hover:border-[#f15a24]/40 transition-all group shadow-sm hover:shadow-2xl flex flex-col relative overflow-hidden">
              <img src={getBrandLogo(p.category)} alt={p.category} className="h-4 w-auto object-contain grayscale group-hover:grayscale-0 transition-all mb-6" />
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{p.category} NODE</p>
              <h3 className="text-lg font-display font-black text-slate-950 tracking-tight leading-tight uppercase mb-8">{p.name}</h3>
              
              {/* Point 12: Perfect Pricing Terminal UI */}
              <div className="bg-[#f8fafc] rounded-[1.8rem] p-6 border border-slate-100 mb-8 mt-auto shadow-inner">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-black text-[#64748b] uppercase tracking-widest">Official Rate:</span>
                  <span className="text-sm font-bold text-[#64748b] line-through">${officialRate.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[9px] font-black text-[#f15a24] uppercase tracking-tighter">Exclusive Exam Discounts:</span>
                  <span className="text-xs font-black text-[#f15a24]">-${discount.toFixed(2)}</span>
                </div>
                <div className="h-px bg-slate-200 mb-4" />
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-[#004a61] uppercase tracking-widest mb-1">Exclusive Discounted Price:</span>
                  <span className="text-3xl font-display font-black text-[#004a61] tracking-tighter leading-none">${p.basePrice.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={() => onCheckout(p.id, 1)} className="w-full bg-[#004a61] hover:bg-black text-white py-5 rounded-[1.4rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95">PROCURE VOUCHER</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VoucherStore;
