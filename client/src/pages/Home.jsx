import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight, ShieldCheck, Heart, Sparkles, Award, Star, MessageSquare, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

import { fetchProducts } from '../store/slices/productsSlice';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { products, loading } = useSelector((state) => state.products);
  const [activeTab, setActiveTab] = useState('Sweets');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Filter products for the "Timeless Treats" / Bestsellers based on category
  const sweetsProducts = products.filter(p => {
    if (!p.category) return false;
    const catName = p.category.name.toLowerCase();
    return ['peda', 'barfi', 'kaju special', 'traditional sweets', 'fruit sweets', 'halwa'].includes(catName);
  }).slice(0, 4);

  const dairyProducts = products.filter(p => {
    if (!p.category) return false;
    const catName = p.category.name.toLowerCase();
    return ['dairy products', 'shrikhand', 'basundi'].includes(catName);
  }).slice(0, 4);

  const snacksProducts = products.filter(p => {
    if (!p.category) return false;
    const catName = p.category.name.toLowerCase();
    return ['chevdo', 'sev', 'kachori', 'farsan', 'gathiya', 'chavanu'].includes(catName);
  }).slice(0, 4);

  const getActiveProducts = () => {
    if (activeTab === 'Sweets') return sweetsProducts;
    if (activeTab === 'Dairy') return dairyProducts;
    return snacksProducts;
  };

  return (
    <div className="w-full min-h-screen bg-srd-cream luxury-gold-pattern overflow-x-hidden font-body text-srd-dark relative">
      
      {/* Floating Help/WhatsApp Support Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <a 
          href="https://wa.me/917573978055" 
          target="_blank" 

          rel="noreferrer" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-300 relative group"
        >
          {/* Pulse effect */}
          <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping group-hover:hidden"></span>
          <MessageSquare size={24} className="relative z-10" />
          {/* Tooltip */}
          <span className="absolute right-14 bg-srd-maroon text-white text-[11px] font-bold py-1.5 px-3 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border border-srd-gold/20">
            Order via WhatsApp
          </span>
        </a>
      </div>

      {/* SECTION 1: Hero Banner Section with Scalloped Bottom */}
      <section className="relative bg-srd-crimson text-white py-16 md:py-24 px-6 md:px-12 overflow-hidden min-h-[500px] flex items-center">
        {/* Hanging marigold garland */}
        <div className="marigold-garland absolute top-0 left-0 right-0 z-30 pointer-events-none opacity-90"></div>

        {/* Doodle pattern overlay */}
        <div className="absolute inset-0 doodle-pattern-overlay pointer-events-none"></div>

        {/* Falling marigold petals absolute elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          <div className="absolute left-[10%] top-[-20px] w-3 h-4.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-br-full rounded-tl-full opacity-0 animate-petal-1"></div>
          <div className="absolute left-[32%] top-[-20px] w-2.5 h-3.5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-br-full rounded-tl-full opacity-0 animate-petal-2"></div>
          <div className="absolute left-[52%] top-[-20px] w-3.5 h-5 bg-gradient-to-br from-orange-500 to-red-500 rounded-br-full rounded-tl-full opacity-0 animate-petal-3"></div>
          <div className="absolute left-[78%] top-[-20px] w-2.5 h-3 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-br-full rounded-tl-full opacity-0 animate-petal-4"></div>
          <div className="absolute left-[92%] top-[-20px] w-3 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-br-full rounded-tl-full opacity-0 animate-petal-5"></div>
        </div>
        
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-12 relative z-10">
          {/* Left Hero Content */}
          <div className="text-left space-y-6 max-w-xl">
            <motion.span 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-srd-gold font-script text-2xl md:text-3xl font-bold tracking-wide block"
            >
              Celebrate Every Moment with Authentic Indian Mithai
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="font-body font-extrabold text-4xl md:text-5xl lg:text-6xl text-white leading-tight drop-shadow-md"
            >
              Savor The Sweetness <br /> Of Tradition
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              className="text-sm md:text-base font-light text-white/95 leading-relaxed max-w-lg"
            >
              Handcrafted with pure love and premium ingredients. ShriRam Dairy blends the classic, rich taste of vintage Indian confectionery with modern hygienic curation.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-4"
            >
              <Link 
                to="/products"
                className="inline-block bg-white text-srd-maroon hover:bg-srd-cream font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 text-sm uppercase tracking-wider"
              >
                Shop Now
              </Link>
            </motion.div>
          </div>

          {/* Right Hero Content: Scattered Food Photography */}
          <div className="relative w-full h-[320px] md:h-[420px] flex items-center justify-center">
            {/* Glowing background blur */}
            <div className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full bg-srd-logo-bg/40 blur-3xl"></div>

            {/* 1. Halwa in a bowl (center main item) */}
            <div className="absolute z-20 w-40 h-40 md:w-52 md:h-52 rounded-full border-4 border-srd-gold overflow-hidden shadow-2xl animate-[bounce_6s_infinite] transition-transform hover:scale-105 duration-300">
              <img 
                src="/images/homepage/moong_dal_halwa.jpg" 
                alt="Halwa in a bowl" 
                className="w-full h-full object-cover" 
              />

              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-srd-maroon/90 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap">
                Moong Dal Halwa
              </div>
            </div>

            {/* 2. Sev/Bhujia (top left) */}
            <div className="absolute z-10 -top-2 left-4 md:left-12 w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-srd-gold/80 overflow-hidden shadow-xl animate-[bounce_4s_infinite] transition-transform hover:scale-105 duration-300">
              <img 
                src="/images/homepage/ratlami_sev.jpg" 
                alt="Sev Bhujia" 
                className="w-full h-full object-cover" 
              />

              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-srd-maroon/90 text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap">
                Crispy Sev
              </div>
            </div>

            {/* 3. Mathri (bottom left) */}
            <div className="absolute z-10 -bottom-2 left-6 md:left-14 w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-srd-gold/80 overflow-hidden shadow-xl animate-[bounce_5s_infinite_1s] transition-transform hover:scale-105 duration-300">
              <img 
                src="/images/homepage/mathri.jpg" 
                alt="Mathri" 
                className="w-full h-full object-cover" 
              />

              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-srd-maroon/90 text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap">
                Mathri
              </div>
            </div>

            {/* 4. Chakli (top right) */}
            <div className="absolute z-10 top-4 right-4 md:right-12 w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-srd-gold/80 overflow-hidden shadow-xl animate-[bounce_4.5s_infinite_1.5s] transition-transform hover:scale-105 duration-300">
              <img 
                src="/images/homepage/chakli.jpg" 
                alt="Chakli" 
                className="w-full h-full object-cover" 
              />

              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-srd-maroon/90 text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap">
                Chakli
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Scalloped White Edge */}
        <div className="scalloped-edge"></div>
      </section>

      {/* SECTION 2: "MAKING TRADITIONS TRENDY" SECTION */}
      <section className="bg-white py-10 border-b border-srd-gold/10">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-center gap-4">
          <span className="hidden md:block h-[1px] flex-grow bg-gradient-to-r from-transparent to-srd-gold/60"></span>
          <span className="font-script text-3xl md:text-5xl text-srd-gold font-bold italic tracking-wide text-center">
            "Making traditions trendy."
          </span>
          <span className="hidden md:block h-[1px] flex-grow bg-gradient-to-l from-transparent to-srd-gold/60"></span>
        </div>
      </section>

      {/* SECTION 3: "SHOP BY RANGE" SECTION */}
      <section className="bg-white py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="font-title font-extrabold text-3xl md:text-4xl text-srd-dark">
            Shop By Range
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Each piece reflects quality and authentic flavors.
          </p>
          <div className="w-16 h-0.5 bg-srd-gold mx-auto mt-4"></div>
        </div>

        {/* 4 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {/* Card 1: SWEETS (Green Background) */}
          <Link 
            to="/products?category=traditional-sweets" 
            className="group relative overflow-hidden rounded-2xl h-72 bg-gradient-to-br from-emerald-500 to-teal-700 p-6 flex flex-col justify-between shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
          >
            {/* Shine overlay */}
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out z-10 pointer-events-none"></div>

            {/* White gold-bordered rectangular badge */}
            <div className="self-center bg-white px-4 py-1.5 border border-srd-gold rounded shadow-sm text-xs font-bold text-srd-gold tracking-[2px] flex items-center gap-1.5 uppercase select-none z-10">
              <span>◆</span> SWEETS <span>◆</span>
            </div>
            {/* Scattered packaging/product images */}
            <div className="absolute -bottom-4 -right-4 w-36 h-36 rotate-12 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105 z-0">
              <img src="/images/products/gulab_jamun.png" alt="Gulab Jamun" className="w-full h-full object-contain drop-shadow-xl" />
            </div>
            <div className="absolute -bottom-8 -left-4 w-32 h-32 -rotate-12 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105 z-0">
              <img src="/images/products/kesar_peda.png" alt="Kesar Peda" className="w-full h-full object-contain drop-shadow-xl" />
            </div>
          </Link>

          {/* Card 2: NAMKEEN (Pink Background) */}
          <Link 
            to="/products?category=farsan" 
            className="group relative overflow-hidden rounded-2xl h-72 bg-gradient-to-br from-pink-500 to-rose-600 p-6 flex flex-col justify-between shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
          >
            {/* Shine overlay */}
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out z-10 pointer-events-none"></div>

            {/* White gold-bordered rectangular badge */}
            <div className="self-center bg-white px-4 py-1.5 border border-srd-gold rounded shadow-sm text-xs font-bold text-srd-gold tracking-[2px] flex items-center gap-1.5 uppercase select-none z-10">
              <span>◆</span> NAMKEEN <span>◆</span>
            </div>
            {/* Scattered packaging/product images */}
            <div className="absolute -bottom-4 -right-4 w-40 h-40 rotate-6 transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-105 z-0">
              <img 
                src="/images/homepage/namkeen_mix.jpg" 
                alt="Namkeen Sev" 
                className="w-full h-full object-cover rounded-2xl border border-white/40 shadow-xl" 
              />
            </div>
            <div className="absolute bottom-2 left-2 w-24 h-24 -rotate-12 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105 z-0 opacity-80">
              <img 
                src="/images/homepage/ratlami_sev.jpg" 
                alt="Crunchy mathri" 
                className="w-full h-full object-cover rounded-full border border-white/50 shadow-md" 
              />
            </div>

          </Link>

          {/* Card 3: CAKES (Purple Background) */}
          <Link 
            to="/products?category=fancy-mawa-sweets" 
            className="group relative overflow-hidden rounded-2xl h-72 bg-gradient-to-br from-purple-500 to-indigo-600 p-6 flex flex-col justify-between shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border border-srd-gold/20"
          >
            {/* Shine overlay */}
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out z-10 pointer-events-none"></div>

            {/* White gold-bordered rectangular badge */}
            <div className="self-center bg-white px-4 py-1.5 border border-srd-gold rounded shadow-sm text-xs font-bold text-srd-gold tracking-[2px] flex items-center gap-1.5 uppercase select-none z-10">
              <span>◆</span> CAKES <span>◆</span>
            </div>
            {/* Scattered packaging/product images */}
            <div className="absolute -bottom-4 -right-4 w-40 h-40 rotate-6 transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-105 z-0">
              <img 
                src="/images/homepage/cake.jpg" 
                alt="Delicious Cakes" 
                className="w-full h-full object-cover rounded-2xl border border-white/40 shadow-xl" 
              />
            </div>
          </Link>

          {/* Card 4: FAFDA JALEBI (Teal Background) */}
          <Link 
            to="/products?category=farsan" 
            className="group relative overflow-hidden rounded-2xl h-72 bg-gradient-to-br from-cyan-500 to-teal-600 p-6 flex flex-col justify-between shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 border border-srd-gold/20"
          >
            {/* Shine overlay */}
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out z-10 pointer-events-none"></div>

            {/* White gold-bordered rectangular badge */}
            <div className="self-center bg-white px-4 py-1.5 border border-srd-gold rounded shadow-sm text-xs font-bold text-srd-gold tracking-[2px] flex items-center gap-1.5 uppercase select-none z-10">
              <span>◆</span> FAFDA JALEBI <span>◆</span>
            </div>
            {/* Scattered packaging/product images */}
            <div className="absolute -bottom-4 -right-4 w-40 h-40 rotate-6 transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-105 z-0">
              <img 
                src="/images/homepage/fafda_jalebi.jpg" 
                alt="Crispy Fafda Jalebi" 
                className="w-full h-full object-cover rounded-2xl border border-white/40 shadow-xl" 
              />
            </div>
          </Link>
        </div>
      </section>

      {/* SECTION 4: "TIMELESS TREATS" SECTION (below fold) */}
      <section className="relative py-16 px-6 md:px-12 diamond-tile-pattern border-y border-srd-gold/15">
        {/* Hanging marigold garland */}
        <div className="marigold-garland absolute top-0 left-0 right-0 z-30 pointer-events-none opacity-90"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h3 className="font-script text-4xl md:text-5xl font-bold text-srd-maroon drop-shadow-sm">
              Timeless Treats
            </h3>
            <p className="text-sm text-srd-maroon/80 mt-2 font-medium">
              Hand-rolled barfis, spongy rasgullas, and ghee-dripping laddus prepared with heirloom recipes.
            </p>
            <div className="w-16 h-0.5 bg-srd-maroon mx-auto mt-4"></div>
          </div>

          {/* Sweet Showcase Food Photography Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Sweet 1: Rasmalai */}
            <div className="bg-white p-5 rounded-2xl border border-srd-gold/20 shadow-lg hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1.5 transition-all duration-500 text-center flex flex-col items-center">
              <div className="w-36 h-36 rounded-full border-4 border-srd-gold/30 p-1 bg-srd-cream overflow-hidden mb-4 shadow-inner">
                <img src="/images/products/rasmalai.png" alt="Rasmalai" className="w-full h-full object-cover rounded-full hover:scale-105 transition-transform duration-350" />
              </div>
              <h4 className="font-title font-bold text-lg text-srd-maroon">Royal Rasmalai</h4>
              <p className="text-xs text-gray-500 mt-1 mb-3 line-clamp-2">Saffron-infused milk cream topped with premium pistachios.</p>
              <Link to="/products?category=traditional-sweets" className="mt-auto text-xs font-bold text-srd-maroon hover:text-srd-gold border-b-2 border-srd-maroon hover:border-srd-gold pb-0.5 tracking-wider uppercase transition-colors">
                Shop Sweet
              </Link>
            </div>

            {/* Sweet 2: Kaju Katli */}
            <div className="bg-white p-5 rounded-2xl border border-srd-gold/20 shadow-lg hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1.5 transition-all duration-500 text-center flex flex-col items-center">
              <div className="w-36 h-36 rounded-full border-4 border-srd-gold/30 p-1 bg-srd-cream overflow-hidden mb-4 shadow-inner">
                <img src="/images/products/kaju_katli.png" alt="Kaju Katli" className="w-full h-full object-cover rounded-full hover:scale-105 transition-transform duration-350" />
              </div>
              <h4 className="font-title font-bold text-lg text-srd-maroon">Premium Kaju Katli</h4>
              <p className="text-xs text-gray-500 mt-1 mb-3 line-clamp-2">Exquisite thin cashew diamond slices covered with pure silver leaf.</p>
              <Link to="/products?category=kaju-special" className="mt-auto text-xs font-bold text-srd-maroon hover:text-srd-gold border-b-2 border-srd-maroon hover:border-srd-gold pb-0.5 tracking-wider uppercase transition-colors">
                Shop Sweet
              </Link>
            </div>

            {/* Sweet 3: Motichoor Laddu */}
            <div className="bg-white p-5 rounded-2xl border border-srd-gold/20 shadow-lg hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1.5 transition-all duration-500 text-center flex flex-col items-center">
              <div className="w-36 h-36 rounded-full border-4 border-srd-gold/30 p-1 bg-srd-cream overflow-hidden mb-4 shadow-inner">
                <img src="/images/products/motichoor_laddu.png" alt="Motichoor Laddu" className="w-full h-full object-cover rounded-full hover:scale-105 transition-transform duration-350" />
              </div>
              <h4 className="font-title font-bold text-lg text-srd-maroon">Desi Ghee Laddu</h4>
              <p className="text-xs text-gray-500 mt-1 mb-3 line-clamp-2">Tiny chickpea flour balls fried in pure ghee, bound in sweet syrup.</p>
              <Link to="/products?category=fruit-sweets" className="mt-auto text-xs font-bold text-srd-maroon hover:text-srd-gold border-b-2 border-srd-maroon hover:border-srd-gold pb-0.5 tracking-wider uppercase transition-colors">
                Shop Sweet
              </Link>
            </div>

            {/* Sweet 4: Rasgulla */}
            <div className="bg-white p-5 rounded-2xl border border-srd-gold/20 shadow-lg hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-1.5 transition-all duration-500 text-center flex flex-col items-center">
              <div className="w-36 h-36 rounded-full border-4 border-srd-gold/30 p-1 bg-srd-cream overflow-hidden mb-4 shadow-inner">
                <img src="/images/products/rasgulla.png" alt="Rasgulla" className="w-full h-full object-cover rounded-full hover:scale-105 transition-transform duration-350" />
              </div>
              <h4 className="font-title font-bold text-lg text-srd-maroon">Spongy Rasgulla</h4>
              <p className="text-xs text-gray-500 mt-1 mb-3 line-clamp-2">Soft, spongy cheese balls dipped in refreshing sugar syrup.</p>
              <Link to="/products?category=traditional-sweets" className="mt-auto text-xs font-bold text-srd-maroon hover:text-srd-gold border-b-2 border-srd-maroon hover:border-srd-gold pb-0.5 tracking-wider uppercase transition-colors">
                Shop Sweet
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: "OUR BESTSELLERS" GRID */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h3 className="font-title font-extrabold text-3xl md:text-4xl text-srd-maroon">
            Our Bestsellers
          </h3>
          <p className="text-sm text-gray-500 mt-2">Prepared Fresh Every Single Day</p>
          
          {/* Tabs Filter */}
          <div className="flex justify-center gap-3 mt-8 flex-wrap">
            {['Sweets', 'Dairy', 'Snacks'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-semibold px-6 py-2.5 rounded-full border text-xs tracking-wider transition-all duration-300 ${
                  activeTab === tab 
                    ? 'bg-srd-maroon border-srd-maroon text-white shadow-md' 
                    : 'bg-white border-gray-200 text-gray-600 hover:border-srd-maroon hover:text-srd-maroon'
                }`}
              >
                {tab === 'Sweets' ? 'MITHAI & DESSERTS' : tab === 'Dairy' ? 'DAIRY & SHRIKHAND' : 'NAMKEEN & MATHRI'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">Baking fresh sweets...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {getActiveProducts().map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 6: WHY CHOOSE US */}
      <section className="py-16 bg-[#FFF8EC]/60 border-t border-srd-gold/10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="font-title font-extrabold text-3xl md:text-4xl text-srd-maroon mb-12">Why Choose ShriRam Dairy?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-srd-gold/15 shadow-sm flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-srd-gold/10 flex items-center justify-center text-srd-maroon mb-4">
                <Sparkles size={28} />
              </div>
              <h5 className="font-title font-bold text-lg text-srd-maroon mb-2">Pure Ingredients</h5>
              <p className="text-xs text-gray-600 leading-relaxed font-body">100% pure desi ghee, premium handpicked dry fruits, and thick fresh cow & buffalo milk.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-srd-gold/15 shadow-sm flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-srd-gold/10 flex items-center justify-center text-srd-maroon mb-4">
                <Award size={28} />
              </div>
              <h5 className="font-title font-bold text-lg text-srd-maroon mb-2">Fresh Daily</h5>
              <p className="text-xs text-gray-600 leading-relaxed font-body">Meticulously prepared in our state-of-the-art kitchen everyday to maintain unmatched taste.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-srd-gold/15 shadow-sm flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-srd-gold/10 flex items-center justify-center text-srd-maroon mb-4">
                <ShieldCheck size={28} />
              </div>
              <h5 className="font-title font-bold text-lg text-srd-maroon mb-2">Hygienic Prep</h5>
              <p className="text-xs text-gray-600 leading-relaxed font-body">Strict sanitation checklists, temperature-controlled setups, and automated packaging.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-srd-gold/15 shadow-sm flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-srd-gold/10 flex items-center justify-center text-srd-maroon mb-4">
                <Heart size={28} />
              </div>
              <h5 className="font-title font-bold text-lg text-srd-maroon mb-2">Premium Quality</h5>
              <p className="text-xs text-gray-600 leading-relaxed font-body">Trusted by thousands of families for local and international sweet gift boxes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: Sweetest News & Reviews */}
      <section className="py-16 px-6 md:px-12 max-w-6xl mx-auto text-center">
        <h3 className="font-title font-extrabold text-3xl md:text-4xl text-srd-maroon mb-12">Sweetest News & Reviews</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-srd-gold/20 hover:border-srd-gold/50 hover:shadow-[0_8px_30px_rgb(201,162,39,0.08)] hover:scale-[1.01] transition-all duration-300 relative gold-bracket-frame">
            <div className="flex text-yellow-500 mb-4">
              <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
            </div>
            <p className="text-sm text-srd-dark italic mb-6 leading-relaxed">
              "Their Sitafal Basundi and Kesar Elaichi Shrikhand are outstanding! Tastes exactly like home, very fresh and delicious."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-srd-gold/25 flex items-center justify-center text-xs font-bold text-srd-maroon">DP</div>
              <div>
                <h6 className="font-bold text-xs text-srd-maroon">Dharmesh Patel</h6>
                <span className="text-[10px] text-gray-400">Verified Buyer, Anand</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-srd-gold/20 hover:border-srd-gold/50 hover:shadow-[0_8px_30px_rgb(201,162,39,0.08)] hover:scale-[1.01] transition-all duration-300 relative gold-bracket-frame">
            <div className="flex text-yellow-500 mb-4">
              <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
            </div>
            <p className="text-sm text-srd-dark italic mb-6 leading-relaxed">
              "We ordered 80 gift boxes of Kesar Mohanthal and Peda for our family wedding. The customized boxes looked highly premium, and the sweets were divine."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-srd-gold/25 flex items-center justify-center text-xs font-bold text-srd-maroon">KS</div>
              <div>
                <h6 className="font-bold text-xs text-srd-maroon">Kavita Sharma</h6>
                <span className="text-[10px] text-gray-400">Home Maker, Vadodara</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-srd-gold/20 hover:border-srd-gold/50 hover:shadow-[0_8px_30px_rgb(201,162,39,0.08)] hover:scale-[1.01] transition-all duration-300 relative gold-bracket-frame">
            <div className="flex text-yellow-500 mb-4">
              <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
            </div>
            <p className="text-sm text-srd-dark italic mb-6 leading-relaxed">
              "Very smooth online order flow and quick local delivery. The Kaju Katli was extremely soft and had the perfect balance of sugar."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-srd-gold/25 flex items-center justify-center text-xs font-bold text-srd-maroon">RD</div>
              <div>
                <h6 className="font-bold text-xs text-srd-maroon">Rajesh Desai</h6>
                <span className="text-[10px] text-gray-400">Merchant, Nadiad</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Hanging marigold garland above footer */}
      <div className="marigold-garland w-full opacity-90 pointer-events-none mt-8"></div>
    </div>
  );
};

export default Home;
