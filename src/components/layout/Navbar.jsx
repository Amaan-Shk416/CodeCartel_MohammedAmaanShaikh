import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  PlusCircle,
  BarChart3,
  CalendarCheck,
  LayoutDashboard,
  MessageSquare,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home', icon: Briefcase, exact: true },
  { to: '/professionals', label: 'Professionals', icon: Users },
  { to: '/post-job', label: 'Post Job', icon: PlusCircle },
  { to: '/compare-offers', label: 'Offers', icon: BarChart3 },
  { to: '/my-bookings', label: 'My Bookings', icon: CalendarCheck },
  { to: '/worker-dashboard', label: 'Worker Portal', icon: LayoutDashboard },
  { to: '/messages', label: 'Messages', icon: MessageSquare },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-kaarya-lavender shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-kaarya-purple to-kaarya-pink flex items-center justify-center text-white shadow-md shadow-kaarya-purple/20 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-kaarya-navy">Kaarya</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-kaarya-lavender text-kaarya-purple px-1.5 py-0.5 rounded">
                  Beta
                </span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block -mt-0.5">Where Skills Meet Opportunity</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.exact}
                  className={({ isActive }) =>
                    `flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                      isActive
                        ? 'bg-kaarya-lavender text-kaarya-purple font-semibold'
                        : 'text-gray-600 hover:text-kaarya-purple hover:bg-kaarya-lavender/50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Quick CTA */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/post-job"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-kaarya-purple to-kaarya-pink hover:opacity-95 shadow-md shadow-kaarya-purple/20 transition-all hover:shadow-lg active:scale-95"
            >
              Post a Job
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-kaarya-navy hover:bg-gray-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-gray-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-kaarya-lavender text-kaarya-purple font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>
      )}
    </header>
  );
}
