
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/apiService';
import { Product, VoucherCode, Order, User, Lead } from '../types';

type AdminTab = 'teller' | 'vault' | 'registry' | 'team' | 'audit';

const AdminDashboard: React.FC = () => {
  const currentUser = api.getCurrentUser();
  const [activeTab, setActiveTab] = useState<AdminTab>('teller');
  const [data, setData] = useState<{
    products: Product[],
    codes: VoucherCode[],
    orders: Order[],
    users: User[],
    leads: Lead[]
  }>({ products: [], codes: [], orders: [], users: [], leads: [] });
  const [loading, setLoading] = useState(true);

  // Filters for Reporting
  const [filterType, setFilterType] = useState('ALL');
  const [filterBuyer, setFilterBuyer] = useState('');
  const [filterSalesExec, setFilterSalesExec] = useState('');
  const [filterCodeSearch, setFilterCodeSearch] = useState('');

  const fetchData = async () => {
    try {
      const [p, c, o, u, le] = await Promise.all([
        api.getProducts(), api.getCodes(), api.getOrders(), api.getUsers(), api.getLeads()
      ]);
      setData({ products: p, codes: c, orders: o, users: u, leads: le });
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleReleaseVoucher = async (orderId: string) => {
    const order = data.orders.find(o => o.id === orderId);
    if (confirm(`Deliver Voucher: Verify settlement and dispatch codes to ${order?.customerEmail}?`)) {
      try {
        await api.processOrderAction(orderId, 'verify');
        // Formal Notification Requirement
        alert(`Order Processing Completed: The Voucher(s) for Order ${orderId} delivered to the client registered email ID: ${order?.customerEmail}`);
        fetchData();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  // Stock Report Engine
  const stockReport = useMemo(() => {
    return data.products.filter(p => p.type === 'Voucher').map(p => {
      const relevantCodes = data.codes.filter(c => c.productId === p.id);
      const sold = relevantCodes.filter(c => c.status === 'Used').length;
      const available = relevantCodes.filter(c => c.status === 'Available').length;
      return {
        id: p.id,
        name: p.name,
        opening: relevantCodes.length, 
        purchased: 0, // Baseline setup
        sold,
        closing: available
      };
    });
  }, [data.codes, data.products]);

  // Master Voucher Audit Engine
  const voucherAudit = useMemo(() => {
    return data.codes.filter(c => c.status === 'Used').map(code => {
      const order = data.orders.find(o => o.id === code.orderId);
      return {
        uploadDate: code.uploadDate,
        orderNo: code.orderId || 'N/A',
        salesExec: code.salesExecutiveName || 'Direct Node',
        type: data.products.find(p => p.id === code.productId)?.name || 'Voucher',
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
      return matchesType && matchesBuyer && matchesExec && matchesCode;
    });
  }, [data, filterType, filterBuyer, filterSalesExec, filterCodeSearch]);

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase tracking-widest">Loading dashboard...</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-6 pb-24 bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16 pt-12">
        <div>
          <h1 className="text-5xl font-display font-black tracking-tight text-slate-900 leading-none uppercase">Admin <span className="text-unicou-orange">Control</span></h1>
          <p className="text-slate-500 mt-4 font-bold uppercase text-[10px] tracking-widest">Identity: {currentUser?.email} • Role: {currentUser?.role}</p>
        </div>
        <div className="flex flex-wrap bg-slate-50 p-2 rounded-[2rem] border border-slate-200 shadow-inner">
          {[
            { id: 'teller', label: 'Order Processing' },
            { id: 'vault', label: 'Stock Terminal' },
            { id: 'audit', label: 'Voucher Reports' },
            { id: 'registry', label: 'Leads' },
            { id: 'team', label: 'Users' }
          ].map(tab => (
            <button 
              key={tab.id} onClick={() => setActiveTab(tab.id as AdminTab)} 
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-unicou-navy shadow-lg scale-105' : 'text-slate-400 hover:text-slate-900'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'teller' && (
        <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-2xl overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Settlement Queue</h2>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-black text-emerald-600 uppercase">Live Processing</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] border-y border-slate-100">
                  <th className="px-8 py-6">Order ID</th>
                  <th className="px-8 py-6">Buyer Name</th>
                  <th className="px-8 py-6">Voucher Type</th>
                  <th className="px-8 py-6">Bank Reference</th>
                  <th className="px-8 py-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.orders.filter(o => o.status === 'Pending').map(o => (
                  <tr key={o.id} className="hover:bg-slate-50 group">
                    <td className="px-8 py-6 font-mono text-unicou-navy font-black text-xs">{o.id}</td>
                    <td className="px-8 py-6 font-black text-slate-900 text-xs uppercase">{o.buyerName}</td>
                    <td className="px-8 py-6 font-bold text-slate-500 text-xs uppercase">{o.productName} (x{o.quantity})</td>
                    <td className="px-8 py-6 font-mono text-xs text-slate-400">{o.bankRef}</td>
                    <td className="px-8 py-6 text-right">
                       <button 
                         onClick={() => handleReleaseVoucher(o.id)}
                         className="px-6 py-2.5 bg-unicou-navy text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 shadow-lg active:scale-95 transition-all"
                       >
                         Deliver Vouchers
                       </button>
                    </td>
                  </tr>
                ))}
                {data.orders.filter(o => o.status === 'Pending').length === 0 && (
                  <tr><td colSpan={5} className="p-32 text-center text-slate-300 font-black uppercase italic tracking-widest">No pending settlements found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'vault' && (
        <div className="space-y-12">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-unicou-navy p-10 rounded-[3rem] text-white shadow-2xl">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Total System Stock</p>
                 <p className="text-6xl font-display font-black">{data.codes.length}</p>
              </div>
              <div className="bg-emerald-600 p-10 rounded-[3rem] text-white shadow-2xl">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Total Vouchers Sold</p>
                 <p className="text-6xl font-display font-black">{data.codes.filter(c => c.status === 'Used').length}</p>
              </div>
              <div className="bg-unicou-orange p-10 rounded-[3rem] text-white shadow-2xl">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Available Closing</p>
                 <p className="text-6xl font-display font-black">{data.codes.filter(c => c.status === 'Available').length}</p>
              </div>
           </div>

           <div className="bg-white rounded-[4rem] border border-slate-200 shadow-2xl overflow-hidden">
              <div className="p-10 border-b border-slate-100 flex justify-between items-center">
                 <h2 className="text-xl font-black uppercase text-slate-900 tracking-tight">Stock Sync Terminal</h2>
                 <button className="px-6 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[9px] font-black uppercase">+ Manual Stock Injection</button>
              </div>
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-widest border-b border-slate-100">
                       <th className="px-8 py-5">Voucher Type</th>
                       <th className="px-8 py-5 text-center">Opening Stock</th>
                       <th className="px-8 py-5 text-center">Purchased</th>
                       <th className="px-8 py-5 text-center">Sold (Out)</th>
                       <th className="px-8 py-5 text-center">Closing Stock</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {stockReport.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-6 font-black text-slate-900 uppercase text-xs">{item.name}</td>
                        <td className="px-8 py-6 text-center font-mono font-bold text-slate-400">{item.opening}</td>
                        <td className="px-8 py-6 text-center font-mono font-bold text-emerald-600">+{item.purchased}</td>
                        <td className="px-8 py-6 text-center font-mono font-bold text-red-600">-{item.sold}</td>
                        <td className="px-8 py-6 text-center font-mono font-black text-unicou-navy text-xl">{item.closing}</td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="space-y-8">
           <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-200 grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Voucher Type</label>
                 <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full bg-white border border-slate-200 p-3 rounded-xl text-xs font-bold outline-none focus:border-unicou-navy">
                    <option value="ALL">All Types</option>
                    {data.products.filter(p => p.type === 'Voucher').map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Buyer Name</label>
                 <input type="text" placeholder="Filter Buyer..." value={filterBuyer} onChange={e => setFilterBuyer(e.target.value)} className="w-full bg-white border border-slate-200 p-3 rounded-xl text-xs font-bold outline-none" />
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Sales Executive</label>
                 <input type="text" placeholder="Filter Exec..." value={filterSalesExec} onChange={e => setFilterSalesExec(e.target.value)} className="w-full bg-white border border-slate-200 p-3 rounded-xl text-xs font-bold outline-none" />
              </div>
              <div className="space-y-2">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Search Voucher Code</label>
                 <input type="text" placeholder="Search code..." value={filterCodeSearch} onChange={e => setFilterCodeSearch(e.target.value)} className="w-full bg-white border border-slate-200 p-3 rounded-xl text-xs font-bold outline-none" />
              </div>
              <button onClick={() => { setFilterType('ALL'); setFilterBuyer(''); setFilterSalesExec(''); setFilterCodeSearch(''); }} className="w-full py-3 bg-unicou-navy text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-950 transition-all">Reset Filters</button>
           </div>

           <div className="bg-white rounded-[4rem] border border-slate-200 shadow-3xl overflow-hidden">
              <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Voucher Fulfillment Audit</h3>
                 <button onClick={() => window.print()} className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase shadow-sm">Print Ledger</button>
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
                       {voucherAudit.length > 0 ? voucherAudit.map((row, idx) => (
                         <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-5 font-mono text-[11px] text-slate-400">{new Date(row.uploadDate).toLocaleDateString()}</td>
                            <td className="px-8 py-5 font-black text-unicou-navy text-[11px]">{row.orderNo}</td>
                            <td className="px-8 py-5 font-bold text-slate-600 text-[11px] uppercase">{row.salesExec}</td>
                            <td className="px-8 py-5"><span className="px-2 py-1 bg-slate-100 rounded text-[9px] font-black uppercase text-slate-500">{row.type}</span></td>
                            <td className="px-8 py-5 font-mono font-black text-unicou-orange text-[12px]">{row.code}</td>
                            <td className="px-8 py-5 font-black text-slate-900 text-[11px] uppercase">{row.buyer}</td>
                            <td className="px-8 py-5 font-mono text-[11px] text-slate-500">{row.saleDate !== 'N/A' ? new Date(row.saleDate).toLocaleString() : 'N/A'}</td>
                            <td className="px-8 py-5 font-mono text-[11px] text-slate-400 uppercase">{row.paymentRef}</td>
                            <td className="px-8 py-5 font-black text-slate-900 text-[11px]">{row.currency}</td>
                            <td className="px-8 py-5 font-bold text-slate-500 italic text-[11px]">{row.regEmail}</td>
                         </tr>
                       )) : (
                         <tr><td colSpan={10} className="p-32 text-center text-slate-300 font-black uppercase tracking-widest italic">No matching records found.</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'registry' && (
        <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-2xl overflow-hidden">
           <h2 className="text-2xl font-black mb-10 text-slate-900 uppercase tracking-tighter">Global Leads</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.leads.map(l => (
                <div key={l.id} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex justify-between items-center group hover:bg-white hover:border-unicou-navy/20 transition-all">
                   <div>
                      <span className="text-[9px] font-black text-unicou-navy uppercase tracking-widest mb-2 block">{l.type} Protocol</span>
                      <h4 className="font-black text-slate-950 uppercase">{l.data.name || l.data.agency_name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">{l.data.email}</p>
                   </div>
                   <button className="px-6 py-2.5 bg-white border border-slate-200 text-unicou-navy rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm group-hover:bg-unicou-navy group-hover:text-white transition-all">Review Hub</button>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="bg-white rounded-[4rem] border border-slate-200 overflow-hidden shadow-2xl">
           <div className="p-10 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">Global Node Governance</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase mt-2">Security Note: Registered Email IDs and User IDs are immutable nodes and cannot be modified.</p>
           </div>
           <table className="w-full text-left">
             <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">
               <tr><th className="px-8 py-6">Identity Node</th><th className="px-8 py-6">Authority Level</th><th className="px-8 py-6 text-right">Lifecycle Management</th></tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {data.users.map(u => (
                 <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                   <td className="px-8 py-6">
                      <div className="font-black text-slate-900 uppercase tracking-tight">{u.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-[9px] font-black text-slate-400 uppercase">UID:</span>
                         <span className="text-[10px] text-slate-400 font-mono italic">{u.id}</span>
                         <span className="text-[9px] font-black text-slate-400 uppercase ml-2">Email:</span>
                         <span className="text-[10px] text-slate-400 font-mono italic">{u.email}</span>
                      </div>
                   </td>
                   <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${u.role === 'Student' ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-unicou-navy text-white border-unicou-navy shadow-md'}`}>
                        {u.role}
                      </span>
                   </td>
                   <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <select className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-[10px] font-black uppercase outline-none focus:border-unicou-orange cursor-pointer shadow-sm">
                           <option>Elevate Role...</option>
                           <option>Finance/Audit Team</option>
                           <option>Operation Manager</option>
                           <option>Support/Sales Node</option>
                        </select>
                        <button className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all">Suspend Node</button>
                      </div>
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
