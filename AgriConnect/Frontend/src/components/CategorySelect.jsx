import React from 'react';

export const CATEGORIES = [
  {
    id: 'all',
    label: 'All Products',
    emoji: '🛒',
    description: 'Browse everything available',
    color: 'from-green-500 to-emerald-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    keywords: [],
  },
  {
    id: 'vegetables',
    label: 'Vegetables',
    emoji: '🥦',
    description: 'Fresh farm vegetables',
    color: 'from-green-400 to-lime-500',
    bg: 'bg-lime-50',
    border: 'border-lime-200',
    keywords: ['tomato', 'potato', 'onion', 'carrot', 'cabbage', 'brinjal', 'spinach', 'cauliflower', 'peas', 'beans', 'garlic', 'ginger', 'bitter gourd', 'ladyfinger', 'okra', 'capsicum', 'vegetable', 'sabzi'],
  },
  {
    id: 'fruits',
    label: 'Fruits',
    emoji: '🍎',
    description: 'Seasonal & exotic fruits',
    color: 'from-red-400 to-orange-500',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    keywords: ['mango', 'banana', 'apple', 'orange', 'guava', 'papaya', 'grapes', 'pomegranate', 'lemon', 'watermelon', 'pineapple', 'fruit', 'aam', 'kela'],
  },
  {
    id: 'grains',
    label: 'Grains & Pulses',
    emoji: '🌾',
    description: 'Rice, wheat, dal & more',
    color: 'from-yellow-500 to-amber-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    keywords: ['rice', 'wheat', 'dal', 'lentil', 'maize', 'corn', 'jowar', 'bajra', 'gram', 'chana', 'moong', 'urad', 'toor', 'grain', 'flour', 'atta', 'pulse'],
  },
  {
    id: 'dairy',
    label: 'Dairy & Poultry',
    emoji: '🥛',
    description: 'Milk, eggs & dairy products',
    color: 'from-blue-300 to-sky-500',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    keywords: ['milk', 'egg', 'ghee', 'butter', 'paneer', 'curd', 'yogurt', 'cheese', 'dairy', 'poultry', 'chicken', 'doodh'],
  },
  {
    id: 'spices',
    label: 'Spices & Herbs',
    emoji: '🌶️',
    description: 'Aromatic spices & herbs',
    color: 'from-red-500 to-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    keywords: ['chili', 'chilli', 'turmeric', 'coriander', 'cumin', 'pepper', 'clove', 'cardamom', 'cinnamon', 'spice', 'herb', 'haldi', 'mirch', 'jeera', 'masala', 'saffron'],
  },
  {
    id: 'oilseeds',
    label: 'Oilseeds & Oils',
    emoji: '🫒',
    description: 'Mustard, groundnut & oils',
    color: 'from-yellow-400 to-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-amber-200',
    keywords: ['mustard', 'groundnut', 'soybean', 'sunflower', 'oil', 'sesame', 'til', 'sarso', 'moongfali', 'coconut'],
  },
  {
    id: 'organic',
    label: 'Organic Products',
    emoji: '🌿',
    description: 'Certified organic produce',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    keywords: ['organic', 'natural', 'bio', 'chemical free', 'pesticide free'],
  },
];

/**
 * Detect category of a product based on its title/description keywords
 */
export function detectCategory(product) {
  const text = `${product.title || ''} ${product.description || ''}`.toLowerCase();
  for (const cat of CATEGORIES) {
    if (cat.id === 'all') continue;
    if (cat.keywords.some((kw) => text.includes(kw))) {
      return cat.id;
    }
  }
  return 'other';
}

function CategorySelect({ onSelectCategory }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 flex flex-col items-center justify-start pt-10 pb-16 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-green-200 text-sm font-medium mb-4 border border-white/20">
          🌾 AgriConnect Marketplace
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
          What are you looking for?
        </h1>
        <p className="text-green-200 text-lg max-w-xl mx-auto">
          Choose a category to browse fresh produce directly from farmers near you.
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-5xl">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat)}
            className={`group relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 ${cat.bg} ${cat.border} 
              shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 
              focus:outline-none focus:ring-4 focus:ring-white/30 cursor-pointer`}
          >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

            {/* Emoji */}
            <span className="text-5xl transition-transform duration-300 group-hover:scale-110 drop-shadow-md">
              {cat.emoji}
            </span>

            {/* Label */}
            <div className="text-center z-10">
              <p className="font-bold text-gray-800 text-base leading-tight">{cat.label}</p>
              <p className="text-gray-500 text-xs mt-1">{cat.description}</p>
            </div>

            {/* Arrow indicator on hover */}
            <div className="absolute bottom-2 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-gray-400 text-xs">→</span>
            </div>
          </button>
        ))}
      </div>

      {/* Footer Note */}
      <p className="text-green-300/60 text-sm mt-10">
        🚜 Fresh produce sourced directly from verified farmers
      </p>
    </div>
  );
}

export default CategorySelect;
