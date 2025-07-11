'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Loader2, Send, Sparkles } from 'lucide-react';
import { legalCategories } from '@/lib/utils';
import toast from 'react-hot-toast';

interface QuestionFormData {
  title: string;
  content: string;
  category: string;
  tags: string;
}

export function AskQuestionForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [showAiResponse, setShowAiResponse] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<QuestionFormData>();

  const watchedContent = watch('content');

  const generateAiPreview = async () => {
    const content = watchedContent;
    if (!content || content.length < 20) {
      toast.error('Please write at least 20 characters to get an AI preview');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/ai/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: content }),
      });

      if (!response.ok) throw new Error('Failed to generate AI preview');

      const data = await response.json();
      setAiResponse(data.response);
      setShowAiResponse(true);
    } catch (error) {
      toast.error('Failed to generate AI preview');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: QuestionFormData) => {
    setIsSubmitting(true);
    try {
      const tagsArray = data.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          category: data.category,
          tags: tagsArray,
        }),
      });

      if (!response.ok) throw new Error('Failed to create question');

      const question = await response.json();
      toast.success('Question posted successfully!');
      router.push(`/questions/${question.id}`);
    } catch (error) {
      toast.error('Failed to post question');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Question Title *
          </label>
          <input
            type="text"
            id="title"
            {...register('title', { required: 'Title is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., What are my rights as a tenant if my landlord wants to evict me?"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Legal Category *
          </label>
          <select
            id="category"
            {...register('category', { required: 'Category is required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select a category</option>
            {legalCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Question Details *
            </label>
            <button
              type="button"
              onClick={generateAiPreview}
              disabled={isSubmitting || !watchedContent || watchedContent.length < 20}
              className="inline-flex items-center space-x-1 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="h-4 w-4" />
              <span>AI Preview</span>
            </button>
          </div>
          <textarea
            id="content"
            rows={6}
            {...register('content', { required: 'Question details are required' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Provide as much detail as possible about your legal question. Include relevant facts, dates, and circumstances..."
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Be specific and include all relevant details. The more information you provide, the better the responses you'll receive.
          </p>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags (optional)
          </label>
          <input
            type="text"
            id="tags"
            {...register('tags')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., tenant rights, eviction, lease agreement (separate with commas)"
          />
          <p className="mt-1 text-sm text-gray-500">
            Add relevant tags to help others find your question. Separate multiple tags with commas.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span>{isSubmitting ? 'Posting...' : 'Post Question'}</span>
          </button>
        </div>
      </form>

      {/* AI Response Preview */}
      {showAiResponse && aiResponse && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span>AI Response Preview</span>
          </h3>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap">{aiResponse}</div>
            </div>
            <div className="mt-4 text-sm text-purple-700 bg-purple-100 rounded p-2">
              <strong>Note:</strong> This is an AI-generated response for preview purposes. 
              After posting your question, you'll receive this response automatically, and qualified lawyers can provide additional expert insights.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}