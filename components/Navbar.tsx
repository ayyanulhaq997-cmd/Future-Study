import React, { useState } from 'react';
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
  const handleNavClick = (type: any, slug?: string) => {
    onNavigate(slug ? { type, slug } : { type });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${scrolled ? 'py-3' : 'py-6'}`}>
      <div className="max-w-[1600px] mx-auto px-6">
        <div className={`glass border rounded-[2rem] px-8 py-4 flex items-center justify-between transition-all duration-700 ${
          scrolled ? 'shadow-2xl bg-white/98 border-slate-200' : 'bg-white/70 border-white/30'
        }`}>
          {/* Logo Section */}
          <div className="flex items-center gap-10">
            <button 
              onClick={() => onNavigate({ type: 'home' })}
              className="flex items-center transition-all hover:opacity-80 active:scale-95 shrink-0"
            >
              <img 
                src={LOGO_SRC} 
                alt="UNICOU" 
                className="h-10 md:h-12 lg:h-13 w-auto object-contain block" 
              />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center gap-1">
              {[
                { label: 'Study Abroad', type: 'country-list' },
                { label: 'Study Hub', type: 'lms-dashboard' },
                { label: 'Voucher Store', type: 'store' },
                { label: 'Resources', type: 'resources' },
                { label: 'About Us', type: 'about' }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.type)}
                  className={`px-5 py-2.5 rounded-xl text-[13px] font-extrabold uppercase tracking-tight transition-all ${
                    view.type === item.type 
                    ? 'bg-unicou-navy text-white shadow-xl' 
                    : 'text-slate-800 hover:text-unicou-navy hover:bg-slate-100'
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
              className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-900 transition-all border border-slate-200 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>

            <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block" />

            {user ? (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onNavigate(['Admin', 'Finance'].includes(user.role) ? { type: 'admin' } : { type: 'lms-dashboard' })}
                  className="flex items-center gap-3 pl-2 pr-5 py-1.5 bg-slate-50 border border-slate-200 rounded-full hover:bg-slate-100 transition-all shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-unicou-navy flex items-center justify-center text-xs font-black text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-black text-slate-950 uppercase tracking-tight">{user.name}</span>
                </button>
                <button onClick={onLogout} className="p-3 text-slate-400 hover:text-red-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => handleNavClick('login')} className="px-6 py-2.5 text-[13px] font-black uppercase tracking-tight text-slate-800 hover:text-unicou-navy transition-all hidden sm:block">Log In</button>
                <button onClick={() => handleNavClick('signup')} className="px-8 py-4 bg-unicou-orange text-white rounded-2xl font-black text-[13px] uppercase tracking-tight shadow-xl hover:bg-orange-600 active:scale-95 transition-all">Sign Up</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;