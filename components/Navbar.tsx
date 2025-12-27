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

  const businessVerticals = [
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
    { label: 'Resources', type: 'resources' },
    { label: 'About Us', type: 'about' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${scrolled ? 'py-2' : 'py-5'}`}>
      <div className="max-w-[1600px] mx-auto px-6">
        <div className={`border rounded-[2.5rem] px-8 py-4 flex items-center justify-between transition-all duration-700 ${
          scrolled ? 'shadow-2xl bg-white border-slate-200' : 'bg-white/80 border-slate-100 backdrop-blur-xl'
        }`}>
          <div className="flex items-center gap-8">
            <button onClick={() => onNavigate({ type: 'home' })} className="flex items-center transition-all hover:opacity-80 active:scale-95 shrink-0">
              <img src={LOGO_SRC} alt="UNICOU" className="h-10 md:h-12 w-auto object-contain block" />
            </button>

            <div className="hidden xl:flex items-center gap-1">
              {businessVerticals.map((item) => (
                <div 
                  key={item.label} 
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => onNavigate({ type: item.type } as any)}
                    className={`px-5 py-2.5 rounded-2xl text-[13px] font-black uppercase tracking-tight transition-all flex items-center gap-2 ${
                      view.type === item.type ? 'bg-unicou-navy text-white shadow-xl' : 'text-slate-800 hover:text-unicou-orange hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                    {item.subItems && (
                      <svg className={`w-3 h-3 transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    )}
                  </button>

                  {item.subItems && activeDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-100 rounded-[2rem] shadow-3xl p-5 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className={`grid ${item.label === 'Consultancy' ? 'grid-cols-2 w-[450px]' : 'grid-cols-1'} gap-1`}>
                        {item.subItems.map((sub: any) => (
                          <button
                            key={sub.label}
                            onClick={() => {
                              if (sub.slug) onNavigate({ type: 'country-guide', slug: sub.slug });
                              else if (sub.type) onNavigate({ type: sub.type, formType: sub.formType } as any);
                            }}
                            className="w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black text-slate-600 hover:text-unicou-navy hover:bg-slate-50 transition-all uppercase tracking-widest truncate"
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
            <button onClick={onOpenSearch} className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-900 transition-all border border-slate-200 shadow-sm" title="Nexus Search">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <button onClick={() => onNavigate(['Admin', 'Finance'].includes(user.role) ? { type: 'admin' } : { type: 'lms-dashboard' })} className="flex items-center gap-3 pl-2 pr-5 py-1.5 bg-slate-50 border border-slate-200 rounded-full hover:bg-slate-100 transition-all shadow-sm group">
                  <div className="w-8 h-8 rounded-full bg-unicou-navy flex items-center justify-center text-[10px] font-black text-white group-hover:bg-unicou-orange transition-colors">{user.name.charAt(0).toUpperCase()}</div>
                  <span className="text-[11px] font-black text-slate-950 uppercase tracking-widest">{user.name}</span>
                </button>
                <button onClick={onLogout} className="p-3 text-slate-400 hover:text-red-500 transition-colors" title="Deauthorize Session">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => onNavigate({ type: 'login' })} className="px-6 py-2.5 text-[13px] font-black uppercase tracking-tight text-slate-800 hover:text-unicou-navy transition-all hidden sm:block">Log In</button>
                <button onClick={() => onNavigate({ type: 'signup' })} className="px-8 py-4 bg-unicou-orange text-white rounded-3xl font-black text-[13px] uppercase tracking-tight shadow-xl hover:bg-orange-600 active:scale-95 transition-all">Join Platform</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;