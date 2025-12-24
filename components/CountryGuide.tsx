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

  if (loading) return <div className="p-20 text-center animate-pulse">Establishing Nexus Connection...</div>;
  if (!guide) return <div className="p-20 text-center">Guide node not found in registry.</div>;

  // Simple parser for manual formatting in the database content
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('### ')) {
        return <h2 key={i} className="text-3xl font-display font-bold text-white mt-12 mb-6 tracking-tight">{line.replace('### ', '')}</h2>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-6 text-slate-300 mb-2 list-disc font-medium">{line.replace('- ', '')}</li>;
      }
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={i} className="text-slate-300 leading-relaxed mb-6 font-medium text-lg italic">
            {parts.map((p, idx) => idx % 2 === 1 ? <strong key={idx} className="text-primary-400">{p}</strong> : p)}
          </p>
        );
      }
      return line.trim() ? <p key={i} className="text-slate-300 leading-relaxed mb-6 font-medium text-lg italic">{line}</p> : <div key={i} className="h-4" />;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in duration-700">
      <MetaTags title={guide.title} description={guide.content.substring(0, 160)} />
      
      <div className="relative h-[500px] rounded-[3.5rem] overflow-hidden mb-16 shadow-3xl group">
        <img src={guide.heroImage} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={guide.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        <div className="absolute bottom-16 left-16 right-16">
          <div className="flex items-center gap-3 mb-6">
             <span className="px-4 py-1.5 bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Verified Registry</span>
             <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/10">Active Protocol</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-display font-bold text-white mb-4 tracking-tighter leading-none">{guide.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-12">
          <section className="glass p-12 md:p-16 rounded-[4rem] border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
               <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
            </div>
            
            <div className="relative z-10">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-500 mb-10 pb-4 border-b border-white/5">Strategic Academic Intelligence</h2>
              <div className="prose prose-invert prose-lg max-w-none">
                {renderContent(guide.content)}
              </div>
              
              <div className="mt-20 pt-20 border-t border-slate-800">
                 <button 
                   onClick={onRegister}
                   className="w-full py-8 bg-unicou-orange hover:bg-rose-600 text-white rounded-[2.5rem] font-black text-2xl uppercase tracking-[0.1em] transition-all shadow-3xl shadow-rose-500/20 active:scale-95 flex items-center justify-center gap-6 group/cta"
                 >
                   REGISTER FOR STUDENT PORTAL
                   <svg className="w-8 h-8 group-hover/cta:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                 </button>
                 <div className="mt-10 flex flex-col items-center gap-2">
                    <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.3em]">Direct Fulfillment Support</p>
                    <a href="mailto:connect@unicou.uk" className="text-lg font-bold text-primary-400 hover:text-primary-300 transition-colors">connect@unicou.uk</a>
                 </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex justify-between items-end mb-10">
               <div>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Institution Directory</span>
                 <h2 className="text-4xl font-display font-bold">Accredited <span className="text-primary-400">Nodes</span></h2>
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {unis.map(u => (
                <div key={u.id} className="glass p-10 rounded-[3rem] border border-slate-800 hover:border-primary-500/30 transition-all cursor-pointer group shadow-xl" onClick={() => onViewUniversity(u.slug)}>
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-white p-4 shadow-inner flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
                       <img src={u.logo} className="max-w-full max-h-full object-contain" alt={u.name} />
                    </div>
                    <div>
                      <h3 className="font-bold group-hover:text-primary-400 transition-colors text-xl leading-tight">{u.name}</h3>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">World Rank: #{u.ranking}</p>
                    </div>
                  </div>
                  <p className="text-slate-400 line-clamp-2 leading-relaxed italic mb-8 font-medium">"{u.description}"</p>
                  <div className="flex justify-between items-center pt-6 border-t border-slate-900">
                     <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest group-hover:text-slate-400 transition-colors">View Academic Profile</span>
                     <svg className="w-5 h-5 text-primary-400 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>
              ))}
              {unis.length === 0 && (
                <div className="col-span-full py-20 glass rounded-[3rem] border-dashed border-slate-800 text-center text-slate-600 italic font-medium flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800">
                    <svg className="w-8 h-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.054.437M12 4v4m0 0L10 6m2 2l2-2" /></svg>
                  </div>
                  Institution nodes for this region are currently being verified by the global nexus.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="sticky top-32 space-y-8">
            <div className="glass p-10 rounded-[3rem] border border-primary-500/20 shadow-3xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <svg className="w-32 h-32 text-primary-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.8 10.9c-.27-.59-.79-1.05-1.4-1.26l-3-1.05c-.6-.21-1.07-.73-1.27-1.35l-1.05-3c-.21-.6-.73-1.07-1.35-1.27l-3-1.05c-.6-.21-1.07-.73-1.27-1.35L-4.6 3" /></svg>
               </div>
               
               <h3 className="text-xl font-bold mb-10 tracking-tight flex items-center gap-3">
                 <span className="w-8 h-8 rounded-xl bg-primary-600/10 text-primary-400 flex items-center justify-center text-xs">📊</span>
                 Fast-Track Analytics
               </h3>
               
               <div className="space-y-8 relative z-10">
                 <div className="bg-slate-950/60 p-8 rounded-[2rem] border border-slate-900 shadow-inner group hover:border-primary-500/30 transition-colors">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Estimated Monthly Living</p>
                   <p className="text-3xl font-display font-bold text-white tracking-tighter">{guide.costOfLiving}</p>
                 </div>
                 
                 <div className="bg-slate-950/60 p-8 rounded-[2rem] border border-slate-900 shadow-inner group hover:border-emerald-500/30 transition-colors">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Visa Protocol Status</p>
                   <p className="text-lg font-bold text-emerald-400 uppercase tracking-tight leading-tight">{guide.visaRequirements}</p>
                 </div>
                 
                 <div className="pt-8 border-t border-slate-800">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Service Handlers</p>
                    <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                      <div className="w-12 h-12 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-indigo-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-200">UniCou Global Hub</p>
                        <p className="text-[9px] text-slate-600 font-black uppercase tracking-tighter">Unified Infrastructure v2.1</p>
                      </div>
                    </div>
                 </div>
               </div>
            </div>

            <div className="p-10 bg-gradient-to-br from-slate-900 to-slate-950 rounded-[3rem] border border-slate-800 shadow-2xl group">
               <h4 className="text-lg font-bold text-white mb-4">Need personalized help?</h4>
               <p className="text-slate-500 text-sm leading-relaxed mb-8">Our expert advisors are ready to optimize your academic trajectory for the 2025 intake.</p>
               <button 
                 onClick={onRegister}
                 className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-2xl"
               >
                 Book Expert Consult
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryGuide;