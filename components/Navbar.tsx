import React, { useState, useEffect, useRef } from 'react';
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

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      scrolled ? 'py-4' : 'py-8'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`glass border border-white/5 rounded-[2.5rem] px-8 py-4 flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'shadow-2xl shadow-black/50 bg-slate-950/80 backdrop-blur-xl border-white/10' : 'bg-transparent'
        }`}>
          {/* Logo Section */}
          <div className="flex items-center gap-12">
            <button 
              onClick={() => onNavigate({ type: 'home' })}
              className="flex items-center gap-3 group transition-transform hover:scale-105"
            >
              <img src={LOGO_SRC} alt="UNICOU" className="h-10 md:h-12 w-auto object-contain" />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {[
                { label: 'Study Abroad', type: 'country-list' },
                { label: 'Academy', type: 'lms-dashboard' },
                { label: 'Store', type: 'store' },
                { label: 'About', type: 'about' }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => onNavigate((item as any).slug ? { type: item.type as any, slug: (item as any).slug } : { type: item.type as any })}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-white ${
                    view.type === item.type ? 'bg-white/10 text-white shadow-inner' : 'text-slate-400'
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
              className="p-3 bg-slate-900/50 hover:bg-slate-800 rounded-2xl border border-white/5 text-slate-400 hover:text-white transition-all shadow-lg"
              title="Global Search (Ctrl+K)"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <div className="h-6 w-px bg-white/10 mx-2 hidden sm:block" />

            {user ? (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onNavigate(user.role === 'Admin' ? { type: 'admin' } : { type: 'home' })}
                  className="hidden sm:flex items-center gap-3 pl-2 pr-5 py-2 bg-primary-600/10 border border-primary-500/20 rounded-2xl hover:bg-primary-600/20 transition-all group"
                >
                  <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">{user.name}</p>
                    <p className="text-[8px] text-primary-400 font-bold uppercase tracking-widest mt-1">{user.role}</p>
                  </div>
                </button>
                <button 
                  onClick={onLogout}
                  className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-2xl border border-red-500/20 text-red-400 transition-all"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onNavigate({ type: 'login' })}
                  className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all hidden sm:block"
                >
                  Log In
                </button>
                <button 
                  onClick={() => onNavigate({ type: 'signup' })}
                  className="px-8 py-3.5 bg-unicou-orange text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-3 bg-slate-900 rounded-2xl border border-white/5 text-slate-400"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen 
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 top-[100px] z-50 lg:hidden px-6 animate-in slide-in-from-top-4 duration-300">
           <div className="glass bg-slate-950/95 border border-white/10 rounded-[3rem] p-8 shadow-3xl space-y-4">
              {[
                { label: 'Study Abroad', type: 'country-list' },
                { label: 'Academy', type: 'lms-dashboard' },
                { label: 'Store', type: 'store' },
                { label: 'About', type: 'about' }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => { onNavigate((item as any).slug ? { type: item.type as any, slug: (item as any).slug } : { type: item.type as any }); setMobileOpen(false); }}
                  className="w-full text-left p-6 rounded-3xl bg-white/5 border border-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all font-bold text-lg"
                >
                  {item.label}
                </button>
              ))}
              {!user && (
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button onClick={() => { onNavigate({ type: 'login' }); setMobileOpen(false); }} className="py-5 bg-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest text-white border border-white/10">Log In</button>
                  <button onClick={() => { onNavigate({ type: 'signup' }); setMobileOpen(false); }} className="py-5 bg-unicou-orange rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-orange-500/20">Sign Up</button>
                </div>
              )}
           </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;