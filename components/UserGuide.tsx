import React from 'react';

const UserGuide: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 bg-white animate-in fade-in duration-1000">
      <div className="text-center mb-24">
        <div className="vibrant-strip mx-auto mb-6 w-20"></div>
        <h2 className="text-5xl md:text-7xl font-display font-bold text-unicou-navy tracking-tighter uppercase mb-6">
          PLATFORM <span className="text-unicou-orange">GUIDELINES</span>
        </h2>
        <p className="text-xl text-slate-500 font-medium italic max-w-3xl mx-auto">
          "Unified operating procedures for Students, Partners, and System Administrators."
        </p>
      </div>

      <div className="grid grid-cols-1 gap-24">
        {/* VOUCHER SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-unicou-vibrant/10 flex items-center justify-center text-unicou-navy">
                 <span className="text-2xl font-black">01</span>
              </div>
              <h3 className="text-4xl font-display font-bold text-unicou-navy tracking-tight uppercase">Voucher Procurement</h3>
            </div>
            <div className="space-y-6">
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">🎫</div>
                 <h4 className="font-black text-unicou-navy uppercase text-sm mb-3">Step 1: Selection</h4>
                 <p className="text-slate-600 font-medium italic">Navigate to the Digital Vault. Select your required exam (PTE/IELTS/TOEFL) and quantity.</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">🏦</div>
                 <h4 className="font-black text-unicou-navy uppercase text-sm mb-3">Step 2: Settlement</h4>
                 <p className="text-slate-600 font-medium italic">Complete payment via Bank Transfer or Razorpay. For Bank Transfers, always input your transaction reference in the checkout node.</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 relative overflow-hidden group border-l-4 border-l-emerald-500">
                 <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">⚡</div>
                 <h4 className="font-black text-unicou-navy uppercase text-sm mb-3">Step 3: Fulfillment</h4>
                 <p className="text-slate-600 font-medium italic">Once verified by Admin, codes are instantly moved from the encrypted Vault to your Student Terminal and Email.</p>
              </div>
            </div>
          </div>
          <div className="relative">
             <div className="bg-unicou-navy p-12 rounded-[4rem] shadow-3xl transform rotate-1">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-3 h-3 rounded-full bg-unicou-vibrant animate-pulse shadow-vibrant-glow" />
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Vault Security Status: ACTIVE</span>
                </div>
                <div className="space-y-4">
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-unicou-vibrant w-3/4 animate-pulse" />
                  </div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
                    "All voucher codes are stored in an AES-256 equivalent isolated state. No staff member has visibility of raw codes until payment verification completes."
                  </p>
                </div>
             </div>
             <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-unicou-vibrant opacity-20 blur-3xl rounded-full" />
          </div>
        </section>

        {/* LMS SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
             <div className="bg-white border border-slate-100 p-12 rounded-[4rem] shadow-3xl -rotate-1 relative z-10">
                <div className="vibrant-strip mb-8 w-12"></div>
                <h4 className="text-2xl font-display font-bold text-unicou-navy mb-6">STUDY HUB ACCESS</h4>
                <ul className="space-y-4">
                   {['Redeem Authorization Code', 'Initialize Modules', 'Attempt Mock Tests', 'Receive Trainer Feedback'].map((item, i) => (
                     <li key={i} className="flex items-center gap-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                       <span className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-unicou-orange">{i+1}</span>
                       {item}
                     </li>
                   ))}
                </ul>
             </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-unicou-electric opacity-10 blur-3xl rounded-full" />
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-unicou-orange/10 flex items-center justify-center text-unicou-orange">
                 <span className="text-2xl font-black">02</span>
              </div>
              <h3 className="text-4xl font-display font-bold text-unicou-navy tracking-tight uppercase">Study Hub & LMS</h3>
            </div>
            <p className="text-slate-600 text-lg font-medium leading-relaxed italic">
              "The UNICOU Study Hub is a high-performance learning node. Students enroll in courses via direct purchase or by redeeming an Authorization Code provided by our sales nodes."
            </p>
            <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl">
               <h5 className="text-unicou-vibrant font-black uppercase text-[10px] tracking-widest mb-4">Trainer Evaluation</h5>
               <p className="text-slate-400 text-sm font-bold leading-relaxed mb-6 italic">
                 "Writing and Speaking assessments are transmitted to the Trainer Portal. Professional evaluators grade your work against CEFR/IELTS standards and provide deep academic feedback."
               </p>
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Global Grading Standards</span>
               </div>
            </div>
          </div>
        </section>

        {/* TEAM & SEO SECTION */}
        <section className="bg-slate-50 p-16 rounded-[5rem] border border-slate-100 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
               <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-unicou-navy/10 flex items-center justify-center text-unicou-navy">
                  <span className="text-2xl font-black">03</span>
                </div>
                <h3 className="text-4xl font-display font-bold text-unicou-navy tracking-tight uppercase">Scale & Authority</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <h4 className="font-black text-unicou-orange uppercase text-xs tracking-widest">Adding Team Members</h4>
                    <p className="text-slate-500 text-sm font-medium italic leading-relaxed">
                      "To add SEO experts or Support staff, use the <strong>Team Control</strong> node in the Admin Dashboard. Assign the 'Admin' role for full site management or 'Trainer' for grading access."
                    </p>
                 </div>
                 <div className="space-y-4">
                    <h4 className="font-black text-unicou-vibrant uppercase text-xs tracking-widest">SEO Management</h4>
                    <p className="text-slate-500 text-sm font-medium italic leading-relaxed">
                      "Dynamic Meta-Tags are integrated globally. Updating titles in the Country Registry or Qualification Database automatically updates the search engine index markers."
                    </p>
                 </div>
              </div>
            </div>
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col justify-center text-center">
               <h4 className="text-unicou-navy font-black uppercase text-xs tracking-widest mb-6">Need Support?</h4>
               <p className="text-slate-400 text-xs font-bold mb-8">Direct node-to-node assistance for all platform inquiries.</p>
               <button className="w-full py-5 bg-unicou-navy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl">Connect with Lead Dev</button>
            </div>
          </div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-unicou-vibrant opacity-5 blur-3xl rounded-full" />
        </section>
      </div>
    </div>
  );
};

export default UserGuide;