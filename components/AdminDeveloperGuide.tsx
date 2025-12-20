
import React from 'react';

const AdminDeveloperGuide: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto py-20 px-6 animate-in fade-in duration-700">
      <div className="mb-16 border-b border-slate-900 pb-8">
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 tracking-tighter">
          Admin & Developer <span className="text-primary-400">Guide</span>
        </h1>
        <p className="text-slate-500 text-lg">System operations, security maintenance, and workflow documentation.</p>
      </div>

      <div className="grid grid-cols-1 gap-16">
        {/* Section 1: Admin Logins */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-600/10 rounded-2xl flex items-center justify-center text-primary-400">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">1. Admin Access & Authentication</h2>
          </div>
          <div className="glass p-8 rounded-[2.5rem] border border-slate-800 space-y-6">
            <p className="text-slate-400 leading-relaxed">
              The Nexus platform utilizes a <strong>Role-Based Access Control (RBAC)</strong> model. Access is granted based on specific identity nodes verified against the central authentication service.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                <h4 className="font-bold text-white mb-2">Demo Credentials</h4>
                <ul className="text-sm space-y-2 text-slate-500 font-mono">
                  <li><span className="text-primary-400">System Admin:</span> admin@nexus.ai</li>
                  <li><span className="text-primary-400">Finance:</span> finance@nexus.ai</li>
                  <li><span className="text-primary-400">Lead Trainer:</span> trainer@nexus.ai</li>
                </ul>
              </div>
              <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                <h4 className="font-bold text-white mb-2">Auth Protocols</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Post-deployment, all default emails should be migrated to SSO or authenticated via hardware keys. Session tokens have a strict 24-hour TTL.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Voucher Import Workflow */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-400">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">2. Voucher Import Workflow</h2>
          </div>
          <div className="glass p-8 rounded-[2.5rem] border border-slate-800 space-y-6">
            <p className="text-slate-400 leading-relaxed">
              The <strong>Voucher Vault</strong> is the primary inventory engine. Admins can bulk-import test vouchers through the secure sync interface.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center font-bold text-xs shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-slate-200">Format Preparation</h4>
                  <p className="text-sm text-slate-500">Vouchers must be separated by <strong>new lines</strong>. The system automatically sanitizes inputs and checks for duplicates against the global registry.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center font-bold text-xs shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-slate-200">Target Selection</h4>
                  <p className="text-sm text-slate-500">Select the correct product node (e.g., PTE Academic, IELTS) to ensure correct SKU mapping during checkout.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center font-bold text-xs shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-slate-200">Atomic Fulfillment</h4>
                  <p className="text-sm text-slate-500">Once synced, vouchers are immediately available for real-time procurement. The vault state is cached across all global edge nodes.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Grader Feedback Process */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600/10 rounded-2xl flex items-center justify-center text-purple-400">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">3. Grader Evaluation Process</h2>
          </div>
          <div className="glass p-8 rounded-[2.5rem] border border-slate-800 space-y-6">
            <p className="text-slate-400 leading-relaxed">
              Writing and Speaking modules require high-fidelity human assessment. Trainers manage this via the <strong>Trainer Portal queue</strong>.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-900">
                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Priority Queue</h5>
                <p className="text-xs text-slate-400">Tasks are sorted by timestamp. Critical 'Urgent Result' requests appear at the top with a red pulse indicator.</p>
              </div>
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-900">
                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Rubric Scaling</h5>
                <p className="text-xs text-slate-400">Trainers must assign scores based on CEFR levels. Feedback is parsed for tone and clarity before being dispatched.</p>
              </div>
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-900">
                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Biometric Review</h5>
                <p className="text-xs text-slate-400">For speaking tasks, trainers use the biometric audio interface to review pronunciation and fluency markers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Post-Deployment Maintenance */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-600/10 rounded-2xl flex items-center justify-center text-orange-400">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">4. Maintenance & Security</h2>
          </div>
          <div className="glass p-8 rounded-[2.5rem] border border-slate-800 space-y-8">
            <div className="space-y-4">
              <h4 className="font-bold text-slate-200">System Monitoring</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Admins should monitor the <strong>Security Terminal</strong> daily. High <em>Rate Limit Trigger</em> counts often indicate brute-force attempts on the Voucher Vault API.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <p className="text-xs font-black text-primary-400 uppercase tracking-widest">Scaling Nodes</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  As concurrent users exceed 5,000, consider spinning up additional evaluation instances for the Trainer Portal to prevent queue latency.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-black text-primary-400 uppercase tracking-widest">Database Optimization</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Voucher logs are capped at 50,000 entries. Older records should be archived to the cold storage vault every fiscal quarter.
                </p>
              </div>
            </div>

            <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-3xl text-center">
               <p className="text-sm font-bold text-orange-400">CRITICAL: Never share the API Vault encryption keys outside of the secure dev environment.</p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <div className="text-center py-10">
          <p className="text-slate-600 text-sm mb-6">Need deep integration support or custom module deployment?</p>
          <button className="px-10 py-4 bg-white text-slate-950 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-2xl">
            Contact Nexus Core Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDeveloperGuide;
