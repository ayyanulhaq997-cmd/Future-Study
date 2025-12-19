
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { University, Course } from '../types';
import MetaTags from './MetaTags';
import { GeminiService } from '../services/geminiService';

const UniversityProfile: React.FC<{ slug: string }> = ({ slug }) => {
  const [uni, setUni] = useState<University | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const u = await api.getUniversityBySlug(slug);
      if (u) {
        setUni(u);
        const c = await api.getCoursesByUniversity(u.id);
        setCourses(c);
        
        // Fetch AI Insight
        try {
          const insight = await GeminiService.generateText(`As a study abroad expert, give a 2-sentence unique selling point for ${u.name} in ${u.location}.`);
          setAiInsight(insight || '');
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  if (loading) return <div className="p-20 text-center">Loading University...</div>;
  if (!uni) return <div className="p-20 text-center">University not found.</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <MetaTags title={uni.name} description={uni.description} />
      
      <div className="glass p-12 rounded-[3rem] border border-slate-800 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <img src={uni.logo} className="w-64 h-64 grayscale" alt="watermark" />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <img src={uni.logo} className="w-32 h-32 rounded-3xl bg-white p-4 shadow-2xl" alt={uni.name} />
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">{uni.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-400">
                <span className="flex items-center gap-1"><span className="text-primary-400">📍</span> {uni.location}</span>
                <span className="flex items-center gap-1"><span className="text-primary-400">🏆</span> World Rank: #{uni.ranking}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="text-slate-400 leading-relaxed">{uni.description}</p>
              
              {aiInsight && (
                <div className="mt-8 p-6 bg-primary-500/10 border border-primary-500/20 rounded-2xl italic text-primary-300">
                  <span className="block text-xs font-bold uppercase tracking-widest mb-2 opacity-50">AI Insight</span>
                  "{aiInsight}"
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Available Courses</h2>
              <div className="space-y-3">
                {courses.map(c => (
                  <div key={c.id} className="glass p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm">{c.title}</p>
                      <p className="text-xs text-slate-500">{c.degree} • {c.duration}</p>
                    </div>
                    <span className="text-xs font-bold text-primary-400">{c.tuitionFee}</span>
                  </div>
                ))}
              </div>
              <a href={uni.website} target="_blank" rel="noopener noreferrer" className="mt-8 block text-center py-4 bg-primary-600 hover:bg-primary-500 rounded-xl font-bold transition-all">
                Visit Official Website
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityProfile;
