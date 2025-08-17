'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  profileImage: string;
  preferences: {
    cuisine: string[];
    dietaryRestrictions: string[];
  };
  orderHistory: {
    totalOrders: number;
    favoriteRestaurants: string[];
  };
}

export default function UserProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profileData, setProfileData] = useState<UserProfileData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    profileImage: '',
    preferences: {
      cuisine: [],
      dietaryRestrictions: []
    },
    orderHistory: {
      totalOrders: 0,
      favoriteRestaurants: []
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || (session.user as any)?.role !== 'user') {
      router.push('/auth/login');
      return;
    }

    // Load profile data
    loadProfileData();
  }, [session, status, router]);

  const loadProfileData = async () => {
    try {
      // Simulate loading profile data
      setTimeout(() => {
        setProfileData({
          name: (session?.user as any)?.name || '',
          email: (session?.user as any)?.email || '',
          phone: '+91 9876543210',
          address: '123 Main Street, Connaught Place, New Delhi',
          profileImage: '',
          preferences: {
            cuisine: ['North Indian', 'Italian', 'Chinese'],
            dietaryRestrictions: ['Vegetarian']
          },
          orderHistory: {
            totalOrders: 24,
            favoriteRestaurants: ["Priya's Kitchen", "Marco's Pasta Corner"]
          }
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading profile:', error);
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate saving
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-ink-light">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== 'user') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow-soft mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-400 rounded-full flex items-center justify-center text-2xl font-bold text-ink">
                {profileData.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-ink">{profileData.name}</h1>
                <p className="text-ink-light">{profileData.email}</p>
                <p className="text-sm text-ink-lighter">
                  Member since {new Date().getFullYear()} • {profileData.orderHistory.totalOrders} orders
                </p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`btn-primary px-6 py-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-soft mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'personal', label: 'Personal Info', icon: '👤' },
                { id: 'preferences', label: 'Food Preferences', icon: '🍽️' },
                { id: 'orders', label: 'Order History', icon: '📦' },
                { id: 'addresses', label: 'Addresses', icon: '📍' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-ink-light hover:text-ink hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-ink mb-4">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
                      disabled
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">Date of Birth</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Address</label>
                  <textarea
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Your complete address..."
                  />
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-ink mb-4">Food Preferences</h2>
                
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Favorite Cuisines</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profileData.preferences.cuisine.map((item, index) => (
                      <span key={index} className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {item}
                        <button
                          onClick={() => {
                            const newCuisine = profileData.preferences.cuisine.filter((_, i) => i !== index);
                            setProfileData({
                              ...profileData,
                              preferences: { ...profileData.preferences, cuisine: newCuisine }
                            });
                          }}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add favorite cuisine and press Enter"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const value = e.currentTarget.value.trim();
                        if (value && !profileData.preferences.cuisine.includes(value)) {
                          setProfileData({
                            ...profileData,
                            preferences: {
                              ...profileData.preferences,
                              cuisine: [...profileData.preferences.cuisine, value]
                            }
                          });
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Dietary Restrictions</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profileData.preferences.dietaryRestrictions.map((item, index) => (
                      <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        {item}
                        <button
                          onClick={() => {
                            const newRestrictions = profileData.preferences.dietaryRestrictions.filter((_, i) => i !== index);
                            setProfileData({
                              ...profileData,
                              preferences: { ...profileData.preferences, dietaryRestrictions: newRestrictions }
                            });
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Add dietary restriction and press Enter"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const value = e.currentTarget.value.trim();
                        if (value && !profileData.preferences.dietaryRestrictions.includes(value)) {
                          setProfileData({
                            ...profileData,
                            preferences: {
                              ...profileData.preferences,
                              dietaryRestrictions: [...profileData.preferences.dietaryRestrictions, value]
                            }
                          });
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">Why share your preferences?</h4>
                  <ul className="text-sm text-yellow-600 space-y-1">
                    <li>• Get personalized food recommendations</li>
                    <li>• Filter menus based on dietary needs</li>
                    <li>• Discover new cooks that match your taste</li>
                    <li>• Receive special offers on preferred cuisines</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-ink">Order History</h2>
                  <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                    {profileData.orderHistory.totalOrders} Total Orders
                  </span>
                </div>

                {/* Recent Orders */}
                <div className="space-y-4">
                  {[
                    { id: '#12453', cook: "Priya's Kitchen", items: 'Butter Chicken, Naan x2', amount: '₹450', status: 'Delivered', date: '2 days ago', rating: 5 },
                    { id: '#12441', cook: "Marco's Pasta Corner", items: 'Pasta Alfredo, Garlic Bread', amount: '₹320', status: 'Delivered', date: '1 week ago', rating: 4 },
                    { id: '#12435', cook: "Liu's Authentic Chinese", items: 'Fried Rice, Spring Rolls', amount: '₹380', status: 'Delivered', date: '2 weeks ago', rating: 5 }
                  ].map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-soft transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-ink">{order.id}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <span className="text-sm text-ink-lighter">{order.date}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-ink mb-1">{order.cook}</p>
                          <p className="text-sm text-ink-light">{order.items}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            {[...Array(order.rating)].map((_, i) => (
                              <span key={i} className="text-yellow-400">★</span>
                            ))}
                            {[...Array(5 - order.rating)].map((_, i) => (
                              <span key={i} className="text-gray-300">★</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-ink">{order.amount}</p>
                          <button className="text-primary-500 text-sm hover:text-primary-600 mt-1">
                            Reorder
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <button className="btn-outline px-6 py-2">
                    View All Orders
                  </button>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-ink">Saved Addresses</h2>
                  <button className="btn-primary px-4 py-2">
                    Add New Address
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 1, label: 'Home', address: '123 Main Street, Connaught Place, New Delhi', isDefault: true },
                    { id: 2, label: 'Office', address: '456 Business District, Gurgaon, Haryana', isDefault: false }
                  ].map((address) => (
                    <div key={address.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-ink">{address.label}</span>
                          {address.isDefault && (
                            <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-primary-500 text-sm hover:text-primary-600">
                            Edit
                          </button>
                          <button className="text-red-500 text-sm hover:text-red-600">
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-ink-light">{address.address}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
