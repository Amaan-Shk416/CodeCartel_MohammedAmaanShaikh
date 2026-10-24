import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_WORKERS } from '../data/mockData';
import WorkerProfileModal from '../components/workers/WorkerProfileModal';

// Seeded demonstration photos matching the Stitch design reference
const DEMO_JOB_PHOTOS = [
  {
    id: 'demo-photo-1',
    name: 'Kitchen sink pipe leak photo 1',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMVO0dD6MSybDZBbDrBV6pop2lnW78XwAnNtkE6Nrwwcvk1FG3vT7eFOSJzsQpD8qh_VRqa8AvfPuSuadKFcCj8uLo-N0Sk8WRVgwoGXpxI9i08uvq73s1AcGxzD8bRxJnZ_4OEwKSB8VMCSwvjT6jtPAdcy6zNCvowSQfUPiPe4_tVhZkjexuRkLHdAr9vSHumxLPwbmKWxq9ChLxu6cxm8gc76a799efZYgeUU_mIjG1ml0XFstYYg',
    alt: 'Kitchen sink pipe leak photo 1',
  },
  {
    id: 'demo-photo-2',
    name: 'Kitchen sink pipe leak photo 2',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYaaD00gc8PmY_R4x84yckkIuKagPe1MaUgboUneW0cXWNPcX3yBuXTBYc4UKXjSMDuIpVykxuq5V512SbISw_Jdx1ENthdztsX7__pVRnVGWi4Cp1oenpYdhhbq5we38pAvdsKMk_-3qY-1jORwS1ub-dbT2Ap9_aLZ0n5wJMpjlQeFGqsGSb2ODvqHgYW23b8tearXbLxAQ41wKh5iJGHzu0mt4YguSEfbKXaGqOPwyA2IG-q4bsVw',
    alt: 'Kitchen sink pipe leak photo 2',
  },
];

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Selected worker profile modal state
  const [activeProfileWorker, setActiveProfileWorker] = useState(null);
  // Full-size photo viewer modal state
  const [activePhotoViewerIndex, setActivePhotoViewerIndex] = useState(null);

  // Confirmation flow state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // 1. Resolve Booking Context Dynamically
  const resolvedBooking = useMemo(() => {
    // A. Check active/staged booking in localStorage
    try {
      const activeRaw = localStorage.getItem('kaarya_active_booking');
      if (activeRaw) {
        const active = JSON.parse(activeRaw);
        if (active && (!id || active.id === id)) {
          return active;
        }
      }
    } catch (err) {
      console.warn('Error reading kaarya_active_booking:', err);
    }

    // B. Check confirmed bookings list in localStorage
    try {
      const listRaw = localStorage.getItem('kaarya_bookings');
      if (listRaw) {
        const list = JSON.parse(listRaw);
        if (Array.isArray(list)) {
          const found = list.find((b) => b && b.id === id);
          if (found) return found;
        }
      }
    } catch (err) {
      console.warn('Error reading kaarya_bookings:', err);
    }

    // C. Verify BK-101 fallback: Only retained for the verified seeded demonstration ID
    if (id === 'BK-101') {
      const defaultWorker = MOCK_WORKERS.find((w) => w.id === 'w-rahul') || MOCK_WORKERS[0];
      return {
        id: 'BK-101',
        jobId: 'JOB-DEMO-LEAK',
        title: 'Emergency Kitchen Sink Pipe Leakage',
        category: 'Plumbing',
        subService: 'Leak Repair',
        description: 'Kitchen sink pipe is leaking beneath the counter. Looking for someone to inspect and repair the joint.',
        location: 'Bandra West, Mumbai',
        date: 'Tomorrow',
        time: '10:00 AM',
        dateTimeDisplay: 'Tomorrow · 10:00 AM',
        workerId: defaultWorker.id,
        worker: defaultWorker.name,
        profession: 'Master Plumber',
        workerAvatar: defaultWorker.avatarUrl,
        rating: defaultWorker.rating,
        reviewsCount: defaultWorker.reviewsCount,
        badges: ['Identity Checked', 'Skill Assessment Passed'],
        status: 'In Progress', // Seeded demo in MyBookings is already In Progress
        amount: 650,
        additionalCharges: null,
        totalAmount: 650,
        eta: '25 mins',
        photos: DEMO_JOB_PHOTOS,
        isSeededDemo: true,
        createdAt: '2026-10-24T18:00:00.000Z',
      };
    }

    // D. Unknown ID -> Return null to trigger the branded Booking Not Found recovery view
    return null;
  }, [id]);

  // 2. Resolve Associated Job Data for Enriching Service Details
  const associatedJob = useMemo(() => {
    if (!resolvedBooking?.jobId) return null;
    try {
      const raw = localStorage.getItem('kaarya_posted_jobs');
      if (raw) {
        const jobs = JSON.parse(raw);
        if (Array.isArray(jobs)) {
          return jobs.find((j) => j && j.id === resolvedBooking.jobId) || null;
        }
      }
    } catch (err) {
      console.warn('Error reading kaarya_posted_jobs:', err);
    }
    return null;
  }, [resolvedBooking]);

  // 3. Resolve Worker Details from MOCK_WORKERS
  const professional = useMemo(() => {
    if (!resolvedBooking) return null;
    return (
      MOCK_WORKERS.find((w) => w.id === resolvedBooking.workerId || w.name === resolvedBooking.worker) ||
      MOCK_WORKERS[0]
    );
  }, [resolvedBooking]);

  // Sync confirmation state if booking is already confirmed
  const isAlreadyConfirmed = useMemo(() => {
    if (!resolvedBooking) return false;
    return resolvedBooking.status === 'In Progress' || resolvedBooking.status === 'Completed';
  }, [resolvedBooking]);

  // Auto-scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Display Fields
  const displayId = resolvedBooking?.id || id || 'BK-101';
  const displayWorkerName = resolvedBooking?.worker || professional?.name || 'Professional';
  const displayProfession = resolvedBooking?.profession || professional?.profession || 'Verified Specialist';
  const displayAvatar = resolvedBooking?.workerAvatar || professional?.avatarUrl;
  const displayRating = resolvedBooking?.rating || professional?.rating || 4.8;
  const displayReviewsCount = resolvedBooking?.reviewsCount || professional?.reviewsCount || 120;
  const displayCategory = resolvedBooking?.category || associatedJob?.category || 'Plumbing';
  const displaySubService = resolvedBooking?.subService || associatedJob?.subService || 'Leak Repair';
  const displayServiceTitle = `${displayCategory} — ${displaySubService}`;
  const displayLocation = resolvedBooking?.location || associatedJob?.location || 'Bandra West, Mumbai';
  const displayDate = resolvedBooking?.date || associatedJob?.dateLabel || 'Tomorrow';
  const displayTime = resolvedBooking?.time || associatedJob?.timeLabel || '10:00 AM';
  const displayAppointmentLine = `${displayDate} · ${displayTime}`;
  const displayDescription =
    resolvedBooking?.description ||
    associatedJob?.description ||
    'Kitchen sink pipe is leaking beneath the counter.';
  const displayAmount = resolvedBooking?.amount ?? 650;
  const displayAdditional = resolvedBooking?.additionalCharges ? `₹${resolvedBooking.additionalCharges}` : 'Not specified';
  const displayTotal = resolvedBooking?.totalAmount ?? displayAmount;
  const displayPhotos =
    (resolvedBooking?.photos && resolvedBooking.photos.length > 0)
      ? resolvedBooking.photos
      : (associatedJob?.photos && associatedJob.photos.length > 0)
      ? associatedJob.photos
      : DEMO_JOB_PHOTOS;

  // Handle Definitive Confirmation
  const handleConfirmBooking = () => {
    if (isSubmitting || isConfirmed || isAlreadyConfirmed || !resolvedBooking) return;
    setIsSubmitting(true);

    const confirmedBooking = {
      ...resolvedBooking,
      status: 'In Progress',
      confirmedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      try {
        // 1. Update kaarya_active_booking with In Progress status
        localStorage.setItem('kaarya_active_booking', JSON.stringify(confirmedBooking));

        // 2. Commit to kaarya_bookings with strict deduplication (one record per ID)
        const rawBookings = localStorage.getItem('kaarya_bookings');
        const existingList = rawBookings ? JSON.parse(rawBookings) : [];
        const deduplicated = [
          confirmedBooking,
          ...existingList.filter((b) => b && b.id !== confirmedBooking.id),
        ];
        localStorage.setItem('kaarya_bookings', JSON.stringify(deduplicated));

        // 3. Update associated job status in kaarya_posted_jobs to 'Offer Accepted'
        if (confirmedBooking.jobId) {
          const rawJobs = localStorage.getItem('kaarya_posted_jobs');
          if (rawJobs) {
            const jobs = JSON.parse(rawJobs);
            const updatedJobs = jobs.map((j) => {
              if (j && j.id === confirmedBooking.jobId) {
                return {
                  ...j,
                  status: 'Offer Accepted',
                  acceptedOffer: {
                    workerId: confirmedBooking.workerId,
                    workerName: confirmedBooking.worker,
                    amount: confirmedBooking.amount,
                    confirmedAt: confirmedBooking.confirmedAt,
                  },
                };
              }
              return j;
            });
            localStorage.setItem('kaarya_posted_jobs', JSON.stringify(updatedJobs));
          }
        }
      } catch (err) {
        console.warn('Storage update error on booking confirmation:', err);
      }

      setIsSubmitting(false);
      setIsConfirmed(true);

      // 4. Smoothly navigate to My Bookings after celebration delay
      setTimeout(() => {
        navigate('/my-bookings');
      }, 900);
    }, 1200);
  };

  // 4. SAFE FALLBACK / RECOVERY STATE (When ID is unknown and not seeded)
  if (!resolvedBooking) {
    return (
      <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between">
        {/* Navigation Header */}
        <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface/90 backdrop-blur-xl border-b border-slate-100 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-container via-primary to-secondary flex items-center justify-center shadow-[0_4px_14px_rgba(225,29,116,0.25)] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-on-primary text-[22px]">handyman</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md text-on-surface tracking-tight leading-none font-bold">
                  Kaarya
                </span>
                <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase leading-none mt-1">
                  hyperlocal
                </span>
              </div>
            </Link>
            <Link
              to="/my-bookings"
              className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 font-label-md text-xs font-semibold"
            >
              My Bookings
            </Link>
          </div>
        </header>

        <main className="w-full pt-28 pb-16 px-4 flex items-center justify-center flex-grow">
          <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm text-center flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">search_off</span>
            </div>
            <div>
              <h1 className="font-headline-sm text-xl font-bold text-on-surface">
                Booking Not Found
              </h1>
              <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                We could not locate an active or confirmed booking matching ID <code className="bg-slate-100 px-1.5 py-0.5 rounded text-primary font-mono">{id || 'unknown'}</code>. It may have expired or not been saved.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 w-full pt-2">
              <Link
                to="/compare-offers"
                className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-white font-bold text-xs shadow-sm hover:opacity-95 transition-all text-center"
              >
                Compare Offers
              </Link>
              <Link
                to="/my-bookings"
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors text-center"
              >
                View My Bookings
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* 1. FIXED TOP HEADER WITH BRANDING & NAVIGATION */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface/90 backdrop-blur-xl border-b border-slate-100/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo & Location Pill */}
          <div className="flex items-center gap-6 sm:gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-container via-primary to-secondary flex items-center justify-center shadow-[0_4px_14px_rgba(225,29,116,0.25)] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-on-primary text-[22px]">handyman</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md text-on-surface tracking-tight leading-none font-bold">
                  Kaarya
                </span>
                <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase leading-none mt-1">
                  hyperlocal
                </span>
              </div>
            </Link>

            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
              <span className="material-symbols-outlined text-secondary text-[18px]">location_on</span>
              <span className="font-label-md text-label-md text-on-surface font-medium">Mumbai, MH</span>
              <span className="material-symbols-outlined text-outline text-[16px]">keyboard_arrow_down</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className="px-3.5 py-1.5 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface rounded-full transition-colors"
            >
              Home
            </Link>
            <Link
              to="/professionals"
              className="px-3.5 py-1.5 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface rounded-full transition-colors"
            >
              Find Professionals
            </Link>
            <Link
              to="/my-bookings"
              className="bg-primary-container text-on-primary-container font-label-lg rounded-full px-3.5 py-1.5 shadow-[0_4px_12px_rgba(225,29,116,0.2)] flex items-center gap-1.5"
            >
              <span>My Jobs</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </Link>
            <a
              href="/#how-it-works"
              className="px-3.5 py-1.5 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface rounded-full transition-colors"
            >
              How It Works
            </a>
            <Link
              to="/worker-dashboard"
              className="px-3.5 py-1.5 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface rounded-full transition-colors"
            >
              For Workers
            </Link>
            <a
              href="/#about"
              className="px-3.5 py-1.5 font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface rounded-full transition-colors"
            >
              About
            </a>
          </nav>

          {/* Notifications & User Profile */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-all relative shadow-[0_2px_6px_rgba(0,0,0,0.02)] border border-slate-100"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary-container ring-2 ring-surface-container-lowest" />
            </button>
            <div className="flex items-center gap-2 pl-1">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-secondary to-tertiary flex items-center justify-center text-on-secondary font-label-md text-label-md shadow-[0_2px_8px_rgba(57,71,221,0.25)] font-bold">
                KP
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN PAGE BODY WITH AURORA GLOWS */}
      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-140px)] flex-grow">
        <div className="flex flex-col w-full relative overflow-hidden">
          {/* Subtle Aurora Radial Ambient Glows matching Stitch Reference */}
          <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-primary-fixed/20 via-tertiary-fixed/30 to-secondary-fixed/20 blur-3xl pointer-events-none -z-10 rounded-full" />
          <div className="absolute top-96 right-10 w-[500px] h-[500px] bg-gradient-to-bl from-secondary-fixed/30 via-tertiary-fixed/20 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full">
            {/* Breadcrumb & Minimal Step Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
              <div className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant">
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <span className="text-outline-variant">/</span>
                <Link to="/my-bookings" className="hover:text-primary transition-colors text-secondary font-medium">
                  My Jobs
                </Link>
                <span className="text-outline-variant">/</span>
                <Link
                  to={associatedJob?.id ? `/compare-offers?jobId=${associatedJob.id}` : '/compare-offers'}
                  className="hover:text-primary transition-colors"
                >
                  Compare Offers
                </Link>
                <span className="text-outline-variant">/</span>
                <span className="text-on-surface font-semibold">Booking Details</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                Step 3 of 3 · Booking Details {displayId && <span className="font-mono text-outline">({displayId})</span>}
              </span>
            </div>

            {/* Clean Header Section */}
            <div className="flex flex-col mb-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                  Complete Your Booking
                </h1>
                {resolvedBooking.isSeededDemo && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">info</span>
                    Seeded Demo Record (BK-101)
                  </span>
                )}
                {isAlreadyConfirmed && !resolvedBooking.isSeededDemo && (
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">verified</span>
                    Confirmed &amp; Scheduled
                  </span>
                )}
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Review the details before confirming your service.
              </p>
            </div>

            {/* TWO-COLUMN MASTER GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* LEFT COLUMN (~62%) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                {/* 2A. SELECTED PROFESSIONAL CARD */}
                <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-[#E2E8F0] p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start transition-shadow hover:shadow-md">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-surface-container border border-slate-100">
                    <img
                      src={displayAvatar}
                      alt={`${displayWorkerName} portrait`}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="flex flex-col flex-grow min-w-0 w-full">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-snug">
                          {displayWorkerName}
                        </h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {displayProfession}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveProfileWorker(professional)}
                        className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors flex items-center gap-0.5 cursor-pointer font-semibold"
                      >
                        <span>View Profile</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    </div>

                    {/* Star Rating and Reviews */}
                    <div className="flex items-center gap-1.5 mt-2 font-label-md text-label-md text-on-surface">
                      <span
                        className="material-symbols-outlined text-primary text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span className="font-bold">{displayRating}</span>
                      <span className="text-on-surface-variant font-normal">({displayReviewsCount} reviews)</span>
                    </div>

                    {/* Verification Tags matching Stitch Reference */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-semibold">
                        <span className="material-symbols-outlined text-[13px]">badge</span>
                        Identity Checked
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold">
                        <span className="material-symbols-outlined text-[13px]">verified_user</span>
                        Skill Assessment Passed
                      </span>
                    </div>

                    {/* Appointment Scheduled Line */}
                    <div className="flex items-center gap-1.5 text-on-surface font-label-md text-label-md mt-3.5 pt-3 border-t border-surface-container">
                      <span className="material-symbols-outlined text-secondary text-[16px]">schedule</span>
                      <span className="font-semibold">{displayAppointmentLine}</span>
                    </div>
                  </div>
                </div>

                {/* 2B. SERVICE DETAILS CARD */}
                <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-[#E2E8F0] p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-2 border-b border-surface-container">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Service Details
                    </h2>
                    <Link
                      to={associatedJob?.id ? `/post-job?jobId=${associatedJob.id}` : '/post-job'}
                      className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors flex items-center gap-1 font-semibold"
                    >
                      <span className="material-symbols-outlined text-[14px]">edit</span>
                      <span>Edit</span>
                    </Link>
                  </div>

                  {/* 2-Column Key-Value Layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 py-1">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                        Service
                      </span>
                      <span className="font-body-md text-body-md text-on-surface font-medium">
                        {displayServiceTitle}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                        Location
                      </span>
                      <span className="font-body-md text-body-md text-on-surface font-medium">
                        {displayLocation}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                        Date
                      </span>
                      <span className="font-body-md text-body-md text-on-surface font-medium">
                        {displayDate}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                        Time
                      </span>
                      <span className="font-body-md text-body-md text-on-surface font-medium">
                        {displayTime}
                      </span>
                    </div>
                  </div>

                  {/* Description Section with Photos */}
                  <div className="flex flex-col gap-1.5 pt-3 border-t border-surface-container">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                      Description
                    </span>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      {displayDescription}
                    </p>

                    {/* Photos Preview Row */}
                    {displayPhotos && displayPhotos.length > 0 && (
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        {displayPhotos.slice(0, 3).map((photo, idx) => (
                          <button
                            key={photo.id || idx}
                            type="button"
                            onClick={() => setActivePhotoViewerIndex(idx)}
                            className="w-16 h-14 rounded-lg overflow-hidden bg-surface-container shadow-sm flex-shrink-0 border border-slate-200/80 hover:opacity-90 hover:scale-105 transition-all cursor-pointer"
                            title={photo.name || 'View photo'}
                          >
                            <img
                              src={photo.url}
                              alt={photo.alt || `Job photo ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setActivePhotoViewerIndex(0)}
                          className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors flex items-center gap-0.5 ml-1 font-semibold cursor-pointer"
                        >
                          <span>View Photos</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN (~38% Sticky) */}
              <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-28">
                {/* 2C. PRICE SUMMARY CARD */}
                <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-[#E2E8F0] p-6 flex flex-col gap-4">
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold pb-2 border-b border-surface-container">
                    Price Summary
                  </h2>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between font-body-md text-body-md">
                      <span className="text-on-surface-variant">Agreed Service Price</span>
                      <span className="text-on-surface font-semibold">₹{displayAmount}</span>
                    </div>
                    <div className="flex items-center justify-between font-body-md text-body-md">
                      <span className="text-on-surface-variant">Additional Charges</span>
                      <span className="text-on-surface-variant">{displayAdditional}</span>
                    </div>
                  </div>
                  <div className="h-px bg-surface-container w-full my-0.5" />
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Total Payable
                    </span>
                    <span className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
                      ₹{displayTotal}
                    </span>
                  </div>
                </div>

                {/* 2D. ACTIONS DIRECTLY BELOW PRICE SUMMARY */}
                <div className="flex flex-col items-center gap-3 pt-1">
                  {/* If booking is already confirmed, provide tracking CTA instead of re-confirming */}
                  {isAlreadyConfirmed ? (
                    <div className="w-full space-y-2.5">
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                        <span className="material-symbols-outlined text-emerald-600 text-[20px]">check_circle</span>
                        <div>
                          <strong className="block text-emerald-950 font-bold">Booking Confirmed &amp; Scheduled</strong>
                          <span>Your appointment is set. Track progress in My Bookings.</span>
                        </div>
                      </div>
                      <Link
                        to="/my-bookings"
                        className="w-full py-3.5 px-6 rounded-full bg-secondary text-white font-headline-sm text-base font-bold tracking-wide shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 text-center"
                      >
                        <span>View in My Bookings</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </Link>
                    </div>
                  ) : (
                    /* Definitive Pre-Confirmation Action */
                    <button
                      type="button"
                      id="confirm-booking-btn"
                      disabled={isSubmitting || isConfirmed}
                      onClick={handleConfirmBooking}
                      className={`w-full py-3.5 px-6 rounded-full font-headline-sm text-base font-bold tracking-wide shadow-[0_8px_24px_rgba(225,29,116,0.32)] hover:shadow-[0_12px_32px_rgba(109,58,214,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-wait text-white ${
                        isConfirmed
                          ? 'bg-secondary'
                          : 'bg-gradient-to-r from-primary-container via-tertiary to-secondary'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-1" />
                          <span>Scheduling {displayWorkerName}...</span>
                        </>
                      ) : isConfirmed ? (
                        <>
                          <span className="material-symbols-outlined text-[22px]">check_circle</span>
                          <span>Booking Confirmed!</span>
                        </>
                      ) : (
                        <>
                          <span>Confirm Booking</span>
                          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </>
                      )}
                    </button>
                  )}

                  <Link
                    to={associatedJob?.id ? `/compare-offers?jobId=${associatedJob.id}` : '/compare-offers'}
                    className="font-label-md text-label-md text-secondary hover:text-primary transition-colors py-1 flex items-center gap-1 font-semibold"
                  >
                    <span>← Back to Offers</span>
                  </Link>

                  <p className="font-body-sm text-body-sm text-outline text-center mt-0.5 leading-relaxed">
                    Confirm only after reviewing the service details and price.
                  </p>
                </div>
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

      {/* 4. REUSED WORKER PROFILE MODAL */}
      <WorkerProfileModal
        worker={activeProfileWorker}
        isOpen={Boolean(activeProfileWorker)}
        onClose={() => setActiveProfileWorker(null)}
        selectedSlot={displayAppointmentLine}
      />

      {/* 5. JOB PHOTOS LIGHTBOX VIEWER */}
      {activePhotoViewerIndex !== null && displayPhotos[activePhotoViewerIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/80 backdrop-blur-sm"
          onClick={() => setActivePhotoViewerIndex(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-4 shadow-2xl border border-slate-100 flex flex-col gap-3 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-headline-sm text-sm font-bold text-on-surface">
                {displayPhotos[activePhotoViewerIndex].name || `Photo ${activePhotoViewerIndex + 1} of ${displayPhotos.length}`}
              </span>
              <button
                type="button"
                onClick={() => setActivePhotoViewerIndex(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="w-full max-h-[70vh] rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
              <img
                src={displayPhotos[activePhotoViewerIndex].url}
                alt={displayPhotos[activePhotoViewerIndex].alt || 'Job photo'}
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
            {displayPhotos.length > 1 && (
              <div className="flex items-center justify-between pt-1 text-xs text-slate-500 font-medium">
                <button
                  type="button"
                  disabled={activePhotoViewerIndex === 0}
                  onClick={() => setActivePhotoViewerIndex((prev) => Math.max(0, prev - 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                >
                  Previous
                </button>
                <span>
                  {activePhotoViewerIndex + 1} / {displayPhotos.length}
                </span>
                <button
                  type="button"
                  disabled={activePhotoViewerIndex === displayPhotos.length - 1}
                  onClick={() => setActivePhotoViewerIndex((prev) => Math.min(displayPhotos.length - 1, prev + 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
