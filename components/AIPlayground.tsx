
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { University, ViewState } from '../types';

const AIPlayground: React.FC<{ onNavigate: (v: ViewState) => void }> = ({ onNavigate }) => {
  const [unis, setUnis] = useState<University[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await api.getUniversities();
      setUnis(data);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = unis.filter(u => u.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="glass rounded-[2rem] overflow-hidden border border-slate-800 shadow-2xl p-8 min-h-[400px]">
      <div className="mb-12">
        <div className="relative max-w-2xl mx-auto">
          <input 
            type="text" 
            placeholder="Search universities by name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-full py-5 px-8 pr-16 focus:outline-none focus:border-primary-500 transition-all text-lg"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500">
             🔍
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-40 glass animate-pulse rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(u => (
            <div 
              key={u.id} 
              onClick={() => onNavigate({ type: 'university', slug: u.slug })}
              className="glass p-6 rounded-2xl border border-slate-800 hover:border-primary-500/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-4">
                <img src={u.logo} className="w-10 h-10 rounded bg-white p-1" alt={u.name} />
                <div>
                  <h3 className="font-bold group-hover:text-primary-400">{u.name}</h3>
                  <p className="text-xs text-slate-500">{u.location}</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 line-clamp-2 mb-4">{u.description}</p>
              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Rank #{u.ranking}</span>
                <span className="text-primary-400 text-sm font-bold">View Profile →</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-20 text-center opacity-40">
              No universities found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIPlayground;
