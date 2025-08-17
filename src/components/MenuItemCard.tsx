'use client';

import { useState } from 'react';
import { IMenuItem } from '@/models/MenuItem';

interface MenuItemCardProps {
  menuItem: IMenuItem;
  showActions?: boolean;
  onEdit?: (menuItem: IMenuItem) => void;
  onDelete?: (menuItemId: string) => void;
  onToggleAvailability?: (menuItemId: string, available: boolean) => void;
  onAddToCart?: (menuItem: IMenuItem, quantity: number, specialInstructions?: string) => void;
}

export default function MenuItemCard({ 
  menuItem, 
  showActions = false, 
  onEdit, 
  onDelete, 
  onToggleAvailability,
  onAddToCart
}: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [showAddToCartForm, setShowAddToCartForm] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'appetizer': return '🥗';
      case 'main-course': return '🍽️';
      case 'dessert': return '🍰';
      case 'beverage': return '🥤';
      case 'snack': return '🍿';
      case 'combo': return '🍱';
      default: return '🍴';
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleAddToCart = async () => {
    if (!onAddToCart) return;
    
    setIsAddingToCart(true);
    try {
      await onAddToCart(menuItem, quantity, specialInstructions);
      setShowAddToCartForm(false);
      setQuantity(1);
      setSpecialInstructions('');
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const totalPrice = menuItem.price * quantity;

  return (
    <div className={`bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 ${!menuItem.available ? 'opacity-75' : ''}`}>
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {menuItem.image ? (
          <img
            src={menuItem.image}
            alt={menuItem.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {getCategoryIcon(menuItem.category)}
          </div>
        )}
        
        {/* Status badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {menuItem.featured && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              ⭐ Featured
            </span>
          )}
          {!menuItem.available && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Unavailable
            </span>
          )}
        </div>

        {/* Category */}
        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
          {getCategoryLabel(menuItem.category)}
        </div>

        {/* Price */}
        <div className="absolute bottom-3 right-3 bg-primary-500 text-white px-3 py-1 rounded-full font-bold">
          ₹{menuItem.price}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-ink mb-1 line-clamp-1">
            {menuItem.name}
          </h3>
          <p className="text-sm text-ink-light line-clamp-2">
            {menuItem.description}
          </p>
        </div>

        {/* Details */}
        <div className="space-y-2 text-xs text-ink-light mb-4">
          <div className="flex justify-between">
            <span>🕒 {menuItem.cookingTime}</span>
            <span>👥 {menuItem.servingSize}</span>
          </div>
        </div>

        {/* Dietary Info & Allergens */}
        {(menuItem.dietaryInfo.length > 0 || menuItem.allergens.length > 0) && (
          <div className="mb-4">
            {/* Dietary Info */}
            {menuItem.dietaryInfo.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {menuItem.dietaryInfo.slice(0, 3).map((diet) => (
                  <span
                    key={diet}
                    className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs"
                  >
                    {diet.replace('-', ' ')}
                  </span>
                ))}
                {menuItem.dietaryInfo.length > 3 && (
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    +{menuItem.dietaryInfo.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Allergens */}
            {menuItem.allergens.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <span className="text-xs text-red-600 font-medium">Allergens:</span>
                {menuItem.allergens.slice(0, 3).map((allergen) => (
                  <span
                    key={allergen}
                    className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs"
                  >
                    {allergen}
                  </span>
                ))}
                {menuItem.allergens.length > 3 && (
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                    +{menuItem.allergens.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Ingredients */}
        {menuItem.ingredients.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-ink-light">
              <span className="font-medium">Ingredients:</span> {menuItem.ingredients.slice(0, 5).join(', ')}
              {menuItem.ingredients.length > 5 && '...'}
            </p>
          </div>
        )}

        {/* Actions for cook profile management */}
        {showActions && (
          <div className="flex gap-2 pt-3 border-t border-gray-100">
            <button
              onClick={() => onEdit?.(menuItem)}
              className="flex-1 btn-outline py-2 text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onToggleAvailability?.(menuItem._id?.toString() || '', !menuItem.available)}
              className={`flex-1 py-2 text-sm rounded-md transition-colors ${
                menuItem.available
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {menuItem.available ? 'Disable' : 'Enable'}
            </button>
            <button
              onClick={() => onDelete?.(menuItem._id?.toString() || '')}
              className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition-colors"
            >
              🗑️
            </button>
          </div>
        )}

        {/* Customer view action */}
        {!showActions && menuItem.available && (
          <div>
            {!showAddToCartForm ? (
              <button 
                onClick={() => setShowAddToCartForm(true)}
                className="w-full btn-primary py-2 text-sm"
              >
                Add to Cart - ₹{menuItem.price}
              </button>
            ) : (
              <div className="space-y-3 p-3 bg-gray-50 rounded-md">
                {/* Quantity Selector */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-xs font-medium text-ink-light mb-1">
                    Special Instructions (optional)
                  </label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md resize-none"
                    rows={2}
                    maxLength={200}
                    placeholder="Any special requests..."
                  />
                </div>

                {/* Total Price */}
                <div className="flex justify-between items-center font-medium">
                  <span className="text-sm">Total:</span>
                  <span className="text-primary-600">₹{totalPrice}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddToCartForm(false)}
                    className="flex-1 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="flex-1 btn-primary py-2 text-xs disabled:opacity-50"
                  >
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
