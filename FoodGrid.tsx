import React, { useState } from 'react';
import { FoodItem } from '../types';
import { CATEGORIES } from '../constants';

interface FoodGridProps {
  items: FoodItem[];
  addToCart: (item: FoodItem) => void;
}

const FoodGrid: React.FC<FoodGridProps> = ({ items, addToCart }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Search & Categories */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text"
            placeholder="Search favorites..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
        <div className="flex overflow-x-auto space-x-2 pb-2 md:pb-0 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                activeCategory === cat 
                  ? 'bg-rose-500 text-white shadow-md' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-rose-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all group flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-rose-600 flex items-center">
                <i className="fas fa-star mr-1"></i> {item.rating}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                <span className="text-rose-600 font-bold">${item.price.toFixed(2)}</span>
              </div>
              <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map(t => (
                  <span key={t} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                    {t}
                  </span>
                ))}
              </div>
              <button 
                onClick={() => addToCart(item)}
                className="w-full py-2.5 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-colors flex items-center justify-center space-x-2 active:scale-95"
              >
                <i className="fas fa-plus-circle"></i>
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="text-center py-20">
          <div className="text-slate-300 text-5xl mb-4">
            <i className="fas fa-pizza-slice"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-700">No dishes found</h3>
          <p className="text-slate-500">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default FoodGrid;
