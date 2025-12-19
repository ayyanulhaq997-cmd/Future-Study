
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

  const handleEnroll = async (courseId: string) => {
    try {
      await api.enrollInCourse(courseId);
      setEnrolledIds([...enrolledIds, courseId]);
      alert('Enrolled successfully! Redirecting to course player...');
      onNavigate({ type: 'lms-course-player', courseId });
    } catch (e) {
      alert('Enrollment failed. Please try again.');
    }
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!redeemCode.trim()) return;
    setRedeeming(true);
    try {
      await api.redeemCourseVoucher(redeemCode);
      alert('Access Granted! Your course has been unlocked.');
      setRedeemCode('');
      await fetchData();
      setActiveTab('my-learning');
    } catch (err: any) {
      alert(err.message || 'Failed to redeem code.');
    } finally {
      setRedeeming(false);
    }
  };

  const filteredCourses = activeTab === 'all' 
    ? courses 
    : courses.filter(c => enrolledIds.includes(c.id));

  if (loading) return <div className="p-20 text-center animate-pulse">Initializing Learning Environment...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight mb-2">
            Nexus <span className="text-primary-400">Academy</span>
          </h1>
          <p className="text-slate-500 max-w-lg">
            Authorized training material for international certification exams.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-4 w-full md:w-auto">
          <form onSubmit={handleRedeem} className="flex gap-2 w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Enter Access Code..." 
              value={redeemCode}
              onChange={(e) => setRedeemCode(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:border-primary-500 outline-none w-full md:w-48"
            />
            <button 
              type="submit" 
              disabled={redeeming}
              className="bg-primary-600 hover:bg-primary-500 px-6 py-2 rounded-xl text-sm font-bold disabled:opacity-50"
            >
              {redeeming ? '...' : 'Redeem'}
            </button>
          </form>

          <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-primary-600 text-white' : 'text-slate-500'}`}
            >Browse Courses</button>
            <button 
              onClick={() => setActiveTab('my-learning')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'my-learning' ? 'bg-primary-600 text-white' : 'text-slate-500'}`}
            >My Learning</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map(course => {
          const isEnrolled = enrolledIds.includes(course.id);
          return (
            <div key={course.id} className="glass rounded-3xl overflow-hidden border border-slate-800 flex flex-col hover:border-primary-500/30 transition-all group shadow-xl">
              <div className="relative aspect-video overflow-hidden">
                <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={course.title} />
                <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary-400 border border-primary-500/20">
                  {course.category}
                </div>
                {course.status === 'Free' && (
                  <div className="absolute top-4 right-4 bg-emerald-500/90 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                    Free
                  </div>
                )}
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary-400 transition-colors">{course.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed">{course.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-slate-400 mb-8 mt-auto">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    {course.instructor}
                  </span>
                </div>

                {isEnrolled ? (
                  <button 
                    onClick={() => onNavigate({ type: 'lms-course-player', courseId: course.id })}
                    className="w-full py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group-active:scale-95 shadow-lg shadow-primary-500/20"
                  >
                    Continue Learning
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold font-mono text-white">
                      {course.price > 0 ? `$${course.price}` : 'FREE'}
                    </span>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => onNavigate({ type: 'course-catalogue' })}
                        className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold border border-slate-700 transition-all text-xs"
                      >
                        Buy Now
                      </button>
                    </div>
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
