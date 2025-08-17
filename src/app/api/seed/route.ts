import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Model } from 'mongoose';
import UserModel, { IUser } from '@/models/User';
import CookProfileModel, { ICookProfile } from '@/models/CookProfile';
import MenuItemModel, { IMenuItem } from '@/models/MenuItem';

const User = UserModel as Model<IUser>;
const CookProfile = CookProfileModel as Model<ICookProfile>;
const MenuItem = MenuItemModel as Model<IMenuItem>;

const sampleUsers = [
  {
    name: "Priya Sharma",
    email: "priya.sharma@gmail.com",
    password: "password123",
    role: "cook",
    isVerified: true,
    profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=150&h=150&fit=crop&crop=face",
    phone: "+91-9876543210",
  },
  {
    name: "Maria Rodriguez",
    email: "maria.rodriguez@gmail.com",
    password: "password123",
    role: "cook",
    isVerified: true,
    profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    phone: "+91-9876543211",
  },
  {
    name: "Chen Wei",
    email: "chen.wei@gmail.com",
    password: "password123",
    role: "cook",
    isVerified: true,
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    phone: "+91-9876543212",
  },
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@gmail.com",
    password: "password123",
    role: "cook",
    isVerified: true,
    profileImage: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face",
    phone: "+91-9876543213",
  },
  {
    name: "Aarti Patel",
    email: "aarti.patel@gmail.com",
    password: "password123",
    role: "cook",
    isVerified: true,
    profileImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    phone: "+91-9876543214",
  },
  {
    name: "Ravi Kumar",
    email: "ravi.kumar@gmail.com",
    password: "password123",
    role: "cook",
    isVerified: true,
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    phone: "+91-9876543215",
  },
  {
    name: "Lisa Thompson",
    email: "lisa.thompson@gmail.com",
    password: "password123",
    role: "cook",
    isVerified: true,
    profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    phone: "+91-9876543216",
  },
  {
    name: "Yuki Tanaka",
    email: "yuki.tanaka@gmail.com",
    password: "password123",
    role: "cook",
    isVerified: true,
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    phone: "+91-9876543217",
  },
];

const sampleCookProfiles = [
  {
    businessName: "Priya's Kitchen",
    description: "Authentic North Indian home-cooked meals with royal flavors and traditional family recipes passed down through generations.",
    cuisine: ["Indian", "North Indian", "Mughlai"],
    specialties: ["Butter Chicken", "Dal Makhani", "Homemade Rotis"],
    location: "Connaught Place, Delhi",
    priceRange: "$$",
    deliveryTime: "25-35 mins",
    verificationStatus: "approved",
    verifiedBadge: true,
    availability: {
      days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
      hours: { start: "10:00", end: "22:00" }
    },
    rating: 4.5,
    totalOrders: 156,
    featured: true,
  },
  {
    businessName: "Maria's Italian Corner",
    description: "Fresh handmade pasta and authentic Italian dishes made with love in my home kitchen using traditional family recipes.",
    cuisine: ["Italian", "Continental"],
    specialties: ["Handmade Pasta", "Tiramisu", "Bruschetta"],
    location: "Bandra West, Mumbai",
    priceRange: "$$$",
    deliveryTime: "30-40 mins",
    verificationStatus: "approved",
    verifiedBadge: true,
    availability: {
      days: ["tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      hours: { start: "12:00", end: "21:00" }
    },
    rating: 4.3,
    totalOrders: 89,
    featured: true,
  },
  {
    businessName: "Chen's Asian Fusion",
    description: "Authentic Asian fusion dishes prepared in my home kitchen with fresh ingredients and bold flavors from family recipes.",
    cuisine: ["Chinese", "Asian", "Thai"],
    specialties: ["Hakka Noodles", "Thai Curry", "Dim Sum"],
    location: "Koramangala, Bangalore",
    priceRange: "$$",
    deliveryTime: "20-30 mins",
    verificationStatus: "approved",
    verifiedBadge: false,
    availability: {
      days: ["monday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      hours: { start: "11:00", end: "23:00" }
    },
    rating: 4.2,
    totalOrders: 234,
    featured: false,
  },
  {
    businessName: "Sarah's Comfort Food",
    description: "Comforting home-style meals and gourmet burgers made with premium ingredients in my home kitchen.",
    cuisine: ["American", "Continental"],
    specialties: ["Gourmet Burgers", "Mac & Cheese", "Chocolate Brownies"],
    location: "Cyber City, Gurgaon",
    priceRange: "$$",
    deliveryTime: "15-25 mins",
    verificationStatus: "approved",
    verifiedBadge: false,
    availability: {
      days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      hours: { start: "09:00", end: "20:00" }
    },
    rating: 4.1,
    totalOrders: 67,
    featured: false,
  },
  {
    businessName: "Aarti's Healthy Bites",
    description: "Organic, healthy meals prepared fresh in my home kitchen using locally sourced ingredients and nutritious recipes.",
    cuisine: ["Healthy", "Vegan", "Organic"],
    specialties: ["Quinoa Bowls", "Green Smoothies", "Keto Meals"],
    location: "Hauz Khas Village, Delhi",
    priceRange: "$$$",
    deliveryTime: "35-45 mins",
    verificationStatus: "approved",
    verifiedBadge: true,
    availability: {
      days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
      hours: { start: "08:00", end: "19:00" }
    },
    rating: 4.6,
    totalOrders: 178,
    featured: true,
  },
  {
    businessName: "Ravi's Spice Route",
    description: "Traditional South Indian home cooking with authentic spices and regional specialties from my grandmother's recipes.",
    cuisine: ["South Indian", "Regional", "Traditional"],
    specialties: ["Dosa", "Sambar", "Filter Coffee"],
    location: "Linking Road, Mumbai",
    priceRange: "$$",
    deliveryTime: "25-35 mins",
    verificationStatus: "approved",
    verifiedBadge: true,
    availability: {
      days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      hours: { start: "06:00", end: "22:00" }
    },
    rating: 4.4,
    totalOrders: 312,
    featured: true,
  },
  {
    businessName: "Lisa's Bake House",
    description: "Freshly baked goods and desserts made with love in my home bakery using premium ingredients and family recipes.",
    cuisine: ["Desserts", "Baked Goods", "Continental"],
    specialties: ["Custom Cakes", "Fresh Bread", "Artisan Cookies"],
    location: "MG Road, Bangalore",
    priceRange: "$$$",
    deliveryTime: "40-50 mins",
    verificationStatus: "approved",
    verifiedBadge: false,
    availability: {
      days: ["tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      hours: { start: "10:00", end: "18:00" }
    },
    rating: 4.0,
    totalOrders: 45,
    featured: false,
  },
  {
    businessName: "Yuki's Japanese Kitchen",
    description: "Authentic Japanese home cooking with fresh ingredients and traditional techniques learned from my family in Tokyo.",
    cuisine: ["Japanese", "Sushi", "Asian"],
    specialties: ["Fresh Sushi", "Ramen", "Miso Soup"],
    location: "Powai, Mumbai",
    priceRange: "$$$",
    deliveryTime: "40-50 mins",
    verificationStatus: "approved",
    verifiedBadge: false,
    availability: {
      days: ["wednesday", "thursday", "friday", "saturday", "sunday"],
      hours: { start: "17:00", end: "23:00" }
    },
    rating: 4.3,
    totalOrders: 98,
    featured: false,
  },
];

const sampleMenuItems = [
  // Priya's Kitchen - North Indian (Cook Profile 0)
  [
    {
      name: "Butter Chicken",
      description: "Tender chicken in a rich, creamy tomato-based sauce with aromatic spices. A classic North Indian favorite.",
      price: 350,
      category: "main-course",
      image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&h=300&fit=crop",
      ingredients: ["chicken", "tomatoes", "cream", "butter", "garam masala", "ginger", "garlic"],
      allergens: ["dairy"],
      dietaryInfo: ["gluten-free"],
      cookingTime: "45 mins",
      servingSize: "2-3 people",
      available: true,
      featured: true,
    },
    {
      name: "Dal Makhani",
      description: "Slow-cooked black lentils in a creamy, buttery sauce. Rich and comforting traditional dal.",
      price: 220,
      category: "main-course",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
      ingredients: ["black lentils", "kidney beans", "cream", "butter", "tomatoes", "spices"],
      allergens: ["dairy"],
      dietaryInfo: ["vegetarian", "gluten-free"],
      cookingTime: "2 hours",
      servingSize: "2-3 people",
      available: true,
      featured: true,
    },
    {
      name: "Garlic Naan",
      description: "Soft, fluffy bread topped with fresh garlic and herbs, baked in traditional style.",
      price: 60,
      category: "appetizer",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
      ingredients: ["flour", "yogurt", "garlic", "herbs", "ghee"],
      allergens: ["gluten", "dairy"],
      dietaryInfo: ["vegetarian"],
      cookingTime: "15 mins",
      servingSize: "1-2 people",
      available: true,
      featured: false,
    },
  ],
  // Maria's Italian Corner (Cook Profile 1)
  [
    {
      name: "Handmade Pasta Carbonara",
      description: "Fresh egg pasta with crispy pancetta, parmesan, and a creamy egg sauce. Authentic Italian recipe.",
      price: 420,
      category: "main-course",
      image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop",
      ingredients: ["eggs", "pasta", "pancetta", "parmesan", "black pepper", "olive oil"],
      allergens: ["eggs", "gluten", "dairy"],
      dietaryInfo: [],
      cookingTime: "25 mins",
      servingSize: "1-2 people",
      available: true,
      featured: true,
    },
    {
      name: "Tiramisu",
      description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.",
      price: 180,
      category: "dessert",
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
      ingredients: ["mascarpone", "coffee", "ladyfingers", "cocoa", "eggs", "sugar"],
      allergens: ["dairy", "eggs", "gluten"],
      dietaryInfo: ["vegetarian"],
      cookingTime: "30 mins",
      servingSize: "1 person",
      available: true,
      featured: true,
    },
    {
      name: "Bruschetta Trio",
      description: "Three varieties of classic Italian bruschetta with fresh toppings on toasted bread.",
      price: 240,
      category: "appetizer",
      image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop",
      ingredients: ["bread", "tomatoes", "basil", "mozzarella", "olive oil", "garlic"],
      allergens: ["gluten", "dairy"],
      dietaryInfo: ["vegetarian"],
      cookingTime: "15 mins",
      servingSize: "2-3 people",
      available: true,
      featured: false,
    },
  ],
  // Chen's Asian Fusion (Cook Profile 2)
  [
    {
      name: "Hakka Noodles",
      description: "Stir-fried noodles with fresh vegetables and authentic Chinese seasonings.",
      price: 280,
      category: "main-course",
      image: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop",
      ingredients: ["noodles", "vegetables", "soy sauce", "garlic", "ginger", "spring onions"],
      allergens: ["gluten", "soy"],
      dietaryInfo: ["vegetarian"],
      cookingTime: "20 mins",
      servingSize: "1-2 people",
      available: true,
      featured: true,
    },
    {
      name: "Thai Green Curry",
      description: "Aromatic coconut curry with fresh herbs, vegetables, and authentic Thai spices.",
      price: 320,
      category: "main-course",
      image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop",
      ingredients: ["coconut milk", "thai basil", "green chilies", "vegetables", "lime", "lemongrass"],
      allergens: [],
      dietaryInfo: ["vegan", "gluten-free"],
      cookingTime: "35 mins",
      servingSize: "2 people",
      available: true,
      featured: true,
    },
    {
      name: "Chicken Dim Sum",
      description: "Steamed dumplings filled with seasoned chicken and vegetables. Served with dipping sauce.",
      price: 200,
      category: "appetizer",
      image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop",
      ingredients: ["chicken", "flour", "ginger", "garlic", "vegetables", "soy sauce"],
      allergens: ["gluten", "soy"],
      dietaryInfo: [],
      cookingTime: "30 mins",
      servingSize: "2-3 people",
      available: true,
      featured: false,
    },
  ],
  // Sarah's Comfort Food (Cook Profile 3)
  [
    {
      name: "Gourmet Beef Burger",
      description: "Juicy beef patty with premium toppings, cheese, and special sauce in a brioche bun.",
      price: 380,
      category: "main-course",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      ingredients: ["beef", "brioche bun", "cheese", "lettuce", "tomato", "onion", "special sauce"],
      allergens: ["gluten", "dairy", "eggs"],
      dietaryInfo: [],
      cookingTime: "20 mins",
      servingSize: "1 person",
      available: true,
      featured: true,
    },
    {
      name: "Truffle Mac & Cheese",
      description: "Creamy macaroni and cheese elevated with truffle oil and premium cheeses.",
      price: 320,
      category: "main-course",
      image: "https://images.unsplash.com/photo-1543826173-bb15fc5a4e30?w=400&h=300&fit=crop",
      ingredients: ["macaroni", "cheddar", "truffle oil", "cream", "parmesan", "breadcrumbs"],
      allergens: ["gluten", "dairy"],
      dietaryInfo: ["vegetarian"],
      cookingTime: "25 mins",
      servingSize: "1-2 people",
      available: true,
      featured: true,
    },
    {
      name: "Chocolate Brownies",
      description: "Rich, fudgy brownies made with premium dark chocolate. Served warm with vanilla ice cream.",
      price: 160,
      category: "dessert",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
      ingredients: ["dark chocolate", "butter", "eggs", "flour", "sugar", "vanilla"],
      allergens: ["gluten", "dairy", "eggs"],
      dietaryInfo: ["vegetarian"],
      cookingTime: "35 mins",
      servingSize: "1-2 people",
      available: true,
      featured: false,
    },
  ],
  // Aarti's Healthy Bites (Cook Profile 4)
  [
    {
      name: "Quinoa Buddha Bowl",
      description: "Nutritious bowl with quinoa, roasted vegetables, avocado, and tahini dressing.",
      price: 340,
      category: "main-course",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
      ingredients: ["quinoa", "avocado", "chickpeas", "kale", "sweet potato", "tahini", "lemon"],
      allergens: ["sesame"],
      dietaryInfo: ["vegan", "gluten-free", "high-protein"],
      cookingTime: "30 mins",
      servingSize: "1 person",
      available: true,
      featured: true,
    },
    {
      name: "Green Detox Smoothie",
      description: "Refreshing blend of spinach, cucumber, apple, ginger, and coconut water.",
      price: 120,
      category: "beverage",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      ingredients: ["spinach", "cucumber", "apple", "ginger", "coconut water", "lime"],
      allergens: [],
      dietaryInfo: ["vegan", "gluten-free", "low-carb"],
      cookingTime: "5 mins",
      servingSize: "1 person",
      available: true,
      featured: true,
    },
    {
      name: "Keto Cauliflower Bowl",
      description: "Low-carb bowl with cauliflower rice, grilled vegetables, and herb dressing.",
      price: 280,
      category: "main-course",
      image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
      ingredients: ["cauliflower", "broccoli", "bell peppers", "olive oil", "herbs", "lemon"],
      allergens: [],
      dietaryInfo: ["keto", "vegan", "gluten-free", "low-carb"],
      cookingTime: "25 mins",
      servingSize: "1 person",
      available: true,
      featured: false,
    },
  ],
  // Ravi's Spice Route (Cook Profile 5)
  [
    {
      name: "Masala Dosa",
      description: "Crispy fermented crepe filled with spiced potato curry. Served with coconut chutney and sambar.",
      price: 180,
      category: "main-course",
      image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop",
      ingredients: ["rice", "lentils", "potatoes", "onions", "spices", "coconut", "curry leaves"],
      allergens: [],
      dietaryInfo: ["vegan", "gluten-free"],
      cookingTime: "20 mins",
      servingSize: "1 person",
      available: true,
      featured: true,
    },
    {
      name: "Traditional Sambar",
      description: "Authentic South Indian lentil curry with vegetables and aromatic spices.",
      price: 120,
      category: "main-course",
      image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop",
      ingredients: ["toor dal", "tamarind", "vegetables", "sambar powder", "curry leaves", "mustard seeds"],
      allergens: [],
      dietaryInfo: ["vegan", "gluten-free"],
      cookingTime: "45 mins",
      servingSize: "2-3 people",
      available: true,
      featured: true,
    },
    {
      name: "Filter Coffee",
      description: "Traditional South Indian coffee brewed with chicory and served with milk and sugar.",
      price: 60,
      category: "beverage",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
      ingredients: ["coffee beans", "chicory", "milk", "sugar"],
      allergens: ["dairy"],
      dietaryInfo: ["vegetarian"],
      cookingTime: "10 mins",
      servingSize: "1 person",
      available: true,
      featured: false,
    },
  ],
  // Lisa's Bake House (Cook Profile 6)
  [
    {
      name: "Custom Birthday Cake",
      description: "Personalized birthday cake with your choice of flavor and custom decoration.",
      price: 1200,
      category: "dessert",
      image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop",
      ingredients: ["flour", "eggs", "butter", "sugar", "vanilla", "cream", "food coloring"],
      allergens: ["gluten", "dairy", "eggs"],
      dietaryInfo: ["vegetarian"],
      cookingTime: "3 hours",
      servingSize: "8-10 people",
      available: true,
      featured: true,
    },
    {
      name: "Artisan Sourdough Bread",
      description: "Freshly baked sourdough bread with a perfect crust and tangy flavor.",
      price: 150,
      category: "appetizer",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
      ingredients: ["sourdough starter", "flour", "water", "salt"],
      allergens: ["gluten"],
      dietaryInfo: ["vegan"],
      cookingTime: "6 hours",
      servingSize: "4-6 people",
      available: true,
      featured: true,
    },
    {
      name: "Chocolate Chip Cookies",
      description: "Classic homemade cookies with premium chocolate chips. Soft and chewy.",
      price: 80,
      category: "snack",
      image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop",
      ingredients: ["flour", "butter", "brown sugar", "chocolate chips", "eggs", "vanilla"],
      allergens: ["gluten", "dairy", "eggs"],
      dietaryInfo: ["vegetarian"],
      cookingTime: "25 mins",
      servingSize: "6-8 cookies",
      available: true,
      featured: false,
    },
  ],
  // Yuki's Japanese Kitchen (Cook Profile 7)
  [
    {
      name: "Fresh Sushi Platter",
      description: "Assorted fresh sushi with salmon, tuna, and vegetables. Served with wasabi and ginger.",
      price: 650,
      category: "main-course",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop",
      ingredients: ["sushi rice", "nori", "salmon", "tuna", "cucumber", "avocado", "wasabi"],
      allergens: ["fish"],
      dietaryInfo: ["gluten-free"],
      cookingTime: "45 mins",
      servingSize: "2 people",
      available: true,
      featured: true,
    },
    {
      name: "Tonkotsu Ramen",
      description: "Rich pork bone broth ramen with tender chashu, egg, and fresh vegetables.",
      price: 420,
      category: "main-course",
      image: "https://images.unsplash.com/photo-1617756027203-4a7f39b4e006?w=400&h=300&fit=crop",
      ingredients: ["ramen noodles", "pork bones", "chashu", "egg", "nori", "spring onions", "bamboo shoots"],
      allergens: ["gluten", "eggs"],
      dietaryInfo: [],
      cookingTime: "12 hours",
      servingSize: "1 person",
      available: true,
      featured: true,
    },
    {
      name: "Miso Soup",
      description: "Traditional Japanese soup with miso paste, tofu, and wakame seaweed.",
      price: 100,
      category: "appetizer",
      image: "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=400&h=300&fit=crop",
      ingredients: ["miso paste", "tofu", "wakame", "dashi", "spring onions"],
      allergens: ["soy"],
      dietaryInfo: ["vegetarian", "gluten-free"],
      cookingTime: "15 mins",
      servingSize: "1-2 people",
      available: true,
      featured: false,
    },
  ],
];

export async function POST() {
  try {
    await connectDB();

    // Clear existing data
    await MenuItem.deleteMany({});
    await CookProfile.deleteMany({});
    await User.deleteMany({ role: 'cook' });

    // Insert users first
    const users = await User.insertMany(sampleUsers);
    console.log(`Created ${users.length} users`);

    // Create cook profiles with user references
    const cookProfilesWithUserId = sampleCookProfiles.map((profile, index) => ({
      ...profile,
      userId: users[index]._id,
      kycDetails: {
        verified: false,
      },
      kitchenDetails: {
        kitchenPhotos: [],
        storagePhotos: [],
        utensilsPhotos: [],
        hygieneChecklist: {
          cleanKitchen: false,
          properStorage: false,
          qualityUtensils: false,
          handwashStation: false,
          wasteManagement: false,
        },
        verified: false,
      },
      licenses: {
        otherCertifications: [],
      },
    }));

    const cookProfiles = await CookProfile.insertMany(cookProfilesWithUserId);
    console.log(`Created ${cookProfiles.length} cook profiles`);

    // Create menu items with cook profile references
    let totalMenuItems = 0;
    for (let i = 0; i < cookProfiles.length; i++) {
      const cookProfile = cookProfiles[i];
      const menuItemsForCook = sampleMenuItems[i];
      
      const menuItemsWithCookId = menuItemsForCook.map(item => ({
        ...item,
        cookProfileId: cookProfile._id,
      }));

      const createdMenuItems = await MenuItem.insertMany(menuItemsWithCookId);
      totalMenuItems += createdMenuItems.length;
      console.log(`Created ${createdMenuItems.length} menu items for ${cookProfile.businessName}`);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${users.length} users, ${cookProfiles.length} cook profiles, and ${totalMenuItems} menu items`,
      data: { 
        users: users.length, 
        cookProfiles: cookProfiles.length,
        menuItems: totalMenuItems
      },
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
