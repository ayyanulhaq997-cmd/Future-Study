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
      <p className="text-slate-400 mb-2 leading-relaxed">Your application has been securely logged in the UNICOU registry. A regional coordinator will synchronize with your node within 24 business hours.</p>
      <p className="text-primary-400 font-black text-[10px] uppercase tracking-widest mb-8">Verification Node: connect@unicou.uk</p>
      <button onClick={() => { setDone(false); setAgreeTerms(false); }} className="text-slate-500 font-bold hover:text-white uppercase text-[10px] tracking-widest">Submit New Entry</button>
    </div>
  );

  const renderFields = () => {
    switch (type) {
      case 'student-apply':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Student Full Name" placeholder="Alex Johnson" required />
              <Input label="Father's Name" placeholder="Guardian Name" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Mobile Number (WhatsApp)" placeholder="+44 700 000 000" required />
              <Input label="Email Address" type="email" placeholder="alex@example.com" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="City of Residence" placeholder="e.g. Manchester / Lahore" required />
              <Select label="Target Destination" options={['United Kingdom', 'Australia', 'USA', 'Canada', 'Ireland', 'Germany', 'New Zealand', 'Turkey', 'Dubai', 'Malaysia', 'Europe Hub']} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Last Qualification" placeholder="e.g. A-Levels / Bachelor Degree" required />
              <Input label="Marks / CGPA" placeholder="e.g. 3.8 / 85%" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="English Proficiency Test" options={['Not Taken Yet', 'IELTS Academic', 'PTE Academic', 'Oxford ELLT', 'LanguageCert', 'Duolingo', 'TOEFL iBT']} />
              <Select label="Preferred Intake" options={['September 2025', 'January 2026', 'May 2026', 'Other / Undecided']} />
            </div>
          </>
        );
      case 'agent-reg':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Company / Agency Name" placeholder="Global Mobility Consultants" required />
              <Input label="CEO / Manager Name" placeholder="Principal Contact" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Designation" placeholder="e.g. Managing Director" required />
              <Input label="Professional Email" type="email" placeholder="partnership@agency.com" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="WhatsApp / Mobile" placeholder="+44 700 000 000" required />
              <Input label="Office Website / Social Link" placeholder="https://..." />
            </div>
            <div className="col-span-full">
              <Input label="Full Office Address" placeholder="Street, City, Zip, Country" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="Nature of Business" options={['Education Consultancy', 'Travel Agency', 'Corporate Recruiter', 'Language School', 'Other']} />
              <Input label="Years of Experience" type="number" placeholder="0" required />
            </div>
          </>
        );
      case 'prep-center-reg':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Training Center Name" placeholder="Elite Prep Academy" required />
              <Input label="Director / Principal Name" placeholder="Full Name" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Official Email" type="email" placeholder="admin@center.com" required />
              <Input label="Contact Number (WhatsApp)" placeholder="+44 700 000 000" required />
            </div>
            <div className="col-span-full">
              <Input label="Center Location / City" placeholder="City, Country" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="Training Specialization" options={['IELTS Only', 'PTE Academic Only', 'Multiple Exam Preparation', 'General English Only']} />
              <Input label="Current Student Count" type="number" placeholder="e.g. 50" required />
            </div>
          </>
        );
      case 'institute-connect':
      case 'general':
      default:
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" placeholder="John Doe" required />
              <Input label="Professional Email" type="email" placeholder="contact@email.com" required />
            </div>
            <div className="col-span-full">
              <Input label="Organization / University Name" placeholder="Institution Entity Name" required />
            </div>
            <div className="col-span-full">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Collaboration Proposal</label>
              <textarea className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-200 outline-none focus:border-primary-500 h-32 resize-none" placeholder="Elaborate on how your institution can collaborate with the UNICOU ecosystem..."></textarea>
            </div>
          </>
        );
    }
  };

  return (
    <div className="glass p-8 md:p-12 rounded-[3rem] border border-slate-800 shadow-3xl animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-10">
        <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] mb-2 block">{context || 'Nexus Registration'}</span>
        <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tighter">
          {type === 'student-apply' ? 'Apply Online' : 
           type === 'agent-reg' ? 'Become a Sub-Agent' : 
           type === 'prep-center-reg' ? 'Partner Training Center' : 
           type === 'careers' ? 'Career Submission' : 'University Relations'}
        </h2>
        <p className="text-slate-500 text-sm mt-3 font-medium">Verified Compliance Node • Protocol v2.1</p>
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
                I wish to receive real-time alerts for <span className="text-unicou-orange font-bold">scholarships, intakes, and rate changes</span>.
              </span>
           </label>
        </div>

        <button 
          disabled={submitting}
          className="w-full py-6 bg-unicou-navy hover:bg-[#003a4d] text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4 group/btn"
        >
          {submitting ? 'Encrypting Data Node...' : 'Establish Secure Connection'}
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