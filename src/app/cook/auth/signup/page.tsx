'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CookSignupPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    
    // Business Info
    businessName: '',
    description: '',
    location: '',
    cuisine: [] as string[],
    specialties: [] as string[],
    priceRange: '',
    deliveryTime: '',
    
    // Availability
    availableDays: [] as string[],
    startTime: '',
    endTime: '',
    
    // Agreement
    agreeToTerms: false,
    agreeToVerification: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();

  const cuisineOptions = [
    'Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Japanese',
    'American', 'Continental', 'South Indian', 'North Indian',
    'Mediterranean', 'Lebanese', 'Korean', 'Vietnamese'
  ];

  const daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 'thursday', 
    'friday', 'saturday', 'sunday'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleArrayChange = (name: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked 
        ? [...(prev[name as keyof typeof prev] as string[]), value]
        : (prev[name as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const validateStep = (currentStep: number) => {
    setError('');
    
    switch (currentStep) {
      case 1:
        if (!formData.name || !formData.email || !formData.password || !formData.phone) {
          setError('Please fill in all required fields');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          return false;
        }
        break;
        
      case 2:
        if (!formData.businessName || !formData.description || !formData.location || 
            formData.cuisine.length === 0 || !formData.priceRange || !formData.deliveryTime) {
          setError('Please fill in all required fields');
          return false;
        }
        break;
        
      case 3:
        if (formData.availableDays.length === 0 || !formData.startTime || !formData.endTime) {
          setError('Please set your availability');
          return false;
        }
        if (!formData.agreeToTerms || !formData.agreeToVerification) {
          setError('Please agree to the terms and verification process');
          return false;
        }
        break;
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    setLoading(true);
    setError('');

    try {
      // Create user account first
      const userResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'cook',
          phone: formData.phone,
        }),
      });

      const userData = await userResponse.json();

      if (!userData.success) {
        setError(userData.error || 'Failed to create account');
        return;
      }

      // Sign in the user
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError('Account created but failed to sign in. Please try logging in.');
        return;
      }

      // Create cook profile
      const cookProfileResponse = await fetch('/api/cook/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData.user._id,
          businessName: formData.businessName,
          description: formData.description,
          cuisine: formData.cuisine,
          specialties: formData.specialties,
          location: formData.location,
          priceRange: formData.priceRange,
          deliveryTime: formData.deliveryTime,
          availability: {
            days: formData.availableDays,
            hours: {
              start: formData.startTime,
              end: formData.endTime,
            },
          },
        }),
      });

      const cookData = await cookProfileResponse.json();

      if (cookData.success) {
        router.push('/cook/onboarding');
      } else {
        setError('Account created but failed to set up cook profile. Please complete your profile later.');
        router.push('/cook/dashboard');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-ink mb-4">Personal Information</h3>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-ink mb-1">
          Full Name *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          placeholder="Enter your full name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink mb-1">
          Email Address *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-ink mb-1">
          Phone Number *
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          placeholder="Enter your phone number"
        />
      </div>
      
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-ink mb-1">
          Password *
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          placeholder="Create a password (min 6 characters)"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink mb-1">
          Confirm Password *
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          placeholder="Confirm your password"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-ink mb-4">Business Information</h3>
      
      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-ink mb-1">
          Business/Kitchen Name *
        </label>
        <input
          id="businessName"
          name="businessName"
          type="text"
          required
          value={formData.businessName}
          onChange={handleChange}
          className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          placeholder="e.g., Priya's Kitchen, Maria's Italian Corner"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-ink mb-1">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent resize-none"
          placeholder="Tell customers about your cooking style, experience, and specialties..."
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-ink mb-1">
          Location *
        </label>
        <input
          id="location"
          name="location"
          type="text"
          required
          value={formData.location}
          onChange={handleChange}
          className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          placeholder="e.g., Connaught Place, Delhi"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-2">
          Cuisine Types * (Select at least one)
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-300 rounded-xl p-3">
          {cuisineOptions.map((cuisine) => (
            <label key={cuisine} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.cuisine.includes(cuisine)}
                onChange={(e) => handleArrayChange('cuisine', cuisine, e.target.checked)}
                className="rounded border-gray-300 text-primary-400 focus:ring-primary-400"
              />
              <span className="text-sm">{cuisine}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="priceRange" className="block text-sm font-medium text-ink mb-1">
            Price Range *
          </label>
          <select
            id="priceRange"
            name="priceRange"
            required
            value={formData.priceRange}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          >
            <option value="">Select range</option>
            <option value="$">$ (Budget-friendly)</option>
            <option value="$$">$$ (Moderate)</option>
            <option value="$$$">$$$ (Premium)</option>
            <option value="$$$$">$$$$ (Luxury)</option>
          </select>
        </div>

        <div>
          <label htmlFor="deliveryTime" className="block text-sm font-medium text-ink mb-1">
            Delivery Time *
          </label>
          <input
            id="deliveryTime"
            name="deliveryTime"
            type="text"
            required
            value={formData.deliveryTime}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
            placeholder="e.g., 30-45 mins"
          />
        </div>
      </div>

      <div>
        <label htmlFor="specialties" className="block text-sm font-medium text-ink mb-1">
          Specialties (Optional)
        </label>
        <input
          id="specialties"
          name="specialties"
          type="text"
          value={formData.specialties.join(', ')}
          onChange={(e) => setFormData({...formData, specialties: e.target.value.split(', ').filter(s => s.trim())})}
          className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          placeholder="e.g., Butter Chicken, Homemade Pasta, Fresh Bread"
        />
        <p className="text-xs text-ink-lighter mt-1">Separate multiple specialties with commas</p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-ink mb-4">Availability & Terms</h3>
      
      <div>
        <label className="block text-sm font-medium text-ink mb-2">
          Available Days * (Select at least one)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {daysOfWeek.map((day) => (
            <label key={day} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.availableDays.includes(day)}
                onChange={(e) => handleArrayChange('availableDays', day, e.target.checked)}
                className="rounded border-gray-300 text-primary-400 focus:ring-primary-400"
              />
              <span className="text-sm capitalize">{day}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-ink mb-1">
            Start Time *
          </label>
          <input
            id="startTime"
            name="startTime"
            type="time"
            required
            value={formData.startTime}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-ink mb-1">
            End Time *
          </label>
          <input
            id="endTime"
            name="endTime"
            type="time"
            required
            value={formData.endTime}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <h4 className="font-medium text-ink mb-2">📋 Next Steps After Signup:</h4>
        <ul className="text-sm text-ink-light space-y-1">
          <li>• Complete KYC verification (ID & address proof)</li>
          <li>• Upload kitchen photos for hygiene verification</li>
          <li>• Submit FSSAI license (recommended)</li>
          <li>• Get approved and receive your verified badge</li>
        </ul>
      </div>

      <div className="space-y-3">
        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            className="mt-1 rounded border-gray-300 text-primary-400 focus:ring-primary-400"
          />
          <span className="text-sm text-ink-light">
            I agree to the{' '}
            <Link href="/terms" className="text-primary-500 hover:text-primary-600">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary-500 hover:text-primary-600">
              Privacy Policy
            </Link>
          </span>
        </label>

        <label className="flex items-start space-x-3">
          <input
            type="checkbox"
            name="agreeToVerification"
            checked={formData.agreeToVerification}
            onChange={handleChange}
            className="mt-1 rounded border-gray-300 text-primary-400 focus:ring-primary-400"
          />
          <span className="text-sm text-ink-light">
            I understand that my account will be subject to verification including KYC, kitchen hygiene check, and license validation before I can start accepting orders.
          </span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="bg-primary-400 p-3 rounded-full">
              <span className="text-4xl">👨‍🍳</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-ink">
            Join as Home Cook
          </h2>
          <p className="mt-2 text-ink-light">
            Start your home cooking business and connect with food lovers
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber
                      ? 'bg-primary-400 text-ink'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      step > stepNumber ? 'bg-primary-400' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-soft-lg">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="btn-outline px-6 py-2"
                disabled={loading}
              >
                Back
              </button>
            )}
            
            <div className="ml-auto">
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-primary px-6 py-2"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Complete Registration'}
                </button>
              )}
            </div>
          </div>

          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-ink-light">
              Already have a cook account?{' '}
              <Link href="/cook/auth/login" className="text-primary-500 hover:text-primary-600 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}