import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

/**
 * Universal Root Layout for Kaarya
 * Mounts the shared Navbar persistently across all routes without constraining
 * full-width edge-to-edge layouts or creating duplicate footers.
 */
export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent text-kaarya-navy selection:bg-kaarya-lavender selection:text-kaarya-purple">
      <Navbar />
      <div className="flex-1 w-full flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}
