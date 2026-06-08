import React from 'react';
import { useSelector } from 'react-redux';
import CategoryCard from '../components/CategoryCard';

const Categories = () => {
  const { categories, loading } = useSelector((state) => state.products);

  return (
    <div className="w-full min-h-screen bg-srd-cream py-12 px-6 md:px-12 font-body">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-title italic text-srd-orange text-lg block mb-1">Authentic Sweet & Dairy Ranges</span>
          <h2 className="font-title font-bold text-3xl md:text-5xl text-srd-maroon">Browse By Category</h2>
          <div className="w-24 h-1 bg-srd-gold mx-auto mt-4 rounded-full"></div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">Loading our traditional sweet categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-gray-400 font-medium">No categories available at this moment.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 mt-8">
            {categories.map((cat) => (
              <CategoryCard key={cat._id} category={cat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
