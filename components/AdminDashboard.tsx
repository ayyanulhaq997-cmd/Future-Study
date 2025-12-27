import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Product, VoucherCode, Order, ActivityLog, User, SecurityStatus, Lead } from '../types';

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<{
    products: Product[],
    codes: VoucherCode[],
    orders: Order[],
    logs: ActivityLog[],
    users: User[],
    leads: Lead[],
    security: SecurityStatus | null
  }>({
    products: [], codes: [], orders: [], logs: [], users: [], leads: [], security: null
  });
  
  const [activeTab, setActiveTab] = useState<'inventory' | 'verification' | 'staff' | 'audit' | 'leads'>('verification');
  const [loading, setLoading] = useState(true);
  const [importPid, setImportPid] = useState('');
  const [rawCodes, setRawCodes] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchData = async () => {
    try {
      const [p, c, o, l, u, s, le] = await Promise.all([
        api.getProducts(), 
        api.getCodes().catch(() => []), 
        api.getOrders(), 
        api.getLogs().catch(() => []), 
        api.getUsers().catch(() => []),
        api.getSecurityStatus(),
        api.getLeads().catch(() => [])
      ]);
      setData({ products: p, codes: c, orders: o, logs: l, users: u, leads: le, security: s });
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async (orderId: string) => {
    if (!confirm("Verify settlement and release vouchers?")) return;
    try {
      await api.verifyBankTransfer(orderId);
      fetchData();
    } catch (e: any) { alert(e.message); }
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importPid || !rawCodes.trim()) return;
    setProcessing(true);
    try {
      const codeList = rawCodes.split('\n').filter(x => x.trim());
      const res = await api.importVouchers(importPid, codeList);
      alert(`Imported ${res.addedCount} new stock units. Duplicates: ${res.duplicateCount}`);
      setRawCodes('');
      fetchData();
    } catch (e: any) { alert(e.message); } finally { setProcessing(false); }
  };

  const handleRoleUpdate = async (uid: string, role: any) => {
    try {
      await api.updateUserRole(uid, role);
      fetchData();
    } catch (e: any) { alert(e.message); }
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-slate-800 font-black uppercase tracking-widest">Establishing Live Authority Node...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 view-container pb-24 bg-white">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-display font-black tracking-tight text-slate-900 leading-none">System <span className="text-unicou-orange">Terminal</span></h1>
          <p className="text-slate-500 mt-4 font-bold uppercase text-xs tracking-widest">Identity Auth: <span className="text-unicou-navy">{api.getCurrentUser()?.email}</span></p>
        </div>
        <div className="flex bg-slate-50 p-2 rounded-[2rem] border border-slate-200 shadow-inner overflow-x-auto no-scrollbar">
          {(['verification', 'inventory', 'leads', 'staff', 'audit'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)} 
              className={`px-8 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all whitespace-nowrap uppercase ${activeTab === tab ? 'bg-white text-unicou-navy shadow-xl border border-slate-200' : 'text-slate-400 hover:text-slate-900'}`}
            >
              {tab === 'verification' ? 'TELLER DESK' : tab === 'inventory' ? 'STOCK VAULT' : tab === 'leads' ? 'LEAD REGISTRY' : tab === 'staff' ? 'TEAM CONTROL' : 'AUDIT TRAIL'}
            </button>
          ))}
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'verification' && (
          <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-2xl overflow-hidden">
             <h2 className="text-2xl font-black mb-10 text-slate-900 uppercase tracking-tighter">Fulfillment Queue</h2>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] border-y border-slate-100">
                     <th className="px-8 py-6">Order node</th>
                     <th className="px-8 py-6">Client / Email</th>
                     <th className="px-8 py-6">Bank Ref</th>
                     <th className="px-8 py-6">Total</th>
                     <th className="px-8 py-6 text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {data.orders.filter(o => o.status === 'Pending').map(o => (
                     <tr key={o.id} className="hover:bg-slate-50 transition-all group">
                       <td className="px-8 py-6"><span className="font-mono text-unicou-navy font-black">{o.id}</span></td>
                       <td className="px-8 py-6 text-slate-800 font-bold">{o.customerEmail}</td>
                       <td className="px-8 py-6"><span className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-mono font-black text-slate-400 border border-slate-100">{o.bankRef || 'N/A'}</span></td>
                       <td className="px-8 py-6 font-display font-black text-slate-900">${o.totalAmount}</td>
                       <td className="px-8 py-6 text-right">
                         <button onClick={() => handleVerify(o.id)} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95">VERIFY & DISPATCH</button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
               {data.orders.filter(o => o.status === 'Pending').length === 0 && (
                 <div className="p-32 text-center text-slate-400 italic font-bold uppercase tracking-widest text-[11px]">Registry Status: All settlements verified.</div>
               )}
             </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
               <div className="bg-white p-10 rounded-[4rem] border border-slate-200 shadow-xl">
                 <h3 className="text-xl font-black mb-8 text-slate-900 uppercase tracking-tighter">Stock Injection Node</h3>
                 <form onSubmit={handleImport} className="space-y-6">
                   <div>
                     <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Product SKU</label>
                     <select value={importPid} onChange={e => setImportPid(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-5 text-sm outline-none focus:border-unicou-navy font-bold">
                       <option value="">Select SKU...</option>
                       {data.products.filter(p => p.type === 'Voucher').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Voucher Codes (New Lines)</label>
                     <textarea value={rawCodes} onChange={e => setRawCodes(e.target.value)} placeholder="ABC-123-456&#10;XYZ-789-012" className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 text-sm font-mono focus:border-unicou-navy h-64 outline-none resize-none font-bold shadow-inner" />
                   </div>
                   <button disabled={processing || !importPid} className="w-full py-6 bg-unicou-navy hover:bg-slate-950 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all disabled:opacity-50">
                     {processing ? 'SYNCING...' : 'SYNC TO VAULT'}
                   </button>
                 </form>
               </div>
            </div>
            <div className="lg:col-span-8">
              <div className="bg-white rounded-[4rem] border border-slate-200 overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] border-b border-slate-100">
                    <tr><th className="px-8 py-6">Node</th><th className="px-8 py-6">Voucher String</th><th className="px-8 py-6">State</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.codes.slice(-50).reverse().map(c => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">{data.products.find(p => p.id === c.productId)?.name}</td>
                        <td className="px-8 py-6 font-mono text-unicou-navy font-black text-sm">{c.code}</td>
                        <td className="px-8 py-6"><span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${c.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>{c.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="bg-white rounded-[4rem] border border-slate-200 overflow-hidden shadow-2xl">
            <h2 className="px-12 py-10 text-2xl font-black text-slate-900 uppercase tracking-tighter border-b border-slate-100">Global Lead Registry</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] border-b border-slate-100">
                    <th className="px-8 py-6">Identity Node</th>
                    <th className="px-8 py-6">Type</th>
                    <th className="px-8 py-6">Submission Details</th>
                    <th className="px-8 py-6">Timestamp</th>
                    <th className="px-8 py-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-slate-50">
                      <td className="px-8 py-6">
                        <div className="font-black text-slate-900 uppercase tracking-tight">{lead.data.name || lead.data.agency_name}</div>
                        <div className="text-[10px] text-slate-500 font-mono italic">{lead.data.email}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${lead.type === 'student' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                          {lead.type}
                        </span>
                      </td>
                      <td className="px-8 py-6 max-w-xs">
                        <p className="text-[11px] text-slate-600 font-medium italic line-clamp-2">
                          {Object.entries(lead.data).map(([k, v]) => `${k}: ${v}`).join(' • ')}
                        </p>
                      </td>
                      <td className="px-8 py-6 text-[10px] font-mono font-bold text-slate-400">
                        {new Date(lead.timestamp).toLocaleString()}
                      </td>
                      <td className="px-8 py-6 text-right">
                         <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-[9px] font-black uppercase text-slate-500">New Node</span>
                      </td>
                    </tr>
                  ))}
                  {data.leads.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-32 text-center text-slate-400 italic font-bold uppercase tracking-widest text-[11px]">No active leads in registry.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="bg-white rounded-[4rem] border border-slate-200 overflow-hidden shadow-2xl">
             <div className="p-12 border-b border-slate-100 bg-slate-50/50">
               <h2 className="text-3xl font-display font-black text-slate-900 tracking-tighter uppercase">Team Authority Registry</h2>
               <p className="text-slate-500 mt-2 font-bold uppercase text-xs tracking-widest">Assign access scopes to sales, finance, and support nodes.</p>
             </div>
             <table className="w-full text-left">
               <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-100">
                 <tr><th className="px-8 py-6">Identity</th><th className="px-8 py-6">Current Scope</th><th className="px-8 py-6 text-right">Modify Access</th></tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {data.users.map(u => (
                   <tr key={u.id} className="hover:bg-slate-50 transition-all">
                     <td className="px-8 py-6"><div className="font-black text-slate-900 uppercase tracking-tight">{u.name}</div><div className="text-[11px] text-slate-500 font-mono">{u.email}</div></td>
                     <td className="px-8 py-6"><span className="px-5 py-2 bg-white border border-slate-200 text-unicou-navy rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm">{u.role}</span></td>
                     <td className="px-8 py-6 text-right">
                       <select value={u.role} onChange={e => handleRoleUpdate(u.id, e.target.value)} className="bg-white border border-slate-200 rounded-2xl px-6 py-2.5 text-[10px] font-black uppercase outline-none focus:border-unicou-orange shadow-sm cursor-pointer">
                         <option value="Customer">Standard User</option>
                         <option value="Agent">Agent Partner</option>
                         <option value="Finance">Finance / Teller</option>
                         <option value="Trainer">Exam Grader</option>
                         <option value="Admin">System Admin</option>
                       </select>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white rounded-[4rem] border border-slate-200 overflow-hidden shadow-2xl">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-100">
                <tr><th className="px-8 py-6">Timestamp</th><th className="px-8 py-6">Staff Actor</th><th className="px-8 py-6">Action Node</th><th className="px-8 py-6">Critical Details</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.logs.map(log => (
                  <tr key={log.id} className="text-[11px] font-bold text-slate-700 hover:bg-slate-50">
                    <td className="px-8 py-6 font-mono text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-8 py-6 text-slate-900 uppercase">{log.userEmail}</td>
                    <td className="px-8 py-6"><span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${log.severity === 'critical' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>{log.action}</span></td>
                    <td className="px-8 py-6 text-slate-500 italic">"{log.details}"</td>
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