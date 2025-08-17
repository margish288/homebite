'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { IMenuItem } from '@/models/MenuItem';

// Type for session user with id
interface SessionUser {
  id: string;
  name?: string;
  email?: string;
  role?: string;
}

interface CartItem {
  menuItem: IMenuItem;
  quantity: number;
  specialInstructions?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  currentCookProfileId: string | null;
  addToCart: (menuItem: IMenuItem, quantity: number, specialInstructions?: string) => Promise<void>;
  removeFromCart: (menuItemId: string) => Promise<void>;
  updateQuantity: (menuItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  loadCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentCookProfileId, setCurrentCookProfileId] = useState<string | null>(null);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);

  const loadCart = async () => {
    if (!(session?.user as SessionUser)?.id) return;

    try {
      const response = await fetch(`/api/cart?userId=${(session?.user as SessionUser)?.id}`);
      const data = await response.json();

      if (data.success && data.data) {
        // Convert cart data to local cart items format
        const items = data.data.items.map((item: { menuItem: IMenuItem; quantity: number; specialInstructions?: string }) => ({
          menuItem: item.menuItem,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions,
        }));
        setCartItems(items);
        setCurrentCookProfileId(data.data.cookProfileId);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const addToCart = async (menuItem: IMenuItem, quantity: number, specialInstructions?: string) => {
    if (!(session?.user as SessionUser)?.id) {
      alert('Please log in to add items to cart');
      return;
    }

    // Check if adding from different cook
    if (currentCookProfileId && currentCookProfileId !== menuItem.cookProfileId?.toString()) {
      const confirmed = window.confirm(
        'Adding items from a different cook will clear your current cart. Continue?'
      );
      if (!confirmed) return;
      await clearCart();
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: (session?.user as any).id,
          cookProfileId: menuItem.cookProfileId,
          menuItemId: menuItem._id,
          quantity,
          price: menuItem.price,
          specialInstructions,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await loadCart();
        alert('Item added to cart!');
      } else {
        alert(data.error || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  const removeFromCart = async (menuItemId: string) => {
    if (!(session?.user as SessionUser)?.id) return;

    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: (session?.user as any).id,
          menuItemId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await loadCart();
      } else {
        alert(data.error || 'Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (menuItemId: string, quantity: number) => {
    if (!(session?.user as SessionUser)?.id) return;

    if (quantity === 0) {
      await removeFromCart(menuItemId);
      return;
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: (session?.user as any).id,
          menuItemId,
          quantity,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await loadCart();
      } else {
        alert(data.error || 'Failed to update quantity');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    if (!(session?.user as SessionUser)?.id) return;

    try {
      const response = await fetch(`/api/cart?userId=${(session?.user as any).id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setCartItems([]);
        setCurrentCookProfileId(null);
      } else {
        alert(data.error || 'Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Failed to clear cart');
    }
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Load cart when session changes
  useEffect(() => {
    if ((session?.user as SessionUser)?.id) {
      loadCart();
    } else {
      setCartItems([]);
      setCurrentCookProfileId(null);
    }
  }, [(session?.user as SessionUser)?.id]);

  const value: CartContextType = {
    cartItems,
    cartCount,
    cartTotal,
    isCartOpen,
    currentCookProfileId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    loadCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}