'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AddMenuItemForm from '@/components/AddMenuItemForm';
import MenuList from '@/components/MenuList';
import { IMenuItem } from '@/models/MenuItem';

interface CookProfileData {
  // User basic info
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  
  // Business info
  businessName: string;
  description: string;
  location: string;
  cuisine: string[];
  specialties: string[];
  priceRange: string;
  deliveryTime: string;
  
  // Availability
  availability: {
    days: string[];
    hours: {
      start: string;
      end: string;
    };
  };
  
  // Verification status
  verificationStatus: string;
  verifiedBadge: boolean;
}

export default function CookProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profileData, setProfileData] = useState<CookProfileData>({
    name: '',
    email: '',
    phone: '',
    profileImage: '',
    businessName: '',
    description: '',
    location: '',
    cuisine: [],
    specialties: [],
    priceRange: '$',
    deliveryTime: '',
    availability: {
      days: [],
      hours: { start: '', end: '' }
    },
    verificationStatus: 'pending',
    verifiedBadge: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [showAddMenuForm, setShowAddMenuForm] = useState(false);
  const [menuRefreshTrigger, setMenuRefreshTrigger] = useState(0);
  const [cookProfileId, setCookProfileId] = useState<string>('');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user.role !== 'cook') {
      router.push('/cook/auth/login');
      return;
    }

    // Load profile data
    loadProfileData();
  }, [session, status, router]);

  const loadProfileData = async () => {
    try {
      // For now, simulate loading profile data and use a mock cookProfileId
      // In real implementation, this would fetch the actual cook profile
      const mockCookProfileId = '672a1234567890abcdef1234'; // This should come from API
      setCookProfileId(mockCookProfileId);
      
      setTimeout(() => {
        setProfileData({
          name: session?.user.name || '',
          email: session?.user.email || '',
          phone: '+91 9876543210',
          profileImage: '',
          businessName: "Priya's Kitchen",
          description: 'Authentic North Indian homestyle cooking with love and traditional recipes passed down through generations.',
          location: 'Connaught Place, New Delhi',
          cuisine: ['North Indian', 'Punjabi', 'Vegetarian'],
          specialties: ['Butter Chicken', 'Dal Makhani', 'Fresh Naan'],
          priceRange: '$$',
          deliveryTime: '30-45 mins',
          availability: {
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
            hours: { start: '10:00', end: '22:00' }
          },
          verificationStatus: 'approved',
          verifiedBadge: true
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

  const handleMenuItemAdded = (menuItem: IMenuItem) => {
    setShowAddMenuForm(false);
    setMenuRefreshTrigger(prev => prev + 1);
  };

  const handleMenuItemEdit = (menuItem: IMenuItem) => {
    // For now, just show an alert. You can implement edit functionality later
    alert(`Edit functionality for "${menuItem.name}" coming soon!`);
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

  if (!session || session.user.role !== 'cook') {
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
                <h1 className="text-2xl font-bold text-ink flex items-center gap-2">
                  {profileData.businessName}
                  {profileData.verifiedBadge && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      ✓ Verified
                    </span>
                  )}
                </h1>
                <p className="text-ink-light">{profileData.name} • {profileData.location}</p>
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
                { id: 'basic', label: 'Basic Info', icon: '👤' },
                { id: 'business', label: 'Business', icon: '🏪' },
                { id: 'menu', label: 'Menu & Pricing', icon: '🍽️' },
                { id: 'verification', label: 'Verification', icon: '✅' }
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
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-ink mb-4">Basic Information</h2>
                
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
                    <label className="block text-sm font-medium text-ink mb-2">Location</label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Business Tab */}
            {activeTab === 'business' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-ink mb-4">Business Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Business Name</label>
                  <input
                    type="text"
                    value={profileData.businessName}
                    onChange={(e) => setProfileData({...profileData, businessName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Description</label>
                  <textarea
                    value={profileData.description}
                    onChange={(e) => setProfileData({...profileData, description: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="Tell customers about your cooking style and specialties..."
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">Price Range</label>
                    <select
                      value={profileData.priceRange}
                      onChange={(e) => setProfileData({...profileData, priceRange: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    >
                      <option value="$">$ - Budget Friendly</option>
                      <option value="$$">$$ - Moderate</option>
                      <option value="$$$">$$$ - Premium</option>
                      <option value="$$$$">$$$$ - Luxury</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">Delivery Time</label>
                    <input
                      type="text"
                      value={profileData.deliveryTime}
                      onChange={(e) => setProfileData({...profileData, deliveryTime: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                      placeholder="e.g., 30-45 mins"
                    />
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">Available Days</label>
                  <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                      <label key={day} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profileData.availability.days.includes(day)}
                          onChange={(e) => {
                            const days = e.target.checked
                              ? [...profileData.availability.days, day]
                              : profileData.availability.days.filter(d => d !== day);
                            setProfileData({
                              ...profileData,
                              availability: { ...profileData.availability, days }
                            });
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-ink capitalize">{day.slice(0, 3)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">Start Time</label>
                    <input
                      type="time"
                      value={profileData.availability.hours.start}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        availability: {
                          ...profileData.availability,
                          hours: { ...profileData.availability.hours, start: e.target.value }
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-ink mb-2">End Time</label>
                    <input
                      type="time"
                      value={profileData.availability.hours.end}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        availability: {
                          ...profileData.availability,
                          hours: { ...profileData.availability.hours, end: e.target.value }
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Menu & Pricing Tab */}
            {activeTab === 'menu' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-ink">Menu Management</h2>
                  <button
                    onClick={() => setShowAddMenuForm(!showAddMenuForm)}
                    className="btn-primary px-4 py-2"
                  >
                    {showAddMenuForm ? 'Cancel' : '+ Add Menu Item'}
                  </button>
                </div>

                {/* Add Menu Item Form */}
                {showAddMenuForm && cookProfileId && (
                  <AddMenuItemForm
                    cookProfileId={cookProfileId}
                    onMenuItemAdded={handleMenuItemAdded}
                    onCancel={() => setShowAddMenuForm(false)}
                  />
                )}

                {/* Menu Items List */}
                {cookProfileId && (
                  <MenuList
                    cookProfileId={cookProfileId}
                    showActions={true}
                    onEdit={handleMenuItemEdit}
                    refreshTrigger={menuRefreshTrigger}
                  />
                )}

                {/* Cuisine Types & Specialties - Moved to a collapsed section */}
                <div className="border-t pt-6">
                  <details className="group">
                    <summary className="cursor-pointer text-lg font-medium text-ink mb-4 flex items-center">
                      <span>Cuisine Types & Specialties</span>
                      <span className="ml-2 transform group-open:rotate-90 transition-transform">▶</span>
                    </summary>
                    
                    <div className="space-y-4 pl-4">
                      <div>
                        <label className="block text-sm font-medium text-ink mb-2">Cuisine Types</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {profileData.cuisine.map((item, index) => (
                            <span key={index} className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                              {item}
                              <button
                                onClick={() => {
                                  const newCuisine = profileData.cuisine.filter((_, i) => i !== index);
                                  setProfileData({...profileData, cuisine: newCuisine});
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
                          placeholder="Add cuisine type and press Enter"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const value = e.currentTarget.value.trim();
                              if (value && !profileData.cuisine.includes(value)) {
                                setProfileData({...profileData, cuisine: [...profileData.cuisine, value]});
                                e.currentTarget.value = '';
                              }
                            }
                          }}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-ink mb-2">Signature Dishes</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {profileData.specialties.map((item, index) => (
                            <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                              {item}
                              <button
                                onClick={() => {
                                  const newSpecialties = profileData.specialties.filter((_, i) => i !== index);
                                  setProfileData({...profileData, specialties: newSpecialties});
                                }}
                                className="text-green-600 hover:text-green-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <input
                          type="text"
                          placeholder="Add specialty dish and press Enter"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const value = e.currentTarget.value.trim();
                              if (value && !profileData.specialties.includes(value)) {
                                setProfileData({...profileData, specialties: [...profileData.specialties, value]});
                                e.currentTarget.value = '';
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            )}

            {/* Verification Tab */}
            {activeTab === 'verification' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-ink mb-4">Verification Status</h2>
                
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-500 w-8 h-8 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-800">Verification Complete</h3>
                        <p className="text-sm text-green-600">Your profile has been verified and approved</p>
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                      Verified Cook
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-ink">KYC Documents</h4>
                      <span className="text-green-600 text-sm">✓ Verified</span>
                    </div>
                    <p className="text-sm text-ink-light">Identity and address verification completed</p>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-ink">Kitchen Hygiene</h4>
                      <span className="text-green-600 text-sm">✓ Approved</span>
                    </div>
                    <p className="text-sm text-ink-light">Kitchen photos and hygiene checklist approved</p>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-ink">FSSAI License</h4>
                      <span className="text-blue-600 text-sm">Optional</span>
                    </div>
                    <p className="text-sm text-ink-light">Food license not required for home cooking</p>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-ink">Background Check</h4>
                      <span className="text-green-600 text-sm">✓ Clear</span>
                    </div>
                    <p className="text-sm text-ink-light">Background verification completed</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Verification Benefits</h4>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• Verified badge on your profile</li>
                    <li>• Higher visibility in search results</li>
                    <li>• Increased customer trust</li>
                    <li>• Access to premium features</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
