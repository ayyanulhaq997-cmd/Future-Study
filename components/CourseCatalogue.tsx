
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Product, ViewState } from '../types';

interface CourseCatalogueProps {
  onCheckout: (productId: string, quantity: number) => void;
}

const CourseCatalogue: React.FC<CourseCatalogueProps> = ({ onCheckout }) => {
  const [courses, setCourses] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const all = await api.getProducts();
      setCourses(all.filter(p => p.type === 'Course'));
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="p-20 text-center animate-pulse">Scanning Learning Assets...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-display font-bold mb-4 tracking-tight">
          Academy <span className="text-primary-400">Catalogue</span>
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          High-performance preparation courses for global English language proficiency exams.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {courses.map(c => (
          <div key={c.id} className="glass rounded-[3rem] border border-slate-800 overflow-hidden flex flex-col md:flex-row hover:border-primary-500/30 transition-all group shadow-2xl">
            <div className="w-full md:w-48 bg-slate-900 flex items-center justify-center text-7xl p-8">
              {c.icon}
            </div>
            <div className="p-10 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-400 bg-primary-500/10 px-3 py-1 rounded-full border border-primary-500/20">
                  {c.category} SPECIALIST
                </span>
                <span className="text-2xl font-bold font-mono">${c.basePrice}</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-primary-400 transition-colors">{c.name}</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                {c.description} 
                <span className="block mt-2 font-bold text-slate-400 italic">Full lifecycle access • Simulated testing • Certification track.</span>
              </p>
              
              <div className="mt-auto pt-6 border-t border-slate-800 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800" />
                  ))}
                  <span className="text-[10px] text-slate-500 ml-4 font-bold">+2.4k Enrolled</span>
                </div>
                <button 
                  onClick={() => onCheckout(c.id, 1)}
                  className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary-500/20"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseCatalogue;
