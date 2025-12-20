
import React, { useState } from 'react';
import { ViewState, User } from '../types';

interface NavbarProps {
  view: ViewState;
  user: User | null;
  scrolled: boolean;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
  onOpenSearch: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ view, user, scrolled, onNavigate, onLogout, onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalDropdownOpen, setGlobalDropdownOpen] = useState(false);

  const countries = [
    { name: 'United Kingdom', slug: 'united-kingdom', flag: '🇬🇧' },
    { name: 'Australia', slug: 'australia', flag: '🇦🇺' },
    { name: 'Canada', slug: 'canada', flag: '🇨🇦' },
    { name: 'USA', slug: 'usa', flag: '🇺🇸' },
  ];

  const handleDashboardNav = () => {
    if(!user) return;
    const roleMap: Record<string, ViewState> = {
      'Admin': { type: 'admin' },
      'Agent': { type: 'agent' },
      'Trainer': { type: 'trainer' },
      'Finance': { type: 'finance' },
      'Customer': { type: 'customer' }
    };
    onNavigate(roleMap[user.role] || { type: 'customer' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'py-3 glass border-b border-slate-800/50 shadow-2xl backdrop-blur-2xl' : 'py-6 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate({ type: 'store' })}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 via-primary-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-xl font-display font-bold tracking-tighter">NEXUS<span className="text-primary-400">EDU</span></span>
          </div>

          <div className="hidden lg:flex items-center gap-2 bg-slate-900/30 p-1.5 rounded-2xl border border-slate-800/50 backdrop-blur-md">
            <NavItem active={view.type === 'store'} onClick={() => onNavigate({ type: 'store' })}>Vouchers</NavItem>
            <NavItem active={view.type === 'lms-dashboard'} onClick={() => onNavigate({ type: 'lms-dashboard' })}>Academy</NavItem>
            <NavItem active={view.type === 'qualifications'} onClick={() => onNavigate({ type: 'qualifications' })}>Degrees</NavItem>
            
            <div 
              className="relative"
              onMouseEnter={() => setGlobalDropdownOpen(true)}
              onMouseLeave={() => setGlobalDropdownOpen(false)}
            >
              <button className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                view.type === 'country-guide' ? 'bg-primary-600/10 text-primary-400' : 'text-slate-400 hover:text-white'
              }`}>
                Global
                <svg className={`w-3 h-3 transition-transform duration-300 ${globalDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
              </button>
              
              {globalDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 glass rounded-2xl border border-slate-800 shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {countries.map(c => (
                    <button 
                      key={c.slug}
                      onClick={() => onNavigate({ type: 'country-guide', slug: c.slug })}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <span>{c.flag}</span>
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <NavItem active={view.type === 'api-docs'} onClick={() => onNavigate({ type: 'api-docs' })}>Developer</NavItem>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-3 bg-slate-900/50 hover:bg-slate-800 border border-slate-800 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 transition-all"
          >
            <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <span className="hidden md:inline">Quick Search</span>
            <span className="text-[9px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">⌘K</span>
          </button>

          {user ? (
            <div className="flex items-center gap-3 bg-slate-900/50 p-1 pr-4 rounded-full border border-slate-800">
               <button 
                onClick={handleDashboardNav}
                className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg"
               >
                 {user.name.charAt(0)}
               </button>
               <span className="text-[10px] font-black uppercase text-slate-400 hidden sm:block">{user.role}</span>
               <button onClick={onLogout} className="text-slate-600 hover:text-red-400 transition-colors ml-1">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
               </button>
            </div>
          ) : (
            <button onClick={() => onNavigate({ type: 'login' })} className="relative group px-7 py-3 overflow-hidden rounded-xl font-black text-xs uppercase tracking-widest">
              <span className="absolute inset-0 bg-primary-600 group-hover:bg-primary-500 transition-colors" />
              <span className="relative z-10 text-white">Identity Sync</span>
            </button>
          )}

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden glass border-t border-slate-800 animate-in slide-in-from-top duration-300">
          <div className="p-6 space-y-4">
            <MobileItem onClick={() => { onNavigate({type:'store'}); setMobileMenuOpen(false); }}>Exams</MobileItem>
            <MobileItem onClick={() => { onNavigate({type:'lms-dashboard'}); setMobileMenuOpen(false); }}>Academy</MobileItem>
            <MobileItem onClick={() => { onNavigate({type:'qualifications'}); setMobileMenuOpen(false); }}>Degrees</MobileItem>
            <MobileItem onClick={() => { onOpenSearch(); setMobileMenuOpen(false); }}>Search</MobileItem>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavItem: React.FC<{ children: React.ReactNode; active: boolean; onClick: () => void }> = ({ children, active, onClick }) => (
  <button onClick={onClick} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
    active ? 'bg-primary-600/10 text-primary-400' : 'text-slate-400 hover:text-slate-200'
  }`}>
    {children}
  </button>
);

const MobileItem: React.FC<{ children: React.ReactNode; onClick: () => void }> = ({ children, onClick }) => (
  <button onClick={onClick} className="w-full text-left px-4 py-3 rounded-xl text-lg font-bold text-slate-200 hover:bg-white/5 transition-all">
    {children}
  </button>
);

export default Navbar;
