
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Order, User, TestResult } from '../types';

const CustomerDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'vouchers' | 'results'>('vouchers');

  useEffect(() => {
    const fetch = async () => {
      const [o, r] = await Promise.all([api.getOrders(), api.getTestResults()]);
      setOrders(o);
      setResults(r);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="p-20 text-center animate-pulse">Opening your Secure Vault...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-display font-bold mb-4">Student <span className="text-primary-400">Terminal</span></h1>
        <p className="text-slate-500">Welcome back, {user.name}. Manage your assets and view performance metrics.</p>
        
        <div className="flex justify-center mt-8">
          <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-slate-800 backdrop-blur-md">
            <button 
              onClick={() => setActiveTab('vouchers')}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'vouchers' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >Voucher Vault</button>
            <button 
              onClick={() => setActiveTab('results')}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'results' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >Exam Results</button>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        {activeTab === 'vouchers' && (
          <div className="space-y-12">
            {orders.length === 0 ? (
              <div className="glass p-20 rounded-[3rem] border-dashed border-slate-800 text-center">
                <p className="text-slate-500 text-lg">You haven't purchased any vouchers yet.</p>
                <button className="mt-6 text-primary-400 font-bold hover:underline">Browse the Store →</button>
              </div>
            ) : (
              orders.map(o => (
                <div key={o.id} className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
                    <span className="text-xs font-black text-slate-600 uppercase tracking-[0.3em]">Order {o.id}</span>
                    <span className="text-xs text-slate-500">{new Date(o.timestamp).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {o.voucherCodes.map((code, idx) => (
                      <div key={idx} className="glass p-8 rounded-3xl border-slate-800 flex justify-between items-center group hover:border-primary-500/50 transition-all shadow-xl">
                        <div>
                          <h4 className="font-bold text-slate-200">{o.productName}</h4>
                          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Ready for redemption</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-xl font-bold text-primary-400 tracking-wider bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">{code}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-8">
            {results.length === 0 ? (
              <div className="glass p-20 rounded-[3rem] border-dashed border-slate-800 text-center text-slate-500">
                No exam attempts recorded in this session.
              </div>
            ) : (
              results.map(r => (
                <div key={r.id} className="glass p-8 md:p-12 rounded-[3rem] border border-slate-800 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 font-display font-black text-7xl select-none group-hover:opacity-10 transition-opacity">
                    {r.overallBand || '...'}
                  </div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${r.status === 'Graded' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                          {r.status}
                        </span>
                        <span className="text-slate-500 text-xs font-mono">{r.id}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-100">{r.testTitle}</h3>
                      <p className="text-slate-500 text-sm mt-1">Submitted on {new Date(r.timestamp).toLocaleString()}</p>
                    </div>
                    {r.overallBand && (
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Overall Band</p>
                        <p className="text-5xl font-display font-bold text-primary-400">{r.overallBand}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {r.skillScores.map(ss => (
                      <div key={ss.skill} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl relative">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{ss.skill}</p>
                        <p className="text-xl font-bold text-slate-200">
                          {ss.isGraded ? `${ss.score}/${ss.total}` : 'Evaluating...'}
                        </p>
                        {ss.isGraded && ss.feedback && (
                          <div className="mt-4 pt-4 border-t border-slate-800">
                             <p className="text-[10px] font-black text-primary-400/60 uppercase tracking-widest mb-2">Trainer Insights</p>
                             <p className="text-xs text-slate-400 italic line-clamp-3 leading-relaxed">"{ss.feedback}"</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {r.status === 'Graded' && (
                    <div className="flex justify-end pt-6 border-t border-slate-800">
                       <button className="text-primary-400 font-bold text-sm hover:underline flex items-center gap-2">
                         Download Detailed Performance Report
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M7 10l5 5m0 0l5-5m-5 5V3" /></svg>
                       </button>
                    </div>
                  )}
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
