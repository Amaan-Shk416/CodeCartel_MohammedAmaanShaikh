import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_WORKERS } from '../data/mockData';

// Initial demonstration bookings strictly matching Stitch design reference and project contracts
const INITIAL_DEMO_BOOKINGS = [
  {
    id: 'BK-101',
    jobId: 'JOB-DEMO-LEAK',
    title: 'Plumbing — Leak Repair & Pipe Tuning',
    category: 'Plumbing',
    subService: 'Leak Repair',
    description: 'Kitchen sink pipe is leaking beneath the counter. Looking for someone to inspect and repair the joint.',
    workerId: 'w-rahul',
    worker: 'Rahul Sharma',
    profession: 'Master Plumber (8 yrs exp)',
    workerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2nifZzLMdH0o9fzC4iaEZKDgV7qD1vTuHdAGWfb-JALYbQAIaPiLi_ZK7vHDC40hB1Y3LqYutqNuiSNHhRCEsnDdETZDf6WBofXBZTPIFx_llWe6acsLEHBj6adkKtiDU29q_zePfu1ggcKhIR5phWhi9XzZbk80NaUaTW4Hnrp0C4lMO4f3jJiRVnV1JXvLJYvyk18-dDpA13yjifGapq94avMbEfuhLjzUYgY0i8AA39Rn9z6DgzQ',
    rating: 4.8,
    reviewsCount: 142,
    date: 'Tomorrow',
    time: '10:00 AM',
    dateTimeDisplay: 'Tomorrow · 10:00 AM',
    location: 'Bandra West, Mumbai',
    amount: 650,
    totalAmount: 650,
    status: 'Upcoming',
    isDemo: true,
    createdAt: '2026-10-24T18:00:00.000Z',
  },
  {
    id: 'BK-102',
    jobId: 'JOB-DEMO-CLEAN',
    title: 'Deep Cleaning — Full 2BHK Sanitization & Kitchen Scrub',
    category: 'Cleaning',
    subService: 'Deep Cleaning',
    description: 'Full 2BHK sanitization, kitchen degreasing, and balcony pressure washing.',
    workerId: 'w-priya',
    worker: 'Priya Nair',
    profession: 'Hygiene & Sanitization Specialist',
    workerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNRpQgpsUDqDgkLlVW9XGrQ2fSNbK6MfXmggNgEgCoFOFCckiqEeE7EvvRKctZRpRihRBWrTJXb25Zf3niJrncC_2WzDYlDOiwFhNt1vYzSUaBiL2w34ZeYRXofQhRpJQeOQgvAkaervephwDb7VtJwjnWWTHWa0nbwsoZz8kZIDGbiTSb41MYEJneptxC3UslYFtRp4ztezRT6wcFc1NImHuJLVNNU3-qt9Bx8dVd1DpfUdyWh_LRvw',
    rating: 4.9,
    reviewsCount: 98,
    date: 'Saturday',
    time: '11:00 AM',
    dateTimeDisplay: 'Saturday · 11:00 AM',
    location: 'Andheri West, Mumbai',
    amount: 1200,
    totalAmount: 1200,
    status: 'Upcoming',
    isDemo: true,
    createdAt: '2026-10-23T14:30:00.000Z',
  },
  {
    id: 'BK-103',
    jobId: 'JOB-DEMO-ELEC',
    title: 'Electrical Repair — Switchboard Inverter Wiring & Tripping Fix',
    category: 'Electrical',
    subService: 'Electrical Repair',
    description: 'Switchboard inverter wiring diagnostic and circuit breaker tripping fix.',
    workerId: 'w-amit',
    worker: 'Amit Kumar',
    profession: 'Licensed Wireman & Automation Pro',
    workerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsu5gxF0kSj_mbtDcJdhgDDZ1jrHFCXTMdjkgDBJO9sztTIKdPVnEwGJ2RwC76rMS7lDMK47Yd-iVjuYuaduAvElH-rnEGxEMlzKkflyBpmLPFeg-pP_6R8AvGuD4MbPIF8EMEfdu24YNJ5T_cNIdM2R0igfuPw3dL_WZ5D4nfQKAcFioGCQUZ-xHojmi-oQlFGTTTzOvr90PkUe5SKJCNhrIPASiZoUaGCrvs1t1GmPhkYcF43ZTREQ',
    rating: 4.7,
    reviewsCount: 210,
    date: 'Today',
    time: '2:00 PM (Arrived)',
    dateTimeDisplay: 'Today · 2:00 PM (Arrived)',
    location: 'Juhu Tara Road, Mumbai',
    amount: 850,
    totalAmount: 850,
    status: 'In Progress',
    isDemo: true,
    createdAt: '2026-10-24T09:15:00.000Z',
  },
  {
    id: 'BK-098',
    jobId: 'JOB-DEMO-VALVE',
    title: 'Plumbing Repair — Bathroom Mixer Tap Gasket Replacement',
    category: 'Plumbing',
    subService: 'Plumbing Repair',
    description: 'Bathroom mixer tap gasket replacement and valve inspection.',
    workerId: 'w-vikram',
    worker: 'Vikram Patel',
    profession: 'Carpentry & Plumbing Artisan',
    workerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLCU3SsUGkSNB3cVwBPT-GFASujoyXsiSoK90ydNaJK1wRVnBLL1BL9XS2QgfU3gbnCgKQA9Z2K2RmjN0RHvLI02qcy-T8lv9_AXSczmxKK_Ti0GgoQ62KodLDXxvDnHQFoSA3t1Nk5-I8tUVAtt4Z-EJr0HBs0vm1chHaP2_vsbW9kyuohC4Zhqav9Zoh9EcfPf4b1M2ELuNELI72lNImQ8MYrHKoqHTAVPofkUZTH3UJea220vr7lA',
    rating: 5.0,
    reviewsCount: 88,
    date: '12 October',
    time: 'Completed',
    dateTimeDisplay: 'Executed on 12 October',
    location: 'Bandra West, Mumbai',
    amount: 550,
    totalAmount: 550,
    status: 'Completed',
    invoiceNumber: 'KA-89410',
    isDemo: true,
    createdAt: '2026-10-12T16:00:00.000Z',
  },
];

export default function MyBookings() {
  const navigate = useNavigate();

  // Active filter tab: 'all' | 'upcoming' | 'in-progress' | 'completed' | 'cancelled'
  const [activeFilter, setActiveFilter] = useState('all');

  // Interactive prototype modal states
  const [activeReceiptBooking, setActiveReceiptBooking] = useState(null);
  const [isGuaranteeOpen, setIsGuaranteeOpen] = useState(false);
  const [isHelpDeskOpen, setIsHelpDeskOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [actionMenuBooking, setActionMenuBooking] = useState(null);
  const [prototypeToast, setPrototypeToast] = useState(null);

  // Auto-scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Show transient prototype toast
  const showToast = (message) => {
    setPrototypeToast(message);
    setTimeout(() => {
      setPrototypeToast(null);
    }, 3200);
  };

  // 1. Resolve and Merge Bookings with Strict Deduplication & Precedence
  const mergedBookings = useMemo(() => {
    let dynamicBookings = [];
    try {
      const raw = localStorage.getItem('kaarya_bookings');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Strictly exclude unconfirmed drafts
          dynamicBookings = parsed.filter(
            (b) => b && b.status && b.status !== 'Pending Confirmation'
          );
        }
      }
    } catch (err) {
      console.warn('Error reading kaarya_bookings:', err);
    }

    // Strict deduplication: genuine user bookings take precedence over demo records
    const userIds = new Set(dynamicBookings.map((b) => b.id));
    const nonConflictingDemos = INITIAL_DEMO_BOOKINGS.filter((demo) => !userIds.has(demo.id));

    // Combine user bookings first, then demo records
    return [...dynamicBookings, ...nonConflictingDemos];
  }, []);

  // 2. Compute Filter Counts Dynamically (Never Hardcoded)
  const counts = useMemo(() => {
    return {
      all: mergedBookings.length,
      upcoming: mergedBookings.filter((b) => b.status === 'Upcoming' || b.status === 'Confirmed').length,
      inProgress: mergedBookings.filter((b) => b.status === 'In Progress').length,
      completed: mergedBookings.filter((b) => b.status === 'Completed').length,
      cancelled: mergedBookings.filter((b) => b.status === 'Cancelled').length,
    };
  }, [mergedBookings]);

  // 3. Filter Bookings by Active Tab
  const filteredBookings = useMemo(() => {
    if (activeFilter === 'upcoming') {
      return mergedBookings.filter((b) => b.status === 'Upcoming' || b.status === 'Confirmed');
    }
    if (activeFilter === 'in-progress') {
      return mergedBookings.filter((b) => b.status === 'In Progress');
    }
    if (activeFilter === 'completed') {
      return mergedBookings.filter((b) => b.status === 'Completed');
    }
    if (activeFilter === 'cancelled') {
      return mergedBookings.filter((b) => b.status === 'Cancelled');
    }
    return mergedBookings;
  }, [mergedBookings, activeFilter]);

  // 4. Deterministic Featured Hero Booking Selection
  // Priority 1: Earliest scheduled Upcoming/Confirmed booking
  // Priority 2: In Progress active booking
  const heroBooking = useMemo(() => {
    const upcoming = mergedBookings.find((b) => b.status === 'Upcoming' || b.status === 'Confirmed');
    if (upcoming) return upcoming;
    const inProgress = mergedBookings.find((b) => b.status === 'In Progress');
    if (inProgress) return inProgress;
    return null;
  }, [mergedBookings]);

  // Resolve authentic worker telephone where legitimate data exists
  const getWorkerPhone = (workerId) => {
    const matched = MOCK_WORKERS.find((w) => w.id === workerId);
    return matched?.phone || null;
  };

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* 2. MAIN BODY WITH AMBIENT GLOW ORBS */}
      <main className="w-full pt-6 sm:pt-8 bg-surface min-h-[calc(100vh-140px)] flex-grow">
        <div className="flex flex-col w-full relative overflow-hidden">
          {/* Subtle Ambient Glow Orbs matching Stitch Reference */}
          <div className="pointer-events-none absolute -top-24 right-1/4 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute top-48 left-10 w-[420px] h-[420px] bg-secondary-container/10 rounded-full blur-3xl" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10 flex flex-col gap-8 sm:gap-10">
            {/* SECTION 1: BREADCRUMB & PAGE HEADING */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <nav className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-label-md">
                  <Link to="/" className="hover:text-primary transition-colors">
                    Home
                  </Link>
                  <span className="material-symbols-outlined text-[14px] text-outline">chevron_right</span>
                  <span className="text-on-surface font-semibold">My Bookings</span>
                </nav>
                <div className="flex flex-col gap-1 mt-1">
                  <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
                    My Bookings
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Your services, all in one place. Track, reschedule, and manage verified artisans.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-auto">
                <Link
                  to="/professionals"
                  className="group flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-surface-container-lowest shadow-sm hover:shadow-md transition-all text-secondary font-label-lg text-label-lg font-semibold border border-slate-100"
                >
                  <span className="material-symbols-outlined text-[18px] group-hover:rotate-90 transition-transform">
                    add
                  </span>
                  <span>Find Professionals</span>
                </Link>
              </div>
            </div>

            {/* SECTION 2: DYNAMIC FILTER TABS & SERVICE GUARANTEE BADGE */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div
                className="inline-flex items-center p-1.5 rounded-full bg-surface-container shadow-inner flex-wrap gap-1"
                role="tablist"
              >
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className={`px-5 py-2 rounded-full font-label-lg text-label-lg transition-all cursor-pointer ${
                    activeFilter === 'all'
                      ? 'text-on-primary-container bg-gradient-to-r from-primary-container to-secondary shadow-md font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  All ({counts.all})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('upcoming')}
                  className={`px-5 py-2 rounded-full font-label-lg text-label-lg transition-all cursor-pointer ${
                    activeFilter === 'upcoming'
                      ? 'text-on-primary-container bg-gradient-to-r from-primary-container to-secondary shadow-md font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Upcoming ({counts.upcoming})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('in-progress')}
                  className={`px-5 py-2 rounded-full font-label-lg text-label-lg transition-all cursor-pointer ${
                    activeFilter === 'in-progress'
                      ? 'text-on-primary-container bg-gradient-to-r from-primary-container to-secondary shadow-md font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  In Progress ({counts.inProgress})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('completed')}
                  className={`px-5 py-2 rounded-full font-label-lg text-label-lg transition-all cursor-pointer ${
                    activeFilter === 'completed'
                      ? 'text-on-primary-container bg-gradient-to-r from-primary-container to-secondary shadow-md font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Completed ({counts.completed})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter('cancelled')}
                  className={`px-5 py-2 rounded-full font-label-lg text-label-lg transition-all cursor-pointer ${
                    activeFilter === 'cancelled'
                      ? 'text-on-primary-container bg-gradient-to-r from-primary-container to-secondary shadow-md font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Cancelled ({counts.cancelled})
                </button>
              </div>

              {/* Informational Service Guarantee Pill */}
              <button
                type="button"
                onClick={() => setIsGuaranteeOpen(true)}
                className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest shadow-sm hover:shadow-md transition-all border border-slate-100 cursor-pointer"
                title="View prototype service guarantee information"
              >
                <span className="material-symbols-outlined text-secondary text-[18px]">verified_user</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Kaarya 100% Service Guarantee active
                </span>
                <span className="material-symbols-outlined text-slate-400 text-[14px]">info</span>
              </button>
            </div>

            {/* SECTION 3: FEATURED NEXT SCHEDULED SERVICE CARD (HERO BOOKING) */}
            {heroBooking ? (
              <div className="relative p-[2px] rounded-2xl bg-gradient-to-r from-primary-container via-tertiary to-secondary shadow-xl shadow-secondary/5">
                <div className="bg-surface-container-lowest rounded-[14px] p-6 lg:p-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 lg:gap-8">
                  {/* Left: Professional Photo with Badges */}
                  <div className="relative w-full lg:w-72 h-56 lg:h-52 rounded-xl overflow-hidden shrink-0 shadow-md bg-surface-container">
                    <img
                      src={heroBooking.workerAvatar}
                      alt={`${heroBooking.worker} portrait`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-md">
                      <span
                        className="material-symbols-outlined text-amber-500 text-[14px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface font-bold">
                        {heroBooking.rating || 4.8}
                      </span>
                      <span className="text-[10px] text-on-surface-variant">
                        ({heroBooking.reviewsCount || 120} jobs)
                      </span>
                    </div>
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm shadow-sm flex items-center gap-1 font-semibold">
                      <span className="material-symbols-outlined text-[12px]">verified</span>
                      <span>Verified Pro</span>
                    </div>
                    {heroBooking.isDemo && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 text-white font-label-sm text-[10px] font-semibold backdrop-blur-sm">
                        Demo Record
                      </div>
                    )}
                  </div>

                  {/* Middle: Service & Appointment Info */}
                  <div className="flex flex-col justify-between flex-grow min-w-0 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                        <span className="font-label-sm text-label-sm text-primary-container tracking-wider uppercase font-extrabold">
                          Next Scheduled Service
                        </span>
                      </div>
                      <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                        {heroBooking.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 text-on-surface-variant font-body-md text-body-md">
                        <span>Assigned Pro:</span>
                        <span className="font-label-lg text-label-lg text-on-surface font-semibold">
                          {heroBooking.worker}
                        </span>
                        <span className="text-outline-variant">•</span>
                        <span className="text-on-surface-variant font-body-sm text-body-sm">
                          {heroBooking.profession}
                        </span>
                      </div>
                    </div>

                    {/* Time & Location Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low">
                        <div className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-secondary shadow-sm shrink-0">
                          <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                            Appointment
                          </span>
                          <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                            {heroBooking.dateTimeDisplay || `${heroBooking.date} · ${heroBooking.time}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low">
                        <div className="w-9 h-9 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm shrink-0">
                          <span className="material-symbols-outlined text-[20px]">pin_drop</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
                            Location
                          </span>
                          <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">
                            {heroBooking.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Price & Quick Action Hub */}
                  <div className="flex flex-col justify-between items-start lg:items-end shrink-0 gap-4 lg:pl-6 lg:border-l lg:border-surface-container-high">
                    <div className="flex flex-col items-start lg:items-end gap-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        <span>Confirmed Booking</span>
                      </span>
                      <div className="mt-2 text-left lg:text-right">
                        <span className="font-display-hero-mobile text-3xl sm:text-4xl text-on-surface font-extrabold leading-none">
                          ₹{heroBooking.amount}
                        </span>
                        <div className="font-label-sm text-label-sm text-outline mt-1">
                          Agreed Fixed Price · Pay post-job
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col w-full gap-2 pt-1">
                      <Link
                        to={`/bookings/${heroBooking.id}`}
                        className="w-full px-6 py-2.5 rounded-full bg-gradient-to-r from-primary-container to-secondary text-on-primary-container font-label-lg text-label-lg shadow-md hover:shadow-lg hover:opacity-95 transition-all text-center font-bold"
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/messages?recipient=${heroBooking.workerId}`}
                        className="w-full px-6 py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container text-secondary font-label-lg text-label-lg transition-colors flex items-center justify-center gap-2 font-semibold text-center"
                      >
                        <span className="material-symbols-outlined text-[18px]">chat</span>
                        <span>Contact Professional</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Alternate Hero Card when zero active bookings exist */
              <div className="rounded-2xl bg-surface-container-lowest p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-high text-secondary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[32px]">event_available</span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                      No upcoming services scheduled
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Need repairs or home cleaning? Browse verified Mumbai artisans and book in minutes.
                    </p>
                  </div>
                </div>
                <Link
                  to="/professionals"
                  className="px-6 py-2.5 rounded-full bg-primary-container text-on-primary font-label-lg font-bold shadow-md hover:opacity-95 transition-all whitespace-nowrap"
                >
                  Find Professionals
                </Link>
              </div>
            )}

            {/* SECTION 4: ALL SERVICES SUBHEAD & 3-COLUMN RESPONSIVE GRID */}
            <div className="flex flex-col gap-6 mt-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-headline-md text-headline-md text-on-surface font-bold">
                    All Services
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-semibold">
                    {filteredBookings.length} {filteredBookings.length === 1 ? 'Service' : 'Services'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Prototype notice: Consolidated billing and invoice downloads are simulated in this preview.')}
                  className="flex items-center gap-1 text-secondary font-label-md text-label-md cursor-pointer hover:underline"
                >
                  <span>Download Invoice History</span>
                  <span className="material-symbols-outlined text-[16px]">download</span>
                </button>
              </div>

              {/* Grid of Service Booking Cards */}
              {filteredBookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="bookings-card-grid">
                  {filteredBookings.map((b) => {
                    const phone = getWorkerPhone(b.workerId);
                    const isInProgress = b.status === 'In Progress';
                    const isCompleted = b.status === 'Completed';

                    return (
                      <div
                        key={b.id}
                        className="flex flex-col bg-surface-container-lowest rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-100 group"
                      >
                        {/* Top Card Image with Floating Badges */}
                        <div className="relative w-full h-48 overflow-hidden bg-surface-container">
                          <img
                            src={b.workerAvatar}
                            alt={`${b.worker} photo`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                          {/* Top-Left Category Badge */}
                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <span className="px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-secondary font-label-sm text-label-sm font-bold shadow-sm">
                              {b.category || 'Service'}
                            </span>
                            {b.isDemo && (
                              <span className="px-2 py-0.5 rounded-full bg-black/60 text-white font-label-sm text-[10px] font-semibold backdrop-blur-sm">
                                Demo
                              </span>
                            )}
                          </div>

                          {/* Top-Right Status Badge */}
                          <div className="absolute top-3 right-3">
                            {isInProgress ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-bold shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-primary-container animate-ping" />
                                <span>In Progress</span>
                              </span>
                            ) : isCompleted ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm font-bold shadow-sm">
                                <span className="material-symbols-outlined text-secondary text-[14px]">check_circle</span>
                                <span>Completed</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                <span>Upcoming</span>
                              </span>
                            )}
                          </div>

                          {/* Bottom-Left Rating Chip */}
                          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-[12px] font-semibold">
                            <span
                              className="material-symbols-outlined text-amber-400 text-[16px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              star
                            </span>
                            <span>{b.rating || 4.8} ({b.reviewsCount || 100} reviews)</span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-6 flex flex-col justify-between flex-grow gap-4">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between">
                              <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                                {b.worker}
                              </h4>
                              <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold">
                                ₹{b.amount}
                              </span>
                            </div>
                            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                              {b.title}
                            </p>

                            {/* Schedule Row */}
                            <div className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-label-md mt-2 pt-2 border-t border-surface-container">
                              {isInProgress ? (
                                <>
                                  <span className="material-symbols-outlined text-primary-container text-[16px]">sensors</span>
                                  <span className="font-semibold text-primary">
                                    {b.dateTimeDisplay || b.date} (Arrived)
                                  </span>
                                </>
                              ) : isCompleted ? (
                                <>
                                  <span className="material-symbols-outlined text-outline text-[16px]">event_available</span>
                                  <span className="text-on-surface-variant">
                                    {b.dateTimeDisplay || `Executed on ${b.date}`}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="material-symbols-outlined text-secondary text-[16px]">schedule</span>
                                  <span className="font-semibold text-on-surface">
                                    {b.dateTimeDisplay || `${b.date} · ${b.time}`}
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Location / Receipt Row */}
                            <div className="flex items-center gap-1.5 text-outline font-body-sm text-body-sm truncate">
                              {isCompleted && b.invoiceNumber ? (
                                <>
                                  <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                                  <span>Invoice #{b.invoiceNumber} · Paid via UPI</span>
                                </>
                              ) : (
                                <>
                                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                                  <span className="truncate">{b.location}</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Contextual Action Buttons */}
                          <div className="pt-2 flex items-center gap-2">
                            {isInProgress ? (
                              <>
                                <Link
                                  to={`/bookings/${b.id}`}
                                  className="w-full py-2.5 rounded-full bg-gradient-to-r from-primary-container via-primary to-secondary text-on-primary font-label-lg text-label-lg shadow-sm hover:shadow-md transition-all text-center font-bold"
                                >
                                  Track Booking
                                </Link>
                                {phone ? (
                                  <a
                                    href={`tel:${phone}`}
                                    className="w-10 h-10 shrink-0 rounded-full bg-surface-container-low text-secondary flex items-center justify-center hover:bg-surface-container transition-colors"
                                    title={`Call ${b.worker}: ${phone}`}
                                  >
                                    <span className="material-symbols-outlined text-[18px]">phone</span>
                                  </a>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => showToast('Direct phone contact is unavailable for this artisan in prototype. Please use in-app messaging.')}
                                    className="w-10 h-10 shrink-0 rounded-full bg-surface-container text-slate-400 flex items-center justify-center cursor-not-allowed opacity-60"
                                    title="Phone unavailable — use messaging"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">phone_disabled</span>
                                  </button>
                                )}
                              </>
                            ) : isCompleted ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setActiveReceiptBooking(b)}
                                  className="w-full py-2.5 rounded-full bg-surface-container-lowest hover:bg-surface-container-low text-on-surface font-label-lg text-label-lg shadow-sm transition-colors text-center font-medium flex items-center justify-center gap-1.5 border border-slate-100"
                                >
                                  <span className="material-symbols-outlined text-[16px] text-outline">description</span>
                                  <span>View Receipt</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => navigate(`/post-job?workerId=${b.workerId}`)}
                                  className="px-4 py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container text-secondary font-label-md text-label-md transition-colors whitespace-nowrap font-semibold"
                                >
                                  Book Again
                                </button>
                              </>
                            ) : (
                              /* Upcoming Booking Actions */
                              <>
                                <Link
                                  to={`/bookings/${b.id}`}
                                  className="w-full py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container text-secondary font-label-lg text-label-lg transition-colors text-center font-semibold"
                                >
                                  View Details
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => setActionMenuBooking(b)}
                                  className="w-10 h-10 shrink-0 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors border border-slate-100"
                                  title="Booking options"
                                >
                                  <span className="material-symbols-outlined text-[18px]">more_vert</span>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty State Container */
                <div className="flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl bg-surface-container-lowest border border-slate-100 shadow-sm text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-outline mb-4">
                    <span className="material-symbols-outlined text-[32px]">event_busy</span>
                  </div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    No bookings found
                  </h4>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mt-1">
                    There are no services matching this category at the moment.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveFilter('all')}
                    className="mt-6 px-6 py-2.5 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg shadow-md hover:opacity-95 transition-all font-bold"
                  >
                    Show All Bookings
                  </button>
                </div>
              )}
            </div>

            {/* SECTION 5: ASSISTANCE BANNER FOOTER CARD */}
            <div className="rounded-2xl bg-surface-container-lowest p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
                  <span className="material-symbols-outlined text-[26px]">support_agent</span>
                </div>
                <div className="flex flex-col">
                  <h5 className="font-label-lg text-label-lg text-on-surface font-bold">
                    Need assistance with a booking or worker dispatch?
                  </h5>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Our hyperlocal Mumbai concierge resolution desk is available 24/7 to resolve disputes or delays.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => setIsHelpDeskOpen(true)}
                  className="w-full md:w-auto px-5 py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container text-secondary font-label-md text-label-md font-semibold transition-colors"
                >
                  Help Center
                </button>
                <button
                  type="button"
                  onClick={() => setIsEmergencyModalOpen(true)}
                  className="w-full md:w-auto px-5 py-2.5 rounded-full bg-surface-container-lowest shadow-sm hover:bg-surface-container-low text-on-surface font-label-md text-label-md font-semibold transition-colors border border-slate-100"
                >
                  Emergency Hotline
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. KAARYA BRAND FOOTER */}
      <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_12px_rgba(0,0,0,0.03)] border-t border-slate-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-container to-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">handyman</span>
              </div>
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Kaarya</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Where Skills Meet Opportunity
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link
              to="/professionals"
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
            >
              Find Professionals
            </Link>
            <a
              href="/#how-it-works"
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
            >
              How It Works
            </a>
            <Link
              to="/worker-dashboard"
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
            >
              For Workers
            </Link>
            <a
              href="/#trust"
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
            >
              Trust &amp; Safety
            </a>
            <a
              href="/#privacy"
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
            >
              Privacy
            </a>
            <a
              href="/#terms"
              className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors"
            >
              Terms
            </a>
          </div>

          <div className="font-body-sm text-body-sm text-outline text-center md:text-right">
            © 2025 Kaarya Inc. All rights reserved.
          </div>
        </div>
      </footer>

      {/* 4. MODALS & PROTOTYPE DIALOGS */}

      {/* A. Verified Receipt Dialog */}
      {activeReceiptBooking && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/70 backdrop-blur-sm"
          onClick={() => setActiveReceiptBooking(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">receipt_long</span>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                  Service Receipt
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveReceiptBooking(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Booking ID:</span>
                  <span className="font-mono font-bold text-slate-800">{activeReceiptBooking.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Assigned Professional:</span>
                  <span className="font-bold text-slate-800">{activeReceiptBooking.worker}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Service Executed:</span>
                  <span className="font-medium text-slate-800">{activeReceiptBooking.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Execution Date:</span>
                  <span className="font-medium text-slate-800">{activeReceiptBooking.dateTimeDisplay || activeReceiptBooking.date}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
                  <span className="font-bold text-slate-900">Total Paid:</span>
                  <span className="font-black text-primary">₹{activeReceiptBooking.amount}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[16px]">verified</span>
                <span>Payment settled via UPI / Kaarya Direct Settlement.</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveReceiptBooking(null)}
              className="w-full py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md font-semibold transition-colors text-center"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

      {/* B. Informational Service Guarantee Dialog */}
      {isGuaranteeOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/70 backdrop-blur-sm"
          onClick={() => setIsGuaranteeOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">verified_user</span>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Kaarya Service Guarantee Policy
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsGuaranteeOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-600">
              <p>
                <strong>Informational Prototype Notice:</strong> The &ldquo;Kaarya 100% Service Guarantee&rdquo; badge represents our platform standard for post-service satisfaction review.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-500">
                <li>Zero advance payment required before artisan arrival.</li>
                <li>Fixed quotes agreed upfront with no surprise surcharges.</li>
                <li>In-app inspection and approval before final release.</li>
              </ul>
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px]">
                Note: In this frontend prototype, no legal escrow accounts or binding banking transactions are active.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsGuaranteeOpen(false)}
              className="w-full py-2.5 rounded-full bg-secondary text-white font-label-md font-bold transition-all text-center"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* C. Prototype Help Center Guidance */}
      {isHelpDeskOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/70 backdrop-blur-sm"
          onClick={() => setIsHelpDeskOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[22px]">support_agent</span>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Kaarya Resolution Desk
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHelpDeskOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <p>
                Need help coordinating your appointment or rescheduling an artisan?
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="font-semibold text-slate-800">Quick Assistance Steps:</div>
                <p>1. Use the in-app <strong>Contact Professional</strong> chat to message your assigned artisan directly.</p>
                <p>2. To modify service details, click <strong>View Details</strong> on your booking card.</p>
                <p>3. For new work requests, browse verified local pros on <strong>Find Professionals</strong>.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                Demonstration notice: Live concierge chat desk is simulated for prototype workflow evaluation.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsHelpDeskOpen(false)}
              className="w-full py-2.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md font-semibold transition-colors text-center"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* D. Prototype Emergency Hotline Notice */}
      {isEmergencyModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/70 backdrop-blur-sm"
          onClick={() => setIsEmergencyModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-[22px]">emergency</span>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Emergency Support Hotline
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEmergencyModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Prototype Feature Notice:</strong> A 24/7 emergency dispatch telephone hotline is a planned production feature for urgent utility escalations (e.g. major pipe bursts, electrical sparking).
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700">
                In this prototype build, please communicate directly with verified professionals via in-app messaging or submit an emergency request through <strong>Post a New Job</strong>.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEmergencyModalOpen(false)}
              className="w-full py-2.5 rounded-full bg-secondary text-white font-label-md font-bold transition-all text-center"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* E. Prototype Booking Options Menu (Upcoming) */}
      {actionMenuBooking && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/70 backdrop-blur-sm"
          onClick={() => setActionMenuBooking(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-headline-sm text-sm font-bold text-on-surface">
                Options: {actionMenuBooking.id}
              </span>
              <button
                type="button"
                onClick={() => setActionMenuBooking(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-1.5 text-xs">
              <Link
                to={`/bookings/${actionMenuBooking.id}`}
                className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">visibility</span>
                <span>View Full Booking Details</span>
              </Link>
              <Link
                to={`/messages?recipient=${actionMenuBooking.workerId}`}
                className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">chat</span>
                <span>Message {actionMenuBooking.worker}</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setActionMenuBooking(null);
                  showToast('Prototype notice: Rescheduling and cancellation workflows are simulated in this preview.');
                }}
                className="p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium text-left"
              >
                <span className="material-symbols-outlined text-[18px] text-amber-600">event_repeat</span>
                <span>Reschedule / Request Time Change</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setActionMenuBooking(null)}
              className="mt-1 w-full py-2 rounded-xl bg-slate-100 text-slate-700 font-label-md text-xs font-semibold hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* F. Transient Prototype Notification Toast */}
      {prototypeToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-fade-in border border-slate-700">
          <span className="material-symbols-outlined text-amber-400 text-[18px]">info</span>
          <span className="leading-snug">{prototypeToast}</span>
        </div>
      )}
    </div>
  );
}
