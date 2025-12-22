
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

  if (loading) return <div className="p-20 text-center animate-pulse">Scanning Settlement Nodes...</div>;
  if (!guide) return <div className="p-20 text-center">Immigration pathway data not active for this region.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-700">
      <MetaTags title={guide.title} description={guide.content} />
      
      <div className="relative h-96 rounded-[3rem] overflow-hidden mb-16 shadow-2xl">
        <img src={guide.heroImage} className="w-full h-full object-cover" alt={guide.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
           <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-4 tracking-tighter">{guide.title}</h1>
           <p className="text-slate-300 text-lg max-w-2xl italic leading-relaxed">{guide.content}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {guide.pathways.map(path => (
          <div key={path.id} className="glass p-10 rounded-[3rem] border border-slate-800 hover:border-primary-500/30 transition-all flex flex-col shadow-2xl">
            <h3 className="text-3xl font-display font-bold mb-4 tracking-tight">{path.title}</h3>
            <p className="text-slate-400 mb-8 leading-relaxed flex-grow italic">{path.description}</p>
            
            <div className="space-y-6 mb-10">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Mandatory Qualification Nodes</h4>
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
                {path.requirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-4 bg-slate-950/50 p-5 rounded-[1.5rem] border border-slate-900 group">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                      <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-sm font-bold text-slate-300">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={onConsult}
                className="w-full py-6 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary-500/20 transition-all active:scale-95 flex items-center justify-center gap-4 group/btn"
              >
                Book An Appointment
                <svg className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
              <p className="text-center text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                Case evaluation dispatched to connect@unicou.uk
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImmigrationGuide;
