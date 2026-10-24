import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  WORK_SAMPLES,
  DEFAULT_PRO_BADGE,
  DEFAULT_PORTFOLIO_CAPTIONS,
} from '../../data/mockData';

const APPOINTMENT_SLOTS = ['Today 2:30 PM', 'Today 5:00 PM', 'Tomorrow 10 AM'];

/**
 * WorkerProfileModal
 * Displays an authentic Stitch-designed two-column dossier preview for trade specialists
 * Source of truth: designs/worker-profile-modal.html
 *
 * Restored with solid white and light card backgrounds, high-contrast dark navy typography,
 * subtle borders, and soft shadows matching the approved Stitch reference.
 */
export default function WorkerProfileModal({
  worker,
  isOpen,
  onClose,
  selectedSlot = 'Today 2:30 PM',
  onSelectSlot,
}) {
  const dialogRef = useRef(null);

  // Restore previous body overflow when modal closes or unmounts
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Keyboard Escape listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Focus modal container on open for keyboard accessibility
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen || !worker) return null;

  // Resolve dynamic demonstration data with safe fallbacks
  const proBadge = worker.proBadge || DEFAULT_PRO_BADGE;
  const tradeCert =
    worker.tradeCertification ||
    (worker.tradeCertified ? 'Trade Qualification Certified' : 'Skill Assessment Evaluated');
  const workHistory =
    worker.workHistoryCount ||
    (worker.experienceYears ? `${worker.experienceYears * 15}+ Completed Jobs` : '50+ Completed Jobs');
  const reliability =
    worker.reliabilityRecord ||
    `${worker.experienceYears || 5} Years in Trade • 99.2% on-time resolution • Zero complaint escalation`;
  const captions = worker.portfolioCaptions || DEFAULT_PORTFOLIO_CAPTIONS;
  const firstName = worker.name ? worker.name.split(' ')[0] : 'Professional';

  // Customer reviews resolution
  const reviewsList =
    worker.reviews && worker.reviews.length > 0
      ? worker.reviews
      : [
          {
            reviewer: 'Ananya Deshmukh',
            verified: true,
            timeAgo: '2 days ago',
            stars: 5,
            comment:
              '"Arrived right on time, diagnosed the issue within 10 minutes, and left everything spotless. Extremely polite and professional."',
          },
          {
            reviewer: 'Vikram Rao',
            verified: true,
            timeAgo: 'Last week',
            stars: 5,
            comment: '"Fair pricing upfront with zero hidden charges. Highly recommend their work!"',
          },
        ];

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-worker-name"
      id="worker-profile-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 transition-all focus:outline-none"
      onClick={handleBackdropClick}
    >
      {/* Modal Card Shell: Solid white opaque surface with subtle border and deep shadow */}
      <div
        className="relative w-full max-w-5xl rounded-3xl bg-white border border-surface-container shadow-[0_24px_70px_rgba(0,0,0,0.25),0_0_80px_rgba(225,29,116,0.15)] overflow-hidden transition-all transform scale-100 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          aria-label="Close modal"
          id="close-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container text-[#0b1c30] border border-surface-container flex items-center justify-center transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Aurora Top Ambient Ribbon */}
        <div className="h-2.5 w-full aurora-gradient-btn" />

        {/* Modal Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Identity, Bio, Skills, Portfolio & Reviews   */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col gap-6 bg-white border-b lg:border-b-0 lg:border-r border-surface-container">
            {/* Worker Header Card */}
            <div className="flex items-start gap-4">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 shadow-md ring-2 ring-primary/20 bg-surface-container">
                <img
                  alt={`${worker.name} portrait`}
                  id="modal-img"
                  src={worker.avatarUrl}
                  className="w-full h-full object-cover object-top"
                />
                <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>

              <div className="flex flex-col min-w-0 flex-grow">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2
                    id="modal-worker-name"
                    className="font-headline-md text-[24px] font-bold text-[#0b1c30] truncate"
                  >
                    {worker.name}
                  </h2>
                  <span
                    className="material-symbols-outlined text-primary text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full aurora-pill-active text-white font-label-sm text-[10.5px] font-extrabold uppercase tracking-wide shadow-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">{proBadge.icon}</span>
                    <span>{proBadge.text}</span>
                  </span>
                </div>

                <p
                  id="modal-title"
                  className="font-body-md text-[14px] text-slate-600 font-medium mt-0.5"
                >
                  {worker.profession}
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-2 text-[13px]">
                  <span className="flex items-center gap-1 font-bold text-amber-500">
                    <span
                      className="material-symbols-outlined text-[16px] fill-current"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span id="modal-rating">{worker.rating}</span>
                  </span>
                  <span id="modal-reviews" className="text-slate-600 font-medium">
                    ({worker.reviewsCount} verified reviews)
                  </span>
                  <span className="text-slate-400">•</span>
                  <span
                    id="modal-distance"
                    className="text-slate-600 flex items-center gap-0.5 font-medium"
                  >
                    <span className="material-symbols-outlined text-[14px] text-primary">location_on</span>{' '}
                    {worker.area ? `${worker.area}, Mumbai • ` : ''}
                    {worker.distance}
                  </span>
                </div>

                <div
                  id="modal-status-badge"
                  className="mt-2.5 self-start inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/50 text-emerald-700 font-label-sm text-[11px] font-bold"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span id="modal-avail">
                    {worker.availabilityText || 'Available Today'} (Next slot in 45 mins)
                  </span>
                </div>
              </div>
            </div>

            {/* About Professional */}
            <div>
              <h4 className="font-label-lg text-[13px] font-bold text-[#0b1c30] uppercase tracking-wider">
                About Professional
              </h4>
              <p
                id="modal-bio"
                className="font-body-md text-[14px] text-slate-700 mt-2 leading-relaxed"
              >
                {worker.bio}
              </p>
            </div>

            {/* Skills & Specializations */}
            <div>
              <h4 className="font-label-lg text-[13px] font-bold text-[#0b1c30] uppercase tracking-wider">
                Skills &amp; Specializations
              </h4>
              <div id="modal-skills" className="flex flex-wrap gap-2 mt-2.5">
                {(worker.skills || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-surface-container text-[#0b1c30] font-label-sm text-[12px] font-medium border border-surface-container-high/40"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Portfolio & Recent Work */}
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-label-lg text-[13px] font-bold text-[#0b1c30] uppercase tracking-wider">
                  Portfolio &amp; Recent Work
                </h4>
                <span className="text-[12px] font-semibold text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span> Verified On-Site
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-2.5">
                {WORK_SAMPLES.map((photoUrl, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-xl overflow-hidden bg-surface-container-high border border-surface-container shadow-sm group cursor-pointer"
                  >
                    <img
                      alt={`Work sample ${idx + 1}`}
                      src={photoUrl}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-medium">
                      {captions[idx] || captions[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Verified Customer Reviews - Solid white cards with soft shadow */}
            <div>
              <h4 className="font-label-lg text-[13px] font-bold text-[#0b1c30] uppercase tracking-wider">
                Recent Verified Customer Reviews
              </h4>
              <div className="flex flex-col gap-3 mt-2.5">
                {reviewsList.slice(0, 2).map((rev, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white border border-surface-container shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-label-md text-[13px] font-bold text-[#0b1c30]">
                          {rev.reviewer || rev.name}
                        </span>
                        <span className="material-symbols-outlined text-secondary text-[15px]">verified</span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          • {rev.timeAgo || 'Recently'}
                        </span>
                      </div>
                      <div className="flex items-center text-amber-500 text-[13px]">
                        {'★'.repeat(rev.stars || 5)}
                      </div>
                    </div>
                    <p className="font-body-sm text-[13px] text-slate-700 mt-1.5 leading-relaxed">
                      {rev.comment || rev.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Rate Card, Dossier, Slots, Escrow & CTAs   */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 p-6 sm:p-8 bg-[#f6f8fe] flex flex-col justify-between gap-6 border-t lg:border-t-0 border-surface-container">
            <div className="flex flex-col gap-5">
              {/* Estimated Service Rate Card - Solid white background with soft shadow */}
              <div className="p-4 rounded-2xl bg-white border border-surface-container shadow-sm">
                <span className="font-label-sm text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  Estimated Service Rate
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span id="modal-price" className="font-headline-md text-[24px] font-extrabold text-[#0b1c30]">
                    {worker.priceRange || `₹${worker.hourlyRate} – ₹${Number(worker.hourlyRate) + 150}`}{' '}
                    <span className="font-body-sm text-[13px] font-normal text-slate-500">
                      / {worker.rateUnit || 'hr'}
                    </span>
                  </span>
                  <span className="font-label-sm text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                    Guaranteed Rate
                  </span>
                </div>
                <p className="font-body-sm text-[12px] text-slate-600 mt-2 leading-relaxed">
                  Includes travel within 5 km, initial comprehensive inspection, and 30-day Kaarya service warranty.
                </p>
              </div>

              {/* Trust & Verification Dossier */}
              <div>
                <h4 className="font-label-lg text-[13px] font-bold text-[#0b1c30] uppercase tracking-wider">
                  Trust &amp; Verification Dossier
                </h4>
                <div className="flex flex-col gap-2.5 mt-2.5">
                  {/* Row 1: Identity */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-surface-container shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-secondary">fingerprint</span>
                      <span className="font-label-md text-[12.5px] font-semibold text-[#0b1c30]">
                        Identity Checked
                      </span>
                    </div>
                    <span className="font-label-sm text-[11px] font-bold text-secondary bg-[#e0e0ff] border border-secondary-fixed px-2 py-0.5 rounded-md">
                      Govt Aadhaar ID verified
                    </span>
                  </div>

                  {/* Row 2: Qualification */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-surface-container shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-emerald-600">verified_user</span>
                      <span className="font-label-md text-[12.5px] font-semibold text-[#0b1c30]">
                        Qualification Verified
                      </span>
                    </div>
                    <span className="font-label-sm text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      {tradeCert}
                    </span>
                  </div>

                  {/* Row 3: Skill Assessment */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-surface-container shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-tertiary">psychology</span>
                      <span className="font-label-md text-[12.5px] font-semibold text-[#0b1c30]">
                        Skill Assessment
                      </span>
                    </div>
                    <span
                      id="modal-assessment"
                      className="font-label-sm text-[11px] font-bold text-tertiary bg-[#e9ddff] border border-tertiary-fixed px-2 py-0.5 rounded-md"
                    >
                      {worker.assessmentScore || '94% Trade Competency'}
                    </span>
                  </div>

                  {/* Row 4: Work History */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-surface-container shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-primary">history_edu</span>
                      <span className="font-label-md text-[12.5px] font-semibold text-[#0b1c30]">
                        Work History
                      </span>
                    </div>
                    <span
                      id="modal-experience"
                      className="font-label-sm text-[11px] font-bold text-primary bg-[#ffd9e1] border border-primary-fixed px-2 py-0.5 rounded-md"
                    >
                      {workHistory}
                    </span>
                  </div>
                </div>
              </div>

              {/* Work History & Reliability Record - Solid white card with soft shadow */}
              <div className="p-3.5 rounded-xl bg-white border border-surface-container shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[18px]">verified</span>
                  <span className="font-label-md text-[12.5px] font-bold text-[#0b1c30]">
                    Work History &amp; Reliability Record
                  </span>
                </div>
                <p className="font-body-sm text-[12px] text-slate-600 mt-1 leading-relaxed">
                  {reliability}
                </p>
              </div>

              {/* Select Preferred Slot (Demonstration choices) */}
              <div>
                <h4 className="font-label-lg text-[13px] font-bold text-[#0b1c30] uppercase tracking-wider">
                  Select Preferred Slot
                </h4>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {APPOINTMENT_SLOTS.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => onSelectSlot && onSelectSlot(slot)}
                        className={`p-2.5 rounded-xl font-label-sm text-[11.5px] text-center transition-colors shadow-sm ${
                          isSelected
                            ? 'border-2 border-primary bg-primary-light text-primary font-bold'
                            : 'border border-surface-container bg-white hover:bg-surface-container-low text-[#0b1c30] font-medium'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Escrow Banner & CTAs */}
            <div className="flex flex-col gap-2.5 pt-4 border-t border-surface-container">
              <div className="flex items-center gap-2 text-[11.5px] text-slate-600 mb-1">
                <span className="material-symbols-outlined text-secondary text-[16px]">lock</span>
                <span>Funds held securely in Kaarya Escrow until work verified.</span>
              </div>

              {/* Primary CTA */}
              <Link
                to={`/post-job?workerId=${worker.id}&slot=${encodeURIComponent(selectedSlot)}`}
                className="w-full py-3.5 rounded-xl aurora-gradient-btn hover:opacity-95 text-white font-label-lg text-[14px] font-bold shadow-[0_8px_24px_rgba(225,29,116,0.3)] transition-transform active:scale-[0.98] flex items-center justify-center gap-2 text-center"
              >
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                <span>Request Service</span>
              </Link>

              {/* Secondary CTA - Solid white card button */}
              <Link
                to={`/messages?recipient=${worker.id}`}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-surface-container-low text-[#0b1c30] border border-surface-container font-label-md text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm text-center"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">chat</span>
                <span>Chat with {firstName}</span>
              </Link>

              {/* Standalone Route Link */}
              <Link
                to={`/professionals/${worker.id}`}
                className="text-center font-label-sm text-[12px] text-primary hover:underline transition-colors mt-1"
              >
                View Full Profile Page →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
