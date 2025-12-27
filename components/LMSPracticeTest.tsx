import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { LMSPracticeTest as ITest, TestResult, ViewState, LMSTestQuestion } from '../types';

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
  }, [sectionTimeLeft, isFinished, test, currentSectionIdx]);

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-16 h-16 border-4 border-unicou-navy/10 border-t-unicou-navy rounded-full animate-spin mb-8" />
      <h3 className="text-xl font-display font-black text-slate-950 tracking-widest">SYNCHRONIZING EXAM NODE...</h3>
    </div>
  );

  if (!test || !currentSection) return null;

  if (isFinished && result) {
    return (
      <div className="max-w-5xl mx-auto py-20 px-4 animate-in zoom-in duration-700 bg-white">
        <div className="bg-white p-10 md:p-20 rounded-[4rem] border border-slate-200 shadow-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-16 opacity-5 font-display font-black text-[12rem] tracking-tighter pointer-events-none text-slate-950">
            {result.overallBand || 'EXAM'}
          </div>

          <div className="text-center mb-16 relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full border border-emerald-100 mb-8 shadow-2xl">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-black mb-4 tracking-tighter text-slate-950 uppercase">Session <span className="text-unicou-orange">Metrics</span></h1>
            <p className="text-slate-600 text-lg font-bold italic uppercase tracking-widest">Test: {result.testTitle} • Completed in {Math.floor(result.timeTaken/60)}m</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 relative z-10">
            {result.skillScores.map((ss, idx) => (
              <div key={ss.skill} className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] flex flex-col items-center group hover:bg-white hover:border-unicou-orange/30 hover:shadow-2xl transition-all animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{ss.skill}</p>
                <div className="relative w-32 h-32 flex items-center justify-center mb-6">
                   <svg className="w-full h-full -rotate-90">
                     <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200" />
                     <circle 
                      cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-unicou-navy"
                      strokeDasharray={364}
                      strokeDashoffset={ss.isGraded ? 364 - (364 * (ss.score / ss.total)) : 364}
                      style={{ transition: 'stroke-dashoffset 2s ease-out' }}
                      strokeLinecap="round"
                    />
                   </svg>
                   <div className="absolute flex flex-col items-center">
                     <span className="text-2xl font-black text-slate-950 font-mono tracking-tighter">{ss.isGraded ? (ss.band || `${ss.score}/${ss.total}`) : '--'}</span>
                   </div>
                </div>
                {!ss.isGraded && (
                  <span className="text-[9px] font-black text-orange-600 uppercase bg-orange-50 px-3 py-1 rounded-full animate-pulse border border-orange-100">Awaiting Evaluation</span>
                )}
                {ss.isGraded && (
                  <span className="text-[9px] font-black text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Score Verified</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-6 relative z-10">
            <button 
              onClick={() => onNavigate({ type: 'lms-dashboard' })} 
              className="flex-[2] py-6 bg-unicou-navy hover:bg-slate-950 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all active:scale-95"
            >Return to Hub Terminal</button>
            <button 
              onClick={() => window.print()}
              className="flex-1 py-6 bg-white border-2 border-slate-950 hover:bg-slate-50 text-slate-950 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-lg"
            >Export Record</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="sticky top-0 z-[100] bg-white border-b border-slate-200 py-6 px-4 md:px-12 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-12">
           <div className="hidden lg:block">
             <div className="flex items-center gap-3 mb-2">
                <span className="w-2 h-2 bg-unicou-orange rounded-full animate-pulse" />
                <h1 className="text-[11px] font-black uppercase tracking-[0.4em] text-unicou-navy">{test.title}</h1>
             </div>
             <div className="flex gap-1.5">
               {test.sections.map((s, i) => (
                 <div key={s.id} className={`h-1.5 w-12 rounded-full transition-all duration-700 ${i === currentSectionIdx ? 'bg-unicou-navy shadow-lg w-20' : i < currentSectionIdx ? 'bg-emerald-500' : 'bg-slate-100'}`} />
               ))}
             </div>
           </div>
        </div>
        
        <div className="flex items-center gap-10">
           <div className={`flex flex-col items-end ${sectionTimeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-unicou-navy'}`}>
              <span className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-0.5">Time Limit</span>
              <span className="text-3xl font-display font-black font-mono tracking-tighter leading-none">{formatTime(sectionTimeLeft)}</span>
           </div>
           <button onClick={handleSubmit} className="px-8 py-3 bg-slate-950 hover:bg-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95">Terminate Session</button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-20 px-4 flex-grow w-full animate-in fade-in duration-1000">
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-6">
             <span className="px-5 py-2 bg-unicou-orange text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg">
               {currentSection.skill.toUpperCase()} MODULE
             </span>
             <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest border border-slate-200 px-4 py-2 rounded-xl bg-slate-50">Node {currentSectionIdx + 1} of {test.sections.length}</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-unicou-navy leading-none uppercase">{currentSection.title}</h2>
        </div>

        <div className="space-y-12 pb-64">
          {currentSection.questions.map((q: LMSTestQuestion, idx: number) => (
            <div key={q.id} className="bg-white p-10 md:p-14 rounded-[4rem] border border-slate-100 shadow-premium relative overflow-hidden group hover:border-unicou-navy/20 transition-all">
               <div className="absolute top-0 left-0 w-2 h-full bg-unicou-navy opacity-0 group-hover:opacity-100 transition-opacity" />
               
               {q.skill === 'Listening' && q.audioUrl && (
                 <div className="mb-10 p-10 bg-slate-50 border border-slate-100 rounded-[3rem] shadow-inner">
                    <p className="text-[10px] text-slate-400 font-black mb-6 uppercase tracking-widest flex items-center gap-2">
                       <span className="w-1.5 h-1.5 bg-unicou-navy rounded-full animate-pulse" />
                       Authorized Audio Stream
                    </p>
                    <audio controls className="w-full h-12 opacity-80 hover:opacity-100 transition-opacity">
                      <source src={q.audioUrl} type="audio/mpeg" />
                    </audio>
                 </div>
               )}

               <div className="flex items-start gap-8">
                 <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-unicou-navy text-xl shrink-0 group-hover:bg-unicou-navy group-hover:text-white transition-all shadow-inner">
                   {(idx + 1).toString().padStart(2, '0')}
                 </div>
                 <div className="space-y-10 flex-grow pt-2">
                   <h3 className="text-2xl font-display font-bold leading-tight text-slate-900 tracking-tight">{q.text}</h3>
                   
                   {q.type === 'MCQ' && q.options && (
                     <div className="grid grid-cols-1 gap-4">
                       {q.options.map((opt: string, oIdx: number) => (
                         <button 
                           key={oIdx}
                           onClick={() => setAnswers({...answers, [q.id]: oIdx})}
                           className={`w-full text-left p-6 rounded-[2.5rem] border transition-all text-sm font-bold flex items-center gap-6 group/opt ${
                             answers[q.id] === oIdx 
                             ? 'bg-unicou-navy text-white border-unicou-navy shadow-xl scale-[1.01]' 
                             : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-white hover:border-slate-300'
                           }`}
                         >
                           <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-sm transition-all ${
                             answers[q.id] === oIdx ? 'bg-white text-unicou-navy' : 'bg-white text-slate-400 border border-slate-100'
                           }`}>
                             {String.fromCharCode(65 + oIdx)}
                           </span>
                           <span className="text-lg tracking-tight uppercase font-black">{opt}</span>
                         </button>
                       ))}
                     </div>
                   )}

                   {q.type === 'Essay' && (
                     <div className="space-y-4">
                       <div className="relative">
                         <textarea 
                           className="w-full bg-slate-50 border border-slate-100 rounded-[3rem] p-10 text-unicou-navy font-bold focus:border-unicou-navy focus:bg-white outline-none transition-all min-h-[400px] leading-relaxed text-lg shadow-inner italic placeholder:text-slate-300"
                           placeholder="Type your response here..."
                           value={String(answers[q.id] || '')}
                           onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                         />
                         <div className="absolute bottom-10 right-10 flex items-center gap-4 bg-white px-6 py-2.5 rounded-full border border-slate-200 shadow-xl">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Word Count</span>
                           <span className="text-lg font-black text-unicou-navy font-mono">{(String(answers[q.id] || '').trim().split(/\s+/).filter(x => x).length)}</span>
                         </div>
                       </div>
                     </div>
                   )}

                   {q.type === 'Audio-Record' && (
                     <div className="p-20 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200 text-center hover:bg-white hover:border-red-500/50 transition-all cursor-pointer group/rec shadow-inner">
                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8 group-hover/rec:scale-110 group-hover/rec:bg-red-500 group-hover/rec:text-white transition-all shadow-2xl">
                          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" /></svg>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 mb-2 tracking-tight uppercase">Voice Capture Initialization</h4>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Click to begin biometric audio response</p>
                     </div>
                   )}
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-8 z-[100] flex justify-between items-center px-12 shadow-3xl">
         <div className="flex items-center gap-6">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Vault Synchronized</span>
           <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Active Node</span>
           </div>
         </div>
         
         <div className="flex items-center gap-10">
            <div className="flex gap-2">
               {test.sections.map((_, i) => (
                 <button 
                  key={i} 
                  onClick={() => setCurrentSectionIdx(i)}
                  className={`w-10 h-1.5 rounded-full border transition-all ${i === currentSectionIdx ? 'bg-unicou-navy border-unicou-navy w-16' : 'bg-slate-100 border-slate-200'}`} 
                 />
               ))}
            </div>

            <button 
              onClick={nextSection}
              className="px-14 py-5 bg-unicou-navy hover:bg-slate-950 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center gap-4 group"
            >
              {currentSectionIdx === test.sections.length - 1 ? 'Commit Record' : 'Save & Sync Next'}
              <svg className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
         </div>
      </footer>
    </div>
  );
};

export default LMSPracticeTest;