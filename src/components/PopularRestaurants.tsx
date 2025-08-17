'use client';

import { useEffect, useState } from 'react';
import RestaurantCard from '@/components/RestaurantCard';
import { ICook } from '@/models/Restaurant';

interface PopularRestaurantsProps {
  searchQuery?: string;
  selectedCategory?: string;
}

export default function PopularRestaurants({ searchQuery, selectedCategory }: PopularRestaurantsProps) {
  const [restaurants, setRestaurants] = useState<ICook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRestaurants();
  }, [searchQuery, selectedCategory]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }
      
      if (searchQuery) {
        params.append('search', searchQuery);
      } else {
        params.append('featured', 'true');
      }

      const response = await fetch(`/api/restaurants?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setRestaurants(data.data);
      } else {
        setError(data.error || 'Failed to fetch restaurants');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }
    if (selectedCategory) {
      const categoryNames = {
        delivery: 'Delivery Restaurants',
        dining: 'Dining Restaurants',
        nightlife: 'Nightlife Venues',
        cafe: 'Cafes & Coffee Shops'
      };
      return categoryNames[selectedCategory as keyof typeof categoryNames] || 'Restaurants';
    }
    return 'Popular Cooks';
  };

  const getSubtitle = () => {
    if (searchQuery) {
      return `Found ${restaurants.length} restaurants`;
    }
    if (selectedCategory) {
      return `Best ${selectedCategory} options in your area`;
    }
    return 'Trending Cooks that people love';
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
              Loading Restaurants...
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-xl h-80 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
          <button 
            onClick={fetchRestaurants}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
            {getTitle()}
          </h2>
          <p className="text-lg text-ink-light">
            {getSubtitle()}
          </p>
        </div>

        {restaurants.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-ink mb-2">No restaurants found</h3>
            <p className="text-ink-light">Try adjusting your search or category filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {restaurants.length >= 6 && (
          <div className="text-center mt-12">
            <button className="btn-outline px-8 py-3">
              Load More Restaurants
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
