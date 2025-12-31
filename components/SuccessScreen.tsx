
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
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrder = () => {
    setRefreshing(true);
    api.getOrderById(orderId).then((o) => {
        setOrder(o);
        setRefreshing(false);
    });
  };

  useEffect(() => {
    fetchOrder();
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
      alert(`Automated Invoice for ${orderId} generated and ready.`);
    }, 1500);
  };

  if (!order) return null;

  // SYSTEM LOGIC: ANNEX B Update
  if (order.status === 'Pending') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-in fade-in duration-700 bg-white min-h-[80vh] flex flex-col items-center justify-center">
        <div className="mb-12 inline-flex items-center justify-center w-24 h-24 bg-orange-500/10 text-orange-400 rounded-full border border-orange-500/20 shadow-2xl animate-pulse">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>

        <h1 className="text-5xl md:text-7xl font-display font-black mb-8 tracking-tighter text-slate-900 leading-none">
          Settlement <span className="text-unicou-orange">Pending.</span>
        </h1>
        <p className="text-lg text-slate-500 font-bold mb-16 max-w-2xl mx-auto leading-relaxed">
            Your payment for order <span className="text-unicou-navy font-black">{order.id}</span> has been received and is currently in the <span className="text-unicou-navy font-black">Verification Node</span>. Once an administrator approves the settlement, your vouchers will be released here and via email.
        </p>

        <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 mb-16 max-w-2xl mx-auto shadow-premium w-full text-left relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-orange-500/20" />
            <div className="flex items-center justify-between mb-10">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Protocol Status</span>
                <span className="text-[10px] font-black text-unicou-orange uppercase tracking-widest bg-orange-50 px-4 py-2 rounded-full border border-orange-100">Awaiting Approval</span>
            </div>
            <p className="text-slate-500 text-base italic leading-relaxed font-semibold text-center px-4">
                Verification usually takes between 10-60 minutes during standard operating hours. You can safely close this page; your assets will also appear in your student dashboard.
            </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6 w-full max-w-md">
            <button 
              onClick={fetchOrder}
              disabled={refreshing}
              className="w-full px-12 py-6 bg-unicou-navy text-white rounded-3xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-3xl hover:bg-slate-950 active:scale-95"
            >
              {refreshing ? <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" /> : null}
              CHECK VERIFICATION STATUS
            </button>
            <button 
              onClick={onClose}
              className="w-full px-12 py-6 bg-white border-2 border-slate-200 text-slate-900 rounded-3xl font-black text-xs uppercase tracking-widest transition-all hover:bg-slate-50 active:scale-95"
            >
              BACK TO STORE
            </button>
        </div>
      </div>
    );
  }

  // VERIFIED STATE
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-in zoom-in duration-700">
      <div className="mb-12 inline-flex items-center justify-center w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 shadow-2xl shadow-emerald-500/20">
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
      </div>

      <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Payment <span className="text-emerald-500">Verified.</span></h1>
      <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto font-medium">
        Your order <strong>{order.id}</strong> was approved. 
        Your secure vouchers are listed below and have been dispatched to <strong>{order.customerEmail}</strong>.
      </p>

      <div className="grid grid-cols-1 gap-6 mb-12 max-w-2xl mx-auto">
        {order.voucherCodes.map((code, idx) => (
          <div key={idx} className="bg-white group relative p-10 rounded-[3rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-unicou-vibrant/30 transition-all overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-unicou-vibrant opacity-20 group-hover:opacity-100 transition-opacity" />
            <div className="text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Voucher {idx + 1} of {order.quantity}</span>
              <p className="text-slate-900 font-black text-lg">{order.productName}</p>
            </div>
            
            <div className="flex items-center gap-4 bg-slate-50 px-8 py-5 rounded-2xl border border-slate-100 shadow-inner w-full md:w-auto justify-center md:justify-start group-hover:bg-unicou-navy group-hover:text-white transition-all">
              <span className="font-mono text-3xl font-black tracking-widest">{code}</span>
              <button 
                onClick={() => copyToClipboard(code)}
                className="p-2 text-slate-300 hover:text-unicou-orange transition-colors"
                title="Copy to Clipboard"
              >
                {copied === code ? (
                  <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <button 
          onClick={onClose}
          className="px-10 py-5 bg-unicou-navy hover:bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl"
        >
          BACK TO STORE
        </button>
        <button 
          onClick={simulateInvoiceDownload}
          disabled={downloading}
          className="px-10 py-5 bg-white border-2 border-slate-200 text-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {downloading ? (
            <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              DOWNLOAD INVOICE
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;
