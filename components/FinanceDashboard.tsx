
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Order, User, FinanceReport } from '../types';

const FinanceDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrders().then(o => {
      setOrders(o);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase tracking-[0.4em]">Accessing Finance Node...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="mb-12 flex justify-between items-end border-b-2 border-slate-100 pb-12">
        <div>
           <h1 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">FINANCE <span className="text-unicou-orange">LEDGER</span></h1>
           <p className="text-slate-500 font-bold italic text-lg leading-relaxed">III. Official Finance Team Terminal • Sales & Purchase Registry</p>
        </div>
        <div className="flex gap-4">
           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase">Closing Balance</p>
              <p className="text-2xl font-display font-black text-unicou-navy">$45,290.00</p>
           </div>
        </div>
      </div>

      {/* Stock Report Section (Page 2) */}
      <section className="mb-12">
         <h3 className="text-sm font-black uppercase text-slate-400 tracking-[0.3em] mb-6">I. Stock Reports Item Wise</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['PTE', 'IELTS', 'TOEFL', 'LanguageCert', 'Skills Eng', 'Oxford ELLT'].map(item => (
              <div key={item} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                 <p className="text-[10px] font-black text-unicou-navy uppercase mb-4">{item}</p>
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px]"><span className="text-slate-400">Qty:</span> <span className="font-black">150</span></div>
                    <div className="flex justify-between text-[10px]"><span className="text-slate-400">Price:</span> <span className="font-black text-unicou-orange">$149</span></div>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* Sales Register (Page 2, 8-Column) */}
      <div className="bg-white rounded-[4rem] border border-slate-200 shadow-2xl overflow-hidden">
        <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
           <h3 className="text-lg font-display font-black uppercase tracking-tight">v. Sales Register (Mandatory 8-Column Format)</h3>
           <div className="flex gap-2">
              <input type="date" className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-[10px] font-black uppercase" />
              <button className="px-6 py-2 bg-unicou-orange rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl">Filter Node</button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-500 tracking-[0.1em]">
              <tr>
                <th className="px-6 py-6">Order No.</th>
                <th className="px-6 py-6">Order Date</th>
                <th className="px-6 py-6">Order Time</th>
                <th className="px-6 py-6">Buyer Name</th>
                <th className="px-6 py-6">Bank A/C (4)</th>
                <th className="px-6 py-6">Voucher Type</th>
                <th className="px-6 py-6">Vouchers Qty</th>
                <th className="px-6 py-6">Paid Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5 font-mono font-black text-[11px] text-unicou-navy">{o.id}</td>
                  <td className="px-6 py-5 font-mono text-[11px] text-slate-500">{o.date}</td>
                  <td className="px-6 py-5 font-mono text-[11px] text-slate-500">{o.time}</td>
                  <td className="px-6 py-5 font-black text-[11px] text-slate-900 uppercase truncate max-w-[120px]">{o.buyerName}</td>
                  <td className="px-6 py-5 font-mono text-[11px] text-slate-400">****{o.bankLastFour}</td>
                  <td className="px-6 py-5 font-black text-[11px] text-slate-700 uppercase truncate max-w-[120px]">{o.productName}</td>
                  <td className="px-6 py-5 font-mono font-bold text-slate-500">{o.quantity}</td>
                  <td className="px-6 py-5 font-display font-black text-slate-950 text-base">${o.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
