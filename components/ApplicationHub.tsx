import React from 'react';
import { ViewState } from '../types';

interface ApplicationHubProps {
  onNavigate: (view: ViewState) => void;
}

const ApplicationHub: React.FC<ApplicationHubProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 animate-in fade-in duration-700 bg-white">
      <div className="text-center mb-24">
        <span className="text-sm font-medium text-unicou-orange italic mb-6 block">
          Your Gateway to International Excellence
        </span>
        <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-unicou-navy mb-8 leading-[1.1] uppercase">
          Global Education Hub: <br />
          <span className="text-unicou-orange">Study Abroad & Test Prep Specialist</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-bold italic border-b-2 border-slate-100 pb-12">
          Secure your University Admission, Master your Exams with our LMS, and 
          Save on Official Vouchers for IELTS, PTE, TOEFL, LanguageCert, Duolingo, GRE and more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Student Path */}
        <div className="group bg-white p-12 rounded-[4rem] border border-slate-200 hover:border-unicou-vibrant/30 transition-all shadow-xl hover:shadow-3xl flex flex-col h-full relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-unicou-vibrant opacity-5 rounded-full blur-2xl group-hover:opacity-20 transition-all" />
          <div className="flex-grow">
            <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-10 border border-slate-100 shadow-inner"><span className="text-4xl">🎓</span></div>
            <h2 className="text-4xl font-display font-black text-slate-950 mb-6 uppercase tracking-tighter leading-none">Student <br />Registry</h2>
            <p className="text-slate-700 text-lg mb-8 leading-relaxed font-semibold italic">"Begin your international academic journey. Admission matching, visa protocols, and destination mapping nodes."</p>
            <ul className="space-y-4 mb-12">
               {['Global University Admissions', 'Visa Strategy Protocol', 'Academic Trajectory Mapping'].map(item => (
                 <li key={item} className="flex items-center gap-4 text-[12px] font-black text-slate-950 uppercase tracking-tight">
                   <div className="w-5 h-5 rounded-full bg-unicou-vibrant flex items-center justify-center text-white text-[9px]">✓</div>
                   {item}
                 </li>
               ))}
            </ul>
          </div>
          <button onClick={() => onNavigate({ type: 'apply', formType: 'student-apply' })} className="w-full py-6 bg-unicou-navy text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-950 transition-all">INITIALIZE REGISTRY</button>
        </div>

        {/* Agent Path */}
        <div className="group bg-white p-12 rounded-[4rem] border border-slate-200 hover:border-unicou-orange/30 transition-all shadow-xl hover:shadow-3xl flex flex-col h-full relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-unicou-orange opacity-5 rounded-full blur-2xl group-hover:opacity-20 transition-all" />
          <div className="flex-grow">
            <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-10 border border-slate-100 shadow-inner"><span className="text-4xl">🤝</span></div>
            <h2 className="text-4xl font-display font-black text-slate-950 mb-6 uppercase tracking-tighter leading-none">Partner <br />Node</h2>
            <p className="text-slate-700 text-lg mb-8 leading-relaxed font-semibold italic">"Establish an agency partnership. Access bulk exam rates, lead management systems, and institutional support."</p>
            <ul className="space-y-4 mb-12">
               {['Bulk Voucher Inventory', 'Lead Management Terminal', 'Institutional Sync Status'].map(item => (
                 <li key={item} className="flex items-center gap-4 text-[12px] font-black text-slate-950 uppercase tracking-tight">
                   <div className="w-5 h-5 rounded-full bg-unicou-orange flex items-center justify-center text-white text-[9px]">✓</div>
                   {item}
                 </li>
               ))}
            </ul>
          </div>
          <button onClick={() => onNavigate({ type: 'apply', formType: 'agent-reg' })} className="w-full py-6 bg-unicou-orange text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-orange-600 transition-all">APPLY FOR PARTNERSHIP</button>
        </div>

        {/* Support Path */}
        <div className="group bg-white p-12 rounded-[4rem] border border-slate-200 hover:border-slate-400 transition-all shadow-xl hover:shadow-3xl flex flex-col h-full relative overflow-hidden">
          <div className="flex-grow">
            <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-10 border border-slate-100 shadow-inner"><span className="text-4xl">📞</span></div>
            <h2 className="text-4xl font-display font-black text-slate-950 mb-6 uppercase tracking-tighter leading-none">Support <br />Terminal</h2>
            <p className="text-slate-700 text-lg mb-8 leading-relaxed font-semibold italic">"Direct node-to-node assistance for technical, financial, or academic inquiries. Live consultant sync."</p>
            <ul className="space-y-4 mb-12">
               {['Instant WhatsApp Connect', 'Fulfillment Support', 'Policy Clarification'].map(item => (
                 <li key={item} className="flex items-center gap-4 text-[12px] font-black text-slate-950 uppercase tracking-tight">
                   <div className="w-5 h-5 rounded-full bg-slate-400 flex items-center justify-center text-white text-[9px]">✓</div>
                   {item}
                 </li>
               ))}
            </ul>
          </div>
          <a href="https://wa.me/4470000000" target="_blank" rel="noopener noreferrer" className="w-full py-6 bg-slate-900 text-white rounded-3xl text-center font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all">OPEN WHATSAPP SYNC</a>
        </div>
      </div>
    </div>
  );
};

export default ApplicationHub;