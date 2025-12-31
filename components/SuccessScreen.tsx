
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Order } from '../types';

interface SuccessScreenProps {
  orderId: string;
  onClose: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ orderId, onClose }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrder = () => {
    setRefreshing(true);
    api.getOrderById(orderId).then((o) => {
        setOrder(o);
        setRefreshing(false);
    });
  };

  useEffect(() => { fetchOrder(); }, [orderId]);

  if (!order) return null;

  if (order.status === 'Pending') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-in fade-in duration-700 bg-white min-h-[80vh] flex flex-col items-center justify-center">
        <div className="mb-12 inline-flex items-center justify-center w-24 h-24 bg-orange-500/10 text-orange-400 rounded-full border border-orange-500/20 animate-pulse">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>

        <h1 className="text-5xl md:text-7xl font-display font-black mb-8 tracking-tighter text-slate-900 leading-none">
          Settlement <span className="text-unicou-orange">Pending.</span>
        </h1>
        <p className="text-lg text-slate-500 font-bold mb-16 max-w-2xl mx-auto leading-relaxed">
            Your payment for order <span className="text-unicou-navy font-black">{order.id}</span> is in the <span className="text-unicou-navy font-black">Verification Node (Annex-B)</span>. Notification will be dispatched to your registered email upon release.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6 w-full max-w-md">
            <button 
              onClick={fetchOrder} disabled={refreshing}
              className="w-full px-12 py-6 bg-unicou-orange text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-3xl transition-all"
            >
              {refreshing ? 'Refreshing...' : 'CHECK STATUS'}
            </button>
            <button onClick={onClose} className="w-full px-12 py-6 bg-unicou-navy text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-3xl hover:bg-slate-900 transition-colors">BACK TO STUDENT PORTAL</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-in zoom-in duration-700">
      <div className="mb-12 inline-flex items-center justify-center w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full">
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
      </div>
      <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Payment <span className="text-emerald-500">Verified.</span></h1>
      <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto font-medium italic">"Annex-C Fulfillment Synchronized. Your assets are active below."</p>
      <div className="grid grid-cols-1 gap-6 mb-12 max-w-2xl mx-auto">
        {order.voucherCodes.map((code, idx) => (
          <div key={idx} className="bg-white p-10 rounded-[3rem] border border-slate-100 flex justify-between items-center shadow-xl">
            <span className="font-mono text-3xl font-black tracking-widest">{code}</span>
          </div>
        ))}
      </div>
      <button onClick={onClose} className="px-12 py-6 bg-unicou-navy text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-colors">RETURN TO STUDENT PORTAL</button>
    </div>
  );
};

export default SuccessScreen;
