
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { FinanceReport, User } from '../types';

const FinanceDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [report, setReport] = useState<FinanceReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getFinanceReport();
        setReport(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-20 text-center animate-pulse">Loading Ledger...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold">Finance <span className="text-emerald-400">Ledger</span></h1>
          <p className="text-slate-500 text-sm mt-1">Global transaction tracking and revenue reporting.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Real-time Sync Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="glass p-8 rounded-[2.5rem] border border-slate-800 shadow-xl">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Gross Revenue</p>
          <p className="text-5xl font-display font-bold text-emerald-400 font-mono tracking-tighter">${report?.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="glass p-8 rounded-[2.5rem] border border-slate-800 shadow-xl">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Volume Fulfilled</p>
          <p className="text-5xl font-display font-bold text-primary-400 font-mono tracking-tighter">{report?.totalVouchersSold}</p>
        </div>
        <div className="glass p-8 rounded-[2.5rem] border border-slate-800 shadow-xl">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Average Order Value</p>
          <p className="text-5xl font-display font-bold text-orange-400 font-mono tracking-tighter">
            ${report?.totalRevenue ? (report.totalRevenue / (report.recentSales.length || 1)).toFixed(0) : '0'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-10 rounded-[3rem] border border-slate-800 shadow-2xl">
          <h3 className="text-xl font-bold mb-8">Revenue Stream by Product Node</h3>
          <div className="space-y-6">
            {report?.salesByType.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">{item.name}</span>
                  <span className="font-mono text-slate-200">${item.value.toLocaleString()}</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${(item.value / (report?.totalRevenue || 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-[3rem] border border-slate-800 overflow-hidden shadow-2xl">
          <div className="px-10 py-6 border-b border-slate-800 bg-slate-900/50">
            <h3 className="text-xl font-bold">Transaction Ledger</h3>
          </div>
          <div className="overflow-y-auto max-h-[500px] no-scrollbar">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/80 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                <tr>
                  <th className="px-8 py-5">Order Node</th>
                  <th className="px-8 py-5">Target</th>
                  <th className="px-8 py-5 text-right">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {report?.recentSales.map(o => (
                  <tr key={o.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-8 py-5">
                      <div className="font-mono font-bold text-primary-400">{o.id}</div>
                      <div className="text-[10px] text-slate-500">{new Date(o.timestamp).toLocaleDateString()}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-slate-300 font-medium">{o.productName}</div>
                      <div className="text-[10px] text-slate-500">Qty: {o.quantity}</div>
                    </td>
                    <td className="px-8 py-5 text-right font-bold text-emerald-500 font-mono">${o.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
