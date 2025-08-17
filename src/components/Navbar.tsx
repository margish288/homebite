'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <nav className="sticky top-0 z-50 bg-paper/95 dark:bg-dark-bg/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-soft">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 text-xl lg:text-2xl font-bold text-ink dark:text-dark-text hover:text-primary-500 transition-colors">
              <span className="text-2xl lg:text-3xl">🍱</span>
              <span>HomeBite</span>
            </Link>
          </div>

          {/* Search Bar - Center */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search home cooks or dishes"
                className="w-full pl-12 pr-4 py-3 lg:py-4 bg-white dark:bg-dark-surface border border-gray-300 dark:border-gray-600 rounded-xl text-ink dark:text-dark-text placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all shadow-soft hover:shadow-soft-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/discover" className="text-ink-light dark:text-dark-text-muted hover:text-primary-500 font-medium transition-colors">
              Discover
            </Link>
            
            {session ? (
              <>
                {session.user.role === 'cook' && (
                  <Link href="/cook/dashboard" className="text-ink-light dark:text-dark-text-muted hover:text-primary-500 font-medium transition-colors">
                    Dashboard
                  </Link>
                )}
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 text-ink dark:text-dark-text hover:text-primary-500 font-medium transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center text-sm font-semibold text-ink">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span>{session.user.name}</span>
                    <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-surface rounded-xl shadow-soft-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                      <Link 
                        href={session.user.role === 'cook' ? '/cook/profile' : '/profile'}
                        className="block px-4 py-2 text-sm text-ink dark:text-dark-text hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        👤 Profile
                      </Link>
                      {session.user.role === 'user' && (
                        <Link 
                          href="/orders"
                          className="block px-4 py-2 text-sm text-ink dark:text-dark-text hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          📦 My Orders
                        </Link>
                      )}
                      {session.user.role === 'cook' && (
                        <>
                          <Link 
                            href="/cook/orders"
                            className="block px-4 py-2 text-sm text-ink dark:text-dark-text hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            📋 Orders
                          </Link>
                          <Link 
                            href="/cook/menu"
                            className="block px-4 py-2 text-sm text-ink dark:text-dark-text hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            🍽️ Menu
                          </Link>
                        </>
                      )}
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button 
                        onClick={() => {
                          setIsDropdownOpen(false);
                          signOut({ callbackUrl: '/' });
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        🚪 Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-ink-light dark:text-dark-text-muted hover:text-primary-500 font-medium transition-colors">
                  Login
                </Link>
                <Link href="/auth/signup" className="btn-primary px-4 py-2">
                  Sign Up
                </Link>
                <Link href="/cook/auth/signup" className="btn-outline px-4 py-2">
                  Become a Cook
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg text-ink-light dark:text-dark-text-muted hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
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
              placeholder="Search home cooks or dishes"
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-surface border border-gray-300 dark:border-gray-600 rounded-xl text-ink dark:text-dark-text placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all shadow-soft"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
