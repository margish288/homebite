import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';
import Review from '@/models/Review';

const sampleReviews = [
  {
    userId: 'user1',
    userName: 'John Doe',
    rating: 5,
    comment: 'Amazing food and excellent service! The North Indian dishes are authentic and flavorful. Highly recommend the butter chicken and naan.',
  },
  {
    userId: 'user2',
    userName: 'Sarah Johnson',
    rating: 4,
    comment: 'Great ambiance and delicious food. The pasta was perfectly cooked and the sauce was rich. Will definitely come back!',
  },
  {
    userId: 'user3',
    userName: 'Mike Chen',
    rating: 4,
    comment: 'Fresh ingredients and bold flavors. The Chinese dishes were authentic and well-prepared. Fast delivery too!',
  },
  {
    userId: 'user4',
    userName: 'Emily Davis',
    rating: 5,
    comment: 'The best burgers in town! Juicy, flavorful, and perfectly cooked. The fries were crispy and delicious.',
  },
  {
    userId: 'user5',
    userName: 'Alex Wilson',
    rating: 4,
    comment: 'Healthy options that actually taste great! The smoothie bowls and salads are fresh and filling.',
  },
];

export async function POST() {
  try {
    await connectDB();

    // Clear existing reviews
    await Review.deleteMany({});

    // Get all restaurants
    const restaurants = await Restaurant.find({});

    if (restaurants.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No restaurants found. Please seed restaurants first.',
      }, { status: 400 });
    }

    const reviewsToInsert = [];

    // Add reviews to each restaurant
    for (const restaurant of restaurants) {
      // Add 2-3 random reviews per restaurant
      const numReviews = Math.floor(Math.random() * 2) + 2; // 2-3 reviews
      const shuffledReviews = [...sampleReviews].sort(() => 0.5 - Math.random());

      for (let i = 0; i < numReviews && i < shuffledReviews.length; i++) {
        const review = shuffledReviews[i];
        reviewsToInsert.push({
          ...review,
          userId: `${review.userId}_${restaurant._id}`, // Make userId unique per restaurant
          restaurantId: restaurant._id,
        });
      }
    }

    // Insert all reviews
    const insertedReviews = await Review.insertMany(reviewsToInsert);

    // Update restaurant ratings based on reviews
    for (const restaurant of restaurants) {
      const restaurantReviews = insertedReviews.filter(
        review => review.restaurantId.toString() === restaurant._id.toString()
      );

      if (restaurantReviews.length > 0) {
        const averageRating = restaurantReviews.reduce(
          (sum, review) => sum + review.rating, 0
        ) / restaurantReviews.length;

        await Restaurant.findByIdAndUpdate(restaurant._id, {
          rating: Math.round(averageRating * 10) / 10,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${insertedReviews.length} reviews across ${restaurants.length} restaurants`,
      data: {
        reviewsCount: insertedReviews.length,
        restaurantsCount: restaurants.length,
      },
    });
  } catch (error) {
    console.error('Error seeding reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed reviews' },
      { status: 500 }
    );
  }
}
