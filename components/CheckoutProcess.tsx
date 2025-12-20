
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
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
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
      if (code) setPromoError('');
    } catch (e) {
      if (code) setPromoError('Invalid promo code');
    }
  };

  const handleApplyPromo = () => {
    recalculatePrice(promoCode);
  };

  const initializePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pricing || !product) return;

    setProcessing(true);
    try {
      // 1. Create a Secure Gateway Order on our Server
      const rzpOrder = await api.createGatewayOrder(pricing.totalAmount);

      // 2. Configure Razorpay Options
      const options = {
        key: rzpOrder.key,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "Nexus EDU Platform",
        description: `Purchase: ${quantity}x ${product.name}`,
        image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200&h=200&fit=crop",
        order_id: rzpOrder.id,
        handler: async (response: any) => {
          // 3. Complete order upon successful payment capture
          try {
            const finalOrder = await api.processPayment(productId, quantity, email, {
              orderId: rzpOrder.id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            }, promoCode);
            onSuccess(finalOrder.id);
          } catch (err: any) {
            alert("Payment captured but order sync failed. Support ID: " + response.razorpay_payment_id);
            setProcessing(false);
          }
        },
        prefill: {
          name: email.split('@')[0],
          email: email,
          contact: "9999999999"
        },
        notes: {
          product_id: productId,
          units: quantity
        },
        theme: {
          color: "#0ea5e9"
        },
        modal: {
          ondismiss: () => setProcessing(false)
        }
      };

      // 4. Trigger Overlay
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to initialize gateway');
      setProcessing(false);
    }
  };

  if (!product || !pricing) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={!processing ? onCancel : undefined} />
      
      <div className="relative glass w-full max-w-xl rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2 tracking-tight">Secure <span className="text-primary-400">Checkout</span></h2>
              <p className="text-slate-400 text-sm">{product.name} (x{quantity})</p>
            </div>
            <button onClick={onCancel} disabled={processing} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-500">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {!processing ? (
            <form onSubmit={initializePayment} className="space-y-6">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Delivery Email</span>
                  <input 
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm focus:border-primary-500 outline-none transition-all"
                  />
                </label>

                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Promo Code</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="flex-grow bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-primary-500"
                      placeholder="NEXUS20"
                    />
                    <button type="button" onClick={handleApplyPromo} className="px-4 py-2 glass border border-slate-700 rounded-xl text-[10px] font-bold uppercase hover:bg-slate-800">Apply</button>
                  </div>
                  {promoError && <p className="text-[10px] text-red-500 mt-2 font-bold">{promoError}</p>}
                </div>
              </div>

              <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-mono text-slate-300">${pricing.baseAmount.toFixed(2)}</span>
                </div>
                
                {pricing.tierDiscount > 0 && (
                  <div className="flex justify-between text-xs font-bold text-emerald-500">
                    <span>Tier Savings</span>
                    <span className="font-mono">-${pricing.tierDiscount.toFixed(2)}</span>
                  </div>
                )}

                {pricing.promoDiscount > 0 && (
                  <div className="flex justify-between text-xs font-bold text-purple-400">
                    <span>Promo Applied</span>
                    <span className="font-mono">-${pricing.promoDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-slate-800 mt-2">
                  <span className="font-black text-slate-200 uppercase text-[10px] tracking-widest">Payable Total</span>
                  <span className="text-3xl font-display font-bold text-emerald-400 font-mono tracking-tighter">
                    ${pricing.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary-500/20 active:scale-95 flex items-center justify-center gap-3"
                >
                  Pay via UPI/Cards
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </button>
                <div className="mt-6 flex justify-center items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" className="h-4" alt="UPI" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Visa_2021.svg/1200px-Visa_2021.svg.png" className="h-3" alt="Visa" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-4" alt="Mastercard" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/RuPay-Logo.svg/1200px-RuPay-Logo.svg.png" className="h-4" alt="RuPay" />
                </div>
              </div>
            </form>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="relative w-20 h-20 mb-8">
                 <div className="absolute inset-0 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
                 <div className="absolute inset-4 border-4 border-emerald-500/20 border-b-emerald-500 rounded-full animate-spin-slow"></div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Connecting Gateway...</h3>
              <p className="text-slate-500 text-sm max-w-xs">Initializing Indian Payment Terminal. Secure link established.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutProcess;
