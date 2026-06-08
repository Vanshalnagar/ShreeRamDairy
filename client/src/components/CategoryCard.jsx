import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  return (
    <Link 
      to={`/products?category=${category.slug}`}
      className="relative w-full aspect-[4/3] rounded-2xl border-2 border-srd-gold/30 hover:border-srd-orange shadow-sm hover:shadow-md overflow-hidden group block transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Category Image */}
      <img 
        src={category.image} 
        alt={category.name} 
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        onError={(e) => {
          e.target.src = `https://placehold.co/400x300/fffdf6/6b0c16?text=${encodeURIComponent(category.name)}`;
        }}
      />
      
      {/* Dim Overlay */}
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-350"></div>

      {/* Category Label Overlaid on Top Center */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-2 border-2 border-srd-gold rounded-full shadow-md transition-all duration-300 group-hover:border-srd-orange z-10">
        <span className="font-title font-bold text-xs md:text-sm text-srd-maroon tracking-wider uppercase whitespace-nowrap block">
          {category.name}
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;
