import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Cook from '@/models/Cook';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    let query: any = {};

    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const cooks = await Cook.find(query)
      .sort({ rating: -1, createdAt: -1 })
      .limit(20);

    return NextResponse.json({ success: true, data: cooks });
  } catch (error) {
    console.error('Error fetching cooks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cooks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const cook = await Cook.create(body);

    return NextResponse.json({ success: true, data: cook }, { status: 201 });
  } catch (error) {
    console.error('Error creating cook profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create cook profile' },
      { status: 400 }
    );
  }
}
