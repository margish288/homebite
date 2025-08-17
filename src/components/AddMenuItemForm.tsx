'use client';

import { useState } from 'react';
import { IMenuItem } from '@/models/MenuItem';

interface AddMenuItemFormProps {
  cookProfileId: string;
  onMenuItemAdded: (menuItem: IMenuItem) => void;
  onCancel: () => void;
}

const categories = [
  { value: 'appetizer', label: 'Appetizer' },
  { value: 'main-course', label: 'Main Course' },
  { value: 'dessert', label: 'Dessert' },
  { value: 'beverage', label: 'Beverage' },
  { value: 'snack', label: 'Snack' },
  { value: 'combo', label: 'Combo' },
];

const allergens = [
  'nuts', 'dairy', 'gluten', 'eggs', 'soy', 'shellfish', 'fish', 'sesame'
];

const dietaryInfo = [
  'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'low-carb', 'high-protein'
];

export default function AddMenuItemForm({ cookProfileId, onMenuItemAdded, onCancel }: AddMenuItemFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'main-course',
    image: '',
    ingredients: '',
    allergens: [] as string[],
    dietaryInfo: [] as string[],
    cookingTime: '',
    servingSize: '',
    available: true,
    featured: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (field: 'allergens' | 'dietaryInfo', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const menuItemData = {
        ...formData,
        cookProfileId,
        price: parseFloat(formData.price),
        ingredients: formData.ingredients.split(',').map(item => item.trim()).filter(item => item),
      };

      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuItemData),
      });

      const data = await response.json();

      if (data.success) {
        onMenuItemAdded(data.data);
        // Reset form
        setFormData({
          name: '',
          description: '',
          price: '',
          category: 'main-course',
          image: '',
          ingredients: '',
          allergens: [],
          dietaryInfo: [],
          cookingTime: '',
          servingSize: '',
          available: true,
          featured: false,
        });
      } else {
        setError(data.error || 'Failed to add menu item');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error adding menu item:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-ink">Add Menu Item</h3>
        <button
          onClick={onCancel}
          className="text-ink-light hover:text-ink transition-colors"
        >
          ✕
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Item Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., Butter Chicken"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Price (₹) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="250.00"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Describe your dish..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Cooking Time */}
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Cooking Time *
            </label>
            <input
              type="text"
              name="cookingTime"
              value={formData.cookingTime}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., 25-30 mins"
            />
          </div>

          {/* Serving Size */}
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Serving Size *
            </label>
            <input
              type="text"
              name="servingSize"
              value={formData.servingSize}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., 1 person, 2-3 people"
            />
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Ingredients (comma-separated)
          </label>
          <input
            type="text"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., chicken, tomatoes, onions, spices"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Image URL (optional)
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Allergens */}
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Allergens
          </label>
          <div className="flex flex-wrap gap-2">
            {allergens.map(allergen => (
              <label key={allergen} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.allergens.includes(allergen)}
                  onChange={() => handleArrayChange('allergens', allergen)}
                  className="mr-1"
                />
                <span className="text-sm capitalize">{allergen}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Dietary Info */}
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Dietary Information
          </label>
          <div className="flex flex-wrap gap-2">
            {dietaryInfo.map(diet => (
              <label key={diet} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.dietaryInfo.includes(diet)}
                  onChange={() => handleArrayChange('dietaryInfo', diet)}
                  className="mr-1"
                />
                <span className="text-sm capitalize">{diet.replace('-', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex gap-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm">Available</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm">Featured</span>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary py-2 px-6 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Menu Item'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline py-2 px-6"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
