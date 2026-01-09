
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Lead, Order, User, OrderStatus } from '../types';

const SalesDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'leads' | 'orders'>('orders');

  const refreshData = async () => {
    const [le, o] = await Promise.all([api.getLeads(), api.getOrders()]);
    setLeads(le);
    setOrders(o);
    setLoading(false);
  };

  useEffect(() => { refreshData(); }, []);

  const handleAction = async (orderId: string, status: OrderStatus) => {
    await api.updateOrderStatus(orderId, status);
    refreshData();
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase tracking-[0.4em]">Initializing Sales Terminal...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 pb-24 bg-white">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16 pt-12">
        <div>
          <h1 className="text-5xl font-display font-black tracking-tight text-slate-900 leading-none uppercase">Sales <span className="text-unicou-orange">Terminal</span></h1>
          <p className="text-slate-500 mt-4 font-bold uppercase text-[10px] tracking-widest">AUTHORIZED NODE: {user.name} ({user.role})</p>
        </div>
        <div className="flex bg-slate-50 p-2 rounded-[2.5rem] border border-slate-200 shadow-inner">
          <button onClick={() => setActiveTab('leads')} className={`px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'bg-white text-unicou-navy shadow-lg border border-slate-200' : 'text-slate-400'}`}>Leads Registry</button>
          <button onClick={() => setActiveTab('orders')} className={`px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-white text-unicou-navy shadow-lg border border-slate-200' : 'text-slate-400'}`}>Verification Queue</button>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[4rem] border border-slate-200 shadow-2xl overflow-hidden min-h-[600px]">
        {activeTab === 'orders' && (
          <div className="overflow-x-auto animate-in fade-in duration-500">
             <div className="flex justify-between items-center mb-10 px-4">
                <h3 className="text-lg font-black uppercase tracking-tighter">Action Queue (Verify & Deliver)</h3>
                <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black border border-emerald-100 uppercase tracking-widest">{orders.filter(o => o.status === 'Pending').length} Pending Audits</span>
             </div>
             <table className="w-full text-left text-[9px]">
              <thead>
                <tr className="bg-slate-50 font-black uppercase text-slate-500 tracking-widest border-y border-slate-100">
                  <th className="px-4 py-6">Order No.</th>
                  <th className="px-4 py-6">Date</th>
                  <th className="px-4 py-6">Buyer Name</th>
                  <th className="px-4 py-6">Bank A/C (Last 4)</th>
                  <th className="px-4 py-6">Voucher Type</th>
                  <th className="px-4 py-6 text-center">Qty</th>
                  <th className="px-4 py-6">Paid Amount</th>
                  <th className="px-4 py-6 text-center">Action Node</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 uppercase">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50 font-bold text-slate-600 transition-all">
                    <td className="px-4 py-6 font-mono text-unicou-navy">{o.id}</td>
                    <td className="px-4 py-6 font-mono text-slate-400">{o.date} {o.time}</td>
                    <td className="px-4 py-6 font-black text-slate-900">{o.buyerName}</td>
                    <td className="px-4 py-6 font-mono">****{o.bankLastFour}</td>
                    <td className="px-4 py-6 text-unicou-navy">{o.productName}</td>
                    <td className="px-4 py-6 text-center">{o.quantity}</td>
                    <td className="px-4 py-4 font-display font-black text-slate-950 text-base">${o.totalAmount}</td>
                    <td className="px-4 py-6">
                       <div className="flex items-center justify-center gap-2">
                          {o.status === 'Pending' ? (
                            <>
                              <button onClick={() => handleAction(o.id, 'Approved')} className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[8px] font-black uppercase hover:bg-emerald-600 shadow-lg active:scale-95" title="Verify and Deliver">Verify</button>
                              <button onClick={() => handleAction(o.id, 'Hold')} className="px-4 py-2 bg-amber-500 text-white rounded-xl text-[8px] font-black uppercase hover:bg-amber-600 shadow-lg active:scale-95" title="Further Verification">Hold</button>
                              <button onClick={() => handleAction(o.id, 'Rejected')} className="px-4 py-2 bg-red-600 text-white rounded-xl text-[8px] font-black uppercase hover:bg-red-700 shadow-lg active:scale-95" title="Reject">Reject</button>
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                               <div className={`w-1.5 h-1.5 rounded-full ${o.status === 'Approved' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                               <span className={`px-4 py-1.5 rounded-full text-[8px] font-black border ${o.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>{o.status}</span>
                            </div>
                          )}
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'leads' && (
           <div className="p-20 text-center animate-in fade-in duration-500">
              <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">🗂️</div>
              <h3 className="text-2xl font-display font-black text-slate-900 uppercase">Leads Registry</h3>
              <p className="text-slate-400 font-bold italic mt-4">Consolidating student admissions and agent registrations...</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default SalesDashboard;
