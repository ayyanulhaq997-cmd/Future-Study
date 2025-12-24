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
  const [agreeNews, setAgreeNews] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert("Please agree to the Terms and Conditions and Privacy Policy.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDone(true);
      if (onSuccess) onSuccess();
    }, 1500);
  };

  if (done) return (
    <div className="glass p-12 rounded-[2.5rem] border border-emerald-500/30 text-center animate-in zoom-in">
      <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
      </div>
      <h3 className="text-3xl font-display font-bold mb-4">Transmission Successful</h3>
      <p className="text-slate-400 mb-2 leading-relaxed">Your request has been logged. Our specialists will synchronize with your node within 24 hours.</p>
      <p className="text-primary-400 font-black text-[10px] uppercase tracking-widest mb-8">Service Hub: connect@unicou.uk</p>
      <button onClick={() => { setDone(false); setAgreeTerms(false); }} className="text-slate-500 font-bold hover:text-white uppercase text-[10px] tracking-widest">Submit Another Request</button>
    </div>
  );

  const renderFields = () => {
    switch (type) {
      case 'student-apply':
      case 'careers':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" placeholder="Alex Johnson" required />
              <Input label="Email Address" type="email" placeholder="alex@example.com" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Mobile Number (WhatsApp)" placeholder="+44 700 000 000" required />
              <Input label="City of Residence" placeholder="e.g. Manchester / Lahore" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="Target Country" options={['United Kingdom', 'Australia', 'USA', 'Canada', 'Ireland', 'Germany', 'New Zealand', 'Turkey', 'Dubai', 'Malaysia']} />
              <Input label="Preferred Course" placeholder="e.g. MSc Data Science" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Last Qualification" placeholder="e.g. Bachelors in IT" required />
              <Select label="English Proficiency Test" options={['Not Taken Yet', 'IELTS Academic', 'PTE Academic', 'Oxford ELLT', 'LanguageCert', 'Duolingo', 'TOEFL iBT']} />
            </div>
          </>
        );
      case 'agent-reg':
      case 'prep-center-reg':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Organization / Center Name" placeholder="Global Training Hub" required />
              <Input label="Principal Contact Name" placeholder="John Doe" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Mobile / WhatsApp" placeholder="+44 700 000 000" required />
              <Input label="Professional Email" type="email" placeholder="partner@edu.com" required />
            </div>
            <div className="col-span-full">
              <Input label="Business Address / City" placeholder="City, Country" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="Interest Primary" options={['Voucher Reselling', 'Study Abroad Collaboration', 'Mock Testing Integration', 'All Services']} />
              <Input label="Years in Industry" type="number" placeholder="0" />
            </div>
          </>
        );
      case 'institute-connect':
      case 'general':
      default:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Name" placeholder="Full Name" required />
              <Input label="Email" type="email" placeholder="contact@email.com" required />
            </div>
            <div className="col-span-full">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Collaboration Proposal</label>
              <textarea className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-200 outline-none focus:border-primary-500 h-32 resize-none" placeholder="Elaborate on how we can work together..."></textarea>
            </div>
          </>
        );
    }
  };

  return (
    <div className="glass p-8 md:p-12 rounded-[3rem] border border-slate-800 shadow-3xl animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-10">
        <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] mb-2 block">{context || 'Connect Node'}</span>
        <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tighter">
          {type === 'student-apply' ? 'Apply for Admission' : 
           type === 'agent-reg' ? 'Partner Registration' : 
           type === 'prep-center-reg' ? 'Training Center Sign-up' : 
           type === 'careers' ? 'Career Submission' : 'Professional Inquiry'}
        </h2>
        <p className="text-slate-500 text-sm mt-3 font-medium">Unified Registration Infrastructure v2.1</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderFields()}

        <div className="space-y-4 pt-6 border-t border-slate-900">
           <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative flex items-center justify-center pt-0.5">
                <input 
                  type="checkbox" 
                  checked={agreeTerms} 
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="peer appearance-none w-5 h-5 border border-slate-800 rounded-md bg-slate-900 checked:bg-primary-600 transition-all"
                  required
                />
                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>
              </div>
              <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                I agree to the <button type="button" className="text-primary-400 font-bold hover:underline">Terms and Conditions</button> and <button type="button" className="text-primary-400 font-bold hover:underline">Privacy Policy</button>.
              </span>
           </label>

           <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative flex items-center justify-center pt-0.5">
                <input 
                  type="checkbox" 
                  checked={agreeNews} 
                  onChange={(e) => setAgreeNews(e.target.checked)}
                  className="peer appearance-none w-5 h-5 border border-slate-800 rounded-md bg-slate-900 checked:bg-unicou-orange transition-all"
                />
                <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>
              </div>
              <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors font-medium">
                I am happy to receive notifications about <span className="text-unicou-orange font-bold">scholarships, discounts, news, and updates</span>.
              </span>
           </label>
        </div>

        <button 
          disabled={submitting}
          className="w-full py-6 bg-unicou-navy hover:bg-[#003a4d] text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4 group/btn"
        >
          {submitting ? 'Authenticating Data Node...' : 'Establish Secure Connection'}
          <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
        </button>
      </form>
    </div>
  );
};

const Input = ({ label, ...props }: any) => (
  <div>
    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">{label}</label>
    <input className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 outline-none focus:border-primary-500 transition-all placeholder:text-slate-700" {...props} />
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