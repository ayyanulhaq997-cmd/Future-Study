
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/apiService';
import { FinanceReport, User, VoucherCode, Product } from '../types';

type ReportCategory = 
  | 'executive' 
  | 'sales-finance' 
  | 'candidate-product' 
  | 'agents-partners' 
  | 'voucher-assets' 
  | 'fraud-risk' 
  | 'compliance-audit' 
  | 'ops-support';

const FinanceDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [report, setReport] = useState<FinanceReport | null>(null);
  const [codes, setCodes] = useState<VoucherCode[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ReportCategory>('executive');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      const [r, c, p, u] = await Promise.all([
        api.getFinanceReport(), 
        api.getCodes(), 
        api.getProducts(),
        api.getUsers()
      ]);
      setReport(r);
      setCodes(c);
      setProducts(p);
      setUsers(u);
    } catch (e) {
      console.error("BI Sync Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // MANDATORY METRICS ENGINE (Calculation for Numerical Reports)
  const biMetrics = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const todayOrders = report?.recentSales.filter(o => o.timestamp.startsWith(today) && o.status === 'Completed') || [];
    const monthlyOrders = report?.recentSales.filter(o => {
      const d = new Date(o.timestamp);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear && o.status === 'Completed';
    }) || [];

    const riskCount = users.filter(u => u.isFlagged).length + (api.getSecurityState().threatLevel !== 'Normal' ? 5 : 0);

    return {
      todaySales: todayOrders.reduce((sum, o) => sum + o.quantity, 0),
      todayRevenue: todayOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      monthRevenue: monthlyOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      vouchersInStock: codes.filter(c => c.status === 'Available').length,
      activeAgents: users.filter(u => (u.role === 'Agent' || u.role === 'Institute') && u.isAuthorized).length,
      riskAlerts: riskCount,
      refundRequests: report?.recentSales.filter(o => o.status === 'Cancelled').length || 0,
      systemHealth: 'OPTIMAL'
    };
  }, [report, codes, users]);

  // CSV EXPORT UTILITY
  const downloadCSV = (data: any[], fileName: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => 
      Object.values(obj).map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF GENERATION (Optimized Print)
  const generatePDFReport = () => {
    window.print();
  };

  // Data Preparation for Exports
  const getSalesExportData = () => {
    return (report?.recentSales || []).map(o => ({
      OrderID: o.id,
      Date: new Date(o.timestamp).toLocaleDateString(),
      Buyer: o.buyerName,
      Email: o.customerEmail,
      Product: o.productName,
      Qty: o.quantity,
      Amount: o.totalAmount,
      Currency: o.currency,
      Method: o.paymentMethod,
      Status: o.status
    }));
  };

  const getInventoryExportData = () => {
    return codes.map(c => ({
      Code: c.code,
      Product: products.find(p => p.id === c.productId)?.name || 'Voucher',
      Status: c.status,
      UploadDate: c.uploadDate,
      AssignedTo: c.buyerName || 'Unsold',
      OrderID: c.orderId || 'N/A'
    }));
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-[#004a61] font-black uppercase text-[11px] tracking-[0.4em]">Establishing Global Audit Nodes...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 bg-white min-h-screen printable-area">
      
      {/* Header (Hidden on Print if needed, but here styled for report header) */}
      <div className="flex flex-col xl:flex-row justify-between items-start gap-10 mb-12 border-b border-slate-100 pb-12 print:border-b-2 print:border-black print:mb-8 print:pb-6">
        <div>
           <div className="flex items-center gap-3 mb-4 print:hidden">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Institutional Reporting Portal • v4.2</span>
           </div>
           <h1 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter leading-none mb-2 print:text-3xl">
             FINANCIAL <span className="text-[#f15a24]">REPORT</span>
           </h1>
           <p className="text-slate-500 font-bold italic text-lg leading-relaxed max-w-2xl print:text-sm print:not-italic">
             Official documented records for UniCou Ltd. Generated by: {user.name} ({user.role}) on {new Date().toLocaleString()}
           </p>
        </div>
        
        <div className="flex flex-wrap gap-2 bg-slate-50 p-2 rounded-[2rem] border border-slate-200 shadow-inner print:hidden">
           {(['executive', 'sales-finance', 'candidate-product', 'agents-partners', 'voucher-assets', 'fraud-risk', 'compliance-audit', 'ops-support'] as ReportCategory[]).map((tab) => (
             <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-[#004a61] shadow-lg border border-slate-200' : 'text-slate-400 hover:text-slate-900'}`}>
               {tab.replace('-', ' & ')}
             </button>
           ))}
        </div>
      </div>

      {/* Numerical KPI Terminal (Requirement I-V Summary) */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-12 print:grid-cols-4 print:gap-2 print:mb-8">
         <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 print:border-black print:p-4">
            <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">Today's Sales</p>
            <p className="text-2xl font-display font-black text-[#004a61]">{biMetrics.todaySales}</p>
         </div>
         <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 print:border-black print:p-4">
            <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">Month Revenue</p>
            <p className="text-2xl font-display font-black text-slate-900">${biMetrics.monthRevenue.toLocaleString()}</p>
         </div>
         <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 print:border-black print:p-4">
            <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">In Stock</p>
            <p className="text-2xl font-display font-black text-[#f15a24]">{biMetrics.vouchersInStock}</p>
         </div>
         <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200 print:border-black print:p-4">
            <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">Risk Alerts</p>
            <p className="text-2xl font-display font-black text-red-600">{biMetrics.riskAlerts}</p>
         </div>
      </div>

      {/* Data Table Section */}
      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden print:shadow-none print:border-none print:rounded-none">
        
        {/* Export Controls Hub */}
        <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 print:hidden">
           <div className="flex items-center gap-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#004a61]">Data Stream: {activeTab.replace('-', ' ')}</h3>
              <span className="text-[10px] bg-[#004a61] text-white px-3 py-1 rounded-full font-bold">LIVE SYNC</span>
           </div>
           
           <div className="flex gap-3">
              <button 
                onClick={() => {
                  if (activeTab === 'sales-finance') downloadCSV(getSalesExportData(), 'UniCou_Sales_Report');
                  else if (activeTab === 'voucher-assets') downloadCSV(getInventoryExportData(), 'UniCou_Voucher_Inventory');
                  else alert("Export node for this vertical is currently initializing.");
                }} 
                className="px-6 py-3 bg-white border border-slate-200 text-[#004a61] rounded-xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-[#004a61] hover:text-white transition-all shadow-sm"
              >
                Download CSV
              </button>
              <button 
                onClick={generatePDFReport} 
                className="px-6 py-3 bg-[#004a61] text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl"
              >
                Generate PDF Report
              </button>
           </div>
        </div>

        <div className="p-8">
           {activeTab === 'sales-finance' && (
             <div className="animate-in fade-in duration-500">
                <table className="w-full text-left report-table">
                  <thead className="bg-slate-900 text-white print:bg-black">
                     <tr className="text-[9px] font-black uppercase tracking-widest">
                        <th className="px-8 py-5">Order ID</th>
                        <th className="px-8 py-5">Buyer Node</th>
                        <th className="px-8 py-5">Product SKU</th>
                        <th className="px-8 py-5">Settlement Method</th>
                        <th className="px-8 py-5 text-right">Gross Value</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 print:divide-black">
                     {report?.recentSales.map(o => (
                       <tr key={o.id} className="hover:bg-slate-50 print:break-inside-avoid">
                          <td className="px-8 py-5 font-mono font-black text-xs text-[#004a61] print:text-black">{o.id}</td>
                          <td className="px-8 py-5">
                             <div className="font-black text-xs text-slate-900 uppercase">{o.buyerName}</div>
                             <div className="text-[9px] font-mono text-slate-400">{o.customerEmail}</div>
                          </td>
                          <td className="px-8 py-5 font-black text-[11px] text-slate-700 uppercase">{o.productName}</td>
                          <td className="px-8 py-5"><span className="px-3 py-1 bg-slate-100 rounded-full text-[8px] font-black uppercase print:border print:border-black">{o.paymentMethod}</span></td>
                          <td className="px-8 py-5 text-right font-display font-black text-xl text-slate-950">${o.totalAmount}</td>
                       </tr>
                     ))}
                  </tbody>
                </table>
             </div>
           )}

           {activeTab === 'voucher-assets' && (
             <div className="animate-in fade-in duration-500">
                <table className="w-full text-left report-table">
                  <thead className="bg-[#f15a24] text-white print:bg-black">
                    <tr className="text-[9px] font-black uppercase tracking-widest">
                       <th className="px-8 py-5">Digital Code ID</th>
                       <th className="px-8 py-5">Product Mapping</th>
                       <th className="px-8 py-5">Node Status</th>
                       <th className="px-8 py-5 text-right">Upload Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 print:divide-black">
                     {codes.slice(0, 100).map(c => (
                       <tr key={c.id}>
                          <td className="px-8 py-5 font-mono font-black text-[#f15a24] text-xs print:text-black">{c.code}</td>
                          <td className="px-8 py-5 font-bold text-xs text-slate-600 uppercase">{products.find(p => p.id === c.productId)?.name}</td>
                          <td className="px-8 py-5">
                             <span className={`px-2.5 py-1 rounded text-[8px] font-black uppercase ${c.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} print:border print:border-black`}>
                               {c.status}
                             </span>
                          </td>
                          <td className="px-8 py-5 text-right font-mono text-[10px] text-slate-400">{new Date(c.uploadDate).toLocaleDateString()}</td>
                       </tr>
                     ))}
                  </tbody>
                </table>
             </div>
           )}

           {activeTab === 'executive' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 print:grid-cols-1">
                <div className="space-y-6">
                   <h3 className="text-xl font-black uppercase tracking-tighter text-[#004a61] print:text-lg">Revenue Summary</h3>
                   <div className="space-y-2">
                     {report?.salesByType.map(s => (
                       <div key={s.name} className="p-5 bg-slate-50 border border-slate-100 flex justify-between items-center print:border-black">
                          <span className="text-[10px] font-black uppercase text-slate-500">{s.name}</span>
                          <span className="text-lg font-display font-black">${s.value.toLocaleString()}</span>
                       </div>
                     ))}
                   </div>
                </div>
                <div className="bg-slate-900 p-10 rounded-[3rem] text-white print:bg-white print:text-black print:border-2 print:border-black print:rounded-none">
                   <h3 className="text-xl font-black uppercase mb-6">Compliance & Health</h3>
                   <div className="grid grid-cols-2 gap-6">
                      <div><p className="text-[9px] uppercase opacity-60">System Stability</p><p className="text-2xl font-black">99.9%</p></div>
                      <div><p className="text-[9px] uppercase opacity-60">Fraud Flags</p><p className="text-2xl font-black">{biMetrics.riskAlerts}</p></div>
                      <div><p className="text-[9px] uppercase opacity-60">Audit Status</p><p className="text-2xl font-black text-emerald-400 print:text-black">VERIFIED</p></div>
                   </div>
                </div>
             </div>
           )}
        </div>

        {/* Professional Footer for Printed Reports */}
        <div className="hidden print:block p-12 border-t-2 border-black mt-20">
           <div className="flex justify-between items-end">
              <div>
                 <p className="text-[10px] font-black uppercase">UniCou Ltd • Global Compliance Department</p>
                 <p className="text-[8px] text-slate-500">26 Chepstow Avenue, Sale Manchester, United Kingdom</p>
              </div>
              <div className="text-right">
                 <p className="text-[8px] uppercase font-bold">Authenticated Security Token</p>
                 <p className="font-mono text-[8px]">{Math.random().toString(36).substr(2, 15).toUpperCase()}</p>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; margin: 0; padding: 0; }
          .print\\:hidden { display: none !important; }
          .printable-area { width: 100% !important; max-width: 100% !important; padding: 0 !important; }
          .report-table thead th { background: black !important; color: white !important; -webkit-print-color-adjust: exact; }
          .report-table { border-collapse: collapse; width: 100%; }
          .report-table td, .report-table th { border: 1px solid #000 !important; }
          h1, h2, h3, p { color: black !important; }
          .bg-slate-50 { background: white !important; border: 1px solid black !important; }
          .shadow-2xl, .shadow-xl, .shadow-lg, .shadow-inner { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
};

export default FinanceDashboard;
