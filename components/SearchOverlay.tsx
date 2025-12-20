
import React, { useState, useEffect, useRef } from 'react';
import { GeminiService } from '../services/geminiService';
import { ViewState } from '../types';

interface SearchOverlayProps {
  onClose: () => void;
  onNavigate: (view: ViewState) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        setLoading(true);
        const res = await GeminiService.platformSearch(query);
        setResults(res.results || []);
        setLoading(false);
      } else {
        setResults([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const handleResultClick = (result: any) => {
    const typeMap: Record<string, any> = {
      'store': { type: 'store' },
      'academy': { type: 'lms-dashboard' },
      'degree': { type: 'qualifications' },
      'global': { type: 'store' } // Defaulting for simple map
    };
    onNavigate(typeMap[result.linkType] || { type: 'store' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl glass rounded-[2.5rem] border border-slate-800 shadow-3xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-800 flex items-center gap-4">
          <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for PTE vouchers, IELTS courses, or UK universities..."
            className="flex-grow bg-transparent text-2xl font-display font-medium text-white outline-none placeholder:text-slate-600"
          />
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl text-slate-500 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-6 scrollbar-hide">
          {loading && (
            <div className="py-20 text-center space-y-4">
               <div className="w-10 h-10 border-2 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mx-auto" />
               <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Querying Global Nexus...</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="grid grid-cols-1 gap-3">
              {results.map((res, i) => (
                <button 
                  key={i} 
                  onClick={() => handleResultClick(res)}
                  className="w-full text-left p-6 hover:bg-white/5 rounded-[2rem] border border-transparent hover:border-slate-800 transition-all group flex items-center justify-between animate-in slide-in-from-top-2 duration-300"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-black text-primary-400 bg-primary-400/10 px-2 py-0.5 rounded uppercase tracking-widest">{res.category}</span>
                      <h4 className="font-bold text-lg text-slate-200 group-hover:text-white transition-colors">{res.title}</h4>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-1">{res.description}</p>
                  </div>
                  <svg className="w-5 h-5 text-slate-700 group-hover:text-primary-400 transition-all group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              ))}
            </div>
          )}

          {!loading && query.length > 2 && results.length === 0 && (
            <div className="py-20 text-center text-slate-600 italic">
               No direct nodes found. Try searching for specific exam boards or study countries.
            </div>
          )}

          {query.length <= 2 && (
            <div className="py-8">
              <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-6 ml-4">Popular Discovery</h5>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {['PTE Academic', 'IELTS Mock', 'Study in UK', 'OTHM L3'].map(term => (
                  <button 
                    key={term}
                    onClick={() => setQuery(term)}
                    className="p-4 glass rounded-2xl border-slate-800 text-sm font-bold text-slate-400 hover:text-white hover:border-primary-500/50 transition-all text-center"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
