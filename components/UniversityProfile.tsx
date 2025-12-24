import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/apiService';
import { University, Course } from '../types';
import MetaTags from './MetaTags';
import { GeminiService } from '../services/geminiService';

const CourseItem: React.FC<{ course: Course }> = ({ course }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`glass rounded-2xl border transition-all duration-300 overflow-hidden ${expanded ? 'border-primary-500/50 shadow-lg shadow-primary-500/10' : 'border-slate-800 hover:border-slate-700'}`}>
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between text-left gap-4"
      >
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-primary-400 bg-primary-400/10 px-2 py-0.5 rounded uppercase tracking-widest">{course.degree}</span>
            <h3 className="font-bold text-slate-100 group-hover:text-primary-400 transition-colors">{course.title}</h3>
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {course.duration}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400/80 font-mono font-bold">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {course.tuitionFee}
            </span>
          </div>
        </div>
        
        {course.description && (
          <div className={`shrink-0 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
          </div>
        )}
      </button>

      {expanded && course.description && (
        <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Course Insights</h4>
            <p className="text-sm text-slate-400 leading-relaxed italic">
              {course.description}
            </p>
            
            <div className="mt-8">
              <button 
                onClick={() => alert(`Redirecting to ${course.title} application node...`)}
                className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary-500/20 active:scale-95 flex items-center justify-center gap-3 group/apply"
              >
                Apply for Admission
                <svg className="w-4 h-4 group-hover/apply:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
              <p className="text-center text-[8px] text-slate-600 font-bold uppercase mt-3 tracking-widest">Global Academic Verification Required</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const UniversityProfile: React.FC<{ slug: string }> = ({ slug }) => {
  const [uni, setUni] = useState<University | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  // Filtering state
  const [degreeFilter, setDegreeFilter] = useState<'All' | 'Undergraduate' | 'Postgraduate'>('All');
  const [durationFilter, setDurationFilter] = useState<'All' | 'Short' | 'Long'>('All');

  useEffect(() => {
    const fetchData = async () => {
      const u = await api.getUniversityBySlug(slug);
      if (u) {
        setUni(u);
        const c = await api.getCoursesByUniversity(u.id);
        setCourses(c);
        
        // Fetch AI Insight
        try {
          const insight = await GeminiService.generateText(`As a study abroad expert, give a 2-sentence unique selling point for ${u.name} in ${u.location}. Focus on why an international student would thrive there.`);
          setAiInsight(insight || '');
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  const filteredCourses = useMemo(() => {
    return courses.filter(c => {
      const matchesDegree = degreeFilter === 'All' || c.degree === degreeFilter;
      
      // Define "Short" as <= 1 Year, "Long" as > 1 Year
      const isShort = c.duration.toLowerCase().includes('1 year') || c.duration.toLowerCase().includes('months');
      const matchesDuration = durationFilter === 'All' || 
        (durationFilter === 'Short' ? isShort : !isShort);

      return matchesDegree && matchesDuration;
    });
  }, [courses, degreeFilter, durationFilter]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
      <p className="text-slate-400 font-medium">Downloading Academic Infrastructure...</p>
    </div>
  );

  if (!uni) return <div className="p-20 text-center">University not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-700">
      <MetaTags title={uni.name} description={uni.description} />
      
      <div className="glass p-12 rounded-[3.5rem] border border-slate-800 mb-12 relative overflow-hidden shadow-3xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <img src={uni.logo} className="w-80 h-80 grayscale" alt="watermark" />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
            <div className="shrink-0">
               <img src={uni.logo} className="w-40 h-40 rounded-[2.5rem] bg-white p-6 shadow-2xl border border-slate-800/50" alt={uni.name} />
            </div>
            <div className="text-center md:text-left">
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/20">Accredited Member</span>
                <span className="bg-primary-500/10 text-primary-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-primary-500/20">QS Ranked #{uni.ranking}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 tracking-tighter leading-tight">{uni.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-slate-400 font-medium">
                <span className="flex items-center gap-2"><svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> {uni.location}</span>
                <a href={uni.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary-400 transition-colors"><svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg> Official Portal</a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-7 space-y-10">
              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-primary-400 text-sm">01</span>
                  Academic Foundation
                </h2>
                <p className="text-slate-400 leading-relaxed text-lg">{uni.description}</p>
                
                {aiInsight && (
                  <div className="mt-10 p-8 glass bg-primary-500/5 border border-primary-500/10 rounded-[2.5rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <svg className="w-20 h-20 text-primary-400" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16.5C21 16.88 20.79 17.21 20.47 17.38L12.57 21.82C12.41 21.94 12.21 22 12 22C11.79 22 11.59 21.94 11.43 21.82L3.53 17.38C3.21 17.21 3 16.88 3 16.5V7.5C3 7.12 3.21 6.79 3.53 6.62L11.43 2.18C11.59 2.06 11.79 2 12 2C12.21 2 12.41 2.06 12.57 2.18L20.47 6.62C20.79 6.79 21 7.12 21 7.5V16.5Z" /></svg>
                    </div>
                    <span className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-primary-500 mb-3">AI Strategic Insight</span>
                    <p className="text-primary-100 text-lg leading-relaxed font-medium italic relative z-10">
                      "{aiInsight}"
                    </p>
                  </div>
                )}
              </section>

              <section className="bg-slate-900/40 p-10 rounded-[3rem] border border-slate-800">
                <h2 className="text-xl font-bold mb-6">Regional Sync</h2>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Campus Reach</p>
                     <p className="text-slate-200 font-bold">4 Main Facilities</p>
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Intake</p>
                     <p className="text-slate-200 font-bold">120+ Nationalities</p>
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Post-Study Work</p>
                     <p className="text-emerald-400 font-bold">Full Eligibility</p>
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Faculty Ratio</p>
                     <p className="text-slate-200 font-bold">14:1 Student-Staff</p>
                   </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-5">
              <div className="flex flex-col mb-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-primary-400 text-sm">02</span>
                  Course Directory
                </h2>

                {/* Filters */}
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {(['All', 'Undergraduate', 'Postgraduate'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setDegreeFilter(level)}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                          degreeFilter === level 
                          ? 'bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-500/20' 
                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(['All', 'Short', 'Long'] as const).map((dur) => (
                      <button
                        key={dur}
                        onClick={() => setDurationFilter(dur)}
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                          durationFilter === dur 
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {dur === 'All' ? 'Any Duration' : dur === 'Short' ? '≤ 1 Year' : '> 1 Year'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4 min-h-[300px]">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map(c => <CourseItem key={c.id} course={c} />)
                ) : (
                  <div className="p-12 glass border-dashed border-slate-800 text-center text-slate-600 rounded-[2.5rem] flex flex-col items-center gap-4">
                    <svg className="w-10 h-10 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <p className="text-sm font-medium">No courses match the selected criteria.</p>
                    <button 
                      onClick={() => { setDegreeFilter('All'); setDurationFilter('All'); }}
                      className="text-primary-400 text-xs font-bold hover:underline"
                    >Reset Filters</button>
                  </div>
                )}
              </div>
              
              <div className="mt-10">
                 <button className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl">
                   Download Prospectus
                 </button>
                 <p className="text-center text-[10px] text-slate-500 uppercase font-black tracking-widest mt-6">
                   UNICOU Unified Verification Engine • 2024.1
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityProfile;