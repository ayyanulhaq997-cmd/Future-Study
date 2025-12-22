
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
  const [paymentMethod, setPaymentMethod] = useState<'Gateway' | 'BankTransfer'>('Gateway');
  const [bankRef, setBankRef] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [pricing, setPricing] = useState<{
    baseAmount: number,
    tierDiscount: number,
    promoDiscount: number,
    totalAmount: number
  } | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    api.getProductById(productId).then(setProduct);
    recalculatePrice();
  }, [productId, quantity]);

  const recalculatePrice = async (code?: string) => {
    try {
      const p = await api.calculatePrice(productId, quantity, code);
      setPricing(p);
    } catch (e) {
      console.error(e);
    }
  };

  const initializePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pricing || !product) return;

    setProcessing(true);
    
    if (paymentMethod === 'BankTransfer') {
      if (!bankRef) {
        alert("Bank Reference Required for manual settlement.");
        setProcessing(false);
        return;
      }
      try {
        const order = await api.submitBankTransfer(productId, quantity, email, bankRef);
        onSuccess(order.id);
      } catch (err) {
        alert("Failed to submit transfer reference.");
        setProcessing(false);
      }
      return;
    }

    try {
      const rzpOrder = await api.createGatewayOrder(pricing.totalAmount);
      const options = {
        key: rzpOrder.key,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "UNICOU Digital Store",
        description: `${quantity}x ${product.name}`,
        order_id: rzpOrder.id,
        handler: async (response: any) => {
          try {
            const finalOrder = await api.processPayment(productId, quantity, email, {
              orderId: rzpOrder.id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            }, promoCode);
            onSuccess(finalOrder.id);
          } catch (err: any) {
            alert("Payment captured but sync failed. Reference: " + response.razorpay_payment_id);
            setProcessing(false);
          }
        },
        prefill: { email },
        theme: { color: "#f15a24" },
        modal: { ondismiss: () => setProcessing(false) }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      alert('Gateway initialization failed');
      setProcessing(false);
    }
  };

  if (!product || !pricing) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={!processing ? onCancel : undefined} />
      
      <div className="relative glass w-full max-w-xl rounded-[3.5rem] border border-slate-800 overflow-hidden shadow-3xl animate-in zoom-in duration-300">
        <div className="p-10 md:p-12">
          <div className="flex justify-between items-start mb-10">
            <div>
              <span className="text-[10px] font-black text-unicou-orange uppercase tracking-widest mb-1 block">Fulfillment Node</span>
              <h2 className="text-4xl font-display font-bold tracking-tighter">{product.name} <span className="text-slate-600 font-mono text-xl">x{quantity}</span></h2>
            </div>
            <button onClick={onCancel} disabled={processing} className="p-3 bg-slate-900 hover:bg-slate-800 rounded-2xl transition-colors text-slate-500">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6" /></svg>
            </button>
          </div>

          {!processing ? (
            <form onSubmit={initializePayment} className="space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Secure Delivery Address</label>
                  <input 
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 text-sm focus:border-unicou-orange outline-none transition-all placeholder:text-slate-700"
                  />
                </div>

                <div>
                   <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Payment Infrastructure</label>
                   <div className="grid grid-cols-2 gap-3">
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod('Gateway')}
                        className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'Gateway' ? 'bg-primary-600/10 border-primary-500 text-primary-400' : 'bg-slate-900 border-slate-800 text-slate-600 hover:border-slate-700'}`}
                      >Gateway Sync</button>
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod('BankTransfer')}
                        className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'BankTransfer' ? 'bg-unicou-orange/10 border-unicou-orange text-unicou-orange' : 'bg-slate-900 border-slate-800 text-slate-600 hover:border-slate-700'}`}
                      >Bank Transfer</button>
                   </div>
                </div>

                {paymentMethod === 'BankTransfer' && (
                  <div className="bg-slate-950 p-6 rounded-3xl border border-slate-900 space-y-4 animate-in slide-in-from-top-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Direct Settlement Details</p>
                    <div className="text-xs text-slate-400 space-y-1 font-mono">
                      <p>Bank: UNICOU HUB INT</p>
                      <p>Account: 9988221100</p>
                      <p>Swift: UNICOUXXXX</p>
                    </div>
                    <input 
                      type="text" required
                      placeholder="Enter Transaction Reference (e.g. TRX-123)"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-bold text-white outline-none focus:border-unicou-orange"
                      value={bankRef}
                      onChange={(e) => setBankRef(e.target.value)}
                    />
                    <p className="text-[9px] text-slate-600 italic">Vouchers released manually upon Teller verification.</p>
                  </div>
                )}
              </div>

              <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Settlement</p>
                  <p className="text-4xl font-display font-bold text-white font-mono tracking-tighter">
                    ${pricing.totalAmount.toFixed(2)}
                  </p>
                </div>
                <button 
                  type="submit"
                  className="px-10 py-5 bg-unicou-orange hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-unicou-orange/20 active:scale-95"
                >
                  Confirm Sale
                </button>
              </div>
            </form>
          ) : (
            <div className="py-24 text-center">
              <div className="w-20 h-20 border-4 border-unicou-orange/20 border-t-unicou-orange rounded-full animate-spin mx-auto mb-8" />
              <h3 className="text-2xl font-bold">Synchronizing Node...</h3>
              <p className="text-slate-500 mt-4 text-sm max-w-xs mx-auto">Connecting to secure settlement engine. Please do not close this connection.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutProcess;
