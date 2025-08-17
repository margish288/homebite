'use client';

import { useState } from 'react';
import Link from 'next/link';

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="relative min-h-screen hb-gradient-bg hb-grid overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-primary-300/10 rounded-full blur-2xl animate-pulse delay-300"></div>
        <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-primary-500/15 rounded-full blur-xl animate-pulse delay-700"></div>
        <div className="absolute bottom-20 right-1/3 w-16 h-16 bg-primary-400/25 rounded-full blur-lg animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative container max-w-7xl mx-auto px-4 py-20 lg:py-32 flex items-center min-h-screen">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center bg-primary-400/20 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
              🍱 Trusted Home Cooks
            </div>
            
            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-ink">
                Delicious{' '}
                <span className="text-primary-500">Home-Cooked</span>{' '}
                Meals{' '}
                <span className="relative">
                  Delivered
                  <div className="absolute -bottom-2 left-0 right-0 h-3 bg-primary-400/30 -rotate-1"></div>
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-ink-light max-w-xl lg:mx-0 mx-auto leading-relaxed">
                Connect with talented home cooks in your neighborhood. Enjoy authentic, 
                homestyle meals made with love and delivered fresh to your door.
              </p>
            </div>

            {/* Stats */}
            <div className="flex justify-center lg:justify-start items-center gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-500">500+</div>
                <div className="text-sm text-ink-light">Home Cooks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-500">10K+</div>
                <div className="text-sm text-ink-light">Happy Customers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-500">25+</div>
                <div className="text-sm text-ink-light">Cuisines</div>
              </div>
            </div>
          </div>

          {/* Right Side - Search */}
          <div className="relative">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-soft-lg border border-white/20">
              <h3 className="text-xl font-semibold text-ink mb-6 text-center">
                Find Your Perfect Meal
              </h3>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="space-y-4">
                {/* Location Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter your location"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    defaultValue="Delhi NCR"
                  />
                </div>

                {/* Search Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for home cook, cuisine or dish"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  />
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full btn-primary py-3 text-base font-medium"
                >
                  🔍 Find Home Cooks
                </button>
              </form>

              {/* Popular Searches */}
              <div className="mt-6">
                <p className="text-sm text-ink-light mb-3">Popular searches:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="chip text-xs cursor-pointer hover:bg-primary-100">🍛 Indian</span>
                  <span className="chip text-xs cursor-pointer hover:bg-primary-100">🍝 Italian</span>
                  <span className="chip text-xs cursor-pointer hover:bg-primary-100">🥗 Healthy</span>
                  <span className="chip text-xs cursor-pointer hover:bg-primary-100">🍰 Desserts</span>
                </div>
              </div>

              {/* Auth CTAs */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-ink-light mb-3 text-center">Join our community:</p>
                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    href="/auth/signup" 
                    className="btn-primary py-2.5 text-sm font-medium text-center"
                  >
                    👤 Sign Up to Order
                  </Link>
                  <Link 
                    href="/cook/auth/signup" 
                    className="btn-outline py-2.5 text-sm font-medium text-center"
                  >
                    👨‍🍳 Become a Cook
                  </Link>
                </div>
                <p className="text-xs text-ink-lighter text-center mt-2">
                  Already have an account? <Link href="/auth/login" className="text-primary-500 hover:text-primary-600">Sign in</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
