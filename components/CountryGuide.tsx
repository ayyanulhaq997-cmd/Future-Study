
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
      setLoading(true);
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

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase tracking-[0.4em]">Establishing Academic Connection...</div>;
  if (!guide) return <div className="p-20 text-center font-black uppercase text-slate-400">Node Error: Guide not found for {slug}.</div>;

  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('### ')) {
        return <h2 key={i} className="text-3xl font-display font-black text-slate-950 mt-12 mb-6 tracking-tight uppercase border-b-4 border-unicou-orange/20 pb-2 inline-block">{line.replace('### ', '')}</h2>;
      }
      return line.trim() ? <p key={i} className="text-slate-700 leading-relaxed mb-6 font-semibold text-lg italic">{line}</p> : <div key={i} className="h-4" />;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-700 bg-white">
      <MetaTags title={guide.title} description={guide.content.substring(0, 160)} />
      
      <div className="relative h-[500px] rounded-[3.5rem] overflow-hidden mb-16 shadow-premium group">
        <img src={guide.heroImage} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={guide.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        <div className="absolute bottom-16 left-16 right-16">
          <div className="flex items-center gap-3 mb-6">
             <span className="px-5 py-2 bg-unicou-navy text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Official Destination Node</span>
             <span className="px-5 py-2 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/20">Updated: 2025/2026 Cycle</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-display font-black text-white mb-4 tracking-tighter leading-none uppercase">{guide.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-12">
          <section className="bg-slate-50 p-12 md:p-16 rounded-[4rem] border border-slate-200 shadow-inner relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-unicou-navy mb-10 pb-4 border-b border-slate-200">University Admission Insights</h2>
              <div className="prose prose-lg max-w-none font-sans">
                {renderContent(guide.content)}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-display font-black text-slate-950 mb-10 uppercase tracking-tighter">Featured Academic <span className="text-unicou-navy">Institutions</span></h2>
            {unis.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {unis.map(u => (
                  <div key={u.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 hover:border-unicou-navy/20 transition-all cursor-pointer group shadow-premium" onClick={() => onViewUniversity(u.slug)}>
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 p-3 shadow-inner border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                         <img src={u.logo} className="max-w-full max-h-full object-contain" alt={u.name} />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 group-hover:text-unicou-navy transition-colors text-lg leading-tight uppercase">{u.name}</h3>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">QS World Ranking: #{u.ranking}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-unicou-navy transition-colors">View University Node</span>
                       <svg className="w-5 h-5 text-unicou-navy group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 text-center">
                 <p className="text-slate-400 font-bold italic">"University registry syncing for this destination. Contact connect@unicou.uk for direct admission nodes."</p>
              </div>
            )}
          </section>

          <section className="bg-unicou-navy p-12 md:p-20 rounded-[4rem] text-center text-white relative overflow-hidden shadow-3xl">
             <div className="relative z-10">
                <h3 className="text-4xl font-display font-black mb-6 tracking-tighter uppercase leading-none">Ready to start your <span className="text-unicou-orange">Global Journey?</span></h3>
                <p className="text-slate-300 text-lg font-bold italic mb-12 max-w-xl mx-auto">"Requirement I.viii.i: Join the UNICOU Admission Hub to receive mission-critical support for your 2025/2026 intake."</p>
                <button onClick={onRegister} className="px-12 py-5 bg-unicou-orange hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-action active:scale-95 flex items-center justify-center gap-4 mx-auto group">
                   OPEN APPLICATION TERMINAL
                   <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
             </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="sticky top-32 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-premium relative overflow-hidden">
               <h3 className="text-xl font-black mb-8 tracking-tighter text-slate-950 uppercase border-b border-slate-50 pb-4">Destination Facts</h3>
               <div className="space-y-6">
                 <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Living Expenses* Annual</p>
                   <p className="text-xl font-display font-black text-slate-950 tracking-tighter uppercase">{guide.costOfLiving}</p>
                 </div>
                 <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tuition Fee* Annual</p>
                   <p className="text-xl font-display font-black text-unicou-navy tracking-tighter uppercase">{guide.visaRequirements}</p>
                 </div>
               </div>
            </div>
            <div className="p-10 bg-slate-900 rounded-[3rem] shadow-3xl text-white">
               <h4 className="text-lg font-black uppercase mb-4 tracking-tighter">Need Verification?</h4>
               <p className="text-slate-400 text-sm leading-relaxed mb-8 font-bold italic">"Speak to a verified counselor to finalize your study node."</p>
               <button onClick={onRegister} className="w-full py-4 bg-unicou-orange text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 shadow-action">CONSULT A SPECIALIST</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryGuide;
