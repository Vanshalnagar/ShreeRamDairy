import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { fetchProducts } from '../store/slices/productsSlice';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { products, categories, loading } = useSelector((state) => state.products);

  // Parse query parameters
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || '';
  const initialSearch = queryParams.get('search') || '';

  // Local filter states
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [sort, setSort] = useState('name-asc');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rating, setRating] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    setCategory(queryParams.get('category') || '');
    setSearch(queryParams.get('search') || '');
  }, [location.search]);

  // Trigger dispatch when filters change
  useEffect(() => {
    dispatch(fetchProducts({
      category,
      search,
      sort,
      minPrice,
      maxPrice,
      rating
    }));
  }, [dispatch, category, search, sort, minPrice, maxPrice, rating]);

  const handleCategorySelect = (slug) => {
    const newSlug = category === slug ? '' : slug;
    setCategory(newSlug);
    
    // Update URL query params
    const params = new URLSearchParams(location.search);
    if (newSlug) {
      params.set('category', newSlug);
    } else {
      params.delete('category');
    }
    navigate({ search: params.toString() });
  };

  const handleResetFilters = () => {
    setCategory('');
    setSearch('');
    setSort('name-asc');
    setMinPrice('');
    setMaxPrice('');
    setRating('');
    navigate({ search: '' });
  };

  return (
    <div className="w-full min-h-screen bg-srd-cream py-8 px-4 md:px-12 font-body">
      <div className="max-w-7xl mx-auto">
        {/* Page title banner */}
        <div className="text-center mb-8">
          <h2 className="font-title font-bold text-3xl md:text-4xl text-srd-maroon">Our Fresh Menu</h2>
          <p className="text-sm text-gray-500 mt-2">Prepared in Pure Desi Ghee & Fresh Milk Daily</p>
          <div className="w-16 h-0.5 bg-srd-gold mx-auto mt-3"></div>
        </div>

        {/* Filter controls and layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
          
          {/* FILTER SIDEBAR (DESKTOP) */}
          <div className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-2xl border border-srd-gold/15 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h4 className="font-title font-bold text-lg text-srd-maroon flex items-center gap-2">
                <Filter size={18} /> Filters
              </h4>
              <button 
                onClick={handleResetFilters}
                className="text-xs text-srd-orange hover:text-srd-maroon font-bold flex items-center gap-1"
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            {/* Search */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Search Product</label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g. Kaju Katli..."
                  className="w-full border border-gray-200 rounded-lg pl-3 pr-9 py-2 text-sm focus:outline-none focus:border-srd-gold"
                />
                <Search size={16} className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Categories</label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`w-full text-left text-sm px-2.5 py-1.5 rounded-md transition-all font-medium ${
                      category === cat.slug
                        ? 'bg-srd-gold/15 text-srd-maroon font-bold border-l-4 border-srd-gold pl-2'
                        : 'hover:bg-srd-cream/30 text-gray-700'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Price (₹)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-srd-gold"
                />
                <span className="text-gray-400 text-xs">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-srd-gold"
                />
              </div>
            </div>

            {/* Ratings Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Rating</label>
              <div className="space-y-1.5">
                {[4, 3, 2].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setRating(rating === stars ? '' : stars)}
                    className={`w-full text-left text-sm px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                      rating === stars
                        ? 'bg-srd-gold/15 text-srd-maroon font-bold'
                        : 'hover:bg-srd-cream/30 text-gray-700'
                    }`}
                  >
                    <span className="text-yellow-500 font-bold">★ {stars}+ Stars</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MAIN PRODUCT GRID COLUMN */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Top Bar Sort & Mobile Filter Toggle */}
            <div className="bg-white px-5 py-4 rounded-2xl border border-srd-gold/10 shadow-sm flex items-center justify-between flex-wrap gap-4">
              <span className="text-sm font-semibold text-gray-600">
                Found <strong className="text-srd-maroon">{products.length}</strong> items
              </span>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Toggle Button */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden flex items-center gap-1 text-sm bg-srd-gold text-srd-maroon px-4 py-2 rounded-full font-bold shadow-sm"
                >
                  <SlidersHorizontal size={14} /> Filter
                </button>

                {/* Sort selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-bold uppercase">Sort By</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="border border-gray-200 rounded-lg text-sm px-3 py-1.5 focus:outline-none focus:border-srd-gold bg-transparent font-medium"
                  >
                    <option value="name-asc">Alphabetical (A-Z)</option>
                    <option value="name-desc">Alphabetical (Z-A)</option>
                    <option value="price-asc">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                    <option value="rating-desc">Customer Rating</option>
                  </select>
                </div>
              </div>
            </div>

            {/* MOBILE FILTER MODAL */}
            {showMobileFilters && (
              <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
                <div className="w-80 max-w-full bg-white h-full p-6 flex flex-col justify-between overflow-y-auto animate-slide-in">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                      <h4 className="font-title font-bold text-lg text-srd-maroon">Filters</h4>
                      <button 
                        onClick={() => setShowMobileFilters(false)}
                        className="text-sm text-gray-500 font-bold"
                      >
                        Close
                      </button>
                    </div>

                    {/* Mobile Search */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Search Product</label>
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-srd-gold"
                      />
                    </div>

                    {/* Mobile Categories */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Categories</label>
                      <div className="space-y-1 max-h-40 overflow-y-auto border p-2.5 rounded-lg">
                        {categories.map((cat) => (
                          <button
                            key={cat._id}
                            onClick={() => handleCategorySelect(cat.slug)}
                            className={`w-full text-left text-sm py-1.5 px-2 rounded-md ${
                              category === cat.slug ? 'bg-srd-gold text-srd-maroon font-bold' : ''
                            }`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Mobile Price */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">Price (₹)</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          placeholder="Min"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-srd-gold"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-srd-gold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t mt-6 flex gap-3">
                    <button
                      onClick={handleResetFilters}
                      className="w-full py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-600"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="w-full py-2.5 bg-srd-gold text-srd-maroon rounded-lg text-sm font-bold"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Product Cards Grid */}
            {loading ? (
              <div className="text-center py-24 text-gray-500 font-medium bg-white rounded-2xl border border-gray-100 shadow-sm">
                Fetching fresh sweets from our kitchen...
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 text-gray-400 font-medium bg-white rounded-2xl border border-gray-100 shadow-sm">
                No products found matching the selected filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
