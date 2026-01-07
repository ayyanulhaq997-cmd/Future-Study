
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

  // Expanded Card & Billing Nodes
  const [card, setCard] = useState({ 
    name: '', 
    email: '',
    street1: '',
    street2: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    num: '', 
    exp: '', 
    cvv: '' 
  });

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
    // Initialize card fields with user data for verification baseline
    setCard(prev => ({ 
      ...prev, 
      name: user.name,
      email: user.email,
      country: user.country || ''
    }));
    api.getProductById(productId).then(p => setProduct(p || null));
  }, [productId]);

  const finalizeOrder = async () => {
    if (!buyerName.trim()) return alert("Audit Failure: Buyer Legal Name is mandatory.");
    if (!bankLastFour.trim() || bankLastFour.length !== 4) return alert("Audit Failure: 4-digit Bank A/C identifier required.");
    
    if (paymentMethod === 'BankTransfer') {
      if (!bankRef.trim() || !fileAttached) {
        return alert("Bank Transfers require TRN Reference and Proof Attachment.");
      }
    }

    if (paymentMethod === 'Gateway') {
      // MANDATORY IDENTITY MATCH RESTRICTION (Security Protocol V4.3)
      // Checks registered Name, email ID and billing Country
      const nameMatch = card.name.trim().toLowerCase() === currentUser?.name.toLowerCase();
      const emailMatch = card.email.trim().toLowerCase() === currentUser?.email.toLowerCase();
      const countryMatch = card.country.trim().toLowerCase() === (currentUser?.country || '').toLowerCase();

      if (!nameMatch || !emailMatch || !countryMatch) {
        alert("SECURITY RESTRICTION TRIGGERED: Your registered UNICOU identity (Name, Email, Country) DOES NOT MATCH your card payment details. Card procurement blocked. Redirecting to Bank Payment Protocol for manual verification.");
        setPaymentMethod('BankTransfer');
        return;
      }

      // Billing Address Validation
      if (!card.street1 || !card.city || !card.state || !card.postcode || !card.country) {
        return alert("Full Billing Address is required for card processing.");
      }

      // Card Format Validation
      if (card.num.length < 16 || !card.exp.includes('/') || card.cvv.length < 3) {
        return alert("Invalid Card parameters. Please check your inputs.");
      }
    }
    
    setProcessing(true);
    try {
      let order: Order;
      if (paymentMethod === 'BankTransfer') {
        order = await api.submitBankTransfer(productId, quantity, currentUser?.email || '', buyerName, bankRef, bankLastFour);
      } else {
        // Digital settlement node
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
        
        <div className="bg-unicou-navy p-8 text-white flex justify-between items-center shrink-0">
           <div>
             <h2 className="text-3xl font-display font-black tracking-tighter uppercase leading-none">Procurement <span className="text-unicou-orange">Terminal</span></h2>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] mt-2 opacity-60">Fulfillment Audit Protocol V4.2</p>
           </div>
           <button onClick={onCancel} className="w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-white">✕</button>
        </div>

        <div className="flex bg-slate-100 p-2 m-8 mb-0 rounded-3xl border border-slate-200 shadow-inner shrink-0">
           <button onClick={() => setPaymentMethod('BankTransfer')} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${paymentMethod === 'BankTransfer' ? 'bg-white text-unicou-navy shadow-lg' : 'text-slate-400'}`}>🏦 Bank Transfer / TRN</button>
           <button onClick={() => setPaymentMethod('Gateway')} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${paymentMethod === 'Gateway' ? 'bg-white text-unicou-navy shadow-lg' : 'text-slate-400'}`}>💳 Gateway / Digital Card</button>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 overflow-y-auto max-h-[70vh] no-scrollbar">
          <div className="space-y-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Identity Verification Baseline</h3>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
               <p className="text-[9px] font-black text-unicou-navy uppercase mb-2">Order Identification</p>
               <p className="text-xl font-mono font-black text-slate-900">{sys.current.id}</p>
            </div>
            
            <div className="bg-unicou-navy p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
               <p className="text-[9px] font-black text-unicou-orange uppercase mb-2">Settlement Amount</p>
               <p className="text-5xl font-display font-black tracking-tighter">${(product.basePrice * quantity).toLocaleString()}</p>
            </div>
            
            <div className="p-6 border border-slate-100 rounded-3xl bg-slate-50/30">
               <p className="text-[9px] font-black text-slate-400 uppercase mb-4 tracking-widest border-b pb-2">Registered Profile Nodes</p>
               <div className="space-y-3">
                 <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-500 uppercase">Profile Name:</span>
                    <span className="text-unicou-navy">{currentUser.name}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-500 uppercase">Profile Email:</span>
                    <span className="text-unicou-navy">{currentUser.email}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-500 uppercase">Profile Country:</span>
                    <span className="text-unicou-navy">{currentUser.country || 'N/A'}</span>
                 </div>
               </div>
               <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-xl">
                 <p className="text-[8px] font-black text-unicou-orange uppercase leading-relaxed italic">
                   Note: Card Holder Name, Email, and Billing Country MUST match your profile node exactly or transaction will be forced to Bank Transfer.
                 </p>
               </div>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Settlement Input</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-unicou-navy uppercase tracking-widest mb-3 ml-2">Buyer Name (Verified Registry)</label>
                <input className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] font-bold text-slate-900 outline-none focus:border-unicou-orange shadow-inner" value={buyerName} onChange={e => setBuyerName(e.target.value)} />
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-unicou-navy uppercase tracking-widest mb-3 ml-2">Bank A/C Identifier (Last 4)</label>
                <input maxLength={4} className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] font-mono font-black text-unicou-navy outline-none focus:border-unicou-orange shadow-inner" value={bankLastFour} onChange={e => setBankLastFour(e.target.value.replace(/\D/g, ''))} placeholder="0000" />
              </div>

              {paymentMethod === 'BankTransfer' ? (
                <div className="animate-in slide-in-from-right duration-300 space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-unicou-navy uppercase tracking-widest mb-3 ml-2">TRN / Receipt Reference</label>
                    <input className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] font-mono font-black text-unicou-navy outline-none focus:border-unicou-orange shadow-inner" value={bankRef} onChange={e => setBankRef(e.target.value)} placeholder="ENTER TRN" />
                  </div>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full p-8 border-2 border-dashed rounded-[2rem] text-center cursor-pointer transition-all ${fileAttached ? 'bg-emerald-50 border-emerald-500/50 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-unicou-orange'}`}
                  >
                    <input type="file" ref={fileInputRef} className="hidden" onChange={() => setFileAttached(true)} />
                    <div className="text-2xl mb-2">{fileAttached ? '✅' : '📎'}</div>
                    <p className="text-[10px] font-black uppercase tracking-widest">{fileAttached ? 'Proof Attached' : 'Attach Transfer Receipt'}</p>
                  </div>
                </div>
              ) : (
                <div className="animate-in slide-in-from-right duration-300 space-y-6">
                  <div className="space-y-4">
                    <h4 className="text-[9px] font-black text-unicou-orange uppercase tracking-[0.2em] border-b pb-2">Card Credentials</h4>
                    <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-unicou-navy text-sm uppercase" placeholder="CARD HOLDER NAME" value={card.name} onChange={e => setCard({...card, name: e.target.value})} />
                    <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-unicou-navy text-sm" placeholder="REGISTERED EMAIL ID" value={card.email} onChange={e => setCard({...card, email: e.target.value})} />
                    <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-lg outline-none focus:border-unicou-navy" placeholder="CARD NUMBER (16 DIGITS)" value={card.num} onChange={e => setCard({...card, num: e.target.value.replace(/\D/g, '').substring(0, 16)})} />
                    <div className="grid grid-cols-2 gap-4">
                      <input className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center font-mono" placeholder="MM/YY" value={card.exp} onChange={e => setCard({...card, exp: e.target.value.substring(0, 5)})} />
                      <input className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center font-mono" placeholder="CVC/CVV" type="password" value={card.cvv} onChange={e => setCard({...card, cvv: e.target.value.replace(/\D/g, '').substring(0, 4)})} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[9px] font-black text-unicou-orange uppercase tracking-[0.2em] border-b pb-2">Billing Identity Node</h4>
                    <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-unicou-navy text-sm" placeholder="STREET NAME 1" value={card.street1} onChange={e => setCard({...card, street1: e.target.value})} />
                    <input className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-unicou-navy text-sm" placeholder="STREET NAME 2 (OPTIONAL)" value={card.street2} onChange={e => setCard({...card, street2: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                      <input className="p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-unicou-navy text-sm" placeholder="CITY" value={card.city} onChange={e => setCard({...card, city: e.target.value})} />
                      <input className="p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-unicou-navy text-sm" placeholder="PROVINCE / STATE" value={card.state} onChange={e => setCard({...card, state: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input className="p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-unicou-navy text-sm" placeholder="POST CODE" value={card.postcode} onChange={e => setCard({...card, postcode: e.target.value})} />
                      <input className="p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold outline-none focus:border-unicou-navy text-sm uppercase" placeholder="BILLING COUNTRY" value={card.country} onChange={e => setCard({...card, country: e.target.value})} />
                    </div>
                  </div>
                </div>
              )}

              <button 
                onClick={finalizeOrder}
                disabled={processing}
                className="w-full py-6 bg-unicou-orange hover:bg-orange-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-action transition-all active:scale-95 disabled:opacity-50"
              >
                {processing ? 'SYNCHRONIZING...' : 'COMMIT SETTLEMENT'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutProcess;
