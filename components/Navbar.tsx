
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
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // STRICT MENU GROUPING AS PER REQUIREMENTS
  const mainNav = [
    { id: 'about', label: 'About Us', action: () => onNavigate({ type: 'about' }) },
    { 
      id: 'study', 
      label: 'Study Abroad', 
      items: [
        { name: 'United Kingdom', slug: 'uk' },
        { name: 'Australia', slug: 'australia' },
        { name: 'Canada', slug: 'canada' },
        { name: 'United States', slug: 'usa' },
        { name: 'Ireland', slug: 'ireland' },
        { name: 'All Destinations', action: () => onNavigate({ type: 'country-list' }) },
      ]
    },
    { 
      id: 'immigration', 
      label: 'Immigration', 
      items: [
        { name: 'Skilled Migration', slug: 'skilled-immigration' },
        { name: 'Business Visas', slug: 'business-immigration' },
        { name: 'Digital Nomads', slug: 'nomads' },
      ]
    },
    { id: 'vouchers', label: 'Exam Vouchers', action: () => onNavigate({ type: 'store' }) },
    { id: 'elearning', label: 'E-Learning', action: () => onNavigate({ type: 'lms-dashboard' }) },
    { id: 'library', label: 'Library', action: () => onNavigate({ type: 'library' }) },
    { 
      id: 'connect', 
      label: 'Connect', 
      items: [
        { name: 'Partner Sync', action: () => onNavigate({ type: 'apply', formType: 'membership', context: 'Partner Sync' }) },
        { name: 'Student Portal', action: () => onNavigate({ type: 'apply', formType: 'study-abroad', context: 'Student Registration' }) },
        { name: 'Support Node', action: () => onNavigate({ type: 'apply', formType: 'general', context: 'General Support' }) },
      ]
    },
  ];

  const handleLinkClick = (item: any) => {
    setActiveMenu(null);
    setMobileOpen(false);
    if (item.action) {
      item.action();
    } else if (item.slug) {
      if (['skilled-immigration', 'business-immigration', 'nomads'].includes(item.slug)) {
        onNavigate({ type: 'immigration-guide', slug: item.slug });
      } else {
        onNavigate({ type: 'country-guide', slug: item.slug });
      }
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b border-white/5 ${
      scrolled ? 'bg-slate-950/98 backdrop-blur-xl shadow-2xl' : 'bg-slate-950/90 backdrop-blur-md'
    }`}>
      {/* .navbar { display: flex; align-items: center; justify-content: space-between; height: 72px; overflow: hidden; } */}
      <div className="max-w-[1600px] mx-auto px-6 flex items-center justify-between h-[72px] overflow-hidden flex-nowrap gap-4">
        
        {/* LOGO (LEFT) */}
        <div 
          className="flex items-center gap-3 cursor-pointer group shrink-0" 
          onClick={() => onNavigate({ type: 'store' })}
        >
          <div className="w-8 h-8 bg-unicou-navy rounded-lg flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5 text-unicou-orange" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9l-2.5-1.5L14 11V4h5v7z" />
            </svg>
          </div>
          <div className="text-lg font-display font-bold flex tracking-tighter whitespace-nowrap overflow-hidden">
            <span className="text-white uppercase">Uni</span><span className="text-unicou-orange uppercase">cou</span>
          </div>
        </div>

        {/* .nav-links { display: flex; flex-wrap: nowrap; white-space: nowrap; gap: 24px; } (CENTER) */}
        <div className="hidden lg:flex items-center flex-nowrap h-full gap-6 shrink min-w-0">
          {mainNav.map((item) => (
            <div 
              key={item.id} 
              className="relative h-full flex items-center shrink-0"
              onMouseEnter={() => setActiveMenu(item.id)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button 
                onClick={() => item.action && item.action()}
                className={`px-1 py-2 text-[10px] xl:text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeMenu === item.id ? 'text-unicou-orange' : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
                {item.items && (
                  <svg className={`w-3 h-3 transition-transform duration-300 ${activeMenu === item.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>

              {/* DROPDOWN (ONLY SHOWS ON HOVER) */}
              {item.items && (
                <div className={`absolute top-[72px] left-0 w-52 glass border border-white/10 p-2 shadow-2xl transition-all origin-top-left z-[110] rounded-b-2xl ${
                  activeMenu === item.id ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
                }`}>
                  {item.items.map((sub: any) => (
                    <button
                      key={sub.name}
                      onClick={() => handleLinkClick(sub)}
                      className="w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-tight text-slate-400 hover:bg-unicou-orange hover:text-white transition-all flex justify-between items-center group/sub whitespace-nowrap"
                    >
                      {sub.name}
                      <svg className="w-3 h-3 opacity-0 group-hover/sub:opacity-100 transition-all -translate-x-1 group-hover/sub:translate-x-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA & UTILITY (RIGHT) */}
        <div className="flex items-center gap-2 xl:gap-3 shrink-0 ml-auto">
          <button 
            onClick={onOpenSearch} 
            className="p-2 text-slate-400 hover:text-unicou-orange hover:bg-white/5 rounded-xl transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>

          {user ? (
            <button 
              onClick={() => onNavigate(user.role === 'Admin' ? { type: 'admin' } : { type: 'agent' })}
              className="w-8 h-8 rounded-lg bg-unicou-orange/20 border border-unicou-orange/30 flex items-center justify-center text-unicou-orange font-black text-xs"
            >
              {user.name.charAt(0)}
            </button>
          ) : (
            <button 
              onClick={() => onNavigate({ type: 'login' })} 
              className="p-2 text-slate-400 hover:text-unicou-orange transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </button>
          )}

          <button 
            onClick={() => onNavigate({ type: 'apply', formType: 'general', context: 'Global Application' })}
            className="hidden sm:block px-5 py-2.5 bg-unicou-orange hover:bg-[#ff6b3d] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl whitespace-nowrap"
          >
            Apply Now
          </button>

          {/* HAMBURGER TRIGGER (Visible < 1024px) */}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="lg:hidden p-2 text-white bg-white/5 rounded-xl border border-white/10"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={mobileOpen ? "M6 18L18 6" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE OVERLAY MENU (Appears below 72px) */}
      <div className={`lg:hidden fixed inset-0 top-[72px] z-[90] bg-slate-950/98 backdrop-blur-2xl transition-all duration-500 border-t border-white/5 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 h-full overflow-y-auto space-y-2 pb-32">
          {mainNav.map(item => (
            <div key={item.id} className="space-y-1">
              <button 
                onClick={() => {
                  if (item.items) setActiveMenu(activeMenu === item.id ? null : item.id);
                  else if (item.action) { item.action(); setMobileOpen(false); }
                }}
                className={`w-full text-left p-5 rounded-2xl glass border border-white/5 text-[11px] font-black uppercase tracking-widest flex justify-between items-center transition-all ${activeMenu === item.id ? 'text-unicou-orange border-unicou-orange/20 bg-unicou-orange/5' : 'text-slate-300'}`}
              >
                {item.label}
                {item.items && <svg className={`w-4 h-4 transition-transform ${activeMenu === item.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>}
              </button>
              {item.items && activeMenu === item.id && (
                <div className="pl-4 grid grid-cols-1 gap-1 py-2 animate-in slide-in-from-top duration-300">
                  {item.items.map((sub: any) => (
                    <button key={sub.name} onClick={() => handleLinkClick(sub)} className="text-left p-4 rounded-xl text-[10px] font-bold uppercase tracking-tight text-slate-500 hover:text-white bg-white/5 border border-transparent">{sub.name}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-6 border-t border-white/5 space-y-4">
             <button 
                onClick={() => { setMobileOpen(false); onNavigate({ type: 'apply', formType: 'general' }); }}
                className="w-full p-5 rounded-2xl bg-unicou-orange text-white text-[10px] font-black uppercase tracking-widest shadow-2xl"
              >
                Initialize Roadmap
              </button>
             {user && (
               <button onClick={() => { setMobileOpen(false); onLogout(); }} className="w-full p-5 rounded-2xl bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-widest border border-red-500/20">Sign Out</button>
             )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
