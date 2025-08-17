import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOrderItem {
  menuItemId: Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface IDeliveryAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  landmark?: string;
  contactNumber: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId: Types.ObjectId;
  cookProfileId: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  deliveryAddress: IDeliveryAddress;
  paymentMethod: 'cash' | 'card' | 'upi' | 'wallet';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'placed' | 'confirmed' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled';
  estimatedDeliveryTime: Date;
  actualDeliveryTime?: Date;
  cookNotes?: string;
  customerNotes?: string;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  menuItemId: {
    type: Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: [true, 'Menu item ID is required'],
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  specialInstructions: {
    type: String,
    maxlength: [200, 'Special instructions cannot be more than 200 characters'],
  },
});

const DeliveryAddressSchema = new Schema<IDeliveryAddress>({
  street: {
    type: String,
    required: [true, 'Street address is required'],
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
  },
  postalCode: {
    type: String,
    required: [true, 'Postal code is required'],
    trim: true,
  },
  landmark: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required'],
    trim: true,
  },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: [true, 'Order number is required'],
      unique: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    cookProfileId: {
      type: Schema.Types.ObjectId,
      ref: 'CookProfile',
      required: [true, 'Cook profile ID is required'],
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: function(items: IOrderItem[]) {
          return items.length > 0;
        },
        message: 'Order must have at least one item',
      },
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    deliveryAddress: {
      type: DeliveryAddressSchema,
      required: [true, 'Delivery address is required'],
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'upi', 'wallet'],
      required: [true, 'Payment method is required'],
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled'],
      default: 'placed',
    },
    estimatedDeliveryTime: {
      type: Date,
      required: [true, 'Estimated delivery time is required'],
    },
    actualDeliveryTime: {
      type: Date,
    },
    cookNotes: {
      type: String,
      maxlength: [500, 'Cook notes cannot be more than 500 characters'],
    },
    customerNotes: {
      type: String,
      maxlength: [500, 'Customer notes cannot be more than 500 characters'],
    },
    cancellationReason: {
      type: String,
      maxlength: [500, 'Cancellation reason cannot be more than 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
OrderSchema.index({ orderNumber: 1 }, { unique: true });
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ cookProfileId: 1, createdAt: -1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ paymentStatus: 1 });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
