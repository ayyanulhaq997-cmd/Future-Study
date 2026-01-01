
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
    <div className="max-w-4xl mx-auto px-4 py-8 text-center animate-in fade-in zoom-in-95 duration-700 bg-white flex flex-col items-center">
      {/* Centered Checkmark Node - Optimized Size */}
      <div className="mb-6 relative">
        <div className="w-20 h-20 bg-unicou-navy/5 rounded-full flex items-center justify-center border border-unicou-navy/10 shadow-inner">
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
             <svg className="w-7 h-7 text-unicou-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={5}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
             </svg>
          </div>
        </div>
      </div>

      {/* Main Headers - Scaled Down */}
      <div className="mb-8">
        <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-unicou-navy leading-[0.8] uppercase block">
          ORDER
        </h1>
        <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-unicou-orange leading-[0.8] uppercase block">
          DISPATCHED
        </h1>
      </div>
      
      {/* Audit Card - Tightened Padding & Text */}
      <div className="max-w-2xl w-full mb-10 px-4">
        <div className="bg-unicou-ice p-8 md:p-10 rounded-[3rem] border border-slate-200 text-left relative overflow-hidden shadow-xl">
           <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
              <svg className="w-24 h-24 text-unicou-navy" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
           </div>
           
           <p className="text-xl md:text-2xl text-unicou-charcoal font-black leading-snug mb-6 relative z-10 font-sans tracking-tight">
             "Requirement 2b: Thanks for your order! Your payment node is currently being audited. Your official voucher codes will deliver to your <span className="text-unicou-navy underline decoration-unicou-orange">Registered Email</span> and your <span className="text-unicou-navy">Student Hub Dashboard</span> once settlement is verified."
           </p>
           
           {/* Modular Status Pills */}
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

      <div className="w-full max-w-xs">
          <button 
            onClick={onClose} 
            className="w-full py-5 bg-unicou-navy text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl transition-all hover:bg-unicou-charcoal active:scale-95"
          >
            RETURN TO TERMINAL
          </button>
      </div>
    </div>
  );
};

export default SuccessScreen;
