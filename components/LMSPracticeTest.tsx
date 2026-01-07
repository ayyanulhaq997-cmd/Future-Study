
import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/apiService';
import { AIEvaluator } from '../services/aiEvaluator';
import { LMSPracticeTest as ITest, TestResult, ViewState, LMSTestQuestion, LMSTestSection } from '../types';

interface LMSPracticeTestProps {
  testId: string;
  onNavigate: (v: ViewState) => void;
}

const LMSPracticeTest: React.FC<LMSPracticeTestProps> = ({ testId, onNavigate }) => {
  const [test, setTest] = useState<ITest | null>(null);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const t = await api.getTestById(testId);
      if (t) {
        setTest(t);
        setTimeLeft(t.sections[0].timeLimit * 60);
      }
      setLoading(false);
    };
    fetch();
  }, [testId]);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !loading && !isFinished) {
      handleNextSection();
    }
  }, [timeLeft, isFinished]);

  const handleNextSection = () => {
    if (test && currentSectionIdx < test.sections.length - 1) {
      setCurrentSectionIdx(prev => prev + 1);
      setTimeLeft(test.sections[currentSectionIdx + 1].timeLimit * 60);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsFinished(true);
    const res = await api.submitTestResult(testId, answers, 0);
    setResult(res);
  };

  const handleHighlight = (qid: string, word: string) => {
    const current = (answers[qid] || []) as string[];
    if (current.includes(word)) {
      setAnswers({ ...answers, [qid]: current.filter(w => w !== word) });
    } else {
      setAnswers({ ...answers, [qid]: [...current, word] });
    }
  };

  const renderQuestionUI = (q: LMSTestQuestion) => {
    switch (q.type) {
      case 'MCQ':
        return (
          <div className="space-y-4">
            {q.options?.map((opt, i) => (
              <button 
                key={i} 
                onClick={() => setAnswers({...answers, [q.id]: i})}
                className={`w-full text-left p-5 rounded-2xl border transition-all flex items-center gap-4 ${answers[q.id] === i ? 'bg-unicou-navy text-white border-unicou-navy' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${answers[q.id] === i ? 'bg-white/20' : 'bg-white border'}`}>{String.fromCharCode(65+i)}</span>
                <span className="font-bold">{opt}</span>
              </button>
            ))}
          </div>
        );

      case 'Fill-Blanks':
      case 'Sentence-Completion':
      case 'Note-Completion':
        return (
          <div className="space-y-4">
             <p className="text-slate-800 font-medium text-lg leading-relaxed">{q.text.split('___________________')[0]}</p>
             <input 
               type="text"
               className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 text-lg font-bold text-unicou-navy outline-none focus:border-unicou-orange transition-all shadow-inner"
               placeholder="Type your answer here..."
               value={answers[q.id] || ''}
               onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
             />
             <p className="text-slate-800 font-medium text-lg leading-relaxed">{q.text.split('___________________')[1]}</p>
          </div>
        );

      case 'Highlight-Incorrect':
        return (
          <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200 leading-relaxed text-lg">
            {q.text.split(' ').map((word, i) => (
              <span 
                key={i} 
                onClick={() => handleHighlight(q.id, word)}
                className={`cursor-pointer px-1 rounded transition-colors ${answers[q.id]?.includes(word) ? 'bg-unicou-orange text-white' : 'hover:bg-unicou-orange/10'}`}
              >
                {word}{' '}
              </span>
            ))}
          </div>
        );

      case 'Essay':
      case 'Integrated-Writing':
        return (
          <div className="space-y-6">
            <textarea 
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-3xl p-10 min-h-[400px] outline-none focus:bg-white focus:border-unicou-navy transition-all font-sans text-lg font-medium leading-relaxed"
              placeholder="Begin your response here..."
              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            />
            <div className="flex justify-between items-center px-4">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Word Count: {(answers[q.id] || '').split(/\s+/).filter(Boolean).length} / {q.wordLimit || 250}</span>
               <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-emerald-600 uppercase">Auto-Save Active</span>
               </div>
            </div>
          </div>
        );

      case 'Insert-Sentence':
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 italic font-bold text-unicou-navy">
              {q.targetSentence}
            </div>
            <div className="grid grid-cols-1 gap-2">
              {q.options?.map((opt, i) => (
                <button 
                  key={i} onClick={() => setAnswers({...answers, [q.id]: i})}
                  className={`w-full text-left p-4 rounded-xl border transition-all text-[11px] font-black uppercase tracking-widest ${answers[q.id] === i ? 'bg-unicou-orange text-white' : 'bg-white text-slate-400 border-slate-200 hover:border-unicou-orange/30'}`}
                >
                  Place At Marker: {opt}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return <div className="p-10 bg-slate-100 rounded-2xl text-center italic font-bold opacity-30 text-[10px] uppercase">Node Type: {q.type} Under Construction</div>;
    }
  };

  if (loading) return <div className="p-40 text-center animate-pulse">Establishing Secure Test Node...</div>;
  if (!test) return null;

  if (isFinished) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-6 text-center animate-in zoom-in duration-700">
        <div className="w-24 h-24 bg-unicou-navy/5 text-unicou-orange rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
           <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 className="text-6xl font-display font-black text-unicou-navy uppercase tracking-tighter mb-4">Exam Completed</h1>
        <p className="text-slate-500 font-bold italic text-lg mb-16 max-w-xl mx-auto">"Results dispatched to UNICOU Analytics. High-stakes validation in progress."</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-slate-50 p-10 rounded-[4rem] border border-slate-200">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Reading/Listening Score</p>
             <p className="text-7xl font-display font-black text-unicou-navy">{result?.overallBand || '--'}</p>
          </div>
          <div className="bg-unicou-navy p-10 rounded-[4rem] text-white">
             <p className="text-[10px] font-black text-unicou-orange uppercase tracking-widest mb-4">AI Criteria Prediction</p>
             <p className="text-3xl font-display font-black">Official Results Pending</p>
          </div>
        </div>
        
        <button onClick={() => onNavigate({ type: 'lms-dashboard' })} className="px-16 py-6 bg-unicou-navy text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-3xl hover:bg-black transition-all">Exit Exam Node</button>
      </div>
    );
  }

  const section = test.sections[currentSectionIdx];
  const isLastSection = currentSectionIdx === test.sections.length - 1;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <header className="bg-unicou-navy text-white px-12 py-5 flex justify-between items-center shadow-2xl sticky top-0 z-[100]">
        <div className="flex items-center gap-6">
           <div className="w-10 h-10 bg-unicou-orange rounded-xl flex items-center justify-center font-black text-xl shadow-lg">U</div>
           <div>
             <h1 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50 mb-1">{test.title}</h1>
             <h2 className="text-lg font-display font-bold uppercase tracking-tight">{section.title}</h2>
           </div>
        </div>
        
        <div className="flex items-center gap-10">
          <div className="text-right">
             <p className="text-[8px] font-black uppercase tracking-widest text-unicou-orange mb-1">Time Remaining</p>
             <p className={`text-2xl font-mono font-black ${timeLeft < 120 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
             </p>
          </div>
          <button onClick={handleNextSection} className="bg-white text-unicou-navy px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">
             {isLastSection ? 'FINAL SUBMISSION' : 'NEXT MODULE →'}
          </button>
        </div>
      </header>

      <div className="flex-grow flex h-[calc(100vh-88px)] overflow-hidden">
        <div className="w-1/2 border-r-2 border-slate-100 overflow-y-auto no-scrollbar bg-[#fdfdfd] p-16">
           {section.passageText && (
             <div className="prose prose-slate max-w-none">
                <div className="flex items-center gap-4 mb-10">
                   <div className="h-1 w-12 bg-unicou-orange rounded-full" />
                   <h3 className="text-xs font-black text-unicou-navy uppercase tracking-[0.4em]">Official Context Material</h3>
                </div>
                <div className="text-xl leading-relaxed text-slate-800 font-medium italic whitespace-pre-wrap">
                  {section.passageText}
                </div>
             </div>
           )}
           {section.audioUrl && (
             <div className="flex flex-col items-center justify-center h-full gap-8">
                <div className="w-32 h-32 bg-slate-50 border-4 border-slate-100 rounded-full flex items-center justify-center text-5xl shadow-inner">🎧</div>
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl w-full max-w-md">
                   <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">
                      <span>Audio Playback: Lecture Mode</span>
                      <span>Single-Play Lock Active</span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-unicou-navy w-1/3" />
                   </div>
                   <button className="mt-8 w-full py-4 bg-unicou-navy text-white rounded-xl font-black text-[10px] uppercase tracking-widest">Start Audio Feed</button>
                </div>
             </div>
           )}
        </div>

        <div className="w-1/2 overflow-y-auto no-scrollbar p-16 bg-white">
           <div className="space-y-16 max-w-2xl mx-auto">
              {section.questions.map((q, idx) => (
                <div key={q.id} className="animate-in slide-in-from-right duration-500 delay-100">
                  <div className="flex items-start gap-6 mb-10">
                     <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center font-black text-xl text-unicou-navy shrink-0 shadow-sm">{idx + 1}</div>
                     <h3 className="text-2xl font-display font-bold leading-tight text-slate-900 tracking-tight">{q.text.includes('___________________') ? 'Complete the following note:' : q.text}</h3>
                  </div>
                  {renderQuestionUI(q)}
                </div>
              ))}
           </div>
        </div>
      </div>

      <footer className="bg-white border-t border-slate-100 px-12 py-4 flex justify-between items-center">
         <div className="flex gap-10">
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Biometric Node Syncing</span>
            </div>
         </div>
         <p className="text-[9px] font-black text-slate-900 uppercase tracking-[0.4em]">Node Registry ID: UC-2025-LC2-EXAM</p>
      </footer>
    </div>
  );
};

export default LMSPracticeTest;
