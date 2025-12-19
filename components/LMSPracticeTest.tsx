
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
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const t = await api.getTestById(testId);
        if (!t) throw new Error('Not found');
        setTest(t);
        // Default to total test time if sections don't have individual timers
        setTimeLeft(t.totalTimeLimit * 60);
      } catch (e) {
        alert('Test not found or access denied.');
        onNavigate({ type: 'lms-dashboard' });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [testId]);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isFinished && test) {
      handleSubmit(); // Auto-submit on time-out
    }
  }, [timeLeft, isFinished]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentSection = test?.sections[currentSectionIdx];

  const handleSubmit = async () => {
    if (isFinished) return;
    setIsFinished(true);
    const timeTaken = (test?.totalTimeLimit || 0) * 60 - timeLeft;
    try {
      const res = await api.submitTestResult(testId, answers, timeTaken);
      setResult(res);
    } catch (e) {
      alert('Failed to submit results. Please contact support.');
    }
  };

  const nextSection = () => {
    if (test && currentSectionIdx < test.sections.length - 1) {
      setCurrentSectionIdx(currentSectionIdx + 1);
      window.scrollTo(0, 0);
    } else {
      handleSubmit();
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-primary-400">Loading Exam Environment...</div>;
  if (!test || !currentSection) return null;

  if (isFinished && result) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 animate-in zoom-in duration-500">
        <div className="glass p-12 rounded-[3rem] border border-slate-800 text-center shadow-2xl">
          <div className="mb-10 inline-flex items-center justify-center w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-4xl font-display font-bold mb-4">Exam <span className="text-primary-400">Submitted</span></h1>
          <p className="text-slate-400 mb-12">Your responses have been recorded. Auto-scored sections (Reading/Listening) are ready, while Writing/Speaking tasks have been sent to our evaluators.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {result.skillScores.map(ss => (
              <div key={ss.skill} className="glass p-6 rounded-2xl border-slate-800 text-left flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-1">{ss.skill}</p>
                  <h4 className="font-bold text-slate-200">{ss.isGraded ? `Score: ${ss.score}/${ss.total}` : 'Grading Pending'}</h4>
                </div>
                {!ss.isGraded && <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />}
              </div>
            ))}
          </div>

          <button onClick={() => onNavigate({ type: 'lms-dashboard' })} className="w-full py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold shadow-xl shadow-primary-500/20 transition-all">Return to My Learning</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="sticky top-0 z-30 glass border-b border-slate-900 py-6 px-4 md:px-12 flex justify-between items-center backdrop-blur-xl">
        <div className="flex items-center gap-6">
           <div className="hidden sm:block">
             <h1 className="text-xl font-bold">{test.title}</h1>
             <div className="flex gap-4 mt-1">
               {test.sections.map((s, i) => (
                 <div key={s.id} className={`h-1 w-12 rounded-full transition-all ${i <= currentSectionIdx ? 'bg-primary-500' : 'bg-slate-800'}`} />
               ))}
             </div>
           </div>
        </div>
        
        <div className="flex items-center gap-8">
           <div className={`flex flex-col items-end ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-primary-400'}`}>
              <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Total Time Remaining</span>
              <span className="text-2xl font-bold font-mono">{formatTime(timeLeft)}</span>
           </div>
           <button onClick={handleSubmit} className="px-6 py-2 bg-slate-900 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-bold text-sm transition-all">Terminate Test</button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-12 px-4 flex-grow w-full">
        <div className="mb-12">
          <span className="px-3 py-1 bg-primary-500/10 text-primary-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-primary-500/20">
            {currentSection.skill} Assessment
          </span>
          <h2 className="text-3xl font-display font-bold mt-4">{currentSection.title}</h2>
        </div>

        <div className="space-y-12 pb-32">
          {currentSection.questions.map((q, idx) => (
            <div key={q.id} className="glass p-8 md:p-10 rounded-[2.5rem] border border-slate-800 shadow-lg relative overflow-hidden group">
               {q.skill === 'Listening' && q.audioUrl && (
                 <div className="mb-8 p-6 bg-slate-900/50 rounded-3xl border border-slate-700">
                    <p className="text-xs text-slate-500 font-bold mb-4 uppercase tracking-widest">Audio Reference</p>
                    <audio controls className="w-full h-10">
                      <source src={q.audioUrl} type="audio/mpeg" />
                    </audio>
                 </div>
               )}

               <div className="flex items-start gap-8">
                 <span className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center font-black text-slate-400 text-lg shrink-0 group-hover:border-primary-500/50 transition-colors">
                   {idx + 1}
                 </span>
                 <div className="space-y-8 flex-grow">
                   <h3 className="text-xl font-medium leading-relaxed text-slate-200">{q.text}</h3>
                   
                   {q.type === 'MCQ' && q.options && (
                     <div className="grid grid-cols-1 gap-4">
                       {q.options.map((opt, oIdx) => (
                         <button 
                           key={oIdx}
                           onClick={() => setAnswers({...answers, [q.id]: oIdx})}
                           className={`w-full text-left p-5 rounded-2xl border transition-all text-sm font-medium flex items-center gap-4 ${
                             answers[q.id] === oIdx 
                             ? 'bg-primary-600/10 border-primary-500/50 text-primary-400 shadow-lg shadow-primary-500/5' 
                             : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                           }`}
                         >
                           <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${answers[q.id] === oIdx ? 'bg-primary-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                             {String.fromCharCode(65 + oIdx)}
                           </span>
                           {opt}
                         </button>
                       ))}
                     </div>
                   )}

                   {q.type === 'Essay' && (
                     <div className="space-y-4">
                       <textarea 
                         className="w-full bg-slate-950 border border-slate-800 rounded-[2rem] p-8 text-slate-200 focus:border-primary-500 outline-none transition-all min-h-[300px] leading-relaxed"
                         placeholder="Type your essay response here..."
                         value={String(answers[q.id] || '')}
                         onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                       />
                       <div className="flex justify-end">
                         <span className="text-xs font-bold text-slate-600">Word Count: {(String(answers[q.id] || '').trim().split(/\s+/).filter(x => x).length)}</span>
                       </div>
                     </div>
                   )}

                   {q.type === 'Audio-Record' && (
                     <div className="p-12 glass rounded-3xl border-dashed border-slate-700 text-center">
                        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 cursor-pointer hover:scale-110 transition-transform">
                          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" /></svg>
                        </div>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Click to start recording speaking response</p>
                     </div>
                   )}
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 glass border-t border-slate-900 p-6 z-30 flex justify-between items-center px-12 backdrop-blur-2xl">
         <div className="flex items-center gap-4">
           <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Navigation</span>
           <div className="flex gap-2">
             {test.sections.map((_, i) => (
               <button 
                 key={i} 
                 onClick={() => setCurrentSectionIdx(i)}
                 className={`w-8 h-8 rounded-lg font-black text-[10px] border transition-all ${i === currentSectionIdx ? 'bg-primary-600 border-primary-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-600 hover:text-slate-300'}`}
               >{i + 1}</button>
             ))}
           </div>
         </div>
         
         <button 
           onClick={nextSection}
           className="px-10 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary-500/20 active:scale-95 flex items-center gap-3"
         >
           {currentSectionIdx === test.sections.length - 1 ? 'Final Submission' : 'Proceed to Next Section'}
           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
         </button>
      </footer>
    </div>
  );
};

export default LMSPracticeTest;
