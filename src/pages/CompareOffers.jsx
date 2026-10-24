import React, { useState, useMemo } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { MOCK_WORKERS } from '../data/mockData';
import WorkerProfileModal from '../components/workers/WorkerProfileModal';

// Demonstration offers strictly matching the 6 professionals from mockData.js
// and the exact pricing from the reference screenshot
const DEMO_OFFERS = [
  {
    id: 'off-1',
    workerId: 'w-rahul',
    bidAmount: 650,
    eta: '25 mins',
    etaMinutes: 25,
    status: 'Recommended',
    badgeVariant: 'primary',
    comment: 'Acoustic leak detection and high-pressure gasket replacement with 30-day workmanship guarantee.',
  },
  {
    id: 'off-2',
    workerId: 'w-priya',
    bidAmount: 750,
    eta: '45 mins',
    etaMinutes: 45,
    status: 'Hygiene Certified',
    badgeVariant: 'emerald',
    comment: 'Joint seal sanitization and complete under-sink post-repair degreasing using medical-grade eco cleaners.',
  },
  {
    id: 'off-3',
    workerId: 'w-amit',
    bidAmount: 600,
    eta: '35 mins',
    etaMinutes: 35,
    status: 'Licensed Wireman',
    badgeVariant: 'amber',
    comment: 'Equipped for plumbing valve connections, pressure sensors, and kitchen disposal electrical circuits.',
  },
  {
    id: 'off-4',
    workerId: 'w-vikram',
    bidAmount: 550,
    eta: '50 mins',
    etaMinutes: 50,
    status: 'Lowest Price',
    badgeVariant: 'blue',
    comment: 'Under-sink cabinet shelf adjustment, moisture-resistant sealing, and waterproof pipe joint alignment.',
  },
  {
    id: 'off-5',
    workerId: 'w-sneha',
    bidAmount: 700,
    eta: '20 mins',
    etaMinutes: 20,
    status: 'Emerging Talent • Top 5%',
    badgeVariant: 'purple',
    comment: 'Specialized in micro-joint connections, RO pressure regulators, and precision valve troubleshooting.',
  },
  {
    id: 'off-6',
    workerId: 'w-rajesh',
    bidAmount: 800,
    eta: '60 mins',
    etaMinutes: 60,
    status: 'Waterproofing Pro',
    badgeVariant: 'pink',
    comment: 'Pipe joint sealing with industrial silicone sealant and quick-drying anti-mold moisture coating.',
  },
];

export default function CompareOffers() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Active Job Resolution
  const activeJob = useMemo(() => {
    const jobIdParam = searchParams.get('jobId');
    let postedJobs = [];
    try {
      const raw = localStorage.getItem('kaarya_posted_jobs');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) postedJobs = parsed;
      }
    } catch (err) {
      console.warn('Invalid JSON in kaarya_posted_jobs:', err);
    }

    if (jobIdParam) {
      const matched = postedJobs.find((j) => j && j.id === jobIdParam);
      if (matched) return matched;
    }

    if (postedJobs.length > 0) {
      const sorted = [...postedJobs].sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
      return sorted[0];
    }

    // High-fidelity fallback demonstration job
    return {
      id: 'JOB-DEMO-LEAK',
      title: 'Emergency Kitchen Sink Pipe Leakage',
      category: 'Plumbing',
      subService: 'Leak Repair',
      location: 'Bandra West, Mumbai',
      dateLabel: 'Today',
      timeLabel: 'Afternoon (12 PM – 5 PM)',
      budgetLabel: '₹500–₹1,500',
      description: 'Kitchen sink pipe is leaking beneath the counter. Looking for someone to inspect and repair the joint.',
      status: 'Broadcasted',
      bidsReceived: 6,
      isDemoFallback: true,
    };
  }, [searchParams]);

  // Merge offer data with authentic worker details from mockData.js
  const offers = useMemo(() => {
    return DEMO_OFFERS.map((offer) => {
      const worker = MOCK_WORKERS.find((w) => w.id === offer.workerId) || MOCK_WORKERS[0];
      const isDirectTarget = activeJob?.assignedWorker?.id === worker.id;
      return {
        ...offer,
        worker,
        isDirectTarget,
      };
    });
  }, [activeJob]);

  // Toolbar state
  const [sortBy, setSortBy] = useState('recommended');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'

  // Map state
  const [selectedMapWorker, setSelectedMapWorker] = useState(
    () => MOCK_WORKERS.find((w) => w.id === 'w-rahul') || MOCK_WORKERS[0]
  );

  // Modals state
  const [activeProfileWorker, setActiveProfileWorker] = useState(null);
  const [selectedOfferForModal, setSelectedOfferForModal] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  // Sorted offers
  const sortedOffers = useMemo(() => {
    const list = [...offers];
    if (sortBy === 'price_asc') {
      return list.sort((a, b) => a.bidAmount - b.bidAmount);
    }
    if (sortBy === 'rating_desc') {
      return list.sort((a, b) => (b.worker.rating || 0) - (a.worker.rating || 0));
    }
    if (sortBy === 'eta_asc') {
      return list.sort((a, b) => a.etaMinutes - b.etaMinutes);
    }
    // 'recommended': direct target first, then default order
    return list.sort((a, b) => {
      if (a.isDirectTarget && !b.isDirectTarget) return -1;
      if (!a.isDirectTarget && b.isDirectTarget) return 1;
      return 0;
    });
  }, [offers, sortBy]);

  // Stage offer selection and navigate to Booking Details (Step 3 of 3)
  const handleConfirmBooking = () => {
    if (isBooking || !selectedOfferForModal) return;
    setIsBooking(true);

    const bookingId = `BK-${Date.now().toString().slice(-4)}`;
    const stagedBooking = {
      id: bookingId,
      jobId: activeJob.id,
      title: activeJob.title || `${activeJob.category} — ${activeJob.subService}`,
      category: activeJob.category || 'Plumbing',
      subService: activeJob.subService || 'Leak Repair',
      description: activeJob.description || '',
      location: activeJob.location || 'Flat 402, Skyline Residency, Bandra West, Mumbai',
      date: activeJob.dateLabel || 'Tomorrow',
      time: activeJob.timeLabel || '10:00 AM',
      dateTimeDisplay: `${activeJob.dateLabel || 'Tomorrow'} · ${activeJob.timeLabel || '10:00 AM'}`,
      worker: selectedOfferForModal.worker.name,
      workerId: selectedOfferForModal.worker.id,
      profession: selectedOfferForModal.worker.profession,
      workerAvatar: selectedOfferForModal.worker.avatarUrl,
      rating: selectedOfferForModal.worker.rating || 4.8,
      reviewsCount: selectedOfferForModal.worker.reviewsCount || 120,
      badges: selectedOfferForModal.worker.badges || ['Identity Checked', 'Skill Assessment Passed'],
      status: 'Pending Confirmation',
      amount: selectedOfferForModal.bidAmount,
      additionalCharges: null,
      totalAmount: selectedOfferForModal.bidAmount,
      eta: selectedOfferForModal.eta || '25 mins',
      photos: activeJob.photos || [],
      createdAt: new Date().toISOString(),
    };

    try {
      // Save staged active booking for Screen 7 review without committing to kaarya_bookings yet
      localStorage.setItem('kaarya_active_booking', JSON.stringify(stagedBooking));
    } catch (err) {
      console.warn('Storage error on staging booking:', err);
    }

    setTimeout(() => {
      setIsBooking(false);
      setSelectedOfferForModal(null);
      // Navigate to booking details (Step 3 of 3 review screen)
      navigate(`/bookings/${bookingId}`);
    }, 300);
  };

  return (
    <div className="bg-[#FAFBFF] font-body-md text-on-surface antialiased relative min-h-screen flex flex-col justify-between selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* AMBIENT AURORA BACKGROUND BLOBS */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-primary-fixed/20 to-secondary-fixed/15 blur-[140px]" />
        <div className="absolute top-1/3 -right-28 h-[480px] w-[480px] rounded-full bg-gradient-to-tl from-tertiary-fixed/20 to-surface-container-high/30 blur-[150px]" />
        <div className="absolute -bottom-24 left-1/3 h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-surface-container-lowest via-secondary-fixed-dim/15 to-primary-fixed-dim/15 blur-[160px]" />
      </div>

      {/* COMPACT KAARYA HEADER WITH ACTIVE "MY JOBS" NAVIGATION */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-[0_1px_6px_rgba(0,0,0,0.03)]">
        <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 sm:gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-container to-tertiary flex items-center justify-center text-on-primary shadow-sm group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[18px]">handshake</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-sm text-[17px] tracking-tight text-on-surface leading-none font-bold">
                  Kaarya
                </span>
                <span className="font-label-sm text-[10px] text-secondary font-semibold uppercase tracking-wider">
                  Verified Pros
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              <Link
                to="/"
                className="font-label-md text-on-surface-variant hover:text-on-surface hover:bg-slate-100/70 px-3 py-1.5 rounded-full transition-all duration-150"
              >
                Home
              </Link>
              <Link
                to="/professionals"
                className="font-label-md text-on-surface-variant hover:text-on-surface hover:bg-slate-100/70 px-3 py-1.5 rounded-full transition-all duration-150"
              >
                Find Professionals
              </Link>
              <Link
                to="/my-bookings"
                className="font-label-md bg-slate-100/90 text-primary font-bold px-3 py-1.5 rounded-full shadow-sm transition-all duration-150 flex items-center gap-1"
              >
                <span>My Jobs</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              </Link>
              <a
                href="/#how-it-works"
                className="font-label-md text-on-surface-variant hover:text-on-surface hover:bg-slate-100/70 px-3 py-1.5 rounded-full transition-all duration-150"
              >
                How It Works
              </a>
              <Link
                to="/worker-dashboard"
                className="font-label-md text-on-surface-variant hover:text-on-surface hover:bg-slate-100/70 px-3 py-1.5 rounded-full transition-all duration-150"
              >
                For Workers
              </Link>
              <a
                href="/#about"
                className="font-label-md text-on-surface-variant hover:text-on-surface hover:bg-slate-100/70 px-3 py-1.5 rounded-full transition-all duration-150"
              >
                About
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 bg-slate-100/80 px-2.5 py-1 rounded-full cursor-pointer hover:bg-slate-200/70 transition-colors">
              <span className="material-symbols-outlined text-secondary text-[16px]">location_on</span>
              <span className="font-label-sm text-on-surface font-semibold">Mumbai, MH</span>
              <span className="material-symbols-outlined text-on-surface-variant text-[14px]">expand_more</span>
            </div>
            <button
              aria-label="Notifications"
              type="button"
              className="relative p-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-slate-100 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
            </button>
            <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center cursor-pointer border border-primary/20">
              <span className="material-symbols-outlined text-[16px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 w-full pt-20 pb-16 min-h-[calc(100vh-64px)] flex justify-center">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* BREADCRUMB & HEADING */}
          <div className="mb-6">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-3">
              <Link
                to="/"
                className="font-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">home</span>
                <span>Home</span>
              </Link>
              <span className="text-outline-variant font-label-md">/</span>
              <Link
                to="/my-bookings"
                className="font-label-md text-on-surface-variant hover:text-primary transition-colors"
              >
                My Jobs
              </Link>
              <span className="text-outline-variant font-label-md">/</span>
              <span className="font-label-md text-on-surface font-semibold">Compare Offers</span>
            </nav>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="font-headline-lg text-on-surface tracking-tight text-3xl sm:text-[34px] font-bold">
                  Choose the Right Professional
                </h1>
                <p className="font-body-md text-on-surface-variant mt-1 text-sm sm:text-base">
                  Compare offers and find the right fit for your job.
                </p>
              </div>

              {/* Active request pill banner */}
              <div className="flex items-center gap-2 p-2 px-3.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-sm text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[11px] tracking-wide">
                  {activeJob.subService || 'Leak Repair'}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-secondary text-[14px]">pin_drop</span>
                  {activeJob.location || 'Bandra West, Mumbai'}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-medium">
                  {activeJob.budgetLabel || '₹500–₹1,500'}
                </span>
                <Link
                  to="/post-job"
                  className="ml-2 text-primary hover:underline font-semibold text-[11px]"
                >
                  Edit Request
                </Link>
              </div>
            </div>
          </div>

          {/* DEMO NOTICE BANNER */}
          <div className="mb-6 p-3 px-4 rounded-xl bg-amber-50/80 border border-amber-200/70 flex items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-700 text-[18px]">info</span>
              <span>
                <strong>Prototype Demonstration:</strong> Showing 6 verified local professional offers. All prices, arrival times, and bids are simulated for prototype evaluation.
              </span>
            </div>
            {activeJob.isDemoFallback && (
              <span className="hidden sm:inline-block text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                Default Sample Request
              </span>
            )}
          </div>

          {/* OFFERS TOOLBAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0b1c30] text-lg">
                {sortedOffers.length} Offers Received
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-label-sm text-[11px] font-bold">
                Competitive Bids
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 shadow-sm text-xs">
                <span className="text-slate-500 font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-bold text-[#0b1c30] outline-none cursor-pointer"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price_asc">Lowest Price</option>
                  <option value="rating_desc">Highest Rated</option>
                  <option value="eta_asc">Fastest Arrival</option>
                </select>
              </div>

              {/* Grid / Map Toggle */}
              <div className="flex items-center p-1 rounded-xl bg-slate-100/90 border border-slate-200/80">
                <button
                  type="button"
                  aria-label="Grid View"
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded-lg font-label-sm text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white text-primary font-bold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">grid_view</span>
                  <span>Grid View</span>
                </button>
                <button
                  type="button"
                  aria-label="Map View"
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1 rounded-lg font-label-sm text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    viewMode === 'map'
                      ? 'bg-white text-primary font-bold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">map</span>
                  <span>Map View</span>
                </button>
              </div>
            </div>
          </div>

          {/* VIEW MODE 1: 3-COLUMN × 2-ROW GRID (MATCHING SCREENSHOT) */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {sortedOffers.map((offer) => {
                const { worker } = offer;
                return (
                  <div
                    key={offer.id}
                    className={`bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_4px_24px_rgba(11,28,48,0.04)] border p-5 sm:p-6 flex flex-col justify-between hover:shadow-lg transition-all ${
                      offer.isDirectTarget
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-[#e2e8f0]/90 hover:border-primary/40'
                    }`}
                  >
                    <div>
                      {/* Top Row: Avatar & Status Pill */}
                      <div className="flex items-start justify-between gap-3 mb-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm shrink-0">
                            <img
                              src={worker.avatarUrl}
                              alt={worker.name}
                              className="w-full h-full object-cover"
                            />
                            {worker.verified && (
                              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-[10px]">check</span>
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <h3 className="font-bold text-[#0b1c30] text-base leading-snug">
                                {worker.name}
                              </h3>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">
                              {worker.profession}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {worker.area} • {worker.distance}
                            </p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                            offer.badgeVariant === 'primary'
                              ? 'bg-primary/10 text-primary border border-primary/20'
                              : offer.badgeVariant === 'purple'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : offer.badgeVariant === 'blue'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : offer.badgeVariant === 'amber'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : offer.badgeVariant === 'pink'
                              ? 'bg-pink-50 text-pink-700 border border-pink-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {offer.status}
                        </span>
                      </div>

                      {/* Rating & ETA Row */}
                      <div className="flex items-center gap-3 text-xs text-slate-600 mb-3 pb-3 border-b border-slate-100">
                        <span className="flex items-center gap-1 font-bold text-amber-600">
                          <span className="material-symbols-outlined text-amber-500 text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                          <span>{worker.rating}</span>
                          <span className="text-slate-400 font-normal">({worker.reviewsCount})</span>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1 font-medium text-slate-600">
                          <span className="material-symbols-outlined text-slate-400 text-[15px]">schedule</span>
                          <span>ETA: <strong>{offer.eta}</strong></span>
                        </span>
                      </div>

                      {/* Verification Chips */}
                      <div className="flex flex-wrap gap-1.5 mb-3.5">
                        {worker.identityVerified && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-emerald-600 text-[12px]">verified</span>
                            <span>ID Checked</span>
                          </span>
                        )}
                        {worker.tradeCertified && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-blue-600 text-[12px]">workspace_premium</span>
                            <span>Certified</span>
                          </span>
                        )}
                        {worker.isNewTalent && (
                          <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200 flex items-center gap-1">
                            <span className="material-symbols-outlined text-purple-600 text-[12px]">auto_awesome</span>
                            <span>ITI Gold Medal</span>
                          </span>
                        )}
                      </div>

                      {/* Proposal Quote */}
                      <div className="text-xs italic text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 leading-relaxed mb-4">
                        &ldquo;{offer.comment}&rdquo;
                      </div>
                    </div>

                    {/* Bottom Pricing & Actions */}
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-baseline justify-between mb-3">
                        <span className="text-xs text-slate-400 font-medium">Total Offer</span>
                        <div className="text-2xl font-black text-[#0b1c30] tracking-tight">
                          ₹{offer.bidAmount}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveProfileWorker(worker)}
                          className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-label-md text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">person</span>
                          <span>View Profile</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedOfferForModal(offer)}
                          className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-primary via-tertiary-container to-secondary text-white font-label-md text-xs font-bold shadow-md shadow-primary/20 hover:opacity-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Select Offer</span>
                          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW MODE 2: INTERACTIVE PROTOTYPE MAP */}
          {viewMode === 'map' && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-md bg-slate-100 mb-8 h-[520px]">
              {/* Map texture background */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAN-6BnlaufOt5pccYe6QTjO4kr8BKiXkZtOvG1ZGOZ5WSo5mL81BcO_D9f2wX6l_0eF1OYmvnmGUdQ9hEGQyXWlAoWzDqx-tueClspuSlmK4g-JXCPaV1ns9TN58lRn9AysMBJ_LK5VCyc4e-1HmBK6_JDv6rJLq9CV5-vbvk5Xp8c43bpXuhLex8iv01ERIyQUvcZUmKHPsB5UlOemQwDN6P3I1p01q_tL8zVGYiN8n3v7TSad1HGsQ')`,
                }}
              />

              {/* Pin 1: Rahul Sharma */}
              <div
                className="absolute top-[34%] left-[42%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
                onClick={() => setSelectedMapWorker(MOCK_WORKERS.find((w) => w.id === 'w-rahul'))}
              >
                <div className={`px-3 py-1.5 rounded-full font-bold text-xs shadow-lg flex items-center gap-1.5 transition-transform hover:scale-110 ${
                  selectedMapWorker.id === 'w-rahul' ? 'bg-primary text-white ring-4 ring-primary/30 scale-105' : 'bg-white text-slate-800 border'
                }`}>
                  <span className="material-symbols-outlined text-[14px]">plumbing</span>
                  <span>Rahul (₹650)</span>
                </div>
              </div>

              {/* Pin 2: Priya Nair */}
              <div
                className="absolute top-[24%] left-[60%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                onClick={() => setSelectedMapWorker(MOCK_WORKERS.find((w) => w.id === 'w-priya'))}
              >
                <div className={`px-3 py-1.5 rounded-full font-bold text-xs shadow-lg flex items-center gap-1.5 transition-transform hover:scale-110 ${
                  selectedMapWorker.id === 'w-priya' ? 'bg-primary text-white ring-4 ring-primary/30 scale-105' : 'bg-white text-slate-800 border'
                }`}>
                  <span className="material-symbols-outlined text-[14px] text-emerald-600">cleaning_services</span>
                  <span>Priya (₹750)</span>
                </div>
              </div>

              {/* Pin 3: Amit Kumar */}
              <div
                className="absolute top-[68%] left-[70%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                onClick={() => setSelectedMapWorker(MOCK_WORKERS.find((w) => w.id === 'w-amit'))}
              >
                <div className={`px-3 py-1.5 rounded-full font-bold text-xs shadow-lg flex items-center gap-1.5 transition-transform hover:scale-110 ${
                  selectedMapWorker.id === 'w-amit' ? 'bg-primary text-white ring-4 ring-primary/30 scale-105' : 'bg-white text-slate-800 border'
                }`}>
                  <span className="material-symbols-outlined text-[14px] text-amber-500">bolt</span>
                  <span>Amit (₹600)</span>
                </div>
              </div>

              {/* Pin 4: Vikram Patel */}
              <div
                className="absolute top-[72%] left-[30%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                onClick={() => setSelectedMapWorker(MOCK_WORKERS.find((w) => w.id === 'w-vikram'))}
              >
                <div className={`px-3 py-1.5 rounded-full font-bold text-xs shadow-lg flex items-center gap-1.5 transition-transform hover:scale-110 ${
                  selectedMapWorker.id === 'w-vikram' ? 'bg-primary text-white ring-4 ring-primary/30 scale-105' : 'bg-white text-slate-800 border'
                }`}>
                  <span className="material-symbols-outlined text-[14px] text-orange-500">handyman</span>
                  <span>Vikram (₹550)</span>
                </div>
              </div>

              {/* Pin 5: Sneha Kulkarni (Pulsing ITI Pro) */}
              <div
                className="absolute top-[52%] left-[48%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30"
                onClick={() => setSelectedMapWorker(MOCK_WORKERS.find((w) => w.id === 'w-sneha'))}
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-12 h-12 rounded-full bg-purple-500/30 animate-ping" />
                  <div className={`px-3.5 py-1.5 rounded-full font-bold text-xs shadow-xl flex items-center gap-1.5 transition-transform hover:scale-110 ${
                    selectedMapWorker.id === 'w-sneha' ? 'bg-purple-700 text-white ring-4 ring-purple-300 scale-105' : 'bg-white text-purple-900 border border-purple-200'
                  }`}>
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                    <span>Sneha (₹700)</span>
                  </div>
                </div>
              </div>

              {/* Pin 6: Rajesh Verma */}
              <div
                className="absolute top-[80%] left-[55%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                onClick={() => setSelectedMapWorker(MOCK_WORKERS.find((w) => w.id === 'w-rajesh'))}
              >
                <div className={`px-3 py-1.5 rounded-full font-bold text-xs shadow-lg flex items-center gap-1.5 transition-transform hover:scale-110 ${
                  selectedMapWorker.id === 'w-rajesh' ? 'bg-primary text-white ring-4 ring-primary/30 scale-105' : 'bg-white text-slate-800 border'
                }`}>
                  <span className="material-symbols-outlined text-[14px] text-pink-500">format_paint</span>
                  <span>Rajesh (₹800)</span>
                </div>
              </div>

              {/* Floating Map Technician Card */}
              {selectedMapWorker && (
                <div className="absolute bottom-4 left-4 right-4 md:right-auto md:left-6 md:w-[380px] z-30 p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl">
                  {(() => {
                    const offerMatch = offers.find((o) => o.workerId === selectedMapWorker.id) || offers[0];
                    return (
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={selectedMapWorker.avatarUrl}
                              alt={selectedMapWorker.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-1">
                                <span className="font-bold text-[#0b1c30] text-sm">
                                  {selectedMapWorker.name}
                                </span>
                                <span className="material-symbols-outlined text-primary text-[15px]">verified</span>
                              </div>
                              <p className="text-xs text-slate-500 font-medium">
                                {selectedMapWorker.profession}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                {selectedMapWorker.area} • ETA: {offerMatch.eta}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Offer</span>
                            <span className="font-bold text-lg text-primary">₹{offerMatch.bidAmount}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => setActiveProfileWorker(selectedMapWorker)}
                            className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                          >
                            View Profile
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedOfferForModal(offerMatch)}
                            className="flex-1 py-1.5 px-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold shadow-sm hover:opacity-95 transition-all"
                          >
                            Select Offer
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* EMERGING TALENT PROMOTIONAL BANNER */}
          <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 border border-purple-200/70 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-tertiary to-secondary text-white flex items-center justify-center shrink-0 shadow-md">
                <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px] tracking-wide uppercase">
                  Kaarya Fair Chance
                </span>
                <h3 className="font-headline-sm text-lg font-bold text-[#0b1c30] mt-1">
                  Discover Emerging Talent
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-2xl leading-relaxed">
                  Support top-ranking vocational institute graduates and ITI Gold Medalists like <strong>Sneha Kulkarni</strong>. All emerging talent bookings include Kaarya 100% Satisfaction Escrow Protection.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const sneha = MOCK_WORKERS.find((w) => w.id === 'w-sneha');
                if (sneha) setActiveProfileWorker(sneha);
              }}
              className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-white border border-purple-200 text-purple-900 hover:bg-purple-50 font-bold text-xs shadow-sm transition-all shrink-0 cursor-pointer"
            >
              View Sneha's Profile
            </button>
          </div>
        </div>
      </main>

      {/* CONFIRMATION MODAL DIALOG */}
      {selectedOfferForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                <h3 className="font-headline-sm text-base font-bold text-[#0b1c30]">
                  Confirm Offer Selection
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOfferForModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Selected Offer Summary */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedOfferForModal.worker.avatarUrl}
                  alt={selectedOfferForModal.worker.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-[#0b1c30] text-sm">
                    {selectedOfferForModal.worker.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedOfferForModal.worker.profession}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    ETA: {selectedOfferForModal.eta}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Fixed Quote</span>
                <span className="text-xl font-black text-primary">₹{selectedOfferForModal.bidAmount}</span>
              </div>
            </div>

            {/* Escrow and Prototype Notice */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">lock</span>
                <span>
                  <strong>Step 3 of 3 · Final Review:</strong> Proceeding will take you to Booking Details to review your service schedule, location, and price breakdown before final confirmation.
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedOfferForModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer transition-colors"
              >
                Change Selection
              </button>
              <button
                type="button"
                disabled={isBooking}
                onClick={handleConfirmBooking}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary via-tertiary-container to-secondary text-white text-xs font-bold shadow-md shadow-primary/20 hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isBooking ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                    <span>Proceeding...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to Booking Details</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WORKER PROFILE MODAL INTEGRATION */}
      <WorkerProfileModal
        worker={activeProfileWorker}
        isOpen={Boolean(activeProfileWorker)}
        onClose={() => setActiveProfileWorker(null)}
        selectedSlot="Today 2:30 PM"
      />

      {/* COMPACT WEBSITE FOOTER */}
      <footer className="relative z-10 w-full bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-container to-tertiary flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[16px]">handshake</span>
              </div>
              <span className="font-headline-sm text-sm font-bold text-on-surface">Kaarya</span>
              <span className="text-slate-300">|</span>
              <span className="text-xs text-slate-500">Where Skills Meet Opportunity</span>
            </div>
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600">
              <Link to="/professionals" className="hover:text-primary transition-colors">
                Find Professionals
              </Link>
              <a href="/#how-it-works" className="hover:text-primary transition-colors">
                How It Works
              </a>
              <Link to="/worker-dashboard" className="hover:text-primary transition-colors">
                For Workers
              </Link>
              <a href="/#safety-guidelines" className="hover:text-primary transition-colors">
                Trust &amp; Safety
              </a>
              <a href="/#privacy-policy" className="hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="/#terms-of-service" className="hover:text-primary transition-colors">
                Terms
              </a>
            </nav>
            <p className="text-[11px] text-slate-400">© 2025 Kaarya Technologies Pvt Ltd.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
