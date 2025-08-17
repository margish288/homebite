'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface OrderDetail {
  _id: string;
  orderNumber: string;
  cookProfileId: {
    _id: string;
    businessName: string;
    location: string;
    deliveryTime: string;
    userId: {
      name: string;
      profileImage?: string;
      phone?: string;
    };
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    specialInstructions?: string;
  }>;
  totalAmount: number;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    landmark?: string;
    contactNumber: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  cookNotes?: string;
  customerNotes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const orderNumber = params.orderNumber as string;
  
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/login');
      return;
    }

    fetchOrderDetails();
  }, [session, status, orderNumber, router]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/orders/${orderNumber}?userId=${(session?.user as { id: string })?.id}`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.error || 'Failed to fetch order details');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'confirmed': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'preparing': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'ready': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'out-for-delivery': return 'text-indigo-600 bg-indigo-100 border-indigo-200';
      case 'delivered': return 'text-green-600 bg-green-100 border-green-200';
      case 'cancelled': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { key: 'placed', label: 'Order Placed', icon: '📝' },
      { key: 'confirmed', label: 'Confirmed', icon: '✅' },
      { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
      { key: 'ready', label: 'Ready', icon: '🍽️' },
      { key: 'out-for-delivery', label: 'Out for Delivery', icon: '🚗' },
      { key: 'delivered', label: 'Delivered', icon: '✨' },
    ];

    const currentIndex = steps.findIndex(step => step.key === order?.orderStatus);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
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
          <p className="text-ink-light">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">⚠️ {error || 'Order not found'}</div>
          <button 
            onClick={() => router.push('/orders')}
            className="btn-primary"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-primary-600 hover:text-primary-700 mb-4 flex items-center gap-2"
          >
            ← Back
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-ink mb-2">
                Order #{order.orderNumber}
              </h1>
              <p className="text-ink-light">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${getStatusColor(order.orderStatus)}`}>
              <span className="font-medium">
                {order.orderStatus.replace('-', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Tracking */}
            {order.orderStatus !== 'cancelled' && (
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <h2 className="text-xl font-semibold text-ink mb-6">Order Status</h2>
                
                <div className="space-y-4">
                  {statusSteps.map((step, index) => (
                    <div key={step.key} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                        step.completed 
                          ? 'bg-primary-500 text-white' 
                          : step.current
                          ? 'bg-primary-100 text-primary-600 border-2 border-primary-500'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {step.icon}
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <p className={`font-medium ${
                          step.completed || step.current ? 'text-ink' : 'text-ink-light'
                        }`}>
                          {step.label}
                        </p>
                      </div>
                      
                      {step.completed && !step.current && (
                        <div className="text-green-500 text-xl">✓</div>
                      )}
                    </div>
                  ))}
                </div>

                {order.estimatedDeliveryTime && (
                  <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                    <p className="text-sm text-ink-light">
                      <strong>Estimated Delivery:</strong> {formatDate(order.estimatedDeliveryTime)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-ink mb-4">Order Items</h2>
              
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-ink">{item.name}</h4>
                      <p className="text-sm text-ink-light">Quantity: {item.quantity}</p>
                      {item.specialInstructions && (
                        <p className="text-sm text-ink-light italic mt-1">
                          Note: {item.specialInstructions}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-ink">₹{item.price * item.quantity}</p>
                      <p className="text-sm text-ink-light">₹{item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-6 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-ink">Total Amount:</span>
                  <span className="text-xl font-bold text-primary-600">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-ink mb-4">Delivery Address</h2>
              
              <div className="text-ink-light">
                <p>{order.deliveryAddress.street}</p>
                <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.postalCode}</p>
                {order.deliveryAddress.landmark && (
                  <p className="text-sm">Landmark: {order.deliveryAddress.landmark}</p>
                )}
                <p className="text-sm mt-2">Contact: {order.deliveryAddress.contactNumber}</p>
              </div>
            </div>

            {/* Notes */}
            {(order.customerNotes || order.cookNotes) && (
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <h2 className="text-xl font-semibold text-ink mb-4">Notes</h2>
                
                {order.customerNotes && (
                  <div className="mb-4">
                    <p className="font-medium text-ink mb-1">Your Notes:</p>
                    <p className="text-ink-light">{order.customerNotes}</p>
                  </div>
                )}
                
                {order.cookNotes && (
                  <div>
                    <p className="font-medium text-ink mb-1">Cook's Notes:</p>
                    <p className="text-ink-light">{order.cookNotes}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Cook Information */}
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-ink mb-4">Cook Details</h3>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-400 rounded-full flex items-center justify-center text-white font-semibold">
                  {order.cookProfileId.userId.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-ink">{order.cookProfileId.businessName}</p>
                  <p className="text-sm text-ink-light">by {order.cookProfileId.userId.name}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <p className="text-ink-light">📍 {order.cookProfileId.location}</p>
                <p className="text-ink-light">🕒 {order.cookProfileId.deliveryTime}</p>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-ink mb-4">Payment Details</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-ink-light">Method:</span>
                  <span className="text-ink capitalize">{order.paymentMethod}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-ink-light">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.paymentStatus === 'paid' 
                      ? 'text-green-600 bg-green-100'
                      : order.paymentStatus === 'pending'
                      ? 'text-yellow-600 bg-yellow-100'
                      : 'text-red-600 bg-red-100'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
                
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span className="text-primary-600">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-ink mb-4">Actions</h3>
              
              <div className="space-y-3">
                {order.orderStatus === 'delivered' && (
                  <button className="w-full btn-primary py-2">
                    Write Review
                  </button>
                )}
                
                {['placed', 'confirmed'].includes(order.orderStatus) && (
                  <button className="w-full btn-outline py-2 text-red-600 border-red-300 hover:bg-red-50">
                    Cancel Order
                  </button>
                )}
                
                <button className="w-full btn-outline py-2">
                  Get Help
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
