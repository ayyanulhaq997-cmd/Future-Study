
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/apiService';
import { Product, VoucherCode, Order, ActivityLog, QualificationLead, SecurityStatus, LeadSubmission, FinanceReport, User } from '../types';

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<{
    products: Product[],
    codes: VoucherCode[],
    orders: Order[],
    logs: ActivityLog[],
    qLeads: QualificationLead[],
    leads: LeadSubmission[],
    security: SecurityStatus | null,
    finance: FinanceReport | null
  }>({
    products: [], codes: [], orders: [], logs: [], qLeads: [], leads: [], security: null, finance: null
  });
  
  const [activeTab, setActiveTab] = useState<'inventory' | 'verification' | 'leads' | 'qualifications' | 'security'>('verification');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  
  const fetchData = async () => {
    try {
      const [p, c, o, l, ql, ls, s, f] = await Promise.all([
        api.getProducts(), 
        api.getCodes().catch(() => []), 
        api.getOrders(), 
        api.getLogs().catch(() => []), 
        api.getQualificationLeads(), 
        api.getLeads(), 
        api.getSecurityStatus(), 
        api.getFinanceReport()
      ]);
      setData({ products: p, codes: c, orders: o, logs: l, qLeads: ql, leads: ls, security: s, finance: f });
      setUser(api.getCurrentUser());
      
      const role = api.getCurrentUser()?.role;
      if (role === 'Teller' || role === 'Finance') setActiveTab('verification');
      else if (role === 'Trainer') setActiveTab('leads');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); 
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async (orderId: string) => {
    if (!confirm("Verify this settlement and release digital vouchers?")) return;
    try {
      await api.verifyBankTransfer(orderId);
      alert("Transfer Verified. Vouchers dispatched to student email node.");
      fetchData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const filteredPending = useMemo(() => {
    // UPDATED: Show all pending orders, not just bank transfers
    return data.orders.filter(o => o.status === 'Pending');
  }, [data.orders]);

  if (loading) return <div className="p-20 text-center animate-pulse text-unicou-orange">Establishing Connection to UNICOU Admin Hub...</div>;

  const isSupportRole = ['Finance', 'Teller', 'Trainer'].includes(user?.role || '');
  const isAdmin = user?.role === 'Admin';

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">UNICOU <span className="text-primary-400">Terminal</span></h1>
          <p className="text-slate-500 text-sm mt-1">Authorized Role: <span className="text-white font-bold">{user?.role}</span> • Staff Monitoring Active</p>
        </div>
        <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 shadow-inner overflow-x-auto no-scrollbar">
          {isAdmin && (
            <button onClick={() => setActiveTab('inventory')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'inventory' ? 'bg-primary-600 text-white' : 'text-slate-500'}`}>
              INVENTORY
            </button>
          )}
          <button onClick={() => setActiveTab('verification')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'verification' ? 'bg-unicou-orange text-white shadow-lg' : 'text-slate-500'}`}>
            TELLER DESK
          </button>
          <button onClick={() => setActiveTab('leads')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'leads' ? 'bg-primary-600 text-white' : 'text-slate-500'}`}>
            ENQUIRIES
          </button>
        </div>
      </div>

      <div className="animate-in fade-in duration-500">
        
        {activeTab === 'verification' && (
          <div className="space-y-8">
            <div className="glass p-10 rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden">
               <div className="flex justify-between items-start mb-10">
                 <div>
                    <h2 className="text-2xl font-bold mb-2">Pending Settlement Verifications</h2>
                    <p className="text-slate-500 text-sm">Review incoming payments and release digital assets.</p>
                 </div>
                 {isSupportRole && (
                    <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl text-[9px] font-bold text-red-400 uppercase tracking-widest">
                       Codes Masked for Staff
                    </div>
                 )}
               </div>
               
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                   <thead className="bg-slate-900/80 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                     <tr>
                       <th className="px-8 py-5">Order ID</th>
                       <th className="px-8 py-5">Method</th>
                       <th className="px-8 py-5">Ref/ID</th>
                       <th className="px-8 py-5">Amount</th>
                       <th className="px-8 py-5 text-right">Action</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-800/50">
                     {filteredPending.map(o => (
                       <tr key={o.id} className="hover:bg-slate-800/20 transition-colors">
                         <td className="px-8 py-5 font-mono text-primary-400 font-bold">
                           {o.id}
                           <div className="text-[9px] text-slate-600 mt-1 font-sans">{o.customerEmail}</div>
                         </td>
                         <td className="px-8 py-5">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${o.paymentMethod === 'Gateway' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                                {o.paymentMethod}
                            </span>
                         </td>
                         <td className="px-8 py-5">
                           <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-mono font-bold text-slate-300">
                             {o.bankRef || o.paymentId || 'N/A'}
                           </span>
                         </td>
                         <td className="px-8 py-5 font-bold text-white">${o.totalAmount}</td>
                         <td className="px-8 py-5 text-right">
                           <button 
                             onClick={() => handleVerify(o.id)}
                             className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                           >Approve & Release</button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
                 {filteredPending.length === 0 && (
                   <div className="p-32 text-center text-slate-600 italic font-medium">The verification queue is currently empty.</div>
                 )}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && isAdmin && (
          <div className="glass rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/80 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                  <tr><th className="px-8 py-5">Node</th><th className="px-8 py-5">Raw Code (Unmasked)</th><th className="px-8 py-5">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {data.codes.map(c => (
                    <tr key={c.id}>
                      <td className="px-8 py-5 font-bold">{data.products.find(p => p.id === c.productId)?.name}</td>
                      <td className="px-8 py-5 font-mono text-primary-400">{c.code}</td>
                      <td className="px-8 py-5"><span className="text-[9px] font-black px-2 py-1 bg-slate-900 rounded-full border border-slate-800">{c.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        )}

        {activeTab === 'leads' && (
           <div className="glass rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/80 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                  <tr><th className="px-8 py-5">Date</th><th className="px-8 py-5">Applicant</th><th className="px-8 py-5">Destination</th><th className="px-8 py-5 text-right">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {data.leads.map(l => (
                    <tr key={l.id}>
                      <td className="px-8 py-5 font-mono text-xs text-slate-500">{new Date(l.timestamp).toLocaleDateString()}</td>
                      <td className="px-8 py-5"><div className="font-bold">{l.name}</div><div className="text-xs text-slate-500">{l.email}</div></td>
                      <td className="px-8 py-5 text-slate-300 font-medium">{l.targetCountry}</td>
                      <td className="px-8 py-5 text-right"><span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[9px] font-black uppercase">{l.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
