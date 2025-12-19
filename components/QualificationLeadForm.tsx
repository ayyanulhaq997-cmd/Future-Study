
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Qualification, QualificationLead } from '../types';

interface QualificationLeadFormProps {
  qualificationId: string;
  onSuccess: (lead: QualificationLead) => void;
  onCancel: () => void;
}

const QualificationLeadForm: React.FC<QualificationLeadFormProps> = ({ qualificationId, onSuccess, onCancel }) => {
  const [qual, setQual] = useState<Qualification | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    studentPhone: '',
    highestQualification: '',
    workExperience: ''
  });

  useEffect(() => {
    api.getQualificationById(qualificationId).then(setQual);
  }, [qualificationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qual) return;
    setLoading(true);
    try {
      const lead = await api.submitQualificationLead({
        ...formData,
        qualificationId: qual.id,
        qualificationTitle: qual.title
      });
      onSuccess(lead);
    } catch (err) {
      alert('Application failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  if (!qual) return null;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2">
           <div className="glass p-8 rounded-[2.5rem] border border-slate-800 sticky top-24">
             <img src={qual.image} className="w-full h-40 object-cover rounded-2xl mb-6" alt={qual.title} />
             <span className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-2 block">{qual.qualificationBody} Program</span>
             <h2 className="text-xl font-bold mb-4">{qual.title}</h2>
             
             <div className="space-y-4 mb-8">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500">Duration</span>
                 <span className="text-slate-200 font-bold">{qual.duration}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500">Fees</span>
                 <span className="text-primary-400 font-bold">{qual.tuitionFees}</span>
               </div>
             </div>

             <div className="pt-6 border-t border-slate-800">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Requirements</h4>
                <ul className="space-y-2">
                  {qual.requirements.map((r, i) => (
                    <li key={i} className="flex gap-2 text-xs text-slate-400">
                      <span className="text-emerald-500">✓</span> {r}
                    </li>
                  ))}
                </ul>
             </div>
           </div>
        </div>

        <div className="lg:col-span-3">
          <div className="glass p-10 md:p-12 rounded-[3rem] border border-slate-800 shadow-2xl">
            <h3 className="text-3xl font-display font-bold mb-2">Academic <span className="text-primary-400">Application</span></h3>
            <p className="text-slate-500 mb-10">Please provide your academic profile for initial eligibility screening.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-4">
                 <label className="block">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Full Name</span>
                    <input 
                      type="text" required
                      value={formData.studentName}
                      onChange={e => setFormData({...formData, studentName: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm focus:border-primary-500 outline-none"
                    />
                 </label>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Email</span>
                      <input 
                        type="email" required
                        value={formData.studentEmail}
                        onChange={e => setFormData({...formData, studentEmail: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm focus:border-primary-500 outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Phone</span>
                      <input 
                        type="tel" required
                        value={formData.studentPhone}
                        onChange={e => setFormData({...formData, studentPhone: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm focus:border-primary-500 outline-none"
                      />
                    </label>
                 </div>
                 <label className="block">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Highest Qualification Held</span>
                    <input 
                      type="text" required
                      placeholder="e.g. Higher Secondary, Bachelor Degree"
                      value={formData.highestQualification}
                      onChange={e => setFormData({...formData, highestQualification: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm focus:border-primary-500 outline-none"
                    />
                 </label>
                 <label className="block">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Relevant Work Experience (If any)</span>
                    <textarea 
                      rows={3}
                      value={formData.workExperience}
                      onChange={e => setFormData({...formData, workExperience: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm focus:border-primary-500 outline-none resize-none"
                    />
                 </label>
               </div>

               <div className="flex gap-4 pt-6">
                 <button 
                  type="button" 
                  onClick={onCancel}
                  className="flex-1 py-4 bg-slate-900 text-slate-500 hover:text-white rounded-2xl font-bold border border-slate-800 transition-all"
                 >Cancel</button>
                 <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-[2] py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold shadow-xl shadow-primary-500/20 transition-all"
                 >
                   {loading ? 'Processing Application...' : 'Submit Application'}
                 </button>
               </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualificationLeadForm;
