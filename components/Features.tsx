
import React from 'react';

const features = [
  {
    title: "Instant Delivery",
    description: "Vouchers are retrieved from our secure vault and dispatched the second payment is verified.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    ),
    color: "bg-unicou-orange"
  },
  {
    title: "Secure Storage",
    description: "Our vault uses industry-grade encryption to manage thousands of unique test vouchers.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
    ),
    color: "bg-unicou-navy"
  },
  {
    title: "Bulk Discounts",
    description: "Our engine calculates automatic discounts for agency partners based on tier level.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
    ),
    color: "bg-unicou-orange"
  },
  {
    title: "Global Validity",
    description: "Every code is directly imported from providers, ensuring 100% authenticity.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
    color: "bg-emerald-400"
  }
];

const Features: React.FC = () => {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto bg-white">
      <div className="text-center mb-20">
        <div className="flex items-center justify-center gap-2 mb-4">
           <div className="w-2 h-2 rounded-full bg-unicou-orange"></div>
           <span className="text-[11px] font-bold text-unicou-orange uppercase tracking-[0.4em]">The UNICOU Standard</span>
           <div className="w-2 h-2 rounded-full bg-unicou-orange"></div>
        </div>
        <h2 className="text-5xl font-display font-bold text-unicou-navy">Operational Excellence</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {features.map((feature, idx) => (
          <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-unicou-orange/20 hover:shadow-premium transition-all duration-500 group relative overflow-hidden">
            {/* Small eye-touching pop shape in each card */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-bl-[2.5rem] flex items-center justify-center group-hover:bg-unicou-orange/5 transition-colors">
               <div className="w-1.5 h-1.5 rounded-full bg-unicou-orange opacity-30 group-hover:opacity-100"></div>
            </div>

            <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform shadow-lg ${feature.color === 'bg-unicou-orange' ? 'shadow-action' : ''}`}>
              {feature.icon}
            </div>
            <h3 className="text-lg font-bold mb-4 text-unicou-navy uppercase tracking-tight">{feature.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              {feature.description}
            </p>
            <div className="mt-6 vibrant-strip opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
