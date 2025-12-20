import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Order } from '../types';

interface SuccessScreenProps {
  orderId: string;
  onClose: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ orderId, onClose }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    api.getOrderById(orderId).then(setOrder);
  }, [orderId]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const simulateInvoiceDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`Automated Invoice for ${orderId} generated and ready. (Simulation: File saved to virtual drive)`);
    }, 1500);
  };

  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <div className="mb-12 inline-flex items-center justify-center w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 shadow-2xl shadow-emerald-500/20">
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
      </div>

      <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Payment <span className="text-emerald-500">Verified.</span></h1>
      <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
        Your order <strong>{order.id}</strong> was processed successfully. 
        Your secure vouchers are listed below and have also been sent to <strong>{order.customerEmail}</strong> via automated fulfillment.
      </p>

      <div className="grid grid-cols-1 gap-6 mb-12 max-w-2xl mx-auto">
        {order.voucherCodes.map((code, idx) => (
          <div key={idx} className="glass group relative p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-primary-500/30 transition-all overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary-500 opacity-20 group-hover:opacity-100 transition-opacity" />
            <div className="text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 block">Voucher {idx + 1} of {order.quantity}</span>
              <p className="text-slate-400 font-bold text-sm">{order.productName}</p>
            </div>
            
            <div className="flex items-center gap-4 bg-slate-950 px-6 py-4 rounded-2xl border border-slate-800 shadow-inner w-full md:w-auto justify-center md:justify-start">
              <span className="font-mono text-2xl font-bold text-primary-400 tracking-wider">{code}</span>
              <button 
                onClick={() => copyToClipboard(code)}
                className="p-2 text-slate-500 hover:text-white transition-colors"
                title="Copy to Clipboard"
              >
                {copied === code ? (
                  <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button 
          onClick={onClose}
          className="px-10 py-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all border border-slate-800"
        >
          Back to Store
        </button>
        <button 
          onClick={simulateInvoiceDownload}
          disabled={downloading}
          className="px-10 py-5 glass hover:bg-slate-800 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {downloading ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              Download Invoice
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;