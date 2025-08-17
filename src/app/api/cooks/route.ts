import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CookProfile from '@/models/CookProfile';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    const query: Record<string, unknown> = {};

    // Only show approved cook profiles
    query.verificationStatus = 'approved';

    if (category) {
      // Map category to cuisine for better filtering
      query.cuisine = { $in: [category] };
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      // Search in business name, description, and cuisine
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { cuisine: { $in: [new RegExp(search, 'i')] } },
        { specialties: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const cookProfiles = await CookProfile.find(query)
      .populate('userId', 'name email profileImage')
      .sort({ rating: -1, createdAt: -1 })
      .limit(20);

    console.log(cookProfiles);


    return NextResponse.json({ success: true, data: cookProfiles });
  } catch (error) {
    console.error('Error fetching cook profiles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cook profiles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const cookProfile = await CookProfile.create(body);

    return NextResponse.json({ success: true, data: cookProfile }, { status: 201 });
  } catch (error) {
    console.error('Error creating cook profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create cook profile' },
      { status: 400 }
    );
  }
}
