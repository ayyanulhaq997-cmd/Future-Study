
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { ImmigrationGuideData } from '../types';
import MetaTags from './MetaTags';

interface ImmigrationGuideProps {
  slug: string;
  onConsult: () => void;
}

const ImmigrationGuide: React.FC<ImmigrationGuideProps> = ({ slug, onConsult }) => {
  const [guide, setGuide] = useState<ImmigrationGuideData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = (await api.getImmigrationGuides()).find(g => g.slug === slug);
      setGuide(data || null);
      setLoading(false);
    };
    fetch();
  }, [slug]);

  if (loading) return <div className="p-20 text-center animate-pulse text-unicou-navy font-black uppercase tracking-widest">Scanning Settlement Nodes...</div>;
  if (!guide) return <div className="p-20 text-center font-bold text-slate-400 uppercase">Immigration pathway data not active for this region.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-700">
      <MetaTags title={guide.title} description={guide.content} />
      
      <div className="relative h-96 rounded-[3rem] overflow-hidden mb-16 shadow-3xl">
        <img src={guide.heroImage} className="w-full h-full object-cover" alt={guide.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
           <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-unicou-orange text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">Global Pathways</div>
           <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-4 tracking-tighter uppercase leading-none">{guide.title}</h1>
           <p className="text-slate-300 text-lg max-w-2xl italic leading-relaxed font-medium">"{guide.content}"</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {guide.pathways.map((path: any) => (
          <div key={path.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 hover:border-unicou-orange/20 transition-all flex flex-col shadow-xl group">
            <h3 className="text-3xl font-display font-black mb-4 tracking-tight text-unicou-navy uppercase">{path.title}</h3>
            <p className="text-slate-500 mb-8 leading-relaxed flex-grow italic font-bold">"{path.description}"</p>
            
            <div className="space-y-6 mb-10">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Mandatory Qualification Nodes</h4>
              <div className="grid grid-cols-1 gap-3">
                {path.requirements.map((req: string, i: number) => (
                  <div key={i} className="flex items-center gap-4 bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100 group-hover:bg-white group-hover:border-unicou-orange/10 transition-all">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100 shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={onConsult}
                className="w-full py-6 bg-unicou-navy hover:bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-4 group/btn"
              >
                Book An Appointment
                <svg className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
              <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                Verification Protocol active via connect@unicou.uk
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImmigrationGuide;
