import React, { useEffect, useTransition } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Storage keys for Kaarya demonstration mode
 */
const STORAGE_KEYS = {
  DEMO_MODE: 'kaarya_demo_mode',
  LAST_CUSTOMER_ROUTE: 'kaarya_last_customer_route',
};

/**
 * Exact registered customer route patterns in Kaarya:
 * - Static: /, /professionals, /post-job, /compare-offers, /my-bookings
 * - Dynamic: /bookings/:id, /professionals/:id
 * - Utility / Shared: /messages
 */
const REGISTERED_CUSTOMER_PATTERNS = [
  /^\/$/,
  /^\/professionals$/,
  /^\/professionals\/[a-zA-Z0-9_-]+$/,
  /^\/post-job$/,
  /^\/compare-offers$/,
  /^\/bookings\/[a-zA-Z0-9_-]+$/,
  /^\/my-bookings$/,
  /^\/messages$/,
];

/**
 * Validates whether a target path is an approved, non-malformed customer route.
 * Rejects protocol-relative paths, worker routes, and unsupported paths.
 * Preserves recognized query strings (?jobId=..., ?category=..., ?q=...).
 */
const isValidCustomerDestination = (targetUrl) => {
  if (!targetUrl || typeof targetUrl !== 'string') return false;

  // Reject protocol-relative URLs (//), backslashes, or non-root paths
  if (!targetUrl.startsWith('/') || targetUrl.startsWith('//') || targetUrl.includes('\\')) {
    return false;
  }

  // Reject paths belonging to the worker experience
  if (targetUrl.startsWith('/worker-dashboard')) {
    return false;
  }

  // Extract pathname and search query string
  const [pathname, search] = targetUrl.split('?');

  // Verify pathname matches one of the registered patterns exactly
  const matchesPattern = REGISTERED_CUSTOMER_PATTERNS.some((pattern) => pattern.test(pathname));
  if (!matchesPattern) return false;

  // If query string exists, validate format
  if (search !== undefined) {
    // Reject duplicate question marks or malformed encodings
    if (search.includes('?') || targetUrl.indexOf('?') !== targetUrl.lastIndexOf('?')) {
      return false;
    }
    try {
      const params = new URLSearchParams(search);
      const recognizedKeys = ['jobId', 'category', 'q', 'filter', 'tab', 'sort', 'status'];
      for (const key of params.keys()) {
        if (!recognizedKeys.includes(key) && key.length > 30) {
          return false; // Reject oversized or unrecognized parameter injections
        }
      }
    } catch {
      return false;
    }
  }

  return true;
};

const getStoredItem = (key, fallback = null) => {
  try {
    const val = window.localStorage.getItem(key);
    return val !== null ? val : fallback;
  } catch (err) {
    console.warn(`LocalStorage read failed for ${key}:`, err);
    return fallback;
  }
};

const setStoredItem = (key, val) => {
  try {
    window.localStorage.setItem(key, val);
  } catch (err) {
    console.warn(`LocalStorage write failed for ${key}:`, err);
  }
};

/**
 * DemoModeToggle Component
 * Floating segmented control mounted at application root.
 * Enables quick switching between Customer and Worker (Rahul Sharma) personas.
 */
export default function DemoModeToggle() {
  const location = useLocation();
  const navigate = useNavigate();
  const [, startTransition] = useTransition();

  const currentPath = location.pathname + location.search;
  const isWorkerRoute = location.pathname.startsWith('/worker-dashboard');

  // Derive active mode directly during render to prevent cascading renders
  const activeMode = isWorkerRoute
    ? 'worker'
    : isValidCustomerDestination(currentPath)
      ? 'customer'
      : (getStoredItem(STORAGE_KEYS.DEMO_MODE, 'customer') === 'worker' ? 'worker' : 'customer');

  // Synchronize localStorage with current route
  useEffect(() => {
    if (isWorkerRoute) {
      setStoredItem(STORAGE_KEYS.DEMO_MODE, 'worker');
    } else if (isValidCustomerDestination(currentPath)) {
      setStoredItem(STORAGE_KEYS.DEMO_MODE, 'customer');
      setStoredItem(STORAGE_KEYS.LAST_CUSTOMER_ROUTE, currentPath);
    }
  }, [currentPath, isWorkerRoute]);

  const handleSwitchMode = (targetMode) => {
    if (targetMode === 'worker') {
      if (isWorkerRoute) return;

      // Stash current customer route if valid before navigating
      if (isValidCustomerDestination(currentPath)) {
        setStoredItem(STORAGE_KEYS.LAST_CUSTOMER_ROUTE, currentPath);
      }
      setStoredItem(STORAGE_KEYS.DEMO_MODE, 'worker');
      startTransition(() => {
        navigate('/worker-dashboard');
      });
    } else {
      // Switching to Customer mode
      if (!isWorkerRoute && activeMode === 'customer') return;

      const storedRoute = getStoredItem(STORAGE_KEYS.LAST_CUSTOMER_ROUTE);
      const destination = isValidCustomerDestination(storedRoute) ? storedRoute : '/';

      setStoredItem(STORAGE_KEYS.DEMO_MODE, 'customer');
      startTransition(() => {
        navigate(destination);
      });
    }
  };

  const isCustomer = activeMode === 'customer';
  const isWorker = activeMode === 'worker';

  return (
    <div
      role="group"
      aria-label="Kaarya demonstration experience switcher"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_10px_30px_rgba(0,0,0,0.12),0_1px_3px_rgba(0,0,0,0.06)] rounded-full p-1.5 flex items-center gap-1.5 max-w-[calc(100vw-2rem)] select-none transition-all pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))]"
    >
      {/* Ambient Demo Indicator */}
      <div className="hidden xs:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold tracking-wider uppercase select-none">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <span>Demo</span>
      </div>

      {/* Customer Option */}
      <button
        type="button"
        aria-pressed={isCustomer}
        aria-label="Switch to Customer experience"
        onClick={() => handleSwitchMode('customer')}
        className={`px-3 py-1 text-xs rounded-full font-medium transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none ${
          isCustomer
            ? 'bg-gradient-to-r from-primary-container to-secondary text-white font-semibold shadow-sm'
            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
        }`}
      >
        Customer
      </button>

      {/* Worker Option */}
      <button
        type="button"
        aria-pressed={isWorker}
        aria-label="Switch to Worker experience"
        onClick={() => handleSwitchMode('worker')}
        className={`px-3 py-1 text-xs rounded-full font-medium transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none ${
          isWorker
            ? 'bg-gradient-to-r from-primary-container to-secondary text-white font-semibold shadow-sm'
            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80'
        }`}
      >
        Worker (Pro)
      </button>
    </div>
  );
}
