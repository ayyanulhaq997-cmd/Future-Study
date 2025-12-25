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
      const slugs = [
        'uk', 'australia', 'usa', 'canada', 'new-zealand', 
        'ireland', 'germany', 'sweden', 'finland', 'cyprus',
        'dubai', 'malaysia', 'turkey', 'europe', 'italy'
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
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-unicou-navy mb-4"></div>
      <p className="text-slate-800 font-black uppercase tracking-widest">Scanning Global Destinations...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-700 bg-white">
      <div className="text-center mb-20">
        <span className="text-[11px] font-black text-unicou-navy uppercase tracking-[0.4em] mb-4 block">Institutional Directory</span>
        <h1 className="text-5xl md:text-[5rem] font-display font-black mb-8 tracking-tighter text-slate-950 leading-none">
          Study Abroad <span className="text-unicou-orange">Destinations</span>
        </h1>
        <p className="text-xl text-slate-800 max-w-3xl mx-auto leading-relaxed font-semibold italic">
          Authoritative academic and lifestyle intelligence for the world's premier study destinations. 
          Initialize your international roadmap with precision.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {guides.map((guide, idx) => (
          <div 
            key={guide.slug}
            onClick={() => onNavigateToGuide(guide.slug)}
            className="group glass rounded-[2.5rem] overflow-hidden border border-slate-200 hover:border-unicou-navy/20 transition-all cursor-pointer shadow-lg relative bg-white"
          >
            <div className="relative h-72 overflow-hidden">
              <img 
                src={guide.heroImage} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                alt={guide.title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
              <div className="absolute top-6 left-6 flex items-center gap-3 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-slate-200 shadow-2xl">
                <span className="text-2xl">{flagMap[guide.slug] || '🌍'}</span>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">{guide.slug.toUpperCase()}</span>
              </div>
            </div>

            <div className="p-10">
              <div className="flex justify-between items-start mb-6">
                 <h3 className="text-3xl font-display font-black group-hover:text-unicou-navy transition-colors leading-tight text-slate-950">
                   {guide.title.replace('Study in ', '')}
                 </h3>
                 <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">98% SUCCESS</span>
              </div>
              <p className="text-slate-700 text-sm mb-10 leading-relaxed line-clamp-2 font-semibold italic">
                {guide.content}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Living Cost</p>
                  <p className="text-[13px] font-black text-slate-900 truncate uppercase">{guide.costOfLiving.split(' ')[0]}</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Visa Type</p>
                  <p className="text-[13px] font-black text-slate-900 truncate uppercase">{guide.visaRequirements.split(' ')[0]}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Access Node</span>
                <div className="w-12 h-12 rounded-2xl bg-unicou-navy text-white flex items-center justify-center group-hover:bg-unicou-orange transition-all duration-500 shadow-xl group-hover:shadow-orange-500/30">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
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