'use client';

import { useState } from 'react';

interface ReviewFormProps {
  restaurantId: string;
  onReviewAdded: () => void;
  onCancel: () => void;
}

export default function ReviewForm({ restaurantId, onReviewAdded, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    if (comment.trim().length < 10) {
      setError('Comment must be at least 10 characters long');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // For demo purposes, we'll use the userName as userId
      // In a real app, you'd get this from authentication
      const userId = userName.toLowerCase().replace(/\s+/g, '');

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userName,
          restaurantId,
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        onReviewAdded();
        // Reset form
        setRating(0);
        setComment('');
        setUserName('');
      } else {
        setError(data.error || 'Failed to submit review');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error submitting review:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderStarInput = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="text-2xl focus:outline-none transition-colors"
          >
            <span
              className={
                star <= (hoveredRating || rating)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }
            >
              ★
            </span>
          </button>
        ))}
        <span className="ml-2 text-sm text-ink-light">
          {rating > 0 ? `${rating}/5` : 'Select rating'}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-ink mb-4">Add Your Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <label htmlFor="userName" className="block text-sm font-medium text-ink mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {/* Rating Input */}
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            Rating
          </label>
          {renderStarInput()}
        </div>

        {/* Comment Input */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-ink mb-1">
            Your Review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this restaurant..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-none"
            disabled={loading}
          />
          <div className="text-xs text-ink-lighter mt-1">
            {comment.length}/1000 characters (minimum 10)
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="btn-outline px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
