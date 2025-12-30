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
    const interval = setInterval(fetchData, 10000); // Polling for new submissions
    return () => clearInterval(interval);
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
      setFeedback(prev => prev + "\n[SYSTEM: AUDIO FEEDBACK ATTACHED]");
    }
  };

  if (loading) return <div className="p-40 text-center animate-pulse text-unicou-navy font-black uppercase tracking-widest text-[11px]">Initializing Evaluation Environment...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 view-container pb-24 bg-white">
      {showSuccessToast && (
        <div className="fixed top-32 right-8 z-[200] bg-emerald-600 text-white p-6 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right duration-500">
           <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
           </div>
           <div>
             <p className="font-black uppercase tracking-widest text-[10px]">Record Committed</p>
             <p className="text-xs font-bold opacity-80 italic">Student notified via Dashboard Sync.</p>
           </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
        <div>
          <h1 className="text-5xl font-display font-black tracking-tight text-slate-900 leading-none">Trainer <span className="text-unicou-orange">Portal</span></h1>
          <p className="text-slate-500 mt-4 font-bold uppercase text-xs tracking-widest">Operator: <span className="text-unicou-navy font-black">{user.email}</span> • Registry: <span className="text-unicou-orange">Manual Evaluation Node</span></p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-200 shadow-inner">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Queue Load</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-display font-black text-unicou-navy leading-none">{pendingSubmissions.length}</span>
              <span className="text-[9px] font-bold text-emerald-600 uppercase">Live Tasks</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Submission Queue */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-[3.5rem] border border-slate-200 overflow-hidden shadow-2xl flex flex-col h-[700px]">
            <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
               <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Task Registry</h3>
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                 <span className="text-[9px] font-black text-slate-400 uppercase">Real-time Stream</span>
               </div>
            </div>
            
            <div className="overflow-y-auto flex-grow no-scrollbar divide-y divide-slate-50">
              {pendingSubmissions.length === 0 ? (
                <div className="p-20 text-center flex flex-col items-center justify-center h-full">
                  <div className="text-5xl mb-6 grayscale opacity-20">📭</div>
                  <p className="text-slate-400 italic font-bold uppercase tracking-widest text-[10px]">Registry Clear. No tasks pending.</p>
                </div>
              ) : (
                pendingSubmissions.map(s => {
                  const isSelected = selectedItem?.id === s.id;
                  return (
                    <button 
                      key={s.id} 
                      onClick={() => { setSelectedItem(s); setScore(0); setFeedback(''); }}
                      className={`w-full text-left p-8 transition-all hover:bg-slate-50 group relative ${isSelected ? 'bg-unicou-navy/5' : ''}`}
                    >
                      {isSelected && <div className="absolute left-0 top-0 w-1 h-full bg-unicou-orange" />}
                      <div className="flex justify-between items-start mb-4">
                         <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${s.skill === 'Writing' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>{s.skill}</span>
                         <span className="text-[9px] font-mono font-bold text-slate-400">{new Date(s.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <h4 className="font-black text-slate-900 uppercase tracking-tight text-lg mb-1 group-hover:text-unicou-navy transition-colors">{s.userName}</h4>
                      <p className="text-[10px] text-slate-500 font-mono italic">{s.userEmail}</p>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Assessment Terminal */}
        <div className="lg:col-span-8">
          {selectedItem ? (
            <div className="bg-white rounded-[4rem] border border-slate-200 p-12 md:p-16 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
               <div className="absolute top-0 right-0 p-16 opacity-5 font-display font-black text-9xl pointer-events-none select-none uppercase tracking-tighter text-slate-900">
                 {selectedItem.skill}
               </div>

               <div className="relative z-10 mb-12 pb-12 border-b border-slate-100 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                       <span className="px-4 py-1.5 bg-unicou-navy text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">Manual Scoring Active</span>
                       <span className="text-[10px] font-mono font-black text-slate-400 uppercase">NODE: {selectedItem.id}</span>
                    </div>
                    <h2 className="text-4xl font-display font-black text-slate-950 tracking-tighter uppercase leading-none">Global <span className="text-unicou-orange">Assessment</span></h2>
                    <p className="text-slate-500 text-base mt-4 font-bold italic leading-relaxed">
                      Assessing <span className="text-unicou-navy">{selectedItem.userName}</span> for <span className="text-unicou-navy">{selectedItem.testTitle}</span>. 
                      Protocol requires deep academic insight and rubric adherence.
                    </p>
                  </div>
                  <button onClick={() => setSelectedItem(null)} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-3xl text-slate-400 transition-all">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
               </div>

               <div className="space-y-12 relative z-10">
                  {/* Added Question Context section */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Question Context / Prompt</h4>
                    <div className="bg-unicou-navy/5 border border-unicou-navy/10 rounded-3xl p-8 leading-relaxed text-unicou-navy font-bold italic text-base">
                      {selectedItem.questionText || "No context provided."}
                    </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex justify-between items-center px-2">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Response Core</h4>
                        <span className="text-[10px] font-black text-slate-900 uppercase font-mono bg-slate-50 px-3 py-1 rounded-full border border-slate-100">{selectedItem.studentAnswer.split(/\s+/).length} Word Count</span>
                     </div>
                     <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-12 min-h-[300px] leading-relaxed text-slate-800 italic text-xl shadow-inner whitespace-pre-wrap">
                       "{selectedItem.studentAnswer}"
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-12 border-t border-slate-100">
                     <div className="md:col-span-5 space-y-8">
                        <div>
                           <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-2">Final Band Score (0 - {selectedItem.maxScore})</label>
                           <input 
                             type="number" step="0.5" max={selectedItem.maxScore} min={0}
                             className="w-full bg-slate-50 border border-slate-200 rounded-[2.5rem] p-10 text-unicou-navy font-display font-black text-7xl outline-none focus:border-unicou-orange focus:bg-white transition-all text-center shadow-inner"
                             value={score}
                             onChange={(e) => setScore(Number(e.target.value))}
                           />
                        </div>

                        <div className="p-8 bg-unicou-navy rounded-[2.5rem] shadow-xl text-white">
                           <p className="text-[10px] font-black text-unicou-vibrant uppercase tracking-widest mb-4">Strategic Rubric</p>
                           <ul className="space-y-3 text-[10px] font-black uppercase tracking-widest opacity-70 italic">
                             <li>○ Lexical Resource Diversity</li>
                             <li>○ Task Achievement Precision</li>
                             <li>○ Cohesion & Coherence Loop</li>
                             <li>○ Grammatical Standard</li>
                           </ul>
                        </div>

                        <button 
                          onClick={toggleRecording}
                          className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-4 transition-all ${
                            isRecording ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                           <div className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-white' : 'bg-red-600'}`} />
                           {isRecording ? 'Stop Biometric Record' : 'Attach Voice Feedback'}
                        </button>
                     </div>

                     <div className="md:col-span-7 flex flex-col h-full">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 ml-2">Academic Trainer Feedback</label>
                        <textarea 
                          className="w-full bg-slate-50 border border-slate-200 rounded-[3rem] p-10 text-slate-900 min-h-[300px] h-full resize-none outline-none focus:border-unicou-navy focus:bg-white transition-all leading-relaxed text-lg shadow-inner placeholder:text-slate-300 font-bold"
                          placeholder="Provide actionable feedback for improvement..."
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                        />
                     </div>
                  </div>

                  <div className="pt-8">
                     <button 
                       onClick={handleGrade}
                       disabled={submitting || !feedback.trim()}
                       className="w-full py-8 bg-unicou-navy hover:bg-slate-950 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-3xl transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center gap-6"
                     >
                       {submitting ? (
                         <>
                           <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                           SYNCHRONIZING RECORD...
                         </>
                       ) : (
                         <>
                           COMMIT ASSESSMENT & DISPATCH
                           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                         </>
                       )}
                     </button>
                     <p className="text-center text-[9px] text-slate-400 font-black uppercase mt-8 tracking-[0.3em]">
                        Finalized metrics will be immediately mirrored to the student terminal.
                     </p>
                  </div>
               </div>
            </div>
          ) : (
            <div className="h-[700px] bg-slate-50 rounded-[5rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center p-32 text-center group">
               <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-10 border border-slate-100 shadow-xl group-hover:scale-110 transition-transform duration-700 opacity-40">
                  <svg className="w-12 h-12 text-unicou-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
               </div>
               <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tighter mb-4">Terminal Awaiting Sync</h3>
               <p className="text-slate-500 font-bold italic text-lg leading-relaxed max-w-sm">"Select a student submission from the live global queue to begin the evaluation protocol."</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;