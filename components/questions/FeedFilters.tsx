'use client';

import React from 'react';
import Link from 'next/link';
import { Filter, TrendingUp, Clock, Heart, MessageSquare } from 'lucide-react';
import { legalCategories } from '@/lib/utils';

interface FeedFiltersProps {
  currentCategory: string;
  currentSort: string;
}

export function FeedFilters({ currentCategory, currentSort }: FeedFiltersProps) {
  const sortOptions = [
    { value: 'newest', label: 'Newest', icon: Clock },
    { value: 'oldest', label: 'Oldest', icon: Clock },
    { value: 'popular', label: 'Most Liked', icon: Heart },
    { value: 'mostAnswered', label: 'Most Answered', icon: MessageSquare },
  ];

  const buildFilterUrl = (category?: string, sort?: string) => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);
    if (sort && sort !== 'newest') params.set('sort', sort);
    const query = params.toString();
    return `/feed${query ? `?${query}` : ''}`;
  };

  return (
    <div className="bg-white border rounded-lg p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Filter className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
      </div>

      <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Category</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            <Link
              href={buildFilterUrl('all', currentSort)}
              className={`px-3 py-2 text-sm rounded-lg text-center transition-colors ${
                (!currentCategory || currentCategory === 'all')
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </Link>
            {legalCategories.map((category) => (
              <Link
                key={category}
                href={buildFilterUrl(category, currentSort)}
                className={`px-3 py-2 text-sm rounded-lg text-center transition-colors ${
                  currentCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        {/* Sort Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Sort by</h4>
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <Link
                key={option.value}
                href={buildFilterUrl(currentCategory, option.value)}
                className={`inline-flex items-center space-x-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                  currentSort === option.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <option.icon className="h-4 w-4" />
                <span>{option.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}