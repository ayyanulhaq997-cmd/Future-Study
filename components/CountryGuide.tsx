
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

  if (loading) return <div className="p-20 text-center animate-pulse">Loading Guide...</div>;
  if (!guide) return <div className="p-20 text-center">Guide not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <MetaTags title={guide.title} description={guide.content.substring(0, 160)} />
      
      <div className="relative h-96 rounded-3xl overflow-hidden mb-12 shadow-2xl">
        <img src={guide.heroImage} className="w-full h-full object-cover" alt={guide.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 tracking-tighter">{guide.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section className="glass p-10 rounded-[2.5rem] border-slate-800">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500 mb-6">Strategic Overview</h2>
            <div className="prose prose-invert prose-lg max-w-none">
              {guide.content.split('\n').map((para, i) => (
                <p key={i} className="text-slate-300 leading-relaxed mb-6 font-medium text-lg italic">
                  {para}
                </p>
              ))}
            </div>
            
            <div className="mt-12 pt-12 border-t border-slate-800">
               <button 
                 onClick={onRegister}
                 className="w-full py-6 bg-unicou-orange hover:bg-orange-600 text-white rounded-2xl font-black text-lg uppercase tracking-widest transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4"
               >
                 Initialize Student Registration
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
               </button>
               <p className="text-center text-[10px] text-slate-600 font-bold uppercase mt-4 tracking-widest">Connect with our regional experts at connect@unicou.uk</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-primary-600/10 text-primary-400 flex items-center justify-center text-sm">01</span>
              Top Accredited Institutions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {unis.map(u => (
                <div key={u.id} className="glass p-8 rounded-[2rem] border border-slate-800 hover:border-primary-500/30 transition-all cursor-pointer group" onClick={() => onViewUniversity(u.slug)}>
                  <div className="flex items-center gap-4 mb-6">
                    <img src={u.logo} className="w-14 h-14 rounded-xl bg-white p-2 shadow-inner" alt={u.name} />
                    <div>
                      <h3 className="font-bold group-hover:text-primary-400 transition-colors text-lg">{u.name}</h3>
                      <p className="text-xs text-slate-500 font-mono">World Rank: #{u.ranking}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed italic mb-6">"{u.description}"</p>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-900">
                     <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Institution Profile</span>
                     <svg className="w-4 h-4 text-primary-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>
              ))}
              {unis.length === 0 && (
                <div className="col-span-full py-12 glass rounded-3xl border-dashed border-slate-800 text-center text-slate-600 italic">
                  Institution nodes for this region are currently being verified.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border border-primary-500/20 sticky top-24">
            <h3 className="text-lg font-bold mb-8 uppercase tracking-tighter">Fast-Track Stats</h3>
            <div className="space-y-8">
              <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Estimated Monthly Living</p>
                <p className="text-2xl font-display font-bold text-white tracking-tighter">{guide.costOfLiving}</p>
              </div>
              <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Visa Protocol Status</p>
                <p className="text-sm font-bold text-emerald-400 uppercase tracking-tight">{guide.visaRequirements}</p>
              </div>
              
              <div className="pt-4">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Service Handlers</p>
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                     <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                   </div>
                   <div>
                     <p className="text-xs font-bold text-slate-200">UniCou Global Hub</p>
                     <p className="text-[9px] text-slate-500 font-black uppercase">Fulfillment Desk Active</p>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryGuide;
