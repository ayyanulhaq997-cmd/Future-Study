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
    <div className="flex flex-col items-center justify-center p-20 min-h-[60vh] bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-unicou-vibrant mb-4"></div>
      <p className="text-slate-800 font-bold uppercase tracking-widest text-xs">Scanning Global Nodes...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 animate-in fade-in duration-700 bg-white">
      <div className="text-center mb-24">
        <div className="vibrant-strip mx-auto mb-6 w-16"></div>
        <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 tracking-tighter text-slate-950 uppercase">
          STUDY ABROAD <span className="text-unicou-orange">DESTINATIONS</span>
        </h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-normal italic">
          Authoritative intelligence for the world's premier academic hubs. 
          Start your international journey with verified data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {guides.map((guide, idx) => (
          <div 
            key={guide.slug}
            onClick={() => onNavigateToGuide(guide.slug)}
            className="group rounded-[3rem] overflow-hidden border border-slate-100 hover:border-unicou-vibrant/20 transition-all cursor-pointer shadow-premium relative bg-white flex flex-col"
          >
            <div className="relative h-64 overflow-hidden">
              <img 
                src={guide.heroImage} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                alt={guide.title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
              <div className="absolute top-6 left-6 flex items-center gap-3 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-slate-100 shadow-xl">
                <span className="text-2xl">{flagMap[guide.slug] || '🌍'}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900">{guide.slug.toUpperCase()}</span>
              </div>
            </div>

            <div className="p-10 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-6">
                 <h3 className="text-3xl font-display font-bold group-hover:text-unicou-orange transition-colors leading-tight text-slate-900 uppercase">
                   {guide.title.replace('Study in ', '')}
                 </h3>
                 <div className="w-2 h-2 rounded-full bg-unicou-vibrant shadow-[0_0_8px_#00f2ff]"></div>
              </div>
              <p className="text-slate-500 text-sm mb-10 leading-relaxed line-clamp-2 italic font-medium">
                {guide.content}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-10 mt-auto">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Living Cost</p>
                  <p className="text-[12px] font-bold text-slate-900 truncate uppercase">{guide.costOfLiving.split(' ')[0]}</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1 tracking-widest">Visa Type</p>
                  <p className="text-[12px] font-bold text-slate-900 truncate uppercase">{guide.visaRequirements.split(' ')[0]}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest group-hover:text-unicou-navy transition-colors">Access Guide</span>
                <div className="w-12 h-12 rounded-2xl bg-unicou-navy text-white flex items-center justify-center group-hover:bg-unicou-vibrant group-hover:shadow-vibrant-glow transition-all duration-500 shadow-xl">
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