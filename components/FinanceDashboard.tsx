
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/apiService';
import { FinanceReport, User, VoucherCode, Product } from '../types';

type ReportCategory = 'sales' | 'inventory' | 'agents' | 'fraud';

const FinanceDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [report, setReport] = useState<FinanceReport | null>(null);
  const [codes, setCodes] = useState<VoucherCode[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ReportCategory>('sales');
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      const [r, c, p] = await Promise.all([api.getFinanceReport(), api.getCodes(), api.getProducts()]);
      setReport(r); setCodes(c); setProducts(p);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // CSV EXPORT ENGINE
  const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).map(v => `"${v}"`).join(','));
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSalesData = () => (report?.recentSales || []).map(o => {
    const d = new Date(o.timestamp);
    return {
      Number: o.id, 
      Date: d.toLocaleDateString(), 
      Time: d.toLocaleTimeString(),
      Buyer: o.buyerName, 
      Product: o.productName, 
      Amount: o.totalAmount, 
      Reference: o.bankRef,
      Proof: o.proofAttached ? 'Attached' : 'Missing'
    };
  });

  const getInventoryData = () => codes.map(c => ({
    Code: c.code, Product: products.find(p => p.id === c.productId)?.name || 'Voucher', Status: c.status, OrderID: c.orderId || 'Unassigned'
  }));

  if (loading) return <div className="p-40 text-center animate-pulse text-[#004a61] font-black uppercase text-[11px] tracking-[0.4em]">Synchronizing BI Node...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 bg-white min-h-screen printable-area">
      <div className="flex flex-col xl:flex-row justify-between items-start gap-10 mb-12 border-b-2 border-slate-100 pb-12 print:border-black print:mb-8 print:pb-6">
        <div>
           <h1 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter leading-none mb-2 print:text-3xl">FINANCIAL <span className="text-[#f15a24]">PORTAL</span></h1>
           <p className="text-slate-500 font-bold italic text-lg leading-relaxed print:text-sm print:not-italic">Authenticated records for UniCou Ltd. Report Generated: {new Date().toLocaleString()}</p>
        </div>
        <div className="flex gap-2 print:hidden">
          {(['sales', 'inventory', 'agents', 'fraud'] as ReportCategory[]).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === t ? 'bg-[#004a61] text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 print:grid-cols-4 print:mb-8">
         <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 print:p-4 print:border-black">
            <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Gross Revenue</p>
            <p className="text-3xl font-display font-black text-[#004a61]">${report?.totalRevenue.toLocaleString()}</p>
         </div>
         <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 print:p-4 print:border-black">
            <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Total Sold</p>
            <p className="text-3xl font-display font-black text-slate-900">{report?.totalVouchersSold} Units</p>
         </div>
      </div>

      <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl overflow-hidden print:shadow-none print:border-none">
        <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center print:hidden">
           <div className="flex items-center gap-4">
             <input type="text" placeholder="Filter records..." className="bg-white border p-3 rounded-xl text-xs font-bold" value={search} onChange={e => setSearch(e.target.value)} />
           </div>
           <div className="flex gap-4">
             <button onClick={() => downloadCSV(activeTab === 'sales' ? getSalesData() : getInventoryData(), `UniCou_${activeTab}_Report`)} className="px-6 py-3 bg-white border border-slate-200 text-[#004a61] rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-[#004a61] hover:text-white transition-all">Download CSV</button>
             <button onClick={() => window.print()} className="px-6 py-3 bg-[#004a61] text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-black transition-all shadow-xl">Generate PDF Report</button>
           </div>
        </div>

        <div className="p-10">
           {activeTab === 'sales' && (
             <div className="overflow-x-auto">
               <table className="w-full text-left report-table">
                 <thead className="bg-slate-900 text-white print:bg-black">
                   <tr className="text-[9px] font-black uppercase tracking-widest">
                     <th className="px-4 py-5">I. Number</th>
                     <th className="px-4 py-5">II. Date</th>
                     <th className="px-4 py-5">III. Time</th>
                     <th className="px-4 py-5">IV. Buyer</th>
                     <th className="px-4 py-5">V. Product</th>
                     <th className="px-4 py-5">VI. Amount</th>
                     <th className="px-4 py-5">VII. Reference</th>
                     <th className="px-4 py-5 text-right">VIII. Proof</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 print:divide-black">
                   {report?.recentSales.filter(o => o.id.includes(search.toUpperCase())).map(o => {
                     const d = new Date(o.timestamp);
                     return (
                      <tr key={o.id}>
                        <td className="px-4 py-5 font-mono font-black text-[#004a61] text-[10px] print:text-black">{o.id}</td>
                        <td className="px-4 py-5 font-mono text-[10px] text-slate-500">{d.toLocaleDateString()}</td>
                        <td className="px-4 py-5 font-mono text-[10px] text-slate-500">{d.toLocaleTimeString()}</td>
                        <td className="px-4 py-5 font-black text-[10px] uppercase truncate max-w-[120px]">{o.buyerName}</td>
                        <td className="px-4 py-5 font-black text-[10px] uppercase">{o.productName}</td>
                        <td className="px-4 py-5 font-display font-black text-base">${o.totalAmount}</td>
                        <td className="px-4 py-5 font-mono text-slate-400 text-[9px] truncate max-w-[100px]">{o.bankRef}</td>
                        <td className="px-4 py-5 text-right">
                          <span className={`px-2 py-1 rounded text-[8px] font-black uppercase ${o.proofAttached ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            {o.proofAttached ? 'VERIFIED' : 'MISSING'}
                          </span>
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

      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          .printable-area { width: 100% !important; padding: 0 !important; }
          .report-table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          .report-table th, .report-table td { border: 1px solid #000 !important; padding: 10px !important; }
          h1, h2, h3, p { color: black !important; }
          .bg-slate-50 { background: white !important; border: 1px solid black !important; }
        }
      `}</style>
    </div>
  );
};

export default FinanceDashboard;
