
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/apiService';
import { Product, VoucherCode, Order, User, Lead, SecurityStatus } from '../types';

type AdminTab = 'sync' | 'agents' | 'orders' | 'inventory';

const SYSTEM_CONFIG_KEY = 'unicou_system_infrastructure_v1';

const AdminDashboard: React.FC<{ user: User }> = ({ user }) => {
  const isOwner = user.role === 'System Admin/Owner';
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    products: Product[],
    codes: VoucherCode[],
    orders: Order[],
    users: User[],
    leads: Lead[]
  }>({ products: [], codes: [], orders: [], users: [], leads: [] });

  const fetchData = async () => {
    try {
      const [p, c, o, u, le] = await Promise.all([
        api.getProducts(), api.getCodes(), api.getOrders(), api.getUsers(), api.getLeads()
      ]);
      setData({ products: p, codes: c, orders: o, users: u, leads: le });
      setLoading(false);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleFulfillOrder = async (orderId: string) => {
    if (confirm("Verify settlement and initialize VOUCHER DISPATCH?")) {
       try {
         await api.fulfillOrder(orderId);
         fetchData();
       } catch (err: any) {
         alert(err.message);
       }
    }
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase text-[10px] tracking-[0.4em]">Initializing Core Authority Node...</div>;

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-16 border-b-2 border-unicou-navy pb-10">
        <div>
           <h1 className="text-5xl font-display font-black text-unicou-charcoal uppercase tracking-tighter">
             SYSTEM <span className="text-unicou-orange">ADMIN</span>
           </h1>
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">
             Connected Node: <span className="text-unicou-navy">ACTIVE AUTHORITY TERMINAL</span>
           </p>
        </div>
        <div className="flex bg-unicou-ice p-1.5 rounded-[2rem] border border-slate-200 shadow-inner">
           {['orders', 'agents', 'inventory', 'sync'].map((tab) => (
             <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-unicou-navy shadow-lg' : 'text-slate-400 hover:text-unicou-charcoal'}`}>
               {tab}
             </button>
           ))}
        </div>
      </div>

      {activeTab === 'orders' && (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
           <table className="w-full text-left">
              <thead>
                <tr className="bg-unicou-ice text-[10px] font-black uppercase text-slate-400 border-b tracking-widest">
                  <th className="px-10 py-6">Order Node</th><th className="px-10 py-6">Buyer Identity</th><th className="px-10 py-6">Product</th><th className="px-10 py-6 text-right">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {data.orders.map(o => (
                   <tr key={o.id} className="hover:bg-unicou-ice transition-colors">
                      <td className="px-10 py-6">
                         <div className="font-mono font-black text-unicou-navy text-xs">{o.id}</div>
                         <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase">REF: {o.bankRef}</div>
                      </td>
                      <td className="px-10 py-6">
                         <div className="font-black uppercase text-xs text-unicou-charcoal">{o.buyerName}</div>
                         <div className="text-[10px] text-slate-400 font-mono italic">{o.customerEmail}</div>
                      </td>
                      <td className="px-10 py-6 font-bold text-slate-500 text-xs uppercase">{o.productName} (x{o.quantity})</td>
                      <td className="px-10 py-6 text-right">
                         {o.status === 'Pending' ? (
                           <button onClick={() => handleFulfillOrder(o.id)} className="px-6 py-2 bg-unicou-navy text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-unicou-charcoal">Verify & Dispatch</button>
                         ) : (
                           <span className="px-4 py-1.5 bg-slate-100 text-unicou-navy rounded-full text-[8px] font-black uppercase border border-slate-200">Dispatched Node</span>
                         )}
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
