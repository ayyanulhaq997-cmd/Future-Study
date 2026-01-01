
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/apiService';
import { FinanceReport, User, Order, VoucherCode, Product } from '../types';

type FinanceTab = 'audit-ledger' | 'stock-report' | 'performance-metrics' | 'search-vault';

const FinanceDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [report, setReport] = useState<FinanceReport | null>(null);
  const [codes, setCodes] = useState<VoucherCode[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FinanceTab>('audit-ledger');

  // Filters
  const [filterType, setFilterType] = useState('ALL');
  const [filterBuyer, setFilterBuyer] = useState('');
  const [filterSalesExec, setFilterSalesExec] = useState('');
  const [filterCodeSearch, setFilterCodeSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchData = async () => {
    try {
      const [r, c, p] = await Promise.all([api.getFinanceReport(), api.getCodes(), api.getProducts()]);
      setReport(r);
      setCodes(c);
      setProducts(p);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Stock Report Engine
  const stockReport = useMemo(() => {
    return products.filter(p => p.type === 'Voucher').map(p => {
      const relevantCodes = codes.filter(c => c.productId === p.id);
      const sold = relevantCodes.filter(c => c.status === 'Used').length;
      const available = relevantCodes.filter(c => c.status === 'Available').length;
      const expired = relevantCodes.filter(c => c.status === 'Expired').length;
      // For demo, opening stock = current total
      const total = relevantCodes.length;
      return {
        id: p.id,
        name: p.name,
        opening: total, 
        purchased: 0, // In real DB, tracked by stock entry logs
        sold,
        expired,
        closing: available
      };
    });
  }, [codes, products]);

  // Master Audit Ledger Engine
  const auditLedger = useMemo(() => {
    return codes.filter(c => c.status === 'Used').map(code => {
      const order = report?.recentSales.find(o => o.id === code.orderId);
      return {
        uploadDate: code.uploadDate,
        orderNo: code.orderId || 'N/A',
        salesExec: code.salesExecutiveName || 'System',
        type: products.find(p => p.id === code.productId)?.name || 'Voucher',
        code: code.code,
        buyer: code.buyerName || 'N/A',
        saleDate: code.assignmentDate || 'N/A',
        paymentRef: order?.bankRef || 'N/A',
        currency: order?.currency || 'USD',
        regEmail: order?.customerEmail || 'N/A'
      };
    }).filter(row => {
      const matchesType = filterType === 'ALL' || row.type.includes(filterType);
      const matchesBuyer = !filterBuyer || row.buyer.toLowerCase().includes(filterBuyer.toLowerCase());
      const matchesExec = !filterSalesExec || row.salesExec.toLowerCase().includes(filterSalesExec.toLowerCase());
      const matchesCode = !filterCodeSearch || row.code.toLowerCase().includes(filterCodeSearch.toLowerCase());
      const matchesDate = (!startDate || new Date(row.saleDate) >= new Date(startDate)) &&
                         (!endDate || new Date(row.saleDate) <= new Date(endDate));
      return matchesType && matchesBuyer && matchesExec && matchesCode && matchesDate;
    });
  }, [codes, report, products, filterType, filterBuyer, filterSalesExec, filterCodeSearch, startDate, endDate]);

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase tracking-[0.4em]">Initializing Finance Core...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12 border-b-4 border-unicou-navy pb-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <span className="px-4 py-1 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">Authority Node: Finance</span>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Production v1.2</span>
          </div>
          <h1 className="text-6xl font-display font-black tracking-tighter text-slate-950 uppercase leading-none">
            FINANCE <span className="text-unicou-orange">PORTAL</span>
          </h1>
          <p className="text-slate-500 font-bold italic text-lg mt-4 max-w-2xl">
            "Authoritative audit ledger for global voucher settlements, stock synchronization, and performance auditing."
          </p>
        </div>

        <div className="flex flex-wrap bg-slate-50 p-2 rounded-[2rem] border border-slate-200 shadow-inner">
          {[
            { id: 'audit-ledger', label: 'Voucher Report' },
            { id: 'stock-report', label: 'Stock Terminal' },
            { id: 'performance-metrics', label: 'Financial KPI' },
            { id: 'search-vault', label: 'Code Search' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as FinanceTab)} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-unicou-navy shadow-xl scale-[1.05]' : 'text-slate-400 hover:text-slate-900'}`}>{tab.label}</button>
          ))}
        </div>
      </div>

      {/* FILTER PANEL */}
      {activeTab === 'audit-ledger' && (
        <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 mb-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 items-end shadow-inner">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Voucher Type</label>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full bg-white border border-slate-200 p-3 rounded-xl text-xs font-bold outline-none focus:border-unicou-navy">
              <option value="ALL">All Types</option>
              {products.filter(p => p.type === 'Voucher').map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Buyer Name</label>
            <input type="text" placeholder="Search Buyer..." value={filterBuyer} onChange={e => setFilterBuyer(e.target.value)} className="w-full bg-white border border-slate-200 p-3 rounded-xl text-xs font-bold outline-none focus:border-unicou-navy" />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Sales Executive</label>
            <input type="text" placeholder="Search Agent..." value={filterSalesExec} onChange={e => setFilterSalesExec(e.target.value)} className="w-full bg-white border border-slate-200 p-3 rounded-xl text-xs font-bold outline-none focus:border-unicou-navy" />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-white border border-slate-200 p-3 rounded-xl text-xs font-bold outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">End Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-white border border-slate-200 p-3 rounded-xl text-xs font-bold outline-none" />
          </div>
          <button onClick={() => { setFilterType('ALL'); setFilterBuyer(''); setFilterSalesExec(''); setStartDate(''); setEndDate(''); }} className="w-full py-3 bg-unicou-navy text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-950 transition-all">Reset Sync</button>
        </div>
      )}

      {activeTab === 'audit-ledger' && (
        <div className="bg-white rounded-[4rem] border border-slate-200 shadow-3xl overflow-hidden relative">
          <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Master Voucher Audit</h3>
             <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">Live Delivery Feed Online</span>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left whitespace-nowrap">
                <thead>
                   <tr className="bg-slate-900 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      <th className="px-8 py-5">Upload Date</th>
                      <th className="px-8 py-5">Order No.</th>
                      <th className="px-8 py-5">Sales Exec</th>
                      <th className="px-8 py-5">Type</th>
                      <th className="px-8 py-5">Voucher Code</th>
                      <th className="px-8 py-5">Buyer Name</th>
                      <th className="px-8 py-5">Sale Date</th>
                      <th className="px-8 py-5">Payment Ref.</th>
                      <th className="px-8 py-5">Currency</th>
                      <th className="px-8 py-5">Reg. Email ID</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {auditLedger.length > 0 ? auditLedger.map((row, idx) => (
                     <tr key={idx} className="hover:bg-slate-50 group transition-colors">
                        <td className="px-8 py-5 font-mono text-[11px] text-slate-400">{new Date(row.uploadDate).toLocaleDateString()}</td>
                        <td className="px-8 py-5 font-black text-unicou-navy text-[11px]">{row.orderNo}</td>
                        <td className="px-8 py-5 font-bold text-slate-600 text-[11px] uppercase">{row.salesExec}</td>
                        <td className="px-8 py-5"><span className="px-2 py-1 bg-slate-100 rounded text-[9px] font-black uppercase text-slate-500">{row.type}</span></td>
                        <td className="px-8 py-5 font-mono font-black text-unicou-orange text-[12px] group-hover:scale-105 transition-transform origin-left">{row.code}</td>
                        <td className="px-8 py-5 font-black text-slate-900 text-[11px] uppercase">{row.buyer}</td>
                        <td className="px-8 py-5 font-mono text-[11px] text-slate-500">{row.saleDate !== 'N/A' ? new Date(row.saleDate).toLocaleString() : 'N/A'}</td>
                        <td className="px-8 py-5 font-mono text-[11px] text-slate-400 uppercase">{row.paymentRef}</td>
                        <td className="px-8 py-5 font-black text-slate-900 text-[11px]">{row.currency}</td>
                        <td className="px-8 py-5 font-bold text-slate-500 italic text-[11px]">{row.regEmail}</td>
                     </tr>
                   )) : (
                     <tr><td colSpan={10} className="p-32 text-center text-slate-300 font-black uppercase tracking-widest italic">"Audit ledger query returned 0 nodes."</td></tr>
                   )}
                </tbody>
             </table>
          </div>
          <div className="p-10 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Nodes Matching Filter: {auditLedger.length}</p>
             <button onClick={() => window.print()} className="px-10 py-4 bg-unicou-navy text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Export Formal Audit</button>
          </div>
        </div>
      )}

      {activeTab === 'stock-report' && (
        <div className="grid grid-cols-1 gap-12">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { label: 'Total Purchased', value: codes.length, color: 'bg-unicou-navy' },
                { label: 'Total Sold', value: auditLedger.length, color: 'bg-emerald-600' },
                { label: 'Available Closing', value: codes.filter(c => c.status === 'Available').length, color: 'bg-unicou-orange' },
                { label: 'Expired/Void', value: codes.filter(c => c.status === 'Expired').length, color: 'bg-red-600' }
              ].map(stat => (
                <div key={stat.label} className={`${stat.color} p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group`}>
                   <div className="absolute top-0 right-0 p-8 opacity-10 font-display font-black text-8xl group-hover:scale-110 transition-transform">{stat.value}</div>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 relative z-10">{stat.label}</p>
                   <p className="text-6xl font-display font-black tracking-tighter relative z-10">{stat.value}</p>
                </div>
              ))}
           </div>

           <div className="bg-white rounded-[4rem] border border-slate-200 shadow-3xl overflow-hidden">
              <div className="p-10 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Inventory Sync Terminal</h3>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Opening stock refers to vault baseline</span>
              </div>
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                       <th className="px-8 py-5">Voucher Type</th>
                       <th className="px-8 py-5 text-center">Opening Stock</th>
                       <th className="px-8 py-5 text-center">Purchased (Add)</th>
                       <th className="px-8 py-5 text-center">Sold (Out)</th>
                       <th className="px-8 py-5 text-center">Closing Stock</th>
                       <th className="px-8 py-5 text-right">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {stockReport.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-6 font-black text-slate-950 uppercase text-xs">{item.name}</td>
                        <td className="px-8 py-6 text-center font-mono font-bold text-slate-400">{item.opening}</td>
                        <td className="px-8 py-6 text-center font-mono font-bold text-emerald-600">+{item.purchased}</td>
                        <td className="px-8 py-6 text-center font-mono font-bold text-red-600">-{item.sold}</td>
                        <td className="px-8 py-6 text-center font-mono font-black text-unicou-navy text-xl">{item.closing}</td>
                        <td className="px-8 py-6 text-right">
                           <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${item.closing < 5 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                             {item.closing < 5 ? 'LOW STOCK' : 'OPTIMIZED'}
                           </span>
                        </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'performance-metrics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-3xl">
              <h3 className="text-2xl font-display font-black uppercase tracking-tight mb-10">Sales Executive Performance</h3>
              <div className="space-y-8">
                 {/* Aggregate sales by Executive */}
                 {Array.from(new Set(auditLedger.map(r => r.salesExec))).map(exec => {
                   const count = auditLedger.filter(r => r.salesExec === exec).length;
                   return (
                     <div key={exec} className="space-y-3">
                        <div className="flex justify-between items-baseline">
                           <span className="font-black uppercase text-xs tracking-widest text-slate-400">{exec}</span>
                           <span className="text-2xl font-display font-black text-unicou-orange">{count} Units</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-unicou-orange" style={{ width: `${(count / auditLedger.length) * 100}%` }} />
                        </div>
                     </div>
                   );
                 })}
              </div>
           </div>

           <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-3xl">
              <h3 className="text-2xl font-display font-black uppercase tracking-tight text-slate-950 mb-10">Revenue Streams</h3>
              <div className="space-y-8">
                 {report?.salesByType.map(type => (
                   <div key={type.name} className="flex justify-between items-center p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:scale-[1.02] transition-transform">
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{type.name}</p>
                         <p className="text-3xl font-display font-black text-unicou-navy">${type.value.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-sm">📊</div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}

      {activeTab === 'search-vault' && (
        <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-3xl max-w-4xl mx-auto">
           <h3 className="text-4xl font-display font-black text-center text-slate-950 uppercase tracking-tighter mb-12">Search <span className="text-unicou-navy">Voucher Codes</span></h3>
           <div className="relative mb-16">
              <input 
                type="text" value={filterCodeSearch} onChange={e => setFilterCodeSearch(e.target.value)}
                placeholder="Lookup Full/Partial Code Identity..."
                className="w-full bg-slate-50 border border-slate-200 rounded-[2.5rem] p-10 text-3xl font-mono font-black text-unicou-navy outline-none focus:border-unicou-orange transition-all text-center shadow-inner uppercase"
              />
              <div className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-300 text-3xl">🔍</div>
           </div>

           <div className="space-y-4">
              {filterCodeSearch.length > 2 && codes.filter(c => c.code.includes(filterCodeSearch.toUpperCase())).slice(0, 5).map(c => {
                const order = report?.recentSales.find(o => o.id === c.orderId);
                return (
                  <div key={c.id} className="p-8 bg-slate-50 border border-slate-100 rounded-3xl flex justify-between items-center group hover:bg-white hover:border-unicou-navy/20 transition-all shadow-sm">
                     <div>
                        <p className="text-xl font-mono font-black text-unicou-navy">{c.code}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase mt-1">Status: {c.status} Node</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[11px] font-bold text-slate-900">{order?.buyerName || 'Unassigned'}</p>
                        <p className="text-[9px] font-mono text-slate-400">{order?.id || 'NO_ORDER_LINK'}</p>
                     </div>
                  </div>
                );
              })}
              {filterCodeSearch.length > 2 && codes.filter(c => c.code.includes(filterCodeSearch.toUpperCase())).length === 0 && (
                <div className="py-20 text-center italic text-slate-300 font-black uppercase tracking-widest">No matching record in current cache.</div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default FinanceDashboard;
