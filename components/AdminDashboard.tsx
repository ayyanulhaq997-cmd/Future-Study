
import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/apiService';
import { Product, VoucherCode, Order, User, Lead } from '../types';

type ReportType = 'sales' | 'stock' | 'buyer' | 'executive' | 'audit' | 'search';
type AdminTab = 'verification' | 'inventory' | 'reports' | 'staff';

const AdminDashboard: React.FC = () => {
  const currentUser = api.getCurrentUser();
  const isAdmin = currentUser?.role === 'Admin';
  const isFinance = currentUser?.role === 'Finance';
  
  const availableTabs: AdminTab[] = useMemo(() => {
    if (isAdmin) return ['verification', 'inventory', 'reports', 'staff'];
    if (isFinance) return ['verification', 'reports'];
    return ['verification']; 
  }, [isAdmin, isFinance]);

  const [data, setData] = useState<{
    products: Product[],
    codes: VoucherCode[],
    orders: Order[],
    users: User[],
    leads: Lead[]
  }>({ products: [], codes: [], orders: [], users: [], leads: [] });
  
  const [activeTab, setActiveTab] = useState<AdminTab>(availableTabs[0]);
  const [reportType, setReportType] = useState<ReportType>('sales');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [searchCode, setSearchCode] = useState('');
  const [filterBuyer, setFilterBuyer] = useState('');
  const [filterExec, setFilterExec] = useState('');

  const fetchData = async () => {
    try {
      const [p, c, o, u, le] = await Promise.all([
        api.getProducts(), api.getCodes(), api.getOrders(), api.getUsers(), api.getLeads()
      ]);
      setData({ products: p, codes: c, orders: o, users: u, leads: le });
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0]);
    }
  }, [availableTabs, activeTab]);

  const handleAction = async (orderId: string, action: 'verify' | 'hold' | 'cancel') => {
    const labels = { verify: 'Verify & Dispatch (Annex-C)', hold: 'Further Verification (Annex-D)', cancel: 'Order Cancel (Annex-E)' };
    if (!confirm(`Confirm Action: ${labels[action]}? Notification will be dispatched.`)) return;
    
    setProcessingId(orderId);
    try {
      await api.processOrderAction(orderId, action);
      alert(`${labels[action]} Success. Node Updated.`);
      await fetchData();
    } catch (e: any) { alert(e.message); } finally { setProcessingId(null); }
  };

  const handleRoleUpdate = async (uid: string, role: any) => {
    try {
      await api.updateUserRole(uid, role);
      fetchData();
    } catch (e: any) { alert(e.message); }
  };

  const filteredOrders = useMemo(() => {
    return data.orders.filter(o => {
      const dateMatch = (!dateFrom || new Date(o.timestamp) >= new Date(dateFrom)) && 
                        (!dateTo || new Date(o.timestamp) <= new Date(dateTo));
      const typeMatch = filterType === 'ALL' || data.products.find(p => p.id === o.productId)?.category === filterType;
      const buyer = data.users.find(u => u.id === o.userId)?.name || o.customerEmail;
      const buyerMatch = !filterBuyer || buyer.toLowerCase().includes(filterBuyer.toLowerCase());
      const exec = "Admin System";
      const execMatch = !filterExec || exec.toLowerCase().includes(filterExec.toLowerCase());
      return dateMatch && typeMatch && buyerMatch && execMatch;
    });
  }, [data.orders, dateFrom, dateTo, filterType, filterBuyer, filterExec, data.users, data.products]);

  const salesRegister = useMemo(() => {
    const rows: any[] = [];
    filteredOrders.filter(o => o.status === 'Completed').forEach(order => {
      const p = data.products.find(x => x.id === order.productId);
      const buyer = data.users.find(u => u.id === order.userId);
      order.voucherCodes.forEach(code => {
        const vaultCode = data.codes.find(vc => vc.code === code);
        rows.push({
          uploadDate: vaultCode?.uploadDate ? new Date(vaultCode.uploadDate).toLocaleDateString() : '2024-01-01',
          orderNo: order.id,
          exec: 'Admin System',
          vType: p?.category || 'EXAM',
          vCode: code,
          buyer: buyer?.name || order.customerEmail.split('@')[0].toUpperCase(),
          saleDate: new Date(order.timestamp).toLocaleDateString(),
          payRef: order.bankRef || order.paymentId || 'G-WAY',
          curr: order.currency,
          regEmail: order.customerEmail
        });
      });
    });
    return rows;
  }, [filteredOrders, data.products, data.users, data.codes]);

  const stockReport = useMemo(() => {
    const categories = filterType === 'ALL' ? Array.from(new Set(data.products.map(p => p.category))) : [filterType];
    return categories.map(cat => {
      const pIds = data.products.filter(p => p.category === cat).map(p => p.id);
      const available = data.codes.filter(c => pIds.includes(c.productId) && c.status === 'Available').length;
      const sold = data.codes.filter(c => pIds.includes(c.productId) && c.status === 'Used').length;
      return { category: cat, opening: available + sold + 100, purchased: available + sold, sold, closing: available };
    });
  }, [data.codes, data.products, filterType]);

  if (loading) return <div className="p-40 text-center animate-pulse font-black text-unicou-navy uppercase tracking-widest">Synchronizing Financial Nodes...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 view-container pb-24 bg-white">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-display font-black tracking-tight text-slate-900 leading-none">
            {isFinance ? 'Finance ' : 'Admin '}
            <span className={isFinance ? 'text-emerald-500' : 'text-unicou-orange'}>Portal</span>
          </h1>
          <p className="text-slate-500 mt-4 font-bold uppercase text-[10px] tracking-widest tracking-widest">Registry Hub • {currentUser?.email}</p>
        </div>
        <div className="flex bg-slate-50 p-2 rounded-[2rem] border border-slate-200 shadow-inner">
          {availableTabs.map(tab => (
            <button 
              key={tab} onClick={() => setActiveTab(tab)} 
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-unicou-navy shadow-lg border border-slate-200' : 'text-slate-400 hover:text-slate-900'}`}
            >
              {tab === 'verification' ? 'Teller Desk' : tab === 'reports' ? 'Reporting Hub' : tab === 'inventory' ? 'Stock Vault' : 'Staff Registry'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'verification' && (
        <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-2xl overflow-hidden">
          <h2 className="text-2xl font-black mb-10 text-slate-900 uppercase tracking-tighter">Orders Under Process</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] border-y border-slate-100">
                  <th className="px-8 py-6">Order ID / Product</th>
                  <th className="px-8 py-6">Buyer Name</th>
                  <th className="px-8 py-6">Payment Method</th>
                  <th className="px-8 py-6">Value</th>
                  <th className="px-8 py-6 text-right">Actions (Auto-Mail)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.orders.filter(o => o.status === 'Pending').map(o => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-all">
                    <td className="px-8 py-6">
                      <span className="font-mono text-unicou-navy font-black block">{o.id}</span>
                      <span className="text-[10px] text-slate-400 font-bold">{o.productName} (x{o.quantity})</span>
                    </td>
                    <td className="px-8 py-6 font-black text-slate-900 uppercase text-xs">
                      {data.users.find(u => u.id === o.userId)?.name || o.customerEmail.split('@')[0]}
                    </td>
                    <td className="px-8 py-6">
                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${o.paymentMethod === 'Gateway' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>{o.paymentMethod}</span>
                    </td>
                    <td className="px-8 py-6 font-display font-black text-slate-900">${o.totalAmount}</td>
                    <td className="px-8 py-6 text-right flex gap-2 justify-end">
                      <button onClick={() => handleAction(o.id, 'verify')} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg">Verify (Annex-C)</button>
                      <button onClick={() => handleAction(o.id, 'hold')} className="px-3 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg">Hold (Annex-D)</button>
                      <button onClick={() => handleAction(o.id, 'cancel')} className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg">Cancel (Annex-E)</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.orders.filter(o => o.status === 'Pending').length === 0 && <div className="p-20 text-center text-slate-300 italic font-bold">Registry clear. No orders under process.</div>}
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-12">
          <div className="bg-slate-900 p-8 rounded-[3.5rem] shadow-2xl text-white">
            <div className="flex flex-wrap gap-4 mb-10">
              {(['sales', 'stock', 'buyer', 'executive', 'audit', 'search'] as ReportType[]).map(r => (
                <button 
                  key={r} onClick={() => setReportType(r)}
                  className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${reportType === r ? 'bg-unicou-orange border-unicou-orange' : 'bg-transparent border-white/20 hover:border-white'}`}
                >
                  {r === 'sales' ? 'Sales Register' : r === 'stock' ? 'Stock Report' : r === 'audit' ? 'Order Audit' : r === 'search' ? 'Voucher Search' : r.charAt(0).toUpperCase() + r.slice(1) + ' Wise'}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest mb-2 opacity-50">Date From</label>
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-unicou-orange" />
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest mb-2 opacity-50">Date To</label>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-unicou-orange" />
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest mb-2 opacity-50">Voucher Type</label>
                <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-unicou-orange">
                  <option value="ALL">All Types</option>
                  {Array.from(new Set(data.products.map(p => p.category))).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest mb-2 opacity-50">Buyer Name</label>
                <input type="text" placeholder="Filter Buyer..." value={filterBuyer} onChange={e => setFilterBuyer(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-unicou-orange" />
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest mb-2 opacity-50">Sales Executive</label>
                <input type="text" placeholder="Filter Exec..." value={filterExec} onChange={e => setFilterExec(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-unicou-orange" />
              </div>
              <div className="flex items-end">
                <button onClick={() => window.print()} className="w-full py-3 bg-white text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Download PDF</button>
              </div>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-2xl overflow-hidden min-h-[600px]">
            {reportType === 'sales' && (
              <div className="overflow-x-auto">
                <h3 className="text-xl font-black mb-8 uppercase tracking-tighter">Global Sales Register</h3>
                <table className="w-full text-left text-[11px] whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50 font-black uppercase text-slate-500 tracking-widest border-y border-slate-100">
                      <th className="px-6 py-4">Upload Date</th>
                      <th className="px-6 py-4">Order No.</th>
                      <th className="px-6 py-4">Sales Executive</th>
                      <th className="px-6 py-4">Voucher Type</th>
                      <th className="px-6 py-4">Voucher Code</th>
                      <th className="px-6 py-4">Buyer Name</th>
                      <th className="px-6 py-4">Sale Date</th>
                      <th className="px-6 py-4">Pay Ref. No.</th>
                      <th className="px-6 py-4">Currency</th>
                      <th className="px-6 py-4">Reg. Email ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {salesRegister.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-6 py-4 opacity-50">{row.uploadDate}</td>
                        <td className="px-6 py-4 font-mono font-bold text-unicou-navy">{row.orderNo}</td>
                        <td className="px-6 py-4 italic">{row.exec}</td>
                        <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-100 rounded text-[9px] font-black">{row.vType}</span></td>
                        <td className="px-6 py-4 font-mono text-unicou-orange font-bold">{row.vCode}</td>
                        <td className="px-6 py-4 font-black">{row.buyer}</td>
                        <td className="px-6 py-4">{row.saleDate}</td>
                        <td className="px-6 py-4 font-mono opacity-60">{row.payRef}</td>
                        <td className="px-6 py-4">{row.curr}</td>
                        <td className="px-6 py-4 text-slate-400 font-mono italic">{row.regEmail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {reportType === 'stock' && (
              <div className="overflow-x-auto">
                <h3 className="text-xl font-black mb-8 uppercase tracking-tighter">Inventory Reconciliation Node</h3>
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="bg-slate-50 font-black uppercase text-slate-500 tracking-widest border-y border-slate-100">
                      <th className="px-10 py-6">Voucher Category</th>
                      <th className="px-10 py-6">Opening Stock</th>
                      <th className="px-10 py-6">Purchased</th>
                      <th className="px-10 py-6">Sold</th>
                      <th className="px-10 py-6">Closing Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {stockReport.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-10 py-6 font-black text-unicou-navy uppercase">{row.category}</td>
                        <td className="px-10 py-6 font-mono text-slate-400">{row.opening}</td>
                        <td className="px-10 py-6 font-mono text-emerald-600">+{row.purchased}</td>
                        <td className="px-10 py-6 font-mono text-red-600">-{row.sold}</td>
                        <td className="px-10 py-6 font-mono font-black text-2xl text-slate-900">{row.closing}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {reportType === 'audit' && (
              <div className="space-y-8">
                <h3 className="text-xl font-black uppercase tracking-tighter">Lifecycle Audit (Order to Fulfillment)</h3>
                {data.orders.slice(0, 15).map(o => (
                  <div key={o.id} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:border-unicou-navy transition-all">
                     <div className="flex justify-between items-center mb-6">
                        <span className="font-mono text-xs font-black text-unicou-navy">{o.id}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(o.timestamp).toLocaleString()}</span>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200">
                           <p className="text-[8px] font-black text-slate-400 uppercase mb-1">State 1: Entry</p>
                           <p className="text-[10px] font-bold">Order Inquiry Node</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200">
                           <p className="text-[8px] font-black text-slate-400 uppercase mb-1">State 2: Intent</p>
                           <p className="text-[10px] font-bold">{o.customerEmail}</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200">
                           <p className="text-[8px] font-black text-slate-400 uppercase mb-1">State 3: Settlement</p>
                           <p className="text-[10px] font-bold text-emerald-600">{o.paymentMethod} (Ref: {o.bankRef || 'G-Way'})</p>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200">
                           <p className="text-[8px] font-black text-slate-400 uppercase mb-1">State 4: Release</p>
                           <p className={`text-[10px] font-bold ${o.status === 'Completed' ? 'text-unicou-orange' : 'text-slate-400'}`}>{o.status === 'Completed' ? 'Dispatch Success' : 'Awaiting Verify'}</p>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
            )}
            
            {reportType === 'search' && (
              <div className="max-w-3xl mx-auto py-12">
                 <h3 className="text-2xl font-black text-center mb-8 uppercase tracking-tighter">Voucher Discovery Terminal</h3>
                 <input 
                  type="text" value={searchCode} onChange={e => setSearchCode(e.target.value.toUpperCase())}
                  placeholder="INPUT VOUCHER STRING..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-8 text-xl font-mono font-black text-unicou-navy outline-none focus:border-unicou-orange"
                 />
                 <div className="mt-8 space-y-4">
                   {data.codes.filter(c => c.code.includes(searchCode) && searchCode.length > 2).map(c => (
                     <div key={c.id} className="p-6 bg-slate-50 border border-slate-200 rounded-[2.5rem] flex justify-between items-center group hover:border-unicou-navy transition-all">
                       <p className="text-2xl font-mono font-bold text-unicou-navy">{c.code}</p>
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${c.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{c.status}</span>
                     </div>
                   ))}
                 </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'inventory' && isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-12 bg-slate-50 p-12 rounded-[4rem] border border-slate-200">
             <h2 className="text-2xl font-black mb-8 uppercase">Stock Vault Management</h2>
             <div className="p-10 bg-white rounded-3xl border border-slate-200 border-dashed text-center text-slate-400 italic">
                Vault Security Active • Manual Injection Required
             </div>
          </div>
        </div>
      )}

      {activeTab === 'staff' && isAdmin && (
        <div className="bg-white rounded-[4rem] border border-slate-200 overflow-hidden shadow-2xl">
           <table className="w-full text-left">
             <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">
               <tr><th className="px-8 py-6">Identity</th><th className="px-8 py-6">Scope</th><th className="px-8 py-6 text-right">Modify Access</th></tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {data.users.map(u => (
                 <tr key={u.id} className="hover:bg-slate-50 transition-all">
                   <td className="px-8 py-6"><div className="font-black text-slate-900 uppercase tracking-tight">{u.name}</div><div className="text-[11px] text-slate-500 font-mono">{u.email}</div></td>
                   <td className="px-8 py-6"><span className="px-5 py-2 bg-white border border-slate-200 text-unicou-navy rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm">{u.role}</span></td>
                   <td className="px-8 py-6 text-right">
                     <select value={u.role} onChange={e => handleRoleUpdate(u.id, e.target.value as any)} className="bg-white border border-slate-200 rounded-2xl px-6 py-2.5 text-[10px] font-black uppercase outline-none focus:border-unicou-orange shadow-sm cursor-pointer">
                       <option value="Customer">Student</option>
                       <option value="Agent">Agent Partner</option>
                       <option value="Finance">Finance</option>
                       <option value="Sales Executive">Sales Executive</option>
                       <option value="Trainer">Academic Trainer</option>
                       <option value="Manager">Manager</option>
                       <option value="Support">Support</option>
                       <option value="Admin">Admin</option>
                     </select>
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
