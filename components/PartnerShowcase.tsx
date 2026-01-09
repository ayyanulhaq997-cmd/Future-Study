
import React from 'react';

const UNIVERSITIES = [
  /* UK */
  "University of Oxford", "University of Cambridge", "Imperial College London", "UCL", "LSE",
  /* USA */
  "Harvard University", "Stanford University", "MIT", "Yale University", "Princeton University",
  /* Canada */
  "University of Toronto", "McGill University", "University of British Columbia",
  /* Australia */
  "Australian National University", "University of Melbourne", "University of Sydney", "Monash University",
  /* Germany */
  "Technical University of Munich", "Heidelberg University", "LMU Munich",
  /* Italy */
  "University of Bologna", "Sapienza University of Rome", "Politecnico di Milano",
  /* Ireland & NZ */
  "Trinity College Dublin", "University of Auckland",
  /* Europe Hub */
  "ETH Zurich", "Delft University of Technology", "Karolinska Institute", "University of Helsinki", "Lund University"
];

const REVIEWS = [
  { name: "Apex Training Node", role: "Global Partner", text: "UNICOU's automated voucher dispatch system is the fastest we've integrated in a decade." },
  { name: "West-Lakes Academy", role: "Institution", text: "Exceptional student matching and verification protocols. A trusted mobility partner." },
  { name: "Future Horizons", role: "Recruiter", text: "The CRM leads are high-quality and verified. Truly a unified platform for global success." }
];

const PartnerShowcase: React.FC = () => {
  return (
    <section className="py-32 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-[11px] font-black text-unicou-navy uppercase tracking-[0.4em] mb-4 block">Global Ecosystem</span>
          <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-slate-900 uppercase">
            Apply in World <span className="text-unicou-orange">Top Universities</span>
          </h2>
        </div>

        {/* University Name Marquee - Styled to look like logos */}
        <div className="overflow-hidden relative mb-24 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-1000 bg-white p-12 rounded-[3rem] border border-slate-200 shadow-inner">
          <div className="flex gap-24 animate-marquee whitespace-nowrap items-center">
            {[...UNIVERSITIES, ...UNIVERSITIES].map((uni, i) => (
              <div key={i} className="text-2xl font-black text-slate-400 hover:text-unicou-navy transition-all cursor-default tracking-tighter uppercase flex items-center gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-unicou-orange opacity-20" />
                {uni}
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {REVIEWS.map((rev, i) => (
            <div key={i} className="bg-white p-12 rounded-[3.5rem] border border-slate-200 hover:border-unicou-orange/30 transition-all group shadow-lg">
               <div className="flex gap-1.5 mb-8">
                 {[1,2,3,4,5].map(s => <span key={s} className="text-unicou-orange text-sm">★</span>)}
               </div>
               <p className="text-slate-600 text-lg italic leading-relaxed mb-10 font-medium">"{rev.text}"</p>
               <div className="flex items-center gap-6">
                 <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-unicou-navy font-black text-lg uppercase shadow-inner">
                   {rev.name.charAt(0)}
                 </div>
                 <div>
                   <h4 className="text-base font-bold text-slate-900">{rev.name}</h4>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{rev.role}</p>
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
          animation: marquee 60s linear infinite;
          display: flex;
          width: max-content;
        }
      `}</style>
    </section>
  );
};

export default PartnerShowcase;
