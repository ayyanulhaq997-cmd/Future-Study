
import React, { useState, useEffect, useRef } from 'react';
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
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const mainNav = [
    { id: 'about', label: 'About Us', action: () => onNavigate({ type: 'about' }) },
    { 
      id: 'study', 
      label: 'Study Abroad', 
      items: [
        { name: 'View All Countries', action: () => onNavigate({ type: 'country-list' }) },
        { name: 'United Kingdom', slug: 'uk' },
        { name: 'Australia', slug: 'australia' },
        { name: 'USA', slug: 'usa' },
        { name: 'Canada', slug: 'canada' },
      ]
    },
    { 
      id: 'immigration', 
      label: 'Immigration', 
      items: [
        { name: 'Skilled Migration', slug: 'skilled-immigration' },
        { name: 'Business Immigration', slug: 'business-immigration' },
        { name: 'Remote Nomad Visas', slug: 'nomads' },
      ]
    },
    { 
      id: 'vouchers', 
      label: 'Vouchers', 
      action: () => onNavigate({ type: 'store' }) 
    },
    { id: 'academy', label: 'Academy', action: () => onNavigate({ type: 'lms-dashboard' }) },
    { id: 'library', label: 'Library', action: () => onNavigate({ type: 'library' }) },
    { 
      id: 'connect', 
      label: 'Connect', 
      items: [
        { name: 'Apply Now', action: () => onNavigate({ type: 'apply', formType: 'study-abroad', context: 'Fast Application' }) },
        { name: 'Partner Hub', action: () => onNavigate({ type: 'signup' }) },
        { name: 'Careers', action: () => onNavigate({ type: 'careers' }) },
      ]
    },
  ];

  const handleLinkClick = (item: any) => {
    setActiveMenu(null);
    setMobileOpen(false);
    if (item.action) {
      item.action();
    } else if (item.slug) {
      const isImmigration = ['skilled-immigration', 'business-immigration', 'nomads'].includes(item.slug);
      onNavigate(isImmigration ? { type: 'immigration-guide', slug: item.slug } : { type: 'country-guide', slug: item.slug });
    }
  };

  return (
    <nav 
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b`}
      style={{ 
        height: 'var(--nav-height)', 
        backgroundColor: 'var(--nav-bg)', 
        borderColor: 'var(--nav-border)',
        backdropFilter: 'blur(16px)'
      }}
    >
      <div className="max-w-[1600px] mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center cursor-pointer" onClick={() => onNavigate({ type: 'store' })}>
          <div className="text-xl font-display font-bold text-white uppercase tracking-tighter">
            UNI<span className="text-unicou-orange">COU</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1 h-full">
          {mainNav.map(item => (
            <div 
              key={item.id} 
              className="relative h-full flex items-center"
              onMouseEnter={() => setActiveMenu(item.id)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button 
                onClick={() => item.action ? item.action() : setActiveMenu(activeMenu === item.id ? null : item.id)}
                className={`px-3 py-2 font-black uppercase tracking-widest text-[10px] transition-all ${activeMenu === item.id || (view.type === item.id) ? 'text-unicou-orange' : 'text-slate-400 hover:text-white'}`}
              >
                {item.label}
              </button>

              {item.items && activeMenu === item.id && (
                <div className="absolute top-[var(--nav-height)] left-0 w-56 glass border border-white/10 p-2 shadow-2xl rounded-b-2xl animate-in fade-in slide-in-from-top-2">
                  {item.items.map(sub => (
                    <button
                      key={sub.name}
                      onClick={() => handleLinkClick(sub)}
                      className="w-full text-left px-4 py-3 rounded-xl text-[9px] font-bold uppercase text-slate-400 hover:bg-unicou-orange hover:text-white transition-all"
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button onClick={onOpenSearch} className="p-2 text-slate-400 hover:text-white"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></button>
          {!user ? (
            <button onClick={() => onNavigate({ type: 'login' })} className="px-5 py-2 bg-unicou-orange text-white rounded-lg text-[9px] font-black uppercase tracking-widest active:scale-95 shadow-lg">Login</button>
          ) : (
            <div className="flex items-center gap-4">
               <button onClick={() => onNavigate(user.role === 'Admin' ? { type: 'admin' } : { type: 'store' })} className="text-[9px] font-black uppercase text-primary-400 underline">{user.name}</button>
               <button onClick={onLogout} className="text-[9px] font-black uppercase text-slate-500 hover:text-red-400">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
