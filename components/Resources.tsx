import React, { useState } from 'react';
import { ViewState } from '../types';

interface ResourcesProps {
  onNavigate: (view: ViewState) => void;
}

type ResourceTab = 'news' | 'blogs' | 'scholarships';

const Resources: React.FC<ResourcesProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<ResourceTab>('news');

  const news = [
    { title: "UK eVisas Mandatory by 2025", date: "Jan 10, 2025", category: "Visa Policy", tag: "Critical", excerpt: "The Home Office has confirmed the full transition to digital-only immigration status for all international students." },
    { title: "Australia Caps 2025 Intake Levels", date: "Jan 05, 2025", category: "Education", tag: "Policy", excerpt: "New National Planning Levels (NPL) established for international student commencements across universities." },
    { title: "Canada SDS Program Structural Update", date: "Dec 20, 2024", category: "Migration", tag: "Process", excerpt: "Updates to the Student Direct Stream financial requirements for upcoming intakes." }
  ];

  const blogs = [
    { title: "7 Keys to a Winning SOP in 2025", category: "Admissions", readTime: "8 min", excerpt: "How to structure your Statement of Purpose to meet the evolving expectations of UK and USA admission committees." },
    { title: "IELTS vs PTE: The Strategic Choice", category: "Testing", readTime: "12 min", excerpt: "A data-driven comparison of exam formats, scoring metrics, and university acceptance nodes." },
    { title: "Living in London on a Budget", category: "Lifestyle", readTime: "15 min", excerpt: "A student guide to navigating the UK capital without breaking the bank." }
  ];

  const scholarships = [
    { title: "DSU Regional Grant (Italy)", value: "Full Tuition + €7,000", eligibility: "Income Based", deadline: "Rolling" },
    { title: "Chevening Scholarship (UK)", value: "Fully Funded", eligibility: "Leadership Potential", deadline: "Nov 2025" },
    { title: "DAAD Excellence Award (Germany)", value: "€934 / Month", eligibility: "Academic Merit", deadline: "Variable" }
  ];

  const tools = [
    { title: "SOP Generator", icon: "✨", type: "AI Utility" },
    { title: "Visa Predictor", icon: "🔮", type: "Logic Node" },
    { title: "Finance Calculator", icon: "🧮", type: "Data Tool" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 view-container pb-32 animate-in fade-in duration-1000 bg-white">
      <div className="mb-24">
        <span className="text-[11px] font-black text-unicou-orange uppercase tracking-[0.5em] mb-4 block">Knowledge Infrastructure</span>
        <h1 className="text-6xl md:text-[8rem] font-display font-black text-slate-950 mb-8 tracking-tighter leading-none">Global <span className="text-unicou-navy">Intelligence</span></h1>
        <p className="text-2xl text-slate-800 max-w-2xl leading-relaxed font-bold italic border-l-8 border-unicou-orange pl-10">
          "The definitive repository for academic news, strategic guidance, and global scholarship mappings."
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        <div className="lg:col-span-8 flex-grow">
          {/* TAB SYSTEM */}
          <div className="flex bg-slate-50 p-2 rounded-[2.5rem] border border-slate-200 mb-12 shadow-inner overflow-x-auto no-scrollbar">
            {(['news', 'blogs', 'scholarships'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-10 py-4 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab ? 'bg-white text-unicou-navy shadow-xl border border-slate-200' : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                {tab === 'news' ? 'NEWS FEED' : tab === 'blogs' ? 'EXPERT BLOGS' : 'SCHOLARSHIP REGISTRY'}
              </button>
            ))}
          </div>

          <div className="space-y-10 min-h-[600px]">
            {activeTab === 'news' && news.map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-[3.5rem] border border-slate-100 hover:border-unicou-orange/20 transition-all shadow-lg group">
                <div className="flex justify-between items-start mb-6">
                  <span className="px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-red-100">{item.tag}</span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">{item.date}</span>
                </div>
                <h3 className="text-3xl font-display font-black text-slate-950 group-hover:text-unicou-navy transition-colors mb-4">{item.title}</h3>
                <p className="text-slate-600 text-lg font-semibold italic leading-relaxed mb-8">"{item.excerpt}"</p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Vertical: {item.category}</span>
                  <button className="text-unicou-orange font-black text-[11px] uppercase tracking-widest flex items-center gap-2 group/btn">
                    Read Report <svg className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </div>
              </div>
            ))}

            {activeTab === 'blogs' && blogs.map((item, i) => (
              <div key={i} className="group bg-slate-50 p-10 rounded-[3.5rem] border border-slate-100 hover:bg-white hover:border-unicou-navy/20 transition-all shadow-inner hover:shadow-xl">
                 <div className="flex items-center gap-4 mb-6">
                    <span className="px-4 py-1.5 bg-unicou-navy text-white rounded-full text-[9px] font-black uppercase tracking-widest">{item.category}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.readTime} READ</span>
                 </div>
                 <h3 className="text-3xl font-display font-black text-slate-950 mb-6 group-hover:text-unicou-navy transition-colors">{item.title}</h3>
                 <p className="text-slate-600 text-lg font-semibold italic leading-relaxed mb-8">"{item.excerpt}"</p>
                 <button className="px-8 py-3 bg-white border-2 border-slate-950 text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all">ENTER MASTERCLASS</button>
              </div>
            ))}

            {activeTab === 'scholarships' && scholarships.map((item, i) => (
              <div key={i} className="bg-white p-12 rounded-[3.5rem] border border-slate-100 hover:shadow-vibrant transition-all flex flex-col md:flex-row justify-between items-center gap-8 group">
                <div className="flex-grow">
                   <h3 className="text-2xl font-display font-black text-slate-950 mb-2 group-hover:text-unicou-orange transition-colors">{item.title}</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">ELIBILITY: {item.eligibility}</p>
                   <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                      <span className="text-xl font-display font-black">{item.value}</span>
                   </div>
                </div>
                <div className="text-center md:text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">DEADLINE</p>
                   <p className="text-xl font-black text-slate-950 mb-6">{item.deadline}</p>
                   <button onClick={() => onNavigate({ type: 'join-hub' })} className="px-10 py-4 bg-unicou-navy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">CHECK ELIGIBILITY</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-96 space-y-10">
          <div className="bg-slate-900 p-10 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 font-display font-black text-7xl select-none group-hover:scale-110 transition-transform">AI</div>
            <h4 className="text-xl font-black text-white mb-8 tracking-tighter">Predictive Utilities</h4>
            <div className="space-y-4">
              {tools.map(tool => (
                <button key={tool.title} className="w-full p-6 bg-white/5 border border-white/10 rounded-3xl text-left hover:bg-unicou-orange transition-all flex items-center gap-5 group/item shadow-inner">
                   <span className="text-2xl">{tool.icon}</span>
                   <div>
                      <p className="text-white font-bold text-sm group-hover/item:text-white">{tool.title}</p>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover/item:text-white/80">{tool.type}</p>
                   </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
             <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Registry Sync</h4>
             <p className="text-slate-800 font-bold italic leading-relaxed mb-10">"Receive mission-critical alerts on global education shifts via the UNICOU WhatsApp node."</p>
             <button className="w-full py-6 bg-unicou-navy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-3">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
               CONNECT TO REGISTRY
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;