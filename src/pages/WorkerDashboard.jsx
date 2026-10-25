import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStorageItem, setStorageItem } from '../utils/storage';
import { MOCK_WORKERS } from '../data/mockData';
import WorkerProfileModal from '../components/workers/WorkerProfileModal';

/**
 * Featured nearby jobs matching the Stitch reference design
 */
const NEARBY_JOBS = [
  {
    id: 'NEAR-01',
    title: 'Pipe Leak Repair',
    icon: 'water_damage',
    iconBg: 'bg-primary-fixed/50 text-primary',
    distance: '1.2 km away',
    time: 'Today · 2:00 PM',
    budget: '₹500 – ₹800',
    area: 'Bandra West, Mumbai',
    customer: 'Kavita Patel',
    description: 'Kitchen sink pipe joint is leaking into cabinet. Needs gasket replacement and pipe realignment.',
  },
  {
    id: 'NEAR-02',
    title: 'Bathroom Tap Repair',
    icon: 'faucet',
    iconBg: 'bg-secondary-fixed/50 text-secondary',
    distance: '2.1 km away',
    time: 'Tomorrow · 10:00 AM',
    budget: '₹300 – ₹500',
    area: 'Khar West, Mumbai',
    customer: 'Rohan Verma',
    description: 'Quarter-turn washbasin mixer tap dripping continuously. Need cartridge replacement or washer fix.',
  },
  {
    id: 'NEAR-03',
    title: 'Electrical Switch Repair',
    icon: 'bolt',
    iconBg: 'bg-tertiary-fixed/50 text-tertiary',
    distance: '3.0 km away',
    time: 'Today · 4:00 PM',
    budget: '₹250 – ₹450',
    area: 'Santacruz West, Mumbai',
    customer: 'Meera Iyer',
    description: '2 heavy appliance switches in kitchen sparking when turned on. Urgent safety replacement.',
  },
];

export default function WorkerDashboard() {
  const navigate = useNavigate();

  // Find Rahul Sharma in mock workers
  const rahulWorker = MOCK_WORKERS.find((w) => w.id === 'w-rahul') || MOCK_WORKERS[0];

  // Worker availability state persisted to storage
  const [isAvailable, setIsAvailable] = useState(() => {
    return getStorageItem('kaarya_worker_available', true);
  });

  // Modal dialog states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showEarningsModal, setShowEarningsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync availability state to localStorage
  const handleToggleAvailability = () => {
    const nextState = !isAvailable;
    setIsAvailable(nextState);
    setStorageItem('kaarya_worker_available', nextState);
    showToast(nextState ? 'Status set to: Available for Work' : 'Status set to: Offline / In Job');
  };

  // Toast helper with auto-hide
  const showToast = (message) => {
    setToastMessage(message);
    window.clearTimeout(window.__dashboard_toast_timer);
    window.__dashboard_toast_timer = window.setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedJob(null);
        setShowEarningsModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased relative min-h-screen selection:bg-primary-fixed selection:text-primary">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary-fixed/30 blur-3xl" />
        <div className="absolute top-1/4 -right-40 w-[28rem] h-[28rem] rounded-full bg-secondary-fixed/35 blur-3xl" />
        <div className="absolute top-3/4 left-1/3 w-80 h-80 rounded-full bg-tertiary-fixed/25 blur-3xl" />
      </div>

      {/* Main Dashboard Body */}
      <main className="relative z-10 w-full pt-4 sm:pt-6 bg-transparent min-h-[calc(100vh-140px)]">
        <div className="flex flex-col w-full">
          {/* Dashboard Container Wrapper */}
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8 relative">
            
            {/* 1. WELCOME & AVAILABILITY HEADER */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-container-lowest p-5 sm:p-6 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100">
              <div className="flex flex-col gap-1">
                <h1 className="font-headline-lg text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface">
                  Good morning, Rahul!
                </h1>
                <p className="font-body-lg text-sm sm:text-base text-on-surface-variant">
                  Ready to find your next job?
                </p>
              </div>

              {/* Availability Box & Profile */}
              <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between sm:justify-end bg-surface-container-low p-2 px-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    {isAvailable && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                    )}
                    <span
                      className={`relative inline-flex rounded-full h-3 w-3 transition-colors ${
                        isAvailable ? 'bg-secondary' : 'bg-outline'
                      }`}
                    />
                  </span>
                  <span
                    className={`font-label-lg text-sm font-bold select-none ${
                      isAvailable ? 'text-on-surface' : 'text-outline font-medium'
                    }`}
                  >
                    {isAvailable ? 'Available for Work' : 'Offline / In Job'}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleToggleAvailability}
                    aria-label="Toggle availability status"
                    aria-pressed={isAvailable}
                    className={`w-12 h-6 rounded-full p-0.5 transition-all flex items-center shadow-sm ${
                      isAvailable
                        ? 'bg-gradient-to-r from-primary-container via-primary to-secondary justify-end'
                        : 'bg-surface-container-highest justify-start'
                    }`}
                  >
                    <div className="w-5 h-5 bg-surface-container-lowest rounded-full shadow-md transform transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowProfileModal(true)}
                    className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full group"
                    title="Click to view full Skill Profile"
                  >
                    <img
                      className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-surface-container-lowest group-hover:scale-105 transition-transform"
                      alt="Rahul Sharma"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkdTpMzpQatxBfFtKVUNEAq4BtfX63BE27XiFqqcQRmbK8S6-LXGBZJ6pXkBgrBmbFfxK0agHnoaKFXD1noebNv5eELooEQvUThwOYa_MX9g7CBtNBBUbtdTJl9mz4mE1G2kPhBmG38nQTtuKNF46IpZF0CLZeMiJ1EZgG4AIGN-cFgA3n4kh8cAkcSxSy1XAq3GSweknZMMjlyLEJ307MjVPBKXpyN-xiMFf-GNuTEO9RR1vtqetbmQ"
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* 2. MY NEXT JOB (FEATURED CARD) */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <h2 className="font-headline-md text-xl sm:text-2xl font-extrabold tracking-tight text-on-surface">
                  My Next Job
                </h2>
                <span className="px-3 py-1 rounded-full bg-primary-fixed text-primary font-label-sm text-[11px] font-bold uppercase tracking-wider">
                  Next Up
                </span>
              </div>

              <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_-2px_rgba(99,102,241,0.06),0_2px_6px_-1px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6 hover:shadow-[0_12px_32px_-4px_rgba(59,73,223,0.08),0_4px_12px_-2px_rgba(225,29,116,0.04)] transition-all">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-gradient-to-tr from-primary-container via-primary to-secondary text-on-primary flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="material-symbols-outlined text-[30px] sm:text-[34px]">plumbing</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-headline-md text-lg sm:text-xl font-bold text-on-surface">
                      Kitchen Leak Repair
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-on-surface-variant font-body-md text-xs sm:text-sm">
                      <div className="flex items-center gap-1 font-semibold text-primary">
                        <span className="material-symbols-outlined text-[18px]">schedule</span>
                        <span>Today · 10:00 AM</span>
                      </div>
                      <div className="flex items-center gap-1 text-secondary font-medium">
                        <span className="material-symbols-outlined text-[18px]">location_on</span>
                        <span>Bandra West · 2 km away</span>
                      </div>
                      <div className="flex items-center gap-1 text-outline">
                        <span className="material-symbols-outlined text-[18px]">person</span>
                        <span>Ananya Shah</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto pt-2 md:pt-0 border-t md:border-none border-slate-100">
                  <div className="flex flex-col md:items-end">
                    <span className="font-label-sm text-[11px] text-outline uppercase tracking-wider font-semibold">
                      Agreed Price
                    </span>
                    <span className="font-headline-lg text-2xl sm:text-3xl font-extrabold text-on-surface leading-tight">
                      ₹650
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/bookings/bk-101')}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-primary-container via-primary to-secondary text-on-primary font-label-lg text-xs sm:text-sm font-bold shadow-[0_4px_14px_rgba(225,29,116,0.3)] hover:shadow-[0_6px_20px_rgba(225,29,116,0.35)] hover:opacity-95 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <span>View Job</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. JOBS NEAR YOU */}
            <div className="flex flex-col gap-4">
              <div className="flex items-end justify-between">
                <div className="flex flex-col">
                  <h2 className="font-headline-md text-xl sm:text-2xl font-extrabold tracking-tight text-on-surface">
                    Jobs Near You
                  </h2>
                  <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
                    Choose a job that suits you.
                  </p>
                </div>
                <Link
                  to="/compare-offers"
                  className="font-label-lg text-xs sm:text-sm text-secondary hover:text-primary transition-colors flex items-center gap-1 font-bold group"
                >
                  <span>View All Jobs</span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>

              {/* 3 Scannable Job Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                {NEARBY_JOBS.map((job) => (
                  <div
                    key={job.id}
                    className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_-2px_rgba(99,102,241,0.06),0_2px_6px_-1px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 gap-4"
                  >
                    <div className="flex flex-col gap-2.5">
                      <div className={`w-12 h-12 rounded-xl ${job.iconBg} flex items-center justify-center`}>
                        <span className="material-symbols-outlined text-[26px]">{job.icon}</span>
                      </div>
                      <h3 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex flex-col gap-1 text-xs text-on-surface-variant">
                        <div className="flex items-center gap-1 text-secondary font-medium">
                          <span className="material-symbols-outlined text-[16px]">near_me</span>
                          <span>{job.distance}</span>
                        </div>
                        <div className="flex items-center gap-1 text-on-surface-variant font-medium">
                          <span className="material-symbols-outlined text-[16px]">schedule</span>
                          <span>{job.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 flex items-center justify-between border-t border-slate-50">
                      <div className="flex flex-col">
                        <span className="font-label-sm text-[10px] text-outline uppercase font-semibold">
                          Budget
                        </span>
                        <span className="font-headline-sm text-sm sm:text-base font-extrabold text-on-surface">
                          {job.budget}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedJob(job)}
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-primary-container via-primary to-secondary text-on-primary font-label-md text-xs font-bold shadow-sm hover:shadow-md hover:opacity-95 active:scale-95 transition-all"
                      >
                        View Job
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. BALANCED BOTTOM ROW (My Earnings & Your Profile) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
              
              {/* Left Card: My Earnings */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_-2px_rgba(99,102,241,0.06),0_2px_6px_-1px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                      My Earnings
                    </h3>
                    <span className="font-label-md text-xs text-outline font-medium">
                      This Week
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3 mt-1 sm:mt-2">
                    <span className="font-display-hero text-4xl sm:text-5xl font-extrabold text-on-surface leading-none">
                      ₹4,500
                    </span>
                    <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[11px] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">trending_up</span>
                      <span>+15% vs last week</span>
                    </span>
                  </div>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-50">
                  <span className="text-xs text-outline">
                    Direct daily payout to Bank of Baroda
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowEarningsModal(true)}
                    className="font-label-lg text-xs sm:text-sm text-secondary hover:text-primary transition-colors flex items-center gap-1 font-bold group self-start sm:self-auto"
                  >
                    <span>View Earnings</span>
                    <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Card: Your Profile */}
              <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_-2px_rgba(99,102,241,0.06),0_2px_6px_-1px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-2.5">
                  <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                    Your Profile
                  </h3>

                  <div className="flex items-center gap-3.5 mt-1">
                    <img
                      className="w-14 h-14 rounded-full object-cover shadow-sm ring-2 ring-primary-fixed cursor-pointer hover:scale-105 transition-transform"
                      alt="Rahul Sharma"
                      onClick={() => setShowProfileModal(true)}
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkdTpMzpQatxBfFtKVUNEAq4BtfX63BE27XiFqqcQRmbK8S6-LXGBZJ6pXkBgrBmbFfxK0agHnoaKFXD1noebNv5eELooEQvUThwOYa_MX9g7CBtNBBUbtdTJl9mz4mE1G2kPhBmG38nQTtuKNF46IpZF0CLZeMiJ1EZgG4AIGN-cFgA3n4kh8cAkcSxSy1XAq3GSweknZMMjlyLEJ307MjVPBKXpyN-xiMFf-GNuTEO9RR1vtqetbmQ"
                    />
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-base sm:text-lg font-extrabold text-on-surface">
                        Rahul Sharma
                      </span>
                      <span className="font-label-md text-xs sm:text-sm text-secondary font-semibold">
                        Master Plumber
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-surface-container-highest rounded-full h-2.5 overflow-hidden">
                      <div className="bg-secondary h-2.5 rounded-full" style={{ width: '90%' }} />
                    </div>
                    <span className="font-label-sm text-[11px] text-outline font-semibold whitespace-nowrap">
                      90% Complete
                    </span>
                  </div>

                  <span className="font-body-sm text-[13px] text-secondary font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    <span>Profile 90% Complete · Aadhaar Verified ✓</span>
                  </span>
                </div>

                <div className="pt-3 flex items-center justify-end border-t border-slate-50">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(true)}
                    className="px-4 sm:px-5 py-2 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-xs sm:text-sm font-bold transition-colors"
                  >
                    Update Profile
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      {/* 5. FOOTER MATCHING THE STITCH DESIGN SPECIFICATION */}
      <footer className="relative z-10 w-full bg-surface-container-lowest shadow-[0_-1px_12px_rgba(0,0,0,0.03)] border-t border-slate-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-container to-secondary flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined text-[18px]">handyman</span>
              </div>
              <span className="font-headline-sm text-lg font-bold text-on-surface">Kaarya</span>
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Where Skills Meet Opportunity
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm">
            <Link
              to="/professionals"
              className="font-label-md text-on-surface-variant hover:text-primary transition-colors"
            >
              Find Professionals
            </Link>
            <Link
              to="/#how-it-works"
              className="font-label-md text-on-surface-variant hover:text-primary transition-colors"
            >
              How It Works
            </Link>
            <Link
              to="/worker-dashboard"
              className="font-label-md text-primary font-bold transition-colors"
            >
              For Workers
            </Link>
            <span className="font-label-md text-on-surface-variant cursor-default">
              Trust &amp; Safety
            </span>
            <span className="font-label-md text-on-surface-variant cursor-default">
              Privacy
            </span>
            <span className="font-label-md text-on-surface-variant cursor-default">
              Terms
            </span>
          </div>

          <div className="font-body-sm text-xs text-outline text-center md:text-right">
            © 2025 Kaarya Inc. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Worker Profile Modal (Rahul Sharma Dossier) */}
      <WorkerProfileModal
        worker={rahulWorker}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

      {/* Quick Job Details Modal */}
      {selectedJob && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn"
        >
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-2xl border border-slate-100 shadow-2xl p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${selectedJob.iconBg} flex items-center justify-center shrink-0`}>
                  <span className="material-symbols-outlined text-[28px]">{selectedJob.icon}</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                    {selectedJob.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant">{selectedJob.area}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors text-sm"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-slate-700 bg-surface-container-low p-3.5 rounded-xl border border-slate-100 leading-relaxed">
              {selectedJob.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Schedule</span>
                <span className="font-semibold text-slate-800">{selectedJob.time}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl">
                <span className="text-slate-500 block text-[10px] uppercase font-bold">Budget Range</span>
                <span className="font-semibold text-primary">{selectedJob.budget}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedJob(null);
                  showToast(`Offer submitted for ${selectedJob.title}! Homeowner notified.`);
                }}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-primary-container via-primary to-secondary text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
              >
                Accept &amp; Send Bid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Earnings Breakdown Modal */}
      {showEarningsModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn"
        >
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl border border-slate-100 shadow-2xl p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">Weekly Earnings Report</h3>
                <p className="text-xs text-on-surface-variant">Rahul Sharma • Master Plumber</p>
              </div>
              <button
                type="button"
                onClick={() => setShowEarningsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors text-sm"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-baseline justify-between bg-surface-container-low p-4 rounded-xl border border-slate-100">
                <span className="text-sm font-semibold text-slate-700">Total Net Earnings</span>
                <span className="font-extrabold text-2xl text-on-surface">₹4,500</span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 px-1 pt-1">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Completed Jobs This Week</span>
                  <span className="font-bold text-slate-800">6 tasks</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Kaarya Platform Fee (Beta Promo)</span>
                  <span className="font-bold text-emerald-600">₹0 (0%)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Linked Payout Bank</span>
                  <span className="font-bold text-slate-800">Bank of Baroda •••• 4821</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Next Automated Transfer</span>
                  <span className="font-bold text-primary">Tomorrow at 6:00 AM</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowEarningsModal(false);
                showToast('Earnings statement sent to your registered phone.');
              }}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-primary-container via-primary to-secondary text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              Download Full Statement
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md text-xs font-semibold flex items-center gap-2 border border-slate-700/60 animate-bounce"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
