
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Product, VoucherCode, Order, ActivityLog, QualificationLead, SecurityStatus, LeadSubmission, FinanceReport } from '../types';

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<{
    products: Product[],
    codes: VoucherCode[],
    orders: Order[],
    logs: ActivityLog[],
    qLeads: QualificationLead[],
    leads: LeadSubmission[],
    security: SecurityStatus | null,
    finance: FinanceReport | null
  }>({
    products: [], codes: [], orders: [], logs: [], qLeads: [], leads: [], security: null, finance: null
  });
  
  const [activeTab, setActiveTab] = useState<'inventory' | 'finance' | 'leads' | 'qualifications' | 'security'>('inventory');
  const [loading, setLoading] = useState(true);
  
  const [showImportModal, setShowImportModal] = useState(false);
  const [importTarget, setImportTarget] = useState('');
  const [importText, setImportText] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const fetchData = async () => {
    try {
      const [p, c, o, l, ql, ls, s, f] = await Promise.all([
        api.getProducts(), api.getCodes(), api.getOrders(), 
        api.getLogs(), api.getQualificationLeads(), api.getLeads(), 
        api.getSecurityStatus(), api.getFinanceReport()
      ]);
      setData({ products: p, codes: c, orders: o, logs: l, qLeads: ql, leads: ls, security: s, finance: f });
      if (p.length > 0) setImportTarget(p[0].id);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handleImport = async () => {
    if (!importText.trim()) return;
    setIsImporting(true);
    const splitCodes = importText.split('\n').map(c => c.trim()).filter(c => c.length > 0);
    const result = await api.importVouchers(importTarget, splitCodes);
    alert(`Import Complete: ${result.addedCount} new vouchers added.`);
    setImportText('');
    setShowImportModal(false);
    setIsImporting(false);
    fetchData();
  };

  if (loading) return <div className="p-20 text-center animate-pulse">Connecting to Nexus Admin Hub...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Admin <span className="text-primary-400">Terminal</span></h1>
          <p className="text-slate-500 text-sm mt-1">Infrastructure Control Node</p>
        </div>
        <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 shadow-inner overflow-x-auto no-scrollbar">
          {(['inventory', 'finance', 'leads', 'qualifications', 'security'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all whitespace-nowrap ${activeTab === t ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' : 'text-slate-500 hover:text-slate-300'}`}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 animate-in fade-in duration-500">
        
        {activeTab === 'security' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="glass p-6 rounded-[2rem] border border-slate-800">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Uptime</p>
                <p className="text-2xl font-bold font-mono text-emerald-400">{data.security?.uptime}</p>
              </div>
              <div className="glass p-6 rounded-[2rem] border border-slate-800">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Rate Limits</p>
                <p className={`text-2xl font-bold font-mono ${data.security?.rateLimitsTriggered ? 'text-orange-400' : 'text-slate-400'}`}>{data.security?.rateLimitsTriggered}</p>
              </div>
              <div className="glass p-6 rounded-[2rem] border border-slate-800">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Active Sessions</p>
                <p className="text-2xl font-bold font-mono text-primary-400">{data.security?.activeSessions}</p>
              </div>
              <div className="glass p-6 rounded-[2rem] border border-slate-800">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Threat Level</p>
                <p className={`text-2xl font-bold font-mono ${data.security?.threatLevel === 'Low' ? 'text-emerald-400' : 'text-red-500'}`}>{data.security?.threatLevel}</p>
              </div>
            </div>

            <div className="glass rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
              <div className="px-8 py-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                <h3 className="text-xl font-bold">Activity Log <span className="text-xs text-slate-500 font-normal ml-2">(Recent 500)</span></h3>
                <button onClick={fetchData} className="text-primary-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/80 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                    <tr>
                      <th className="px-8 py-5">Severity</th>
                      <th className="px-8 py-5">Action</th>
                      <th className="px-8 py-5">Details</th>
                      <th className="px-8 py-5">User</th>
                      <th className="px-8 py-5 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {data.logs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="px-8 py-5">
                          <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            log.severity === 'info' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            log.severity === 'warning' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                            'bg-red-500/10 text-red-500 border-red-500/20'
                          }`}>{log.severity}</span>
                        </td>
                        <td className="px-8 py-5 font-bold text-slate-200">{log.action}</td>
                        <td className="px-8 py-5 text-slate-400 max-w-md truncate" title={log.details}>{log.details}</td>
                        <td className="px-8 py-5">
                          <div className="text-slate-300 font-medium">{log.userEmail}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{log.ip}</div>
                        </td>
                        <td className="px-8 py-5 text-right font-mono text-xs text-slate-500">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                    {data.logs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-8 py-20 text-center text-slate-600 italic">No activity logs recorded.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'qualifications' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Applications</p>
                <p className="text-2xl font-bold font-mono">{data.qLeads.length}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">System Healthy</span>
              </div>
            </div>

            <div className="glass rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/80 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Applicant</th>
                    <th className="px-8 py-5">Program</th>
                    <th className="px-8 py-5">Tracking ID</th>
                    <th className="px-8 py-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {data.qLeads.map(lead => (
                    <tr key={lead.id} className="hover:bg-primary-500/[0.02] transition-colors group">
                      <td className="px-8 py-5">
                        <div className="font-bold text-slate-200">{lead.studentName}</div>
                        <div className="text-[10px] text-slate-500">{lead.studentEmail}</div>
                      </td>
                      <td className="px-8 py-5 text-slate-400 font-medium">{lead.qualificationTitle}</td>
                      <td className="px-8 py-5 font-mono text-xs text-primary-400">{lead.trackingId}</td>
                      <td className="px-8 py-5 text-right">
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-900 border border-slate-800 text-slate-400">{lead.status}</span>
                      </td>
                    </tr>
                  ))}
                  {data.qLeads.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-slate-600 italic">No academic leads captured in this cycle.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
              <div className="flex gap-12">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">Vault Storage</p>
                  <p className="text-2xl font-bold">{data.codes.length} Codes</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-1 tracking-widest">Active Stock</p>
                  <p className="text-2xl font-bold text-emerald-500">{data.codes.filter(c => c.status === 'Available').length}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowImportModal(true)}
                className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-primary-500/20 active:scale-95 flex items-center gap-2"
              >
                Secure Bulk Import
              </button>
            </div>

            <div className="glass rounded-[2.5rem] border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/80 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Product Target</th>
                    <th className="px-8 py-5">Secure Code</th>
                    <th className="px-8 py-5">Lifecycle Status</th>
                    <th className="px-8 py-5 text-right">Expiration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {data.codes.map(c => (
                    <tr key={c.id} className="hover:bg-primary-500/[0.02]">
                      <td className="px-8 py-5 font-bold text-slate-200">{data.products.find(p => p.id === c.productId)?.name}</td>
                      <td className="px-8 py-5 font-mono text-primary-400">{c.code}</td>
                      <td className="px-8 py-5">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${c.status === 'Available' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>{c.status}</span>
                      </td>
                      <td className="px-8 py-5 text-right text-slate-500 font-mono text-xs">{c.expiryDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'finance' && data.finance && (
           <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass p-8 rounded-[2rem] border border-slate-800">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Total Revenue</p>
                <p className="text-4xl font-display font-bold text-emerald-400 font-mono">${data.finance.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="glass p-8 rounded-[2rem] border border-slate-800">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Units Fulfilled</p>
                <p className="text-4xl font-display font-bold text-primary-400 font-mono">{data.finance.totalVouchersSold}</p>
              </div>
              <div className="glass p-8 rounded-[2rem] border border-slate-800">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Lead Conversion</p>
                <p className="text-4xl font-display font-bold text-orange-400 font-mono">12.4%</p>
              </div>
            </div>

            <div className="glass p-8 rounded-[3rem] border border-slate-800">
               <h3 className="text-xl font-bold mb-8">Revenue Breakdown</h3>
               <div className="space-y-6">
                 {data.finance.salesByType.map((item) => (
                   <div key={item.name} className="space-y-2">
                     <div className="flex justify-between text-sm">
                       <span className="font-bold text-slate-400">{item.name}</span>
                       <span className="font-mono text-slate-200">${item.value.toLocaleString()}</span>
                     </div>
                     <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                       <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(item.value / (data.finance?.totalRevenue || 1)) * 100}%` }} />
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setShowImportModal(false)} />
            <div className="relative glass w-full max-w-2xl rounded-[3rem] border border-slate-800 p-10 shadow-3xl animate-in zoom-in">
              <h2 className="text-3xl font-display font-bold mb-8">Inventory <span className="text-primary-400">Sync</span></h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Target Node</label>
                  <select 
                    value={importTarget}
                    onChange={(e) => setImportTarget(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs font-bold text-slate-200 focus:border-primary-500 outline-none"
                  >
                    {data.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Raw Code Payload</label>
                  <textarea 
                    className="w-full h-48 bg-slate-950 border border-slate-800 rounded-3xl p-6 text-sm font-mono text-primary-300 outline-none focus:border-primary-500"
                    placeholder="PTE-123-ABC&#10;PTE-456-DEF"
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                  />
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setShowImportModal(false)} className="flex-1 py-5 glass border border-slate-800 rounded-2xl font-bold text-xs uppercase tracking-widest">Cancel</button>
                  <button onClick={handleImport} className="flex-[2] py-5 bg-primary-600 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-primary-500/20 transition-all active:scale-95">Initiate Sync</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
