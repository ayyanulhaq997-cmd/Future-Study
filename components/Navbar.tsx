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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navigationItems = [
    { 
      label: 'Consultancy', 
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
      label: 'Vouchers', 
      type: 'store',
      subItems: [
        { label: 'IELTS Vouchers', type: 'store' },
        { label: 'PTE Academic', type: 'store' },
        { label: 'TOEFL iBT', type: 'store' },
        { label: 'Duolingo', type: 'store' },
        { label: 'LanguageCert', type: 'store' },
      ]
    },
    { 
      label: 'Learning Hub', 
      type: 'lms-dashboard',
      subItems: [
        { label: 'Mock Test Terminal', type: 'lms-dashboard' },
        { label: 'Mastery Courses', type: 'lms-dashboard' },
        { label: 'Qualifications', type: 'qualifications' },
      ]
    },
    { label: 'Operating Guide', type: 'guide' },
    { label: 'About Us', type: 'about' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'py-3' : 'py-6'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`rounded-3xl px-8 py-4 flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'shadow-premium bg-white border border-slate-100' : 'bg-white/90 border border-slate-100 backdrop-blur-md'
        }`}>
          <div className="flex items-center gap-10">
            <button onClick={() => onNavigate({ type: 'home' })} className="flex items-center transition-transform hover:scale-105 active:scale-95 shrink-0">
              <img src={LOGO_SRC} alt="UNICOU" className="h-9 w-auto object-contain" />
            </button>

            <div className="hidden lg:flex items-center gap-1">
              {navigationItems.map((item) => (
                <div 
                  key={item.label} 
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => onNavigate({ type: item.type } as any)}
                    className={`px-4 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-tight transition-all flex items-center gap-2 ${
                      view.type === item.type ? 'text-white bg-unicou-navy shadow-lg' : 'text-unicou-navy hover:text-unicou-orange'
                    }`}
                  >
                    {item.label}
                    {item.subItems && (
                      <svg className={`w-3 h-3 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    )}
                  </button>

                  {item.subItems && activeDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-premium p-4 animate-in fade-in slide-in-from-top-1">
                      <div className={`grid ${item.label === 'Consultancy' ? 'grid-cols-1' : 'grid-cols-1'} gap-1`}>
                        {item.subItems.map((sub: any) => (
                          <button
                            key={sub.label}
                            onClick={() => {
                              if (sub.slug) onNavigate({ type: 'country-guide', slug: sub.slug });
                              else if (sub.type) onNavigate({ type: sub.type, formType: sub.formType } as any);
                            }}
                            className="w-full text-left px-4 py-2 rounded-lg text-[10px] font-black text-slate-600 hover:text-unicou-navy hover:bg-slate-50 transition-all uppercase tracking-widest truncate"
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={onOpenSearch} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-unicou-navy transition-colors border border-slate-100" title="Search Platform">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <button onClick={() => onNavigate(['Admin', 'Finance'].includes(user.role) ? { type: 'admin' } : { type: 'lms-dashboard' })} className="flex items-center gap-2 pl-2 pr-4 py-1.5 bg-unicou-navy rounded-full hover:bg-slate-900 transition-all shadow-md">
                  <div className="w-7 h-7 rounded-full bg-unicou-orange flex items-center justify-center text-[10px] font-black text-white uppercase">{user.name.charAt(0)}</div>
                  <span className="text-[11px] font-black text-white uppercase tracking-widest">{user.name}</span>
                </button>
                <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => onNavigate({ type: 'login' })} className="px-5 py-2 text-[12px] font-black uppercase tracking-tight text-unicou-navy hover:text-unicou-orange transition-all">Login</button>
                <button onClick={() => onNavigate({ type: 'signup' })} className="px-7 py-3.5 bg-unicou-orange text-white rounded-2xl font-black text-[12px] uppercase tracking-tight shadow-action hover:bg-orange-600 transition-all active:scale-95">Register</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;