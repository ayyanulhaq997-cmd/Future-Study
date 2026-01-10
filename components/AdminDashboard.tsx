
import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/apiService';
import { Product, Order, User, BusinessMetrics, Lead, ViewState, PurchaseRecord } from '../types';
import { MailConfig, SYSTEM_CONFIG_KEY } from '../services/mailService';

type AdminTab = 'intelligence' | 'catalog' | 'ledgers' | 'staff' | 'registrations' | 'vault' | 'settings';

const AdminDashboard: React.FC<{ user: User; onNavigate: (v: ViewState) => void }> = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('intelligence');
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [halted, setHalted] = useState(api.getSystemHaltStatus());
  const [data, setData] = useState<{
    orders: Order[],
    users: User[],
    products: Product[],
    leads: Lead[],
    purchases: PurchaseRecord[]
  }>({ orders: [], users: [], products: [], leads: [], purchases: [] });
  
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mailConfig, setMailConfig] = useState<MailConfig>({
    serviceId: '',
    templateId_verification: '',
    templateId_voucher: '',
    publicKey: ''
  });

  const refreshData = async () => {
    const [o, u, p, m, l, pur] = await Promise.all([
      api.getOrders(), api.getUsers(), api.getProducts(), api.getBusinessMetrics(), api.getLeads(), api.getPurchases()
    ]);
    setData({ orders: o, users: u, products: p, leads: l, purchases: pur });
    setMetrics(m);
    const saved = localStorage.getItem(SYSTEM_CONFIG_KEY);
    if (saved) setMailConfig(JSON.parse(saved));
    setLoading(false);
  };

  useEffect(() => { refreshData(); }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      const reader = new FileReader();
      reader.onloadend = () => setEditingProduct({ ...editingProduct, icon: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = async () => {
    if (!editingProduct?.name) return;
    await api.upsertProduct(editingProduct as Product);
    setEditingProduct(null);
    refreshData();
  };

  const handleSaveUser = async () => {
    if (!editingUser?.email) return;
    await api.upsertUser(editingUser as User);
    setEditingUser(null);
    refreshData();
  };

  const handleToggleFreeze = async (u: User) => {
    const nextStatus = u.status === 'Frozen' ? 'Active' : 'Frozen';
    await api.upsertUser({ ...u, status: nextStatus });
    refreshData();
  };

  const handleToggleHalt = () => {
    const next = !halted;
    if (confirm(`CRITICAL: Stop all global voucher fulfillment nodes?`)) {
      api.setSystemHaltStatus(next);
      setHalted(next);
    }
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase tracking-[0.4em]">Establishing Secure Control Node...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="flex flex-col xl:flex-row justify-between items-center gap-10 mb-12 border-b border-slate-100 pb-12">
        <div>
          <h1 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">
            {user.role.split(' ')[0]} <span className="text-unicou-orange">CONTROL</span>
          </h1>
          <p className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.4em]">Identity Terminal: {user.email}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 justify-center">
          <button onClick={handleToggleHalt} className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl ${halted ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white animate-pulse'}`}>
            {halted ? 'RESUME SYSTEM NODES' : 'STOP ALL VOUCHERS'}
          </button>
          
          <div className="flex bg-slate-50 p-1.5 rounded-[2rem] border border-slate-200 shadow-inner overflow-x-auto no-scrollbar">
            {['intelligence', 'catalog', 'ledgers', 'staff', 'registrations', 'vault', 'settings'].map(t => (
              <button key={t} onClick={() => setActiveTab(t as any)} className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === t ? 'bg-white text-unicou-navy shadow-lg border border-slate-200' : 'text-slate-400'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'catalog' && (
        <div className="space-y-12 animate-in fade-in duration-500">
           <div className="flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tighter">Inventory Registry</h3>
              <button onClick={() => setEditingProduct({ id: `p-${Date.now()}`, type: 'Voucher', category: 'PTE', basePrice: 0, currency: 'USD' })} className="px-8 py-4 bg-unicou-orange text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">+ ADD PRODUCT NODE</button>
           </div>

           {editingProduct && (
             <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400">Node Name</label>
                      <input className="w-full p-4 bg-white rounded-xl border border-slate-200 font-bold" value={editingProduct.name || ''} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400">Price (USD)</label>
                      <input type="number" className="w-full p-4 bg-white rounded-xl border border-slate-200 font-bold" value={editingProduct.basePrice || 0} onChange={e => setEditingProduct({...editingProduct, basePrice: Number(e.target.value)})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400">Category</label>
                      <select className="w-full p-4 bg-white rounded-xl border border-slate-200 font-bold" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                         {['PTE', 'IELTS', 'TOEFL', 'LanguageCert', 'Duolingo', 'OTHER'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                   </div>
                   <div className="lg:col-span-2 space-y-2">
                      <label className="text-[9px] font-black uppercase text-slate-400">Direct Logo URL Node</label>
                      <input 
                        className="w-full p-4 bg-white rounded-xl border border-slate-200 font-mono text-xs" 
                        placeholder="Paste URL: https://example.com/logo.png"
                        value={editingProduct.icon || ''} 
                        onChange={e => setEditingProduct({...editingProduct, icon: e.target.value})} 
                      />
                   </div>
                   <div className="space-y-2 flex flex-col justify-end">
                      <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/png, image/jpeg" />
                      <button onClick={() => fileInputRef.current?.click()} className="w-full py-4 bg-unicou-navy text-white rounded-xl font-black text-[9px] uppercase tracking-widest">📸 OR UPLOAD FILE</button>
                   </div>
                </div>
                <div className="flex gap-4 mt-8 pt-8 border-t border-slate-200">
                   <button onClick={handleSaveProduct} className="px-10 py-4 bg-emerald-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg">Commit Node</button>
                   <button onClick={() => setEditingProduct(null)} className="px-10 py-4 bg-slate-200 text-slate-500 rounded-xl font-black text-[9px] uppercase tracking-widest">Cancel</button>
                </div>
             </div>
           )}

           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {data.products.map(p => (
                <div key={p.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-lg hover:border-unicou-navy transition-all group flex flex-col">
                   <div className="h-32 flex items-center justify-center mb-6 bg-slate-50 rounded-[2rem] overflow-hidden p-4 shadow-inner">
                      {p.icon ? <img src={p.icon} className="max-h-full max-w-full object-contain" alt={p.name} /> : <span className="text-4xl opacity-20">🎟️</span>}
                   </div>
                   <h4 className="text-sm font-black text-slate-900 uppercase leading-tight mb-4 flex-grow">{p.name}</h4>
                   <div className="flex justify-between items-center border-t border-slate-50 pt-4">
                      <span className="text-lg font-display font-black text-unicou-navy">${p.basePrice}</span>
                      <button onClick={() => setEditingProduct(p)} className="text-[9px] font-black text-unicou-orange uppercase hover:underline">Edit Node</button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}
      {/* Other tabs follow identical architecture... */}
    </div>
  );
};

export default AdminDashboard;
