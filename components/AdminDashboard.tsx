import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Product, Order, User, OrderStatus, BusinessMetrics } from '../types';

type AdminTab = 'command' | 'reports' | 'ledger' | 'stock' | 'authority';

const AdminDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('command');
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [halted, setHalted] = useState(api.getSystemHaltStatus());
  const [data, setData] = useState<{
    orders: Order[],
    users: User[],
    products: Product[]
  }>({ orders: [], users: [], products: [] });
  const [loading, setLoading] = useState(true);

  // Stock Form State
  const [stockInput, setStockInput] = useState({ productId: '', rawCodes: '' });
  const [injecting, setInjecting] = useState(false);

  const refreshData = async () => {
    const [o, u, p, m] = await Promise.all([
      api.getOrders(), api.getUsers(), api.getProducts(), api.getBusinessMetrics()
    ]);
    setData({ orders: o, users: u, products: p });
    setMetrics(m);
    setLoading(false);
  };

  useEffect(() => { refreshData(); }, []);

  const handleToggleHalt = () => {
    const next = !halted;
    if (confirm(`CRITICAL: Move all voucher procurement nodes to ${next ? 'HALTED' : 'ACTIVE'} status?`)) {
      api.setSystemHaltStatus(next);
      setHalted(next);
      refreshData();
    }
  };

  const handleStatusUpdate = async (oid: string, status: OrderStatus) => {
    await api.updateOrderStatus(oid, status);
    refreshData();
  };

  const handleInjectStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockInput.productId || !stockInput.rawCodes.trim()) return;
    setInjecting(true);
    const codes = stockInput.rawCodes.split('\n').filter(c => c.trim());
    await api.addStockToProduct(stockInput.productId, codes);
    setStockInput({ productId: '', rawCodes: '' });
    setInjecting(false);
    alert(`Success: ${codes.length} vouchers injected into Vault.`);
    refreshData();
  };

  const handleFreezeUser = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Frozen' ? 'Active' : 'Frozen';
    if (confirm(`${nextStatus} user access for node ${userId}?`)) {
      await api.upsertUser({ id: userId, status: nextStatus as any });
      refreshData();
    }
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase tracking-[0.4em]">Initializing Global Authority Node...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="flex flex-col xl:flex-row justify-between items-center gap-10 mb-16 border-b border-slate-100 pb-12">
        <div>
          <h1 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">SYSTEM <span className="text-unicou-orange">HUB</span></h1>
          <p className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.4em]">Business Owner & Operations Terminal</p>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleToggleHalt}
            className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl ${halted ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white animate-pulse'}`}
          >
            {halted ? 'I. RESUME VOUCHER SYSTEM' : 'X. STOP ALL VOUCHER SYSTEM'}
          </button>
          <div className="flex bg-slate-50 p-1.5 rounded-[2rem] border border-slate-200 shadow-inner">
            {(['command', 'reports', 'ledger', 'stock', 'authority'] as AdminTab[]).map(t => (
              <button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white text-unicou-navy shadow-lg border border-slate-200' : 'text-slate-400'}`}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'command' && metrics && (
        <div className="animate-in fade-in duration-500 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <KPICard label="I. Daily Revenue" value={`$${metrics.todaySales.toLocaleString()}`} icon="💸" color="text-emerald-600" />
            <KPICard label="II. Vault Stock" value={metrics.vouchersInStock.toString()} icon="🎫" color="text-unicou-orange" />
            <KPICard label="III. Active Agents" value={metrics.activeAgents.toString()} icon="🤝" color="text-blue-600" />
            <KPICard label="IV. Risk Alerts" value={metrics.riskAlerts.toString()} icon="🛡️" color="text-red-600" alert={metrics.riskAlerts > 0} />
            <KPICard label="V. Node Status" value={halted ? 'HALTED' : 'ACTIVE'} icon="⚙️" color={halted ? 'text-red-600' : 'text-emerald-600'} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
             <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-3xl relative overflow-hidden">
                <h3 className="text-2xl font-display font-black uppercase mb-8">VII. Revenue Balances</h3>
                <div className="space-y-6">
                   <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Month-to-Date Gross</span>
                      <span className="text-2xl font-black text-unicou-orange">${metrics.monthRevenue.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Refund Liability Node</span>
                      <span className="text-2xl font-black text-white">$0.00</span>
                   </div>
                </div>
             </div>
             <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl">
                <h3 className="text-2xl font-display font-black text-unicou-navy uppercase mb-8">VIII. Audit Log (Live)</h3>
                <div className="space-y-4 max-h-[250px] overflow-y-auto no-scrollbar">
                   {data.orders.slice(0, 5).map((o, i) => (
                     <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 italic font-bold text-slate-500 text-xs">
                        <span className="text-unicou-orange font-black">AUDIT:</span> Order {o.id} initialized for {o.buyerName}.
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="animate-in fade-in duration-500 space-y-12">
           <h3 className="text-3xl font-display font-black uppercase text-unicou-navy">IX. Performance Analytics</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
                 <h4 className="font-black uppercase text-[11px] text-slate-400 mb-6">Sales Report (Item Wise)</h4>
                 <div className="space-y-4">
                    {data.products.map(p => (
                      <div key={p.id} className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                         <span className="font-bold text-unicou-navy uppercase text-xs">{p.name}</span>
                         <span className="font-black text-unicou-orange">Sold: {data.orders.filter(o => o.productId === p.id && o.status === 'Approved').length}</span>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
                 <h4 className="font-black uppercase text-[11px] text-slate-400 mb-6">Regional Performance Node</h4>
                 <p className="text-slate-500 font-bold italic">Reporting engine synchronizing with global edge nodes...</p>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="animate-in fade-in duration-500 bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
          <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
             <h3 className="text-xl font-display font-black uppercase">V. Official Sales Register</h3>
             <button onClick={() => window.print()} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/20">Download Ledger</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-500 tracking-[0.1em]">
                <tr>
                  <th className="px-6 py-6">I. Order ID</th>
                  <th className="px-6 py-6">II. Date</th>
                  <th className="px-6 py-6">III. Time</th>
                  <th className="px-6 py-6">IV. Buyer Name</th>
                  <th className="px-6 py-6">V. Bank A/C</th>
                  <th className="px-6 py-6">VI. Asset Node</th>
                  <th className="px-6 py-6">VII. Qty</th>
                  <th className="px-6 py-6">VIII. Paid Amount</th>
                  <th className="px-6 py-6 text-center">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.orders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5 font-mono font-black text-[11px] text-unicou-navy">{o.id}</td>
                    <td className="px-6 py-5 font-mono text-[11px] text-slate-500">{o.date}</td>
                    <td className="px-6 py-5 font-mono text-[11px] text-slate-500">{o.time}</td>
                    <td className="px-6 py-5 font-black text-[11px] text-slate-900 uppercase truncate max-w-[120px]">{o.buyerName}</td>
                    <td className="px-6 py-5 font-mono text-[11px] text-slate-400">****{o.bankLastFour}</td>
                    <td className="px-6 py-5 font-black text-[11px] text-slate-700 uppercase truncate max-w-[120px]">{o.productName}</td>
                    <td className="px-6 py-5 font-mono font-bold text-slate-500">{o.quantity}</td>
                    <td className="px-6 py-5 font-display font-black text-slate-950 text-base">${o.totalAmount}</td>
                    <td className="px-6 py-5">
                       <div className="flex flex-col items-center gap-2">
                          <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase border ${o.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>{o.status}</span>
                          {o.status === 'Pending' && (
                            <div className="flex gap-1">
                               <button onClick={() => handleStatusUpdate(o.id, 'Approved')} className="p-2 bg-emerald-500 text-white rounded-lg text-[8px] font-black uppercase">Approve</button>
                               <button onClick={() => handleStatusUpdate(o.id, 'Hold')} className="p-2 bg-amber-500 text-white rounded-lg text-[8px] font-black uppercase">Hold</button>
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
      )}

      {activeTab === 'stock' && (
        <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
           <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-3xl">
              <h3 className="text-3xl font-display font-black uppercase mb-8 tracking-tighter">Vault Stock Injection</h3>
              <form onSubmit={handleInjectStock} className="space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-2">1. Target Asset Node</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-unicou-orange transition-all"
                      value={stockInput.productId}
                      onChange={e => setStockInput({...stockInput, productId: e.target.value})}
                      required
                    >
                       <option value="" className="bg-slate-900">Select Product...</option>
                       {data.products.map(p => <option key={p.id} value={p.id} className="bg-slate-900">{p.name}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-2">2. Raw Node Cluster (One code per line)</label>
                    <textarea 
                      className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-10 text-emerald-400 font-mono text-sm min-h-[300px] outline-none focus:border-unicou-orange transition-all"
                      placeholder="XXXX-YYYY-ZZZZ&#10;AAAA-BBBB-CCCC"
                      value={stockInput.rawCodes}
                      onChange={e => setStockInput({...stockInput, rawCodes: e.target.value})}
                      required
                    />
                 </div>
                 <button 
                  disabled={injecting}
                  className="w-full py-6 bg-unicou-orange hover:bg-orange-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 disabled:opacity-50"
                 >
                   {injecting ? 'SYNCHRONIZING VAULT...' : 'COMMIT STOCK INJECTION'}
                 </button>
              </form>
           </div>
        </div>
      )}

      {activeTab === 'authority' && (
        <div className="animate-in fade-in duration-500 space-y-12">
          <div className="flex justify-between items-center">
            <h3 className="text-3xl font-display font-black uppercase text-unicou-navy">XI. Registered Stakeholders</h3>
            <button className="px-8 py-4 bg-unicou-navy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Deploy New Staff Node</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.users.map(u => (
              <div key={u.id} className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 hover:bg-white hover:shadow-2xl transition-all">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-inner font-black text-unicou-navy">{u.name.charAt(0)}</div>
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${u.status === 'Frozen' ? 'bg-red-600 text-white' : 'bg-unicou-navy text-white'}`}>{u.status}</span>
                </div>
                <h4 className="text-xl font-black text-slate-900 uppercase mb-1">{u.name}</h4>
                <p className="text-[10px] font-mono text-slate-400 mb-6 truncate">{u.email}</p>
                <p className="text-[10px] font-black text-unicou-orange uppercase tracking-widest mb-6">{u.role}</p>
                <div className="flex gap-2">
                  <button onClick={() => handleFreezeUser(u.id, u.status)} className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase shadow-sm transition-all active:scale-95">
                    {u.status === 'Frozen' ? 'V. Unfreeze' : 'V. Freeze'}
                  </button>
                  <button onClick={() => api.deleteUser(u.id).then(refreshData)} className="px-4 py-3 bg-red-50 text-red-600 rounded-xl text-[9px] font-black uppercase hover:bg-red-600 hover:text-white transition-all">Revoke</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const KPICard = ({ label, value, icon, color, alert }: any) => (
  <div className={`bg-white p-8 rounded-[2.5rem] border-2 transition-all ${alert ? 'border-red-500 shadow-red-500/10' : 'border-slate-50'} hover:shadow-xl flex flex-col`}>
     <div className="flex justify-between items-start mb-4"><span className="text-2xl">{icon}</span>{alert && <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />}</div>
     <p className={`text-2xl font-display font-black leading-none ${color} mb-1`}>{value}</p>
     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
  </div>
);

export default AdminDashboard;