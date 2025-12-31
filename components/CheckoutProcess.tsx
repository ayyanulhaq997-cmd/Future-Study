
import React, { useState, useEffect, useRef } from 'react';
import { api, BANK_DETAILS } from '../services/apiService';
import { Product, User } from '../types';

interface CheckoutProcessProps {
  productId: string;
  quantity: number;
  onSuccess: (orderId: string) => void;
  onCancel: () => void;
}

const CheckoutProcess: React.FC<CheckoutProcessProps> = ({ productId, quantity, onSuccess, onCancel }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Gateway' | 'BankTransfer'>('BankTransfer');
  const [bankRef, setBankRef] = useState('');
  const [fileAttached, setFileAttached] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [pricing, setPricing] = useState<{
    baseAmount: number,
    tierDiscount: number,
    promoDiscount: number,
    bankCharges: number,
    totalAmount: number
  } | null>(null);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const user = api.getCurrentUser();
    setCurrentUser(user);
    if (user && user.role === 'Agent') {
      setEmail(user.email); // Locked agent email node
    }
  }, []);

  useEffect(() => {
    api.getProductById(productId).then(p => setProduct(p || null));
    recalculatePrice();
  }, [productId, quantity, paymentMethod]);

  const recalculatePrice = async (code?: string) => {
    try {
      const p = await api.calculatePrice(productId, quantity, paymentMethod, code);
      setPricing(p);
    } catch (e) { console.error(e); }
  };

  const handleFileChange = () => { if (fileInputRef.current?.files?.length) setFileAttached(true); };

  const initializePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pricing || !product) return;

    if (!policyAccepted) {
      alert("Annex A: Verification Required - Please accept terms of purchase to proceed.");
      return;
    }

    if (paymentMethod === 'BankTransfer') {
      if (!bankRef.trim() || !fileAttached) {
        alert("CRITICAL: Settlement Reference and Proof of Transfer are mandatory for verification.");
        return;
      }
      setProcessing(true);
      try {
        const order = await api.submitBankTransfer(productId, quantity, email, bankRef);
        onSuccess(order.id);
      } catch (err: any) { alert(err.message); setProcessing(false); }
      return;
    }

    if (!currentUser?.isPlatinum) {
      alert("RESTRICTED: Credit/Debit Gateway (Platinum Partners Only). Use Bank Transfer.");
      return;
    }

    setProcessing(true);
    try {
      const rzpOrder = await api.createGatewayOrder(pricing.totalAmount);
      const options = {
        key: rzpOrder.key,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "UniCou Secure Fulfillment",
        description: `${quantity}x ${product.name}`,
        order_id: rzpOrder.id,
        handler: async (response: any) => {
          try {
            const finalOrder = await api.processPayment(productId, quantity, email, {
              orderId: rzpOrder.id,
              paymentId: response.razorpay_payment_id
            });
            onSuccess(finalOrder.id);
          } catch (err: any) { alert(err.message); setProcessing(false); }
        },
        prefill: { email },
        theme: { color: "#f15a24" },
        modal: { ondismiss: () => setProcessing(false) }
      };
      new (window as any).Razorpay(options).open();
    } catch (err: any) { alert(err.message); setProcessing(false); }
  };

  if (!product || !pricing) return null;
  const isAgent = currentUser?.role === 'Agent';

  return (
    <div className="fixed inset-0 z-[150] overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-xl rounded-[3rem] border border-slate-200 shadow-3xl overflow-hidden p-8 md:p-12 animate-in zoom-in duration-300">
        <div className="flex justify-between items-start mb-8">
          <div>
            <span className="text-[10px] font-black text-unicou-orange uppercase tracking-widest mb-1 block">Check before Order: Annex A</span>
            <h2 className="text-3xl font-display font-black text-unicou-navy tracking-tighter uppercase">{product.name} <span className="text-slate-400 font-mono text-lg">x{quantity}</span></h2>
          </div>
          <button onClick={onCancel} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors text-slate-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6" /></svg>
          </button>
        </div>

        <form onSubmit={initializePayment} className="space-y-6">
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3">
              <button type="button" onClick={() => setPaymentMethod('BankTransfer')} className={`p-6 rounded-3xl border text-left transition-all ${paymentMethod === 'BankTransfer' ? 'bg-unicou-navy/5 border-unicou-navy' : 'bg-slate-50 border-slate-100 hover:border-slate-300'}`}>
                <p className={`font-bold uppercase text-xs tracking-tight ${paymentMethod === 'BankTransfer' ? 'text-unicou-navy' : 'text-slate-500'}`}>Bank Transfer (Annex C Protocols)</p>
              </button>
              <button type="button" onClick={() => setPaymentMethod('Gateway')} className={`p-6 rounded-3xl border text-left transition-all ${paymentMethod === 'Gateway' ? 'bg-orange-50 border-unicou-orange' : 'bg-slate-50 border-slate-100 hover:border-slate-300'} ${!currentUser?.isPlatinum ? 'opacity-50' : ''}`}>
                <p className={`font-bold uppercase text-xs tracking-tight ${paymentMethod === 'Gateway' ? 'text-unicou-orange' : 'text-slate-500'}`}>Credit/Debit Card Gateway (Platinum Partners Only)</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Annex D Protocol: 4.5% Bank Charge Applies</p>
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Fulfillment Identity (Email)</label>
              <input 
                type="email" required value={email} readOnly={isAgent}
                onChange={(e) => !isAgent && setEmail(e.target.value)}
                className={`w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-900 focus:border-unicou-navy outline-none ${isAgent ? 'cursor-not-allowed opacity-70' : ''}`}
              />
            </div>

            {paymentMethod === 'BankTransfer' && (
              <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 space-y-4 animate-in slide-in-from-top-2">
                <input 
                  type="text" required placeholder="Settlement Reference # (Mandatory)"
                  className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-xs font-black outline-none"
                  value={bankRef} onChange={(e) => setBankRef(e.target.value)}
                />
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                <button type="button" onClick={() => fileInputRef.current?.click()} className={`w-full py-4 border border-dashed rounded-2xl text-[10px] font-black uppercase ${fileAttached ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:border-unicou-navy'}`}>
                  {fileAttached ? '✓ Proof Verified' : '↑ Upload Payment Proof (Mandatory)'}
                </button>
              </div>
            )}

            <label className="flex items-start gap-4 cursor-pointer">
              <input type="checkbox" checked={policyAccepted} onChange={(e) => setPolicyAccepted(e.target.checked)} className="mt-1 w-5 h-5" />
              <div className="text-[10px] text-slate-500 font-bold italic leading-relaxed">
                By ordering, I confirm items are NON-REFUNDABLE once delivered. I accept data privacy and payment liability. (Annex A Compliance)
              </div>
            </label>
          </div>

          <div className="bg-unicou-navy p-8 rounded-[2.5rem] text-white flex justify-between items-center shadow-xl">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest mb-1">Final Settlement</p>
              <p className="text-4xl font-display font-black tracking-tighter">${pricing.totalAmount.toFixed(2)}</p>
            </div>
            <button type="submit" disabled={processing} className="px-10 py-5 bg-unicou-orange hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
              {processing ? 'SYNCING...' : 'Confirm Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutProcess;
