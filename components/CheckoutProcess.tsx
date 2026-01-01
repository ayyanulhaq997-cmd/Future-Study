
import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/apiService';
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
  const [buyerName, setBuyerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Gateway' | 'BankTransfer'>('BankTransfer');
  const [bankRef, setBankRef] = useState('');
  const [fileAttached, setFileAttached] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [quotaHit, setQuotaHit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const user = api.getCurrentUser();
    setCurrentUser(user);
    if (user) {
      setEmail(user.email);
      setBuyerName(user.name);
    }
    api.getProductById(productId).then(p => setProduct(p || null));
  }, [productId]);

  const handleFileChange = () => { if (fileInputRef.current?.files?.length) setFileAttached(true); };

  const initializePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!policyAccepted) { alert("Please confirm accuracy statement."); return; }
    if (paymentMethod === 'BankTransfer' && (!bankRef.trim() || !fileAttached)) {
      alert("Reference and Receipt are mandatory."); return;
    }

    setProcessing(true);
    try {
      const order = await api.submitBankTransfer(productId, quantity, email, buyerName, bankRef);
      onSuccess(order.id);
    } catch (err: any) { 
      if (err.message === 'QUOTA_EXCEEDED') {
        setQuotaHit(true);
      } else {
        alert(err.message); 
      }
      setProcessing(false); 
    }
  };

  if (!product) return null;

  if (quotaHit) {
    return (
      <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
        <div className="bg-white max-w-lg w-full rounded-[3.5rem] p-12 text-center border border-slate-200 shadow-3xl">
          <div className="w-24 h-24 bg-unicou-navy text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h2 className="text-3xl font-display font-black text-unicou-navy uppercase tracking-tighter mb-6">Security Restriction</h2>
          <div className="space-y-6 mb-12">
            <p className="text-slate-800 text-xl font-black leading-tight uppercase tracking-tight">
              For your security, further orders are restricted. 
            </p>
            <p className="text-slate-500 text-base font-bold italic leading-relaxed border-t border-slate-100 pt-6">
              "Kindly reach out to our support team for assistance."
            </p>
          </div>
          <div className="space-y-4">
             <button onClick={onCancel} className="w-full py-5 bg-unicou-navy text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl">Return to Store</button>
             <div className="pt-4 flex flex-col items-center gap-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Authorized Contact Node</p>
                <a href="mailto:connect@unicou.uk" className="text-xs font-black text-unicou-orange uppercase hover:underline transition-all">connect@unicou.uk</a>
             </div>
          </div>
        </div>
      </div>
    );
  }

  const tierDiscountRate = currentUser?.role === 'Agent Partner/Prep Center' ? (currentUser.tier || 1) * 0.05 : 0;
  const netUnitPrice = product.basePrice * (1 - tierDiscountRate);
  const totalSettlement = netUnitPrice * quantity;

  const getLimitLabel = () => {
    if (currentUser?.role === 'Student') return "Limit: 1 Unit / 24hr";
    return paymentMethod === 'Gateway' ? "Limit: 3 Units / 24hr" : "Limit: 10 Units / 24hr";
  };

  return (
    <div className="fixed inset-0 z-[150] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] border border-slate-200 shadow-3xl overflow-hidden animate-in zoom-in duration-300 max-h-[92vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-slate-50">
          <div>
            <h2 className="text-xl font-display font-black text-unicou-navy uppercase tracking-tighter leading-none">{product.name}</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">{getLimitLabel()}</p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6" /></svg>
          </button>
        </div>

        <form onSubmit={initializePayment} className="flex-grow overflow-y-auto p-6 space-y-5 no-scrollbar">
          <div className="space-y-4">
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Legal Identity Node</label>
              <input 
                type="text" required value={buyerName} onChange={e => setBuyerName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-bold outline-none focus:border-unicou-navy transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setPaymentMethod('BankTransfer')} className={`p-4 rounded-2xl border text-left transition-all ${paymentMethod === 'BankTransfer' ? 'bg-unicou-navy text-white shadow-lg' : 'bg-slate-50 text-slate-500'}`}>
                <p className="font-black text-[10px] uppercase tracking-widest leading-none mb-1">Bank Sync</p>
                <p className="text-[8px] opacity-70 font-bold">{currentUser?.role === 'Student' ? 'Limit: 1' : 'Limit: 10'}</p>
              </button>
              <button type="button" onClick={() => setPaymentMethod('Gateway')} className={`p-4 rounded-2xl border text-left transition-all ${paymentMethod === 'Gateway' ? 'bg-unicou-navy text-white shadow-lg' : 'bg-slate-50 text-slate-500'}`}>
                <p className="font-black text-[10px] uppercase tracking-widest leading-none mb-1">Card Sync</p>
                <p className="text-[8px] opacity-70 font-bold">{currentUser?.role === 'Student' ? 'Limit: 1' : 'Limit: 3'}</p>
              </button>
            </div>

            {paymentMethod === 'BankTransfer' && (
              <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 space-y-4 shadow-inner">
                <div>
                   <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Settlement Reference</label>
                   <input type="text" required placeholder="Transaction ID / Reference" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-mono font-black outline-none" value={bankRef} onChange={(e) => setBankRef(e.target.value)} />
                </div>
                <div>
                   <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Upload Receipt Proof</label>
                   <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                   <button type="button" onClick={() => fileInputRef.current?.click()} className={`w-full py-3 border-2 border-dashed rounded-xl text-[9px] font-black uppercase transition-all ${fileAttached ? 'bg-emerald-50 text-emerald-600 border-emerald-500' : 'bg-white text-slate-400 border-slate-200 hover:border-unicou-navy'}`}>
                     {fileAttached ? '✓ RECEIPT ATTACHED' : 'CLICK TO ATTACH PROOF'}
                   </button>
                </div>
              </div>
            )}

            <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">OFFICIAL RATE (x{quantity}):</span>
                  <span className="text-xs font-bold text-slate-400 line-through tracking-tight">${(product.basePrice * quantity).toFixed(2)}</span>
               </div>
               {tierDiscountRate > 0 && (
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">PARTNER TIER DISCOUNT:</span>
                    <span className="text-xs font-bold text-emerald-600 tracking-tight">-${((product.basePrice - netUnitPrice) * quantity).toFixed(2)}</span>
                 </div>
               )}
               <div className="h-px bg-slate-200 mb-4" />
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-unicou-navy uppercase tracking-widest">EST. SETTLEMENT:</span>
                  <span className="text-2xl font-display font-black text-unicou-navy tracking-tighter leading-none">${totalSettlement.toFixed(2)}</span>
               </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
              <input type="checkbox" checked={policyAccepted} onChange={(e) => setPolicyAccepted(e.target.checked)} className="mt-0.5 w-4 h-4 rounded text-unicou-navy" />
              <p className="text-[10px] text-slate-500 font-bold italic leading-relaxed">
                Confirming accuracy. Digital assets are <span className="text-red-600 uppercase font-black">Non-Refundable</span> once fulfillment starts.
              </p>
            </label>
          </div>
        </form>

        <div className="p-6 bg-unicou-navy text-white flex justify-end items-center shadow-2xl">
          <button 
            onClick={initializePayment}
            disabled={processing} 
            className={`px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl active:scale-95 bg-white text-unicou-navy hover:bg-slate-100 disabled:opacity-50`}
          >
            {processing ? 'SYNCING...' : 'CONFIRM ORDER'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProcess;
