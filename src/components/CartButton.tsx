'use client';

import { useCart } from '@/contexts/CartContext';

export default function CartButton() {
  const { cartCount, toggleCart } = useCart();

  return (
    <button
      onClick={toggleCart}
      className="relative p-2 text-ink hover:text-primary-600 transition-colors"
    >
      <div className="relative">
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h10M17 18a2 2 0 11-4 0 2 2 0 014 0zM9 18a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </div>
    </button>
  );
}
