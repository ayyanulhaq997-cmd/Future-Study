
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Product, ViewState } from '../types';

interface VoucherStoreProps {
  onCheckout: (productId: string, quantity: number) => void;
  onBook: (productId: string) => void;
}

const VoucherStore: React.FC<VoucherStoreProps> = ({ onCheckout, onBook }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [stock, setStock] = useState<Record<string, number>>({});

  useEffect(() => {
    const init = async () => {
      const p = await api.getProducts();
      setProducts(p.filter(x => x.type === 'Voucher'));
      const stockCounts: Record<string, number> = {};
      const initialQtys: Record<string, number> = {};
      for (const prod of p) {
        stockCounts[prod.id] = await api.getStockCount(prod.id);
        initialQtys[prod.id] = 1;
      }
      setStock(stockCounts);
      setQuantities(initialQtys);
      setLoading(false);
    };
    init();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
      <p className="text-slate-400 font-medium">Loading Vault...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
          Exam <span className="gradient-text">Portfolio</span>
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
          Authorized procurement for PTE, IELTS, LanguageCert, and more. 
          Choose between instant voucher codes or a full-service registration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(p => {
          const qty = quantities[p.id] || 1;
          const inStock = stock[p.id] || 0;

          return (
            <div key={p.id} className="glass p-8 rounded-[2.5rem] border border-slate-800 flex flex-col h-full hover:border-primary-500/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl pointer-events-none">{p.icon}</div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="text-5xl">{p.icon}</div>
                <span className="text-[9px] font-black uppercase tracking-widest bg-slate-800 px-2 py-1 rounded text-slate-500">{p.category}</span>
              </div>
              
              <h3 className="text-2xl font-bold mb-2 group-hover:text-primary-400 transition-colors">{p.name}</h3>
              <p className="text-slate-400 text-sm mb-6 flex-grow leading-relaxed">{p.description}</p>
              
              <div className="space-y-4 pt-6 border-t border-slate-900">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-bold text-slate-500">Price per unit</span>
                  <span className="text-2xl font-bold text-primary-400 font-mono">${p.basePrice}</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                   <button 
                    onClick={() => onCheckout(p.id, qty)}
                    disabled={inStock < 1}
                    className="w-full py-4 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    Get Instant Voucher
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </button>
                  
                  {p.supportsFullRegistration && (
                    <button 
                      onClick={() => onBook(p.id)}
                      className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold border border-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                      Book Full Registration
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </button>
                  )}
                </div>

                <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-600 tracking-tighter px-1">
                   <span>{inStock} Vouchers Ready</span>
                   <span className="text-emerald-500">Verified Partner</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VoucherStore;
