
import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';
import { Product, TestBooking } from '../types';

interface RegistrationFormProps {
  productId: string;
  onSuccess: (booking: TestBooking) => void;
  onCancel: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ productId, onSuccess, onCancel }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    preferredDate: '',
    testCenter: ''
  });

  useEffect(() => {
    api.getProductById(productId).then(setProduct);
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setLoading(true);
    try {
      const booking = await api.submitTestBooking({
        productId: product.id,
        productName: product.name,
        ...formData,
        serviceType: 'Full-Registration'
      });
      onSuccess(booking);
    } catch (err) {
      alert('Registration failed. Internal service error.');
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <div className="max-w-2xl mx-auto py-20 px-4">
      <div className="glass p-10 md:p-12 rounded-[3rem] border border-slate-800 shadow-2xl animate-in zoom-in duration-300">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary-600/10 text-primary-400 rounded-3xl flex items-center justify-center mx-auto mb-6">
            {product.icon && <span className="text-4xl">{product.icon}</span>}
          </div>
          <h2 className="text-3xl font-display font-bold">Full <span className="text-primary-400">Registration</span></h2>
          <p className="text-slate-500 mt-2">Personalize your {product.name} booking.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Student Full Name (As per Passport)</span>
              <input 
                type="text" required
                value={formData.studentName}
                onChange={e => setFormData({...formData, studentName: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm focus:border-primary-500 outline-none"
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Registration Email</span>
              <input 
                type="email" required
                value={formData.studentEmail}
                onChange={e => setFormData({...formData, studentEmail: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm focus:border-primary-500 outline-none"
              />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Preferred Date</span>
                <input 
                  type="date" required
                  value={formData.preferredDate}
                  onChange={e => setFormData({...formData, preferredDate: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm focus:border-primary-500 outline-none"
                />
              </label>
              <label className="block">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">City / Center</span>
                <input 
                  type="text" required
                  placeholder="e.g. London, Dhaka"
                  value={formData.testCenter}
                  onChange={e => setFormData({...formData, testCenter: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm focus:border-primary-500 outline-none"
                />
              </label>
            </div>
          </div>

          <div className="bg-primary-500/5 p-6 rounded-2xl border border-primary-500/10 text-xs text-slate-400 italic">
            Note: Our registration team will use this data to secure your seat. You will receive a confirmation voucher upon successful payment.
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
              {loading ? 'Processing...' : 'Confirm Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
