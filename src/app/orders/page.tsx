'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Order {
  id: string;
  cookName: string;
  cookId: string;
  items: string;
  amount: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  rating?: number;
}

export default function UserOrders() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'user') {
      router.push('/auth/login');
      return;
    }

    loadOrders();
  }, [session, status, router]);

  const loadOrders = async () => {
    try {
      // Simulate loading orders
      setTimeout(() => {
        setOrders([
          {
            id: '#12453',
            cookName: "Priya's Kitchen",
            cookId: 'cook1',
            items: 'Butter Chicken, Naan x2, Basmati Rice',
            amount: 450,
            status: 'delivered',
            orderDate: '2024-01-15T10:30:00Z',
            deliveryDate: '2024-01-15T11:45:00Z',
            rating: 5
          },
          {
            id: '#12452',
            cookName: "Marco's Pasta Corner",
            cookId: 'cook2',
            items: 'Pasta Alfredo, Garlic Bread',
            amount: 320,
            status: 'delivered',
            orderDate: '2024-01-10T14:20:00Z',
            deliveryDate: '2024-01-10T15:30:00Z',
            rating: 4
          },
          {
            id: '#12451',
            cookName: "Liu's Authentic Chinese",
            cookId: 'cook3',
            items: 'Fried Rice, Spring Rolls x4, Sweet & Sour Chicken',
            amount: 380,
            status: 'preparing',
            orderDate: '2024-01-17T12:00:00Z'
          },
          {
            id: '#12450',
            cookName: "Priya's Kitchen",
            cookId: 'cook1',
            items: 'Dal Makhani, Roti x4, Jeera Rice',
            amount: 280,
            status: 'pending',
            orderDate: '2024-01-17T13:15:00Z'
          }
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading orders:', error);
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['pending', 'preparing', 'ready'].includes(order.status);
    if (activeTab === 'completed') return order.status === 'delivered';
    return true;
  });

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-ink-light">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'user') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2">My Orders</h1>
          <p className="text-ink-light">Track and manage your food orders</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-soft text-center">
            <div className="text-2xl font-bold text-ink">{orders.length}</div>
            <div className="text-sm text-ink-light">Total Orders</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-soft text-center">
            <div className="text-2xl font-bold text-ink">
              {orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status)).length}
            </div>
            <div className="text-sm text-ink-light">Active Orders</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-soft text-center">
            <div className="text-2xl font-bold text-ink">
              ₹{orders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-ink-light">Total Spent</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-soft text-center">
            <div className="text-2xl font-bold text-ink">
              {orders.filter(o => o.rating).length > 0 
                ? (orders.filter(o => o.rating).reduce((sum, o) => sum + (o.rating || 0), 0) / orders.filter(o => o.rating).length).toFixed(1)
                : '0'
              }
            </div>
            <div className="text-sm text-ink-light">Avg Rating Given</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-soft mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'all', label: 'All Orders', count: orders.length },
                { id: 'active', label: 'Active', count: orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status)).length },
                { id: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'delivered').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-ink-light hover:text-ink hover:border-gray-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-xl font-semibold text-ink mb-2">No orders found</h3>
                <p className="text-ink-light mb-6">Start ordering delicious homemade food from local cooks</p>
                <Link href="/" className="btn-primary px-6 py-3">
                  Explore Cooks
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-soft transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-semibold text-ink">{order.id}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <Link 
                          href={`/cook/${order.cookId}`}
                          className="text-lg font-medium text-ink hover:text-primary-500 transition-colors"
                        >
                          {order.cookName}
                        </Link>
                        <p className="text-ink-light mt-1">{order.items}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-ink">₹{order.amount}</p>
                        <p className="text-sm text-ink-light">{formatDate(order.orderDate)}</p>
                      </div>
                    </div>

                    {order.deliveryDate && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-green-800">
                          ✅ Delivered on {formatDate(order.deliveryDate)}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {order.status === 'delivered' && order.rating && (
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-ink-light">Your rating:</span>
                            {[...Array(order.rating)].map((_, i) => (
                              <span key={i} className="text-yellow-400">★</span>
                            ))}
                          </div>
                        )}
                        {order.status === 'delivered' && !order.rating && (
                          <button className="text-primary-500 text-sm hover:text-primary-600">
                            Rate this order
                          </button>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {order.status === 'delivered' && (
                          <button className="btn-outline px-4 py-2 text-sm">
                            Reorder
                          </button>
                        )}
                        {['pending', 'preparing'].includes(order.status) && (
                          <button className="text-red-500 text-sm hover:text-red-600">
                            Cancel Order
                          </button>
                        )}
                        <button className="text-primary-500 text-sm hover:text-primary-600">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
