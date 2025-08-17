'use client';

import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';

export default function CartSidebar() {
  const { 
    cartItems, 
    cartTotal, 
    isCartOpen, 
    toggleCart, 
    updateQuantity, 
    removeFromCart 
  } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    toggleCart();
    router.push('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={toggleCart}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Your Cart</h2>
          <button
            onClick={toggleCart}
            className="text-ink-light hover:text-ink text-xl"
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-lg font-medium text-ink mb-2">Your cart is empty</h3>
              <p className="text-ink-light">Add some delicious items to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.menuItem._id?.toString()} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    {/* Image */}
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.menuItem?.image ? (
                        <img
                          src={item.menuItem.image}
                          alt={item.menuItem.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">
                          🍽️
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-ink truncate">{item.menuItem.name}</h4>
                      <p className="text-sm text-ink-light">₹{item.menuItem.price} each</p>
                      
                      {item.specialInstructions && (
                        <p className="text-xs text-ink-light mt-1 italic">
                          Note: {item.specialInstructions}
                        </p>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.menuItem._id?.toString() || '', item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.menuItem._id?.toString() || '', item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xs"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-medium text-primary-600">
                            ₹{item.menuItem.price * item.quantity}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.menuItem._id?.toString() || '')}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <div className="space-y-3">
              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-ink">Total:</span>
                <span className="text-xl font-bold text-primary-600">₹{cartTotal}</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full btn-primary py-3 text-base font-medium"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <button
                onClick={toggleCart}
                className="w-full text-center text-ink-light hover:text-ink text-sm"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
