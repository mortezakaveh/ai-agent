'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, Heart, Eye, ArrowLeft, ArrowRight } from 'lucide-react';
import { Question } from '@/lib/types';
import { formatRelativeTime, truncateText } from '@/lib/utils';

interface QuestionFeedProps {
  questions: Question[];
  currentPage: number;
  totalPages: number;
}

export function QuestionFeed({ questions, currentPage, totalPages }: QuestionFeedProps) {
  return (
    <div className="space-y-6">
      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                    {question.category}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {formatRelativeTime(question.created_at)}
                  </span>
                  {question.ai_generated && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                      AI Response
                    </span>
                  )}
                </div>
                
                <Link 
                  href={`/questions/${question.id}`}
                  className="block group mb-3"
                >
                  <h2 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 mb-2">
                    {question.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {truncateText(question.content, 200)}
                  </p>
                </Link>

                {/* Tags */}
                {question.tags && question.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {question.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{question.answers?.length || 0} answers</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className={`h-4 w-4 ${question.is_liked ? 'text-red-500 fill-current' : ''}`} />
                    <span>{question.likes_count} likes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{question.views_count} views</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className={`w-2 h-2 rounded-full ${
                      question.status === 'open' ? 'bg-green-500' : 
                      question.status === 'answered' ? 'bg-blue-500' : 
                      'bg-gray-500'
                    }`}></span>
                    <span className="capitalize">{question.status}</span>
                  </div>
                </div>
              </div>
              
              {/* User Avatar */}
              {question.user && (
                <div className="flex items-center ml-6">
                  <Link 
                    href={`/users/${question.user.id}`}
                    className="flex items-center space-x-2 hover:opacity-80"
                  >
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {question.user.full_name || 'Anonymous'}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {question.user.role}
                      </div>
                    </div>
                    <img
                      src={question.user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(question.user.full_name || 'User')}&background=3b82f6&color=fff`}
                      alt={question.user.full_name || 'User'}
                      className="w-10 h-10 rounded-full"
                    />
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}

        {questions.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-500 mb-4">
              Be the first to ask a question in this category.
            </p>
            <Link
              href="/ask"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Ask a Question</span>
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-6">
          <div className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          
          <div className="flex items-center space-x-2">
            {currentPage > 1 && (
              <Link
                href={`?page=${currentPage - 1}`}
                className="inline-flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </Link>
            )}
            
            {/* Page numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNum > totalPages) return null;
                
                return (
                  <Link
                    key={pageNum}
                    href={`?page=${pageNum}`}
                    className={`px-3 py-2 text-sm rounded-lg ${
                      pageNum === currentPage
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>
            
            {currentPage < totalPages && (
              <Link
                href={`?page=${currentPage + 1}`}
                className="inline-flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}