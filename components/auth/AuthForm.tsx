'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { validateEmail } from '@/lib/utils';
import toast from 'react-hot-toast';

interface AuthFormProps {
  mode: 'login' | 'register';
  redirectTo?: string;
}

interface FormData {
  email: string;
  password: string;
  fullName?: string;
  role?: 'client' | 'lawyer';
}

export function AuthForm({ mode, redirectTo }: AuthFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormData>();

  const email = watch('email');

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const supabase = createClient();
    
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (error) throw error;

        toast.success('Signed in successfully!');
        router.push(redirectTo || '/dashboard');
      } else {
        // Register mode
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            fullName: data.fullName,
            role: data.role || 'client'
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create account');
        }

        toast.success('Account created successfully! Please check your email to verify your account.');
        router.push('/auth/login');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || `Failed to ${mode === 'login' ? 'sign in' : 'create account'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {mode === 'register' && (
        <>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              {...register('fullName', { required: 'Full name is required' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              I am a
            </label>
            <select
              id="role"
              {...register('role', { required: 'Please select your role' })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select your role</option>
              <option value="client">Client (seeking legal help)</option>
              <option value="lawyer">Lawyer (providing legal services)</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>
        </>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          type="email"
          id="email"
          {...register('email', {
            required: 'Email is required',
            validate: (value) => validateEmail(value) || 'Please enter a valid email'
          })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1 relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            mode === 'login' ? 'Sign in' : 'Create account'
          )}
        </button>
      </div>

      {mode === 'login' && (
        <div className="text-center">
          <a
            href="#"
            className="text-sm text-primary-600 hover:text-primary-500"
          >
            Forgot your password?
          </a>
        </div>
      )}
    </form>
  );
}