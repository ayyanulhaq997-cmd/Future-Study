
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Product } from '../types';

interface CheckoutProcessProps {
  productId: string;
  quantity: number;
  onSuccess: (orderId: string) => void;
  onCancel: () => void;
}

const CheckoutProcess: React.FC<CheckoutProcessProps> = ({ productId, quantity, onSuccess, onCancel }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [email, setEmail] = useState('');
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'info' | 'payment'>('info');

  useEffect(() => {
    api.getProductById(productId).then(setProduct);
  }, [productId]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setProcessing(true);
    try {
      const order = await api.processPayment(productId, quantity, email);
      onSuccess(order.id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Payment failed');
      setProcessing(false);
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={!processing ? onCancel : undefined} />
      
      <div className="relative glass w-full max-w-xl rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">Secure Checkout</h2>
              <p className="text-slate-400 text-sm">Order: {quantity}x {product.name}</p>
            </div>
            <button 
              onClick={onCancel} 
              disabled={processing}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-500"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {!processing ? (
            <form onSubmit={handlePay} className="space-y-8">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Delivery Email</span>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Where should we send your codes?"
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-5 text-lg focus:border-primary-500 outline-none transition-all placeholder:text-slate-600"
                  />
                </label>
              </div>

              <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Payment Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Vouchers</span>
                    <span className="text-slate-200">{quantity} units</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800 mt-2">
                    <span className="font-bold text-slate-200">Amount to Pay</span>
                    <span className="text-2xl font-bold text-primary-400 font-mono tracking-tighter">
                      ${(product.basePrice * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
              >
                Proceed to Payment
              </button>
            </form>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="relative mb-10">
                <div className="w-20 h-20 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">Verifying Transaction...</h3>
              <p className="text-slate-400 max-w-xs mx-auto leading-relaxed">
                Communicating with the secure banking gateway. Please do not refresh this page.
              </p>
            </div>
          )}

          <div className="mt-8 flex items-center justify-center gap-6 opacity-30">
            <span className="text-[10px] font-black uppercase tracking-widest">PCI-DSS Compliant</span>
            <span className="text-[10px] font-black uppercase tracking-widest">SSL Encrypted</span>
            <span className="text-[10px] font-black uppercase tracking-widest">256-bit Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProcess;
