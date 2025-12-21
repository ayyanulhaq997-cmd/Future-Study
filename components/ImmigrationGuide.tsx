
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { ImmigrationGuideData } from '../types';
import MetaTags from './MetaTags';

const ImmigrationGuide: React.FC<{ slug: string }> = ({ slug }) => {
  const [guide, setGuide] = useState<ImmigrationGuideData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      // Re-using common logic: if db doesn't have specific immig guide, it falls back
      const data = (await api.getImmigrationGuides()).find(g => g.slug === slug);
      setGuide(data || null);
      setLoading(false);
    };
    fetch();
  }, [slug]);

  if (loading) return <div className="p-20 text-center animate-pulse">Scanning Settlement Nodes...</div>;
  if (!guide) return <div className="p-20 text-center">Immigration pathway data not active for this region.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <MetaTags title={guide.title} description={guide.content} />
      
      <div className="relative h-96 rounded-[3rem] overflow-hidden mb-16 shadow-2xl">
        <img src={guide.heroImage} className="w-full h-full object-cover" alt={guide.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
           <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-4 tracking-tighter">{guide.title}</h1>
           <p className="text-slate-300 text-lg max-w-2xl">{guide.content}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {guide.pathways.map(path => (
          <div key={path.id} className="glass p-10 rounded-[3rem] border border-slate-800 hover:border-primary-500/30 transition-all">
            <h3 className="text-3xl font-display font-bold mb-4">{path.title}</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">{path.description}</p>
            
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mandatory Requirements</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {path.requirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                    <span className="text-emerald-500 text-lg">✓</span>
                    <span className="text-sm font-bold text-slate-200">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full mt-10 py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-500/20 transition-all active:scale-95">
              Consult with Settlement Expert
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImmigrationGuide;
