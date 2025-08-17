import mongoose, { Document, Schema } from 'mongoose';

export interface ICook extends Document {
  name: string;
  category: string;
  image: string;
  rating: number;
  location: string;
  description: string;
  cuisine: string[];
  priceRange: string;
  deliveryTime: string;
  featured: boolean;
  specialties: string[];
  cookingSince: string;
  createdAt: Date;
  updatedAt: Date;
}

const CookSchema = new Schema<ICook>(
  {
    name: {
      type: String,
      required: [true, 'Cook name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['home-meals', 'specialty-dishes', 'baked-goods', 'healthy-options'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    cuisine: {
      type: [String],
      required: [true, 'At least one cuisine type is required'],
    },
    priceRange: {
      type: String,
      required: [true, 'Price range is required'],
      enum: ['$', '$$', '$$$', '$$$$'],
    },
    deliveryTime: {
      type: String,
      required: [true, 'Delivery time is required'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    specialties: {
      type: [String],
      default: [],
    },
    cookingSince: {
      type: String,
      required: [true, 'Cooking experience is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
CookSchema.index({ category: 1 });
CookSchema.index({ rating: -1 });
CookSchema.index({ featured: -1 });
CookSchema.index({ name: 'text', description: 'text' });

export default mongoose.models.Cook || mongoose.model<ICook>('Cook', CookSchema);
