
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

  // Prevent background scroll when overlay is active
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

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
      'global': { type: 'country-list' }
    };
    onNavigate(typeMap[result.linkType] || { type: 'store' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-50 flex items-center gap-4">
          <svg className="w-6 h-6 text-unicou-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search PTE, IELTS, or countries..."
            className="flex-grow bg-transparent text-xl font-display font-medium text-slate-900 outline-none placeholder:text-slate-300"
          />
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6" /></svg>
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-4 scrollbar-hide">
          {loading && (
            <div className="py-12 text-center">
               <div className="w-8 h-8 border-2 border-unicou-navy/10 border-t-unicou-navy rounded-full animate-spin mx-auto mb-3" />
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Searching UNICOU Records...</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-1">
              {results.map((res, i) => (
                <button 
                  key={i} 
                  onClick={() => handleResultClick(res)}
                  className="w-full text-left p-5 hover:bg-slate-50 rounded-2xl transition-all group flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-bold text-unicou-orange bg-orange-50 px-2 py-0.5 rounded uppercase tracking-widest">{res.category}</span>
                      <h4 className="font-bold text-slate-900 group-hover:text-unicou-navy transition-colors">{res.title}</h4>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{res.description}</p>
                  </div>
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-unicou-navy group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              ))}
            </div>
          )}

          {!loading && query.length > 2 && results.length === 0 && (
            <div className="py-12 text-center text-slate-400 italic text-sm">
               No records found for this query.
            </div>
          )}

          {query.length <= 2 && (
            <div className="py-6 px-2">
              <h5 className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-4">Quick Links</h5>
              <div className="flex flex-wrap gap-2">
                {['PTE Academic', 'IELTS Vouchers', 'Study in UK', 'OTHM L3'].map(term => (
                  <button 
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 bg-slate-50 rounded-lg text-xs font-bold text-slate-500 hover:bg-unicou-navy hover:text-white transition-all"
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
