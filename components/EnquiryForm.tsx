
import React, { useState } from 'react';
import { api } from '../services/apiService';

const EnquiryForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    targetCountry: 'United Kingdom',
    preferredCourse: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submitLead(formData);
      setSubmitted(true);
    } catch (err) {
      alert('Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="glass p-12 rounded-[3rem] border border-emerald-500/30 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        </div>
        <h3 className="text-2xl font-display font-bold mb-2">Enquiry Received</h3>
        <p className="text-slate-400">Our study abroad experts will contact you within 24 hours.</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="mt-8 text-primary-400 font-bold hover:underline"
        >Submit another enquiry</button>
      </div>
    );
  }

  return (
    <div className="glass p-10 md:p-12 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
      </div>

      <div className="mb-10">
        <h3 className="text-3xl font-display font-bold mb-3">Study Abroad <span className="text-primary-400">Enquiry</span></h3>
        <p className="text-slate-500 text-sm">Fill out the form below to receive a personalized education roadmap.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
            <input 
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-sm outline-none focus:border-primary-500 transition-all"
              placeholder="Alex Johnson"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
            <input 
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-sm outline-none focus:border-primary-500 transition-all"
              placeholder="alex@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Phone Number</label>
            <input 
              type="tel"
              required
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-sm outline-none focus:border-primary-500 transition-all"
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Target Destination</label>
            <select 
              value={formData.targetCountry}
              onChange={e => setFormData({...formData, targetCountry: e.target.value})}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-sm outline-none focus:border-primary-500 transition-all appearance-none cursor-pointer"
            >
              <option>United Kingdom</option>
              <option>Australia</option>
              <option>Canada</option>
              <option>USA</option>
              <option>Ireland</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Preferred Course of Interest</label>
          <input 
            type="text"
            required
            value={formData.preferredCourse}
            onChange={e => setFormData({...formData, preferredCourse: e.target.value})}
            className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-sm outline-none focus:border-primary-500 transition-all"
            placeholder="e.g. MSc Computer Science, MBA"
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary-500/20 active:scale-95 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Request Free Consultation
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EnquiryForm;
