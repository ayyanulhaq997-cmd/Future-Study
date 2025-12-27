import React from 'react';

const features = [
  {
    title: "Instant Delivery",
    description: "Vouchers are automatically retrieved from our secure vault and dispatched the second payment is verified.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: "bg-blue-600",
    accent: "text-blue-600",
    shadow: "shadow-blue-500/20"
  },
  {
    title: "Secure Storage",
    description: "Our API vault uses bank-grade encryption to manage and store thousands of unique test vouchers.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    color: "bg-purple-600",
    accent: "text-purple-600",
    shadow: "shadow-purple-500/20"
  },
  {
    title: "Tiered Discounts",
    description: "Our pricing engine calculates automatic discounts for bulk orders based on your agent tier level.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
    color: "bg-unicou-orange",
    accent: "text-unicou-orange",
    shadow: "shadow-orange-500/20"
  },
  {
    title: "Global Authenticity",
    description: "Every code is directly imported from exam providers, ensuring 100% validity and peace of mind.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "bg-emerald-600",
    accent: "text-emerald-600",
    shadow: "shadow-emerald-500/20"
  }
];

const Features: React.FC = () => {
  return (
    <section className="py-40 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-24 relative">
        <span className="text-[11px] font-black text-unicou-orange uppercase tracking-[0.5em] mb-4 block">Core Capabilities</span>
        <h2 className="text-5xl md:text-6xl font-display font-black text-slate-900 tracking-tight leading-none">The <span className="text-unicou-navy">Nexus</span> Standard</h2>
        <div className="h-2 w-24 bg-unicou-orange mx-auto rounded-full mt-8" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {features.map((feature, idx) => (
          <div key={idx} className="bg-white/80 backdrop-blur-xl p-12 rounded-[3.5rem] border border-slate-100 hover:border-unicou-navy/10 hover:bg-white hover:shadow-nexus transition-all duration-700 group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-[4rem]`} />
            
            <div className={`w-16 h-16 rounded-[1.5rem] ${feature.color} flex items-center justify-center text-white mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl ${feature.shadow}`}>
              {feature.icon}
            </div>
            
            <h3 className={`text-2xl font-black mb-6 text-slate-900 tracking-tight group-hover:${feature.accent} transition-colors`}>{feature.title}</h3>
            <p className="text-slate-600 text-base leading-relaxed font-bold italic">
              "{feature.description}"
            </p>
            
            <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-700">
               <span className={`text-[10px] font-black uppercase tracking-widest ${feature.accent}`}>Protocol Active</span>
               <div className={`w-2 h-2 rounded-full ${feature.color} animate-pulse`} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;