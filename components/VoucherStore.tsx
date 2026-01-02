
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/apiService';
import { Product, User } from '../types';
import { EXAM_LOGOS, BRAND_COLORS } from '../constants/assets';

interface VoucherStoreProps {
  onCheckout: (productId: string, quantity: number) => void;
  onBook: (productId: string) => void;
  onNavigateToAgent: () => void;
}

const CATEGORIES = ['ALL', 'IELTS', 'PTE', 'LANGUAGECERT', 'SKILLS FOR ENGLISH', 'TOEFL', 'DUOLINGO', 'ELLT', 'OTHER'];

const VoucherStore: React.FC<VoucherStoreProps> = ({ onCheckout, onBook, onNavigateToAgent }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [user, setUser] = useState<User | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

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
    const normalizedActive = activeCategory.toUpperCase();
    return products.filter(p => 
      p.category.toUpperCase().includes(normalizedActive) || 
      (normalizedActive === 'TOEFL' && p.category === 'ETS') ||
      (normalizedActive === 'ELLT' && p.category.includes('ELLT'))
    );
  }, [products, activeCategory]);

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-[#004a61] font-black uppercase text-[11px] tracking-[0.4em]">Synchronizing Storefront...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 animate-slide-up bg-white pb-32">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-8 pt-8">
        <div className="text-center lg:text-left">
          <h2 className="text-4xl font-display font-black text-[#004a61] tracking-tighter leading-none mb-2 uppercase text-shadow-sm">OFFICIAL <span className="text-[#f15a24]">VOUCHERS</span></h2>
          <p className="text-[#64748b] text-[10px] font-black uppercase tracking-[0.4em]">UniCou Authorized Procurement Hub</p>
        </div>
        {!user || user.role !== 'Student' ? (
          <button onClick={onNavigateToAgent} className="shrink-0 px-8 py-3 bg-[#004a61] text-white rounded-full font-black text-[9px] uppercase tracking-[0.2em] shadow-lg hover:bg-black transition-all">Agent Access Node</button>
        ) : null}
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-16">
        {CATEGORIES.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)} 
            className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
              activeCategory === cat 
                ? 'bg-[#004a61] text-white border-[#004a61] shadow-md' 
                : 'bg-white text-slate-400 border-slate-200 hover:border-[#004a61]/30 hover:text-[#004a61]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map(p => {
          const officialRate = p.basePrice * 1.1;
          const discount = officialRate - p.basePrice;
          const displayCategory = p.category === 'ETS' ? 'TOEFL' : p.category;
          const logoSrc = EXAM_LOGOS[p.category] || EXAM_LOGOS['OTHER'];
          const brandColor = BRAND_COLORS[p.category] || BRAND_COLORS['OTHER'];
          const hasError = imageErrors[p.id];
          
          return (
            <div key={p.id} className="bg-white p-8 rounded-[3.5rem] border border-slate-100 hover:border-[#f15a24]/30 transition-all group shadow-sm hover:shadow-2xl flex flex-col relative overflow-hidden text-center">
              {/* Brand Accent Bar */}
              <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: brandColor }} />
              
              {/* BRAND LOGO CONTAINER */}
              <div className="h-32 flex items-center justify-center mb-8 bg-white rounded-3xl relative overflow-hidden">
                {!hasError ? (
                  <img 
                    src={logoSrc} 
                    alt={displayCategory} 
                    className="h-20 w-auto max-w-[85%] object-contain transition-transform group-hover:scale-110" 
                    onError={() => handleImageError(p.id)}
                  />
                ) : (
                  <div 
                    className="w-full h-full flex flex-col items-center justify-center p-4"
                    style={{ backgroundColor: `${brandColor}08` }}
                  >
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-2 shadow-lg" style={{ backgroundColor: brandColor }}>
                      {displayCategory.charAt(0)}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: brandColor }}>{displayCategory}</span>
                  </div>
                )}
              </div>
              
              <div className="mb-10">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: brandColor }}>{displayCategory} NODE</p>
                <h3 className="text-xl font-display font-black text-slate-950 tracking-tight leading-tight uppercase line-clamp-2 min-h-[3rem]">{p.name}</h3>
              </div>
              
              <div className="bg-[#f8fafc] rounded-[2.5rem] p-6 border border-slate-50 mb-8 mt-auto shadow-inner text-left">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[9px] font-black text-[#64748b] uppercase tracking-widest">Official Rate:</span>
                  <span className="text-sm font-bold text-[#64748b] line-through">${officialRate.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] font-black text-[#f15a24] uppercase tracking-tighter">Exclusive Discount:</span>
                  <span className="text-xs font-black text-[#f15a24]">-${discount.toFixed(2)}</span>
                </div>
                <div className="h-px bg-slate-200/60 mb-6" />
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-[#004a61] uppercase tracking-[0.1em]">Exclusive Discounted Price:</span>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-display font-black text-[#004a61] tracking-tighter leading-none">${p.basePrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => onCheckout(p.id, 1)} 
                className="w-full bg-[#004a61] hover:bg-black text-white py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95"
              >
                PROCURE VOUCHER
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VoucherStore;
