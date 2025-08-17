import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import CookProfile from '@/models/CookProfile';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId, userName, cookId, rating, comment } = body;

    // Validate required fields
    if (!userId || !userName || !cookId || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if cook profile exists
    const cookProfile = await CookProfile.findById(cookId);
    if (!cookProfile) {
      return NextResponse.json(
        { success: false, error: 'Cook profile not found' },
        { status: 404 }
      );
    }

    // Check if user already reviewed this cook
    const existingReview = await Review.findOne({ userId, cookId }).exec();
    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this cook' },
        { status: 409 }
      );
    }

    // Create new review
    const review = await Review.create({
      userId,
      userName,
      cookId,
      rating,
      comment,
    });

    // Update cook profile's average rating
    const allReviews = await Review.find({ cookId });
    const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await CookProfile.findByIdAndUpdate(cookId, {
      rating: Math.round(averageRating * 10) / 10
    });

    return NextResponse.json({ 
      success: true, 
      data: review,
      message: 'Review added successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    
    // Handle unique constraint violation
    if ((error as any).code === 11000) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this cook' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const cookId = searchParams.get('cookId');
    const userId = searchParams.get('userId');

    const query: Record<string, unknown> = {};

    if (cookId) {
      query.cookId = cookId;
    }

    if (userId) {
      query.userId = userId;
    }

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
