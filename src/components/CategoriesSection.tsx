'use client';

interface Category {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  action: string;
}

const categories: Category[] = [
  {
    id: 'home-meals',
    title: 'Home Meals',
    description: 'Authentic homestyle cooking from local home cooks',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    icon: '🏠',
    action: 'Order Now',
  },
  {
    id: 'specialty-dishes',
    title: 'Specialty Dishes',
    description: 'Unique and signature dishes crafted with passion',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    icon: '⭐',
    action: 'Explore',
  },
  {
    id: 'baked-goods',
    title: 'Fresh Baked',
    description: 'Freshly baked goods and desserts from home kitchens',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop',
    icon: '🧁',
    action: 'Discover',
  },
];

interface CategoriesSectionProps {
  onCategorySelect: (category: string) => void;
}

export default function CategoriesSection({ onCategorySelect }: CategoriesSectionProps) {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 hb-grid opacity-30"></div>
      
      <div className="relative container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-primary-400/10 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            🍳 Cook Categories
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-ink mb-6">
            What Are You{' '}
            <span className="text-primary-500">Craving</span>{' '}
            Today?
          </h2>
          <p className="text-lg md:text-xl text-ink-light max-w-3xl mx-auto leading-relaxed">
            Discover amazing home cooks in your neighborhood specializing in different types of delicious homemade food
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {categories.map((category, index) => (
            <div
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-soft-lg hover:shadow-soft-lg hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-gray-100"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Image */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Icon Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full">
                  <span className="text-2xl">{category.icon}</span>
                </div>
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                  <p className="text-gray-200 text-sm mb-4 leading-relaxed">{category.description}</p>
                  
                  <button className="bg-primary-400 hover:bg-primary-500 text-ink px-6 py-2.5 rounded-xl font-medium transition-all transform group-hover:scale-105">
                    {category.action} →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-ink mb-4">
              Why Choose HomeBite?
            </h3>
            <p className="text-ink-light max-w-2xl mx-auto">
              Connect with verified home cooks who prepare meals with love and authentic recipes
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-xl shadow-soft mx-auto w-16 h-16 flex items-center justify-center">
                <span className="text-2xl">🏠</span>
              </div>
              <div className="text-2xl font-bold text-primary-600">500+</div>
              <div className="text-ink-light text-sm">Verified Home Cooks</div>
            </div>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-xl shadow-soft mx-auto w-16 h-16 flex items-center justify-center">
                <span className="text-2xl">😋</span>
              </div>
              <div className="text-2xl font-bold text-primary-600">25K+</div>
              <div className="text-ink-light text-sm">Happy Customers</div>
            </div>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-xl shadow-soft mx-auto w-16 h-16 flex items-center justify-center">
                <span className="text-2xl">🌎</span>
              </div>
              <div className="text-2xl font-bold text-primary-600">50+</div>
              <div className="text-ink-light text-sm">Cities</div>
            </div>
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-xl shadow-soft mx-auto w-16 h-16 flex items-center justify-center">
                <span className="text-2xl">🚚</span>
              </div>
              <div className="text-2xl font-bold text-primary-600">30min</div>
              <div className="text-ink-light text-sm">Average Delivery</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
