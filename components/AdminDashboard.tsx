
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Product, VoucherCode, Order, User, OrderStatus, LMSCourse, LMSModule, LMSLesson, BusinessMetrics, UserRole } from '../types';

type AdminTab = 'command-center' | 'financials' | 'lms-architect' | 'partners' | 'stock' | 'staff';

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

  // Stock Injection State
  const [selectedProduct, setSelectedProduct] = useState('');
  const [rawCodes, setRawCodes] = useState('');
  const [injecting, setInjecting] = useState(false);

  // Staff Management State
  const [editingStaff, setEditingStaff] = useState<Partial<User> | null>(null);

  // LMS State
  const [editingCourse, setEditingCourse] = useState<Partial<LMSCourse> | null>(null);
  const [editingModule, setEditingModule] = useState<{ courseId: string, module: Partial<LMSModule> } | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ courseId: string, moduleId: string, lesson: Partial<LMSLesson> } | null>(null);

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

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      await api.upsertUser(editingStaff);
      setEditingStaff(null);
      fetchData();
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (confirm("Permanently revoke authority from this node?")) {
      await api.deleteUser(id);
      fetchData();
    }
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase text-[11px] tracking-[0.4em]">Initializing Hub...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="flex flex-col xl:flex-row justify-between items-center gap-10 mb-16 border-b border-slate-100 pb-12">
        <div>
           <h1 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">SYSTEM <span className="text-unicou-orange">HUB</span></h1>
           <p className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.4em]">Integrated Business Intelligence & Multi-Node Control</p>
        </div>
        
        <div className="flex flex-wrap justify-center bg-slate-50 p-2 rounded-[2rem] border border-slate-200 shadow-inner">
           {(['command-center', 'financials', 'lms-architect', 'partners', 'stock', 'staff'] as AdminTab[]).map((tab) => (
             <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-unicou-navy shadow-lg border border-slate-200' : 'text-slate-400 hover:text-slate-900'}`}>{tab.replace('-', ' ')}</button>
           ))}
        </div>
      </div>

      {/* TAB: COMMAND CENTER */}
      {activeTab === 'command-center' && metrics && (
        <div className="animate-in fade-in duration-500 space-y-12">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              <KPICard label="Today's Sales" value={`$${metrics.todaySales.toLocaleString()}`} icon="💸" color="text-emerald-600" />
              <KPICard label="Month Revenue" value={`$${metrics.monthRevenue.toLocaleString()}`} icon="📈" color="text-unicou-navy" />
              <KPICard label="Vouchers Stock" value={metrics.vouchersInStock.toString()} icon="🎫" color="text-unicou-orange" />
              <KPICard label="Active Agents" value={metrics.activeAgents.toString()} icon="🤝" color="text-blue-600" />
              <KPICard label="Risk Alerts" value={metrics.riskAlerts.toString()} icon="🛡️" color="text-red-600" alert={metrics.riskAlerts > 0} />
              <KPICard label="Refund Requests" value={metrics.refundRequests.toString()} icon="🔄" color="text-amber-600" />
           </div>
        </div>
      )}

      {/* TAB: FINANCIALS (8-Column Ledger) */}
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
                        <th className="px-6 py-6">V. Product Name</th>
                        <th className="px-6 py-6">VI. Amount</th>
                        <th className="px-6 py-6">VII. Ref No.</th>
                        <th className="px-6 py-6 text-center">VIII. Terminal Control</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {data.orders.map((o) => (
                          <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-5 font-mono font-black text-[11px] text-unicou-navy">{o.id}</td>
                            <td className="px-6 py-5 font-mono text-[11px] text-slate-500">{o.date}</td>
                            <td className="px-6 py-5 font-mono text-[11px] text-slate-500">{o.time}</td>
                            <td className="px-6 py-5 font-black text-[11px] text-slate-900 uppercase truncate max-w-[120px]">{o.buyerName}</td>
                            <td className="px-6 py-5 font-black text-[11px] text-slate-700 uppercase">{o.productName}</td>
                            <td className="px-6 py-5 font-display font-black text-slate-950 text-base">${o.totalAmount}</td>
                            <td className="px-6 py-5 font-mono font-bold text-[10px] text-slate-400 uppercase truncate max-w-[100px]">{o.bankRef}</td>
                            <td className="px-6 py-5">
                               <div className="flex flex-col items-center gap-3">
                                  <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase border ${
                                    o.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                    o.status === 'Hold' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                    o.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                                  }`}>{o.status}</span>
                                  {o.status === 'Pending' || o.status === 'Hold' ? (
                                    <div className="flex bg-slate-200 p-1 rounded-xl gap-1">
                                       <button onClick={() => handleUpdateStatus(o.id, 'Approved')} className="px-3 py-1.5 bg-white rounded-lg text-[8px] font-black hover:bg-emerald-500 hover:text-white uppercase shadow-sm">I. Approve</button>
                                       <button onClick={() => handleUpdateStatus(o.id, 'Hold')} className="px-3 py-1.5 bg-white rounded-lg text-[8px] font-black hover:bg-amber-500 hover:text-white uppercase shadow-sm">II. Hold</button>
                                       <button onClick={() => handleUpdateStatus(o.id, 'Rejected')} className="px-3 py-1.5 bg-white rounded-lg text-[8px] font-black hover:bg-red-500 hover:text-white uppercase shadow-sm">III. Reject</button>
                                    </div>
                                  ) : <span className="text-[7px] font-black text-slate-300 uppercase italic">Archived Record</span>}
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

      {/* TAB: STOCK MANAGEMENT (FIX: ADD TO EXISTING) */}
      {activeTab === 'stock' && (
        <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
           <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-3xl">
              <h3 className="text-3xl font-display font-black uppercase mb-4 tracking-tighter">Vault Stock Injection</h3>
              <p className="text-slate-400 font-bold italic mb-10 leading-relaxed">"Inject raw voucher strings into the isolated digital vault for real-time procurement."</p>
              
              <form onSubmit={handleInjectStock} className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-2">1. Select Target Asset Node</label>
                    <select 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold outline-none focus:border-unicou-orange transition-all appearance-none cursor-pointer"
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      required
                    >
                       <option value="" className="bg-slate-900">Select Existing Voucher Type...</option>
                       {data.products.map(p => <option key={p.id} value={p.id} className="bg-slate-900">{p.name}</option>)}
                    </select>
                 </div>

                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-2">2. Raw Code Cluster (One per line)</label>
                    <textarea 
                      className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-10 text-emerald-400 font-mono text-sm min-h-[300px] outline-none focus:border-unicou-orange transition-all placeholder:text-white/10"
                      placeholder="PASTE-CODE-HERE-001&#10;PASTE-CODE-HERE-002&#10;PASTE-CODE-HERE-003"
                      value={rawCodes}
                      onChange={(e) => setRawCodes(e.target.value)}
                      required
                    />
                 </div>

                 <button 
                  disabled={injecting || !selectedProduct || !rawCodes.trim()}
                  className="w-full py-6 bg-unicou-orange hover:bg-orange-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 disabled:opacity-30"
                 >
                   {injecting ? 'SYNCHRONIZING VAULT...' : 'COMMIT STOCK INJECTION'}
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* TAB: STAFF MANAGEMENT (ADD/EDIT/REMOVE) */}
      {activeTab === 'staff' && (
        <div className="animate-in fade-in duration-500 space-y-12">
           <div className="flex justify-between items-center">
              <h3 className="text-3xl font-display font-black uppercase text-unicou-navy tracking-tighter">Authority Node Registry</h3>
              <button onClick={() => setEditingStaff({ role: 'Finance', status: 'Active' })} className="px-8 py-4 bg-unicou-navy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Add New Team Member</button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.users.filter(u => ['System Admin/Owner', 'Operation Manager', 'Finance', 'Support', 'Trainer'].includes(u.role)).map(s => (
                <div key={s.id} className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 group hover:bg-white hover:shadow-2xl transition-all relative">
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">👤</div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingStaff(s)} className="text-[9px] font-black text-unicou-navy uppercase hover:underline">Edit</button>
                        <button onClick={() => handleDeleteStaff(s.id)} className="text-[9px] font-black text-red-500 uppercase hover:underline">Revoke</button>
                      </div>
                   </div>
                   <h4 className="text-xl font-black text-slate-900 uppercase mb-1">{s.name}</h4>
                   <p className="text-[10px] font-mono text-slate-500 mb-6">{s.email}</p>
                   <span className="px-4 py-1.5 bg-unicou-navy text-white rounded-full text-[9px] font-black uppercase tracking-widest">{s.role}</span>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* TAB: PARTNERS (FIX: AGENTS VISIBILITY) */}
      {activeTab === 'partners' && (
        <div className="animate-in fade-in duration-500 space-y-8">
           <h3 className="text-3xl font-display font-black uppercase text-unicou-navy tracking-tighter">Global Partner Registry</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.users.filter(u => u.role === 'Agent' || u.role === 'Institute').map(p => (
                <div key={p.id} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-lg flex flex-col group hover:border-unicou-navy transition-all">
                   <div className="flex justify-between items-start mb-8">
                      <div className="text-4xl">🏢</div>
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${p.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{p.status}</span>
                   </div>
                   <h4 className="text-xl font-black text-slate-900 uppercase mb-1 truncate">{p.name}</h4>
                   <p className="text-[10px] font-mono text-slate-500 mb-8">{p.email}</p>
                   <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase">TIER {p.tier || 1} NODE</span>
                      <button className="text-[10px] font-black text-unicou-orange uppercase hover:underline">Manage Account</button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* STAFF MODAL OVERLAY */}
      {editingStaff && (
        <div className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6">
           <div className="bg-white w-full max-w-xl rounded-[3.5rem] p-12 shadow-3xl animate-in zoom-in-95 duration-300">
              <h2 className="text-3xl font-display font-black text-unicou-navy uppercase mb-8 tracking-tighter">Authority Sync</h2>
              <form onSubmit={handleSaveStaff} className="space-y-6">
                 <AdminInput label="Full Name" value={editingStaff.name || ''} onChange={(v:any) => setEditingStaff({...editingStaff, name: v})} required />
                 <AdminInput label="Official Email Address" type="email" value={editingStaff.email || ''} onChange={(v:any) => setEditingStaff({...editingStaff, email: v})} required />
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Role Node</label>
                    <select 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-sm outline-none focus:border-unicou-navy transition-all"
                      value={editingStaff.role || 'Support'}
                      onChange={(e) => setEditingStaff({...editingStaff, role: e.target.value as UserRole})}
                    >
                       <option value="Operation Manager">Operation Manager</option>
                       <option value="Finance">Finance Controller</option>
                       <option value="Support">Support Associate</option>
                       <option value="Trainer">Academic Trainer</option>
                       <option value="System Admin/Owner">System Admin</option>
                    </select>
                 </div>
                 <div className="flex gap-4 pt-6">
                    <button type="button" onClick={() => setEditingStaff(null)} className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase">Cancel</button>
                    <button type="submit" className="flex-[2] py-5 bg-unicou-navy text-white rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-black">Commit Node Sync</button>
                 </div>
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

const AdminInput = ({ label, onChange, value, ...props }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">{label}</label>
    <input className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold outline-none focus:border-unicou-navy shadow-inner" value={value} onChange={e => onChange(e.target.value)} {...props} />
  </div>
);

export default AdminDashboard;
