
import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/apiService';
import { Product, User, ViewState, Order } from '../types';

interface CheckoutProcessProps {
  productId: string;
  quantity: number;
  onSuccess: (orderId: string) => void;
  onCancel: () => void;
  onNavigate: (v: ViewState) => void;
}

const CheckoutProcess: React.FC<CheckoutProcessProps> = ({ productId, quantity, onSuccess, onCancel, onNavigate }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'BankTransfer' | 'Card'>('Card');
  const [buyerName, setBuyerName] = useState('');
  const [bankRef, setBankRef] = useState('');
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [fileAttached, setFileAttached] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [restriction, setRestriction] = useState<string | null>(null);
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      const user = api.getCurrentUser();
      setCurrentUser(user);
      
      if (!user) {
        setRestriction('SIGNUP_REQUIRED');
      } else {
        setBuyerName(user.name);
        setCardData(prev => ({ ...prev, name: user.name }));
        
        // Initial quota check (Req 14.I.f / Point 6)
        const quota = await api.checkUserQuota(paymentMethod, quantity);
        if (user && !user.verified) setRestriction('EMAIL_VERIFICATION_REQUIRED');
        else if (!quota.allowed) {
          setShowLimitPopup(true);
        }
      }
      const p = await api.getProductById(productId);
      setProduct(p || null);
    };
    init();
  }, [productId, paymentMethod, quantity]);

  const handleFileChange = () => { if (fileInputRef.current?.files?.length) setFileAttached(true); };

  const finalizeOrder = async () => {
    const quota = await api.checkUserQuota(paymentMethod, quantity);
    if (!quota.allowed) { setShowLimitPopup(true); return; }

    // Enforce Req 14.I.a (Mandatory Payment Proof & Ref)
    if (paymentMethod === 'BankTransfer' && (!bankRef.trim() || !fileAttached)) {
      alert("Requirement 14.I.a: System cannot move forward without Upload Payment Proof and Reference Number.");
      return;
    }
    if (paymentMethod === 'Card' && (!cardData.number || !cardData.expiry || !cardData.cvv)) {
      alert("Transaction Error: Complete mandatory card identity fields.");
      return;
    }

    setProcessing(true);
    try {
      let order: Order; // Explicitly typed to fix build error TS7034/TS7005
      if (paymentMethod === 'Card') {
        order = await api.submitGatewayPayment(productId, quantity, currentUser?.email || '', buyerName);
        // Simulate real gateway processing and ensure the order ID is passed to success
        setTimeout(async () => { 
          await api.fulfillOrder(order.id); 
          onSuccess(order.id); 
        }, 2000);
      } else {
        order = await api.submitBankTransfer(productId, quantity, currentUser?.email || '', buyerName, bankRef);
        onSuccess(order.id);
      }
    } catch (err: any) {
      alert(err.message);
      setProcessing(false);
    }
  };

  // Quota Limit POP UP Notification Node (Point 6)
  if (showLimitPopup) return (
    <div className="fixed inset-0 z-[400] bg-unicou-charcoal/95 backdrop-blur-2xl flex items-center justify-center p-6 text-center">
      <div className="bg-white max-w-lg w-full rounded-[3.5rem] p-12 shadow-3xl border border-slate-200 animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-orange-50 text-unicou-orange rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-inner">
           <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h2 className="text-3xl font-display font-black text-slate-900 uppercase tracking-tighter mb-6">Order Limit Reached</h2>
        <p className="text-slate-600 mb-12 font-bold italic text-lg leading-relaxed px-4">
          "Thank you for your order! Your card, payment, and exam security are our top priority. For additional orders, please contact UniCou support team."
        </p>
        <div className="space-y-4">
          <a href="https://wa.me/4470000000" target="_blank" rel="noopener noreferrer" className="block w-full py-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl transition-all">CONNECT WITH SUPPORT</a>
          <button onClick={onCancel} className="w-full py-6 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-3xl font-black uppercase text-xs tracking-widest transition-all">RETURN TO HUB</button>
        </div>
      </div>
    </div>
  );

  if (restriction === 'SIGNUP_REQUIRED') return (
    <div className="fixed inset-0 z-[300] bg-unicou-charcoal/95 backdrop-blur-xl flex items-center justify-center p-6 text-center">
      <div className="bg-white max-w-md w-full rounded-[2.5rem] p-10 shadow-3xl border border-slate-200">
        <h2 className="text-2xl font-display font-black text-unicou-navy uppercase mb-4 tracking-tight">Identity Node Required</h2>
        <p className="text-slate-600 mb-10 font-bold italic">"Mandatory identity establishment required for procurement."</p>
        <button onClick={() => onNavigate({type: 'signup'})} className="w-full py-5 bg-unicou-orange text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-orange-600 transition-all">INITIALIZE SIGNUP</button>
      </div>
    </div>
  );

  if (restriction) return (
    <div className="fixed inset-0 z-[300] bg-unicou-charcoal/95 backdrop-blur-xl flex items-center justify-center p-6 text-center">
      <div className="bg-white max-w-lg w-full rounded-[3rem] p-12 shadow-3xl border border-slate-200">
        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner text-3xl font-black">!</div>
        <h2 className="text-3xl font-display font-black text-slate-900 uppercase mb-4 tracking-tighter">NODE RESTRICTED</h2>
        <p className="text-slate-600 mb-10 font-bold italic text-lg leading-relaxed">
          {restriction === 'EMAIL_VERIFICATION_REQUIRED' ? '"Complete identity verification before settlement node authorization."' : '"Identity sync required or quota reached. Return to Store for manual sync."'}
        </p>
        <button onClick={onCancel} className="w-full py-6 bg-unicou-navy text-white rounded-3xl font-black uppercase text-xs tracking-[0.3em] shadow-xl hover:bg-unicou-orange transition-all">RETURN TO HUB</button>
      </div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-unicou-charcoal/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] border border-slate-200 shadow-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-500">
        <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-unicou-ice">
           <div>
             <h2 className="text-lg font-black uppercase tracking-tighter text-unicou-navy leading-none">Procurement <span className="text-unicou-orange">Terminal</span></h2>
             <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1">UniCou Ltd • Secure Session • Immutable ID Locked</p>
           </div>
           <button onClick={onCancel} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-unicou-orange transition-colors text-sm">✕</button>
        </div>

        <div className="flex-grow overflow-y-auto no-scrollbar grid grid-cols-1 lg:grid-cols-12">
           <div className="lg:col-span-5 p-8 bg-unicou-ice/30 border-r border-slate-100">
              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">Annex A: Check Before End of Order</h4>
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg mb-8">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-unicou-navy/5 rounded-2xl flex items-center justify-center text-2xl shadow-inner">{product.icon}</div>
                    <div>
                       <p className="text-[8px] font-black text-unicou-orange uppercase tracking-widest">{product.category}</p>
                       <h3 className="text-lg font-display font-black text-unicou-navy uppercase leading-tight">{product.name}</h3>
                    </div>
                 </div>
                 <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-black text-slate-500 uppercase">Quantity:</span>
                    <span className="text-lg font-display font-black text-unicou-navy">x{quantity}</span>
                 </div>
              </div>

              {/* Point 12: Standardized Pricing Card (Correct Labels) */}
              <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-[#64748b] uppercase tracking-widest">Official Rate:</span>
                  <span className="text-sm font-bold text-[#64748b] line-through">${(product.basePrice * 1.1 * quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-[#f15a24] uppercase tracking-tighter">Exclusive Exam Discounts:</span>
                  <span className="text-xs font-black text-[#f15a24]">-${(product.basePrice * 0.1 * quantity).toFixed(2)}</span>
                </div>
                <div className="h-px bg-slate-200" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-[#004a61] uppercase tracking-widest mb-1">Exclusive Discounted Price:</span>
                  <span className="text-4xl font-display font-black text-[#004a61] tracking-tighter leading-none">${(product.basePrice * quantity).toFixed(2)}</span>
                </div>
              </div>
           </div>

           <div className="lg:col-span-7 p-8 space-y-8">
              <div>
                 <div className="flex bg-slate-100 p-1 rounded-2xl mb-8 border border-slate-200 shadow-inner">
                    <button onClick={() => setPaymentMethod('Card')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'Card' ? 'bg-unicou-navy text-white shadow-md' : 'text-slate-400 hover:text-unicou-navy'}`}>Card Payment</button>
                    <button onClick={() => setPaymentMethod('BankTransfer')} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'BankTransfer' ? 'bg-unicou-navy text-white shadow-md' : 'text-slate-400 hover:text-unicou-navy'}`}>Bank Transfer</button>
                 </div>

                 {paymentMethod === 'BankTransfer' ? (
                   <div className="space-y-8 animate-in fade-in slide-in-from-right-2">
                      <div className="space-y-4">
                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1">Req 14.I.a: Audit Verification Terminal</h4>
                        <input className="w-full p-4 bg-unicou-ice border border-slate-200 rounded-2xl font-mono font-bold text-[12px] outline-none focus:border-unicou-navy shadow-inner" placeholder="Transaction Reference / Order ID" value={bankRef} onChange={e => setBankRef(e.target.value)} />
                        <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                        <button onClick={() => fileInputRef.current?.click()} className={`w-full py-5 border-2 border-dashed rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex flex-col items-center justify-center gap-2 ${fileAttached ? 'bg-unicou-navy text-white border-unicou-navy shadow-xl' : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-white'}`}>
                          <span className="text-2xl">{fileAttached ? '✓' : '☁️'}</span>
                          {fileAttached ? 'PAYMENT PROOF ATTACHED' : 'UPLOAD SETTLEMENT PROOF (MANDATORY)'}
                        </button>
                      </div>
                   </div>
                 ) : (
                   <div className="space-y-6 animate-in fade-in slide-in-from-left-2">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                           <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Card Terminal Auth</label>
                           <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono font-black text-[14px] outline-none" placeholder="0000 0000 0000 0000" maxLength={19} value={cardData.number} onChange={e => setCardData({...cardData, number: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2"><label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Expiry</label><input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono font-bold text-[12px] outline-none" placeholder="MM/YY" maxLength={5} value={cardData.expiry} onChange={e => setCardData({...cardData, expiry: e.target.value})} /></div>
                          <div className="space-y-2"><label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Security Node (CVV)</label><input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono font-bold text-[12px] outline-none" placeholder="***" type="password" maxLength={3} value={cardData.cvv} onChange={e => setCardData({...cardData, cvv: e.target.value})} /></div>
                        </div>
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>

        <div className="p-8 bg-unicou-ice border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-unicou-navy rounded-full" />
                 <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em]">Delivery Node: {currentUser?.email}</p>
              </div>
              <p className="text-[7px] text-slate-400 uppercase font-black pl-4">Immutable Identity Locked • delivery on registered email only</p>
           </div>
           <button onClick={finalizeOrder} disabled={processing} className="w-full sm:w-auto px-16 py-5 bg-[#004a61] text-white rounded-[1.2rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-3xl hover:bg-black transition-all active:scale-95 disabled:opacity-20">
             {processing ? 'AUTHORIZING NODE...' : 'COMMIT SETTLEMENT'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProcess;
