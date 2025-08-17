'use client';

import { useEffect, useState } from 'react';
import CookCard from '@/components/RestaurantCard';
import { ICookProfile } from '@/models/CookProfile';

type PopulatedCookProfile = ICookProfile & {
  userId: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
};

interface PopularCooksProps {
  searchQuery?: string;
  selectedCategory?: string;
}

export default function PopularCooks({ searchQuery, selectedCategory }: PopularCooksProps) {
  const [cooks, setCooks] = useState<PopulatedCookProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCooks();
  }, [searchQuery, selectedCategory]);

  const fetchCooks = async () => {
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

      const response = await fetch(`/api/cooks?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setCooks(data.data);
      } else {
        setError(data.error || 'Failed to fetch cooks');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching cooks:', err);
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
        'home-meals': 'Home Meal Cooks',
        'specialty-dishes': 'Specialty Dish Cooks', 
        'baked-goods': 'Bakery & Dessert Cooks',
        'healthy-options': 'Healthy Food Cooks'
      };
      return categoryNames[selectedCategory as keyof typeof categoryNames] || 'Home Cooks';
    }
    return 'Popular Cooks';
  };

  const getSubtitle = () => {
    if (searchQuery) {
      return `Found ${cooks.length} talented home cooks`;
    }
    if (selectedCategory) {
      return `Amazing ${selectedCategory.replace('-', ' ')} specialists in your area`;
    }
    return 'Trending home cooks that people love';
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
              Loading Cooks...
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
            onClick={fetchCooks}
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

        {cooks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-ink mb-2">No cooks found</h3>
            <p className="text-ink-light">Try adjusting your search or category filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cooks.map((cookProfile) => (
              <CookCard key={cookProfile._id?.toString()} cookProfile={cookProfile} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {cooks.length >= 6 && (
          <div className="text-center mt-12">
            <button className="btn-outline px-8 py-3">
              Load More Cooks
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
