
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
  const [paymentMethod, setPaymentMethod] = useState<'Gateway' | 'BankTransfer'>('BankTransfer');
  const [bankRef, setBankRef] = useState('');
  const [fileAttached, setFileAttached] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const user = api.getCurrentUser();
    setCurrentUser(user);
    if (user) setEmail(user.email);
    api.getProductById(productId).then(p => setProduct(p || null));
  }, [productId]);

  const handleFileChange = () => { if (fileInputRef.current?.files?.length) setFileAttached(true); };

  const initializePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !product) return;

    if (!policyAccepted) {
      alert("ANNEX A Check: You must accept the Non-Refundable Data Policy before order registry.");
      return;
    }

    if (paymentMethod === 'BankTransfer') {
      if (!bankRef.trim() || !fileAttached) {
        alert("CRITICAL: Payment proof AND reference number are required. Protocol halted.");
        return;
      }
    }

    if (paymentMethod === 'Gateway' && !currentUser?.isPlatinum) {
      alert("RESTRICTED: Card Gateway restricted to Platinum Nodes only. Please select Bank Transfer.");
      return;
    }

    setProcessing(true);
    try {
      if (paymentMethod === 'BankTransfer') {
        const order = await api.submitBankTransfer(productId, quantity, email, bankRef);
        onSuccess(order.id);
      } else {
        alert("ANNEX D: Direct card payments restricted. System node mismatch.");
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
      <div className="relative bg-white w-full max-w-xl rounded-[3rem] border border-slate-200 shadow-3xl overflow-hidden p-8 md:p-12 animate-in zoom-in duration-300">
        <div className="flex justify-between items-start mb-8">
          <div>
            <span className="text-[10px] font-black text-unicou-orange uppercase tracking-widest mb-1 block uppercase">Annex A: Order Verification</span>
            <h2 className="text-3xl font-display font-black text-unicou-navy tracking-tighter uppercase">{product.name} <span className="text-slate-300">x{quantity}</span></h2>
          </div>
          <button onClick={onCancel} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all">
            <svg className="w-5 h-5 text-unicou-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6" /></svg>
          </button>
        </div>

        <form onSubmit={initializePayment} className="space-y-6">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setPaymentMethod('BankTransfer')} className={`p-5 rounded-2xl border text-left transition-all ${paymentMethod === 'BankTransfer' ? 'bg-unicou-navy text-white' : 'bg-slate-50 text-slate-500'}`}>
                <p className="font-black text-[10px] uppercase tracking-widest">Bank Transfer</p>
                <p className="text-[8px] opacity-70 uppercase font-bold mt-1">Direct Settlement</p>
              </button>
              <button 
                type="button" 
                onClick={() => currentUser?.isPlatinum && setPaymentMethod('Gateway')} 
                className={`p-5 rounded-2xl border text-left transition-all ${paymentMethod === 'Gateway' ? 'bg-unicou-navy text-white' : 'bg-slate-50 text-slate-500'} ${!currentUser?.isPlatinum ? 'cursor-not-allowed opacity-40' : ''}`}
              >
                <p className="font-black text-[10px] uppercase tracking-widest">Card Gateway</p>
                <p className="text-[8px] opacity-70 uppercase font-bold mt-1">{currentUser?.isPlatinum ? 'Platinum Active' : 'Platinum Only'}</p>
              </button>
            </div>

            {paymentMethod === 'BankTransfer' && (
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
                <div className="space-y-1">
                   <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Settlement Reference</label>
                   <input 
                    type="text" required placeholder="Transaction ID / Ref..."
                    className="w-full bg-white border border-slate-200 rounded-xl p-4 text-xs font-mono font-black outline-none focus:border-unicou-navy"
                    value={bankRef} onChange={(e) => setBankRef(e.target.value)}
                   />
                </div>
                <div className="space-y-1">
                   <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Proof of Transfer</label>
                   <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                   <button type="button" onClick={() => fileInputRef.current?.click()} className={`w-full py-4 border-2 border-dashed rounded-xl text-[10px] font-black uppercase transition-all ${fileAttached ? 'bg-emerald-50 text-emerald-600 border-emerald-500' : 'bg-white text-slate-400 border-slate-200 hover:border-unicou-navy'}`}>
                     {fileAttached ? '✓ RECEIPT ATTACHED' : 'UPLOAD PAYMENT PROOF (MANDATORY)'}
                   </button>
                </div>
              </div>
            )}

            <label className="flex items-start gap-4 cursor-pointer p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <input type="checkbox" checked={policyAccepted} onChange={(e) => setPolicyAccepted(e.target.checked)} className="mt-1 w-5 h-5 rounded" />
              <div className="text-[10px] text-slate-600 font-bold italic leading-relaxed">
                I confirm items are <strong>NON-REFUNDABLE</strong> and Non-Replicable. I accept liability for settlement. (Annex A Protocol)
              </div>
            </label>
          </div>

          <div className="bg-unicou-navy p-8 rounded-[2.5rem] text-white flex justify-between items-center shadow-xl">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest opacity-50 mb-1">Total Due</p>
              <p className="text-4xl font-display font-black tracking-tighter">
                {product.currency === 'GBP' ? '£' : '$'}{(product.basePrice * quantity).toFixed(2)}
              </p>
            </div>
            <button type="submit" disabled={processing} className="px-10 py-5 bg-unicou-orange hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
              {processing ? 'SYNCING...' : 'COMMIT ORDER'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutProcess;
