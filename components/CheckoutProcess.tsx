
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
  const [paymentMethod, setPaymentMethod] = useState<'BankTransfer' | 'Gateway'>('BankTransfer');
  const [buyerName, setBuyerName] = useState('');
  const [bankRef, setBankRef] = useState('');
  const [fileAttached, setFileAttached] = useState(false);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Card State Nodes
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

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
    setCardName(user.name.toUpperCase());
    api.getProductById(productId).then(p => setProduct(p || null));
  }, [productId]);

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').substring(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1-');
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').substring(0, 4);
    if (digits.length > 2) return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
    return digits;
  };

  const finalizeOrder = async () => {
    if (!buyerName.trim()) return alert("IV. Buyer Legal Name is mandatory.");
    
    if (paymentMethod === 'BankTransfer') {
      if (!bankRef.trim() || !fileAttached) {
        return alert("Bank Transfers require VII. Reference and VIII. Proof Attachment.");
      }
    } else {
      if (!cardName.trim() || cardNumber.length < 19 || cardExpiry.length < 5 || cardCvv.length < 3) {
        return alert("Please enter valid Digital Card parameters (Number, Expiry, CVV).");
      }
    }
    
    setProcessing(true);
    try {
      let order: Order;
      if (paymentMethod === 'BankTransfer') {
        order = await api.submitBankTransfer(productId, quantity, currentUser?.email || '', buyerName, bankRef);
      } else {
        // For Gateway, we use a masked card ref for the 8-column ledger
        const maskedRef = `CARD-XXXX-${cardNumber.slice(-4)}`;
        order = await api.submitGatewayPayment(productId, quantity, currentUser?.email || '', buyerName);
        // Sync the masked ref back to the order via API (simulated)
        const allOrders = await api.getOrders();
        const updated = allOrders.map(o => o.id === order.id ? { ...o, bankRef: maskedRef } : o);
        localStorage.setItem('unicou_orders_v3', JSON.stringify(updated));
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
          {/* Column 1: Order Meta Summary */}
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
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
               <p className="text-[9px] font-black text-unicou-navy uppercase mb-2">V. Asset Identity</p>
               <p className="text-lg font-black text-slate-900 uppercase truncate">{product.name}</p>
            </div>
            <div className="bg-unicou-navy p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10 font-display font-black text-6xl">VI</div>
               <p className="text-[9px] font-black text-unicou-orange uppercase mb-2 relative z-10">Total Settlement Amount</p>
               <p className="text-5xl font-display font-black tracking-tighter relative z-10">${(product.basePrice * quantity).toLocaleString()}</p>
            </div>
          </div>

          {/* Column 2: Payment Inputs */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Required Audit Input</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-unicou-navy uppercase tracking-widest mb-3 ml-2">IV. Buyer Legal Name</label>
                <input className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] font-bold text-slate-900 outline-none focus:border-unicou-orange shadow-inner" value={buyerName} onChange={e => setBuyerName(e.target.value)} />
              </div>
              
              {paymentMethod === 'BankTransfer' ? (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-unicou-navy uppercase tracking-widest mb-3 ml-2">VII. Bank TRN / Receipt Reference</label>
                    <input className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] font-mono font-black text-unicou-navy outline-none focus:border-unicou-orange shadow-inner" value={bankRef} onChange={e => setBankRef(e.target.value)} placeholder="ENTER TRN" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-unicou-navy uppercase tracking-widest mb-3 ml-2">VIII. Payment Proof</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full p-8 border-2 border-dashed rounded-[2rem] text-center cursor-pointer transition-all ${fileAttached ? 'bg-emerald-50 border-emerald-500/50 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-unicou-orange'}`}
                    >
                      <input type="file" ref={fileInputRef} className="hidden" onChange={() => setFileAttached(true)} />
                      <div className="text-2xl mb-2">{fileAttached ? '✅' : '📎'}</div>
                      <p className="text-[10px] font-black uppercase tracking-widest">{fileAttached ? 'Proof Attached' : 'Attach Transfer Receipt'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black text-unicou-navy uppercase tracking-widest mb-3 ml-2">Digital Card Parameters</label>
                    <input 
                      className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] font-mono text-lg outline-none focus:border-unicou-navy shadow-inner" 
                      placeholder="CARD NUMBER (16 DIGITS)" 
                      value={cardNumber} 
                      onChange={e => setCardNumber(formatCardNumber(e.target.value))} 
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input 
                        className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] font-mono outline-none focus:border-unicou-navy shadow-inner text-center" 
                        placeholder="MM/YY" 
                        value={cardExpiry} 
                        onChange={e => setCardExpiry(formatExpiry(e.target.value))} 
                      />
                      <input 
                        type="password"
                        className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] font-mono outline-none focus:border-unicou-navy shadow-inner text-center" 
                        placeholder="CVV" 
                        value={cardCvv} 
                        onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 4))} 
                      />
                    </div>
                    <input 
                      className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] font-black text-unicou-navy uppercase outline-none focus:border-unicou-navy shadow-inner" 
                      placeholder="NAME ON CARD" 
                      value={cardName} 
                      onChange={e => setCardName(e.target.value.toUpperCase())} 
                    />
                  </div>
                </div>
              )}

              <button 
                onClick={finalizeOrder}
                disabled={processing}
                className="w-full py-6 bg-unicou-orange hover:bg-orange-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-action transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                    PROCESSING SETTLEMENT...
                  </>
                ) : (
                  <>
                    COMMIT PROCUREMENT
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Added missing default export to satisfy App.tsx import
export default CheckoutProcess;
