import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-srd-cream text-srd-dark border-t border-srd-gold/30 font-body">
      <div className="max-w-7xl mx-auto py-12 px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1: About */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="ShriRam Dairy Logo" 
              className="h-16 w-auto object-contain" 
            />
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            Delivering the authentic taste of Indian mithai since years. Prepared with 100% pure desi ghee, premium ingredients, and strict hygiene standards. ShriRam Dairy is your destination for traditional sweets and fresh dairy products.
          </p>
          <div className="flex gap-3 mt-2">
            <span className="w-8 h-8 rounded-full bg-srd-maroon/10 flex items-center justify-center text-srd-maroon text-sm cursor-pointer hover:bg-srd-maroon hover:text-white transition-all">🅵</span>
            <span className="w-8 h-8 rounded-full bg-srd-maroon/10 flex items-center justify-center text-srd-maroon text-sm cursor-pointer hover:bg-srd-maroon hover:text-white transition-all">🅸</span>
            <span className="w-8 h-8 rounded-full bg-srd-maroon/10 flex items-center justify-center text-srd-maroon text-sm cursor-pointer hover:bg-srd-maroon hover:text-white transition-all">🆈</span>
          </div>
        </div>

        {/* Col 2: Categories */}
        <div>
          <h4 className="font-title font-bold text-base text-srd-maroon mb-6 relative pb-2 border-b border-srd-gold/25 inline-block">
            Sweets & Snacks
          </h4>
          <ul className="flex flex-col gap-3 text-xs font-semibold text-gray-700">
            <li><Link to="/products?category=traditional-sweets" className="hover:text-srd-maroon transition-colors">Traditional Sweets</Link></li>
            <li><Link to="/products?category=farsan" className="hover:text-srd-maroon transition-colors">Namkeen & Gathiya</Link></li>
            <li><Link to="/products?category=dairy-products" className="hover:text-srd-maroon transition-colors">Pure Desi Ghee</Link></li>
            <li><Link to="/products?category=fancy-mawa-sweets" className="hover:text-srd-maroon transition-colors">Fancy Mawa Sweets</Link></li>
            <li><Link to="/products?category=kaju-special" className="hover:text-srd-maroon transition-colors">Kaju Specials</Link></li>
            <li><Link to="/products?category=shrikhand" className="hover:text-srd-maroon transition-colors">Fresh Shrikhand</Link></li>
          </ul>
        </div>

        {/* Col 3: Quick Links */}
        <div>
          <h4 className="font-title font-bold text-base text-srd-maroon mb-6 relative pb-2 border-b border-srd-gold/25 inline-block">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-3 text-xs font-semibold text-gray-700">
            <li><Link to="/" className="hover:text-srd-maroon transition-colors">Home Page</Link></li>
            <li><Link to="/products" className="hover:text-srd-maroon transition-colors">Full Sweet Menu</Link></li>
            <li><Link to="/about" className="hover:text-srd-maroon transition-colors">Our Story</Link></li>
            <li><Link to="/contact" className="hover:text-srd-maroon transition-colors">Contact Details</Link></li>
            <li><Link to="/products" className="hover:text-srd-maroon transition-colors">Our Outlets</Link></li>
            <li><Link to="/api-docs" target="_blank" className="hover:text-srd-maroon transition-colors text-srd-gold">API Specifications</Link></li>
          </ul>
        </div>

        {/* Col 4: Contact */}
        <div>
          <h4 className="font-title font-bold text-base text-srd-maroon mb-6 relative pb-2 border-b border-srd-gold/25 inline-block">
            Store Outlets
          </h4>
          <ul className="flex flex-col gap-4 text-xs font-semibold text-gray-700">
            <li className="flex gap-2 items-start">
              <MapPin size={16} className="text-srd-maroon shrink-0 mt-0.5" />
              <span>📍 9/A Kangana Society, Opp. Amit Park Society, Vishalnagar, Isanpur, Ahmedabad - 382443</span>
            </li>
            <li className="flex gap-2 items-center">
              <Phone size={16} className="text-srd-maroon shrink-0" />
              <span>📞 +91 75739 78055</span>
            </li>
            <li className="flex gap-2 items-center">
              <Mail size={16} className="text-srd-maroon shrink-0" />
              <span>✉️ maheshnagar@gmail.com</span>
            </li>
            <li className="flex gap-2 items-center">
              <Clock size={16} className="text-srd-maroon shrink-0" />
              <span>🕒 Open Daily: 07:00 AM - 10:30 PM</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-srd-gold/20 py-5 text-center text-[10px] text-gray-500 font-bold tracking-wider bg-white">
        <p>&copy; {new Date().getFullYear()} ShriRam Dairy. All Rights Reserved. | "Making traditions trendy"</p>
      </div>
    </footer>
  );
};

export default Footer;
