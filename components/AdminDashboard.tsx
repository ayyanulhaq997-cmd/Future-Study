
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Product, VoucherCode, Order, User, Lead, OrderStatus, LMSCourse, LMSModule, LMSLesson } from '../types';

type AdminTab = 'ledger' | 'inventory' | 'lms-manager' | 'partners' | 'staff' | 'qa-tools';

const AdminDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('ledger');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    products: Product[],
    codes: VoucherCode[],
    orders: Order[],
    users: User[],
    leads: Lead[],
    lmsCourses: LMSCourse[]
  }>({ products: [], codes: [], orders: [], users: [], leads: [], lmsCourses: [] });

  // LMS Editor State
  const [editingCourse, setEditingCourse] = useState<Partial<LMSCourse> | null>(null);
  const [editingModule, setEditingModule] = useState<{ courseId: string, module: Partial<LMSModule> } | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ courseId: string, moduleId: string, lesson: Partial<LMSLesson> } | null>(null);

  const fetchData = async () => {
    const [p, c, o, u, le, lms] = await Promise.all([
      api.getProducts(), api.getCodes(), api.getOrders(), api.getUsers(), api.getLeads(), api.getAllLMSCourses()
    ]);
    setData({ products: p, codes: c, orders: o, users: u, leads: le, lmsCourses: lms });
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    if (confirm(`ADMIN ACTION: Move order ${orderId} to ${status}? This triggers automated email dispatch.`)) {
      try {
        await api.updateOrderStatus(orderId, status);
        alert(`Status synchronized to ${status}. Notification dispatched.`);
        fetchData();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse?.title) return;
    const courseToSave = {
      ...editingCourse,
      id: editingCourse.id || `lms-${Date.now()}`,
      category: editingCourse.category || 'PTE',
      thumbnail: editingCourse.thumbnail || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
      description: editingCourse.description || '',
      duration: editingCourse.duration || '20 Hours',
      instructor: editingCourse.instructor || 'Staff',
      price: editingCourse.price || 0
    } as LMSCourse;
    
    await api.saveLMSCourse(courseToSave);
    setEditingCourse(null);
    fetchData();
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule?.module.title) return;
    const moduleToSave = {
      ...editingModule.module,
      id: editingModule.module.id || `mod-${Date.now()}`,
      lessons: editingModule.module.lessons || []
    } as LMSModule;
    
    await api.saveLMSModule(editingModule.courseId, moduleToSave);
    setEditingModule(null);
    fetchData();
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson?.lesson.title) return;
    const lessonToSave = {
      ...editingLesson.lesson,
      id: editingLesson.lesson.id || `les-${Date.now()}`,
      type: editingLesson.lesson.type || 'Video',
      content: editingLesson.lesson.content || ''
    } as LMSLesson;
    
    await api.saveLMSLesson(editingLesson.courseId, editingLesson.moduleId, lessonToSave);
    setEditingLesson(null);
    fetchData();
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase text-[11px] tracking-[0.4em]">Establishing Global Control Hub...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="flex flex-col xl:flex-row justify-between items-center gap-10 mb-16 border-b border-slate-100 pb-12">
        <div className="text-center xl:text-left">
           <h1 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">
             SYSTEM <span className="text-unicou-orange">HUB</span>
           </h1>
           <p className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.4em]">UNICOU Institutional Control Node</p>
        </div>
        
        <div className="flex flex-wrap justify-center bg-slate-50 p-2 rounded-[2rem] border border-slate-200 shadow-inner">
           {(['ledger', 'inventory', 'lms-manager', 'partners', 'staff', 'qa-tools'] as AdminTab[]).map((tab) => (
             <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-unicou-navy shadow-lg border border-slate-200' : 'text-slate-400 hover:text-slate-900'}`}>
               {tab}
             </button>
           ))}
        </div>
      </div>

      {activeTab === 'lms-manager' && (
        <div className="animate-in fade-in duration-500 space-y-12">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-display font-black uppercase tracking-tighter text-unicou-navy">Learning Hub Content Architect</h3>
            <button 
              onClick={() => setEditingCourse({})}
              className="px-8 py-4 bg-unicou-orange text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95"
            >Create New Course Node</button>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {data.lmsCourses.map(course => (
              <div key={course.id} className="bg-slate-50 rounded-[3rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all p-10">
                <div className="flex flex-col lg:flex-row justify-between gap-8 mb-10">
                  <div className="flex items-center gap-8">
                    <img src={course.thumbnail} className="w-32 h-20 object-cover rounded-2xl shadow-lg border border-slate-200" alt="" />
                    <div>
                      <span className="text-[10px] font-black text-unicou-orange uppercase tracking-[0.3em] mb-1 block">{course.category} Node</span>
                      <h4 className="text-3xl font-display font-black text-unicou-navy uppercase leading-none">{course.title}</h4>
                      <p className="text-slate-500 font-bold italic text-sm mt-2">Price: ${course.price} • {course.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setEditingCourse(course)} className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase hover:bg-unicou-navy hover:text-white transition-all">Edit Metadata</button>
                    <button onClick={() => setEditingModule({ courseId: course.id, module: {} })} className="px-6 py-2 bg-unicou-navy text-white rounded-xl text-[9px] font-black uppercase shadow-lg">Add Module</button>
                  </div>
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-100 p-8 space-y-4 shadow-inner">
                  <CourseModulesList 
                    courseId={course.id} 
                    onEditModule={(m) => setEditingModule({ courseId: course.id, module: m })}
                    onAddLesson={(moduleId) => setEditingLesson({ courseId: course.id, moduleId, lesson: {} })}
                    onEditLesson={(moduleId, lesson) => setEditingLesson({ courseId: course.id, moduleId, lesson })}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Course Modal */}
          {editingCourse && (
            <div className="fixed inset-0 z-[300] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6">
              <div className="bg-white w-full max-w-2xl rounded-[3.5rem] p-12 shadow-3xl animate-in zoom-in-95 duration-300">
                <h2 className="text-3xl font-display font-black text-unicou-navy uppercase mb-8">Course Metadata Editor</h2>
                <form onSubmit={handleSaveCourse} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <AdminInput label="Course Title" value={editingCourse.title || ''} onChange={v => setEditingCourse({...editingCourse, title: v})} />
                    <AdminSelect label="Category" value={editingCourse.category || 'PTE'} options={['PTE', 'IELTS', 'TOEFL', 'DUOLINGO', 'LANGUAGECERT', 'OTHM']} onChange={v => setEditingCourse({...editingCourse, category: v})} />
                    <AdminInput label="Price (USD)" type="number" value={editingCourse.price || 0} onChange={v => setEditingCourse({...editingCourse, price: Number(v)})} />
                    <AdminInput label="Duration" value={editingCourse.duration || ''} onChange={v => setEditingCourse({...editingCourse, duration: v})} />
                    <AdminInput label="Instructor" value={editingCourse.instructor || ''} onChange={v => setEditingCourse({...editingCourse, instructor: v})} />
                    <AdminInput label="Thumbnail URL" value={editingCourse.thumbnail || ''} onChange={v => setEditingCourse({...editingCourse, thumbnail: v})} />
                  </div>
                  <AdminTextarea label="Description" value={editingCourse.description || ''} onChange={v => setEditingCourse({...editingCourse, description: v})} />
                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setEditingCourse(null)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase">Cancel</button>
                    <button type="submit" className="flex-[2] py-4 bg-unicou-navy text-white rounded-2xl font-black text-[10px] uppercase shadow-xl">Commit Node Changes</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Module Modal */}
          {editingModule && (
            <div className="fixed inset-0 z-[300] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6">
              <div className="bg-white w-full max-w-lg rounded-[3.5rem] p-12 shadow-3xl">
                <h2 className="text-3xl font-display font-black text-unicou-navy uppercase mb-8">Module Node Editor</h2>
                <form onSubmit={handleSaveModule} className="space-y-6">
                  <AdminInput label="Module Title" value={editingModule.module.title || ''} onChange={v => setEditingModule({...editingModule, module: {...editingModule.module, title: v}})} />
                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setEditingModule(null)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase">Cancel</button>
                    <button type="submit" className="flex-[2] py-4 bg-unicou-navy text-white rounded-2xl font-black text-[10px] uppercase shadow-xl">Save Module</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Lesson Modal */}
          {editingLesson && (
            <div className="fixed inset-0 z-[300] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-6">
              <div className="bg-white w-full max-w-2xl rounded-[3.5rem] p-12 shadow-3xl">
                <h2 className="text-3xl font-display font-black text-unicou-navy uppercase mb-8">Lesson Unit Editor</h2>
                <form onSubmit={handleSaveLesson} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <AdminInput label="Lesson Title" value={editingLesson.lesson.title || ''} onChange={v => setEditingLesson({...editingLesson, lesson: {...editingLesson.lesson, title: v}})} />
                    <AdminSelect label="Content Type" value={editingLesson.lesson.type || 'Video'} options={['Video', 'Text', 'Quiz']} onChange={v => setEditingLesson({...editingLesson, lesson: {...editingLesson.lesson, type: v as any}})} />
                  </div>
                  <AdminTextarea 
                    label={editingLesson.lesson.type === 'Video' ? "Embed/Source URL" : editingLesson.lesson.type === 'Quiz' ? "JSON Quiz Data" : "Markdown/Text Content"} 
                    value={editingLesson.lesson.content || ''} 
                    onChange={v => setEditingLesson({...editingLesson, lesson: {...editingLesson.lesson, content: v}})} 
                    rows={10}
                  />
                  <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setEditingLesson(null)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase">Cancel</button>
                    <button type="submit" className="flex-[2] py-4 bg-unicou-navy text-white rounded-2xl font-black text-[10px] uppercase shadow-xl">Deploy Lesson</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="animate-in fade-in duration-500">
           <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <h3 className="text-sm font-black uppercase tracking-widest text-unicou-navy">Global Audit Ledger</h3>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Records: {data.orders.length}</span>
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
                        <th className="px-6 py-6">VII. Reference</th>
                        <th className="px-6 py-6 text-center">VIII. Status / Control</th>
                        <th className="px-6 py-6 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {data.orders.map((o) => {
                        const dateObj = new Date(o.timestamp);
                        return (
                          <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-5 font-mono font-black text-[11px] text-unicou-navy">{o.id}</td>
                            <td className="px-6 py-5 font-mono text-[11px] text-slate-500">{dateObj.toLocaleDateString()}</td>
                            <td className="px-6 py-5 font-mono text-[11px] text-slate-500">{dateObj.toLocaleTimeString()}</td>
                            <td className="px-6 py-5 font-black text-[11px] text-slate-900 uppercase truncate max-w-[120px]">{o.buyerName}</td>
                            <td className="px-6 py-5 font-black text-[11px] text-slate-700 uppercase">{o.productName}</td>
                            <td className="px-6 py-5 font-display font-black text-slate-950 text-base">${o.totalAmount}</td>
                            <td className="px-6 py-5 font-mono font-bold text-[10px] text-slate-400 uppercase truncate max-w-[100px]" title={o.bankRef}>{o.bankRef || 'N/A'}</td>
                            <td className="px-6 py-5">
                               <div className="flex flex-col items-center gap-2">
                                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${
                                    o.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                    o.status === 'Hold' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                    o.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                                    'bg-slate-50 text-slate-600 border-slate-100'
                                  }`}>{o.status}</span>
                                  
                                  <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                                     <button onClick={() => handleUpdateStatus(o.id, 'Approved')} className={`px-2 py-1 rounded text-[7px] font-black transition-all ${o.status === 'Approved' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-emerald-600'}`}>APPROVE</button>
                                     <button onClick={() => handleUpdateStatus(o.id, 'Hold')} className={`px-2 py-1 rounded text-[7px] font-black transition-all ${o.status === 'Hold' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-400 hover:text-amber-600'}`}>HOLD</button>
                                     <button onClick={() => handleUpdateStatus(o.id, 'Rejected')} className={`px-2 py-1 rounded text-[7px] font-black transition-all ${o.status === 'Rejected' ? 'bg-red-500 text-white shadow-sm' : 'text-slate-400 hover:text-red-600'}`}>REJECT</button>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <button onClick={() => api.deleteOrder(o.id).then(fetchData)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// UI Components for Admin
const AdminInput = ({ label, onChange, value, ...props }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">{label}</label>
    <input className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold outline-none focus:border-unicou-navy shadow-inner" value={value} onChange={e => onChange(e.target.value)} {...props} />
  </div>
);

const AdminSelect = ({ label, options, onChange, value }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">{label}</label>
    <select className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold outline-none focus:border-unicou-navy shadow-inner appearance-none" value={value} onChange={e => onChange(e.target.value)}>
      {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const AdminTextarea = ({ label, onChange, value, ...props }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">{label}</label>
    <textarea className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm font-bold outline-none focus:border-unicou-navy shadow-inner resize-none" value={value} onChange={e => onChange(e.target.value)} {...props} />
  </div>
);

const CourseModulesList: React.FC<{ 
  courseId: string, 
  onEditModule: (m: LMSModule) => void,
  onAddLesson: (mid: string) => void,
  onEditLesson: (mid: string, l: LMSLesson) => void
}> = ({ courseId, onEditModule, onAddLesson, onEditLesson }) => {
  const [modules, setModules] = useState<LMSModule[]>([]);

  useEffect(() => {
    api.getCourseModules(courseId).then(setModules);
  }, [courseId]);

  return (
    <div className="space-y-6">
      {modules.map(mod => (
        <div key={mod.id} className="border-l-4 border-unicou-navy pl-6 py-2">
          <div className="flex justify-between items-center mb-4">
            <h5 className="font-black text-unicou-navy uppercase tracking-tight text-lg">{mod.title}</h5>
            <div className="flex gap-2">
              <button onClick={() => onEditModule(mod)} className="text-[8px] font-black uppercase text-slate-400 hover:text-unicou-navy transition-colors">Rename</button>
              <button onClick={() => onAddLesson(mod.id)} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[8px] font-black uppercase hover:bg-unicou-navy hover:text-white transition-all">Add Lesson</button>
            </div>
          </div>
          <div className="space-y-2">
            {mod.lessons.map(les => (
              <div key={les.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 group">
                <div className="flex items-center gap-3">
                  <span className="text-[10px]">{les.type === 'Video' ? '🎬' : les.type === 'Quiz' ? '❓' : '📄'}</span>
                  <span className="text-xs font-bold text-slate-700">{les.title}</span>
                </div>
                <button onClick={() => onEditLesson(mod.id, les)} className="opacity-0 group-hover:opacity-100 text-[8px] font-black uppercase text-unicou-orange transition-all">Edit Unit</button>
              </div>
            ))}
          </div>
        </div>
      ))}
      {modules.length === 0 && <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest text-center py-4">No content modules established.</p>}
    </div>
  );
};

export default AdminDashboard;
