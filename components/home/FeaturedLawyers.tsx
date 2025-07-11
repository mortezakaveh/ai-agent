'use client';

import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Clock } from 'lucide-react';
import { LawyerProfile } from '@/lib/types';

interface FeaturedLawyersProps {
  lawyers: LawyerProfile[];
}

export function FeaturedLawyers({ lawyers }: FeaturedLawyersProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Top Lawyers
        </h2>
        <Link 
          href="/lawyers" 
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          View all →
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {lawyers.map((lawyer) => (
          <div key={lawyer.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <img
                src={lawyer.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.user?.full_name || 'Lawyer')}&background=3b82f6&color=fff`}
                alt={lawyer.user?.full_name || 'Lawyer'}
                className="w-12 h-12 rounded-full"
              />
              
              <div className="flex-1 min-w-0">
                <Link 
                  href={`/lawyers/${lawyer.user_id}`}
                  className="block group"
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 truncate">
                    {lawyer.user?.full_name || 'Anonymous Lawyer'}
                  </h3>
                </Link>
                
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {lawyer.average_rating.toFixed(1)} ({lawyer.total_reviews} reviews)
                    </span>
                  </div>
                  {lawyer.verified && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                      Verified
                    </span>
                  )}
                </div>
                
                <div className="mt-2">
                  <div className="flex items-center space-x-1 text-sm text-gray-500 mb-1">
                    <Clock className="h-3 w-3" />
                    <span>{lawyer.experience_years} years experience</span>
                  </div>
                  
                  {lawyer.office_address && (
                    <div className="flex items-center space-x-1 text-sm text-gray-500 mb-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{lawyer.office_address}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1">
                    {lawyer.specialization.slice(0, 2).map((spec, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded"
                      >
                        {spec}
                      </span>
                    ))}
                    {lawyer.specialization.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{lawyer.specialization.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
                
                {lawyer.hourly_rate && (
                  <div className="mt-3 text-lg font-semibold text-gray-900">
                    ${lawyer.hourly_rate}/hour
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {lawyers.length === 0 && (
          <div className="col-span-2 text-center py-8 text-gray-500">
            <p>No lawyers found.</p>
          </div>
        )}
      </div>
    </div>
  );
}