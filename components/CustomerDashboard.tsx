
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Order, User, TestResult, LMSCourse } from '../types';

const CustomerDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [courses, setCourses] = useState<LMSCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'vouchers' | 'academy' | 'results'>('vouchers');

  useEffect(() => {
    const fetch = async () => {
      const [o, r, c] = await Promise.all([
        api.getOrders(), 
        api.getTestResults(),
        api.getEnrolledCourses()
      ]);
      setOrders(o);
      setResults(r);
      setCourses(c);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="p-20 text-center animate-pulse text-primary-400">Opening your Secure Terminal...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16 animate-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">Student <span className="text-primary-400">Terminal</span></h1>
        <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">Welcome back, {user.name}. Your academic assets and performance metrics are synced across the global nexus.</p>
        
        <div className="flex justify-center mt-10">
          <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md shadow-inner">
            <button 
              onClick={() => setActiveTab('vouchers')}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'vouchers' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >Voucher Vault</button>
            <button 
              onClick={() => setActiveTab('academy')}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'academy' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >Academy Assets</button>
            <button 
              onClick={() => setActiveTab('results')}
              className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'results' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >Exam Results</button>
          </div>
        </div>
      </div>

      <div className="space-y-12 animate-in fade-in duration-700">
        {activeTab === 'vouchers' && (
          <div className="grid grid-cols-1 gap-12">
            {orders.length === 0 ? (
              <div className="glass p-20 rounded-[3rem] border-dashed border-slate-800 text-center">
                <p className="text-slate-600 text-lg italic">Your voucher vault is currently empty.</p>
                <button className="mt-8 text-primary-400 font-bold hover:underline tracking-tight">Access Global Storefront →</button>
              </div>
            ) : (
              orders.map(o => (
                <div key={o.id} className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-slate-900 pb-4">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Transaction: {o.id}</span>
                    <span className="text-xs text-slate-600 font-mono">{new Date(o.timestamp).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {o.voucherCodes.map((code, idx) => (
                      <div key={idx} className="glass p-8 rounded-[2.5rem] border border-slate-800 flex justify-between items-center group hover:border-primary-500/50 transition-all shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary-500/20 group-hover:bg-primary-500 transition-colors" />
                        <div>
                          <h4 className="font-bold text-slate-200 tracking-tight">{o.productName}</h4>
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">Verified Fulfillment Ready</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-xl font-bold text-primary-400 tracking-widest bg-slate-950 px-6 py-3 rounded-2xl border border-slate-800 shadow-inner group-hover:text-primary-300 transition-colors">{code}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'academy' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.length === 0 ? (
              <div className="col-span-full glass p-20 rounded-[3rem] border-dashed border-slate-800 text-center">
                <p className="text-slate-600 italic">No academic enrollments found.</p>
              </div>
            ) : (
              courses.map((course, idx) => (
                <div 
                  key={course.id} 
                  className="glass rounded-[2.5rem] overflow-hidden border border-slate-800 flex flex-col hover:border-primary-500/30 transition-all group shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={course.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                    <div className="absolute top-4 left-4">
                       <span className="bg-primary-600/90 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{course.category} Mastery</span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary-400 transition-colors">{course.title}</h3>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed line-clamp-2">{course.description}</p>
                    <div className="mt-auto space-y-6">
                       <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enrollment Verified</span>
                         <span className="text-emerald-500 text-xs font-bold">Active</span>
                       </div>
                       <button className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-primary-500/20 active:scale-95">
                         Resume Learning →
                       </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-8">
            {results.length === 0 ? (
              <div className="glass p-20 rounded-[3rem] border-dashed border-slate-800 text-center text-slate-600 italic">
                Awaiting final assessment submissions.
              </div>
            ) : (
              results.map(r => (
                <div key={r.id} className="glass p-10 md:p-14 rounded-[3.5rem] border border-slate-800 relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 p-12 opacity-5 font-display font-black text-8xl select-none group-hover:opacity-10 transition-opacity tracking-tighter">
                    {r.overallBand || '??'}
                  </div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${r.status === 'Graded' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                          {r.status}
                        </span>
                        <span className="text-slate-600 text-[10px] font-mono font-bold tracking-widest uppercase">{r.id}</span>
                      </div>
                      <h3 className="text-3xl font-display font-bold text-slate-100 tracking-tight">{r.testTitle}</h3>
                      <p className="text-slate-500 text-sm mt-2 font-medium">Session recorded on {new Date(r.timestamp).toLocaleString()}</p>
                    </div>
                    {r.overallBand && (
                      <div className="text-center md:text-right bg-slate-950/50 p-6 rounded-3xl border border-slate-800 shadow-inner">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Global Scale Result</p>
                        <p className="text-6xl font-display font-bold text-primary-400 tracking-tighter">{r.overallBand}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {r.skillScores.map(ss => (
                      <div key={ss.skill} className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] hover:border-slate-700 transition-all">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">{ss.skill}</p>
                        <p className="text-2xl font-bold text-slate-200 font-mono">
                          {ss.isGraded ? `${ss.score}/${ss.total}` : 'In Evaluation'}
                        </p>
                        {ss.isGraded && ss.feedback && (
                          <div className="mt-6 pt-6 border-t border-slate-800">
                             <p className="text-[9px] font-black text-primary-500/70 uppercase tracking-widest mb-2">Evaluator Insights</p>
                             <p className="text-xs text-slate-500 italic leading-relaxed line-clamp-4">"{ss.feedback}"</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
