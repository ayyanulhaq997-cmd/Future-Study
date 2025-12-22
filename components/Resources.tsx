
import React from 'react';

const Resources: React.FC = () => {
  const blogs = [
    { title: "UK Visa Policy 2024: New Updates", date: "Oct 12, 2024", category: "News", readTime: "5 min" },
    { title: "Mastering the PTE Speaking Module", date: "Oct 08, 2024", category: "Guides", readTime: "12 min" },
    { title: "Scholarship Guide for Europe", date: "Oct 05, 2024", category: "Scholarships", readTime: "8 min" },
  ];

  const tools = [
    { title: "Statement of Purpose Generator", type: "AI Tool", icon: "✨" },
    { title: "Cost of Living Index", type: "Global Tool", icon: "🧮" },
    { title: "Exam Pattern Analyser", type: "Training Node", icon: "📊" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-700">
      <div className="mb-20">
        <h1 className="text-4xl md:text-7xl font-display font-bold mb-4 tracking-tighter">Academic <span className="text-[#f15a24]">Library</span></h1>
        <p className="text-slate-400 text-lg max-w-2xl font-medium">Blogs, guides, and articles curated for the global mobility cycle.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* BLOGS */}
        <div className="lg:col-span-8 space-y-12">
          <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-8 border-b border-slate-900 pb-4">Featured Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((blog, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[16/10] bg-slate-900 rounded-[2.5rem] border border-slate-800 mb-6 overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                   <div className="absolute bottom-6 left-6">
                      <span className="text-[9px] font-black uppercase text-primary-400 bg-primary-400/10 px-2.5 py-1 rounded-full border border-primary-500/20">{blog.category}</span>
                   </div>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary-400 transition-colors leading-tight">{blog.title}</h3>
                <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>{blog.date}</span>
                  <span>•</span>
                  <span>{blog.readTime} Read</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SIDEBAR TOOLS */}
        <div className="lg:col-span-4 space-y-8">
          <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-8 border-b border-slate-900 pb-4">Internal Tools</h4>
          {tools.map((tool, i) => (
            <div key={i} className="glass p-6 rounded-3xl border border-slate-800 hover:border-primary-500/30 transition-all flex items-center gap-6 group cursor-pointer">
              <div className="text-4xl group-hover:scale-110 transition-transform">{tool.icon}</div>
              <div>
                <h5 className="font-bold text-slate-200">{tool.title}</h5>
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{tool.type}</p>
              </div>
              <svg className="w-5 h-5 ml-auto text-slate-700 group-hover:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
          ))}
          
          <div className="p-8 bg-unicou-navy rounded-[2.5rem] mt-12 relative overflow-hidden shadow-2xl">
             <div className="relative z-10">
               <h4 className="text-2xl font-bold text-white mb-2">Push Sync</h4>
               <p className="text-slate-300 text-sm mb-6">Get real-time news push notifications on scholarship nodes.</p>
               <button className="w-full py-4 bg-white text-unicou-navy rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Establish Connection</button>
             </div>
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/></svg>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
