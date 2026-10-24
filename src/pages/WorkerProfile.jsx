import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Star, MapPin, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { MOCK_WORKERS } from '../data/mockData';

export default function WorkerProfile() {
  const { id } = useParams();
  const worker = MOCK_WORKERS.find((w) => w.id === id) || {
    id: id || 'w1',
    name: 'Sample Worker',
    profession: 'Skilled Technician',
    rating: 4.8,
    reviewsCount: 50,
    hourlyRate: 350,
    distance: '1.0 km away',
    verified: true,
    badges: ['Verified Pro'],
    phone: '+91 98765 00000',
    experienceYears: 5,
    bio: 'Professional technician with proven track record in local on-demand service fulfillment.',
    skills: ['General Service', 'Repairs', 'Maintenance'],
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/professionals"
        className="inline-flex items-center space-x-1.5 text-sm font-medium text-kaarya-purple hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Professionals</span>
      </Link>

      <div className="bg-white rounded-2xl border border-kaarya-lavender p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-kaarya-purple to-kaarya-pink text-white font-bold text-2xl flex items-center justify-center shadow-md">
              {worker.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-kaarya-navy">{worker.name}</h1>
                {worker.verified && (
                  <span className="inline-flex items-center space-x-1 text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{worker.profession}</p>
              <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center space-x-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{worker.rating}</span>
                  <span className="text-gray-400 font-normal">({worker.reviewsCount} reviews)</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{worker.distance}</span>
                </span>
                <span>•</span>
                <span>{worker.experienceYears} Years Experience</span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-2xl font-black text-kaarya-purple">₹{worker.hourlyRate}</div>
            <span className="text-xs text-gray-400">per hour</span>
          </div>
        </div>

        {/* Bio & Skills */}
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">About Professional</h2>
            <p className="text-sm text-gray-700 mt-1 leading-relaxed">{worker.bio}</p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Verified Skill Sets</h2>
            <div className="flex flex-wrap gap-2">
              {worker.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-1 text-xs bg-kaarya-lavender text-kaarya-purple font-medium px-3 py-1 rounded-lg"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-gray-500 font-mono">
            Route: /professionals/{id || ':id'}
          </div>
          <div className="flex space-x-3">
            <Link
              to={`/messages?recipient=${worker.id}`}
              className="px-4 py-2 border border-gray-300 text-kaarya-navy rounded-xl text-sm font-semibold hover:bg-gray-50"
            >
              Send Message
            </Link>
            <Link
              to={`/post-job?workerId=${worker.id}`}
              className="px-5 py-2 bg-gradient-to-r from-kaarya-purple to-kaarya-pink text-white rounded-xl text-sm font-semibold hover:opacity-95 shadow-md shadow-kaarya-purple/20"
            >
              Book Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
