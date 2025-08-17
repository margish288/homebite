'use client';

import { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import CategoriesSection from '@/components/CategoriesSection';
import PopularCooks from '@/components/PopularRestaurants';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory('');
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  return (
    <div>
      <HeroSection onSearch={handleSearch} />
      <CategoriesSection onCategorySelect={handleCategorySelect} />
      <PopularCooks 
        searchQuery={searchQuery} 
        selectedCategory={selectedCategory} 
      />
    </div>
  );
}
