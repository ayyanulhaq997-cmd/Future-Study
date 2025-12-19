
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Qualification, ViewState } from '../types';

interface QualificationCatalogueProps {
  onApply: (qualificationId: string) => void;
}

const QualificationCatalogue: React.FC<QualificationCatalogueProps> = ({ onApply }) => {
  const [quals, setQuals] = useState<Qualification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await api.getQualifications();
      setQuals(data);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="p-20 text-center animate-pulse">Accessing Academic Records...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-16">
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 tracking-tight">
          Qualifications <br />
          <span className="text-primary-400">& Professional Certs</span>
        </h1>
        <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
          Unlock international academic opportunities with OTHM, GED, and specialized level-based diplomas recognized worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {quals.map(q => (
          <div key={q.id} className="glass rounded-[2.5rem] overflow-hidden border border-slate-800 flex flex-col hover:border-primary-500/30 transition-all group shadow-2xl">
            <div className="relative h-64 overflow-hidden">
              <img src={q.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={q.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-primary-600 px-3 py-1 rounded-full text-white">
                  {q.qualificationBody} Verified
                </span>
              </div>
            </div>

            <div className="p-8 flex-grow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-500">{q.level}</span>
                <span className="text-primary-400 font-mono font-bold">{q.tuitionFees}</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 leading-tight group-hover:text-primary-400 transition-colors">{q.title}</h3>
              <p className="text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed">{q.description}</p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Duration: {q.duration}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Prerequisites apply
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-900">
                <button 
                  onClick={() => onApply(q.id)}
                  className="w-full py-4 bg-slate-900 hover:bg-primary-600 text-white rounded-2xl font-bold transition-all border border-slate-800 hover:border-primary-500 group-active:scale-95 flex items-center justify-center gap-2"
                >
                  Apply & Get Consulted
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QualificationCatalogue;
