
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/apiService';
import { Product, User } from '../types';
import { EXAM_LOGOS, BRAND_COLORS } from '../constants/assets';

interface VoucherStoreProps {
  onCheckout: (productId: string, quantity: number) => void;
  onBook: (productId: string) => void;
  onNavigateToAgent: () => void;
}

const CATEGORIES = ['ALL', 'IELTS', 'PTE', 'TOEFL', 'LANGUAGECERT', 'DUOLINGO', 'OTHER'];

const CATEGORY_BRIEFS: Record<string, { title: string; subtitle: string; points: string[]; description: string }> = {
  'IELTS': {
    title: 'International English Language Testing System',
    subtitle: 'The Global Standard for Higher Education and Migration',
    description: 'IELTS is the world\'s most popular English language proficiency test for higher education and global migration. It is accepted by over 12,500 organizations globally, including all universities in the UK and Australia.',
    points: ['UKVI Approved for Visas', 'Accepted by 12,000+ Institutions', 'Standardized Academic Assessment', 'Valid for 2 Years']
  },
  'PTE': {
    title: 'Pearson Test of English Academic',
    subtitle: 'Fast, Flexible, and Machine-Scored Accuracy',
    description: 'PTE Academic is a computer-based English language test that delivers results faster than other tests (usually within 48 hours). It is highly popular for Australia and New Zealand visa applications.',
    points: ['Results in 48 Hours', '100% Computer-Based Scoring', 'Global University Recognition', 'Artificial Intelligence Enabled']
  },
  'TOEFL': {
    title: 'Test of English as a Foreign Language',
    subtitle: 'Premier American English Proficiency Node',
    description: 'The TOEFL iBT test is the preferred choice for students applying to North American institutions. It measures how well you use and understand English at the university level.',
    points: ['Preferred by 9/10 US Universities', 'Accepted by 160+ Countries', 'Academic Language Focus', 'Advanced Reading Modules']
  },
  'LANGUAGECERT': {
    title: 'LanguageCert ESOL & SELT',
    subtitle: 'Modern, Professional & Remote Testing',
    description: 'LanguageCert offers highly flexible SELT (Secure English Language Test) options that are fully recognized by the UK Home Office for all visa types.',
    points: ['Home Office Approved SELT', '24/7 Remote Exam Nodes', 'Fast Results & Digital Badge', 'Multiple Skill Combinations']
  },
  'DUOLINGO': {
    title: 'Duolingo English Test',
    subtitle: 'Convenient, Affordable, and Home-Based',
    description: 'A modern English proficiency assessment for today\'s international students. Taken from home, it is significantly more affordable and accepted by thousands of top universities.',
    points: ['Take it From Home', 'Affordable Settlement', '48-Hour Official Sync', 'AI-Adaptive Difficulty']
  }
};

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
    return products.filter(p => 
      p.category.toUpperCase().includes(normalizedActive) || 
      normalizedActive.includes(p.category.toUpperCase())
    );
  }, [products, activeCategory]);

  const getBrandLogo = (category: string) => {
    const upperCat = category.toUpperCase();
    return EXAM_LOGOS[upperCat] || EXAM_LOGOS[category] || EXAM_LOGOS['OTHER'];
  };

  const getBrandColor = (category: string) => {
    const upperCat = category.toUpperCase();
    return BRAND_COLORS[upperCat] || BRAND_COLORS[category] || BRAND_COLORS['OTHER'];
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase text-[11px] tracking-[0.4em]">Synchronizing Registry Assets...</div>;

  const currentBrief = CATEGORY_BRIEFS[activeCategory];

  return (
    <div className="max-w-7xl mx-auto px-6 bg-white pb-32 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-12 gap-8 pt-8 text-center lg:text-left">
        <div>
          <h2 className="text-4xl md:text-5xl font-display font-black text-unicou-navy tracking-tighter uppercase leading-none mb-2">OFFICIAL <span className="text-unicou-orange">VOUCHERS</span></h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">Secure Procurement Node Active</p>
        </div>
        {!user || user.role !== 'Student' ? (
          <button onClick={onNavigateToAgent} className="px-8 py-4 bg-unicou-navy text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black transition-all active:scale-95">Partner Node Access</button>
        ) : null}
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-16">
        {CATEGORIES.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)} 
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              activeCategory === cat ? 'bg-unicou-navy text-white shadow-lg border-unicou-navy' : 'bg-slate-50 text-slate-400 border-slate-100 hover:text-unicou-navy hover:bg-slate-100'
            }`}
          >{cat}</button>
        ))}
      </div>

      {/* EDUCATIONAL BRIEFING SECTION */}
      {currentBrief && (
        <div className="mb-20 animate-in slide-in-from-bottom-6 duration-700">
           <div className="bg-slate-50 rounded-[4rem] p-10 md:p-16 border border-slate-100 shadow-inner relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-16 opacity-5 font-black text-9xl pointer-events-none select-none text-unicou-navy uppercase">
                {activeCategory}
              </div>
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
                 <div className="lg:col-span-8">
                    <h3 className="text-4xl font-display font-black text-unicou-navy mb-4 tracking-tighter uppercase">{currentBrief.title}</h3>
                    <p className="text-unicou-orange font-black uppercase text-[11px] tracking-[0.3em] mb-8">{currentBrief.subtitle}</p>
                    <p className="text-xl text-slate-700 font-bold italic leading-relaxed border-l-8 border-unicou-navy pl-8 mb-10">
                      "{currentBrief.description}"
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {currentBrief.points.map((pt, i) => (
                         <div key={i} className="flex items-center gap-4 bg-white/60 p-4 rounded-2xl border border-white">
                            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">✓</div>
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{pt}</span>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="lg:col-span-4 flex items-center justify-center">
                    <div className="w-full aspect-square bg-white rounded-[3.5rem] shadow-premium flex items-center justify-center p-12 hover:scale-105 transition-transform duration-500">
                       <img src={getBrandLogo(activeCategory)} className="max-w-full max-h-full object-contain" alt={activeCategory} />
                    </div>
                 </div>
              </div>
           </div>
           <div className="mt-12 text-center">
              <div className="flex items-center justify-center gap-4">
                 <div className="h-0.5 w-12 bg-slate-100 rounded-full" />
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Available Procurement Units</span>
                 <div className="h-0.5 w-12 bg-slate-100 rounded-full" />
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map(p => {
          const brandColor = getBrandColor(p.category);
          const logo = (p.icon && (p.icon.startsWith('data:') || p.icon.startsWith('http'))) 
            ? p.icon 
            : getBrandLogo(p.category);

          return (
            <div key={p.id} className="bg-white p-8 rounded-[3.5rem] border border-slate-100 hover:border-unicou-orange/30 transition-all group shadow-premium flex flex-col relative overflow-hidden">
              <div className="h-32 flex items-center justify-center mb-10 bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 p-8 shadow-inner">
                <img 
                  src={logo} 
                  className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110" 
                  alt={p.name}
                  onError={(e) => { (e.target as HTMLImageElement).src = EXAM_LOGOS['OTHER']; }}
                />
              </div>
              
              <div className="mb-8 text-center flex-grow">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: brandColor }}>{p.category} AUTHORIZED</p>
                <h3 className="text-xl font-display font-black text-slate-950 tracking-tight leading-tight uppercase line-clamp-2">{p.name}</h3>
              </div>
              
              <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 mb-8 shadow-inner">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Settlement:</span>
                  <span className="text-3xl font-display font-black text-unicou-navy">${p.basePrice}</span>
                </div>
                <div className="h-px bg-slate-200 mb-4" />
                <p className="text-[8px] font-black text-emerald-600 uppercase tracking-[0.2em] text-center">Instant Dispatch Guaranteed</p>
              </div>

              <button 
                onClick={() => onCheckout(p.id, 1)} 
                className="w-full bg-unicou-navy hover:bg-unicou-orange text-white py-5 rounded-[1.8rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 group-hover:shadow-unicou-orange/20"
              >
                AUTHORIZE PROCUREMENT
              </button>
            </div>
          );
        })}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="py-32 text-center">
           <div className="text-6xl mb-8 opacity-20 grayscale">🔎</div>
           <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No active vouchers found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default VoucherStore;
