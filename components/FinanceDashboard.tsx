
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { FinanceReport, User } from '../types';

const FinanceDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [report, setReport] = useState<FinanceReport | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const r = await api.getFinanceReport();
    setReport(r);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase text-[11px] tracking-[0.4em]">Synchronizing BI Node...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 bg-white min-h-screen printable-area">
      <div className="mb-12 border-b-2 border-slate-100 pb-12 print:border-black">
         <h1 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">FINANCIAL <span className="text-unicou-orange">PORTAL</span></h1>
         <p className="text-slate-500 font-bold italic text-lg leading-relaxed">Authenticated sales ledger for UNICOU Ltd. Generated: {new Date().toLocaleString()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 print:grid-cols-2">
         <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
            <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Gross Revenue</p>
            <p className="text-3xl font-display font-black text-unicou-navy">${report?.totalRevenue.toLocaleString()}</p>
         </div>
         <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200">
            <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Total Sold</p>
            <p className="text-3xl font-display font-black text-slate-900">{report?.totalVouchersSold} Units</p>
         </div>
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl overflow-hidden">
        <div className="p-10">
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-slate-900 text-white">
                   <tr className="text-[9px] font-black uppercase tracking-widest">
                     <th className="px-4 py-5">I. Order ID</th>
                     <th className="px-4 py-5">II. Date</th>
                     <th className="px-4 py-5">III. Time</th>
                     <th className="px-4 py-5">IV. Buyer Name</th>
                     <th className="px-4 py-5">V. Product Name</th>
                     <th className="px-4 py-5">VI. Amount</th>
                     <th className="px-4 py-5">VII. Reference</th>
                     <th className="px-4 py-5 text-right">VIII. Proof Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {report?.recentSales.map(o => {
                     const d = new Date(o.timestamp);
                     return (
                      <tr key={o.id}>
                        <td className="px-4 py-5 font-mono font-black text-unicou-navy text-[10px]">{o.id}</td>
                        <td className="px-4 py-5 font-mono text-[10px] text-slate-500">{d.toLocaleDateString()}</td>
                        <td className="px-4 py-5 font-mono text-[10px] text-slate-500">{d.toLocaleTimeString()}</td>
                        <td className="px-4 py-5 font-black text-[10px] uppercase truncate max-w-[120px]">{o.buyerName}</td>
                        <td className="px-4 py-5 font-black text-[10px] uppercase">{o.productName}</td>
                        <td className="px-4 py-5 font-display font-black text-base">${o.totalAmount}</td>
                        <td className="px-4 py-5 font-mono text-slate-400 text-[9px] truncate max-w-[100px]">{o.bankRef}</td>
                        <td className="px-4 py-5 text-right">
                          <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${o.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            {o.status === 'Approved' ? 'VERIFIED' : 'PENDING'}
                          </span>
                        </td>
                      </tr>
                     );
                   })}
                 </tbody>
               </table>
             </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
