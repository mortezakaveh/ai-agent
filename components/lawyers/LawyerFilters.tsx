'use client';

import React from 'react';
import Link from 'next/link';
import { Filter, MapPin, Briefcase } from 'lucide-react';
import { legalCategories } from '@/lib/utils';

interface LawyerFiltersProps {
  currentSpecialization: string;
  currentLocation: string;
  currentSort: string;
}

export function LawyerFilters({ 
  currentSpecialization, 
  currentLocation, 
  currentSort 
}: LawyerFiltersProps) {
  const sortOptions = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'experience', label: 'Most Experienced' },
    { value: 'rate', label: 'Lowest Rate' },
    { value: 'newest', label: 'Newest' },
  ];

  const buildFilterUrl = (specialization?: string, location?: string, sort?: string) => {
    const params = new URLSearchParams();
    if (specialization) params.set('specialization', specialization);
    if (location) params.set('location', location);
    if (sort && sort !== 'rating') params.set('sort', sort);
    const query = params.toString();
    return `/lawyers${query ? `?${query}` : ''}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-20">
      <div className="flex items-center space-x-2 mb-6">
        <Filter className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
      </div>

      <div className="space-y-6">
        {/* Specialization Filter */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Briefcase className="h-4 w-4 text-gray-500" />
            <h4 className="text-sm font-medium text-gray-700">Specialization</h4>
          </div>
          <div className="space-y-2">
            <Link
              href={buildFilterUrl('', currentLocation, currentSort)}
              className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                !currentSpecialization
                  ? 'bg-primary-50 text-primary-700 border border-primary-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Specializations
            </Link>
            {legalCategories.slice(0, -1).map((category) => (
              <Link
                key={category}
                href={buildFilterUrl(category, currentLocation, currentSort)}
                className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                  currentSpecialization === category
                    ? 'bg-primary-50 text-primary-700 border border-primary-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        {/* Location Search */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <MapPin className="h-4 w-4 text-gray-500" />
            <h4 className="text-sm font-medium text-gray-700">Location</h4>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const location = formData.get('location') as string;
              window.location.href = buildFilterUrl(currentSpecialization, location, currentSort);
            }}
          >
            <input
              type="text"
              name="location"
              placeholder="City, State"
              defaultValue={currentLocation}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="mt-2 w-full px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Apply
            </button>
          </form>
        </div>

        {/* Sort Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Sort by</h4>
          <div className="space-y-2">
            {sortOptions.map((option) => (
              <Link
                key={option.value}
                href={buildFilterUrl(currentSpecialization, currentLocation, option.value)}
                className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                  currentSort === option.value
                    ? 'bg-primary-50 text-primary-700 border border-primary-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {(currentSpecialization || currentLocation || currentSort !== 'rating') && (
          <div className="pt-4 border-t">
            <Link
              href="/lawyers"
              className="block w-full px-3 py-2 text-sm text-center text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Clear All Filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}