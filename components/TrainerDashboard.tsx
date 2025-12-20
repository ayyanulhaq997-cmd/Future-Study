
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { ManualSubmission, User } from '../types';

const TrainerDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [pendingSubmissions, setPendingSubmissions] = useState<ManualSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ManualSubmission | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const fetchData = async () => {
    try {
      const ps = await api.getPendingSubmissions();
      setPendingSubmissions(ps);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGrade = async () => {
    if (!selectedItem) return;
    setSubmitting(true);
    try {
      await api.gradeSubmission(selectedItem.id, score, feedback);
      setSelectedItem(null);
      setScore(0);
      setFeedback('');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      await fetchData();
    } catch (e) {
      alert('Failed to submit evaluation.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate audio feedback recording start
      setFeedback(prev => prev + "\n[AUDIO FEEDBACK ATTACHED]");
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-primary-400">Loading Trainer Terminal...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {showSuccessToast && (
        <div className="fixed top-24 right-8 z-[100] glass border border-emerald-500/50 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300">
           <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
           </div>
           <div>
             <p className="text-sm font-bold">Result Flow Triggered</p>
             <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Student Notified via Secure Link</p>
           </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold">Trainer <span className="text-primary-400">Portal</span></h1>
          <p className="text-slate-500 text-sm mt-1">Global evaluation node. Manual assessment required for Writing & Speaking.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass px-8 py-5 rounded-3xl border border-slate-800 shadow-xl">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Queue Priority</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold font-mono text-primary-400">{pendingSubmissions.length}</span>
              <span className="text-[9px] font-bold text-slate-600 uppercase">Tasks Pending</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Task Queue Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass rounded-[2.5rem] border border-slate-800 overflow-hidden h-[calc(100vh-280px)] flex flex-col shadow-2xl">
            <div className="px-8 py-6 bg-slate-900/50 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-sm uppercase tracking-widest">Global Queue</h3>
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-slate-500 uppercase">Live Stream</span>
              </div>
            </div>
            
            <div className="overflow-y-auto flex-grow no-scrollbar divide-y divide-slate-800/50">
              {pendingSubmissions.map(s => (
                <button 
                  key={s.id} 
                  onClick={() => { setSelectedItem(s); setScore(0); setFeedback(''); }}
                  className={`w-full text-left p-8 transition-all hover:bg-slate-800/30 group relative ${selectedItem?.id === s.id ? 'bg-primary-600/5' : ''}`}
                >
                  {selectedItem?.id === s.id && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary-500" />
                  )}
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${s.skill === 'Writing' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-purple-500/10 text-purple-500 border-purple-500/20'}`}>{s.skill}</span>
                    <span className="text-[9px] text-slate-600 font-mono font-bold">{new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <h4 className="font-bold text-slate-100 text-base mb-1 group-hover:text-primary-400 transition-colors truncate">{s.userEmail}</h4>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{s.testTitle}</p>
                </button>
              ))}
              {pendingSubmissions.length === 0 && (
                <div className="p-20 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 border border-slate-800 text-slate-700">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <p className="text-slate-600 italic text-sm font-medium">All tasks cleared.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Evaluation Interface */}
        <div className="lg:col-span-8">
          {selectedItem ? (
            <div className="glass rounded-[3.5rem] border border-slate-800 p-10 md:p-14 shadow-3xl animate-in fade-in zoom-in duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-16 opacity-5 font-display font-black text-9xl select-none pointer-events-none uppercase tracking-tighter">
                {selectedItem.skill}
              </div>

              <div className="flex justify-between items-start mb-14 pb-8 border-b border-slate-900 relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-4 py-1 bg-primary-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full">Manual Evaluation Node</span>
                    <span className="text-slate-600 text-[10px] font-mono font-bold uppercase">{selectedItem.id}</span>
                  </div>
                  <h2 className="text-4xl font-display font-bold tracking-tight">Assessing <span className="text-primary-400">{selectedItem.skill} Task</span></h2>
                  <p className="text-slate-500 text-sm mt-3 font-medium">Student: <span className="text-slate-300">{selectedItem.userEmail}</span> • Exam Type: <span className="text-slate-300">{selectedItem.testTitle}</span></p>
                </div>
                <button onClick={() => setSelectedItem(null)} className="p-3 bg-slate-900 hover:bg-slate-800 rounded-2xl border border-slate-800 text-slate-500 hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="space-y-12 relative z-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Submission Stream (Raw)</h4>
                    <span className="text-[10px] font-bold text-slate-600 uppercase font-mono">{selectedItem.studentAnswer.split(' ').length} Words</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-900 rounded-[2.5rem] p-10 min-h-[300px] max-h-[500px] overflow-y-auto leading-relaxed text-slate-200 italic whitespace-pre-wrap text-lg shadow-inner">
                    "{selectedItem.studentAnswer}"
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-10 border-t border-slate-900">
                  <div className="md:col-span-5 space-y-8">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 ml-1">Grade Assignment (0 - {selectedItem.maxScore})</label>
                      <div className="relative group">
                        <input 
                          type="number" 
                          step="0.5"
                          max={selectedItem.maxScore}
                          min={0}
                          className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-primary-400 font-display font-bold text-6xl outline-none focus:border-primary-500/50 transition-all text-center"
                          value={score}
                          onChange={(e) => setScore(Number(e.target.value))}
                        />
                        <div className="absolute inset-0 rounded-3xl pointer-events-none border border-primary-500/0 group-hover:border-primary-500/20 transition-all" />
                      </div>
                    </div>
                    
                    <div className="p-8 bg-primary-600/5 border border-primary-500/10 rounded-3xl">
                      <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-3">Evaluation Rubric</p>
                      <ul className="space-y-2 text-[10px] text-slate-500 font-bold uppercase leading-relaxed">
                        <li className="flex items-center gap-2">○ Task Response & Precision</li>
                        <li className="flex items-center gap-2">○ Coherence and Cohesion</li>
                        <li className="flex items-center gap-2">○ Lexical Resource Range</li>
                        <li className="flex items-center gap-2">○ Grammatical Accuracy</li>
                      </ul>
                    </div>

                    <button 
                      onClick={toggleRecording}
                      className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                        isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-white' : 'bg-red-500'}`} />
                      {isRecording ? 'Stop Recording' : 'Attach Audio Feedback'}
                    </button>
                  </div>
                  
                  <div className="md:col-span-7 flex flex-col h-full">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 ml-1">Comprehensive Evaluator Insight</label>
                    <div className="relative flex-grow group">
                      <textarea 
                        className="w-full bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 text-slate-200 min-h-[300px] h-full resize-none outline-none focus:border-primary-500/50 transition-all leading-relaxed placeholder:text-slate-700"
                        placeholder="Provide deep academic feedback on strengths and areas for improvement..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                      />
                      <div className="absolute top-6 right-6 flex gap-2">
                         <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-slate-600 hover:text-primary-400 transition-colors cursor-pointer border border-slate-800">B</div>
                         <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center text-slate-600 hover:text-primary-400 transition-colors cursor-pointer border border-slate-800">I</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    onClick={handleGrade}
                    disabled={submitting || !feedback.trim()}
                    className="w-full py-6 bg-primary-600 hover:bg-primary-500 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary-500/30 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Finalizing Assessment...
                      </>
                    ) : (
                      <>
                        Commit Assessment & Dispatch Results
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </>
                    )}
                  </button>
                  <p className="text-center text-[9px] text-slate-600 font-bold uppercase mt-6 tracking-widest">
                    Synchronous result flow will trigger an automated secure notification to the student terminal.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center glass rounded-[4rem] border border-slate-800 border-dashed p-32 text-slate-600 shadow-xl group">
              <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-8 border border-slate-800 opacity-40 group-hover:scale-110 group-hover:opacity-60 transition-all duration-500">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Node Awaiting Selection</h3>
              <p className="text-sm font-medium max-w-xs text-center leading-relaxed">Please select a student submission from the prioritized queue on the left to begin the assessment cycle.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
