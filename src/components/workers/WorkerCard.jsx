import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ShieldCheck } from 'lucide-react';

export default function WorkerCard({ worker }) {
  if (!worker) return null;

  return (
    <div className="bg-white rounded-2xl p-5 border border-kaarya-lavender shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-kaarya-lavender text-kaarya-purple font-bold text-lg flex items-center justify-center">
            {worker.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="font-semibold text-kaarya-navy">{worker.name}</h3>
              {worker.verified && (
                <ShieldCheck className="w-4 h-4 text-emerald-500 fill-emerald-100" />
              )}
            </div>
            <p className="text-xs text-gray-500">{worker.profession}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-kaarya-purple">₹{worker.hourlyRate}/hr</div>
          <div className="flex items-center text-xs text-amber-500 font-semibold space-x-0.5 justify-end mt-0.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{worker.rating}</span>
            <span className="text-gray-400 font-normal">({worker.reviewsCount})</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center text-xs text-gray-500 space-x-1">
        <MapPin className="w-3.5 h-3.5 text-gray-400" />
        <span>{worker.distance}</span>
        <span>•</span>
        <span>{worker.experienceYears} yrs exp</span>
      </div>

      {worker.skills && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {worker.skills.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="text-[11px] bg-kaarya-lavender/70 text-kaarya-purple px-2 py-0.5 rounded-md font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <Link
          to={`/professionals/${worker.id}`}
          className="text-xs font-semibold text-kaarya-purple hover:underline"
        >
          View Profile &rarr;
        </Link>
        <Link
          to={`/post-job?workerId=${worker.id}`}
          className="text-xs bg-kaarya-navy text-white px-3 py-1.5 rounded-lg hover:bg-kaarya-navy/90 font-medium"
        >
          Hire Now
        </Link>
      </div>
    </div>
  );
}
