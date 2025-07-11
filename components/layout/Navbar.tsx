'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  LogOut, 
  Menu, 
  X, 
  Scale, 
  MessageSquare, 
  Calendar,
  Users,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase';
import { generateAvatar } from '@/lib/utils';
import toast from 'react-hot-toast';

export function Navbar() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/');
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const navigation = [
    { name: 'Feed', href: '/feed', icon: MessageSquare },
    { name: 'Ask Question', href: '/ask', icon: MessageSquare },
    { name: 'Lawyers', href: '/lawyers', icon: Users },
    { name: 'Appointments', href: '/appointments', icon: Calendar },
    { name: 'Blog', href: '/blog', icon: BookOpen },
  ];

  return (
    <nav className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
            >
              <Scale className="h-8 w-8" />
              <span className="font-bold text-xl">LegalAI</span>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              </div>
            ) : user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <img
                    src={user.user_metadata?.avatar_url || generateAvatar(user.user_metadata?.full_name)}
                    alt={user.user_metadata?.full_name || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user.user_metadata?.full_name || 'User'}
                  </span>
                </button>

                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}