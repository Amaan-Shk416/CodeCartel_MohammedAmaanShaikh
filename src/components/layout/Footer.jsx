import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-kaarya-lavender/60 bg-white/70 py-6 text-center text-xs text-gray-500">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-kaarya-purple" />
          <span className="font-semibold text-kaarya-navy">Kaarya</span>
          <span>— Where Skills Meet Opportunity</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-500">
          <span>Hyperlocal Blue-Collar Services Marketplace</span>
          <span>•</span>
          <span className="inline-flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-kaarya-pink fill-kaarya-pink" /> for Hackathon
          </span>
        </div>
      </div>
    </footer>
  );
}
