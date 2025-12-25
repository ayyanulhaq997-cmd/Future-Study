import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Product, VoucherCode, Order, ActivityLog, User, SecurityStatus } from '../types';

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<{
    products: Product[],
    codes: VoucherCode[],
    orders: Order[],
    logs: ActivityLog[],
    users: User[],
    security: SecurityStatus | null
  }>({
    products: [], codes: [], orders: [], logs: [], users: [], security: null
  });
  
  const [activeTab, setActiveTab] = useState<'inventory' | 'verification' | 'staff' | 'audit'>('verification');
  const [loading, setLoading] = useState(true);
  const [importPid, setImportPid] = useState('');
  const [rawCodes, setRawCodes] = useState('');
  const [processing, setProcessing] = useState(false);

  const fetchData = async () => {
    try {
      const [p, c, o, l, u, s] = await Promise.all([
        api.getProducts(), 
        api.getCodes().catch(() => []), 
        api.getOrders(), 
        api.getLogs().catch(() => []), 
        api.getUsers().catch(() => []),
        api.getSecurityStatus()
      ]);
      setData({ products: p, codes: c, orders: o, logs: l, users: u, security: s });
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

  if (loading) return <div className="p-40 text-center animate-pulse text-primary-400 font-black uppercase tracking-widest">Establishing Live Authority Node...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 view-container pb-24">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight">System <span className="text-primary-400">Terminal</span></h1>
          <p className="text-slate-500 mt-2 font-medium">Identity Auth: <span className="text-white font-bold">{api.getCurrentUser()?.email}</span></p>
        </div>
        <div className="flex bg-slate-900/80 p-2 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-xl overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab('verification')} className={`px-8 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'verification' ? 'bg-unicou-orange text-white shadow-xl' : 'text-slate-500'}`}>TELLER DESK</button>
          <button onClick={() => setActiveTab('inventory')} className={`px-8 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'inventory' ? 'bg-primary-600 text-white shadow-xl' : 'text-slate-500'}`}>STOCK VAULT</button>
          <button onClick={() => setActiveTab('staff')} className={`px-8 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'staff' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500'}`}>TEAM CONTROL</button>
          <button onClick={() => setActiveTab('audit')} className={`px-8 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all whitespace-nowrap ${activeTab === 'audit' ? 'bg-slate-700 text-white shadow-xl' : 'text-slate-500'}`}>AUDIT TRAIL</button>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'verification' && (
          <div className="glass p-12 rounded-[3.5rem] border border-slate-800 shadow-3xl overflow-hidden">
             <h2 className="text-2xl font-bold mb-10">Fulfillment Queue</h2>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="bg-slate-900 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                     <th className="px-8 py-6">Order node</th>
                     <th className="px-8 py-6">Client / Email</th>
                     <th className="px-8 py-6">Bank Ref</th>
                     <th className="px-8 py-6">Total</th>
                     <th className="px-8 py-6 text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800/50">
                   {data.orders.filter(o => o.status === 'Pending').map(o => (
                     <tr key={o.id} className="hover:bg-slate-800/20 transition-all">
                       <td className="px-8 py-6"><span className="font-mono text-primary-400 font-bold">{o.id}</span></td>
                       <td className="px-8 py-6 text-slate-300 font-medium">{o.customerEmail}</td>
                       <td className="px-8 py-6"><span className="px-4 py-2 bg-slate-900 rounded-xl text-xs font-mono font-black text-slate-500">{o.bankRef || 'N/A'}</span></td>
                       <td className="px-8 py-6 font-display font-bold">${o.totalAmount}</td>
                       <td className="px-8 py-6 text-right">
                         <button onClick={() => handleVerify(o.id)} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all active:scale-95">VERIFY & DISPATCH</button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
               {data.orders.filter(o => o.status === 'Pending').length === 0 && (
                 <div className="p-32 text-center text-slate-600 italic font-medium">Registry Status: All settlements verified.</div>
               )}
             </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
               <div className="glass p-10 rounded-[3rem] border border-slate-800">
                 <h3 className="text-xl font-bold mb-8">Stock Injection Node</h3>
                 <form onSubmit={handleImport} className="space-y-6">
                   <div>
                     <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Product SKU</label>
                     <select value={importPid} onChange={e => setImportPid(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 text-sm outline-none focus:border-primary-500">
                       <option value="">Select SKU...</option>
                       {data.products.filter(p => p.type === 'Voucher').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Voucher Codes (New Lines)</label>
                     <textarea value={rawCodes} onChange={e => setRawCodes(e.target.value)} placeholder="ABC-123-456&#10;XYZ-789-012" className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-sm font-mono focus:border-primary-500 h-64 outline-none resize-none" />
                   </div>
                   <button disabled={processing || !importPid} className="w-full py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all disabled:opacity-50">
                     {processing ? 'SYNCING...' : 'SYNC TO VAULT'}
                   </button>
                 </form>
               </div>
            </div>
            <div className="lg:col-span-8">
              <div className="glass rounded-[3.5rem] border border-slate-800 overflow-hidden shadow-3xl">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                    <tr><th className="px-8 py-6">Node</th><th className="px-8 py-6">Voucher String</th><th className="px-8 py-6">State</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {data.codes.slice(-50).reverse().map(c => (
                      <tr key={c.id}>
                        <td className="px-8 py-6 text-[10px] font-bold text-slate-500 uppercase">{data.products.find(p => p.id === c.productId)?.name}</td>
                        <td className="px-8 py-6 font-mono text-primary-400 text-sm">{c.code}</td>
                        <td className="px-8 py-6"><span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${c.status === 'Available' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>{c.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="glass rounded-[3.5rem] border border-slate-800 overflow-hidden shadow-3xl">
             <div className="p-12 border-b border-slate-800 bg-slate-900/30">
               <h2 className="text-2xl font-bold">Team Authority Registry</h2>
               <p className="text-slate-500 mt-1">Assign access scopes to sales, finance, and support nodes.</p>
             </div>
             <table className="w-full text-left">
               <thead className="bg-slate-900 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                 <tr><th className="px-8 py-6">Identity</th><th className="px-8 py-6">Current Scope</th><th className="px-8 py-6 text-right">Modify Access</th></tr>
               </thead>
               <tbody className="divide-y divide-slate-800/50">
                 {data.users.map(u => (
                   <tr key={u.id}>
                     <td className="px-8 py-6"><div className="font-bold">{u.name}</div><div className="text-xs text-slate-500">{u.email}</div></td>
                     <td className="px-8 py-6"><span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest">{u.role}</span></td>
                     <td className="px-8 py-6 text-right">
                       <select value={u.role} onChange={e => handleRoleUpdate(u.id, e.target.value)} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-[10px] font-black uppercase outline-none focus:border-primary-500">
                         <option value="Customer">Standard User</option>
                         <option value="Agent">Agent Partner</option>
                         <option value="Finance">Finance Officer</option>
                         <option value="Teller">Support Teller</option>
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
          <div className="glass rounded-[3.5rem] border border-slate-800 overflow-hidden shadow-3xl">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                <tr><th className="px-8 py-6">Timestamp</th><th className="px-8 py-6">Staff Actor</th><th className="px-8 py-6">Action Node</th><th className="px-8 py-6">Critical Details</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {data.logs.map(log => (
                  <tr key={log.id} className="text-xs">
                    <td className="px-8 py-6 font-mono text-slate-600">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-8 py-6 font-bold text-slate-300">{log.userEmail}</td>
                    <td className="px-8 py-6"><span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${log.severity === 'critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-slate-800 text-slate-500'}`}>{log.action}</span></td>
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