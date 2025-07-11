'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, MessageSquare, Users, Zap } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative bg-gradient-to-r from-primary-600 to-primary-700">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Get Expert Legal Help
            <span className="block text-primary-200">Powered by AI</span>
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Connect with qualified lawyers and get instant AI-powered legal assistance. 
            Ask questions, schedule consultations, and get the legal help you need.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/ask"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors inline-flex items-center space-x-2"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Ask a Question</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/lawyers"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center space-x-2"
            >
              <Users className="h-5 w-5" />
              <span>Find Lawyers</span>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Instant AI Responses</h3>
            <p className="text-primary-100">
              Get immediate answers to your legal questions powered by advanced AI technology.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Expert Lawyers</h3>
            <p className="text-primary-100">
              Connect with verified lawyers specializing in your specific legal needs.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Community Support</h3>
            <p className="text-primary-100">
              Join a community of people sharing legal knowledge and experiences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}