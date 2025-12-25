import React from 'react';

const features = [
  {
    title: "Instant Delivery",
    description: "Vouchers are automatically retrieved from our secure vault and dispatched the second payment is verified.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Secure Storage",
    description: "Our API vault uses bank-grade encryption to manage and store thousands of unique test vouchers.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Tiered Discounts",
    description: "Our pricing engine calculates automatic discounts for bulk orders based on your agent tier level.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
    color: "from-orange-500 to-red-500"
  },
  {
    title: "Global Authenticity",
    description: "Every code is directly imported from exam providers, ensuring 100% validity and peace of mind.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "from-green-500 to-emerald-500"
  }
];

const Features: React.FC = () => {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto bg-white">
      <div className="text-center mb-24">
        <h2 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">Our <span className="text-unicou-orange">Core Infrastructure</span></h2>
        <div className="h-1.5 w-20 bg-unicou-orange mx-auto rounded-full mt-6" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {features.map((feature, idx) => (
          <div key={idx} className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-200 hover:border-unicou-navy/10 hover:bg-white hover:shadow-2xl transition-all duration-500 group">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform shadow-lg`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-4 text-slate-900 tracking-tight">{feature.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;