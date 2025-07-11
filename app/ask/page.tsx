import React from 'react';
import { createServerClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { AskQuestionForm } from '@/components/questions/AskQuestionForm';

export const metadata = {
  title: 'Ask a Legal Question - Legal AI Assistant',
  description: 'Get instant AI-powered legal assistance and expert lawyer responses.',
};

export default async function AskPage() {
  const supabase = createServerClient();
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login?redirectTo=/ask');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Ask a Legal Question
        </h1>
        <p className="text-gray-600">
          Get instant AI-powered responses and connect with qualified lawyers.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <AskQuestionForm />
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          How it works
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
              1
            </span>
            Ask your legal question with as much detail as possible
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
              2
            </span>
            Get an instant AI-powered response with general legal information
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
              3
            </span>
            Qualified lawyers can provide additional expert insights
          </li>
          <li className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
              4
            </span>
            Schedule consultations with lawyers for personalized advice
          </li>
        </ul>
        <p className="text-sm text-blue-700 mt-4">
          <strong>Disclaimer:</strong> AI responses provide general information only and should not be considered as legal advice. 
          For specific legal matters, please consult with a qualified attorney.
        </p>
      </div>
    </div>
  );
}