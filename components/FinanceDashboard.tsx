import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Order, User, Product } from '../types';

type FinanceTab = 'stock' | 'purchase' | 'party' | 'sales' | 'banks';

const FinanceDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<FinanceTab>('stock');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getOrders(), api.getProducts()]).then(([o, p]) => {
      setOrders(o);
      setProducts(p);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase tracking-[0.4em]">Synchronizing Financial Ledgers...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="flex flex-col xl:flex-row justify-between items-end gap-8 mb-12 border-b-2 border-slate-100 pb-12">
        <div>
           <h1 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">FINANCE <span className="text-unicou-orange">LEDGER</span></h1>
           <p className="text-slate-500 font-bold italic text-lg leading-relaxed">Official Finance Team Terminal • Protocol V4.1</p>
        </div>
        <div className="flex bg-slate-50 p-1.5 rounded-[2rem] border border-slate-200 shadow-inner">
           {(['stock', 'purchase', 'party', 'sales', 'banks'] as FinanceTab[]).map(t => (
             <button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white text-unicou-navy shadow-lg border border-slate-200' : 'text-slate-400'}`}>{t === 'party' ? 'Seller Ledger' : t}</button>
           ))}
        </div>
      </div>

      {activeTab === 'stock' && (
        <div className="animate-in fade-in duration-500 bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
          <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
             <h3 className="text-lg font-display font-black uppercase">I. Stock reports Item wise (Consolidated)</h3>
             <div className="flex gap-4">
                <input type="date" className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-[10px] uppercase" />
                <input type="date" className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-[10px] uppercase" />
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[10px] border-collapse">
              <thead className="bg-slate-50 font-black uppercase text-slate-500 tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-4 border-r border-slate-200">Currency</th>
                  <th className="px-4 py-4 border-r border-slate-200">Item Name</th>
                  <th colSpan={2} className="px-4 py-4 text-center bg-blue-50 border-r border-slate-200">Opening Balance</th>
                  <th colSpan={2} className="px-4 py-4 text-center bg-slate-100 border-r border-slate-200">Purchase</th>
                  <th colSpan={2} className="px-4 py-4 text-center bg-unicou-navy/5 border-r border-slate-200">Total Available</th>
                  <th colSpan={2} className="px-4 py-4 text-center bg-orange-50 border-r border-slate-200">Sales</th>
                  <th colSpan={2} className="px-4 py-4 text-center bg-red-50 border-r border-slate-200">Waste</th>
                  <th colSpan={2} className="px-4 py-4 text-center bg-emerald-50 text-emerald-700">Closing Stock</th>
                </tr>
                <tr className="bg-slate-100/50 text-[8px]">
                  <th className="px-4 py-2 border-r border-slate-200"></th>
                  <th className="px-4 py-2 border-r border-slate-200"></th>
                  <th className="px-4 py-2 text-center border-r border-slate-200">Qty</th><th className="px-4 py-2 text-center border-r border-slate-200">Price</th>
                  <th className="px-4 py-2 text-center border-r border-slate-200">Qty</th><th className="px-4 py-2 text-center border-r border-slate-200">Price</th>
                  <th className="px-4 py-2 text-center border-r border-slate-200">Qty</th><th className="px-4 py-2 text-center border-r border-slate-200">Price</th>
                  <th className="px-4 py-2 text-center border-r border-slate-200">Qty</th><th className="px-4 py-2 text-center border-r border-slate-200">Price</th>
                  <th className="px-4 py-2 text-center border-r border-slate-200">Qty</th><th className="px-4 py-2 text-center border-r border-slate-200">Price</th>
                  <th className="px-4 py-2 text-center border-r border-slate-200">Qty</th><th className="px-4 py-2 text-center">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-center">
                {products.filter(p => p.type === 'Voucher').map(p => {
                  const sold = orders.filter(o => o.productId === p.id && o.status === 'Approved').length;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-black border-r border-slate-200">{p.currency}</td>
                      <td className="px-4 py-4 font-black uppercase text-slate-900 border-r border-slate-200 text-left">{p.name}</td>
                      <td className="px-2 py-4 border-r border-slate-200 italic">50</td><td className="px-2 py-4 border-r border-slate-200 text-slate-400">${p.basePrice - 20}</td>
                      <td className="px-2 py-4 border-r border-slate-200">20</td><td className="px-2 py-4 border-r border-slate-200 text-slate-400">${p.basePrice - 15}</td>
                      <td className="px-2 py-4 font-black text-unicou-navy border-r border-slate-200">70</td><td className="px-2 py-4 border-r border-slate-200 text-slate-400">---</td>
                      <td className="px-2 py-4 text-unicou-orange font-bold border-r border-slate-200">{sold}</td><td className="px-2 py-4 border-r border-slate-200 text-slate-400">${p.basePrice}</td>
                      <td className="px-2 py-4 border-r border-slate-200">0</td><td className="px-2 py-4 border-r border-slate-200 text-slate-400">---</td>
                      <td className="px-2 py-4 font-black text-emerald-600 bg-emerald-50/30 border-r border-slate-200">{70 - sold}</td><td className="px-2 py-4 bg-emerald-50/30">${p.basePrice}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'purchase' && (
        <div className="animate-in fade-in duration-500 bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
          <div className="p-8 bg-slate-900 text-white"><h3 className="text-lg font-display font-black uppercase">ii. Purchase Register / iii. Item Ledger</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[10px]">
              <thead className="bg-slate-50 font-black uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="px-4 py-4">Invoice No.</th>
                  <th className="px-4 py-4">Inv Date</th>
                  <th className="px-4 py-4">Expiry Date</th>
                  <th className="px-4 py-4">Seller Name</th>
                  <th className="px-4 py-4">Vouchers Description</th>
                  <th className="px-4 py-4">Qty</th>
                  <th className="px-4 py-4">Curr</th>
                  <th className="px-4 py-4">Value Ex. Tax</th>
                  <th className="px-4 py-4">Taxes</th>
                  <th className="px-4 py-4 font-black text-slate-900">Value In. Tax</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold text-slate-600 uppercase">
                 <tr>
                    <td className="px-4 py-4 font-mono">PUR-SYNC-001</td>
                    <td className="px-4 py-4">12/03/2025</td>
                    <td className="px-4 py-4">12/03/2026</td>
                    <td className="px-4 py-4 text-unicou-navy">British Council Global</td>
                    <td className="px-4 py-4">IELTS Academic UKVI Bulk Node</td>
                    <td className="px-4 py-4">250</td>
                    <td className="px-4 py-4">GBP</td>
                    <td className="px-4 py-4">£32,500.00</td>
                    <td className="px-4 py-4">£0.00</td>
                    <td className="px-4 py-4 text-slate-950 font-black">£32,500.00</td>
                 </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'party' && (
        <div className="animate-in fade-in duration-500 bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
          <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
             <h3 className="text-lg font-display font-black uppercase">iv. Party Ledger (Purchase Report Seller Wise)</h3>
             <select className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-[10px] uppercase font-black">
                <option className="bg-slate-900">All Parties</option>
                <option className="bg-slate-900">Pearson Global</option>
                <option className="bg-slate-900">British Council</option>
             </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[10px]">
              <thead className="bg-slate-50 font-black uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-4">Inv No.</th>
                  <th className="px-4 py-4">Inv Date</th>
                  <th className="px-4 py-4">Description</th>
                  <th className="px-4 py-4">Qty</th>
                  <th className="px-4 py-4">Curr</th>
                  <th className="px-4 py-4">Value Ex. Tax</th>
                  <th className="px-4 py-4">Taxes</th>
                  <th className="px-4 py-4 font-black">Net Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 uppercase italic">
                 <tr className="bg-slate-50/30">
                    <td colSpan={8} className="px-4 py-2 font-black text-unicou-navy bg-slate-100">SELLER: PEARSON EDUCATION LTD</td>
                 </tr>
                 <tr>
                    <td className="px-4 py-4 font-mono">PUR-9921</td>
                    <td className="px-4 py-4">10/02/25</td>
                    <td className="px-4 py-4">PTE Vouchers</td>
                    <td className="px-4 py-4">100</td>
                    <td className="px-4 py-4">USD</td>
                    <td className="px-4 py-4">$13,500</td>
                    <td className="px-4 py-4">$0</td>
                    <td className="px-4 py-4 font-black">$13,500</td>
                 </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'sales' && (
        <div className="animate-in fade-in duration-500 bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
          <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
             <h3 className="text-lg font-display font-black uppercase">v. Sales Register / vi. Item Ledger / vii. Buyer's Ledger</h3>
             <button onClick={() => window.print()} className="px-6 py-2 bg-white/10 rounded-xl text-[9px] font-black uppercase">Download Master Ledger</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[10px]">
              <thead className="bg-slate-50 font-black uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="px-4 py-4">Order No.</th>
                  <th className="px-4 py-4">Order Date</th>
                  <th className="px-4 py-4">Order Time</th>
                  <th className="px-4 py-4">Buyer Name</th>
                  <th className="px-4 py-4">Bank A/C (4)</th>
                  <th className="px-4 py-4">Voucher Type</th>
                  <th className="px-4 py-4">Qty</th>
                  <th className="px-4 py-4">Curr</th>
                  <th className="px-4 py-4">Paid Amount</th>
                  <th className="px-4 py-4">Support Agent</th>
                  <th className="px-4 py-4">Delivery Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 uppercase">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50 font-bold text-slate-600">
                    <td className="px-4 py-4 font-mono text-unicou-navy">{o.id}</td>
                    <td className="px-4 py-4 font-mono">{o.date}</td>
                    <td className="px-4 py-4 font-mono">{o.time}</td>
                    <td className="px-4 py-4 font-black text-slate-900 truncate max-w-[100px]">{o.buyerName}</td>
                    <td className="px-4 py-4 font-mono">****{o.bankLastFour}</td>
                    <td className="px-4 py-4 truncate max-w-[100px]">{o.productName}</td>
                    <td className="px-4 py-4 text-center">{o.quantity}</td>
                    <td className="px-4 py-4">{o.currency}</td>
                    <td className="px-4 py-4 font-display font-black text-slate-950">${o.totalAmount}</td>
                    <td className="px-4 py-4 text-unicou-navy italic">{o.supportAgentName || 'Auto-Node'}</td>
                    <td className="px-4 py-4 font-mono text-emerald-600">{o.deliveryTime || 'PENDING'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'banks' && (
        <div className="animate-in fade-in duration-500 p-20 text-center bg-slate-50 rounded-[4rem] border border-dashed border-slate-200">
           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl text-3xl">🏦</div>
           <h3 className="text-2xl font-black text-unicou-navy uppercase">viii. Banks Ledgers</h3>
           <p className="text-slate-400 font-bold italic mt-2 italic">"Consolidating payments from global merchant nodes (UAE, UK, PK)."</p>
        </div>
      )}
    </div>
  );
};

export default FinanceDashboard;