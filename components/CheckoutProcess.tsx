
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
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const LIMITS = {
    Gateway: 3,
    BankTransfer: 10
  };

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
    if (!email || !product || !buyerName) return;

    if (quantity > LIMITS[paymentMethod]) {
      setShowLimitPopup(true);
      return;
    }

    if (!policyAccepted) {
      alert("Please accept the accuracy confirm statement to proceed.");
      return;
    }

    if (paymentMethod === 'BankTransfer') {
      if (!bankRef.trim() || !fileAttached) {
        alert("Payment reference and transfer receipt are mandatory for bank settlements.");
        return;
      }
    }

    setProcessing(true);
    try {
      if (paymentMethod === 'BankTransfer') {
        const order = await api.submitBankTransfer(productId, quantity, email, buyerName, bankRef);
        onSuccess(order.id);
      } else {
        alert("The card gateway is currently undergoing scheduled maintenance. Please use Bank Transfer for immediate fulfillment.");
        setProcessing(false);
      }
    } catch (err: any) { 
      alert(err.message); 
      setProcessing(false); 
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[150] overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      {showLimitPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-3xl border border-slate-100 overflow-hidden p-10 relative animate-in zoom-in-95 duration-500">
              <div className="vibrant-strip absolute top-0 left-0 w-full !h-2" />
              <div className="flex justify-center mb-8">
                 <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shadow-inner">
                    <svg className="w-10 h-10 text-unicou-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                 </div>
              </div>
              <h3 className="text-2xl font-display font-black text-unicou-navy text-center uppercase tracking-tight mb-6 leading-none">Security Quota Alert</h3>
              <div className="space-y-6 text-center">
                 <p className="text-slate-900 font-bold italic leading-relaxed text-lg">Your card and payment security are our top priority.</p>
                 <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 text-left space-y-4 shadow-inner">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-200 pb-3">Official Limits</p>
                    <div className="flex justify-between items-center px-2">
                       <span className="text-[11px] font-black text-slate-600 uppercase">Card Payment Max</span>
                       <span className="text-xl font-black text-unicou-orange">3 Exams</span>
                    </div>
                    <div className="flex justify-between items-center px-2">
                       <span className="text-[11px] font-black text-slate-600 uppercase">Bank Transfer Max</span>
                       <span className="text-xl font-black text-unicou-navy">10 Exams</span>
                    </div>
                 </div>
                 <div className="flex flex-col gap-3 pt-4">
                    <button onClick={() => setShowLimitPopup(false)} className="w-full py-5 bg-unicou-navy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-slate-950 transition-all">ADJUST QUANTITY</button>
                    <a href="https://wa.me/4470000000" target="_blank" rel="noopener noreferrer" className="w-full py-5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center">CONTACT SUPPORT SYNC</a>
                 </div>
              </div>
           </div>
        </div>
      )}

      <div className="relative bg-white w-full max-w-xl rounded-[3rem] border border-slate-200 shadow-3xl overflow-hidden p-8 md:p-12 animate-in zoom-in duration-300">
        <div className="flex justify-between items-start mb-8">
          <div>
            <span className="text-[10px] font-black text-unicou-navy uppercase tracking-widest mb-1 block">Checkout Node</span>
            <h2 className="text-3xl font-display font-black text-unicou-navy tracking-tighter uppercase">{product.name} <span className="text-slate-300">x{quantity}</span></h2>
          </div>
          <button onClick={onCancel} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all">
            <svg className="w-5 h-5 text-unicou-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6" /></svg>
          </button>
        </div>

        <form onSubmit={initializePayment} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Buyer Full Name</label>
                <input 
                  type="text" required value={buyerName} onChange={e => setBuyerName(e.target.value)}
                  placeholder="Legal Name Node"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-unicou-navy outline-none focus:border-unicou-navy shadow-inner"
                />
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Registered Email ID</label>
                <input 
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Communication Node"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-unicou-navy outline-none focus:border-unicou-navy shadow-inner"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setPaymentMethod('BankTransfer')} className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden ${paymentMethod === 'BankTransfer' ? 'bg-unicou-navy text-white shadow-lg scale-[1.02]' : 'bg-slate-50 text-slate-500 hover:border-unicou-navy/20'}`}>
                <p className="font-black text-[10px] uppercase tracking-widest">Bank Transfer</p>
                <p className="text-[8px] opacity-70 uppercase font-bold mt-1">Limit: 10 Units</p>
              </button>
              <button type="button" onClick={() => setPaymentMethod('Gateway')} className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden ${paymentMethod === 'Gateway' ? 'bg-unicou-navy text-white shadow-lg scale-[1.02]' : 'bg-slate-50 text-slate-500 hover:border-unicou-navy/20'}`}>
                <p className="font-black text-[10px] uppercase tracking-widest">Card Payment</p>
                <p className="text-[8px] opacity-70 uppercase font-bold mt-1">Limit: 3 Units</p>
              </button>
            </div>

            {paymentMethod === 'BankTransfer' && (
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4 shadow-inner">
                <div className="space-y-1">
                   <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Payment Reference Number</label>
                   <input type="text" required placeholder="Transaction ID..." className="w-full bg-white border border-slate-200 rounded-xl p-4 text-xs font-mono font-black outline-none shadow-sm" value={bankRef} onChange={(e) => setBankRef(e.target.value)} />
                </div>
                <div className="space-y-1">
                   <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Upload Transfer Receipt</label>
                   <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                   <button type="button" onClick={() => fileInputRef.current?.click()} className={`w-full py-4 border-2 border-dashed rounded-xl text-[10px] font-black uppercase transition-all ${fileAttached ? 'bg-emerald-50 text-emerald-600 border-emerald-500' : 'bg-white text-slate-400 border-slate-200 hover:border-unicou-navy'}`}>
                     {fileAttached ? '✓ RECEIPT ATTACHED' : 'CLICK TO UPLOAD RECEIPT'}
                   </button>
                </div>
              </div>
            )}

            <label className="flex items-start gap-4 cursor-pointer p-5 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white transition-colors group">
              <div className="mt-0.5">
                <input type="checkbox" checked={policyAccepted} onChange={(e) => setPolicyAccepted(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-unicou-navy focus:ring-unicou-navy cursor-pointer" />
              </div>
              <div className="text-[11px] text-slate-600 font-bold italic leading-relaxed">
                I confirm accuracy. Items are <span className="text-red-600 uppercase font-black">Non-Refundable</span> and cannot be exchanged once fulfillment begins.
              </div>
            </label>
          </div>

          <div className="bg-unicou-navy p-8 rounded-[2.5rem] text-white flex justify-between items-center shadow-3xl relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[9px] font-black uppercase tracking-widest opacity-50 mb-1">Total Settlement</p>
              <p className="text-4xl font-display font-black tracking-tighter">{product.currency === 'GBP' ? '£' : '$'}{(product.basePrice * quantity).toFixed(2)}</p>
            </div>
            <button type="submit" disabled={processing} className={`relative z-10 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50 ${quantity > LIMITS[paymentMethod] ? 'bg-red-600' : 'bg-unicou-orange hover:bg-orange-600'}`}>
              {processing ? 'SYNCING...' : quantity > LIMITS[paymentMethod] ? 'LIMIT EXCEEDED' : 'CONFIRM ORDER'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutProcess;
