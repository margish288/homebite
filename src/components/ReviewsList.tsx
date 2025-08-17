import { IReview } from '@/models/Review';

interface ReviewsListProps {
  reviews?: IReview[];
}

export default function ReviewsList({ reviews }: ReviewsListProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? 'text-yellow-400' : 'text-gray-300'}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">💭</div>
        <h3 className="text-lg font-medium text-ink mb-2">No reviews yet</h3>
        <p className="text-ink-light">Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review._id}
          className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0"
        >
          <div className="flex items-start gap-4">
            {/* User Avatar */}
            <div className="flex-shrink-0 w-10 h-10 bg-primary-400 rounded-full flex items-center justify-center text-ink font-medium text-sm">
              {getInitials(review.userName)}
            </div>

            {/* Review Content */}
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium text-ink">{review.userName}</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-ink-light">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comment */}
              <p className="text-ink-light leading-relaxed">{review.comment}</p>

              {/* Actions */}
              <div className="flex items-center gap-4 mt-3 text-sm">
                <button className="text-ink-lighter hover:text-primary-500 transition-colors">
                  👍 Helpful
                </button>
                <button className="text-ink-lighter hover:text-primary-500 transition-colors">
                  💬 Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Load More Reviews */}
      {reviews && reviews.length >= 10 && (
        <div className="text-center pt-4">
          <button className="btn-outline">
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
}
