
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
  const [restriction, setRestriction] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      const user = api.getCurrentUser();
      const quota = await api.checkUserQuota();
      setCurrentUser(user);
      if (user) setBuyerName(user.name);
      
      if (user && !user.verified) setRestriction('EMAIL_VERIFICATION_REQUIRED');
      else if (!quota.allowed) setRestriction(quota.reason || 'SECURITY_RESTRICTION');
      
      const p = await api.getProductById(productId);
      setProduct(p || null);
    };
    init();
  }, [productId]);

  const handleFileChange = () => { if (fileInputRef.current?.files?.length) setFileAttached(true); };

  const finalizeOrder = async () => {
    if (!bankRef.trim() || !fileAttached) {
      alert("Verification Error: Payment reference and proof document mandatory for audit.");
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

  if (restriction) return (
    <div className="fixed inset-0 z-[300] bg-unicou-charcoal/95 backdrop-blur-xl flex items-center justify-center p-6">
      <div className="bg-white max-w-lg w-full rounded-[4rem] p-12 text-center shadow-3xl border border-slate-200">
        <div className="w-24 h-24 bg-unicou-navy text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl text-4xl font-black">!</div>
        <h2 className="text-4xl font-display font-black text-unicou-navy uppercase mb-6 tracking-tighter leading-none">NODE <span className="text-unicou-orange">LOCKED</span></h2>
        <p className="text-slate-600 mb-12 font-bold italic leading-relaxed text-lg">
          "Identity verification required or daily procurement quota reached. Please sync with your email node to continue."
        </p>
        <button onClick={onCancel} className="w-full py-6 bg-unicou-navy text-white rounded-3xl font-black uppercase text-xs tracking-[0.3em] shadow-xl hover:bg-unicou-orange transition-all">RETURN TO HUB</button>
      </div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-unicou-charcoal/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-5xl rounded-[4rem] border border-slate-200 shadow-3xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-500">
        
        {/* Header Terminal */}
        <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-unicou-ice">
           <div>
             <h2 className="text-2xl font-black uppercase tracking-tighter text-unicou-navy leading-none">Procurement <span className="text-unicou-orange">Terminal</span></h2>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">SESSION NODE ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
           </div>
           <button onClick={onCancel} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-unicou-orange transition-colors shadow-sm text-xl">✕</button>
        </div>

        <div className="flex-grow overflow-y-auto no-scrollbar grid grid-cols-1 lg:grid-cols-12">
           
           {/* Left: Order Summary */}
           <div className="lg:col-span-5 p-10 bg-unicou-ice/50 border-r border-slate-100">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">01. Order Identity</h4>
              
              <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl mb-10">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-unicou-navy/5 rounded-2xl flex items-center justify-center text-2xl shadow-inner">{product.icon}</div>
                    <div>
                       <p className="text-[9px] font-black text-unicou-orange uppercase tracking-widest">{product.category}</p>
                       <h3 className="text-xl font-display font-black text-unicou-navy uppercase leading-tight">{product.name}</h3>
                    </div>
                 </div>
                 <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                    <span className="text-xs font-bold text-slate-500 uppercase">Quantity Node:</span>
                    <span className="text-xl font-black text-unicou-navy">x{quantity}</span>
                 </div>
              </div>

              <div className="bg-unicou-charcoal p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 font-display font-black text-9xl">$$</div>
                 <span className="text-[10px] font-black text-unicou-orange uppercase tracking-[0.4em] mb-4 block relative z-10">Total Settlement</span>
                 <p className="text-6xl font-display font-black tracking-tighter relative z-10">${(product.basePrice * quantity).toFixed(2)}</p>
                 <div className="mt-8 flex items-center gap-3 relative z-10">
                    <div className="w-2 h-2 bg-unicou-orange rounded-full animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/50 italic">Awaiting financial confirmation</span>
                 </div>
              </div>
           </div>

           {/* Right: Settlement Node */}
           <div className="lg:col-span-7 p-10 space-y-10">
              <div>
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">02. Settlement Instructions</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-unicou-navy transition-all">
                       <p className="text-[9px] font-black text-unicou-navy uppercase mb-2">UK Node (GBP)</p>
                       <p className="text-xs font-bold text-slate-600 leading-relaxed italic">"UniCou International Ltd. <br/> Barclays Bank <br/> SC: 20-00-00 • AC: 12345678"</p>
                    </div>
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-unicou-navy transition-all">
                       <p className="text-[9px] font-black text-unicou-orange uppercase mb-2">Dubai Node (AED)</p>
                       <p className="text-xs font-bold text-slate-600 leading-relaxed italic">"UniCou UAE Hub <br/> Emirates NBD <br/> IBAN: AE12 3456 ..."</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">03. Audit Verification</h4>
                 <div className="space-y-4">
                    <input 
                      required 
                      className="w-full p-5 bg-unicou-ice border border-slate-200 rounded-2xl font-mono font-bold text-sm outline-none focus:border-unicou-navy focus:bg-white transition-all shadow-inner" 
                      placeholder="Input Transaction ID / Reference #" 
                      value={bankRef} 
                      onChange={e => setBankRef(e.target.value)} 
                    />
                    
                    <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                    <button 
                      onClick={() => fileInputRef.current?.click()} 
                      className={`w-full py-8 border-2 border-dashed rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex flex-col items-center justify-center gap-3 ${
                        fileAttached ? 'bg-unicou-navy text-white border-unicou-navy shadow-xl' : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-white hover:border-unicou-navy'
                      }`}
                    >
                      <span className="text-3xl">{fileAttached ? '✓' : '☁️'}</span>
                      {fileAttached ? 'PROOF DOCUMENT ATTACHED' : 'UPLOAD PAYMENT PROOF (JPG/PDF)'}
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-unicou-ice border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 bg-unicou-navy rounded-full" />
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest max-w-[200px]">Data node synchronized with Global Security Audit Protocol.</p>
           </div>
           <button 
             onClick={finalizeOrder} 
             disabled={processing || !bankRef.trim() || !fileAttached}
             className="w-full sm:w-auto px-16 py-6 bg-unicou-navy text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-unicou-orange transition-all active:scale-95 disabled:opacity-20 disabled:pointer-events-none group"
           >
             {processing ? (
               <span className="flex items-center gap-3">
                 <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                 SYNCING NODE...
               </span>
             ) : (
               'COMMIT TO VAULT'
             )}
           </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProcess;
