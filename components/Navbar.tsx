
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

  // Logo provided as Base64 to ensure persistent visibility
  const LOGO_SRC = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKMAAAAkCAYAAAA6l+7NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF1ElEQVR4nO2be0hUWRzHf85ojlPmjE6WpWm0U3Y7pWNmUvSgoN3oQY+k6CHoQRH9EUWURhL9IUVRUUhRPWhZURRFURRFUZSUZGVmZmVmZWVmllmZpWlmpZlpZ/5wZ8eZ69y7M3fmxvfDOfd3znfO+X7O+X3uuefc66CwsNAvYGCYmZ6T0L9hYDAYCwaDsWAwGAsGg7FgMBgLBoOxYDAYCwZjwWAwFgwGY8FgMBYMBmPBYDAWDAZjwWAwFgwGY8FgMBYMBmPBYDAWDAZjwWAwFgwGY8FgMBYMBmPBYDAWDAZjwWAwFgwGY8FgMBYMBmPB+AeW+L9Uv5Gf799YMBhG8K7fWNC0eWMBFmMBFmMBFmMBFmMBFmMBFmMBFmMBFmMBFmMBFmMBFmMBFuMftRjj8pM8/z/7r32i/f/p6ekhMTFRkpKSRv3/kZERampqICsrS44dO9auv197R+q/4m/k5/s3DMaCwaAtvO83FpSAsWAwGAsGg7FgMBgLBoOxYDAYCwZjwWAwFgwGY8FgMBYMBmPBYDAWDAZjwWAwFgwGY8FgMBYMBmPBYDAWDAZjwWAwFgwGY8FgMBYMBmPBYDAWDAZjwWAwFgwGY8FgMBYMBmPBYBgV9X8MxpXWn9Xv9Vv3u9Vf1d9Uf38692f15+m/U/9W/eX055TUV9RX1BfVp9VP1EfU99R31ZfUl9XntNdX1XvUN9S/1O7m5r9Uv5Gf798wGAsGgzH0v99Y8K8SMC7HGMf93x8F4nKM43KM43KMcVzOOC7HGC7XmS6X60yXy3W6XKfLdbpcp8t1ulyny3W6XK6Xy3K5Xp9vV8v1Mrmulsv0fFku0/NluUzPt6X/B/0/6P+O/p9H/7+j/7v6v6f/5X+nPy3vI0A7Hwb6+eD/Xf929O/6l9Bfgv679MfoG/Xp6Ov0PuhN0L9B74DeAr0Begv0L9DfoX9H/6D/R/+oN0E36o3QG6A3QI9Aj0Av6p8j0DPQi/oYegF6BHoGegF6AXoYegg9CD0A/R30Z9AP6L+Bfkb9OfTfQD+Dfgv6DejXoX8K/SfQH6A/QP8C/T76F+n+vA8+7A8B7B8K2F8isE+N/vfoX+7A/8fof+/Av2rgv1Xov0T/8R79R3n0j+L/v0B/iH7Xf7f/7mUffK6PPO8u2t2L9O7l7t33ue96nvuuD7/pI4f9LvtN9pvsN9n/N/v/u993F/PudO927N4Z7oO7uB/u5r6vP+v7BvPudm5+Xp+Xp6Ovi07H/hP9D/Tf0F+B/it6Hfpz+Ofoz9Ff6L+mf865vM7pde7P07vTeWf95fXneeeO9/fA97vveeeO92H9Tf+H7tXn5ufm5/p4e/q66HSuv9L/S/0F6F+hP6K/uN/X86m+5X4v8z8o/wv6X9Afgv4X9Kfor+rT0Nfpf6Y/RX9R74Z+H/2D3vS7XW+E3mD/t3q9Tr3efZ1v9L/pX6Y/S++mP0OfpU/RX+h/of+GPkOfpj9DP6f+93T9Kfqf9Mfov9P/oDdd3+H6Dte3uL6t9U2uT9R3tL7R9TH1PfVT6p/Un9Cf0P+g/r97n7u/vS/X69TrXJ+vT9L7S/RP6X+hP6N/Wv+Uvkn/tL6VvknfVP8fXv+X6iPyE9kYjIUh9C+DsdA/Y8FgMBZgg8FYMBgMBoPxT2BgeFrGAsNgMBiMBYPBYDB0GAYDw9AwDAZDR8MwGAwdBsNQf/6R6jfq5/sbBoPxT9B/j9GvDsb9v9Gvx+h7+v3pf/n/16uP0Tf0+8L7fGNB7Y6+K+r/EIx76Z996N99nPtO7r6N++De/0f33d79P9D/Q/+D+0f3X6Y/Sz/VnzscfWc4+i7HGD0eYzx9XmPMzR9j/D0eY6mOnu8R6PlH/876S+rvpD9JP9Gfx9/Y/83Xv9Gfpt/Yv8fXv9H/tL7h7v/Xv6X/mf60fjf9L86L/t/0Z9Vf1p/S71N9Vf159Xn1OfUr9Yv1MvUr9RX1ZfVl9Tn1ZfUF9Xn1ZfUp9S/1S9pXpC9p77D/v31N+mXpS+o99WvSt7R32P876UuMv/A+/xh9+S/v84/Rx5/j5w8F7B8K7PMI7POD/pX6N/0r/T+A6/8Dnd853QAAAABJRU5ErkJggg==";

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
      id: 'store', 
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
        <div className="flex items-center cursor-pointer" onClick={() => onNavigate({ type: 'home' })}>
          <img 
            src={LOGO_SRC} 
            alt="UNICOU Logo" 
            className="h-10 md:h-12 w-auto object-contain"
            onError={(e) => {
              // Fallback to text if image still fails for any environment reason
              (e.target as HTMLImageElement).style.display = 'none';
              const parent = (e.target as HTMLImageElement).parentElement;
              if (parent) {
                const text = document.createElement('span');
                text.className = "text-xl font-display font-bold tracking-tighter text-white";
                text.innerHTML = 'UNI<span class="text-unicou-orange">COU</span>';
                parent.appendChild(text);
              }
            }}
          />
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
          <button onClick={onOpenSearch} className="p-2 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
          {!user ? (
            <button onClick={() => onNavigate({ type: 'login' })} className="px-5 py-2.5 bg-unicou-orange text-white rounded-lg text-[9px] font-black uppercase tracking-widest active:scale-95 shadow-lg shadow-unicou-orange/20 hover:bg-orange-600 transition-all">Login</button>
          ) : (
            <div className="flex items-center gap-4">
               <button onClick={() => onNavigate(user.role === 'Admin' ? { type: 'admin' } : { type: 'home' })} className="text-[9px] font-black uppercase text-primary-400 hover:text-primary-300 underline">{user.name}</button>
               <button onClick={onLogout} className="text-[9px] font-black uppercase text-slate-500 hover:text-red-400 transition-colors">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
