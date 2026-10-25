import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_WORKERS } from '../data/mockData';
import WorkerProfileModal from '../components/workers/WorkerProfileModal';

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState({});
  const [activeModalWorker, setActiveModalWorker] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('Today 2:30 PM');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/professionals?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/professionals');
    }
  };

  const toggleFavorite = (workerId, e) => {
    if (e) {
      e.stopPropagation();
    }
    setFavorites((prev) => ({
      ...prev,
      [workerId]: !prev[workerId],
    }));
  };

  const handleOpenWorkerModal = (workerId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const worker = MOCK_WORKERS.find((w) => w.id === workerId);
    if (worker) {
      setActiveModalWorker(worker);
    }
  };

  return (
    <div className="bg-[#FAFBFF] font-sans text-brand-navy antialiased min-h-screen relative overflow-x-hidden selection:bg-brand-pink/20 selection:text-brand-purple">
      {/* Ambient Aurora Backdrops */}
      <div className="aurora-blob-1 -top-32 -left-20"></div>
      <div className="aurora-blob-2 top-20 right-[-100px]"></div>
      <div className="aurora-blob-3 top-[1050px] left-1/4"></div>
      <div className="aurora-blob-2 bottom-40 right-10"></div>

      {/* MAIN BODY */}
      <main className="w-full pt-6 sm:pt-8 pb-16 relative z-10">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              {/* Glass Top Pill */}
              <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-white/90 border border-purple-200/60 shadow-sm backdrop-blur-md">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-pink opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-pink"></span>
                </span>
                <span className="text-[11px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-brand-pink via-brand-purple to-brand-blue bg-clip-text text-transparent">
                  TRUSTED · LOCAL · FAIR OPPORTUNITIES
                </span>
              </div>

              {/* Master Headline */}
              <div className="space-y-1">
                <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[62px] leading-[1.08] tracking-tight text-brand-navy">
                  <span className="bg-gradient-to-r from-brand-pink via-[#B800E6] to-brand-purple bg-clip-text text-transparent block">
                    Local Skills.
                  </span>
                  <span className="bg-gradient-to-r from-brand-purple via-brand-blue to-cyan-500 bg-clip-text text-transparent block">
                    Fair Opportunities.
                  </span>
                  <span className="text-brand-navy block">
                    At Your Doorstep.
                  </span>
                </h1>
              </div>

              {/* Supporting Text */}
              <p className="text-brand-slate text-base sm:text-lg max-w-xl font-normal leading-relaxed">
                Find verified, neighborhood professionals for plumbing, electrical, cleaning, carpentry, and home care at straightforward prices. Support local micro-entrepreneurs in your community.
              </p>

              {/* Large Horizontal Glass Search Component */}
              <form
                onSubmit={handleSearchSubmit}
                className="w-full glass-surface rounded-2xl p-2.5 md:p-3 shadow-glass-lg border border-white flex flex-col md:flex-row items-center gap-2.5"
              >
                {/* Service search input */}
                <div className="flex items-center gap-3 flex-1 px-4 py-3 w-full bg-white/90 rounded-xl border border-slate-200/70 focus-within:border-brand-purple/50 focus-within:ring-2 focus-within:ring-brand-purple/10 transition-all">
                  <span className="material-symbols-outlined text-brand-purple text-[22px] shrink-0">search</span>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-sm text-brand-navy placeholder:text-brand-slate/70 focus:outline-none border-0 p-0"
                    placeholder="What service do you need? (e.g. Electrician, Carpenter)"
                    type="text"
                  />
                </div>

                {/* Location selector */}
                <div className="flex items-center justify-between gap-2 px-4 py-3 w-full md:w-52 bg-white/90 rounded-xl border border-slate-200/70 cursor-pointer hover:bg-white transition-colors">
                  <div className="flex items-center gap-2 truncate">
                    <span className="material-symbols-outlined text-brand-pink text-[20px] shrink-0">location_on</span>
                    <span className="text-xs font-semibold text-brand-navy truncate">Mumbai, MH</span>
                  </div>
                  <span className="material-symbols-outlined text-brand-slate text-[18px]">expand_more</span>
                </div>

                {/* High Impact Aurora CTA Button */}
                <button
                  type="submit"
                  className="w-full md:w-auto px-7 py-3 rounded-xl aurora-btn-primary text-white font-display font-bold text-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  <span>Search Pros</span>
                </button>
              </form>

              {/* Popular Search Tags with Subtle Glass Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-brand-slate font-bold uppercase tracking-wider text-[11px] mr-1">Popular:</span>
                <Link
                  to="/professionals?category=electrical"
                  className="px-3 py-1 rounded-full bg-white/80 hover:bg-white border border-purple-100 text-brand-navy font-medium shadow-sm transition-all hover:scale-105"
                >
                  ⚡ Electrician
                </Link>
                <Link
                  to="/professionals?category=cleaning"
                  className="px-3 py-1 rounded-full bg-white/80 hover:bg-white border border-pink-100 text-brand-navy font-medium shadow-sm transition-all hover:scale-105"
                >
                  ✨ Deep Cleaning
                </Link>
                <Link
                  to="/professionals?category=appliances"
                  className="px-3 py-1 rounded-full bg-white/80 hover:bg-white border border-cyan-100 text-brand-navy font-medium shadow-sm transition-all hover:scale-105"
                >
                  ❄️ AC Repair
                </Link>
                <Link
                  to="/professionals?category=plumbing"
                  className="px-3 py-1 rounded-full bg-white/80 hover:bg-white border border-blue-100 text-brand-navy font-medium shadow-sm transition-all hover:scale-105"
                >
                  🔧 Plumber
                </Link>
                <Link
                  to="/professionals?category=carpentry"
                  className="px-3 py-1 rounded-full bg-white/80 hover:bg-white border border-amber-100 text-brand-navy font-medium shadow-sm transition-all hover:scale-105"
                >
                  🪵 Carpentry
                </Link>
              </div>
            </div>

            {/* Right Hero Visual with Flowing Aurora Ribbons & Floating Glass Cards */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              {/* Outer Aurora Glow Rings */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-brand-cyan/25 via-brand-pink/20 to-brand-purple/30 rounded-[36px] blur-2xl -z-10"></div>

              {/* Photo Container */}
              <div className="relative w-full max-w-[430px] aspect-[4/5] rounded-[32px] p-2 glass-surface border-white/90 shadow-glass-lg">
                <div className="w-full h-full rounded-[24px] overflow-hidden relative">
                  <img
                    alt="Friendly verified Indian service professional"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnuAok1XRwd5pMwkslUzhQzC8jPZBAEhfk2Xb6zBMai8SPKpJmMdiXl-iR6mQxe_KaCu7C94sxAgJw3tv9undMFiHDYAvyhhrk89TvfLHlU9mYaQ1CWnX7nloYODEpjlHQFOZwAYmCWd86-cKrG-v8UIcWxFvQULmU16ZIaLZpnixHvZ9n0yVFc7ZA4QzwYxchvHqzuxsjHxPDfRjJOgrYq6f_JtxZ-5e2pkc2KrngTIgml73U6OBRDw"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent"></div>
                </div>
              </div>

              {/* Top-Right Floating Impact Glass Card (Branding: Kaarya Impact) */}
              <div className="absolute -top-4 -right-2 md:top-4 md:-right-4 glass-surface rounded-2xl p-3.5 shadow-glass-lg max-w-[210px] transform hover:-translate-y-1 transition-transform border border-white">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-pink to-brand-purple text-white flex items-center justify-center text-xs shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-purple">Kaarya Impact</span>
                </div>
                <p className="font-display font-bold text-xs text-brand-navy leading-snug">
                  Skilled People.<br />Stronger Homes.
                </p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-pink via-brand-purple to-brand-blue w-4/5 rounded-full"></div>
                </div>
              </div>

              {/* Bottom-Left Floating Verified Glass Pill */}
              <div className="absolute -bottom-5 -left-2 md:bottom-4 md:-left-6 glass-surface rounded-2xl p-3.5 shadow-glass-lg flex items-center gap-3 transform hover:-translate-y-1 transition-transform border border-white">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-cyan to-brand-blue flex items-center justify-center text-white shadow-aurora-glow-sm shrink-0">
                  <span
                    className="material-symbols-outlined text-[24px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-xs text-brand-navy leading-tight">100% Background Verified</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="flex text-amber-400">
                      <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                    <span className="font-bold text-xs text-brand-navy">4.9</span>
                    <span className="text-[11px] text-brand-slate">(3.8k)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICE CATEGORIES SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-purple mb-1">
                <span className="material-symbols-outlined text-[16px]">widgets</span>
                <span>Hyperlocal Catalog</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-navy tracking-tight">
                Popular Home Services
              </h2>
              <p className="text-sm text-brand-slate mt-1">Direct dispatch with upfront guaranteed rates, no hidden fees</p>
            </div>
            <Link
              to="/professionals"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200/80 text-brand-navy text-xs font-bold shadow-sm transition-all hover:scale-105 shrink-0 self-start sm:self-auto"
            >
              <span>Explore 40+ Services</span>
              <span className="material-symbols-outlined text-[16px] text-brand-purple">arrow_forward</span>
            </Link>
          </div>

          {/* 8 Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
            {/* 1: Plumbing */}
            <Link
              to="/professionals?category=plumbing"
              className="group glass-surface p-4 rounded-2xl aurora-card-hover flex flex-col items-center text-center"
            >
              <div className="w-13 h-13 p-3 rounded-2xl bg-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-cyan-100/80 transition-all shadow-sm">
                <span className="material-symbols-outlined text-[26px]">plumbing</span>
              </div>
              <span className="font-display font-bold text-xs text-brand-navy mb-0.5">Plumbing</span>
              <span className="text-[11px] text-brand-slate">From ₹199</span>
              <span className="mt-2 text-[9px] uppercase font-extrabold tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md">Book in 2m</span>
            </Link>

            {/* 2: Electrical */}
            <Link
              to="/professionals?category=electrical"
              className="group glass-surface p-4 rounded-2xl aurora-card-hover flex flex-col items-center text-center"
            >
              <div className="w-13 h-13 p-3 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-amber-100/80 transition-all shadow-sm">
                <span className="material-symbols-outlined text-[26px]">bolt</span>
              </div>
              <span className="font-display font-bold text-xs text-brand-navy mb-0.5">Electrical</span>
              <span className="text-[11px] text-brand-slate">From ₹149</span>
              <span className="mt-2 text-[9px] uppercase font-extrabold tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">Book in 2m</span>
            </Link>

            {/* 3: Cleaning */}
            <Link
              to="/professionals?category=cleaning"
              className="group glass-surface p-4 rounded-2xl aurora-card-hover flex flex-col items-center text-center"
            >
              <div className="w-13 h-13 p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-emerald-100/80 transition-all shadow-sm">
                <span className="material-symbols-outlined text-[26px]">cleaning_services</span>
              </div>
              <span className="font-display font-bold text-xs text-brand-navy mb-0.5">Cleaning</span>
              <span className="text-[11px] text-brand-slate">From ₹399</span>
              <span className="mt-2 text-[9px] uppercase font-extrabold tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Book in 2m</span>
            </Link>

            {/* 4: Painting */}
            <Link
              to="/professionals?category=painting"
              className="group glass-surface p-4 rounded-2xl aurora-card-hover flex flex-col items-center text-center"
            >
              <div className="w-13 h-13 p-3 rounded-2xl bg-pink-50 border border-pink-100 text-pink-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-pink-100/80 transition-all shadow-sm">
                <span className="material-symbols-outlined text-[26px]">format_paint</span>
              </div>
              <span className="font-display font-bold text-xs text-brand-navy mb-0.5">Painting</span>
              <span className="text-[11px] text-brand-slate">From ₹499</span>
              <span className="mt-2 text-[9px] uppercase font-extrabold tracking-wider text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md">Book in 2m</span>
            </Link>

            {/* 5: Carpentry */}
            <Link
              to="/professionals?category=carpentry"
              className="group glass-surface p-4 rounded-2xl aurora-card-hover flex flex-col items-center text-center"
            >
              <div className="w-13 h-13 p-3 rounded-2xl bg-orange-50 border border-orange-100 text-orange-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-orange-100/80 transition-all shadow-sm">
                <span className="material-symbols-outlined text-[26px]">carpenter</span>
              </div>
              <span className="font-display font-bold text-xs text-brand-navy mb-0.5">Carpentry</span>
              <span className="text-[11px] text-brand-slate">From ₹249</span>
              <span className="mt-2 text-[9px] uppercase font-extrabold tracking-wider text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md">Book in 2m</span>
            </Link>

            {/* 6: Appliances */}
            <Link
              to="/professionals?category=appliances"
              className="group glass-surface p-4 rounded-2xl aurora-card-hover flex flex-col items-center text-center"
            >
              <div className="w-13 h-13 p-3 rounded-2xl bg-purple-50 border border-purple-100 text-brand-purple flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-purple-100/80 transition-all shadow-sm">
                <span className="material-symbols-outlined text-[26px]">home_repair_service</span>
              </div>
              <span className="font-display font-bold text-xs text-brand-navy mb-0.5">Appliances</span>
              <span className="text-[11px] text-brand-slate">From ₹299</span>
              <span className="mt-2 text-[9px] uppercase font-extrabold tracking-wider text-brand-purple bg-purple-50 px-2 py-0.5 rounded-md">Book in 2m</span>
            </Link>

            {/* 7: Moving */}
            <Link
              to="/professionals?category=moving"
              className="group glass-surface p-4 rounded-2xl aurora-card-hover flex flex-col items-center text-center"
            >
              <div className="w-13 h-13 p-3 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-blue-100/80 transition-all shadow-sm">
                <span className="material-symbols-outlined text-[26px]">local_shipping</span>
              </div>
              <span className="font-display font-bold text-xs text-brand-navy mb-0.5">Moving</span>
              <span className="text-[11px] text-brand-slate">From ₹799</span>
              <span className="mt-2 text-[9px] uppercase font-extrabold tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">Book in 2m</span>
            </Link>

            {/* 8: More */}
            <Link
              to="/professionals"
              className="group glass-surface p-4 rounded-2xl aurora-card-hover flex flex-col items-center text-center"
            >
              <div className="w-13 h-13 p-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-slate-200 transition-all shadow-sm">
                <span className="material-symbols-outlined text-[26px]">grid_view</span>
              </div>
              <span className="font-display font-bold text-xs text-brand-navy mb-0.5">More</span>
              <span className="text-[11px] text-brand-slate">30+ Tasks</span>
              <span className="mt-2 text-[9px] uppercase font-extrabold tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">See All</span>
            </Link>
          </div>
        </section>

        {/* PLATFORM STATISTICS STRIP */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
          <div className="glass-surface-accent rounded-3xl p-6 lg:p-8 shadow-glass-lg relative overflow-hidden">
            {/* Aurora inner shimmer gradient line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-pink via-brand-purple to-brand-cyan"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 lg:divide-x divide-purple-100">
              {/* Stat 1 */}
              <div className="flex items-center gap-4 pt-3 sm:pt-0 lg:px-4 first:pl-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500/10 to-brand-pink/20 border border-pink-200/50 flex items-center justify-center text-brand-pink shrink-0">
                  <span
                    className="material-symbols-outlined text-[30px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    shield_with_heart
                  </span>
                </div>
                <div>
                  <div className="font-display font-extrabold text-3xl bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent">
                    5,200+
                  </div>
                  <p className="font-display font-bold text-xs text-brand-navy">Verified Professionals</p>
                  <p className="text-[11px] text-brand-slate">KYC &amp; trade-skill assessed</p>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center gap-4 pt-3 sm:pt-0 lg:px-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500/10 to-brand-purple/20 border border-purple-200/50 flex items-center justify-center text-brand-purple shrink-0">
                  <span
                    className="material-symbols-outlined text-[30px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    task_alt
                  </span>
                </div>
                <div>
                  <div className="font-display font-extrabold text-3xl bg-gradient-to-r from-brand-purple to-brand-blue bg-clip-text text-transparent">
                    25,400+
                  </div>
                  <p className="font-display font-bold text-xs text-brand-navy">Jobs Completed</p>
                  <p className="text-[11px] text-brand-slate">98.2% on-time resolution</p>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center gap-4 pt-3 sm:pt-0 lg:px-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/10 to-amber-500/20 border border-amber-200/50 flex items-center justify-center text-amber-500 shrink-0">
                  <span
                    className="material-symbols-outlined text-[30px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                </div>
                <div>
                  <div className="font-display font-extrabold text-3xl bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                    4.8 ★
                  </div>
                  <p className="font-display font-bold text-xs text-brand-navy">Average Satisfaction</p>
                  <p className="text-[11px] text-brand-slate">From 12,000+ customer reviews</p>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="flex items-center gap-4 pt-3 sm:pt-0 lg:px-4 last:pr-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500/10 to-brand-cyan/20 border border-blue-200/50 flex items-center justify-center text-brand-blue shrink-0">
                  <span
                    className="material-symbols-outlined text-[30px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    category
                  </span>
                </div>
                <div>
                  <div className="font-display font-extrabold text-3xl bg-gradient-to-r from-brand-blue to-cyan-500 bg-clip-text text-transparent">
                    40+
                  </div>
                  <p className="font-display font-bold text-xs text-brand-navy">Service Categories</p>
                  <p className="text-[11px] text-brand-slate">Hyperlocal dispatch coverage</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED PROFESSIONALS (MEET YOUR LOCAL PROFESSIONALS) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full" id="find-professionals">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-pink mb-1">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
                <span>Handpicked &amp; Verified</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-navy tracking-tight">
                Meet Your Local Professionals
              </h2>
              <p className="text-sm text-brand-slate mt-1">Skilled hands. Trusted service. Fair prices.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-brand-slate hover:text-brand-navy flex items-center justify-center shadow-sm hover:scale-105 transition-all"
                aria-label="Previous professionals"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button
                type="button"
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-brand-slate hover:text-brand-navy flex items-center justify-center shadow-sm hover:scale-105 transition-all"
                aria-label="Next professionals"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* 4-Column Professional Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Professional 1: Rahul Sharma */}
            <div
              className="glass-surface rounded-3xl p-5 aurora-card-hover border border-white flex flex-col justify-between group cursor-pointer"
              onClick={() => handleOpenWorkerModal('w-rahul')}
            >
              <div>
                {/* Image & Favorite Bar */}
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-slate-100">
                  <img
                    alt="Rahul Sharma - Master Plumber"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlbRYfHi9XgeNfs8mtifR3Nuv7-wjidY2BjRzzIpIX4-WF20STXry8qvgnVGQ9C6Y1XORpMJycHYqVTGhDgumhIdvT3XMpWXHBH6DS4YZl02JTGh9mMUHFJZoaM7N-jExSciHxO2VoGQx1OhS63189qi88usKe_0BcwDMrIfRlK9zy42mBcR9p3Xr3kwzt_nDk7BpyInK7kIHQJ5s74eu5e61Eb4x1nOBliENL2OUt"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite('w-rahul', e)}
                    aria-label="Favorite Rahul Sharma"
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm transition-colors z-10 ${
                      favorites['w-rahul'] ? 'text-brand-pink' : 'text-slate-400 hover:text-brand-pink'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: favorites['w-rahul'] ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      favorite
                    </span>
                  </button>
                  <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    <span>Available Today</span>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-display font-extrabold text-base text-brand-navy leading-snug group-hover:text-primary transition-colors">
                      Rahul Sharma
                    </h3>
                    <p className="text-xs text-brand-slate font-medium">Master Plumber · 8 yrs exp</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100 shrink-0">
                    <span className="material-symbols-outlined text-[14px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-xs font-bold text-brand-navy">4.9</span>
                  </div>
                </div>

                {/* Quick Job Stats */}
                <p className="text-[11px] text-brand-slate mb-3">
                  <strong className="text-brand-navy font-semibold">340+ jobs</strong> completed in Andheri West
                </p>

                {/* Verification Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-50 border border-cyan-100 text-cyan-800 text-[10px] font-semibold">
                    <span className="material-symbols-outlined text-[12px] text-cyan-600">badge</span>
                    Identity Checked
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 border border-purple-100 text-purple-800 text-[10px] font-semibold">
                    <span className="material-symbols-outlined text-[12px] text-brand-purple">verified</span>
                    Skill Verified
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-pink-50 border border-pink-100 text-pink-700 text-[10px] font-semibold">
                    Top Rated
                  </span>
                </div>
              </div>

              {/* Price & Action CTA */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-brand-slate uppercase font-bold tracking-wider">Rate</span>
                  <p className="font-display font-extrabold text-base text-brand-navy">
                    ₹249<span className="text-xs font-normal text-brand-slate">/hr</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleOpenWorkerModal('w-rahul', e)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-xs font-bold text-brand-navy group-hover:bg-gradient-to-r group-hover:from-brand-pink group-hover:to-brand-purple group-hover:text-white group-hover:border-transparent transition-all shadow-sm cursor-pointer"
                >
                  View Profile
                </button>
              </div>
            </div>

            {/* Professional 2: Priya Nair */}
            <div
              className="glass-surface rounded-3xl p-5 aurora-card-hover border border-white flex flex-col justify-between group cursor-pointer"
              onClick={() => handleOpenWorkerModal('w-priya')}
            >
              <div>
                {/* Image & Favorite Bar */}
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-slate-100">
                  <img
                    alt="Priya Nair - Deep Cleaning Specialist"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDajyQlKbFX4ShLZNLp8Bqw0RdgzwEEjtj1g0dzbCJ2RePzNDVriD6OCd_eetb3zbBpDjsZSRj6JBgcPMSZBFYQTWo6YwJ0QfMrZ-uERikq4jcVcT40_T3DtAnJETHVLWWiQK_3HsaUqBN5HKJeEut7F-iAkRCCFdTtWep1h0GI0-GpK1dYWmHVsR12U-ZpqW0xMOLITcsb6K3-tNqSNaO_JReHxibQzb8P7KrBjjcr"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite('w-priya', e)}
                    aria-label="Favorite Priya Nair"
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm transition-colors z-10 ${
                      favorites['w-priya'] ? 'text-brand-pink' : 'text-slate-400 hover:text-brand-pink'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: favorites['w-priya'] ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      favorite
                    </span>
                  </button>
                  <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">schedule</span>
                    <span>Book in 2h</span>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-display font-extrabold text-base text-brand-navy leading-snug group-hover:text-primary transition-colors">
                      Priya Nair
                    </h3>
                    <p className="text-xs text-brand-slate font-medium">Deep Cleaning · Eco-Friendly</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100 shrink-0">
                    <span className="material-symbols-outlined text-[14px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-xs font-bold text-brand-navy">4.95</span>
                  </div>
                </div>

                {/* Quick Job Stats */}
                <p className="text-[11px] text-brand-slate mb-3">
                  <strong className="text-brand-navy font-semibold">520+ jobs</strong> completed in Bandra / Khar
                </p>

                {/* Verification Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-50 border border-cyan-100 text-cyan-800 text-[10px] font-semibold">
                    <span className="material-symbols-outlined text-[12px] text-cyan-600">verified_user</span>
                    Background Checked
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 border border-purple-100 text-purple-800 text-[10px] font-semibold">
                    <span className="material-symbols-outlined text-[12px] text-brand-purple">verified</span>
                    Skill Verified
                  </span>
                </div>
              </div>

              {/* Price & Action CTA */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-brand-slate uppercase font-bold tracking-wider">Rate</span>
                  <p className="font-display font-extrabold text-base text-brand-navy">
                    ₹399<span className="text-xs font-normal text-brand-slate">/room</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleOpenWorkerModal('w-priya', e)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-xs font-bold text-brand-navy group-hover:bg-gradient-to-r group-hover:from-brand-pink group-hover:to-brand-purple group-hover:text-white group-hover:border-transparent transition-all shadow-sm cursor-pointer"
                >
                  View Profile
                </button>
              </div>
            </div>

            {/* Professional 3: Amit Kumar */}
            <div
              className="glass-surface rounded-3xl p-5 aurora-card-hover border border-white flex flex-col justify-between group cursor-pointer"
              onClick={() => handleOpenWorkerModal('w-amit')}
            >
              <div>
                {/* Image & Favorite Bar */}
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-slate-100">
                  <img
                    alt="Amit Kumar - Certified Electrician"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1upnGAWTDnUmmQgu9Amt1V3i6gKBC-48YqcM01VH6Lm1WOS5BeLUp9HmTn-5dikHCp9PnXYw2p_vhIyjauaLdAjK8txOr6i1H1sqfLrACuYKOTbvWKIkG-S7b1p7O8vsRMowgMlsH6XFuqjItP-8f4WsG6iJZ4gsdwHIwdG8np_SED-RwSHTJZpS-MszknwOoupmYLsUsNUqQ3PwUZydNZFh38JBZ9FidH7rv5ego"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite('w-amit', e)}
                    aria-label="Favorite Amit Kumar"
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm transition-colors z-10 ${
                      favorites['w-amit'] ? 'text-brand-pink' : 'text-slate-400 hover:text-brand-pink'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: favorites['w-amit'] ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      favorite
                    </span>
                  </button>
                  <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    <span>Available Today</span>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-display font-extrabold text-base text-brand-navy leading-snug group-hover:text-primary transition-colors">
                      Amit Kumar
                    </h3>
                    <p className="text-xs text-brand-slate font-medium">Certified Electrician · Wiring &amp; MCB</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100 shrink-0">
                    <span className="material-symbols-outlined text-[14px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-xs font-bold text-brand-navy">4.85</span>
                  </div>
                </div>

                {/* Quick Job Stats */}
                <p className="text-[11px] text-brand-slate mb-3">
                  <strong className="text-brand-navy font-semibold">280+ jobs</strong> completed in Dadar / Matunga
                </p>

                {/* Verification Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-50 border border-cyan-100 text-cyan-800 text-[10px] font-semibold">
                    <span className="material-symbols-outlined text-[12px] text-cyan-600">badge</span>
                    Identity Checked
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-blue-800 text-[10px] font-semibold">
                    <span className="material-symbols-outlined text-[12px] text-blue-600">history_edu</span>
                    Work History Verified
                  </span>
                </div>
              </div>

              {/* Price & Action CTA */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-brand-slate uppercase font-bold tracking-wider">Rate</span>
                  <p className="font-display font-extrabold text-base text-brand-navy">
                    ₹199<span className="text-xs font-normal text-brand-slate">/hr</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleOpenWorkerModal('w-amit', e)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-xs font-bold text-brand-navy group-hover:bg-gradient-to-r group-hover:from-brand-pink group-hover:to-brand-purple group-hover:text-white group-hover:border-transparent transition-all shadow-sm cursor-pointer"
                >
                  View Profile
                </button>
              </div>
            </div>

            {/* Professional 4: Vikram Patel */}
            <div
              className="glass-surface rounded-3xl p-5 aurora-card-hover border border-white flex flex-col justify-between group cursor-pointer"
              onClick={() => handleOpenWorkerModal('w-vikram')}
            >
              <div>
                {/* Image & Favorite Bar */}
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-slate-100">
                  <img
                    alt="Vikram Patel - Senior Carpenter"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv62E6e7bYIm7rdnq644vq2NKtf5a4aIjrka0K14U1B7gq8t6E0-k4ltJmBdiAe6V12RiHFKQESgeu623tHYO2kTErWxhGBKlqXCT2dT0PgiU4cUWISts_ba3xaF_ZbAiMvjX4LJte7Yq72CDqCFiiTaOEukfbbnv7hiC6I4suznmjyR4fFVrpyPuGWZkqs104sK9JYBncawGP3M9LOGXpPgSWsrCcWekK69QCuxGN"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite('w-vikram', e)}
                    aria-label="Favorite Vikram Patel"
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm transition-colors z-10 ${
                      favorites['w-vikram'] ? 'text-brand-pink' : 'text-slate-400 hover:text-brand-pink'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: favorites['w-vikram'] ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      favorite
                    </span>
                  </button>
                  <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-brand-pink to-brand-purple text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[12px]">local_fire_department</span>
                    <span>New Talent</span>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-display font-extrabold text-base text-brand-navy leading-snug group-hover:text-primary transition-colors">
                      Vikram Patel
                    </h3>
                    <p className="text-xs text-brand-slate font-medium">Senior Carpenter · Custom Furniture</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100 shrink-0">
                    <span className="material-symbols-outlined text-[14px] text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-xs font-bold text-brand-navy">4.90</span>
                  </div>
                </div>

                {/* Quick Job Stats */}
                <p className="text-[11px] text-brand-slate mb-3">
                  <strong className="text-brand-navy font-semibold">190+ jobs</strong> completed in Thane &amp; Mulund
                </p>

                {/* Verification Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 border border-purple-100 text-purple-800 text-[10px] font-semibold">
                    <span className="material-symbols-outlined text-[12px] text-brand-purple">verified</span>
                    Skill Verified
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 text-[10px] font-bold">
                    ⭐ Rising Star
                  </span>
                </div>
              </div>

              {/* Price & Action CTA */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-brand-slate uppercase font-bold tracking-wider">Rate</span>
                  <p className="font-display font-extrabold text-base text-brand-navy">
                    ₹299<span className="text-xs font-normal text-brand-slate">/hr</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleOpenWorkerModal('w-vikram', e)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-xs font-bold text-brand-navy group-hover:bg-gradient-to-r group-hover:from-brand-pink group-hover:to-brand-purple group-hover:text-white group-hover:border-transparent transition-all shadow-sm cursor-pointer"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* HOW KAARYA WORKS WORKFLOW SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full" id="how-it-works">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-blue mb-1">
              <span className="material-symbols-outlined text-[16px]">touch_app</span>
              <span>Simple, Transparent &amp; Safe</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-navy tracking-tight">
              How Kaarya Works
            </h2>
            <p className="text-sm text-brand-slate mt-2">
              From quick task posting to guaranteed satisfaction in four clear steps
            </p>
          </div>

          {/* 4-Step Interactive Aurora Flow */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Step 1 */}
            <Link
              to="/post-job"
              className="glass-surface rounded-3xl p-6 aurora-card-hover border border-white relative flex flex-col items-start group"
            >
              <span className="font-display font-black text-4xl text-purple-200/70 absolute top-4 right-5">01</span>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-pink to-brand-purple text-white flex items-center justify-center mb-5 shadow-aurora-glow-sm">
                <span className="material-symbols-outlined text-[24px]">edit_document</span>
              </div>
              <h3 className="font-display font-extrabold text-lg text-brand-navy mb-1.5 group-hover:text-brand-purple transition-colors">Post a Job</h3>
              <p className="text-xs text-brand-slate leading-relaxed">
                Describe your task, specify your timing, and set your target budget in under 60 seconds.
              </p>
            </Link>

            {/* Step 2 */}
            <div className="glass-surface rounded-3xl p-6 aurora-card-hover border border-white relative flex flex-col items-start">
              <span className="font-display font-black text-4xl text-purple-200/70 absolute top-4 right-5">02</span>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-blue text-white flex items-center justify-center mb-5 shadow-aurora-glow-sm">
                <span className="material-symbols-outlined text-[24px]">connect_without_contact</span>
              </div>
              <h3 className="font-display font-extrabold text-lg text-brand-navy mb-1.5">Get Matched</h3>
              <p className="text-xs text-brand-slate leading-relaxed">
                Receive upfront bids and availability confirmations from KYC-verified local professionals.
              </p>
            </div>

            {/* Step 3 */}
            <Link
              to="/compare-offers"
              className="glass-surface rounded-3xl p-6 aurora-card-hover border border-white relative flex flex-col items-start group"
            >
              <span className="font-display font-black text-4xl text-purple-200/70 absolute top-4 right-5">03</span>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-cyan text-white flex items-center justify-center mb-5 shadow-aurora-glow-sm">
                <span className="material-symbols-outlined text-[24px]">compare_arrows</span>
              </div>
              <h3 className="font-display font-extrabold text-lg text-brand-navy mb-1.5 group-hover:text-brand-purple transition-colors">Compare &amp; Choose</h3>
              <p className="text-xs text-brand-slate leading-relaxed">
                Review past customer ratings, verified trade badges, distance, and fair hourly rates.
              </p>
            </Link>

            {/* Step 4 */}
            <div className="glass-surface rounded-3xl p-6 aurora-card-hover border border-white relative flex flex-col items-start">
              <span className="font-display font-black text-4xl text-purple-200/70 absolute top-4 right-5">04</span>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mb-5 shadow-aurora-glow-sm">
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  task_alt
                </span>
              </div>
              <h3 className="font-display font-extrabold text-lg text-brand-navy mb-1.5">Get It Done</h3>
              <p className="text-xs text-brand-slate leading-relaxed">
                Track live dispatch, release payment upon satisfaction, and build your trusted local circle.
              </p>
            </div>
          </div>

          {/* WORKER REGISTRATION PROMOTION GLASS CARD (Branding: Kaarya) */}
          <div className="relative rounded-3xl p-8 lg:p-10 glass-surface-accent border border-purple-200/60 shadow-glass-lg overflow-hidden" id="for-workers">
            <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-gradient-to-tr from-brand-pink/20 to-brand-purple/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-brand-purple font-bold text-xs mb-3">
                  <span className="material-symbols-outlined text-[14px]">handshake</span>
                  <span>Worker Empowerment Initiative</span>
                </div>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-navy tracking-tight mb-2">
                  Are you a skilled technician or craftsperson?
                </h3>
                <p className="text-sm text-brand-slate leading-relaxed">
                  Join Kaarya with zero initial commission. Get direct neighborhood job requests, build a verified digital reputation, and receive guaranteed on-time bank payments.
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-semibold text-brand-navy">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Keep 100% of direct tips
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Free accidental insurance
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Work on your schedule
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to="/worker-dashboard"
                  className="px-6 py-3.5 rounded-xl aurora-btn-primary text-white font-display font-bold text-sm shadow-aurora-glow flex items-center gap-2 hover:opacity-95 transition-opacity"
                >
                  <span>Join as a Worker</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE HYPERLOCAL ACTIVE BANNER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
          <div className="relative glass-surface rounded-3xl p-6 sm:p-8 shadow-glass border border-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-pink to-brand-purple text-white shrink-0 shadow-aurora-glow-sm">
                <span className="material-symbols-outlined text-[24px]">radar</span>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-2xl bg-brand-pink opacity-30"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-extrabold text-base sm:text-lg text-brand-navy">
                    38 Pros active near Mumbai Central right now
                  </h3>
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm animate-pulse"></span>
                </div>
                <p className="text-xs text-brand-slate mt-0.5">
                  Instant dispatch ready for emergency plumbing, circuit breaks, and urgent lock repairs.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
              <Link
                to="/professionals"
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-brand-navy text-xs font-bold shadow-sm transition-all hover:scale-105 text-center"
              >
                View Active Map
              </Link>
              <Link
                to="/post-job"
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl aurora-btn-primary text-white text-xs font-bold shadow-aurora-glow transition-all text-center"
              >
                Book Urgent Pro
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* POLISHED AURORA GLASS FOOTER */}
      <footer className="w-full glass-surface border-t border-slate-200/80 py-12 relative z-10" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200/60">
            {/* Brand Signature */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-pink via-brand-purple to-brand-blue p-[1.5px] shadow-sm">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-purple text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    auto_awesome
                  </span>
                </div>
              </div>
              <div>
                <span className="font-display font-extrabold text-lg text-brand-navy tracking-tight">
                  Kaar<span className="bg-gradient-to-r from-brand-pink via-brand-purple to-brand-blue bg-clip-text text-transparent">ya</span>
                </span>
                <p className="text-[11px] text-brand-slate">Empowering hyperlocal verified trade micro-entrepreneurs.</p>
              </div>
            </div>

            {/* Trust Guarantees */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-brand-slate">
              <span className="flex items-center gap-1 text-slate-700">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                100% Aadhaar &amp; Skill Verified
              </span>
              <span className="flex items-center gap-1 text-slate-700">
                <span className="material-symbols-outlined text-[16px] text-brand-blue">lock</span>
                Secure Escrow Payments
              </span>
              <span className="flex items-center gap-1 text-slate-700">
                <span className="material-symbols-outlined text-[16px] text-brand-pink">support_agent</span>
                24/7 Citizen Support
              </span>
            </div>
          </div>

          {/* Bottom Meta & Legal Links */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-brand-slate">
            <p>© 2025 Kaarya Technologies Private Limited. All rights reserved.</p>
            <div className="flex items-center gap-6 font-medium">
              <a className="hover:text-brand-purple transition-colors" href="#about">Privacy Policy</a>
              <a className="hover:text-brand-purple transition-colors" href="#about">Terms of Service</a>
              <a className="hover:text-brand-purple transition-colors" href="#about">Safety Standards</a>
              <a className="hover:text-brand-purple transition-colors" href="#about">Worker Welfare Charter</a>
            </div>
          </div>
        </div>
      </footer>

      {/* WORKER FULL PROFILE MODAL OVERLAY */}
      <WorkerProfileModal
        worker={activeModalWorker}
        isOpen={Boolean(activeModalWorker)}
        onClose={() => setActiveModalWorker(null)}
        selectedSlot={selectedTimeSlot}
        onSelectSlot={setSelectedTimeSlot}
      />
    </div>
  );
}

