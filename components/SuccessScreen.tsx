
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
    <div className="max-w-3xl mx-auto px-4 py-6 text-center animate-in fade-in zoom-in-95 duration-700 bg-white flex flex-col items-center">
      {/* Optimized Checkmark Node */}
      <div className="mb-6 relative">
        <div className="w-16 h-16 bg-unicou-navy/5 rounded-full flex items-center justify-center border border-unicou-navy/10 shadow-inner">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
             <svg className="w-5 h-5 text-unicou-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={5}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
             </svg>
          </div>
        </div>
      </div>

      {/* Main Headers - Scaled Down to 5xl */}
      <div className="mb-6">
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-unicou-navy leading-[0.9] uppercase block">
          ORDER
        </h1>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-unicou-orange leading-[0.9] uppercase block">
          DISPATCHED
        </h1>
      </div>
      
      {/* Audit Card - Optimized for standard screens */}
      <div className="max-w-xl w-full mb-8">
        <div className="bg-unicou-ice p-6 md:p-8 rounded-[2.5rem] border border-slate-200 text-left relative overflow-hidden shadow-xl">
           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <svg className="w-16 h-16 text-unicou-navy" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
           </div>
           
           <p className="text-lg md:text-xl text-unicou-charcoal font-black leading-tight mb-6 relative z-10 font-sans tracking-tight">
             "Requirement 2b: Thanks for your order! Your payment node is currently being audited. Your official voucher codes will deliver to your <span className="text-unicou-navy underline decoration-unicou-orange">Registered Email</span> and your <span className="text-unicou-navy">Student Hub Dashboard</span> once settlement is verified."
           </p>
           
           {/* Modular Status Pills */}
           <div className="flex flex-wrap gap-2 relative z-10 pt-4 border-t border-slate-200">
              <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[8px] font-black uppercase tracking-widest text-unicou-navy flex items-center gap-2 shadow-sm">
                <span className="w-1 h-1 bg-unicou-orange rounded-full animate-pulse" />
                EMAIL: QUEUED
              </div>
              <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-[8px] font-black uppercase tracking-widest text-unicou-navy flex items-center gap-2 shadow-sm">
                <span className="w-1 h-1 bg-unicou-navy rounded-full" />
                SYNC: ACTIVE
              </div>
           </div>
        </div>
      </div>

      <div className="w-full max-w-xs">
          <button 
            onClick={onClose} 
            className="w-full py-4 bg-unicou-navy text-white rounded-[1.5rem] font-black text-[9px] uppercase tracking-[0.2em] shadow-xl transition-all hover:bg-unicou-orange active:scale-95"
          >
            RETURN TO HUB
          </button>
      </div>
    </div>
  );
};

export default SuccessScreen;
