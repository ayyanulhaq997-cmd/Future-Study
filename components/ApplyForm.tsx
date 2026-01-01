
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert("Verification Required: Please authorize the UNICOU Data Protocol to proceed.");
      return;
    }
    
    setSubmitting(true);
    try {
      const leadType = type === 'student-apply' ? 'student' : (type === 'agent-reg' || type === 'prep-center-reg') ? 'agent' : 'general';
      await api.submitLead(leadType as any, { ...formData, form_origin: type });
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
      <div className="relative z-10">
        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-4xl font-display font-black text-unicou-navy mb-4 tracking-tighter uppercase">REGISTRY SYNCED</h3>
        <p className="text-slate-600 text-lg mb-10 leading-relaxed font-medium italic max-w-md mx-auto">
          "Your identity node has been established. A regional officer will initiate connection within 24 hours."
        </p>
        <button onClick={() => { setDone(false); setAgreeTerms(false); setFormData({}); }} className="px-12 py-5 bg-unicou-navy text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-950 transition-all">NEW REGISTRATION</button>
      </div>
    </div>
  );

  const isStudent = type === 'student-apply';
  const isPartner = type === 'agent-reg' || type === 'prep-center-reg';
  const isInstitute = type === 'institute-connect' || type === 'general';

  return (
    <div className="relative bg-white p-10 md:p-16 rounded-[4rem] border border-slate-100 shadow-premium animate-in fade-in slide-in-from-bottom-6 overflow-hidden my-12">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-unicou-orange" />
      
      <div className="relative z-10 mb-12">
        <h2 className="text-4xl md:text-5xl font-display font-black text-unicou-navy tracking-tight leading-none mb-4 uppercase">
          {isStudent ? 'STUDENT ADMISSION TERMINAL' : isPartner ? 'PARTNER MEMBERSHIP REGISTRY' : 'INSTITUTIONAL CONNECT'}
        </h2>
        <p className="text-slate-500 font-bold italic border-l-4 border-unicou-orange pl-4">
          Establish your identity node according to global standards. Official processing via connect@unicou.uk
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 space-y-12">
        {isStudent && (
          <>
            {/* Section 01: Personal (Ref: edify.pk) */}
            <div>
              <h4 className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-unicou-navy text-white flex items-center justify-center text-[8px]">01</span>
                Personal Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                <Input label="Full Name" placeholder="Student's Legal Name" required value={formData.name || ''} onChange={(v: string) => handleFieldChange('name', v)} />
                <Input label="Father's Name" placeholder="Father / Guardian Name" required value={formData.father_name || ''} onChange={(v: string) => handleFieldChange('father_name', v)} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Date of Birth" type="date" required value={formData.dob || ''} onChange={(v: string) => handleFieldChange('dob', v)} />
                  <Select label="Gender" options={['Male', 'Female', 'Other']} value={formData.gender || ''} onChange={(v: string) => handleFieldChange('gender', v)} />
                </div>
                <Input label="CNIC / Passport Number" placeholder="Mandatory Identity Node" required value={formData.identity_no || ''} onChange={(v: string) => handleFieldChange('identity_no', v)} />
              </div>
            </div>

            {/* Section 02: Communication */}
            <div>
              <h4 className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-unicou-navy text-white flex items-center justify-center text-[8px]">02</span>
                Communication Channels
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                <Input label="Email Address" type="email" placeholder="student@example.com" required value={formData.email || ''} onChange={(v: string) => handleFieldChange('email', v)} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Mobile No" placeholder="+92 3XX XXXXXXX" required value={formData.phone || ''} onChange={(v: string) => handleFieldChange('phone', v)} />
                  <Input label="WhatsApp No" placeholder="+92 3XX XXXXXXX" required value={formData.whatsapp || ''} onChange={(v: string) => handleFieldChange('whatsapp', v)} />
                </div>
                <Input label="City" placeholder="Current Residence City" required value={formData.city || ''} onChange={(v: string) => handleFieldChange('city', v)} />
                <Input label="Country" placeholder="Current Country" required value={formData.country || ''} onChange={(v: string) => handleFieldChange('country', v)} />
                <div className="md:col-span-2">
                  <Input label="Full Postal Address" placeholder="Street, Plaza, Sector..." required value={formData.address || ''} onChange={(v: string) => handleFieldChange('address', v)} />
                </div>
              </div>
            </div>

            {/* Section 03: Academic History */}
            <div>
              <h4 className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-unicou-navy text-white flex items-center justify-center text-[8px]">03</span>
                Academic Background
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                <Select label="Highest Degree" options={['Matric / O-Level', 'Intermediate / A-Level', 'Bachelor (2 Year)', 'Bachelor (4 Year)', 'Master', 'MPhil', 'PhD']} value={formData.degree_level || ''} onChange={(v: string) => handleFieldChange('degree_level', v)} />
                <Input label="Passing Year" placeholder="e.g. 2023" required value={formData.pass_year || ''} onChange={(v: string) => handleFieldChange('pass_year', v)} />
                <Input label="Board / University" placeholder="Institution Name" required value={formData.board_uni || ''} onChange={(v: string) => handleFieldChange('board_uni', v)} />
                <Input label="Marks / CGPA" placeholder="e.g. 3.8/4.0" required value={formData.cgpa || ''} onChange={(v: string) => handleFieldChange('cgpa', v)} />
                <Select label="English Proficiency Test" options={['IELTS', 'PTE', 'TOEFL', 'Duolingo', 'Oxford ELLT', 'None / Awaiting']} value={formData.test_type || ''} onChange={(v: string) => handleFieldChange('test_type', v)} />
                <Input label="Test Date / Expected Date" type="date" value={formData.test_date || ''} onChange={(v: string) => handleFieldChange('test_date', v)} />
              </div>
            </div>

            {/* Section 04: Target */}
            <div>
              <h4 className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-unicou-navy text-white flex items-center justify-center text-[8px]">04</span>
                Study Targets
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                <Select label="Target Country" options={['United Kingdom', 'Australia', 'Canada', 'USA', 'Germany', 'Ireland', 'Italy', 'Other Europe']} value={formData.target_country || ''} onChange={(v: string) => handleFieldChange('target_country', v)} />
                <Input label="Preferred Course" placeholder="e.g. MSc Data Science" required value={formData.course || ''} onChange={(v: string) => handleFieldChange('course', v)} />
                <Select label="Preferred Intake" options={['Sep/Oct 2025', 'Jan/Feb 2026', 'May/June 2026']} value={formData.intake || ''} onChange={(v: string) => handleFieldChange('intake', v)} />
              </div>
            </div>
          </>
        )}

        {isPartner && (
          <>
            {/* Section 01: Agency (Ref: afeic.pk) */}
            <div>
              <h4 className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-unicou-navy text-white flex items-center justify-center text-[8px]">01</span>
                Corporate Node Identity
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                <Input label="Organization / Agency Name" placeholder="Legal Business Name" required value={formData.org_name || ''} onChange={(v: string) => handleFieldChange('org_name', v)} />
                <Input label="Head of Organization" placeholder="CEO / Proprietor Name" required value={formData.ceo_name || ''} onChange={(v: string) => handleFieldChange('ceo_name', v)} />
                <Input label="Authorized Contact Person" placeholder="Name of Representative" required value={formData.contact_person || ''} onChange={(v: string) => handleFieldChange('contact_person', v)} />
                <Input label="Designation" placeholder="e.g. Director Operations" required value={formData.designation || ''} onChange={(v: string) => handleFieldChange('designation', v)} />
                <Input label="Official Website" placeholder="https://www.agency.com" value={formData.website || ''} onChange={(v: string) => handleFieldChange('website', v)} />
                <Input label="Social Media (FB/LinkedIn)" placeholder="Organization Profile URL" value={formData.social || ''} onChange={(v: string) => handleFieldChange('social', v)} />
              </div>
            </div>

            {/* Section 02: Contact */}
            <div>
              <h4 className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-unicou-navy text-white flex items-center justify-center text-[8px]">02</span>
                Communication Terminals
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                <Input label="Official Email Address" type="email" placeholder="partnership@agency.com" required value={formData.email || ''} onChange={(v: string) => handleFieldChange('email', v)} />
                <Input label="Primary Mobile No" placeholder="+92 3XX XXXXXXX" required value={formData.phone || ''} onChange={(v: string) => handleFieldChange('phone', v)} />
                <Input label="WhatsApp No" placeholder="+92 3XX XXXXXXX" required value={formData.whatsapp || ''} onChange={(v: string) => handleFieldChange('whatsapp', v)} />
                <Input label="Office Landline" placeholder="+92 42 XXXXXXX" value={formData.landline || ''} onChange={(v: string) => handleFieldChange('landline', v)} />
                <Input label="City" placeholder="Business Location City" required value={formData.city || ''} onChange={(v: string) => handleFieldChange('city', v)} />
                <Input label="Country" placeholder="Business Location Country" required value={formData.country || ''} onChange={(v: string) => handleFieldChange('country', v)} />
                <div className="md:col-span-2">
                  <Input label="Detailed Office Address" placeholder="Floor, Plaza, Sector, Area..." required value={formData.address || ''} onChange={(v: string) => handleFieldChange('address', v)} />
                </div>
              </div>
            </div>

            {/* Section 03: Business Registration */}
            <div>
              <h4 className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                <span className="w-6 h-6 rounded bg-unicou-navy text-white flex items-center justify-center text-[8px]">03</span>
                Authority & Registry Data
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                <Input label="Business Reg / NTN No" placeholder="Official Registration Node" required value={formData.ntn || ''} onChange={(v: string) => handleFieldChange('ntn', v)} />
                <Input label="Years in Industry" type="number" placeholder="Experience in years" required value={formData.years || ''} onChange={(v: string) => handleFieldChange('years', v)} />
                <Select label="Membership Type" options={['Sub-Agent Registry', 'Authorized Training Center', 'Associate Partner', 'Full Franchise Node']} value={formData.membership_type || ''} onChange={(v: string) => handleFieldChange('membership_type', v)} />
                <Select label="Business Interest" options={['Education Consultancy', 'English Test Prep', 'Visa Processing', 'B2B Logistics']} value={formData.biz_interest || ''} onChange={(v: string) => handleFieldChange('biz_interest', v)} />
              </div>
            </div>
          </>
        )}

        {isInstitute && (
          <>
            <div>
              <h4 className="text-[10px] font-black text-unicou-navy uppercase tracking-[0.4em] mb-8">Representative Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                <Input label="Contact Name" placeholder="Representative Name" required value={formData.name || ''} onChange={(v: string) => handleFieldChange('name', v)} />
                <Input label="Email Address" type="email" placeholder="official@institute.edu" required value={formData.email || ''} onChange={(v: string) => handleFieldChange('email', v)} />
                <Input label="Organization / University" placeholder="Institution Legal Name" required value={formData.org || ''} onChange={(v: string) => handleFieldChange('org', v)} />
                <Input label="Phone Number" placeholder="Direct Dial" required value={formData.phone || ''} onChange={(v: string) => handleFieldChange('phone', v)} />
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Proposed Cooperation Area</label>
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-8 text-slate-900 font-bold outline-none focus:border-unicou-orange focus:bg-white transition-all shadow-inner placeholder:text-slate-300 min-h-[200px] resize-none"
                    placeholder="Describe your partnership inquiry or institutional requirement..."
                    required
                    value={formData.message || ''}
                    onChange={(e) => handleFieldChange('message', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <div className="pt-8 border-t border-slate-100">
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
                "I authorize UNICOU Ltd to process my registration node based on provided authentic data. I confirm all details comply with global academic mobility standards."
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
              INITIALIZE REGISTRY SYNC
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
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-unicou-navy transition-colors">{label}</label>
    <input 
      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold outline-none focus:border-unicou-orange/50 focus:bg-white transition-all shadow-inner placeholder:text-slate-300 placeholder:font-normal" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...props} 
    />
  </div>
);

const Select = ({ label, options, onChange, value }: any) => (
  <div className="group">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-unicou-navy transition-colors">{label}</label>
    <div className="relative">
      <select 
        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold outline-none focus:border-unicou-orange/50 focus:bg-white appearance-none cursor-pointer shadow-inner"
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
