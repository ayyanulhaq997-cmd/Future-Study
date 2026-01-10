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

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase tracking-[0.4em]">Synchronizing Academic Node...</div>;
  if (!guide) return <div className="p-20 text-center font-black uppercase text-slate-400">Node Error: Registry not found.</div>;

  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('### ')) {
        return <h2 key={i} className="text-2xl font-display font-black text-unicou-navy mt-10 mb-6 tracking-tight uppercase border-b-2 border-slate-100 pb-4 leading-tight">{line.replace('### ', '')}</h2>;
      }
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-6 mb-2 text-slate-700 font-bold italic list-disc">{line.replace('- ', '')}</li>;
      }
      return line.trim() ? <p key={i} className="text-slate-600 leading-relaxed mb-6 font-medium text-lg italic">{line}</p> : <div key={i} className="h-2" />;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-700 bg-white">
      <MetaTags title={guide.title} description={guide.content.substring(0, 160)} />
      
      <div className="relative h-[450px] rounded-[3rem] overflow-hidden mb-16 shadow-premium group">
        <img src={guide.heroImage} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={guide.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <div className="flex items-center gap-3 mb-4">
             <span className="px-4 py-1.5 bg-unicou-orange text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">Verified Mobility Path</span>
             <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-full border border-white/20">2025/2026 Intake Active</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-black text-white mb-2 tracking-tighter uppercase leading-none">{guide.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8">
          <div className="bg-slate-50 p-12 md:p-16 rounded-[4rem] border border-slate-200 shadow-inner mb-12">
            <div className="prose prose-lg max-w-none font-sans">
              {renderContent(guide.content)}
            </div>
            
            <div className="mt-16 pt-12 border-t border-slate-200 text-center">
               <h3 className="text-2xl font-display font-black text-unicou-navy mb-6 uppercase tracking-tight">Ready to Take the First Step?</h3>
               <p className="text-slate-500 mb-10 font-bold italic">Initialize your study abroad roadmap today. All intents are securely routed to connect@unicou.uk.</p>
               <button onClick={onRegister} className="px-12 py-5 bg-unicou-orange hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-action active:scale-95 flex items-center justify-center gap-4 mx-auto group">
                  START STUDENT REGISTRATION
                  <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
               </button>
            </div>
          </div>

          <section>
            <h2 className="text-3xl font-display font-black text-slate-900 mb-10 uppercase tracking-tighter">Academic <span className="text-unicou-navy">Registry</span></h2>
            {unis.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {unis.map(u => (
                  <div key={u.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-unicou-navy/20 transition-all cursor-pointer group shadow-sm hover:shadow-xl" onClick={() => onViewUniversity(u.slug)}>
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 p-3 shadow-inner border border-slate-100 flex items-center justify-center">
                         <img src={u.logo} className="max-w-full max-h-full object-contain" alt={u.name} />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 group-hover:text-unicou-navy transition-colors text-base leading-tight uppercase">{u.name}</h3>
                        <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mt-1">QS Global Rank: #{u.ranking}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Explore Node</span>
                       <svg className="w-4 h-4 text-unicou-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200 text-center text-slate-400 font-bold italic">
                 University catalog syncing...
              </div>
            )}
          </section>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-32 space-y-8">
            <div className="bg-unicou-navy p-10 rounded-[3.5rem] text-white shadow-3xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10 font-display font-black text-8xl uppercase pointer-events-none select-none">DATA</div>
               <h3 className="text-xl font-black mb-8 tracking-tighter uppercase border-b border-white/10 pb-4">Destination Specs</h3>
               <div className="space-y-6">
                 <div>
                   <p className="text-[9px] font-black text-unicou-orange uppercase tracking-widest mb-1">Annual Expenses</p>
                   <p className="text-xl font-display font-black tracking-tighter uppercase">{guide.costOfLiving}</p>
                 </div>
                 <div>
                   <p className="text-[9px] font-black text-unicou-orange uppercase tracking-widest mb-1">Annual Tuition</p>
                   <p className="text-xl font-display font-black tracking-tighter uppercase">{guide.visaRequirements}</p>
                 </div>
               </div>
               <button onClick={onRegister} className="w-full mt-10 py-5 bg-white text-unicou-navy rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 shadow-xl">CONSULT A SPECIALIST</button>
            </div>
            
            <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-200">
               <h4 className="text-sm font-black uppercase text-slate-900 mb-4 tracking-tighter">Need Verification?</h4>
               <p className="text-slate-500 text-xs leading-relaxed mb-8 font-bold italic">"Speak to a verified UNICOU counselor to lock your admission node for the upcoming cycle."</p>
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Office Hours: 09:00 - 18:00</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryGuide;
