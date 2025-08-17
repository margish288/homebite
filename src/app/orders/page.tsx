'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Order {
  _id: string;
  orderNumber: string;
  cookProfileId: {
    businessName: string;
    userId: {
      name: string;
      profileImage?: string;
    };
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  estimatedDeliveryTime: string;
  createdAt: string;
}

export default function OrderHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/login');
      return;
    }

    fetchOrders();
  }, [session, status, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/orders?userId=${(session?.user as { id: string })?.id}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
      } else {
        setError(data.error || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed': return 'text-blue-600 bg-blue-100';
      case 'confirmed': return 'text-purple-600 bg-purple-100';
      case 'preparing': return 'text-orange-600 bg-orange-100';
      case 'ready': return 'text-yellow-600 bg-yellow-100';
      case 'out-for-delivery': return 'text-indigo-600 bg-indigo-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'refunded': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-ink-light">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
          <button 
            onClick={fetchOrders}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2">Your Orders</h1>
          <p className="text-ink-light">Track and manage your food orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-soft text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-semibold text-ink mb-2">No orders yet</h2>
            <p className="text-ink-light mb-6">Start ordering from your favorite home cooks!</p>
            <Link href="/" className="btn-primary inline-block">
              Explore Cooks
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl p-6 shadow-soft">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-ink">
                        Order #{order.orderNumber}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus.replace('-', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-ink-light mb-1">
                      <span>From: {order.cookProfileId.businessName}</span>
                      <span>•</span>
                      <span>by {order.cookProfileId.userId.name}</span>
                    </div>
                    
                    <p className="text-sm text-ink-light">
                      Ordered on {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600">₹{order.totalAmount}</p>
                    <p className="text-sm text-ink-light">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-gray-100 pt-4 mb-4">
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-ink">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-ink-light">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Link
                    href={`/orders/${order.orderNumber}`}
                    className="btn-outline py-2 px-4 text-sm"
                  >
                    View Details
                  </Link>
                  
                  {order.orderStatus === 'delivered' && (
                    <button className="btn-primary py-2 px-4 text-sm">
                      Write Review
                    </button>
                  )}
                  
                  {['placed', 'confirmed'].includes(order.orderStatus) && (
                    <button className="text-red-600 hover:text-red-800 py-2 px-4 text-sm">
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}