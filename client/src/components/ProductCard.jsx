import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart } from 'lucide-react';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/authSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { wishlist, user } = useSelector((state) => state.auth);

  // default to first weight option
  const [selectedWeight, setSelectedWeight] = useState(product.weightOptions?.[0] || '1kg');

  const inWishlist = wishlist.some(item => item._id === product._id);

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to save items to your wishlist!');
      return;
    }
    dispatch(toggleWishlist({ product, inWishlist }));
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    const finalPrice = getWeightPrice(product.price, selectedWeight);
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      price: finalPrice,
      image: product.image,
      quantity: 1,
      weight: selectedWeight
    }));
  };

  // Calculate pricing factor for weight pills display (simulated multiplier)
  const getWeightPrice = (basePrice, weight) => {
    let multiplier = 1;
    if (weight === '250g') multiplier = 0.3;
    else if (weight === '500g') multiplier = 0.55;
    else if (weight === '1L' || weight === '1 L') multiplier = 1;
    else if (weight === '2L') multiplier = 1.9;
    return Math.round(basePrice * multiplier);
  };

  return (
    <div className="bg-white rounded-lg border border-srd-gold/15 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group overflow-hidden relative">
      
      {/* Wishlist toggle button */}
      <button 
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-colors text-srd-maroon hover:text-red-500"
      >
        <Heart size={18} fill={inWishlist ? '#ef4444' : 'none'} className={inWishlist ? 'text-red-500' : ''} />
      </button>

      {/* Product Image Link wrapped in Traditional Dome Arch */}
      <Link to={`/products/${product._id}`} className="p-4 flex justify-center bg-srd-cream/20">
        <div className="w-full aspect-[4/3] overflow-hidden border-2 border-srd-gold/20 arch-card-img bg-srd-cream/50 relative">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = `https://placehold.co/400x300/fffdf6/6b0c16?text=${encodeURIComponent(product.name)}`;
            }}
          />
        </div>
      </Link>

      {/* Product Information details */}
      <div className="px-5 pb-5 flex flex-col flex-grow text-center font-body">
        {/* Name in English & Gujarati */}
        <Link to={`/products/${product._id}`} className="hover:text-srd-orange transition-colors">
          <h4 className="font-title font-bold text-lg text-srd-maroon tracking-tight line-clamp-1">{product.name}</h4>
          {product.gujaratiName && (
            <p className="text-sm font-semibold text-srd-gold font-body leading-none mt-1 mb-2">{product.gujaratiName}</p>
          )}
        </Link>

        {/* Pricing */}
        <div className="mb-4">
          <span className="text-xl font-bold text-srd-dark">
            ₹{getWeightPrice(product.price, selectedWeight)}
          </span>
          <span className="text-xs text-gray-500 ml-1">for {selectedWeight}</span>
        </div>

        {/* Weight option selectors (pills) */}
        <div className="flex justify-center gap-1.5 mb-5 flex-wrap">
          {product.weightOptions?.map((weight) => (
            <button
              key={weight}
              onClick={(e) => { e.preventDefault(); setSelectedWeight(weight); }}
              className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-all ${
                selectedWeight === weight
                  ? 'bg-srd-gold border-srd-gold text-srd-maroon shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-srd-gold/50'
              }`}
            >
              {weight}
            </button>
          ))}
        </div>

        {/* Add to Cart button */}
        <button 
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`w-full py-3 rounded-md font-bold text-sm tracking-wider uppercase shadow-sm transition-all duration-300 mt-auto ${
            product.stock > 0
              ? 'bg-srd-gold hover:bg-srd-orange text-srd-maroon hover:text-white hover:shadow-md active:translate-y-0.5'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {product.stock > 0 ? 'Add To Cart' : 'Sold Out'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
