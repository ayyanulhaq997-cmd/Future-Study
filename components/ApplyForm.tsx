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
      alert("Verification Error: Please authorize the Terms & Privacy protocol to transmit data.");
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
    <div className="glass p-12 rounded-[2.5rem] border border-emerald-500/30 text-center animate-in zoom-in bg-white shadow-2xl">
      <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
      </div>
      <h3 className="text-3xl font-display font-black text-slate-950 mb-4 tracking-tighter">Transmission Authorized</h3>
      <p className="text-slate-600 mb-8 leading-relaxed font-medium italic">
        "Your data packet has been securely synchronized with the regional fulfillment hub. An expert consultant will establish a link within 24 hours."
      </p>
      <button onClick={() => { setDone(false); setAgreeTerms(false); }} className="px-12 py-4 bg-unicou-navy text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-950 transition-all">Submit New Node Entry</button>
    </div>
  );

  const renderFields = () => {
    switch (type) {
      case 'student-apply':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Student Full Name (Passport)" placeholder="e.g. John Doe" required />
              <Input label="Guardian / Father's Name" placeholder="Full Name" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Primary WhatsApp Number" placeholder="+92 / +44 / +971..." required />
              <Input label="Identity Email" type="email" placeholder="student@example.com" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="City of Residence" placeholder="e.g. Lahore / Manchester" required />
              <Select label="Priority Destination" options={[
                'United Kingdom', 'United States', 'Canada', 'Australia', 'New Zealand', 
                'Ireland', 'Cyprus', 'Germany', 'Italy', 'Sweden', 'Finland', 'Dubai (UAE)', 
                'Malaysia', 'Turkey', 'Wider Europe Hub'
              ]} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Current / Last Qualification" placeholder="e.g. Bachelor, Master" required />
              <Input label="Academic Merit (GPA/%)" placeholder="e.g. 3.5 / 75%" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="English Proficiency Node" options={[
                'Not Taken / Booking Required', 'IELTS Academic', 'PTE Academic', 'TOEFL iBT', 
                'Oxford ELLT Digital', 'LanguageCert SELT', 'Duolingo English Test', 'Skills for English (PSI)'
              ]} />
              <Select label="Mission Intake" options={['September 2025', 'January 2026', 'May 2026', 'Immediate / Rolling']} />
            </div>
          </div>
        );
      case 'agent-reg':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Agency Legal Entity" placeholder="Company Name" required />
              <Input label="Managing Director / CEO" placeholder="Full Name" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Professional Email" type="email" placeholder="partnership@agency.com" required />
              <Input label="Business WhatsApp" placeholder="+00 0000 0000" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Years of Industry Presence" type="number" placeholder="e.g. 5" required />
              <Select label="Core Specialization" options={['Education Consultancy', 'Travel & Migration', 'Language Training', 'Corporate Placement']} />
            </div>
            <div className="col-span-full">
              <Input label="Full Operational Address" placeholder="Head Office Location" required />
            </div>
          </div>
        );
      case 'prep-center-reg':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Training Center Node Name" placeholder="Elite Academy" required />
              <Input label="Lead Administrator" placeholder="Full Name" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Support Email" type="email" placeholder="admin@center.com" required />
              <Input label="Contact Node (WhatsApp)" placeholder="+00 0000 0000" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="City / Region" placeholder="Location" required />
              <Input label="Active Student Volume" type="number" placeholder="e.g. 100" required />
            </div>
            <div className="col-span-full">
              <Select label="Exam Track Capability" options={['PTE Academic Specialists', 'IELTS Standard', 'Oxford ELLT Partners', 'Multi-Exam Node']} />
            </div>
          </div>
        );
      case 'immigration-consult':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Applicant Full Name" required />
              <Input label="Primary WhatsApp" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select label="Migration Protocol" options={[
                'Skilled Migration', 'Business Immigration', 'Citizenship by Investment', 
                'Digital Nomad Visa', 'Global Talent Route'
              ]} />
              <Select label="Target Territory" options={['United Kingdom', 'Canada', 'Australia', 'Europe', 'Dubai / UAE']} />
            </div>
            <div className="col-span-full">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Professional Profile Overview</label>
              <textarea className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 text-slate-900 outline-none focus:border-unicou-orange h-32 resize-none shadow-inner italic font-medium" placeholder="Describe your current role and long-term settlement goals..."></textarea>
            </div>
          </div>
        );
      case 'careers':
      case 'institute-connect':
      case 'general':
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name / Principal" placeholder="Name" required />
              <Input label="Communication Node (Email)" type="email" placeholder="contact@email.com" required />
            </div>
            <div className="col-span-full">
              <Input label="Organization / Unit Name" placeholder="Entity" required />
            </div>
            <div className="col-span-full">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Message / Strategic Proposal</label>
              <textarea className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 text-slate-900 outline-none focus:border-unicou-navy h-32 resize-none shadow-inner" placeholder="Provide details on your inquiry..."></textarea>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="glass p-10 md:p-14 rounded-[4rem] border border-slate-200 shadow-3xl animate-in fade-in slide-in-from-bottom-4 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-unicou-navy via-unicou-orange to-slate-950" />
      
      <div className="mb-14">
        <span className="text-[10px] font-black text-unicou-orange uppercase tracking-[0.4em] mb-3 block">{context || 'Unified Registry Node'}</span>
        <h2 className="text-4xl md:text-5xl font-display font-black text-slate-950 tracking-tighter leading-none">
          {type === 'student-apply' ? 'Global Student Registry' : 
           type === 'agent-reg' ? 'Partner Agency Protocol' : 
           type === 'prep-center-reg' ? 'Training Center Sync' : 
           type === 'immigration-consult' ? 'Mobility Assessment' :
           'Fulfillment Support'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {renderFields()}

        <div className="pt-10 border-t border-slate-100">
           <label className="flex items-start gap-4 cursor-pointer group">
              <div className="mt-1">
                <input 
                  type="checkbox" 
                  checked={agreeTerms} 
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="appearance-none w-6 h-6 border border-slate-200 rounded-lg bg-slate-50 checked:bg-unicou-navy checked:border-unicou-navy transition-all cursor-pointer relative after:content-['✓'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-white after:opacity-0 checked:after:opacity-100"
                  required
                />
              </div>
              <span className="text-xs text-slate-500 leading-relaxed font-bold italic">
                I authorize UNICOU International Ltd to process my academic/professional data in accordance with the <strong>Global Data Protection Policy</strong> and <strong>Modern Slavery Statement</strong>.
              </span>
           </label>
        </div>

        <button 
          disabled={submitting}
          className="w-full py-7 bg-unicou-navy hover:bg-slate-950 text-white rounded-[2rem] font-black uppercase text-sm tracking-[0.2em] transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-5 group/btn"
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              TRANSMITTING TO HUB...
            </>
          ) : (
            <>
              ESTABLISH CONNECTION
              <svg className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

const Input = ({ label, ...props }: any) => (
  <div>
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{label}</label>
    <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-900 font-bold outline-none focus:border-unicou-navy transition-all shadow-inner placeholder:text-slate-300" {...props} />
  </div>
);

const Select = ({ label, options }: any) => (
  <div>
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">{label}</label>
    <div className="relative">
      <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-900 font-bold outline-none focus:border-unicou-navy appearance-none cursor-pointer shadow-inner">
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  </div>
);

export default ApplyForm;