import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Model, Types } from 'mongoose';
import MenuItemModel, { IMenuItem } from '@/models/MenuItem';
import CookProfileModel, { ICookProfile } from '@/models/CookProfile';

const MenuItem = MenuItemModel as Model<IMenuItem>;
const CookProfile = CookProfileModel as Model<ICookProfile>;

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const cookProfileId = searchParams.get('cookProfileId');
    const category = searchParams.get('category');
    const available = searchParams.get('available');

    const query: Record<string, unknown> = {};

    if (cookProfileId) {
      // Validate if cookProfileId is a valid MongoDB ObjectId
      if (!Types.ObjectId.isValid(cookProfileId)) {
        return NextResponse.json(
          { success: false, error: 'Invalid cook profile ID format' },
          { status: 400 }
        );
      }
      query.cookProfileId = cookProfileId;
    }

    if (category) {
      query.category = category;
    }

    if (available !== null && available !== undefined) {
      query.available = available === 'true';
    }

    const menuItems = await MenuItem.find(query)
      .populate('cookProfileId', 'businessName userId')
      .sort({ featured: -1, createdAt: -1 });

    return NextResponse.json({ success: true, data: menuItems });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      cookProfileId,
      name,
      description,
      price,
      category,
      image,
      ingredients,
      allergens,
      dietaryInfo,
      cookingTime,
      servingSize,
      available,
      featured,
    } = body;

    // Validate required fields
    if (!cookProfileId || !name || !description || !price || !category || !cookingTime || !servingSize) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate if cookProfileId is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(cookProfileId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid cook profile ID format' },
        { status: 400 }
      );
    }

    // Check if cook profile exists
    const cookProfile = await CookProfile.findById(cookProfileId);
    if (!cookProfile) {
      return NextResponse.json(
        { success: false, error: 'Cook profile not found' },
        { status: 404 }
      );
    }

    // Create menu item
    const menuItem = await MenuItem.create({
      cookProfileId,
      name,
      description,
      price,
      category,
      image: image || '',
      ingredients: ingredients || [],
      allergens: allergens || [],
      dietaryInfo: dietaryInfo || [],
      cookingTime,
      servingSize,
      available: available !== undefined ? available : true,
      featured: featured || false,
    });

    const populatedMenuItem = await MenuItem.findById(menuItem._id)
      .populate('cookProfileId', 'businessName userId');

    return NextResponse.json(
      {
        success: true,
        message: 'Menu item created successfully',
        data: populatedMenuItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}
