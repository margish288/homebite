import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Model, Types } from 'mongoose';
import OrderModel, { IOrder } from '@/models/Order';
import CartModel, { ICart } from '@/models/Cart';

const Order = OrderModel as Model<IOrder>;
const Cart = CartModel as Model<ICart>;

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `HB${timestamp.slice(-6)}${random}`;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const cookProfileId = searchParams.get('cookProfileId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const query: Record<string, unknown> = {};

    if (userId) {
      if (!Types.ObjectId.isValid(userId)) {
        return NextResponse.json(
          { success: false, error: 'Invalid user ID format' },
          { status: 400 }
        );
      }
      query.userId = userId;
    }

    if (cookProfileId) {
      if (!Types.ObjectId.isValid(cookProfileId)) {
        return NextResponse.json(
          { success: false, error: 'Invalid cook profile ID format' },
          { status: 400 }
        );
      }
      query.cookProfileId = cookProfileId;
    }

    if (status) {
      query.orderStatus = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate({
        path: 'userId',
        select: 'name email phone profileImage',
      })
      .populate({
        path: 'cookProfileId',
        select: 'businessName userId location deliveryTime',
        populate: {
          path: 'userId',
          select: 'name profileImage',
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      userId,
      deliveryAddress,
      paymentMethod,
      customerNotes,
    } = body;

    // Validate required fields
    if (!userId || !deliveryAddress || !paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate userId
    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    // Validate delivery address
    const requiredAddressFields = ['street', 'city', 'state', 'postalCode', 'contactNumber'];
    for (const field of requiredAddressFields) {
      if (!deliveryAddress[field]) {
        return NextResponse.json(
          { success: false, error: `Missing delivery address field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Get user's cart
    const cart = await Cart.findOne({ userId }).populate('items.menuItemId');
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Verify all items are still available
    for (const cartItem of cart.items) {
      const menuItem = cartItem.menuItemId as any;
      if (!menuItem.available) {
        return NextResponse.json(
          { success: false, error: `"${menuItem.name}" is no longer available` },
          { status: 400 }
        );
      }
    }

    // Create order items from cart
    const orderItems = cart.items.map((cartItem: any) => {
      const menuItem = cartItem.menuItemId as any;
      return {
        menuItemId: cartItem.menuItemId,
        name: menuItem.name,
        quantity: cartItem.quantity,
        price: cartItem.price,
        specialInstructions: cartItem.specialInstructions,
      };
    });

    // Calculate estimated delivery time (add 60 minutes to current time)
    const estimatedDeliveryTime = new Date();
    estimatedDeliveryTime.setMinutes(estimatedDeliveryTime.getMinutes() + 60);

    // Create order
    const order = new Order({
      orderNumber: generateOrderNumber(),
      userId,
      cookProfileId: cart.cookProfileId,
      items: orderItems,
      totalAmount: cart.totalAmount,
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid', // Assume digital payments are instant
      orderStatus: 'placed',
      estimatedDeliveryTime,
      customerNotes,
    });

    await order.save();

    // Clear the cart after successful order
    await Cart.findByIdAndDelete(cart._id);

    // Populate order data for response
    const populatedOrder = await Order.findById(order._id)
      .populate({
        path: 'userId',
        select: 'name email phone profileImage',
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
      data: populatedOrder,
      message: 'Order placed successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
