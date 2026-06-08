import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, ShoppingBag, Plus, Minus, ShieldCheck, RefreshCw, Truck, MessageSquare, AlertCircle } from 'lucide-react';
import { fetchProductById, addProductReview, clearDetails } from '../store/slices/productsSlice';
import { addToCart } from '../store/slices/cartSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const { productDetails: product, reviews, loading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  // States
  const [selectedWeight, setSelectedWeight] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  // Fetch product on load
  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => {
      dispatch(clearDetails());
    };
  }, [dispatch, id]);

  // Set default weight when product loads
  useEffect(() => {
    if (product && product.weightOptions?.length > 0) {
      setSelectedWeight(product.weightOptions[0]);
    }
  }, [product]);

  const handleQtyChange = (type) => {
    if (type === 'inc') {
      setQuantity(prev => prev + 1);
    } else {
      setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    }
  };

  const getWeightPrice = (basePrice, weight) => {
    let multiplier = 1;
    if (weight === '250g') multiplier = 0.3;
    else if (weight === '500g') multiplier = 0.55;
    else if (weight === '1L' || weight === '1 L') multiplier = 1;
    else if (weight === '2L') multiplier = 1.9;
    return Math.round(basePrice * multiplier);
  };

  const handleAddToCart = () => {
    if (!product) return;
    const finalPrice = getWeightPrice(product.price, selectedWeight);
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      price: finalPrice,
      image: product.image,
      quantity,
      weight: selectedWeight
    }));
    alert(`${quantity} x ${product.name} (${selectedWeight}) added to your cart!`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!comment) {
      setReviewError('Review comment is required.');
      return;
    }

    try {
      await dispatch(addProductReview({
        productId: id,
        reviewData: { rating, comment }
      })).unwrap();
      setReviewSuccess('Review submitted successfully!');
      setComment('');
      setRating(5);
    } catch (err) {
      setReviewError(err || 'Failed to submit review.');
    }
  };

  if (loading && !product) {
    return (
      <div className="text-center py-24 text-gray-500 font-medium bg-srd-cream min-h-[70vh]">
        Preparing product details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-24 text-red-600 font-medium bg-srd-cream min-h-[70vh]">
        <AlertCircle className="mx-auto mb-4" size={40} />
        {error || 'Product details not found.'}
        <div className="mt-4">
          <Link to="/products" className="bg-srd-gold text-srd-maroon px-6 py-2.5 rounded-full font-bold text-sm shadow-md">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = getWeightPrice(product.price, selectedWeight);

  return (
    <div className="w-full bg-srd-cream py-12 px-6 md:px-12 font-body">
      <div className="max-w-6xl mx-auto bg-white p-6 md:p-10 rounded-3xl border border-srd-gold/15 shadow-sm">
        
        {/* Breadcrumb navigation */}
        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-8">
          <Link to="/" className="hover:text-srd-maroon">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-srd-maroon">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-srd-orange">{product.name}</span>
        </div>

        {/* Product image & order config */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          
          {/* LEFT COLUMN: Dome Arch Image */}
          <div className="p-4 bg-srd-cream/20 rounded-2xl border border-srd-gold/10">
            <div className="w-full aspect-square overflow-hidden border-4 border-srd-gold arch-card-img bg-srd-cream/45 relative shadow-md">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://placehold.co/600x600/fffdf6/6b0c16?text=${encodeURIComponent(product.name)}`;
                }}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Product details */}
          <div className="space-y-6">
            <div>
              {product.category && (
                <span className="text-xs font-bold uppercase text-srd-orange tracking-widest bg-srd-orange/10 px-3 py-1 rounded-full">
                  {product.category.name}
                </span>
              )}
              <h1 className="font-title font-bold text-3xl md:text-4xl text-srd-maroon mt-4 leading-tight">
                {product.name}
              </h1>
              {product.gujaratiName && (
                <p className="text-xl font-semibold text-srd-gold mt-1">{product.gujaratiName}</p>
              )}

              {/* Rating Summary */}
              <div className="flex items-center gap-1.5 mt-3">
                <div className="flex text-yellow-400">
                  <Star size={16} fill="currentColor" />
                </div>
                <span className="text-sm font-bold text-gray-700">
                  {product.rating?.toFixed(1) || '0.0'}
                </span>
                <span className="text-xs text-gray-400">({reviews.length} Customer Reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="border-y border-gray-100 py-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-srd-dark">₹{currentPrice}</span>
                <span className="text-sm text-gray-500 font-medium">for {selectedWeight}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">* GST (5%) calculated during checkout.</p>
            </div>

            {/* Weight Option Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2.5">Select Weight Options</label>
              <div className="flex gap-2 flex-wrap">
                {product.weightOptions?.map((weight) => (
                  <button
                    key={weight}
                    onClick={() => setSelectedWeight(weight)}
                    className={`px-4 py-2 text-sm font-bold rounded-full border transition-all ${
                      selectedWeight === weight
                        ? 'bg-srd-gold border-srd-gold text-srd-maroon shadow-md'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-srd-gold'
                    }`}
                  >
                    {weight}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector and Add to Cart */}
            <div className="flex items-center gap-4 pt-2 flex-wrap">
              <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
                <button 
                  onClick={() => handleQtyChange('dec')}
                  className="px-3.5 py-3 hover:bg-gray-50 text-gray-500 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="px-5 font-bold text-sm text-srd-dark">{quantity}</span>
                <button 
                  onClick={() => handleQtyChange('inc')}
                  className="px-3.5 py-3 hover:bg-gray-50 text-gray-500 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-grow md:flex-grow-0 md:px-12 py-3.5 rounded-lg font-bold text-sm tracking-wider uppercase shadow-md transition-all flex items-center justify-center gap-2 ${
                  product.stock > 0
                    ? 'bg-srd-gold hover:bg-srd-orange text-srd-maroon hover:text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingBag size={18} />
                {product.stock > 0 ? 'Add To Cart' : 'Out of Stock'}
              </button>
            </div>

            {/* Badges / Guarantees */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 text-center text-xs text-gray-500 font-semibold">
              <div className="flex flex-col items-center gap-1.5 p-2 bg-srd-cream/20 rounded-xl border border-srd-gold/5">
                <ShieldCheck size={20} className="text-srd-orange" />
                <span>100% Pure Ghee</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-2 bg-srd-cream/20 rounded-xl border border-srd-gold/5">
                <RefreshCw size={20} className="text-srd-orange" />
                <span>Daily Fresh</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-2 bg-srd-cream/20 rounded-xl border border-srd-gold/5">
                <Truck size={20} className="text-srd-orange" />
                <span>Express Delivery</span>
              </div>
            </div>

          </div>
        </div>

        {/* TABBED INTERFACE: Description / Ingredients / Reviews */}
        <div className="mt-16 border-t border-gray-100 pt-10">
          <div className="flex border-b border-gray-200 gap-8">
            {/* Description Tab button */}
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === 'description' 
                  ? 'border-srd-gold text-srd-maroon' 
                  : 'border-transparent text-gray-400 hover:text-srd-maroon'
              }`}
            >
              Description
            </button>
            
            {/* Reviews Tab button */}
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 ${
                activeTab === 'reviews' 
                  ? 'border-srd-gold text-srd-maroon' 
                  : 'border-transparent text-gray-400 hover:text-srd-maroon'
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          <div className="py-8">
            {/* Tab content 1: Description */}
            {activeTab === 'description' && (
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed max-w-4xl">
                <p>{product.description}</p>
                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-srd-gold/10 p-4 rounded-xl">
                    <h5 className="font-bold text-srd-maroon mb-2">Shelf Life</h5>
                    <p className="text-xs">Sweets are freshly made. Traditional milk sweets remain fresh for 2-3 days, dry fruit sweets for up to 15 days, and farsans up to 30 days under dry room conditions.</p>
                  </div>
                  <div className="border border-srd-gold/10 p-4 rounded-xl">
                    <h5 className="font-bold text-srd-maroon mb-2">Ingredients</h5>
                    <p className="text-xs">Premium quality raw materials, full cream pasteurized milk, pure cow ghee, sugar, cardamom, saffron threads, and handpicked dry fruits.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab content 2: Reviews */}
            {activeTab === 'reviews' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* Reviews List */}
                <div className="lg:col-span-7 space-y-6">
                  <h4 className="font-title font-bold text-lg text-srd-maroon mb-4">Customer Testimonials</h4>
                  {reviews.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No reviews submitted yet for this product. Be the first to share your thoughts!</p>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((rev) => (
                        <div key={rev._id} className="bg-srd-cream/10 p-5 rounded-2xl border border-srd-gold/10 shadow-sm relative">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-xs text-srd-maroon">{rev.user?.name || 'Anonymous customer'}</h5>
                            <span className="text-[10px] text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          {/* Stars */}
                          <div className="flex text-yellow-500 mb-3">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} size={12} fill="currentColor" />
                            ))}
                          </div>

                          <p className="text-sm text-gray-600 leading-relaxed italic">
                            "{rev.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Form */}
                <div className="lg:col-span-5 bg-srd-cream/20 p-6 rounded-2xl border border-srd-gold/10">
                  <h4 className="font-title font-bold text-lg text-srd-maroon mb-4">Add Your Review</h4>
                  
                  {!user ? (
                    <p className="text-sm text-gray-500">
                      Please{' '}
                      <Link to="/login" className="text-srd-orange hover:text-srd-maroon font-bold underline">
                        login
                      </Link>{' '}
                      to submit reviews and ratings.
                    </p>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      {reviewSuccess && (
                        <div className="bg-green-50 text-green-700 p-3 rounded-lg border border-green-200 text-xs">
                          {reviewSuccess}
                        </div>
                      )}
                      
                      {reviewError && (
                        <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 text-xs">
                          {reviewError}
                        </div>
                      )}

                      {/* Rating selection */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Rating (Stars)</label>
                        <select
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                          className="block w-full border border-gray-200 rounded-lg text-sm px-3 py-2 bg-white"
                        >
                          <option value={5}>5 Stars (Excellent)</option>
                          <option value={4}>4 Stars (Good)</option>
                          <option value={3}>3 Stars (Average)</option>
                          <option value={2}>2 Stars (Poor)</option>
                          <option value={1}>1 Star (Unacceptable)</option>
                        </select>
                      </div>

                      {/* Comment */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">Your Comments</label>
                        <textarea
                          rows={4}
                          required
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          className="block w-full border border-gray-200 rounded-lg text-sm px-3 py-2 bg-white focus:outline-none"
                          placeholder="Share your experience regarding freshness, packing, taste..."
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-srd-gold hover:bg-srd-orange text-srd-maroon hover:text-white py-2.5 rounded-lg font-bold text-xs uppercase shadow-sm transition-colors"
                      >
                        Submit Review
                      </button>
                    </form>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
