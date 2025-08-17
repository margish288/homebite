import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Restaurant from '@/models/Restaurant';
import Review from '@/models/Review';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, error: 'Invalid restaurant ID format' },
        { status: 400 }
      );
    }

    // Find restaurant by ID
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return NextResponse.json(
        { success: false, error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Fetch reviews for this restaurant
    const reviews = await Review.find({ restaurantId: id })
      .sort({ createdAt: -1 })
      .limit(50);

    // Calculate average rating from reviews
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : restaurant.rating;

    const restaurantWithReviews = {
      ...restaurant.toObject(),
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length,
      reviews,
    };

    return NextResponse.json({ 
      success: true, 
      data: restaurantWithReviews 
    });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch restaurant details' },
      { status: 500 }
    );
  }
}
