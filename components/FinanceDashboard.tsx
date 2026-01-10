import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Order, User, Product, VoucherCode } from '../types';

const FinanceDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [codes, setCodes] = useState<VoucherCode[]>([]);
  const [activeTab, setActiveTab] = useState<'stock' | 'sales' | 'purchases'>('stock');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getOrders(), api.getProducts(), api.getCodes()]).then(([o, p, c]) => {
      setOrders(o); setProducts(p); setCodes(c); setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase tracking-widest">Reconciling Ledgers...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="text-center mb-16 border-b-2 border-slate-100 pb-16">
           <h1 className="text-7xl font-display font-black text-slate-900 uppercase tracking-tighter leading-none mb-4">FINANCE <span className="text-unicou-orange">HUB</span></h1>
           <p className="text-slate-500 font-bold tracking-[0.6em] text-sm uppercase">Standardized 8-Column Fiscal Node</p>
           
           <div className="flex justify-center mt-12 gap-4">
              {['stock', 'sales', 'purchases'].map(t => (
                <button key={t} onClick={() => setActiveTab(t as any)} className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-unicou-navy text-white shadow-xl' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                  {t === 'stock' ? 'III.i Stock Reports' : t === 'sales' ? 'V Sales Register' : 'II Purchase Register'}
                </button>
              ))}
           </div>
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-3xl overflow-hidden p-1.5">
           {activeTab === 'stock' && (
             <div className="overflow-x-auto">
               <table className="w-full text-center text-[10px] border-collapse font-mono">
                 <thead className="bg-slate-100 font-black text-slate-600">
                    <tr className="border-b border-slate-200">
                      <th rowSpan={2} className="px-4 py-4 border-r border-slate-200 text-left uppercase">Product Node</th>
                      <th colSpan={2} className="px-2 py-2 border-r border-slate-200 bg-blue-50">Opening</th>
                      <th colSpan={2} className="px-2 py-2 border-r border-slate-200">Purchase</th>
                      <th colSpan={2} className="px-2 py-2 border-r border-slate-200 bg-indigo-50">Total Available</th>
                      <th colSpan={2} className="px-2 py-2 border-r border-slate-200 bg-orange-50">Sales</th>
                      <th colSpan={2} className="px-2 py-2 border-r border-slate-200">Waste</th>
                      <th colSpan={2} className="px-2 py-2 bg-emerald-50">Closing Stock</th>
                    </tr>
                    <tr className="border-b border-slate-200 text-[8px]">
                      <th className="px-2 py-2 border-r border-slate-200">Qty</th><th className="px-2 py-2 border-r border-slate-200">Price</th>
                      <th className="px-2 py-2 border-r border-slate-200">Qty</th><th className="px-2 py-2 border-r border-slate-200">Price</th>
                      <th className="px-2 py-2 border-r border-slate-200">Qty</th><th className="px-2 py-2 border-r border-slate-200">Price</th>
                      <th className="px-2 py-2 border-r border-slate-200">Qty</th><th className="px-2 py-2 border-r border-slate-200">Price</th>
                      <th className="px-2 py-2 border-r border-slate-200">Qty</th><th className="px-2 py-2 border-r border-slate-200">Price</th>
                      <th className="px-2 py-2 border-r border-slate-200">Qty</th><th className="px-2 py-2">Price</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {products.map(p => {
                      const sold = codes.filter(c => c.productId === p.id && c.status === 'Used').length;
                      const opening = p.openingStock || 100;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50">
                           <td className="px-4 py-6 font-black uppercase text-left border-r border-slate-200 text-slate-900">{p.name}</td>
                           <td className="px-2 py-4 border-r border-slate-200">{opening}</td><td className="px-2 py-4 border-r border-slate-200">${p.basePrice - 20}</td>
                           <td className="px-2 py-4 border-r border-slate-200">0</td><td className="px-2 py-4 border-r border-slate-200">-</td>
                           <td className="px-2 py-4 border-r border-slate-200 font-bold">{opening}</td><td className="px-2 py-4 border-r border-slate-200">-</td>
                           <td className="px-2 py-4 border-r border-slate-200 text-unicou-orange font-black">{sold}</td><td className="px-2 py-4 border-r border-slate-200">${p.basePrice}</td>
                           <td className="px-2 py-4 border-r border-slate-200 text-red-400">0</td><td className="px-2 py-4 border-r border-slate-200">-</td>
                           <td className="px-2 py-4 border-r border-slate-200 font-black text-emerald-600 bg-emerald-50">{opening - sold}</td><td className="px-2 py-4 bg-emerald-50">${p.basePrice}</td>
                        </tr>
                      );
                    })}
                 </tbody>
               </table>
             </div>
           )}

           {activeTab === 'sales' && (
             <div className="overflow-x-auto">
               <table className="w-full text-left text-[10px] font-bold uppercase">
                 <thead>
                   <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 tracking-widest">
                     <th className="px-6 py-5 text-center">Order No.</th>
                     <th className="px-6 py-5">Date/Time</th>
                     <th className="px-6 py-5">Buyer Name</th>
                     <th className="px-6 py-5">A/C ID</th>
                     <th className="px-6 py-5">Voucher Type</th>
                     <th className="px-6 py-5 text-center">Qty</th>
                     <th className="px-6 py-5">Paid Amt</th>
                     <th className="px-6 py-5">Delivery Time</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {orders.map(o => (
                      <tr key={o.id} className="hover:bg-slate-50">
                         <td className="px-6 py-5 font-mono text-unicou-navy text-center">{o.id}</td>
                         <td className="px-6 py-5 text-slate-400">{o.date} {o.time}</td>
                         <td className="px-6 py-5 text-slate-900 font-black">{o.buyerName}</td>
                         <td className="px-6 py-5 font-mono">****{o.bankLastFour}</td>
                         <td className="px-6 py-5 text-unicou-navy">{o.productName}</td>
                         <td className="px-6 py-5 text-center">{o.quantity}</td>
                         <td className="px-6 py-5 font-display text-slate-950">${o.totalAmount}</td>
                         <td className="px-6 py-5 font-mono text-emerald-600">{o.deliveryTime || 'Pending'}</td>
                      </tr>
                    ))}
                 </tbody>
               </table>
             </div>
           )}
      </div>
    </div>
  );
};

export default FinanceDashboard;
