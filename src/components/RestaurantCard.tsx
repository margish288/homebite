import Link from 'next/link';
import { ICookProfile } from '@/models/CookProfile';

type PopulatedCookProfile = ICookProfile & {
  userId: {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
  };
};

interface CookCardProps {
  cookProfile: PopulatedCookProfile;
}

export default function CookCard({ cookProfile }: CookCardProps) {
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
    <Link href={`/cook/${cookProfile.userId._id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 group cursor-pointer">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={cookProfile.userId.profileImage || '/placeholder-cook.jpg'}
          alt={cookProfile.userId.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Featured Badge */}
        {cookProfile.featured && (
          <div className="absolute top-3 left-3 bg-primary-400 text-ink px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}

        {/* Verified Badge */}
        {cookProfile.verifiedBadge && (
          <div className={`absolute top-3 ${cookProfile.featured ? 'left-20' : 'left-3'} bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
            ✓ Verified
          </div>
        )}

        {/* Price Range */}
        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
          {cookProfile.priceRange}
        </div>

        {/* Delivery Time */}
        <div className="absolute bottom-3 left-3 bg-white/90 text-ink px-2 py-1 rounded-full text-xs font-medium">
          🕒 {cookProfile.deliveryTime}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Cook Name & Business Name */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-ink mb-1 line-clamp-1">
            {cookProfile.businessName}
          </h3>
          <p className="text-sm text-ink-light line-clamp-1">
            👨‍🍳 {cookProfile.userId.name}
          </p>
          <p className="text-sm text-ink-light line-clamp-1">
            📍 {cookProfile.location}
          </p>
        </div>

        {/* Cuisine Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {cookProfile.cuisine.slice(0, 3).map((cuisine) => (
            <span
              key={cuisine}
              className="chip text-xs"
            >
              {cuisine}
            </span>
          ))}
          {cookProfile.cuisine.length > 3 && (
            <span className="chip text-xs">
              +{cookProfile.cuisine.length - 3} more
            </span>
          )}
        </div>

        {/* Specialties */}
        {cookProfile.specialties && cookProfile.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            <span className="text-xs font-medium text-ink-light">Specialties:</span>
            {cookProfile.specialties.slice(0, 2).map((specialty) => (
              <span
                key={specialty}
                className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs"
              >
                {specialty}
              </span>
            ))}
            {cookProfile.specialties.length > 2 && (
              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
                +{cookProfile.specialties.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* Rating & Description */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              {renderStars(cookProfile.rating)}
            </div>
            <span className="text-sm font-medium text-ink">
              {cookProfile.rating}
            </span>
            <span className="text-xs text-ink-light">
              ({cookProfile.totalOrders} orders)
            </span>
          </div>
          <p className="text-sm text-ink-light line-clamp-2">
            {cookProfile.description}
          </p>
        </div>

        {/* Action Button */}
        <button className="w-full btn-primary py-2.5 text-sm font-medium">
          Order Now
        </button>
      </div>
    </div>
    </Link>
  );
}
