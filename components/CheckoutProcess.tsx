
import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/apiService';
import { Product, User, ViewState } from '../types';

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
  const [paymentMethod, setPaymentMethod] = useState<'BankTransfer' | 'Gateway'>('BankTransfer');
  const [buyerName, setBuyerName] = useState('');
  const [bankRef, setBankRef] = useState('');
  const [fileAttached, setFileAttached] = useState(false);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sys = useRef({
    id: `UNICOU-${Math.random().toString(36).substr(2, 7).toUpperCase()}`,
    date: new Date().toLocaleDateString('en-GB'),
    time: new Date().toLocaleTimeString('en-GB')
  });

  useEffect(() => {
    const user = api.getCurrentUser();
    if (!user) { onNavigate({ type: 'login' }); return; }
    setCurrentUser(user);
    setBuyerName(user.name);
    api.getProductById(productId).then(p => setProduct(p || null));
  }, [productId]);

  const finalizeOrder = async () => {
    if (!buyerName.trim()) return alert("IV. Buyer Legal Name is mandatory.");
    if (paymentMethod === 'BankTransfer' && (!bankRef.trim() || !fileAttached)) {
      return alert("Bank Transfers require VII. Reference and VIII. Proof Attachment.");
    }
    
    setProcessing(true);
    try {
      let order;
      if (paymentMethod === 'BankTransfer') {
        order = await api.submitBankTransfer(productId, quantity, currentUser?.email || '', buyerName, bankRef);
      } else {
        order = await api.submitGatewayPayment(productId, quantity, currentUser?.email || '', buyerName);
      }
      onSuccess(order.id);
    } catch (err: any) {
      alert(err.message);
      setProcessing(false);
    }
  };

  if (!product || !currentUser) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-[3.5rem] border border-slate-200 shadow-3xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 my-auto">
        
        <div className="bg-unicou-navy p-8 text-white flex justify-between items-center">
           <div>
             <h2 className="text-3xl font-display font-black tracking-tighter uppercase leading-none">Procurement <span className="text-unicou-orange">Terminal</span></h2>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] mt-2 opacity-60">Mandatory 8-Point Audit Log Protocol</p>
           </div>
           <button onClick={onCancel} className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-white">✕</button>
        </div>

        <div className="flex bg-slate-100 p-2 m-10 mb-0 rounded-3xl border border-slate-200 shadow-inner">
           <button onClick={() => setPaymentMethod('BankTransfer')} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${paymentMethod === 'BankTransfer' ? 'bg-white text-unicou-navy shadow-lg' : 'text-slate-400'}`}>🏦 Bank Transfer / TRN</button>
           <button onClick={() => setPaymentMethod('Gateway')} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${paymentMethod === 'Gateway' ? 'bg-white text-unicou-navy shadow-lg' : 'text-slate-400'}`}>💳 Gateway / Digital Card</button>
        </div>

        <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">System Identity Nodes</h3>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
               <p className="text-[9px] font-black text-unicou-navy uppercase mb-2">I. Order Number</p>
               <p className="text-xl font-mono font-black text-slate-900">{sys.current.id}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                 <p className="text-[9px] font-black text-unicou-navy uppercase mb-2">II. Date</p>
                 <p className="text-lg font-bold text-slate-700">{sys.current.date}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                 <p className="text-[9px] font-black text-unicou-navy uppercase mb-2">III. Time</p>
                 <p className="text-lg font-bold text-slate-700">{sys.current.time}</p>
              </div>
            </div>
            <div className="bg-unicou-navy p-8 rounded-[2.5rem] text-white">
               <p className="text-[9px] font-black text-unicou-orange uppercase mb-2">VI. Total Settlement Amount</p>
               <p className="text-5xl font-display font-black tracking-tighter">${(product.basePrice * quantity).toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Required Audit Input</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-unicou-navy uppercase tracking-widest mb-3 ml-2">IV. Buyer Legal Name</label>
                <input className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] font-bold text-slate-900 outline-none focus:border-unicou-orange" value={buyerName} onChange={e => setBuyerName(e.target.value)} />
              </div>
              
              {paymentMethod === 'BankTransfer' ? (
                <>
                  <div>
                    <label className="block text-[10px] font-black text-unicou-navy uppercase tracking-widest mb-3 ml-2">VII. Bank TRN / Receipt Reference</label>
                    <input className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] font-mono font-black text-unicou-navy outline-none focus:border-unicou-orange" value={bankRef} onChange={e => setBankRef(e.target.value)} placeholder="ENTER TRN" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-unicou-navy uppercase tracking-widest mb-3 ml-2">VIII. Payment Proof</label>
                    <input type="file" ref={fileInputRef} onChange={() => setFileAttached(true)} className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className={`w-full py-10 border-4 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all ${fileAttached ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                      <span className="text-4xl">{fileAttached ? '✅' : '📤'}</span>
                      <p className="font-black text-[11px] uppercase tracking-widest">{fileAttached ? 'PROOF SYNCED' : 'UPLOAD RECEIPT'}</p>
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 text-center border-dashed">
                   <p className="text-sm font-bold text-slate-500 italic">"Secure Gateway sync will initialize upon clicking Commit Order. Identity verification node active."</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-10 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight max-w-xs italic">All settlements undergo multi-node audit verification. Inaccurate data results in immediate suspension.</p>
           <button onClick={finalizeOrder} disabled={processing} className="w-full md:w-auto px-16 py-6 bg-unicou-navy hover:bg-black text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all disabled:opacity-30">
             {processing ? 'ESTABLISHING SYNC...' : 'COMMIT PROCURE ORDER'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProcess;
