'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ReviewForm from '@/components/ReviewForm';
import ReviewsList from '@/components/ReviewsList';
import { ICook } from '@/models/Cook';
import { IReview } from '@/models/Review';

interface CookWithReviews extends ICook {
  averageRating: number;
  reviewCount: number;
  reviews: IReview[];
}

export default function CookDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [cook, setCook] = useState<CookWithReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCook();
    }
  }, [id]);

  const fetchCook = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/cooks/${id}`);
      const data = await response.json();

      if (data.success) {
        setCook(data.data);
      } else {
        setError(data.error || 'Failed to fetch cook');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching cook:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAdded = () => {
    setShowReviewForm(false);
    fetchCook(); // Refresh data to show new review
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-ink-light">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (error || !cook) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-ink mb-2">Cook Not Found</h2>
          <p className="text-ink-light mb-4">{error || 'The cook you are looking for does not exist.'}</p>
          <a href="/" className="btn-primary">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={cook.image}
          alt={cook.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Cook Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container max-w-6xl mx-auto">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{cook.name}</h1>
                <p className="text-lg text-gray-200 mb-2">📍 {cook.location}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    {renderStars(cook.averageRating)}
                    <span className="ml-1 font-medium">{cook.averageRating}</span>
                    <span className="text-gray-300">({cook.reviewCount} reviews)</span>
                  </div>
                  <span className="bg-white/20 px-2 py-1 rounded">{cook.priceRange}</span>
                  {cook.category === 'home-meals' && (
                    <span className="bg-primary-400 text-ink px-2 py-1 rounded">🕒 {cook.deliveryTime}</span>
                  )}
                </div>
              </div>
              
              {cook.featured && (
                <div className="bg-primary-400 text-ink px-3 py-1 rounded-full text-sm font-medium">
                  ⭐ Featured
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h2 className="text-2xl font-bold text-ink mb-4">About</h2>
              <p className="text-ink-light leading-relaxed">{cook.description}</p>
            </div>

            {/* Cuisine */}
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h2 className="text-2xl font-bold text-ink mb-4">Cuisine</h2>
              <div className="flex flex-wrap gap-2">
                {cook.cuisine.map((cuisine) => (
                  <span key={cuisine} className="chip">
                    {cuisine}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-ink">
                  Reviews ({cook.reviewCount})
                </h2>
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="btn-primary"
                >
                  Add Review
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className="mb-6">
                  <ReviewForm
                    cookId={cook._id.toString()}
                    onReviewAdded={handleReviewAdded}
                    onCancel={() => setShowReviewForm(false)}
                  />
                </div>
              )}

              {/* Reviews List */}
              <ReviewsList reviews={cook.reviews} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <div className="text-center space-y-4">
                <div className="text-2xl font-bold text-primary-500">
                  {cook.category === 'home-meals' ? '🚚' : 
                   cook.category === 'specialty-dishes' ? '⭐' : 
                   cook.category === 'baked-goods' ? '🧁' : '🥗'}
                </div>
                <h3 className="text-lg font-semibold text-ink">
                  {cook.category === 'home-meals' ? 'Order Home Meals' : 
                   cook.category === 'specialty-dishes' ? 'Order Specialties' : 
                   cook.category === 'baked-goods' ? 'Order Baked Goods' : 'Order Healthy Options'}
                </h3>
                <button className="w-full btn-primary py-3">
                  Order Now
                </button>
              </div>
            </div>

            {/* Cook Info */}
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-ink mb-4">Cook Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-light">Category:</span>
                  <span className="text-ink capitalize">{cook.category.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-light">Price Range:</span>
                  <span className="text-ink">{cook.priceRange}</span>
                </div>
                {cook.category === 'home-meals' && (
                  <div className="flex justify-between">
                    <span className="text-ink-light">Delivery Time:</span>
                    <span className="text-ink">{cook.deliveryTime}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-ink-light">Average Rating:</span>
                  <span className="text-ink">{cook.averageRating}/5</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold text-ink mb-4">Location</h3>
              <p className="text-ink-light text-sm mb-3">{cook.location}</p>
              <button className="w-full btn-outline">
                📍 Get Directions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
