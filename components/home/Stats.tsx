'use client';

import React from 'react';

export function Stats() {
  const stats = [
    { label: 'Questions Answered', value: '10,000+' },
    { label: 'Verified Lawyers', value: '500+' },
    { label: 'Happy Clients', value: '5,000+' },
    { label: 'Legal Categories', value: '15+' },
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our growing community of clients and lawyers working together to solve legal challenges.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}