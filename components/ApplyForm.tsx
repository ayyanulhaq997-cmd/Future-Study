import React, { useState } from 'react';
import { FormType } from '../types';
import { api } from '../services/apiService';

interface ApplyFormProps {
  type: FormType;
  context?: string;
  onSuccess?: () => void;
}

const ApplyForm: React.FC<ApplyFormProps> = ({ type, context, onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const VibrantAccents = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[4rem]">
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-unicou-vibrant opacity-10 blur-3xl rounded-full" />
      <div className="absolute top-1/2 -left-8 w-24 h-24 bg-unicou-electric opacity-10 blur-2xl rounded-full animate-pulse" />
      <div className="absolute bottom-10 right-20 w-6 h-6 bg-unicou-vibrant rounded-full shadow-[0_0_20px_#00f2ff] opacity-40" />
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert("Verification Required: Please authorize the UNICOU Data Protocol to proceed.");
      return;
    }
    
    setSubmitting(true);
    try {
      const leadType = type === 'student-apply' ? 'student' : type === 'agent-reg' ? 'agent' : 'general';
      await api.submitLead(leadType as any, formData);
      
      setSubmitting(false);
      setDone(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      alert("Transmission Failure. System Node Unreachable.");
      setSubmitting(false);
    }
  };

  if (done) return (
    <div className="relative bg-white p-12 md:p-20 rounded-[4rem] border border-slate-100 text-center animate-in zoom-in shadow-premium my-12">
      <VibrantAccents />
      <div className="relative z-10">
        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-4xl font-display font-bold text-unicou-navy mb-4 tracking-tighter uppercase">NODE SYNCHRONIZED</h3>
        <p className="text-slate-600 text-lg mb-10 leading-relaxed font-medium italic max-w-md mx-auto">
          "Your data has been successfully transmitted to the UNICOU Global Registry. A designated node manager will initialize contact shortly."
        </p>
        <button onClick={() => { setDone(false); setAgreeTerms(false); setFormData({}); }} className="px-12 py-5 bg-unicou-navy text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-950 transition-all active:scale-95">NEW REGISTRATION</button>
      </div>
    </div>
  );

  return (
    <div className="relative bg-white p-10 md:p-16 rounded-[4rem] border border-slate-100 shadow-premium animate-in fade-in slide-in-from-bottom-6 overflow-hidden my-12">
      <VibrantAccents />
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-unicou-navy via-unicou-vibrant to-unicou-orange" />
      
      <div className="relative z-10 mb-12">
        <div className="flex items-center gap-3 mb-4">
           <div className="vibrant-strip w-12"></div>
           <span className="text-[10px] font-black text-unicou-orange uppercase tracking-[0.4em]">{context || 'REGISTRY PROTOCOL'}</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-unicou-navy tracking-tight leading-none mb-4 uppercase">
          {type === 'student-apply' ? 'STUDENT REGISTRY' : 'PARTNER PROTOCOL'}
        </h2>
        <p className="text-slate-500 font-medium italic">Authorized field entry required for secure node establishment.</p>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
        {type === 'student-apply' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <Input label="Student Full Name (Passport)" placeholder="Legal Name" required value={formData.name || ''} onChange={(v: string) => handleFieldChange('name', v)} />
            <Input label="Guardian / Father's Name" placeholder="Full Name" required value={formData.guardian || ''} onChange={(v: string) => handleFieldChange('guardian', v)} />
            <Input label="Primary WhatsApp" placeholder="+00 000 0000" required value={formData.whatsapp || ''} onChange={(v: string) => handleFieldChange('whatsapp', v)} />
            <Input label="Identity Email" type="email" placeholder="student@email.com" required value={formData.email || ''} onChange={(v: string) => handleFieldChange('email', v)} />
            <Input label="City of Residence" placeholder="Current Location" required value={formData.city || ''} onChange={(v: string) => handleFieldChange('city', v)} />
            <Select label="Priority Destination" options={[
              'United Kingdom', 'USA', 'Canada', 'Australia', 'New Zealand', 'Europe Hub', 'Dubai (UAE)'
            ]} value={formData.destination || ''} onChange={(v: string) => handleFieldChange('destination', v)} />
            <Input label="Last Qualification" placeholder="e.g. Master, Bachelor" required value={formData.qualification || ''} onChange={(v: string) => handleFieldChange('qualification', v)} />
            <Input label="Academic Merit (GPA/%)" placeholder="e.g. 3.8 / 85%" required value={formData.merit || ''} onChange={(v: string) => handleFieldChange('merit', v)} />
            <Select label="English Proficiency" options={[
              'IELTS Academic', 'PTE Academic', 'Oxford ELLT', 'LanguageCert', 'TOEFL iBT', 'Duolingo'
            ]} value={formData.english || ''} onChange={(v: string) => handleFieldChange('english', v)} />
            <Select label="Target Intake" options={['September 2025', 'January 2026', 'May 2026']} value={formData.intake || ''} onChange={(v: string) => handleFieldChange('intake', v)} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <Input label="Agency Legal Entity" placeholder="Company Name" required value={formData.agency_name || ''} onChange={(v: string) => handleFieldChange('agency_name', v)} />
            <Input label="Managing Director / CEO" placeholder="Full Name" required value={formData.ceo_name || ''} onChange={(v: string) => handleFieldChange('ceo_name', v)} />
            <Input label="Professional Email" type="email" placeholder="partnership@agency.com" required value={formData.email || ''} onChange={(v: string) => handleFieldChange('email', v)} />
            <Input label="Business WhatsApp" placeholder="+00 000 0000" required value={formData.whatsapp || ''} onChange={(v: string) => handleFieldChange('whatsapp', v)} />
            <Input label="Years of Industry Presence" type="number" placeholder="e.g. 8" required value={formData.years_presence || ''} onChange={(v: string) => handleFieldChange('years_presence', v)} />
            <Select label="Core Specialization" options={[
              'Education Consultancy', 'English Training', 'Visa Support', 'Global Recruitment'
            ]} value={formData.specialization || ''} onChange={(v: string) => handleFieldChange('specialization', v)} />
            <div className="md:col-span-2">
              <Input label="Full Operational Address" placeholder="Headquarters Location" required value={formData.address || ''} onChange={(v: string) => handleFieldChange('address', v)} />
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

const Input = ({ label, onChange, value, ...props }: any) => (
  <div className="group">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1 group-focus-within:text-unicou-navy transition-colors">{label}</label>
    <input 
      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold outline-none focus:border-unicou-vibrant/50 focus:bg-white transition-all shadow-inner placeholder:text-slate-300 placeholder:font-normal" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...props} 
    />
  </div>
);

const Select = ({ label, options, onChange, value }: any) => (
  <div className="group">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1 group-focus-within:text-unicou-navy transition-colors">{label}</label>
    <div className="relative">
      <select 
        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold outline-none focus:border-unicou-vibrant/50 focus:bg-white appearance-none cursor-pointer shadow-inner"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select Option...</option>
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
      </div>
    </div>
  </div>
);

export default ApplyForm;