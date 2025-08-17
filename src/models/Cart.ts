import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICartItem {
  menuItemId: Types.ObjectId;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface ICart extends Document {
  userId: Types.ObjectId;
  cookProfileId: Types.ObjectId;
  items: ICartItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
  menuItemId: {
    type: Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: [true, 'Menu item ID is required'],
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

const CartSchema = new Schema<ICart>(
  {
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
      type: [CartItemSchema],
      required: true,
      validate: {
        validator: function(items: ICartItem[]) {
          return items.length > 0;
        },
        message: 'Cart must have at least one item',
      },
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
CartSchema.index({ userId: 1 });
CartSchema.index({ cookProfileId: 1 });
CartSchema.index({ userId: 1, cookProfileId: 1 }, { unique: true });

export default mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);
