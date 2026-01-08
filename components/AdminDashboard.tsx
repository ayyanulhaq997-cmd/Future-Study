
import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/apiService';
import { MailConfig, SYSTEM_CONFIG_KEY } from '../services/mailService';
import { Product, Order, User, OrderStatus, BusinessMetrics, Lead, ViewState } from '../types';

type AdminTab = 'intelligence' | 'registrations' | 'vault' | 'ledgers' | 'staff' | 'catalog' | 'settings';

const AdminDashboard: React.FC<{ user: User; onNavigate: (v: ViewState) => void }> = ({ user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('intelligence');
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [halted, setHalted] = useState(api.getSystemHaltStatus());
  const [data, setData] = useState<{
    orders: Order[],
    users: User[],
    products: Product[],
    leads: Lead[]
  }>({ orders: [], users: [], products: [], leads: [] });
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // System Configuration State
  const [mailConfig, setMailConfig] = useState<MailConfig>({
    serviceId: '',
    templateId_verification: '',
    templateId_voucher: '',
    templateId_hold: '',
    templateId_rejected: '',
    publicKey: ''
  });

  const isOwner = user.role === 'System Admin/Owner';

  const refreshData = async () => {
    const [o, u, p, m, l] = await Promise.all([
      api.getOrders(), api.getUsers(), api.getProducts(), api.getBusinessMetrics(), api.getLeads()
    ]);
    setData({ orders: o, users: u, products: p, leads: l });
    setMetrics(m);
    
    const savedConfig = localStorage.getItem(SYSTEM_CONFIG_KEY);
    if (savedConfig) setMailConfig(JSON.parse(savedConfig));
    
    setLoading(false);
  };

  useEffect(() => { refreshData(); }, []);

  const saveMailConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(SYSTEM_CONFIG_KEY, JSON.stringify(mailConfig));
    alert("System Node Updated: Global Mail Infrastructure Synchronized.");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Logic for product icon upload
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleHalt = () => {
    const next = !halted;
    if (confirm(`CRITICAL: Stop all voucher procurement nodes immediately?`)) {
      api.setSystemHaltStatus(next);
      setHalted(next);
      refreshData();
    }
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase tracking-[0.4em]">Establishing Secure Control Node...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 bg-white min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-10 mb-12 border-b border-slate-100 pb-12">
        <div>
          <h1 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">
            {isOwner ? 'OWNER' : 'OPS'} <span className="text-unicou-orange">CONTROL</span>
          </h1>
          <p className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.4em]">Terminal Access: {user.email}</p>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleToggleHalt}
            className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl ${halted ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white animate-pulse'}`}
          >
            {halted ? 'RESUME PROCUREMENT' : 'STOP SYSTEM NODES'}
          </button>
          
          <div className="flex bg-slate-50 p-1.5 rounded-[2rem] border border-slate-200 shadow-inner overflow-x-auto no-scrollbar">
            {[
              { id: 'intelligence', label: 'Overview' },
              { id: 'catalog', label: 'Vouchers' },
              { id: 'vault', label: 'Vault' },
              { id: 'ledgers', label: 'Finance' },
              { id: 'settings', label: 'Settings' }
            ].map(t => (
              <button 
                key={t.id} 
                onClick={() => setActiveTab(t.id as any)} 
                className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-white text-unicou-navy shadow-lg border border-slate-200' : 'text-slate-400'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'settings' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
          <div className="bg-slate-50 p-12 rounded-[4rem] border border-slate-200 shadow-xl">
             <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-unicou-navy text-white flex items-center justify-center text-xl shadow-lg">⚙️</div>
                <div>
                   <h3 className="text-2xl font-display font-black text-unicou-navy uppercase tracking-tight">System Infrastructure</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Dispatch & Mail Server Config</p>
                </div>
             </div>

             <form onSubmit={saveMailConfig} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-unicou-navy uppercase tracking-widest ml-1">EmailJS Service ID</label>
                      <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-mono text-sm outline-none focus:border-unicou-orange" placeholder="service_xxxxxxx" value={mailConfig.serviceId} onChange={e => setMailConfig({...mailConfig, serviceId: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-unicou-navy uppercase tracking-widest ml-1">EmailJS Public Key</label>
                      <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-mono text-sm outline-none focus:border-unicou-orange" placeholder="user_xxxxxxxx" value={mailConfig.publicKey} onChange={e => setMailConfig({...mailConfig, publicKey: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-unicou-navy uppercase tracking-widest ml-1">Verification Template ID</label>
                      <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-mono text-sm outline-none focus:border-unicou-orange" placeholder="template_xxxxxxx" value={mailConfig.templateId_verification} onChange={e => setMailConfig({...mailConfig, templateId_verification: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-unicou-navy uppercase tracking-widest ml-1">Voucher Delivery Template ID</label>
                      <input className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-mono text-sm outline-none focus:border-unicou-orange" placeholder="template_xxxxxxx" value={mailConfig.templateId_voucher} onChange={e => setMailConfig({...mailConfig, templateId_voucher: e.target.value})} />
                   </div>
                </div>

                <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl">
                   <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      Infrastructure Note
                   </h4>
                   <p className="text-xs text-blue-800 font-bold italic leading-relaxed">
                      "Ensure your EmailJS templates use 'to_name', 'to_email', 'verification_code' and 'voucher_codes' as variables for automated dispatch node."
                   </p>
                </div>

                <button type="submit" className="w-full py-6 bg-unicou-navy text-white rounded-3xl font-black uppercase text-xs tracking-[0.3em] shadow-3xl hover:bg-slate-900 transition-all active:scale-95">COMMIT SYSTEM CONFIGURATION</button>
             </form>
          </div>
        </div>
      )}

      {/* INTELLIGENCE OVERVIEW */}
      {activeTab === 'intelligence' && metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in duration-500">
           <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 shadow-inner">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Today's Settlement</p>
              <h4 className="text-5xl font-display font-black text-unicou-navy tracking-tighter">${metrics.todaySales}</h4>
           </div>
           <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 shadow-inner">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Vault Inventory</p>
              <h4 className="text-5xl font-display font-black text-unicou-orange tracking-tighter">{metrics.vouchersInStock}</h4>
           </div>
           <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 shadow-inner">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Mail Node Status</p>
              <div className="flex items-center gap-4">
                 <div className={`w-3 h-3 rounded-full ${mailConfig.serviceId ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500 animate-pulse'}`} />
                 <h4 className="text-2xl font-display font-black text-slate-900 uppercase tracking-tighter">{mailConfig.serviceId ? 'ONLINE' : 'LOCAL ONLY'}</h4>
              </div>
           </div>
           <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 shadow-inner">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Risk Alerts</p>
              <h4 className="text-5xl font-display font-black text-red-500 tracking-tighter">{metrics.riskAlerts}</h4>
           </div>
        </div>
      )}

      {activeTab === 'catalog' && (
        <div className="animate-in fade-in duration-500 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {data.products.map(p => (
             <div key={p.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl group flex flex-col">
               <div className="h-24 flex items-center justify-center mb-6 bg-slate-50 rounded-2xl overflow-hidden p-4">
                  {p.icon?.startsWith('data:') || p.icon?.includes('http') ? <img src={p.icon} className="h-full w-auto object-contain" /> : <span className="text-4xl">🎟️</span>}
               </div>
               <h4 className="text-lg font-black text-slate-900 uppercase leading-tight mb-2">{p.name}</h4>
               <p className="text-[10px] font-black text-unicou-orange uppercase tracking-widest border-t pt-4 mt-auto">${p.basePrice} Node</p>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
