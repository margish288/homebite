'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CookLoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        // Get the session to verify it's a cook
        const session = await getSession();
        
        if (session?.user?.role !== 'cook') {
          setError('This login is for home cooks only. Please use regular login.');
          return;
        }

        router.push('/cook/dashboard');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="bg-primary-400 p-3 rounded-full">
              <span className="text-4xl">👨‍🍳</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-ink">
            Cook Dashboard Login
          </h2>
          <p className="mt-2 text-center text-sm text-ink-light">
            Welcome back! Sign in to manage your home cooking business
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-soft-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-ink mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-ink mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In to Dashboard'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-ink-light">
                Don't have a cook account?{' '}
                <Link href="/cook/auth/signup" className="text-primary-500 hover:text-primary-600 font-medium">
                  Join as Cook
                </Link>
              </p>
            </div>

            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-sm text-ink-light mb-3">Looking to order food?</p>
              <Link
                href="/auth/login"
                className="btn-outline text-sm px-6 py-2"
              >
                🍽️ Customer Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
