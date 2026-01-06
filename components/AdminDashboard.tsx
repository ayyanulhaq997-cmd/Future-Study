
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Product, VoucherCode, Order, User, OrderStatus, LMSCourse, BusinessMetrics, UserRole } from '../types';

type AdminTab = 'command-center' | 'financials' | 'lms-architect' | 'partners' | 'stock' | 'staff' | 'user-governance';

const AdminDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('command-center');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [data, setData] = useState<{
    orders: Order[],
    users: User[],
    products: Product[],
    lmsCourses: LMSCourse[]
  }>({ orders: [], users: [], products: [], lmsCourses: [] });

  // Safety Node State
  const [halted, setHalted] = useState(api.getSystemHaltStatus());

  // Stock Injection State
  const [selectedProduct, setSelectedProduct] = useState('');
  const [rawCodes, setRawCodes] = useState('');
  const [injecting, setInjecting] = useState(false);

  // Staff Management State
  const [editingStaff, setEditingStaff] = useState<Partial<User> | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const [o, u, p, lms, m] = await Promise.all([
      api.getOrders(), api.getUsers(), api.getProducts(), api.getAllLMSCourses(), api.getBusinessMetrics()
    ]);
    setData({ orders: o, users: u, products: p, lmsCourses: lms });
    setMetrics(m);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    if (confirm(`ADMIN: Move ${orderId} to ${status.toUpperCase()}? (Email will deliver to customer)`)) {
      await api.updateOrderStatus(orderId, status);
      fetchData();
    }
  };

  const handleToggleHalt = () => {
    const newState = !halted;
    if (confirm(`CRITICAL: Are you sure you want to ${newState ? 'STOP' : 'RESUME'} all voucher procurement nodes?`)) {
      api.setSystemHaltStatus(newState);
      setHalted(newState);
      fetchData();
    }
  };

  const exportCSV = (type: 'users' | 'orders') => {
    let content = "";
    if (type === 'users') {
      content = "ID,Name,Email,Role,Status\n" + data.users.map(u => `${u.id},${u.name},${u.email},${u.role},${u.status}`).join("\n");
    } else {
      content = "Order ID,Date,Buyer,Product,Amount,Status\n" + data.orders.map(o => `${o.id},${o.date},${o.buyerName},${o.productName},${o.totalAmount},${o.status}`).join("\n");
    }
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unicou_${type}_report_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const handleFreezeUser = async (id: string, isFrozen: boolean) => {
    const target = data.users.find(u => u.id === id);
    if (!target) return;
    if (confirm(`${isFrozen ? 'Freeze' : 'Unfreeze'} access for ${target.email}?`)) {
      await api.upsertUser({ ...target, status: isFrozen ? 'Frozen' : 'Active' });
      fetchData();
    }
  };

  const handleInjectStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !rawCodes.trim()) return;
    setInjecting(true);
    const codes = rawCodes.split('\n').filter(c => c.trim());
    await api.addStockToProduct(selectedProduct, codes);
    setRawCodes('');
    setSelectedProduct('');
    setInjecting(false);
    alert(`Successfully injected ${codes.length} codes into Vault.`);
    fetchData();
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase text-[11px] tracking-[0.4em]">Initializing Hub...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="flex flex-col xl:flex-row justify-between items-center gap-10 mb-16 border-b border-slate-100 pb-12">
        <div>
           <h1 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">SYSTEM <span className="text-unicou-orange">HUB</span></h1>
           <p className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.4em]">Integrated Business Intelligence & Multi-Node Control</p>
        </div>

        <div className="flex flex-col items-end gap-4">
           <button 
             onClick={handleToggleHalt}
             className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl ${halted ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white animate-pulse'}`}
           >
             {halted ? 'I. RESUME VOUCHER SYSTEM' : 'X. STOP ALL VOUCHER SYSTEM'}
           </button>
           
           <div className="flex flex-wrap justify-center bg-slate-50 p-2 rounded-[2rem] border border-slate-200 shadow-inner">
              {(['command-center', 'financials', 'user-governance', 'stock', 'staff'] as AdminTab[]).map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-unicou-navy shadow-lg border border-slate-200' : 'text-slate-400 hover:text-slate-900'}`}>{tab.replace('-', ' ')}</button>
              ))}
           </div>
        </div>
      </div>

      {activeTab === 'command-center' && metrics && (
        <div className="animate-in fade-in duration-500 space-y-12">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              <KPICard label="Today's Sales" value={`$${metrics.todaySales.toLocaleString()}`} icon="💸" color="text-emerald-600" />
              <KPICard label="Month Revenue" value={`$${metrics.monthRevenue.toLocaleString()}`} icon="📈" color="text-unicou-navy" />
              <KPICard label="Vouchers Stock" value={metrics.vouchersInStock.toString()} icon="🎫" color="text-unicou-orange" />
              <KPICard label="Active Agents" value={metrics.activeAgents.toString()} icon="🤝" color="text-blue-600" />
              <KPICard label="Risk Alerts" value={metrics.riskAlerts.toString()} icon="🛡️" color="text-red-600" alert={metrics.riskAlerts > 0} />
           </div>

           <div className="flex gap-4">
              <button onClick={() => exportCSV('users')} className="px-6 py-3 bg-slate-100 rounded-xl text-[9px] font-black uppercase hover:bg-slate-200 transition-all">Download Users Sheet (CSV)</button>
              <button onClick={() => exportCSV('orders')} className="px-6 py-3 bg-slate-100 rounded-xl text-[9px] font-black uppercase hover:bg-slate-200 transition-all">Download Orders Sheet (CSV)</button>
           </div>
        </div>
      )}

      {activeTab === 'financials' && (
        <div className="animate-in fade-in duration-500">
           <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 text-[9px] font-black uppercase text-slate-400 tracking-[0.1em]">
                      <tr>
                        <th className="px-6 py-6">I. Order ID</th>
                        <th className="px-6 py-6">II. Date</th>
                        <th className="px-6 py-6">III. Time</th>
                        <th className="px-6 py-6">IV. Buyer Name</th>
                        <th className="px-6 py-6">V. Bank A/C (4)</th>
                        <th className="px-6 py-6">VI. Voucher Type</th>
                        <th className="px-6 py-6">VII. Qty</th>
                        <th className="px-6 py-6">VIII. Paid Amount</th>
                        <th className="px-6 py-6 text-center">Control</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {data.orders.map((o) => (
                          <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-5 font-mono font-black text-[11px] text-unicou-navy">{o.id}</td>
                            <td className="px-6 py-5 font-mono text-[11px] text-slate-500">{o.date}</td>
                            <td className="px-6 py-5 font-mono text-[11px] text-slate-500">{o.time}</td>
                            <td className="px-6 py-5 font-black text-[11px] text-slate-900 uppercase truncate max-w-[120px]">{o.buyerName}</td>
                            <td className="px-6 py-5 font-mono text-[11px] text-slate-500">****{o.bankLastFour}</td>
                            <td className="px-6 py-5 font-black text-[11px] text-slate-700 uppercase">{o.productName}</td>
                            <td className="px-6 py-5 font-mono text-[11px] text-slate-500">{o.quantity}</td>
                            <td className="px-6 py-5 font-display font-black text-slate-950 text-base">${o.totalAmount}</td>
                            <td className="px-6 py-5">
                               <div className="flex flex-col items-center gap-3">
                                  <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase border ${
                                    o.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                    o.status === 'Hold' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                    o.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                                  }`}>{o.status}</span>
                                  {(o.status === 'Pending' || o.status === 'Hold') && (
                                    <div className="flex bg-slate-200 p-1 rounded-xl gap-1">
                                       <button onClick={() => handleUpdateStatus(o.id, 'Approved')} className="px-3 py-1.5 bg-white rounded-lg text-[8px] font-black hover:bg-emerald-500 hover:text-white uppercase shadow-sm">I. Approve</button>
                                       <button onClick={() => handleUpdateStatus(o.id, 'Hold')} className="px-3 py-1.5 bg-white rounded-lg text-[8px] font-black hover:bg-amber-500 hover:text-white uppercase shadow-sm">II. Hold</button>
                                       <button onClick={() => handleUpdateStatus(o.id, 'Rejected')} className="px-3 py-1.5 bg-white rounded-lg text-[8px] font-black hover:bg-red-500 hover:text-white uppercase shadow-sm">III. Reject</button>
                                    </div>
                                  )}
                               </div>
                            </td>
                          </tr>
                      ))}
                  </tbody>
                </table>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'user-governance' && (
        <div className="animate-in fade-in duration-500 space-y-8">
           <h3 className="text-3xl font-display font-black uppercase text-unicou-navy">Unified User Governance</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.users.map(u => (
                <div key={u.id} className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 group hover:bg-white hover:shadow-2xl transition-all">
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-inner font-black text-unicou-navy">{u.name.charAt(0)}</div>
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${
                        u.status === 'Frozen' ? 'bg-red-600 text-white' : 'bg-unicou-navy text-white'
                      }`}>{u.status}</span>
                   </div>
                   <h4 className="text-lg font-black text-slate-900 uppercase truncate">{u.name}</h4>
                   <p className="text-[9px] font-mono text-slate-400 mb-6">{u.email}</p>
                   <p className="text-[9px] font-black text-unicou-orange uppercase tracking-widest mb-6">{u.role}</p>
                   <div className="flex gap-2">
                      <button onClick={() => handleFreezeUser(u.id, u.status !== 'Frozen')} className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">
                         {u.status === 'Frozen' ? 'V. Unfreeze' : 'V. Freeze'}
                      </button>
                      <button onClick={() => api.deleteUser(u.id).then(fetchData)} className="px-4 py-3 bg-red-50 text-red-600 rounded-xl text-[9px] font-black uppercase">Revoke</button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'stock' && (
        <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
           <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-3xl">
              <h3 className="text-3xl font-display font-black uppercase mb-4 tracking-tighter">Vault Stock Injection</h3>
              <form onSubmit={handleInjectStock} className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-2">1. Select Target Asset Node</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-unicou-orange" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} required>
                       <option value="" className="bg-slate-900">Select Voucher Type...</option>
                       {data.products.map(p => <option key={p.id} value={p.id} className="bg-slate-900">{p.name}</option>)}
                    </select>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-2">2. Raw Code Cluster (One per line)</label>
                    <textarea className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-10 text-emerald-400 font-mono text-sm min-h-[300px] outline-none focus:border-unicou-orange" value={rawCodes} onChange={(e) => setRawCodes(e.target.value)} required />
                 </div>
                 <button disabled={injecting || !selectedProduct || !rawCodes.trim()} className="w-full py-6 bg-unicou-orange hover:bg-orange-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all">
                   {injecting ? 'SYNCHRONIZING VAULT...' : 'COMMIT STOCK INJECTION'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

const KPICard = ({ label, value, icon, color, alert }: any) => (
  <div className={`bg-white p-8 rounded-[2.5rem] border-2 transition-all ${alert ? 'border-red-500 shadow-red-500/10' : 'border-slate-50 shadow-sm'} hover:shadow-xl hover:scale-[1.02] flex flex-col`}>
     <div className="flex justify-between items-start mb-4"><span className="text-2xl">{icon}</span>{alert && <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />}</div>
     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
     <p className={`text-2xl font-display font-black leading-none ${color}`}>{value}</p>
  </div>
);

export default AdminDashboard;
