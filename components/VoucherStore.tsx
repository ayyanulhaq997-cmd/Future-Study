
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/apiService';
import { Product, User } from '../types';
import { EXAM_LOGOS, BRAND_COLORS } from '../constants/assets';

interface VoucherStoreProps {
  onCheckout: (productId: string, quantity: number) => void;
  onBook: (productId: string) => void;
  onNavigateToAgent: () => void;
}

const CATEGORIES = ['ALL', 'IELTS', 'PTE', 'LANGUAGECERT', 'TOEFL', 'DUOLINGO', 'OTHER'];

const VoucherStore: React.FC<VoucherStoreProps> = ({ onCheckout, onNavigateToAgent }) => {
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
    const normalizedActive = activeCategory.toUpperCase();
    return products.filter(p => p.category.toUpperCase().includes(normalizedActive) || normalizedActive.includes(p.category.toUpperCase()));
  }, [products, activeCategory]);

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase text-[11px] tracking-[0.4em]">Synchronizing Registry Assets...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 bg-white pb-32 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-8 pt-8">
        <div>
          <h2 className="text-4xl font-display font-black text-unicou-navy tracking-tighter uppercase leading-none mb-2">OFFICIAL <span className="text-unicou-orange">VOUCHERS</span></h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Procurement Protocol V4.5</p>
        </div>
        {!user || user.role !== 'Student' ? (
          <button onClick={onNavigateToAgent} className="px-8 py-3 bg-unicou-navy text-white rounded-full font-black text-[9px] uppercase tracking-widest shadow-xl hover:bg-black transition-all">Partner Access</button>
        ) : null}
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-16">
        {CATEGORIES.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)} 
            className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
              activeCategory === cat ? 'bg-unicou-navy text-white shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-100 hover:text-unicou-navy'
            }`}
          >{cat}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map(p => {
          const brandColor = BRAND_COLORS[p.category] || BRAND_COLORS['OTHER'];
          const logo = (p.icon && (p.icon.startsWith('data:') || p.icon.startsWith('http'))) 
            ? p.icon 
            : (EXAM_LOGOS[p.category] || EXAM_LOGOS['OTHER']);

          return (
            <div key={p.id} className="bg-white p-8 rounded-[3.5rem] border border-slate-100 hover:border-unicou-orange/30 transition-all group shadow-premium flex flex-col relative overflow-hidden">
              <div className="h-32 flex items-center justify-center mb-8 bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 p-6">
                <img 
                  src={logo} 
                  className="h-full w-auto object-contain transition-transform group-hover:scale-110" 
                  alt={p.name}
                  onError={(e) => { (e.target as HTMLImageElement).src = EXAM_LOGOS['OTHER']; }}
                />
              </div>
              
              <div className="mb-8 text-center flex-grow">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: brandColor }}>{p.category} NODE</p>
                <h3 className="text-xl font-display font-black text-slate-950 tracking-tight leading-tight uppercase line-clamp-2">{p.name}</h3>
              </div>
              
              <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100 mb-8 shadow-inner">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] font-black text-slate-400 uppercase">Settlement:</span>
                  <span className="text-3xl font-display font-black text-unicou-navy">${p.basePrice}</span>
                </div>
                <div className="h-px bg-slate-200 mb-4" />
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest text-center">Instant Dispatch Guaranteed</p>
              </div>

              <button onClick={() => onCheckout(p.id, 1)} className="w-full bg-unicou-navy hover:bg-unicou-orange text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95">AUTHORIZE PROCUREMENT</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VoucherStore;
