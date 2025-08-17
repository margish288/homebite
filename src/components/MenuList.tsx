'use client';

import { useState, useEffect } from 'react';
import { IMenuItem } from '@/models/MenuItem';
import MenuItemCard from './MenuItemCard';
import { useCart } from '@/contexts/CartContext';

interface MenuListProps {
  cookProfileId: string;
  showActions?: boolean;
  onEdit?: (menuItem: IMenuItem) => void;
  onDelete?: (menuItemId: string) => void;
  onToggleAvailability?: (menuItemId: string, available: boolean) => void;
  refreshTrigger?: number;
}

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'appetizer', label: 'Appetizers' },
  { value: 'main-course', label: 'Main Courses' },
  { value: 'dessert', label: 'Desserts' },
  { value: 'beverage', label: 'Beverages' },
  { value: 'snack', label: 'Snacks' },
  { value: 'combo', label: 'Combos' },
];

export default function MenuList({ 
  cookProfileId, 
  showActions = false, 
  onEdit, 
  onDelete, 
  onToggleAvailability,
  refreshTrigger 
}: MenuListProps) {
  const { addToCart } = useCart();
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAvailable, setShowAvailable] = useState<string>('all');

  useEffect(() => {
    fetchMenuItems();
  }, [cookProfileId, selectedCategory, showAvailable, refreshTrigger]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        cookProfileId,
      });

      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      if (showAvailable !== 'all') {
        params.append('available', showAvailable);
      }

      const response = await fetch(`/api/menu?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setMenuItems(data.data);
      } else {
        setError(data.error || 'Failed to fetch menu items');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (menuItemId: string) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/menu/${menuItemId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMenuItems(prev => prev.filter(item => item._id?.toString() !== menuItemId));
        onDelete?.(menuItemId);
      } else {
        alert(data.error || 'Failed to delete menu item');
      }
    } catch (err) {
      alert('Network error occurred');
      console.error('Error deleting menu item:', err);
    }
  };

  const handleToggleAvailability = async (menuItemId: string, available: boolean) => {
    try {
      const response = await fetch(`/api/menu/${menuItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ available }),
      });

      const data = await response.json();

      if (data.success) {
        setMenuItems(prev => 
          prev.map(item => 
            item._id?.toString() === menuItemId 
              ? { ...item, available } as IMenuItem
              : item
          )
        );
        onToggleAvailability?.(menuItemId, available);
      } else {
        alert(data.error || 'Failed to update menu item');
      }
    } catch (err) {
      alert('Network error occurred');
      console.error('Error updating menu item:', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-ink-light">Loading menu items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
        <button 
          onClick={fetchMenuItems}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Availability Filter */}
        {showActions && (
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Availability
            </label>
            <select
              value={showAvailable}
              onChange={(e) => setShowAvailable(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Items</option>
              <option value="true">Available Only</option>
              <option value="false">Unavailable Only</option>
            </select>
          </div>
        )}
      </div>

      {/* Menu Items Grid */}
      {menuItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold text-ink mb-2">No menu items found</h3>
          <p className="text-ink-light">
            {showActions 
              ? "Start building your menu by adding your first dish!"
              : "This cook hasn't added any menu items yet."
            }
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((menuItem) => (
            <MenuItemCard
              key={menuItem._id?.toString() || Math.random().toString()}
              menuItem={menuItem}
              showActions={showActions}
              onEdit={onEdit}
              onDelete={handleDelete}
              onToggleAvailability={handleToggleAvailability}
              onAddToCart={!showActions ? addToCart : undefined}
            />
          ))}
        </div>
      )}

      {/* Stats */}
      {menuItems.length > 0 && (
        <div className="mt-8 text-center text-sm text-ink-light">
          Showing {menuItems.length} menu item{menuItems.length !== 1 ? 's' : ''}
          {selectedCategory && ` in ${categories.find(c => c.value === selectedCategory)?.label}`}
        </div>
      )}
    </div>
  );
}
