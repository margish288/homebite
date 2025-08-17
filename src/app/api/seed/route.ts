import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Cook from '@/models/Cook';

const sampleCooks = [
  {
    name: "Priya's Kitchen",
    category: "home-meals",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
    rating: 4.5,
    location: "Connaught Place, Delhi",
    description: "Authentic North Indian home-cooked meals with royal flavors and traditional family recipes passed down through generations.",
    cuisine: ["Indian", "North Indian", "Mughlai"],
    priceRange: "$$",
    deliveryTime: "25-35 mins",
    featured: true,
    specialties: ["Butter Chicken", "Dal Makhani", "Homemade Rotis"],
    cookingSince: "15 years",
  },
  {
    name: "Maria's Italian Corner",
    category: "specialty-dishes",
    image: "https://images.unsplash.com/photo-1563379091339-03246963d958?w=400&h=300&fit=crop",
    rating: 4.3,
    location: "Bandra West, Mumbai",
    description: "Fresh handmade pasta and authentic Italian dishes made with love in my home kitchen using traditional family recipes.",
    cuisine: ["Italian", "Continental"],
    priceRange: "$$$",
    deliveryTime: "30-40 mins",
    featured: true,
    specialties: ["Handmade Pasta", "Tiramisu", "Bruschetta"],
    cookingSince: "8 years",
  },
  {
    name: "Chen's Asian Fusion",
    category: "specialty-dishes",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&h=300&fit=crop",
    rating: 4.2,
    location: "Koramangala, Bangalore",
    description: "Authentic Asian fusion dishes prepared in my home kitchen with fresh ingredients and bold flavors from family recipes.",
    cuisine: ["Chinese", "Asian", "Thai"],
    priceRange: "$$",
    deliveryTime: "20-30 mins",
    featured: false,
    specialties: ["Hakka Noodles", "Thai Curry", "Dim Sum"],
    cookingSince: "12 years",
  },
  {
    name: "Sarah's Comfort Food",
    category: "home-meals",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    rating: 4.1,
    location: "Cyber City, Gurgaon",
    description: "Comforting home-style meals and gourmet burgers made with premium ingredients in my home kitchen.",
    cuisine: ["American", "Continental"],
    priceRange: "$$",
    deliveryTime: "15-25 mins",
    featured: false,
    specialties: ["Gourmet Burgers", "Mac & Cheese", "Chocolate Brownies"],
    cookingSince: "6 years",
  },
  {
    name: "Aarti's Healthy Bites",
    category: "healthy-options",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
    rating: 4.6,
    location: "Hauz Khas Village, Delhi",
    description: "Organic, healthy meals prepared fresh in my home kitchen using locally sourced ingredients and nutritious recipes.",
    cuisine: ["Healthy", "Vegan", "Organic"],
    priceRange: "$$$",
    deliveryTime: "35-45 mins",
    featured: true,
    specialties: ["Quinoa Bowls", "Green Smoothies", "Keto Meals"],
    cookingSince: "10 years",
  },
  {
    name: "Ravi's Spice Route",
    category: "home-meals",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    rating: 4.4,
    location: "Linking Road, Mumbai",
    description: "Traditional South Indian home cooking with authentic spices and regional specialties from my grandmother's recipes.",
    cuisine: ["South Indian", "Regional", "Traditional"],
    priceRange: "$$",
    deliveryTime: "25-35 mins",
    featured: true,
    specialties: ["Dosa", "Sambar", "Filter Coffee"],
    cookingSince: "20 years",
  },
  {
    name: "Lisa's Bake House",
    category: "baked-goods",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop",
    rating: 4.0,
    location: "MG Road, Bangalore",
    description: "Freshly baked goods and desserts made with love in my home bakery using premium ingredients and family recipes.",
    cuisine: ["Desserts", "Baked Goods", "Continental"],
    priceRange: "$$$",
    deliveryTime: "40-50 mins",
    featured: false,
    specialties: ["Custom Cakes", "Fresh Bread", "Artisan Cookies"],
    cookingSince: "5 years",
  },
  {
    name: "Yuki's Japanese Kitchen",
    category: "specialty-dishes",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
    rating: 4.3,
    location: "Powai, Mumbai",
    description: "Authentic Japanese home cooking with fresh ingredients and traditional techniques learned from my family in Tokyo.",
    cuisine: ["Japanese", "Sushi", "Asian"],
    priceRange: "$$$",
    deliveryTime: "40-50 mins",
    featured: false,
    specialties: ["Fresh Sushi", "Ramen", "Miso Soup"],
    cookingSince: "7 years",
  },
];

export async function POST() {
  try {
    await connectDB();

    // Clear existing data
    await Cook.deleteMany({});

    // Insert sample data
    const cooks = await Cook.insertMany(sampleCooks);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${cooks.length} home cooks`,
      data: cooks,
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
