
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Lead, Order, User, OrderStatus } from '../types';

const SalesDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'leads' | 'orders'>('orders');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const refreshData = async () => {
    const [le, o] = await Promise.all([api.getLeads(), api.getOrders()]);
    setLeads(le); setOrders(o); setLoading(false);
  };

  useEffect(() => { refreshData(); }, []);

  const handleAction = async (orderId: string, status: OrderStatus) => {
    setActionLoading(orderId);
    try {
      await api.updateOrderStatus(orderId, status);
      await refreshData();
    } catch (err: any) { alert(err.message); }
    finally { setActionLoading(null); }
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase tracking-widest text-xs">Accessing Sales Node...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 pb-24 bg-white">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16 pt-12">
        <div>
          <h1 className="text-5xl font-display font-black tracking-tight text-slate-900 leading-none uppercase">SALES <span className="text-unicou-orange">TERMINAL</span></h1>
          <p className="text-slate-500 mt-4 font-bold uppercase text-[10px] tracking-widest">Session Operator: {user.name} • Scope: {user.role}</p>
        </div>
        <div className="flex bg-slate-50 p-2 rounded-[2.5rem] border border-slate-200 shadow-inner">
          <button onClick={() => setActiveTab('leads')} className={`px-10 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'bg-white text-unicou-navy shadow-lg border border-slate-200' : 'text-slate-400'}`}>IV.i Agent Registry / Leads</button>
          <button onClick={() => setActiveTab('orders')} className={`px-10 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-white text-unicou-navy shadow-lg border border-slate-200' : 'text-slate-400'}`}>IV.ii Sales Register</button>
        </div>
      </div>

      <div className="bg-white p-2 rounded-[4rem] border border-slate-200 shadow-2xl overflow-hidden min-h-[600px]">
        {activeTab === 'orders' && (
          <div className="overflow-x-auto animate-in fade-in duration-500">
             <table className="w-full text-left text-[10px] uppercase">
              <thead>
                <tr className="bg-slate-50 font-black text-slate-500 tracking-widest border-b border-slate-100">
                  <th className="px-4 py-6">Order No.</th>
                  <th className="px-4 py-6">Timestamp</th>
                  <th className="px-4 py-6">Buyer Name</th>
                  <th className="px-4 py-6">Bank A/C ID</th>
                  <th className="px-4 py-6">Voucher Type</th>
                  <th className="px-4 py-6 text-center">Qty</th>
                  <th className="px-4 py-6">Paid Amount</th>
                  <th className="px-4 py-6 text-center">Audit Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-bold">
                {orders.map(o => (
                  <tr key={o.id} className={`hover:bg-slate-50 ${actionLoading === o.id ? 'opacity-50 grayscale' : ''}`}>
                    <td className="px-4 py-6 font-mono text-unicou-navy">{o.id}</td>
                    <td className="px-4 py-6 font-mono text-slate-400">{o.date} {o.time}</td>
                    <td className="px-4 py-6 font-black text-slate-900">{o.buyerName}</td>
                    <td className="px-4 py-6 font-mono">****{o.bankLastFour}</td>
                    <td className="px-4 py-6 text-unicou-navy">{o.productName}</td>
                    <td className="px-4 py-6 text-center">{o.quantity}</td>
                    <td className="px-4 py-4 font-display font-black text-slate-950">${o.totalAmount}</td>
                    <td className="px-4 py-6">
                       <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleAction(o.id, 'Approved')} className={`px-4 py-2 bg-emerald-500 text-white rounded-xl text-[8px] font-black hover:bg-emerald-600 shadow-lg ${o.status === 'Approved' ? 'ring-2 ring-emerald-200' : ''}`}>Verify</button>
                          <button onClick={() => handleAction(o.id, 'Hold')} className={`px-4 py-2 bg-amber-500 text-white rounded-xl text-[8px] font-black hover:bg-amber-600 shadow-lg ${o.status === 'Hold' ? 'ring-2 ring-amber-200' : ''}`}>Hold</button>
                          <button onClick={() => handleAction(o.id, 'Rejected')} className={`px-4 py-2 bg-red-600 text-white rounded-xl text-[8px] font-black hover:bg-red-700 shadow-lg ${o.status === 'Rejected' ? 'ring-2 ring-red-200' : ''}`}>Reject</button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'leads' && (
           <div className="p-10 animate-in fade-in duration-500 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leads.map(l => (
                <div key={l.id} className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 hover:border-unicou-orange/20 transition-all">
                  <span className="px-3 py-1 bg-white border border-slate-200 text-[8px] font-black uppercase rounded-full mb-6 inline-block">{l.type}</span>
                  <h4 className="font-black text-slate-900 uppercase text-lg mb-1">{l.data.name || l.data.org_name}</h4>
                  <p className="text-[10px] text-slate-500 font-mono italic mb-6">{l.data.email}</p>
                  <div className="p-4 bg-white rounded-2xl text-xs font-bold text-slate-700 border border-slate-100">"{l.data.course || l.data.message || 'Consultancy Required'}"</div>
                </div>
              ))}
           </div>
        )}
      </div>
    </div>
  );
};

export default SalesDashboard;
