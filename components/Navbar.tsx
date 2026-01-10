
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
      isMega: true,
      subItems: [
        { label: 'United Kingdom', slug: 'uk' },
        { label: 'Australia', slug: 'australia' },
        { label: 'Canada', slug: 'canada' },
        { label: 'United States', slug: 'usa' },
        { label: 'Germany', slug: 'germany' },
        { label: 'Italy', slug: 'italy' },
        { label: 'Europe Hub', slug: 'europe' },
        { label: 'New Zealand', slug: 'new-zealand' },
        { label: 'Ireland', slug: 'ireland' },
        { label: 'Finland', slug: 'finland' },
        { label: 'Sweden', slug: 'sweden' },
        { label: 'Dubai', slug: 'dubai' },
        { label: 'Malaysia', slug: 'malaysia' },
        { label: 'Turkey', slug: 'turkey' },
        { label: 'Cyprus', slug: 'cyprus' },
      ]
    },
    { 
      label: 'Exam Vouchers', 
      type: 'store',
      subItems: [
        { label: 'PTE Academic', type: 'store' },
        { label: 'IELTS Vouchers', type: 'store' },
        { label: 'TOEFL iBT', type: 'store' },
        { label: 'LanguageCert', type: 'store' },
        { label: 'Skills for English', type: 'store' },
      ]
    },
    { 
      label: 'Learning Hub', 
      type: 'lms-dashboard',
      subItems: [
        { label: 'Digital Library', type: 'lms-dashboard' },
        { label: 'Mock Exams', type: 'lms-dashboard', tab: 'exams' },
        { label: 'Prep Courses', type: 'lms-dashboard', tab: 'academy' },
        { label: 'Qualifications', type: 'qualifications' },
      ]
    },
    { label: 'Resources', type: 'resources' },
    { 
      label: 'Connect', 
      type: 'join-hub',
      subItems: [
        { label: 'Student Admission', type: 'apply', formType: 'student-apply' },
        { label: 'Agent Registration', type: 'apply', formType: 'agent-reg' },
        { label: 'Training Centers', type: 'apply', formType: 'prep-center-reg' },
        { label: 'Institutional Sync', type: 'apply', formType: 'institute-connect' },
      ]
    }
  ];

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    onNavigate({ type: 'lms-dashboard' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 navbar-fixed ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'} ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`rounded-3xl px-6 py-2 flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'shadow-premium bg-white border border-slate-100' : 'bg-white/95 border border-slate-100 backdrop-blur-md'
        }`}>
          <div className="flex items-center gap-4 xl:gap-6">
            <button onClick={() => onNavigate({ type: 'home' })} className="flex items-center transition-transform hover:scale-[1.03] active:scale-95 shrink-0 py-1">
              <img src={LOGO_SRC} alt="UniCou" className="h-7 w-auto object-contain" />
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
                    className={`px-2 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-tight transition-all flex items-center gap-1 ${
                      view.type === item.type ? 'text-white bg-unicou-navy shadow-lg' : 'text-unicou-navy hover:text-unicou-orange'
                    }`}
                  >
                    {item.label}
                    {item.subItems && (
                      <svg className={`w-2.5 h-2.5 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M19 9l-7 7-7-7" /></svg>
                    )}
                  </button>

                  {item.subItems && activeDropdown === item.label && (
                    <div className={`absolute top-full left-0 pt-1 animate-in fade-in slide-in-from-top-1 ${item.isMega ? 'w-[480px]' : 'w-48'}`}>
                      <div className="bg-white border border-slate-100 rounded-2xl shadow-premium p-2">
                        <div className={`grid ${item.isMega ? 'grid-cols-3 gap-x-1' : 'grid-cols-1'} gap-0.5`}>
                          {item.subItems.map((sub: any) => (
                            <button
                              key={sub.label}
                              onClick={() => {
                                if (sub.slug) onNavigate({ type: 'country-guide', slug: sub.slug });
                                else if (sub.formType) onNavigate({ type: 'apply', formType: sub.formType } as any);
                                else if (sub.type) onNavigate({ type: sub.type, initialTab: sub.tab } as any);
                                setActiveDropdown(null);
                              }}
                              className="w-full text-left px-2 py-1.5 rounded-lg text-[8px] font-black text-unicou-charcoal hover:text-unicou-navy hover:bg-slate-50 transition-all uppercase tracking-widest truncate"
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
            <button onClick={(e) => { e.stopPropagation(); onOpenSearch(); }} className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-unicou-navy transition-colors border border-slate-100" title="Search Platform">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <button onClick={handleProfileClick} className="flex items-center gap-2 pl-1 pr-2 py-1 bg-unicou-navy rounded-full hover:bg-slate-900 transition-all shadow-md group">
                  <div className="w-4 h-4 rounded-full bg-unicou-orange flex items-center justify-center text-[7px] font-black text-white uppercase group-hover:scale-110 transition-transform">{user.name.charAt(0)}</div>
                  <span className="text-[8px] font-black text-white uppercase tracking-widest">{user.name.split(' ')[0]}</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); onLogout(); }} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); onNavigate({ type: 'login' }); }} className="px-2 py-1.5 text-[9px] font-black uppercase tracking-tight text-unicou-navy hover:text-unicou-orange transition-all">Sign In</button>
                <button onClick={(e) => { e.stopPropagation(); onNavigate({ type: 'signup' }); }} className="px-3 py-2 bg-unicou-orange text-white rounded-xl font-black text-[9px] uppercase tracking-tight shadow-action hover:bg-red-600 transition-all active:scale-95">Sign Up</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
