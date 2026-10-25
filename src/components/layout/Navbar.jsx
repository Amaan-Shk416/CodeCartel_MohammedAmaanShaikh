import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  PlusCircle,
  BarChart3,
  CalendarCheck,
  MessageSquare,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
  MapPin,
  ChevronRight,
} from 'lucide-react';

/**
 * Universal primary navigation items for Kaarya
 */
const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home, exact: true },
  { to: '/professionals', label: 'Find Professionals', icon: Users, exact: false },
  { to: '/compare-offers', label: 'Compare Offers', icon: BarChart3, exact: false },
  { to: '/my-bookings', label: 'My Bookings', icon: CalendarCheck, exact: false },
  { to: '/messages', label: 'Messages', icon: MessageSquare, exact: false },
  { to: '/worker-dashboard', label: 'For Workers', icon: LayoutDashboard, exact: false },
];

/**
 * Helper to determine active state for nav links,
 * including nested dynamic routes like /professionals/:id or /bookings/:id
 */
const isNavActive = (item, pathname) => {
  if (item.exact) {
    return pathname === item.to;
  }
  if (item.to === '/professionals') {
    return pathname === '/professionals' || pathname.startsWith('/professionals/');
  }
  if (item.to === '/my-bookings') {
    return pathname === '/my-bookings' || pathname.startsWith('/bookings/');
  }
  if (item.to === '/messages') {
    return pathname === '/messages' || pathname.startsWith('/messages');
  }
  if (item.to === '/compare-offers') {
    return pathname === '/compare-offers';
  }
  if (item.to === '/worker-dashboard') {
    return pathname === '/worker-dashboard';
  }
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  // Close mobile drawer when pressing Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Synchronize mobile menu closing on route changes without cascading render effects
  const currentPath = location.pathname + location.search;
  const [prevPath, setPrevPath] = useState(currentPath);
  if (currentPath !== prevPath) {
    setPrevPath(currentPath);
    setMobileMenuOpen(false);
  }

  const isPostJobActive = pathname === '/post-job';

  return (
    <header className="sticky top-0 z-50 bg-white/75 backdrop-blur-xl supports-[backdrop-filter]:bg-white/65 border-b border-white/70 shadow-[0_8px_32px_0_rgba(115,80,210,0.06),0_1px_3px_0_rgba(0,0,0,0.02)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo & Tagline */}
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-kaarya-purple rounded-xl pr-1"
            aria-label="Kaarya Homepage"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-kaarya-purple to-kaarya-pink p-[1.5px] shadow-sm group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-white/90 backdrop-blur-md rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-kaarya-purple group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-kaarya-navy">
                  Kaar<span className="bg-gradient-to-r from-kaarya-purple to-kaarya-pink bg-clip-text text-transparent">ya</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/80 border border-kaarya-lavender text-kaarya-purple px-1.5 py-0.5 rounded-full shadow-xs">
                  Beta
                </span>
              </div>
              <p className="text-[10.5px] text-gray-500 font-medium hidden sm:block leading-none mt-0.5">
                Where Skills Meet Opportunity
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links — Inner Glassmorphic Tray */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-1 xl:gap-1.5 p-1 rounded-2xl bg-slate-100/40 backdrop-blur-md border border-white/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_1px_4px_rgba(0,0,0,0.02)]"
          >
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const active = isNavActive(link, pathname);
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs xl:text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-kaarya-purple ${
                    active
                      ? 'bg-white/90 text-kaarya-purple font-semibold shadow-xs border border-white ring-1 ring-kaarya-purple/15 backdrop-blur-sm'
                      : 'text-slate-600 hover:text-kaarya-purple hover:bg-white/60'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Header Controls: Location Badge & Primary CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Ambient Location Pill (Frosted Glass) */}
            <div className="hidden 2xl:flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-white/60 backdrop-blur-md border border-white/80 px-3 py-1.5 rounded-xl shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-kaarya-pink shrink-0" />
              <span>Mumbai, MH</span>
            </div>

            {/* Primary Action: Post a Job */}
            <NavLink
              to="/post-job"
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-kaarya-purple ${
                isPostJobActive
                  ? 'bg-gradient-to-r from-kaarya-purple via-kaarya-purple to-kaarya-pink text-white ring-2 ring-kaarya-pink/40 shadow-md shadow-kaarya-purple/25'
                  : 'bg-gradient-to-r from-kaarya-purple via-kaarya-purple to-kaarya-pink text-white hover:opacity-95 shadow-md shadow-kaarya-purple/20 hover:shadow-lg active:scale-95'
              }`}
              aria-current={isPostJobActive ? 'page' : undefined}
            >
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>Post a Job</span>
            </NavLink>

            {/* Mobile Hamburger Toggle Button */}
            <div className="flex lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="p-2 rounded-xl text-slate-700 hover:text-kaarya-navy hover:bg-white/60 border border-transparent hover:border-white/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-kaarya-purple transition-all"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer — Glassmorphic Surface */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          className="lg:hidden border-b border-white/70 bg-white/80 backdrop-blur-2xl px-4 pt-3 pb-5 space-y-1.5 shadow-2xl transition-all"
        >
          {/* Quick Primary Mobile Link */}
          <div className="pb-2 border-b border-slate-200/50 mb-2">
            <NavLink
              to="/post-job"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${
                isPostJobActive
                  ? 'bg-gradient-to-r from-kaarya-purple to-kaarya-pink shadow-md'
                  : 'bg-gradient-to-r from-kaarya-purple to-kaarya-pink hover:opacity-95 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <PlusCircle className="w-4 h-4" />
                <span>Post a New Job</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-80" />
            </NavLink>
          </div>

          {/* All Navigation Destinations */}
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const active = isNavActive(link, pathname);
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-white/90 text-kaarya-purple font-semibold shadow-xs border border-white ring-1 ring-kaarya-purple/20'
                    : 'text-slate-700 hover:text-kaarya-purple hover:bg-white/60'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0 text-slate-500" />
                  <span>{link.label}</span>
                </div>
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-kaarya-purple" />
                )}
              </NavLink>
            );
          })}

          {/* Mobile Footer helper */}
          <div className="pt-3 mt-2 border-t border-slate-200/50 flex items-center justify-between text-xs text-slate-500 px-2">
            <span className="flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-kaarya-pink" />
              <span>Mumbai, MH</span>
            </span>
            <span>Hyperlocal Marketplace</span>
          </div>
        </div>
      )}
    </header>
  );
}
