'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    landmark: '',
    contactNumber: '',
    paymentMethod: 'cash',
    customerNotes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!(session?.user as { id: string })?.id) {
      alert('Please log in to place order');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const orderData = {
        userId: (session?.user as { id: string })?.id,
        cookProfileId: cartItems[0].menuItem.cookProfileId,
        items: cartItems.map(item => ({
          menuItemId: item.menuItem._id,
          name: item.menuItem.name,
          quantity: item.quantity,
          price: item.menuItem.price,
          specialInstructions: item.specialInstructions,
        })),
        totalAmount: cartTotal,
        deliveryAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          landmark: formData.landmark,
          contactNumber: formData.contactNumber,
        },
        paymentMethod: formData.paymentMethod,
        customerNotes: formData.customerNotes,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        await clearCart();
        alert('Order placed successfully!');
        router.push(`/orders/${data.data.orderNumber}`);
      } else {
        alert(data.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-ink mb-4">Please Log In</h1>
          <p className="text-ink-light">You need to be logged in to place an order.</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-ink mb-4">Your cart is empty</h1>
          <p className="text-ink-light mb-6">Add some delicious items to proceed with checkout.</p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary px-6 py-3"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink mb-2">Checkout</h1>
          <p className="text-ink-light">Complete your order details</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Delivery Address */}
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <h2 className="text-xl font-semibold text-ink mb-4">Delivery Address</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-ink mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter your street address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="State"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="PIN Code"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink mb-1">
                      Landmark (optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Nearby landmark"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-ink mb-1">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <h2 className="text-xl font-semibold text-ink mb-4">Payment Method</h2>
                
                <div className="space-y-3">
                  {[
                    { value: 'cash', label: 'Cash on Delivery', icon: '💵' },
                    { value: 'upi', label: 'UPI Payment', icon: '📱' },
                    { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
                    { value: 'wallet', label: 'Digital Wallet', icon: '💰' },
                  ].map((method) => (
                    <label key={method.value} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={formData.paymentMethod === method.value}
                        onChange={handleInputChange}
                        className="mr-3"
                      />
                      <span className="mr-2">{method.icon}</span>
                      <span className="font-medium">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <h2 className="text-xl font-semibold text-ink mb-4">Additional Notes</h2>
                
                <textarea
                  name="customerNotes"
                  value={formData.customerNotes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Any special instructions for the cook..."
                />
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={isPlacingOrder}
                className="w-full btn-primary py-4 text-lg font-medium disabled:opacity-50"
              >
                {isPlacingOrder ? 'Placing Order...' : `Place Order - ₹${cartTotal}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-soft sticky top-4">
              <h2 className="text-xl font-semibold text-ink mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.menuItem._id?.toString()} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.menuItem.image ? (
                        <img
                          src={item.menuItem.image}
                          alt={item.menuItem.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">
                          🍽️
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.menuItem.name}</h4>
                      <p className="text-xs text-ink-light">Qty: {item.quantity}</p>
                      {item.specialInstructions && (
                        <p className="text-xs text-ink-light italic">
                          {item.specialInstructions}
                        </p>
                      )}
                    </div>
                    
                    <span className="font-medium text-sm">
                      ₹{item.menuItem.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-ink">Total:</span>
                  <span className="text-xl font-bold text-primary-600">₹{cartTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
