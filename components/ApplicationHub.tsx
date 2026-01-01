
import React from 'react';
import { ViewState } from '../types';

interface ApplicationHubProps {
  onNavigate: (view: ViewState) => void;
}

const ApplicationHub: React.FC<ApplicationHubProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in duration-700 bg-white">
      <div className="text-center mb-16">
        <span className="text-xs font-black text-unicou-orange uppercase tracking-[0.3em] mb-4 block">
          Global Mobility Infrastructure
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-unicou-navy mb-6 leading-none uppercase">
          Global Education Hub <br />
          <span className="text-unicou-orange">Study Abroad & Test Prep Specialist</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-bold italic border-b border-slate-100 pb-8">
          Secure your University Admission, Master your Exams with our LMS, and Save on Official Vouchers for IELTS, PTE, TOEFL, LanguageCert, Duolingo, GRE and more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Student Path */}
        <div className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-unicou-vibrant/30 transition-all shadow-xl hover:shadow-2xl flex flex-col h-full relative overflow-hidden">
          <div className="flex-grow">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border border-slate-100 shadow-inner"><span className="text-3xl">🎓</span></div>
            <h2 className="text-3xl font-display font-black text-slate-900 mb-4 uppercase tracking-tighter leading-none">Student <br />Registry</h2>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed font-bold italic">"Begin your international academic journey. Admission matching, visa protocols, and destination mapping nodes."</p>
            <ul className="space-y-3 mb-10">
               {['Global Admissions', 'Visa Strategy', 'Academic Trajectory'].map(item => (
                 <li key={item} className="flex items-center gap-3 text-[10px] font-black text-slate-900 uppercase tracking-tight">
                   <div className="w-4 h-4 rounded-full bg-unicou-vibrant flex items-center justify-center text-white text-[8px]">✓</div>
                   {item}
                 </li>
               ))}
            </ul>
          </div>
          <button onClick={() => onNavigate({ type: 'apply', formType: 'student-apply' })} className="w-full py-5 bg-unicou-navy text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-slate-950 transition-all">INITIALIZE REGISTRY</button>
        </div>

        {/* Agent Path */}
        <div className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-unicou-orange/30 transition-all shadow-xl hover:shadow-2xl flex flex-col h-full relative overflow-hidden">
          <div className="flex-grow">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border border-slate-100 shadow-inner"><span className="text-3xl">🤝</span></div>
            <h2 className="text-3xl font-display font-black text-slate-900 mb-4 uppercase tracking-tighter leading-none">Partner <br />Node</h2>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed font-bold italic">"Establish an agency partnership. Access bulk exam rates, lead management systems, and institutional support."</p>
            <ul className="space-y-3 mb-10">
               {['Bulk Vouchers', 'Lead Terminal', 'Institutional Sync'].map(item => (
                 <li key={item} className="flex items-center gap-3 text-[10px] font-black text-slate-900 uppercase tracking-tight">
                   <div className="w-4 h-4 rounded-full bg-unicou-orange flex items-center justify-center text-white text-[8px]">✓</div>
                   {item}
                 </li>
               ))}
            </ul>
          </div>
          <button onClick={() => onNavigate({ type: 'apply', formType: 'agent-reg' })} className="w-full py-5 bg-unicou-orange text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-orange-600 transition-all">APPLY FOR PARTNERSHIP</button>
        </div>

        {/* Support Path */}
        <div className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-slate-400 transition-all shadow-xl hover:shadow-2xl flex flex-col h-full relative overflow-hidden">
          <div className="flex-grow">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border border-slate-100 shadow-inner"><span className="text-3xl">📞</span></div>
            <h2 className="text-3xl font-display font-black text-slate-900 mb-4 uppercase tracking-tighter leading-none">Support <br />Terminal</h2>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed font-bold italic">"Direct node-to-node assistance for technical, financial, or academic inquiries. Live consultant sync."</p>
            <ul className="space-y-3 mb-10">
               {['Instant WhatsApp', 'Fulfillment Support', 'Policy Clarification'].map(item => (
                 <li key={item} className="flex items-center gap-3 text-[10px] font-black text-slate-900 uppercase tracking-tight">
                   <div className="w-4 h-4 rounded-full bg-slate-400 flex items-center justify-center text-white text-[8px]">✓</div>
                   {item}
                 </li>
               ))}
            </ul>
          </div>
          <a href="https://wa.me/4470000000" target="_blank" rel="noopener noreferrer" className="w-full py-5 bg-slate-900 text-white rounded-2xl text-center font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-black transition-all">OPEN WHATSAPP SYNC</a>
        </div>
      </div>
    </div>
  );
};

export default ApplicationHub;