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
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const user = api.getCurrentUser();
    setCurrentUser(user);
    if (user && user.role === 'Agent') {
      setEmail(user.email);
    }
  }, []);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    api.getProductById(productId).then(p => setProduct(p || null));
    recalculatePrice();
  }, [productId, quantity, paymentMethod]);

  const recalculatePrice = async (code?: string) => {
    try {
      const p = await api.calculatePrice(productId, quantity, paymentMethod, code);
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

  const handleFileChange = () => {
    if (fileInputRef.current?.files?.length) {
      setFileAttached(true);
    }
  };

  const initializePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pricing || !product) return;

    if (!policyAccepted) {
      alert("Verification Required: Items are NON-REFUNDABLE and Non-Replicable. Please accept the terms to proceed.");
      return;
    }

    if (paymentMethod === 'BankTransfer') {
      if (!bankRef.trim() || !fileAttached) {
        alert("CRITICAL REQUIREMENT: Payment Reference and Proof of Transfer are mandatory for Annex C compliance.");
        return;
      }
      
      setProcessing(true);
      try {
        const order = await api.submitBankTransfer(productId, quantity, email, bankRef);
        onSuccess(order.id);
      } catch (err: any) {
        alert(err.message || "Failed to submit transfer reference.");
        setProcessing(false);
      }
      return;
    }

    // Gateway Logic
    if (!currentUser?.isPlatinum) {
      alert("RESTRICTED: Card payments are only available to Platinum Partners. Please use Bank Transfer.");
      return;
    }

    setProcessing(true);
    try {
      const rzpOrder = await api.createGatewayOrder(pricing.totalAmount);
      const options = {
        key: rzpOrder.key,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "UniCou Store",
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
            alert(err.message || "Payment captured but sync failed.");
            setProcessing(false);
          }
        },
        prefill: { email },
        theme: { color: "#f15a24" },
        modal: { ondismiss: () => setProcessing(false) }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(err.message || 'Payment gateway failed to initialize.');
      setProcessing(false);
    }
  };

  if (!product || !pricing) return null;

  const isAgent = currentUser?.role === 'Agent';

  return (
    <div className="fixed inset-0 z-[150] overflow-y-auto scrollbar-hide">
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={!processing ? onCancel : undefined} />
      
      <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="relative bg-white w-full max-w-xl rounded-[3rem] border border-slate-200 shadow-3xl animate-in zoom-in duration-300 overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="text-[10px] font-black text-unicou-orange uppercase tracking-widest mb-1 block">Annex A: Check before Order</span>
                <h2 className="text-3xl font-display font-black text-unicou-navy tracking-tighter uppercase">{product.name} <span className="text-slate-400 font-mono text-lg">x{quantity}</span></h2>
              </div>
              <button onClick={onCancel} disabled={processing} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors text-slate-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6" /></svg>
              </button>
            </div>

            {!processing ? (
              <form onSubmit={initializePayment} className="space-y-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Protocol: Payment Method</label>
                    <div className="grid grid-cols-1 gap-3">
                        <button 
                          type="button"
                          onClick={() => setPaymentMethod('BankTransfer')}
                          className={`p-6 rounded-3xl border text-left transition-all relative overflow-hidden group ${paymentMethod === 'BankTransfer' ? 'bg-unicou-navy/5 border-unicou-navy shadow-md' : 'bg-slate-50 border-slate-100 hover:border-slate-300'}`}
                        >
                          <div className="flex justify-between items-center relative z-10">
                            <div className="flex items-center gap-4">
                                <span className="text-3xl">🏦</span>
                                <div>
                                  <p className={`font-bold uppercase text-xs tracking-tight ${paymentMethod === 'BankTransfer' ? 'text-unicou-navy' : 'text-slate-500'}`}>Manual Bank Transfer (Annex C)</p>
                                  <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">Recommended</p>
                                </div>
                            </div>
                            {paymentMethod === 'BankTransfer' && (
                              <div className="w-6 h-6 bg-unicou-navy rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                              </div>
                            )}
                          </div>
                        </button>

                        <button 
                          type="button"
                          onClick={() => setPaymentMethod('Gateway')}
                          className={`p-6 rounded-3xl border text-left transition-all group ${paymentMethod === 'Gateway' ? 'bg-unicou-orange/5 border-unicou-orange shadow-md' : 'bg-slate-50 border-slate-100 hover:border-slate-300'} ${!currentUser?.isPlatinum ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                          disabled={!currentUser?.isPlatinum}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <span className="text-3xl">💳</span>
                                <div>
                                  <p className={`font-bold uppercase text-xs tracking-tight ${paymentMethod === 'Gateway' ? 'text-unicou-orange' : 'text-slate-500'}`}>Credit/Debit Card Gateway (Platinum Partners Only)</p>
                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Annex D: 4.5% Bank Charge</p>
                                </div>
                            </div>
                          </div>
                        </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Fulfillment Email ID</label>
                    <input 
                      type="email" required value={email}
                      onChange={(e) => !isAgent && setEmail(e.target.value)}
                      placeholder="alex@gmail.com"
                      readOnly={isAgent}
                      className={`w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-900 focus:border-unicou-navy outline-none transition-all ${isAgent ? 'cursor-not-allowed opacity-70' : ''}`}
                    />
                    {isAgent && <p className="text-[9px] text-slate-400 font-bold uppercase mt-1.5 ml-1">Delivery email locked to registered Agent node.</p>}
                  </div>

                  {paymentMethod === 'BankTransfer' && (
                    <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 space-y-5 animate-in slide-in-from-top-2">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                        <p className="text-[10px] font-black text-unicou-navy uppercase tracking-widest">Annex C Settlement Node</p>
                        <span className="text-[9px] font-black text-unicou-orange uppercase tracking-widest">Verification Node</span>
                      </div>
                      
                      <div className="space-y-3">
                        {[
                          { label: "Institution", value: BANK_DETAILS.bankName },
                          { label: "Account Title", value: BANK_DETAILS.accountName },
                          { label: "Number", value: BANK_DETAILS.accountNumber, copy: true },
                          { label: "Sort Code", value: BANK_DETAILS.sortCode },
                          { label: "IBAN", value: BANK_DETAILS.iban, copy: true }
                        ].map((field) => (
                          <div key={field.label} className="flex justify-between items-center text-[11px] group">
                            <span className="text-slate-500 font-bold uppercase tracking-widest">{field.label}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-slate-900 font-black text-xs">{field.value}</span>
                              {field.copy && (
                                <button type="button" onClick={() => copyToClipboard(field.value, field.label)} className="text-slate-300 hover:text-unicou-orange transition-colors">
                                  {copiedField === field.label ? <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-5 border-t border-slate-200 space-y-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Settlement Reference # (Mandatory)</label>
                          <input 
                            type="text" required
                            placeholder="e.g. TXN-998812"
                            className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-xs font-black text-slate-900 outline-none focus:border-unicou-orange shadow-inner"
                            value={bankRef}
                            onChange={(e) => setBankRef(e.target.value)}
                          />
                        </div>

                        <div className="relative">
                          <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*,.pdf" />
                          <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-full py-4 px-4 rounded-2xl border border-dashed transition-all flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest ${fileAttached ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-slate-200 text-slate-500 hover:text-unicou-navy hover:border-unicou-navy'}`}
                          >
                            {fileAttached ? <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> Receipt Verified</> : <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg> Upload Proof (Mandatory)</>}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <label className="flex items-start gap-4 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-slate-300 text-unicou-orange focus:ring-unicou-orange mt-1"
                        checked={policyAccepted}
                        onChange={(e) => setPolicyAccepted(e.target.checked)}
                      />
                      <span className="text-[11px] text-slate-500 font-bold italic leading-relaxed">
                        I confirm that student email verification has been initialized. Items are <span className="text-red-600 uppercase font-black">NON-REFUNDABLE</span> and Non-Replicable once fulfillment commences as per Annex A.
                      </span>
                    </label>
                  </div>
                </div>

                <div className="bg-unicou-navy p-8 rounded-[2.5rem] flex flex-col gap-2 mt-8 shadow-xl">
                  <div className="flex justify-between items-center">
                    <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">Base + Strategic Discounts</p>
                    <p className="text-sm font-bold text-white/50">${(pricing.baseAmount - pricing.tierDiscount).toFixed(2)}</p>
                  </div>
                  {pricing.bankCharges > 0 && (
                    <div className="flex justify-between items-center text-orange-400">
                      <p className="text-[9px] font-black uppercase tracking-widest">Annex D: Bank Charges (4.5%)</p>
                      <p className="text-sm font-bold">+${pricing.bankCharges.toFixed(2)}</p>
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-4 border-t border-white/10 pt-4">
                    <div>
                      <p className="text-[9px] font-black text-white uppercase tracking-widest mb-1">Final Settlement Value</p>
                      <p className="text-4xl font-display font-black text-white tracking-tighter">
                        {product.currency === 'GBP' ? '£' : '$'}{pricing.totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <button type="submit" className="px-10 py-5 bg-unicou-orange hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                      Confirm Order
                    </button>
                  </div>
                </div>
                <p className="text-center text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-6">
                  Annex B Notification: Fulfillment proceeds immediately upon node verification.
                </p>
              </form>
            ) : (
              <div className="py-24 text-center">
                <div className="w-20 h-20 border-[6px] border-unicou-navy/10 border-t-unicou-navy rounded-full animate-spin mx-auto mb-10" />
                <h3 className="text-2xl font-display font-black text-unicou-navy uppercase tracking-tighter">Synchronizing...</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProcess;