
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { CountryGuide as ICountryGuide, University } from '../types';
import MetaTags from './MetaTags';

const CountryGuide: React.FC<{ slug: string; onViewUniversity: (slug: string) => void; onRegister: () => void }> = ({ slug, onViewUniversity, onRegister }) => {
  const [guide, setGuide] = useState<ICountryGuide | null>(null);
  const [unis, setUnis] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const g = await api.getGuideBySlug(slug);
      if (g) {
        setGuide(g);
        const u = await api.getUniversitiesByCountry(g.countryId);
        setUnis(u);
      }
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  if (loading) return <div className="p-20 text-center animate-pulse text-slate-800 font-black uppercase tracking-widest">Loading Study Guide...</div>;
  if (!guide) return <div className="p-20 text-center">Guide not found.</div>;

  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('### ')) {
        return <h2 key={i} className="text-3xl font-display font-black text-slate-950 mt-12 mb-6 tracking-tight uppercase">{line.replace('### ', '')}</h2>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-6 text-slate-700 mb-3 list-disc font-bold italic">{line.replace('- ', '')}</li>;
      }
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={i} className="text-slate-800 leading-relaxed mb-6 font-bold text-lg italic border-l-4 border-unicou-navy pl-6">
            {parts.map((p, idx) => idx % 2 === 1 ? <strong key={idx} className="text-unicou-orange">{p}</strong> : p)}
          </p>
        );
      }
      return line.trim() ? <p key={i} className="text-slate-700 leading-relaxed mb-6 font-semibold text-lg italic">{line}</p> : <div key={i} className="h-4" />;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-700 bg-white">
      <MetaTags title={guide.title} description={guide.content.substring(0, 160)} />
      
      <div className="relative h-[600px] rounded-[3.5rem] overflow-hidden mb-16 shadow-3xl group">
        <img src={guide.heroImage} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={guide.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        <div className="absolute bottom-16 left-16 right-16">
          <div className="flex items-center gap-3 mb-6">
             <span className="px-5 py-2 bg-unicou-navy text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Official Guide</span>
             <span className="px-5 py-2 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/20">Updated 2025/2026</span>
          </div>
          <h1 className="text-6xl md:text-[5.5rem] font-display font-black text-white mb-4 tracking-tighter leading-none uppercase">{guide.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-12">
          <section className="bg-slate-50 p-12 md:p-16 rounded-[4rem] border border-slate-200 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-unicou-navy mb-10 pb-4 border-b border-slate-200">University Admission Insights</h2>
              <div className="prose prose-lg max-w-none">
                {renderContent(guide.content)}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-4xl font-display font-black text-slate-950 mb-10 uppercase">Top Featured <span className="text-unicou-navy">Universities</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {unis.map(u => (
                <div key={u.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 hover:border-unicou-navy/20 transition-all cursor-pointer group shadow-lg" onClick={() => onViewUniversity(u.slug)}>
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-white p-4 shadow-inner border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                       <img src={u.logo} className="max-w-full max-h-full object-contain" alt={u.name} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 group-hover:text-unicou-navy transition-colors text-xl leading-tight uppercase">{u.name}</h3>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Ranked #{u.ranking}</p>
                    </div>
                  </div>
                  <p className="text-slate-600 line-clamp-2 leading-relaxed italic mb-8 font-bold">"{u.description}"</p>
                  <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-unicou-navy transition-colors">View University Details</span>
                     <svg className="w-5 h-5 text-unicou-navy group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-unicou-navy p-12 md:p-20 rounded-[4rem] text-center text-white relative overflow-hidden shadow-3xl">
             <div className="absolute top-0 right-0 p-20 opacity-5">
                <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
             </div>
             <div className="relative z-10">
                <h3 className="text-4xl md:text-5xl font-display font-black mb-6 tracking-tighter uppercase">Ready to take the first step?</h3>
                <p className="text-slate-300 text-xl font-bold italic mb-12 max-w-2xl mx-auto">"Join thousands of students who have launched their global careers through the UniCou hub. Let’s make 2025/2026 the year of your move."</p>
                
                <button onClick={onRegister} className="px-16 py-7 bg-unicou-orange hover:bg-orange-600 text-white rounded-[2.5rem] font-black text-xl uppercase tracking-[0.2em] transition-all shadow-action active:scale-95 flex items-center justify-center gap-6 mx-auto group">
                   OPEN REGISTRATION FORM
                   <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
                
                <div className="mt-12 pt-12 border-t border-white/10 flex flex-col items-center gap-4">
                   <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em]">Direct Communication Node</p>
                   <a href="mailto:connect@unicou.uk" className="text-2xl font-black text-unicou-vibrant hover:text-white transition-colors tracking-tight">connect@unicou.uk</a>
                </div>
             </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="sticky top-32 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl relative overflow-hidden">
               <h3 className="text-xl font-black mb-10 tracking-tight text-slate-950 flex items-center gap-3">
                 <span className="w-8 h-8 rounded-xl bg-slate-50 text-unicou-navy flex items-center justify-center text-xs">📊</span>
                 Cost & Fee Facts
               </h3>
               <div className="space-y-8">
                 <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Living Expenses* Annual</p>
                   <p className="text-2xl font-display font-black text-slate-950 tracking-tighter uppercase">{guide.costOfLiving}</p>
                 </div>
                 <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tuition Fee* Annual</p>
                   <p className="text-2xl font-display font-black text-unicou-navy tracking-tighter uppercase">{guide.visaRequirements}</p>
                 </div>
               </div>
            </div>
            <div className="p-10 bg-unicou-navy rounded-[3rem] shadow-3xl group">
               <h4 className="text-xl font-black text-white mb-4 uppercase tracking-tighter">Strategic Consultation</h4>
               <p className="text-slate-300 text-sm leading-relaxed mb-8 font-bold italic">"Our expert advisors are ready to help you plan your studies for the 2025/2026 intake."</p>
               <button onClick={onRegister} className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-2xl">BOOK A FREE CONSULTATION</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryGuide;
