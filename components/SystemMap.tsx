import React from 'react';

const SystemMap: React.FC = () => {
  const stakeholders = [
    {
      role: "Student (Consumer)",
      icon: "🎓",
      color: "bg-unicou-orange",
      steps: [
        "Identity Creation: Register via Student Registry.",
        "Procurement: Select vouchers (PTE/IELTS) from the Vault.",
        "Settlement: Pay via Bank Transfer (Step 1) and provide Ref (Step 2).",
        "Asset Mastery: Access Hub to take tests and receive Trainer feedback."
      ]
    },
    {
      role: "Agent (Partner)",
      icon: "🤝",
      color: "bg-unicou-navy",
      steps: [
        "Node Establishment: Apply via Partner Protocol.",
        "Bulk Inventory: Purchase vouchers in volume with Tier Discounts.",
        "Lead Control: Track student applications within their unique node.",
        "Resource Hub: Access marketing assets for local recruitment."
      ]
    },
    {
      role: "Finance / Teller",
      icon: "💰",
      color: "bg-emerald-600",
      steps: [
        "Settlement Verification: Match Bank Refs against corporate ledger.",
        "Node Authorization: Approve orders to trigger atomic code release.",
        "Revenue Tracking: Monitor gross settlements and transaction nodes.",
        "Audit Integrity: Ensure all transfers have valid proof attachments."
      ]
    },
    {
      role: "Trainer / Evaluator",
      icon: "✍️",
      color: "bg-purple-600",
      steps: [
        "Queue Management: Access prioritized student submissions.",
        "Precision Grading: Evaluate Writing/Speaking against CEFR/IELTS.",
        "Strategic Feedback: Provide deep academic insights via Terminal.",
        "Result Sync: Dispatch finalized metrics to Student Dashboard."
      ]
    },
    {
      role: "System Admin (Owner)",
      icon: "🛡️",
      color: "bg-slate-900",
      steps: [
        "Stock Injection: Upload raw voucher codes into the encrypted Vault.",
        "Staff Governance: Assign Authority Scopes (Admin, Trainer, Finance).",
        "Security Audit: Monitor rate limits and session threat levels.",
        "Lead Registry: Manage global student and agency enquiries."
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 bg-white animate-in fade-in duration-1000 print:py-0 print:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 border-b-4 border-unicou-navy pb-12 print:mb-12">
        <div className="max-w-3xl">
          <span className="text-[11px] font-black text-unicou-orange uppercase tracking-[0.5em] mb-4 block print:text-black">Institutional Architecture</span>
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-slate-950 uppercase leading-none mb-6">
            SYSTEM <span className="text-unicou-navy">BLUEPRINT</span>
          </h1>
          <p className="text-xl text-slate-500 font-bold italic leading-relaxed">
            "Unified Operating Procedures for the UNICOU Global Academic Mobility Infrastructure."
          </p>
        </div>
        <button 
          onClick={() => window.print()} 
          className="mt-8 md:mt-0 px-10 py-5 bg-unicou-navy text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-3xl hover:bg-slate-900 transition-all active:scale-95 flex items-center gap-4 print:hidden"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Generate PDF Blueprint
        </button>
      </div>

      {/* CORE LOGIC SECTION */}
      <section className="mb-24">
         <h2 className="text-2xl font-black text-unicou-navy uppercase tracking-widest mb-12 flex items-center gap-4">
            <span className="w-10 h-1 bg-unicou-orange rounded-full" />
            Core Infrastructure Workflows
         </h2>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 shadow-inner">
               <h3 className="text-lg font-black uppercase text-slate-900 mb-6">1. Voucher Lifecycle</h3>
               <div className="space-y-4 text-sm font-medium text-slate-600 leading-relaxed italic">
                  <p><strong>Injection:</strong> Admin uploads raw encrypted strings to Stock Vault.</p>
                  <p><strong>Procurement:</strong> Student triggers Order (State: Pending).</p>
                  <p><strong>Verification:</strong> Finance confirms Bank Settlement.</p>
                  <p><strong>Fulfillment:</strong> Codes move to Student Identity automatically.</p>
               </div>
            </div>
            <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 shadow-inner">
               <h3 className="text-lg font-black uppercase text-slate-900 mb-6">2. Academic Hub Loop</h3>
               <div className="space-y-4 text-sm font-medium text-slate-600 leading-relaxed italic">
                  <p><strong>Enrollment:</strong> Student redeems Auth Code or purchases Course.</p>
                  <p><strong>Submission:</strong> Student records Audio/Writing in Test Terminal.</p>
                  <p><strong>Evaluation:</strong> Trainer accesses Submission Queue via Trainer Portal.</p>
                  <p><strong>Sync:</strong> Final Band Score reflected in Student Terminal.</p>
               </div>
            </div>
            <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 shadow-inner">
               <h3 className="text-lg font-black uppercase text-slate-900 mb-6">3. Partner Ecosystem</h3>
               <div className="space-y-4 text-sm font-medium text-slate-600 leading-relaxed italic">
                  <p><strong>Authorization:</strong> Admin verifies Agency legal entity.</p>
                  <p><strong>Discount Engine:</strong> System applies Tier-based pricing (10%-20%).</p>
                  <p><strong>CRM Flow:</strong> Student leads captured via site are routed to Node Managers.</p>
                  <p><strong>Inventory:</strong> Agents procure bulk units for local resale.</p>
               </div>
            </div>
         </div>
      </section>

      {/* STAKEHOLDER DETAIL CARDS */}
      <section className="space-y-12">
        <h2 className="text-2xl font-black text-unicou-navy uppercase tracking-widest mb-12 flex items-center gap-4">
            <span className="w-10 h-1 bg-unicou-orange rounded-full" />
            Stakeholder Operational Roles
        </h2>
        <div className="grid grid-cols-1 gap-12">
          {stakeholders.map((s, idx) => (
            <div key={idx} className="flex flex-col lg:flex-row gap-12 group print:break-inside-avoid">
              <div className={`w-full lg:w-80 shrink-0 p-10 rounded-[3rem] ${s.color} text-white shadow-2xl transition-transform group-hover:scale-[1.02]`}>
                 <div className="text-6xl mb-8">{s.icon}</div>
                 <h3 className="text-2xl font-display font-black uppercase leading-tight mb-4">{s.role}</h3>
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Verified Access Scope</p>
              </div>
              <div className="flex-grow bg-white border border-slate-100 p-12 rounded-[4rem] shadow-premium relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-12 opacity-5 font-display font-black text-[12rem] select-none pointer-events-none uppercase">0{idx + 1}</div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                   {s.steps.map((step, i) => (
                     <div key={i} className="flex gap-4 items-start">
                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-[10px] font-black text-unicou-navy">{i + 1}</div>
                        <p className="text-slate-700 font-bold italic leading-relaxed">{step}</p>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-32 pt-16 border-t border-slate-100 text-center space-y-6 print:mt-12">
         <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">UNICOU INTERNATIONAL LTD • DOCUMENTATION 2025.1-V4</p>
         <div className="flex justify-center items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-unicou-vibrant" />
            <div className="vibrant-strip w-32" />
            <div className="w-2 h-2 rounded-full bg-unicou-orange" />
         </div>
      </footer>

      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          body { background: white !important; }
          .shadow-premium, .shadow-3xl, .shadow-inner { box-shadow: none !important; }
          .bg-slate-50 { background-color: #f8fafc !important; border: 1px solid #e2e8f0 !important; }
          .glass, .glass-dark { backdrop-filter: none !important; background: white !important; }
          h1, h2, h3 { color: black !important; }
          .text-slate-500, .text-slate-600 { color: #475569 !important; }
          .print\\:break-inside-avoid { break-inside: avoid; }
        }
      `}</style>
    </div>
  );
};

export default SystemMap;