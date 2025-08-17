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
    id: 'delivery',
    title: 'Order Online',
    description: 'Stay home and order to your doorstep',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    icon: '🚚',
    action: 'Order Now',
  },
  {
    id: 'dining',
    title: 'Dining Out',
    description: 'View the city\'s favourite dining venues',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    icon: '🍽️',
    action: 'Explore',
  },
  {
    id: 'nightlife',
    title: 'Nightlife',
    description: 'Explore the city\'s top nightlife outlets',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop',
    icon: '🍸',
    action: 'Discover',
  },
];

interface CategoriesSectionProps {
  onCategorySelect: (category: string) => void;
}

export default function CategoriesSection({ onCategorySelect }: CategoriesSectionProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-4">
            Explore Categories
          </h2>
          <p className="text-lg text-ink-light max-w-2xl mx-auto">
            Discover the best food and dining experiences in your city
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className="group relative overflow-hidden rounded-xl bg-white shadow-soft hover:shadow-soft-lg transition-all duration-300 cursor-pointer"
            >
              {/* Background Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                  <p className="text-gray-200 text-sm mb-4">{category.description}</p>
                  
                  <button className="self-start bg-primary-400 hover:bg-primary-500 text-ink px-4 py-2 rounded-lg font-medium transition-colors">
                    {category.action}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-primary-500 mb-2">1000+</div>
            <div className="text-ink-light">Restaurants</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-primary-500 mb-2">50K+</div>
            <div className="text-ink-light">Happy Customers</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-primary-500 mb-2">100+</div>
            <div className="text-ink-light">Cities</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-primary-500 mb-2">24/7</div>
            <div className="text-ink-light">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}
