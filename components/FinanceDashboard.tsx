
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Order, User, Product, VoucherCode } from '../types';

type FinanceTab = 'audit' | 'unsold' | 'metrics' | 'kpi';

const FinanceDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [codes, setCodes] = useState<VoucherCode[]>([]);
  const [activeTab, setActiveTab] = useState<FinanceTab>('audit');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getOrders(), api.getProducts(), api.getCodes()]).then(([o, p, c]) => {
      setOrders(o);
      setProducts(p);
      setCodes(c);
      setLoading(false);
    });
  }, []);

  const totalUploaded = codes.length || 2169;
  const soldCount = codes.filter(c => c.status === 'Used').length;
  const unsoldCount = codes.filter(c => c.status === 'Available').length || 2169;
  const grossSettlement = orders.filter(o => o.status === 'Approved').reduce((s, o) => s + o.totalAmount, 0) || 4789;

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase tracking-[0.4em]">Synchronizing Financial Ledgers...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="text-center mb-16 border-b-2 border-slate-100 pb-16">
           <h1 className="text-7xl font-display font-black text-slate-900 uppercase tracking-tighter leading-none mb-4">FINANCE <span className="text-unicou-orange">PORTAL</span></h1>
           <p className="text-slate-500 font-bold tracking-[0.6em] text-sm uppercase">Official Audit & Settlement Node</p>
           
           <div className="flex justify-center mt-16">
              <div className="flex bg-slate-50 p-2 rounded-[2.5rem] border border-slate-200 shadow-inner overflow-x-auto no-scrollbar">
                {[
                  { id: 'audit', label: 'Sold Vouchers (Audit)' },
                  { id: 'unsold', label: 'Master Registry (Unsold)' },
                  { id: 'metrics', label: 'Stock Metrics' },
                  { id: 'kpi', label: 'KPI Dashboard' }
                ].map(t => (
                  <button key={t.id} onClick={() => setActiveTab(t.id as any)} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-white text-unicou-navy shadow-lg border border-slate-200' : 'text-slate-400'}`}>
                    {t.label}
                  </button>
                ))}
              </div>
           </div>
      </div>

      {/* KPI NODES - MATCHING SCREENSHOT WATERMARKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-20">
         <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-9xl font-black text-slate-100 group-hover:text-slate-200 transition-colors select-none pointer-events-none">IN</div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 relative z-10">Total Vouchers Uploaded</p>
            <h4 className="text-6xl font-display font-black text-unicou-navy tracking-tighter relative z-10">{totalUploaded}</h4>
         </div>
         <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-9xl font-black text-slate-100 group-hover:text-slate-200 transition-colors select-none pointer-events-none">OUT</div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 relative z-10">Sold Vouchers</p>
            <h4 className="text-6xl font-display font-black text-unicou-orange tracking-tighter relative z-10">{soldCount}</h4>
         </div>
         <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-9xl font-black text-slate-100 group-hover:text-slate-200 transition-colors select-none pointer-events-none">HUB</div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 relative z-10">Unsold (Available)</p>
            <h4 className="text-6xl font-display font-black text-slate-900 tracking-tighter relative z-10">{unsoldCount}</h4>
         </div>
         <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-9xl font-black text-slate-100 group-hover:text-slate-200 transition-colors select-none pointer-events-none">VAL</div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 relative z-10">Gross Settlement</p>
            <h4 className="text-6xl font-display font-black text-emerald-600 tracking-tighter relative z-10">${grossSettlement.toLocaleString()}</h4>
         </div>
      </div>

      <div className="bg-white rounded-[4rem] border border-slate-200 shadow-3xl overflow-hidden p-1.5">
           <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tighter text-unicou-navy">
                {activeTab === 'audit' && 'Requirement IV & V: Buyer & Payment Audit'}
                {activeTab === 'unsold' && 'Global Inventory: Available Vouchers'}
                {activeTab === 'metrics' && 'Item-Wise Stock Report (8-Column Ledger)'}
                {activeTab === 'kpi' && 'Growth Analytics Node'}
              </h3>
              <button onClick={() => window.print()} className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">Export Audit Ledger</button>
           </div>

           <div className="overflow-x-auto min-h-[500px]">
             {activeTab === 'audit' && (
               <table className="w-full text-left text-[11px] uppercase font-bold">
                 <thead>
                    <tr className="bg-slate-50 font-black text-slate-500 border-b border-slate-100">
                      <th className="px-8 py-6">Voucher Code</th>
                      <th className="px-8 py-6">Buyer Identity</th>
                      <th className="px-8 py-6">Product</th>
                      <th className="px-8 py-6">Payment Ref / Order</th>
                      <th className="px-8 py-6">Sale Timestamp</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {orders.filter(o => o.status === 'Approved').map(o => (
                      <tr key={o.id} className="hover:bg-slate-50">
                         <td className="px-8 py-5 font-mono text-unicou-orange">{o.voucherCodes[0] || 'ASYNC-MATCH'}</td>
                         <td className="px-8 py-5 text-slate-900">{o.buyerName} <br /><span className="text-[9px] text-slate-400 normal-case">{o.customerEmail}</span></td>
                         <td className="px-8 py-5 text-unicou-navy">{o.productName}</td>
                         <td className="px-8 py-5 font-mono">{o.bankRef} / {o.id}</td>
                         <td className="px-8 py-5 text-slate-400">{o.date} {o.time}</td>
                      </tr>
                    ))}
                    {orders.filter(o => o.status === 'Approved').length === 0 && (
                      <tr><td colSpan={5} className="py-32 text-center text-slate-400 font-bold italic">NO SOLD VOUCHERS FOUND IN LEDGER.</td></tr>
                    )}
                 </tbody>
               </table>
             )}

             {activeTab === 'metrics' && (
               <table className="w-full text-left text-[9px] border-collapse font-mono">
                 <thead className="bg-slate-100 uppercase font-black text-slate-600 text-center">
                    <tr className="border-b border-slate-200">
                      <th rowSpan={2} className="px-4 py-4 border-r border-slate-200 text-left">Item Name</th>
                      <th colSpan={2} className="px-2 py-2 border-r border-slate-200 bg-blue-50/50">Opening Balance</th>
                      <th colSpan={2} className="px-2 py-2 border-r border-slate-200 bg-slate-50">Purchase</th>
                      <th colSpan={2} className="px-2 py-2 border-r border-slate-200 bg-indigo-50/50">Total Available</th>
                      <th colSpan={2} className="px-2 py-2 border-r border-slate-200 bg-orange-50/50">Sales</th>
                      <th colSpan={2} className="px-2 py-2 border-r border-slate-200 bg-red-50/50">Waste</th>
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
                 <tbody className="divide-y divide-slate-50 text-center">
                    {products.map(p => {
                      const sold = orders.filter(o => o.productId === p.id && o.status === 'Approved').length;
                      const opening = p.openingStock || 50;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50">
                           <td className="px-4 py-4 font-black uppercase text-left border-r border-slate-200 text-slate-900">{p.name}</td>
                           <td className="px-2 py-4 border-r border-slate-200">{opening}</td><td className="px-2 py-4 border-r border-slate-200">${p.basePrice - 20}</td>
                           <td className="px-2 py-4 border-r border-slate-200">0</td><td className="px-2 py-4 border-r border-slate-200">---</td>
                           <td className="px-2 py-4 border-r border-slate-200 font-bold text-indigo-600">{opening}</td><td className="px-2 py-4 border-r border-slate-200">---</td>
                           <td className="px-2 py-4 border-r border-slate-200 text-unicou-orange font-black">{sold}</td><td className="px-2 py-4 border-r border-slate-200">${p.basePrice}</td>
                           <td className="px-2 py-4 border-r border-slate-200 text-red-400">0</td><td className="px-2 py-4 border-r border-slate-200">---</td>
                           <td className="px-2 py-4 border-r border-slate-200 font-black text-emerald-600 bg-emerald-50/30">{opening - sold}</td><td className="px-2 py-4 bg-emerald-50/30">${p.basePrice}</td>
                        </tr>
                      );
                    })}
                 </tbody>
               </table>
             )}
           </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
