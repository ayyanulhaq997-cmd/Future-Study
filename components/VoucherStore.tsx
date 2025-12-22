
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Product } from '../types';

interface VoucherStoreProps {
  onCheckout: (productId: string, quantity: number) => void;
  onBook: (productId: string) => void;
}

const VoucherStore: React.FC<VoucherStoreProps> = ({ onCheckout, onBook }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts().then(p => {
      setProducts(p.filter(x => x.type === 'Voucher'));
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-20 text-center animate-pulse">Loading Voucher Vault...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div className="max-w-xl">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Exam <span className="text-[#f15a24]">Vouchers</span>
          </h2>
          <p className="text-slate-400 leading-relaxed font-medium">
            Authorized procurement for PTE, IELTS, TOEFL, and OTHM. 
            Official vouchers for international test centers worldwide.
          </p>
        </div>
        <div className="flex gap-4">
           <div className="glass px-6 py-4 rounded-2xl border-emerald-500/20">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Instant Node Delivery</p>
             <p className="text-sm font-bold text-emerald-400">99.9% Uptime</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(p => (
          <div key={p.id} className="glass p-8 rounded-[2.5rem] border border-slate-800 hover:border-[#f15a24]/30 transition-all group flex flex-col h-full shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#f15a24]/5 blur-[60px] group-hover:bg-[#f15a24]/10 transition-all" />
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-white/5">
                {p.icon}
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-[#f15a24] bg-[#f15a24]/10 px-3 py-1.5 rounded-full border border-[#f15a24]/20">
                Official {p.category} Node
              </span>
            </div>
            
            <h3 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors">{p.name}</h3>
            <p className="text-slate-500 text-sm mb-10 leading-relaxed flex-grow">{p.description}</p>
            
            <div className="space-y-6 pt-6 border-t border-slate-900 relative z-10">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Base Rate</p>
                  <p className="text-3xl font-display font-bold text-white font-mono tracking-tighter">${p.basePrice}</p>
                </div>
                {p.priceTiers && (
                  <div className="text-right">
                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Bulk Savings</p>
                    <p className="text-xs text-slate-400 font-bold">Up to {p.priceTiers[0].discountPercentage}% Off</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3">
                 <button 
                  onClick={() => onCheckout(p.id, 1)}
                  className="w-full py-5 bg-[#f15a24] hover:bg-[#ff6b3d] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                >
                  Buy Voucher
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
                <button 
                  onClick={() => onBook(p.id)}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-2xl font-bold text-[10px] uppercase tracking-widest border border-slate-800 transition-all"
                >
                  Book Full Registration
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoucherStore;
