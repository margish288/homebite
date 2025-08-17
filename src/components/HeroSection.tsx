'use client';

import { useState } from 'react';

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
    <div className="relative bg-gradient-to-br from-primary-400 to-primary-600 text-white">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-black/40"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1920&h=1080&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="relative container max-w-6xl mx-auto px-4 py-20 lg:py-28">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Discover the best food & drinks in{' '}
            <span className="text-yellow-300">your city</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Find restaurants, cafes, bars, and more. Order online or book a table for dining out.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 bg-white rounded-xl p-2 shadow-soft-lg">
              {/* Location Input */}
              <div className="flex items-center flex-1 px-4 py-2 border-r border-gray-200">
                <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Enter your location"
                  className="flex-1 outline-none text-gray-700 placeholder-gray-500"
                  defaultValue="Delhi NCR"
                />
              </div>

              {/* Search Input */}
              <div className="flex items-center flex-1 px-4 py-2">
                <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for restaurant, cuisine or dish"
                  className="flex-1 outline-none text-gray-700 placeholder-gray-500"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Access Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              🍕 Order Food
            </button>
            <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              🍽️ Book a Table
            </button>
            <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              🍸 Nightlife
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
