import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
      <div className="text-5xl font-black text-kaarya-purple">404</div>
      <h1 className="text-xl font-bold text-kaarya-navy">Page Not Found</h1>
      <p className="text-sm text-gray-500 max-w-sm">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-kaarya-purple text-white text-sm font-semibold hover:bg-kaarya-purple/90"
      >
        <Home className="w-4 h-4" />
        <span>Return Home</span>
      </Link>
    </div>
  );
}
