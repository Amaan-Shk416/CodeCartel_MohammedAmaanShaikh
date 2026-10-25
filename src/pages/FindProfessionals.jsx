import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MOCK_WORKERS } from '../data/mockData';
import WorkerProfileModal from '../components/workers/WorkerProfileModal';

const DEFAULT_VERIFICATION_FILTERS = {
  identityVerified: true,
  tradeCertified: true,
  skillAssessed: false,
  backgroundScreened: false,
};

export default function FindProfessionals() {
  const [searchParams] = useSearchParams();

  // Primary search & category state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

  // Toolbar dropdown filters
  const [selectedDistance, setSelectedDistance] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [selectedRating, setSelectedRating] = useState('all');

  // Sort & View mode
  const [sortBy, setSortBy] = useState('best_match');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'

  // Verification filters (More Filters Modal)
  // Applied filters dictate the active results, chips, and toolbar badge count
  const [appliedVerificationFilters, setAppliedVerificationFilters] = useState(DEFAULT_VERIFICATION_FILTERS);
  // Pending filters are isolated to the modal dialog until Apply or Reset is clicked
  const [pendingVerificationFilters, setPendingVerificationFilters] = useState(DEFAULT_VERIFICATION_FILTERS);
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);

  // Modals & previews
  const [activeModalWorker, setActiveModalWorker] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('Today 2:30 PM');

  // Map view selected worker (defaults to Sneha if available)
  const [selectedMapWorker, setSelectedMapWorker] = useState(
    () => MOCK_WORKERS.find((w) => w.id === 'w-sneha') || MOCK_WORKERS[0]
  );

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('kaarya_favorites');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Demo pagination toast for visual-only pagination buttons (pages 2-20)
  const [paginationToast, setPaginationToast] = useState(null);

  // Sync category & query params when URL changes during navigation
  const [prevParams, setPrevParams] = useState({
    category: searchParams.get('category'),
    q: searchParams.get('q'),
  });

  const currentCategoryParam = searchParams.get('category');
  const currentQueryParam = searchParams.get('q');

  if (currentCategoryParam !== prevParams.category || currentQueryParam !== prevParams.q) {
    setPrevParams({ category: currentCategoryParam, q: currentQueryParam });
    if (currentCategoryParam) {
      setSelectedCategory(currentCategoryParam.toLowerCase());
    }
    if (currentQueryParam) {
      setSearchQuery(currentQueryParam);
    }
  }

  // Persist favorites to localStorage
  const toggleFavorite = (workerId, e) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => {
      const updated = { ...prev, [workerId]: !prev[workerId] };
      try {
        localStorage.setItem('kaarya_favorites', JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
      return updated;
    });
  };

  // Keyboard shortcut to close more filters modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMoreFiltersOpen) {
        setPendingVerificationFilters(appliedVerificationFilters);
        setIsMoreFiltersOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMoreFiltersOpen, appliedVerificationFilters]);

  // Lock body scroll when more filters modal is open
  useEffect(() => {
    if (!isMoreFiltersOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isMoreFiltersOpen]);

  // Badge count on More Filters button (reflects APPLIED verification criteria count)
  const moreFiltersBadgeCount = useMemo(() => {
    return Object.values(appliedVerificationFilters).filter(Boolean).length;
  }, [appliedVerificationFilters]);

  // Filtered and sorted worker records (scoped strictly to the 6 featured Mumbai specialists)
  const featuredWorkers = useMemo(() => {
    return MOCK_WORKERS.filter(
      (w) => w.id && ['w-rahul', 'w-priya', 'w-amit', 'w-vikram', 'w-sneha', 'w-rajesh'].includes(w.id)
    );
  }, []);

  const filteredWorkers = useMemo(() => {
    return featuredWorkers
      .filter((worker) => {
        // 1. Text Search Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = worker.name?.toLowerCase().includes(q);
          const matchesTrade = worker.profession?.toLowerCase().includes(q);
          const matchesBio = worker.bio?.toLowerCase().includes(q);
          const matchesSkills = worker.skills?.some((s) => s.toLowerCase().includes(q));
          const matchesArea = worker.area?.toLowerCase().includes(q);
          if (!matchesName && !matchesTrade && !matchesBio && !matchesSkills && !matchesArea) {
            return false;
          }
        }

        // 2. Category Filter
        if (selectedCategory !== 'all') {
          const matchesCat = worker.category?.toLowerCase() === selectedCategory.toLowerCase();
          const matchesProfession = worker.profession?.toLowerCase().includes(selectedCategory.toLowerCase());
          if (!matchesCat && !matchesProfession) {
            return false;
          }
        }

        // 3. Distance Filter
        if (selectedDistance !== 'all') {
          const maxDist = parseFloat(selectedDistance);
          if (worker.distanceKm && worker.distanceKm > maxDist) {
            return false;
          }
        }

        // 4. Price Filter
        if (selectedPrice !== 'all') {
          const rate = worker.hourlyRate;
          if (selectedPrice === 'under_200' && rate >= 200) return false;
          if (selectedPrice === '200_500' && (rate < 200 || rate > 500)) return false;
          if (selectedPrice === '500_1000' && (rate < 500 || rate > 1000)) return false;
          if (selectedPrice === '1000_plus' && rate <= 1000) return false;
        }

        // 5. Availability Filter
        if (selectedAvailability !== 'all') {
          if (selectedAvailability === 'today' && !worker.availableToday && worker.availabilityKey !== 'today') {
            return false;
          }
          if (selectedAvailability === 'now' && worker.availabilityKey !== 'now') {
            return false;
          }
          if (selectedAvailability === 'weekend' && worker.availabilityKey !== 'weekend') {
            return false;
          }
        }

        // 6. Rating Filter
        if (selectedRating !== 'all') {
          const minRating = parseFloat(selectedRating);
          if (worker.rating < minRating) {
            return false;
          }
        }

        // 7. Verification Filters: Strict Conjunction (AND) logic
        // Every enabled criterion must be satisfied by the worker. Disabled criteria do NOT restrict filtering.
        const passesVerification = Object.entries(appliedVerificationFilters).every(
          ([criterion, isEnabled]) => !isEnabled || Boolean(worker[criterion])
        );
        if (!passesVerification) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.hourlyRate - b.hourlyRate;
        if (sortBy === 'price_desc') return b.hourlyRate - a.hourlyRate;
        if (sortBy === 'nearest') return (a.distanceKm || 99) - (b.distanceKm || 99);
        if (sortBy === 'rating_desc') return b.rating - a.rating;
        if (sortBy === 'available_soon') {
          const score = (w) => (w.availabilityKey === 'now' ? 3 : w.availableToday ? 2 : 1);
          return score(b) - score(a);
        }
        return 0; // default order
      });
  }, [
    featuredWorkers,
    searchQuery,
    selectedCategory,
    selectedDistance,
    selectedPrice,
    selectedAvailability,
    selectedRating,
    appliedVerificationFilters,
    sortBy,
  ]);

  // Open / Close More Filters Modal
  const handleOpenMoreFilters = () => {
    // Populate pending copy from current applied state
    setPendingVerificationFilters({ ...appliedVerificationFilters });
    setIsMoreFiltersOpen(true);
  };

  const handleCloseMoreFilters = () => {
    // Discard any unapplied pending checkbox changes
    setPendingVerificationFilters({ ...appliedVerificationFilters });
    setIsMoreFiltersOpen(false);
  };

  const handleTogglePendingVerification = (criterionKey) => {
    setPendingVerificationFilters((prev) => ({
      ...prev,
      [criterionKey]: !prev[criterionKey],
    }));
  };

  const handleApplyVerificationFilters = () => {
    // Commit pending changes to applied state
    setAppliedVerificationFilters({ ...pendingVerificationFilters });
    setIsMoreFiltersOpen(false);
  };

  const handleResetVerificationFilters = () => {
    // Restore default 2 checks to both pending and applied states
    setPendingVerificationFilters(DEFAULT_VERIFICATION_FILTERS);
    setAppliedVerificationFilters(DEFAULT_VERIFICATION_FILTERS);
    setIsMoreFiltersOpen(false);
  };

  // Dismiss an individual verification chip from the toolbar
  const handleDismissVerificationChip = (criterionKey) => {
    setAppliedVerificationFilters((prev) => ({
      ...prev,
      [criterionKey]: false,
    }));
    setPendingVerificationFilters((prev) => ({
      ...prev,
      [criterionKey]: false,
    }));
  };

  // Clear All filters button
  const handleClearAll = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDistance('all');
    setSelectedPrice('all');
    setSelectedAvailability('all');
    setSelectedRating('all');
    setAppliedVerificationFilters(DEFAULT_VERIFICATION_FILTERS);
    setPendingVerificationFilters(DEFAULT_VERIFICATION_FILTERS);
  };

  // Open worker modal for quick 2-column preview
  const handleOpenWorkerModal = (worker) => {
    setSelectedTimeSlot('Today 2:30 PM');
    setActiveModalWorker(worker);
  };

  // Visual-only pagination click handler for pages 2-20
  const handleVisualPageClick = (pageNum) => {
    setPaginationToast(
      `Demo showcase: Displaying the 6 featured Mumbai trade specialists. Additional 114 records are indexed in the live platform catalog (Page ${pageNum}).`
    );
    setTimeout(() => {
      setPaginationToast(null);
    }, 4000);
  };

  return (
    <div className="bg-background font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-primary min-h-screen relative overflow-x-hidden">
      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTAINER                                                */}
      {/* ------------------------------------------------------------- */}
      <main className="w-full pt-6 sm:pt-8 pb-16 bg-background min-h-screen relative overflow-hidden">
        {/* Ambient Aurora Glow Backdrops */}
        <div className="pointer-events-none absolute -top-40 left-1/3 w-[650px] h-[650px] rounded-full bg-gradient-to-tr from-[#FF1493]/10 via-[#8B00FF]/12 to-[#0080FF]/10 blur-[130px] -z-10"></div>
        <div className="pointer-events-none absolute top-[500px] -right-28 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#0080FF]/10 via-[#8B00FF]/8 to-[#FF1493]/10 blur-[140px] -z-10"></div>
        <div className="pointer-events-none absolute bottom-20 -left-20 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-tertiary/10 via-primary/8 to-secondary/10 blur-[120px] -z-10"></div>

        <div className="max-w-[1280px] w-full mx-auto px-6 lg:px-8 flex flex-col gap-6">
          {/* Section 1: Page Title & Subtitle */}
          <section className="flex flex-col items-center text-center max-w-3xl mx-auto pt-2">
            <h1 className="font-headline-lg text-[34px] sm:text-[40px] font-extrabold text-on-surface tracking-tight leading-tight">
              Find the Right Professional for Your Needs
            </h1>
            <p className="font-body-md text-on-surface-variant text-[15px] sm:text-[16px] mt-2">
              Discover skilled local professionals, compare services, and find the right person for your job.
            </p>
          </section>

          {/* Section 2: Single Wide Horizontal Search Bar & Category Chips */}
          <div className="w-full max-w-4xl mx-auto">
            <div className="relative rounded-2xl bg-surface-container-lowest/90 backdrop-blur-xl p-2.5 sm:p-3 border border-surface-container-high shadow-[0_12px_36px_-6px_rgba(59,73,223,0.08),0_4px_16px_-2px_rgba(225,29,116,0.05)]">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                {/* Search input */}
                <div className="md:col-span-6 flex items-center h-12 px-4 rounded-xl bg-surface-container-low/70 focus-within:bg-white focus-within:ring-2 focus-within:ring-tertiary/30 transition-all">
                  <span className="material-symbols-outlined text-secondary text-[22px] mr-3 shrink-0">search</span>
                  <input
                    className="w-full bg-transparent border-none outline-none font-body-md text-[14px] text-on-surface placeholder:text-on-surface-variant/80"
                    placeholder="Plumber, Electrician, Deep Cleaning, Painter..."
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      className="text-on-surface-variant hover:text-on-surface text-sm px-1.5"
                      onClick={() => setSearchQuery('')}
                      type="button"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Location selector */}
                <div className="md:col-span-3 flex items-center justify-between h-12 px-3.5 rounded-xl bg-surface-container-low/70 hover:bg-surface-container transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-primary text-[20px] shrink-0">location_on</span>
                    <span className="font-label-md text-[13px] font-semibold text-on-surface truncate">
                      Mumbai, Maharashtra
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">expand_more</span>
                </div>

                {/* Search Button */}
                <div className="md:col-span-3">
                  <button
                    className="w-full h-12 px-6 rounded-xl aurora-gradient-btn hover:opacity-95 text-white font-label-lg text-[14px] font-bold flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(225,29,116,0.28)] transition-transform active:scale-[0.98]"
                    type="button"
                    onClick={() => {
                      // Trigger visual focus or ensure filter evaluation
                    }}
                  >
                    <span className="material-symbols-outlined text-[20px]">search</span>
                    <span>Search Pros</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Category Selector Chips Row */}
            <div className="w-full overflow-x-auto pb-1 mt-3.5 no-scrollbar">
              <div className="flex items-center gap-2 justify-start md:justify-center min-w-max">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-full font-label-md text-[13px] font-bold flex items-center gap-1.5 transition-all ${
                    selectedCategory === 'all'
                      ? 'aurora-pill-active text-white shadow-[0_4px_12px_rgba(225,29,116,0.2)]'
                      : 'bg-surface-container-lowest/90 hover:bg-white text-on-surface border border-surface-container hover:text-primary hover:border-primary/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">apps</span>
                  <span>All Services</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('plumbing')}
                  className={`px-4 py-2 rounded-full font-label-md text-[13px] font-medium flex items-center gap-1.5 transition-all ${
                    selectedCategory === 'plumbing'
                      ? 'aurora-pill-active text-white font-bold shadow-[0_4px_12px_rgba(225,29,116,0.2)]'
                      : 'bg-surface-container-lowest/90 hover:bg-white text-on-surface border border-surface-container hover:text-primary hover:border-primary/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px] text-secondary">plumbing</span>
                  <span>Plumbing</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('electrical')}
                  className={`px-4 py-2 rounded-full font-label-md text-[13px] font-medium flex items-center gap-1.5 transition-all ${
                    selectedCategory === 'electrical'
                      ? 'aurora-pill-active text-white font-bold shadow-[0_4px_12px_rgba(225,29,116,0.2)]'
                      : 'bg-surface-container-lowest/90 hover:bg-white text-on-surface border border-surface-container hover:text-primary hover:border-primary/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px] text-amber-500">electrical_services</span>
                  <span>Electrical</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('cleaning')}
                  className={`px-4 py-2 rounded-full font-label-md text-[13px] font-medium flex items-center gap-1.5 transition-all ${
                    selectedCategory === 'cleaning'
                      ? 'aurora-pill-active text-white font-bold shadow-[0_4px_12px_rgba(225,29,116,0.2)]'
                      : 'bg-surface-container-lowest/90 hover:bg-white text-on-surface border border-surface-container hover:text-primary hover:border-primary/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px] text-emerald-600">cleaning_services</span>
                  <span>Cleaning</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('painting')}
                  className={`px-4 py-2 rounded-full font-label-md text-[13px] font-medium flex items-center gap-1.5 transition-all ${
                    selectedCategory === 'painting'
                      ? 'aurora-pill-active text-white font-bold shadow-[0_4px_12px_rgba(225,29,116,0.2)]'
                      : 'bg-surface-container-lowest/90 hover:bg-white text-on-surface border border-surface-container hover:text-primary hover:border-primary/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px] text-primary">format_paint</span>
                  <span>Painting</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('carpentry')}
                  className={`px-4 py-2 rounded-full font-label-md text-[13px] font-medium flex items-center gap-1.5 transition-all ${
                    selectedCategory === 'carpentry'
                      ? 'aurora-pill-active text-white font-bold shadow-[0_4px_12px_rgba(225,29,116,0.2)]'
                      : 'bg-surface-container-lowest/90 hover:bg-white text-on-surface border border-surface-container hover:text-primary hover:border-primary/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px] text-amber-700">carpenter</span>
                  <span>Carpentry</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('appliances')}
                  className={`px-4 py-2 rounded-full font-label-md text-[13px] font-medium flex items-center gap-1.5 transition-all ${
                    selectedCategory === 'appliances'
                      ? 'aurora-pill-active text-white font-bold shadow-[0_4px_12px_rgba(225,29,116,0.2)]'
                      : 'bg-surface-container-lowest/90 hover:bg-white text-on-surface border border-surface-container hover:text-primary hover:border-primary/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px] text-tertiary">home_repair_service</span>
                  <span>Appliance Repair</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('moving')}
                  className={`px-4 py-2 rounded-full font-label-md text-[13px] font-medium flex items-center gap-1.5 transition-all ${
                    selectedCategory === 'moving'
                      ? 'aurora-pill-active text-white font-bold shadow-[0_4px_12px_rgba(225,29,116,0.2)]'
                      : 'bg-surface-container-lowest/90 hover:bg-white text-on-surface border border-surface-container hover:text-primary hover:border-primary/30'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px] text-secondary">local_shipping</span>
                  <span>Moving</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Compact Sleek Horizontal Filter Toolbar & Active Chips */}
          <section className="rounded-2xl bg-surface-container-lowest/85 backdrop-blur-xl border border-surface-container-high/70 p-4 shadow-[0_4px_20px_-2px_rgba(99,102,241,0.04)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Filter Dropdowns */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Category dropdown */}
                <div className="relative">
                  <select
                    className="appearance-none bg-surface-container-low/70 hover:bg-surface-container pl-3 pr-8 py-2 rounded-xl text-on-surface font-label-md text-[13px] font-semibold border-none outline-none cursor-pointer transition-colors"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="cleaning">Deep Cleaning</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="painting">Painting</option>
                    <option value="appliances">Appliance Repair</option>
                    <option value="moving">Moving</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-2.5 text-[18px] text-on-surface-variant pointer-events-none">
                    expand_more
                  </span>
                </div>

                {/* Distance dropdown */}
                <div className="relative">
                  <select
                    className="appearance-none bg-surface-container-low/70 hover:bg-surface-container pl-3 pr-8 py-2 rounded-xl text-on-surface font-label-md text-[13px] font-semibold border-none outline-none cursor-pointer transition-colors"
                    value={selectedDistance}
                    onChange={(e) => setSelectedDistance(e.target.value)}
                  >
                    <option value="all">Distance: Any Distance</option>
                    <option value="2">Distance: Within 2 km</option>
                    <option value="5">Distance: Within 5 km</option>
                    <option value="10">Distance: Within 10 km</option>
                    <option value="25">Distance: Within 25 km</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-2.5 text-[18px] text-on-surface-variant pointer-events-none">
                    expand_more
                  </span>
                </div>

                {/* Price dropdown */}
                <div className="relative">
                  <select
                    className="appearance-none bg-surface-container-low/70 hover:bg-surface-container pl-3 pr-8 py-2 rounded-xl text-on-surface font-label-md text-[13px] font-semibold border-none outline-none cursor-pointer transition-colors"
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                  >
                    <option value="all">Price: Any Range</option>
                    <option value="under_200">Under ₹200 / hr</option>
                    <option value="200_500">₹200 – ₹500 / hr</option>
                    <option value="500_1000">₹500 – ₹1,000 / hr</option>
                    <option value="1000_plus">₹1,000+ / hr</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-2.5 text-[18px] text-on-surface-variant pointer-events-none">
                    expand_more
                  </span>
                </div>

                {/* Availability dropdown */}
                <div className="relative">
                  <select
                    className="appearance-none bg-surface-container-low/70 hover:bg-surface-container pl-3 pr-8 py-2 rounded-xl text-on-surface font-label-md text-[13px] font-semibold border-none outline-none cursor-pointer transition-colors"
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                  >
                    <option value="all">Anytime</option>
                    <option value="today">Available: Today</option>
                    <option value="now">Available: Now (Instant)</option>
                    <option value="weekend">Available: This Weekend</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-2.5 text-[18px] text-on-surface-variant pointer-events-none">
                    expand_more
                  </span>
                </div>

                {/* Rating dropdown */}
                <div className="relative">
                  <select
                    className="appearance-none bg-surface-container-low/70 hover:bg-surface-container pl-3 pr-8 py-2 rounded-xl text-on-surface font-label-md text-[13px] font-semibold border-none outline-none cursor-pointer transition-colors"
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                  >
                    <option value="all">Rating: Any</option>
                    <option value="4.5">Rating: 4.5+ Stars</option>
                    <option value="4.0">Rating: 4.0+ Stars</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 top-2.5 text-[18px] text-on-surface-variant pointer-events-none">
                    expand_more
                  </span>
                </div>

                {/* More Filters Button with dynamic badge count */}
                <button
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-low/70 hover:bg-surface-container text-on-surface font-label-md text-[13px] font-semibold transition-colors"
                  id="open-more-filters-btn"
                  type="button"
                  onClick={handleOpenMoreFilters}
                >
                  <span className="material-symbols-outlined text-[18px] text-tertiary">tune</span>
                  <span>More Filters</span>
                  <span className="w-5 h-5 rounded-full bg-primary-fixed text-primary font-bold text-[11px] flex items-center justify-center">
                    {moreFiltersBadgeCount}
                  </span>
                </button>
              </div>

              {/* Active Filter Chips & Clear All */}
              <div className="flex flex-wrap items-center gap-2">
                {selectedDistance !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-[11px] font-semibold">
                    Within {selectedDistance} km
                    <button
                      className="hover:text-primary transition-colors text-[13px] ml-0.5"
                      onClick={() => setSelectedDistance('all')}
                      type="button"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {selectedAvailability !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-[11px] font-semibold">
                    {selectedAvailability === 'today'
                      ? 'Available Today'
                      : selectedAvailability === 'now'
                      ? 'Available Now'
                      : 'This Weekend'}
                    <button
                      className="hover:text-primary transition-colors text-[13px] ml-0.5"
                      onClick={() => setSelectedAvailability('all')}
                      type="button"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {selectedPrice !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-[11px] font-semibold">
                    {selectedPrice === 'under_200'
                      ? 'Under ₹200'
                      : selectedPrice === '200_500'
                      ? '₹200–₹500'
                      : selectedPrice === '500_1000'
                      ? '₹500–₹1,000'
                      : '₹1,000+'}
                    <button
                      className="hover:text-primary transition-colors text-[13px] ml-0.5"
                      onClick={() => setSelectedPrice('all')}
                      type="button"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {selectedRating !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-[11px] font-semibold">
                    {selectedRating}+ Stars
                    <button
                      className="hover:text-primary transition-colors text-[13px] ml-0.5"
                      onClick={() => setSelectedRating('all')}
                      type="button"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {/* Applied Verification Chips (Derived strictly from applied state) */}
                {appliedVerificationFilters.identityVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-[11px] font-semibold">
                    Aadhaar Verified
                    <button
                      className="hover:text-primary transition-colors text-[13px] ml-0.5"
                      onClick={() => handleDismissVerificationChip('identityVerified')}
                      type="button"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {appliedVerificationFilters.tradeCertified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-[11px] font-semibold">
                    Trade Certified
                    <button
                      className="hover:text-primary transition-colors text-[13px] ml-0.5"
                      onClick={() => handleDismissVerificationChip('tradeCertified')}
                      type="button"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {appliedVerificationFilters.skillAssessed && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-[11px] font-semibold">
                    Skill Score 90%+
                    <button
                      className="hover:text-primary transition-colors text-[13px] ml-0.5"
                      onClick={() => handleDismissVerificationChip('skillAssessed')}
                      type="button"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {appliedVerificationFilters.backgroundScreened && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-[11px] font-semibold">
                    Police Verified
                    <button
                      className="hover:text-primary transition-colors text-[13px] ml-0.5"
                      onClick={() => handleDismissVerificationChip('backgroundScreened')}
                      type="button"
                    >
                      ✕
                    </button>
                  </span>
                )}

                <button
                  className="font-label-sm text-[12px] font-bold text-primary hover:underline ml-1"
                  type="button"
                  onClick={handleClearAll}
                >
                  Clear All
                </button>
              </div>
            </div>
          </section>

          {/* Section 4: Results Header, Sort & Grid/Map View Switcher */}
          <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="font-headline-md text-[22px] sm:text-[24px] font-bold text-on-surface">
                  Professionals Near You
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-surface-container-low text-secondary font-label-sm text-[11px] font-bold">
                  {filteredWorkers.length === 6
                    ? '120 verified professionals'
                    : `${filteredWorkers.length} matching specialists`}
                </span>
              </div>
              <p className="font-body-sm text-[13px] text-on-surface-variant mt-0.5">
                Find the right skills for your next job.
              </p>
            </div>

            {/* Sort & Grid/Map View Switcher */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest border border-surface-container shadow-sm">
                <span className="font-label-sm text-[12px] text-on-surface-variant">Sort:</span>
                <select
                  className="bg-transparent font-label-sm text-[12px] font-bold text-on-surface outline-none cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="best_match">Best Skill Match</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="nearest">Nearest First</option>
                  <option value="available_soon">Available Soon</option>
                  <option value="rating_desc">Highest Rated</option>
                </select>
              </div>

              <div className="flex items-center p-0.5 rounded-full bg-surface-container-low border border-surface-container">
                <button
                  aria-label="Grid View"
                  className={`px-3.5 py-1.5 rounded-full font-label-sm text-[12px] flex items-center gap-1.5 transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-secondary font-bold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface font-semibold'
                  }`}
                  onClick={() => setViewMode('grid')}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">grid_view</span>
                  <span>Grid</span>
                </button>

                <button
                  aria-label="Map View"
                  className={`px-3.5 py-1.5 rounded-full font-label-sm text-[12px] flex items-center gap-1.5 transition-all ${
                    viewMode === 'map'
                      ? 'bg-white text-secondary font-bold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface font-semibold'
                  }`}
                  onClick={() => setViewMode('map')}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">map</span>
                  <span>Map View</span>
                </button>
              </div>
            </div>
          </section>

          {/* Section 5: Minimal, Visual-First Worker Cards Grid (3 Columns Desktop) */}
          {viewMode === 'grid' && (
            <>
              {filteredWorkers.length === 0 ? (
                <div className="py-16 text-center rounded-2xl bg-surface-container-lowest border border-surface-container">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">person_search</span>
                  <h3 className="font-headline-sm text-lg font-bold text-on-surface">No professionals match all criteria</h3>
                  <p className="text-sm text-on-surface-variant mt-1 max-w-md mx-auto">
                    Try relaxing your verification filters or widening your distance and price preferences.
                  </p>
                  <button
                    onClick={handleClearAll}
                    className="mt-4 px-4 py-2 rounded-xl aurora-gradient-btn text-white text-xs font-bold"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="grid-view-section">
                  {filteredWorkers.map((worker) => {
                    const isFavorited = Boolean(favorites[worker.id]);
                    const isSnehaNewTalent = worker.isNewTalent || worker.id === 'w-sneha';

                    return (
                      <article
                        key={worker.id}
                        className={`worker-card group relative flex flex-col rounded-2xl bg-surface-container-lowest overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
                          isSnehaNewTalent
                            ? 'border-2 border-primary/30 shadow-[0_12px_32px_-6px_rgba(225,29,116,0.15)] hover:shadow-[0_20px_40px_-6px_rgba(225,29,116,0.22)]'
                            : 'border border-surface-container-high/60 shadow-[0_4px_20px_-2px_rgba(99,102,241,0.05)] hover:shadow-[0_16px_36px_-6px_rgba(59,73,223,0.12)]'
                        }`}
                        onClick={() => handleOpenWorkerModal(worker)}
                      >
                        {/* New Talent Aurora Banner Badge for Sneha */}
                        {isSnehaNewTalent && (
                          <div className="absolute top-3 left-3 z-20">
                            <span className="px-2.5 py-1 rounded-full aurora-pill-active text-white font-label-sm text-[10.5px] font-extrabold tracking-wide uppercase shadow-md flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
                              <span>New Talent</span>
                            </span>
                          </div>
                        )}

                        {/* Portrait Image (~62% height) */}
                        <div className="relative w-full h-64 overflow-hidden bg-surface-container-high">
                          <img
                            alt={`${worker.name} portrait`}
                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            src={worker.avatarUrl}
                            loading="lazy"
                          />

                          {/* Heart favorite toggle floating on top right */}
                          <button
                            aria-label={`Save ${worker.name} to favorites`}
                            className={`favorite-heart absolute top-3 right-3 w-9 h-9 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center transition-all shadow-sm z-10 ${
                              isFavorited
                                ? 'text-primary bg-white'
                                : 'text-on-surface-variant hover:text-primary hover:bg-white'
                            }`}
                            type="button"
                            onClick={(e) => toggleFavorite(worker.id, e)}
                          >
                            <span
                              className="material-symbols-outlined text-[18px]"
                              style={{ fontVariationSettings: isFavorited ? "'FILL' 1" : "'FILL' 0" }}
                            >
                              favorite
                            </span>
                          </button>

                          {/* Availability pill bottom left */}
                          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md font-label-sm text-[11px] font-bold text-emerald-700 flex items-center gap-1.5 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>{worker.availabilityText || 'Available today'}</span>
                          </div>
                        </div>

                        {/* Info Zone Below Image */}
                        <div
                          className={`p-4 flex flex-col justify-between flex-grow ${
                            isSnehaNewTalent ? 'bg-gradient-to-b from-primary-fixed/5 to-transparent' : ''
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-headline-sm text-[18px] font-bold text-on-surface group-hover:text-primary transition-colors">
                                  {worker.name}
                                </h3>
                                <p className="font-body-sm text-[13px] text-on-surface-variant">
                                  {worker.profession}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 text-[12.5px] font-body-sm text-on-surface-variant mt-2">
                              <span className="font-bold text-amber-500 flex items-center">
                                <span
                                  className="material-symbols-outlined text-[15px] fill-current mr-0.5"
                                  style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                  star
                                </span>
                                {worker.rating}
                              </span>
                              <span>({worker.reviewsCount} reviews)</span>
                              <span>•</span>
                              <span className="text-on-surface-variant/80">{worker.distance}</span>
                            </div>
                          </div>

                          {/* Price & Explicit View Profile Action */}
                          <div className="flex items-baseline justify-between pt-4 mt-3 border-t border-surface-container">
                            <div>
                              <span className="font-body-sm text-[11px] uppercase tracking-wider text-on-surface-variant block font-medium">
                                Starting
                              </span>
                              <span className="font-headline-sm text-[16px] font-extrabold text-on-surface">
                                From ₹{worker.hourlyRate}{' '}
                                <span className="font-body-sm text-[12px] font-normal text-on-surface-variant">
                                  / {worker.rateUnit || 'hr'}
                                </span>
                              </span>
                            </div>

                            {/* Explicit View Profile button opens modal preview */}
                            <button
                              type="button"
                              className="font-label-md text-[13px] font-bold text-primary group-hover:translate-x-1 transition-transform flex items-center gap-0.5 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenWorkerModal(worker);
                              }}
                            >
                              <span>View Profile</span>
                              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </section>
              )}
            </>
          )}

          {/* Section 6: Interactive Proximity Map View */}
          {viewMode === 'map' && (
            <section
              className="w-full rounded-2xl overflow-hidden bg-surface-container-lowest border border-surface-container-high p-4 shadow-[0_12px_36px_-6px_rgba(59,73,223,0.08)]"
              id="map-view-section"
            >
              <div className="flex items-center justify-between pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[22px]">explore</span>
                  <span className="font-headline-sm text-[16px] font-bold text-on-surface">
                    Interactive Proximity Map
                  </span>
                  <span className="text-[12px] text-on-surface-variant hidden sm:inline">
                    • Click pins to preview professionals
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-label-sm text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{filteredWorkers.length} Active Specialists Nearby</span>
                </span>
              </div>

              <div className="relative w-full h-[520px] rounded-xl overflow-hidden bg-surface-container-high border border-surface-container">
                {/* Stylized Map Background */}
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAN-6BnlaufOt5pccYe6QTjO4kr8BKiXkZtOvG1ZGOZ5WSo5mL81BcO_D9f2wX6l_0eF1OYmvnmGUdQ9hEGQyXWlAoWzDqx-tueClspuSlmK4g-JXCPaV1ns9TN58lRn9AysMBJ_LK5VCyc4e-1HmBK6_JDv6rJLq9CV5-vbvk5Xp8c43bpXuhLex8iv01ERIyQUvcZUmKHPsB5UlOemQwDN6P3I1p01q_tL8zVGYiN8n3v7TSad1HGsQ')`,
                  }}
                ></div>

                {/* MAP PIN 1: Rahul */}
                <div
                  className="absolute top-[32%] left-[42%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                  onClick={() => {
                    const w = MOCK_WORKERS.find((item) => item.id === 'w-rahul');
                    if (w) setSelectedMapWorker(w);
                  }}
                >
                  <div className="px-3 py-1.5 rounded-full bg-secondary text-white font-label-sm text-[12px] font-bold shadow-lg hover:scale-110 transition-transform flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">plumbing</span>
                    <span>Rahul (₹250/h)</span>
                  </div>
                </div>

                {/* MAP PIN 2: Priya */}
                <div
                  className="absolute top-[22%] left-[64%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                  onClick={() => {
                    const w = MOCK_WORKERS.find((item) => item.id === 'w-priya');
                    if (w) setSelectedMapWorker(w);
                  }}
                >
                  <div className="px-3 py-1.5 rounded-full bg-white text-on-surface font-label-sm text-[12px] font-bold shadow-lg hover:scale-110 transition-transform flex items-center gap-1.5 border border-surface-container">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">cleaning_services</span>
                    <span>Priya (₹200/r)</span>
                  </div>
                </div>

                {/* MAP PIN 3: Amit */}
                <div
                  className="absolute top-[68%] left-[72%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                  onClick={() => {
                    const w = MOCK_WORKERS.find((item) => item.id === 'w-amit');
                    if (w) setSelectedMapWorker(w);
                  }}
                >
                  <div className="px-3 py-1.5 rounded-full bg-white text-on-surface font-label-sm text-[12px] font-bold shadow-lg hover:scale-110 transition-transform flex items-center gap-1.5 border border-surface-container">
                    <span className="material-symbols-outlined text-[14px] text-amber-500">electrical_services</span>
                    <span>Amit (₹300/h)</span>
                  </div>
                </div>

                {/* MAP PIN 4: Sneha (Selected Aurora Glow Pin) */}
                <div
                  className="absolute top-[52%] left-[34%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
                  onClick={() => {
                    const w = MOCK_WORKERS.find((item) => item.id === 'w-sneha');
                    if (w) setSelectedMapWorker(w);
                  }}
                >
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-14 h-14 rounded-full bg-primary/30 animate-ping"></span>
                    <div className="relative px-3.5 py-2 rounded-full aurora-pill-active text-white font-label-sm text-[12px] font-extrabold shadow-xl flex items-center gap-1.5 hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                      <span>Sneha (Top 5% • ₹220)</span>
                    </div>
                  </div>
                </div>

                {/* Floating Map Preview Card */}
                {selectedMapWorker && (
                  <div className="absolute bottom-4 left-4 right-4 md:right-auto md:left-6 md:w-[380px] z-30 p-4 rounded-2xl bg-white/95 backdrop-blur-xl border border-surface-container-high shadow-[0_20px_48px_-6px_rgba(15,23,42,0.18)]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 ring-2 ring-primary/40">
                          <img
                            alt={selectedMapWorker.name}
                            className="w-full h-full object-cover"
                            src={selectedMapWorker.avatarUrl}
                          />
                          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-1 ring-white"></span>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-label-lg text-[14px] font-bold text-on-surface truncate">
                              {selectedMapWorker.name}
                            </span>
                            <span
                              className="material-symbols-outlined text-primary text-[16px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              verified
                            </span>
                          </div>
                          <span className="font-body-sm text-[12px] text-on-surface-variant truncate">
                            {selectedMapWorker.profession}
                          </span>
                          <span className="font-label-sm text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {selectedMapWorker.availabilityText || 'Available Today'} • {selectedMapWorker.distance}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-label-sm text-[10px] uppercase font-bold text-primary">From</span>
                        <div className="font-headline-sm text-[16px] font-extrabold text-on-surface">
                          ₹{selectedMapWorker.hourlyRate}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-surface-container">
                      <button
                        type="button"
                        onClick={() => handleOpenWorkerModal(selectedMapWorker)}
                        className="py-2 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-[12px] font-bold transition-colors text-center cursor-pointer"
                      >
                        View Profile
                      </button>
                      <button
                        className="py-2 px-3 rounded-xl aurora-gradient-btn text-white font-label-md text-[12px] font-bold shadow-md hover:opacity-95 transition-transform active:scale-95 text-center"
                        type="button"
                        onClick={() => handleOpenWorkerModal(selectedMapWorker)}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Section 7: Fair Opportunity Discovery Banner */}
          <section className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-surface-container-lowest/90 backdrop-blur-xl border border-surface-container-high shadow-[0_8px_30px_rgba(59,73,223,0.06)] mt-2">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary-fixed/20 via-tertiary-fixed/25 to-secondary-fixed/20 opacity-60"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4 max-w-2xl">
                <div className="w-12 h-12 rounded-xl aurora-gradient-btn flex items-center justify-center text-white shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-[11px] font-extrabold uppercase tracking-wider text-primary">
                      Kaarya Equity Discovery
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    <span className="font-label-sm text-[11px] text-on-surface-variant font-medium">
                      Merit-First Platform
                    </span>
                  </div>
                  <h3 className="font-headline-sm text-[20px] font-bold text-on-surface mt-1">
                    Discover New Talent
                  </h3>
                  <p className="font-body-md text-[14px] text-on-surface-variant mt-1">
                    Explore skilled professionals building their reputation. Compare relevant skills, work samples, and
                    verified qualifications—not just review counts.
                  </p>
                </div>
              </div>

              <button
                className="shrink-0 px-6 py-3 rounded-full aurora-gradient-btn text-white font-label-md text-[13px] font-bold shadow-[0_6px_20px_rgba(225,29,116,0.25)] hover:opacity-95 transition-all flex items-center gap-2"
                type="button"
                onClick={() => {
                  // Spotlight rising talent like Sneha
                  setSelectedCategory('appliances');
                  const snehaWorker = MOCK_WORKERS.find((w) => w.id === 'w-sneha');
                  if (snehaWorker) {
                    handleOpenWorkerModal(snehaWorker);
                  }
                }}
              >
                <span>Explore New Professionals</span>
                <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
              </button>
            </div>
          </section>

          {/* Section 8: Pagination Bar & Demo Data Scoping */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-1">
            <span className="font-body-sm text-[13px] text-on-surface-variant">
              Displaying 1–{filteredWorkers.length} of 120 verified trade professionals
            </span>

            <div className="flex items-center gap-1.5">
              {/* Left Chevron (Disabled on Page 1) */}
              <button
                className="w-9 h-9 rounded-full bg-surface-container-low text-outline flex items-center justify-center cursor-not-allowed opacity-50"
                disabled
                type="button"
                aria-label="Previous page"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>

              {/* Page 1 (Active Functional Page) */}
              <button
                className="w-9 h-9 rounded-full aurora-pill-active text-white font-label-md text-xs font-bold shadow-sm"
                type="button"
                aria-current="page"
              >
                1
              </button>

              {/* Pages 2, 3, ..., 20: Approved Stitch visual-only controls */}
              <button
                className="w-9 h-9 rounded-full bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-xs font-semibold transition-colors"
                type="button"
                onClick={() => handleVisualPageClick(2)}
              >
                2
              </button>
              <button
                className="w-9 h-9 rounded-full bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-xs font-semibold transition-colors"
                type="button"
                onClick={() => handleVisualPageClick(3)}
              >
                3
              </button>

              <span className="px-1 text-on-surface-variant text-xs font-bold">...</span>

              <button
                className="w-9 h-9 rounded-full bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-xs font-semibold transition-colors"
                type="button"
                onClick={() => handleVisualPageClick(20)}
              >
                20
              </button>

              {/* Right Chevron */}
              <button
                className="w-9 h-9 rounded-full bg-surface-container-lowest hover:bg-surface-container text-on-surface flex items-center justify-center transition-colors shadow-sm"
                type="button"
                aria-label="Next page"
                onClick={() => handleVisualPageClick(2)}
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Inline Demo Pagination Toast Notice */}
          {paginationToast && (
            <div className="mx-auto max-w-lg p-3 rounded-xl bg-surface-container-high border border-primary/20 text-on-surface text-xs flex items-center gap-2 shadow-md animate-fade-in">
              <span className="material-symbols-outlined text-primary text-[18px]">info</span>
              <span>{paginationToast}</span>
            </div>
          )}
        </div>
      </main>

        {/* ------------------------------------------------------------- */}
      {/* Section 9: 2-Column Aurora Glassmorphism Worker Profile Modal  */}
      {/* ------------------------------------------------------------- */}
      <WorkerProfileModal
        worker={activeModalWorker}
        isOpen={Boolean(activeModalWorker)}
        onClose={() => setActiveModalWorker(null)}
        selectedSlot={selectedTimeSlot}
        onSelectSlot={setSelectedTimeSlot}
      />

      {/* ------------------------------------------------------------- */}
      {/* Section 10: More Filters Modal (Verification Criteria)        */}
      {/* ------------------------------------------------------------- */}
      {isMoreFiltersOpen && (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          id="more-filters-modal"
          role="dialog"
          onClick={handleCloseMoreFilters}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-surface-container-high flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-surface-container">
              <h3 className="font-headline-sm text-[18px] font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">tune</span>
                <span>More Verification Filters</span>
              </h3>
              <button
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
                id="close-filters-modal-btn"
                type="button"
                onClick={handleCloseMoreFilters}
              >
                ✕
              </button>
            </div>

            {/* Checkboxes List (Updates PENDING state only) */}
            <div className="flex flex-col gap-3 py-1">
              {/* Criterion 1: Identity Verified */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  checked={pendingVerificationFilters.identityVerified}
                  className="w-4 h-4 rounded text-secondary focus:ring-secondary cursor-pointer"
                  type="checkbox"
                  onChange={() => handleTogglePendingVerification('identityVerified')}
                />
                <div>
                  <span className="font-label-md text-[13px] font-semibold text-on-surface block">
                    Identity Checked (Aadhaar Verified)
                  </span>
                  <span className="text-[11px] text-on-surface-variant">Biometric Aadhaar match confirmed</span>
                </div>
              </label>

              {/* Criterion 2: Trade Certified */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  checked={pendingVerificationFilters.tradeCertified}
                  className="w-4 h-4 rounded text-secondary focus:ring-secondary cursor-pointer"
                  type="checkbox"
                  onChange={() => handleTogglePendingVerification('tradeCertified')}
                />
                <div>
                  <span className="font-label-md text-[13px] font-semibold text-on-surface block">
                    Trade Qualification &amp; Certifications
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    ITI or recognized vocational accreditation
                  </span>
                </div>
              </label>

              {/* Criterion 3: Skill Assessed */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  checked={pendingVerificationFilters.skillAssessed}
                  className="w-4 h-4 rounded text-secondary focus:ring-secondary cursor-pointer"
                  type="checkbox"
                  onChange={() => handleTogglePendingVerification('skillAssessed')}
                />
                <div>
                  <span className="font-label-md text-[13px] font-semibold text-on-surface block">
                    Hands-on Skill Assessment Passed
                  </span>
                  <span className="text-[11px] text-on-surface-variant">Standardized practical trade score 90%+</span>
                </div>
              </label>

              {/* Criterion 4: Background Screened */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  checked={pendingVerificationFilters.backgroundScreened}
                  className="w-4 h-4 rounded text-secondary focus:ring-secondary cursor-pointer"
                  type="checkbox"
                  onChange={() => handleTogglePendingVerification('backgroundScreened')}
                />
                <div>
                  <span className="font-label-md text-[13px] font-semibold text-on-surface block">
                    Background Screening Completed
                  </span>
                  <span className="text-[11px] text-on-surface-variant">Clean criminal and civil record check</span>
                </div>
              </label>
            </div>

            {/* Actions: Reset and Apply Filters */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container">
              <button
                className="px-4 py-2 rounded-xl text-on-surface-variant font-label-md text-xs font-semibold hover:text-on-surface transition-colors"
                id="reset-filters-btn"
                type="button"
                onClick={handleResetVerificationFilters}
              >
                Reset
              </button>
              <button
                className="px-5 py-2.5 rounded-xl aurora-gradient-btn text-white font-label-md text-xs font-bold shadow-md hover:opacity-95 transition-opacity"
                id="apply-filters-btn"
                type="button"
                onClick={handleApplyVerificationFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Section 11: Dedicated Polished Aurora Footer                  */}
      {/* ------------------------------------------------------------- */}
      <footer className="w-full bg-surface-container-lowest border-t border-surface-container-high/60 mt-12">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-surface-container">
            {/* Feature 1 */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low/50">
              <div className="w-11 h-11 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[24px]">verified_user</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-lg text-[13px] text-on-surface font-bold">
                  100% Aadhaar &amp; Skill Verified
                </span>
                <span className="font-body-sm text-[12px] text-on-surface-variant">
                  Strict bio-metric identity and trade evaluation.
                </span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low/50">
              <div className="w-11 h-11 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[24px]">lock</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-lg text-[13px] text-on-surface font-bold">Secure Escrow Payments</span>
                <span className="font-body-sm text-[12px] text-on-surface-variant">
                  Funds released only upon verified completion of job.
                </span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low/50">
              <div className="w-11 h-11 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
                <span className="material-symbols-outlined text-[24px]">support_agent</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-lg text-[13px] text-on-surface font-bold">24/7 Citizen Support</span>
                <span className="font-body-sm text-[12px] text-on-surface-variant">
                  Dedicated regional redressal in 12 languages.
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg aurora-gradient-btn flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[15px]">handyman</span>
              </div>
              <span className="font-headline-sm text-[15px] font-bold text-on-surface">Kaarya</span>
              <span className="font-body-sm text-[12px] text-on-surface-variant ml-2">
                © 2025 Kaarya Hyperlocal Platform Ltd. All rights reserved.
              </span>
            </div>

            <div className="flex items-center gap-6">
              <a
                className="font-label-md text-[12px] text-on-surface-variant hover:text-on-surface transition-colors"
                href="#privacy"
              >
                Privacy Policy
              </a>
              <a
                className="font-label-md text-[12px] text-on-surface-variant hover:text-on-surface transition-colors"
                href="#terms"
              >
                Terms of Service
              </a>
              <a
                className="font-label-md text-[12px] text-on-surface-variant hover:text-on-surface transition-colors"
                href="#safety"
              >
                Safety Guidelines
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
