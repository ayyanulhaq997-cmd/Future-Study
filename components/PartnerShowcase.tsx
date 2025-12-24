import React from 'react';

const PARTNERS = [
  "University of Manchester", "UCL", "King's College London", "University of Sydney",
  "University of Toronto", "Arizona State University", "Monash University",
  "Heriot-Watt University", "Murdoch University", "UOW Australia", "PTE PEARSON", "IDP IELTS"
];

const REVIEWS = [
  { name: "Apex Training Node", role: "Global Partner", text: "UNICOU's automated voucher dispatch system is the fastest we've integrated in a decade." },
  { name: "West-Lakes Academy", role: "Institution", text: "Exceptional student matching and verification protocols. A trusted mobility partner." },
  { name: "Future Horizons", role: "Recruiter", text: "The CRM leads are high-quality and verified. Truly a unified platform for global success." }
];

const PartnerShowcase: React.FC = () => {
  return (
    <section className="py-24 bg-slate-950/50 border-y border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.4em] mb-4 block">Global Ecosystem</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight">Accredited <span className="text-unicou-orange">Nodes</span> & Partners</h2>
        </div>

        {/* Partner Logo Marquee */}
        <div className="overflow-hidden relative mb-24 grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
          <div className="flex gap-20 animate-marquee whitespace-nowrap">
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <div key={i} className="text-2xl font-black text-slate-500 hover:text-white transition-colors cursor-default">
                {p.toUpperCase()}
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((rev, i) => (
            <div key={i} className="glass p-10 rounded-[3rem] border border-slate-800 hover:border-primary-500/30 transition-all group">
               <div className="flex gap-1 mb-6">
                 {[1,2,3,4,5].map(s => <span key={s} className="text-unicou-orange text-xs">★</span>)}
               </div>
               <p className="text-slate-300 text-lg italic leading-relaxed mb-8">"{rev.text}"</p>
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-primary-600/10 border border-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-xs uppercase">
                   {rev.name.charAt(0)}
                 </div>
                 <div>
                   <h4 className="text-sm font-bold text-slate-100">{rev.name}</h4>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{rev.role}</p>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
          display: flex;
          width: max-content;
        }
      `}</style>
    </section>
  );
};

export default PartnerShowcase;