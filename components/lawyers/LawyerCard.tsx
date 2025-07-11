'use client';

import React from 'react';
import Link from 'next/link';
import { Star, MapPin, Clock, DollarSign, Shield } from 'lucide-react';
import { LawyerProfile } from '@/lib/types';
import { generateAvatar } from '@/lib/utils';

interface LawyerCardProps {
  lawyer: LawyerProfile;
}

export function LawyerCard({ lawyer }: LawyerCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <img
          src={lawyer.user?.avatar_url || generateAvatar(lawyer.user?.full_name)}
          alt={lawyer.user?.full_name || 'Lawyer'}
          className="w-16 h-16 rounded-full"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <Link 
              href={`/lawyers/${lawyer.user_id}`}
              className="text-lg font-semibold text-gray-900 hover:text-primary-600 truncate"
            >
              {lawyer.user?.full_name || 'Anonymous Lawyer'}
            </Link>
            {lawyer.verified && (
              <Shield className="h-4 w-4 text-green-500" />
            )}
          </div>
          
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-gray-900">
                {lawyer.average_rating.toFixed(1)}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              ({lawyer.total_reviews} reviews)
            </span>
          </div>

          <div className="space-y-1 mb-3">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Clock className="h-3 w-3" />
              <span>{lawyer.experience_years} years experience</span>
            </div>
            
            {lawyer.office_address && (
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{lawyer.office_address}</span>
              </div>
            )}

            {lawyer.hourly_rate && (
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <DollarSign className="h-3 w-3" />
                <span>${lawyer.hourly_rate}/hour</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {lawyer.specialization.slice(0, 3).map((spec, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded"
              >
                {spec}
              </span>
            ))}
            {lawyer.specialization.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                +{lawyer.specialization.length - 3}
              </span>
            )}
          </div>

          {lawyer.bio && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {lawyer.bio}
            </p>
          )}

          <div className="flex space-x-2">
            <Link
              href={`/lawyers/${lawyer.user_id}`}
              className="flex-1 px-3 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 text-center"
            >
              View Profile
            </Link>
            <Link
              href={`/appointments/book?lawyer=${lawyer.user_id}`}
              className="flex-1 px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 text-center"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}