
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Order, User, TestResult, LMSCourse, ViewState } from '../types';

const CustomerDashboard: React.FC<{ user: User; onNavigate: (v: ViewState) => void; initialTab?: string }> = ({ user, onNavigate, initialTab }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [courses, setCourses] = useState<LMSCourse[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Normalized tab state with fallback
  const [activeTab, setActiveTab] = useState<'vouchers' | 'academy' | 'results'>(
    (initialTab === 'results' || initialTab === 'academy' || initialTab === 'vouchers') 
      ? initialTab as any 
      : 'vouchers'
  );

  useEffect(() => {
    const fetch = async () => {
      const [o, r, c] = await Promise.all([api.getOrders(), api.getTestResults(), api.getEnrolledCourses()]);
      setOrders(o);
      setResults(r);
      setCourses(c);
      setLoading(false);
    };
    fetch();
  }, []);

  // Update tab if initialTab changes externally
  useEffect(() => {
    if (initialTab && ['vouchers', 'academy', 'results'].includes(initialTab)) {
      setActiveTab(initialTab as any);
    }
  }, [initialTab]);

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase tracking-widest text-[11px]">Syncing Portal Nodes...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 bg-white min-h-screen">
      <div className="text-center mb-12 animate-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f8fafc] border border-slate-100 rounded-full mb-6 shadow-inner">
           <svg className="w-3.5 h-3.5 text-[#004a61]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
           <span className="text-[10px] font-black text-[#004a61] uppercase tracking-[0.2em]">LOCKED DELIVERY NODE: {user.email}</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-display font-black mb-4 tracking-tighter text-slate-950 uppercase leading-none">
          {user.role === 'Student' ? 'STUDENT' : 'PARTNER'} <span className="text-[#f15a24]">PORTAL</span>
        </h1>
        
        <div className="flex justify-center mt-10">
          <div className="flex bg-slate-50 p-1.5 rounded-[2rem] border border-slate-200 shadow-inner">
            <button onClick={() => setActiveTab('vouchers')} className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'vouchers' ? 'bg-white text-unicou-navy shadow-lg border border-slate-200' : 'text-slate-500'}`}>Orders Terminal</button>
            <button onClick={() => setActiveTab('academy')} className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'academy' ? 'bg-white text-unicou-navy shadow-lg border border-slate-200' : 'text-slate-500'}`}>Learning Hub</button>
            <button onClick={() => setActiveTab('results')} className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'results' ? 'bg-white text-unicou-navy shadow-lg border border-slate-200' : 'text-slate-500'}`}>Analytics</button>
          </div>
        </div>
      </div>

      <div className="animate-in fade-in duration-700 pb-20 max-w-5xl mx-auto">
        {activeTab === 'vouchers' && (
          <div className="flex flex-col gap-1.5">
            {orders.length === 0 ? (
              <div className="bg-slate-50 p-24 rounded-[4rem] border-4 border-dashed border-slate-200 text-center">
                <p className="text-slate-400 font-bold mb-8 italic">"No active procurement records found."</p>
                <button onClick={() => onNavigate({ type: 'store' })} className="px-10 py-5 bg-unicou-navy text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl">Procure Vouchers</button>
              </div>
            ) : (
              orders.map(o => (
                <div key={o.id} className="bg-white border border-slate-100 py-2 px-6 rounded-2xl transition-all hover:border-unicou-navy/20 flex flex-wrap items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${o.status === 'Completed' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                        <span className="text-[10px] font-black text-[#004a61] uppercase tracking-[0.1em] whitespace-nowrap">{o.id}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">{new Date(o.timestamp).toLocaleDateString()}</span>
                      <span className="text-[11px] font-black text-slate-700 uppercase truncate max-w-[200px]">{o.productName}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {o.voucherCodes.length > 0 ? o.voucherCodes.map((code, idx) => (
                        <div key={idx} className="bg-[#f8fafc] px-4 py-1.5 rounded-xl border border-slate-200 flex items-center gap-3 shadow-inner">
                          <span className="font-mono text-xs font-black text-[#004a61] tracking-widest">{code}</span>
                        </div>
                      )) : (
                        <span className="text-[9px] font-black text-orange-600 bg-orange-50 px-4 py-1.5 rounded-full uppercase border border-orange-100">Audit in Progress</span>
                      )}
                    </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'academy' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map(c => (
              <div key={c.id} className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 flex flex-col group hover:bg-white hover:border-unicou-orange/20 transition-all shadow-sm hover:shadow-xl">
                 <h3 className="text-xl font-black text-slate-900 uppercase mb-4">{c.title}</h3>
                 <p className="text-sm text-slate-500 mb-8 flex-grow italic font-bold">"{c.description}"</p>
                 <button 
                   onClick={() => onNavigate({ type: 'lms-course-player', courseId: c.id })}
                   className="w-full py-4 bg-unicou-navy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest"
                 >Resume Course</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'results' && (
          <div className="bg-slate-50 p-12 rounded-[4rem] border border-slate-100 text-center">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">📊</div>
             <h3 className="text-xl font-black text-unicou-navy uppercase">Analytics Node</h3>
             <p className="text-slate-500 mt-2 font-bold italic">Attempt mock exams to populate your performance metrics.</p>
             <button 
               onClick={() => onNavigate({ type: 'lms-practice-test', testId: 'full-mock-1' })}
               className="mt-8 px-10 py-4 bg-unicou-orange text-white rounded-2xl font-black text-[10px] uppercase tracking-widest"
             >Take Free Mock</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
