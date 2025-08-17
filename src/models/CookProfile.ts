import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICookProfile extends Document {
  userId: Types.ObjectId;
  businessName: string;
  description: string;
  cuisine: string[];
  specialties: string[];
  location: string;
  priceRange: string;
  deliveryTime: string;
  
  // Verification and KYC
  verificationStatus: 'pending' | 'approved' | 'rejected';
  verifiedBadge: boolean;
  kycDetails: {
    idType: 'aadhaar' | 'pan' | 'passport' | 'driving_license';
    idNumber: string;
    idDocument?: string; // URL to uploaded document
    addressProof?: string; // URL to address proof
    verified: boolean;
  };
  
  // Kitchen and Hygiene
  kitchenDetails: {
    kitchenPhotos: string[]; // URLs to kitchen photos
    storagePhotos: string[]; // URLs to storage area photos
    utensilsPhotos: string[]; // URLs to utensils/equipment photos
    hygieneChecklist: {
      cleanKitchen: boolean;
      properStorage: boolean;
      qualityUtensils: boolean;
      handwashStation: boolean;
      wasteManagement: boolean;
    };
    verified: boolean;
  };
  
  // Licenses and Certifications
  licenses: {
    fssaiNumber?: string;
    fssaiDocument?: string;
    localLicense?: string;
    localLicenseDocument?: string;
    otherCertifications: string[];
  };
  
  // Business Details
  availability: {
    days: string[];
    hours: {
      start: string;
      end: string;
    };
  };
  
  // Ratings and Reviews
  rating: number;
  totalOrders: number;
  featured: boolean;
  
  // Verification Notes (for admin)
  verificationNotes?: string;
  verifiedAt?: Date;
  verifiedBy?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const CookProfileSchema = new Schema<ICookProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true,
    },
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxlength: [100, 'Business name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    cuisine: {
      type: [String],
      required: [true, 'At least one cuisine type is required'],
    },
    specialties: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
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
    
    // Verification
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    verifiedBadge: {
      type: Boolean,
      default: false,
    },
    
    // KYC
    kycDetails: {
      idType: {
        type: String,
        enum: ['aadhaar', 'pan', 'passport', 'driving_license'],
        required: [true, 'ID type is required'],
      },
      idNumber: {
        type: String,
        required: [true, 'ID number is required'],
        trim: true,
      },
      idDocument: String,
      addressProof: String,
      verified: {
        type: Boolean,
        default: false,
      },
    },
    
    // Kitchen Details
    kitchenDetails: {
      kitchenPhotos: {
        type: [String],
        validate: {
          validator: function(photos: string[]) {
            return photos.length >= 2;
          },
          message: 'At least 2 kitchen photos are required',
        },
      },
      storagePhotos: {
        type: [String],
        validate: {
          validator: function(photos: string[]) {
            return photos.length >= 1;
          },
          message: 'At least 1 storage photo is required',
        },
      },
      utensilsPhotos: {
        type: [String],
        validate: {
          validator: function(photos: string[]) {
            return photos.length >= 1;
          },
          message: 'At least 1 utensils photo is required',
        },
      },
      hygieneChecklist: {
        cleanKitchen: {
          type: Boolean,
          required: true,
        },
        properStorage: {
          type: Boolean,
          required: true,
        },
        qualityUtensils: {
          type: Boolean,
          required: true,
        },
        handwashStation: {
          type: Boolean,
          required: true,
        },
        wasteManagement: {
          type: Boolean,
          required: true,
        },
      },
      verified: {
        type: Boolean,
        default: false,
      },
    },
    
    // Licenses
    licenses: {
      fssaiNumber: String,
      fssaiDocument: String,
      localLicense: String,
      localLicenseDocument: String,
      otherCertifications: {
        type: [String],
        default: [],
      },
    },
    
    // Availability
    availability: {
      days: {
        type: [String],
        required: [true, 'Available days are required'],
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      },
      hours: {
        start: {
          type: String,
          required: [true, 'Start time is required'],
        },
        end: {
          type: String,
          required: [true, 'End time is required'],
        },
      },
    },
    
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    
    verificationNotes: String,
    verifiedAt: Date,
    verifiedBy: String,
  },
  {
    timestamps: true,
  }
);

// Create indexes
CookProfileSchema.index({ userId: 1 });
CookProfileSchema.index({ verificationStatus: 1 });
CookProfileSchema.index({ verifiedBadge: 1 });
CookProfileSchema.index({ location: 1 });
CookProfileSchema.index({ rating: -1 });
CookProfileSchema.index({ featured: -1 });

export default mongoose.models.CookProfile || mongoose.model<ICookProfile>('CookProfile', CookProfileSchema);
