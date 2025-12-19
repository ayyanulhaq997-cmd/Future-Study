
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { CountryGuide as ICountryGuide, University } from '../types';
import MetaTags from './MetaTags';

const CountryGuide: React.FC<{ slug: string; onViewUniversity: (slug: string) => void }> = ({ slug, onViewUniversity }) => {
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
      
      <div className="relative h-96 rounded-3xl overflow-hidden mb-12">
        <img src={guide.heroImage} className="w-full h-full object-cover" alt={guide.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">{guide.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <section className="glass p-8 rounded-3xl">
            <h2 className="text-2xl font-bold mb-4 text-primary-400">Overview</h2>
            <p className="text-slate-300 leading-relaxed text-lg">{guide.content}</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Top Universities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {unis.map(u => (
                <div key={u.id} className="glass p-6 rounded-2xl border border-slate-800 hover:border-primary-500/30 transition-all cursor-pointer group" onClick={() => onViewUniversity(u.slug)}>
                  <div className="flex items-center gap-4 mb-4">
                    <img src={u.logo} className="w-12 h-12 rounded-lg bg-white p-1" alt={u.name} />
                    <div>
                      <h3 className="font-bold group-hover:text-primary-400 transition-colors">{u.name}</h3>
                      <p className="text-xs text-slate-500">World Rank: #{u.ranking}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-2">{u.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl border border-primary-500/20">
            <h3 className="font-bold mb-4 text-lg">Quick Facts</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Cost of Living</p>
                <p className="text-slate-200">{guide.costOfLiving}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Visa Required</p>
                <p className="text-slate-200">{guide.visaRequirements}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryGuide;
