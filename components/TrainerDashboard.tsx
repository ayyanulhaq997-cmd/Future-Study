
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
      await fetchData();
    } catch (e) {
      alert('Failed to submit evaluation.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-primary-400">Loading Trainer Terminal...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-display font-bold">Trainer <span className="text-primary-400">Portal</span></h1>
          <p className="text-slate-500 text-sm mt-1">Manual evaluation node for academic writing & speaking tasks.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass px-6 py-4 rounded-2xl border-slate-800">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Assigned Tasks</p>
            <p className="text-2xl font-bold font-mono text-primary-400">{pendingSubmissions.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Task Queue Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass rounded-3xl border border-slate-800 overflow-hidden h-[calc(100vh-300px)] flex flex-col">
            <div className="px-6 py-4 bg-slate-900/50 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-sm uppercase tracking-widest">Task Queue</h3>
              <span className="bg-primary-500/10 text-primary-400 text-[10px] font-black px-2 py-0.5 rounded">Oldest First</span>
            </div>
            <div className="overflow-y-auto flex-grow divide-y divide-slate-800/50">
              {pendingSubmissions.map(s => (
                <button 
                  key={s.id} 
                  onClick={() => { setSelectedItem(s); setScore(0); setFeedback(''); }}
                  className={`w-full text-left p-6 transition-all hover:bg-slate-800/30 group ${selectedItem?.id === s.id ? 'bg-primary-600/5 border-l-4 border-l-primary-500' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${s.skill === 'Writing' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}`}>{s.skill}</span>
                    <span className="text-[9px] text-slate-600 font-mono">{new Date(s.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <h4 className="font-bold text-slate-200 text-sm mb-1 group-hover:text-primary-400">{s.userEmail}</h4>
                  <p className="text-[10px] text-slate-500 truncate">{s.testTitle}</p>
                </button>
              ))}
              {pendingSubmissions.length === 0 && (
                <div className="p-12 text-center text-slate-600 italic text-sm">No pending submissions.</div>
              )}
            </div>
          </div>
        </div>

        {/* Evaluation Interface */}
        <div className="lg:col-span-8">
          {selectedItem ? (
            <div className="glass rounded-[3rem] border border-slate-800 p-10 shadow-2xl animate-in fade-in duration-300">
              <div className="flex justify-between items-start mb-10 pb-6 border-b border-slate-900">
                <div>
                  <h2 className="text-2xl font-bold">Evaluating <span className="text-primary-400">{selectedItem.skill} Task</span></h2>
                  <p className="text-slate-500 text-sm mt-1">Student: {selectedItem.userEmail} | Ref: {selectedItem.id}</p>
                </div>
                <button onClick={() => setSelectedItem(null)} className="text-slate-600 hover:text-white transition-colors">Close</button>
              </div>

              <div className="space-y-10">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Student Submission Content</h4>
                  <div className="bg-slate-950 border border-slate-900 rounded-[2rem] p-8 min-h-[250px] max-h-[400px] overflow-y-auto leading-relaxed text-slate-300 italic whitespace-pre-wrap">
                    "{selectedItem.studentAnswer}"
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-900">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Target Score (0 - {selectedItem.maxScore})</label>
                      <input 
                        type="number" 
                        step="0.5"
                        max={selectedItem.maxScore}
                        min={0}
                        className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-5 text-primary-400 font-bold text-3xl outline-none focus:border-primary-500 transition-all"
                        value={score}
                        onChange={(e) => setScore(Number(e.target.value))}
                      />
                    </div>
                    <div className="p-4 bg-primary-500/5 border border-primary-500/10 rounded-2xl">
                      <p className="text-[9px] text-primary-400/60 leading-relaxed">Evaluation Rubric: Consider Coherence, Lexical Resource, Grammatical Range, and Task Response.</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">High-Quality Evaluator Feedback</label>
                    <textarea 
                      className="w-full bg-slate-900 border border-slate-700 rounded-[2rem] p-6 text-slate-200 h-full min-h-[200px] resize-none outline-none focus:border-primary-500 transition-all"
                      placeholder="Enter detailed feedback for the student..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  onClick={handleGrade}
                  disabled={submitting}
                  className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {submitting ? 'Finalizing...' : 'Save & Notify Student'}
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center glass rounded-[3rem] border border-slate-800 border-dashed p-20 text-slate-600">
              <svg className="w-20 h-20 mb-6 opacity-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <p className="text-lg font-medium">Select a student submission from the queue to begin evaluation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;
