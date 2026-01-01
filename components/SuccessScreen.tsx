
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Order } from '../types';

interface SuccessScreenProps {
  orderId: string;
  onClose: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ orderId, onClose }) => {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    api.getOrderById(orderId).then(setOrder);
  }, [orderId]);

  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-in zoom-in duration-1000 bg-white min-h-[80vh] flex flex-col items-center justify-center">
      <div className="mb-12 inline-flex items-center justify-center w-28 h-28 bg-emerald-50 text-emerald-500 rounded-full border border-emerald-100 shadow-2xl relative">
        <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping" />
        <svg className="w-14 h-14 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
      </div>

      {/* Requirement 2e: ANNEX B Protocol Node */}
      <div className="flex items-center gap-3 mb-6 bg-slate-50 px-5 py-2 rounded-full border border-slate-200">
         <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
         <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">ANNEX B: DISPATCH INITIALIZED</span>
      </div>

      <h1 className="text-5xl md:text-[6rem] font-display font-black mb-8 tracking-tighter text-slate-950 leading-[0.9] uppercase">
        ORDER <span className="text-emerald-500">DISPATCHED</span>
      </h1>
      
      <div className="space-y-10 max-w-2xl mx-auto mb-16">
        <div className="bg-slate-50 p-12 rounded-[4rem] border border-slate-200 text-left relative overflow-hidden shadow-inner group">
           <div className="absolute top-0 right-0 p-10 opacity-10 font-display text-9xl group-hover:scale-110 transition-transform select-none">📬</div>
           <p className="text-2xl text-slate-900 font-bold leading-relaxed italic mb-8 relative z-10">
             "Requirement 2b: Thanks for your order! Your payment node is currently being audited. Your official voucher codes will deliver to your <strong>Registered Email</strong> and your <strong>Student Hub Dashboard</strong> once settlement is verified."
           </p>
           
           <div className="flex flex-wrap gap-4 relative z-10">
              <div className="px-5 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-3 shadow-sm">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Email Status: Queued
              </div>
              <div className="px-5 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-unicou-navy flex items-center gap-3 shadow-sm">
                <span className="w-1.5 h-1.5 bg-unicou-navy rounded-full animate-pulse" />
                Dashboard Sync: Active
              </div>
           </div>
        </div>
        
        <div className="flex justify-between items-center px-10">
           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Order Reference: {order.id}</p>
           <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Audit Node: PENDING_SETTLEMENT</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-6 w-full max-w-md">
          <button onClick={onClose} className="w-full px-12 py-6 bg-unicou-navy text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-3xl transition-all hover:bg-slate-900 active:scale-95">CONTINUE TO STUDENT HUB</button>
      </div>
    </div>
  );
};

export default SuccessScreen;
