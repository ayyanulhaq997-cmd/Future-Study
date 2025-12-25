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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert("Please agree to the Terms and Conditions to proceed.");
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
      <p className="text-slate-400 mb-2 leading-relaxed">Your data has been securely logged in the UNICOU registry. A coordinator will synchronize with you shortly via connect@unicou.uk</p>
      <button onClick={() => { setDone(false); setAgreeTerms(false); }} className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">Submit New Entry</button>
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
              <Input label="City of Residence" placeholder="e.g. Manchester" required />
              <Select label="Target Destination" options={['United Kingdom', 'Australia', 'USA', 'Canada', 'Ireland', 'Germany', 'New Zealand', 'Europe Hub']} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Last Qualification" placeholder="e.g. Bachelor Degree" required />
              <Input label="Marks / CGPA" placeholder="e.g. 3.8 / 85%" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="English Test" options={['Not Taken', 'IELTS Academic', 'PTE Academic', 'Oxford ELLT', 'LanguageCert', 'TOEFL iBT']} />
              <Select label="Preferred Intake" options={['September 2025', 'January 2026', 'May 2026']} />
            </div>
          </>
        );
      case 'agent-reg':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Company Name" placeholder="Agency Entity Name" required />
              <Input label="CEO / Manager Name" placeholder="Principal Contact" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Designation" placeholder="e.g. Managing Director" required />
              <Input label="Professional Email" type="email" placeholder="partnership@agency.com" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="WhatsApp Number" placeholder="+44 700 000 000" required />
              <Input label="Years of Experience" type="number" placeholder="0" required />
            </div>
            <div className="col-span-full">
              <Input label="Office Address" placeholder="Full Registered Address" required />
            </div>
            <div className="col-span-full">
              <Select label="Nature of Business" options={['Education Consultancy', 'Travel Agency', 'Training Provider', 'Other']} />
            </div>
          </>
        );
      case 'prep-center-reg':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Training Center Name" placeholder="Elite Prep Academy" required />
              <Input label="Director Name" placeholder="Full Name" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Official Email" type="email" placeholder="admin@center.com" required />
              <Input label="Contact Number (WhatsApp)" placeholder="+44 700 000 000" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="City / Location" placeholder="City, Country" required />
              <Input label="Current Student Count" type="number" placeholder="e.g. 50" required />
            </div>
            <div className="col-span-full">
              <Select label="Specialization" options={['PTE Academic Only', 'IELTS Only', 'PTE & IELTS', 'General English', 'Multiple Exams']} />
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
              <Input label="Organization / University" placeholder="Institution Name" required />
            </div>
            <div className="col-span-full">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Message / Proposal</label>
              <textarea className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 text-slate-200 outline-none focus:border-primary-500 h-32 resize-none" placeholder="How can UNICOU help your institution?"></textarea>
            </div>
          </>
        );
    }
  };

  return (
    <div className="glass p-8 md:p-12 rounded-[3rem] border border-slate-800 shadow-3xl animate-in fade-in slide-in-from-bottom-4">
      <div className="mb-10">
        <span className="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em] mb-2 block">{context || 'Nexus Registry'}</span>
        <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tighter">
          {type === 'student-apply' ? 'Apply Online' : 
           type === 'agent-reg' ? 'Sub-Agent Registration' : 
           type === 'prep-center-reg' ? 'Partner Training Center' : 
           'Contact Us'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderFields()}

        <div className="pt-6 border-t border-slate-900">
           <label className="flex items-center gap-4 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={agreeTerms} 
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="appearance-none w-5 h-5 border border-slate-800 rounded-md bg-slate-900 checked:bg-primary-600 transition-all cursor-pointer"
                required
              />
              <span className="text-xs text-slate-400 group-hover:text-slate-300">I agree to the Terms of Service and Privacy Policy.</span>
           </label>
        </div>

        <button 
          disabled={submitting}
          className="w-full py-6 bg-unicou-navy hover:bg-[#003a4d] text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4 group/btn"
        >
          {submitting ? 'Processing Node...' : 'Establish Connection'}
          <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
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