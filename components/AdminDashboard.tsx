
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/apiService';
import { Product, VoucherCode, Order, User, Lead } from '../types';

type AdminTab = 'orders' | 'agents' | 'users' | 'inventory' | 'sync';

const SYSTEM_CONFIG_KEY = 'unicou_system_infrastructure_v1';

const AdminDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    products: Product[],
    codes: VoucherCode[],
    orders: Order[],
    users: User[],
    leads: Lead[]
  }>({ products: [], codes: [], orders: [], users: [], leads: [] });

  const [mailConfig, setMailConfig] = useState({
    serviceId: '',
    templateId_verification: '',
    templateId_voucher: '',
    publicKey: ''
  });

  const fetchData = async () => {
    try {
      const [p, c, o, u, le] = await Promise.all([
        api.getProducts(), api.getCodes(), api.getOrders(), api.getUsers(), api.getLeads()
      ]);
      setData({ products: p, codes: c, orders: o, users: u, leads: le });
      
      const config = localStorage.getItem(SYSTEM_CONFIG_KEY);
      if (config) setMailConfig(JSON.parse(config));
      
      setLoading(false);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleFulfillOrder = async (orderId: string) => {
    if (confirm("Verify settlement and initialize VOUCHER DISPATCH?")) {
       try {
         await api.fulfillOrder(orderId);
         fetchData();
       } catch (err: any) {
         alert(err.message);
       }
    }
  };

  const handleVerifyAgent = async (leadId: string) => {
    if (confirm("Authorize this Agency Node for bulk procurement?")) {
      await api.verifyAgent(leadId);
      alert("Agency Verified. Node Activated.");
      fetchData();
    }
  };

  const handleToggleUserStatus = async (userEmail: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    if (confirm(`Change status of node ${userEmail} to ${newStatus.toUpperCase()}?`)) {
      // Basic simulation of status toggle in local storage
      const USERS_KEY = 'unicou_local_users_v1';
      const raw = localStorage.getItem(USERS_KEY);
      if (raw) {
        const localUsers: User[] = JSON.parse(raw);
        const updated = localUsers.map(u => u.email === userEmail ? { ...u, status: newStatus as any } : u);
        localStorage.setItem(USERS_KEY, JSON.stringify(updated));
        fetchData();
      } else {
        alert("Cannot modify core system users in demo mode.");
      }
    }
  };

  const saveConfig = () => {
    localStorage.setItem(SYSTEM_CONFIG_KEY, JSON.stringify(mailConfig));
    alert("System Configuration Synchronized.");
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase text-[10px] tracking-[0.4em]">Initializing Core Authority Node...</div>;

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-16 border-b-2 border-unicou-navy pb-10">
        <div>
           <h1 className="text-5xl font-display font-black text-unicou-charcoal uppercase tracking-tighter">
             SYSTEM <span className="text-unicou-orange">ADMIN</span>
           </h1>
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">
             Connected Node: <span className="text-unicou-navy">ACTIVE AUTHORITY TERMINAL</span>
           </p>
        </div>
        <div className="flex flex-wrap bg-unicou-ice p-1.5 rounded-[2rem] border border-slate-200 shadow-inner">
           {(['orders', 'agents', 'users', 'inventory', 'sync'] as AdminTab[]).map((tab) => (
             <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-unicou-navy shadow-lg' : 'text-slate-400 hover:text-unicou-charcoal'}`}>
               {tab}
             </button>
           ))}
        </div>
      </div>

      {activeTab === 'orders' && (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in duration-500">
           <table className="w-full text-left">
              <thead>
                <tr className="bg-unicou-ice text-[10px] font-black uppercase text-slate-400 border-b tracking-widest">
                  <th className="px-10 py-6">Order Node</th><th className="px-10 py-6">Buyer Identity</th><th className="px-10 py-6">Product</th><th className="px-10 py-6 text-right">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {data.orders.map(o => (
                   <tr key={o.id} className="hover:bg-unicou-ice transition-colors">
                      <td className="px-10 py-6">
                         <div className="font-mono font-black text-unicou-navy text-xs">{o.id}</div>
                         <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase">REF: {o.bankRef}</div>
                      </td>
                      <td className="px-10 py-6">
                         <div className="font-black uppercase text-xs text-unicou-charcoal">{o.buyerName}</div>
                         <div className="text-[10px] text-slate-400 font-mono italic">{o.customerEmail}</div>
                      </td>
                      <td className="px-10 py-6 font-bold text-slate-500 text-xs uppercase">{o.productName} (x{o.quantity})</td>
                      <td className="px-10 py-6 text-right">
                         {o.status === 'Pending' ? (
                           <button onClick={() => handleFulfillOrder(o.id)} className="px-6 py-2 bg-unicou-navy text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-unicou-charcoal">Verify & Dispatch</button>
                         ) : (
                           <span className="px-4 py-1.5 bg-slate-100 text-unicou-navy rounded-full text-[8px] font-black uppercase border border-slate-200">Dispatched Node</span>
                         )}
                      </td>
                   </tr>
                 ))}
                 {data.orders.length === 0 && <tr><td colSpan={4} className="p-20 text-center text-slate-400 italic font-bold">No active procurement nodes.</td></tr>}
              </tbody>
           </table>
        </div>
      )}

      {activeTab === 'agents' && (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in duration-500">
           <div className="p-8 bg-unicou-ice border-b border-slate-200">
              <h3 className="text-xs font-black uppercase tracking-widest text-unicou-navy">Pending Agent Verifications</h3>
           </div>
           <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                   <th className="px-10 py-5">Agency</th><th className="px-10 py-5">Rep Identity</th><th className="px-10 py-5">Status</th><th className="px-10 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {data.leads.filter(l => l.type === 'agent').map(l => (
                   <tr key={l.id}>
                      <td className="px-10 py-6 font-black uppercase text-xs text-unicou-charcoal">{l.data.agency_name}</td>
                      <td className="px-10 py-6 font-bold text-slate-500 text-xs italic">{l.data.email}</td>
                      <td className="px-10 py-6"><span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${l.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>{l.status}</span></td>
                      <td className="px-10 py-6 text-right">
                         {l.status !== 'Approved' && <button onClick={() => handleVerifyAgent(l.id)} className="px-5 py-2 bg-unicou-orange text-white rounded-lg text-[8px] font-black uppercase tracking-widest shadow-action">Authorize Node</button>}
                      </td>
                   </tr>
                 ))}
                 {data.leads.filter(l => l.type === 'agent').length === 0 && <tr><td colSpan={4} className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest italic opacity-50">No pending agency registrations.</td></tr>}
              </tbody>
           </table>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in duration-500">
           <div className="p-8 bg-unicou-ice border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest text-unicou-navy">Identity Node Registry</h3>
              <div className="px-4 py-1 bg-white border border-slate-200 rounded-full text-[9px] font-black uppercase text-slate-400">Total Users: {data.users.length}</div>
           </div>
           <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                   <th className="px-10 py-5">Identity (Name)</th><th className="px-10 py-5">User ID (Email)</th><th className="px-10 py-5">Authority (Role)</th><th className="px-10 py-5">Status</th><th className="px-10 py-5 text-right">Node Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {data.users.map(u => (
                   <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-10 py-6">
                        <div className="font-black uppercase text-xs text-unicou-charcoal">{u.name}</div>
                        {u.id.startsWith('u-') && <div className="text-[8px] text-slate-400 font-mono mt-0.5">LOCAL_NODE_ID: {u.id}</div>}
                      </td>
                      <td className="px-10 py-6 font-bold text-slate-600 text-xs italic">{u.email}</td>
                      <td className="px-10 py-6">
                        <span className="px-2.5 py-1 bg-slate-100 rounded text-[8px] font-black uppercase text-slate-500 border border-slate-200">{u.role}</span>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${u.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : u.status === 'Suspended' ? 'bg-rose-50 text-rose-600' : 'bg-orange-50 text-orange-600'}`}>{u.status}</span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <button 
                          onClick={() => handleToggleUserStatus(u.email, u.status)} 
                          className={`px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${u.status === 'Active' ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'}`}
                        >
                          {u.status === 'Active' ? 'Suspend Node' : 'Activate Node'}
                        </button>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
           <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                       <th className="px-10 py-5">Product</th><th className="px-10 py-5">Category</th><th className="px-10 py-5 text-right">Rate</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {data.products.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="px-10 py-6 font-black uppercase text-xs text-unicou-navy">{p.name}</td>
                        <td className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.category}</td>
                        <td className="px-10 py-6 text-right font-display font-black text-unicou-charcoal">${p.basePrice}</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           <div className="bg-unicou-navy p-10 rounded-[3rem] text-white shadow-3xl">
              <h3 className="text-xl font-display font-black uppercase mb-6">Vault Summary</h3>
              <div className="space-y-6">
                 <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[9px] font-black text-unicou-orange uppercase tracking-widest mb-1">Total SKU Count</p>
                    <p className="text-4xl font-display font-black">{data.products.length}</p>
                 </div>
                 <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[9px] font-black text-unicou-orange uppercase tracking-widest mb-1">Vouchers in Vault</p>
                    <p className="text-4xl font-display font-black">{data.codes.filter(c => c.status === 'Available').length}</p>
                 </div>
                 <button className="w-full py-5 bg-unicou-orange text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-action hover:scale-[1.02] transition-all">Upload Bulk Codes</button>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'sync' && (
        <div className="max-w-3xl mx-auto bg-white p-12 md:p-16 rounded-[4rem] border border-slate-200 shadow-3xl animate-in zoom-in-95 duration-500">
           <h3 className="text-3xl font-display font-black text-unicou-navy uppercase tracking-tighter mb-10 text-center">System <span className="text-unicou-orange">Synchronization</span></h3>
           <div className="space-y-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">EmailJS Service ID</label>
                 <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs focus:border-unicou-navy outline-none" value={mailConfig.serviceId} onChange={e => setMailConfig({...mailConfig, serviceId: e.target.value})} placeholder="service_xxxx" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Verification Template</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs focus:border-unicou-navy outline-none" value={mailConfig.templateId_verification} onChange={e => setMailConfig({...mailConfig, templateId_verification: e.target.value})} placeholder="template_xxxx" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Voucher Template</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs focus:border-unicou-navy outline-none" value={mailConfig.templateId_voucher} onChange={e => setMailConfig({...mailConfig, templateId_voucher: e.target.value})} placeholder="template_yyyy" />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">EmailJS Public Key</label>
                 <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs focus:border-unicou-navy outline-none" value={mailConfig.publicKey} onChange={e => setMailConfig({...mailConfig, publicKey: e.target.value})} placeholder="pk_xxxxxxx" />
              </div>
              <button onClick={saveConfig} className="w-full py-6 bg-unicou-navy text-white rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-slate-900 transition-all active:scale-95">Commit Global Settings</button>
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-200 text-center">
                 <p className="text-[10px] text-slate-500 italic font-bold leading-relaxed">"System settings are stored in local persistence node. These values authorize real email dispatch via the UNICOU mail service."</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
