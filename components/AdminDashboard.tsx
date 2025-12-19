
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Product, VoucherCode, Order, ActivityLog, QualificationLead, SecurityStatus, CourseVoucher, TestBooking, ManualSubmission } from '../types';

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<{
    products: Product[],
    codes: VoucherCode[],
    courseVouchers: CourseVoucher[],
    orders: Order[],
    logs: ActivityLog[],
    qLeads: QualificationLead[],
    bookings: TestBooking[],
    pendingSubmissions: ManualSubmission[],
    security: SecurityStatus | null
  }>({
    products: [], codes: [], courseVouchers: [], orders: [], logs: [], qLeads: [], bookings: [], pendingSubmissions: [], security: null
  });
  
  const [activeTab, setActiveTab] = useState<'inventory' | 'sales' | 'grader' | 'bookings' | 'security'>('inventory');
  const [loading, setLoading] = useState(true);
  const [gradingItem, setGradingItem] = useState<ManualSubmission | null>(null);
  const [gradingScore, setGradingScore] = useState(0);
  const [gradingFeedback, setGradingFeedback] = useState('');

  const fetchData = async () => {
    try {
      const [p, c, cv, o, l, ql, b, ps, s] = await Promise.all([
        api.getProducts(), api.getCodes(), api.getCourseVouchers(),
        api.getOrders(), api.getLogs(), api.getQualificationLeads(),
        api.getTestBookings(), api.getPendingSubmissions(), api.getSecurityStatus()
      ]);
      setData({ products: p, codes: c, courseVouchers: cv, orders: o, logs: l, qLeads: ql, bookings: b, pendingSubmissions: ps, security: s });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGrade = async () => {
    if (!gradingItem) return;
    await api.gradeSubmission(gradingItem.id, gradingScore, gradingFeedback);
    setGradingItem(null);
    setGradingScore(0);
    setGradingFeedback('');
    fetchData();
  };

  if (loading) return <div className="p-20 text-center animate-pulse">Accessing Secure Admin Node...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold">Admin <span className="text-primary-400">Terminal</span></h1>
          <p className="text-slate-500 text-sm mt-1">Global infrastructure control & monitoring.</p>
        </div>
        <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 shadow-inner overflow-x-auto max-w-full">
          {(['inventory', 'sales', 'grader', 'bookings', 'security'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === t ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500'}`}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 animate-in fade-in duration-500">
        {activeTab === 'grader' && (
          <div className="space-y-8">
            <div className="glass rounded-3xl border border-slate-800 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-800 bg-slate-900/50">
                <h3 className="font-bold">Pending Manual Evaluations</h3>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-800">
                  <tr>
                    <th className="px-8 py-5">Student / Exam</th>
                    <th className="px-8 py-5">Skill</th>
                    <th className="px-8 py-5">Timestamp</th>
                    <th className="px-8 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {data.pendingSubmissions.map(s => (
                    <tr key={s.id} className="hover:bg-slate-800/20">
                      <td className="px-8 py-5">
                        <div className="font-bold text-slate-200">{s.userEmail}</div>
                        <div className="text-xs text-slate-500">{s.testTitle}</div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${s.skill === 'Writing' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}`}>{s.skill}</span>
                      </td>
                      <td className="px-8 py-5 text-slate-500 text-xs">{new Date(s.timestamp).toLocaleString()}</td>
                      <td className="px-8 py-5 text-right">
                        <button onClick={() => setGradingItem(s)} className="text-primary-400 font-bold text-xs hover:underline">Evaluation Portal →</button>
                      </td>
                    </tr>
                  ))}
                  {data.pendingSubmissions.length === 0 && (
                    <tr><td colSpan={4} className="p-20 text-center text-slate-600 italic">No items requiring human evaluation.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {gradingItem && (
              <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setGradingItem(null)} />
                <div className="relative glass w-full max-w-4xl rounded-[3rem] border border-slate-800 p-10 shadow-2xl animate-in zoom-in duration-300">
                  <div className="flex justify-between mb-8">
                    <h2 className="text-2xl font-bold">Grader <span className="text-primary-400">Terminal</span></h2>
                    <button onClick={() => setGradingItem(null)} className="text-slate-500 hover:text-white">Close X</button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 h-[400px] overflow-y-auto">
                        <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Student Submission</p>
                        <p className="text-slate-300 leading-relaxed italic whitespace-pre-wrap">"{gradingItem.studentAnswer}"</p>
                      </div>
                    </div>

                    <div className="space-y-8">
                       <div className="space-y-4">
                          <label className="block">
                            <span className="text-xs font-bold text-slate-500 uppercase mb-2 block">Assigned Score (0 - {gradingItem.maxScore})</span>
                            <input 
                              type="number" 
                              max={gradingItem.maxScore}
                              min={0}
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-primary-400 font-bold text-2xl"
                              value={gradingScore}
                              onChange={(e) => setGradingScore(Number(e.target.value))}
                            />
                          </label>
                          <label className="block">
                            <span className="text-xs font-bold text-slate-500 uppercase mb-2 block">Detailed Feedback</span>
                            <textarea 
                              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 text-slate-300 h-40 resize-none"
                              placeholder="Provide band-specific feedback here..."
                              value={gradingFeedback}
                              onChange={(e) => setGradingFeedback(e.target.value)}
                            />
                          </label>
                       </div>
                       <button onClick={handleGrade} className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold shadow-xl shadow-emerald-500/20 transition-all">Submit Evaluation</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="glass rounded-3xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/80 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                <tr>
                  <th className="px-8 py-5">Ref / Exam</th>
                  <th className="px-8 py-5">Student / Center</th>
                  <th className="px-8 py-5">Preferred Date</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {data.bookings.map(b => (
                  <tr key={b.id} className="hover:bg-slate-800/20">
                    <td className="px-8 py-5">
                      <div className="font-mono font-bold text-primary-400">{b.trackingRef}</div>
                      <div className="text-xs text-slate-500">{b.productName}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-bold text-slate-200">{b.studentName}</div>
                      <div className="text-xs text-slate-500">{b.testCenter}</div>
                    </td>
                    <td className="px-8 py-5 text-slate-400 font-bold">{b.preferredDate}</td>
                    <td className="px-8 py-5">
                       <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${
                        b.status === 'Pending' ? 'bg-orange-500/10 text-orange-500' : 'bg-emerald-500/10 text-emerald-500'
                       }`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="glass rounded-3xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/80 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                <tr>
                  <th className="px-8 py-5">Product Name</th>
                  <th className="px-8 py-5">Code ID</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {data.codes.map(c => (
                  <tr key={c.id} className="hover:bg-slate-800/20">
                    <td className="px-8 py-5 font-bold text-slate-200">{data.products.find(p => p.id === c.productId)?.name}</td>
                    <td className="px-8 py-5 font-mono text-primary-400">{c.code}</td>
                    <td className="px-8 py-5">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${c.status === 'Available' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>{c.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="glass rounded-3xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/80 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                <tr>
                  <th className="px-8 py-5">Order Reference</th>
                  <th className="px-8 py-5">Customer Email</th>
                  <th className="px-8 py-5">Amount</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {data.orders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-800/20">
                    <td className="px-8 py-5 font-mono font-bold text-primary-400">{o.id}</td>
                    <td className="px-8 py-5 text-slate-400">{o.customerEmail}</td>
                    <td className="px-8 py-5 font-bold text-emerald-500">${o.totalAmount}</td>
                    <td className="px-8 py-5">
                      <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest">Paid</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard label="System Uptime" value={data.security?.uptime || ''} />
              <StatCard label="Threat Level" value={data.security?.threatLevel || ''} color="text-emerald-500" />
              <StatCard label="Active Sessions" value={data.security?.activeSessions.toString() || ''} />
              <StatCard label="Rate Limit Blocks" value={data.security?.rateLimitsTriggered.toString() || ''} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color = "text-white" }: { label: string, value: string, color?: string }) => (
  <div className="glass p-6 rounded-3xl border border-slate-800">
    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">{label}</p>
    <p className={`text-2xl font-display font-bold ${color}`}>{value}</p>
  </div>
);

export default AdminDashboard;
