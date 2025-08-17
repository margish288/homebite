'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CookOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  items: string;
  amount: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'delivered';
  orderDate: string;
  deliveryAddress: string;
  specialInstructions?: string;
}

export default function CookOrders() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<CookOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'cook') {
      router.push('/cook/auth/login');
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
            id: '#12456',
            customerName: 'John Doe',
            customerPhone: '+91 9876543210',
            items: 'Butter Chicken, Naan x2, Basmati Rice',
            amount: 450,
            status: 'pending',
            orderDate: '2024-01-17T14:30:00Z',
            deliveryAddress: '123 Main Street, Connaught Place, New Delhi',
            specialInstructions: 'Less spicy please'
          },
          {
            id: '#12455',
            customerName: 'Sarah Johnson',
            customerPhone: '+91 9123456789',
            items: 'Dal Makhani, Roti x4, Jeera Rice',
            amount: 280,
            status: 'preparing',
            orderDate: '2024-01-17T13:15:00Z',
            deliveryAddress: '456 Business District, Gurgaon, Haryana'
          },
          {
            id: '#12454',
            customerName: 'Mike Chen',
            customerPhone: '+91 8765432109',
            items: 'Paneer Tikka, Naan x3, Mixed Raita',
            amount: 380,
            status: 'ready',
            orderDate: '2024-01-17T12:00:00Z',
            deliveryAddress: '789 Garden Colony, Vasant Kunj, New Delhi'
          },
          {
            id: '#12453',
            customerName: 'Emily Davis',
            customerPhone: '+91 7654321098',
            items: 'Chicken Biryani, Raita, Papad',
            amount: 320,
            status: 'delivered',
            orderDate: '2024-01-16T18:00:00Z',
            deliveryAddress: '321 Park Avenue, Sector 12, Noida'
          }
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading orders:', error);
      setIsLoading(false);
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: CookOrder['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'active') return ['pending', 'accepted', 'preparing', 'ready'].includes(order.status);
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

  if (!session || session.user.role !== 'cook') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2">Order Management</h1>
          <p className="text-ink-light">Manage incoming orders and track fulfillment</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-soft text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'pending').length}
            </div>
            <div className="text-sm text-ink-light">New Orders</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-soft text-center">
            <div className="text-2xl font-bold text-orange-600">
              {orders.filter(o => o.status === 'preparing').length}
            </div>
            <div className="text-sm text-ink-light">Preparing</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-soft text-center">
            <div className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'ready').length}
            </div>
            <div className="text-sm text-ink-light">Ready</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-soft text-center">
            <div className="text-2xl font-bold text-ink">
              ₹{orders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-ink-light">Total Revenue</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-soft mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'active', label: 'Active Orders', count: orders.filter(o => ['pending', 'accepted', 'preparing', 'ready'].includes(o.status)).length },
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
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-ink mb-2">No orders yet</h3>
                <p className="text-ink-light">New orders will appear here when customers place them</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-semibold text-ink text-lg">{order.id}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-ink font-medium">{order.customerName}</p>
                        <p className="text-ink-light text-sm">{order.customerPhone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-ink">₹{order.amount}</p>
                        <p className="text-sm text-ink-light">{formatDate(order.orderDate)}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-ink mb-2">Order Items:</h4>
                      <p className="text-ink-light">{order.items}</p>
                      {order.specialInstructions && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                          <p className="text-sm text-yellow-800">
                            <strong>Special Instructions:</strong> {order.specialInstructions}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-ink mb-1">Delivery Address:</h4>
                      <p className="text-ink-light text-sm">{order.deliveryAddress}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <a 
                          href={`tel:${order.customerPhone}`}
                          className="btn-outline px-4 py-2 text-sm"
                        >
                          📞 Call Customer
                        </a>
                        <a 
                          href={`https://maps.google.com/?q=${encodeURIComponent(order.deliveryAddress)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-outline px-4 py-2 text-sm"
                        >
                          📍 View Address
                        </a>
                      </div>

                      <div className="flex items-center space-x-2">
                        {order.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => updateOrderStatus(order.id, 'accepted')}
                              className="btn-primary px-4 py-2 text-sm"
                            >
                              Accept Order
                            </button>
                            <button className="text-red-500 text-sm hover:text-red-600 px-3 py-2">
                              Decline
                            </button>
                          </>
                        )}
                        
                        {order.status === 'accepted' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="btn-primary px-4 py-2 text-sm"
                          >
                            Start Preparing
                          </button>
                        )}
                        
                        {order.status === 'preparing' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="btn-primary px-4 py-2 text-sm"
                          >
                            Mark Ready
                          </button>
                        )}
                        
                        {order.status === 'ready' && (
                          <button 
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Mark Delivered
                          </button>
                        )}
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
