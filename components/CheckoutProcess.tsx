
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
  const [paymentMethod, setPaymentMethod] = useState<'BankTransfer' | 'Card'>('Card');
  const [buyerName, setBuyerName] = useState('');
  const [bankRef, setBankRef] = useState('');
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [fileAttached, setFileAttached] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [restriction, setRestriction] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      const user = api.getCurrentUser();
      const quota = await api.checkUserQuota();
      setCurrentUser(user);
      if (user) {
        setBuyerName(user.name);
        setCardData(prev => ({ ...prev, name: user.name }));
      }
      
      if (user && !user.verified) setRestriction('EMAIL_VERIFICATION_REQUIRED');
      else if (!quota.allowed) setRestriction(quota.reason || 'SECURITY_RESTRICTION');
      
      const p = await api.getProductById(productId);
      setProduct(p || null);
    };
    init();
  }, [productId]);

  const handleFileChange = () => { if (fileInputRef.current?.files?.length) setFileAttached(true); };

  const finalizeOrder = async () => {
    if (paymentMethod === 'BankTransfer' && (!bankRef.trim() || !fileAttached)) {
      alert("Verification Error: Payment reference and proof document mandatory for audit.");
      return;
    }
    if (paymentMethod === 'Card' && (!cardData.number || !cardData.expiry || !cardData.cvv)) {
      alert("Transaction Error: Please complete all mandatory card fields.");
      return;
    }

    setProcessing(true);
    try {
      const order = await api.submitBankTransfer(productId, quantity, currentUser?.email || '', buyerName, paymentMethod === 'Card' ? 'CARD_AUTH_SUCCESS' : bankRef);
      
      if (paymentMethod === 'Card') {
        setTimeout(async () => {
          await api.fulfillOrder(order.id);
          onSuccess(order.id);
        }, 2000);
      } else {
        onSuccess(order.id);
      }
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
      <div className="relative bg-white w-full max-w-5xl rounded-[3.5rem] border border-slate-200 shadow-3xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-500">
        
        {/* Header Terminal */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-unicou-ice">
           <div>
             <h2 className="text-xl font-black uppercase tracking-tighter text-unicou-navy leading-none">Procurement <span className="text-unicou-orange">Terminal</span></h2>
             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">SESSION NODE ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
           </div>
           <button onClick={onCancel} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-unicou-orange transition-colors shadow-sm text-lg">✕</button>
        </div>

        <div className="flex-grow overflow-y-auto no-scrollbar grid grid-cols-1 lg:grid-cols-12">
           
           {/* Left: Order Summary */}
           <div className="lg:col-span-5 p-8 bg-unicou-ice/50 border-r border-slate-100">
              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">01. Order Identity</h4>
              
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-xl mb-8">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-unicou-navy/5 rounded-xl flex items-center justify-center text-xl shadow-inner">{product.icon}</div>
                    <div>
                       <p className="text-[8px] font-black text-unicou-orange uppercase tracking-widest">{product.category}</p>
                       <h3 className="text-lg font-display font-black text-unicou-navy uppercase leading-tight">{product.name}</h3>
                    </div>
                 </div>
                 <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Quantity:</span>
                    <span className="text-lg font-black text-unicou-navy">x{quantity}</span>
                 </div>
              </div>

              <div className="bg-unicou-charcoal p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-5 font-display font-black text-8xl">$$</div>
                 <span className="text-[9px] font-black text-unicou-orange uppercase tracking-[0.4em] mb-2 block relative z-10">Total Settlement</span>
                 <p className="text-5xl font-display font-black tracking-tighter relative z-10">${(product.basePrice * quantity).toFixed(2)}</p>
                 <div className="mt-6 flex items-center gap-2 relative z-10">
                    <div className="w-1.5 h-1.5 bg-unicou-orange rounded-full animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/50 italic">Secure processing node active</span>
                 </div>
              </div>
           </div>

           {/* Right: Payment Method Switch & Form */}
           <div className="lg:col-span-7 p-8 space-y-8">
              <div>
                 <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 border border-slate-200 shadow-inner">
                    <button 
                      onClick={() => setPaymentMethod('Card')}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'Card' ? 'bg-unicou-navy text-white shadow-lg' : 'text-slate-400 hover:text-unicou-navy'}`}
                    >
                      Credit / Debit Card
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('BankTransfer')}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'BankTransfer' ? 'bg-unicou-navy text-white shadow-lg' : 'text-slate-400 hover:text-unicou-navy'}`}
                    >
                      Bank Settlement
                    </button>
                 </div>

                 {paymentMethod === 'BankTransfer' ? (
                   <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                      <div>
                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">02. Settlement Instructions</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-unicou-navy transition-all">
                              <p className="text-[8px] font-black text-unicou-navy uppercase mb-1">UK Node (GBP)</p>
                              <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic">"UniCou Ltd. • Barclays Bank <br/> SC: 20-00-00 • AC: 12345678"</p>
                            </div>
                            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-unicou-navy transition-all">
                              <p className="text-[8px] font-black text-unicou-orange uppercase mb-1">Dubai Node (AED)</p>
                              <p className="text-[11px] font-bold text-slate-600 leading-relaxed italic">"UniCou Hub • Emirates NBD <br/> IBAN: AE12 3456 ..."</p>
                            </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">03. Audit Verification</h4>
                        <input 
                          required 
                          className="w-full p-4 bg-unicou-ice border border-slate-200 rounded-xl font-mono font-bold text-xs outline-none focus:border-unicou-navy focus:bg-white transition-all shadow-inner" 
                          placeholder="Input Transaction ID / Reference #" 
                          value={bankRef} 
                          onChange={e => setBankRef(e.target.value)} 
                        />
                        
                        <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                        <button 
                          onClick={() => fileInputRef.current?.click()} 
                          className={`w-full py-6 border-2 border-dashed rounded-[2rem] font-black text-[9px] uppercase tracking-[0.2em] transition-all flex flex-col items-center justify-center gap-2 ${
                            fileAttached ? 'bg-unicou-navy text-white border-unicou-navy shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-white hover:border-unicou-navy'
                          }`}
                        >
                          <span className="text-2xl">{fileAttached ? '✓' : '☁️'}</span>
                          {fileAttached ? 'PROOF DOCUMENT ATTACHED' : 'UPLOAD PAYMENT PROOF (JPG/PDF)'}
                        </button>
                      </div>
                   </div>
                 ) : (
                   <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                      <div className="flex items-center gap-2 mb-4">
                        <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Instant Fulfillment Gateway Active</span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-5">
                        <div className="space-y-1.5">
                           <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Cardholder Name</label>
                           <input 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs outline-none focus:border-unicou-navy focus:bg-white transition-all shadow-inner" 
                            placeholder="John Doe"
                            value={cardData.name}
                            onChange={e => setCardData({...cardData, name: e.target.value})}
                           />
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Card Identity Node (Number)</label>
                           <input 
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-base outline-none focus:border-unicou-navy focus:bg-white transition-all shadow-inner" 
                            placeholder="0000 0000 0000 0000"
                            maxLength={19}
                            value={cardData.number}
                            onChange={e => setCardData({...cardData, number: e.target.value})}
                           />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                             <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Expiry Node</label>
                             <input 
                              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-xs outline-none focus:border-unicou-navy focus:bg-white transition-all shadow-inner" 
                              placeholder="MM/YY"
                              maxLength={5}
                              value={cardData.expiry}
                              onChange={e => setCardData({...cardData, expiry: e.target.value})}
                             />
                          </div>
                          <div className="space-y-1.5">
                             <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Security Node (CVV)</label>
                             <input 
                              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-xs outline-none focus:border-unicou-navy focus:bg-white transition-all shadow-inner" 
                              placeholder="***"
                              type="password"
                              maxLength={3}
                              value={cardData.cvv}
                              onChange={e => setCardData({...cardData, cvv: e.target.value})}
                             />
                          </div>
                        </div>
                      </div>

                      <div className="p-5 bg-unicou-navy/5 rounded-2xl border border-unicou-navy/10 flex items-start gap-3">
                         <div className="w-1 h-1 bg-unicou-navy rounded-full mt-1.5" />
                         <p className="text-[10px] text-slate-500 font-bold leading-tight italic">"Instant card payments bypass manual audit. Vouchers are dispatched from the vault immediately upon authorization."</p>
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-unicou-ice border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-3">
              <div className="w-1 h-1 bg-unicou-navy rounded-full" />
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest max-w-[150px]">Synchronized with Global Settlement Protocol.</p>
           </div>
           <button 
             onClick={finalizeOrder} 
             disabled={processing}
             className="w-full sm:w-auto px-12 py-5 bg-unicou-navy text-white rounded-[1.5rem] font-black text-[9px] uppercase tracking-[0.3em] shadow-2xl hover:bg-unicou-orange transition-all active:scale-95 disabled:opacity-20 disabled:pointer-events-none"
           >
             {processing ? (
               <span className="flex items-center gap-2">
                 <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                 {paymentMethod === 'Card' ? 'AUTHORIZING...' : 'SYNCING...'}
               </span>
             ) : (
               paymentMethod === 'Card' ? 'PROCESS INSTANT PAYMENT' : 'COMMIT BANK TRANSFER'
             )}
           </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProcess;
