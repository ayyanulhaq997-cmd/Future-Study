
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/apiService';
import { Product, VoucherCode, Order, User, Lead } from '../types';

type AdminTab = 'teller' | 'vault' | 'registry' | 'team' | 'audit';

const AdminDashboard: React.FC = () => {
  const currentUser = api.getCurrentUser();
  const [activeTab, setActiveTab] = useState<AdminTab>('teller');
  const [data, setData] = useState<{
    products: Product[],
    codes: VoucherCode[],
    orders: Order[],
    users: User[],
    leads: Lead[]
  }>({ products: [], codes: [], orders: [], users: [], leads: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [p, c, o, u, le] = await Promise.all([
        api.getProducts(), api.getCodes(), api.getOrders(), api.getUsers(), api.getLeads()
      ]);
      setData({ products: p, codes: c, orders: o, users: u, leads: le });
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleReleaseVoucher = async (orderId: string) => {
    if (confirm("Deliver Voucher: Verify settlement and dispatch Annex-C notification?")) {
      try {
        await api.processOrderAction(orderId, 'verify');
        alert("Settlement Verified. Annex-C dispatch node active.");
        fetchData();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleAuthorizeAgent = async (uid: string) => {
    if (confirm("Verify Partner: Establish this entity as a Verified Partner?")) {
      await api.updateUserRole(uid, 'Agent Partner/Prep Center');
      fetchData();
    }
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase tracking-widest">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24 bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16 pt-12">
        <div>
          <h1 className="text-5xl font-display font-black tracking-tight text-slate-900 leading-none uppercase">Admin <span className="text-unicou-orange">Control</span></h1>
          <p className="text-slate-500 mt-4 font-bold uppercase text-[10px] tracking-widest">Authority Level: {currentUser?.role}</p>
        </div>
        <div className="flex flex-wrap bg-slate-50 p-2 rounded-[2rem] border border-slate-200 shadow-inner">
          {[
            { id: 'teller', label: 'Payment Verification' },
            { id: 'vault', label: 'Stock Manager' },
            { id: 'registry', label: 'Student Leads' },
            { id: 'team', label: 'Staff Directory' },
            { id: 'audit', label: 'Audit Logs' }
          ].map(tab => (
            <button 
              key={tab.id} onClick={() => setActiveTab(tab.id as AdminTab)} 
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-unicou-navy shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'teller' && (
        <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-2xl overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Settlement Review</h2>
            <button className="px-6 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest animate-pulse">EMERGENCY STOP</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] border-y border-slate-100">
                  <th className="px-8 py-6">Order ID</th>
                  <th className="px-8 py-6">Customer Email</th>
                  <th className="px-8 py-6">Bank Reference</th>
                  <th className="px-8 py-6">Proof Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.orders.filter(o => o.status === 'Pending').map(o => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="px-8 py-6 font-mono text-unicou-navy font-black text-xs">{o.id}</td>
                    <td className="px-8 py-6 font-black text-slate-900 text-xs uppercase">{o.customerEmail}</td>
                    <td className="px-8 py-6 font-mono text-xs">{o.bankRef}</td>
                    <td className="px-8 py-6">
                       <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black uppercase tracking-widest">VERIFIED</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button 
                         onClick={() => handleReleaseVoucher(o.id)}
                         className="px-4 py-2 bg-unicou-navy text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors"
                       >
                         Release Voucher
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-2xl overflow-hidden">
           <h2 className="text-2xl font-black mb-10 text-slate-900 uppercase tracking-tighter">Lead Database</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.leads.map(l => (
                <div key={l.id} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex justify-between items-center group hover:bg-white hover:border-unicou-orange/20 transition-all">
                   <div>
                      <span className="text-[9px] font-black text-unicou-orange uppercase tracking-widest mb-2 block">{l.type} Application</span>
                      <h4 className="font-black text-slate-950 uppercase">{l.data.name || l.data.agency_name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">{l.data.email}</p>
                   </div>
                   <button className="px-6 py-2.5 bg-white border border-slate-200 text-unicou-navy rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm group-hover:bg-unicou-navy group-hover:text-white transition-all">Review Details</button>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="bg-white rounded-[4rem] border border-slate-200 overflow-hidden shadow-2xl">
           <table className="w-full text-left">
             <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">
               <tr><th className="px-8 py-6">Identity</th><th className="px-8 py-6">Access Scope</th><th className="px-8 py-6 text-right">Settings</th></tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {data.users.map(u => (
                 <tr key={u.id} className="hover:bg-slate-50">
                   <td className="px-8 py-6">
                      <div className="font-black text-slate-900 uppercase tracking-tight">{u.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono italic">{u.email}</div>
                   </td>
                   <td className="px-8 py-6">
                      <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[9px] font-black text-unicou-navy uppercase tracking-widest">{u.role}</span>
                   </td>
                   <td className="px-8 py-6 text-right">
                      <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-[10px] font-black uppercase outline-none focus:border-unicou-orange cursor-pointer">
                         <option>Modify Role...</option>
                         <option>Finance/Audit Team</option>
                         <option>Operation Manager</option>
                         <option>Lead Trainer</option>
                         <option>Support/Sales Node</option>
                         <option>Agent Partner/Prep Center</option>
                         <option>Student</option>
                         <option>Deactivate</option>
                      </select>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
