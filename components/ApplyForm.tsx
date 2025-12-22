
import React, { useState } from 'react';
import { FormType } from '../types';

interface ApplyFormProps {
  type: FormType;
  context?: string;
  onSuccess?: () => void;
}

const ApplyForm: React.FC<ApplyFormProps> = ({ type, context, onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
      if (onSuccess) onSuccess();
    }, 1500);
  };

  if (done) return (
    <div className="glass p-12 rounded-[2.5rem] border border-emerald-500/30 text-center animate-in zoom-in">
      <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
      </div>
      <h3 className="text-3xl font-display font-bold mb-4">Identity Synced</h3>
      <p className="text-slate-400 mb-8">Your request has been securely dispatched. An academic specialist will connect shortly.</p>
      <button onClick={() => setDone(false)} className="text-primary-400 font-bold hover:underline uppercase text-[10px] tracking-widest">Open New Connection</button>
    </div>
  );

  return (
    <div className="glass p-8 md:p-12 rounded-[3rem] border border-slate-800 shadow-3xl animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-10 text-center md:text-left">
        <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] mb-2 block">{context || 'Internal Service Node'}</span>
        <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tighter">
          {type === 'membership' ? 'Partner Membership' : type === 'study-abroad' ? 'Student Application' : 'Global Enquiry'}
        </h2>
        <p className="text-slate-500 text-sm mt-3">All transmissions are encrypted via the UNICOU Academic Nexus.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Full Name" placeholder="Alex Johnson" required />
          <Input label="Email Address" type="email" placeholder="alex@nexus.ai" required />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Phone / WhatsApp" placeholder="+44 700 000 000" required />
          <Input label="Current Location" placeholder="City, Country" required />
        </div>

        {type === 'study-abroad' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="Target Country" options={['United Kingdom', 'Australia', 'USA', 'Canada', 'Ireland', 'Germany']} />
              <Select label="Last Qualification" options={['O-Levels', 'A-Levels', 'Bachelor', 'Master', 'Intermediate']} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="English Language Test" options={['Not Taken Yet', 'PTE Academic', 'IELTS Academic', 'TOEFL iBT', 'Duolingo']} />
              <Input label="Desired Course" placeholder="e.g. MSc Data Science" />
            </div>
          </>
        )}

        {type === 'membership' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Center / Company Name" placeholder="Global Training Hub" required />
              <Select label="Membership Tier" options={['Sub-Agent', 'Training Partner', 'Preparation Center']} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Current Monthly Leads" placeholder="e.g. 50+" />
              <Select label="Region" options={['Europe', 'Middle East', 'South Asia', 'Africa', 'Americas']} />
            </div>
          </>
        )}

        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Context Payload (Optional)</label>
          <textarea className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-200 outline-none focus:border-primary-500 h-32 resize-none" placeholder="Elaborate on your requirements..."></textarea>
        </div>

        <button 
          disabled={submitting}
          className="w-full py-6 bg-unicou-navy hover:bg-[#003a4d] text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4"
        >
          {submitting ? 'Initializing Node Sync...' : 'Initialize Roadmap'}
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
      </form>
    </div>
  );
};

const Input = ({ label, ...props }: any) => (
  <div>
    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">{label}</label>
    <input className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 outline-none focus:border-primary-500 transition-all" {...props} />
  </div>
);

const Select = ({ label, options }: any) => (
  <div>
    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">{label}</label>
    <div className="relative">
      <select className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 outline-none focus:border-primary-500 appearance-none cursor-pointer">
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  </div>
);

export default ApplyForm;
