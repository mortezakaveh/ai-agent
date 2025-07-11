import React from 'react';
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase';
import { AuthForm } from '@/components/auth/AuthForm';

export const metadata = {
  title: 'Sign Up - Legal AI Assistant',
  description: 'Create your Legal AI Assistant account.',
};

export default async function RegisterPage() {
  const supabase = createServerClient();
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <a
              href="/auth/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </a>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <AuthForm mode="register" />
        </div>
      </div>
    </div>
  );
}