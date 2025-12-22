
import React from 'react';
import { ViewState } from '../types';

interface ResourcesProps {
  onNavigate: (view: ViewState) => void;
}

const Resources: React.FC<ResourcesProps> = ({ onNavigate }) => {
  const blogs = [
    { title: "UK Visa Policy 2026: The Definitive Guide", date: "Oct 22, 2024", category: "News", readTime: "5 min", excerpt: "Exploring the new points-based system updates for international students..." },
    { title: "7 Secrets to Band 8.5 in IELTS Speaking", date: "Oct 18, 2024", category: "Guides", readTime: "12 min", excerpt: "Fluency markers and lexical resource strategies that top examiners look for..." },
    { title: "Digital Nomad Visas in Europe", date: "Oct 15, 2024", category: "Trends", readTime: "8 min", excerpt: "Portugal, Spain, and Greece have streamlined remote work pathways..." },
  ];

  const tools = [
    { 
      title: "SOP Generator", 
      type: "AI Utility", 
      icon: "✨",
      action: () => onNavigate({ type: 'apply', formType: 'general', context: 'SOP Generation Request' })
    },
    { 
      title: "Cost of Living Index", 
      type: "Global Data", 
      icon: "🧮",
      action: () => onNavigate({ type: 'country-list' })
    },
    { 
      title: "University Matcher", 
      type: "Predictive AI", 
      icon: "🎓",
      action: () => onNavigate({ type: 'apply', formType: 'study-abroad', context: 'AI Matching Assessment' })
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-700">
      <div className="mb-20">
        <span className="text-[10px] font-black text-unicou-orange uppercase tracking-[0.4em] mb-4 block">Knowledge Hub</span>
        <h1 className="text-4xl md:text-7xl font-display font-bold mb-6 tracking-tighter">Academic <span className="text-unicou-orange">Library</span></h1>
        <p className="text-slate-400 text-xl max-w-2xl font-medium leading-relaxed italic">
          High-fidelity guides, strategic blogs, and automated tools for the modern global scholar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-12">
          <div className="flex justify-between items-center border-b border-slate-900 pb-4">
             <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Latest Transmissions</h4>
             <button className="text-[10px] font-bold text-primary-400 hover:text-white transition-colors">View All Archive</button>
          </div>
          
          <div className="grid grid-cols-1 gap-12">
            {blogs.map((blog, i) => (
              <div key={i} className="group cursor-pointer flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-64 aspect-[4/3] bg-slate-900 rounded-[2rem] border border-slate-800 overflow-hidden relative shrink-0">
                   <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/90 to-transparent" />
                   <div className="absolute bottom-4 left-4">
                      <span className="text-[9px] font-black uppercase text-primary-400 bg-primary-400/10 px-3 py-1 rounded-full border border-primary-500/20">{blog.category}</span>
                   </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-unicou-orange transition-colors leading-tight">{blog.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-2">{blog.excerpt}</p>
                  <div className="flex items-center gap-6 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> {blog.date}</span>
                    <span className="flex items-center gap-2"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> {blog.readTime} Read</span>
                    <button className="text-primary-400 group-hover:underline">Establish Link →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-10">
          <div>
            <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-8 border-b border-slate-900 pb-4">Digital Utilities</h4>
            <div className="space-y-4">
              {tools.map((tool, i) => (
                <button 
                  key={i} 
                  onClick={tool.action}
                  className="w-full text-left glass p-6 rounded-[2rem] border border-slate-800 hover:border-primary-500/50 transition-all flex items-center gap-6 group shadow-xl active:scale-95"
                >
                  <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner">
                    {tool.icon}
                  </div>
                  <div className="flex-grow">
                    <h5 className="font-bold text-slate-100 text-sm group-hover:text-primary-400">{tool.title}</h5>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">{tool.type}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 group-hover:bg-primary-600 group-hover:text-white transition-all">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="p-10 bg-unicou-navy rounded-[3rem] relative overflow-hidden shadow-3xl border border-white/5">
             <div className="relative z-10">
               <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
               </div>
               <h4 className="text-2xl font-bold text-white mb-3 tracking-tight">Sync Alerts</h4>
               <p className="text-slate-300 text-sm mb-8 leading-relaxed font-medium">Connect your professional node to receive real-time push notifications on global policy shifts.</p>
               <button className="w-full py-5 bg-white text-unicou-navy rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                 Establish Sync Link
               </button>
             </div>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-[40px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
