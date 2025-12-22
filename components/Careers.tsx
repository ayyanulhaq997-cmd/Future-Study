
import React from 'react';
import ApplyForm from './ApplyForm';

const Careers: React.FC = () => {
  const jobs = [
    { title: "Academic Counselor", location: "Manchester / Remote", type: "Full-Time" },
    { title: "Visa Consultant", location: "Dubai / Remote", type: "Full-Time" },
    { title: "LMS Content Specialist", location: "Lahore / Remote", type: "Contract" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5">
          <h1 className="text-5xl font-display font-bold mb-8 tracking-tighter">Join the <span className="text-[#f15a24]">UNICOU</span> Mission</h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-12 font-medium">We are building the world's most advanced infrastructure for global education. Join a team that moves boundaries.</p>
          
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Open Positions</h4>
            {jobs.map((job, i) => (
              <div key={i} className="glass p-6 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-slate-100">{job.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">{job.location} • {job.type}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-primary-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-7">
          <ApplyForm type="careers" context="Global Careers Unit" />
        </div>
      </div>
    </div>
  );
};

export default Careers;
