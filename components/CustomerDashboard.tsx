
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

  const isAgent = user.role === 'Agent Partner/Prep Center';

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase tracking-widest text-[11px]">Syncing your portal...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-white">
      <div className="text-center mb-20 animate-in slide-in-from-top-4 duration-700">
        <h1 className="text-5xl md:text-7xl font-display font-black mb-6 tracking-tighter text-slate-950 uppercase leading-none">
          {isAgent ? 'PARTNER' : 'STUDENT'} <span className="text-unicou-orange">PORTAL</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-bold italic">
          {isAgent 
            ? `Welcome ${user.name}! Your UniCou partner dashboard is ready. Continue supporting students with study abroad, IELTS/PTE/TOEFL vouchers, and training solutions.`
            : `Hi ${user.name.split(' ')[0]}! Your UniCou student portal is ready. Learn, prepare, and move closer to your international career goals!`
          }
        </p>
        
        <div className="flex justify-center mt-12">
          <div className="flex bg-slate-50 p-2 rounded-[2.5rem] border border-slate-200 shadow-inner overflow-x-auto no-scrollbar">
            <button onClick={() => setActiveTab('vouchers')} className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'vouchers' ? 'bg-white text-unicou-navy shadow-xl' : 'text-slate-500'}`}>My Vouchers</button>
            <button onClick={() => setActiveTab('academy')} className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'academy' ? 'bg-white text-unicou-navy shadow-xl' : 'text-slate-500'}`}>My Classes</button>
            <button onClick={() => setActiveTab('results')} className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'results' ? 'bg-white text-unicou-navy shadow-xl' : 'text-slate-500'}`}>Test Scores</button>
          </div>
        </div>
      </div>

      <div className="animate-in fade-in duration-700 pb-20">
        {activeTab === 'vouchers' && (
          <div className="grid grid-cols-1 gap-12">
            {orders.length === 0 ? (
              <div className="bg-slate-50 p-32 rounded-[4rem] border-4 border-dashed border-slate-200 text-center">
                <p className="text-slate-400 text-lg font-bold italic mb-10">You haven't purchased any vouchers yet.</p>
                <button onClick={() => onNavigate({ type: 'store' })} className="px-10 py-5 bg-unicou-navy text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-slate-950 transition-colors">Browse Vouchers</button>
              </div>
            ) : (
              orders.map(o => (
                <div key={o.id} className="space-y-8">
                  <div className="flex items-center gap-6 border-b border-slate-100 pb-6">
                    <span className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.4em]">Order ID: {o.id}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">{new Date(o.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {o.voucherCodes.map((code, idx) => (
                      <div key={idx} className="bg-white p-10 rounded-[3rem] border border-slate-100 flex justify-between items-center group hover:border-unicou-vibrant transition-all shadow-xl relative overflow-hidden">
                        <div>
                          <h4 className="font-black text-slate-900 uppercase tracking-tighter text-xl mb-1">{o.productName}</h4>
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Official Exam Code</p>
                        </div>
                        <span className="font-mono text-2xl font-black text-unicou-navy tracking-widest bg-slate-50 px-8 py-4 rounded-2xl shadow-inner">{code}</span>
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
               <div className="col-span-full bg-slate-50 p-32 rounded-[4rem] border-4 border-dashed border-slate-200 text-center">
                 <p className="text-slate-400 text-lg font-bold italic mb-10">Start your preparation journey today.</p>
                 <button onClick={() => onNavigate({ type: 'lms-dashboard' })} className="px-10 py-5 bg-unicou-navy text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-slate-950 transition-colors">Explore Lessons</button>
               </div>
            ) : (
              courses.map(course => (
                <div key={course.id} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-lg hover:shadow-xl transition-all flex flex-col h-full">
                  <img src={course.thumbnail} className="w-full aspect-video object-cover rounded-2xl mb-6" alt={course.title} />
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{course.title}</h3>
                  <button 
                    onClick={() => onNavigate({ type: 'lms-course-player', courseId: course.id })}
                    className="mt-auto w-full py-4 bg-unicou-navy text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                  >Continue Study</button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'results' && (
          <div className="grid grid-cols-1 gap-6">
            {results.length === 0 ? (
              <div className="bg-slate-50 p-32 rounded-[4rem] border-4 border-dashed border-slate-200 text-center">
                <p className="text-slate-400 text-lg font-bold italic mb-10">No test results available yet.</p>
                <button onClick={() => setActiveTab('academy')} className="px-10 py-5 bg-unicou-navy text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-slate-950 transition-colors">Start Mock Test</button>
              </div>
            ) : (
              results.map(res => (
                <div key={res.id} className="bg-white p-8 rounded-3xl border border-slate-100 flex justify-between items-center shadow-md">
                   <div>
                      <h4 className="font-bold text-slate-900 text-lg">{res.testTitle}</h4>
                      <p className="text-xs text-slate-500">Taken on {new Date(res.timestamp).toLocaleDateString()}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black uppercase text-slate-400">Band Score</p>
                      <p className="text-2xl font-black text-unicou-navy">{res.overallBand}</p>
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
