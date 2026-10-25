import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { MOCK_WORKERS } from '../data/mockData';

// 6 Service categories with dynamic sub-services matching designs/post-job.html
const SERVICE_CATEGORIES = [
  {
    id: 'plumbing',
    name: 'Plumbing',
    icon: 'plumbing',
    label: 'Specific plumbing issue',
    subServices: [
      { id: 'leak', name: 'Leak Repair' },
      { id: 'tap', name: 'Tap Repair' },
      { id: 'pipe', name: 'Pipe Installation' },
      { id: 'drainage', name: 'Drainage Issues' },
      { id: 'other', name: 'Other Plumbing Work' },
    ],
  },
  {
    id: 'electrical',
    name: 'Electrical',
    icon: 'bolt',
    label: 'Specific electrical issue',
    subServices: [
      { id: 'wiring', name: 'Wiring / Short Circuit' },
      { id: 'switchboard', name: 'Switchboard / Socket' },
      { id: 'appliance', name: 'Appliance Installation' },
      { id: 'fan_light', name: 'Fan & Light Fixtures' },
      { id: 'other', name: 'Other Electrical Work' },
    ],
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    icon: 'cleaning_services',
    label: 'Specific cleaning requirement',
    subServices: [
      { id: 'deep_cleaning', name: 'Deep Home Cleaning' },
      { id: 'kitchen_bath', name: 'Kitchen & Bathroom Cleaning' },
      { id: 'sofa_carpet', name: 'Sofa & Carpet Shampooing' },
      { id: 'post_renovation', name: 'Post-Renovation Cleaning' },
      { id: 'other', name: 'Other Cleaning Work' },
    ],
  },
  {
    id: 'painting',
    name: 'Painting',
    icon: 'format_paint',
    label: 'Specific painting requirement',
    subServices: [
      { id: 'full_home', name: 'Full Home Painting' },
      { id: 'single_room', name: 'Single Room / Accent Wall' },
      { id: 'waterproofing', name: 'Waterproofing & Touchup' },
      { id: 'wood_metal', name: 'Wood & Metal Polish' },
      { id: 'other', name: 'Other Painting Work' },
    ],
  },
  {
    id: 'carpentry',
    name: 'Carpentry',
    icon: 'handyman',
    label: 'Specific carpentry requirement',
    subServices: [
      { id: 'furniture_repair', name: 'Furniture Repair' },
      { id: 'lock_door', name: 'Door & Lock Fitting' },
      { id: 'modular', name: 'Modular Fittings & Shelves' },
      { id: 'assembly', name: 'Furniture Assembly' },
      { id: 'other', name: 'Other Carpentry Work' },
    ],
  },
  {
    id: 'other',
    name: 'Other Services',
    icon: 'more_horiz',
    label: 'Specific service needed',
    subServices: [
      { id: 'ac_service', name: 'AC Service & Repair' },
      { id: 'pest_control', name: 'Pest Control' },
      { id: 'masonry', name: 'Masonry & Tile Repair' },
      { id: 'appliance_fix', name: 'Home Appliance Repair' },
      { id: 'general', name: 'General Handyman' },
    ],
  },
];

// Initial demonstration photo attachments from Stitch reference
const INITIAL_DEMO_PHOTOS = [
  {
    id: 'demo-photo-1',
    name: 'Plumbing leak detail',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLp2caBdPefh-PgUbtiWnkKMNQ6B3g1b8a5QqmOBROWmN7eGg2SsrYIdffKTSzzj_1umQoSx7LZPbYJz5cIiyEYBqzTAUrhVLslkg-0sIMQlQhrvxp6gzl7dWeCW1PH3q4kcRelxbzJAmxKyGj3IsLwyyxUYr0jukoGfL4kWiX2tPO92_LGBvv6Q3dTA6oU2Nz7Yg3CGhlPodQR8743Or_1b-D52Mt3Qf7ZUD9crhptffwI0hHbqrfMw',
    alt: 'Plumbing leak detail',
    isDefaultDemo: true,
  },
  {
    id: 'demo-photo-2',
    name: 'Valve leak pipe',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCn7RBuzZw0vjkes-MIDSwfC1nK65_VWIjPSfJ5KQEItJQsuApCo9IlMcUOPpQo1cZc7m7dU6-5z9-ifItIBl4MJ-2oSzQD_a5ZMgKjBx3sml_odkow4wL8RmViR7KBuhypC8IudoYT7SoYZ9NhZmtPmPHsjrnCV5lUQaZtZaWujfMWzKTiTdvUPdVi5HPoYL3-2R0WCUtOKm66HWlUI8bRrXjYwGg1Ck8uPMpUFbEibZOZbHksaNsW3A',
    alt: 'Valve leak pipe',
    isDefaultDemo: true,
  },
];

export default function PostJob() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Query parameters: workerId & slot
  const rawWorkerId = searchParams.get('workerId');
  const rawSlot = searchParams.get('slot');

  // Resolve target worker safely
  const resolvedWorker = React.useMemo(() => {
    if (!rawWorkerId) return null;
    return (
      MOCK_WORKERS.find(
        (w) => w.id === rawWorkerId || w.alias === rawWorkerId || w.name.toLowerCase().includes(rawWorkerId.toLowerCase())
      ) || null
    );
  }, [rawWorkerId]);

  // Direct worker state (can be cleared by user if they choose to post open broadcast)
  const [directWorker, setDirectWorker] = useState(resolvedWorker);
  const [slotPreference, setSlotPreference] = useState(rawSlot || null);

  // Form State
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (resolvedWorker?.category) {
      const match = SERVICE_CATEGORIES.find((c) => c.id === resolvedWorker.category.toLowerCase());
      if (match) return match.id;
    }
    return 'plumbing';
  });

  const [selectedSubService, setSelectedSubService] = useState('leak');

  const [description, setDescription] = useState(
    'Kitchen sink pipe is leaking beneath the counter. Looking for someone to inspect and repair the joint.'
  );

  const [photos, setPhotos] = useState(INITIAL_DEMO_PHOTOS);

  const [location, setLocation] = useState(() => {
    if (resolvedWorker?.area) {
      return `${resolvedWorker.area}, Mumbai`;
    }
    return 'Bandra West, Mumbai';
  });

  // Date parsing from slot preference
  const [dateOption, setDateOption] = useState(() => {
    if (rawSlot) {
      const s = rawSlot.toLowerCase();
      if (s.includes('today')) return 'today';
      if (s.includes('tomorrow')) return 'tomorrow';
      return 'custom';
    }
    return 'tomorrow'; // Default selected in Stitch
  });

  const [customDate, setCustomDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    return today.toISOString().split('T')[0];
  });

  // Time parsing from slot preference
  const [timeOption, setTimeOption] = useState(() => {
    if (rawSlot) {
      const s = rawSlot.toLowerCase();
      if (s.includes('am') || s.includes('morning')) return 'morning';
      if (s.includes('pm') && (s.includes('12:') || s.includes('1:') || s.includes('2:') || s.includes('3:') || s.includes('4:'))) {
        return 'afternoon';
      }
      if (s.includes('pm') || s.includes('evening')) return 'evening';
    }
    return 'afternoon'; // Default selected in Stitch
  });

  const [budgetOption, setBudgetOption] = useState('500_1500'); // Default selected in Stitch

  // Validation & UI State
  const [errors, setErrors] = useState({});
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  // Active Blob URLs tracking ref for zero memory leaks
  const activeBlobUrlsRef = useRef(new Set());

  // Cleanup effect: revoke all active blob URLs on unmount
  useEffect(() => {
    const urls = activeBlobUrlsRef.current;
    return () => {
      urls.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // ignore cleanup errors
        }
      });
      urls.clear();
    };
  }, []);

  // Update sub-service when category changes
  const currentCategoryData = React.useMemo(() => {
    return SERVICE_CATEGORIES.find((c) => c.id === selectedCategory) || SERVICE_CATEGORIES[0];
  }, [selectedCategory]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    const cat = SERVICE_CATEGORIES.find((c) => c.id === categoryId);
    if (cat && cat.subServices.length > 0) {
      setSelectedSubService(cat.subServices[0].id);
    }
  };

  // Add photos with object URLs
  const handleAddPhotos = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newPhotoItems = files.map((file, idx) => {
      const objectUrl = URL.createObjectURL(file);
      activeBlobUrlsRef.current.add(objectUrl);
      return {
        id: `photo-${Date.now()}-${idx}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.type,
        url: objectUrl,
        alt: file.name,
        isBlob: true,
        isDefaultDemo: false,
      };
    });

    setPhotos((prev) => [...prev, ...newPhotoItems]);
    // Reset file input value so same files can be re-selected if desired
    e.target.value = '';
  };

  // Remove photo and revoke object URL immediately
  const handleRemovePhoto = (photoId) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === photoId);
      if (target?.isBlob && target.url) {
        try {
          URL.revokeObjectURL(target.url);
          activeBlobUrlsRef.current.delete(target.url);
        } catch {
          // ignore
        }
      }
      return prev.filter((p) => p.id !== photoId);
    });
  };

  // Clear direct worker assignment
  const handleClearDirectWorker = () => {
    setDirectWorker(null);
    setSlotPreference(null);
  };

  // Validate form before opening Review
  const handleContinue = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!description || description.trim().length < 10) {
      newErrors.description = 'Please provide at least 10 characters describing the work needed.';
    }

    if (!location || location.trim().length < 3) {
      newErrors.location = 'Please enter your area or address.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      const el = document.getElementById(newErrors.description ? 'jobDescription' : 'locationInput');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setErrors({});
    setIsReviewOpen(true);
  };

  // Submit and persist to localStorage
  const handleConfirmPublish = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Prepare safe serializable job record
    const subServiceName =
      currentCategoryData.subServices.find((s) => s.id === selectedSubService)?.name || selectedSubService;

    // Safe photo metadata without transient blob URLs
    const serializablePhotos = photos.map((p) => ({
      id: p.id,
      name: p.name,
      size: p.size || 'demo',
      type: p.type || 'image/jpeg',
      isDefaultDemo: Boolean(p.isDefaultDemo),
      // Durable HTTPS only for Stitch assets, omitted for temporary browser memory blobs
      previewUrl: p.isDefaultDemo ? p.url : null,
    }));

    const dateLabel =
      dateOption === 'today' ? 'Today' : dateOption === 'tomorrow' ? 'Tomorrow' : `Scheduled: ${customDate}`;

    const timeLabel =
      timeOption === 'morning'
        ? 'Morning (9 AM – 12 PM)'
        : timeOption === 'afternoon'
        ? 'Afternoon (12 PM – 5 PM)'
        : timeOption === 'evening'
        ? 'Evening (5 PM – 9 PM)'
        : 'Flexible Time';

    const budgetLabel =
      budgetOption === 'under_500'
        ? 'Under ₹500'
        : budgetOption === '500_1500'
        ? '₹500–₹1,500'
        : budgetOption === '1500_plus'
        ? '₹1,500+'
        : 'Not sure yet';

    const newJob = {
      id: `JOB-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      category: currentCategoryData.name,
      categoryId: selectedCategory,
      subService: subServiceName,
      subServiceId: selectedSubService,
      title: `${currentCategoryData.name} — ${subServiceName}`,
      description: description.trim(),
      location: location.trim(),
      dateOption,
      dateLabel,
      timeOption,
      timeLabel,
      budgetOption,
      budgetLabel,
      assignedWorker: directWorker
        ? {
            id: directWorker.id,
            name: directWorker.name,
            profession: directWorker.profession,
            area: directWorker.area,
            avatarUrl: directWorker.avatarUrl,
            slotPreference: slotPreference || null,
          }
        : null,
      isDirectRequest: Boolean(directWorker),
      photos: serializablePhotos,
      attachmentCount: photos.length,
      hasAttachments: photos.length > 0,
      attachmentNames: photos.map((p) => p.name),
      status: 'Broadcasted',
      bidsReceived: 0,
    };

    // Simulate async network request
    setTimeout(() => {
      try {
        const existing = JSON.parse(localStorage.getItem('kaarya_posted_jobs') || '[]');
        localStorage.setItem('kaarya_posted_jobs', JSON.stringify([newJob, ...existing]));
      } catch (err) {
        console.warn('Failed to save to localStorage:', err);
      }

      setIsSubmitting(false);
      setIsReviewOpen(false);
      setIsSuccessOpen(true);
    }, 450);
  };

  return (
    <div className="bg-[#FAFBFF] font-body-md text-on-surface antialiased relative min-h-screen flex flex-col justify-between selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* AMBIENT AURORA BACKGROUND BLOBS */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-primary-fixed/20 to-secondary-fixed/15 blur-[140px]" />
        <div className="absolute top-1/3 -right-28 h-[480px] w-[480px] rounded-full bg-gradient-to-tl from-tertiary-fixed/20 to-surface-container-high/30 blur-[150px]" />
        <div className="absolute -bottom-24 left-1/3 h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-surface-container-lowest via-secondary-fixed-dim/15 to-primary-fixed-dim/15 blur-[160px]" />
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 w-full pt-6 sm:pt-8 pb-16 min-h-[calc(100vh-64px)] flex justify-center">
        <div className="w-full max-w-[820px] px-4 sm:px-6">
          {/* BREADCRUMB & HEADER */}
          <div className="mb-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-3">
              <Link
                to="/"
                className="font-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">home</span>
                <span>Home</span>
              </Link>
              <span className="text-outline-variant font-label-md">/</span>
              <span className="font-label-md text-on-surface font-semibold">Post a New Job</span>
            </nav>
            <h1 className="font-headline-lg text-on-surface tracking-tight text-3xl sm:text-[34px]">
              Post a New Job
            </h1>
            <p className="font-body-md text-on-surface-variant mt-1.5">
              Tell us what you need. We'll help you find the right professional.
            </p>
          </div>

          {/* DIRECT WORKER REQUEST BANNER (IF NAVIGATED FROM WORKER PROFILE) */}
          {directWorker && (
            <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-white/95 border border-primary/25 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
              <div className="flex items-center gap-3.5">
                <img
                  src={directWorker.avatarUrl}
                  alt={directWorker.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#0b1c30] text-sm sm:text-base">
                      Direct Request for {directWorker.name}
                    </span>
                    <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">verified</span>
                      <span>Verified Pro</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {directWorker.profession} • {directWorker.area}
                  </p>
                  {slotPreference && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-primary font-medium">
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      <span>Preselected preference: <strong>{slotPreference}</strong></span>
                      <span className="text-slate-400 text-[10px] ml-1">(Demonstration preference)</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={handleClearDirectWorker}
                className="self-start sm:self-auto px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shrink-0 cursor-pointer"
              >
                Post as open job instead
              </button>
            </div>
          )}

          {/* CENTERED FORM CONTAINER */}
          <form className="flex flex-col gap-6" id="jobPostForm" onSubmit={handleContinue}>
            {/* SECTION 1: WHAT DO YOU NEED HELP WITH? */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_4px_24px_rgba(11,28,48,0.04)] border border-[#e2e8f0]/80 p-6 sm:p-7 relative transition-all">
              <h2 className="font-headline-sm text-on-surface font-bold text-lg mb-4">
                What do you need help with?
              </h2>

              {/* 6 Service Tiles Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-5">
                {SERVICE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-xl transition-all cursor-pointer text-center ${
                        isSelected
                          ? 'border border-primary/30 bg-primary/5 text-primary shadow-sm ring-1 ring-primary/20 hover:border-primary'
                          : 'border border-slate-200/90 bg-surface-container-lowest hover:bg-slate-50 hover:border-slate-300 text-on-surface group'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[26px] mb-1.5 transition-colors ${
                          isSelected ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'
                        }`}
                        style={isSelected ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        {cat.icon}
                      </span>
                      <span
                        className={`font-label-md text-[13px] leading-tight ${
                          isSelected ? 'font-semibold text-primary' : 'font-medium text-on-surface'
                        }`}
                      >
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Sub-Service Dropdown */}
              <div className="relative">
                <label className="font-label-sm text-on-surface-variant mb-1.5 block font-medium" htmlFor="subServiceSelect">
                  {currentCategoryData.label}
                </label>
                <div className="relative">
                  <select
                    id="subServiceSelect"
                    value={selectedSubService}
                    onChange={(e) => setSelectedSubService(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-body-md border border-slate-200/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer appearance-none transition-all text-sm"
                  >
                    {currentCategoryData.subServices.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">
                    expand_more
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 2: TELL US A LITTLE MORE */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_4px_24px_rgba(11,28,48,0.04)] border border-[#e2e8f0]/80 p-6 sm:p-7 relative transition-all">
              <h2 className="font-headline-sm text-on-surface font-bold text-lg mb-3">
                Tell us a little more
              </h2>
              <textarea
                id="jobDescription"
                rows="3"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) {
                    setErrors((prev) => ({ ...prev, description: null }));
                  }
                }}
                placeholder="Example: My kitchen sink is leaking. I need someone to inspect and repair the pipe."
                className={`w-full p-3.5 sm:p-4 rounded-xl bg-surface-container-low text-on-surface font-body-md border focus:bg-white focus:outline-none focus:ring-2 transition-all resize-y text-sm leading-relaxed mb-4 ${
                  errors.description
                    ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                    : 'border-slate-200/80 focus:ring-primary/20 focus:border-primary'
                }`}
              />
              {errors.description && (
                <p className="text-xs text-red-600 -mt-2.5 mb-3 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  <span>{errors.description}</span>
                </p>
              )}

              {/* Photo Upload with Thumbnails and Removal Overlay */}
              <div className="flex flex-wrap items-center gap-3">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative group w-14 h-14 rounded-lg overflow-hidden border border-slate-200 shadow-sm shrink-0 bg-slate-50"
                  >
                    <img
                      src={photo.url}
                      alt={photo.alt || photo.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      aria-label="Remove image"
                      onClick={() => handleRemovePhoto(photo.id)}
                      className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                ))}

                {/* Add Photos Button */}
                <label className="h-14 px-3.5 rounded-lg border border-dashed border-slate-300 hover:border-primary/50 bg-slate-50 hover:bg-primary/5 text-on-surface-variant hover:text-primary flex items-center gap-2 cursor-pointer transition-all shrink-0">
                  <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
                  <span className="font-label-sm font-medium">+ Add Photos (Optional)</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleAddPhotos}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* SECTION 3: WHERE AND WHEN? */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_4px_24px_rgba(11,28,48,0.04)] border border-[#e2e8f0]/80 p-6 sm:p-7 relative transition-all">
              <h2 className="font-headline-sm text-on-surface font-bold text-lg mb-4">
                Where and when?
              </h2>

              {/* Location Input */}
              <div className="mb-5">
                <label className="font-label-sm text-on-surface-variant mb-1.5 block font-medium" htmlFor="locationInput">
                  Location
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary text-[20px]">
                    pin_drop
                  </span>
                  <input
                    id="locationInput"
                    type="text"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      if (errors.location) {
                        setErrors((prev) => ({ ...prev, location: null }));
                      }
                    }}
                    placeholder="Enter your area or address"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-body-md border focus:bg-white focus:outline-none focus:ring-2 transition-all text-sm ${
                      errors.location
                        ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                        : 'border-slate-200/80 focus:ring-primary/20 focus:border-primary'
                    }`}
                  />
                </div>
                {errors.location && (
                  <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">error</span>
                    <span>{errors.location}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Preferred Day Pills */}
                <div>
                  <label className="font-label-sm text-on-surface-variant mb-1.5 block font-medium">
                    Date
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setDateOption('today')}
                      className={`py-2.5 px-2 rounded-xl text-center font-label-md transition-all text-xs sm:text-sm cursor-pointer ${
                        dateOption === 'today'
                          ? 'border border-primary/40 bg-gradient-to-r from-primary/10 to-secondary/10 ring-1 ring-primary/30 text-primary font-semibold shadow-sm'
                          : 'border border-slate-200 bg-surface-container-lowest hover:bg-slate-50 text-on-surface'
                      }`}
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setDateOption('tomorrow')}
                      className={`py-2.5 px-2 rounded-xl text-center font-label-md transition-all text-xs sm:text-sm cursor-pointer ${
                        dateOption === 'tomorrow'
                          ? 'border border-primary/40 bg-gradient-to-r from-primary/10 to-secondary/10 ring-1 ring-primary/30 text-primary font-semibold shadow-sm'
                          : 'border border-slate-200 bg-surface-container-lowest hover:bg-slate-50 text-on-surface'
                      }`}
                    >
                      Tomorrow
                    </button>
                    <button
                      type="button"
                      onClick={() => setDateOption('custom')}
                      className={`py-2.5 px-2 rounded-xl text-center font-label-md transition-all text-xs sm:text-sm cursor-pointer ${
                        dateOption === 'custom'
                          ? 'border border-primary/40 bg-gradient-to-r from-primary/10 to-secondary/10 ring-1 ring-primary/30 text-primary font-semibold shadow-sm'
                          : 'border border-slate-200 bg-surface-container-lowest hover:bg-slate-50 text-on-surface'
                      }`}
                    >
                      Choose Date
                    </button>
                  </div>
                  {/* Custom Date Picker Reveal */}
                  {dateOption === 'custom' && (
                    <div className="mt-2.5">
                      <input
                        type="date"
                        value={customDate}
                        onChange={(e) => setCustomDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  )}
                </div>

                {/* Time Window Pills */}
                <div>
                  <label className="font-label-sm text-on-surface-variant mb-1.5 block font-medium">
                    Time
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      onClick={() => setTimeOption('morning')}
                      className={`py-2.5 px-1 rounded-xl text-center font-label-md transition-all text-xs cursor-pointer ${
                        timeOption === 'morning'
                          ? 'border border-primary/40 bg-gradient-to-r from-primary/10 to-secondary/10 ring-1 ring-primary/30 text-primary font-semibold shadow-sm'
                          : 'border border-slate-200 bg-surface-container-lowest hover:bg-slate-50 text-on-surface'
                      }`}
                    >
                      Morning
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimeOption('afternoon')}
                      className={`py-2.5 px-1 rounded-xl text-center font-label-md transition-all text-xs cursor-pointer ${
                        timeOption === 'afternoon'
                          ? 'border border-primary/40 bg-gradient-to-r from-primary/10 to-secondary/10 ring-1 ring-primary/30 text-primary font-semibold shadow-sm'
                          : 'border border-slate-200 bg-surface-container-lowest hover:bg-slate-50 text-on-surface'
                      }`}
                    >
                      Afternoon
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimeOption('evening')}
                      className={`py-2.5 px-1 rounded-xl text-center font-label-md transition-all text-xs cursor-pointer ${
                        timeOption === 'evening'
                          ? 'border border-primary/40 bg-gradient-to-r from-primary/10 to-secondary/10 ring-1 ring-primary/30 text-primary font-semibold shadow-sm'
                          : 'border border-slate-200 bg-surface-container-lowest hover:bg-slate-50 text-on-surface'
                      }`}
                    >
                      Evening
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimeOption('flexible')}
                      className={`py-2.5 px-1 rounded-xl text-center font-label-md transition-all text-xs cursor-pointer ${
                        timeOption === 'flexible'
                          ? 'border border-primary/40 bg-gradient-to-r from-primary/10 to-secondary/10 ring-1 ring-primary/30 text-primary font-semibold shadow-sm'
                          : 'border border-slate-200 bg-surface-container-lowest hover:bg-slate-50 text-on-surface'
                      }`}
                    >
                      Flexible
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: DO YOU HAVE A BUDGET IN MIND? */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_4px_24px_rgba(11,28,48,0.04)] border border-[#e2e8f0]/80 p-6 sm:p-7 relative transition-all">
              <h2 className="font-headline-sm text-on-surface font-bold text-lg mb-1">
                Do you have a budget in mind?
              </h2>
              <p className="font-body-sm text-on-surface-variant mb-4">
                Optional — you can compare offers before agreeing on a price.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setBudgetOption('under_500')}
                  className={`p-3 rounded-xl border text-center font-label-md transition-all cursor-pointer ${
                    budgetOption === 'under_500'
                      ? 'border-primary/40 bg-gradient-to-r from-primary/10 via-primary-fixed/20 to-secondary-fixed/20 ring-1 ring-primary/40 text-primary font-bold shadow-sm'
                      : 'border-slate-200 bg-surface-container-lowest hover:bg-slate-50 text-on-surface'
                  }`}
                >
                  <span className={`block text-sm ${budgetOption === 'under_500' ? 'font-bold text-primary' : 'font-semibold text-on-surface'}`}>
                    Under ₹500
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setBudgetOption('500_1500')}
                  className={`p-3 rounded-xl border text-center font-label-md transition-all cursor-pointer ${
                    budgetOption === '500_1500'
                      ? 'border-primary/40 bg-gradient-to-r from-primary/10 via-primary-fixed/20 to-secondary-fixed/20 ring-1 ring-primary/40 text-primary font-bold shadow-sm'
                      : 'border-slate-200 bg-surface-container-lowest hover:bg-slate-50 text-on-surface'
                  }`}
                >
                  <span className={`block text-sm ${budgetOption === '500_1500' ? 'font-bold text-primary' : 'font-semibold text-on-surface'}`}>
                    ₹500–₹1,500
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setBudgetOption('1500_plus')}
                  className={`p-3 rounded-xl border text-center font-label-md transition-all cursor-pointer ${
                    budgetOption === '1500_plus'
                      ? 'border-primary/40 bg-gradient-to-r from-primary/10 via-primary-fixed/20 to-secondary-fixed/20 ring-1 ring-primary/40 text-primary font-bold shadow-sm'
                      : 'border-slate-200 bg-surface-container-lowest hover:bg-slate-50 text-on-surface'
                  }`}
                >
                  <span className={`block text-sm ${budgetOption === '1500_plus' ? 'font-bold text-primary' : 'font-semibold text-on-surface'}`}>
                    ₹1,500+
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setBudgetOption('not_sure')}
                  className={`p-3 rounded-xl border text-center font-label-md transition-all cursor-pointer ${
                    budgetOption === 'not_sure'
                      ? 'border-primary/40 bg-gradient-to-r from-primary/10 via-primary-fixed/20 to-secondary-fixed/20 ring-1 ring-primary/40 text-primary font-bold shadow-sm'
                      : 'border-slate-200 bg-surface-container-lowest hover:bg-slate-50 text-on-surface'
                  }`}
                >
                  <span className={`block text-sm ${budgetOption === 'not_sure' ? 'font-bold text-primary' : 'font-medium text-on-surface-variant'}`}>
                    Not sure yet
                  </span>
                </button>
              </div>
            </div>

            {/* BOTTOM ACTION AREA */}
            <div className="pt-2 flex flex-col items-center justify-center gap-2.5">
              <button
                type="submit"
                className="w-full sm:w-80 py-3.5 px-8 rounded-full bg-gradient-to-r from-primary via-tertiary-container to-secondary text-white font-label-lg font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
              <p className="font-body-sm text-xs text-on-surface-variant/80 text-center">
                You'll review your request before publishing.
              </p>
            </div>
          </form>
        </div>
      </main>

      {/* REVIEW & CONFIRMATION MODAL */}
      {isReviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">assignment</span>
                <h3 className="font-headline-sm text-lg font-bold text-[#0b1c30]">
                  Review Job Request
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3.5 text-sm">
              <div className="bg-slate-50 p-3.5 rounded-xl space-y-2 border border-slate-200/70">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Service & Problem</span>
                  <span className="font-bold text-[#0b1c30] capitalize">
                    {currentCategoryData.name} •{' '}
                    {currentCategoryData.subServices.find((s) => s.id === selectedSubService)?.name || selectedSubService}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Location</span>
                  <span className="font-semibold text-[#0b1c30]">{location}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Preferred Schedule</span>
                  <span className="font-semibold text-[#0b1c30]">
                    {dateOption === 'today' ? 'Today' : dateOption === 'tomorrow' ? 'Tomorrow' : customDate} (
                    {timeOption})
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Estimated Budget</span>
                  <span className="font-bold text-primary">
                    {budgetOption === 'under_500'
                      ? 'Under ₹500'
                      : budgetOption === '500_1500'
                      ? '₹500–₹1,500'
                      : budgetOption === '1500_plus'
                      ? '₹1,500+'
                      : 'Not sure yet'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Attachments</span>
                  <span className="font-semibold text-slate-700">
                    {photos.length > 0 ? `${photos.length} image(s) attached` : 'None'}
                  </span>
                </div>
              </div>

              {/* Direct Booking or Open Broadcast notice */}
              {directWorker ? (
                <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200 flex items-center gap-3">
                  <img
                    src={directWorker.avatarUrl}
                    alt={directWorker.name}
                    className="w-9 h-9 rounded-lg object-cover"
                  />
                  <div className="text-xs">
                    <p className="font-bold text-purple-900">
                      Direct Request for {directWorker.name}
                    </p>
                    <p className="text-purple-700 text-[11px]">
                      Demonstration request preference: {slotPreference || 'Preferred time slot'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 flex items-center gap-2.5 text-xs text-blue-900">
                  <span className="material-symbols-outlined text-[18px] text-blue-700">sensors</span>
                  <span>Will be broadcasted to nearby verified professionals in Mumbai.</span>
                </div>
              )}

              {/* Escrow Demonstration Notice */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">
                  lock
                </span>
                <span>
                  <strong>Kaarya Escrow Protection:</strong> Funds will only be held securely once you accept a quote. Zero payment is charged right now.
                </span>
              </div>
            </div>

            {/* Review Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsReviewOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs cursor-pointer transition-colors"
              >
                Edit Details
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmPublish}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary via-tertiary-container to-secondary text-white font-semibold text-xs shadow-md shadow-primary/20 hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                    <span>Publishing Request...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Post Job</span>
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBMISSION SUCCESS CELEBRATION MODAL */}
      {isSuccessOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <span className="material-symbols-outlined text-[30px]">check_circle</span>
            </div>

            <div className="space-y-1">
              <h3 className="font-headline-sm text-xl font-bold text-[#0b1c30]">
                Job Request Published!
              </h3>
              <p className="font-body-md text-xs sm:text-sm text-slate-500">
                {directWorker
                  ? `Your request has been forwarded to ${directWorker.name}. You'll be notified when they review your preference.`
                  : "We're notifying verified local professionals near you. Competitive quotes will appear shortly."}
              </p>
            </div>

            <div className="w-full p-3 rounded-xl bg-amber-50 border border-amber-200 text-left text-[11px] text-amber-800 flex items-start gap-2">
              <span className="material-symbols-outlined text-[16px] text-amber-700 shrink-0 mt-0.5">
                info
              </span>
              <span>
                <strong>Demonstration Prototype:</strong> Job is stored in local browser state. Simulated bids can be inspected in Compare Offers.
              </span>
            </div>

            {/* Navigation Destinations */}
            <div className="w-full flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => navigate('/compare-offers')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary via-tertiary-container to-secondary text-white font-label-md text-xs font-bold shadow-md shadow-primary/20 hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Live Offers</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/my-bookings')}
                className="w-full py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-label-md text-xs font-semibold transition-colors cursor-pointer"
              >
                Track in My Bookings
              </button>
              <button
                type="button"
                onClick={() => navigate('/professionals')}
                className="text-xs text-slate-400 hover:text-primary transition-colors py-1 cursor-pointer"
              >
                Browse More Professionals
              </button>
            </div>
          </div>
        </div>
      )}

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
