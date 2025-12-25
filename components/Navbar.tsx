import React, { useState, useRef } from 'react';
import { ViewState, User } from '../types';
import { LOGO_SRC } from '../constants/assets';

interface NavbarProps {
  view: ViewState;
  user: User | null;
  scrolled: boolean;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
  onOpenSearch: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ view, user, scrolled, onNavigate, onLogout, onOpenSearch }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (type: any, slug?: string) => {
    onNavigate(slug ? { type, slug } : { type });
    setMobileOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
      <div className="max-w-[1600px] mx-auto px-6">
        <div className={`glass border rounded-[2rem] px-8 py-4 flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'shadow-2xl bg-white/95 border-slate-200' : 'bg-white/40 border-white/20'
        }`}>
          {/* Logo Section */}
          <div className="flex items-center gap-12">
            <button 
              onClick={() => onNavigate({ type: 'home' })}
              className="flex items-center transition-transform hover:scale-105"
            >
              <img src={LOGO_SRC} alt="UNICOU" className="h-14 md:h-18 lg:h-20 w-auto object-contain" />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {[
                { label: 'Study Abroad', type: 'country-list' },
                { label: 'Academy', type: 'lms-dashboard' },
                { label: 'Store', type: 'store' },
                { label: 'Resources', type: 'resources' },
                { label: 'About', type: 'about' }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.type)}
                  className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                    view.type === item.type ? 'bg-unicou-navy text-white shadow-lg' : 'text-slate-500 hover:text-unicou-navy'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={onOpenSearch}
              className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>

            <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block" />

            {user ? (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onNavigate(user.role === 'Admin' || user.role === 'Finance' ? { type: 'admin' } : { type: 'lms-dashboard' })}
                  className="flex items-center gap-3 pl-2 pr-4 py-1.5 bg-slate-100 border border-slate-200 rounded-full hover:bg-slate-200 transition-all group"
                >
                  <div className="w-7 h-7 rounded-full bg-unicou-navy flex items-center justify-center text-[10px] font-black text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{user.name}</span>
                </button>
                <button onClick={onLogout} className="p-3 text-slate-400 hover:text-red-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => handleNavClick('login')} className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-unicou-navy transition-all hidden sm:block">Log In</button>
                <button onClick={() => handleNavClick('signup')} className="px-10 py-4 bg-unicou-orange text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all">Sign Up</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;