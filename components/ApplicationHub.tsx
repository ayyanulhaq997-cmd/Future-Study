import React from 'react';
import { ViewState } from '../types';

interface ApplicationHubProps {
  onNavigate: (view: ViewState) => void;
}

const ApplicationHub: React.FC<ApplicationHubProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 animate-in fade-in duration-700 bg-white">
      <div className="text-center mb-24">
        <span className="text-[11px] font-black text-unicou-orange uppercase tracking-[0.5em] mb-4 block">Unified Infrastructure Gateway</span>
        <h1 className="text-6xl md:text-[5.5rem] font-display font-black tracking-tighter text-slate-950 mb-8 leading-none">
          Three Verticals. <span className="text-unicou-navy">One Nexus.</span>
        </h1>
        <p className="text-2xl text-slate-800 max-w-2xl mx-auto leading-relaxed font-bold italic border-b-2 border-slate-100 pb-12">
          Initialize your connection with our specialized departments. Dedicated support nodes for students, partners, and institutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="group bg-white p-12 rounded-[4rem] border border-slate-200 hover:border-unicou-orange/30 transition-all shadow-xl hover:shadow-3xl flex flex-col h-full">
          <div className="flex-grow">
            <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-10 border border-slate-100 shadow-inner"><span className="text-4xl">🎫</span></div>
            <h2 className="text-4xl font-display font-black text-slate-950 mb-6 uppercase tracking-tighter leading-none">Voucher <br />Store</h2>
            <p className="text-slate-700 text-lg mb-8 leading-relaxed font-semibold italic">"Instant procurement for global Proficiency Exams. Secured stock, bulk agent rates, and immediate code dispatch node."</p>
            <ul className="space-y-4 mb-12">
               {['PTE/IELTS Vouchers', 'Bulk Agent Rates', 'Immediate Fulfilment'].map(item => (
                 <li key={item} className="flex items-center gap-4 text-[12px] font-black text-slate-950 uppercase tracking-tight">
                   <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[9px]">✓</div>
                   {item}
                 </li>
               ))}
            </ul>
          </div>
          <button onClick={() => onNavigate({ type: 'store' })} className="w-full py-6 bg-unicou-orange text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-orange-600 transition-all">OPEN VAULT</button>
        </div>

        <div className="group bg-white p-12 rounded-[4rem] border border-slate-200 hover:border-unicou-navy/30 transition-all shadow-xl hover:shadow-3xl flex flex-col h-full">
          <div className="flex-grow">
            <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-10 border border-slate-100 shadow-inner"><span className="text-4xl">🏛️</span></div>
            <h2 className="text-4xl font-display font-black text-slate-950 mb-6 uppercase tracking-tighter leading-none">Study Abroad <br />Consultancy</h2>
            <p className="text-slate-700 text-lg mb-8 leading-relaxed font-semibold italic">"End-to-end guidance for 15+ countries. University admissions, visa strategy, and global migration consult pathways."</p>
            <ul className="space-y-4 mb-12">
               {['15+ Destinations', 'Visa Strategy Node', 'Institution Matching'].map(item => (
                 <li key={item} className="flex items-center gap-4 text-[12px] font-black text-slate-950 uppercase tracking-tight">
                   <div className="w-5 h-5 rounded-full bg-unicou-navy flex items-center justify-center text-white text-[9px]">✓</div>
                   {item}
                 </li>
               ))}
            </ul>
          </div>
          <button onClick={() => onNavigate({ type: 'country-list' })} className="w-full py-6 bg-unicou-navy text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-950 transition-all">VIEW DESTINATIONS</button>
        </div>

        <div className="group bg-white p-12 rounded-[4rem] border border-slate-200 hover:border-slate-400 transition-all shadow-xl hover:shadow-3xl flex flex-col h-full">
          <div className="flex-grow">
            <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-10 border border-slate-100 shadow-inner"><span className="text-4xl">🎓</span></div>
            <h2 className="text-4xl font-display font-black text-slate-950 mb-6 uppercase tracking-tighter leading-none">Learning <br />Hub Hub</h2>
            <p className="text-slate-700 text-lg mb-8 leading-relaxed font-semibold italic">"Mastery courses and mock test terminals. Professional qualifications (OTHM) and teacher preparation nodes."</p>
            <ul className="space-y-4 mb-12">
               {['PTE/IELTS Mastery', 'OTHM Certifications', 'Mock Exam Node'].map(item => (
                 <li key={item} className="flex items-center gap-4 text-[12px] font-black text-slate-950 uppercase tracking-tight">
                   <div className="w-5 h-5 rounded-full bg-slate-400 flex items-center justify-center text-white text-[9px]">✓</div>
                   {item}
                 </li>
               ))}
            </ul>
          </div>
          <button onClick={() => onNavigate({ type: 'lms-dashboard' })} className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all">LAUNCH ACADEMY</button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationHub;