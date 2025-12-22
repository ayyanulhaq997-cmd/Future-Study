
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

  // Close dropdowns when clicking outside
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
        { name: 'View Country Directory', action: () => onNavigate({ type: 'country-list' }) },
        { name: 'United Kingdom', slug: 'uk' },
        { name: 'Australia', slug: 'australia' },
        { name: 'USA', slug: 'usa' },
        { name: 'Canada', slug: 'canada' },
        { name: 'New Zealand', slug: 'new-zealand' },
        { name: 'Ireland', slug: 'ireland' },
        { name: 'Cyprus', slug: 'cyprus' },
        { name: 'Germany', slug: 'germany' },
        { name: 'Italy', slug: 'italy' },
        { name: 'Sweden', slug: 'sweden' },
        { name: 'Finland', slug: 'finland' },
        { name: 'Europe', slug: 'europe' },
        { name: 'Dubai', slug: 'dubai' },
        { name: 'Malaysia', slug: 'malaysia' },
        { name: 'Turkey', slug: 'turkey' },
      ]
    },
    { 
      id: 'immigration', 
      label: 'Immigration', 
      items: [
        { name: 'All Pathways', action: () => onNavigate({ type: 'immigration-guide', slug: 'skilled-immigration' }) },
        { name: 'Skilled Immigration', slug: 'skilled-immigration' },
        { name: 'Business Immigration', slug: 'business-immigration' },
        { name: 'Citizenship by Investment', slug: 'citizenship-by-investment' },
        { name: 'Nomads & Remote Work', slug: 'nomads' },
        { name: 'Regional Mobility', slug: 'regional' },
      ]
    },
    { 
      id: 'vouchers', 
      label: 'Vouchers', 
      action: () => {
        onNavigate({ type: 'store' });
        setTimeout(() => {
          document.getElementById('voucher-sale-node')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } 
    },
    { id: 'elearning', label: 'E-Learning', action: () => onNavigate({ type: 'lms-dashboard' }) },
    { id: 'library', label: 'Library', action: () => onNavigate({ type: 'library' }) },
    { 
      id: 'connect', 
      label: 'Connect', 
      items: [
        { name: 'Contact Hub', action: () => onNavigate({ type: 'apply', formType: 'general', context: 'Inquiry' }) },
        { name: 'Become A Partner', action: () => onNavigate({ type: 'apply', formType: 'membership', context: 'Partnership' }) },
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
      const immigrationSlugs = ['skilled-immigration', 'business-immigration', 'citizenship-by-investment', 'nomads', 'regional'];
      if (immigrationSlugs.includes(item.slug)) {
        onNavigate({ type: 'immigration-guide', slug: item.slug });
      } else {
        onNavigate({ type: 'country-guide', slug: item.slug });
      }
    }
  };

  const handleTopLevelClick = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    if (item.items) {
      setActiveMenu(activeMenu === item.id ? null : item.id);
    } else if (item.action) {
      item.action();
      setActiveMenu(null);
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
        backdropFilter: 'blur(16px)',
        boxShadow: scrolled ? '0 10px 30px -10px rgba(0,0,0,0.5)' : 'none'
      }}
    >
      <div className="max-w-[1600px] mx-auto px-4 h-full flex items-center justify-between gap-4">
        
        {/* LOGO */}
        <div 
          className="flex items-center cursor-pointer group shrink-0" 
          onClick={() => { onNavigate({ type: 'store' }); setActiveMenu(null); }}
        >
          <img 
            src="logo.png" 
            alt="UNICOU" 
            className="h-8 md:h-10 w-auto object-contain transition-transform group-hover:scale-105"
            onError={(e) => {
               // Fallback if logo.png is missing
               e.currentTarget.style.display = 'none';
               e.currentTarget.parentElement!.innerHTML = `<div class="text-xl font-display font-bold"><span class="text-white">UNI</span><span class="text-unicou-orange">COU</span></div>`;
            }}
          />
        </div>

        {/* MAIN TABS */}
        <div 
          className="hidden md:flex items-center justify-center flex-nowrap flex-grow h-full" 
          style={{ gap: 'clamp(0.1rem, 1vw, 1.2rem)' }}
        >
          {mainNav.map((item, index) => (
            <div 
              key={item.id} 
              className="relative h-full flex items-center"
              onMouseEnter={() => !mobileOpen && setActiveMenu(item.id)}
              onMouseLeave={() => !mobileOpen && setActiveMenu(null)}
            >
              <button 
                onClick={(e) => handleTopLevelClick(e, item)}
                className={`px-1.5 py-2 font-black uppercase tracking-widest transition-all flex items-center gap-1 whitespace-nowrap relative group/tab cursor-pointer`}
                style={{ 
                  fontSize: 'var(--nav-font-size)',
                  color: activeMenu === item.id ? 'var(--nav-text-active)' : 'var(--nav-text-muted)'
                }}
              >
                {item.label}
                {item.items && (
                  <svg className={`w-2.5 h-2.5 shrink-0 transition-transform duration-300 ${activeMenu === item.id ? 'rotate-180 text-unicou-orange' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-unicou-orange transition-all duration-300 transform origin-left ${activeMenu === item.id ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`} />
              </button>

              {/* DROPDOWN - MEGA MENU STYLE */}
              {item.items && (
                <div 
                  className={`absolute top-[var(--nav-height)] w-64 glass border border-white/10 p-2 shadow-2xl transition-all origin-top z-[120] rounded-b-2xl max-h-[70vh] overflow-y-auto no-scrollbar ${
                    activeMenu === item.id ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
                  } ${index > mainNav.length - 3 ? 'right-0' : 'left-0'}`}
                >
                  <div className="space-y-0.5">
                    {item.items.map((sub: any, sIdx: number) => (
                      <button
                        key={sub.name}
                        onClick={() => handleLinkClick(sub)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-tight transition-all flex justify-between items-center group/sub whitespace-nowrap ${
                          sIdx === 0 && (item.id === 'study' || item.id === 'immigration') ? 'text-primary-400 bg-primary-400/5 mb-1' : 'text-slate-400 hover:bg-unicou-orange hover:text-white'
                        }`}
                      >
                        {sub.name}
                        <svg className="w-3 h-3 opacity-0 group-hover/sub:opacity-100 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* UTILITIES */}
        <div className="flex items-center gap-2 lg:gap-3 shrink-0">
          <button onClick={onOpenSearch} className="p-2 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
          
          <button 
            onClick={() => { onNavigate({ type: 'apply', formType: 'study-abroad', context: 'Fast Apply' }); setActiveMenu(null); }}
            className="hidden sm:block px-4 py-2 bg-unicou-orange hover:bg-orange-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg whitespace-nowrap"
          >
            Apply Now
          </button>

          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="md:hidden p-2 text-white bg-white/5 rounded-lg border border-white/10"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={mobileOpen ? "M6 18L18 6" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      <div className={`md:hidden fixed inset-0 top-[var(--nav-height)] z-[90] bg-slate-950/98 backdrop-blur-2xl transition-all duration-500 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full overflow-y-auto space-y-2 pb-32">
          {mainNav.map(item => (
            <div key={item.id} className="space-y-1">
              <button 
                onClick={() => {
                  if (item.items) setActiveMenu(activeMenu === item.id ? null : item.id);
                  else if (item.action) { item.action(); setMobileOpen(false); }
                }}
                className={`w-full text-left p-4 rounded-xl glass border border-white/5 text-[11px] font-black uppercase tracking-widest flex justify-between items-center ${activeMenu === item.id ? 'text-unicou-orange' : 'text-slate-300'}`}
              >
                {item.label}
                {item.items && <svg className={`w-4 h-4 transition-transform ${activeMenu === item.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>}
              </button>
              {item.items && activeMenu === item.id && (
                <div className="pl-4 grid grid-cols-1 gap-1 py-2">
                  {item.items.map((sub: any) => (
                    <button key={sub.name} onClick={() => handleLinkClick(sub)} className="text-left p-3 rounded-lg text-[10px] font-bold uppercase text-slate-500 hover:text-white bg-white/5">{sub.name}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
