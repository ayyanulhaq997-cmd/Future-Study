import React, { useState, useRef, useEffect } from 'react';
import { ViewState, User } from '../types';
import { LOGO_SRC } from '../constants/assets';

interface NavItem {
  label: string;
  type: any;
  slug?: string;
  subItems?: { label: string; type: any; slug?: string; icon: string }[];
}

interface NavbarProps {
  view: ViewState;
  user: User | null;
  scrolled: boolean;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
  onOpenSearch: () => void;
}

const NAV_CONFIG: NavItem[] = [
  { 
    label: 'Study Abroad', 
    type: 'country-list',
    subItems: [
      { label: 'United Kingdom', type: 'country-guide', slug: 'uk', icon: '🇬🇧' },
      { label: 'Australia', type: 'country-guide', slug: 'australia', icon: '🇦🇺' },
      { label: 'Canada', type: 'country-guide', slug: 'canada', icon: '🇨🇦' },
      { label: 'USA', type: 'country-guide', slug: 'usa', icon: '🇺🇸' },
      { label: 'Europe Hub', type: 'country-guide', slug: 'europe', icon: '🇪🇺' },
    ]
  },
  { 
    label: 'Academy', 
    type: 'lms-dashboard',
    subItems: [
      { label: 'Course Catalogue', type: 'course-catalogue', icon: '📚' },
      { label: 'Qualifications', type: 'qualifications', icon: '📜' },
      { label: 'Mock Exams', type: 'lms-practice-test', slug: 'full-mock-1', icon: '📝' },
      { label: 'Student Terminal', type: 'lms-dashboard', icon: '💻' },
    ]
  },
  { 
    label: 'Store', 
    type: 'store',
    subItems: [
      { label: 'Voucher Sale', type: 'store', icon: '💎' },
      { label: 'Bulk Reseller', type: 'signup', icon: '🤝' },
    ]
  },
  { label: 'About', type: 'about' }
];

const Navbar: React.FC<NavbarProps> = ({ view, user, scrolled, onNavigate, onLogout, onOpenSearch }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimer = useRef<number | null>(null);

  const handleMouseEnter = (label: string) => {
    if (dropdownTimer.current) window.clearTimeout(dropdownTimer.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimer.current = window.setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      scrolled ? 'py-4' : 'py-8'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`glass border border-white/5 rounded-[2.5rem] px-8 py-4 flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'shadow-2xl shadow-black/50 bg-slate-950/80 backdrop-blur-xl border-white/10' : 'bg-transparent'
        }`}>
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <button 
              onClick={() => onNavigate({ type: 'home' })}
              className="flex items-center gap-3 group transition-transform hover:scale-105"
            >
              <img src={LOGO_SRC} alt="UNICOU" className="h-10 md:h-12 w-auto object-contain" />
            </button>

            {/* Desktop Navigation with Sub-tabs */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_CONFIG.map((item) => (
                <div 
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    onClick={() => onNavigate(item.slug ? { type: item.type, slug: item.slug } : { type: item.type })}
                    className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-white flex items-center gap-1.5 ${
                      view.type === item.type ? 'bg-white/10 text-white shadow-inner' : 'text-slate-400'
                    }`}
                  >
                    {item.label}
                    {item.subItems && (
                      <svg className={`w-2.5 h-2.5 transition-transform duration-300 ${activeDropdown === item.label ? 'rotate-180 text-unicou-orange' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>

                  {/* Desktop Dropdown Panel */}
                  {item.subItems && activeDropdown === item.label && (
                    <div className="absolute top-full left-0 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="glass bg-slate-900/95 border border-white/10 rounded-[2rem] p-4 min-w-[240px] shadow-3xl">
                        <div className="grid grid-cols-1 gap-1">
                          {item.subItems.map((sub) => (
                            <button
                              key={sub.label}
                              onClick={() => {
                                onNavigate(sub.slug ? { type: sub.type, slug: sub.slug } : { type: sub.type });
                                setActiveDropdown(null);
                              }}
                              className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 text-left transition-all group/sub"
                            >
                              <span className="text-xl group-hover/sub:scale-125 transition-transform">{sub.icon}</span>
                              <div>
                                <p className="text-[11px] font-bold text-slate-200 group-hover/sub:text-unicou-orange transition-colors">{sub.label}</p>
                                <div className="h-0.5 w-0 bg-unicou-orange group-hover/sub:w-full transition-all duration-300" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={onOpenSearch}
              className="p-3 bg-slate-900/50 hover:bg-slate-800 rounded-2xl border border-white/5 text-slate-400 hover:text-white transition-all shadow-lg"
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
           <div className="glass bg-slate-950/95 border border-white/10 rounded-[3rem] p-6 shadow-3xl space-y-2 overflow-y-auto max-h-[80vh]">
              {NAV_CONFIG.map((item) => (
                <div key={item.label} className="space-y-1">
                  <button
                    onClick={() => {
                      if (!item.subItems) {
                        onNavigate({ type: item.type as any });
                        setMobileOpen(false);
                      } else {
                        setActiveDropdown(activeDropdown === item.label ? null : item.label);
                      }
                    }}
                    className="w-full text-left p-4 rounded-2xl bg-white/5 border border-white/5 text-slate-300 font-bold flex justify-between items-center"
                  >
                    <span className="uppercase text-xs tracking-widest">{item.label}</span>
                    {item.subItems && (
                      <svg className={`w-4 h-4 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
                  
                  {item.subItems && activeDropdown === item.label && (
                    <div className="pl-4 space-y-1 animate-in slide-in-from-top-2">
                       {item.subItems.map((sub) => (
                         <button
                           key={sub.label}
                           onClick={() => {
                             onNavigate(sub.slug ? { type: sub.type, slug: sub.slug } : { type: sub.type });
                             setMobileOpen(false);
                           }}
                           className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-slate-400 text-sm flex items-center gap-3"
                         >
                           <span>{sub.icon}</span>
                           {sub.label}
                         </button>
                       ))}
                    </div>
                  )}
                </div>
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