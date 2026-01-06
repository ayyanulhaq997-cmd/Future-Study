
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Product, Order, User, OrderStatus, LMSCourse, BusinessMetrics, UserRole } from '../types';

type AdminTab = 'command' | 'ledger' | 'architect' | 'vault' | 'authority';

const AdminDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('command');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [halted, setHalted] = useState(api.getSystemHaltStatus());
  const [data, setData] = useState<{
    orders: Order[],
    users: User[],
    products: Product[],
    lmsCourses: LMSCourse[]
  }>({ orders: [], users: [], products: [], lmsCourses: [] });

  const [inject, setInject] = useState({ pid: '', raw: '', loading: false });
  const [staff, setStaff] = useState<Partial<User> | null>(null);

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

  const handleToggleHalt = () => {
    const next = !halted;
    if (confirm(`CRITICAL: Move all voucher procurement nodes to ${next ? 'HALTED' : 'ACTIVE'} status?`)) {
      api.setSystemHaltStatus(next);
      setHalted(next);
      fetchData();
    }
  };

  const handleInject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inject.pid || !inject.raw.trim()) return;
    setInject({ ...inject, loading: true });
    const codes = inject.raw.split('\n').filter(c => c.trim());
    await api.addStockToProduct(inject.pid, codes);
    setInject({ pid: '', raw: '', loading: false });
    alert(`Audit Log: ${codes.length} strings injected into Vault.`);
    fetchData();
  };

  const handleFreeze = async (id: string, currentStatus: string) => {
    const next = currentStatus === 'Frozen' ? 'Active' : 'Frozen';
    if (confirm(`${next} identity node for ${id}?`)) {
      const u = data.users.find(x => x.id === id);
      if (u) {
        await api.upsertUser({ ...u, status: next as any });
        fetchData();
      }
    }
  };

  if (loading) return <div className="p-40 text-center animate-pulse font-black text-unicou-navy uppercase tracking-[0.4em]">Initializing Global Control...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="flex flex-col xl:flex-row justify-between items-center gap-10 mb-16 border-b border-slate-100 pb-12">
        <div>
           <h1 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">SYSTEM <span className="text-unicou-orange">HUB</span></h1>
           <p className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.4em]">Unified Multi-Node Control Terminal</p>
        </div>

        <div className="flex items-center gap-6">
           <button 
             onClick={handleToggleHalt}
             className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl ${halted ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white animate-pulse'}`}
           >
             {halted ? 'I. RESUME VOUCHER SYSTEM' : 'X. STOP ALL VOUCHER SYSTEM'}
           </button>
           <div className="flex bg-slate-50 p-1.5 rounded-[2rem] border border-slate-200 shadow-inner">
              {(['command', 'ledger', 'architect', 'vault', 'authority'] as AdminTab[]).map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white text-unicou-navy shadow-lg border border-slate-200' : 'text-slate-400'}`}>{t}</button>
              ))}
           </div>
        </div>
      </div>

      {activeTab === 'command' && metrics && (
        <div className="animate-in fade-in duration-500 space-y-12">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <KPICard label="Daily Revenue" value={`$${metrics.todaySales.toLocaleString()}`} icon="💸" color="text-emerald-600" />
              <KPICard label="Vault Stock" value={metrics.vouchersInStock.toString()} icon="🎫" color="text-unicou-orange" />
              <KPICard label="Agent Nodes" value={metrics.activeAgents.toString()} icon="🤝" color="text-blue-600" />
              <KPICard label="Risk/Hold" value={metrics.riskAlerts.toString()} icon="🛡️" color="text-red-600" alert={metrics.riskAlerts > 0} />
              <KPICard label="System Node" value={halted ? 'HALTED' : 'ACTIVE'} icon="⚙️" color={halted ? 'text-red-600' : 'text-emerald-600'} />
           </div>
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="animate-in fade-in duration-500 bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-[9px] font-black uppercase text-slate-400 tracking-[0.1em]">
                    <tr>
                      <th className="px-6 py-6">I. Order ID</th>
                      <th className="px-6 py-6">II. Date</th>
                      <th className="px-6 py-6">III. Time</th>
                      <th className="px-6 py-6">IV. Buyer Name</th>
                      <th className="px-6 py-6">V. Bank A/C (4)</th>
                      <th className="px-6 py-6">VI. Asset Type</th>
                      <th className="px-6 py-6">VII. Qty</th>
                      <th className="px-6 py-6">VIII. Paid Amount</th>
                      <th className="px-6 py-6 text-center">Control</th>
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
                                <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase border ${
                                  o.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                  o.status === 'Hold' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-50 text-slate-600'
                                }`}>{o.status}</span>
                                {(o.status === 'Pending' || o.status === 'Hold') && (
                                  <div className="flex bg-slate-200 p-1 rounded-xl gap-1">
                                     <button onClick={() => api.updateOrderStatus(o.id, 'Approved').then(fetchData)} className="px-3 py-1 bg-white rounded-lg text-[8px] font-black hover:bg-emerald-500 hover:text-white uppercase shadow-sm">I. Approve</button>
                                     <button onClick={() => api.updateOrderStatus(o.id, 'Hold').then(fetchData)} className="px-3 py-1 bg-white rounded-lg text-[8px] font-black hover:bg-amber-500 hover:text-white uppercase shadow-sm">II. Hold</button>
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

      {activeTab === 'vault' && (
        <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
           <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-3xl">
              <h3 className="text-3xl font-display font-black uppercase mb-8 tracking-tighter">Vault Stock Injection</h3>
              <form onSubmit={handleInject} className="space-y-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-2">1. Target Asset Node</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none" value={inject.pid} onChange={e => setInject({...inject, pid: e.target.value})} required>
                       <option value="" className="bg-slate-900">Select...</option>
                       {data.products.map(p => <option key={p.id} value={p.id} className="bg-slate-900">{p.name}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-2">2. Raw Node Cluster (One per line)</label>
                    <textarea className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-10 text-emerald-400 font-mono text-sm min-h-[300px] outline-none" value={inject.raw} onChange={e => setInject({...inject, raw: e.target.value})} required />
                 </div>
                 <button disabled={inject.loading} className="w-full py-6 bg-unicou-orange hover:bg-orange-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all">
                   {inject.loading ? 'SYNCHRONIZING VAULT...' : 'COMMIT STOCK INJECTION'}
                 </button>
              </form>
           </div>
        </div>
      )}

      {activeTab === 'authority' && (
        <div className="animate-in fade-in duration-500 space-y-12">
           <div className="flex justify-between items-center">
              <h3 className="text-3xl font-display font-black uppercase text-unicou-navy tracking-tighter">Authority Node Registry</h3>
              <button onClick={() => setStaff({ role: 'Support' })} className="px-8 py-4 bg-unicou-navy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Deploy New Staff Node</button>
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
                      <button onClick={() => handleFreeze(u.id, u.status)} className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase">{u.status === 'Frozen' ? 'V. Unfreeze' : 'V. Freeze'}</button>
                      <button onClick={() => api.deleteUser(u.id).then(fetchData)} className="px-4 py-3 bg-red-50 text-red-600 rounded-xl text-[9px] font-black uppercase">Revoke</button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {staff && (
        <div className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-xl rounded-[3.5rem] p-12 shadow-3xl animate-in zoom-in-95">
              <h2 className="text-3xl font-display font-black text-unicou-navy uppercase mb-8 tracking-tighter">Authority Node Sync</h2>
              <form onSubmit={async (e) => { e.preventDefault(); await api.upsertUser(staff); setStaff(null); fetchData(); }} className="space-y-6">
                 <AdminInput label="Legal Name" value={staff.name || ''} onChange={(v:any) => setStaff({...staff, name: v})} required />
                 <AdminInput label="Official Email" type="email" value={staff.email || ''} onChange={(v:any) => setStaff({...staff, email: v})} required />
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Scope</label>
                    <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold outline-none" value={staff.role || 'Support'} onChange={e => setStaff({...staff, role: e.target.value as any})}>
                       <option value="Operation Manager">Operation Manager</option>
                       <option value="Finance">Finance</option>
                       <option value="Support">Support</option>
                       <option value="Trainer">Trainer</option>
                    </select>
                 </div>
                 <div className="flex gap-4 pt-6">
                    <button type="button" onClick={() => setStaff(null)} className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase">Cancel</button>
                    <button type="submit" className="flex-[2] py-5 bg-unicou-navy text-white rounded-2xl font-black text-[10px] uppercase shadow-xl">Authorize Node</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

const KPICard = ({ label, value, icon, color, alert }: any) => (
  <div className={`bg-white p-8 rounded-[2.5rem] border-2 transition-all ${alert ? 'border-red-500 shadow-red-500/10' : 'border-slate-50'} hover:shadow-xl flex flex-col`}>
     <div className="flex justify-between items-start mb-4"><span className="text-2xl">{icon}</span>{alert && <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />}</div>
     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
     <p className={`text-2xl font-display font-black leading-none ${color}`}>{value}</p>
  </div>
);

const AdminInput = ({ label, onChange, value, ...props }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">{label}</label>
    <input className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold outline-none focus:border-unicou-navy shadow-inner" value={value} onChange={e => onChange(e.target.value)} {...props} />
  </div>
);

export default AdminDashboard;
