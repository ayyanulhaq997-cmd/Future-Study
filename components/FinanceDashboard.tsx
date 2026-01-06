
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
         <p className="text-slate-500 font-bold italic text-lg leading-relaxed">Sales Register Ledger (Mandatory 8-Column Format)</p>
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl overflow-hidden">
        <div className="p-10">
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-slate-900 text-white">
                   <tr className="text-[9px] font-black uppercase tracking-widest">
                     <th className="px-4 py-5">I. Order No</th>
                     <th className="px-4 py-5">II. Date</th>
                     <th className="px-4 py-5">III. Time</th>
                     <th className="px-4 py-5">IV. Buyer Name</th>
                     <th className="px-4 py-5">V. Bank A/C (4)</th>
                     <th className="px-4 py-5">VI. Voucher Type</th>
                     <th className="px-4 py-5">VII. Qty</th>
                     <th className="px-4 py-5">VIII. Paid Amount</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {report?.recentSales.map(o => (
                      <tr key={o.id} className="hover:bg-slate-50 transition-all">
                        <td className="px-4 py-5 font-mono font-black text-unicou-navy text-[11px]">{o.id}</td>
                        <td className="px-4 py-5 font-mono text-[10px] text-slate-500">{o.date}</td>
                        <td className="px-4 py-5 font-mono text-[10px] text-slate-500">{o.time}</td>
                        <td className="px-4 py-5 font-black text-[10px] uppercase truncate max-w-[120px] text-slate-900">{o.buyerName}</td>
                        <td className="px-4 py-5 font-mono font-bold text-[10px] text-slate-400">****{o.bankLastFour}</td>
                        <td className="px-4 py-5 font-black text-[10px] uppercase text-slate-700">{o.productName}</td>
                        <td className="px-4 py-5 font-mono font-bold text-[11px] text-slate-600">{o.quantity}</td>
                        <td className="px-4 py-5 font-display font-black text-base text-slate-950">${o.totalAmount.toLocaleString()}</td>
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
