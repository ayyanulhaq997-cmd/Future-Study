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
      // In a real production scenario, the apiService would handle the email dispatch to connect@unicou.uk
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
          "Your application has been logged and dispatched to our central desk (connect@unicou.uk). A node manager will initialize contact within 24 operational hours."
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
           <span className="text-[10px] font-black text-unicou-orange uppercase tracking-[0.4em]">{context || 'GLOBAL HUB REGISTRY'}</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-unicou-navy tracking-tight leading-none mb-4 uppercase">
          {type === 'student-apply' ? 'STUDENT APPLY ONLINE' : 'AGENT & PARTNER MEMBERSHIP'}
        </h2>
        <p className="text-slate-500 font-medium italic">Authorized field entry required for secure node establishment. All data transmitted to connect@unicou.uk</p>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
        {type === 'student-apply' ? (
          <div className="space-y-12">
            {/* Personal Section */}
            <div>
              <h4 className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.3em] mb-6 pb-2 border-b border-slate-100">Section 01: Personal Profile</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <Input label="Full Name" placeholder="As per Passport" required value={formData.name || ''} onChange={(v: string) => handleFieldChange('name', v)} />
                <Input label="Father / Guardian Name" placeholder="Full Name" required value={formData.guardian || ''} onChange={(v: string) => handleFieldChange('guardian', v)} />
                <Input label="Date of Birth" type="date" required value={formData.dob || ''} onChange={(v: string) => handleFieldChange('dob', v)} />
                <Select label="Gender" options={['Male', 'Female', 'Other']} value={formData.gender || ''} onChange={(v: string) => handleFieldChange('gender', v)} />
              </div>
            </div>

            {/* Contact Section */}
            <div>
              <h4 className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.3em] mb-6 pb-2 border-b border-slate-100">Section 02: Connectivity Data</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <Input label="Email Address" type="email" placeholder="student@email.com" required value={formData.email || ''} onChange={(v: string) => handleFieldChange('email', v)} />
                <Input label="WhatsApp / Mobile" placeholder="+00 000 0000" required value={formData.whatsapp || ''} onChange={(v: string) => handleFieldChange('whatsapp', v)} />
                <Input label="City" placeholder="Current Residence" required value={formData.city || ''} onChange={(v: string) => handleFieldChange('city', v)} />
                <Input label="Full Mailing Address" placeholder="Street, Area, Zip" required value={formData.address || ''} onChange={(v: string) => handleFieldChange('address', v)} />
              </div>
            </div>

            {/* Academic Section */}
            <div>
              <h4 className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.3em] mb-6 pb-2 border-b border-slate-100">Section 03: Academic History</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <Input label="Last Degree / Qualification" placeholder="e.g. Master, Bachelor, A-Levels" required value={formData.qualification || ''} onChange={(v: string) => handleFieldChange('qualification', v)} />
                <Input label="Previous Institution / Board" placeholder="University or College Name" required value={formData.last_school || ''} onChange={(v: string) => handleFieldChange('last_school', v)} />
                <Input label="CGPA / Percentage" placeholder="e.g. 3.5 or 82%" required value={formData.merit || ''} onChange={(v: string) => handleFieldChange('merit', v)} />
                <Select label="English Proficiency Test" options={['IELTS', 'PTE', 'Oxford ELLT', 'TOEFL', 'Duolingo', 'None / Planning']} value={formData.english_test || ''} onChange={(v: string) => handleFieldChange('english_test', v)} />
              </div>
            </div>

            {/* Interest Section */}
            <div>
              <h4 className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.3em] mb-6 pb-2 border-b border-slate-100">Section 04: Destination Mapping</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <Select label="Target Country" options={['UK', 'Australia', 'Canada', 'USA', 'New Zealand', 'Germany', 'Italy', 'Sweden', 'Finland', 'Dubai (UAE)', 'Turkey', 'Malaysia']} value={formData.destination || ''} onChange={(v: string) => handleFieldChange('destination', v)} />
                <Input label="Preferred Course / Field" placeholder="e.g. MBA, Data Science, Nursing" required value={formData.course || ''} onChange={(v: string) => handleFieldChange('course', v)} />
                <Select label="Intended Intake" options={['Sept 2025', 'Jan 2026', 'May 2026']} value={formData.intake || ''} onChange={(v: string) => handleFieldChange('intake', v)} />
                <Select label="How did you hear about UNICOU?" options={['Social Media', 'Google Search', 'Friend/Referral', 'Newspaper/Flyer', 'Campus Event']} value={formData.source || ''} onChange={(v: string) => handleFieldChange('source', v)} />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Business Profile */}
            <div>
              <h4 className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.3em] mb-6 pb-2 border-b border-slate-100">Section 01: Agency Core Identity</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <Input label="Agency / Company Name" placeholder="Legal Entity Name" required value={formData.agency_name || ''} onChange={(v: string) => handleFieldChange('agency_name', v)} />
                <Input label="Managing Director / CEO" placeholder="Full Name" required value={formData.ceo_name || ''} onChange={(v: string) => handleFieldChange('ceo_name', v)} />
                <Input label="Company Registration / NTN" placeholder="Business License No." value={formData.reg_no || ''} onChange={(v: string) => handleFieldChange('reg_no', v)} />
                <Input label="Year Established" type="number" placeholder="e.g. 2015" required value={formData.year_established || ''} onChange={(v: string) => handleFieldChange('year_established', v)} />
              </div>
            </div>

            {/* Business Contact */}
            <div>
              <h4 className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.3em] mb-6 pb-2 border-b border-slate-100">Section 02: Operational Connect</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <Input label="Official Email" type="email" placeholder="partnership@agency.com" required value={formData.email || ''} onChange={(v: string) => handleFieldChange('email', v)} />
                <Input label="Mobile / WhatsApp" placeholder="+00 000 0000" required value={formData.whatsapp || ''} onChange={(v: string) => handleFieldChange('whatsapp', v)} />
                <Input label="Office Landline" placeholder="+00 00 0000" value={formData.landline || ''} onChange={(v: string) => handleFieldChange('landline', v)} />
                <Input label="Website / Social URL" placeholder="https://..." value={formData.website || ''} onChange={(v: string) => handleFieldChange('website', v)} />
                <div className="md:col-span-2">
                  <Input label="Full Operational Address" placeholder="Street, City, Country" required value={formData.address || ''} onChange={(v: string) => handleFieldChange('address', v)} />
                </div>
              </div>
            </div>

            {/* Business Focus */}
            <div>
              <h4 className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.3em] mb-6 pb-2 border-b border-slate-100">Section 03: Strategic Specialization</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <Select label="Core Service" options={['Education Consultancy', 'English Prep Center', 'Immigration Support', 'Global Recruitment Hub']} value={formData.core_service || ''} onChange={(v: string) => handleFieldChange('core_service', v)} />
                <Input label="Current Student Flow (Annual)" placeholder="e.g. 50-100 Students" value={formData.student_flow || ''} onChange={(v: string) => handleFieldChange('student_flow', v)} />
                <Input label="Primary Target Countries" placeholder="UK, Australia, etc." required value={formData.target_countries || ''} onChange={(v: string) => handleFieldChange('target_countries', v)} />
                <Select label="Primary Interest" options={['Direct Voucher Bulk Purchase', 'Student Recruitment Partnership', 'LMS Licensing', 'Franchise Node']} value={formData.partnership_type || ''} onChange={(v: string) => handleFieldChange('partnership_type', v)} />
              </div>
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
                I authorize UNICOU International Ltd to process my application under the <strong>Global Privacy Framework</strong>. I understand that this data will be used to initialize my academic/business roadmap.
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
              TRANSMITTING TO HUB...
            </>
          ) : (
            <>
              SUBMIT REGISTRY RECORD
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