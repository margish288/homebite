import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Model, Types } from 'mongoose';
import CartModel, { ICart } from '@/models/Cart';
import MenuItemModel, { IMenuItem } from '@/models/MenuItem';

const Cart = CartModel as Model<ICart>;
const MenuItem = MenuItemModel as Model<IMenuItem>;

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate if userId is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId })
      .populate({
        path: 'items.menuItemId',
        select: 'name description price image category available',
      })
      .populate({
        path: 'cookProfileId',
        select: 'businessName userId location deliveryTime',
        populate: {
          path: 'userId',
          select: 'name profileImage',
        },
      })
      .exec();

    if (!cart) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'Cart is empty',
      });
    }

    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId, menuItemId, quantity, specialInstructions } = body;

    // Validate required fields
    if (!userId || !menuItemId || !quantity) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate ObjectIds
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(menuItemId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    // Validate quantity
    if (quantity < 1) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be at least 1' },
        { status: 400 }
      );
    }

    // Get menu item details
    const menuItem = await MenuItem.findById(menuItemId).populate('cookProfileId');
    if (!menuItem) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found' },
        { status: 404 }
      );
    }

    if (!menuItem.available) {
      return NextResponse.json(
        { success: false, error: 'Menu item is not available' },
        { status: 400 }
      );
    }

    const cookProfileId = menuItem.cookProfileId._id;

    // Check if user already has a cart
    let cart = await Cart.findOne({ userId }).exec();

    if (cart) {
      // Check if cart is for the same cook
      if (cart.cookProfileId.toString() !== cookProfileId.toString()) {
        return NextResponse.json(
          { success: false, error: 'You can only order from one cook at a time. Please clear your current cart first.' },
          { status: 400 }
        );
      }

      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(
        (item: any) => item.menuItemId.toString() === menuItemId
      );

      if (existingItemIndex > -1) {
        // Update existing item quantity
        cart.items[existingItemIndex].quantity += quantity;
        cart.items[existingItemIndex].specialInstructions = specialInstructions || cart.items[existingItemIndex].specialInstructions;
      } else {
        // Add new item to cart
        cart.items.push({
          menuItemId,
          quantity,
          price: menuItem.price,
          specialInstructions,
        });
      }
    } else {
      // Create new cart
      cart = new Cart({
        userId,
        cookProfileId,
        items: [{
          menuItemId,
          quantity,
          price: menuItem.price,
          specialInstructions,
        }],
        totalAmount: 0, // Will be calculated below
      });
    }

    // Calculate total amount
    cart.totalAmount = cart.items.reduce((total: number, item: any) => {
      return total + (item.price * item.quantity);
    }, 0);

    await cart.save();

    // Populate cart data for response
    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.menuItemId',
        select: 'name description price image category available',
      })
      .populate({
        path: 'cookProfileId',
        select: 'businessName userId location deliveryTime',
        populate: {
          path: 'userId',
          select: 'name profileImage',
        },
      });

    return NextResponse.json({
      success: true,
      data: populatedCart,
      message: 'Item added to cart successfully',
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId, menuItemId, quantity, specialInstructions } = body;

    // Validate required fields
    if (!userId || !menuItemId || quantity === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate ObjectIds
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(menuItemId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID format' },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ userId }).exec();
    if (!cart) {
      return NextResponse.json(
        { success: false, error: 'Cart not found' },
        { status: 404 }
      );
    }

    const itemIndex = cart.items.findIndex(
      (item: any) => item.menuItemId.toString() === menuItemId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    if (quantity === 0) {
      // Remove item from cart
      cart.items.splice(itemIndex, 1);
      
      // If cart is empty, delete it
      if (cart.items.length === 0) {
        await Cart.findByIdAndDelete(cart._id);
        return NextResponse.json({
          success: true,
          data: null,
          message: 'Item removed from cart',
        });
      }
    } else {
      // Update item quantity and special instructions
      cart.items[itemIndex].quantity = quantity;
      if (specialInstructions !== undefined) {
        cart.items[itemIndex].specialInstructions = specialInstructions;
      }
    }

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce((total: number, item: any) => {
      return total + (item.price * item.quantity);
    }, 0);

    await cart.save();

    // Populate cart data for response
    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: 'items.menuItemId',
        select: 'name description price image category available',
      })
      .populate({
        path: 'cookProfileId',
        select: 'businessName userId location deliveryTime',
        populate: {
          path: 'userId',
          select: 'name profileImage',
        },
      });

    return NextResponse.json({
      success: true,
      data: populatedCart,
      message: 'Cart updated successfully',
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Validate if userId is a valid MongoDB ObjectId
    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    await Cart.findOneAndDelete({ userId });

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully',
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
