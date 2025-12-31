
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

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase tracking-widest text-[11px]">Synchronizing Student Portal...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-white">
      <div className="text-center mb-20 animate-in slide-in-from-top-4 duration-700">
        <h1 className="text-5xl md:text-7xl font-display font-black mb-6 tracking-tighter text-slate-950 uppercase leading-none">Student <span className="text-unicou-orange">Portal</span></h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-bold italic">
          Welcome back, {user.name}. Your academic mobility assets are currently synced with the Hub Terminal.
        </p>
        
        <div className="flex justify-center mt-12">
          <div className="flex bg-slate-50 p-2 rounded-[2.5rem] border border-slate-200 shadow-inner overflow-x-auto no-scrollbar">
            <button onClick={() => setActiveTab('vouchers')} className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'vouchers' ? 'bg-white text-unicou-navy shadow-xl' : 'text-slate-500'}`}>Voucher Vault</button>
            <button onClick={() => setActiveTab('academy')} className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'academy' ? 'bg-white text-unicou-navy shadow-xl' : 'text-slate-500'}`}>Learning Hub</button>
            <button onClick={() => setActiveTab('results')} className={`px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'results' ? 'bg-white text-unicou-navy shadow-xl' : 'text-slate-500'}`}>Exam Results</button>
          </div>
        </div>
      </div>

      <div className="animate-in fade-in duration-700 pb-20">
        {activeTab === 'vouchers' && (
          <div className="grid grid-cols-1 gap-12">
            {orders.length === 0 ? (
              <div className="bg-slate-50 p-32 rounded-[4rem] border-4 border-dashed border-slate-200 text-center">
                <p className="text-slate-400 text-lg font-bold italic mb-10">Vault registry clear.</p>
                <button onClick={() => onNavigate({ type: 'store' })} className="px-10 py-5 bg-unicou-navy text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-slate-950 transition-colors">VISIT VOUCHER STORE</button>
              </div>
            ) : (
              orders.map(o => (
                <div key={o.id} className="space-y-8">
                  <div className="flex items-center gap-6 border-b border-slate-100 pb-6">
                    <span className="text-[10px] font-black text-unicou-orange uppercase tracking-[0.4em]">Order ID: {o.id}</span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">{new Date(o.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {o.voucherCodes.map((code, idx) => (
                      <div key={idx} className="bg-white p-10 rounded-[3rem] border border-slate-100 flex justify-between items-center group hover:border-unicou-vibrant transition-all shadow-xl relative overflow-hidden">
                        <div>
                          <h4 className="font-black text-slate-900 uppercase tracking-tighter text-xl mb-1">{o.productName}</h4>
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Verified Exam Code</p>
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
      </div>
    </div>
  );
};

export default CustomerDashboard;
