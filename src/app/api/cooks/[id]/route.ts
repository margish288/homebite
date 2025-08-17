import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Cook from "@/models/Cook";
import Review from "@/models/Review";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, error: "Invalid cook ID format" },
        { status: 400 }
      );
    }

    // Find cook by ID
    const cook = await Cook.findById(id);

    if (!cook) {
      return NextResponse.json(
        { success: false, error: "Cook not found" },
        { status: 404 }
      );
    }

    // Fetch reviews for this cook
    const reviews = await Review.find({ cookId: id })
      .sort({ createdAt: -1 })
      .limit(50);

    // Calculate average rating from reviews
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : cook.rating;

    const cookWithReviews = {
      ...cook.toObject(),
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length,
      reviews,
    };

    return NextResponse.json({
      success: true,
      data: cookWithReviews,
    });
  } catch (error) {
    console.error("Error fetching cook details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cook details" },
      { status: 500 }
    );
  }
}
