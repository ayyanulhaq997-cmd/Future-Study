
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
  const [bankLastFour, setBankLastFour] = useState('');
  const [bankRef, setBankRef] = useState('');
  const [fileAttached, setFileAttached] = useState(false);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Card Nodes
  const [card, setCard] = useState({ name: '', num: '', exp: '', cvv: '' });

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
    setCard(prev => ({ ...prev, name: user.name.toUpperCase() }));
    api.getProductById(productId).then(p => setProduct(p || null));
  }, [productId]);

  const finalizeOrder = async () => {
    if (!buyerName.trim()) return alert("IV. Buyer Legal Name is mandatory.");
    if (!bankLastFour.trim() || bankLastFour.length !== 4) return alert("V. Mandatory: 4-digit Bank A/C identifier required for audit.");
    
    if (paymentMethod === 'BankTransfer' && (!bankRef.trim() || !fileAttached)) {
      return alert("Bank Transfers require VII. Reference and VIII. Proof Attachment.");
    }

    if (paymentMethod === 'Gateway' && (card.num.length < 16 || !card.exp.includes('/'))) {
      return alert("Please enter valid Digital Card parameters.");
    }
    
    setProcessing(true);
    try {
      let order: Order;
      if (paymentMethod === 'BankTransfer') {
        order = await api.submitBankTransfer(productId, quantity, currentUser?.email || '', buyerName, bankRef, bankLastFour);
      } else {
        order = await api.submitGatewayPayment(productId, quantity, currentUser?.email || '', buyerName, bankLastFour);
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
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Order Identification</h3>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
               <p className="text-[9px] font-black text-unicou-navy uppercase mb-2">I. Order Number</p>
               <p className="text-xl font-mono font-black text-slate-900">{sys.current.id}</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
               <p className="text-[9px] font-black text-unicou-navy uppercase mb-2">VI. Asset Node</p>
               <p className="text-lg font-black text-slate-900 uppercase truncate">{product.name}</p>
            </div>
            <div className="bg-unicou-navy p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
               <p className="text-[9px] font-black text-unicou-orange uppercase mb-2">VIII. Settlement Amount</p>
               <p className="text-5xl font-display font-black tracking-tighter">${(product.basePrice * quantity).toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Required Audit Input</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-unicou-navy uppercase tracking-widest mb-3 ml-2">IV. Buyer Legal Name</label>
                <input className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] font-bold text-slate-900 outline-none focus:border-unicou-orange shadow-inner" value={buyerName} onChange={e => setBuyerName(e.target.value)} />
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-unicou-navy uppercase tracking-widest mb-3 ml-2">V. Bank A/C (Last 4 Digits)</label>
                <input maxLength={4} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] font-mono font-black text-unicou-navy outline-none focus:border-unicou-orange shadow-inner" value={bankLastFour} onChange={e => setBankLastFour(e.target.value.replace(/\D/g, ''))} placeholder="0000" />
              </div>

              {paymentMethod === 'BankTransfer' ? (
                <div className="animate-in slide-in-from-right duration-300 space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-unicou-navy uppercase tracking-widest mb-3 ml-2">VII. Bank TRN / Receipt Reference</label>
                    <input className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] font-mono font-black text-unicou-navy outline-none focus:border-unicou-orange shadow-inner" value={bankRef} onChange={e => setBankRef(e.target.value)} placeholder="ENTER TRN" />
                  </div>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full p-8 border-2 border-dashed rounded-[2rem] text-center cursor-pointer transition-all ${fileAttached ? 'bg-emerald-50 border-emerald-500/50 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-unicou-orange'}`}
                  >
                    <input type="file" ref={fileInputRef} className="hidden" onChange={() => setFileAttached(true)} />
                    <div className="text-2xl mb-2">{fileAttached ? '✅' : '📎'}</div>
                    <p className="text-[10px] font-black uppercase tracking-widest">{fileAttached ? 'Proof Attached' : 'VIII. Attach Transfer Receipt'}</p>
                  </div>
                </div>
              ) : (
                <div className="animate-in slide-in-from-right duration-300 space-y-4">
                  <input className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-lg outline-none" placeholder="CARD NUMBER (16 DIGITS)" value={card.num} onChange={e => setCard({...card, num: e.target.value.replace(/\D/g, '').substring(0, 16)})} />
                  <div className="grid grid-cols-2 gap-4">
                    <input className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-center font-mono" placeholder="MM/YY" value={card.exp} onChange={e => setCard({...card, exp: e.target.value.substring(0, 5)})} />
                    <input className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-center font-mono" placeholder="CVV" type="password" value={card.cvv} onChange={e => setCard({...card, cvv: e.target.value.substring(0, 4)})} />
                  </div>
                </div>
              )}

              <button 
                onClick={finalizeOrder}
                disabled={processing}
                className="w-full py-6 bg-unicou-orange hover:bg-orange-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-action transition-all active:scale-95 disabled:opacity-50"
              >
                {processing ? 'SYNCHRONIZING...' : 'COMMIT PROCUREMENT'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProcess;
