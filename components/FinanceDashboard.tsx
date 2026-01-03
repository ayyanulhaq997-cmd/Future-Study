
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/apiService';
import { FinanceReport, User, Order, VoucherCode, Product } from '../types';

type FinanceTab = 'audit-ledger' | 'stock-terminal' | 'vault-master' | 'performance';

const FinanceDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [report, setReport] = useState<FinanceReport | null>(null);
  const [codes, setCodes] = useState<VoucherCode[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<FinanceTab>('audit-ledger');

  // Filters
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'Available' | 'Used' | 'Expired'>('ALL');
  const [filterBuyer, setFilterBuyer] = useState('');
  const [filterCodeSearch, setFilterCodeSearch] = useState('');

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [r, c, p] = await Promise.all([api.getFinanceReport(), api.getCodes(), api.getProducts()]);
      setReport(r);
      setCodes(c);
      setProducts(p);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Requirement I, II, III: Stock Tracking Engine
  const stockMetrics = useMemo(() => {
    const total = codes.length;
    const sold = codes.filter(c => c.status === 'Used').length;
    const unsold = codes.filter(c => c.status === 'Available').length;
    const expired = codes.filter(c => c.status === 'Expired').length;
    return { total, sold, unsold, expired };
  }, [codes]);

  // Requirement II, IV, V: Master Ledger for Sold Vouchers
  const auditLedger = useMemo(() => {
    return codes.filter(c => c.status === 'Used').map(code => {
      const order = report?.recentSales.find(o => o.id === code.orderId);
      const product = products.find(p => p.id === code.productId);
      return {
        code: code.code,
        buyer: code.buyerName || 'Unknown',
        productName: product?.name || 'Voucher',
        saleDate: code.assignmentDate || 'N/A',
        orderId: code.orderId || 'OFFLINE',
        paymentRef: order?.bankRef || 'GATEWAY_AUTH',
        amount: product?.basePrice || 0,
        currency: order?.currency || 'USD'
      };
    }).sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime());
  }, [codes, report, products]);

  // Requirement III: Master Vault Explorer (Unsold/All)
  const filteredVault = useMemo(() => {
    return codes.filter(c => {
      const matchesStatus = filterStatus === 'ALL' || c.status === filterStatus;
      const matchesSearch = !filterCodeSearch || c.code.toLowerCase().includes(filterCodeSearch.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [codes, filterStatus, filterCodeSearch]);

  if (loading) return <div className="p-40 text-center animate-pulse text-[#004a61] font-black uppercase text-[11px] tracking-[0.4em]">Loading Financial Infrastructure...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="flex flex-col xl:flex-row justify-between items-center gap-10 mb-16 border-b border-slate-100 pb-12">
        <div>
           <h1 className="text-5xl font-display font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">
             FINANCE <span className="text-[#f15a24]">PORTAL</span>
           </h1>
           <p className="text-[10px] font-black text-[#004a61] uppercase tracking-[0.4em]">Official Audit & Settlement Node</p>
        </div>
        
        <div className="flex flex-wrap justify-center bg-slate-50 p-2 rounded-[2.5rem] border border-slate-200 shadow-inner">
           {[
             { id: 'audit-ledger', label: 'Sold Vouchers (Audit)' },
             { id: 'vault-master', label: 'Master Registry (Unsold)' },
             { id: 'stock-terminal', label: 'Stock Metrics' },
             { id: 'performance', label: 'KPI Dashboard' }
           ].map((tab) => (
             <button key={tab.id} onClick={() => setActiveTab(tab.id as FinanceTab)} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-[#004a61] shadow-lg border border-slate-200' : 'text-slate-400 hover:text-slate-900'}`}>
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      {/* METRICS ROW (Quick View for Req I, II, III) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
         <div className="bg-[#004a61] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Total Vouchers Uploaded</p>
            <p className="text-5xl font-display font-black">{stockMetrics.total}</p>
            <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-8xl group-hover:scale-110 transition-transform">IN</div>
         </div>
         <div className="bg-emerald-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Sold Vouchers</p>
            <p className="text-5xl font-display font-black">{stockMetrics.sold}</p>
            <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-8xl group-hover:scale-110 transition-transform">OUT</div>
         </div>
         <div className="bg-[#f15a24] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
            <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Unsold (Available)</p>
            <p className="text-5xl font-display font-black">{stockMetrics.unsold}</p>
            <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-8xl group-hover:scale-110 transition-transform">HUB</div>
         </div>
         <div className="bg-slate-100 p-10 rounded-[3rem] text-slate-900 border border-slate-200 relative overflow-hidden group">
            <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Gross Settlement</p>
            <p className="text-5xl font-display font-black">${report?.totalRevenue.toLocaleString()}</p>
            <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-8xl group-hover:scale-110 transition-transform">VAL</div>
         </div>
      </div>

      {/* SOLD VOUCHERS AUDIT (Requirement II, IV, V) */}
      {activeTab === 'audit-ledger' && (
        <div className="animate-in fade-in duration-500">
           <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
              <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                 <h3 className="text-sm font-black uppercase tracking-widest text-[#004a61]">Requirement IV & V: Buyer & Payment Audit</h3>
                 <button onClick={() => window.print()} className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm">Export Audit Ledger</button>
              </div>
              <table className="w-full text-left">
                 <thead className="bg-slate-900 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <tr>
                      <th className="px-10 py-6">Voucher Code</th>
                      <th className="px-10 py-6">Buyer Identity</th>
                      <th className="px-10 py-6">Product</th>
                      <th className="px-10 py-6">Payment Ref / Order</th>
                      <th className="px-10 py-6">Sale Timestamp</th>
                      <th className="px-10 py-6 text-right">Value</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {auditLedger.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-10 py-6 font-mono font-black text-xs text-[#f15a24]">{row.code}</td>
                        <td className="px-10 py-6 font-black text-xs text-slate-900 uppercase">{row.buyer}</td>
                        <td className="px-10 py-6 font-bold text-xs text-[#004a61] uppercase">{row.productName}</td>
                        <td className="px-10 py-6">
                           <div className="font-mono text-[10px] text-slate-400">{row.paymentRef}</div>
                           <div className="text-[9px] font-black text-slate-300">{row.orderId}</div>
                        </td>
                        <td className="px-10 py-6 font-mono text-[10px] text-slate-400">{new Date(row.saleDate).toLocaleString()}</td>
                        <td className="px-10 py-6 text-right font-display font-black text-slate-950 text-xl">${row.amount}</td>
                      </tr>
                    ))}
                    {auditLedger.length === 0 && (
                      <tr><td colSpan={6} className="p-32 text-center text-slate-300 font-bold uppercase italic">No sold vouchers found in ledger.</td></tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {/* MASTER REGISTRY (Requirement III: Unsold Vouchers) */}
      {activeTab === 'vault-master' && (
        <div className="animate-in fade-in duration-500">
           <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 mb-8 flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-grow w-full">
                 <input 
                   type="text" 
                   className="w-full bg-white border border-slate-200 p-5 rounded-2xl text-sm font-bold outline-none focus:border-[#004a61] shadow-inner"
                   placeholder="Search Code Identity..."
                   value={filterCodeSearch}
                   onChange={e => setFilterCodeSearch(e.target.value)}
                 />
              </div>
              <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-inner shrink-0">
                 {(['ALL', 'Available', 'Used'] as const).map(s => (
                   <button key={s} onClick={() => setFilterStatus(s)} className={`px-6 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-[#004a61] text-white shadow-md' : 'text-slate-400'}`}>
                     {s === 'Available' ? 'Unsold Only' : s === 'Used' ? 'Sold Only' : 'Global Vault'}
                   </button>
                 ))}
              </div>
           </div>

           <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
              <table className="w-full text-left">
                 <thead className="bg-slate-100 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                    <tr>
                      <th className="px-10 py-6">Node Identity (Code)</th>
                      <th className="px-10 py-6">SKU / Product</th>
                      <th className="px-10 py-6">Status Node</th>
                      <th className="px-10 py-6">Upload Timestamp</th>
                      <th className="px-10 py-6 text-right">Details</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {filteredVault.slice(0, 100).map((c) => (
                      <tr key={c.id}>
                        <td className="px-10 py-6 font-mono font-black text-xs text-[#004a61] uppercase">{c.code}</td>
                        <td className="px-10 py-6 font-bold text-xs text-slate-600 uppercase">{products.find(p => p.id === c.productId)?.name || 'Voucher'}</td>
                        <td className="px-10 py-6">
                           <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${c.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                             {c.status === 'Available' ? 'UNSOLD (IN STOCK)' : 'SOLD (OFF-HUB)'}
                           </span>
                        </td>
                        <td className="px-10 py-6 font-mono text-[10px] text-slate-400">{new Date(c.uploadDate).toLocaleDateString()}</td>
                        <td className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           {c.orderId || 'AVAILABLE'}
                        </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
              <div className="p-8 bg-slate-50/50 text-center">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Displaying Top 100 Registry Entries</p>
              </div>
           </div>
        </div>
      )}

      {/* PERFORMANCE KPI */}
      {activeTab === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in slide-in-from-bottom-6 duration-500">
           <div className="bg-slate-900 p-12 rounded-[4rem] text-white shadow-3xl">
              <h3 className="text-2xl font-display font-black uppercase mb-10 tracking-tight">Revenue Stream Distribution</h3>
              <div className="space-y-6">
                 {report?.salesByType.map(type => (
                   <div key={type.name} className="flex justify-between items-center p-6 bg-white/5 border border-white/10 rounded-3xl">
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{type.name}</p>
                         <p className="text-3xl font-display font-black text-white">${type.value.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl">📈</div>
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-3xl">
              <h3 className="text-2xl font-display font-black uppercase text-[#004a61] mb-10 tracking-tight">Stock Consumption Analysis</h3>
              <div className="space-y-8">
                 {products.filter(p => p.type === 'Voucher').map(p => {
                    const total = codes.filter(c => c.productId === p.id).length;
                    const used = codes.filter(c => c.productId === p.id && c.status === 'Used').length;
                    const percent = total > 0 ? Math.round((used / total) * 100) : 0;
                    return (
                      <div key={p.id}>
                         <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] font-black text-[#004a61] uppercase tracking-widest">{p.name}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase">{percent}% Depleted</span>
                         </div>
                         <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-[#f15a24] transition-all duration-1000" style={{ width: `${percent}%` }} />
                         </div>
                      </div>
                    );
                 })}
              </div>
           </div>
        </div>
      )}

      {/* STOCK TERMINAL */}
      {activeTab === 'stock-terminal' && (
        <div className="bg-white rounded-[4rem] border border-slate-200 shadow-3xl overflow-hidden animate-in fade-in duration-500">
           <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                   <th className="px-10 py-6">Product Node</th>
                   <th className="px-10 py-6 text-center">Admin Uploaded (Total)</th>
                   <th className="px-10 py-6 text-center">Sold (Settled)</th>
                   <th className="px-10 py-6 text-center">In Stock (Unsold)</th>
                   <th className="px-10 py-6 text-right">Health Node</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {products.filter(p => p.type === 'Voucher').map(p => {
                    const counts = {
                      total: codes.filter(c => c.productId === p.id).length,
                      sold: codes.filter(c => c.productId === p.id && c.status === 'Used').length,
                      unsold: codes.filter(c => c.productId === p.id && c.status === 'Available').length
                    };
                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-10 py-6 font-black text-xs text-[#004a61] uppercase">{p.name}</td>
                        <td className="px-10 py-6 text-center font-mono font-bold text-slate-400">{counts.total}</td>
                        <td className="px-10 py-6 text-center font-mono font-bold text-red-600">-{counts.sold}</td>
                        <td className="px-10 py-6 text-center font-mono font-black text-[#004a61] text-2xl">{counts.unsold}</td>
                        <td className="px-10 py-6 text-right">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${counts.unsold < 10 ? 'bg-orange-50 text-orange-600 animate-pulse' : 'bg-emerald-50 text-emerald-600'}`}>
                             {counts.unsold < 10 ? 'RESTOCK REQUIRED' : 'OPTIMAL'}
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
  );
};

export default FinanceDashboard;
