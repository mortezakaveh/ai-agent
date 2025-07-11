'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, Heart, Eye } from 'lucide-react';
import { Question } from '@/lib/types';
import { formatRelativeTime, truncateText } from '@/lib/utils';

interface FeaturedQuestionsProps {
  questions: Question[];
}

export function FeaturedQuestions({ questions }: FeaturedQuestionsProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Recent Questions
        </h2>
        <Link 
          href="/feed" 
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          View all →
        </Link>
      </div>

      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                    {question.category}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {formatRelativeTime(question.created_at)}
                  </span>
                </div>
                
                <Link 
                  href={`/questions/${question.id}`}
                  className="block group"
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 mb-2">
                    {question.title}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {truncateText(question.content, 150)}
                  </p>
                </Link>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{question.answers?.length || 0} answers</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{question.likes_count} likes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{question.views_count} views</span>
                  </div>
                </div>
              </div>
              
              {question.user && (
                <div className="flex items-center ml-4">
                  <img
                    src={question.user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(question.user.full_name || 'User')}&background=3b82f6&color=fff`}
                    alt={question.user.full_name || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                </div>
              )}
            </div>
          </div>
        ))}

        {questions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No questions yet. Be the first to ask!</p>
          </div>
        )}
      </div>
    </div>
  );
}