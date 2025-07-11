import React from 'react';
import { createServerClient } from '@/lib/supabase';
import { Hero } from '@/components/home/Hero';
import { FeaturedQuestions } from '@/components/home/FeaturedQuestions';
import { FeaturedLawyers } from '@/components/home/FeaturedLawyers';
import { Stats } from '@/components/home/Stats';

export default async function HomePage() {
  const supabase = createServerClient();

  // Fetch featured questions and lawyers
  const [questionsResponse, lawyersResponse] = await Promise.all([
    supabase
      .from('questions')
      .select(`
        *,
        user:users(*),
        answers(count)
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('lawyer_profiles')
      .select(`
        *,
        user:users(*)
      `)
      .eq('verified', true)
      .order('average_rating', { ascending: false })
      .limit(4)
  ]);

  const featuredQuestions = questionsResponse.data || [];
  const featuredLawyers = lawyersResponse.data || [];

  return (
    <div className="min-h-screen">
      <Hero />
      <Stats />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-16">
          <FeaturedQuestions questions={featuredQuestions} />
          <FeaturedLawyers lawyers={featuredLawyers} />
        </div>
      </div>
    </div>
  );
}