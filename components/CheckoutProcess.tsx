
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
  const [buyerName, setBuyerName] = useState('');
  const [bankRef, setBankRef] = useState('');
  const [fileAttached, setFileAttached] = useState(false);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [sys] = useState({
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
    if (!buyerName.trim() || !bankRef.trim() || !fileAttached) {
      alert("Fields IV, VII, and VIII are mandatory for audit compliance.");
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

  if (!product || !currentUser) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-[3.5rem] border border-slate-200 shadow-3xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500 my-auto">
        
        {/* Ledger Header */}
        <div className="bg-unicou-navy p-8 text-white flex justify-between items-center">
           <div className="relative z-10">
             <h2 className="text-3xl font-display font-black tracking-tighter uppercase leading-none">Procurement <span className="text-unicou-orange">Terminal</span></h2>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] mt-2 opacity-60 text-unicou-orange">Mandatory 8-Point Audit Log Protocol</p>
           </div>
           <button onClick={onCancel} className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-2xl transition-all">✕</button>
        </div>

        <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Read Only Columns (I, II, III, V, VI) */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">System Generated Nodes</h3>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
               <p className="text-[9px] font-black text-unicou-navy uppercase mb-2">I. Order Number</p>
               <p className="text-xl font-mono font-black text-slate-900">{sys.id}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
                 <p className="text-[9px] font-black text-unicou-navy uppercase mb-2">II. Date</p>
                 <p className="text-lg font-bold text-slate-700">{sys.date}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
                 <p className="text-[9px] font-black text-unicou-navy uppercase mb-2">III. Time</p>
                 <p className="text-lg font-bold text-slate-700">{sys.time}</p>
              </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 shadow-inner">
               <p className="text-[9px] font-black text-unicou-navy uppercase mb-2">V. Product Name</p>
               <p className="text-lg font-black text-slate-900 uppercase leading-tight">{product.name}</p>
            </div>
            <div className="bg-unicou-navy p-8 rounded-[2.5rem] text-white shadow-xl">
               <p className="text-[9px] font-black text-unicou-orange uppercase mb-2">VI. Total Amount</p>
               <p className="text-5xl font-display font-black tracking-tighter">${(product.basePrice * quantity).toLocaleString()}</p>
            </div>
          </div>

          {/* User Input Columns (IV, VII, VIII) */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Audit Requirements</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-unicou-navy uppercase tracking-widest mb-3 ml-2">IV. Buyer Legal Name</label>
                <input className="w-full p-5 bg-white border-2 border-slate-100 rounded-[1.5rem] font-bold text-slate-900 outline-none focus:border-unicou-orange" value={buyerName} onChange={e => setBuyerName(e.target.value)} />
              </div>
              <div>
                <label className="block text-[10px] font-black text-unicou-navy uppercase tracking-widest mb-3 ml-2">VII. Payment Reference Number</label>
                <input className="w-full p-5 bg-white border-2 border-slate-100 rounded-[1.5rem] font-mono font-black text-unicou-navy outline-none focus:border-unicou-orange" value={bankRef} onChange={e => setBankRef(e.target.value)} placeholder="TRN / Receipt ID" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-unicou-navy uppercase tracking-widest mb-3 ml-2">VIII. Payment Proof</label>
                <input type="file" ref={fileInputRef} onChange={() => setFileAttached(true)} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className={`w-full py-10 border-4 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center gap-4 ${fileAttached ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                  <span className="text-4xl">{fileAttached ? '✅' : '📤'}</span>
                  <p className="font-black text-[11px] uppercase tracking-widest">{fileAttached ? 'PROOF SYNCED' : 'UPLOAD RECEIPT'}</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-10 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight max-w-xs">Data verification active. Inaccurate entries result in settlement rejection.</p>
           <button onClick={finalizeOrder} disabled={processing || !buyerName || !bankRef || !fileAttached} className="w-full md:w-auto px-16 py-6 bg-unicou-navy hover:bg-black text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all disabled:opacity-30">
             {processing ? 'SYNCING REGISTRY...' : 'COMMIT PROCURE ORDER'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProcess;
