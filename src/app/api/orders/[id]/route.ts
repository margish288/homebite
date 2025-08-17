import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { Types } from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    // Check if id is order number or ObjectId
    let order;
    if (Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    } else {
      order = await Order.findOne({ orderNumber: id });
    }

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Populate order data
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
      })
      .populate({
        path: 'items.menuItemId',
        select: 'name description image category',
      });

    return NextResponse.json({
      success: true,
      data: populatedOrder,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const {
      orderStatus,
      paymentStatus,
      cookNotes,
      cancellationReason,
      actualDeliveryTime,
    } = body;

    // Find order by ID or order number
    let order;
    if (Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    } else {
      order = await Order.findOne({ orderNumber: id });
    }

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order fields
    if (orderStatus) {
      order.orderStatus = orderStatus;
      
      // Auto-set actual delivery time when status changes to delivered
      if (orderStatus === 'delivered' && !order.actualDeliveryTime) {
        order.actualDeliveryTime = new Date();
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    if (cookNotes !== undefined) {
      order.cookNotes = cookNotes;
    }

    if (cancellationReason !== undefined) {
      order.cancellationReason = cancellationReason;
    }

    if (actualDeliveryTime) {
      order.actualDeliveryTime = new Date(actualDeliveryTime);
    }

    await order.save();

    // Populate updated order data
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
      })
      .populate({
        path: 'items.menuItemId',
        select: 'name description image category',
      });

    return NextResponse.json({
      success: true,
      data: populatedOrder,
      message: 'Order updated successfully',
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    // Find order by ID or order number
    let order;
    if (Types.ObjectId.isValid(id)) {
      order = await Order.findById(id);
    } else {
      order = await Order.findOne({ orderNumber: id });
    }

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Only allow deletion if order is in certain states
    const allowedStatuses = ['placed', 'cancelled'];
    if (!allowedStatuses.includes(order.orderStatus)) {
      return NextResponse.json(
        { success: false, error: 'Order cannot be deleted in current status' },
        { status: 400 }
      );
    }

    await Order.findByIdAndDelete(order._id);

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
