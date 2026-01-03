
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { User, Order, OrderStatus } from '../types';

const SupportDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'leads' | 'orders'>('orders');

  const fetchData = async () => {
    const o = await api.getOrders();
    setOrders(o);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    if (confirm(`SUPPORT ACTION: Transition order ${orderId} to ${status}?`)) {
      try {
        await api.updateOrderStatus(orderId, status);
        fetchData();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase text-[11px] tracking-[0.4em]">Establishing Support Node...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-16">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-emerald-100">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Unified Support Terminal
           </div>
           <h1 className="text-5xl md:text-7xl font-display font-black text-slate-950 uppercase tracking-tighter leading-none">Global <span className="text-unicou-orange">Operations</span></h1>
        </div>
        
        <div className="flex bg-slate-50 p-2 rounded-[2rem] border border-slate-200 shadow-inner">
          <button onClick={() => setActiveTab('orders')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-white text-unicou-navy shadow-xl' : 'text-slate-500'}`}>Order Feed</button>
        </div>
      </div>

      {activeTab === 'orders' && (
        <div className="bg-white rounded-[4rem] border border-slate-200 shadow-2xl overflow-hidden p-8">
           <h3 className="text-xl font-black mb-8 uppercase tracking-tighter text-unicou-navy">Live Transaction Sync</h3>
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
                   <th className="px-6 py-6">VII. Reference</th>
                   <th className="px-6 py-6 text-center">VIII. Status Dispatch</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {orders.map(o => {
                   const d = new Date(o.timestamp);
                   return (
                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-5 font-mono font-bold text-unicou-navy text-[11px]">{o.id}</td>
                      <td className="px-6 py-5 font-mono text-slate-400 text-[10px]">{d.toLocaleDateString()}</td>
                      <td className="px-6 py-5 font-mono text-slate-400 text-[10px]">{d.toLocaleTimeString()}</td>
                      <td className="px-6 py-5 font-black text-slate-900 uppercase text-[10px] truncate max-w-[100px]">{o.buyerName}</td>
                      <td className="px-6 py-5 font-black text-slate-700 uppercase text-[10px]">{o.productName}</td>
                      <td className="px-6 py-5 font-display font-black text-slate-950 text-base">${o.totalAmount}</td>
                      <td className="px-6 py-5 font-mono text-slate-400 text-[9px] uppercase truncate max-w-[80px]">{o.bankRef || 'PENDING'}</td>
                      <td className="px-6 py-5">
                         <div className="flex flex-col items-center gap-2">
                           <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase border ${
                              o.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                              o.status === 'Hold' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                              o.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                              'bg-slate-50 text-slate-600 border-slate-100'
                           }`}>{o.status}</span>
                           
                           <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-100 shadow-sm">
                              <button onClick={() => handleUpdateStatus(o.id, 'Approved')} className="w-6 h-6 flex items-center justify-center bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-all text-[8px]">✔</button>
                              <button onClick={() => handleUpdateStatus(o.id, 'Hold')} className="w-6 h-6 flex items-center justify-center bg-amber-500 text-white rounded hover:bg-amber-600 transition-all text-[8px]">⏳</button>
                              <button onClick={() => handleUpdateStatus(o.id, 'Rejected')} className="w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded hover:bg-red-600 transition-all text-[8px]">✖</button>
                           </div>
                         </div>
                      </td>
                    </tr>
                   );
                 })}
               </tbody>
             </table>
           </div>
        </div>
      )}
    </div>
  );
};

export default SupportDashboard;
