
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
    <div className="max-w-3xl mx-auto px-4 py-12 text-center animate-in fade-in zoom-in-95 duration-700 bg-white flex flex-col items-center">
      <div className="mb-10 relative">
        <div className="w-20 h-20 bg-unicou-navy/5 rounded-full flex items-center justify-center border border-unicou-navy/10 shadow-inner">
           <svg className="w-10 h-10 text-unicou-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={5}>
             <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
           </svg>
        </div>
      </div>

      <div className="mb-10">
        <h1 className="text-5xl font-display font-black tracking-tighter text-unicou-navy uppercase leading-none">ORDER <span className="text-unicou-orange">DISPATCHED</span></h1>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Annex B: Notification After Completion</p>
      </div>
      
      <div className="max-w-xl w-full mb-12">
        <div className="bg-unicou-ice p-10 rounded-[3rem] border border-slate-200 text-left relative overflow-hidden shadow-2xl">
           <p className="text-xl text-slate-900 font-black leading-tight mb-8 relative z-10 font-sans tracking-tight">
             "Requirement 14.I.b: Thank you for your procurement! Your settlement node is currently being verified. Official voucher codes will deliver to <span className="text-unicou-navy underline decoration-unicou-orange">{order.customerEmail}</span> and your <span className="text-unicou-navy">Student Hub Terminal</span> instantly upon audit approval."
           </p>
           
           <div className="flex flex-wrap gap-3 relative z-10 pt-6 border-t border-slate-200">
              <div className="px-4 py-2 bg-white border border-slate-200 rounded-full text-[9px] font-black uppercase tracking-widest text-unicou-navy flex items-center gap-2 shadow-sm">
                <span className="w-1.5 h-1.5 bg-unicou-orange rounded-full animate-pulse" />
                EMAIL: QUEUED
              </div>
              <div className="px-4 py-2 bg-white border border-slate-200 rounded-full text-[9px] font-black uppercase tracking-widest text-unicou-navy flex items-center gap-2 shadow-sm">
                <span className="w-1.5 h-1.5 bg-unicou-navy rounded-full" />
                SYNC: ACTIVE
              </div>
           </div>
        </div>
      </div>

      <button 
        onClick={onClose} 
        className="w-full max-w-xs py-5 bg-unicou-navy text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl transition-all hover:bg-black active:scale-95"
      >
        RETURN TO HUB TERMINAL
      </button>
    </div>
  );
};

export default SuccessScreen;
