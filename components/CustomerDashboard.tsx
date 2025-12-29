
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Order, User, TestResult, LMSCourse, ViewState } from '../types';

const CustomerDashboard: React.FC<{ user: User; onNavigate: (v: ViewState) => void; initialTab?: string }> = ({ user, onNavigate, initialTab }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [courses, setCourses] = useState<LMSCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'vouchers' | 'academy' | 'results'>((initialTab as any) || 'vouchers');

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

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab as any);
  }, [initialTab]);

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase tracking-widest text-[11px]">Synchronizing Secure Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-white">
      <div className="text-center mb-20 animate-in slide-in-from-top-4 duration-700">
        <h1 className="text-5xl md:text-7xl font-display font-black mb-6 tracking-tighter text-slate-950 uppercase leading-none">Student <span className="text-unicou-orange">Terminal</span></h1>
        <p className="text-xl text-slate-500 max-w-lg mx-auto leading-relaxed font-bold italic">Welcome back, {user.name}. Your academic mobility assets are currently synced with the Manchester hub.</p>
        
        <div className="flex justify-center mt-12">
          <div className="flex bg-slate-50 p-2 rounded-[2.5rem] border border-slate-200 shadow-inner overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTab('vouchers')}
              className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'vouchers' ? 'bg-white text-unicou-navy shadow-xl border border-slate-200' : 'text-slate-400 hover:text-slate-900'}`}
            >Voucher Vault</button>
            <button 
              onClick={() => setActiveTab('academy')}
              className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'academy' ? 'bg-white text-unicou-navy shadow-xl border border-slate-200' : 'text-slate-400 hover:text-slate-900'}`}
            >Learning Hub</button>
            <button 
              onClick={() => setActiveTab('results')}
              className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'results' ? 'bg-white text-unicou-navy shadow-xl border border-slate-200' : 'text-slate-400 hover:text-slate-900'}`}
            >Exam Metrics</button>
          </div>
        </div>
      </div>

      <div className="animate-in fade-in duration-700 pb-20">
        {activeTab === 'vouchers' && (
          <div className="grid grid-cols-1 gap-12">
            {orders.length === 0 ? (
              <div className="bg-slate-50 p-32 rounded-[4rem] border-4 border-dashed border-slate-100 text-center">
                <p className="text-slate-400 text-lg font-bold italic mb-10">Your voucher registry is currently empty.</p>
                <button onClick={() => onNavigate({ type: 'store' })} className="px-10 py-5 bg-unicou-navy text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-slate-950 transition-all">ACCESS GLOBAL VAULT</button>
              </div>
            ) : (
              orders.map(o => (
                <div key={o.id} className="space-y-8">
                  <div className="flex items-center gap-6 border-b border-slate-100 pb-6">
                    <span className="text-[10px] font-black text-unicou-orange uppercase tracking-[0.4em]">Node Transaction: {o.id}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">{new Date(o.timestamp).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {o.voucherCodes.map((code, idx) => (
                      <div key={idx} className="bg-white p-10 rounded-[3rem] border border-slate-100 flex justify-between items-center group hover:border-unicou-vibrant transition-all shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-unicou-vibrant opacity-20 group-hover:opacity-100 transition-opacity" />
                        <div>
                          <h4 className="font-black text-slate-900 uppercase tracking-tighter text-xl mb-1">{o.productName}</h4>
                          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Verified Fulfillment Asset</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-2xl font-black text-unicou-navy tracking-widest bg-slate-50 px-8 py-4 rounded-2xl border border-slate-100 shadow-inner group-hover:bg-unicou-navy group-hover:text-white transition-all">{code}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {courses.length === 0 ? (
              <div className="col-span-full bg-slate-50 p-32 rounded-[4rem] border-4 border-dashed border-slate-100 text-center">
                <p className="text-slate-400 text-lg font-bold italic mb-10">No authorized learning enrollments found.</p>
                <button onClick={() => onNavigate({ type: 'lms-dashboard' })} className="px-10 py-5 bg-unicou-navy text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-slate-950 transition-all">VISIT STUDY HUB</button>
              </div>
            ) : (
              courses.map((course, idx) => (
                <div 
                  key={course.id} 
                  className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 flex flex-col hover:border-unicou-orange/20 transition-all group shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={course.title} />
                    <div className="absolute top-6 left-6 bg-unicou-navy/95 backdrop-blur-md px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-xl">
                      {course.category} HUB
                    </div>
                  </div>
                  <div className="p-10 flex flex-col flex-grow">
                    <h3 className="text-2xl font-display font-black mb-4 text-slate-950 group-hover:text-unicou-navy transition-colors">{course.title}</h3>
                    <p className="text-slate-600 text-sm mb-10 leading-relaxed italic font-medium line-clamp-2">"{course.description}"</p>
                    <div className="mt-auto space-y-8">
                       <div className="flex items-center justify-between">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Verified</span>
                         <span className="text-emerald-600 text-[10px] font-black uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Live Access</span>
                       </div>
                       <button 
                         onClick={() => onNavigate({ type: 'lms-course-player', courseId: course.id })}
                         className="w-full py-5 bg-unicou-navy hover:bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                       >
                         RESUME LEARNING HUB
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                       </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-12">
            {results.length === 0 ? (
              <div className="bg-slate-50 p-32 rounded-[4rem] border-4 border-dashed border-slate-100 text-center">
                <p className="text-slate-400 text-lg font-bold italic">Awaiting synchronized exam submissions from the Test Terminal.</p>
              </div>
            ) : (
              results.map(r => (
                <div key={r.id} className="bg-white p-12 md:p-16 rounded-[4rem] border border-slate-100 relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 p-16 opacity-5 font-display font-black text-[10rem] select-none group-hover:opacity-10 transition-opacity tracking-tighter text-slate-950 uppercase leading-none">
                    {r.overallBand || '??'}
                  </div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16 relative z-10">
                    <div className="max-w-2xl">
                      <div className="flex items-center gap-4 mb-6">
                        <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${r.status === 'Graded' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                          {r.status}
                        </span>
                        <span className="text-slate-400 text-[10px] font-mono font-black tracking-widest uppercase">NODE: {r.id}</span>
                      </div>
                      <h3 className="text-4xl font-display font-black text-slate-950 tracking-tighter uppercase">{r.testTitle}</h3>
                      <p className="text-slate-500 text-base mt-4 font-bold italic leading-relaxed">Session metrics recorded on {new Date(r.timestamp).toLocaleString()}. Authenticity verified by UNICOU Trainer Unit.</p>
                    </div>
                    {r.overallBand && (
                      <div className="text-center md:text-right bg-slate-50 p-8 rounded-[3rem] border border-slate-100 shadow-inner">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">GLOBAL SCALE</p>
                        <p className="text-7xl font-display font-black text-unicou-navy tracking-tighter leading-none">{r.overallBand}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                    {r.skillScores.map(ss => (
                      <div key={ss.skill} className="bg-slate-50 border border-slate-100 p-10 rounded-[3rem] hover:border-unicou-navy transition-all shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{ss.skill}</p>
                        <p className="text-3xl font-black text-slate-950 font-mono tracking-tighter">
                          {ss.isGraded ? (ss.band || `${ss.score}/${ss.total}`) : 'EVALUATING'}
                        </p>
                        {ss.isGraded && ss.feedback && (
                          <div className="mt-8 pt-8 border-t border-slate-200">
                             <p className="text-[9px] font-black text-unicou-orange uppercase tracking-widest mb-3">Trainer Insight</p>
                             <p className="text-sm text-slate-600 italic font-bold leading-relaxed line-clamp-4">"{ss.feedback}"</p>
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
