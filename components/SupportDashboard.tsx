
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { User, Order, OrderStatus } from '../types';

const SupportDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const o = await api.getOrders();
    setOrders(o);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    if (confirm(`SUPPORT: Proced with update to ${status}?`)) {
      await api.updateOrderStatus(orderId, status);
      fetchData();
    }
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase text-[11px] tracking-[0.4em]">Synchronizing Support Hub...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="mb-12">
           <h1 className="text-5xl font-display font-black text-slate-950 uppercase tracking-tighter leading-none">Support <span className="text-unicou-orange">Operations</span></h1>
           <p className="text-[10px] font-black uppercase text-slate-400 mt-2 tracking-[0.3em]">Transaction Reconciliation Terminal (8-Column Ledger)</p>
      </div>

      <div className="bg-white rounded-[4rem] border border-slate-200 shadow-2xl overflow-hidden p-8">
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-slate-50 text-[9px] font-black uppercase text-slate-500 tracking-widest border-y border-slate-100">
                   <th className="px-6 py-6">I. Order ID</th>
                   <th className="px-6 py-6">II. Date</th>
                   <th className="px-6 py-6">III. Time</th>
                   <th className="px-6 py-6">IV. Buyer Name</th>
                   <th className="px-6 py-6">V. Product Name</th>
                   <th className="px-6 py-6">VI. Amount</th>
                   <th className="px-6 py-6">VII. Ref No.</th>
                   <th className="px-6 py-6 text-center">VIII. Control</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {orders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-5 font-mono font-bold text-unicou-navy text-[11px]">{o.id}</td>
                      <td className="px-6 py-5 font-mono text-slate-400 text-[10px]">{o.date}</td>
                      <td className="px-6 py-5 font-mono text-slate-400 text-[10px]">{o.time}</td>
                      <td className="px-6 py-5 font-black text-slate-900 uppercase text-[10px]">{o.buyerName}</td>
                      <td className="px-6 py-5 font-black text-slate-700 uppercase text-[10px]">{o.productName}</td>
                      <td className="px-6 py-5 font-display font-black text-slate-950 text-base">${o.totalAmount}</td>
                      <td className="px-6 py-5 font-mono text-slate-400 text-[9px] uppercase">{o.bankRef}</td>
                      <td className="px-6 py-5">
                         <div className="flex flex-col items-center gap-2">
                           <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase border ${o.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600'}`}>{o.status}</span>
                           <div className="flex gap-1">
                              <button onClick={() => handleUpdateStatus(o.id, 'Approved')} className="w-6 h-6 flex items-center justify-center bg-emerald-500 text-white rounded text-[8px]">✔</button>
                              <button onClick={() => handleUpdateStatus(o.id, 'Hold')} className="w-6 h-6 flex items-center justify-center bg-amber-500 text-white rounded text-[8px]">⏳</button>
                              <button onClick={() => handleUpdateStatus(o.id, 'Rejected')} className="w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded text-[8px]">✖</button>
                           </div>
                         </div>
                      </td>
                    </tr>
                 ))}
               </tbody>
             </table>
           </div>
      </div>
    </div>
  );
};

export default SupportDashboard;
