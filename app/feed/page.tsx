import React from 'react';
import { createServerClient } from '@/lib/supabase';
import { QuestionFeed } from '@/components/questions/QuestionFeed';
import { FeedFilters } from '@/components/questions/FeedFilters';

export const metadata = {
  title: 'Legal Questions Feed - Legal AI Assistant',
  description: 'Browse and answer legal questions from the community.',
};

interface FeedPageProps {
  searchParams: {
    category?: string;
    sort?: string;
    page?: string;
  };
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const supabase = createServerClient();
  
  const category = searchParams.category || '';
  const sort = searchParams.sort || 'newest';
  const page = parseInt(searchParams.page || '1');
  const pageSize = 10;
  
  // Build query
  let query = supabase
    .from('questions')
    .select(`
      *,
      user:users(*),
      answers(count),
      question_likes(count)
    `);

  // Apply filters
  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  // Apply sorting
  switch (sort) {
    case 'oldest':
      query = query.order('created_at', { ascending: true });
      break;
    case 'popular':
      query = query.order('likes_count', { ascending: false });
      break;
    case 'mostAnswered':
      query = query.order('answers.count', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  // Apply pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  
  const { data: questions, count } = await query
    .range(from, to)
    .limit(pageSize);

  const totalPages = count ? Math.ceil(count / pageSize) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Legal Questions Feed
        </h1>
        <p className="text-gray-600">
          Browse and contribute to legal discussions in our community.
        </p>
      </div>

      <FeedFilters 
        currentCategory={category}
        currentSort={sort}
      />

      <QuestionFeed 
        questions={questions || []}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  );
}