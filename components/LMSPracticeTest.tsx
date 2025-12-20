
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { LMSPracticeTest as ITest, TestResult, ViewState, LMSTestSection } from '../types';

interface LMSPracticeTestProps {
  testId: string;
  onNavigate: (v: ViewState) => void;
}

const LMSPracticeTest: React.FC<LMSPracticeTestProps> = ({ testId, onNavigate }) => {
  const [test, setTest] = useState<ITest | null>(null);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [sectionTimeLeft, setSectionTimeLeft] = useState(0);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const t = await api.getTestById(testId);
        if (!t) throw new Error('Not found');
        setTest(t);
        setSectionTimeLeft(t.sections[0].timeLimit * 60);
      } catch (e) {
        alert('Test environment restricted or session expired.');
        onNavigate({ type: 'lms-dashboard' });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [testId]);

  useEffect(() => {
    if (sectionTimeLeft > 0 && !isFinished) {
      const timer = setTimeout(() => {
        setSectionTimeLeft(sectionTimeLeft - 1);
        setTotalTimeTaken(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (sectionTimeLeft === 0 && !isFinished && test) {
      if (currentSectionIdx < test.sections.length - 1) {
        nextSection();
      } else {
        handleSubmit();
      }
    }
  }, [sectionTimeLeft, isFinished]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentSection = test?.sections[currentSectionIdx];

  const handleSubmit = async () => {
    if (isFinished) return;
    setIsFinished(true);
    try {
      const res = await api.submitTestResult(testId, answers, totalTimeTaken);
      setResult(res);
    } catch (e) {
      alert('Network sync failure. Contact support for recovery.');
    }
  };

  const nextSection = () => {
    if (test && currentSectionIdx < test.sections.length - 1) {
      setCurrentSectionIdx(currentSectionIdx + 1);
      setSectionTimeLeft(test.sections[currentSectionIdx + 1].timeLimit * 60);
      window.scrollTo(0, 0);
    } else {
      handleSubmit();
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-8" />
      <h3 className="text-xl font-display font-bold">Syncing Exam Assets...</h3>
    </div>
  );

  if (!test || !currentSection) return null;

  if (isFinished && result) {
    return (
      <div className="max-w-5xl mx-auto py-20 px-4 animate-in zoom-in duration-700">
        <div className="glass p-10 md:p-20 rounded-[4rem] border border-slate-800 shadow-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-16 opacity-5 font-display font-black text-[12rem] tracking-tighter pointer-events-none">
            {result.overallBand || 'EXAM'}
          </div>

          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 mb-8 shadow-2xl">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h1 className="text-5xl font-display font-bold mb-4 tracking-tight">Performance <span className="text-primary-400">Analysis</span></h1>
            <p className="text-slate-400 max-w-2xl mx-auto">Exam Session: {result.testTitle} • Completed in {Math.floor(result.timeTaken/60)}m</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {result.skillScores.map((ss, idx) => (
              <div key={ss.skill} className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col items-center group hover:border-primary-500/40 transition-all animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">{ss.skill}</p>
                <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                   <svg className="w-full h-full -rotate-90">
                     <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                     <circle 
                      cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-primary-500"
                      strokeDasharray={364}
                      strokeDashoffset={ss.isGraded ? 364 - (364 * (ss.score / ss.total)) : 364}
                      style={{ transition: 'stroke-dashoffset 2s ease-out' }}
                      strokeLinecap="round"
                    />
                   </svg>
                   <div className="absolute flex flex-col items-center">
                     <span className="text-2xl font-black text-slate-100 font-mono tracking-tighter">{ss.isGraded ? (ss.band || `${ss.score}/${ss.total}`) : '--'}</span>
                   </div>
                </div>
                {!ss.isGraded && (
                  <span className="text-[9px] font-bold text-orange-400 uppercase bg-orange-400/10 px-3 py-1 rounded-full animate-pulse">Awaiting Evaluator</span>
                )}
                {ss.isGraded && ss.band && (
                  <span className="text-[9px] font-bold text-emerald-400 uppercase bg-emerald-400/10 px-3 py-1 rounded-full">Score Verified</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={() => onNavigate({ type: 'lms-dashboard' })} 
              className="flex-[2] py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary-500/20 transition-all active:scale-95"
            >Exit to Dashboard</button>
            <button 
              onClick={() => window.print()}
              className="flex-1 py-5 glass border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-3xl font-bold text-xs uppercase tracking-widest transition-all"
            >Download Report</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="sticky top-0 z-30 glass border-b border-slate-900 py-6 px-4 md:px-12 flex justify-between items-center backdrop-blur-2xl">
        <div className="flex items-center gap-10">
           <div className="hidden lg:block">
             <div className="flex items-center gap-3 mb-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <h1 className="text-sm font-black uppercase tracking-[0.2em]">{test.title}</h1>
             </div>
             <div className="flex gap-2">
               {test.sections.map((s, i) => (
                 <div key={s.id} className={`h-1.5 w-16 rounded-full transition-all duration-500 ${i === currentSectionIdx ? 'bg-primary-500 shadow-[0_0_12px_rgba(14,165,233,0.5)]' : i < currentSectionIdx ? 'bg-slate-500' : 'bg-slate-800'}`} />
               ))}
             </div>
           </div>
        </div>
        
        <div className="flex items-center gap-12">
           <div className={`flex flex-col items-end ${sectionTimeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-primary-400'}`}>
              <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Section Time Remaining</span>
              <span className="text-3xl font-display font-bold font-mono tracking-tighter">{formatTime(sectionTimeLeft)}</span>
           </div>
           <button onClick={handleSubmit} className="px-8 py-3 bg-slate-900 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Emergency Termination</button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-16 px-4 flex-grow w-full animate-in fade-in duration-1000">
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
             <span className="px-4 py-1.5 bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
               {currentSection.skill}
             </span>
             <span className="text-slate-600 font-bold text-[10px] uppercase tracking-widest">Section {currentSectionIdx + 1} of {test.sections.length}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">{currentSection.title}</h2>
        </div>

        <div className="space-y-12 pb-48">
          {currentSection.questions.map((q, idx) => (
            <div key={q.id} className="glass p-8 md:p-12 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
               <div className="absolute top-0 left-0 w-1 h-full bg-primary-500 opacity-20 group-hover:opacity-100 transition-opacity" />
               
               {q.skill === 'Listening' && q.audioUrl && (
                 <div className="mb-10 p-8 bg-slate-900 border border-slate-800 rounded-[2rem] shadow-inner">
                    <p className="text-[9px] text-slate-500 font-black mb-4 uppercase tracking-widest">Digital Audio Feed</p>
                    <audio controls className="w-full h-10 filter invert grayscale opacity-80 hover:opacity-100 transition-opacity">
                      <source src={q.audioUrl} type="audio/mpeg" />
                    </audio>
                 </div>
               )}

               <div className="flex items-start gap-8">
                 <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-slate-500 text-xl shrink-0 group-hover:text-primary-400 group-hover:border-primary-500/30 transition-all shadow-inner">
                   {idx + 1}
                 </div>
                 <div className="space-y-10 flex-grow pt-2">
                   <h3 className="text-2xl font-medium leading-relaxed text-slate-200 tracking-tight">{q.text}</h3>
                   
                   {q.type === 'MCQ' && q.options && (
                     <div className="grid grid-cols-1 gap-4">
                       {q.options.map((opt, oIdx) => (
                         <button 
                           key={oIdx}
                           onClick={() => setAnswers({...answers, [q.id]: oIdx})}
                           className={`w-full text-left p-6 rounded-3xl border transition-all text-sm font-medium flex items-center gap-6 group/opt ${
                             answers[q.id] === oIdx 
                             ? 'bg-primary-600/10 border-primary-500/50 text-primary-400 shadow-xl' 
                             : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-700'
                           }`}
                         >
                           <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-xs transition-all ${
                             answers[q.id] === oIdx ? 'bg-primary-500 text-white' : 'bg-slate-800 text-slate-600 group-hover/opt:text-slate-400'
                           }`}>
                             {String.fromCharCode(65 + oIdx)}
                           </span>
                           <span className="text-lg">{opt}</span>
                         </button>
                       ))}
                     </div>
                   )}

                   {q.type === 'Essay' && (
                     <div className="space-y-4">
                       <div className="relative">
                         <textarea 
                           className="w-full bg-slate-950 border border-slate-800 rounded-[3rem] p-10 text-slate-200 focus:border-primary-500 outline-none transition-all min-h-[400px] leading-relaxed text-lg"
                           placeholder="Initiate written response module..."
                           value={String(answers[q.id] || '')}
                           onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                         />
                         <div className="absolute bottom-10 right-10 flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
                           <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Live Word Count</span>
                           <span className="text-sm font-bold text-primary-400 font-mono">{(String(answers[q.id] || '').trim().split(/\s+/).filter(x => x).length)}</span>
                         </div>
                       </div>
                     </div>
                   )}

                   {q.type === 'Audio-Record' && (
                     <div className="p-20 glass rounded-[3rem] border-dashed border-slate-700 text-center hover:border-red-500/50 transition-all cursor-pointer group/rec">
                        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 group-hover/rec:scale-110 transition-transform shadow-2xl">
                          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" /></svg>
                        </div>
                        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">Click to start biometric audio capture</p>
                     </div>
                   )}
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 glass border-t border-slate-900 p-8 z-30 flex justify-between items-center px-12 backdrop-blur-3xl">
         <div className="flex items-center gap-6">
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Vault Sync Status</span>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-bold text-slate-400 uppercase">Secure Link Active</span>
           </div>
         </div>
         
         <div className="flex items-center gap-8">
            <div className="flex -space-x-1">
               {test.sections.map((_, i) => (
                 <button 
                  key={i} 
                  onClick={() => setCurrentSectionIdx(i)}
                  className={`w-3 h-3 rounded-full border border-slate-800 transition-all ${i === currentSectionIdx ? 'bg-primary-500 w-8' : 'bg-slate-900'}`} 
                 />
               ))}
            </div>

            <button 
              onClick={nextSection}
              className="px-12 py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-2xl shadow-primary-500/30 active:scale-95 flex items-center gap-4"
            >
              {currentSectionIdx === test.sections.length - 1 ? 'Final Commit' : 'Commit & Next Section'}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
         </div>
      </footer>
    </div>
  );
};

export default LMSPracticeTest;
