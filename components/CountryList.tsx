
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
    <div className="flex flex-col items-center justify-center p-20 min-h-[50vh] bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-unicou-orange mb-4"></div>
      <p className="text-slate-800 font-bold uppercase tracking-widest text-[9px]">Scanning Global Nodes...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-in fade-in duration-700 bg-white">
      <div className="text-center mb-12">
        <div className="vibrant-strip mx-auto mb-4 w-10"></div>
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 tracking-tighter text-slate-950 uppercase">
          STUDY ABROAD <span className="text-unicou-orange">DESTINATIONS</span>
        </h2>
        <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed font-normal italic">
          Authoritative intelligence for the world's premier academic hubs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {guides.map((guide) => (
          <div 
            key={guide.slug}
            onClick={() => onNavigateToGuide(guide.slug)}
            className="group rounded-[2rem] overflow-hidden border border-slate-100 hover:border-unicou-orange/30 transition-all cursor-pointer shadow-sm hover:shadow-premium relative bg-white flex flex-col"
          >
            <div className="relative h-40 overflow-hidden">
              <img 
                src={guide.heroImage} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                alt={guide.title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-100 shadow-lg">
                <span className="text-sm">{flagMap[guide.slug] || '🌍'}</span>
                <span className="text-[7px] font-black uppercase tracking-widest text-slate-900">{guide.slug.toUpperCase()}</span>
              </div>
            </div>

            <div className="p-4 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-3">
                 <h3 className="text-lg font-display font-black group-hover:text-unicou-orange transition-colors leading-tight text-slate-900 uppercase">
                   {guide.title.replace('Study in ', '')}
                 </h3>
                 <div className="w-1.5 h-1.5 rounded-full bg-unicou-orange shadow-[0_0_6px_rgba(241,90,36,0.6)]"></div>
              </div>
              
              <div className="grid grid-cols-1 gap-1.5 mb-4 mt-auto">
                <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 flex items-center justify-between">
                  <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest">Living Expenses*</p>
                  <p className="text-[8px] font-black text-slate-900 uppercase">{guide.costOfLiving.split(' / ')[0]}</p>
                </div>
                <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 flex items-center justify-between">
                  <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest">Tuition Fee*</p>
                  <p className="text-[8px] font-black text-slate-900 uppercase">{guide.visaRequirements.split(' / ')[0]}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <span className="text-[7px] font-bold uppercase text-slate-400 tracking-widest group-hover:text-unicou-navy transition-colors">Access Node</span>
                <div className="w-6 h-6 rounded-lg bg-unicou-navy text-white flex items-center justify-center group-hover:bg-unicou-orange transition-all duration-500 shadow-md">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
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
