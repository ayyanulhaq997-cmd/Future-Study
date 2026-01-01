
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { LMSCourse, ViewState } from '../types';

interface LMSDashboardProps {
  onNavigate: (v: ViewState) => void;
}

const LMSDashboard: React.FC<LMSDashboardProps> = ({ onNavigate }) => {
  const [courses, setCourses] = useState<LMSCourse[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'my-learning'>('all');
  const [redeemCode, setRedeemCode] = useState('');
  const [redeeming, setRedeeming] = useState(false);

  const fetchData = async () => {
    const all = await api.getAllLMSCourses();
    const enrolled = await api.getEnrolledCourses();
    setCourses(all);
    setEnrolledIds(enrolled.map(c => c.id));
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!redeemCode.trim()) return;
    setRedeeming(true);
    try {
      await api.redeemCourseVoucher(redeemCode);
      setRedeemCode('');
      await fetchData();
      setActiveTab('my-learning');
      alert('Module Synchronization Authorized!');
    } catch (err: any) {
      alert(err.message || 'Invalid authorization code.');
    } finally {
      setRedeeming(false);
    }
  };

  const filteredCourses = activeTab === 'all' 
    ? courses 
    : courses.filter(c => enrolledIds.includes(c.id));

  if (loading) return <div className="p-40 text-center animate-pulse text-slate-800 font-black uppercase tracking-[0.3em]">Synchronizing Study Hub Node...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20 border-b border-slate-100 pb-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-unicou-navy/5 rounded-full text-unicou-navy text-[10px] font-black uppercase tracking-[0.2em] mb-6">
             <span className="w-1.5 h-1.5 bg-unicou-navy rounded-full animate-pulse" />
             Study Hub Protocol Active
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter mb-8 text-slate-950 leading-none">
            UNICOU <span className="text-unicou-orange">Study Hub</span>
          </h1>
          <p className="text-xl text-slate-900 font-bold leading-relaxed italic border-l-4 border-unicou-navy pl-8">
            Access our comprehensive e-learning resources and digital library. Authorized training for PTE Academic, IELTS, and international OTHM certifications.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-6 w-full md:w-auto">
          <form onSubmit={handleRedeem} className="flex gap-2 w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Authorization Code..." 
              value={redeemCode}
              onChange={(e) => setRedeemCode(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-sm font-mono focus:border-unicou-navy outline-none w-full md:w-64 shadow-inner text-slate-900"
            />
            <button 
              type="submit" 
              disabled={redeeming}
              className="bg-unicou-navy hover:bg-slate-950 text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-lg"
            >
              {redeeming ? 'Sync...' : 'Authorize'}
            </button>
          </form>

          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'all' ? 'bg-white text-unicou-navy shadow-md border border-slate-200' : 'text-slate-700 hover:text-slate-950'}`}
            >Catalogue</button>
            <button 
              onClick={() => setActiveTab('my-learning')}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'my-learning' ? 'bg-white text-unicou-navy shadow-md border border-slate-200' : 'text-slate-700 hover:text-slate-950'}`}
            >My Vault</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredCourses.map(course => {
          const isEnrolled = enrolledIds.includes(course.id);
          return (
            <div key={course.id} className="bg-white rounded-[3rem] overflow-hidden border border-slate-200 flex flex-col hover:border-unicou-orange/20 transition-all group shadow-lg hover:shadow-2xl">
              <div className="relative aspect-video overflow-hidden">
                <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={course.title} />
                <div className="absolute top-6 left-6 bg-unicou-navy/95 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
                  {course.category} MASTERCLASS
                </div>
              </div>
              
              <div className="p-10 flex-grow flex flex-col">
                <h3 className="text-2xl font-display font-black mb-4 text-slate-950 group-hover:text-unicou-navy transition-colors">{course.title}</h3>
                <p className="text-slate-800 text-sm font-bold line-clamp-2 mb-10 leading-relaxed italic">"{course.description}"</p>
                
                <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-widest text-slate-600 mb-10 mt-auto">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-unicou-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-unicou-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    {course.instructor}
                  </span>
                </div>

                {isEnrolled ? (
                  <button 
                    onClick={() => onNavigate({ type: 'lms-course-player', courseId: course.id })}
                    className="w-full py-5 bg-unicou-navy hover:bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                  >
                    Resume Hub
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                ) : (
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <div>
                       <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Standard Fee</p>
                       <span className="text-3xl font-display font-black text-slate-950">
                        {course.price > 0 ? `$${course.price}` : 'FREE'}
                      </span>
                    </div>
                    <button 
                      onClick={() => onNavigate({ type: 'course-catalogue' })}
                      className="px-8 py-4 bg-unicou-orange hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                    >
                      Authorize
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LMSDashboard;
