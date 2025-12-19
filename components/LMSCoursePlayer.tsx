
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { LMSCourse, LMSModule, LMSLesson, ViewState } from '../types';

interface LMSCoursePlayerProps {
  courseId: string;
  initialLessonId?: string;
  onNavigate: (v: ViewState) => void;
}

const LMSCoursePlayer: React.FC<LMSCoursePlayerProps> = ({ courseId, initialLessonId, onNavigate }) => {
  const [course, setCourse] = useState<LMSCourse | null>(null);
  const [modules, setModules] = useState<LMSModule[]>([]);
  const [activeLesson, setActiveLesson] = useState<LMSLesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const c = (await api.getAllLMSCourses()).find(x => x.id === courseId);
        const mods = await api.getCourseModules(courseId);
        setCourse(c || null);
        setModules(mods);
        
        // Auto-select first lesson
        if (mods.length > 0 && mods[0].lessons.length > 0) {
          const firstLesson = mods[0].lessons[0];
          setActiveLesson(firstLesson);
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  if (loading) return <div className="p-20 text-center animate-pulse">Entering Secure Virtual Classroom...</div>;
  if (error) return (
    <div className="max-w-xl mx-auto py-20 text-center">
      <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl">
        <h3 className="text-xl font-bold text-red-400 mb-2">Access Restricted</h3>
        <p className="text-slate-500 mb-6">{error}</p>
        <button 
          onClick={() => onNavigate({ type: 'lms-dashboard' })}
          className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold"
        >Back to Academy</button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-950">
      {/* Sidebar Content Tree */}
      <div className="w-full lg:w-80 h-auto lg:h-screen lg:overflow-y-auto glass border-r border-slate-900 sticky top-0 z-20">
        <div className="p-6 border-b border-slate-900">
          <button 
            onClick={() => onNavigate({ type: 'lms-dashboard' })}
            className="text-slate-500 text-xs font-black uppercase tracking-widest hover:text-white mb-4 flex items-center gap-2 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Exit Course
          </button>
          <h2 className="text-lg font-bold">{course?.title}</h2>
          <div className="w-full bg-slate-900 h-1 rounded-full mt-4 overflow-hidden">
             <div className="bg-primary-500 h-full w-[45%]" />
          </div>
          <span className="text-[10px] text-slate-500 mt-2 block font-bold">45% COMPLETE</span>
        </div>

        <div className="py-4">
          {modules.map(mod => (
            <div key={mod.id}>
              <div className="px-6 py-3 bg-slate-900/40 text-[10px] font-black uppercase tracking-widest text-slate-500 border-y border-slate-900">
                {mod.title}
              </div>
              <div className="space-y-1 p-2">
                {mod.lessons.map(les => (
                  <button 
                    key={les.id}
                    onClick={() => setActiveLesson(les)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-3 ${
                      activeLesson?.id === les.id ? 'bg-primary-600/10 text-primary-400 font-bold' : 'text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    <span className="shrink-0">
                      {les.type === 'Video' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>}
                      {les.type === 'Text' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                      {les.type === 'Quiz' && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    </span>
                    <span className="truncate">{les.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
          
          <div className="p-4 mt-8">
             <button 
               onClick={() => onNavigate({ type: 'lms-practice-test', testId: 'test-1' })}
               className="w-full p-4 bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600/20 transition-all"
             >
               Take Final Mock Exam
             </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-4 md:p-12 lg:h-screen lg:overflow-y-auto">
        {activeLesson ? (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500 mb-2 block">Lesson Playback</span>
              <h1 className="text-3xl md:text-4xl font-display font-bold">{activeLesson.title}</h1>
            </div>

            {activeLesson.type === 'Video' && (
              <div className="aspect-video rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 relative">
                <iframe 
                  className="w-full h-full"
                  src={activeLesson.content}
                  title={activeLesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}

            {activeLesson.type === 'Text' && (
              <div className="glass p-8 md:p-12 rounded-[2rem] border-slate-800 prose prose-invert prose-primary max-w-none">
                <div className="text-slate-300 leading-relaxed space-y-6">
                   {activeLesson.content.split('\n').map((line, i) => (
                     <p key={i}>{line.startsWith('###') ? <strong className="text-white text-xl">{line.replace('###', '')}</strong> : line}</p>
                   ))}
                </div>
              </div>
            )}

            {activeLesson.type === 'Quiz' && (
              <div className="glass p-12 rounded-[2.5rem] border-slate-800 text-center space-y-6">
                 <div className="w-16 h-16 bg-primary-600/10 text-primary-400 rounded-2xl flex items-center justify-center mx-auto">
                   <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 </div>
                 <h2 className="text-2xl font-bold">Concept Checkpoint</h2>
                 <p className="text-slate-500 max-w-sm mx-auto">Verify your understanding of the module before proceeding.</p>
                 <button className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20">
                   Start Lesson Quiz
                 </button>
              </div>
            )}

            <div className="flex justify-between items-center pt-12 border-t border-slate-900">
               <button className="text-slate-500 font-bold hover:text-white transition-colors">← Previous Lesson</button>
               <button className="px-8 py-3 bg-slate-900 hover:bg-slate-800 rounded-xl font-bold border border-slate-700 transition-all">Mark as Complete</button>
               <button className="text-primary-400 font-bold hover:text-primary-300 transition-colors">Next Lesson →</button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500">
            <svg className="w-16 h-16 opacity-10 mb-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2v-2zm0-10h2v8h-2V6z"/></svg>
            <p>Select a lesson from the sidebar to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LMSCoursePlayer;
