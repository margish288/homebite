'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  avgRating: number;
  activeMenu: number;
}

export default function CookDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    avgRating: 0,
    activeMenu: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || (session.user as any)?.role !== 'cook') {
      router.push('/cook/auth/login');
      return;
    }

    // Simulate loading dashboard data
    setTimeout(() => {
      setStats({
        totalOrders: 156,
        totalRevenue: 12450,
        avgRating: 4.8,
        activeMenu: 15
      });
      setIsLoading(false);
    }, 1000);
  }, [session, status, router]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-ink-light">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== 'cook') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2">
            Welcome back, {(session.user as any)?.name}! 👋
          </h1>
          <p className="text-ink-light">
            Manage your cooking business and track your performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink-light">Total Orders</p>
                <p className="text-3xl font-bold text-ink">{stats.totalOrders}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-2xl">📦</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">+12% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink-light">Total Revenue</p>
                <p className="text-3xl font-bold text-ink">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">+8% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink-light">Average Rating</p>
                <p className="text-3xl font-bold text-ink">{stats.avgRating}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-green-600 text-sm font-medium">+0.2 from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-ink-light">Active Menu Items</p>
                <p className="text-3xl font-bold text-ink">{stats.activeMenu}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <span className="text-2xl">🍽️</span>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-blue-600 text-sm font-medium">3 new this week</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-ink mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/cook/menu" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className="bg-primary-100 p-2 rounded-lg group-hover:bg-primary-200 transition-colors">
                  <span className="text-xl">🍽️</span>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-ink">Manage Menu</p>
                  <p className="text-sm text-ink-light">Add, edit, or remove dishes</p>
                </div>
              </Link>

              <Link href="/cook/orders" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <span className="text-xl">📋</span>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-ink">View Orders</p>
                  <p className="text-sm text-ink-light">Check new and pending orders</p>
                </div>
              </Link>

              <Link href="/cook/profile" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
                  <span className="text-xl">👤</span>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-ink">Update Profile</p>
                  <p className="text-sm text-ink-light">Edit your business information</p>
                </div>
              </Link>

              <Link href="/cook/analytics" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <span className="text-xl">📊</span>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-ink">Analytics</p>
                  <p className="text-sm text-ink-light">View detailed performance metrics</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-ink">Recent Orders</h2>
              <Link href="/cook/orders" className="text-primary-500 text-sm font-medium hover:text-primary-600">
                View all
              </Link>
            </div>
            
            <div className="space-y-4">
              {[
                { id: '#12453', customer: 'John Doe', items: 'Butter Chicken, Naan x2', amount: '₹450', status: 'Preparing', time: '2 mins ago' },
                { id: '#12452', customer: 'Sarah Johnson', items: 'Pasta Alfredo', amount: '₹320', status: 'Ready', time: '15 mins ago' },
                { id: '#12451', customer: 'Mike Chen', items: 'Fried Rice, Spring Rolls', amount: '₹380', status: 'Delivered', time: '1 hour ago' }
              ].map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-ink">{order.id}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Ready' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-ink-light">{order.customer}</p>
                    <p className="text-sm text-ink-lighter">{order.items}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold text-ink">{order.amount}</p>
                    <p className="text-xs text-ink-lighter">{order.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="bg-white rounded-xl p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-ink mb-4">Performance Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="font-semibold text-ink mb-1">Top Rated Cook</h3>
              <p className="text-sm text-ink-light">You're in the top 10% of cooks in your area</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-ink mb-1">Fast Delivery</h3>
              <p className="text-sm text-ink-light">Average delivery time: 25 minutes</p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💝</span>
              </div>
              <h3 className="font-semibold text-ink mb-1">Customer Favorite</h3>
              <p className="text-sm text-ink-light">95% positive reviews this month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
