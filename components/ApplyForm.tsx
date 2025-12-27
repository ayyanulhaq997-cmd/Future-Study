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
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Decorative vibrant elements (3-5% coverage)
  const VibrantAccents = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[4rem]">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-unicou-vibrant opacity-20 blur-3xl rounded-full" />
      <div className="absolute top-1/2 -left-8 w-16 h-16 bg-unicou-electric opacity-30 blur-2xl rounded-full animate-pulse" />
      <div className="absolute bottom-10 right-20 w-4 h-4 bg-unicou-vibrant rounded-full shadow-[0_0_15px_#00f2ff]" />
    </div>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert("Validation Required: Please authorize the UNICOU Data Protocol.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
      if (onSuccess) onSuccess();
    }, 1800);
  };

  if (done) return (
    <div className="relative bg-white p-12 md:p-20 rounded-[4rem] border border-slate-100 text-center animate-in zoom-in shadow-premium">
      <VibrantAccents />
      <div className="relative z-10">
        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-4xl font-display font-bold text-unicou-navy mb-4 tracking-tighter">NODE SYNCHRONIZED</h3>
        <p className="text-slate-600 text-lg mb-10 leading-relaxed font-medium italic max-w-md mx-auto">
          "Your profile has been successfully transmitted to the UNICOU Global Registry. A consultant will initialize contact shortly."
        </p>
        <button onClick={() => { setDone(false); setAgreeTerms(false); }} className="px-12 py-5 bg-unicou-navy text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-950 transition-all active:scale-95">NEW REGISTRATION</button>
      </div>
    </div>
  );

  return (
    <div className="relative bg-white p-10 md:p-16 rounded-[4rem] border border-slate-100 shadow-premium animate-in fade-in slide-in-from-bottom-6 overflow-hidden">
      <VibrantAccents />
      
      {/* Top Vibrant Strip */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-unicou-navy via-unicou-vibrant to-unicou-orange" />
      
      <div className="relative z-10 mb-12">
        <div className="flex items-center gap-3 mb-4">
           <div className="vibrant-strip w-12"></div>
           <span className="text-[10px] font-black text-unicou-orange uppercase tracking-[0.4em]">{context || 'REGISTRY PROTOCOL'}</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-unicou-navy tracking-tight leading-none mb-4">
          {type === 'student-apply' ? 'STUDENT REGISTRY' : 'PARTNER PROTOCOL'}
        </h2>
        <p className="text-slate-500 font-medium italic">Complete the verified fields below to establish your secure node entry.</p>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
        {type === 'student-apply' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <Input label="Student Full Name (Passport)" placeholder="Legal Name" required />
            <Input label="Guardian / Father's Name" placeholder="Full Name" required />
            <Input label="Primary WhatsApp" placeholder="+00 000 0000" required />
            <Input label="Identity Email" type="email" placeholder="student@email.com" required />
            <Input label="City of Residence" placeholder="Current Location" required />
            <Select label="Priority Destination" options={[
              'United Kingdom', 'USA', 'Canada', 'Australia', 'New Zealand', 'Europe Hub', 'Dubai (UAE)'
            ]} />
            <Input label="Last Qualification" placeholder="e.g. Master, Bachelor" required />
            <Input label="Academic Merit (GPA/%)" placeholder="e.g. 3.8 / 85%" required />
            <Select label="English Proficiency" options={[
              'IELTS Academic', 'PTE Academic', 'Oxford ELLT', 'LanguageCert', 'TOEFL iBT', 'Duolingo'
            ]} />
            <Select label="Target Intake" options={['September 2025', 'January 2026', 'May 2026']} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <Input label="Agency Legal Entity" placeholder="Company Name" required />
            <Input label="Managing Director / CEO" placeholder="Full Name" required />
            <Input label="Professional Email" type="email" placeholder="partnership@agency.com" required />
            <Input label="Business WhatsApp" placeholder="+00 000 0000" required />
            <Input label="Years of Industry Presence" type="number" placeholder="e.g. 8" required />
            <Select label="Core Specialization" options={[
              'Education Consultancy', 'English Training', 'Visa Support', 'Global Recruitment'
            ]} />
            <div className="md:col-span-2">
              <Input label="Full Operational Address" placeholder="Headquarters Location" required />
            </div>
          </div>
        )}

        <div className="pt-8 border-t border-slate-50">
           <label className="flex items-start gap-4 cursor-pointer group">
              <div className="mt-1">
                <input 
                  type="checkbox" 
                  checked={agreeTerms} 
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="appearance-none w-6 h-6 border-2 border-slate-200 rounded-lg bg-white checked:bg-unicou-navy checked:border-unicou-navy transition-all cursor-pointer relative after:content-['✓'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-white after:opacity-0 checked:after:opacity-100"
                  required
                />
              </div>
              <span className="text-[11px] text-slate-500 leading-relaxed font-bold italic group-hover:text-slate-700 transition-colors">
                I authorize UNICOU International Ltd to process my data under the <strong>Global Privacy Framework</strong>.
              </span>
           </label>
        </div>

        <button 
          disabled={submitting}
          className="w-full py-6 bg-unicou-navy hover:bg-slate-950 text-white rounded-[2rem] font-black uppercase text-sm tracking-[0.2em] transition-all shadow-premium active:scale-95 flex items-center justify-center gap-5 group/btn disabled:opacity-50"
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              TRANSMITTING DATA...
            </>
          ) : (
            <>
              ESTABLISH HUB CONNECTION
              <svg className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

const Input = ({ label, ...props }: any) => (
  <div className="group">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1 group-focus-within:text-unicou-navy transition-colors">{label}</label>
    <input 
      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold outline-none focus:border-unicou-vibrant/50 focus:bg-white transition-all shadow-inner placeholder:text-slate-300 placeholder:font-normal" 
      {...props} 
    />
  </div>
);

const Select = ({ label, options }: any) => (
  <div className="group">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1 group-focus-within:text-unicou-navy transition-colors">{label}</label>
    <div className="relative">
      <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold outline-none focus:border-unicou-vibrant/50 focus:bg-white appearance-none cursor-pointer shadow-inner">
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  </div>
);

export default ApplyForm;