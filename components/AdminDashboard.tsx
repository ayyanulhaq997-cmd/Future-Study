
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Product, VoucherCode, Order, User, OrderStatus, LMSCourse, LMSModule, LMSLesson, BusinessMetrics } from '../types';

type AdminTab = 'command-center' | 'financials' | 'lms-architect' | 'partners' | 'stock' | 'risk-audit';

const AdminDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('command-center');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [data, setData] = useState<{
    orders: Order[],
    users: User[],
    lmsCourses: LMSCourse[]
  }>({ orders: [], users: [], lmsCourses: [] });

  // LMS Architect Editor State
  const [editingCourse, setEditingCourse] = useState<Partial<LMSCourse> | null>(null);
  const [editingModule, setEditingModule] = useState<{ courseId: string, module: Partial<LMSModule> } | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ courseId: string, moduleId: string, lesson: Partial<LMSLesson> } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const [o, u, lms, m] = await Promise.all([
      api.getOrders(), api.getUsers(), api.getAllLMSCourses(), api.getBusinessMetrics()
    ]);
    setData({ orders: o, users: u, lmsCourses: lms });
    setMetrics(m);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    if (confirm(`ADMIN PROTOCOL: Confirming status move to ${status.toUpperCase()}? (Email will be dispatched to customer)`)) {
      await api.updateOrderStatus(orderId, status);
      fetchData();
    }
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.saveLMSCourse(editingCourse as LMSCourse);
    setEditingCourse(null);
    fetchData();
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingModule) {
      await api.saveLMSModule(editingModule.courseId, editingModule.module as LMSModule);
      setEditingModule(null);
      fetchData();
    }
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLesson) {
      await api.saveLMSLesson(editingLesson.courseId, editingLesson.moduleId, editingLesson.lesson as LMSLesson);
      setEditingLesson(null);
      fetchData();
    }
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase text-[11px] tracking-[0.4em]">Initializing Global Command Center...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 bg-white min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-10 mb-16 border-b border-slate-100 pb-12">
        <div className="text-center xl:text-left">
           <h1 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">SYSTEM <span className="text-unicou-orange">HUB</span></h1>
           <p className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.4em]">Integrated Business Intelligence & Content Orchestrator</p>
        </div>
        
        <div className="flex flex-wrap justify-center bg-slate-50 p-2 rounded-[2rem] border border-slate-200 shadow-inner">
           {(['command-center', 'financials', 'lms-architect', 'partners', 'stock', 'risk-audit'] as AdminTab[]).map((tab) => (
             <button 
               key={tab} 
               onClick={() => setActiveTab(tab)} 
               className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-unicou-navy shadow-lg border border-slate-200' : 'text-slate-400 hover:text-slate-900'}`}
             >
               {tab.replace('-', ' ')}
             </button>
           ))}
        </div>
      </div>

      {/* TAB 1: COMMAND CENTER */}
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

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 text-slate-500">System Health Monitor</h3>
                 <div className="space-y-6">
                    <HealthRow label="Voucher Vault" status="Secure" />
                    <HealthRow label="LMS Core API" status="Optimal" />
                    <HealthRow label="Billing Node" status="Synchronized" />
                 </div>
              </div>
              <div className="lg:col-span-8 bg-slate-50 p-10 rounded-[4rem] border border-slate-200 shadow-inner">
                 <h3 className="text-sm font-black uppercase tracking-widest text-unicou-navy mb-8">Live Global Transaction Stream</h3>
                 <div className="space-y-4">
                    {data.orders.slice(0, 5).map(o => (
                      <div key={o.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-unicou-navy transition-all">
                        <div className="flex items-center gap-6">
                           <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-lg">{o.paymentMethod === 'BankTransfer' ? '🏦' : '💳'}</div>
                           <div><p className="text-[11px] font-black text-slate-900 uppercase">{o.buyerName}</p><p className="text-[9px] font-mono text-slate-400">{o.productName}</p></div>
                        </div>
                        <div className="text-right"><p className="text-lg font-display font-black text-unicou-navy">${o.totalAmount}</p><span className={`text-[8px] font-black uppercase ${o.status === 'Approved' ? 'text-emerald-500' : 'text-amber-500'}`}>{o.status}</span></div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* TAB 2: FINANCIALS (8-Column Ledger + 3 Stage Controls) */}
      {activeTab === 'financials' && (
        <div className="animate-in fade-in duration-500">
           <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                 <h3 className="text-sm font-black uppercase tracking-widest text-unicou-navy">Settlement Audit Ledger (3-Stage Protocol)</h3>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[8px] font-black uppercase">Approved</span></div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" /><span className="text-[8px] font-black uppercase">Hold</span></div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-[8px] font-black uppercase">Rejected</span></div>
                 </div>
              </div>
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
                                  <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase border shadow-sm ${
                                    o.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                    o.status === 'Hold' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                    o.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-200' :
                                    'bg-slate-50 text-slate-600 border-slate-200'
                                  }`}>{o.status}</span>
                                  
                                  {o.status === 'Pending' || o.status === 'Hold' ? (
                                    <div className="flex bg-slate-200 p-1 rounded-xl gap-1">
                                       <button onClick={() => handleUpdateStatus(o.id, 'Approved')} className="px-3 py-1.5 bg-white rounded-lg text-[8px] font-black hover:bg-emerald-500 hover:text-white transition-all uppercase shadow-sm">I. Approve</button>
                                       <button onClick={() => handleUpdateStatus(o.id, 'Hold')} className="px-3 py-1.5 bg-white rounded-lg text-[8px] font-black hover:bg-amber-500 hover:text-white transition-all uppercase shadow-sm">II. Hold</button>
                                       <button onClick={() => handleUpdateStatus(o.id, 'Rejected')} className="px-3 py-1.5 bg-white rounded-lg text-[8px] font-black hover:bg-red-500 hover:text-white transition-all uppercase shadow-sm">III. Reject</button>
                                    </div>
                                  ) : (
                                    <span className="text-[7px] font-black text-slate-300 uppercase italic">Immutable Entry</span>
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

      {/* TAB 3: LMS ARCHITECT */}
      {activeTab === 'lms-architect' && (
        <div className="animate-in fade-in duration-500 space-y-12">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-display font-black uppercase tracking-tighter text-unicou-navy">Academic Content Architect</h3>
            <button onClick={() => setEditingCourse({})} className="px-8 py-4 bg-unicou-orange text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Create New Course</button>
          </div>
          <div className="grid grid-cols-1 gap-8">
            {data.lmsCourses.map(course => (
              <div key={course.id} className="bg-slate-50 rounded-[3rem] border border-slate-200 p-10 shadow-sm hover:shadow-xl transition-all">
                <div className="flex flex-col lg:flex-row justify-between gap-8 mb-10">
                  <div className="flex items-center gap-8">
                    <img src={course.thumbnail} className="w-32 h-20 object-cover rounded-2xl shadow-lg" alt="" />
                    <div>
                      <span className="text-[10px] font-black text-unicou-orange uppercase tracking-[0.3em] mb-1 block">{course.category} HUB</span>
                      <h4 className="text-3xl font-display font-black text-unicou-navy uppercase leading-none">{course.title}</h4>
                      <p className="text-slate-500 font-bold italic text-sm mt-2">${course.price} • {course.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setEditingCourse(course)} className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase hover:bg-unicou-navy hover:text-white transition-all">Edit Meta</button>
                    <button onClick={() => setEditingModule({ courseId: course.id, module: {} })} className="px-6 py-2 bg-unicou-navy text-white rounded-xl text-[9px] font-black uppercase shadow-lg">Add Module</button>
                  </div>
                </div>
                <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-inner min-h-[100px]">
                   <CourseModulesList 
                     courseId={course.id} 
                     onEditModule={(m) => setEditingModule({ courseId: course.id, module: m })}
                     onAddLesson={(mid) => setEditingLesson({ courseId: course.id, moduleId: mid, lesson: {} })}
                     onEditLesson={(mid, lesson) => setEditingLesson({ courseId: course.id, moduleId: mid, lesson })}
                   />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL OVERLAYS */}
      {(editingCourse || editingModule || editingLesson) && (
        <div className="fixed inset-0 z-[300] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6 overflow-y-auto">
           <div className="bg-white w-full max-w-2xl rounded-[3.5rem] p-12 shadow-3xl my-auto">
              {editingCourse && (
                <form onSubmit={handleSaveCourse} className="space-y-6">
                   <h2 className="text-3xl font-display font-black text-unicou-navy uppercase mb-8">Course Metadata</h2>
                   <AdminInput label="Title" value={editingCourse.title || ''} onChange={(v:any) => setEditingCourse({...editingCourse, title: v})} />
                   <AdminInput label="Instructor" value={editingCourse.instructor || ''} onChange={(v:any) => setEditingCourse({...editingCourse, instructor: v})} />
                   <div className="flex gap-4 pt-4"><button type="button" onClick={() => setEditingCourse(null)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase">Cancel</button><button type="submit" className="flex-[2] py-4 bg-unicou-navy text-white rounded-2xl font-black text-[10px] uppercase shadow-xl">Commit Course</button></div>
                </form>
              )}
              {editingModule && (
                <form onSubmit={handleSaveModule} className="space-y-6">
                   <h2 className="text-3xl font-display font-black text-unicou-navy uppercase mb-8">Module Node Editor</h2>
                   <AdminInput label="Module Title" value={editingModule.module.title || ''} onChange={(v:any) => setEditingModule({...editingModule, module: {...editingModule.module, title: v}})} />
                   <div className="flex gap-4 pt-4"><button type="button" onClick={() => setEditingModule(null)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase">Cancel</button><button type="submit" className="flex-[2] py-4 bg-unicou-navy text-white rounded-2xl font-black text-[10px] uppercase shadow-xl">Save Module</button></div>
                </form>
              )}
              {editingLesson && (
                <form onSubmit={handleSaveLesson} className="space-y-6">
                   <h2 className="text-3xl font-display font-black text-unicou-navy uppercase mb-8">Lesson Unit Editor</h2>
                   <AdminInput label="Lesson Title" value={editingLesson.lesson.title || ''} onChange={(v:any) => setEditingLesson({...editingLesson, lesson: {...editingLesson.lesson, title: v}})} />
                   <AdminInput label="Video/Content Link" value={editingLesson.lesson.content || ''} onChange={(v:any) => setEditingLesson({...editingLesson, lesson: {...editingLesson.lesson, content: v}})} />
                   <div className="flex gap-4 pt-4"><button type="button" onClick={() => setEditingLesson(null)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase">Cancel</button><button type="submit" className="flex-[2] py-4 bg-unicou-navy text-white rounded-2xl font-black text-[10px] uppercase shadow-xl">Deploy Lesson</button></div>
                </form>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

const CourseModulesList: React.FC<{ 
  courseId: string, 
  onEditModule: (m: LMSModule) => void,
  onAddLesson: (mid: string) => void,
  onEditLesson: (mid: string, l: LMSLesson) => void
}> = ({ courseId, onEditModule, onAddLesson, onEditLesson }) => {
  const [modules, setModules] = useState<LMSModule[]>([]);
  useEffect(() => { api.getCourseModules(courseId).then(setModules); }, [courseId]);

  return (
    <div className="space-y-6">
      {modules.map(mod => (
        <div key={mod.id} className="border-l-4 border-unicou-navy pl-6 py-2">
          <div className="flex justify-between items-center mb-4">
            <h5 className="font-black text-unicou-navy uppercase text-lg">{mod.title}</h5>
            <div className="flex gap-2">
              <button onClick={() => onEditModule(mod)} className="text-[8px] font-black uppercase text-slate-400 hover:text-unicou-navy transition-colors">Rename</button>
              <button onClick={() => onAddLesson(mod.id)} className="px-3 py-1 bg-slate-100 rounded-lg text-[8px] font-black uppercase hover:bg-unicou-navy hover:text-white transition-all">Add Lesson</button>
            </div>
          </div>
          <div className="space-y-2">
            {mod.lessons?.map(les => (
              <div key={les.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 group">
                <span className="text-xs font-bold text-slate-700">{les.title}</span>
                <button onClick={() => onEditLesson(mod.id, les)} className="opacity-0 group-hover:opacity-100 text-[8px] font-black uppercase text-unicou-orange transition-all">Edit</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const KPICard = ({ label, value, icon, color, alert }: any) => (
  <div className={`bg-white p-8 rounded-[2.5rem] border-2 transition-all ${alert ? 'border-red-500' : 'border-slate-50'} hover:shadow-xl flex flex-col`}>
     <div className="flex justify-between items-start mb-4">
        <span className="text-2xl">{icon}</span>
        {alert && <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />}
     </div>
     <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">{label}</p>
     <p className={`text-2xl font-display font-black leading-none ${color}`}>{value}</p>
  </div>
);

const HealthRow = ({ label, status }: any) => (
  <div className="flex items-center justify-between py-3 border-b border-white/5">
     <span className="text-xs font-bold text-slate-400 uppercase">{label}</span>
     <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span className="text-[10px] font-black uppercase text-emerald-400">{status}</span></div>
  </div>
);

const AdminInput = ({ label, onChange, value, ...props }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">{label}</label>
    <input className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold outline-none focus:border-unicou-navy shadow-inner" value={value} onChange={e => onChange(e.target.value)} {...props} />
  </div>
);

export default AdminDashboard;
