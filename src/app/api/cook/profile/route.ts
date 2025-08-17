import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Model, Types } from "mongoose";
import CookProfileModel, { ICookProfile } from "@/models/CookProfile";
import UserModel, { IUser } from "@/models/User";

const CookProfile = CookProfileModel as Model<ICookProfile>;
const User = UserModel as Model<IUser>;

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      userId,
      businessName,
      description,
      cuisine,
      specialties,
      location,
      priceRange,
      deliveryTime,
      availability,
    } = body;

    // Validate required fields
    if (
      !userId ||
      !businessName ||
      !description ||
      !cuisine ||
      !location ||
      !priceRange ||
      !deliveryTime ||
      !availability
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user exists and is a cook
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (user.role !== "cook") {
      return NextResponse.json(
        { success: false, error: "User is not registered as a cook" },
        { status: 403 }
      );
    }

    // Check if cook profile already exists
    const existingProfile = await CookProfile.findOne({ userId }).exec();
    if (existingProfile) {
      return NextResponse.json(
        { success: false, error: "Cook profile already exists" },
        { status: 409 }
      );
    }

    // Create cook profile with initial verification status
    const cookProfile = await CookProfile.create({
      userId,
      businessName,
      description,
      cuisine,
      specialties: specialties || [],
      location,
      priceRange,
      deliveryTime,
      availability,
      verificationStatus: "pending",
      verifiedBadge: false,
      kycDetails: {
        verified: false,
      },
      kitchenDetails: {
        kitchenPhotos: [],
        storagePhotos: [],
        utensilsPhotos: [],
        hygieneChecklist: {
          cleanKitchen: false,
          properStorage: false,
          qualityUtensils: false,
          handwashStation: false,
          wasteManagement: false,
        },
        verified: false,
      },
      licenses: {
        otherCertifications: [],
      },
      rating: 0,
      totalOrders: 0,
      featured: false,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Cook profile created successfully",
        data: cookProfile,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating cook profile:", error);

    // Handle duplicate key error
    if ((error as any).code === 11000) {
      return NextResponse.json(
        { success: false, error: "Cook profile already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create cook profile" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate if userId is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const cookProfile = await CookProfile.findOne({ userId }).populate(
      "userId"
    ).exec();

    if (!cookProfile) {
      return NextResponse.json(
        { success: false, error: "Cook profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: cookProfile,
    });
  } catch (error) {
    console.error("Error fetching cook profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cook profile" },
      { status: 500 }
    );
  }
}
