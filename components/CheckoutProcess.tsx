
import React, { useState, useEffect } from 'react';
import { api, BANK_DETAILS } from '../services/apiService';
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
  const [paymentMethod, setPaymentMethod] = useState<'Gateway' | 'BankTransfer'>('BankTransfer');
  const [bankRef, setBankRef] = useState('');
  const [pricing, setPricing] = useState<{
    baseAmount: number,
    tierDiscount: number,
    promoDiscount: number,
    totalAmount: number
  } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

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

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
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
            });
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
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="text-[10px] font-black text-unicou-orange uppercase tracking-widest mb-1 block">Fulfillment Node</span>
              <h2 className="text-3xl font-display font-bold tracking-tighter">{product.name} <span className="text-slate-600 font-mono text-lg">x{quantity}</span></h2>
            </div>
            <button onClick={onCancel} disabled={processing} className="p-3 bg-slate-900 hover:bg-slate-800 rounded-2xl transition-colors text-slate-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6" /></svg>
            </button>
          </div>

          {!processing ? (
            <form onSubmit={initializePayment} className="space-y-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Delivery Email</label>
                  <input 
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm focus:border-unicou-orange outline-none transition-all placeholder:text-slate-700"
                  />
                </div>

                <div>
                   <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Payment Method</label>
                   <div className="grid grid-cols-2 gap-3">
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod('BankTransfer')}
                        className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'BankTransfer' ? 'bg-unicou-orange/10 border-unicou-orange text-unicou-orange' : 'bg-slate-900 border-slate-800 text-slate-600 hover:border-slate-700'}`}
                      >Bank Transfer</button>
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod('Gateway')}
                        className={`py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'Gateway' ? 'bg-primary-600/10 border-primary-500 text-primary-400' : 'bg-slate-900 border-slate-800 text-slate-600 hover:border-slate-700'}`}
                      >Credit/Debit Card</button>
                   </div>
                </div>

                {paymentMethod === 'BankTransfer' && (
                  <div className="bg-slate-950 p-6 rounded-[2rem] border border-slate-900 space-y-4 animate-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-2">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Direct Settlement Instructions</p>
                       <span className="text-[9px] font-bold text-emerald-500 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">Real-time Desk</span>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { label: "Bank Name", value: BANK_DETAILS.bankName },
                        { label: "Account Name", value: BANK_DETAILS.accountName },
                        { label: "Account No.", value: BANK_DETAILS.accountNumber, copy: true },
                        { label: "Sort Code", value: BANK_DETAILS.sortCode },
                        { label: "IBAN", value: BANK_DETAILS.iban, copy: true },
                        { label: "SWIFT/BIC", value: BANK_DETAILS.swift }
                      ].map((field) => (
                        <div key={field.label} className="flex justify-between items-center text-[11px] group">
                          <span className="text-slate-500 font-bold uppercase tracking-tight">{field.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-slate-300 font-bold">{field.value}</span>
                            {field.copy && (
                              <button 
                                type="button" 
                                onClick={() => copyToClipboard(field.value, field.label)}
                                className="text-slate-600 hover:text-unicou-orange transition-colors"
                              >
                                {copiedField === field.label ? (
                                  <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                ) : (
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-slate-900">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Transaction Reference (From your App)</label>
                      <input 
                        type="text" required
                        placeholder="e.g. TXN-998822"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs font-bold text-white outline-none focus:border-unicou-orange"
                        value={bankRef}
                        onChange={(e) => setBankRef(e.target.value)}
                      />
                      <p className="text-[9px] text-slate-600 italic mt-2">Codes released instantly upon manual authorization by our Finance node.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800 flex justify-between items-center mt-6">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Settlement</p>
                  <p className="text-3xl font-display font-bold text-white font-mono tracking-tighter">
                    ${pricing.totalAmount.toFixed(2)}
                  </p>
                </div>
                <button 
                  type="submit"
                  className="px-8 py-4 bg-unicou-orange hover:bg-orange-600 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95"
                >
                  Finalize Sale
                </button>
              </div>
            </form>
          ) : (
            <div className="py-20 text-center">
              <div className="w-16 h-16 border-4 border-unicou-orange/20 border-t-unicou-orange rounded-full animate-spin mx-auto mb-6" />
              <h3 className="text-xl font-bold">Synchronizing Secure Link...</h3>
              <p className="text-slate-500 mt-3 text-xs max-w-xs mx-auto leading-relaxed">Connecting to the UNICOU settlement engine. Please do not close this transmission.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutProcess;
