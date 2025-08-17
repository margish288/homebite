import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMenuItem extends Document {
  cookProfileId: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  ingredients: string[];
  allergens: string[];
  dietaryInfo: string[];
  cookingTime: string;
  servingSize: string;
  available: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    cookProfileId: {
      type: Schema.Types.ObjectId,
      ref: 'CookProfile',
      required: [true, 'Cook Profile ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Menu item name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['appetizer', 'main-course', 'dessert', 'beverage', 'snack', 'combo'],
    },
    image: {
      type: String,
      default: '',
    },
    ingredients: {
      type: [String],
      default: [],
    },
    allergens: {
      type: [String],
      default: [],
      enum: ['nuts', 'dairy', 'gluten', 'eggs', 'soy', 'shellfish', 'fish', 'sesame'],
    },
    dietaryInfo: {
      type: [String],
      default: [],
      enum: ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'low-carb', 'high-protein'],
    },
    cookingTime: {
      type: String,
      required: [true, 'Cooking time is required'],
    },
    servingSize: {
      type: String,
      required: [true, 'Serving size is required'],
    },
    available: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
MenuItemSchema.index({ cookProfileId: 1 });
MenuItemSchema.index({ category: 1 });
MenuItemSchema.index({ available: 1 });
MenuItemSchema.index({ featured: -1 });
MenuItemSchema.index({ name: 'text', description: 'text' });

export default mongoose.models.MenuItem || mongoose.model<IMenuItem>('MenuItem', MenuItemSchema);
