import React from 'react';
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase';

export default async function DashboardPage() {
  const supabase = createServerClient();
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login?redirectTo=/dashboard');
  }

  // Get user profile
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.full_name || 'User'}!
        </h1>
        <p className="text-gray-600">
          Manage your legal questions, appointments, and profile.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <a
                href="/ask"
                className="p-4 border rounded-lg hover:bg-gray-50 text-center"
              >
                <div className="text-primary-600 font-medium">Ask a Question</div>
                <div className="text-sm text-gray-500 mt-1">Get legal help</div>
              </a>
              <a
                href="/lawyers"
                className="p-4 border rounded-lg hover:bg-gray-50 text-center"
              >
                <div className="text-primary-600 font-medium">Find Lawyers</div>
                <div className="text-sm text-gray-500 mt-1">Connect with experts</div>
              </a>
              <a
                href="/feed"
                className="p-4 border rounded-lg hover:bg-gray-50 text-center"
              >
                <div className="text-primary-600 font-medium">Browse Feed</div>
                <div className="text-sm text-gray-500 mt-1">See latest questions</div>
              </a>
              <a
                href="/appointments"
                className="p-4 border rounded-lg hover:bg-gray-50 text-center"
              >
                <div className="text-primary-600 font-medium">Appointments</div>
                <div className="text-sm text-gray-500 mt-1">Manage consultations</div>
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Profile
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-500">Role:</span>
                <span className="ml-2 capitalize">{user?.role}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Email:</span>
                <span className="ml-2">{user?.email}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Member since:</span>
                <span className="ml-2">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Getting Started
            </h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li>• Complete your profile</li>
              <li>• Ask your first legal question</li>
              <li>• Follow interesting lawyers</li>
              <li>• Book a consultation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}