import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Model, Types } from 'mongoose';
import CookModel, { ICook } from '@/models/Cook';
import ReviewModel, { IReview } from '@/models/Review';

const Cook = CookModel as Model<ICook>;
const Review = ReviewModel as Model<IReview>;

const sampleReviews = [
  {
    userName: 'John Doe',
    rating: 5,
    comment: 'Amazing homestyle food! Priya\'s North Indian dishes are authentic and flavorful. The butter chicken and fresh naan were incredible.',
  },
  {
    userName: 'Sarah Johnson',
    rating: 4,
    comment: 'Great home cooking experience! Marco\'s pasta was perfectly cooked and the sauce was rich. Will definitely order again!',
  },
  {
    userName: 'Mike Chen',
    rating: 4,
    comment: 'Fresh ingredients and authentic flavors. Liu\'s Chinese dishes were just like my grandmother used to make. Fast delivery too!',
  },
  {
    userName: 'Emily Davis',
    rating: 5,
    comment: 'The best homemade burgers! Juicy, flavorful, and made with love. The sweet potato fries were crispy and delicious.',
  },
  {
    userName: 'Alex Wilson',
    rating: 4,
    comment: 'Healthy home-cooked meals that actually taste amazing! The quinoa bowls and salads are fresh and very filling.',
  },
];

export async function POST() {
  try {
    await connectDB();

    // Clear existing reviews
    await Review.deleteMany({});

    // Get all cooks
    const cooks = await Cook.find({});

    if (cooks.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No cooks found. Please seed cooks first.',
      }, { status: 400 });
    }

    const reviewsToInsert = [];

    // Add reviews to each cook
    for (const cook of cooks) {
      // Add 2-3 random reviews per cook
      const numReviews = Math.floor(Math.random() * 2) + 2; // 2-3 reviews
      const shuffledReviews = [...sampleReviews].sort(() => 0.5 - Math.random());

      for (let i = 0; i < numReviews && i < shuffledReviews.length; i++) {
        const review = shuffledReviews[i];
        reviewsToInsert.push({
          ...review,
          userId: new Types.ObjectId(), // Generate a random ObjectId for userId
          cookId: cook._id,
        });
      }
    }

    // Insert all reviews
    const insertedReviews = await Review.insertMany(reviewsToInsert);

    // Update cook ratings based on reviews
    for (const cook of cooks) {
      const cookReviews = insertedReviews.filter(
        review => (review.cookId as any).toString() === (cook._id as any).toString()
      );

      if (cookReviews.length > 0) {
        const averageRating = cookReviews.reduce(
          (sum, review) => sum + review.rating, 0
        ) / cookReviews.length;

        await Cook.findByIdAndUpdate(cook._id, {
          rating: Math.round(averageRating * 10) / 10,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${insertedReviews.length} reviews across ${cooks.length} home cooks`,
      data: {
        reviewsCount: insertedReviews.length,
        cooksCount: cooks.length,
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
