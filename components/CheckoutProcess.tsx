
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
  const [buyerName, setBuyerName] = useState('');
  const [bankRef, setBankRef] = useState('');
  const [fileAttached, setFileAttached] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [restriction, setRestriction] = useState<string | null>(null);
  const [showAnnexA, setShowAnnexA] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      const user = api.getCurrentUser();
      const quota = await api.checkUserQuota();
      
      setCurrentUser(user);
      if (user) setBuyerName(user.name);
      
      // Requirement 2c Check
      if (user && !user.verified && user.role === 'Student') {
         setRestriction('EMAIL_VERIFICATION_REQUIRED');
      } else if (!quota.allowed) {
        setRestriction(quota.reason || 'SECURITY_RESTRICTION');
      }

      const p = await api.getProductById(productId);
      setProduct(p || null);
    };
    init();
  }, [productId]);

  const handleFileChange = () => { 
    if (fileInputRef.current?.files?.length) setFileAttached(true); 
  };

  const finalizeOrder = async () => {
    // Requirement 2a Enforcement
    if (!bankRef.trim() || !fileAttached) {
      alert("Enforcement Protocol: System requires mandatory payment proof upload and a valid reference number to proceed.");
      return;
    }

    setProcessing(true);
    try {
      const order = await api.submitBankTransfer(productId, quantity, currentUser?.email || '', buyerName, bankRef);
      onSuccess(order.id);
    } catch (err: any) {
      alert(err.message);
      setProcessing(false);
    }
  };

  if (restriction) {
    return (
      <div className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6">
        <div className="bg-white max-w-lg w-full rounded-[3.5rem] p-12 text-center shadow-3xl">
          <div className="w-24 h-24 bg-unicou-navy text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h2 className="text-3xl font-display font-black text-unicou-navy uppercase mb-6 tracking-tighter leading-none">Procurement <br /><span className="text-unicou-orange">Locked</span></h2>
          <p className="text-slate-600 mb-12 font-bold italic leading-relaxed">
            {restriction === 'DAILY_QUOTA_REACHED' 
              ? "Requirement 2f: Students are restricted to ONE voucher per 24 hours. Please contact Live Support to authorize your next purchase node."
              : restriction === 'EMAIL_VERIFICATION_REQUIRED'
              ? "Requirement 2c: Email verification is mandatory for every purchase. Please synchronize your identity node via the dashboard."
              : "Institutional Halt: The global order shield is currently active. Delivery nodes are temporarily disabled."}
          </p>
          <button onClick={onCancel} className="w-full py-5 bg-unicou-navy text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-slate-900 transition-all">Return to Store</button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      {showAnnexA ? (
        /* Requirement 2d: ANNEX A - Pre-Order Audit */
        <div className="bg-white max-w-xl w-full rounded-[3.5rem] p-12 md:p-16 shadow-3xl animate-in zoom-in-95 duration-300">
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-unicou-navy/5 rounded-full text-unicou-navy text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              <span className="w-1.5 h-1.5 bg-unicou-navy rounded-full animate-pulse" />
              ANNEX A: Final Order Review
           </div>
           <h2 className="text-3xl font-display font-black text-unicou-navy uppercase mb-4 tracking-tighter leading-none">Confirm Settlement <span className="text-unicou-orange">Details</span></h2>
           <p className="text-slate-500 mb-10 font-bold italic leading-relaxed">"Verify your procurement data before committing the record. Delivery will be initialized to your registered email upon confirmation."</p>
           
           <div className="space-y-6 mb-12">
              <div className="flex justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Node</span>
                 <span className="text-sm font-black text-slate-900 uppercase">{product.name} (x{quantity})</span>
              </div>
              <div className="flex justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity Node</span>
                 <span className="text-sm font-black text-slate-900 uppercase">{buyerName}</span>
              </div>
              <div className="flex justify-between p-6 bg-unicou-navy/5 rounded-2xl border border-unicou-navy/20">
                 <span className="text-[10px] font-black text-unicou-navy tracking-widest">Net Settlement</span>
                 <span className="text-2xl font-display font-black text-unicou-navy tracking-tighter">${(product.basePrice * quantity).toFixed(2)}</span>
              </div>
           </div>

           <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => setShowAnnexA(false)} className="flex-1 py-5 bg-slate-100 hover:bg-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Back to Edit</button>
              <button onClick={finalizeOrder} disabled={processing} className="flex-[2] py-5 bg-unicou-orange text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-action hover:bg-orange-600 transition-all active:scale-95">
                {processing ? 'COMMITTING TO VAULT...' : 'AUTHORIZE & COMMIT'}
              </button>
           </div>
        </div>
      ) : (
        <div className="relative bg-white w-full max-w-md rounded-[2.5rem] border border-slate-200 shadow-3xl overflow-hidden flex flex-col max-h-[92vh]">
          <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
            <div>
               <h2 className="text-xl font-black uppercase tracking-tighter text-unicou-navy leading-none">{product.name}</h2>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">Procurement Terminal</p>
            </div>
            <button onClick={onCancel} className="p-2 hover:bg-white rounded-xl transition-all text-slate-400">✕</button>
          </div>

          <div className="p-8 space-y-8 overflow-y-auto no-scrollbar">
             <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 ml-2">Registered Student Name</label>
                <input className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold outline-none focus:border-unicou-navy shadow-inner" value={buyerName} onChange={e => setBuyerName(e.target.value)} />
             </div>

             <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner space-y-6">
                <div className="space-y-2">
                   <h4 className="text-[10px] font-black text-unicou-navy uppercase tracking-widest ml-1">Payment Reference Number (Req)</h4>
                   <input required className="w-full p-4 bg-white rounded-xl border border-slate-200 font-mono font-bold text-sm outline-none focus:border-unicou-navy" placeholder="Transaction ID or Receipt #" value={bankRef} onChange={e => setBankRef(e.target.value)} />
                </div>
                
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className={`w-full py-5 border-2 border-dashed rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                    fileAttached 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-500' 
                    : 'bg-white text-slate-400 border-slate-200 hover:border-unicou-navy'
                  }`}
                >
                  {fileAttached ? '✓ PROOF NODE ATTACHED' : 'UPLOAD PAYMENT PROOF'}
                </button>
             </div>

             <div className="bg-slate-950 p-8 rounded-[2rem] text-white relative overflow-hidden">
                <div className="flex justify-between items-center mb-1.5 opacity-50 relative z-10">
                  <span className="text-[9px] font-black uppercase tracking-widest">SUBTOTAL</span>
                  <span className="text-sm font-bold font-mono">${(product.basePrice * quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center relative z-10">
                  <span className="text-[11px] font-black text-unicou-vibrant uppercase tracking-widest">NET PAYABLE</span>
                  <span className="text-4xl font-display font-black tracking-tighter leading-none">${(product.basePrice * quantity).toFixed(2)}</span>
                </div>
             </div>
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
             <button 
               onClick={() => setShowAnnexA(true)} 
               disabled={!bankRef.trim() || !fileAttached}
               className="px-12 py-5 bg-unicou-navy text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
             >
               Review & Confirm
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutProcess;
