import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

/**
 * ContentLayout provides standard framed container padding and a shared Footer
 * for internal pages (WorkerProfile, NotFound) that do not render their own
 * dedicated full-bleed edge-to-edge layout footers.
 */
export default function ContentLayout() {
  return (
    <div className="flex-1 flex flex-col w-full bg-kaarya-bg text-kaarya-navy">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
