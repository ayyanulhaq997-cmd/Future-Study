
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/apiService';
import { Product, VoucherCode, Order, User, Lead, UserRole, LMSCourse, LMSModule, LMSLesson } from '../types';

type AdminTab = 'ledger' | 'inventory' | 'lms-content' | 'partners' | 'staff' | 'security' | 'settings';

const AdminDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('ledger');
  const [loading, setLoading] = useState(true);
  const [security, setSecurity] = useState(api.getSecurityState());
  const [settings, setSettings] = useState(api.getSystemSettings());
  const [data, setData] = useState<{
    products: Product[],
    codes: VoucherCode[],
    orders: Order[],
    users: User[],
    leads: Lead[],
    lmsCourses: LMSCourse[]
  }>({ products: [], codes: [], orders: [], users: [], leads: [], lmsCourses: [] });

  const [bulkCodes, setBulkCodes] = useState('');
  const [targetProductId, setTargetProductId] = useState('');
  const [newStaff, setNewStaff] = useState<Partial<User>>({ role: 'Finance' });

  const fetchData = async () => {
    const [p, c, o, u, le, lc] = await Promise.all([
      api.getProducts(), api.getCodes(), api.getOrders(), api.getUsers(), api.getLeads(), api.getAllLMSCourses()
    ]);
    setData({ products: p, codes: c, orders: o, users: u, leads: le, lmsCourses: lc });
    setSecurity(api.getSecurityState());
    setSettings(api.getSystemSettings());
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleWipeOrders = async () => {
    if (confirm("CRITICAL: This will permanently DELETE ALL PREVIOUS ORDERS and reset voucher availability. Proceed?")) {
      await api.clearAllOrders();
      alert("Order Ledger Purged Successfully.");
      fetchData();
    }
  };

  const handleFactoryReset = async () => {
    if (confirm("NUCLEAR RESET: This will wipe ALL Custom Products, Orders, Leads, and LMS Enrollments. Return to factory default?")) {
      await api.resetSystemData();
      alert("System Reset Complete. Portal re-initialized.");
      window.location.reload();
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Remove custom product node: ${name}?`)) {
       await api.deleteProduct(id);
       fetchData();
    }
  };

  const handleInjectCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProductId || !bulkCodes.trim()) return alert("Select product and paste codes.");
    const codesArray = bulkCodes.split('\n').map(c => c.trim()).filter(c => c.length > 0);
    await api.addVoucherCodes(targetProductId, codesArray);
    alert(`Vault Synced: ${codesArray.length} codes injected.`);
    setBulkCodes('');
    fetchData();
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-[#004a61] font-black uppercase text-[11px] tracking-[0.4em]">Initializing Global Control Hub...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="flex flex-col xl:flex-row justify-between items-center gap-10 mb-16 border-b border-slate-100 pb-12">
        <div className="text-center xl:text-left">
           <h1 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">
             SYSTEM <span className="text-[#f15a24]">HUB</span>
           </h1>
           <p className="text-[10px] font-black text-[#004a61] uppercase tracking-[0.4em]">UniCou Institutional Control Node</p>
        </div>
        
        <div className="flex flex-wrap justify-center bg-slate-50 p-2 rounded-[2rem] border border-slate-200 shadow-inner">
           {(['ledger', 'inventory', 'partners', 'staff', 'security', 'settings'] as AdminTab[]).map((tab) => (
             <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-[#004a61] shadow-lg border border-slate-200' : 'text-slate-400 hover:text-slate-900'}`}>
               {tab}
             </button>
           ))}
        </div>
      </div>

      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in duration-500">
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 shadow-inner">
                 <h3 className="text-xl font-black text-[#004a61] uppercase mb-8 tracking-tighter">Vault stock injection</h3>
                 <form onSubmit={handleInjectCodes} className="space-y-6">
                    <select required className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-xs font-bold" value={targetProductId} onChange={e => setTargetProductId(e.target.value)}>
                      <option value="">Select Target Voucher...</option>
                      {data.products.filter(p => p.type === 'Voucher').map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <textarea required rows={8} className="w-full bg-white border border-slate-200 p-4 rounded-2xl text-[12px] font-mono shadow-inner" value={bulkCodes} onChange={e => setBulkCodes(e.target.value)} placeholder="PASTE CODES (ONE PER LINE)" />
                    <button type="submit" className="w-full py-5 bg-[#004a61] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-black">SYNC VAULT STOCK</button>
                 </form>
              </div>
           </div>
           
           <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
              <table className="w-full text-left">
                 <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <tr><th className="px-10 py-6">Voucher SKU</th><th className="px-10 py-6 text-center">In Stock</th><th className="px-10 py-6 text-right">Actions</th></tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {data.products.map(p => {
                      const count = data.codes.filter(c => c.productId === p.id && c.status === 'Available').length;
                      const isCustom = !['v-1', 'v-6', 'v-19', 'v-20', 'v-21', 'v-24', 'v-26'].includes(p.id);
                      return (
                        <tr key={p.id}>
                          <td className="px-10 py-6 font-black text-xs text-[#004a61] uppercase">{p.name} {isCustom && <span className="ml-2 text-[8px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded">CUSTOM</span>}</td>
                          <td className="px-10 py-6 text-center font-mono font-black">{count}</td>
                          <td className="px-10 py-6 text-right">
                             {isCustom && <button onClick={() => handleDeleteProduct(p.id, p.name)} className="text-red-500 hover:text-red-700 text-[10px] font-black uppercase">Revoke Node</button>}
                          </td>
                        </tr>
                      );
                    })}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="max-w-3xl mx-auto py-20 text-center">
           <div className="p-16 rounded-[4rem] border-2 border-slate-100 bg-white shadow-3xl">
              <h2 className="text-4xl font-display font-black uppercase mb-12 tracking-tighter">System <span className="text-red-600">Recovery</span></h2>
              <div className="space-y-6">
                <button onClick={handleWipeOrders} className="w-full py-8 bg-red-50 border border-red-200 text-red-600 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all shadow-2xl">PURGE ALL PREVIOUS ORDERS</button>
                <button onClick={handleFactoryReset} className="w-full py-8 bg-slate-900 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] hover:bg-black transition-all shadow-2xl">FULL FACTORY RESET</button>
              </div>
              <p className="mt-12 text-slate-400 font-bold italic text-sm">"Use these controls to clear test data before proceeding to live production nodes."</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
