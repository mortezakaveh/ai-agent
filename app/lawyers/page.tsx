import React from 'react';
import { createServerClient } from '@/lib/supabase';
import { LawyerCard } from '@/components/lawyers/LawyerCard';
import { LawyerFilters } from '@/components/lawyers/LawyerFilters';

export const metadata = {
  title: 'Find Lawyers - Legal AI Assistant',
  description: 'Find and connect with qualified lawyers in your area.',
};

interface LawyersPageProps {
  searchParams: {
    specialization?: string;
    location?: string;
    sort?: string;
    page?: string;
  };
}

export default async function LawyersPage({ searchParams }: LawyersPageProps) {
  const supabase = createServerClient();
  
  const specialization = searchParams.specialization || '';
  const location = searchParams.location || '';
  const sort = searchParams.sort || 'rating';
  const page = parseInt(searchParams.page || '1');
  const pageSize = 12;

  // Build query
  let query = supabase
    .from('lawyer_profiles')
    .select(`
      *,
      user:users(*)
    `)
    .eq('verified', true);

  // Apply filters
  if (specialization) {
    query = query.contains('specialization', [specialization]);
  }

  if (location) {
    query = query.ilike('office_address', `%${location}%`);
  }

  // Apply sorting
  switch (sort) {
    case 'experience':
      query = query.order('experience_years', { ascending: false });
      break;
    case 'rate':
      query = query.order('hourly_rate', { ascending: true });
      break;
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    default:
      query = query.order('average_rating', { ascending: false });
  }

  // Apply pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  
  const { data: lawyers, count } = await query
    .range(from, to)
    .limit(pageSize);

  const totalPages = count ? Math.ceil(count / pageSize) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Legal Experts
          </h1>
          <p className="text-gray-600">
            Connect with verified lawyers who specialize in your legal needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <LawyerFilters
              currentSpecialization={specialization}
              currentLocation={location}
              currentSort={sort}
            />
          </div>

          {/* Lawyers Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                {count ? `${count} lawyers found` : 'No lawyers found'}
              </p>
            </div>

            {lawyers && lawyers.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {lawyers.map((lawyer) => (
                  <LawyerCard key={lawyer.id} lawyer={lawyer} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  No lawyers found matching your criteria.
                </p>
                <a
                  href="/lawyers"
                  className="text-primary-600 hover:text-primary-700"
                >
                  Clear filters
                </a>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <a
                      key={pageNum}
                      href={`?${new URLSearchParams({ ...searchParams, page: pageNum.toString() }).toString()}`}
                      className={`px-3 py-2 text-sm rounded-lg ${
                        pageNum === page
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}