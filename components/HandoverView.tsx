
import React from 'react';

const HandoverView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-display font-bold mb-4">Project <span className="text-primary-400">Handover</span></h1>
        <p className="text-slate-500">System architecture and security documentation for the Nexus EDU platform.</p>
      </div>

      <div className="space-y-12">
        <section className="glass p-8 rounded-[2rem] border border-slate-800">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-primary-600/10 text-primary-400 flex items-center justify-center text-sm">01</span>
            Core Architecture
          </h2>
          <div className="space-y-4 text-slate-400 text-sm leading-relaxed">
            <p>The platform is built on a <strong>State-Driven React Architecture</strong> ensuring high performance and data integrity across four main verticals:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Voucher Vault:</strong> Automated inventory management for PTE/IELTS codes.</li>
              <li><strong>LMS Academy:</strong> Role-based access control for course delivery and testing.</li>
              <li><strong>Academic CMS:</strong> Lead tracking for high-value degree programs.</li>
              <li><strong>API Portal:</strong> Standardized endpoints for mobile/third-party integration.</li>
            </ul>
          </div>
        </section>

        <section className="glass p-8 rounded-[2rem] border border-slate-800">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-400 flex items-center justify-center text-sm">02</span>
            Security Implementation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <h4 className="font-bold text-slate-200 mb-2">Data Isolation</h4>
              <p className="text-xs text-slate-500">Ownership-based middleware prevents students from accessing or modifying peer test data or orders.</p>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <h4 className="font-bold text-slate-200 mb-2">Fulfillment Integrity</h4>
              <p className="text-xs text-slate-500">Atomic fulfillment logic ensures course enrollment happens instantly upon payment confirmation.</p>
            </div>
          </div>
        </section>

        <section className="glass p-12 rounded-[3rem] border border-primary-500/20 text-center">
           <h2 className="text-2xl font-bold mb-4">Production Ready</h2>
           <p className="text-slate-400 mb-8">All endpoints have been hardened against common XSS and Rate Limiting attacks. The UI is optimized for conversion and high-speed interaction.</p>
           <div className="flex justify-center gap-4">
              <button className="px-8 py-3 bg-primary-600 rounded-xl font-bold">Download Tech Spec</button>
              <button className="px-8 py-3 glass rounded-xl font-bold">View Source Map</button>
           </div>
        </section>
      </div>
    </div>
  );
};

export default HandoverView;
