
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Lead, Order, User } from '../types';

const SalesDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'leads' | 'orders'>('leads');

  useEffect(() => {
    const fetch = async () => {
      const [le, o] = await Promise.all([api.getLeads(), api.getOrders()]);
      setLeads(le);
      setOrders(o);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase tracking-[0.4em]">Initializing Sales Management Node...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24 bg-white">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-display font-black tracking-tight text-slate-900 leading-none uppercase">Sales <span className="text-unicou-orange">Management</span></h1>
          <p className="text-slate-500 mt-4 font-bold uppercase text-xs tracking-widest">Operator: {user.name} • Node: <span className="text-unicou-navy">Global Sales Registry</span></p>
        </div>
        <div className="flex bg-slate-50 p-2 rounded-[2rem] border border-slate-200 shadow-inner">
          <button onClick={() => setActiveTab('leads')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'bg-white text-unicou-navy shadow-lg' : 'text-slate-400'}`}>Lead Registry</button>
          <button onClick={() => setActiveTab('orders')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-white text-unicou-navy shadow-lg' : 'text-slate-400'}`}>Order Feed</button>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[4rem] border border-slate-200 shadow-2xl overflow-hidden min-h-[600px]">
        {activeTab === 'leads' ? (
          <div className="overflow-x-auto">
            <h3 className="text-xl font-black mb-8 uppercase tracking-tighter">Global Lead Registry</h3>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-widest border-y border-slate-100">
                  <th className="px-8 py-6">Timestamp</th>
                  <th className="px-8 py-6">Type</th>
                  <th className="px-8 py-6">Identity / Name</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map(l => (
                  <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-6 text-[11px] font-mono text-slate-400">{new Date(l.timestamp).toLocaleString()}</td>
                    <td className="px-8 py-6"><span className="px-3 py-1 bg-slate-100 rounded text-[9px] font-black uppercase">{l.type}</span></td>
                    <td className="px-8 py-6">
                      <div className="font-black text-slate-900 uppercase text-xs">{l.data.name || 'Anonymous Node'}</div>
                      <div className="text-[10px] text-slate-500 font-mono italic">{l.data.email}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${l.status === 'New' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>{l.status}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="px-5 py-2 bg-unicou-navy text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-950 transition-all">Connect</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
             <h3 className="text-xl font-black mb-8 uppercase tracking-tighter">Live Fulfillment Feed</h3>
             <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-widest border-y border-slate-100">
                  <th className="px-6 py-6">I. Order ID</th>
                  <th className="px-6 py-6">II. Date</th>
                  <th className="px-6 py-6">III. Time</th>
                  <th className="px-6 py-6">IV. Buyer Name</th>
                  <th className="px-6 py-6">V. Product Name</th>
                  <th className="px-6 py-6">VI. Amount</th>
                  <th className="px-6 py-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map(o => {
                  const d = new Date(o.timestamp);
                  return (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="px-6 py-6 font-mono font-bold text-unicou-navy text-xs">{o.id}</td>
                      <td className="px-6 py-6 font-mono text-slate-400 text-xs">{d.toLocaleDateString()}</td>
                      <td className="px-6 py-6 font-mono text-slate-400 text-xs">{d.toLocaleTimeString()}</td>
                      <td className="px-6 py-6 font-black text-slate-900 uppercase text-xs">{o.buyerName}</td>
                      <td className="px-6 py-6 font-black text-slate-700 uppercase text-xs">{o.productName}</td>
                      <td className="px-6 py-6 font-display font-black text-slate-950">${o.totalAmount}</td>
                      <td className="px-6 py-6 text-right">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                          o.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
                          o.status === 'Hold' ? 'bg-amber-50 text-amber-600' :
                          o.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                          'bg-orange-50 text-orange-600'
                        }`}>{o.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesDashboard;
