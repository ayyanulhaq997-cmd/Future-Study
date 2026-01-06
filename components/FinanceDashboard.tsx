
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Order, User } from '../types';

type FinanceTab = 'stock' | 'purchase' | 'sales' | 'ledgers' | 'banks';

const FinanceDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<FinanceTab>('stock');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrders().then(o => {
      setOrders(o);
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
           {(['stock', 'purchase', 'sales', 'ledgers', 'banks'] as FinanceTab[]).map(t => (
             <button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white text-unicou-navy shadow-lg border border-slate-200' : 'text-slate-400'}`}>{t}</button>
           ))}
        </div>
      </div>

      {activeTab === 'stock' && (
        <div className="animate-in fade-in duration-500 bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
          <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
             <h3 className="text-lg font-display font-black uppercase">I. Stock Reports Item Wise</h3>
             <div className="flex gap-4">
                <input type="date" className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-[10px] uppercase" />
                <input type="date" className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-[10px] uppercase" />
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-50 font-black uppercase text-slate-500 tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Currency</th>
                  <th className="px-6 py-4">Item Node</th>
                  <th className="px-6 py-4 bg-blue-50/50">Opening Bal (Qty/Price)</th>
                  <th className="px-6 py-4">Purchase (Qty/Price)</th>
                  <th className="px-6 py-4 font-black text-unicou-navy">Total Available</th>
                  <th className="px-6 py-4 bg-orange-50/50">Sales (Qty/Price)</th>
                  <th className="px-6 py-4">Waste/Expired</th>
                  <th className="px-6 py-4 bg-emerald-50 text-emerald-700">Closing Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {['PTE Academic', 'IELTS Global', 'TOEFL iBT'].map(item => (
                  <tr key={item} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-black">USD</td>
                    <td className="px-6 py-4 font-black uppercase text-slate-900">{item}</td>
                    <td className="px-6 py-4 text-slate-500 italic">150 / $140</td>
                    <td className="px-6 py-4">50 / $135</td>
                    <td className="px-6 py-4 font-black text-unicou-navy">200 Units</td>
                    <td className="px-6 py-4 text-unicou-orange font-bold">45 / $165</td>
                    <td className="px-6 py-4 text-red-400">0</td>
                    <td className="px-6 py-4 font-black text-emerald-600 bg-emerald-50/30">155 Units</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'purchase' && (
        <div className="animate-in fade-in duration-500 bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
          <div className="p-8 bg-slate-900 text-white"><h3 className="text-lg font-display font-black uppercase">ii. Purchase Register</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[10px]">
              <thead className="bg-slate-50 font-black uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Inv No.</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Expiry</th>
                  <th className="px-6 py-4">Seller Name</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Qty</th>
                  <th className="px-6 py-4">Curr</th>
                  <th className="px-6 py-4">Value Ex. Tax</th>
                  <th className="px-6 py-4">Taxes</th>
                  <th className="px-6 py-4 font-black text-slate-900">Value In. Tax</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold text-slate-600 uppercase">
                 <tr>
                    <td className="px-6 py-4 font-mono">PUR-9901</td>
                    <td className="px-6 py-4">01/03/25</td>
                    <td className="px-6 py-4">01/03/26</td>
                    <td className="px-6 py-4">Pearson Global</td>
                    <td className="px-6 py-4">PTE Vouchers</td>
                    <td className="px-6 py-4">100</td>
                    <td className="px-6 py-4">USD</td>
                    <td className="px-6 py-4">$13,500</td>
                    <td className="px-6 py-4">$0.00</td>
                    <td className="px-6 py-4 text-slate-950">$13,500.00</td>
                 </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'sales' && (
        <div className="animate-in fade-in duration-500 bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
          <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
             <h3 className="text-lg font-display font-black uppercase">v. Sales Register (Authorized Ledger)</h3>
             <button onClick={() => window.print()} className="px-6 py-2 bg-white/10 rounded-xl text-[9px] font-black uppercase">Export Ledger</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[10px]">
              <thead className="bg-slate-50 font-black uppercase text-slate-500 tracking-wider">
                <tr>
                  <th className="px-4 py-4">Order No.</th>
                  <th className="px-4 py-4">Date</th>
                  <th className="px-4 py-4">Time</th>
                  <th className="px-4 py-4">Buyer Name</th>
                  <th className="px-4 py-4">Bank A/C (4)</th>
                  <th className="px-4 py-4">Voucher Type</th>
                  <th className="px-4 py-4">Qty</th>
                  <th className="px-4 py-4">Curr</th>
                  <th className="px-4 py-4">Paid Amt</th>
                  <th className="px-4 py-4">Agent Name</th>
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
                    <td className="px-4 py-4">{o.quantity}</td>
                    <td className="px-4 py-4">{o.currency}</td>
                    <td className="px-4 py-4 font-display font-black text-slate-950">${o.totalAmount}</td>
                    <td className="px-4 py-4 text-unicou-navy italic">{o.supportAgentName || 'System'}</td>
                    <td className="px-4 py-4 font-mono text-emerald-600">{o.deliveryTime || '---'}</td>
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
           <p className="text-slate-400 font-bold italic mt-2">"Real-time sync with clearing house authorized."</p>
        </div>
      )}
    </div>
  );
};

export default FinanceDashboard;
