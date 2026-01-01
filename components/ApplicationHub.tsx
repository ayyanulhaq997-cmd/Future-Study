
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
          Application <span className="text-unicou-orange">Hub</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-bold italic border-b border-slate-100 pb-8">
          Secure your University Admission, establish your Partner Node, or connect your Institution to the UNICOU global network.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Student Path */}
        <div className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-unicou-navy/30 transition-all shadow-xl hover:shadow-2xl flex flex-col h-full relative overflow-hidden">
          <div className="flex-grow">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border border-slate-100 shadow-inner"><span className="text-3xl">🎓</span></div>
            <h2 className="text-2xl font-display font-black text-slate-900 mb-4 uppercase tracking-tighter leading-none">Student <br />Admission</h2>
            <p className="text-slate-600 text-xs mb-6 leading-relaxed font-bold italic">"Full admission support for UK, USA, Canada, Australia and Europe. (Ref: edify.pk)"</p>
          </div>
          <button onClick={() => onNavigate({ type: 'apply', formType: 'student-apply' })} className="w-full py-4 bg-unicou-navy text-white rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-lg hover:bg-slate-950 transition-all">START ADMISSION</button>
        </div>

        {/* Agent Path */}
        <div className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-unicou-orange/30 transition-all shadow-xl hover:shadow-2xl flex flex-col h-full relative overflow-hidden">
          <div className="flex-grow">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border border-slate-100 shadow-inner"><span className="text-3xl">🤝</span></div>
            <h2 className="text-2xl font-display font-black text-slate-900 mb-4 uppercase tracking-tighter leading-none">Sub-Agent <br />Registry</h2>
            <p className="text-slate-600 text-xs mb-6 leading-relaxed font-bold italic">"Apply for official sub-agent status and access the bulk voucher vault. (Ref: afeic.pk)"</p>
          </div>
          <button onClick={() => onNavigate({ type: 'apply', formType: 'agent-reg' })} className="w-full py-4 bg-unicou-orange text-white rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-lg hover:bg-orange-600 transition-all">PARTNER SIGNUP</button>
        </div>

        {/* Prep Center Path */}
        <div className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-emerald-400 transition-all shadow-xl hover:shadow-2xl flex flex-col h-full relative overflow-hidden">
          <div className="flex-grow">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border border-slate-100 shadow-inner"><span className="text-3xl">🏛️</span></div>
            <h2 className="text-2xl font-display font-black text-slate-900 mb-4 uppercase tracking-tighter leading-none">Prep Center <br />Portal</h2>
            <p className="text-slate-600 text-xs mb-6 leading-relaxed font-bold italic">"Register your training facility as an authorized Pearson/IELTS prep center."</p>
          </div>
          <button onClick={() => onNavigate({ type: 'apply', formType: 'prep-center-reg' })} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition-all">CENTER REGISTRY</button>
        </div>

        {/* Institute Path */}
        <div className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-slate-400 transition-all shadow-xl hover:shadow-2xl flex flex-col h-full relative overflow-hidden">
          <div className="flex-grow">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border border-slate-100 shadow-inner"><span className="text-3xl">🎓</span></div>
            <h2 className="text-2xl font-display font-black text-slate-900 mb-4 uppercase tracking-tighter leading-none">Institute <br />Connect</h2>
            <p className="text-slate-600 text-xs mb-6 leading-relaxed font-bold italic">"For Universities and Global HEIs seeking deeper UNICOU integration."</p>
          </div>
          <button onClick={() => onNavigate({ type: 'apply', formType: 'institute-connect' })} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-lg hover:bg-black transition-all">CONTACT US</button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationHub;
