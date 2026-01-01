
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
  isVisible: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ view, user, scrolled, onNavigate, onLogout, onOpenSearch, isVisible }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navigationItems = [
    { label: 'About Us', type: 'about' },
    { 
      label: 'Study Abroad', 
      type: 'country-list',
      subItems: [
        { label: 'United Kingdom', slug: 'uk' },
        { label: 'Australia', slug: 'australia' },
        { label: 'Canada', slug: 'canada' },
        { label: 'New Zealand', slug: 'new-zealand' },
        { label: 'United States', slug: 'usa' },
        { label: 'Ireland', slug: 'ireland' },
        { label: 'Cyprus', slug: 'cyprus' },
        { label: 'Germany', slug: 'germany' },
        { label: 'Italy', slug: 'italy' },
        { label: 'Sweden', slug: 'sweden' },
        { label: 'Finland', slug: 'finland' },
        { label: 'Dubai (UAE)', slug: 'dubai' },
        { label: 'Malaysia', slug: 'malaysia' },
        { label: 'Turkey', slug: 'turkey' },
        { label: 'Europe Hub', slug: 'europe' },
      ]
    },
    { 
      label: 'Exam Vouchers', 
      type: 'store',
      subItems: [
        { label: 'PTE Academic', type: 'store' },
        { label: 'IELTS Vouchers', type: 'store' },
        { label: 'TOEFL iBT', type: 'store' },
        { label: 'Duolingo', type: 'store' },
        { label: 'Oxford ELLT', type: 'store' },
        { label: 'LanguageCert Academic', type: 'store' },
        { label: 'LanguageCert ESOL', type: 'store' },
        { label: 'Skills for English', type: 'store' },
      ]
    },
    { 
      label: 'Learning Hub', 
      type: 'lms-dashboard',
      subItems: [
        { label: 'Library', type: 'lms-dashboard' },
        { label: 'Practice Tests', type: 'lms-dashboard', tab: 'results' },
        { label: 'Preparation Courses', type: 'lms-dashboard', tab: 'academy' },
        { label: 'Qualifications', type: 'qualifications' },
      ]
    },
    { label: 'Resources', type: 'resources' },
    { label: 'Connect', type: 'join-hub' }
  ];

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    
    if (user.role === 'Agent') {
      onNavigate({ type: 'agent' });
    } else if (user.role === 'Institute') {
      onNavigate({ type: 'institute' });
    } else {
      onNavigate({ type: 'lms-dashboard' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 navbar-fixed ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'} ${scrolled ? 'py-3' : 'py-6'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`rounded-3xl px-8 py-4 flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'shadow-premium bg-white border border-slate-100' : 'bg-white/90 border border-slate-100 backdrop-blur-md'
        }`}>
          <div className="flex items-center gap-6 xl:gap-8">
            <button onClick={() => onNavigate({ type: 'home' })} className="flex items-center transition-transform hover:scale-[1.03] active:scale-95 shrink-0 py-1">
              <img src={LOGO_SRC} alt="UniCou" className="h-10 w-auto object-contain" />
            </button>

            <div className="hidden lg:flex items-center gap-0.5">
              {navigationItems.map((item) => (
                <div 
                  key={item.label} 
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => onNavigate({ type: item.type } as any)}
                    className={`px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-tight transition-all flex items-center gap-1.5 ${
                      view.type === item.type ? 'text-white bg-unicou-navy shadow-lg' : 'text-unicou-navy hover:text-unicou-orange'
                    }`}
                  >
                    {item.label}
                    {item.subItems && (
                      <svg className={`w-3 h-3 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M19 9l-7 7-7-7" /></svg>
                    )}
                  </button>

                  {item.subItems && activeDropdown === item.label && (
                    <div className="absolute top-full left-0 pt-2 w-64 animate-in fade-in slide-in-from-top-1">
                      <div className="bg-white border border-slate-100 rounded-2xl shadow-premium p-4">
                        <div className={`grid grid-cols-1 gap-1`}>
                          {item.subItems.map((sub: any) => (
                            <button
                              key={sub.label}
                              onClick={() => {
                                if (sub.slug) onNavigate({ type: 'country-guide', slug: sub.slug });
                                else if (sub.type) onNavigate({ type: sub.type, initialTab: sub.tab } as any);
                              }}
                              className="w-full text-left px-4 py-2 rounded-lg text-[10px] font-black text-unicou-charcoal hover:text-unicou-navy hover:bg-slate-50 transition-all uppercase tracking-widest truncate"
                            >
                              {sub.label}
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

          <div className="flex items-center gap-3">
            <button onClick={(e) => { e.stopPropagation(); onOpenSearch(); }} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-unicou-navy transition-colors border border-slate-100" title="Search Platform">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <button onClick={handleProfileClick} className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-unicou-navy rounded-full hover:bg-slate-900 transition-all shadow-md group">
                  <div className="w-6 h-6 rounded-full bg-unicou-orange flex items-center justify-center text-[10px] font-black text-white uppercase group-hover:scale-110 transition-transform">{user.name.charAt(0)}</div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{user.name.split(' ')[0]}</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); onLogout(); }} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); onNavigate({ type: 'login' }); }} className="px-4 py-2 text-[11px] font-black uppercase tracking-tight text-unicou-navy hover:text-unicou-orange transition-all">Sign In</button>
                <button onClick={(e) => { e.stopPropagation(); onNavigate({ type: 'signup' }); }} className="px-6 py-3 bg-unicou-orange text-white rounded-2xl font-black text-[11px] uppercase tracking-tight shadow-action hover:bg-red-600 transition-all active:scale-95">Sign Up</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;