
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
    const categoryMap: Record<string, string> = { 'ELLT': 'Oxford ELLT', 'TOEFL': 'ETS' };
    const targetCat = categoryMap[activeCategory] || activeCategory;
    return products.filter(p => p.category === targetCat);
  }, [products, activeCategory]);

  const getBrandLogo = (category: string) => {
    const map: Record<string, string> = {
      'IELTS': 'IELTS', 'PTE': 'PTE', 'LanguageCert': 'LanguageCertAcademic',
      'ETS': 'TOEFL', 'Skills for English': 'SkillsForEnglish', 'Duolingo': 'Duolingo',
      'Oxford ELLT': 'ELLT', 'Password': 'Password'
    };
    return EXAM_LOGOS[map[category] || category] || EXAM_LOGOS['OTHER'];
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase text-[11px] tracking-[0.4em]">Syncing Storefront...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 animate-slide-up bg-white pb-32">
      <div className="flex flex-col lg:flex-row justify-between items-start mb-12 gap-8 pt-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-2 h-2 rounded-full bg-unicou-orange animate-bounce"></div>
             <span className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest shadow-sm">Official Student Store</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black text-unicou-navy tracking-tighter leading-none mb-6 uppercase">Voucher <span className="text-unicou-orange">Shop</span></h2>
          <p className="text-slate-600 text-lg font-bold leading-relaxed italic border-l-4 border-unicou-navy pl-6">
            Instant delivery of official test vouchers. Secure your exam seat today with verified codes from Pearson, British Council, and IDP.
          </p>
        </div>
        
        {!user || user.role !== 'Agent Partner/Prep Center' ? (
          <button onClick={onNavigateToAgent} className="shrink-0 px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all">Agent Log-In</button>
        ) : (
          <div className="bg-unicou-navy/5 border border-unicou-navy/10 p-6 rounded-3xl text-center">
             <p className="text-[10px] font-black text-unicou-navy uppercase mb-2">Partner Node Active</p>
             <button onClick={() => onNavigateToAgent()} className="text-xs font-black text-unicou-orange underline uppercase tracking-widest">Back to Portal</button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-12">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${activeCategory === cat ? 'bg-unicou-navy text-white border-unicou-navy shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}>{cat}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map(p => (
          <div key={p.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 hover:border-unicou-orange/20 transition-all group shadow-xl flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <img src={getBrandLogo(p.category)} alt={p.category} className="h-6 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
              <div className="w-2 h-2 rounded-full bg-unicou-orange" />
            </div>
            
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{p.category} NODE</p>
            <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight leading-tight uppercase mb-8">{p.name}</h3>
            
            <div className="bg-slate-50/80 rounded-[2rem] p-6 border border-slate-100 mb-8 mt-auto">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">RETAIL RATE:</span>
                  <span className="text-xs font-bold text-slate-400 tracking-tight">${(p.basePrice * 1.1).toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center mb-4 text-unicou-orange">
                  <span className="text-[9px] font-black uppercase tracking-widest">EXCLUSIVE DISCOUNT:</span>
                  <span className="text-xs font-bold tracking-tight">-${(p.basePrice * 0.1).toFixed(2)}</span>
               </div>
               <div className="h-px bg-slate-200 mb-4" />
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-unicou-navy uppercase tracking-widest">NET PRICE:</span>
                  <span className="text-3xl font-display font-black text-unicou-navy tracking-tighter">${p.basePrice.toFixed(2)}</span>
               </div>
            </div>

            <button onClick={() => onCheckout(p.id, 1)} className="w-full bg-unicou-navy hover:bg-slate-900 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-action transition-all active:scale-95">BUY VOUCHER</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoucherStore;
