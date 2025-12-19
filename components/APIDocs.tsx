
import React, { useState } from 'react';
import { APIEndpoint } from '../types';

const endpoints: APIEndpoint[] = [
  {
    method: 'POST',
    path: '/api/auth/login',
    description: 'Authenticates a user session. Used by Mobile & Web clients.',
    authRequired: false,
    params: ['email'],
    response: 'UserObject'
  },
  {
    method: 'GET',
    path: '/api/vouchers/inventory',
    description: 'Retrieves raw voucher codes for stock management.',
    authRequired: true,
    response: 'VoucherCode[]'
  },
  {
    method: 'POST',
    path: '/api/leads/enquiry',
    description: 'Captures a new study-abroad lead from the frontend form.',
    authRequired: false,
    params: ['name', 'email', 'phone', 'targetCountry', 'preferredCourse'],
    response: 'LeadObject'
  },
  {
    method: 'POST',
    path: '/api/checkout/process',
    description: 'Handles secure transaction and code fulfillment logic.',
    authRequired: true,
    params: ['productId', 'quantity', 'email'],
    response: 'OrderObject'
  },
  {
    method: 'GET',
    path: '/api/education/universities',
    description: 'Fetches list of supported international institutions.',
    authRequired: false,
    response: 'University[]'
  }
];

const APIDocs: React.FC = () => {
  const [selected, setSelected] = useState<string>(endpoints[0].path);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold mb-4 tracking-tight">System <span className="text-primary-400">Documentation</span></h1>
        <p className="text-slate-500">REST API Specification for Nexus Platform Integration (v1.0.4-LABLE).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-2">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Endpoints</h4>
          {endpoints.map(e => (
            <button
              key={e.path}
              onClick={() => setSelected(e.path)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all border ${
                selected === e.path 
                ? 'bg-primary-600/10 border-primary-500/50 text-primary-400' 
                : 'border-transparent text-slate-500 hover:bg-slate-900'
              }`}
            >
              <span className={`inline-block w-12 text-[9px] font-black uppercase ${
                e.method === 'GET' ? 'text-emerald-500' : e.method === 'POST' ? 'text-blue-500' : 'text-orange-500'
              }`}>{e.method}</span>
              {e.path}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-8">
          {endpoints.filter(e => e.path === selected).map(e => (
            <div key={e.path} className="glass rounded-[2rem] border border-slate-800 p-8 md:p-12 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-md text-xs font-black uppercase ${
                      e.method === 'GET' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>{e.method}</span>
                    <span className="text-lg font-mono text-slate-400">{e.path}</span>
                  </div>
                  <h3 className="text-2xl font-bold">{e.description}</h3>
                </div>
                {e.authRequired && (
                   <span className="flex items-center gap-2 text-orange-400 bg-orange-400/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                     <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                     Auth Required
                   </span>
                )}
              </div>

              <div className="space-y-8">
                {e.params && (
                  <div>
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Body Parameters</h4>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="bg-slate-900/80 border-b border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">
                            <th className="px-6 py-3">Key</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {e.params.map(p => (
                            <tr key={p} className="hover:bg-slate-900/50 transition-colors">
                              <td className="px-6 py-4 font-mono text-primary-400 font-bold">{p}</td>
                              <td className="px-6 py-4 text-slate-400">string</td>
                              <td className="px-6 py-4 text-slate-500">Required parameter for {e.path}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Response Sample</h4>
                  <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 font-mono text-xs leading-relaxed overflow-x-auto">
                    <pre className="text-slate-400">
                      {`{
  "status": "success",
  "data": ${e.response === 'VoucherCode[]' ? '[\n    { "id": "v1", "code": "ABC-123", "status": "Available" }\n  ]' : '{ "id": "res_992", "type": "' + e.response + '" }'},
  "timestamp": "${new Date().toISOString()}"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default APIDocs;
