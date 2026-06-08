import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, Heart, ShoppingBag, User, LogOut, Shield, MapPin, ChevronDown, Menu, X } from 'lucide-react';
import { logoutUser } from '../store/slices/authSlice';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.auth);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdown, setUserDropdown] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);

  const totalCartQty = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const shopAllCategories = [
    { name: 'Sweets', path: '/products?category=traditional-sweets' },
    { name: 'Namkeen', path: '/products?category=farsan' },
    { name: 'Desi Ghee', path: '/products?category=dairy-products' },
    { name: 'Cakes', path: '/products?category=fancy-mawa-sweets' },
    { name: 'Fafda Jalebi', path: '/products?category=farsan' },
    { name: 'Dry Fruits', path: '/products?category=kaju-special' },
    { name: 'Syrup', path: '/products?category=halwa' },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-sm w-full bg-srd-cream font-body border-b border-srd-gold/10">
      {/* Main Navbar */}
      <div className="flex justify-between items-center py-3 px-4 md:px-12 max-w-7xl mx-auto">
        {/* Left: Branding Logo (Image Logo) */}
        <Link to="/" className="flex items-center gap-3 group shrink-0 animate-fadeIn">
          <img 
            src="/logo.png" 
            alt="ShriRam Dairy Logo" 
            className="h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-300" 
          />
        </Link>


        {/* Center: Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-srd-dark font-semibold text-sm">
          {/* Shop All Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setShopDropdown(true)}
            onMouseLeave={() => setShopDropdown(false)}
          >
            <button 
              className="flex items-center gap-1 hover:text-srd-maroon transition-colors py-2"
              onClick={() => navigate('/products')}
            >
              Shop All
              <ChevronDown size={14} className={`transition-transform duration-300 ${shopDropdown ? 'rotate-180' : ''}`} />
            </button>
            {shopDropdown && (
              <div className="absolute left-0 w-48 bg-white border border-srd-gold/20 shadow-lg rounded-xl py-2 z-50 animate-fadeIn">
                {shopAllCategories.map((cat, idx) => (
                  <Link 
                    key={idx}
                    to={cat.path} 
                    className="block px-4 py-2 hover:bg-srd-cream hover:text-srd-maroon text-srd-dark transition-colors font-medium text-sm"
                    onClick={() => setShopDropdown(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/about" className="hover:text-srd-maroon transition-colors py-2">About Us</Link>
          <Link to="/contact" className="hover:text-srd-maroon transition-colors py-2">Contact Us</Link>
          <Link to="/products" className="hover:text-srd-maroon transition-colors py-2">Our Outlets</Link>

          
          {/* Highlighted CTA: Local Orders */}
          <Link to="/products" className="bg-srd-maroon hover:bg-srd-crimson text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full shadow-md transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-1.5 ml-2">
            <MapPin size={14} />
            Local Orders
          </Link>
        </nav>

        {/* Right: Actions Icons */}
        <div className="flex items-center gap-2 md:gap-4 text-srd-dark shrink-0">
          {/* Search Toggle */}
          <button 
            onClick={() => setSearchOpen(!searchOpen)} 
            className="hover:text-srd-maroon transition-colors p-2 rounded-full hover:bg-srd-gold/10"
            title="Search products"
          >
            <Search size={20} />
          </button>

          {/* User Account Menu */}
          <div className="relative">
            <button 
              onClick={() => setUserDropdown(!userDropdown)} 
              className="hover:text-srd-maroon transition-colors p-2 rounded-full hover:bg-srd-gold/10 flex items-center justify-center"
            >
              {user && user.profilePic ? (
                <img src={user.profilePic} alt={user.name} className="w-6 h-6 rounded-full border border-srd-gold" />
              ) : (
                <User size={20} />
              )}
            </button>

            {userDropdown && (
              <div 
                className="absolute right-0 mt-3 w-52 bg-white rounded-xl shadow-xl py-2 border border-srd-gold/20 z-50"
                onMouseLeave={() => setUserDropdown(false)}
              >
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold text-srd-maroon truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    
                    {user.role === 'admin' ? (
                      <Link to="/admin" className="flex items-center gap-2 px-4 py-2 hover:bg-srd-cream text-srd-dark font-medium transition-colors">
                        <Shield size={16} className="text-srd-gold" /> Admin Console
                      </Link>
                    ) : (
                      <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 hover:bg-srd-cream text-srd-dark transition-colors">
                        <User size={16} /> My Dashboard
                      </Link>
                    )}
                    
                    <button 
                      onClick={handleLogout} 
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 border-t border-gray-100 transition-colors text-left"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-2 hover:bg-srd-cream text-srd-dark transition-colors font-medium">Login</Link>
                    <Link to="/register" className="block px-4 py-2 hover:bg-srd-cream text-srd-dark transition-colors">Register</Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Wishlist Link */}
          <Link to="/dashboard?tab=wishlist" className="hover:text-srd-maroon transition-colors p-2 rounded-full hover:bg-srd-gold/10 relative" title="Wishlist">
            <Heart size={20} />
            {wishlist && wishlist.length > 0 && (
              <span className="absolute top-0 right-0 bg-srd-crimson text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-srd-cream">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Link */}
          <Link to="/cart" className="hover:text-srd-maroon transition-colors p-2 rounded-full hover:bg-srd-gold/10 relative" title="Cart">
            <ShoppingBag size={20} />
            {totalCartQty > 0 && (
              <span className="absolute top-0 right-0 bg-srd-gold text-srd-maroon text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-srd-cream">
                {totalCartQty}
              </span>
            )}
          </Link>

          {/* Mobile Hamburguer Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden hover:text-srd-maroon transition-colors p-2 rounded-full hover:bg-srd-gold/10"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Floating Global Search Bar */}
      {searchOpen && (
        <div className="bg-white border-b border-srd-gold/20 py-4 px-6 md:px-12 flex justify-center items-center absolute w-full left-0 z-50 shadow-md">
          <form onSubmit={handleSearchSubmit} className="flex w-full max-w-lg items-center relative">
            <input 
              type="text" 
              placeholder="Search dairy sweets, namkeen, cookies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-2 border-srd-gold/30 rounded-full px-5 py-2.5 outline-none focus:border-srd-maroon bg-srd-cream/50 transition-colors pr-12 text-srd-dark text-sm"
              autoFocus
            />
            <button type="submit" className="absolute right-4 text-srd-maroon hover:text-srd-crimson transition-colors">
              <Search size={18} />
            </button>
          </form>
          <button 
            onClick={() => setSearchOpen(false)} 
            className="ml-4 text-2xl font-bold text-gray-400 hover:text-srd-maroon transition-colors"
          >
            &times;
          </button>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-srd-gold/15 bg-srd-cream px-4 py-4 space-y-3 font-semibold text-srd-dark animate-slideDown">
          {/* Collapsible Shop All */}
          <div>
            <button 
              onClick={() => setMobileShopOpen(!mobileShopOpen)}
              className="flex justify-between items-center w-full py-2 hover:text-srd-maroon"
            >
              <span>Shop All</span>
              <ChevronDown size={16} className={`transition-transform duration-300 ${mobileShopOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileShopOpen && (
              <div className="pl-4 mt-1 border-l-2 border-srd-gold/20 space-y-2 py-1 font-medium text-sm">
                {shopAllCategories.map((cat, idx) => (
                  <Link 
                    key={idx}
                    to={cat.path} 
                    className="block py-1.5 hover:text-srd-maroon transition-colors"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileShopOpen(false);
                    }}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-srd-maroon transition-colors">About Us</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-srd-maroon transition-colors">Contact Us</Link>
          <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-srd-maroon transition-colors">Our Outlets</Link>

          
          <Link 
            to="/products" 
            onClick={() => setMobileMenuOpen(false)}
            className="w-full bg-srd-maroon hover:bg-srd-crimson text-white text-center font-bold uppercase tracking-wider py-2.5 rounded-full shadow-md flex items-center justify-center gap-1.5"
          >
            <MapPin size={16} />
            Local Orders
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
