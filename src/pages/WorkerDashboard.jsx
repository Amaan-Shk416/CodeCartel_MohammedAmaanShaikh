import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const INITIAL_SCHEDULE = [
  {
    id: 'SCH-01',
    time: '10:00 AM',
    title: 'Leak Repair',
    urgency: 'Urgent',
    customer: 'Ananya Shah',
    customerRole: 'Apartment Resident',
    customerPhone: '+91 98201 11223',
    price: 650,
    status: 'Confirmed',
    address: 'Flat 402, Sea Breeze Heights',
    area: 'Carter Road, Bandra West, Mumbai • 1.4 km away',
    travelTime: '8 min drive',
    directionsUrl: 'https://maps.google.com/?q=Carter+Road+Bandra+West+Mumbai',
    description: 'Main kitchen pipe coupling has a hairline crack and is dripping inside under-sink cabinet. Needs immediate seal replacement and pressure check.',
    tasks: ['Inspect pipe joint integrity', 'Replace damaged rubber seal & gasket', 'Pressure test under active flow'],
  },
  {
    id: 'SCH-02',
    time: '1:30 PM',
    title: 'Bathroom Fitting & Fix',
    urgency: null,
    customer: 'Vikram Mehta',
    customerRole: 'House Owner',
    customerPhone: '+91 98202 33445',
    price: 900,
    status: 'Upcoming',
    address: '14th Road, Near Rajesh Khanna Garden',
    area: 'Khar West, Mumbai • 2.8 km away',
    travelTime: 'After lunch',
    directionsUrl: 'https://maps.google.com/?q=14th+Road+Khar+West+Mumbai',
    description: 'Install replacement wall diverter and troubleshoot reduced water pressure in master bathroom shower.',
    tasks: ['Remove old wall diverter valve', 'Install new diverter cartridge', 'Clean scale from shower head nozzles'],
  },
];

const INITIAL_NEARBY_JOBS = [
  {
    id: 'JOB-NEAR-01',
    badge: 'Urgent • Kitchen Sink',
    badgeType: 'urgent',
    postedTime: 'Just now',
    title: 'Pipe Leak Repair',
    distance: '1.2 km away • Bandra West',
    description: 'Main sink coupling is leaking into cabinet. Needs replacement rubber gasket and pipe realignment immediately.',
    budgetRange: '₹500 – ₹800',
    defaultBid: 650,
    bidSubmitted: false,
    bidAmount: null,
  },
  {
    id: 'JOB-NEAR-02',
    badge: 'Scheduled • Tomorrow AM',
    badgeType: 'scheduled',
    postedTime: '12m ago',
    title: 'Bathroom Fitting',
    distance: '2.4 km away • Khar West',
    description: 'Installing 2 concealed cistern fixtures and Kohler chrome overhead shower kit. All parts provided by homeowner.',
    budgetRange: '₹800 – ₹1,200',
    defaultBid: 950,
    bidSubmitted: false,
    bidAmount: null,
  },
  {
    id: 'JOB-NEAR-03',
    badge: 'Quick Fix',
    badgeType: 'quick',
    postedTime: '35m ago',
    title: 'Tap Replacement',
    distance: '3.1 km away • Santacruz',
    description: 'Need replacement of 2 washbasin mixer taps. New brass taps are already purchased and unboxed.',
    budgetRange: '₹250 – ₹450',
    defaultBid: 350,
    bidSubmitted: false,
    bidAmount: null,
  },
];

const WEEKLY_DATA = [
  { day: 'M', label: 'Mon', amount: '₹1,200', heightPercent: 40, isPeak: false },
  { day: 'T', label: 'Tue', amount: '₹1,850', heightPercent: 55, isPeak: false },
  { day: 'W', label: 'Wed', amount: '₹2,400', heightPercent: 70, isPeak: false },
  { day: 'T', label: 'Thu', amount: '₹1,600', heightPercent: 50, isPeak: false },
  { day: 'F', label: 'Fri', amount: '₹3,100', heightPercent: 92, isPeak: true },
  { day: 'S', label: 'Sat', amount: '₹2,900', heightPercent: 82, isPeak: false },
  { day: 'S', label: 'Sun', amount: '₹1,550', heightPercent: 45, isPeak: false },
];

export default function WorkerDashboard() {
  // Availability toggle state
  const [isAvailable, setIsAvailable] = useState(() => {
    try {
      return window.localStorage.getItem('kaarya_worker_available') !== 'false';
    } catch {
      return true;
    }
  });

  // Schedule list & job modal state
  const [scheduleList, setScheduleList] = useState(INITIAL_SCHEDULE);
  const [selectedScheduleJob, setSelectedScheduleJob] = useState(null);

  // Nearby opportunities state & bid modal
  const [nearbyJobs, setNearbyJobs] = useState(INITIAL_NEARBY_JOBS);
  const [biddingJob, setBiddingJob] = useState(null);
  const [bidPrice, setBidPrice] = useState(650);
  const [bidNote, setBidNote] = useState('');

  // Weekly earnings chart interactive day
  const [hoveredDay, setHoveredDay] = useState('F');

  // Interactive dialogs
  const [showSkillProfile, setShowSkillProfile] = useState(false);
  const [showEarningsModal, setShowEarningsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    window.clearTimeout(window.__kaarya_toast_timeout);
    window.__kaarya_toast_timeout = window.setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleToggleAvailability = () => {
    const nextState = !isAvailable;
    setIsAvailable(nextState);
    try {
      window.localStorage.setItem('kaarya_worker_available', nextState.toString());
    } catch {
      // safe fallback
    }
    showToast(nextState ? 'Status set to: Available for Work (Online)' : 'Status set to: Offline / In Job');
  };

  const handleOpenBidModal = (job) => {
    setBiddingJob(job);
    setBidPrice(job.defaultBid);
    setBidNote('I have specialized plumbing tools and can arrive in under 30 minutes.');
  };

  const handleSubmitBid = (e) => {
    e.preventDefault();
    if (!biddingJob) return;

    setNearbyJobs((prev) =>
      prev.map((item) =>
        item.id === biddingJob.id
          ? { ...item, bidSubmitted: true, bidAmount: Number(bidPrice) }
          : item
      )
    );

    showToast(`Bid of ₹${bidPrice} submitted for "${biddingJob.title}"!`);
    setBiddingJob(null);
  };

  const handleUpdateJobStatus = (jobId, newStatus) => {
    setScheduleList((prev) =>
      prev.map((item) => (item.id === jobId ? { ...item, status: newStatus } : item))
    );
    if (selectedScheduleJob && selectedScheduleJob.id === jobId) {
      setSelectedScheduleJob((prev) => ({ ...prev, status: newStatus }));
    }
    showToast(`Job status updated to: ${newStatus}`);
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased relative min-h-screen selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* ATMOSPHERE: Background Glow Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary-fixed/30 blur-3xl" />
        <div className="absolute top-1/4 -right-40 w-[28rem] h-[28rem] rounded-full bg-secondary-fixed/35 blur-3xl" />
        <div className="absolute top-3/4 left-1/3 w-80 h-80 rounded-full bg-tertiary-fixed/25 blur-3xl" />
      </div>

      {/* 1. FIXED TOP HEADER WITH BRANDING & NAVIGATION */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
          {/* Logo & Location Pill */}
          <div className="flex items-center gap-6 sm:gap-10">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-container via-primary to-secondary flex items-center justify-center shadow-[0_4px_14px_rgba(225,29,116,0.25)] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-on-primary text-[22px]">handyman</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md text-on-surface tracking-tight leading-none font-bold">
                  Kaarya
                </span>
                <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase leading-none mt-1">
                  Where Skills Meet Opportunity
                </span>
              </div>
            </Link>

            <div className="hidden xl:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-lowest shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100">
              <span className="material-symbols-outlined text-secondary text-[18px]">location_on</span>
              <span className="font-label-md text-label-md text-on-surface font-medium">Mumbai, MH</span>
              <span className="material-symbols-outlined text-outline text-[16px]">keyboard_arrow_down</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className="px-3.5 py-1.5 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors rounded-full"
            >
              Home
            </Link>
            <Link
              to="/professionals"
              className="px-3.5 py-1.5 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors rounded-full"
            >
              Find Professionals
            </Link>
            <Link
              to="/my-bookings"
              className="px-3.5 py-1.5 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors rounded-full"
            >
              My Jobs
            </Link>
            <a
              href="/#how-it-works"
              className="px-3.5 py-1.5 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors rounded-full"
            >
              How It Works
            </a>
            <Link
              to="/worker-dashboard"
              aria-current="page"
              className="transition-colors bg-gradient-to-r from-primary-container to-secondary text-on-primary font-label-lg rounded-full px-4 py-1.5 shadow-[0_4px_14px_rgba(225,29,116,0.28)]"
            >
              For Workers
            </Link>
            <a
              href="/#about"
              className="px-3.5 py-1.5 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors rounded-full"
            >
              About
            </a>
          </nav>

          {/* Notifications & Worker Avatar */}
          <div className="flex items-center gap-3">
            <div className="flex xl:hidden items-center gap-1 px-2.5 py-1.5 rounded-full bg-surface-container-lowest shadow-[0_2px_6px_rgba(0,0,0,0.03)] border border-slate-100">
              <span className="material-symbols-outlined text-secondary text-[16px]">location_on</span>
              <span className="font-label-md text-label-md text-on-surface">Mumbai, MH</span>
            </div>

            <button
              type="button"
              onClick={() => showToast('You have 2 new job alerts around Bandra West.')}
              aria-label="Notifications"
              className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all relative shadow-[0_2px_6px_rgba(0,0,0,0.02)] border border-slate-100"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary-container ring-2 ring-surface-container-lowest" />
            </button>

            {/* Rahul Sharma Avatar Badge */}
            <button
              type="button"
              onClick={() => setShowSkillProfile(true)}
              className="flex items-center gap-2 pl-1 group text-left focus:outline-none"
              title="Click to view full Skill Profile"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-secondary to-tertiary flex items-center justify-center text-on-secondary font-label-md text-label-md shadow-[0_2px_8px_rgba(57,71,221,0.25)] group-hover:scale-105 transition-transform font-bold">
                RS
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="font-label-md text-label-md text-on-surface font-bold leading-tight group-hover:text-primary transition-colors">
                  Rahul Sharma
                </span>
                <span className="font-label-sm text-label-sm text-secondary leading-tight font-semibold">
                  Verified Pro
                </span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="relative z-10 w-full pt-20 bg-transparent min-h-[calc(100vh-140px)]">
        <div className="flex flex-col w-full">
          {/* DASHBOARD WRAPPER */}
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 sm:py-10 flex flex-col gap-8 sm:gap-10 relative">
            {/* A. DASHBOARD HEADER & PROFILE/AVAILABILITY CONTROLS */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
                    Good morning, Rahul!
                  </h1>
                  <span className="inline-flex items-center justify-center p-1 rounded-full bg-primary-fixed text-primary">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                  Ready for your next job? 3 scheduled tasks today around Bandra &amp; Khar.
                </p>
              </div>

              {/* AVAILABILITY & PROFILE CONTROLS */}
              <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between sm:justify-end">
                {/* Interactive Availability Pill */}
                <div
                  className="flex items-center gap-2.5 bg-surface-container-lowest px-4 py-2 rounded-full shadow-[0_4px_20px_-2px_rgba(99,102,241,0.06),0_2px_6px_-1px_rgba(0,0,0,0.03)] border border-slate-100 transition-all duration-300"
                  id="availability-widget"
                >
                  <span className="relative flex h-3 w-3">
                    {isAvailable && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75" />
                    )}
                    <span
                      className={`relative inline-flex rounded-full h-3 w-3 transition-colors ${
                        isAvailable ? 'bg-secondary' : 'bg-outline'
                      }`}
                    />
                  </span>
                  <span
                    className={`font-label-md text-label-md font-semibold select-none ${
                      isAvailable ? 'text-on-surface' : 'text-outline'
                    }`}
                  >
                    {isAvailable ? 'Available for Work' : 'Offline / In Job'}
                  </span>
                  <button
                    type="button"
                    onClick={handleToggleAvailability}
                    aria-label="Toggle active availability status"
                    aria-pressed={isAvailable}
                    className={`w-11 h-6 rounded-full p-0.5 transition-all duration-300 focus:outline-none shadow-sm flex items-center ${
                      isAvailable
                        ? 'bg-gradient-to-r from-primary-container via-primary to-secondary justify-end'
                        : 'bg-surface-container-highest justify-start'
                    }`}
                  >
                    <div className="w-5 h-5 bg-surface-container-lowest rounded-full shadow-md transform transition-transform duration-300" />
                  </button>
                </div>

                {/* Worker Portrait Avatar with Mini Trade Badge */}
                <div className="relative flex-shrink-0 cursor-pointer" onClick={() => setShowSkillProfile(true)}>
                  <img
                    className="w-12 h-12 rounded-full object-cover shadow-[0_4px_14px_rgba(57,71,221,0.2)] border-2 border-white"
                    alt="Rahul Sharma portrait"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkdTpMzpQatxBfFtKVUNEAq4BtfX63BE27XiFqqcQRmbK8S6-LXGBZJ6pXkBgrBmbFfxK0agHnoaKFXD1noebNv5eELooEQvUThwOYa_MX9g7CBtNBBUbtdTJl9mz4mE1G2kPhBmG38nQTtuKNF46IpZF0CLZeMiJ1EZgG4AIGN-cFgA3n4kh8cAkcSxSy1XAq3GSweknZMMjlyLEJ307MjVPBKXpyN-xiMFf-GNuTEO9RR1vtqetbmQ"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-tr from-primary to-secondary text-on-primary flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      plumbing
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* B. STATISTIC CARDS (4 horizontally aligned) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Today's Jobs */}
              <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_-2px_rgba(99,102,241,0.05),0_2px_6px_-1px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center justify-between group hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Today&apos;s Jobs
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display-hero text-[34px] leading-tight text-on-surface font-extrabold">3</span>
                    <span className="font-label-sm text-label-sm text-primary font-bold">2 Remaining</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary-fixed/50 text-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[24px]">calendar_today</span>
                </div>
              </div>

              {/* Card 2: This Month's Earnings */}
              <div
                onClick={() => setShowEarningsModal(true)}
                className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_-2px_rgba(99,102,241,0.05),0_2px_6px_-1px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center justify-between group hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    This Month&apos;s Earnings
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display-hero text-[34px] leading-tight text-on-surface font-extrabold">₹18,500</span>
                    <span className="font-label-sm text-label-sm text-secondary font-bold">↑ 18%</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-secondary-fixed/50 text-secondary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px]">account_balance_wallet</span>
                </div>
              </div>

              {/* Card 3: Completed Jobs */}
              <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_-2px_rgba(99,102,241,0.05),0_2px_6px_-1px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center justify-between group hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Completed Jobs
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display-hero text-[34px] leading-tight text-on-surface font-extrabold">42</span>
                    <span className="font-label-sm text-label-sm text-outline font-medium">Lifetime</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-tertiary-fixed/50 text-tertiary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    task_alt
                  </span>
                </div>
              </div>

              {/* Card 4: Customer Rating */}
              <div
                onClick={() => setShowSkillProfile(true)}
                className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_-2px_rgba(99,102,241,0.05),0_2px_6px_-1px_rgba(0,0,0,0.02)] border border-slate-100 flex items-center justify-between group hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Customer Rating
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display-hero text-[34px] leading-tight text-on-surface font-extrabold">4.8</span>
                    <span className="font-label-sm text-label-sm text-outline font-medium">(120 reviews)</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary-fixed/40 text-primary-container flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[26px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                </div>
              </div>
            </div>

            {/* C. PRIMARY SECTION: TODAY'S SCHEDULE */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                    Today&apos;s Schedule
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-sm font-label-sm font-bold">
                    May 24, 2025
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Showing all scheduled appointments for Rahul Sharma.')}
                  className="font-label-md text-label-md text-secondary hover:text-primary transition-colors flex items-center gap-1 font-semibold group"
                >
                  View All (3)
                  <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </button>
              </div>

              {/* Schedule Cards Container */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {scheduleList.map((job) => {
                  const isConfirmed = job.status === 'Confirmed';
                  return (
                    <div
                      key={job.id}
                      className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_4px_20px_-2px_rgba(99,102,241,0.06),0_2px_6px_-1px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:shadow-[0_12px_32px_-4px_rgba(59,73,223,0.08),0_4px_12px_-2px_rgba(225,29,116,0.04)]"
                    >
                      <div>
                        {/* Top Row: Time, Title, Customer & Price */}
                        <div className="flex items-start justify-between gap-2 pb-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`px-3 py-2 rounded-xl flex flex-col items-center justify-center shadow-sm ${
                                isConfirmed
                                  ? 'bg-primary-fixed text-on-primary-fixed-variant'
                                  : 'bg-secondary-fixed text-on-secondary-fixed'
                              }`}
                            >
                              <span className="font-label-sm text-[11px] font-bold uppercase tracking-wider">Starts</span>
                              <span className="font-headline-sm text-headline-sm font-extrabold leading-none mt-0.5">
                                {job.time}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5">
                                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                                  {job.title}
                                </span>
                                {job.urgency && (
                                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[10px] uppercase font-bold tracking-wider">
                                    {job.urgency}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 mt-1 text-on-surface-variant font-body-sm text-body-sm">
                                <span className="material-symbols-outlined text-[16px] text-outline">person</span>
                                <span className="font-semibold text-on-surface">{job.customer}</span>
                                <span className="text-outline">•</span>
                                <span className="text-on-surface-variant">{job.customerRole}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end">
                            <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                              ₹{job.price}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold mt-1 ${
                                isConfirmed
                                  ? 'bg-surface-container-high text-secondary'
                                  : 'bg-surface-container text-tertiary'
                              }`}
                            >
                              {job.status}
                            </span>
                          </div>
                        </div>

                        {/* Location Box */}
                        <div className="bg-surface-container-low rounded-xl p-3.5 my-2 flex items-center justify-between gap-2 border border-slate-100">
                          <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5 flex-shrink-0">
                              location_on
                            </span>
                            <div className="flex flex-col">
                              <span className="font-label-md text-label-md text-on-surface font-semibold">
                                {job.address}
                              </span>
                              <span className="font-body-sm text-body-sm text-on-surface-variant">{job.area}</span>
                            </div>
                          </div>
                          <div className="hidden sm:flex items-center gap-1 text-secondary font-label-sm text-label-sm font-bold px-2.5 py-1 bg-surface-container-lowest rounded-lg shadow-sm border border-slate-100 flex-shrink-0">
                            <span className="material-symbols-outlined text-[16px]">navigation</span>
                            <span>{job.travelTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-4 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => showToast(`Calling ${job.customer} (${job.customerPhone})...`)}
                            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-primary transition-colors border border-slate-200/50"
                            title={`Call ${job.customer}`}
                          >
                            <span className="material-symbols-outlined text-[18px]">call</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => showToast(`Opening chat with ${job.customer}...`)}
                            className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:text-secondary transition-colors border border-slate-200/50"
                            title={`Chat with ${job.customer}`}
                          >
                            <span className="material-symbols-outlined text-[18px]">chat</span>
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          {isConfirmed ? (
                            <>
                              <a
                                href={job.directionsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-2 rounded-full bg-surface-container-lowest text-secondary font-label-md text-label-md font-semibold hover:bg-surface-container transition-colors shadow-sm flex items-center gap-1 border border-slate-200/60"
                              >
                                <span className="material-symbols-outlined text-[16px]">map</span>
                                Get Directions
                              </a>
                              <button
                                type="button"
                                onClick={() => setSelectedScheduleJob(job)}
                                className="px-5 py-2 rounded-full bg-gradient-to-r from-primary-container via-primary to-secondary text-on-primary font-label-md text-label-md font-bold shadow-[0_4px_14px_rgba(225,29,116,0.3)] hover:opacity-95 transition-opacity"
                              >
                                View Job
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSelectedScheduleJob(job)}
                              className="px-5 py-2 rounded-full bg-surface-container-lowest text-secondary font-label-md text-label-md font-semibold hover:bg-surface-container transition-colors shadow-sm border border-slate-200/60"
                            >
                              View Job
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* D. JOBS NEAR YOU (Nearby Opportunities) */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                      Jobs Near You
                    </h2>
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Opportunities in your area • Real-time dispatch based on proximity
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-label-sm text-outline">Sorted by closest</span>
                  <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-secondary font-label-sm text-label-sm font-semibold shadow-sm border border-slate-100">
                    Within 5 km
                  </span>
                </div>
              </div>

              {/* 3 Opportunity Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {nearbyJobs.map((opp) => (
                  <div
                    key={opp.id}
                    className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_4px_20px_-2px_rgba(99,102,241,0.06),0_2px_6px_-1px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300 relative"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2.5 py-1 rounded-full font-label-sm text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                            opp.badgeType === 'urgent'
                              ? 'bg-primary-fixed text-primary'
                              : opp.badgeType === 'scheduled'
                              ? 'bg-secondary-fixed text-on-secondary-fixed'
                              : 'bg-surface-container text-tertiary'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {opp.badgeType === 'urgent' ? 'bolt' : opp.badgeType === 'scheduled' ? 'event' : 'speed'}
                          </span>
                          {opp.badge}
                        </span>
                        <span className="font-label-sm text-label-sm text-outline">{opp.postedTime}</span>
                      </div>

                      <div className="mt-1">
                        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold group-hover:text-primary transition-colors">
                          {opp.title}
                        </h3>
                        <div className="flex items-center gap-1 text-secondary font-label-sm text-label-sm font-medium mt-1">
                          <span className="material-symbols-outlined text-[16px]">near_me</span>
                          <span>{opp.distance}</span>
                        </div>
                      </div>

                      <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                        {opp.description}
                      </p>
                    </div>

                    <div className="pt-6 mt-2 flex items-center justify-between border-t border-slate-100/60">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-[11px] text-outline uppercase font-semibold">Budget Est.</span>
                        <span className="font-headline-sm text-headline-sm font-extrabold text-on-surface">
                          {opp.budgetRange}
                        </span>
                      </div>

                      {opp.bidSubmitted ? (
                        <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">check</span>
                          Bid: ₹{opp.bidAmount}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenBidModal(opp)}
                          className="px-4 py-2 rounded-full bg-gradient-to-r from-primary-container via-primary to-secondary text-on-primary font-label-md text-label-md font-bold shadow-[0_4px_14px_rgba(225,29,116,0.25)] hover:shadow-[0_6px_20px_rgba(225,29,116,0.35)] transition-all"
                        >
                          View Job
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* E. BOTTOM TWO-COLUMN ROW: EARNINGS & GROW YOUR SKILLS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column: Your Earnings (7 columns) */}
              <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-6 shadow-[0_4px_20px_-2px_rgba(99,102,241,0.06),0_2px_6px_-1px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                        Your Earnings
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-display-hero text-[38px] leading-tight text-on-surface font-extrabold">
                          ₹18,500
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[14px]">trending_up</span>
                          +18% vs last month
                        </span>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant font-medium">
                      Weekly View
                    </span>
                  </div>

                  {/* Weekly Interactive Sparkline Chart */}
                  <div className="w-full pt-4 pb-2">
                    <div className="flex items-end justify-between gap-2 h-44 px-2">
                      {WEEKLY_DATA.map((item, idx) => {
                        const isHovered = hoveredDay === item.day;
                        return (
                          <div
                            key={idx}
                            onMouseEnter={() => setHoveredDay(item.day)}
                            className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                          >
                            <span
                              className={`font-label-sm text-[11px] transition-opacity ${
                                item.isPeak
                                  ? 'text-primary font-bold opacity-100'
                                  : isHovered
                                  ? 'text-on-surface font-semibold opacity-100'
                                  : 'text-on-surface font-semibold opacity-0 group-hover:opacity-100'
                              }`}
                            >
                              {item.amount}
                            </span>
                            <div
                              className={`w-full max-w-[36px] rounded-t-lg transition-all ${
                                item.isPeak
                                  ? 'bg-gradient-to-t from-secondary via-primary to-primary-container shadow-sm'
                                  : 'bg-secondary-fixed group-hover:bg-secondary'
                              }`}
                              style={{ height: `${item.heightPercent}%` }}
                            />
                            <span
                              className={`font-label-sm text-label-sm ${
                                item.isPeak ? 'text-primary font-bold' : 'text-outline'
                              }`}
                            >
                              {item.day}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-slate-100/60">
                  <div className="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-body-sm">
                    <span className="material-symbols-outlined text-secondary text-[18px]">verified_user</span>
                    <span>Direct instant payout enabled • Bank of Baroda ****4921</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEarningsModal(true)}
                    className="font-label-md text-label-md text-secondary hover:text-primary transition-colors flex items-center gap-1 font-semibold group self-end sm:self-auto"
                  >
                    View Earnings Breakdown
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Column: Grow Your Skills & Verification (5 columns) */}
              <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-6 shadow-[0_4px_20px_-2px_rgba(99,102,241,0.06),0_2px_6px_-1px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                        Grow Your Skills &amp; Verification
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                        Complete trade assessments to unlock high-budget commercial jobs.
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-tertiary-fixed/60 text-tertiary flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-[22px]">military_tech</span>
                    </div>
                  </div>

                  {/* Progress Level Card */}
                  <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-1 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="font-label-md text-label-md text-on-surface font-bold">
                        Level 4 Master Artisan
                      </span>
                      <span className="font-label-sm text-label-sm text-primary font-bold">82% to Elite Pro</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-2.5 overflow-hidden mt-1">
                      <div
                        className="bg-gradient-to-r from-primary-container via-tertiary to-secondary h-2.5 rounded-full"
                        style={{ width: '82%' }}
                      />
                    </div>
                    <span className="font-body-sm text-[12px] text-outline mt-0.5">
                      3 more verified reviews needed to qualify for Elite Pro badge
                    </span>
                  </div>

                  {/* Skill Badges */}
                  <div className="flex flex-col gap-2">
                    <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
                      Trade Proficiencies
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md font-semibold">
                        <span
                          className="material-symbols-outlined text-[16px] text-secondary"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        Pipe Fitting • 98%
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md font-semibold">
                        <span
                          className="material-symbols-outlined text-[16px] text-secondary"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check_circle
                        </span>
                        Leak Detection • 95%
                      </div>
                      <button
                        type="button"
                        onClick={() => showToast('Solar Geyser Assessment available! Tap "View Skill Profile" to enroll.')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-fixed/60 text-on-primary-fixed-variant font-label-md text-label-md font-semibold hover:bg-primary-fixed transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px] text-primary">add_circle</span>
                        Solar Geyser Plumbing (Recommended)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2 flex items-center justify-between border-t border-slate-100/60">
                  <span className="font-body-sm text-body-sm text-outline">Verified by Kaarya Guild</span>
                  <button
                    type="button"
                    onClick={() => setShowSkillProfile(true)}
                    className="px-4 py-2 rounded-full bg-surface-container-lowest text-secondary font-label-md text-label-md font-semibold hover:bg-surface-container transition-colors shadow-sm flex items-center gap-1 border border-slate-200/60"
                  >
                    <span>View Skill Profile</span>
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. FOOTER */}
      <footer className="relative z-10 w-full bg-surface-container-lowest shadow-[0_-1px_12px_rgba(0,0,0,0.03)] border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-container to-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">handyman</span>
              </div>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Kaarya</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Where Skills Meet Opportunity</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link to="/professionals" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
              Find Professionals
            </Link>
            <a href="/#how-it-works" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
              How It Works
            </a>
            <Link to="/worker-dashboard" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
              For Workers
            </Link>
            <a href="/#trust" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
              Trust &amp; Safety
            </a>
            <a href="/#privacy" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="/#terms" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
              Terms
            </a>
          </div>

          <div className="font-body-sm text-body-sm text-outline text-center md:text-right">
            © 2025 Kaarya Inc. All rights reserved.
          </div>
        </div>
      </footer>

      {/* 4. INTERACTIVE MODAL: VIEW SCHEDULED JOB DETAILS */}
      {selectedScheduleJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary-fixed">
                  {selectedScheduleJob.urgency || 'Scheduled Appointment'}
                </span>
                <h3 className="text-xl font-bold text-on-surface mt-2">{selectedScheduleJob.title}</h3>
                <p className="text-xs text-outline">Job Reference: {selectedScheduleJob.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedScheduleJob(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="bg-surface-container-low rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-secondary to-tertiary text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {selectedScheduleJob.customer.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-on-surface">{selectedScheduleJob.customer}</h4>
                  <p className="text-xs text-outline">{selectedScheduleJob.customerRole}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedScheduleJob.customerPhone}`}
                  className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-secondary hover:text-primary transition-colors border border-slate-100"
                  title="Call"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                </a>
                <button
                  type="button"
                  onClick={() => showToast(`SMS sent to ${selectedScheduleJob.customer}`)}
                  className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-secondary hover:text-primary transition-colors border border-slate-100"
                  title="SMS"
                >
                  <span className="material-symbols-outlined text-[18px]">sms</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs font-semibold text-outline uppercase tracking-wider">Service Location</span>
                <p className="font-semibold text-on-surface mt-0.5">{selectedScheduleJob.address}</p>
                <p className="text-xs text-on-surface-variant">{selectedScheduleJob.area}</p>
              </div>

              <div>
                <span className="text-xs font-semibold text-outline uppercase tracking-wider">Problem Description</span>
                <p className="text-xs text-on-surface-variant mt-0.5 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {selectedScheduleJob.description}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold text-outline uppercase tracking-wider">Scope Checklist</span>
                <ul className="mt-1 space-y-1.5">
                  {selectedScheduleJob.tasks.map((task, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-xs text-outline font-semibold">Payout Upon Completion</span>
                <span className="text-lg font-extrabold text-on-surface">₹{selectedScheduleJob.price}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              {selectedScheduleJob.status !== 'In Progress' && selectedScheduleJob.status !== 'Completed' && (
                <button
                  type="button"
                  onClick={() => handleUpdateJobStatus(selectedScheduleJob.id, 'In Progress')}
                  className="flex-1 py-2.5 rounded-full bg-secondary text-white text-xs font-bold hover:bg-secondary/90 transition-colors shadow-sm"
                >
                  Mark En Route
                </button>
              )}
              {selectedScheduleJob.status === 'In Progress' && (
                <button
                  type="button"
                  onClick={() => handleUpdateJobStatus(selectedScheduleJob.id, 'Completed')}
                  className="flex-1 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Mark as Completed
                </button>
              )}
              <a
                href={selectedScheduleJob.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-full bg-surface-container text-secondary text-xs font-bold hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">navigation</span>
                Directions
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 5. INTERACTIVE MODAL: SUBMIT BID ON NEARBY JOB */}
      {biddingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-secondary px-2.5 py-0.5 rounded-full bg-secondary-fixed">
                  Submit Lead Bid
                </span>
                <h3 className="text-xl font-bold text-on-surface mt-1.5">{biddingJob.title}</h3>
                <p className="text-xs text-outline">{biddingJob.distance}</p>
              </div>
              <button
                type="button"
                onClick={() => setBiddingJob(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant bg-slate-50 p-3 rounded-xl border border-slate-100">
              {biddingJob.description}
            </p>

            <form onSubmit={handleSubmitBid} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">
                  Your Bid Price (₹) • Estimated: {biddingJob.budgetRange}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-on-surface">₹</span>
                  <input
                    type="number"
                    min="150"
                    max="5000"
                    step="50"
                    required
                    value={bidPrice}
                    onChange={(e) => setBidPrice(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-outline uppercase tracking-wider mb-1">
                  Quick Note / ETA
                </label>
                <textarea
                  rows="2"
                  value={bidNote}
                  onChange={(e) => setBidNote(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="e.g. Can reach within 20 minutes with spare parts..."
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBiddingJob(null)}
                  className="flex-1 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-primary-container via-primary to-secondary text-white text-xs font-bold shadow-md hover:opacity-95 transition-opacity"
                >
                  Confirm &amp; Send Bid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. INTERACTIVE MODAL: SKILL PROFILE */}
      {showSkillProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-secondary to-tertiary text-white flex items-center justify-center font-bold text-lg shadow-md">
                  RS
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xl font-bold text-on-surface">Rahul Sharma</h3>
                    <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                  </div>
                  <p className="text-xs text-secondary font-semibold">Master Plumber &amp; Pipe Fitter • Bandra West</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSkillProfile(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="block text-lg font-extrabold text-on-surface">4.8</span>
                <span className="text-[11px] text-outline font-medium">120 Reviews</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="block text-lg font-extrabold text-primary">8+ Yrs</span>
                <span className="text-[11px] text-outline font-medium">Experience</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="block text-lg font-extrabold text-secondary">Level 4</span>
                <span className="text-[11px] text-outline font-medium">Kaarya Guild</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-outline">Verified Trade Credentials</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <div>
                      <p className="text-xs font-bold text-on-surface">ITI Certificate in Sanitary Plumbing</p>
                      <p className="text-[11px] text-outline">Verified by Government Polytechnic Mumbai</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <div>
                      <p className="text-xs font-bold text-on-surface">Aadhaar &amp; Background Screened</p>
                      <p className="text-[11px] text-outline">Clean police verification report on file</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowSkillProfile(false)}
                className="px-6 py-2 rounded-full bg-secondary text-white text-xs font-bold shadow-sm hover:opacity-95 transition-opacity"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. INTERACTIVE MODAL: EARNINGS BREAKDOWN */}
      {showEarningsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-secondary px-2.5 py-0.5 rounded-full bg-secondary-fixed">
                  Earnings Statement
                </span>
                <h3 className="text-xl font-bold text-on-surface mt-1.5">May 2025 Summary</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEarningsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="bg-surface-container-low rounded-2xl p-4 space-y-2 border border-slate-100">
              <div className="flex justify-between text-xs text-on-surface">
                <span>Completed Tasks Payout (28 jobs)</span>
                <span className="font-bold">₹19,200</span>
              </div>
              <div className="flex justify-between text-xs text-on-surface">
                <span>Prompt Resolution Bonus</span>
                <span className="font-bold text-emerald-600">+₹850</span>
              </div>
              <div className="flex justify-between text-xs text-on-surface">
                <span>Kaarya Guild Tech Insurance Fee</span>
                <span className="font-bold text-primary">-₹1,550</span>
              </div>
              <div className="pt-2 border-t border-slate-200/80 flex justify-between text-sm font-extrabold text-on-surface">
                <span>Net Total Deposited</span>
                <span className="text-secondary text-base">₹18,500</span>
              </div>
            </div>

            <div className="text-[11px] text-outline flex items-center gap-1.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="material-symbols-outlined text-secondary text-[16px]">account_balance</span>
              <span>All payouts wired directly to Bank of Baroda account ending ****4921 via IMPS/NEFT.</span>
            </div>

            <button
              type="button"
              onClick={() => setShowEarningsModal(false)}
              className="w-full py-2.5 rounded-full bg-secondary text-white text-xs font-bold hover:bg-secondary/90 transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 8. INTERACTIVE TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)] bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 animate-fade-in border border-slate-700">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-primary-container text-[18px]">info</span>
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white"
            aria-label="Dismiss notification"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
