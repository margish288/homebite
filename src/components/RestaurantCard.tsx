import Link from 'next/link';
import { ICook } from '@/models/Cook';

interface CookCardProps {
  cook: ICook;
}

export default function CookCard({ cook }: CookCardProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">★</span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">☆</span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">★</span>
      );
    }

    return stars;
  };

  return (
    <Link href={`/cook/${cook._id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 group cursor-pointer">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={cook.image}
          alt={cook.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Featured Badge */}
        {cook.featured && (
          <div className="absolute top-3 left-3 bg-primary-400 text-ink px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}

        {/* Price Range */}
        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
          {cook.priceRange}
        </div>

        {/* Delivery Time */}
        {cook.category === 'delivery' && (
          <div className="absolute bottom-3 left-3 bg-white/90 text-ink px-2 py-1 rounded-full text-xs font-medium">
            🕒 {cook.deliveryTime}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Restaurant Name & Location */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-ink mb-1 line-clamp-1">
            {cook.name}
          </h3>
          <p className="text-sm text-ink-light line-clamp-1">
            📍 {cook.location}
          </p>
        </div>

        {/* Cuisine Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {cook.cuisine.slice(0, 3).map((cuisine) => (
            <span
              key={cuisine}
              className="chip text-xs"
            >
              {cuisine}
            </span>
          ))}
          {cook.cuisine.length > 3 && (
            <span className="chip text-xs">
              +{cook.cuisine.length - 3} more
            </span>
          )}
        </div>

        {/* Rating & Description */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              {renderStars(cook.rating)}
            </div>
            <span className="text-sm font-medium text-ink">
              {cook.rating}
            </span>
          </div>
          <p className="text-sm text-ink-light line-clamp-2">
            {cook.description}
          </p>
        </div>

        {/* Action Button */}
        <button className="w-full btn-primary py-2.5 text-sm font-medium">
          {cook.category === 'delivery' ? 'Order Now' : 
           cook.category === 'dining' ? 'Book Table' : 
           'View Details'}
        </button>
      </div>
    </div>
    </Link>
  );
}
