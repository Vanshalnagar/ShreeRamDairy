import React from 'react';
import { Award, Compass, Heart, ShieldCheck } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-6xl mx-auto py-16 px-6 md:px-12 font-body text-srd-dark">
      <div className="text-center mb-16">
        <span className="text-srd-maroon font-semibold text-sm tracking-widest uppercase">Our Heritage</span>
        <h2 className="text-4xl md:text-5xl font-title font-bold text-srd-maroon mt-2 mb-4">ShriRam Dairy Story</h2>
        <p className="max-w-xl mx-auto text-gray-500">Bringing the purest dairy and traditional sweet recipes of India to your family since decades.</p>
        <div className="w-16 h-1 bg-srd-gold mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Grid: Story details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h3 className="text-2xl md:text-3xl font-title font-bold text-srd-maroon mb-6">From a Humble Dairy Booth to Gujarat's Pride</h3>
          <p className="leading-relaxed mb-4 opacity-90 text-sm">
            ShriRam Dairy started with a small dairy counter dedicated to providing fresh, unadulterated milk and churned buttermilk to local households. Our founders believed that pure milk is the foundation of family health.
          </p>
          <p className="leading-relaxed mb-6 opacity-90 text-sm">
            Over the years, as local families requested traditional sweets for festivals, we began cooking classic delicacies: Kesar Mohanthal, Kopra Pak, and Kesar Elaichi Shrikhand. We stayed true to one core rule: **Zero compromise on raw materials**. We cooked exclusively in 100% pure desi ghee churned in our own booths.
          </p>
          <div className="bg-[#faf3e0] p-6 rounded-2xl border-l-4 border-srd-gold">
            <p className="italic font-medium text-srd-maroon text-sm">
              "We don't just sell sweets; we offer standard sweets (mithai) that double as holy offerings (prasad) for your daily prayers and family celebrations."
            </p>
          </div>
          <div className="mt-6 border-t border-srd-gold/15 pt-6">
            <h4 className="font-title font-bold text-lg text-srd-maroon">Mahesh Nagar</h4>
            <p className="text-xs text-srd-gold font-bold uppercase tracking-wider">Owner & Founder</p>
            <p className="text-xs text-gray-500 mt-2">
              Under the leadership of Mahesh Nagar, ShriRam Dairy has grown to serve the community of Isanpur, Ahmedabad, with premium sweets and snacks, while maintaining traditional Gujarati recipes and high standards of cleanliness.
            </p>
          </div>

        </div>
        <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden border-4 border-srd-gold shadow-md">
          <img 
            src="https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800" 
            alt="Cow milking and dairy" 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>

      {/* Grid: Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-srd-gold/15 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-srd-gold/10 flex items-center justify-center text-srd-maroon mb-4">
            <Heart size={24} />
          </div>
          <h5 className="font-title font-bold text-lg text-srd-maroon mb-2">Made with Love</h5>
          <p className="text-sm text-gray-500">Every batch of peda, halwa, and farsan is hand-monitored by our master halwais using time-tested recipes.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-srd-gold/15 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-srd-gold/10 flex items-center justify-center text-srd-maroon mb-4">
            <Compass size={24} />
          </div>
          <h5 className="font-title font-bold text-lg text-srd-maroon mb-2">Gujarati Heritage</h5>
          <p className="text-sm text-gray-500">Bringing the authentic spices of Bhavnagar and Rajkot straight to your snack bowl with crisp gathiyas and chevdo.</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-srd-gold/15 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-srd-gold/10 flex items-center justify-center text-srd-maroon mb-4">
            <ShieldCheck size={24} />
          </div>
          <h5 className="font-title font-bold text-lg text-srd-maroon mb-2">Unmatched Purity</h5>
          <p className="text-sm text-gray-500">Tested and validated by labs, our dairy items represent the highest quality standards in Western India.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
