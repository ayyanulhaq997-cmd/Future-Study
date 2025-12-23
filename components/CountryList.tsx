
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { CountryGuide } from '../types';

interface CountryListProps {
  onNavigateToGuide: (slug: string) => void;
}

const CountryList: React.FC<CountryListProps> = ({ onNavigateToGuide }) => {
  const [guides, setGuides] = useState<CountryGuide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      // Slugs matching the updated database in services/db.ts
      const slugs = [
        'uk', 'australia', 'usa', 'canada', 'new-zealand', 
        'ireland', 'germany', 'sweden', 'finland', 'cyprus',
        'dubai', 'malaysia', 'turkey', 'europe'
      ];
      const data = await Promise.all(slugs.map(s => api.getGuideBySlug(s)));
      setGuides(data.filter((g): g is CountryGuide => g !== null));
      setLoading(false);
    };
    fetchGuides();
  }, []);

  const flagMap: Record<string, string> = {
    'uk': '🇬🇧', 'australia': '🇦🇺', 'usa': '🇺🇸', 'canada': '🇨🇦',
    'new-zealand': '🇳🇿', 'sweden': '🇸🇪', 'finland': '🇫🇮',
    'germany': '🇩🇪', 'italy': '🇮🇹', 'ireland': '🇮🇪', 'cyprus': '🇨🇾',
    'dubai': '🇦🇪', 'malaysia': '🇲🇾', 'turkey': '🇹🇷', 'europe': '🇪🇺'
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
      <p className="text-slate-400 font-medium">Scanning Global Destinations...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-700">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
          Global <span className="gradient-text">Destination</span> Directory
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Comprehensive academic and lifestyle guides for the world's premier study destinations.
          Initialize your international roadmap today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {guides.map((guide, idx) => (
          <div 
            key={guide.slug}
            onClick={() => onNavigateToGuide(guide.slug)}
            className="group glass rounded-[2.5rem] overflow-hidden border border-slate-800 hover:border-primary-500/30 transition-all cursor-pointer shadow-xl relative"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="relative h-64 overflow-hidden">
              <img 
                src={guide.heroImage} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                alt={guide.title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute top-6 left-6 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-2xl">
                <span className="text-2xl">{flagMap[guide.slug] || '🌍'}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white">{guide.slug.toUpperCase()}</span>
              </div>
            </div>

            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                 <h3 className="text-2xl font-bold group-hover:text-primary-400 transition-colors leading-tight">
                   {guide.title.replace('Study in ', '')}
                 </h3>
                 <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">98% SUCCESS</span>
              </div>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed line-clamp-2 italic">
                {guide.content}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                  <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Living Cost</p>
                  <p className="text-xs font-bold text-slate-300 truncate">{guide.costOfLiving.split(' ')[0]}</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                  <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Visa Type</p>
                  <p className="text-xs font-bold text-slate-300 truncate">{guide.visaRequirements.split(' ')[0]}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-900">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Explore Node</span>
                <div className="w-10 h-10 rounded-xl bg-primary-600/10 border border-primary-500/20 flex items-center justify-center text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountryList;
