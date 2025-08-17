"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReviewForm from "@/components/ReviewForm";
import ReviewsList from "@/components/ReviewsList";
import { ICookProfile } from "@/models/CookProfile";
import { IReview } from "@/models/Review";
import MenuList from "@/components/MenuList";

type PopulatedCookProfile = ICookProfile & {
  userId: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
};

// Remove the extended interface since we'll fetch reviews separately
type CookProfileData = PopulatedCookProfile;

export default function CookDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [cook, setCook] = useState<CookProfileData | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCook();
    }
  }, [id]);

  useEffect(() => {
    if (cook) {
      fetchReviews();
    }
  }, [cook]);

  const fetchCook = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/cook/profile?userId=${id}`);
      const data = await response.json();

      if (data.success) {
        setCook(data.data);
      } else {
        setError(data.error || "Failed to fetch cook");
      }
    } catch (err) {
      setError("Network error occurred");
      console.error("Error fetching cook:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await fetch(`/api/reviews?cookId=${cook?._id}`);
      const data = await response.json();

      if (data.success) {
        setReviews(data.data);
      } else {
        console.error("Failed to fetch reviews:", data.error);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReviewAdded = () => {
    setShowReviewForm(false);
    fetchReviews(); // Refresh reviews to show new review
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className='text-yellow-400'>
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key='half' className='text-yellow-400'>
          ☆
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className='text-gray-300'>
          ★
        </span>
      );
    }

    return stars;
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4'></div>
          <p className='text-ink-light'>Loading cook details...</p>
        </div>
      </div>
    );
  }

  if (error || !cook) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-6xl mb-4'>😕</div>
          <h2 className='text-2xl font-bold text-ink mb-2'>Cook Not Found</h2>
          <p className='text-ink-light mb-4'>
            {error || "The cook you are looking for does not exist."}
          </p>
          <a href='/' className='btn-primary'>
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <div className='relative h-96 overflow-hidden'>
        <img
          src={cook.userId.profileImage || "/placeholder-cook.jpg"}
          alt={cook.businessName}
          className='w-full h-full object-cover'
        />
        <div className='absolute inset-0 bg-black/50'></div>

        {/* Cook Info Overlay */}
        <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
          <div className='container max-w-6xl mx-auto'>
            <div className='flex items-end justify-between'>
              <div>
                <h1 className='text-3xl md:text-4xl font-bold mb-2'>
                  {cook.businessName}
                </h1>
                <p className='text-lg text-gray-200 mb-2'>
                  👨‍🍳 {cook.userId.name}
                </p>
                <p className='text-lg text-gray-200 mb-2'>📍 {cook.location}</p>
                <div className='flex items-center gap-4 text-sm'>
                  <div className='flex items-center gap-1'>
                    {renderStars(cook.rating)}
                    <span className='ml-1 font-medium'>{cook.rating}</span>
                    <span className='text-gray-300'>
                      ({reviews.length} reviews)
                    </span>
                  </div>
                  <span className='bg-white/20 px-2 py-1 rounded'>
                    {cook.priceRange}
                  </span>
                  <span className='bg-primary-400 text-ink px-2 py-1 rounded'>
                    🕒 {cook.deliveryTime}
                  </span>
                  {cook.verifiedBadge && (
                    <span className='bg-green-500 text-white px-2 py-1 rounded text-xs'>
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>

              {cook.featured && (
                <div className='bg-primary-400 text-ink px-3 py-1 rounded-full text-sm font-medium'>
                  ⭐ Featured
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='container max-w-6xl mx-auto px-4 py-8'>
        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Description */}
            <div className='bg-white rounded-xl p-6 shadow-soft'>
              <h2 className='text-2xl font-bold text-ink mb-4'>About</h2>
              <p className='text-ink-light leading-relaxed'>
                {cook.description}
              </p>
            </div>

            {/* Cuisine */}
            <div className='bg-white rounded-xl p-6 shadow-soft'>
              <h2 className='text-2xl font-bold text-ink mb-4'>Cuisine</h2>
              <div className='flex flex-wrap gap-2'>
                {cook.cuisine.map((cuisine) => (
                  <span key={cuisine} className='chip'>
                    {cuisine}
                  </span>
                ))}
              </div>
            </div>

            {/* Specialties */}
            {cook.specialties && cook.specialties.length > 0 && (
              <div className='bg-white rounded-xl p-6 shadow-soft'>
                <h2 className='text-2xl font-bold text-ink mb-4'>
                  Specialties
                </h2>
                <div className='flex flex-wrap gap-2'>
                  {cook.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className='bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium'
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Menu */}
            <div className='bg-white rounded-xl p-6 shadow-soft'>
              <h2 className='text-2xl font-bold text-ink mb-4'>Menu</h2>
              <MenuList
                cookProfileId={cook._id?.toString() || ""}
                showActions={false}
              />
            </div>

            {/* Reviews Section */}
            <div className='bg-white rounded-xl p-6 shadow-soft'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-ink'>
                  Reviews ({reviews.length})
                </h2>
                <button
                  onClick={() => setShowReviewForm(true)}
                  className='btn-primary py-2 px-4'
                >
                  Add Review
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <div className='mb-6'>
                  <ReviewForm
                    cookId={cook._id?.toString() || cook.userId._id}
                    onReviewAdded={handleReviewAdded}
                    onCancel={() => setShowReviewForm(false)}
                  />
                </div>
              )}

              {/* Reviews List */}
              {reviewsLoading ? (
                <div className='text-center py-4'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto'></div>
                  <p className='text-ink-light mt-2'>Loading reviews...</p>
                </div>
              ) : (
                <ReviewsList reviews={reviews} />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className='space-y-6'>
            {/* Action Card */}
            <div className='bg-white rounded-xl p-6 shadow-soft'>
              <div className='text-center space-y-4'>
                <div className='text-2xl font-bold text-primary-500'>🍽️</div>
                <h3 className='text-lg font-semibold text-ink'>
                  Order from {cook.businessName}
                </h3>
                <button className='w-full btn-primary py-3'>Order Now</button>
              </div>
            </div>

            {/* Cook Info */}
            <div className='bg-white rounded-xl p-6 shadow-soft'>
              <h3 className='text-lg font-semibold text-ink mb-4'>Cook Info</h3>
              <div className='space-y-3 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-ink-light'>Cook Name:</span>
                  <span className='text-ink'>{cook.userId.name}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-ink-light'>Price Range:</span>
                  <span className='text-ink'>{cook.priceRange}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-ink-light'>Delivery Time:</span>
                  <span className='text-ink'>{cook.deliveryTime}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-ink-light'>Rating:</span>
                  <span className='text-ink'>{cook.rating}/5</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-ink-light'>Total Orders:</span>
                  <span className='text-ink'>{cook.totalOrders}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-ink-light'>Verification:</span>
                  <span className='text-ink'>
                    {cook.verifiedBadge ? (
                      <span className='text-green-600'>✓ Verified</span>
                    ) : (
                      <span className='text-gray-500'>Pending</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className='bg-white rounded-xl p-6 shadow-soft'>
              <h3 className='text-lg font-semibold text-ink mb-4'>
                Availability
              </h3>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-ink-light'>Days:</span>
                  <span className='text-ink capitalize'>
                    {cook.availability.days.slice(0, 3).join(", ")}
                    {cook.availability.days.length > 3 &&
                      ` +${cook.availability.days.length - 3} more`}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-ink-light'>Hours:</span>
                  <span className='text-ink'>
                    {cook.availability.hours.start} -{" "}
                    {cook.availability.hours.end}
                  </span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className='bg-white rounded-xl p-6 shadow-soft'>
              <h3 className='text-lg font-semibold text-ink mb-4'>Location</h3>
              <p className='text-ink-light text-sm'>{cook.location}</p>
              {/* <button className='w-full btn-outline'>📍 Get Directions</button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
